"""
Database initialization and sample data creation
Run this script to create tables and populate with test data
"""

from app import app, db
from models import User, Doctor, Patient, Appointment
from datetime import datetime, date, time

def init_db():
    """Create all database tables"""
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("✓ Tables created successfully!")

def create_sample_data():
    """Create sample users for testing"""
    with app.app_context():
        # Check if users already exist
        if User.query.first():
            print("⚠ Sample data already exists. Skipping...")
            return
        
        print("Creating sample users...")
        
        # Create Doctor User
        doctor_user = User(
            email='doctor@healthconnect.com',
            role='doctor'
        )
        doctor_user.set_password('doctor123')
        db.session.add(doctor_user)
        db.session.flush()  # Get the user ID
        
        # Create Doctor Profile
        doctor_profile = Doctor(
            user_id=doctor_user.id,
            first_name='Valentina',
            last_name='Ortiz',
            phone='+1 (555) 234-5678',
            license_number='HC-29384',
            specialties='Cardiología, Medicina Interna',
            bio='Especialista en cardiología con 12 años de experiencia en diagnóstico y tratamiento de enfermedades cardiovasculares.',
            country='México',
            region='Ciudad de México',
            address='Av. Central 202, CDMX',
            practice_regions='Latinoamérica, Telemedicina',
            validation_status='approved',
            validated_at=datetime.utcnow()
        )
        db.session.add(doctor_profile)
        
        # Create Patient User
        patient_user = User(
            email='paciente@email.com',
            role='patient'
        )
        patient_user.set_password('paciente123')
        db.session.add(patient_user)
        db.session.flush()
        
        # Create Patient Profile
        patient_profile = Patient(
            user_id=patient_user.id,
            first_name='Lucía',
            last_name='Pérez',
            phone='+51 987 654 321',
            date_of_birth=date(1995, 5, 15),
            country='Perú',
            city='Lima',
            blood_type='O+',
            allergies='Penicilina',
            medical_history='Alergia crónica. Tratamiento anterior: antihistamínicos.'
        )
        db.session.add(patient_profile)
        
        # Create sample appointments
        appointment1 = Appointment(
            doctor_id=doctor_profile.id,
            patient_id=patient_profile.id,
            date=date(2026, 2, 5),
            time=time(9, 30),
            status='confirmed',
            type='consultation',
            reason='Chequeo anual cardiológico'
        )
        db.session.add(appointment1)
        
        appointment2 = Appointment(
            doctor_id=doctor_profile.id,
            patient_id=patient_profile.id,
            date=date(2026, 2, 10),
            time=time(14, 0),
            status='scheduled',
            type='follow-up',
            reason='Seguimiento de presión arterial'
        )
        db.session.add(appointment2)
        
        # Commit all changes
        db.session.commit()
        
        print("\n✓ Sample data created successfully!")
        print("\n" + "="*50)
        print("Test Accounts Created:")
        print("="*50)
        print("\n👨‍⚕️ DOCTOR ACCOUNT:")
        print(f"   Email: doctor@healthconnect.com")
        print(f"   Password: doctor123")
        print(f"   Name: Dra. Valentina Ortiz")
        print("\n👤 PATIENT ACCOUNT:")
        print(f"   Email: paciente@email.com")
        print(f"   Password: paciente123")
        print(f"   Name: Lucía Pérez")
        print("="*50 + "\n")

if __name__ == '__main__':
    init_db()
    create_sample_data()
