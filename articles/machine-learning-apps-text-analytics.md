<properties
	pageTitle="Machine Learning app: Text Analytics Service for analyzing sentiment | Azure "
	description="Text Analytics API is a suite of text analytics built with Azure Machine Learning. The API can be used to analyze unstructured text for tasks such as sentiment analysis and key phrase extraction."
	services="machine-learning"
	documentationCenter=""
	authors="LuisCabrer"
	manager="paulettm"
	editor="cgronlun"/> 

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/05/2015"
	ms.author="luisca"/>


# Machine Learning Text Analytics Service#
##Overview
Text Analytics API is a suite of text analytics [web services]( https://datamarket.azure.com/dataset/amla/text-analytics) built with Azure Machine Learning. The API can be used to analyze unstructured text for tasks such as sentiment analysis and key phrase extraction. No training data is needed to use this API, just bring your text data. We support English language only right now. This API uses advanced natural language processing techniques under the hood.

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)] 
 
## Sentiment analysis##
The API returns a numeric score between 0 & 1. Scores close to 1 indicate positive sentiment, while scores close to 0 indicate negative sentiment. Sentiment score is generated using classification techniques. The input features to the classifier include n-grams, features generated from part-of-speech tags, and word embeddings.
 
## Key phrase extraction##
The API returns a list of strings denoting the key talking points in the input text. We employ techniques from Microsoft Office's sophisticated Natural Language Processing toolkit.

## API Definition##

###GetSentiment###

**URL**	

	https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetSentiment

**Example request**

In the GET call below, we are requesting for the sentiment for the phrase *Hello World*

    GET https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetSentiment?Text=hello+world

Headers:

	Authorization: Basic <creds>
	Accept: application/json
               
	Where <creds> = ConvertToBase64(“AccountKey:” + yourActualAccountKey);  

You get your account key [here]( https://datamarket.azure.com/account/keys). 

**Example response**

	{
	  "odata.metadata":"https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/$metadata",
		"Score":1.0
	}

---

###GetKeyPhrases###

**URL**

	https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetKeyPhrases

**Example request**

In the GET call below, we are requesting for the sentiment for the key phrases in the text *It was a wonderful hotel to stay at, with unique decor and friendly staff*

	GET https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetKeyPhrases?
	Text=It+was+a+wonderful+hotel+to+stay+at,+with+unique+decor+and+friendly+staff

Headers:

	Authorization: Basic <creds>
	Accept: application/json
               
	Where <creds> = ConvertToBase64(“AccountKey:” + yourActualAccountKey)

You get your account key [here]( https://datamarket.azure.com/account/keys). 


**Example response**

	{
	  "odata.metadata":"https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/$metadata","KeyPhrases":[
	    "wonderful hotel","unique decor","friendly staff"]
	}
 
