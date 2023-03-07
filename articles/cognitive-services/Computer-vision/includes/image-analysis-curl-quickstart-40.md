---
title: "Quickstart: Image Analysis 4.0 REST API"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, get started with the Image Analysis 4.0 REST API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 01/24/2023
ms.author: pafarley
ms.custom: seodec18, ignite-2022, references_regions
---

Use the Image Analysis REST API to read text and generate captions for the image (version 4.0 only).

> [!TIP]
> The Analysis 4.0 API can do many different operations. See the [Analyze Image how-to guide](../how-to/call-analyze-image-40.md) for examples that showcase all of the available features.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. In order to use the captioning feature in this quickstart, you must create your resource in one of the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US. After it deploys, select **Go to resource**.
  * You'll need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* [cURL](https://curl.haxx.se/) installed

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Vision&Product=Image-analysis&Page=quickstart4&Section=Prerequisites" target="_target">I ran into an issue</a>

## Analyze an image

To analyze an image for various visual features, do the following steps:

1. Copy the following `curl` command into a text editor.

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://<endpoint>/computervision/imageanalysis:analyze?features=caption,tags&model-version=latest&language=en&api-version=2023-02-01-preview" -d "{'url':'https://learn.microsoft.com/azure/cognitive-services/computer-vision/media/quickstarts/presentation.png'}"
    ```

1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your Computer Vision resource key.
    1. Replace the value of `<endpoint>` with your Computer Vision resource endpoint. For example: `https://YourResourceName.cognitiveservices.azure.com`.
    1. Optionally, change the image URL in the request body (`https://learn.microsoft.com/azure/cognitive-services/computer-vision/media/quickstarts/presentation.png`) to the URL of a different image to be analyzed.
1. Open a command prompt window.
1. Paste your edited `curl` command from the text editor into the command prompt window, and then run the command.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Vision&Product=Image-analysis&Page=quickstart4&Section=Analyze-image" target="_target">I ran into an issue</a>

### Examine the response

A successful response is returned in JSON. The sample application parses and displays a successful response in the command prompt window, similar to the following example:


```json
{
	"captionResult": {
		"text": "a man pointing at a screen",
		"confidence": 0.489955872297287
	},
	"modelVersion": "2023-02-01-preview",
	"metadata": {
		"width": 1038,
		"height": 692
	},
	"tagsResult": {
		"values": [
			{
				"name": "text",
				"confidence": 0.9966012239456177
			},
			{
				"name": "clothing",
				"confidence": 0.9801060557365418
			},
			{
				"name": "person",
				"confidence": 0.9596296548843384
			},
			{
				"name": "display device",
				"confidence": 0.9490274786949158
			},
			{
				"name": "indoor",
				"confidence": 0.947483241558075
			},
			{
				"name": "wall",
				"confidence": 0.9395941495895386
			},
			{
				"name": "media",
				"confidence": 0.9306115508079529
			},
			{
				"name": "television set",
				"confidence": 0.9280922412872315
			},
			{
				"name": "led-backlit lcd display",
				"confidence": 0.9254804849624634
			},
			{
				"name": "flat panel display",
				"confidence": 0.9209464192390442
			},
			{
				"name": "furniture",
				"confidence": 0.9132548570632935
			},
			{
				"name": "lcd tv",
				"confidence": 0.895058274269104
			},
			{
				"name": "man",
				"confidence": 0.8883916735649109
			},
			{
				"name": "television",
				"confidence": 0.8766454458236694
			},
			{
				"name": "video",
				"confidence": 0.8746980428695679
			},
			{
				"name": "multimedia",
				"confidence": 0.8719364404678345
			},
			{
				"name": "output device",
				"confidence": 0.8585700988769531
			},
			{
				"name": "computer monitor",
				"confidence": 0.844162106513977
			},
			{
				"name": "table",
				"confidence": 0.8429560661315918
			},
			{
				"name": "screen",
				"confidence": 0.7113153338432312
			},
			{
				"name": "standing",
				"confidence": 0.7051211595535278
			},
			{
				"name": "design",
				"confidence": 0.40424615144729617
			}
		]
	}
}
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Vision&Product=Image-analysis&Page=quickstart4&Section=Output" target="_target">I ran into an issue</a>

## Next steps

In this quickstart, you learned how to make basic image analysis calls using the REST API. Next, learn more about the Analysis 4.0 API features.

* [Call the Analyze Image 4.0 API](../how-to/call-analyze-image-40.md)
* [Image Analysis overview](../overview-image-analysis.md)
