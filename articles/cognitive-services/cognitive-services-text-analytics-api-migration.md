<properties
	pageTitle="Upgrading to Version 2 of the Text Analytics API | Microsoft Azure"
	description="Azure Machine Learning Text Analytics - Upgrade to Version 2"
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

# Upgrading to Version 2 of the Text Analytics API #

This guide will take you through the process of upgrading your code from using the [first version of the API](../machine-learning/machine-learning-apps-text-analytics.md) to using the second version. 

If you have not used the API and would like to learn more, you can **[learn more about the API here](//go.microsoft.com/fwlink/?LinkID=759711)** or **[follow the Quick Start Guide](//go.microsoft.com/fwlink/?LinkID=760860)**. For technical reference, refer to the **[API Definition](//go.microsoft.com/fwlink/?LinkID=759346)**.

### Part 1. Get a new key ###

First, you will need to get a new API key from the **Azure Portal**:

1. Navigate to the Text Analytics service through the [Cortana Intelligence Gallery](//gallery.cortanaintelligence.com/MachineLearningAPI/Text-Analytics-2). Here, you will also find links to the documentation and code samples.

1. Click **Sign Up**. This link will take you to the Azure management portal, where you can sign up for the service.

1. Select a plan. You may select the **free tier for 5,000 transactions/month**. As is a free plan, you will not be charged for using the service. You will need to login to your Azure subscription. 

1. After you sign up for Text Analytics, you'll be given an **API Key**. Copy this key, as you'll need it when using the API services.

### Part 2. Update the headers ###

Update the submitted header values as shown below. Note that the account key is no longer encoded.

**Version 1**

    Authorization: Basic base64encode(<your Data Market account key>)
    Accept: application/json

**Version 2**

    Content-Type: application/json
    Accept: application/json
    Ocp-Apim-Subscription-Key: <your Azure Portal account key>


### Part 3. Update the base URL ###

**Version 1**

    https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/

**Version 2**

    https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/

### Part 4a. Update the formats for sentiment, key phrases and languages ###

#### Endpoints ####

GET endpoints have now been deprecated, so all input should be submitted as a POST request. Update the endpoints to the ones shown below.

| |Version 1 single endpoint|Version 1 batch endpoint|Version 2 endpoint|
|---|---|---|---|
|Call type|GET|POST|POST|
|Sentiment|```GetSentiment```|```GetSentimentBatch```|```sentiment```|
|Key phrases|```GetKeyPhrases```|```GetKeyPhrasesBatch```|```keyPhrases```|
|Languages|```GetLanguage```|```GetLanguageBatch```|```languages```|

#### Input formats ####

Note that only POST format is now accepted, so you should reformat any input which previously used the single document endpoints accordingly. Inputs are not case sensitive.

**Version 1 (batch)**

    {
      "Inputs": [
        {
          "Id": "string",
          "Text": "string"
        }
      ]
    }

**Version 2**

    {
      "documents": [
        {
          "id": "string",
          "text": "string"
        }
      ]
    }

#### Output from sentiment ####

**Version 1**

    {
      "SentimentBatch":[{
        "Id":"string",
        "Score":"double"
      }],
      "Errors" : [{
        "Id":"string",
        "Message":"string"
      }]
    }

**Version 2**

    {
      "documents":[{
        "id":"string",
        "score":"double"
      }],
      "errors" : [{
        "id":"string",
        "message":"string"
      }]
    }

#### Output from key phrases ####

**Version 1**

    {
      "KeyPhrasesBatch":[{
        "Id":"string",
        "KeyPhrases":["string"]
      }],
      "Errors" : [{
        "Id":"string",
        "Message":"string"
      }]
    }

**Version 2**

    {
      "documents":[{
        "id":"string",
        "keyPhrases":["string"]
      }],
      "errors" : [{
        "id":"string",
        "message":"string"
      }]
    }

#### Output from languages ####


**Version 1**

    {
      "LanguageBatch":[{
        "id":"string",
        "detectedLanguages": [{
          "Score":"double"
          "Name":"string",
          "Iso6391Name":"string"
        }]
      }],
      "Errors" : [{
        "Id":"string",
        "Message":"string"
      }]
    }

**Version 2**

    {
      "documents":[{
        "id":"string",
        "detectedLanguages": [{
          "score":"double"
          "name":"string",
          "iso6391Name":"string"
        }]
      }],
      "errors" : [{
        "id":"string",
        "message":"string"
      }]
    }


### Part 4b. Update the formats for topics ###

#### Endpoints ####

| |Version 1 endpoint | Version 2 endpoint|
|---|---|---|
|Submit for topic detection (POST)|```StartTopicDetection```|```topics```|
|Fetch topic results (GET)|```GetTopicDetectionResult?JobId=<jobId>```|```operations/<operationId>```|

#### Input formats ####

**Version 1**

    {
      "StopWords": [
        "string"
      ],
      "StopPhrases": [
        "string"
      ], 
      "Inputs": [
        {
          "Id": "string",
          "Text": "string"
        }
      ]
    }

**Version 2**

    {
      "stopWords": [
        "string"
      ],
      "stopPhrases": [
        "string"
      ],
      "documents": [
        {
          "id": "string",
          "text": "string"
        }
      ]
    }

#### Submission results ####

**Version 1 (POST)**

Previously, when the job finished, you would receive the following JSON output, where the jobId would be appended to a URL to fetch the output.

    {
        "odata.metadata":"<url>",
        "JobId":"<JobId>"
    }

**Version 2 (POST)**

The response will now include a header value as follows, where `operation-location` is used as the endpoint to poll for the results:

    'operation-location': 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/operations/<operationId>'

#### Operation results ####

**Version 1 (GET)**

    {
      "TopicInfo" : [{
        "TopicId" : "string"
        "Score" : "double"
        "KeyPhrase" : "string"
      }],
      "TopicAssignment" : [{
        "Id" : "string",
        "TopicId" : "string",
        "Distance" : "double"
      }],
      "Errors" : [{
        "Id":"string",
        "Message":"string"
      }]
    }

**Version 2 (GET)**

As before, **periodically poll the output** (the suggested period is every minute) until the output is returned. 

When the topics API has finished, a status reading `succeeded` will be returned. This will then include the output results in the format shown below:

    {
        "status": "succeeded",
        "createdDateTime": "string",
        "operationType": "topics",
        "processingResult": {
            "topics" : [{
            "id" : "string"
            "score" : "double"
            "keyPhrase" : "string"
          }],
          "topicAssignments" : [{
            "topicId" : "string",
            "documentId" : "string",
            "distance" : "double"
          }],
          "errors" : [{
              "id":"string",
              "message":"string"
          }]
        }
    }

### Part 5. Test it! ###

You should now be good to go! Test your code with a small sample to ensure that you can successfully process your data.
