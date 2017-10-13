---
title: 'Azure Text Analytics Quick Start | Microsoft Docs'
description: Get information to help you quickly get started using the Text Analytics API in Cognitive Services.
services: cognitive-services
documentationcenter: ''
author: luiscabrer
manager: jhubbard
editor: cgronlun

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 08/24/2017
ms.author: luisca

---
# Getting started with the Text Analytics APIs to detect sentiment, key phrases, topics, and language
<a name="HOLTop"></a>

This document describes how to onboard your service or application to use the [Text Analytics APIs](//go.microsoft.com/fwlink/?LinkID=759711).
You can use these APIs to detect sentiment, key phrases, topics, and language from your text. [Visit the product page to see an interactive demo of the APIs.](//go.microsoft.com/fwlink/?LinkID=759712)

Refer to the [API definitions](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs.

By the end of this tutorial, you will be able to programmatically detect:

* **Sentiment** - Is text positive or negative?
* **Key phrases** - What are people discussing in a single article?
* **Languages** - What language is text written in?

<a name="Overview"></a>

## General overview
This document is a step-by-step guide. Our objective is to walk you through the steps necessary to train a model, and to point you to resources that will allow you to put it in production. This exercise takes about 30 minutes.

For these tasks, you need an editor and call the RESTful endpoints in your language of choice.

Let's get started!

## Task 1 - Signing up for the Text Analytics APIs
In this task, you will sign up for the text analytics service.

1. Navigate to **Cognitive Services** in the [Azure portal](//go.microsoft.com/fwlink/?LinkId=761108) and ensure **Text Analytics** is selected as the 'API type'.
2. Select a plan. You may select the **free tier for 5,000 transactions/month**. As is a free tier, there are no charges for using the service. You need to login to your Azure subscription to sign up for the service. 
3. Complete the other fields and create your account.
4. After you sign up for Text Analytics, find your **API Key**. Copy the primary key, as you need it when using the API services.

## Task 2 - Detect sentiment, key phrases, and languages
It's easy to detect sentiment, key phrases, and languages in your text. You will programmatically get the same results as is shown in the [demo experience](//go.microsoft.com/fwlink/?LinkID=759712).

> [!TIP]
> For sentiment analysis, we recommend that you split text into sentences. This generally leads to higher precision in sentiment predictions.
> 
> 

Refer to the [Text Analytics Overview](overview.md#supported-languages) for details of supported languages

1. Set the headers as shown below. JSON is currently the only accepted input format for the APIs. XML is not supported.
   
        Ocp-Apim-Subscription-Key: <your API key>
        Content-Type: application/json
        Accept: application/json

2. Next, format your input rows in JSON. For sentiment, key phrases and language, the format is the same. Each ID should be unique and is the ID returned by the system. The maximum size of a single document that can be submitted is 10 KB, and the total maximum size of submitted input is 1 MB. No more than 1,000 documents may be submitted in one call. Rate limiting exists at a rate of 100 calls per minute - we therefore recommend that you submit large quantities of documents in a single call. Language is an optional parameter that should be specified if analyzing non-English text. An example of input is shown below, where the optional parameter `language` for sentiment analysis or key phrase extraction is included:
   
        {
            "documents": [
                {
                    "language": "en",
                    "id": "1",
                    "text": "First document"
                },
                ...
                {
                    "language": "en",
                    "id": "100",
                    "text": "Final document"
                }
            ]
        }
3. Make a **POST** call to the system with the input for sentiment, key phrases and language. The URLs are listed below:
   
        POST https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment
        POST https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases
        POST https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages
4. This call returns a JSON formatted response with the IDs and detected properties. An example of the output for sentiment is shown below (with error details excluded). In the case of sentiment, a score between 0 and 1 is returned for each document:
   
        // Sentiment response
        {
              "documents": [
                {
                    "id": "1",
                    "score": "0.934"
                },
                ...
                {
                    "id": "100",
                    "score": "0.002"
                },
            ]
        }
   
        // Key phrases response
        {
              "documents": [
                {
                    "id": "1",
                    "keyPhrases": ["key phrase 1", ..., "key phrase n"]
                },
                ...
                {
                    "id": "100",
                    "keyPhrases": ["key phrase 1", ..., "key phrase n"]
                },
            ]
        }
   
        // Languages response
        {
              "documents": [
                {
                    "id": "1",
                    "detectedLanguages": [
                        {
                            "name": "English",
                            "iso6391Name": "en",
                            "score": "1"
                        }
                    ]
                },                
                ...
                {
                    "id": "100",
                    "detectedLanguages": [
                        {
                            "name": "French",
                            "iso6391Name": "fr",
                            "score": "0.985"
                        }
                    ]
                }
            ]
        }


## Next steps
Congratulations! You have now completed using text analytics on your data. You may now wish to look into using a tool such as [Power BI](//powerbi.microsoft.com) to visualize your data. You can also use the insights to provide a streaming view of what customers are saying.

To see how Text Analytics capabilities, such as sentiment, can be used as part of a bot, see the [Emotional Bot](http://docs.botframework.com/en-us/bot-intelligence/language/#example-emotional-bot) example on the Bot Framework site.

