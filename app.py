from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from config import Config
from models import db, User, Doctor, Patient, Appointment

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Por favor inicia sesión para acceder a esta página.'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- PUBLIC ROUTES ---

@app.route("/")
def home():
    """Public Home"""
    return render_template("home.html")

# --- AUTHENTICATION ROUTES ---

@app.route("/login", methods=['GET', 'POST'])
def login():
    """Login page with role-based redirect"""
    if current_user.is_authenticated:
        # Already logged in, redirect based on role
        if current_user.role == 'doctor':
            return redirect(url_for('doctor_dashboard'))
        else:
            return redirect(url_for('patient_dashboard'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = request.form.get('remember', False)
        
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            if not user.is_active:
                flash('Tu cuenta ha sido desactivada. Contacta al soporte.', 'error')
                return render_template("auth/login.html")
            
            login_user(user, remember=remember)
            
            # Redirect based on role
            next_page = request.args.get('next')
            if next_page:
                return redirect(next_page)
            
            if user.role == 'doctor':
                return redirect(url_for('doctor_dashboard'))
            else:
                return redirect(url_for('patient_dashboard'))
        else:
            flash('Email o contraseña incorrectos.', 'error')
    
    return render_template("auth/login.html")

@app.route("/register", methods=['GET', 'POST'])
def register():
    """Registration page with role selection"""
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    
    if request.method == 'POST':
        role = request.form.get('role', 'patient')
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Check if user exists
        if User.query.filter_by(email=email).first():
            flash('Este email ya está registrado.', 'error')
            return render_template("auth/register.html")
        
        # Create user
        user = User(email=email, role=role)
        user.set_password(password)
        db.session.add(user)
        db.session.flush()
        
        # Create profile based on role
        if role == 'doctor':
            doctor = Doctor(
                user_id=user.id,
                first_name=request.form.get('first_name', ''),
                last_name=request.form.get('last_name', ''),
                phone=request.form.get('phone', ''),
                license_number=request.form.get('license_number', ''),
                specialties=request.form.get('specialties', ''),
                bio=request.form.get('bio', ''),
                country=request.form.get('country', ''),
                region=request.form.get('region', ''),
                address=request.form.get('address', ''),
                practice_regions=request.form.get('practice_regions', ''),
                validation_status='pending'
            )
            db.session.add(doctor)
        else:
            patient = Patient(
                user_id=user.id,
                first_name=request.form.get('first_name', ''),
                last_name=request.form.get('last_name', ''),
                phone=request.form.get('phone', ''),
                country=request.form.get('country', ''),
                city=request.form.get('city', ''),
                medical_history=request.form.get('medical_history', '')
            )
            db.session.add(patient)
        
        db.session.commit()
        
        flash('Cuenta creada exitosamente! Ya puedes iniciar sesión.', 'success')
        return redirect(url_for('login'))
    
    return render_template("auth/register.html")

@app.route("/logout")
@login_required
def logout():
    """Logout current user"""
    logout_user()
    flash('Sesión cerrada exitosamente.', 'success')
    return redirect(url_for('home'))

# --- PATIENT ROUTES ---

@app.route("/me")
@login_required
def patient_dashboard():
    """Patient Dashboard"""
    if current_user.role != 'patient':
        return redirect(url_for('doctor_dashboard'))
    
    patient = Patient.query.filter_by(user_id=current_user.id).first()
    appointments = Appointment.query.filter_by(patient_id=patient.id).order_by(Appointment.date.desc()).all() if patient else []
    
    return render_template("patient/dashboard.html", 
                         active_page='dashboard',
                         patient=patient,
                         appointments=appointments)

@app.route("/search")
def search():
    """Doctor Search"""
    # Get all approved doctors
    doctors = Doctor.query.filter_by(validation_status='approved').all()
    return render_template("patient/search.html", 
                         active_page='search',
                         doctors=doctors)

@app.route("/doctors/<int:doctor_id>")
def doctor_profile(doctor_id):
    """Doctor Profile"""
    doctor = Doctor.query.get_or_404(doctor_id)
    return render_template("patient/doctor_profile.html", 
                         active_page='search',
                         doctor=doctor)

@app.route("/booking/<int:doctor_id>")
@login_required
def booking(doctor_id):
    """Booking Stepper"""
    if current_user.role != 'patient':
        flash('Solo los pacientes pueden reservar citas.', 'error')
        return redirect(url_for('home'))
    
    doctor = Doctor.query.get_or_404(doctor_id)
    return render_template("patient/booking.html", 
                         active_page='search',
                         doctor=doctor)

@app.route("/visit/<int:visit_id>/waiting-room")
@login_required
def waiting_room(visit_id):
    """Waiting Room"""
    appointment = Appointment.query.get_or_404(visit_id)
    return render_template("patient/waiting_room.html", 
                         active_page='appointments',
                         appointment=appointment)

@app.route("/patient/appointments")
@login_required
def patient_appointments():
    """Patient Appointments"""
    if current_user.role != 'patient':
        return redirect(url_for('doctor_dashboard'))
    return render_template("patient/appointments.html", active_page='appointments')

@app.route("/patient/records")
@login_required
def patient_records():
    """Patient Medical Records"""
    if current_user.role != 'patient':
        return redirect(url_for('doctor_dashboard'))
    return render_template("patient/records.html", active_page='records')

@app.route("/patient/profile")
@login_required
def patient_profile_view():
    """Patient Profile"""
    if current_user.role != 'patient':
        return redirect(url_for('doctor_dashboard'))
    return render_template("patient/profile.html", active_page='profile')

# --- DOCTOR ROUTES ---

@app.route("/doctor")
@login_required
def doctor_dashboard():
    """Doctor Dashboard - Resumen"""
    if current_user.role != 'doctor':
        return redirect(url_for('patient_dashboard'))
    
    doctor = Doctor.query.filter_by(user_id=current_user.id).first()
    
    # Get statistics
    total_patients = Appointment.query.filter_by(doctor_id=doctor.id).distinct(Appointment.patient_id).count() if doctor else 0
    today_appointments = Appointment.query.filter_by(
        doctor_id=doctor.id,
        date=db.func.current_date()
    ).all() if doctor else []
    
    return render_template("doctor/dashboard.html", 
                         doctor=doctor,
                         total_patients=total_patients,
                         today_appointments=today_appointments)

@app.route("/doctor/profile")
@login_required
def doctor_profile_view():
    """Doctor Profile View/Edit"""
    if current_user.role != 'doctor':
        return redirect(url_for('patient_dashboard'))
    
    doctor = Doctor.query.filter_by(user_id=current_user.id).first()
    return render_template("doctor/profile.html", doctor=doctor)

@app.route("/doctor/patients")
@login_required
def doctor_patients():
    """Doctor Patients List"""
    if current_user.role != 'doctor':
        return redirect(url_for('patient_dashboard'))
    
    doctor = Doctor.query.filter_by(user_id=current_user.id).first()
    patients = Patient.query.join(Appointment).filter(
        Appointment.doctor_id == doctor.id
    ).distinct().all() if doctor else []
    
    return render_template("doctor/patients.html", 
                         doctor=doctor,
                         patients=patients)

@app.route("/doctor/calendar")
@login_required
def doctor_calendar():
    """Doctor Calendar/Agenda"""
    if current_user.role != 'doctor':
        return redirect(url_for('patient_dashboard'))
    
    doctor = Doctor.query.filter_by(user_id=current_user.id).first()
    appointments = Appointment.query.filter_by(doctor_id=doctor.id).all() if doctor else []
    
    return render_template("doctor/calendar.html", 
                         doctor=doctor,
                         appointments=appointments)

@app.route("/doctor/records")
@login_required
def doctor_records():
    """Doctor Medical Records"""
    if current_user.role != 'doctor':
        return redirect(url_for('patient_dashboard'))
    
    doctor = Doctor.query.filter_by(user_id=current_user.id).first()
    return render_template("doctor/records.html", doctor=doctor)

@app.route("/doctor/privacy")
@login_required
def doctor_privacy():
    """Doctor Privacy & Security"""
    if current_user.role != 'doctor':
        return redirect(url_for('patient_dashboard'))
    
    doctor = Doctor.query.filter_by(user_id=current_user.id).first()
    return render_template("doctor/privacy.html", doctor=doctor)

@app.route("/doctor/settings")
@login_required
def doctor_settings():
    """Doctor Settings"""
    if current_user.role != 'doctor':
        return redirect(url_for('patient_dashboard'))
    
    doctor = Doctor.query.filter_by(user_id=current_user.id).first()
    return render_template("doctor/settings.html", doctor=doctor)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
