@echo off
title TeleTiger - فحص حالة النظام
color 0A
echo ========================================
echo   TeleTiger - فحص حالة النظام
echo ========================================
echo.

echo 🔍 فحص المنفذ 8000 (خادم API)...
netstat -an | findstr "8000" > nul
if %errorlevel%==0 (
    echo ✅ خادم API يعمل على المنفذ 8000
) else (
    echo ❌ خادم API لا يعمل
)

echo.
echo 🔍 فحص المنفذ 9000 (مستمع SMDR)...
netstat -an | findstr "9000" > nul
if %errorlevel%==0 (
    echo ✅ مستمع SMDR يعمل على المنفذ 9000
) else (
    echo ❌ مستمع SMDR لا يعمل
)

echo.
echo 🔍 فحص المنفذ 3000 (الواجهة الأمامية)...
netstat -an | findstr "3000" > nul
if %errorlevel%==0 (
    echo ✅ الواجهة الأمامية تعمل على المنفذ 3000
) else (
    echo ❌ الواجهة الأمامية لا تعمل
)

echo.
echo 🔍 فحص قاعدة البيانات...
if exist "D:\call_management_system\backend\calls.db" (
    echo ✅ قاعدة البيانات موجودة
) else (
    echo ⚠️ قاعدة البيانات غير موجودة - قم برفع ملف SMDR أولاً
)

echo.
echo ========================================
pause