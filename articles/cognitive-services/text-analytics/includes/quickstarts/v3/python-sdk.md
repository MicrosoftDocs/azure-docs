---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 01/13/2019
ms.author: aahi
---

<a name="HOLTop"></a>

[Reference documentation](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-textanalytics/1.0.0b1/azure.ai.textanalytics.html) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics) | [Package (PiPy)](https://pypi.org/project/azure-ai-textanalytics/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics/azure-ai-textanalytics/samples)

> [!NOTE]
> * This quickstart uses version `3.0-preview` of the Text Analytics client library, which includes a public preview for improved [Sentiment Analysis](../../../how-tos/text-analytics-how-to-sentiment-analysis.md#sentiment-analysis-versions-and-features) and [Named Entity Recognition (NER)](../../../how-tos/text-analytics-how-to-entity-linking.md#named-entity-recognition-versions-and-features).
> * The code in this article uses synchronous methods and un-secured credentials storage for simplicity reasons. For production scenarios, we recommend using the batched asynchronous methods for performance and scalability. For example, importing the client from the `azure.ai.textanalytics.aio` namespace and calling `analyze_sentiment()`, instead of `analyze_sentiment()` from the `azure.ai.textanalytics` namespace.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* [Python 3.x](https://www.python.org/)

## Setting up

### Create a Text Analytics Azure resource

[!INCLUDE [text-analytics-resource-creation](../resource-creation.md)]

### Install the client library

After installing Python, you can install the client library with:

```console
pip install azure-ai-textanalytics
```

### Create a new python application

Create a new Python file and create variables for your resource's Azure endpoint and subscription key.

[!INCLUDE [text-analytics-find-resource-information](../../find-azure-resource-info.md)]

```python
key = "<paste-your-text-analytics-key-here>"
endpoint = "<paste-your-text-analytics-endpoint-here>"
```


## Object model

The Text Analytics client is a `TextAnalyticsClient` object that authenticates to Azure using your key. The client provides several methods for analyzing text as a batch. This quickstart uses a collection of functions to quickly send single documents.

When batch processing text is sent to the API as a list of `documents`, which are `dictionary` objects containing a combination of `id`, `text`, and `language` attributes depending on the method used. The `text` attribute stores the text to be analyzed in the origin `language`, and the `id` can be any value. When processing single documents, only a `text` input is needed as can be seen in the examples below.  

The response object is a list containing the analysis information for each document. 

## Code examples

These code snippets show you how to do the following tasks with the Text Analytics client library for Python:

* [Sentiment Analysis](#sentiment-analysis) (public preview)
* [Language detection](#language-detection)
* [Named Entity recognition](#named-entity-recognition-public-preview) (public preview)
* [Named Entity recognition - personal information](#named-entity-recognition---personal-information-public-preview) (public preview)
* [Entity linking](#entity-linking)
* [Key phrase extraction](#key-phrase-extraction)

## Sentiment analysis

> [!NOTE]
> The below code is for sentiment analysis v3, which is in public preview.

Create a new function called `sentiment_analysis_example()` that takes the endpoint and key as arguments, then calls the `single_analyze_sentiment()` function. The returned response object will contain the sentiment label and score of the entire input document, as well as a sentiment analysis for each sentence.


```python
from azure.ai.textanalytics import single_analyze_sentiment

def sentiment_analysis_example(endpoint, key):

    document = "I had the best day of my life. I wish you were there with me."

    response = single_analyze_sentiment(endpoint=endpoint, credential=key, input_text=document)
    print("Document Sentiment: {}".format(response.sentiment))
    print("Overall scores: positive={0:.3f}; neutral={1:.3f}; negative={2:.3f} \n".format(
        response.document_scores.positive,
        response.document_scores.neutral,
        response.document_scores.negative,
    ))
    for idx, sentence in enumerate(response.sentences):
        print("[Offset: {}, Length: {}]".format(sentence.offset, sentence.length))
        print("Sentence {} sentiment: {}".format(idx+1, sentence.sentiment))
        print("Sentence score:\nPositive={0:.3f}\nNeutral={1:.3f}\nNegative={2:.3f}\n".format(
            sentence.sentence_scores.positive,
            sentence.sentence_scores.neutral,
            sentence.sentence_scores.negative,
        ))

            
sentiment_analysis_example(endpoint, key)
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

Create a new function called `language_detection_example()` that takes the endpoint and key as arguments, then calls the `single_detect_languages()` function. The returned response object will contain the detected language in `detected_languages` if successful, and an `error` if not.

> [!Tip]
> In some cases it may be hard to disambiguate languages based on the input. You can use the `country_hint` parameter to specify a 2-letter country code. By default the API is using the "US" as the default countryHint, to remove this behavior you can reset this parameter by setting this value to empty string `country_hint : ""`. 

```python
from azure.ai.textanalytics import single_detect_language

def language_detection_example(endpoint, key):
    try:
        document = "Ce document est rédigé en Français."
        response = single_detect_language(endpoint=endpoint, credential=key, input_text= document)
        print("Language: ", response.primary_language.name)

    except Exception as err:
        print("Encountered exception. {}".format(err))
language_detection_example(endpoint, key)
```


### Output

```console
Language:  French
```

## Named Entity recognition (public preview)

> [!NOTE]
> The below code is for Named Entity Recognition v3, which is in public preview.

Create a new function called `entity_recognition_example` that takes the endpoint and key as arguments, then calls the `single_recognize_entities()` function and iterates through the results. The returned response object will contain the list of detected entities in `entity` if successful, and an `error` if not. For each detected entity, print its Type and Sub-Type if exists.

```python
from azure.ai.textanalytics import single_recognize_entities

def entity_recognition_example(endpoint, key):

    try:
        document = "I had a wonderful trip to Seattle last week."
        result = single_recognize_entities(endpoint=endpoint, credential=key, input_text= document)
        
        print("Named Entities:\n")
        for entity in result.entities:
                print("\tText: \t", entity.text, "\tType: \t", entity.type, "\tSubType: \t", entity.subtype,
                      "\n\tOffset: \t", entity.offset, "\tLength: \t", entity.offset, 
                      "\tConfidence Score: \t", round(entity.score, 3), "\n")

    except Exception as err:
        print("Encountered exception. {}".format(err))
entity_recognition_example(endpoint, key)
```

### Output

```console
Named Entities:

	Text: 	 Seattle 	Type: 	 Location 	SubType: 	 None 
	Offset: 	 26 	Length: 	 26 	Confidence Score: 	 0.806 

	Text: 	 last week 	Type: 	 DateTime 	SubType: 	 DateRange 
	Offset: 	 34 	Length: 	 34 	Confidence Score: 	 0.8 
```

## Named Entity Recognition - personal information (public preview)

> [!NOTE]
> The below code is for detecting personal information using Named Entity Recognition v3, which is in public preview.

Create a new function called `entity_pii_example()` that takes the endpoint and key as arguments, then calls the `single_recognize_pii_entities()` function and gets the result. Then iterate through the results and print the entities.

```python
from azure.ai.textanalytics import single_recognize_pii_entities

def entity_pii_example(endpoint, key):

        document = "Insurance policy for SSN on file 123-12-1234 is here by approved."


        result = single_recognize_pii_entities(endpoint=endpoint, credential=key, input_text= document)
        
        print("Personally Identifiable Information Entities: ")
        for entity in result.entities:
            print("\tText: ",entity.text,"\tType: ", entity.type,"\tSub-Type: ", entity.subtype)
            print("\t\tOffset: ", entity.offset, "\tLength: ", entity.length, "\tScore: {0:.3f}".format(entity.score), "\n")
        
entity_pii_example(endpoint, key)
```

### Output

```console
Personally Identifiable Information Entities: 
	Text:  123-12-1234 	Type:  U.S. Social Security Number (SSN) 	Sub-Type:  
		Offset:  33 	Length:  11 	Score: 0.850 
```

## Entity Linking

Create a new function called `entity_linking_example()` that takes the endpoint and key as arguments, then calls the `single_recognize_linked_entities()` function and iterates through the results. The returned response object will contain the list of detected entities in `entities` if successful, and an `error` if not. Since linked entities are uniquely identified, occurrences of the same entity are grouped under a `entity` object as a list of `match` objects.

```python
from azure.ai.textanalytics import single_recognize_linked_entities

def entity_linking_example(endpoint, key):

    try:
        document = """Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, 
        to develop and sell BASIC interpreters for the Altair 8800. 
        During his career at Microsoft, Gates held the positions of chairman,
        chief executive officer, president and chief software architect, 
        while also being the largest individual shareholder until May 2014."""
        result = single_recognize_linked_entities(endpoint=endpoint, credential=key, input_text= document)

        print("Linked Entities:\n")
        for entity in result.entities:
            print("\tName: ", entity.name, "\tId: ", entity.id, "\tUrl: ", entity.url,
            "\n\tData Source: ", entity.data_source)
            print("\tMatches:")
            for match in entity.matches:
                print("\t\tText:", match.text)
                print("\t\tScore: {0:.3f}".format(match.score), "\tOffset: ", match.offset, 
                      "\tLength: {}\n".format(match.length))
            
    except Exception as err:
        print("Encountered exception. {}".format(err))
entity_linking_example(endpoint, key)
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

## Key phrase extraction

Create a new function called `key_phrase_extraction_example()` that takes the endpoint and key as arguments, then calls the `single_extract_key_phrases()` function. The result will contain the list of detected key phrases in `key_phrases` if successful, and an `error` if not. Print any detected key phrases.

```python
from azure.ai.textanalytics import single_extract_key_phrases

def key_phrase_extraction_example(endpoint, key):

    try:
        document = "My cat might need to see a veterinarian."

        response = single_extract_key_phrases(endpoint=endpoint, credential=key, input_text= document)

        if not response.is_error:
            print("\tKey Phrases:")
            for phrase in response.key_phrases:
                print("\t\t", phrase)
        else:
            print(response.id, response.error)

    except Exception as err:
        print("Encountered exception. {}".format(err))
        
key_phrase_extraction_example(endpoint, key)
```


### Output

```console
	Key Phrases:
		 cat
		 veterinarian
```