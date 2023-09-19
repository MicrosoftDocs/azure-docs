---
title: "Quickstart: Image Analysis REST API"
titleSuffix: "Azure AI services"
description: In this quickstart, get started with the Image Analysis REST API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 09/12/2022
ms.author: pafarley
ms.custom: seodec18, ignite-2022
---

Use the Image Analysis REST API to analyze an image for tags.

> [!TIP]
> The Analyze API can do many different operations other than generate image tags. See the [Image Analysis how-to guide](../how-to/call-analyze-image.md) for examples that showcase all of the available features.

> [!NOTE]
> This quickstart uses cURL commands to call the REST API. You can also call the REST API using a programming language. See the GitHub samples for examples in [C#](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/ComputerVision/REST), [Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/python/ComputerVision/REST), [Java](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/java/ComputerVision/REST), and [JavaScript](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/javascript/ComputerVision/REST).

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="create a Vision resource"  target="_blank">create a Vision resource</a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
  * You'll need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* [cURL](https://curl.haxx.se/) installed



## Analyze an image

To analyze an image for various visual features, do the following steps:

1. Copy the following command into a text editor.

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://westcentralus.api.cognitive.microsoft.com/vision/v3.2/analyze?visualFeatures=Tags" -d "{'url':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Salto_del_Angel-Canaima-Venezuela08.jpg/800px-Salto_del_Angel-Canaima-Venezuela08.jpg'}"
    ```

1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your key.
    1. Replace the first part of the request URL (`westcentralus`) with the text in your own endpoint URL.
        [!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]
    1. Optionally, change the image URL in the request body (`https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Salto_del_Angel-Canaima-Venezuela08.jpg/800px-Salto_del_Angel-Canaima-Venezuela08.jpg`) to the URL of a different image to be analyzed.
1. Open a command prompt window.
1. Paste your edited `curl` command from the text editor into the command prompt window, and then run the command.



### Examine the response

A successful response is returned in JSON. The sample application parses and displays a successful response in the command prompt window, similar to the following example:

```json
{{
   "tags":[
      {
         "name":"text",
         "confidence":0.9992657899856567
      },
      {
         "name":"post-it note",
         "confidence":0.9879657626152039
      },
      {
         "name":"handwriting",
         "confidence":0.9730165004730225
      },
      {
         "name":"rectangle",
         "confidence":0.8658561706542969
      },
      {
         "name":"paper product",
         "confidence":0.8561884760856628
      },
      {
         "name":"purple",
         "confidence":0.5961999297142029
      }
   ],
   "requestId":"2788adfc-8cfb-43a5-8fd6-b3a9ced35db2",
   "metadata":{
      "height":945,
      "width":1000,
      "format":"Jpeg"
   },
   "modelVersion":"2021-05-01"
}
```




## Next steps

In this quickstart, you learned how to make basic image analysis calls using the REST API. Next, learn more about the Analyze API features.

> [!div class="nextstepaction"]
>[Call the Analyze API](../how-to/call-analyze-image.md)

* [Image Analysis overview](../overview-image-analysis.md)
