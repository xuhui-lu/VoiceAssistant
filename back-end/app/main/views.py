import json
from .. import SystemState
from flask import jsonify, request
from . import main
import datetime
from transitions import MachineError
from concurrent.futures import ThreadPoolExecutor
import random
from .. import MinuteTaker, AudioRecognizer, TextClassifer
from ..DataAPI import DataAPI

text_classifier = TextClassifer.TextClassifier()
minute_taker = MinuteTaker.MinuteTaker()
audio_recognizer = AudioRecognizer.AudioRecognizer()
executor = ThreadPoolExecutor(4)
seed = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+=-"

@main.route('/v1/test', methods=['GET'])
def test():
    return jsonify(test='hello')

@main.route('/v1/comments/<int:image_id>', methods=['GET'])
def get_comment_data(image_id):
    comment_list = DataAPI.get_image_comment(image_id)

    return jsonify({'ok': True, 'comment_list': comment_list})

@main.route('/v1/reservation', methods=['GET'])
def get_reservation_data():
    start_date = datetime.datetime.strptime(request.values['start_date'], "%Y-%m-%d")
    day = request.values['day']

    res = DataAPI.get_reservation_data(day=day, start_date=start_date)

    return jsonify({'ok': True, 'items': res})


@main.route('/v1/interaction', methods=['POST'])
def get_interaction():
    stream = request.files['file'].read()

    text = audio_recognizer.get_transcript(stream)
    transcript = text.lower() if text is not None else ""
#     mode = True if request.form['mode'] != "false" else False
#     content_type = request.form['contentType']
#     prompt = ""

    store = json.loads(request.form['store'])

    if 'michael' not in transcript:
        return jsonify({'ok': True, 'transcript': transcript,
                    'prompt': '', 'store': store})

    transcript = transcript.replace("michael ", "", 1)
    transcript = transcript.replace(" michael", "", 1)

    if "hold on" in transcript and store['mode'] == 1:
        store['mode'] = 2

        return jsonify({'ok': True, 'transcript': transcript,
                    'prompt': "Ok, if you need my help, please call \"wake up\"", 'store': store})

    if store['mode'] == 2:
        if transcript == "wake up":
            store['mode'] = 1

            return jsonify({'ok': True, 'transcript': transcript,
                        'prompt': "Ok, what can I do for you", 'store': store})
        else:
            request.files['file'].seek(0)

            sa = []
            for i in range(8):
                sa.append(random.choice(seed))
            salt = ''.join(sa)

            file_name = 'audio-' + salt + '.wav'

            request.files['file'].save(file_name)

            executor.submit(minute_taker.record_conversation, file_name, transcript)

            return jsonify({'ok': True, 'store': store})

    state_machine = SystemState.SystemState(store, transcript)

    trigger, value = text_classifier.get_trigger(transcript, len(state_machine.store['receiver_list']),
                                                 state_machine.state)

    state_machine.value = value

    print(trigger)

    try:
        state_machine.trigger(trigger)
        if trigger == 'exit' and state_machine.state == 'initial_state':
            executor.submit(minute_taker.save_records)
            minute_taker.save_records()

    except (MachineError, AttributeError) as e:
        state_machine.prompt = "Sorry, I couldn't understand your meaning."


    return jsonify({'ok': True, 'transcript': transcript,
                    'prompt': state_machine.prompt, 'store': state_machine.store})

