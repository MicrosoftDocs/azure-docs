---
title: "Example: Call the Analyze image API - Computer Vision"
titlesuffix: Azure Cognitive Services
description: Learn how to call the Computer Vision API by using REST in Azure Cognitive Services.
services: cognitive-services
author: KellyDF
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: sample
ms.date: 03/21/2019
ms.author: kefre
ms.custom: seodec18
---

# Example: How to call the Computer Vision API

This guide demonstrates how to call Computer Vision API using REST. The samples are written both in C# using the Computer Vision API client library, and as HTTP POST/GET calls. We will focus on:

- How to get "Tags", "Description" and "Categories".
- How to get "Domain-specific" information (celebrities).

## Prerequisites

- Image URL or path to locally stored image.
- Supported input methods: Raw image binary in the form of an application/octet stream or image URL
- Supported image formats: JPEG, PNG, GIF, BMP
- Image file size: Less than 4MB
- Image dimension: Greater than 50 x 50 pixels
  
In the examples below, the following features are demonstrated:

1. Analyzing an image and getting an array of tags and a description returned.
2. Analyzing an image with a domain-specific model (specifically, "celebrities"  model) and getting the corresponding result in JSON retune.

Features are broken down on:

- **Option One:** Scoped Analysis - Analyze only a given model
- **Option Two:** Enhanced Analysis - Analyze to provide additional details with [86-categories taxonomy](../Category-Taxonomy.md)
  
## Authorize the API call

Every call to the Computer Vision API requires a subscription key. This key needs to be either passed through a query string parameter or specified in the request header.

To obtain a free trial key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=computer-vision). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Computer Vision and get your key.

1. Passing the subscription key through a query string, see below as a Computer Vision API example:

```https://westus.api.cognitive.microsoft.com/vision/v2.0/analyze?visualFeatures=Description,Tags&subscription-key=<Your subscription key>```

1. Passing the subscription key can also be specified in the HTTP request header:

```ocp-apim-subscription-key: <Your subscription key>```

1. When using the client library, the subscription key is passed in through the constructor of VisionServiceClient:

```var visionClient = new VisionServiceClient("Your subscriptionKey");```

## Upload an image to the Computer Vision API service and get back tags, descriptions and celebrities

The basic way to perform the Computer Vision API call is by uploading an image directly. This is done by sending a "POST" request with application/octet-stream content type together with the data read from the image. For "Tags" and "Description", this upload method will be the same for all the Computer Vision API calls. The only difference will be the query parameters the user specifies. 

Here’s how to get "Tags" and "Description" for a given image:

**Option One:** Get list of "Tags" and one "Description"

```
POST https://westus.api.cognitive.microsoft.com/vision/v2.0/analyze?visualFeatures=Description,Tags&subscription-key=<Your subscription key>
```

```csharp
using Microsoft.ProjectOxford.Vision;
using Microsoft.ProjectOxford.Vision.Contract;
using System.IO;

AnalysisResult analysisResult;
var features = new VisualFeature[] { VisualFeature.Tags, VisualFeature.Description };

using (var fs = new FileStream(@"C:\Vision\Sample.jpg", FileMode.Open))
{
  analysisResult = await visionClient.AnalyzeImageAsync(fs, features);
}
```

**Option Two** Get list of "Tags" only, or list of "Description" only:

###### Tags only:

```
POST https://westus.api.cognitive.microsoft.com/vision/v2.0/tag&subscription-key=<Your subscription key>
var analysisResult = await visionClient.GetTagsAsync("http://contoso.com/example.jpg");
```

###### Description only:

```
POST https://westus.api.cognitive.microsoft.com/vision/v2.0/describe&subscription-key=<Your subscription key>
using (var fs = new FileStream(@"C:\Vision\Sample.jpg", FileMode.Open))
{
  analysisResult = await visionClient.DescribeAsync(fs);
}
```

### Get domain-specific analysis (celebrities)

**Option One:** Scoped Analysis - Analyze only a given model
```
POST https://westus.api.cognitive.microsoft.com/vision/v2.0/models/celebrities/analyze
var celebritiesResult = await visionClient.AnalyzeImageInDomainAsync(url, "celebrities");
```

For this option, all other query parameters {visualFeatures, details} are not valid. If you want to see all supported models, use:

```
GET https://westus.api.cognitive.microsoft.com/vision/v2.0/models 
var models = await visionClient.ListModelsAsync();
```

**Option Two:** Enhanced Analysis - Analyze to provide additional details with [86-categories taxonomy](../Category-Taxonomy.md)

For applications where you want to get generic image analysis in addition to details from one or more domain-specific models, we extend the v1 API with the models query parameter.

```
POST https://westus.api.cognitive.microsoft.com/vision/v2.0/analyze?details=celebrities
```

When this method is invoked, we will call the 86-category classifier first. If any of the categories match that of a known/matching model, a second pass of classifier invocations will occur. For example, if "details=all", or "details" include ‘celebrities’, we will call the celebrities model after the 86-category classifier is called and the result includes the category person. This will increase latency for users interested in celebrities, compared to Option One.

All v1 query parameters will behave the same in this case.  If visualFeatures=categories is not specified, it will be implicitly enabled.

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
Tags  | `object` | Top-level object for array of tags
tags[].Name | `string`	| Keyword from tags classifier
tags[].Score	| `number`	| Confidence score, between 0 and 1.
description	 | `object`	| Top-level object for a description.
description.tags[] |	`string`	| List of tags.  If there insufficient confidence in the ability to produce a caption, the tags maybe the only information available to the caller.
description.captions[].text	| `string`	| A phrase describing the image.
description.captions[].confidence	| `number`	| Confidence for the phrase.

## Retrieve and understand the JSON output of domain-specific models

**Option One:** Scoped Analysis - Analyze only a given model

The output will be an array of tags, an example will be like this example:

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

**Option Two:** Enhanced Analysis - Analyze to provide additional details with 86-categories taxonomy

For domain-specific models using Option Two (Enhanced Analysis), the categories return type is extended. An example follows:

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

The categories field is a list of one or more of the [86-categories](../Category-Taxonomy.md) in the original taxonomy. Note also that categories ending in an underscore will match that category and its children (for example, people_ as well as people_group, for celebrities model).

Field	| Type	| Content
------|------|------|
categories | `object`	| Top-level object
categories[].name	 | `string`	| Name from 86-category taxonomy
categories[].score	| `number`	| Confidence score, between 0 and 1
categories[].detail	 | `object?`      | Optional detail object

Note that if multiple categories match (for example, 86-category classifier returns a score for both people_ and people_young when model=celebrities), the details are attached to the most general level match (people_ in that example.)

## Errors Responses

These are identical to vision.analyze, with the additional error of NotSupportedModel error (HTTP 400), which may be returned in both Option One and Option Two scenarios. For Option Two (Enhanced Analysis), if any of the models specified in details are not recognized, the API will return a NotSupportedModel, even if one or more of them are valid.  Users can call listModels to find out what models are supported.

## Next steps

To use the REST API, go to [Computer Vision API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44).
