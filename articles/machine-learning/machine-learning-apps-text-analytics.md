<properties
	pageTitle="Machine Learning APIs: Text Analytics | Microsoft Azure"
	description="Microsoft's Machine Learning Text Analytics APIs can be used to analyze unstructured text for sentiment analysis, key phrase extraction, language detection and topic detection."
	services="machine-learning"
	documentationCenter=""
	authors="onewth"
	manager="paulettm"
	editor="cgronlun"/> 

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/07/2016"
	ms.author="onewth"/>


# Machine Learning APIs: Text Analytics for Sentiment, Key Phrase Extraction, Language Detection and Topic Detection

>[AZURE.NOTE] This guide is for version 1 of the API. For version 2, [**refer to this document**](../cognitive-services/cognitive-services-text-analytics-quick-start.md). Version 2 is now the preferred version of this API.

## Overview

The Text Analytics API is a suite of text analytics [web services](https://datamarket.azure.com/dataset/amla/text-analytics) built with Azure Machine Learning. The API can be used to analyze unstructured text for tasks such as sentiment analysis, key phrase extraction, language detection and topic detection. No training data is needed to use this API: just bring your text data. This API uses advanced natural language processing techniques to deliver best in class predictions.

You can see text analytics in action on our [demo site](https://text-analytics-demo.azurewebsites.net/), where you will also find [samples](https://text-analytics-demo.azurewebsites.net/Home/SampleCode) on how to implement text analytics in C# and Python.

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)] 

---

## Sentiment analysis

The API returns a numeric score between 0 & 1. Scores close to 1 indicate positive sentiment, while scores close to 0 indicate negative sentiment. Sentiment score is generated using classification techniques. The input features to the classifier include n-grams, features generated from part-of-speech tags, and word embeddings. Currently, English is the only supported language.
 
## Key phrase extraction

The API returns a list of strings denoting the key talking points in the input text. We employ techniques from Microsoft Office's sophisticated Natural Language Processing toolkit. Currently, English is the only supported language.

## Language detection

The API returns the detected language and a numeric score between 0 & 1. Scores close to 1 indicate 100% certainty that the identified language is true. A total of 120 languages are supported.

## Topic detection

This is a newly released API which returns the top detected topics for a list of submitted text records. A topic is identified with a key phrase, which can be one or more related words. This API requires a minimum of 100 text records to be submitted, but is designed to detect topics across hundreds to thousands of records. Note that this API charges 1 transaction per text record submitted. The API is designed to work well for short, human written text such as reviews and user feedback.

---

## API Definition

### Headers

Ensure that you include the correct headers in your request, which should be as follows:

	Authorization: Basic <creds>
	Accept: application/json
               
	Where <creds> = ConvertToBase64(“AccountKey:” + yourActualAccountKey);  

You can find your account key from your account in the [Azure Data Market](https://datamarket.azure.com/account/keys). Note that currently only JSON is accepted for input and output formats. XML is not supported.

---

## Single Response APIs

### GetSentiment

**URL**	

	https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetSentiment

**Example request**

In the call below, we are requesting sentiment analysis for the phrase "Hello World":

	GET https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetSentiment?Text=hello+world

This will return a response as follows:

	{
	  "odata.metadata":"https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/$metadata",
		"Score":1.0
	}

---

### GetKeyPhrases

**URL**

	https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetKeyPhrases

**Example request**

In the call below, we are requesting the key phrases found in the text "It was a wonderful hotel to stay at, with unique decor and friendly staff":

	GET https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetKeyPhrases?
	Text=It+was+a+wonderful+hotel+to+stay+at,+with+unique+decor+and+friendly+staff

This will return a response as follows:

	{
	  "odata.metadata":"https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/$metadata",
	  "KeyPhrases":[
	    "wonderful hotel",
	    "unique decor",
	    "friendly staff"
	  ]
	}
 
---

### GetLanguage

**URL**

	https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetLanguage

**Example request**

In the GET call below, we are requesting for the sentiment for the key phrases in the text *Hello World*

	GET https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetLanguages?
	Text=Hello+World

This will return a response as follows:

	{
	  "UnknownLanguage": false,
	  "DetectedLanguages": [{
	    "Name": "English",
	    "Iso6391Name": "en",
	    "Score": 1.0
	  }]
	}

**Optional parameters**

`NumberOfLanguagesToDetect` is an optional parameter. The default is 1.

---

## Batch APIs

The Text Analytics service allows you to do sentiment and key-phrase extractions in batch mode. Note that each of the records scored counts as one transaction. As an example, if you request sentiment for 1000 records in a single call, 1000 transactions will be deducted.

Note that the IDs entered into the system are the IDs returned by the system. The web service does not check that these IDs are unique. It is the responsibility of the caller to verify uniqueness. 


### GetSentimentBatch

**URL**	

	https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetSentimentBatch

**Example request**

In the POST call below, we are requesting for the sentiments of the phrases "Hello World", "Hello Foo World" and "Hello My World" in the body of the request:

	POST https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetSentimentBatch 

Request body:

	{"Inputs":
	[
	    {"Id":"1","Text":"hello world"},
	    {"Id":"2","Text":"hello foo world"},
	    {"Id":"3","Text":"hello my world"},
	]}

In the response below, you get the list of scores associated with your text Ids:

	{
	  "odata.metadata":"<url>", 
	  "SentimentBatch":
	  [
		{"Score":0.9549767,"Id":"1"},
		{"Score":0.7767222,"Id":"2"},
		{"Score":0.8988889,"Id":"3"}
	  ],  
	  "Errors":[]
	}


---

### GetKeyPhrasesBatch

**URL**

	https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetKeyPhrasesBatch

**Example request**

In this example, we are requesting for the list of sentiments for the key phrases in the following texts: 

* "It was a wonderful hotel to stay at, with unique decor and friendly staff"
* "It was an amazing build conference, with very interesting talks"
* "The traffic was terrible, I spent three hours going to the airport"

This request is made as a POST call to the endpoint:

    POST https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetKeyPhrasesBatch

Request body:

	{"Inputs":
	[
		{"Id":"1","Text":"It was a wonderful hotel to stay at, with unique decor and friendly staff"},
		{"Id":"2","Text":"It was an amazing build conference, with very interesting talks"},
		{"Id":"3","Text":"The traffic was terrible, I spent three hours going to the airport"}
	]}

In the response below, you get the list of key phrases associated with your text Ids:

	{ "odata.metadata":"<url>",
	 	"KeyPhrasesBatch":
		[
		   {"KeyPhrases":["unique decor","friendly staff","wonderful hotel"],"Id":"1"},
		   {"KeyPhrases":["amazing build conference","interesting talks"],"Id":"2"},
		   {"KeyPhrases":["hours","traffic","airport"],"Id":"3" }
		],
		"Errors":[]
	}

---

### GetLanguageBatch

In the POST call below, we are requesting language detection for two text inputs:

    POST https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetLanguageBatch

Request body:

    {
      "Inputs": [
        {"Text": "hello world", "Id": "1"},
        {"Text": "c'est la vie", "Id": "2"}
      ]
    }

This returns the following response, where English is detected in the first input and French in the second input:

    {
       "LanguageBatch": [{
         "Id": "1",
         "DetectedLanguages": [{
            "Name": "English",
            "Iso6391Name": "en",
            "Score": 1.0
         }],
         "UnknownLanguage": false
       },
       {
         "Id": "2",
         "DetectedLanguages": [{
            "Name": "French",
            "Iso6391Name": "fr",
            "Score": 1.0
         }],
         "UnknownLanguage": false
       }],
       "Errors": []
    }

---

## Topic Detection APIs

This is a newly released API which returns the top detected topics for a list of submitted text records. A topic is identified with a key phrase, which can be one or more related words. Note that this API charges 1 transaction per text record submitted.

This API requires a minimum of 100 text records to be submitted, but is designed to detect topics across hundreds to thousands of records.


### Topics – Submit job

**URL**

	https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/StartTopicDetection

**Example request**


In the POST call below, we are requesting topics for a set of 100 articles, where the first and last input articles are shown, and two StopPhrases are included.

	POST https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/StartTopicDetection HTTP/1.1

Request body:

	{"Inputs":[
		{"Id":"1","Text":"I loved the food at this restaurant"},
		...,
		{"Id":"100","Text":"I hated the decor"}
	],
	"StopPhrases":[
		"restaurant", “visitor"
	]}

In the response below, you get the JobId for the submitted job:

	{
		"odata.metadata":"<url>",
		"JobId":"<JobId>"
	}

A list of single word or multiple word phrases which should not be returned as topics. Can be used to filter out very generic topics. For example, in a dataset about hotel reviews, "hotel" and "hostel" may be sensible stop phrases.  

### Topics – Poll for job results

**URL**

	https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetTopicDetectionResult

**Example request**

Pass the JobId returned from the ‘Submit job’ step to fetch the results. We recommend that you call this endpoint every minute until Status=’Complete’ in the response. It will take around 10 mins for a job to complete, or longer for jobs with many thousands of records.

	GET https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetTopicDetectionResult?JobId=<JobId>


While it is processing, the response will be as follows:

	{
		"odata.metadata":"<url>",
		"Status":"Running",
 		"TopicInfo":[],
		"TopicAssignment":[],
		"Errors":[]
	}


The API returns output in JSON format in the following format:

	{
		"odata.metadata":"<url>",
		"Status":"Finished",
		"TopicInfo":[
		{
			"TopicId":"ed00480e-f0a0-41b3-8fe4-07c1593f4afd",
			"Score":8.0,
			"KeyPhrase":"food"
		},
		...
		{
			"TopicId":"a5ca3f1a-fdb1-4f02-8f1b-89f2f626d692",
			"Score":6.0,
			"KeyPhrase":"decor"
    		}
  		],
		"TopicAssignment":[
		{
			"Id":"1",
			"TopicId":"ed00480e-f0a0-41b3-8fe4-07c1593f4afd",
			"Distance":0.7809
		},
		...
		{
			"Id":"100",
			"TopicId":"a5ca3f1a-fdb1-4f02-8f1b-89f2f626d692",
			"Distance":0.8034
		}
		],
		"Errors":[]


The properties for each part of the response are as follows:

**TopicInfo properties**

| Key | Description |
|:-----|:----|
| TopicId | A unique identifier for each topic. |
| Score | Count of records assigned to topic. |
| KeyPhrase | A summarizing word or phrase for the topic. Can be 1 or multiple words. |

**TopicAssignment properties**

| Key | Description |
|:-----|:----|
| Id | Identifier for the record. Equates to the ID included in the input. |
| TopicId | The topic ID which the record has been assigned to. |
| Distance | Confidence that the record belongs to the topic. Distance closer to zero indicates higher confidence. |
