---
title: 'Quickstart: Call the Text Analytics Service using the Python SDK'
titleSuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started using the Text Analytics API in Azure Cognitive Services.
services: cognitive-services
author: ctufts
manager: assafi

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 03/28/2019
ms.author: aahi
---

# Quickstart: Call the Text Analytics Service using the Python SDK 
<a name="HOLTop"></a>

Use this quickstart to begin analyzing language with the Text Analytics SDK for Python. While the Text Analytics REST API is compatible with most programming languages, the SDK provides an easy way to integrate the service into your applications without serializing and deserializing JSON. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/blob/master/samples/language/text_analytics_samples.py).

## Prerequisites

* [Python 3.x](https://www.python.org/)

* The Text Analytics [SDK for python](https://pypi.org/project/azure-cognitiveservices-language-textanalytics/) 
    You can install the package with:

    `pip install --upgrade azure-cognitiveservices-language-textanalytics`

[!INCLUDE [cognitive-services-text-analytics-signup-requirements](../../../../includes/cognitive-services-text-analytics-signup-requirements.md)]

You must also have the [endpoint and access key](../How-tos/text-analytics-how-to-access-key.md) that were generated for you during sign-up.

## Create a new Python application

Create a new Python application in your favorite editor or IDE. Then add the following import statements to your file.

```python
from azure.cognitiveservices.language.textanalytics import TextAnalyticsClient
from msrest.authentication import CognitiveServicesCredentials
```

## Authenticate your credentials

> [!Tip]
> For secure deployment of secrets in production systems we recommend using [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-net).
>

After making a variable for your Text Analytics subscription key, instantiate a `CognitiveServicesCredentials` object with it.

```python
subscription_key = "enter-your-key-here"
credentials = CognitiveServicesCredentials(subscription_key)
```

## Create a Text Analytics client

Create a new `TextAnalyticsClient` object with `credentials` and `text_analytics_url` as a parameter. Use the correct Azure region for your Text Analytics subscription (for example `westcentralus`).

```
text_analytics_url = "https://westcentralus.api.cognitive.microsoft.com/"
text_analytics = TextAnalyticsClient(endpoint=text_analytics_url, credentials=credentials)
```

## Sentiment analysis

The payload to the API consists of a list of `documents`, which are dictionaries containing an `id` and a `text` attribute. The `text` attribute stores the text to be analyzed, and the `id` can be any value. 

```python
documents = [
  {
    "id": "1", 
    "language": "en", 
    "text": "I had the best day of my life."
  },
  {
    "id": "2", 
    "language": "en", 
    "text": "This was a waste of my time. The speaker put me to sleep."
  },  
  {
    "id": "3", 
    "language": "es", 
    "text": "No tengo dinero ni nada que dar..."
  },  
  {
    "id": "4", 
    "language": "it", 
    "text": "L'hotel veneziano era meraviglioso. È un bellissimo pezzo di architettura."
  }
]
```

Call the `sentiment()` function and get the result. Then iterate through the results, and print each document's ID, and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

```python
response = text_analytics.sentiment(documents=documents)
for document in response.documents:
     print("Document Id: ", document.id, ", Sentiment Score: ", "{:.2f}".format(document.score))
```

### Output

```console
Document Id:  1 , Sentiment Score:  0.87
Document Id:  2 , Sentiment Score:  0.11
Document Id:  3 , Sentiment Score:  0.44
Document Id:  4 , Sentiment Score:  1.00
```

## Language detection

Create a list of dictionaries, each containing the document you want to analyze. The `text` attribute stores the text to be analyzed, and the `id` can be any value. 

```python
documents = [
    { 
        'id': '1', 
        'text': 'This is a document written in English.' 
    },
    {
        'id': '2', 
        'text': 'Este es un document escrito en Español.' 
    },
    { 
        'id': '3', 
        'text': '这是一个用中文写的文件' 
    }
]
``` 

Using the client created earlier, call `detect_language()` and get the result. Then iterate through the results, and print each document's ID, and the first returned language.

```python
response = text_analytics.detect_language(documents=documents)
for document in response.documents:
    print("Document Id: ", document.id , ", Language: ", document.detected_languages[0].name)
```

### Output

```console
Document Id:  1 , Language:  English
Document Id:  2 , Language:  Spanish
Document Id:  3 , Language:  Chinese_Simplified
```

## Entity recognition

Create a list of dictionaries, containing the documents you want to analyze. The `text` attribute stores the text to be analyzed, and the `id` can be any value. 


```python
documents = [
    {
        "id": "1",
        "language": "en", 
        "text": "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800."
    },
    {
        "id": "2",
        "language": "es", 
        "text": "La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle."
    }
]
```

Using the client created earlier, call `entities()` function and get the result. Then iterate through the results, and print each document's ID, and the entities contained in it.

```python
response = text_analytics.entities(documents=documents)

for document in response.documents:
    print("Document Id: ", document.id)
    print("\tKey Entities:")
    for entity in document.entities:
        print("\t\t", "NAME: ",entity.name, "\tType: ", entity.type, "\tSub-type: ", entity.sub_type)
        for match in entity.matches:
            print("\t\t\tOffset: ", match.offset, "\tLength: ", match.length, "\tScore: ",
                  "{:.2f}".format(match.entity_type_score))
```


### Output

```console
Document Id:  1
	Key Entities:
		 NAME:  Microsoft 	Type:  Organization 	Sub-type:  None
			Offset:  0 	Length:  9 	Score:  1.00
		 NAME:  Bill Gates 	Type:  Person 	Sub-type:  None
			Offset:  25 	Length:  10 	Score:  1.00
		 NAME:  Paul Allen 	Type:  Person 	Sub-type:  None
			Offset:  40 	Length:  10 	Score:  1.00
		 NAME:  April 4 	Type:  Other 	Sub-type:  None
			Offset:  54 	Length:  7 	Score:  0.80
		 NAME:  April 4, 1975 	Type:  DateTime 	Sub-type:  Date
			Offset:  54 	Length:  13 	Score:  0.80
		 NAME:  BASIC 	Type:  Other 	Sub-type:  None
			Offset:  89 	Length:  5 	Score:  0.80
		 NAME:  Altair 8800 	Type:  Other 	Sub-type:  None
			Offset:  116 	Length:  11 	Score:  0.80
Document Id:  2
	Key Entities:
		 NAME:  Microsoft 	Type:  Organization 	Sub-type:  None
			Offset:  21 	Length:  9 	Score:  1.00
		 NAME:  Redmond (Washington) 	Type:  Location 	Sub-type:  None
			Offset:  60 	Length:  7 	Score:  0.99
		 NAME:  21 kilómetros 	Type:  Quantity 	Sub-type:  Dimension
			Offset:  71 	Length:  13 	Score:  0.80
		 NAME:  Seattle 	Type:  Location 	Sub-type:  None
			Offset:  88 	Length:  7 	Score:  1.00
```

## Key phrase extraction

Create a list of dictionaries, containing the documents you want to analyze. The `text` attribute stores the text to be analyzed, and the `id` can be any value. 


```python
documents = [
    {
        "id": "1", 
        "language": "ja", 
        "text": "猫は幸せ"
    },
    {
        "id": "2", 
        "language": "de", 
        "text": "Fahrt nach Stuttgart und dann zum Hotel zu Fu."
    },
    {
        "id": "3", 
        "language": "en",
        "text": "My cat might need to see a veterinarian."
    },
    {
        "id": "4", 
        "language": "es", 
        "text": "A mi me encanta el fútbol!"
    }
]
```

Using the client created earlier, call `key_phrases()` function and get the result. Then iterate through the results, and print each document's ID, and the key phrases contained in it.

```python
response = text_analytics.key_phrases(documents=documents)

for document in response.documents:
    print("Document Id: ", document.id)
    print("\tKey Phrases:")
    for phrase in document.key_phrases:
        print("\t\t",phrase)
```

### Output

```console
Document Id:  1
	Phrases:
		 幸せ
Document Id:  2
	Phrases:
		 Stuttgart
		 Hotel
		 Fahrt
		 Fu
Document Id:  3
	Phrases:
		 cat
		 veterinarian
Document Id:  4
	Phrases:
		 fútbol
```

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)

## See also

* [What is the Text Analytics API?](../overview.md)
* [Example user scenarios](../text-analytics-user-scenarios.md)
* [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)
