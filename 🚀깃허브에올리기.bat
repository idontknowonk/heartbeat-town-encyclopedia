@echo off
echo ===================================================
echo [1/2] Uploading code to GitHub... (Please login if prompted)
echo ===================================================
git push -u origin main

echo.
echo ===================================================
echo [2/2] Deploying website to GitHub Pages...
echo ===================================================
call npm run deploy

echo.
echo ===================================================
echo DONE! The website will be available in 1-2 minutes at:
echo https://idontknowonk.github.io/heartbeat-town-encyclopedia/
echo ===================================================
pause
