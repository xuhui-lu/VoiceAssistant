from flask import Flask
from config import config
from flask_cors import CORS
from flask_mail import Mail
from flask_mongoengine import MongoEngine


def create_app(config_name):
    app = Flask(__name__)
    CORS(app=app)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    app.config['MONGODB_DB'] = 'speech_demo'
    app.config['MONGODB_HOST'] = 'localhost'
    app.config['MONGODB_PORT'] = 27017
    app.config['MONGODB_USERNAME'] = 'cisco_speech'
    app.config['MONGODB_PASSWORD'] = 'CTAO123.'

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'swimmingfishlu@gmail.com'
    app.config['MAIL_PASSWORD'] = 'LXHxhd123.'
    app.config['MAIL_PORT'] = 587
    app.config['DEBUG'] = True

    db = MongoEngine(app)
    mail = Mail(app)

    from .main import main as main_blueprint

    app.register_blueprint(main_blueprint)

    return app, db, mail




