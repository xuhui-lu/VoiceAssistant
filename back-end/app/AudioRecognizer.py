from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types


class AudioRecognizer(object):

    def __init__(self):
        self.client = speech.SpeechClient()

    def get_transcript(self, file_data):
        # Instantiates a client

        content = file_data
        audio = types.RecognitionAudio(content=content)

        config = types.RecognitionConfig(
            encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code='en-US')

        # Detects speech in the audio file
        response = self.client.recognize(config, audio)

        for result in response.results:
            print('Transcript: {}'.format(result.alternatives[0].transcript))

            return result.alternatives[0].transcript
