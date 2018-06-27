from manage import db


class User(db.Document):
    name = db.StringField(max_length=20, required=True)
    birthday = db.DateTimeField(required=True)
    phone = db.StringField(length=15)
    email = db.EmailField()
    city = db.StringField(max_length=40)
    address = db.StringField(max_length=50)


class Reservation(db.Document):
    date = db.DateTimeField(required=True)
    day = db.IntField(required=True)
    time = db.IntField(required=True)
    recipient = db.StringField(length=15)


class Comment(db.Document):
    image_id = db.IntField(required=True)
    pos_x = db.IntField(required=True)
    pos_y = db.IntField(required=True)
    content = db.StringField(required=True)