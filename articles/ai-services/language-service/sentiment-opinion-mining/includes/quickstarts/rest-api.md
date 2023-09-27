---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 07/19/2023
ms.author: aahi
ms.custom: ignite-fall-2021
---

[Reference documentation](https://go.microsoft.com/fwlink/?linkid=2239169)

Use this quickstart to send sentiment analysis requests using the REST API. In the following example, you'll use cURL to identify the sentiment(s) expressed in a text sample, and perform aspect-based sentiment analysis.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)



## Setting up

[!INCLUDE [Create an Azure resource](../../../includes/create-resource.md)]



[!INCLUDE [Get your key and endpoint](../../../includes/get-key-endpoint.md)]



[!INCLUDE [Create environment variables](../../../includes/environment-variables.md)]




## Create a JSON file with the example request body

In a code editor, create a new file named `test_sentiment_payload.json` and copy the following JSON example. This example request will be sent to the API in the next step.

```json
{
	"kind": "SentimentAnalysis",
	"parameters": {
		"modelVersion": "latest",
		"opinionMining": "True"
	},
	"analysisInput":{
		"documents":[
			{
				"id":"1",
				"language":"en",
				"text": "The food and service were unacceptable. The concierge was nice, however."
			}
		]
	}
} 
```

Save `test_sentiment_payload.json` somewhere on your computer. For example, your desktop.  

## Send a sentiment analysis and opinion mining API request

> [!NOTE]
> The below examples include a request for the opinion mining feature of sentiment analysis, which provides granular information about assessments (adjectives) related to targets (nouns) in the text.

Use the following commands to send the API request using the program you're using. Copy the command into your terminal, and run it.

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON file containing the documents you want to send.         |

# [Windows](#tab/windows)

 Replace `C:\Users\<myaccount>\Desktop\test_sentiment_payload.json` with the location of the example JSON request file you created in the previous step.

### Command prompt

```terminal
curl -X POST "%LANGUAGE_ENDPOINT%/language/:analyze-text?api-version=2023-04-15-preview" ^
-H "Content-Type: application/json" ^
-H "Ocp-Apim-Subscription-Key: %LANGUAGE_KEY%" ^
-d "@C:\Users\<myaccount>\Desktop\test_sentiment_payload.json"
```

### PowerShell

```terminal
curl.exe -X POST $env:LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2023-04-15-preview `
-H "Content-Type: application/json" `
-H "Ocp-Apim-Subscription-Key: $env:LANGUAGE_KEY" `
-d "@C:\Users\<myaccount>\Desktop\test_sentiment_payload.json"
```

#### [Linux](#tab/linux)

Use the following commands to send the API request using the program you're using. Replace `/home/mydir/test_sentiment_payload.json` with the location of the example JSON request file you created in the previous step.

```terminal
curl -X POST $LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2023-04-15-preview \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d "@/home/mydir/test_sentiment_payload.json"
```

#### [macOS](#tab/macos)

Use the following commands to send the API request using the program you're using. Replace `/home/mydir/test_sentiment_payload.json` with the location of the example JSON request file you created in the previous step.

```terminal
curl -X POST $LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2023-04-15-preview \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d "@/home/mydir/test_sentiment_payload.json"
```

---

## JSON response

```json
{
	"kind": "SentimentAnalysisResults",
	"results": {
		"documents": [{
			"id": "1",
			"sentiment": "mixed",
			"confidenceScores": {
				"positive": 0.47,
				"neutral": 0.0,
				"negative": 0.52
			},
			"sentences": [{
				"sentiment": "negative",
				"confidenceScores": {
					"positive": 0.0,
					"neutral": 0.0,
					"negative": 0.99
				},
				"offset": 0,
				"length": 40,
				"text": "The food and service were unacceptable. ",
				"targets": [{
					"sentiment": "negative",
					"confidenceScores": {
						"positive": 0.0,
						"negative": 1.0
					},
					"offset": 4,
					"length": 4,
					"text": "food",
					"relations": [{
						"relationType": "assessment",
						"ref": "#/documents/0/sentences/0/assessments/0"
					}]
				}, {
					"sentiment": "negative",
					"confidenceScores": {
						"positive": 0.0,
						"negative": 1.0
					},
					"offset": 13,
					"length": 7,
					"text": "service",
					"relations": [{
						"relationType": "assessment",
						"ref": "#/documents/0/sentences/0/assessments/0"
					}]
				}],
				"assessments": [{
					"sentiment": "negative",
					"confidenceScores": {
						"positive": 0.0,
						"negative": 1.0
					},
					"offset": 26,
					"length": 12,
					"text": "unacceptable",
					"isNegated": false
				}]
			}, {
				"sentiment": "positive",
				"confidenceScores": {
					"positive": 0.94,
					"neutral": 0.01,
					"negative": 0.05
				},
				"offset": 40,
				"length": 32,
				"text": "The concierge was nice, however.",
				"targets": [{
					"sentiment": "positive",
					"confidenceScores": {
						"positive": 1.0,
						"negative": 0.0
					},
					"offset": 44,
					"length": 9,
					"text": "concierge",
					"relations": [{
						"relationType": "assessment",
						"ref": "#/documents/0/sentences/1/assessments/0"
					}]
				}],
				"assessments": [{
					"sentiment": "positive",
					"confidenceScores": {
						"positive": 1.0,
						"negative": 0.0
					},
					"offset": 58,
					"length": 4,
					"text": "nice",
					"isNegated": false
				}]
			}],
			"warnings": []
		}],
		"errors": [],
		"modelVersion": "2022-06-01"
	}
}
```



[!INCLUDE [clean up resources](../../../includes/clean-up-resources.md)]

[!INCLUDE [clean up environment variables](../../../includes/clean-up-variables.md)]



## Next steps

* [Sentiment analysis and opinion mining language support](../../language-support.md)
* [How to call the API](../../how-to/call-api.md)  
* [Reference documentation](https://go.microsoft.com/fwlink/?linkid=2239169)
