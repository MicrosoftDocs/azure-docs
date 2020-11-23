---
author: aahill
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include
ms.date: 10/07/2020
ms.author: aahi
---

<a name="HOLTop"></a>

# [Version 3.1 preview](#tab/version-3-1)

[v3.1 Reference documentation](/python/api/azure-ai-textanalytics/azure.ai.textanalytics?preserve-view=true&view=azure-python-preview) | [v3.1 Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics) | [v3.1 Package (PiPy)](https://pypi.org/project/azure-ai-textanalytics/) | [v3.1 Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics/azure-ai-textanalytics/samples)

# [Version 3.0](#tab/version-3)

[v3 Reference documentation](/python/api/azure-ai-textanalytics/azure.ai.textanalytics) | [v3 Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics) | [v3 Package (PiPy)](https://pypi.org/project/azure-ai-textanalytics/) | [v3 Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics/azure-ai-textanalytics/samples)

# [Version 2.1](#tab/version-2)

[v2 Reference documentation](/python/api/overview/azure/cognitiveservices/textanalytics) | [v2 Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-language-textanalytics) | [v2 Package (PiPy)](https://pypi.org/project/azure-cognitiveservices-language-textanalytics/) | [v2 Samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples)

---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Python 3.x](https://www.python.org/)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Text Analytics resource"  target="_blank">create a Text Analytics resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Text Analytics API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

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

# [Version 2.1](#tab/version-2)

```console
pip install --upgrade azure-cognitiveservices-language-textanalytics
```

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it [on GitHub](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/blob/master/samples/language/text_analytics_samples.py), which contains the code examples in this quickstart. 

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

# [Version 2.1](#tab/version-2)

The Text Analytics client is a [TextAnalyticsClient](/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient) object that authenticates to Azure using your key. The client provides several methods for analyzing text, as a single string, or a batch. 

Text is sent to the API as a list of `documents`, which are `dictionary` objects containing a combination of `id`, `text`, and `language` attributes depending on the method used. The `text` attribute stores the text to be analyzed in the origin `language`, and the `id` can be any value. 

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

# [Version 2.1](#tab/version-2)

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
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

def authenticate_client():
    ta_credential = AzureKeyCredential(key)
    text_analytics_client = TextAnalyticsClient(
            endpoint=endpoint, 
            credential=ta_credential, 
            api_version=TextAnalyticsApiVersion.V3_0)
    return text_analytics_client

client = authenticate_client()
```

# [Version 2.1](#tab/version-2)

[!code-python[imports statements](~/samples-cognitive-services-python-sdk/samples/language/text_analytics_samples.py?name=imports)]

Create a function to instantiate the `TextAnalyticsClient` object with your `key` AND `endpoint` created above. Then create a new client. 

[!code-python[version 2 authentication](~/samples-cognitive-services-python-sdk/samples/language/text_analytics_samples.py?name=authentication)]

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
        "The food and service were unacceptable, but the concierge were nice",
        "The rooms were beautiful but dirty. The AC was good and quiet, but the elevator was broken"
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
                aspect = mined_opinion.aspect
                print("......'{}' aspect '{}'".format(aspect.sentiment, aspect.text))
                for opinion in mined_opinion.opinions:
                    print("......'{}' opinion '{}'".format(opinion.sentiment, opinion.text))
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

......'negative' aspect 'food'
......'negative' opinion 'unacceptable'
......'negative' aspect 'service'
......'negative' opinion 'unacceptable'
......'positive' aspect 'concierge'
......'positive' opinion 'nice'


Document Sentiment: negative
Overall scores: positive=0.00; neutral=0.00; negative=1.00

Sentence: The rooms were beautiful but dirty.
Sentence sentiment: negative
Sentence score:
Positive=0.01
Neutral=0.00
Negative=0.99

......'mixed' aspect 'rooms'
......'positive' opinion 'beautiful'
......'negative' opinion 'dirty'
Sentence: The AC was good and quiet, but the elevator was broken
Sentence sentiment: negative
Sentence score:
Positive=0.00
Neutral=0.00
Negative=1.00

......'positive' aspect 'AC'
......'positive' opinion 'good'
......'positive' opinion 'quiet'
......'negative' aspect 'elevator'
......'negative' opinion 'broken'
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

# [Version 2.1](#tab/version-2)

Authenticate a client object, and call the [sentiment()](/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient#sentiment-show-stats-none--documents-none--custom-headers-none--raw-false----operation-config-) function. Iterate through the results, and print each document's ID, and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

[!code-python[sentiment analysis](~/samples-cognitive-services-python-sdk/samples/language/text_analytics_samples.py?name=sentimentAnalysis)]

### Output

```console
Document ID: 1 , Sentiment Score: 0.87
Document ID: 2 , Sentiment Score: 0.11
Document ID: 3 , Sentiment Score: 0.44
Document ID: 4 , Sentiment Score: 1.00
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

# [Version 2.1](#tab/version-2)

Using the client created earlier, call [detect_language()](/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient#detect-language-show-stats-none--documents-none--custom-headers-none--raw-false----operation-config-) and get the result. Then iterate through the results, and print each document's ID, and the first returned language.

[!code-python[language detection](~/samples-cognitive-services-python-sdk/samples/language/text_analytics_samples.py?name=languageDetection)]


### Output

```console
Document ID: 1 , Language: English
Document ID: 2 , Language: Spanish
Document ID: 3 , Language: Chinese_Simplified
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

# [Version 2.1](#tab/version-2)

> [!NOTE]
> In version 2.1, entity linking is included in the NER response.

Using the client created earlier, call the [entities()](/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient#entities-show-stats-none--documents-none--custom-headers-none--raw-false----operation-config-) function and get the result. Then iterate through the results, and print each document's ID, and the entities contained in it.

[!code-python[Entity recognition](~/samples-cognitive-services-python-sdk/samples/language/text_analytics_samples.py?name=entityRecognition)]

### Output

```console
Document ID: 1
        Name: Microsoft,        Type: Organization,     Sub-Type: N/A
        Offset: 0, Length: 9,   Score: 1.0

        Name: Bill Gates,       Type: Person,   Sub-Type: N/A
        Offset: 25, Length: 10, Score: 0.999847412109375

        Name: Paul Allen,       Type: Person,   Sub-Type: N/A
        Offset: 40, Length: 10, Score: 0.9988409876823425

        Name: April 4,  Type: Other,    Sub-Type: N/A
        Offset: 54, Length: 7,  Score: 0.8

        Name: April 4, 1975,    Type: DateTime, Sub-Type: Date
        Offset: 54, Length: 13, Score: 0.8

        Name: BASIC,    Type: Other,    Sub-Type: N/A
        Offset: 89, Length: 5,  Score: 0.8

        Name: Altair 8800,      Type: Other,    Sub-Type: N/A
        Offset: 116, Length: 11,        Score: 0.8

Document ID: 2
        Name: Microsoft,        Type: Organization,     Sub-Type: N/A
        Offset: 21, Length: 9,  Score: 0.999755859375

        Name: Redmond (Washington),     Type: Location, Sub-Type: N/A
        Offset: 60, Length: 7,  Score: 0.9911284446716309

        Name: 21 kilómetros,    Type: Quantity, Sub-Type: Dimension
        Offset: 71, Length: 13, Score: 0.8

        Name: Seattle,  Type: Location, Sub-Type: N/A
        Offset: 88, Length: 7,  Score: 0.9998779296875
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

# [Version 2.1](#tab/version-2)

Using the client created earlier, call the [key_phrases()](/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient#key-phrases-show-stats-none--documents-none--custom-headers-none--raw-false----operation-config-) function and get the result. Then iterate through the results, and print each document's ID, and the key phrases contained in it.

[!code-python[key phrase extraction](~/samples-cognitive-services-python-sdk/samples/language/text_analytics_samples.py?name=keyPhrases)]


### Output

```console
Document ID: 1
         Key phrases:
                幸せ
Document ID: 2
         Key phrases:
                Stuttgart
                Hotel
                Fahrt
                Fu
Document ID: 3
         Key phrases:
                cat
                veterinarian
Document ID: 4
         Key phrases:
                fútbol
```

---