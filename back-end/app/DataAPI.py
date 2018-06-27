from .models import User, Reservation, Comment
import datetime
from mongoengine import SaveConditionError

class DataAPI(object):

    @staticmethod
    def update_image_comment(image_id, pos_x, pos_y, content):
        new_comment = Comment(image_id=image_id, pos_x=pos_x, pos_y=pos_y, content=content)
        new_comment.save()

    @staticmethod
    def get_image_comment(image_id):
        comment_objects = Comment.objects(image_id=image_id)
        comment_list = []

        for item in comment_objects:
            comment = dict()
            comment['image_id'] = image_id
            comment['pos_x'] = item.pos_x
            comment['pos_y'] = item.pos_y
            comment['content'] = item.content
            comment_list.append(comment)

        return comment_list

    @staticmethod
    def update_reservation_data(reservation_date, reservation_time, reservation_day, reservation_recipient):
        if Reservation.objects(date=reservation_date, time=reservation_time, day=reservation_day).first() is not None:
            return False

        new_reservation = Reservation(date=reservation_date, time=reservation_time, day=reservation_day,
                                      recipient=reservation_recipient)

        try:
            new_reservation.save()

            return True

        except SaveConditionError:
            return False

    @staticmethod
    def get_reservation_data(day, start_date):
        start_date = start_date - datetime.timedelta(days=int(day))

        res = []

        for i in range(0, 168):
            item = {}
            delta = datetime.timedelta(days=i // 24)
            date = start_date + delta

            item['date'] = date.strftime("%Y-%m-%d")
            reservation = Reservation.objects(date=date, time=i % 24).first()
            if reservation is None:
                item['commits'] = 0
                item['recipient'] = 'null'
            else:
                item['commits'] = 1
                item['recipient'] = reservation['recipient']
            item['day'] = i // 24
            item['time'] = i % 24
            res.append(item)

        return res
