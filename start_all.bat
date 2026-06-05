@echo off
title TeleTiger - تشغيل النظام بالكامل
echo ========================================
echo   TeleTiger - تشغيل الخادم الخلفي والواجهة
echo ========================================
echo.

REM تثبيت المكتبات المطلوبة
echo 📦 جاري تثبيت المكتبات...
cd /d D:\call_management_system\backend
py -m pip install fastapi uvicorn sqlalchemy pandas python-multipart aiofiles websockets > nul 2>&1
py -m pip install 'uvicorn[standard]' > nul 2>&1

REM فتح الخادم الخلفي في نافذة جديدة
echo 🚀 جاري تشغيل الخادم الخلفي (API)...
start "TeleTiger Backend" cmd /k "cd /d D:\call_management_system\backend && echo 🔧 خادم API يعمل على http://localhost:8000 && echo. && py app.py"

REM انتظر 3 ثواني
timeout /t 3 /nobreak > nul

REM فتح الواجهة الأمامية في نافذة جديدة
echo 🌐 جاري تشغيل الواجهة الأمامية...
start "TeleTiger Frontend" cmd /k "cd /d D:\call_management_system\frontend && echo 🖥️ الواجهة تعمل على http://localhost:3000 && echo. && py -m http.server 3000"

echo.
echo ✅ تم تشغيل كلا السيرفرين بنجاح!
echo.
echo 📌 انتظر 5 ثواني ثم افتح المتصفح على:
echo    🔗 http://localhost:3000
echo.
echo ⚠️  لا تغلق النوافذ السوداء - هذه هي السيرفرات!
echo.

timeout /t 5 /nobreak > nul

REM فتح المتصفح تلقائياً
start http://localhost:3000

echo 🎉 تم فتح المتصفح تلقائياً
pause