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

Create a new function called `sentiment()` that creates a client and calls its [analyze_sentiment()]() function. The returned response object will contain the sentiment label and score of the entire input document, as well as a sentiment analysis for each sentence.


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

Create a new function called `language_detection()` which creates a client and calls its  [detect_languages()]() function. The returned response object will contain the detected language in `detected_languages` if successful, and an `error` if not.

> [!Tip]
> In some cases it may be hard to disambiguate languages based on the input. You can use the `country_hint` parameter to specify a 2-letter country code. By default the API is using the "US" as the default countryHint, to remove this behavior you can reset this parameter by setting this value to empty string `country_hint : ""`. 

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
## Key phrase extraction

Create a new function called `key_phrase()` that creates a client and call its [extract_key_phrases()]() function. The result will contain the list of detected key phrases in `key_phrases` if successful, and an `error` if not. Print any detected key phrases.

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
                print(document.id, document.error)

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

## Entity recognition

Create a new function called `entity_recognition` creates a client, then calls its [recognize_entities()]() function and iterate through the results. The returned response object will contain the list of detected entities in `entity` if successful, and an `error` if not. For each detected entity, print its Type and Sub-Type if exists.

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

## Entity Linking

Create a new function called `entity_linking()` that creates a  client then calls its [recognize_linked_entities()]() function and iterate through the results. The returned response object will contain the list of detected entities in `entities` if successful, and an `error` if not. Since linked entities are uniquely identified, occurrences of the same entity are grouped under a `entity` object as a list of `match` objects.

```python
def entity_linking():
    
    client = authenticate_client()

    try:
        documents = [
            {"id": "0", "language": "en", "text": "Microsoft moved its headquarters to Bellevue, Washington in January 1979."},
            {"id": "1", "language": "en", "text": "Steve Ballmer stepped down as CEO of Microsoft and was succeeded by Satya Nadella."},
            {"id": "2", "language": "es", "text": "Microsoft superó a Apple Inc. como la compañía más valiosa que cotiza en bolsa en el mundo."},
        ]
        result = client.recognize_linked_entities(documents)
        docs = [doc for doc in result if not doc.is_error]

        for idx, doc in enumerate(docs):
            print("Document text: {}\n".format(documents[idx]))
            for entity in doc.entities:
                print("Entity: {}".format(entity.name))
                print("Url: {}".format(entity.url))
                print("Data Source: {}".format(entity.data_source))
                for match in entity.matches:
                    print("Score: {0:.3f}".format(match.score))
                    print("Offset: {}".format(match.offset))
                    print("Length: {}\n".format(match.length))
            print("------------------------------------------")

    except Exception as err:
        print("Encountered exception. {}".format(err))
entity_linking()
```

### Output

```console
Document text: {'id': '0', 'language': 'en', 'text': 'Microsoft moved its headquarters to Bellevue, Washington in January 1979.'}

Entity: Bellevue, Washington
Url: https://en.wikipedia.org/wiki/Bellevue,_Washington
Data Source: Wikipedia
Score: 0.774
Offset: 36
Length: 20

Entity: Microsoft
Url: https://en.wikipedia.org/wiki/Microsoft
Data Source: Wikipedia
Score: 0.335
Offset: 0
Length: 9

Entity: Briann January
Url: https://en.wikipedia.org/wiki/Briann_January
Data Source: Wikipedia
Score: 0.059
Offset: 60
Length: 7

------------------------------------------
Document text: {'id': '1', 'language': 'en', 'text': 'Steve Ballmer stepped down as CEO of Microsoft and was succeeded by Satya Nadella.'}

Entity: Steve Ballmer
Url: https://en.wikipedia.org/wiki/Steve_Ballmer
Data Source: Wikipedia
Score: 0.849
Offset: 0
Length: 13

Entity: Satya Nadella
Url: https://en.wikipedia.org/wiki/Satya_Nadella
Data Source: Wikipedia
Score: 0.823
Offset: 68
Length: 13

Entity: Microsoft
Url: https://en.wikipedia.org/wiki/Microsoft
Data Source: Wikipedia
Score: 0.296
Offset: 37
Length: 9

Entity: Chief executive officer
Url: https://en.wikipedia.org/wiki/Chief_executive_officer
Data Source: Wikipedia
Score: 0.196
Offset: 30
Length: 3

------------------------------------------
Document text: {'id': '2', 'language': 'es', 'text': 'Microsoft superó a Apple Inc. como la compañía más valiosa que cotiza en bolsa en el mundo.'}

Entity: Apple
Url: https://es.wikipedia.org/wiki/Apple
Data Source: Wikipedia
Score: 0.833
Offset: 19
Length: 10

Entity: Microsoft
Url: https://es.wikipedia.org/wiki/Microsoft
Data Source: Wikipedia
Score: 0.183
Offset: 0
Length: 9

------------------------------------------
```

## Personal Identifiable Information (PII) Entity recognition

Using the client created earlier, call the [recognize_pii_entities()] function and get the result. Then iterate through the results, and print each document's ID, and the entities contained in it.

```python
def recognize_pii_entities():

        client = authenticate_client()
        documents = [
            {"id": "0", "language": "en", "text": "The employee's SSN is 555-55-5555."},
            {"id": "1", "language": "en", "text": "Your ABA number - 111000025 - is the first 9 digits in the lower left hand corner of your personal check."},
            {"id": "2", "language": "en", "text": "Is 998.214.865-68 your Brazilian CPF number?"}
        ]


        result = client.recognize_pii_entities(documents)
        docs = [doc for doc in result if not doc.is_error]

        for idx, doc in enumerate(docs):
            print("Document text: {}".format(documents[idx]))
            for entity in doc.entities:
                print("Entity: {}".format(entity.text))
                print("Type: {}".format(entity.type))
                print("Confidence Score: {}\n".format(entity.score))
        
recognize_pii_entities()
```

### Output

```console
Document text: {'id': '0', 'language': 'en', 'text': "The employee's SSN is 555-55-5555."}
Entity: 555-55-5555
Type: U.S. Social Security Number (SSN)
Confidence Score: 0.85

Document text: {'id': '1', 'language': 'en', 'text': 'Your ABA number - 111000025 - is the first 9 digits in the lower left hand corner of your personal check.'}
Entity: 111000025
Type: ABA Routing Number
Confidence Score: 0.75

Document text: {'id': '2', 'language': 'en', 'text': 'Is 998.214.865-68 your Brazilian CPF number?'}
Entity: 998.214.865-68
Type: Brazil CPF Number
Confidence Score: 0.85
```