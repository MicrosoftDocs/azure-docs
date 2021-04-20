---
author: aahill
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include
ms.date: 04/19/2021
ms.author: aahi
---

<a name="HOLTop"></a>

# [Version 3.1 preview](#tab/version-3-1)

[v3.1 Reference documentation](/python/api/azure-ai-textanalytics/azure.ai.textanalytics) | [v3.1 Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics/azure-ai-textanalytics) | [v3.1 Package (PiPy)](https://pypi.org/project/azure-ai-textanalytics/) | [v3.1 Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics/azure-ai-textanalytics/samples)

# [Version 3.0](#tab/version-3)

[v3 Reference documentation](/python/api/azure-ai-textanalytics/azure.ai.textanalytics) | [v3 Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics) | [v3 Package (PiPy)](https://pypi.org/project/azure-ai-textanalytics/) | [v3 Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics/azure-ai-textanalytics/samples)

---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Python 3.x](https://www.python.org/)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Text Analytics resource"  target="_blank">create a Text Analytics resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Text Analytics API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Text Analytics resource with the standard (S) pricing tier.

## Setting up

### Install the client library

After installing Python, you can install the client library with:

# [Version 3.1 preview](#tab/version-3-1)

```console
pip install azure-ai-textanalytics --pre
```

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it [on GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/TextAnalytics/python-v3-client-library.py), which contains the code examples in this quickstart. 

# [Version 3.0](#tab/version-3)

```console
pip install --upgrade azure-ai-textanalytics
```

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it [on GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/TextAnalytics/python-v3-client-library.py), which contains the code examples in this quickstart. 


---

### Create a new python application

Create a new Python file and create variables for your resource's Azure endpoint and subscription key.

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

```python
key = "<paste-your-text-analytics-key-here>"
endpoint = "<paste-your-text-analytics-endpoint-here>"
```


## Object model

# [Version 3.1 preview](#tab/version-3-1)

The Text Analytics client is a `TextAnalyticsClient` object that authenticates to Azure. The client provides several methods for analyzing text. 

When processing text is sent to the API as a list of `documents`, which is either as a list of string, a list of dict-like representation, or as a list of `TextDocumentInput/DetectLanguageInput`. A `dict-like` object contains a combination of `id`, `text`, and `language/country_hint`. The `text` attribute stores the text to be analyzed in the origin `country_hint`, and the `id` can be any value. 

The response object is a list containing the analysis information for each document. 

# [Version 3.0](#tab/version-3)

The Text Analytics client is a `TextAnalyticsClient` object that authenticates to Azure using your key. The client provides several methods for analyzing text as a batch. 

When batch processing text is sent to the API as a list of `documents`, which are `dictionary` objects containing a combination of `id`, `text`, and `language` attributes depending on the method used. The `text` attribute stores the text to be analyzed in the origin `language`, and the `id` can be any value. 

The response object is a list containing the analyzed information for each document. 

---

## Code examples

These code snippets show you how to do the following tasks with the Text Analytics client library for Python:

# [Version 3.1 preview](#tab/version-3-1)

* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis)
* [Opinion mining](#opinion-mining)
* [Language detection](#language-detection)
* [Named Entity recognition](#named-entity-recognition-ner) 
* [Personally Identifiable Information recognition](#personally-identifiable-information-recognition) 
* [Entity linking](#entity-linking)
* [Key phrase extraction](#key-phrase-extraction)


# [Version 3.0](#tab/version-3)

* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis)
* [Language detection](#language-detection)
* [Named Entity recognition](#named-entity-recognition-ner) 
* [Entity linking](#entity-linking)
* [Key phrase extraction](#key-phrase-extraction)

---

## Authenticate the client

# [Version 3.1 preview](#tab/version-3-1)

Create a function to instantiate the `TextAnalyticsClient` object with your `key` AND `endpoint` created above. Then create a new client. 

```python
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

def authenticate_client():
    ta_credential = AzureKeyCredential(key)
    text_analytics_client = TextAnalyticsClient(
            endpoint=endpoint, 
            credential=ta_credential)
    return text_analytics_client

client = authenticate_client()
```

# [Version 3.0](#tab/version-3)

Create a function to instantiate the `TextAnalyticsClient` object with your `key` AND `endpoint` created above. Then create a new client. Note that `api_version=TextAnalyticsApiVersion.V3_0` should be defined for using version 3.0.

```python
# use this code if you're using SDK version is 5.0.0
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

def authenticate_client():
    ta_credential = AzureKeyCredential(key)
    text_analytics_client = TextAnalyticsClient(
            endpoint=endpoint, 
            credential=ta_credential) 
    return text_analytics_client

client = authenticate_client()
```

If you installed v5.1.0 of the client library using `pip install azure-ai-textanalytics --pre`, you can specify v3.0 of the Text Analytics API with the client's `api_version` parameter. Only use the following `authenticate_client()` method if your client is v5.1.0 or later.

```python
# Only use the following code sample if you're using v5.1.0 of the client library, 
# and are looking to specify v3.0 of the Text Analytics API for your client
from azure.ai.textanalytics import TextAnalyticsClient, TextAnalyticsApiVersion
from azure.core.credentials import AzureKeyCredential
def authenticate_client():
   ta_credential = AzureKeyCredential(key)
   text_analytics_client = TextAnalyticsClient(
     endpoint=endpoint,
     credential=ta_credential,
     api_version=TextAnalyticsApiVersion.V3_0
   )
   
client = authenticate_client()
```

--- 

## Sentiment analysis

# [Version 3.1 preview](#tab/version-3-1)

Create a new function called `sentiment_analysis_example()` that takes the client as an argument, then calls the `analyze_sentiment()` function. The returned response object will contain the sentiment label and score of the entire input document, as well as a sentiment analysis for each sentence.


```python
def sentiment_analysis_example(client):

    documents = ["I had the best day of my life. I wish you were there with me."]
    response = client.analyze_sentiment(documents=documents)[0]
    print("Document Sentiment: {}".format(response.sentiment))
    print("Overall scores: positive={0:.2f}; neutral={1:.2f}; negative={2:.2f} \n".format(
        response.confidence_scores.positive,
        response.confidence_scores.neutral,
        response.confidence_scores.negative,
    ))
    for idx, sentence in enumerate(response.sentences):
        print("Sentence: {}".format(sentence.text))
        print("Sentence {} sentiment: {}".format(idx+1, sentence.sentiment))
        print("Sentence score:\nPositive={0:.2f}\nNeutral={1:.2f}\nNegative={2:.2f}\n".format(
            sentence.confidence_scores.positive,
            sentence.confidence_scores.neutral,
            sentence.confidence_scores.negative,
        ))
          
sentiment_analysis_example(client)
```

### Output

```console
Document Sentiment: positive
Overall scores: positive=1.00; neutral=0.00; negative=0.00 

Sentence: I had the best day of my life.
Sentence 1 sentiment: positive
Sentence score:
Positive=1.00
Neutral=0.00
Negative=0.00

Sentence: I wish you were there with me.
Sentence 2 sentiment: neutral
Sentence score:
Positive=0.21
Neutral=0.77
Negative=0.02
```

## Opinion mining

In order to do sentiment analysis with opinion mining, create a new function called `sentiment_analysis_with_opinion_mining_example()` that takes the client as an argument, then calls the `analyze_sentiment()` function with option flag `show_opinion_mining=True`. The returned response object will contain not only the sentiment label and score of the entire input document with sentiment analysis for each sentence, but also aspect and opinion level sentiment analysis.


```python
def sentiment_analysis_with_opinion_mining_example(client):

    documents = [
        "The food and service were unacceptable, but the concierge were nice"
    ]

    result = client.analyze_sentiment(documents, show_opinion_mining=True)
    doc_result = [doc for doc in result if not doc.is_error]

    positive_reviews = [doc for doc in doc_result if doc.sentiment == "positive"]
    negative_reviews = [doc for doc in doc_result if doc.sentiment == "negative"]

    positive_mined_opinions = []
    mixed_mined_opinions = []
    negative_mined_opinions = []

    for document in doc_result:
        print("Document Sentiment: {}".format(document.sentiment))
        print("Overall scores: positive={0:.2f}; neutral={1:.2f}; negative={2:.2f} \n".format(
            document.confidence_scores.positive,
            document.confidence_scores.neutral,
            document.confidence_scores.negative,
        ))
        for sentence in document.sentences:
            print("Sentence: {}".format(sentence.text))
            print("Sentence sentiment: {}".format(sentence.sentiment))
            print("Sentence score:\nPositive={0:.2f}\nNeutral={1:.2f}\nNegative={2:.2f}\n".format(
                sentence.confidence_scores.positive,
                sentence.confidence_scores.neutral,
                sentence.confidence_scores.negative,
            ))
            for mined_opinion in sentence.mined_opinions:
                target = mined_opinion.target
                print("......'{}' target '{}'".format(target.sentiment, target.text))
                print("......Target score:\n......Positive={0:.2f}\n......Negative={1:.2f}\n".format(
                    target.confidence_scores.positive,
                    target.confidence_scores.negative,
                ))
                for assessment in mined_opinion.assessments:
                    print("......'{}' assessment '{}'".format(assessment.sentiment, assessment.text))
                    print("......Assessment score:\n......Positive={0:.2f}\n......Negative={1:.2f}\n".format(
                        assessment.confidence_scores.positive,
                        assessment.confidence_scores.negative,
                    ))
            print("\n")
        print("\n")
          
sentiment_analysis_with_opinion_mining_example(client)
```

### Output

```console
Document Sentiment: positive
Overall scores: positive=0.84; neutral=0.00; negative=0.16

Sentence: The food and service were unacceptable, but the concierge were nice
Sentence sentiment: positive
Sentence score:
Positive=0.84
Neutral=0.00
Negative=0.16

......'negative' target 'food'
......Target score:
......Positive=0.01
......Negative=0.99

......'negative' assessment 'unacceptable'
......Assessment score:
......Positive=0.01
......Negative=0.99

......'negative' target 'service'
......Target score:
......Positive=0.01
......Negative=0.99

......'negative' assessment 'unacceptable'
......Assessment score:
......Positive=0.01
......Negative=0.99

......'positive' target 'concierge'
......Target score:
......Positive=1.00
......Negative=0.00

......'positive' assessment 'nice'
......Assessment score:
......Positive=1.00
......Negative=0.00





Press any key to continue . . .

```

# [Version 3.0](#tab/version-3)

Create a new function called `sentiment_analysis_example()` that takes the client as an argument, then calls the `analyze_sentiment()` function. The returned response object will contain the sentiment label and score of the entire input document, as well as a sentiment analysis for each sentence.


```python
def sentiment_analysis_example(client):

    documents = ["I had the best day of my life. I wish you were there with me."]
    response = client.analyze_sentiment(documents = documents)[0]
    print("Document Sentiment: {}".format(response.sentiment))
    print("Overall scores: positive={0:.2f}; neutral={1:.2f}; negative={2:.2f} \n".format(
        response.confidence_scores.positive,
        response.confidence_scores.neutral,
        response.confidence_scores.negative,
    ))
    for idx, sentence in enumerate(response.sentences):
        print("Sentence: {}".format(sentence.text))
        print("Sentence {} sentiment: {}".format(idx+1, sentence.sentiment))
        print("Sentence score:\nPositive={0:.2f}\nNeutral={1:.2f}\nNegative={2:.2f}\n".format(
            sentence.confidence_scores.positive,
            sentence.confidence_scores.neutral,
            sentence.confidence_scores.negative,
        ))
          
sentiment_analysis_example(client)
```

### Output

```console
Document Sentiment: positive
Overall scores: positive=1.00; neutral=0.00; negative=0.00 

Sentence: I had the best day of my life.
Sentence 1 sentiment: positive
Sentence score:
Positive=1.00
Neutral=0.00
Negative=0.00

Sentence: I wish you were there with me.
Sentence 2 sentiment: neutral
Sentence score:
Positive=0.21
Neutral=0.77
Negative=0.02
```

---

## Language detection

# [Version 3.1 preview](#tab/version-3-1)

Create a new function called `language_detection_example()` that takes the client as an argument, then calls the `detect_language()` function. The returned response object will contain the detected language in `primary_language` if successful, and an `error` if not.

> [!Tip]
> In some cases it may be hard to disambiguate languages based on the input. You can use the `country_hint` parameter to specify a 2-letter country code. By default the API is using the "US" as the default countryHint, to remove this behavior you can reset this parameter by setting this value to empty string `country_hint : ""`. 

```python
def language_detection_example(client):
    try:
        documents = ["Ce document est rédigé en Français."]
        response = client.detect_language(documents = documents, country_hint = 'us')[0]
        print("Language: ", response.primary_language.name)

    except Exception as err:
        print("Encountered exception. {}".format(err))
language_detection_example(client)
```


### Output

```console
Language:  French
```

# [Version 3.0](#tab/version-3)

Create a new function called `language_detection_example()` that takes the client as an argument, then calls the `detect_language()` function. The returned response object will contain the detected language in `primary_language` if successful, and an `error` if not.

> [!Tip]
> In some cases it may be hard to disambiguate languages based on the input. You can use the `country_hint` parameter to specify a 2-letter country code. By default the API is using the "US" as the default countryHint, to remove this behavior you can reset this parameter by setting this value to empty string `country_hint : ""`. 

```python
def language_detection_example(client):
    try:
        documents = ["Ce document est rédigé en Français."]
        response = client.detect_language(documents = documents, country_hint = 'us')[0]
        print("Language: ", response.primary_language.name)

    except Exception as err:
        print("Encountered exception. {}".format(err))
language_detection_example(client)
```


### Output

```console
Language:  French
```


---

## Named Entity recognition (NER)

# [Version 3.1 preview](#tab/version-3-1)

> [!NOTE]
> In version `3.1`: 
> * Entity linking is a separate request than NER.

Create a new function called `entity_recognition_example` that takes the client as an argument, then calls the `recognize_entities()` function and iterates through the results. The returned response object will contain the list of detected entities in `entity` if successful, and an `error` if not. For each detected entity, print its Category and Sub-Category if exists.

```python
def entity_recognition_example(client):

    try:
        documents = ["I had a wonderful trip to Seattle last week."]
        result = client.recognize_entities(documents = documents)[0]

        print("Named Entities:\n")
        for entity in result.entities:
            print("\tText: \t", entity.text, "\tCategory: \t", entity.category, "\tSubCategory: \t", entity.subcategory,
                    "\n\tConfidence Score: \t", round(entity.confidence_score, 2), "\tLength: \t", entity.length, "\tOffset: \t", entity.offset, "\n")

    except Exception as err:
        print("Encountered exception. {}".format(err))
entity_recognition_example(client)
```

### Output

```console
Named Entities:

        Text:    trip   Category:        Event  SubCategory:     None
        Confidence Score:        0.61   Length:          4      Offset:          18

        Text:    Seattle        Category:        Location       SubCategory:     GPE
        Confidence Score:        0.82   Length:          7      Offset:          26

        Text:    last week      Category:        DateTime       SubCategory:     DateRange
        Confidence Score:        0.8    Length:          9      Offset:          34
```

### Entity Linking

Create a new function called `entity_linking_example()` that takes the client as an argument, then calls the `recognize_linked_entities()` function and iterates through the results. The returned response object will contain the list of detected entities in `entities` if successful, and an `error` if not. Since linked entities are uniquely identified, occurrences of the same entity are grouped under a `entity` object as a list of `match` objects.

```python
def entity_linking_example(client):

    try:
        documents = ["""Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, 
        to develop and sell BASIC interpreters for the Altair 8800. 
        During his career at Microsoft, Gates held the positions of chairman,
        chief executive officer, president and chief software architect, 
        while also being the largest individual shareholder until May 2014."""]
        result = client.recognize_linked_entities(documents = documents)[0]

        print("Linked Entities:\n")
        for entity in result.entities:
            print("\tName: ", entity.name, "\tId: ", entity.data_source_entity_id, "\tUrl: ", entity.url,
            "\n\tData Source: ", entity.data_source)
            print("\tMatches:")
            for match in entity.matches:
                print("\t\tText:", match.text)
                print("\t\tConfidence Score: {0:.2f}".format(match.confidence_score))
                print("\t\tOffset: {}".format(match.offset))
                print("\t\tLength: {}".format(match.length))
            
    except Exception as err:
        print("Encountered exception. {}".format(err))
entity_linking_example(client)
```

### Output

```console
Linked Entities:

        Name:  Microsoft        Id:  Microsoft  Url:  https://en.wikipedia.org/wiki/Microsoft
        Data Source:  Wikipedia
        Matches:
                Text: Microsoft
                Confidence Score: 0.55
                Offset: 0
                Length: 9
                Text: Microsoft
                Confidence Score: 0.55
                Offset: 168
                Length: 9
        Name:  Bill Gates       Id:  Bill Gates         Url:  https://en.wikipedia.org/wiki/Bill_Gates
        Data Source:  Wikipedia
        Matches:
                Text: Bill Gates
                Confidence Score: 0.63
                Offset: 25
                Length: 10
                Text: Gates
                Confidence Score: 0.63
                Offset: 179
                Length: 5
        Name:  Paul Allen       Id:  Paul Allen         Url:  https://en.wikipedia.org/wiki/Paul_Allen
        Data Source:  Wikipedia
        Matches:
                Text: Paul Allen
                Confidence Score: 0.60
                Offset: 40
                Length: 10
        Name:  April 4  Id:  April 4    Url:  https://en.wikipedia.org/wiki/April_4
        Data Source:  Wikipedia
        Matches:
                Text: April 4
                Confidence Score: 0.32
                Offset: 54
                Length: 7
        Name:  BASIC    Id:  BASIC      Url:  https://en.wikipedia.org/wiki/BASIC
        Data Source:  Wikipedia
        Matches:
                Text: BASIC
                Confidence Score: 0.33
                Offset: 98
                Length: 5
        Name:  Altair 8800      Id:  Altair 8800        Url:  https://en.wikipedia.org/wiki/Altair_8800
        Data Source:  Wikipedia
        Matches:
                Text: Altair 8800
                Confidence Score: 0.88
                Offset: 125
                Length: 11
```

### Personally Identifiable Information recognition

Create a new function called `pii_recognition_example` that takes the client as an argument, then calls the `recognize_pii_entities()` function and iterates through the results. The returned response object will contain the list of detected entities in `entity` if successful, and an `error` if not. For each detected entity, print its Category and Sub-Category if exists.

```python
def pii_recognition_example(client):
    documents = [
        "The employee's SSN is 859-98-0987.",
        "The employee's phone number is 555-555-5555."
    ]
    response = client.recognize_pii_entities(documents, language="en")
    result = [doc for doc in response if not doc.is_error]
    for doc in result:
        print("Redacted Text: {}".format(doc.redacted_text))
        for entity in doc.entities:
            print("Entity: {}".format(entity.text))
            print("\tCategory: {}".format(entity.category))
            print("\tConfidence Score: {}".format(entity.confidence_score))
            print("\tOffset: {}".format(entity.offset))
            print("\tLength: {}".format(entity.length))
pii_recognition_example(client)
```

### Output

```console
Redacted Text: The employee's SSN is ***********.
Entity: 859-98-0987
        Category: U.S. Social Security Number (SSN)
        Confidence Score: 0.65
        Offset: 22
        Length: 11
Redacted Text: The employee's phone number is ************.
Entity: 555-555-5555
        Category: Phone Number
        Confidence Score: 0.8
        Offset: 31
        Length: 12
```

# [Version 3.0](#tab/version-3)

> [!NOTE]
> In version `3.0`: 
> * Entity linking is a separate request than NER.

Create a new function called `entity_recognition_example` that takes the client as an argument, then calls the `recognize_entities()` function and iterates through the results. The returned response object will contain the list of detected entities in `entity` if successful, and an `error` if not. For each detected entity, print its Category and Sub-Category if exists.

```python
def entity_recognition_example(client):

    try:
        documents = ["I had a wonderful trip to Seattle last week."]
        result = client.recognize_entities(documents = documents)[0]

        print("Named Entities:\n")
        for entity in result.entities:
            print("\tText: \t", entity.text, "\tCategory: \t", entity.category, "\tSubCategory: \t", entity.subcategory,
                    "\n\tConfidence Score: \t", round(entity.confidence_score, 2), "\n")

    except Exception as err:
        print("Encountered exception. {}".format(err))
entity_recognition_example(client)
```

### Output

```console
Named Entities:

        Text:    trip   Category:        Event  SubCategory:     None
        Confidence Score:        0.61

        Text:    Seattle        Category:        Location       SubCategory:     GPE
        Confidence Score:        0.82

        Text:    last week      Category:        DateTime       SubCategory:     DateRange
        Confidence Score:        0.8
```

### Entity Linking

Create a new function called `entity_linking_example()` that takes the client as an argument, then calls the `recognize_linked_entities()` function and iterates through the results. The returned response object will contain the list of detected entities in `entities` if successful, and an `error` if not. Since linked entities are uniquely identified, occurrences of the same entity are grouped under a `entity` object as a list of `match` objects.

```python
def entity_linking_example(client):

    try:
        documents = ["""Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, 
        to develop and sell BASIC interpreters for the Altair 8800. 
        During his career at Microsoft, Gates held the positions of chairman,
        chief executive officer, president and chief software architect, 
        while also being the largest individual shareholder until May 2014."""]
        result = client.recognize_linked_entities(documents = documents)[0]

        print("Linked Entities:\n")
        for entity in result.entities:
            print("\tName: ", entity.name, "\tId: ", entity.data_source_entity_id, "\tUrl: ", entity.url,
            "\n\tData Source: ", entity.data_source)
            print("\tMatches:")
            for match in entity.matches:
                print("\t\tText:", match.text)
                print("\t\tConfidence Score: {0:.2f}".format(match.confidence_score))
            
    except Exception as err:
        print("Encountered exception. {}".format(err))
entity_linking_example(client)
```

### Output

```console
Linked Entities:

        Name:  Altair 8800      Id:  Altair 8800        Url:  https://en.wikipedia.org/wiki/Altair_8800
        Data Source:  Wikipedia
        Matches:
                Text: Altair 8800
                Confidence Score: 0.88
        Name:  Bill Gates       Id:  Bill Gates         Url:  https://en.wikipedia.org/wiki/Bill_Gates
        Data Source:  Wikipedia
        Matches:
                Text: Bill Gates
                Confidence Score: 0.63
                Text: Gates
                Confidence Score: 0.63
        Name:  Paul Allen       Id:  Paul Allen         Url:  https://en.wikipedia.org/wiki/Paul_Allen
        Data Source:  Wikipedia
        Matches:
                Text: Paul Allen
                Confidence Score: 0.60
        Name:  Microsoft        Id:  Microsoft  Url:  https://en.wikipedia.org/wiki/Microsoft
        Data Source:  Wikipedia
        Matches:
                Text: Microsoft
                Confidence Score: 0.55
                Text: Microsoft
                Confidence Score: 0.55
        Name:  April 4  Id:  April 4    Url:  https://en.wikipedia.org/wiki/April_4
        Data Source:  Wikipedia
        Matches:
                Text: April 4
                Confidence Score: 0.32
        Name:  BASIC    Id:  BASIC      Url:  https://en.wikipedia.org/wiki/BASIC
        Data Source:  Wikipedia
        Matches:
                Text: BASIC
                Confidence Score: 0.33
```

---

### Key phrase extraction

# [Version 3.1 preview](#tab/version-3-1)

Create a new function called `key_phrase_extraction_example()` that takes the client as an argument, then calls the `extract_key_phrases()` function. The result will contain the list of detected key phrases in `key_phrases` if successful, and an `error` if not. Print any detected key phrases.

```python
def key_phrase_extraction_example(client):

    try:
        documents = ["My cat might need to see a veterinarian."]

        response = client.extract_key_phrases(documents = documents)[0]

        if not response.is_error:
            print("\tKey Phrases:")
            for phrase in response.key_phrases:
                print("\t\t", phrase)
        else:
            print(response.id, response.error)

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

# [Version 3.0](#tab/version-3)

Create a new function called `key_phrase_extraction_example()` that takes the client as an argument, then calls the `extract_key_phrases()` function. The result will contain the list of detected key phrases in `key_phrases` if successful, and an `error` if not. Print any detected key phrases.

```python
def key_phrase_extraction_example(client):

    try:
        documents = ["My cat might need to see a veterinarian."]

        response = client.extract_key_phrases(documents = documents)[0]

        if not response.is_error:
            print("\tKey Phrases:")
            for phrase in response.key_phrases:
                print("\t\t", phrase)
        else:
            print(response.id, response.error)

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


---

## Use the API asynchronously with the batch analyze operation

# [Version 3.1 preview](#tab/version-3-1)

[!INCLUDE [Analyze operation pricing](../analyze-operation-pricing-caution.md)]

Create a new function called `analyze_batch_actions_example()` that takes the client as an argument, then calls the `begin_analyze_batch_actions()` function. The result will be a long running operation which will be polled for results.

```python
from azure.ai.textanalytics import (
    RecognizeEntitiesAction
)

def analyze_batch_example(client):
        documents = [
            "Microsoft was founded by Bill Gates and Paul Allen."
        ]

        poller = client.begin_analyze_batch_actions(
            documents,
            display_name="Sample Text Analysis",
            actions=[RecognizeEntitiesAction()]
        )

        result = poller.result()
        action_results = [action_result for action_result in list(result) if not action_result.is_error]

        entities_recognition_task_result = action_results[0]
        print("Results of Entities Recognition action:")
        docs = [doc for doc in entities_recognition_task_result.document_results if not doc.is_error]

        for idx, doc in enumerate(docs):
            print("\nDocument text: {}".format(documents[idx]))
            for entity in doc.entities:
                print("Entity: {}".format(entity.text))
                print("...Category: {}".format(entity.category))
                print("...Confidence Score: {}".format(entity.confidence_score))
                print("...Offset: {}".format(entity.offset))
            print("------------------------------------------")

analyze_batch_example(client)
```

### Output

```console
Results of Entities Recognition task:
Document text: Microsoft was founded by Bill Gates and Paul Allen.
Entity: Microsoft
...Category: Organization
...Confidence Score: 0.83
...Offset: 0
Entity: Bill Gates
...Category: Person
...Confidence Score: 0.85
...Offset: 25
Entity: Paul Allen
...Category: Person
...Confidence Score: 0.9
...Offset: 40
------------------------------------------
```

You can also use the batch analyze operation to detect PII and perform key phrase extraction. See the [batch analyze sample](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics/azure-ai-textanalytics/samples/sample_analyze_batch_actions.py) on GitHub.

# [Version 3.0](#tab/version-3)

This feature is not available in version 3.0.

---
