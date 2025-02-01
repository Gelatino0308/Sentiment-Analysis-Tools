from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import requests
import re
import time

app = Flask(__name__)
CORS(app)

COMMENTS_FILE = "comments.json"

APIFY_TOKEN = "apify_api_rZDd2EO4eXIGR3u4WjsBmYVstYo04a4D0rOH"
SCRAPER_ID = "us5srxAYnsrkgUv2v"
headers = {"Content-Type": "application/json"}

def load_comments():
    try:
        with open(COMMENTS_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def save_comments(comments):
    with open(COMMENTS_FILE, "w") as file:
        json.dump(comments, file, indent=4)

@app.route("/scrape", methods=["POST"])
def scrape():
    data = request.json
    fb_url = data.get("url")

    print(fb_url)

    apify_url = f"https://api.apify.com/v2/acts/{SCRAPER_ID}/runs?token={APIFY_TOKEN}"
    payload = {"startUrls": [{"url": fb_url}], "maxComments": 5}

    response = requests.post(apify_url, headers=headers, json=payload)
    if response.status_code == 201:
        run_data = response.json()
        run_id = run_data["data"]["id"]
        dataset_id = run_data["data"]["defaultDatasetId"]

        max_retries = 30  
        retry_count = 0
        
        while retry_count < max_retries:
            status_url = f"https://api.apify.com/v2/acts/{SCRAPER_ID}/runs/{run_id}?token={APIFY_TOKEN}"
            status_response = requests.get(status_url)
            
            if status_response.status_code == 200:
                status_data = status_response.json()
                status = status_data["data"]["status"]
                
                if status == "SUCCEEDED":
                    dataset_url = f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_TOKEN}"
                    result = requests.get(dataset_url).json()
                    
                    if result:
                        comments_to_save = [{
                            "text": item.get("text", ""),
                            "date": item.get("date", ""),
                            "profileName": item.get("profileName", ""),
                            "likesCount": item.get("likesCount", 0)
                        } for item in result]
                        
                        save_comments(comments_to_save)
                        return jsonify({"message": "Scraping complete!", "comments": result})
                    
                elif status in ["FAILED", "ABORTED", "TIMED-OUT"]:
                    return jsonify({"error": f"Scraping {status.lower()}!"}), 400
            
            retry_count += 1
            time.sleep(5)  
            
        return jsonify({"error": "Scraping timed out!"}), 408
    
    return jsonify({"error": "Failed to start scraping!"}), 400

@app.route("/get_comments", methods=["GET"])
def get_comments():
    return jsonify(load_comments())

@app.route("/label_comment", methods=["POST"])
def label_comment():
    data = request.json
    index, label = data["index"], data["label"]
    
    comments = load_comments()
    comments[index]["label"] = label
    save_comments(comments)
    
    return jsonify({"message": "Label updated!"})

@app.route("/analyze_sentiment", methods=["GET"])
def analyze_sentiment():
    lexicon = {"good": 1, "bad": -1, "neutral": 0}
    
    comments = load_comments()
    for comment in comments:
        words = re.findall(r"\b\w+\b", comment["text"].lower())
        score = sum(lexicon.get(word, 0) for word in words)
        comment["sentiment_score"] = score
        comment["sentiment"] = "pro" if score > 0 else "anti" if score < 0 else "neutral"
    
    save_comments(comments)
    return jsonify(comments)

if __name__ == "__main__":
    app.run(debug=True)
