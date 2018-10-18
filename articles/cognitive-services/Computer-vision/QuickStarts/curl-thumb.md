---
title: "Quickstart: Generate a thumbnail - REST, cURL - Computer Vision"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you generate a thumbnail from an image using the Computer Vision API with cURL.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: quickstart
ms.date: 08/28/2018
ms.author: pafarley
---
# Quickstart: Generate a thumbnail using the REST API and cURL in Computer Vision

In this quickstart, you generate a thumbnail from an image by using Computer Vision's REST API. With the [Get Thumbnail](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fb) method, you can generate a thumbnail of an image. You specify the height and width, which can differ from the aspect ratio of the input image. Computer Vision uses smart cropping to intelligently identify the region of interest and generate cropping coordinates based on that region.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/ai/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=cognitive-services) before you begin.

## Prerequisites

To use Computer Vision, you need a subscription key; see [Obtaining Subscription Keys](../Vision-API-How-to-Topics/HowToSubscribe.md).

## Get Thumbnail request

With the [Get Thumbnail method](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fb), you can generate a thumbnail of an image. You specify the height and width, which can differ from the aspect ratio of the input image. Computer Vision uses smart cropping to intelligently identify the region of interest and generate cropping coordinates based on that region.

To run the sample, do the following steps:

1. Copy the following code into an editor.
1. Replace `<Subscription Key>` with your valid subscription key.
1. Replace `<File>` with the path and filename to save the thumbnail.
1. Change the Request URL (`https://westcentralus.api.cognitive.microsoft.com/vision/v2.0`) to use the location where you obtained your subscription keys, if necessary.
1. Optionally, change the image (`{\"url\":\"...`) to analyze.
1. Open a command window on a computer with cURL installed.
1. Paste the code in the window and run the command.

>[!NOTE]
>You must use the same location in your REST call as you used to obtain your subscription keys. For example, if you obtained your subscription keys from westus, replace "westcentralus" in the URL below with "westus".

## Prerequisites

- You must have [cURL](https://curl.haxx.se/windows).
- You must have a subscription key for Computer Vision. To get a subscription key, see [Obtaining Subscription Keys](../Vision-API-How-to-Topics/HowToSubscribe.md).

## Create and run the sample command

To create and run the sample, do the following steps:

1. Copy the following command into a text editor.
1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your subscription key.
    1. Replace the value of `<thumbnailFile>` with the path and name of the file in which to save the thumbnail.
    1. Replace the request URL (`https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/generateThumbnail`) with the endpoint URL for the [Get Thumbnail](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fb) method from the Azure region where you obtained your subscription keys, if necessary.
    1. Optionally, change the image URL in the request body (`https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Shorkie_Poo_Puppy.jpg/1280px-Shorkie_Poo_Puppy.jpg\`) to the URL of a different image from which to generate a thumbnail.
1. Open a command prompt window.
1. Paste the command from the text editor into the command prompt window, and then run the command.

```console
curl -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -o <thumbnailFile> -H "Content-Type: application/json" "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/generateThumbnail?width=100&height=100&smartCropping=true" -d "{\"url\":\"https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Shorkie_Poo_Puppy.jpg/1280px-Shorkie_Poo_Puppy.jpg\"}"
```

## Examine the response

A successful response writes the thumbnail image to the file specified in `<thumbnailFile>`. If the request fails, the response contains an error code and a message to help determine what went wrong.

## Clean up resources

When no longer needed, close the command prompt window and the text editor.

## Next steps

Explore the Computer Vision API used to analyze an image, detect celebrities and landmarks, create a thumbnail, and extract printed and handwritten text. To rapidly experiment with the Computer Vision API, try the [Open API testing console](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa/console).

> [!div class="nextstepaction"]
> [Explore the Computer Vision API](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44)
