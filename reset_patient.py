from app import app, db, User, Patient

def reset_patient():
    with app.app_context():
        # Buscar usuario existente
        user = User.query.filter_by(email='paciente@email.com').first()
        
        if user:
            print("Usuario paciente encontrado. Eliminando...")
            db.session.delete(user)
            db.session.commit()
        
        # Crear usuario nuevo
        print("Creando usuario paciente@email.com...")
        new_user = User(email='paciente@email.com', role='patient')
        new_user.set_password('paciente123')
        db.session.add(new_user)
        db.session.flush()
        
        # Crear perfil paciente
        new_patient = Patient(
            user_id=new_user.id,
            first_name='Lucía',
            last_name='Pérez',
            country='México',
            city='CDMX'
        )
        db.session.add(new_patient)
        db.session.commit()
        
        print("¡ÉXITO! Usuario paciente creado.")

if __name__ == "__main__":
    reset_patient()
