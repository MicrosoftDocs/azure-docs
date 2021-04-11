---
title: Call the Computer Vision API
titleSuffix: Azure Cognitive Services
description: Learn how to call the Computer Vision API by using the REST API in Azure Cognitive Services.
services: cognitive-services
author: KellyDF
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: sample
ms.date: 09/09/2019
ms.author: kefre
ms.custom: "seodec18, devx-track-csharp"
---

# Call the Computer Vision API

This article demonstrates how to call the Computer Vision API by using the REST API. The samples are written both in C# by using the Computer Vision API client library and as HTTP POST or GET calls. The article focuses on:

- Getting tags, a description, and categories
- Getting domain-specific information, or "celebrities"

The examples in this article demonstrate the following features:

* Analyzing an image to return an array of tags and a description
* Analyzing an image with a domain-specific model (specifically, the "celebrities"  model) to return the corresponding result in JSON

The features offer the following options:

- **Option 1**: Scoped Analysis - Analyze only a specified model
- **Option 2**: Enhanced Analysis - Analyze to provide additional details by using [86-categories taxonomy](../Category-Taxonomy.md)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* An image URL or a path to a locally stored image
* Supported input methods: a raw image binary in the form of an application/octet-stream, or an image URL
* Supported image file formats: JPEG, PNG, GIF, and BMP
* Image file size: 4 MB or less
* Image dimensions: 50 &times; 50 pixels or greater
  
## Authorize the API call

Every call to the Computer Vision API requires a subscription key. This key must be either passed through a query string parameter or specified in the request header.

You can pass the subscription key by doing any of the following:

* Pass it through a query string, as in this Computer Vision API example:

  ```
  https://westus.api.cognitive.microsoft.com/vision/v2.1/analyze?visualFeatures=Description,Tags&subscription-key=<Your subscription key>
  ```

* Specify it in the HTTP request header:

  ```
  ocp-apim-subscription-key: <Your subscription key>
  ```

* When you use the client library, pass the key through the constructor of ComputerVisionClient, and specify the region in a property of the client:

    ```
    var visionClient = new ComputerVisionClient(new ApiKeyServiceClientCredentials("Your subscriptionKey"))
    {
        Endpoint = "https://westus.api.cognitive.microsoft.com"
    }
    ```

## Upload an image to the Computer Vision API service

The basic way to perform the Computer Vision API call is by uploading an image directly to return tags, a description, and celebrities. You do this by sending a "POST" request with the binary image in the HTTP body together with the data read from the image. The upload method is the same for all Computer Vision API calls. The only difference is the query parameters that you specify. 

For a specified image, get tags and a description by using either of the following options:

### Option 1: Get a list of tags and a description

```
POST https://westus.api.cognitive.microsoft.com/vision/v2.1/analyze?visualFeatures=Description,Tags&subscription-key=<Your subscription key>
```

```csharp
using System.IO;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;

ImageAnalysis imageAnalysis;
var features = new VisualFeatureTypes[] { VisualFeatureTypes.Tags, VisualFeatureTypes.Description };

using (var fs = new FileStream(@"C:\Vision\Sample.jpg", FileMode.Open))
{
  imageAnalysis = await visionClient.AnalyzeImageInStreamAsync(fs, features);
}
```

### Option 2: Get a list of tags only or a description only

For tags only, run:

```
POST https://westus.api.cognitive.microsoft.com/vision/v2.1/tag?subscription-key=<Your subscription key>
var tagResults = await visionClient.TagImageAsync("http://contoso.com/example.jpg");
```

For a description only, run:

```
POST https://westus.api.cognitive.microsoft.com/vision/v2.1/describe?subscription-key=<Your subscription key>
using (var fs = new FileStream(@"C:\Vision\Sample.jpg", FileMode.Open))
{
  imageDescription = await visionClient.DescribeImageInStreamAsync(fs);
}
```

## Get domain-specific analysis (celebrities)

### Option 1: Scoped analysis - Analyze only a specified model
```
POST https://westus.api.cognitive.microsoft.com/vision/v2.1/models/celebrities/analyze
var celebritiesResult = await visionClient.AnalyzeImageInDomainAsync(url, "celebrities");
```

For this option, all other query parameters {visualFeatures, details} are not valid. If you want to see all supported models, use:

```
GET https://westus.api.cognitive.microsoft.com/vision/v2.1/models 
var models = await visionClient.ListModelsAsync();
```

### Option 2: Enhanced analysis - Analyze to provide additional details by using 86-categories taxonomy

For applications where you want to get a generic image analysis in addition to details from one or more domain-specific models, extend the v1 API by using the models query parameter.

```
POST https://westus.api.cognitive.microsoft.com/vision/v2.1/analyze?details=celebrities
```

When you invoke this method, you first call the [86-category](../Category-Taxonomy.md) classifier. If any of the categories matches that of a known or matching model, a second pass of classifier invocations occurs. For example, if "details=all" or "details" includes "celebrities," you call the celebrities model after you call the 86-category classifier. The result includes the category person. In contrast with Option 1, this method increases latency for users who are interested in celebrities.

In this case, all v1 query parameters behave in the same way. If you don't specify visualFeatures=categories, it's implicitly enabled.

## Retrieve and understand the JSON output for analysis

Here's an example:

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

Field | Type | Content
------|------|------|
Tags  | `object` | The top-level object for an array of tags.
tags[].Name | `string`    | The keyword from the tags classifier.
tags[].Score    | `number`    | The confidence score, between 0 and 1.
description     | `object`    | The top-level object for a description.
description.tags[] |    `string`    | The list of tags.  If there is insufficient confidence in the ability to produce a caption, the tags might be the only information available to the caller.
description.captions[].text    | `string`    | A phrase describing the image.
description.captions[].confidence    | `number`    | The confidence score for the phrase.

## Retrieve and understand the JSON output of domain-specific models

### Option 1: Scoped analysis - Analyze only a specified model

The output is an array of tags, as shown in the following example:

```json
{  
  "result":[  
    {  
      "name":"golden retriever",
      "score":0.98
    },
    {  
      "name":"Labrador retriever",
      "score":0.78
    }
  ]
}
```

### Option 2: Enhanced analysis - Analyze to provide additional details by using the "86-categories" taxonomy

For domain-specific models using Option 2 (enhanced analysis), the categories return type is extended, as shown in the following example:

```json
{  
  "requestId":"87e44580-925a-49c8-b661-d1c54d1b83b5",
  "metadata":{  
    "width":640,
    "height":430,
    "format":"Jpeg"
  },
  "result":{  
    "celebrities":[  
      {  
        "name":"Richard Nixon",
        "faceRectangle":{  
          "left":107,
          "top":98,
          "width":165,
          "height":165
        },
        "confidence":0.9999827
      }
    ]
  }
}
```

The categories field is a list of one or more of the [86 categories](../Category-Taxonomy.md) in the original taxonomy. Categories that end in an underscore match that category and its children (for example, "people_" or "people_group," for the celebrities model).

Field    | Type    | Content
------|------|------|
categories | `object`    | The top-level object.
categories[].name     | `string`    | The name from the 86-category taxonomy list.
categories[].score    | `number`    | The confidence score, between 0 and 1.
categories[].detail     | `object?`      | (Optional) The detail object.

If multiple categories match (for example, the 86-category classifier returns a score for both "people_" and "people_young," when model=celebrities), the details are attached to the most general level match ("people_," in that example).

## Error responses

These errors are identical to those in vision.analyze, with the additional NotSupportedModel error (HTTP 400), which might be returned in both the Option 1 and Option 2 scenarios. For Option 2 (enhanced analysis), if any of the models that are specified in the details isn't recognized, the API returns a NotSupportedModel, even if one or more of them are valid. To find out what models are supported, you can call listModels.

## Next steps

To use the REST API, go to [Computer Vision API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2-preview-3/operations/56f91f2e778daf14a499f21b).
