---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 09/05/2019
ms.author: aahi
---

<a name="HOLTop"></a>

<!-- these links are for v2. Make sure to update them to the correct v3 content -->
[Reference documentation](https://docs.microsoft.com/python/api/overview/azure/cognitiveservices/textanalytics?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-language-textanalytics) | [Package (PiPy)](https://pypi.org/project/azure-cognitiveservices-language-textanalytics/) | [Samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples)


## Prerequisites

<!--
Add any extra steps preparing an environment for working with the client library. 
-->

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* [Python 3.x](https://www.python.org/)

## Setting up

### Create a Text Analytics Azure resource
<!-- NOTE
The below is an "include" file, which is a text file that will be referenced, and rendered on the docs site.
These files are used to display text across multiple articles at once. Consider keeping them in-place for consistency with other articles.
 -->

[!INCLUDE [text-analytics-resource-creation](resource-creation.md)]

### Install the client library

After installing Python, you can install the client library with:

```console
pip install --upgrade azure-cognitiveservices-language-textanalytics
```

### Create a new python application

Create a new Python file and import the following libraries.

[!code-python[import statements](~/samples-cognitive-services-python-sdk/samples/language/text_analytics_samples.py?name=imports)]

Create variables for your resource's Azure endpoint and subscription key.

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

<!-- Use the below example variable names and example strings, for consistency with the other quickstart variables -->

```python
subscription_key = "<paste-your-text-analytics-key-here>"
endpoint = "<paste-your-text-analytics-endpoint-here>"
```


## Object model

<!-- 
    Briefly introduce and describe the functionality of the library's main classes. Include links to their reference pages. If needed, briefly explain the object hierarchy and how the classes work together to manipulate resources in the service.
-->

The Text Analytics client is a [TextAnalyticsClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-python) object that authenticates to Azure using your key. The client provides several methods for analyzing text, as a single string, or a batch. 

Text is sent to the API as a list of `documents`, which are `dictionary` objects containing a combination of `id`, `text`, and `language` attributes depending on the method used. The `text` attribute stores the text to be analyzed in the origin `language`, and the `id` can be any value. 

The response object is a list containing the analysis information for each document. 

## Code examples

These code snippets show you how to do the following with the Text Analytics client library for Python:
<!-- If you add more code examples, add a link to them here-->
* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis)
* [Language detection](#language-detection)
* [Entity recognition](#entity-recognition)
* [Key phrase extraction](#key-phrase-extraction)

## Authenticate the client

Create a new [TextAnalyticsClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-python) with your endpoint, and a `CognitiveServicesCredentials` object containing your key.

```python
from azure.ai.textanalytics import TextAnalyticsClient

def authenticateClient():
    text_analytics_client = TextAnalyticsClient(
        endpoint=endpoint, credential=subscription_key)
    return text_analytics_client
```

## Sentiment analysis

Authenticate a client object, and call the [sentiment()](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-python#sentiment-show-stats-none--documents-none--custom-headers-none--raw-false----operation-config-) function. Iterate through the results, and print each document's ID, and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

```python
def print_sentiment_scores(documents, response):
    docs = [doc for doc in response if not doc.is_error]

    for idx, doc in enumerate(docs):
        print("Document text: {}".format(documents[idx]))
        print("Overall sentiment: {}".format(doc.sentiment))
    # [END batch_analyze_sentiment]
        print("Overall scores: positive={0:.3f}; neutral={1:.3f}; negative={2:.3f} \n".format(
            doc.document_scores.positive,
            doc.document_scores.neutral,
            doc.document_scores.negative,
        ))
        for idx, sentence in enumerate(doc.sentences):
            print("Sentence {} sentiment: {}".format(idx+1, sentence.sentiment))
            print("Sentence score: positive={0:.3f}; neutral={1:.3f}; negative={2:.3f}".format(
                sentence.sentence_scores.positive,
                sentence.sentence_scores.neutral,
                sentence.sentence_scores.negative,
            ))
            print("Offset: {}".format(sentence.offset))
            print("Length: {}\n".format(sentence.length))
        print("------------------------------------")

def sentiment():

    client = authenticate_client()
    documents = [
            {"id": "0", "language": "en", "text": "I had the best day of my life."},
            {"id": "1", "language": "en",
             "text": "This was a waste of my time. The speaker put me to sleep."},
            {"id": "2", "language": "es", "text": "No tengo dinero ni nada que dar..."},
            {"id": "3", "language": "fr",
             "text": "L'hôtel n'était pas très confortable. L'éclairage était trop sombre."}
        ]

    response = client.analyze_sentiment(documents)
    print_sentiment_scores(documents, response)

sentiment()
```

### Output

```console
Document text: {'id': '0', 'language': 'en', 'text': 'I had the best day of my life.'}
Overall sentiment: positive
Overall scores: positive=0.999; neutral=0.001; negative=0.000 

Sentence 1 sentiment: positive
Sentence score: positive=0.999; neutral=0.001; negative=0.000
Offset: 0
Length: 30

------------------------------------
Document text: {'id': '1', 'language': 'en', 'text': 'This was a waste of my time. The speaker put me to sleep.'}
Overall sentiment: negative
Overall scores: positive=0.000; neutral=0.000; negative=1.000 

Sentence 1 sentiment: negative
Sentence score: positive=0.000; neutral=0.000; negative=1.000
Offset: 0
Length: 28

Sentence 2 sentiment: neutral
Sentence score: positive=0.122; neutral=0.851; negative=0.026
Offset: 29
Length: 28

------------------------------------
Document text: {'id': '2', 'language': 'es', 'text': 'No tengo dinero ni nada que dar...'}
Overall sentiment: negative
Overall scores: positive=0.032; neutral=0.074; negative=0.894 

Sentence 1 sentiment: negative
Sentence score: positive=0.032; neutral=0.074; negative=0.894
Offset: 0
Length: 34

------------------------------------
Document text: {'id': '3', 'language': 'fr', 'text': "L'hôtel n'était pas très confortable. L'éclairage était trop sombre."}
Overall sentiment: negative
Overall scores: positive=0.000; neutral=0.000; negative=1.000 

Sentence 1 sentiment: negative
Sentence score: positive=0.000; neutral=0.000; negative=1.000
Offset: 0
Length: 37

Sentence 2 sentiment: negative
Sentence score: positive=0.000; neutral=0.000; negative=1.000
Offset: 38
Length: 30

------------------------------------
```

## Language detection

Using the client created earlier, call [detect_language()](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-python#detect-language-show-stats-none--documents-none--custom-headers-none--raw-false----operation-config-) and get the result. Then iterate through the results, and print each document's ID, and the first returned language.

```python
# Language Detection 
def language_detection():
    client = authenticate_client()

    try:
        documents = [
            {'id': '1', 'text': 'This is a document written in English.'},
            {'id': '2', 'text': 'Este es un document escrito en Español.'},
            {'id': '3', 'text': '这是一个用中文写的文件'}
        ]
        response = client.detect_languages(inputs=documents)
        for document in response:
            print("Document Id: ", document.id, ", Language: ",
                  document.detected_languages[0].name)

    except Exception as err:
        print("Encountered exception. {}".format(err))

language_detection()
```


### Output

```console
Document Id:  1 , Language:  English
Document Id:  2 , Language:  Spanish
Document Id:  3 , Language:  Chinese_Simplified
```

## Entity recognition

Using the client created earlier, call the [entities()](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-python#entities-show-stats-none--documents-none--custom-headers-none--raw-false----operation-config-) function and get the result. Then iterate through the results, and print each document's ID, and the entities contained in it.

```python
def entity_recognition():
    
    client = authenticate_client()

    try:
        documents = [
            {"id": "1", "language": "en", "text": "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800."},
            {"id": "2", "language": "es",
                "text": "La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle."}
        ]
        result = client.recognize_entities(documents)
        docs = [doc for doc in result if not doc.is_error]

        for idx, doc in enumerate(docs):
            print("\nDocument text: {}".format(documents[idx]))
            for entity in doc.entities:
                print("Entity: \t", entity.text, "\tType: \t", entity.type,
                      "\tConfidence Score: \t", round(entity.score, 3))

    except Exception as err:
        print("Encountered exception. {}".format(err))
entity_recognition()
```

### Output

```console
Document text: {'id': '1', 'language': 'en', 'text': 'Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800.'}
Entity: 	 Microsoft 	Type: 	 Organization 	Confidence Score: 	 1.0
Entity: 	 Bill Gates 	Type: 	 Person 	Confidence Score: 	 1.0
Entity: 	 Paul Allen 	Type: 	 Person 	Confidence Score: 	 0.999
Entity: 	 April 4, 1975 	Type: 	 DateTime 	Confidence Score: 	 0.8
Entity: 	 Altair 	Type: 	 Organization 	Confidence Score: 	 0.525
Entity: 	 8800 	Type: 	 Quantity 	Confidence Score: 	 0.8

Document text: {'id': '2', 'language': 'es', 'text': 'La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle.'}
Entity: 	 Microsoft 	Type: 	 Organization 	Confidence Score: 	 1.0
Entity: 	 Redmond 	Type: 	 Location 	Confidence Score: 	 0.991
Entity: 	 21 kilómetros 	Type: 	 Quantity 	Confidence Score: 	 0.8
Entity: 	 Seattle 	Type: 	 Location 	Confidence Score: 	 1.0
```

## Key phrase extraction

Using the client created earlier, call the [key_phrases()](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-python#key-phrases-show-stats-none--documents-none--custom-headers-none--raw-false----operation-config-) function and get the result. Then iterate through the results, and print each document's ID, and the key phrases contained in it.

```python
def key_phrases():
    
    client = authenticate_client()

    try:
        documents = [
            {"id": "1", "language": "ja", "text": "猫は幸せ"},
            {"id": "2", "language": "de",
                "text": "Fahrt nach Stuttgart und dann zum Hotel zu Fu."},
            {"id": "3", "language": "en",
                "text": "My cat might need to see a veterinarian."},
            {"id": "4", "language": "es", "text": "A mi me encanta el fútbol!"}
        ]

        for document in documents:
            print(
                "Asking key-phrases on '{}' (id: {})".format(document['text'], document['id']))

        response = client.extract_key_phrases(documents)
        for document in response:
            if not document.is_error:
                print("Document Id: ", document.id)
                print("\tKey Phrases:")
                for phrase in document.key_phrases:
                    print("\t\t", phrase)
            else:
                print(doc.id, doc.error)

    except Exception as err:
        print("Encountered exception. {}".format(err))
        
key_phrases()
```


### Output

```console
Document Id:  1
	Key Phrases:
		 幸せ
Document Id:  2
	Key Phrases:
		 Stuttgart
		 Hotel
		 Fahrt
		 Fu
Document Id:  3
	Key Phrases:
		 cat
		 veterinarian
Document Id:  4
	Key Phrases:
		 fútbol
```
