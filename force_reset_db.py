
from app import app, db
from models import User, Doctor, Patient, Appointment
from datetime import datetime, date, time, timezone

def force_reset():
    """Drops all tables and recreates them with sample data"""
    with app.app_context():
        print("1. Dropping all tables...")
        db.drop_all()
        
        print("2. Creating all tables...")
        db.create_all()
        
        print("3. Creating Doctor User...")
        doctor_user = User(email='doctor@healthconnect.com', role='doctor')
        doctor_user.set_password('doctor123')
        db.session.add(doctor_user)
        db.session.commit() # Commit immediately to get ID
        
        print("4. Creating Doctor Profile...")
        doctor_profile = Doctor(
            user_id=doctor_user.id,
            first_name='Valentina',
            last_name='Ortiz',
            phone='+1 (555) 234-5678',
            license_number='HC-29384',
            specialties='Cardiología',
            bio='Especialista en cardiología.',
            country='México',
            region='CDMX',
            address='Av. Central 202',
            practice_regions='Latinoamérica',
            validation_status='approved',
            validated_at=datetime.now(timezone.utc) # Use timezone-aware datetime
        )
        db.session.add(doctor_profile)
        db.session.commit()
        
        print("5. Creating Patient User...")
        patient_user = User(email='paciente@email.com', role='patient')
        patient_user.set_password('paciente123')
        db.session.add(patient_user)
        db.session.commit()
        
        print("6. Creating Patient Profile...")
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
            medical_history='Alergia crónica.'
        )
        db.session.add(patient_profile)
        db.session.commit()
        
        print("7. Done! Users created successfully.")

if __name__ == '__main__':
    try:
        force_reset()
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
