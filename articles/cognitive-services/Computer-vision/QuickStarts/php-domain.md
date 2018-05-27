---
title: Computer Vision API PHP quickstart domain model | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: In this quickstart, you use a domain model to identify landmarks in  an image using Computer Vision with PHP in Cognitive Services.
services: cognitive-services
author: noellelacharite
manager: nolachar
ms.service: cognitive-services
ms.component: computer-vision
ms.topic: quickstart
ms.date: 05/27/2018
ms.author: nolachar
---
# Quickstart: Use a Domain Model with PHP

In this quickstart, you use a domain model to identify landmarks in an image using Computer Vision.

## Prerequisites

To use Computer Vision, you need a subscription key; see [Obtaining Subscription Keys](../Vision-API-How-to-Topics/HowToSubscribe.md).

## Recognize Landmark request

With the [Recognize Domain Specific Content method](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e200), you can identify a specific set of objects in an image. The two domain-specific models that are currently available are _celebrities_ and _landmarks_.

To run the sample, do the following steps:

The following example identifies a landmark in an image.

Change the REST URL to use the location where you obtained your subscription keys, and replace the "Ocp-Apim-Subscription-Key" value with your valid subscription key.

```php
<html>
<head>
    <title>PHP Sample</title>
</head>
<body>
<?php
// This sample uses PEAR (https://pear.php.net/package/HTTP_Request2/download)
require_once 'HTTP/Request2.php';

// NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
//   For example, if you obtained your subscription keys from westus, replace "westcentralus" in the 
//   URL below with "westus".
//
// Also, change "landmarks" to "celebrities" in the url to use the Celebrities model.
$request = new Http_Request2('https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/models/landmarks/analyze');
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
    'model' => 'landmarks',   // Use 'model' => 'celebrities' to use the Celebrities model.
);

$url->setQueryVariables($parameters);

$request->setMethod(HTTP_Request2::METHOD_POST);

// Request body
$body = json_encode(array(
    // Request body parameters
    'url' => 'https://upload.wikimedia.org/wikipedia/commons/2/23/Space_Needle_2011-07-04.jpg',
));
$request->setBody($body);

try
{
    $response = $request->send();
    echo "<pre>" . json_encode(json_decode($response->getBody()), JSON_PRETTY_PRINT) . "</pre>";
}
catch (HttpException $ex)
{
    echo "<pre>" . $ex . "</pre>";
}
?>
</body>
</html>
```

## Recognize Landmark response

A successful response is returned in JSON, for example:

```json
{
    "requestId": "0663b074-8eb3-4fab-a72e-4c31a49bd22e",
    "metadata": {
        "width": 2096,
        "height": 4132,
        "format": "Jpeg"
    },
    "result": {
        "landmarks": [
            {
                "name": "Space Needle",
                "confidence": 0.9998178
            }
        ]
    }
}
```

## Next steps

Explore the Computer Vision APIs used to analyze an image, detect celebrities and landmarks, create a thumbnail, and extract printed and handwritten text.

> [!div class="nextstepaction"]
> [Explore Computer Vision APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44)
