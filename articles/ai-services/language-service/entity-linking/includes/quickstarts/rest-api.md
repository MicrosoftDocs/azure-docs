---
title: "Quickstart: Using cURL to call the Entity Linking REST API"
titleSuffix: Azure AI services
description: This quickstart shows how to quickly get started using the Entity linking REST API in Azure AI services.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 10/31/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

[Reference documentation](https://go.microsoft.com/fwlink/?linkid=2239169)

Use this quickstart to send entity linking requests using the REST API. In the following example, you will use cURL to identify and disambiguate entities found in text.

[!INCLUDE [Use Language Studio](../../../includes/use-language-studio.md)]

## Prerequisites

* The current version of [cURL](https://curl.haxx.se/).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
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




## Entity linking

[!INCLUDE [REST API quickstart instructions](../../../includes/rest-api-instructions.md)]

```bash
curl -i -X POST https://<your-language-resource-endpoint>/language/:analyze-text?api-version=2022-05-01 \
-H "Content-Type: application/json" \
-H "Ocp-Apim-Subscription-Key: <your-language-resource-key>" \
-d \
'
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
'
```




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
