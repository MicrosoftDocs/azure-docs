---
title: Python Quickstart for Azure Cognitive Services, Text Analytics API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Text Analytics API in Microsoft Cognitive Services on Azure.
services: cognitive-services
author: ashmaka
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: article
ms.date: 05/02/2018
ms.author: ashmaka
---

# Quickstart for Text Analytics API with Python 
<a name="HOLTop"></a>

This walkthrough shows you how to analyze text documents four different ways using the [Text Analytics](//go.microsoft.com/fwlink/?LinkID=759711) SDK for Python.

* [Detect language](#Detect)
* [Analyze sentiment](#SentimentAnalysis)
* [Extract key phrases](#KeyPhraseExtraction)
* [Identify linked entities](#LinkedEntities)

You can run this example as a Jupyter notebook on [MyBinder](https://mybinder.org) by clicking on the launch Binder badge below.

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=TextAnalytics.ipynb)

Refer to the [API definitions](//go.microsoft.com/fwlink/?LinkID=759346) for a reference to the functionality of the Text Analytics service.

## Prerequisites

This Quickstart requires Python 3.2 or later and the Text Analytics module for Python. You can install the Text Analytics module with the following shell command.

```bash
python -m pip install azure-cognitiveservices-language-textanalytics
```

If you are using your own Jupyter installation, make sure the IPython kernel is up-to-date.

```bash
python -m pip install --upgrade IPython
```

You also need a [Cognitive Services subscription](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) that provides access to the **Text Analytics** service. This can be either a multi-service subscription, which covers most of the Cognitive Services, or a single-service subscription just for Text Analytics. The **free tier for 5,000 transactions/month** is suitable to complete this walkthrough.

Make a note of the [endpoint and subscription key](../How-tos/text-analytics-how-to-access-key.md) associated with your subscription.

## How to use this Quickstart

This code in this Quickstart is presented in short snippets. You can run it on Binder by placing the cursor into a code block and pressing Control-Enter. You can also run the code by pasting each snippet at the Python command line. Or you can accumulate the snippets into a single `.py` file using a text editor or an IDE and run the code as a script.

The code snippets use the IPython library to display HTML tabes in the Jupyter notebook. If you are instead using the command line, simply define `HTML = print` (instead of using `from IPython.display import HTML`) so that the HTML is printed instead.

The Text Analytics service has four separate functions, and each of these has its own section in this Quickstart. In general, the Python code in each section can be run indepentently from the code in other sections. The only exception is this section, which includes the code to set up your Python environment for running the rest of the code snippets. The code here:

* Imports the Text Analytics module so you can use it in your Python code
* Sets the subscription key and endpoint for the Text Analytics resource you want to use
* Creates a Text Analytics client object so you can call methods to analyze your text

Replace `subscription_key` below with the valid subscription key that you obtained earlier and verify that the region in the `endpoint` URL corresponds to the one you used when setting up the service. (If you are using a free trial key, it's in the `westcentralus` region, so you don't need to change the URL.)

```python
from azure.cognitiveservices.language.textanalytics import TextAnalyticsClient, models
from msrest.authentication import CognitiveServicesCredentials

subscription_key = None
assert subscription_key

endpoint = "https://westcentralus.api.cognitive.microsoft.com"

client = TextAnalyticsClient(endpoint, CognitiveServicesCredentials(subscription_key))
```

<a name="Detect"></a>

## Detect languages

The Text Analytics SDK's [`detect_language` method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) detects the language of submitted text documents. A document is plain text in a supported language; it need not be in a file.

To reduce the number of calls involved in processing large numbers of documents, up to 100 documents may be submitted in a single `detect_language` call. The input to the method is a list of individual documents, each of which is represented by a `LanguageInput` instance.

As a `LanguageInput` object, each document has `id` and `text` attributes. The `text` attribute stores the text to be analyzed. The `id` attribute is a string that associates each result with its original document, and must be unique within the document set for each `detect_language` call.

For this Quickstart, you can use our sample list defined below, or create one of your own.

```python
language_docs = [ models.LanguageInput(id="1", text="This is a document written in English."),
                  models.LanguageInput(id="2", text="Este es un document escrito en Español."),
                  models.LanguageInput(id="3", text='这是一个用中文写的文件')
                ]

language_results = client.detect_language(documents=language_docs)
```

After the `detect_language()` call returns, `language_results.documents` is a list in the same order as `language_docs`. For each original document, a `LanguageBatchResultItem` is provided, containing information about the language or languages detected in the document. 

Each result item contains a `detected_languages` attribute that holds a list of `DetectedLanguage` objects, each corresponding to a language found in the document. The `name` attribute of this object contains the human-readable name of the language, such as `English`, and the `score` attribute contains how certain the Text Analytics service is of the result on a scale from 0.0 to 1.0.

The following Python code generates an HTML table showing the original text and the detected language or languages, along with each language's score.

```python
from IPython.display import HTML  # or HTML = print if you aren't using a Jupyter notebook

table = []
header = "<tr><th>{}</th><th>{}</th><th>{}</th></tr>".format("ID", "Text", "Languages (scores)")

for doc, res in zip(language_docs, language_results.documents):
    langs = ", ".join("{} ({})".format(lang.name.replace("_", " "), lang.score) for lang in res.detected_languages)
    row = "<tr><td>{doc.id}</td><td>{doc.text}</td><td>{langs}</td></tr>".format(doc=doc, langs=langs)
    table.append(row)

HTML("<table>{0}{1}</table>".format(header, "\n".join(table)))
```

<a name="SentimentAnalysis"></a>

## Analyze sentiment

The [`sentiment` method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) detects the sentiment of text documents, on a scale of 0.0 (unfavorable) to 1.0 (favorable). Values around 0.5 represent neutral sentiment.

In practice, a sentiment analysis call works much like a language detection call. Up to 100 pieces of text ("documents") can be submitted in a single call, and each document must have a unique ID within set of documents in a given `sentiment` call. 

You must also specify the language of each document using ISO 639 standard language codes, such as `en` for English. The `MultiLanguageInput` class holds the required information about each document. 

The following example scores four documents, two in English and *dos* in Spanish.

```python
sentiment_docs = [ 
    models.MultiLanguageInput(id="1", language="en", 
        text="I had a wonderful experience! The rooms were wonderful and the staff was helpful."),
    models.MultiLanguageInput(id="2", language="en", 
        text="I had a terrible time at the hotel. The staff was rude and the food was awful."),
    models.MultiLanguageInput(id="3", language="es", 
        text="Los caminos que llevan hasta Monte Rainier son espectaculares y hermosos."),
    models.MultiLanguageInput(id="4", language="es", 
        text="La carretera estaba atascada. Había mucho tráfico el día de ayer."),
]

sentiment_results = client.sentiment(documents=sentiment_docs)
```

After the `sentiment` call, `sentiment_results.documents` is a list of `SentimentBatchResultItem` instances, each corresponding to a submitted document. The `SentimentBatchResultItem` includes a `score` attribute, which is the detected sentiment value. The Python code below displays the sentiment results as an HTML table.

```python
from IPython.display import HTML  # or HTML = print if you aren't using a Jupyter notebook

table = []
header = "<tr><th>{}</th><th>{}</th><th>{}</th></tr>".format("ID", "Text", "Score")

for doc, res in zip(sentiment_docs, sentiment_results.documents):
    row = "<tr><td>{doc.id}</td><td>{doc.text}</td><td>{score:.3}</td></tr>".format(doc=doc, score=res.score)
    table.append(row)

HTML("<table>{0}{1}</table>".format(header, "\n".join(table)))
```


<a name="KeyPhraseExtraction"></a>

## Extract key phrases

The [`key_phrases` method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) extracts key phrases from a text document.

A key phrase extraction call works much like a sentiment analysis call. Up to 100 pieces of text ("documents") can be submitted in a single call, and each document must have a unique ID within set of documents in a given `key_phrases` call. 

You must specify the language of each document using ISO 639 standard language codes, such as `en` for English. The `MultiLanguageInput` class holds the required information about each document. 

We'll use the same documents we used for sentiment analysis in this example: four documents, half in English and half in Spanish. Here's the code to pass them to the `key_phrases` method.

```python
key_phrases_docs = [ 
    models.MultiLanguageInput(id="1", language="en", 
        text="I had a wonderful experience! The rooms were wonderful and the staff was helpful."),
    models.MultiLanguageInput(id="2", language="en", 
        text="I had a terrible time at the hotel. The staff was rude and the food was awful."),
    models.MultiLanguageInput(id="3", language="es", 
        text="Los caminos que llevan hasta Monte Rainier son espectaculares y hermosos."),
    models.MultiLanguageInput(id="4", language="es", 
        text="La carretera estaba atascada. Había mucho tráfico el día de ayer."),
]

key_phrases_results = client.key_phrases(documents=sentiment_docs)
```

Much like we've seen with other methods, after the `key_phrases` call, `key_phrases_results.documents` is a list of `KeyPhraseBatchResultItem` instances, each corresponding to a submitted document. The `KeyPhraseBatchResultItem` has a `key_phrases` attribute, which is the detected sentiment value. The Python code below displays the results as an HTML table.

```python
from IPython.display import HTML  # or HTML = print if you aren't using a Jupyter notebook

table = []
header = "<tr><th>{}</th><th>{}</th><th>{}</th></tr>".format("ID", "Text", "Key phrases")

for doc, res in zip(key_phrases_docs, key_phrases_results.documents):
    phrases = ",".join(res.key_phrases)
    row = "<tr><td>{doc.id}</td><td>{doc.text}</td><td>{phrases}</td></tr>".format(doc=doc, phrases=phrases)
    table.append(row)

HTML("<table>{0}{1}</table>".format(header, "\n".join(table)))
```

<a name="LinkedEntities"></a>

## Identify linked entities

Finally, the [`entities` method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/5ac4251d5b4ccd1554da7634) identifies entities (businesses, people, places, and other proper nouns) in a text document.

The overall process should be familiar by now. Up to 100 pieces of text ("documents") can be submitted in a single call, and each document must have a unique ID within set of documents in a given `entities` call. 

You must specify the language of each document using ISO 639 standard language codes, such as `en` for English. The `MultiLanguageInput` class stores the required information about each document. 

As before, here's our document set (this time just in English) and our Python method call.

```python
entity_docs = [ 
    models.MultiLanguageInput(id="1", language="en", text="I really enjoy the new XBox One S. "
        "It has a clean look, it has 4K/HDR resolution and it is affordable."),
    models.MultiLanguageInput(id="2", language="en", 
        text="The Seattle Seahawks won the Super Bowl in 2014.")
]

entity_results = client.entities(documents=entity_docs)
```

Once more, `entity_results.documents` is a list of `EntitiesBatchResultItem` instances corresponding to the submitted documents. The `entities` attribute of each object is a list of `EntityRecord` objects, each describing an entity recognized in the original document. You'll find the following information in the entity record:

|||
|-|-|
|`name`|The entity's formal name|
|`matches`|List of the entity's appearances in the document (list of `MatchRecord`)|
|`bing_id`|Unique identifier for finding out more about the entity via Bing Entity Search|
|`type`|Entity type|
|`sub_type`|Entity sub type|
|`wikipedia_url`|Link to the entity's Wikipedia page, if any|
|`wikipedia_id`|Unique identifier of the entity on Wikipedia|
|`wikipedia_language`|The language for the entity's Wikipedia article|

The following Python code produces an HTML table containing each recognized entity's formal name and its type.

```python
from IPython.display import HTML  # or HTML = print if you aren't using a Jupyter notebook

table = []
header = "<tr><th>{}</th><th>{}</th><th>{}</th></tr>".format("ID", "Text", "Entities found")

for doc, res in zip(entity_docs, entity_results.documents):
    entities = ",".join("{} ({})".format(e.name, e.type) for e in res.entities)
    row = "<tr><td>{doc.id}</td><td>{doc.text}</td><td>{entities}</td></tr>".format(doc=doc, entities=entities)
    table.append(row)

HTML("<table>{0}{1}</table>".format(header, "\n".join(table)))
```


## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)

## See also 

 [Text Analytics overview](../overview.md)  
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)
