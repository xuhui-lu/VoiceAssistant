import requests
import json


class SparkHandler(object):
    def __init__(self):
        self.bot_headers = {"Content-Type": 'application/json;charset=utf-8',
                            "Authorization": 'Bearer YWU1Nzk0MzYtOGQ0YS00NDI1LTg4ODgtNzgyNWRmZDI4Yzc4MzdjMWE4NjAtMGIw'}
        self.my_headers = {"Content-Type": 'application/json;charset=utf-8',
                           "Authorization": 'Bearer MThhNjBmNjYtYTg1ZS00MGNiLThiNjEtYzliMTlmYzA2NTlkNTFmYzJiYjQtY2Mx'}

    def create_spark_room(self, reservation_date, reservation_time, recipient_id):
        title = "appointment at " + str(reservation_time) + ":00" + " " + reservation_date
        room_id = self.get_room_id(title)
        p1_id, p2_id = self.get_person_id(recipient_id)
        self.add_membership(room_id=room_id, person_id=p1_id)
        self.add_membership(room_id=room_id, person_id=p2_id)

        text = "Micheal just made an appointment with you at " + str(reservation_time) + ":00, " + reservation_date + '.'
        self.post_message(room_id, text=text)

    def get_room_id(self, title):
        post_data = {"title": title}
        response = requests.post("https://api.ciscospark.com/v1/rooms", data=json.dumps(post_data), headers=self.bot_headers)

        return response.json()['id']

    def get_person_id(self, recipient_id):
        payload = {"roomId": recipient_id}
        response = requests.get("https://api.ciscospark.com/v1/memberships", params=payload, headers=self.my_headers)

        return response.json()['items'][0]['personId'], response.json()['items'][1]['personId']

    def add_membership(self, room_id, person_id):
        post_data = {"roomId": room_id, 'personId': person_id, "isModerator": False}
        response = requests.post("https://api.ciscospark.com/v1/memberships", data=json.dumps(post_data), headers=self.bot_headers)

        return response.ok

    def post_message(self, room_id, text):
        post_data = {"roomId": room_id, "text": text}
        response = requests.post("https://api.ciscospark.com/v1/messages", data=json.dumps(post_data), headers=self.bot_headers)

        return response.ok
