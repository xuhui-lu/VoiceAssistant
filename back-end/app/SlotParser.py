import re

week_day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
word_to_num = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']

class SlotParser(object):
    def __init__(self, data_type, transcript, boundary):
        self.data_type = data_type
        self.transcript = self.pre_process(transcript)
        self.functions = {
            'time': self.parse_time,
            'week_day': self.parse_week_day,
            'num': self.parse_num,
            'bool': self.parse_bool,
            'sentence': self.parse_sentence
        }

        self.boundary = boundary

    def pre_process(self, transcript):
        for i in range(11):
            transcript = transcript.replace(word_to_num[i], "", i)

        return transcript

    def parse_slot(self):
        action = self.functions[self.data_type]
        trigger, value = action()

        return trigger, value

    def parse_bool(self):
        return 'confirm' if 'yes' in self.transcript else 'deny', 0

    def parse_week_day(self):
        for i in range(0, 7):
            if week_day[i] in self.transcript:
                return 'day', i

    def parse_time(self):
        num = re.findall("\d+", self.transcript)

        if len(num) == 0:
            return 'None', -1

        if 'p.m.' in self.transcript:
            num += 12

        num = int(num[0], 10)
        if num > 23:
            return 'None', -1

        return 'time', num

    def parse_num(self):
        num = re.findall("\d+", self.transcript)

        if len(num) == 0:
            return 'None', -1

        num = int(num[0], 10)

        return 'item_num', num

    def parse_sentence(self):

        return 'sentence', 0
