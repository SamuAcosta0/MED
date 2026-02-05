# Proyecto Médico - Health Connect

Este proyecto contiene una aplicación web construida con **Flask** para gestionar citas médicas entre doctores y pacientes.

## 🚀 Requisitos Previos

- Python 3.8+
- PostgreSQL 12+ (instalado y corriendo)
- pip

## 📦 Instalación

### 1. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 2. Configurar PostgreSQL

Asegúrate de tener PostgreSQL instalado y corriendo, luego crea la base de datos:

```sql
CREATE DATABASE healthconnect;
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y actualiza los valores:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de PostgreSQL:

```
SECRET_KEY=tu-clave-secreta-aqui
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/healthconnect
```

### 4. Inicializar la base de datos

Ejecuta el script de inicialización que creará las tablas y datos de prueba:

```bash
python init_db.py
```

Esto creará:
- ✅ Tablas de base de datos (users, doctors, patients, appointments)
- ✅ Un usuario doctor de prueba
- ✅ Un usuario paciente de prueba

### 5. Ejecutar el servidor

```bash
python app.py
```

O usa el archivo batch:

```bash
run_app.bat
```

## 🔑 Cuentas de Prueba

Después de ejecutar `init_db.py`, tendrás estas cuentas disponibles:

### Cuenta de Doctor
- **Email:** `doctor@healthconnect.com`
- **Contraseña:** `doctor123`
- **Nombre:** Dra. Valentina Ortiz
- **Acceso:** http://127.0.0.1:5000/doctor

### Cuenta de Paciente
- **Email:** `paciente@email.com`
- **Contraseña:** `paciente123`
- **Nombre:** Lucía Pérez
- **Acceso:** http://127.0.0.1:5000/me

## 🌐 Rutas Disponibles

### Públicas
- `/` - Página de inicio
- `/login` - Inicio de sesión
- `/register` - Registro (médico o paciente)
- `/search` - Búsqueda de doctores

### Panel del Paciente (requiere login)
- `/me` - Dashboard del paciente
- `/doctors/<id>` - Perfil de doctor
- `/booking/<id>` - Reservar cita
- `/visit/<id>/waiting-room` - Sala de espera

### Panel del Médico (requiere login)
- `/doctor` - Dashboard (Resumen)
- `/doctor/profile` - Mi Perfil
- `/doctor/patients` - Lista de Pacientes
- `/doctor/calendar` - Agenda (Calendario)
- `/doctor/records` - Historial Clínico
- `/doctor/privacy` - Privacidad y Seguridad
- `/doctor/settings` - Configuración

## 🎨 Características Implementadas

✅ Navegación suave (smooth scroll) en la página principal
✅ Sistema de autenticación completo con Flask-Login
✅ Roles de usuario (Doctor/Paciente)
✅ Registro con formularios diferentes por rol
✅ Inicio de sesión con redirección automática según rol
✅ Base de datos PostgreSQL con modelos relacionales
✅ Protección de rutas con decoradores `@login_required`
✅ Datos de prueba pre-cargados

## 🛠️ Contenido del Proyecto

- `app.py`: Servidor principal (Flask) con todas las rutas
- `models.py`: Modelos de base de datos (User, Doctor, Patient, Appointment)
- `config.py`: Configuración de la aplicación
- `init_db.py`: Script de inicialización de base de datos
- `templates/`: Plantillas HTML dinámicas
  - `auth/`: Login y registro
  - `doctor/`: Panel del médico
  - `patient/`: Panel del paciente
  - `layouts/`: Layouts base
- `static/`: Archivos CSS, JS e imágenes
- `MED/`: Maqueta estática original (diseño)

## 🔄 Actualizaciones Recientes

- ✅ JavaScript para navegación suave agregado
- ✅ Sistema de autenticación con PostgreSQL implementado
- ✅ Modelos de base de datos creados
- ✅ Páginas de login y registro funcionales
- ✅ Datos de prueba (1 doctor + 1 paciente) listos para usar

## 💡 Próximos Pasos

- [ ] Crear plantillas separadas para cada sección del panel médico
- [ ] Implementar calendario interactivo (FullCalendar.js)
- [ ] Sistema de búsqueda de pacientes
- [ ] Funcionalidad de edición de perfil
- [ ] API REST para operaciones CRUD

## ⚠️ Notas Importantes

- Este es un proyecto en desarrollo. **NO usar en producción** sin configuraciones de seguridad adicionales.
- Asegúrate de cambiar el `SECRET_KEY` en producción.
- La base de datos de prueba contiene datos ficticios.

## 📞 Soporte

Para problemas o preguntas, consulta la documentación de Flask y PostgreSQL.