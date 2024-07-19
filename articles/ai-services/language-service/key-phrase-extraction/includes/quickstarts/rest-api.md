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

Use this quickstart to send key phrase extraction requests using the REST API. In the following example, you use cURL to identify key words and phrases found in text.


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)


## Setting up

[!INCLUDE [Create an Azure resource](../../../includes/create-resource.md)]



[!INCLUDE [Get your key and endpoint](../../../includes/get-key-endpoint.md)]



[!INCLUDE [Create environment variables](../../../includes/environment-variables.md)]




## Create a JSON file with the example request body

In a code editor, create a new file named `test_kpe_payload.json` and copy the following JSON example. This example request will be sent to the API in the next step.

```json
{
    "kind": "KeyPhraseExtraction",
    "parameters": {
        "modelVersion": "latest"
    },
    "analysisInput":{
        "documents":[
            {
                "id":"1",
                "language":"en",
                "text": "Dr. Smith has a very modern medical office, and she has great staff."
            }
        ]
    }
}
```

Save `test_kpe_payload.json` somewhere on your computer. For example, your desktop.  


## Send a key phrase extraction API request

Use the following commands to send the API request using the program you're using. Copy the command into your terminal, and run it.

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

# [Windows](#tab/windows)

 Replace `C:\Users\<myaccount>\Desktop\test_kpe_payload.json` with the location of the example JSON request file you created in the previous step.

### Command prompt

```terminal
curl -X POST "%LANGUAGE_ENDPOINT%/language/:analyze-text?api-version=2022-05-01" ^
-H "Content-Type: application/json" ^
-H "Ocp-Apim-Subscription-Key: %LANGUAGE_KEY%" ^
-d "@C:\Users\<myaccount>\Desktop\test_kpe_payload.json"
```

### PowerShell

```terminal
curl.exe -X POST $env:LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2022-05-01 `
-H "Content-Type: application/json" `
-H "Ocp-Apim-Subscription-Key: $env:LANGUAGE_KEY" `
-d "@C:\Users\<myaccount>\Desktop\test_kpe_payload.json"
```

#### [Linux](#tab/linux)

Use the following commands to send the API request using the program you're using. Replace `/home/mydir/test_kpe_payload.json` with the location of the example JSON request file you created in the previous step.

```terminal
curl -X POST $LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2022-05-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d "@/home/mydir/test_kpe_payload.json"
```

#### [macOS](#tab/macos)

Use the following commands to send the API request using the program you're using. Replace `/home/mydir/test_kpe_payload.json` with the location of the example JSON request file you created in the previous step.

```terminal
curl -X POST $LANGUAGE_ENDPOINT/language/:analyze-text?api-version=2022-05-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" \
-d "@/home/mydir/test_kpe_payload.json"
```

---


### JSON response

```json
{
	"kind": "KeyPhraseExtractionResults",
	"results": {
		"documents": [{
			"id": "1",
			"keyPhrases": ["modern medical office", "Dr. Smith", "great staff"],
			"warnings": []
		}],
		"errors": [],
		"modelVersion": "2021-06-01"
	}
}
```
