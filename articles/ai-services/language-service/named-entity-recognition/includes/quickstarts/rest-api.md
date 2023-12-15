---
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 10/31/2022
ms.author: jboback
ms.custom: ignite-fall-2021
---

[Reference documentation](https://go.microsoft.com/fwlink/?linkid=2239169)

Use this quickstart to send Named Entity Recognition (NER) requests using the REST API. In the following example, you'll use cURL to identify [recognized entities](../../concepts/named-entity-categories.md) in text.

[!INCLUDE [Use Language Studio](../../../includes/use-language-studio.md)]

## Prerequisites

* The current version of [cURL](https://curl.haxx.se/).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You need the key and endpoint from the resource you create to connect your application to the API. Paste your key and endpoint into the code later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.

> [!NOTE]
> * The following BASH examples use the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character.
> * You can find language specific samples on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code).
> * Go to the Azure portal and find the key and endpoint for the Language resource you created in the prerequisites. They are located on the resource's **key and endpoint** page, under **resource management**. Then replace the strings in the code with your key and endpoint.
To call the API, you need the following information:

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

The following cURL commands are executed from a BASH shell. Edit these commands with your own resource name, resource key, and JSON values.

## Named Entity Extraction (NER)

[!INCLUDE [REST API quickstart instructions](../../../includes/rest-api-instructions.md)]

```bash
curl -i -X POST https://<your-language-resource-endpoint>/language/:analyze-text?api-version=2022-05-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key:<your-language-resource-key>" \
-d \
'
{
    "kind": "EntityRecognition",
    "parameters": {
        "modelVersion": "latest"
    },
    "analysisInput":{
        "documents":[
            {
                "id":"1",
                "language": "en",
                "text": "I had a wonderful trip to Seattle last week."
            }
        ]
    }
}
'
```

### JSON response

> [!NOTE]
> * The Generally Available API and the current Preview API have different response formats, please refer to the [generally available to preview api mapping article](../../concepts/ga-preview-mapping.md).
> * The preview API is available startin from API version `2023-04-15-preview`.

# [Generally Available API](#tab/ga-api)

```json
{
	"kind": "EntityRecognitionResults",
	"results": {
		"documents": [{
			"id": "1",
			"entities": [{
				"text": "trip",
				"category": "Event",
				"offset": 18,
				"length": 4,
				"confidenceScore": 0.74
			}, {
				"text": "Seattle",
				"category": "Location",
				"subcategory": "GPE",
				"offset": 26,
				"length": 7,
				"confidenceScore": 1.0
			}, {
				"text": "last week",
				"category": "DateTime",
				"subcategory": "DateRange",
				"offset": 34,
				"length": 9,
				"confidenceScore": 0.8
			}],
			"warnings": []
		}],
		"errors": [],
		"modelVersion": "2021-06-01"
	}
}
```

# [Preview API](#tab/preview-api)

```json
{
	"kind": "EntityRecognitionResults",
	"results": {
		"documents": [{
			"id": "1",
			"entities": [{
				"text": "trip",
				"type": "Event",
				"offset": 18,
				"length": 4,
				"score": 0.74,
				"tags": ["Event"]
			}, {
				"text": "Seattle",
				"type": "Location",
				"offset": 26,
				"length": 7,
				"score": 1.0,
				"tags": ["Location", "GPE", "City"]
			}, {
				"text": "last week",
				"type": "Temporal",
				"offset": 34,
				"length": 9,
				"score": 0.8,
				"tags": ["Temporal", "DateRange"],
				"metadata": {
					"begin": "2022-01-03 00:00:00",
					"end": "2022-01-10 00:00:00"
				}
			}],
			"warnings": []
		}],
		"errors": [],
		"modelVersion": "2023-04-01"
	}
}
```

---


