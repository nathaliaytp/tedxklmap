TEDxKL Experience - Hosting Guide (v8)

This guide explains how to set up the Google Sheet and Google Apps Script required for the new Lucky Draw feature.

You must follow these steps, or the lucky draw submission will not work.

Part 1: Set up the Google Sheet (The "Database")

Go to sheets.google.com and create a new blank sheet.

Rename the sheet to "TEDxKL Lucky Draw" (or any name you like).

By default, the tab at the bottom is named "Sheet1". Rename this tab to LuckyDrawEntries.

Crucial: This name must match the SHEET_NAME variable in the Google_Apps_Script.gs file.

Part 2: Create the Google Apps Script (The "Backend")

In your new Google Sheet, click "Extensions" > "Apps Script".

A new tab will open with the Apps Script editor. Delete any placeholder code inside (like function myFunction() {}).

Go to the file Google_Apps_Script.gs that I generated for you.

Copy all the code from that file.

Paste it into the blank Apps Script editor.

Review the Configuration at the top of the script.

SHEET_NAME should be "LuckyDrawEntries".

ULTIMATE_ANSWER is set to "CONFLUENCE". You can change this to whatever you want the answer to be.

Click the "Save project" icon (looks like a floppy disk).

Part 3: Deploy the Script as a Web App (The "Magic")

This is the most important step. We will make the script accessible from the internet.

In the top-right of the Apps Script editor, click the blue "Deploy" button.

Select "New deployment".

Click the "Select type" gear icon (⚙️) and choose "Web app".

In the "Description" field, type "TEDxKL Lucky Draw".

For "Who has access", select "Anyone".

This is essential. If you leave it as "Only myself," the website will get a "permission denied" error.

Click "Deploy".

Google will ask you to "Authorize access". Click it.

Choose your Google account.

You will see a "Google hasn't verified this app" warning screen. This is normal. Click "Advanced" and then click "Go to (your project name) (unsafe)".

A final screen will ask for permission to manage your spreadsheets. Click "Allow".

You are done! You will now see a "Deployment successfully updated" pop-up.

COPY the "Web app URL". It looks like https://script.google.com/macros/s/.../exec.

Part 4: Final Step - Update Your Website

Go back to your index.html file.

Find this line near the top of the <script> tag (around line 795):

const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_GOES_HERE';


Paste your new Web app URL into the quotes.

const GOOGLE_SCRIPT_URL = '[https://script.google.com/macros/s/A...B/exec](https://script.google.com/macros/s/A...B/exec)';


Save your index.html file.

Your game is now fully configured! When a user completes all stamps and submits the correct answer, their name and email will automatically appear in your LuckyDrawEntries Google Sheet.