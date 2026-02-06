from app import app, db, User, Doctor
from werkzeug.security import generate_password_hash

def reset_doctor():
    with app.app_context():
        # Buscar usuario existente
        user = User.query.filter_by(email='doctor@healthconnect.com').first()
        
        if user:
            print("Usuario encontrado. Eliminando...")
            db.session.delete(user)
            db.session.commit()
        
        # Crear usuario nuevo
        print("Creando usuario doctor@healthconnect.com...")
        new_user = User(email='doctor@healthconnect.com', role='doctor')
        new_user.set_password('doctor123')
        db.session.add(new_user)
        db.session.flush()
        
        # Crear perfil médico
        new_doctor = Doctor(
            user_id=new_user.id,
            first_name='Valentina',
            last_name='Ortiz',
            specialties='Cardiología',
            license_number='HC-29384',
            validation_status='verified' # Auto-verificado para que pueda entrar
        )
        db.session.add(new_doctor)
        db.session.commit()
        
        print("¡ÉXITO! Usuario creado.")
        print("Email: doctor@healthconnect.com")
        print("Pass: doctor123")

if __name__ == "__main__":
    reset_doctor()
