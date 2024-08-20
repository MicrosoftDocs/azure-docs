---
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: jboback
ms.custom: language-service-pii
---

[Reference documentation](https://go.microsoft.com/fwlink/?linkid=2239169)

Use this quickstart to send Personally Identifiable Information (PII) detection requests using the REST API. In the following example, you will use cURL to identify [recognized sensitive information](../../concepts/entity-categories.md) in text.


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)


## Setting up

[!INCLUDE [Create an Azure resource](../../../includes/create-resource.md)]



[!INCLUDE [Get your key and endpoint](../../../includes/get-key-endpoint.md)]



[!INCLUDE [Create environment variables](../../../includes/environment-variables.md)]


## Create a JSON file with the example request body

In a code editor, create a new file named `test_pii_payload.json` and copy the following JSON example. This example request will be sent to the API in the next step.

```json
{
    "kind": "PiiEntityRecognition",
    "parameters": {
        "modelVersion": "latest"
    },
    "analysisInput":{
        "documents":[
            {
                "id":"1",
                "language": "en",
                "text": "Call our office at 312-555-1234, or send an email to support@contoso.com"
            }
        ]
    }
}
'
```

Save `test_pii_payload.json` somewhere on your computer. For example, your desktop.  

## Send a personally identifying information (PII) detection API request

Use the following commands to send the API request using the program you're using. Copy the command into your terminal, and run it.

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

# [Windows](#tab/windows)

 Replace `C:\Users\<myaccount>\Desktop\test_pii_payload.json` with the location of the example JSON request file you created in the previous step.

### Command prompt

```terminal
curl -X POST "%LANGUAGE_ENDPOINT%/language/:analyze-text?api-version=2022-05-01" ^
-H "Content-Type: application/json" ^
-H "Ocp-Apim-Subscription-Key: %LANGUAGE_KEY%" ^
-d "@C:\Users\<myaccount>\Desktop\test_pii_payload.json"
```

### PowerShell

```terminal
curl.exe -X POST $env:LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2022-05-01 `
-H "Content-Type: application/json" `
-H "Ocp-Apim-Subscription-Key: $env:LANGUAGE_KEY" `
-d "@C:\Users\<myaccount>\Desktop\test_pii_payload.json"
```

#### [Linux](#tab/linux)

Use the following commands to send the API request using the program you're using. Replace `/home/mydir/test_sentiment_payload.json` with the location of the example JSON request file you created in the previous step.

```terminal
curl -X POST $LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2022-05-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d "@/home/mydir/test_pii_payload.json"
```

#### [macOS](#tab/macos)

Use the following commands to send the API request using the program you're using. Replace `/home/mydir/test_pii_payload.json` with the location of the example JSON request file you created in the previous step.

```terminal
curl -X POST $LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2022-05-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d "@/home/mydir/test_pii_payload.json"
```

---

### JSON response

```json
{
	"kind": "PiiEntityRecognitionResults",
	"results": {
		"documents": [{
			"redactedText": "Call our office at ************, or send an email to *******************",
			"id": "1",
			"entities": [{
				"text": "312-555-1234",
				"category": "PhoneNumber",
				"offset": 19,
				"length": 12,
				"confidenceScore": 0.8
			}, {
				"text": "support@contoso.com",
				"category": "Email",
				"offset": 53,
				"length": 19,
				"confidenceScore": 0.8
			}],
			"warnings": []
		}],
		"errors": [],
		"modelVersion": "2021-01-15"
	}
}
```
