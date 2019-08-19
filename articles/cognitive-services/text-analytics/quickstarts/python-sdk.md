---
title: 'Quickstart: Text Analytics client library for Python | Microsoft Docs'
titleSuffix: Azure Cognitive Services
description: Use this quickstart to to begin using the Text Analytics API from Azure Cognitive Services.
services: cognitive-services
author: ctufts
manager: assafi

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 08/05/2019
ms.author: aahi
---

# Quickstart: Text analytics client library for Python
<a name="HOLTop"></a>

Get started with the Text Analytics client library for Python. Follow these steps to install the package and try out the example code for basic tasks. 

Use the Text Analytics client library for Python to perform:

* Sentiment analysis
* Language detection
* Entity recognition
* Key phrase extraction


[Reference documentation](https://docs.microsoft.com/python/api/overview/azure/cognitiveservices/textanalytics?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-language-textanalytics) | [Package (PiPy)](https://pypi.org/project/azure-cognitiveservices-language-textanalytics/) | [Samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/)


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* [Python 3.x](https://www.python.org/)

## Setting up

### Create a Text Analytics Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Text Analytics using the [Azure portal](../../cognitive-services-apis-create-account.md) or [Azure CLI](../../cognitive-services-apis-create-account-cli.md) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for 7 days for free. After signing up it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure portal](https://portal.azure.com/)

After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `TEXT_ANALYTICS_SUBSCRIPTION_KEY`.

### Install the client library

After installing Python, you can install the client library with:

```console
pip install --upgrade azure-cognitiveservices-language-textanalytics
```

### Create a new python application

Create a new Python application in your preferred editor or IDE. Then import the following libraries.

```python
from azure.cognitiveservices.language.textanalytics import TextAnalyticsClient
from msrest.authentication import CognitiveServicesCredentials
```

Create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

[!INCLUDE [text-analytics-find-resource-information](../includes/find-azure-resource-info.md)]

```python
# replace this endpoint with the correct one for your Azure resource. 
text_analytics_url = "https://westcentralus.api.cognitive.microsoft.com/"
# This sample assumes you have created an environment variable for your key
key = os.environ["TEXT_ANALYTICS_SUBSCRIPTION_KEY"]
credentials = CognitiveServicesCredentials(key)
```

## Object model

The Text Analytics client is a [TextAnalyticsClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-python) object that authenticates to Azure using your key. The client provides several methods for analyzing text, as a single string, or a batch. 

Text is sent to the API as a list of `documents`, which are `dictionary` objects containing a combination of `id`, `text`, and `language` attributes depending on the method used. The `text` attribute stores the text to be analyzed in the origin `language`, and the `id` can be any value. 

The response object is a list containing the analysis information for each document. 

## Code examples

These code snippets show you how to do the following with the Text Analytics client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis)
* [Language detection](#language-detection)
* [Entity recognition](#entity-recognition)
* [Key phrase extraction](#key-phrase-extraction)

## Authenticate the client

Create a new [TextAnalyticsClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-python) object with `credentials` and `text_analytics_url` as a parameter. Use the correct Azure region for your Text Analytics subscription (for example `westcentralus`).

```python
text_analytics = TextAnalyticsClient(endpoint=text_analytics_url, credentials=credentials)
```

## Sentiment analysis

Call the [sentiment()](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-python#sentiment-show-stats-none--documents-none--custom-headers-none--raw-false----operation-config-) function and get the result. Then iterate through the results, and print each document's ID, and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

```python
documents = [
    {
        "id": "1",
        "language": "en",
        "text": "I had the best day of my life."
    }
]
response = text_analytics.sentiment(documents=documents)
for document in response.documents:
    print("Document Id: ", document.id, ", Sentiment Score: ",
          "{:.2f}".format(document.score))
```

### Output

```console
Document Id:  1 , Sentiment Score:  0.87
```

## Language detection

Using the client created earlier, call [detect_language()](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-python#detect-language-show-stats-none--documents-none--custom-headers-none--raw-false----operation-config-) and get the result. Then iterate through the results, and print each document's ID, and the first returned language.

```python
documents = [
    {
        'id': '1',
        'text': 'This is a document written in English.'
    }
]
response = text_analytics.detect_language(documents=documents)
for document in response.documents:
    print("Document Id: ", document.id, ", Language: ",
          document.detected_languages[0].name)
```

### Output

```console
Document Id:  1 , Language:  English
```

## Entity recognition

Using the client created earlier, call the [entities()](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-python#entities-show-stats-none--documents-none--custom-headers-none--raw-false----operation-config-) function and get the result. Then iterate through the results, and print each document's ID, and the entities contained in it.

```python
documents = [
    {
        "id": "1",
        "language": "en",
        "text": "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800."
    }
]
response = text_analytics.entities(documents=documents)

for document in response.documents:
    print("Document Id: ", document.id)
    print("\tKey Entities:")
    for entity in document.entities:
        print("\t\t", "NAME: ", entity.name, "\tType: ",
              entity.type, "\tSub-type: ", entity.sub_type)
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
```

## Key phrase extraction

Using the client created earlier, call the [key_phrases()](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-textanalytics/azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-python#key-phrases-show-stats-none--documents-none--custom-headers-none--raw-false----operation-config-) function and get the result. Then iterate through the results, and print each document's ID, and the key phrases contained in it.

```python
documents = [
    {
        "id": "1",
        "language": "en",
        "text": "My cat might need to see a veterinarian."
    }
]
response = text_analytics.key_phrases(documents=documents)

for document in response.documents:
    print("Document Id: ", document.id)
    print("\tKey Phrases:")
    for phrase in document.key_phrases:
        print("\t\t", phrase)
```


### Output

```console
Document Id:  3
	Phrases:
		 cat
		 veterinarian
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with the resource group.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)


* [Text Analytics overview](../overview.md)
* [Sentiment analysis](../how-tos/text-analytics-how-to-sentiment-analysis.md)
* [Entity recognition](../how-tos/text-analytics-how-to-entity-linking.md)
* [Detect language](../how-tos/text-analytics-how-to-keyword-extraction.md)
* [Language recognition](../how-tos/text-analytics-how-to-language-detection.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/blob/master/samples/language/text_analytics_samples.py).
