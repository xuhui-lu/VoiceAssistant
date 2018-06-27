import numpy as np
import json
import itertools
from collections import Counter



def load_data_and_labels(data_file):

    # Load data from files

    with open(data_file) as json_data:
        intents = json.load(json_data)

    text_sentences = []
    text_label = []
    count = 0

    for intent in intents['intents']:
        single_label = np.zeros(len(intents['intents']), dtype=np.int)
        single_label[count] = 1
        tag_sentences = []

        for pattern in intent['patterns']:
            tag_sentences.append(pattern.strip())

        text_sentences += tag_sentences

        tag_labels = [single_label for _ in tag_sentences]

        text_label += tag_labels

        count += 1

    y = np.array([item for item in text_label])

    return [text_sentences, y]


def batch_iter(data, batch_size, num_epochs, shuffle=True):
    """
    Generates a batch iterator for a dataset.
    """
    data = np.array(data)
    data_size = len(data)
    num_batches_per_epoch = int((len(data)-1)/batch_size) + 1
    for epoch in range(num_epochs):
        # Shuffle the data at each epoch
        if shuffle:
            shuffle_indices = np.random.permutation(np.arange(data_size))
            shuffled_data = data[shuffle_indices]
        else:
            shuffled_data = data
        for batch_num in range(num_batches_per_epoch):
            start_index = batch_num * batch_size
            end_index = min((batch_num + 1) * batch_size, data_size)
            yield shuffled_data[start_index:end_index]
