@echo off
title TeleTiger - Frontend Server (Web)
echo ========================================
echo   TeleTiger - تشغيل الواجهة الأمامية
echo ========================================
echo.

cd /d D:\call_management_system\frontend

echo جاري تشغيل خادم الويب على المنفذ 3000...
echo.
echo ⚠️  لا تغلق هذه النافذة - الواجهة تعمل هنا
echo 🌐 افتح http://localhost:3000 في المتصفح
echo.

py -m http.server 3000

pause