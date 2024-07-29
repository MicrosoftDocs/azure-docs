---
title: "Quickstart: Using cURL to call the Entity Linking REST API"
titleSuffix: Azure AI services
description: This quickstart shows how to quickly get started using the Entity linking REST API in Azure AI services.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: jboback
---

[Reference documentation](https://go.microsoft.com/fwlink/?linkid=2239169)

Use this quickstart to send entity linking requests using the REST API. In the following example, you will use cURL to identify and disambiguate entities found in text.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

## Setting up

[!INCLUDE [Create an Azure resource](../../../includes/create-resource.md)]



[!INCLUDE [Get your key and endpoint](../../../includes/get-key-endpoint.md)]



[!INCLUDE [Create environment variables](../../../includes/environment-variables.md)]


## Create a JSON file with the example request body

In a code editor, create a new file named `test_entitylinking_payload.json` and copy the following JSON example. This example request will be sent to the API in the next step.

```json
{
    "kind": "EntityLinking",
    "parameters": {
        "modelVersion": "latest"
    },
    "analysisInput":{
        "documents":[
            {
                "id":"1",
                "language":"en",
                "text": "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975."
            }
        ]
    }
}
```

Save `test_entitylinking_payload.json` somewhere on your computer. For example, your desktop.

<a name='send-a-entity-linking-api-request'></a>

## Send an entity linking API request

Use the following commands to send the API request using the program you're using. Copy the command into your terminal, and run it.

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

# [Windows](#tab/windows)

 Replace `C:\Users\<myaccount>\Desktop\test_entitylinking_payload.json` with the location of the example JSON request file you created in the previous step.

### Command prompt

```terminal
curl -X POST "%LANGUAGE_ENDPOINT%/language/:analyze-text?api-version=2022-05-01" ^
-H "Content-Type: application/json" ^
-H "Ocp-Apim-Subscription-Key: %LANGUAGE_KEY%" ^
-d "@C:\Users\<myaccount>\Desktop\test_entitylinking_payload.json"
```

### PowerShell

```terminal
curl.exe -X POST $env:LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2022-05-01 `
-H "Content-Type: application/json" `
-H "Ocp-Apim-Subscription-Key: $env:LANGUAGE_KEY" `
-d "@C:\Users\<myaccount>\Desktop\test_entitylinking_payload.json"
```

#### [Linux](#tab/linux)

Use the following commands to send the API request using the program you're using. Replace `/home/mydir/test_entitylinking_payload.json` with the location of the example JSON request file you created in the previous step.

```terminal
curl -X POST $LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2022-05-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d "@/home/mydir/test_entitylinking_payload.json"
```

#### [macOS](#tab/macos)

Use the following commands to send the API request using the program you're using. Replace `/home/mydir/test_sentiment_payload.json` with the location of the example JSON request file you created in the previous step.

```terminal
curl -X POST $LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2022-05-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d "@/home/mydir/test_entitylinking_payload.json"
```

---

### JSON response

```json
{
	"kind": "EntityLinkingResults",
	"results": {
		"documents": [{
			"id": "1",
			"entities": [{
				"bingId": "a093e9b9-90f5-a3d5-c4b8-5855e1b01f85",
				"name": "Microsoft",
				"matches": [{
					"text": "Microsoft",
					"offset": 0,
					"length": 9,
					"confidenceScore": 0.48
				}],
				"language": "en",
				"id": "Microsoft",
				"url": "https://en.wikipedia.org/wiki/Microsoft",
				"dataSource": "Wikipedia"
			}, {
				"bingId": "0d47c987-0042-5576-15e8-97af601614fa",
				"name": "Bill Gates",
				"matches": [{
					"text": "Bill Gates",
					"offset": 25,
					"length": 10,
					"confidenceScore": 0.52
				}],
				"language": "en",
				"id": "Bill Gates",
				"url": "https://en.wikipedia.org/wiki/Bill_Gates",
				"dataSource": "Wikipedia"
			}, {
				"bingId": "df2c4376-9923-6a54-893f-2ee5a5badbc7",
				"name": "Paul Allen",
				"matches": [{
					"text": "Paul Allen",
					"offset": 40,
					"length": 10,
					"confidenceScore": 0.54
				}],
				"language": "en",
				"id": "Paul Allen",
				"url": "https://en.wikipedia.org/wiki/Paul_Allen",
				"dataSource": "Wikipedia"
			}, {
				"bingId": "52535f87-235e-b513-54fe-c03e4233ac6e",
				"name": "April 4",
				"matches": [{
					"text": "April 4",
					"offset": 54,
					"length": 7,
					"confidenceScore": 0.38
				}],
				"language": "en",
				"id": "April 4",
				"url": "https://en.wikipedia.org/wiki/April_4",
				"dataSource": "Wikipedia"
			}],
			"warnings": []
		}],
		"errors": [],
		"modelVersion": "2021-06-01"
	}
}
```

[!INCLUDE [clean up resources](../../../includes/clean-up-resources.md)]


## Next steps

* [Entity linking language support](../../language-support.md)
* [How to call the entity linking API](../../how-to/call-api.md)  
* [Reference documentation](https://go.microsoft.com/fwlink/?linkid=2239169)
