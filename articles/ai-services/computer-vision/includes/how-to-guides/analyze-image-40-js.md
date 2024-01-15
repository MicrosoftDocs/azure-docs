---
author: PatrickFarley
manager: nitinme
ms.service: ai-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 01/15/2024
ms.author: pafarley
---

## Prerequisites

This guide assumes you have followed the steps mentioned in the [quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40). This means:

* You have <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Computer Vision resource"  target="_blank">created a Computer Vision resource </a> and obtained a key and endpoint URL.
* You have the appropriate SDK package installed and you have a running [quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40) application. You can modify this quickstart application based on the code examples here.

## Create and authenticate the client

To authenticate against the Image Analysis service, you need a Computer Vision key and endpoint URL. This guide assumes that you've defined the environment variables `VISION_KEY` and `VISION_ENDPOINT` with your key and endpoint.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Azure AI services [security](/azure/ai-services/security-features) article for more authentication options like [Azure Key Vault](/azure/ai-services/use-key-vault). 

Start by creating a **ImageAnalysisClient** object. For example:

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/4-0/how-to.js?name=snippet_client)]

## Select the image to analyze

You can select an image by providing a publicly accessible image URL, or by reading image data into the SDK's input buffer. See [Image requirements](../../overview-image-analysis.md?tabs=4-0#image-requirements) for supported image formats.

### Image URL

You can use the following sample image URL.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/4-0/how-to.js?name=snippet_url)]

### Image buffer

Alternatively, you can read the data to the input buffer. For example, read from a local image file you want to analyze.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/4-0/how-to.js?name=snippet_file)]


## Select visual features

The Analysis 4.0 API gives you access to all of the service's image analysis features. Choose which operations to do based on your own use case. See the [overview](/azure/ai-services/computer-vision/overview-image-analysis) for a description of each feature. The example in this section adds all of the available visual features, but for practical usage you likely need fewer. 

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/4-0/how-to.js?name=snippet_features)]

## Call the Analyze API with options

The following code calls the Analyze API with the features you selected above and additional options, defined below. 

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/4-0/how-to.js?name=snippet_call)]


### Select smart cropping aspect ratios

An aspect ratio is calculated by dividing the target crop width by the height. Supported values are from 0.75 to 1.8 (inclusive). Setting this property is only relevant when the **smart_crops_aspect_ratios** option (REST API) or **VisualFeatures.SmartCrops** (SDK) was selected as part the visual feature list. If you select smartCrop/VisualFeatures.SmartCrops but don't specify aspect ratios, the service returns one crop suggestion with an aspect ratio it sees fit. In this case, the aspect ratio is between 0.5 and 2.0 (inclusive).

### Select gender neutral captions

If you're extracting captions or dense captions, you can ask for gender neutral captions. Gender neutral captions is optional, with the default being gendered captions. For example, in English, when you select gender neutral captions, terms like **woman** or **man** are replaced with **person**, and **boy** or **girl** are replaced with **child**. 

### Specify languages

You can specify the language of the returned data. The language is optional, with the default being English. See [Language support](https://aka.ms/cv-languages) for a list of supported language codes and which visual features are supported for each language.

## Get results from the service

The following code shows you how to parse the results of the various **analyze** operations.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/ComputerVision/4-0/how-to.js?name=snippet_node)]


## Troubleshooting

### Logging

Enabling logging may help uncover useful information about failures. In order to see a log of HTTP requests and responses, set the `AZURE_LOG_LEVEL` environment variable to `info`. Alternatively, logging can be enabled at runtime by calling `setLogLevel` in the `@azure/logger`:

```javascript
const { setLogLevel } = require("@azure/logger");

setLogLevel("info");
```

For more detailed instructions on how to enable logs, you can look at the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/core/logger).
