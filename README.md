# Sentiment-Analysis-Tools

A web-based tool for scraping and analyzing Facebook comments with sentiment labeling capabilities. This tool streamlines the process of collecting and manually labeling social media data for sentiment analysis.

## Features

- **Automated Facebook Comment Scraping**
  - Simply paste a Facebook post URL
  - Automatically extracts comments, dates, and engagement metrics
  - Stores data in structured JSON format

- **Interactive Labeling Interface**
  - Clean, user-friendly GUI for manual sentiment labeling
  - Three-way classification: Pro/Anti/Neutral
  - Visual color coding for different sentiment labels
  - Real-time label updates

## Setup

1. Install Python dependencies by double clicking run.bat which automates installation.

2. Start the application:
    ```bash
    python sentimentAnalyzer.py
    ```

3. Open `index.html` in your browser

## How to Use

1. **Scraping Comments**
   - Enter a Facebook post URL in the input field
   - Click "Scrape Comments" to fetch the data
   - Comments will automatically load in the interface

2. **Labeling Data**
   - Each comment has three labeling options: Pro/Anti/Neutral
   - Click the corresponding button to assign a sentiment
   - Labels are automatically saved and color-coded
   - Changes are saved to `comments.json`.

## Technical Details

- Backend: Python Flask server with CORS support
- Frontend: HTML/CSS/JavaScript
- Data Storage: JSON file system
- API Integration: Apify Facebook Comment Scraper Service

## Files

- `sentimentAnalyzer.py`: Flask backend server
- `index.html`: Main web interface
- `script.js`: Frontend functionality
- `styles.css`: UI styling
- `comments.json`: Data storage
- `requirements.txt`: Python dependencies
- `run.bat`: Batch script to install dependencies

## Requirements

- Python 
- Modern web browser
- Internet connection for API Connection