import os
import pickle
import nltk
from nltk.stem.lancaster import LancasterStemmer
import tflearn
from . import SlotParser
import numpy as np


class TextClassifier(object):

    ERROR_THRESHOLD = 0.5

    pattern_table = {'goodbye': 'exit', 'hello': 'entrance'}

    slot_state = {
        'reservation_time': 'time', 'reservation_day': 'week_day',
        'reservation_recipient': 'num', 'image_num': 'num', 'confirm_reservation': 'bool', 'add_comment': 'sentence'
    }

    data_file_dir = os.path.join(
        os.path.dirname(__file__),
        'static',
        'data.json')

    training_data_dir = os.path.join(
        os.path.dirname(__file__),
        'static',
        'training_data')

    model_dir = os.path.join(
        os.path.dirname(__file__),
        'static',
        'model.tflearn')

    intents_dir = os.path.join(
        os.path.dirname(__file__),
        'static',
        'intents.json')
    data = pickle.load(open(training_data_dir, "rb"))
    words = data['words']
    classes = data['classes']
    train_x = data['train_x']
    train_y = data['train_y']

    stemmer = LancasterStemmer()

    def __init__(self):
        # load our saved model
        self.net = tflearn.input_data(shape=[None, len(self.train_x[0])])
        self.net = tflearn.fully_connected(self.net, 8)
        self.net = tflearn.fully_connected(self.net, 8)
        self.net = tflearn.fully_connected(self.net, len(self.train_y[0]), activation='softmax')
        self.net = tflearn.regression(self.net)

        # Define model and setup tensorboard
        self.model = tflearn.DNN(self.net, tensorboard_dir='tflearn_logs')
        self.model.load(self.model_dir)

    def handle_slot(self, state, transcript, boundary):
        handler = SlotParser.SlotParser(self.slot_state[state], transcript, boundary)
        trigger, value = handler.parse_slot()

        return trigger, value

    def is_slot(self, state):
        if state in self.slot_state:
            return True
        else:
            return False

    def get_trigger(self, transcript, boundary, state):

        if self.is_slot(state):
            res = self.classify(transcript)

            if len(res) > 0 and (res[0][0] == 'next_page' or res[0][0] == 'last_page'):
                return res[0][0], 0

            trigger, value = self.handle_slot(state, transcript, boundary)

            return trigger, value

        if transcript in self.pattern_table:
            return self.pattern_table[transcript], 0

        res = self.classify(transcript)

        return res[0][0] if len(res) > 0 else 'None', 0

    def clean_up_sentence(self, sentence):
        # tokenize the pattern
        sentence_words = nltk.word_tokenize(sentence)
        # stem each word
        sentence_words = [self.stemmer.stem(word.lower()) for word in sentence_words]
        return sentence_words

    # return bag of words array: 0 or 1 for each word in the bag that exists in the sentence
    def bow(self, sentence, words, show_details=False):
        # tokenize the pattern
        sentence_words = self.clean_up_sentence(sentence)
        # bag of words
        bag = [0] * len(words)
        for s in sentence_words:
            for i, w in enumerate(words):
                if w == s:
                    bag[i] = 1
                    if show_details:
                        print("found in bag: %s" % w)

        return np.array(bag)

    def classify(self, sentence):
        # generate probabilities from the model
        results = self.model.predict([self.bow(sentence, self.words)])[0]
        # filter out predictions below a threshold
        results = [[i, r] for i, r in enumerate(results) if r > self.ERROR_THRESHOLD]
        # sort by strength of probability
        results.sort(key=lambda x: x[1], reverse=True)
        return_list = []
        for r in results:
            return_list.append((self.classes[r[0]], r[1]))
        # return tuple of intent and probability
        return return_list
