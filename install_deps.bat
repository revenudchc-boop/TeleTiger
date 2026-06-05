@echo off
title TeleTiger - تثبيت المكتبات
color 0A
echo ========================================
echo   TeleTiger - تثبيت المكتبات المطلوبة
echo ========================================
echo.

echo 📦 جاري تثبيت FastAPI و Uvicorn...
pip install fastapi uvicorn

echo 📦 جاري تثبيت SQLAlchemy...
pip install sqlalchemy

echo 📦 جاري تثبيت Pandas...
pip install pandas

echo 📦 جاري تثبيت python-multipart...
pip install python-multipart

echo 📦 جاري تثبيت Pydantic...
pip install pydantic

echo 📦 جاري تثبيت aiofiles...
pip install aiofiles

echo 📦 جاري تثبيت WebSockets...
pip install websockets

echo 📦 جاري تثبيت Uvicorn مع دعم WebSocket...
pip install 'uvicorn[standard]'

echo.
echo ========================================
echo ✅ تم تثبيت جميع المكتبات بنجاح
echo ========================================
echo.
echo 📋 المكتبات المثبتة:
echo    - FastAPI + Uvicorn
echo    - SQLAlchemy
echo    - Pandas
echo    - python-multipart
echo    - Pydantic
echo    - aiofiles
echo    - WebSockets
echo    - Uvicorn[standard]
echo.
pause