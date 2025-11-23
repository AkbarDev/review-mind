# ReviewMind - Agentic Product Review Analysis

ReviewMind is an intelligent, agentic web application that automates the analysis of product reviews. Powered by Google's Gemini 1.5 Flash model, it instantly extracts sentiment scores, key strengths, weaknesses, and strategic recommendations from raw customer feedback.

## Features

-   **Agentic Analysis**: Uses an LLM agent to "read" and understand reviews like a human analyst.
-   **Instant Insights**: Generates a dashboard with Sentiment Score, Strengths, Weaknesses, and Recommendations.
-   **Client-Side Secure**: Runs entirely in the browser. Your API key is stored locally in your browser (LocalStorage) and never sent to our servers.
-   **Responsive Design**: Beautiful, dark-mode UI that works on desktop and mobile.

## Setup & Usage

1.  **Open the App**: Open `index.html` in your browser.
2.  **Configure API Key**:
    *   Click the **Settings** (Gear icon) in the top right.
    *   Enter your [Google Gemini API Key](https://aistudio.google.com/app/apikey).
    *   Click **Save**.
3.  **Analyze**:
    *   Paste product reviews into the text area.
    *   Click **Analyze Reviews**.
    *   View the generated insights below.

## Deployment to GitHub Pages

This application is designed to be deployed instantly to GitHub Pages.

### Steps:

1.  **Create a Repository**:
    *   Go to [GitHub.com/new](https://github.com/new).
    *   Name it `review-mind` (or similar).
    *   Make it **Public**.
    *   Do **not** initialize with README/gitignore (we have them).

2.  **Push Code**:
    Run the following commands in your terminal (inside this folder):

    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/review-mind.git
    git branch -M main
    git push -u origin main
    ```

3.  **Enable GitHub Pages**:
    *   Go to your repository **Settings** > **Pages**.
    *   Under **Source**, select `main` branch.
    *   Click **Save**.
    *   Your app will be live at `https://YOUR_USERNAME.github.io/review-mind/`.

## Tech Stack

-   **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
-   **AI Model**: Google Gemini 1.5 Flash (via REST API)
-   **Deployment**: GitHub Pages
