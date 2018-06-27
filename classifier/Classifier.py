import nltk
from nltk.stem.lancaster import LancasterStemmer

nltk.download('punkt')

stemmer = LancasterStemmer()

training_data = []
training_data.append({"class":"entrance", "sentence":"Hi, Michael"})
training_data.append({"class":"entrance", "sentence":"Hello, Michael"})
training_data.append({"class":"entrance", "sentence":"How are you, Michael"})

training_data.append({"class":"exit", "sentence":"have a nice day, Michael"})
training_data.append({"class":"exit", "sentence":"see you later, Michael"})
training_data.append({"class":"exit", "sentence":"talk to you soon, Michael"})

# training_data.append({"class":"sandwich", "sentence":"make me a sandwich"})
# training_data.append({"class":"sandwich", "sentence":"can you make a sandwich?"})
# training_data.append({"class":"sandwich", "sentence":"having a sandwich today?"})
# training_data.append({"class":"sandwich", "sentence":"what's for lunch?"})
print ("%s sentences of training data" % len(training_data))

corpus_words = {}
class_words = {}

classes = list(set([a['class'] for a in training_data]))

for c in classes:
    class_words[c] = []

for data in training_data:
    for word in nltk.word_tokenize(data['sentence']):

        if word not in ["?", "'s"]:
            stemmed_word = stemmer.stem(word.lower())

            if stemmed_word not in corpus_words:
                corpus_words[stemmed_word] = 1
            else:
                corpus_words[stemmed_word] += 1

            class_words[data['class']].extend([stemmed_word])

def calculate_class_score(sentence, class_name, show_details=True):
    score = 0

    for word in nltk.word_tokenize(sentence):
        if stemmer.stem(word.lower()) in class_words[class_name]:
            score += 1 / corpus_words[stemmer.stem(word.lower())]
            if show_details:
                print("   match: %s (%s)" % (stemmer.stem(word.lower()), 1 / corpus_words[stemmer.stem(word.lower())]))

    return score

def classify(sentence):
    high_class = None
    high_score = 0
    for c in class_words.keys():
        score = calculate_class_score(sentence, c)
        if score > high_score:
            high_class = c
            high_score = score

    return high_class, high_score



sentence = "good day for you, Michael"

s_class, s_score = classify(sentence)


print(classify(sentence))