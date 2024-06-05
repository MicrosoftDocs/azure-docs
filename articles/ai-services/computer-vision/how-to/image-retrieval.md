---
title: Do image retrieval using multimodal embeddings - Image Analysis 4.0
titleSuffix: Azure AI services
description: Learn how to call the image retrieval API to vectorize image and search terms.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 02/20/2024
ms.author: pafarley
ms.custom: references_regions
---

# Do image retrieval using multimodal embeddings (version 4.0)

The Multimodal embeddings APIs enable the _vectorization_ of images and text queries. They convert images to coordinates in a multi-dimensional vector space. Then, incoming text queries can also be converted to vectors, and images can be matched to the text based on semantic closeness. This allows the user to search a set of images using text, without the need to use image tags or other metadata. Semantic closeness often produces better results in search.

The `2024-02-01` API includes a multi-lingual model that supports text search in 102 languages. The original English-only model is still available, but it cannot be combined with the new model in the same search index. If you vectorized text and images using the English-only model, these vectors won’t be compatible with multi-lingual text and image vectors.

> [!IMPORTANT]
> These APIs are only available in the following geographic regions: SwedenCentral, EastUS, NorthEurope, WestEurope,WestUS, SoutheastAsia, KoreaCentral, FranceCentral, AustraliaEast, WestUS2, SwitzerlandNorth, JapanEast.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. Be sure to create it in one of the permitted geographic regions: SwedenCentral, EastUS, NorthEurope, WestEurope,WestUS, SoutheastAsia, KoreaCentral, FranceCentral, AustraliaEast, WestUS2, SwitzerlandNorth, JapanEast.
   * After it deploys, select **Go to resource**. Copy the key and endpoint to a temporary location to use later on.

## Try out Multimodal embeddings

You can try out the Multimodal embeddings feature quickly and easily in your browser using Vision Studio.

> [!IMPORTANT]
> The Vision Studio experience is limited to 500 images. To use a larger image set, create your own search application using the APIs in this guide.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

## Call the Vectorize Image API

The `retrieval:vectorizeImage` API lets you convert an image's data to a vector. To call it, make the following changes to the cURL command below:

1. Replace `<endpoint>` with your Azure AI Vision endpoint.
1. Replace `<subscription-key>` with your Azure AI Vision key.
1. In the request body, set `"url"` to the URL of a remote image you want to use.
1. Optionally, change the `model-version` parameter to an older version. `2022-04-11` is the legacy model that supports only English text. Images and text that are vectorized with a certain model aren't compatible with other models, so be sure to use the same model for both. 

```bash
curl.exe -v -X POST "<endpoint>/computervision/retrieval:vectorizeImage?api-version=2024-02-01&model-version=2023-04-15" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: <subscription-key>" --data-ascii "
{
'url':'https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png'
}"
```

To vectorize a local image, you'd put the binary data in the HTTP request body.

The API call returns a **vector** JSON object, which defines the image's coordinates in the high-dimensional vector space.

```json
{ 
  "modelVersion": "2022-04-11", 
  "vector": [ -0.09442752, -0.00067171326, -0.010985051, ... ] 
}
``` 

## Call the Vectorize Text API

The `retrieval:vectorizeText` API lets you convert a text string to a vector. To call it, make the following changes to the cURL command below:

1. Replace `<endpoint>` with your Azure AI Vision endpoint.
1. Replace `<subscription-key>` with your Azure AI Vision key.
1. In the request body, set `"text"` to the example search term you want to use.
1. Optionally, change the `model-version` parameter to an older version. `2022-04-11` is the legacy model that supports only English text. Images and text that are vectorized with a certain model aren't compatible with other models, so be sure to use the same model for both. 

```bash
curl.exe -v -X POST "<endpoint>/computervision/retrieval:vectorizeText?api-version=2024-02-01&model-version=2023-04-15" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: <subscription-key>" --data-ascii "
{
'text':'cat jumping'
}"
```

The API call returns a **vector** JSON object, which defines the text string's coordinates in the high-dimensional vector space.

```json
{ 
  "modelVersion": "2022-04-11", 
  "vector": [ -0.09442752, -0.00067171326, -0.010985051, ... ] 
}
```

## Calculate vector similarity

Cosine similarity is a method for measuring the similarity of two vectors. In an image retrieval scenario, you'll compare the search query vector with each image's vector. Images that are above a certain threshold of similarity can then be returned as search results.

The following example code calculates the cosine similarity between two vectors. It's up to you to decide what similarity threshold to use for returning images as search results.

#### [C#](#tab/csharp)

```csharp
public static float GetCosineSimilarity(float[] vector1, float[] vector2)
{ 
    float dotProduct = 0; 
    int length = Math.Min(vector1.Length, vector2.Length); 
    for (int i = 0; i < length; i++) 
    { 
        dotProduct += vector1[i] * vector2[i]; 
    } 
    float magnitude1 = Math.Sqrt(vector1.Select(x => x * x).Sum());
    float magnitude2 = Math.Sqrt(vector2.Select(x => x * x).Sum());
    
    return dotProduct / (magnitude1 * magnitude2);
}
```

#### [Python](#tab/python)

```python
import numpy as np

def cosine_similarity(vector1, vector2):
    return np.dot(vector1, vector2) / (np.linalg.norm(vector1) * np.linalg.norm(vector2))
```

---

## Next steps

[Image retrieval concepts](../concept-image-retrieval.md)
