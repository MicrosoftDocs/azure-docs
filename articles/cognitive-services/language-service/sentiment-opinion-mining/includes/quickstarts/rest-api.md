---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 08/15/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

[Reference documentation](/rest/api/language/text-analysis-runtime)

Use this quickstart to send sentiment analysis requests using the REST API. In the following example, you will use cURL to identify the sentiment(s) expressed in a text sample, and perform aspect-based sentiment analysis.

[!INCLUDE [Use Language Studio](../../../includes/use-language-studio.md)]


## Prerequisites

* The current version of [cURL](https://curl.haxx.se/).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.

> [!NOTE]
> * The following BASH examples use the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character.
> * You can find language specific samples on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code).
> * Go to the Azure portal and find the key and endpoint for the Language resource you created in the prerequisites. They will be located on the resource's **key and endpoint** page, under **resource management**. Then replace the strings in the code below with your key and endpoint.
To call the API, you need the following information:


|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

The following cURL commands are executed from a BASH shell. Edit these commands with your own resource name, resource key, and JSON values.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Sentiment-analysis&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>


## Sentiment analysis and opinion mining

[!INCLUDE [REST API quickstart instructions](../../../includes/rest-api-instructions.md)]

> [!NOTE]
> The below examples include a request for the Opinion Mining feature of Sentiment Analysis using the `opinionMining=true` parameter, which provides granular information about assessments (adjectives) related to targets (nouns) in the text.

```bash
curl -i -X POST <your-language-resource-endpoint>/language/:analyze-text?api-version=2022-05-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-language-resource-key>" \
-d \
'
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
'
```

### JSON response

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

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Sentiment-analysis&Page=quickstart&Section=Sentiment-analysis-and-opinion-mining" target="_target">I ran into an issue</a>

[!INCLUDE [clean up resources](../../../includes/clean-up-resources.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Entity-linking&Page=quickstart&Section=Clean-up-resources" target="_target">I ran into an issue</a>

## Next steps

* [Sentiment analysis and opinion mining language support](../../language-support.md)
* [How to call the API](../../how-to/call-api.md)  
* [Reference documentation](/rest/api/language/text-analysis-runtime)