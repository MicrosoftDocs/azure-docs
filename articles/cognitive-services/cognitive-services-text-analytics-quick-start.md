<properties
	pageTitle="Quick start guide: Machine Learning Text Analytics APIs | Microsoft Azure"
	description="Azure Machine Learning Text Analytics - Quick Start Guide"
	services="cognitive-services"
	documentationCenter=""
	authors="onewth"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="cognitive-services"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/05/2016"
	ms.author="onewth"/>

# Getting started with the Text Analytics APIs to detect sentiment, key phrases, topics and language

<a name="HOLTop"></a>

This document describes how to onboard your service or application to use the [Text Analytics APIs](//go.microsoft.com/fwlink/?LinkID=759711).
You can use these APIs to detect sentiment, key phrases, topics and language from your text. [Click here to see an interactive demo of the experience.](//go.microsoft.com/fwlink/?LinkID=759712)

Please refer to the [API definitions](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs.

This guide is for version 2 of the APIs. For details on version 1 of the APIs, [refer to this document](../machine-learning/machine-learning-apps-text-analytics.md).

By the end of this tutorial, you will be able to programatically detect:

- **Sentiment** - Is text positive or negative?

- **Key phrases** - What are people discussing in a single article?

- **Topics** - What are people discussing across many articles?

- **Languages** - What language is text written in?

Note that this API charges 1 transaction per document submitted. As an example, if you request sentiment for 1000 documents in a single call, 1000 transactions will be deducted.



<a name="Overview"></a>
## General overview ##

This document is a step-by-step guide. Our objective is to walk you through the steps necessary to train a model, and to point you to resources that will allow you to put it in production. This exercise will take about 30 minutes.

For these tasks, you will need an editor and call the RESTful endpoints in your language of choice.

Let's get started!

## Task 1 - Signing up for the Text Analytics APIs ####

In this task, you will sign up for the text analytics service.

1. Navigate to **Cognitive Services** in the [Azure Portal](//go.microsoft.com/fwlink/?LinkId=761108) and ensure **Text Analytics** is selected as the 'API type'.

1. Select a plan. You may select the **free tier for 5,000 transactions/month**. As is a free plan, you will not be charged for using the service. You will need to login to your Azure subscription. 

1. Complete the other fields and create your account.

1. After you sign up for Text Analytics, find your **API Key**. Copy the primary key, as you will need it when using the API services.


## Task 2 - Detect sentiment, key phrases and languages ####

It's easy to detect sentiment, key phrases and languages in your text. You will programatically get the same results as the [demo experience](//go.microsoft.com/fwlink/?LinkID=759712) returns.

>[AZURE.TIP] For sentiment analysis, we recommend that you split text into sentences. This generally leads to a higher precision in sentiment predictions.

Note that the supported languages are as follows:

| Feature | Supported language codes |
|:-----|:----|
| Sentiment | `en` (English), `es` (Spanish), `fr` (French), `pt` (Portuguese) |
| Key phrases | `en` (English), `es` (Spanish), `de` (German), `ja` (Japanese) |


1. You will need to set the headers to the following. Note that JSON is currently the only accepted input format for the APIs. XML is not supported.

		Ocp-Apim-Subscription-Key: <your API key>
		Content-Type: application/json
		Accept: application/json

1. Next, format your input rows in JSON. For sentiment, key phrases and language, the format is the same. Note that each ID should be unique and will be the ID returned by the system. The maximum size of a single document that can be submitted is 10KB, and the total maximum size of submitted input is 1MB. No more than 1,000 documents may be submitted in one call. Language is an optional parameter that should be specified if analyzing non-English text. An example of input is shown below, where the optional parameter `language` for sentiment analysis or key phrase extraction is included:

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

1. Make a **POST** call to the system with the input for sentiment, key phrases and language. The URLs will look as follows:

        POST https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment
        POST https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases
        POST https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages

1. This call will return a JSON formatted response with the IDs and detected properties. An example of the output for sentiment is shown below (with error details excluded). In the case of sentiment, a score between 0 and 1 will be returned for each document:

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


## Task 3 - Detect topics in a corpus of text ####

This is a newly released API which returns the top detected topics for a list of submitted text records. A topic is identified with a key phrase, which can be one or more related words. The API is designed to work well for short, human written text such as reviews and user feedback.

This API requires **a minimum of 100 text records** to be submitted, but is designed to detect topics across hundreds to thousands of records. Any non-English records or records with less than 3 words will be discarded and therefore will not be assigned to topics. For topic detection, the maximum size of a single document that can be submitted is 30KB, and the total maximum size of submitted input is 30MB. 

There are two additional **optional** input parameters that can help to improve the quality of results:

- **Stop words.**  These words and their close forms (e.g. plurals) will be excluded from the entire topic detection pipeline. Use this for common words (for example, “issue”, “error” and “user” may be appropriate choices for customer complaints about software). Each string should be a single word.
- **Stop phrases** - These phrases will be excluded from the list of returned topics. Use this to exclude generic topics that you don’t want to see in the results. For example, “Microsoft” and “Azure” would be appropriate choices for topics to exclude. Strings can contain multiple words.

Follow these steps to detect topics in your text.

1. Format the input in JSON. This time, you can define stop words and stop phrases.

		{
			"documents": [
				{
					"id": "1",
					"text": "First document"
				},
                ...
                {
					"id": "100",
					"text": "Final document"
				}
			],
			"stopWords": [
				"issue", "error", "user"
			],
			"stopPhrases": [
				"Microsoft", "Azure"
			]
		}

1. Using the same headers as defined in Task 2, make a **POST** call to the topics endpoint:

        POST https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/topics

1. This will return an `operation-location` as the header in the response, where the value is the URL to query for the resulting topics:

        'operation-location': 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/operations/<operationId>'

1. Query the returned `operation-location` periodically with a **GET** request. Once per minute is recommended.

        GET https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/operations/<operationId>

1. The endpoint will return a response including `{"status": "notstarted"}` before processing, `{"status": "running"}` while processing and `{"status": "succeeded"}` with the output once completed. You can then consume the output which will be in the following format (note details like error format and dates have been excluded from this example):

		{
			"status": "succeeded",
			"operationProcessingResult": {
			  	"topics": [
                    {
					    "id": "8b89dd7e-de2b-4a48-94c0-8e7844265196"
					    "score": "5"
					    "keyPhrase": "first topic name"
                    },
                    ...
                    {
					    "id": "359ed9cb-f793-4168-9cde-cd63d24e0d6d"
					    "score": "3"
					    "keyPhrase": "final topic name"
                    }
                ],
			  	"topicAssignments": [
                    {
					    "topicId": "8b89dd7e-de2b-4a48-94c0-8e7844265196",
					    "documentId": "1",
					    "distance": "0.354"
                    },
                    ...
                    {
					    "topicId": "359ed9cb-f793-4168-9cde-cd63d24e0d6d",
					    "documentId": "55",
					    "distance": "0.758"
                    },            
                ]
			}
		}

Note that the successful response for topics from the `operations` endpoint will have the following schema:

	{
    		"topics" : [{
        		"id" : "string",
        		"score" : "number",
        		"keyPhrase" : "string"
    		}],
    		"topicAssignments" : [{
        		"documentId" : "string",
        		"topicId" : "string",
        		"distance" : "number"
    		}],
    		"errors" : [{
        		"id" : "string",
        		"message" : "string"
    		}]
    	}

Explanations for each part of this response are as follows:

**topics**

| Key | Description |
|:-----|:----|
| id | A unique identifier for each topic. |
| score | Count of documents assigned to topic. |
| keyPhrase | A summarizing word or phrase for the topic. |

**topicAssignments**

| Key | Description |
|:-----|:----|
| documentId | Identifier for the document. Equates to the ID included in the input. |
| topicId | The topic ID which the document has been assigned to. |
| distance | Document-to-topic affiliation score between 0 and 1. The lower a distance score the stronger the topic affiliation is. |

**errors**

| Key | Description |
|:-----|:----|
| id | Input document unique identifier the error refers to. |
| message | Error message. |

## Next steps ##

Congratulations! You have now completed using text analytics on your data. You may now wish to look into using a tool such as [Power BI](//powerbi.microsoft.com) to visualize your data, as well as automating your insights to give you a real-time view of your text data.

To see how Text Analytics capabilities, such as sentiment, can be used as part of a bot, see the [Emotional Bot](http://docs.botframework.com/en-us/bot-intelligence/language/#example-emotional-bot) example on the Bot Framework site.
