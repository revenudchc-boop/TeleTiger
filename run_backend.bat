@echo off
title TeleTiger - Backend Server (API)
echo ========================================
echo   TeleTiger - تشغيل الخادم الخلفي
echo ========================================
echo.

cd /d D:\call_management_system\backend

echo جاري تثبيت المكتبات المطلوبة...
py -m pip install fastapi uvicorn sqlalchemy pandas python-multipart aiofiles > nul 2>&1

echo.
echo جاري تشغيل الخادم على المنفذ 8000...
echo.
echo ⚠️  لا تغلق هذه النافذة - الخادم يعمل هنا
echo 📡 افتح http://localhost:8000 للاختبار
echo.

py app.py

pause