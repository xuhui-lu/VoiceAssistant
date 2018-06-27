from . import IdentificationServiceHttpClientHelper
from flask_mail import Message
from manage import mail, app
import os


class MinuteTaker(object):
    subscription_key = "f5e8289431fc4f20b1397f81bc4abc5a"
    profile_ids = ["65cfa8b7-ab91-4c1b-8019-56a0be0db5a3"]
    conversation_doc = []

    def __init__(self):
        self.helper = IdentificationServiceHttpClientHelper.IdentificationServiceHttpClientHelper(
            self.subscription_key)

    def identify_file(self, file_path, force_short_audio):
        """Identify an audio file on the server.

        Arguments:
        subscription_key -- the subscription key string
        file_path -- the audio file path for identification
        profile_ids -- an array of test profile IDs strings
        force_short_audio -- waive the recommended minimum audio limit needed for enrollment
        """

        identification_response = self.helper.identify_file(
            file_path, self.profile_ids,
            force_short_audio.lower() == "true")

        print('Identified Speaker = {0}'.format(identification_response.get_identified_profile_id()))
        print('Confidence = {0}'.format(identification_response.get_confidence()))

        return identification_response.get_identified_profile_id()

    def record_conversation(self, file_path, transcript):
        try:
            speaker_id = self.identify_file(file_path=file_path,
                                            force_short_audio='True')

            if speaker_id == self.profile_ids[0]:
                if transcript != "":
                    self.conversation_doc.append({'role': 'doc', 'transcript': transcript})

            else:
                if transcript != "":
                    self.conversation_doc.append({'role': 'pat', 'transcript': transcript})

        except Exception as e:
            print(e.message)

        finally:
            os.remove(file_path)

    def save_records(self):
        if len(self.conversation_doc) == 0:
            return

        with open(os.path.join(app.root_path, 'record.txt'), 'w') as f:
            for item in self.conversation_doc:
                f.write(item['role'] + ': ')
                f.write(item['transcript'])
                f.write('\n')

        f.close()

        msg = Message(subject='Your record conversation for cisco speech demo', sender='swimmingfishlu@gmail.com',
                      recipients=['luxuhui12345@126.com', 'xuhlu@cisco.com'])

        msg.body = 'Dear customer: \n this is the conversation record for your previous visiting.'

        with app.open_resource("record.txt") as fp:
            msg.attach("record.txt", "text/plain", fp.read())
            fp.close()

        mail.send(msg)

        os.remove(os.path.join(app.root_path, "record.txt"))
