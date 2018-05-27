---
title: Computer Vision API PHP quickstart create thumbnail | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: In this quickstart, you generate a thumbnail from an image using Computer Vision with PHP in Cognitive Services.
services: cognitive-services
author: noellelacharite
manager: nolachar
ms.service: cognitive-services
ms.component: computer-vision
ms.topic: quickstart
ms.date: 05/27/2018
ms.author: nolachar
---
# Quickstart: Generate a Thumbnail with PHP

In this quickstart, you generate a thumbnail from an image using Computer Vision.

## Prerequisites

To use Computer Vision, you need a subscription key; see [Obtaining Subscription Keys](../Vision-API-How-to-Topics/HowToSubscribe.md).

## Get Thumbnail request

With the [Get Thumbnail method](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fb), you can generate a thumbnail of an image. You specify the height and width, which can differ from the aspect ratio of the input image. Computer Vision uses smart cropping to intelligently identify the region of interest and generate cropping coordinates based on that region.

To run the sample, do the following steps:

Change the REST URL to use the location where you obtained your subscription keys, and replace the "Ocp-Apim-Subscription-Key" value with your valid subscription key.

```php
<?php
// This sample uses the Apache HTTP client from HTTP Components (http://hc.apache.org/httpcomponents-client-ga/)
require_once 'HTTP/Request2.php';

// NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
//   For example, if you obtained your subscription keys from westus, replace "westcentralus" in the 
//   URL below with "westus".
$request = new Http_Request2('https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/generateThumbnail');
$url = $request->getUrl();

$headers = array(
    // Request headers
    'Content-Type' => 'application/json',

    // NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
    'Ocp-Apim-Subscription-Key' => '13hc77781f7e4b19b5fcdd72a8df7156',
);

$request->setHeader($headers);

$parameters = array(
    // Request parameters
    'width' => '{number}',      // Replace "{number}" with the desired width of your thumbnail.
    'height' => '{number}',     // Replace "{number}" with the desired height of your thumbnail.
    'smartCropping' => 'true',
);

$url->setQueryVariables($parameters);

$request->setMethod(HTTP_Request2::METHOD_POST);

// Request body
$request->setBody("{body}");    // Replace "{body}" with the body. For example, '{"url": "http://www.example.com/images/image.jpg"}'

try
{
    $response = $request->send();
    echo $response->getBody();
}
catch (HttpException $ex)
{
    echo $ex;
}

?>
```

## Get Thumbnail response

A successful response contains the thumbnail image binary. If the request fails, the response contains an error code and a message to help determine what went wrong.

## Next steps

Explore the Computer Vision APIs used to analyze an image, detect celebrities and landmarks, create a thumbnail, and extract printed and handwritten text.

> [!div class="nextstepaction"]
> [Explore Computer Vision APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44)
