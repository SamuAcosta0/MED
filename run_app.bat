@echo off
echo Iniciando Proyecto Medico...
echo Instalando dependencias necesarias (si faltan)...
pip install -r requirements.txt
echo.
echo Lanzando el servidor Flask...
echo Abre tu navegador en: http://127.0.0.1:5000
echo.
python app.py
pause
