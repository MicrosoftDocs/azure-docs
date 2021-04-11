---
title: "Quickstart: Computer Vision REST API"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, get started with the Computer Vision REST API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: quickstart
ms.date: 12/02/2020
ms.author: pafarley
ms.custom: seodec18
---

Use the Computer Vision REST API to:

* Analyze an image for tags, text description, faces, adult content, and more.
* Read printed and handwritten text with the Read API.
* Generate a thumbnail with smart cropping

> [!NOTE]
> This quickstart uses cURL commands to call the REST API. You can also call the REST API using a programming language. See the GitHub samples for examples in [C#](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/ComputerVision/REST), [Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/python/ComputerVision/REST), [Java](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/java/ComputerVision/REST), [JavaScript](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/javascript/ComputerVision/REST), and [Go](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/go/ComputerVision/REST).

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
  * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* [cURL](https://curl.haxx.se/) installed

## Analyze an image

To analyze an image for a variety of visual features, do the following steps:

1. Copy the following command into a text editor.
1. Go to the Azure portal. If the Computer Vision resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your subscription key and endpoint in the resource's **key and endpoint** page, under **resource management**.
1. Make the following changes in the command where needed:
    1. Replace the value of `PASTE_YOUR_COMPUTER_VISION_SUBSCRIPTION_KEY_HERE` with your subscription key.
    1. Replace the first part of the request URL (`PASTE_YOUR_COMPUTER_VISION_ENDPOINT_HERE`) with your own Computer Vision endpoint. Your Computer Vision endpoint has the form `https://<your_computer_vision_resource_name>.cognitiveservices.azure.com/`.
        [!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]
    1. Optionally, change the image URL in the request body (`http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg\`) to the URL of a different image to be analyzed.
1. Open a command prompt window.
1. Paste the command from the text editor into the command prompt window, and then run the command.

```bash
curl -H "Ocp-Apim-Subscription-Key: PASTE_YOUR_COMPUTER_VISION_SUBSCRIPTION_KEY_HERE" -H "Content-Type: application/json" "PASTE_YOUR_COMPUTER_VISION_ENDPOINT_HERE/vision/v3.1/analyze?visualFeatures=Categories,Description&details=Landmarks" -d "{\"url\":\"http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg\"}"
```

> [!IMPORTANT]
> Remember to remove the subscription key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](../../../key-vault/general/overview.md).

### Examine the response

A successful response is returned in JSON. The sample application parses and displays a successful response in the command prompt window, similar to the following example:

```json
{
  "categories": [
    {
      "name": "outdoor_water",
      "score": 0.9921875,
      "detail": {
        "landmarks": []
      }
    }
  ],
  "description": {
    "tags": [
      "nature",
      "water",
      "waterfall",
      "outdoor",
      "rock",
      "mountain",
      "rocky",
      "grass",
      "hill",
      "covered",
      "hillside",
      "standing",
      "side",
      "group",
      "walking",
      "white",
      "man",
      "large",
      "snow",
      "grazing",
      "forest",
      "slope",
      "herd",
      "river",
      "giraffe",
      "field"
    ],
    "captions": [
      {
        "text": "a large waterfall over a rocky cliff",
        "confidence": 0.916458423253597
      }
    ]
  },
  "requestId": "b6e33879-abb2-43a0-a96e-02cb5ae0b795",
  "metadata": {
    "height": 959,
    "width": 1280,
    "format": "Jpeg"
  }
}
```

## Read printed and handwritten text

Computer Vision can read visible text in an image and convert it to a character stream. For more information on text recognition, see the [Optical character recognition (OCR)](../concept-recognizing-text.md#read-api) conceptual doc.

To create and run the sample, do the following steps:

1. Copy the following command into a text editor.
1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your subscription key.
    1. Replace the first part of the request URL (`westcentralus`) with the text in your own endpoint URL.
        [!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]
    1. Optionally, change the image URL in the request body (`https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png\`) to the URL of a different image to be analyzed.
1. Open a command prompt window.
1. Paste the command from the text editor into the command prompt window, and then run the command.

```bash
curl -v -X POST "https://westcentralus.api.cognitive.microsoft.com/vision/v3.1/read/analyze?language={string}" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: <subscription key>" --data-ascii "{\"url\":\"https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png\"}"
```

The response will include an `Operation-Location` header, whose value is a unique URL. You use this URL to query the results of the Read operation. The URL expires in 48 hours.

1. Copy the following command into your text editor.
1. Replace the URL with the `Operation-Location` value you copied in the previous step.
1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your subscription key.
1. Open a command prompt window.
1. Paste the command from the text editor into the command prompt window, and then run the command.

```bash
curl -v -X GET "https://westcentralus.api.cognitive.microsoft.com/vision/v3.1/read/analyzeResults/{operationId}" -H "Ocp-Apim-Subscription-Key: {subscription key}" --data-ascii "{body}" 
```

### Examine the response

A successful response is returned in JSON. The sample application parses and displays a successful response in the command prompt window, similar to the following example:

```json
{
  "status": "succeeded",
  "createdDateTime": "2019-10-03T14:32:04.236Z",
  "lastUpdatedDateTime": "2019-10-03T14:38:14.852Z",
  "analyzeResult": {
    "version": "v3.0",
    "readResults": [
      {
        "page": 1,
        "language": "en",
        "angle": 49.59,
        "width": 600,
        "height": 400,
        "unit": "pixel",
        "lines": [
          {
            "boundingBox": [
              202,
              618,
              2047,
              643,
              2046,
              840,
              200,
              813
            ],
            "text": "Our greatest glory is not",
            "words": [
              {
                "boundingBox": [
                  204,
                  627,
                  481,
                  628,
                  481,
                  830,
                  204,
                  829
                ],
                "text": "Our",
                "confidence": 0.164
              },
              {
                "boundingBox": [
                  519,
                  628,
                  1057,
                  630,
                  1057,
                  832,
                  518,
                  830
                ],
                "text": "greatest",
                "confidence": 0.164
              },
              {
                "boundingBox": [
                  1114,
                  630,
                  1549,
                  631,
                  1548,
                  833,
                  1114,
                  832
                ],
                "text": "glory",
                "confidence": 0.164
              },
              {
                "boundingBox": [
                  1586,
                  631,
                  1785,
                  632,
                  1784,
                  834,
                  1586,
                  833
                ],
                "text": "is",
                "confidence": 0.164
              },
              {
                "boundingBox": [
                  1822,
                  632,
                  2115,
                  633,
                  2115,
                  835,
                  1822,
                  834
                ],
                "text": "not",
                "confidence": 0.164
              }
            ]
          },
...
        ]
      },
      {
        "page": 2,
        "language": "en",
        "angle": 1.32,
        "width": 600,
        "height": 400,
        "unit": "pixel",
        "lines": [
          {
            "boundingBox": [
              1612,
              903,
              2744,
              935,
              2738,
              1139,
              1607,
              1107
            ],
            "text": "in never failing ,",
            "words": [
              {
                "boundingBox": [
                  1611,
                  934,
                  1707,
                  933,
                  1708,
                  1147,
                  1613,
                  1147
                ],
                "text": "in",
                "confidence": 0.164
              },
              {
                "boundingBox": [
                  1753,
                  933,
                  2132,
                  930,
                  2133,
                  1144,
                  1754,
                  1146
                ],
                "text": "never",
                "confidence": 0.999
              },
              {
                "boundingBox": [
                  2162,
                  930,
                  2673,
                  927,
                  2674,
                  1140,
                  2164,
                  1144
                ],
                "text": "failing",
                "confidence": 0.164
              },
              {
                "boundingBox": [
                  2703,
                  926,
                  2788,
                  926,
                  2790,
                  1139,
                  2705,
                  1140
                ],
                "text": ",",
                "confidence": 0.164
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## Generate a thumbnail

You can use Computer Vision to generate a thumbnail with smart cropping. You specify the desired height and width, which can differ in aspect ratio from the input image. Computer Vision uses smart cropping to intelligently identify the area of interest and generate cropping coordinates around that region.
 
To create and run the sample, do the following steps:

1. Copy the following command into a text editor.
1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your subscription key.
    1. Replace the value of `<thumbnailFile>` with the path and name of the file in which to save the returned thumbnail image.
    1. Replace the first part of the request URL (`westcentralus`) with the text in your own endpoint URL.
        [!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]
    1. Optionally, change the image URL in the request body (`https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Shorkie_Poo_Puppy.jpg/1280px-Shorkie_Poo_Puppy.jpg\`) to the URL of a different image from which to generate a thumbnail.
1. Open a command prompt window.
1. Paste the command from the text editor into the command prompt window.
1. Press enter to run the program.

    ```bash
    curl -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -o <thumbnailFile> -H "Content-Type: application/json" "https://westus.api.cognitive.microsoft.com/vision/v3.1/generateThumbnail?width=100&height=100&smartCropping=true" -d "{\"url\":\"https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Shorkie_Poo_Puppy.jpg/1280px-Shorkie_Poo_Puppy.jpg\"}"
    ```

### Examine the response

A successful response writes the thumbnail image to the file specified in `<thumbnailFile>`. If the request fails, the response contains an error code and a message to help determine what went wrong. If the request seems to succeed but the created thumbnail is not a valid image file, it might be that your subscription key is not valid.


## Next steps

Explore the Computer Vision API in more depth. To rapidly experiment with the Computer Vision API, try the [Open API testing console](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-1-ga/operations/56f91f2e778daf14a499f21b/console).

> [!div class="nextstepaction"]
> [Explore the Computer Vision API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-1-ga/operations/56f91f2e778daf14a499f21b)
