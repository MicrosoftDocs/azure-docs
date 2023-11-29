---
title: "Quickstart: Optical character recognition REST API"
titleSuffix: "Azure AI services"
description: In this quickstart, get started with the Optical character recognition REST API.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: include
ms.date: 08/07/2023
ms.author: pafarley
ms.custom: seodec18
---

Use the optical character recognition (OCR) REST API to read printed and handwritten text.

> [!NOTE]
> This quickstart uses cURL commands to call the REST API. You can also call the REST API using a programming language. See the GitHub samples for examples in [C#](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/ComputerVision/REST), [Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/python/ComputerVision/REST), [Java](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/java/ComputerVision/REST), and [JavaScript](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/javascript/ComputerVision/REST).

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
- [cURL](https://curl.haxx.se/) installed.
- <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision" title="create a Vision resource" target="_blank">An Azure AI Vision resource</a>. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
- The key and endpoint from the resource you create to connect your application to the Azure AI Vision service.

  1. After your Azure Vision resource deploys, select **Go to resource**.
  1. In the left navigation menu, select **Keys and Endpoint**.
  1. Copy one of the keys and the **Endpoint** for use later in the quickstart.

## Read printed and handwritten text

The optical character recognition (OCR) service can extract visible text in an image or document and convert it to a character stream. For more information on text extraction, see the [OCR overview](../overview-ocr.md).

### Call the Read API

To create and run the sample, do the following steps:

1. Copy the following command into a text editor.
1. Make the following changes in the command where needed:

   1. Replace the value of `<key>` with your key.
   1. Replace the first part of the request URL (`https://westcentralus.api.cognitive.microsoft.com/`) with the text in your own endpoint URL.
        [!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]
    1. Optionally, change the image URL in the request body (`https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png`) to the URL of a different image to be analyzed.
1. Open a command prompt window.
1. Paste the command from the text editor into the command prompt window, and then run the command.

```bash
curl -v -X POST "https://westcentralus.api.cognitive.microsoft.com/vision/v3.2/read/analyze" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: <subscription key>" --data-ascii "{'url':'https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png'}"
```

The response includes an `Operation-Location` header, whose value is a unique URL. You use this URL to query the results of the Read operation. The URL expires in 48 hours.

### Optionally, specify the model version

As an optional step, see [Determine how to process the data](../how-to/call-read-api.md#determine-how-to-process-the-data-optional). For example, to explicitly specify the latest GA model, use `model-version=2022-04-30` as the parameter. Skipping the parameter or using `model-version=latest` automatically uses the most recent GA model.

```bash
curl -v -X POST "https://westcentralus.api.cognitive.microsoft.com/vision/v3.2/read/analyze?model-version=2022-04-30" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: <subscription key>" --data-ascii "{'url':'https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png'}"
```

### Get Read results

1. Copy the following command into your text editor.
1. Replace the URL with the `Operation-Location` value you copied in the previous procedure.
1. Replace the value of `<key>` with your key.
1. Open a console window.
1. Paste the command from the text editor into the console window, and then run the command.

   ```bash
   curl -v -X GET "https://westcentralus.api.cognitive.microsoft.com/vision/v3.2/read/analyzeResults/{operationId}" -H "Ocp-Apim-Subscription-Key: {key}" --data-ascii "{body}" 
   ```

### Examine the response

A successful response is returned in JSON. The sample application parses and displays a successful response in the console window, similar to the following example:

```json
{
  "status": "succeeded",
  "createdDateTime": "2021-04-08T21:56:17.6819115+00:00",
  "lastUpdatedDateTime": "2021-04-08T21:56:18.4161316+00:00",
  "analyzeResult": {
    "version": "3.2",
    "readResults": [
      {
        "page": 1,
        "angle": 0,
        "width": 338,
        "height": 479,
        "unit": "pixel",
        "lines": [
          {
            "boundingBox": [
              25,
              14,
              318,
              14,
              318,
              59,
              25,
              59
            ],
            "text": "NOTHING",
            "appearance": {
              "style": {
                "name": "other",
                "confidence": 0.971
              }
            },
            "words": [
              {
                "boundingBox": [
                  27,
                  15,
                  294,
                  15,
                  294,
                  60,
                  27,
                  60
                ],
                "text": "NOTHING",
                "confidence": 0.994
              }
            ]
          }
        ]
      }
    ]
  }
}

```

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Clean up resources with the Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Clean up resources with Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to call the Read REST API. Next, learn more about the Read API features.

> [!div class="nextstepaction"]
>[Call the Read API](../how-to/call-read-api.md)

* [OCR overview](../overview-ocr.md)
