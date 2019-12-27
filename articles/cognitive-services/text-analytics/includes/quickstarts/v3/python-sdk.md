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
pip install azure-ai-textanalytics --pre
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

Create a new function called `sentiment_analysis_example()` that takes the client created earlier, then calls the [analyze_sentiment()]() function. The returned response object will contain the sentiment label and score of the entire input document, as well as a sentiment analysis for each sentence.


```python
def sentiment_analysis_example(client):

    documents = ["I had the best day of my life. I wish you were there with me."]

    response = client.analyze_sentiment(documents)
    for doc in response:
        print("Document Sentiment: {}".format(doc.sentiment))
        print("Overall scores: positive={0:.3f}; neutral={1:.3f}; negative={2:.3f} \n".format(
            doc.document_scores.positive,
            doc.document_scores.neutral,
            doc.document_scores.negative,
        ))
        for idx, sentence in enumerate(doc.sentences):
            print("[Offset: {}, Length: {}]".format(sentence.offset, sentence.length))
            print("Sentence {} sentiment: {}".format(idx+1, sentence.sentiment))
            print("Sentence score:\nPositive={0:.3f}\nNeutral={1:.3f}\nNegative={2:.3f}\n".format(
                sentence.sentence_scores.positive,
                sentence.sentence_scores.neutral,
                sentence.sentence_scores.negative,
            ))

            
sentiment_analysis_example(client)
```

### Output

```console
Document Sentiment: positive
Overall scores: positive=0.999; neutral=0.001; negative=0.000 

[Offset: 0, Length: 30]
Sentence 1 sentiment: positive
Sentence score:
positive=0.999
neutral=0.001
negative=0.000

[Offset: 31, Length: 30]
Sentence 2 sentiment: neutral
Sentence score:
positive=0.212
neutral=0.771
negative=0.017
```

## Language detection

Create a new function called `language_detection_example()` that takes the client created earlier, then calls the [detect_languages()]() function. The returned response object will contain the detected language in `detected_languages` if successful, and an `error` if not.

> [!Tip]
> In some cases it may be hard to disambiguate languages based on the input. You can use the `country_hint` parameter to specify a 2-letter country code. By default the API is using the "US" as the default countryHint, to remove this behavior you can reset this parameter by setting this value to empty string `country_hint : ""`. 

```python
def language_detection_example(client):
    try:
        documents = ["Ce document est rédigé en Français."]
        response = client.detect_languages(documents)
        print("Language: ", response[0].detected_languages[0].name)

    except Exception as err:
        print("Encountered exception. {}".format(err))
language_detection_example(client)
```


### Output

```console
Language:  French
```
## Key phrase extraction

Create a new function called `key_phrase_extraction_example()` that takes the client created earlier, then calls the [extract_key_phrases()]() function. The result will contain the list of detected key phrases in `key_phrases` if successful, and an `error` if not. Print any detected key phrases.

```python
def key_phrase_extraction_example(client):

    try:
        documents = ["My cat might need to see a veterinarian."]

        response = client.extract_key_phrases(documents)
        for document in response:
            if not document.is_error:
                print("\tKey Phrases:")
                for phrase in document.key_phrases:
                    print("\t\t", phrase)
            else:
                print(document.id, document.error)

    except Exception as err:
        print("Encountered exception. {}".format(err))
        
key_phrase_extraction_example(client)
```


### Output

```console
	Key Phrases:
		 cat
		 veterinarian
```

## Entity recognition

Create a new function called `entity_recognition_example` that takes the client created earlier, then calls the [recognize_entities()]() function and iterates through the results. The returned response object will contain the list of detected entities in `entity` if successful, and an `error` if not. For each detected entity, print its Type and Sub-Type if exists.

```python
def entity_recognition_example(client):

    try:
        documents = ["I had a wonderful trip to Seattle last week."]
        result = client.recognize_entities(documents)
        
        print("Named Entities:\n")
        for entity in result[0].entities:
                print("\tText: \t", entity.text, "\tType: \t", entity.type, "\tSubType: \t", entity.subtype,
                      "\n\tOffset: \t", entity.offset, "\tLength: \t", entity.offset, 
                      "\tConfidence Score: \t", round(entity.score, 3), "\n")

    except Exception as err:
        print("Encountered exception. {}".format(err))
entity_recognition_example(client)
```

### Output

```console
Named Entities:

	Text: 	 Seattle 	Type: 	 Location 	SubType: 	 None 
	Offset: 	 26 	Length: 	 26 	Confidence Score: 	 0.806 

	Text: 	 last week 	Type: 	 DateTime 	SubType: 	 DateRange 
	Offset: 	 34 	Length: 	 34 	Confidence Score: 	 0.8 
```

## Entity Linking

Create a new function called `entity_linking_example()` that takes the client created earlier, then calls the [recognize_linked_entities()]() function and iterates through the results. The returned response object will contain the list of detected entities in `entities` if successful, and an `error` if not. Since linked entities are uniquely identified, occurrences of the same entity are grouped under a `entity` object as a list of `match` objects.

```python
def entity_linking_example(client):

    try:
        documents = ["Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, " +
        "to develop and sell BASIC interpreters for the Altair 8800. " +
        "During his career at Microsoft, Gates held the positions of chairman, " +
        "chief executive officer, president and chief software architect, " +
        "while also being the largest individual shareholder until May 2014."]
        result = client.recognize_linked_entities(documents)
        docs = [doc for doc in result if not doc.is_error]

        print("Linked Entities:\n")
        for idx, doc in enumerate(docs):
            for entity in doc.entities:
                print("\tName: ", entity.name, "\tId: ", entity.id, "\tUrl: ", entity.url,
                "\n\tData Source: ", entity.data_source)
                print("\tMatches:")
                for match in entity.matches:
                    print("\t\tText:", match.text)
                    print("\t\tScore: {0:.3f}".format(match.score), "\tOffset: ", match.offset, 
                          "\tLength: {}\n".format(match.length))
            
    except Exception as err:
        print("Encountered exception. {}".format(err))
entity_linking_example(client)
```

### Output

```console
Linked Entities:

	Name:  Altair 8800 	Id:  Altair 8800 	Url:  https://en.wikipedia.org/wiki/Altair_8800 
	Data Source:  Wikipedia
	Matches:
		Text: Altair 8800
		Score: 0.777 	Offset:  116 	Length: 11

	Name:  Bill Gates 	Id:  Bill Gates 	Url:  https://en.wikipedia.org/wiki/Bill_Gates 
	Data Source:  Wikipedia
	Matches:
		Text: Bill Gates
		Score: 0.555 	Offset:  25 	Length: 10

		Text: Gates
		Score: 0.555 	Offset:  161 	Length: 5

	Name:  Paul Allen 	Id:  Paul Allen 	Url:  https://en.wikipedia.org/wiki/Paul_Allen 
	Data Source:  Wikipedia
	Matches:
		Text: Paul Allen
		Score: 0.533 	Offset:  40 	Length: 10

	Name:  Microsoft 	Id:  Microsoft 	Url:  https://en.wikipedia.org/wiki/Microsoft 
	Data Source:  Wikipedia
	Matches:
		Text: Microsoft
		Score: 0.469 	Offset:  0 	Length: 9

		Text: Microsoft
		Score: 0.469 	Offset:  150 	Length: 9

	Name:  April 4 	Id:  April 4 	Url:  https://en.wikipedia.org/wiki/April_4 
	Data Source:  Wikipedia
	Matches:
		Text: April 4
		Score: 0.248 	Offset:  54 	Length: 7

	Name:  BASIC 	Id:  BASIC 	Url:  https://en.wikipedia.org/wiki/BASIC 
	Data Source:  Wikipedia
	Matches:
		Text: BASIC
		Score: 0.281 	Offset:  89 	Length: 5
```

## Personal Identifiable Information (PII) Entity recognition

Create a new functions called `entity_pii_example()` that takes the client created earlier, then calls the [recognize_pii_entities()] function and gets the result. Then iterate through the results and print the PII entities.

```python
def entity_pii_example(client):

        documents = ["Insurance policy for SSN on file 123-12-1234 is here by approved."]


        result = client.recognize_pii_entities(documents)
        docs = [doc for doc in result if not doc.is_error]

        print("Personally Identifiable Information Entities: ")
        for idx, doc in enumerate(docs):
            for entity in doc.entities:
                print("\tText: ",entity.text,"\tType: ", entity.type,"\tSub-Type: ", entity.subtype)
                print("\t\tOffset: ", entity.offset, "\tLength: ", entity.length, "\tScore: {0:.3f}".format(entity.score), "\n")
        
entity_pii_example(client)
```

### Output

```console
Personally Identifiable Information Entities: 
	Text:  123-12-1234 	Type:  U.S. Social Security Number (SSN) 	Sub-Type:  
		Offset:  33 	Length:  11 	Score: 0.850 
```