---
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: jboback
---

[Reference documentation](https://go.microsoft.com/fwlink/?linkid=2239169)

Use this quickstart to send Named Entity Recognition (NER) requests using the REST API. In the following example, you'll use cURL to identify [recognized entities](../../concepts/named-entity-categories.md) in text.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)


## Setting up

[!INCLUDE [Create an Azure resource](../../../includes/create-resource.md)]



[!INCLUDE [Get your key and endpoint](../../../includes/get-key-endpoint.md)]



[!INCLUDE [Create environment variables](../../../includes/environment-variables.md)]


## Create a JSON file with the example request body

In a code editor, create a new file named `test_ner_payload.json` and copy the following JSON example. This example request will be sent to the API in the next step.

```json
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
```

Save `test_ner_payload.json` somewhere on your computer. For example, your desktop.  

## Send a named entity recognition API request

Use the following commands to send the API request using the program you're using. Copy the command into your terminal, and run it.

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

# [Windows](#tab/windows)

 Replace `C:\Users\<myaccount>\Desktop\test_ner_payload.json` with the location of the example JSON request file you created in the previous step.

### Command prompt

```terminal
curl -X POST "%LANGUAGE_ENDPOINT%/language/:analyze-text?api-version=2022-05-01" ^
-H "Content-Type: application/json" ^
-H "Ocp-Apim-Subscription-Key: %LANGUAGE_KEY%" ^
-d "@C:\Users\<myaccount>\Desktop\test_ner_payload.json"
```

### PowerShell

```terminal
curl.exe -X POST $env:LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2022-05-01 `
-H "Content-Type: application/json" `
-H "Ocp-Apim-Subscription-Key: $env:LANGUAGE_KEY" `
-d "@C:\Users\<myaccount>\Desktop\test_ner_payload.json"
```

#### [Linux](#tab/linux)

Use the following commands to send the API request using the program you're using. Replace `/home/mydir/test_ner_payload.json` with the location of the example JSON request file you created in the previous step.

```terminal
curl -X POST $LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2022-05-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d "@/home/mydir/test_ner_payload.json"
```

#### [macOS](#tab/macos)

Use the following commands to send the API request using the program you're using. Replace `/home/mydir/test_ner_payload.json` with the location of the example JSON request file you created in the previous step.

```terminal
curl -X POST $LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2022-05-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d "@/home/mydir/test_ner_payload.json"
```

---

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
