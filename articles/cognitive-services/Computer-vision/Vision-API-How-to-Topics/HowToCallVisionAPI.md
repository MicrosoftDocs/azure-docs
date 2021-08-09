---
title: Call the Image Analysis API
titleSuffix: Azure Cognitive Services
description: Learn how to call the Image Analysis API and configure its behavior.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: sample
ms.date: 09/09/2019
ms.author: kefre
ms.custom: "seodec18, devx-track-csharp"
---

# Call the Image Analysis API

This article demonstrates how to call the Image Analysis API to return information about an image's visual features.

This guide assumes you have already <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> and obtained a subscription key and endpoint URL. If you haven't, follow a [quickstart](../quickstarts-sdk/image-analysis-client-library.md) to get started.
  
## Submit data to the service

You submit either a local image or a remote image to the Analyze API. For local, you put the binary image data in the HTTP request body. For remote, you specify the image's URL by formatting the request body like the following: `{"url":"http://example.com/images/test.jpg"}`.

## Determine how to process the data

###  Select visual features

The [Analyze API](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) gives you access to all of the service's image analysis features. You need to specify which features you want to use by setting the URL query parameters. A parameter can have multiple values, separated by commas. Each feature you specify will require additional computation time, so only specify what you need.

|URL parameter | Value | Description|
|---|---|--|
|`visualFeatures`|`Adult` | detects if the image is pornographic in nature (depicts nudity or a sex act), or is gory (depicts extreme violence or blood). Sexually suggestive content (aka racy content) is also detected.|
||`Brands` | detects various brands within an image, including the approximate location. The Brands argument is only available in English.|
||`Categories` | categorizes image content according to a taxonomy defined in documentation. This is the default value of `visualFeatures`.|
||`Color` | determines the accent color, dominant color, and whether an image is black&white.|
||`Description` | describes the image content with a complete sentence in supported languages.|
||`Faces` | detects if faces are present. If present, generate coordinates, gender and age.|
||`ImageType` | detects if image is clip art or a line drawing.|
||`Objects` | detects various objects within an image, including the approximate location. The Objects argument is only available in English.|
||`Tags` | tags the image with a detailed list of words related to the image content.|
|`details`| `Celebrities` | identifies celebrities if detected in the image.|
||`Landmarks` |identifies landmarks if detected in the image.|

A populated URL might look like the following:

`https://{endpoint}/vision/v2.1/analyze?visualFeatures=Description,Tags&details=Celebrities`

### Specify languages

You can also specify the language of the returned data. The following URL query parameter specifies the language. The default value is `en`.

|URL parameter | Value | Description|
|---|---|--|
|`language`|`en` | English|
||`es` | Spanish|
||`ja` | Japanese|
||`pt` | Portuguese|
||`zh` | Simplified Chinese|

A populated URL might look like the following:

`https://{endpoint}/vision/v2.1/analyze?visualFeatures=Description,Tags&details=Celebrities&language=en`

> [!NOTE]
> **Scoped API calls**
>
> Some of the features in Image Analysis can be called directly as well as through the Analyze API call. For example, you can do a scoped analysis of only image tags by making a request to `https://{endpoint}/vision/v3.2/tag`. See the [reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) for other features that can be called separately.

## Get results from the service

The service returns a `200` HTTP response, and the body contains the returned data in the form of a JSON string. The following is an example of a JSON response.

```json
{  
  "tags":[  
    {  
      "name":"outdoor",
      "score":0.976
    },
    {  
      "name":"bird",
      "score":0.95
    }
  ],
  "description":{  
    "tags":[  
      "outdoor",
      "bird"
    ],
    "captions":[  
      {  
        "text":"partridge in a pear tree",
        "confidence":0.96
      }
    ]
  }
}
```

See the following table for explanations of the fields in this example:

Field | Type | Content
------|------|------|
Tags  | `object` | The top-level object for an array of tags.
tags[].Name | `string`    | The keyword from the tags classifier.
tags[].Score    | `number`    | The confidence score, between 0 and 1.
description     | `object`    | The top-level object for an image description.
description.tags[] |    `string`    | The list of tags. If there is insufficient confidence in the ability to produce a caption, the tags might be the only information available to the caller.
description.captions[].text    | `string`    | A phrase describing the image.
description.captions[].confidence    | `number`    | The confidence score for the phrase.

### Error codes

See the following list of possible errors and their causes:

* 400
    * InvalidImageUrl - Image URL is badly formatted or not accessible.
    * InvalidImageFormat - Input data is not a valid image.
    * InvalidImageSize - Input image is too large.
    * NotSupportedVisualFeature - Specified feature type is not valid.
    * NotSupportedImage - Unsupported image, e.g. child pornography.
    * InvalidDetails - Unsupported `detail` parameter value.
    * NotSupportedLanguage - The requested operation is not supported in the language specified.
    * BadArgument - Additional details are provided in the error message.
* 415 - Unsupported media type error. The Content-Type is not in the allowed types:
    * For an image URL: Content-Type should be application/json
    * For a binary image data: Content-Type should be application/octet-stream or multipart/form-data
* 500
    * FailedToProcess
    * Timeout - Image processing timed out.
    * InternalServerError

## Next steps

To try out the REST API, go to the [Image Analysis API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b).
