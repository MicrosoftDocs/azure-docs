<properties title="Machine Learning app: Text Analytics | Azure" pageTitle="Machine Learning app: Text Analytics Service for analyzing sentiment | Azure " description="Text Analytics API is a suite of text analytics built with Azure Machine Learning. The API can be used to analyze unstructured text for tasks such as sentiment analysis and key phrase extraction." services="machine-learning" documentationCenter="" authors="LuisCabrer" manager="paulettm" /> 

<tags ms.service="machine-learning" ms.devlang="na" ms.topic="reference" ms.tgt_pltfrm="na" ms.workload="multiple" ms.date="01/27/2015" ms.author="luisca"/>


# Machine Learning Text Analytics Service#

Text Analytics API is a suite of text analytics [web services]( https://datamarket.azure.com/dataset/amla/text-analytics) built with Azure Machine Learning. The API can be used to analyze unstructured text for tasks such as sentiment analysis and key phrase extraction. No training data is needed to use this API, just bring your text data. We support English language only right now. This API uses advanced natural language processing techniques under the hood.
 
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

    GET https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetSentiment?Text=%27Hello%20world%27

Headers:

	Authorization: Basic <creds>
	Accept: application/json
               
Where <creds\> = ConvertToBase64(“AccountKey:”<AccountKey>)

**Example response**

	{
	  "odata.metadata":"https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/$metadata","Score":1.0
	}

---

###GetKeyPhrases###

**URL**

https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetKeyPhrases

**Example request**

In the GET call below, we are requesting for the sentiment for the phrase *Hello World*

	GET https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetKeyPhrases?Text=%27hello%20world%27

Headers:

	Authorization: Basic <creds>
	Accept: application/json
               
Where <creds\> = ConvertToBase64(“AccountKey:”<AccountKey>)


**Example response**

	{
	  "odata.metadata":"https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/$metadata","KeyPhrases":[
	    "hello","world"]
	}
