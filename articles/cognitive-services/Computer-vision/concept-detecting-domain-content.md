---
title: Detecting domain-specific content - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to describing images using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: conceptual
ms.date: 08/29/2018
ms.author: pafarley
---

# Detecting domain-specific content

In addition to tagging and top-level categorization, Computer Vision also supports specialized (or domain-specific) information. Specialized information can be implemented as a standalone method or with the high-level categorization. It functions as a means to further refine the 86-category taxonomy through the addition of domain-specific models.

There are two options for using the domain-specific models:

* Scoped analysis  
  Analyze only a chosen model by invoking an HTTP POST call. If you know which model you want to use, specify the model's name. You only get information relevant to that model. For example, you can use this option to only look for celebrity-recognition. The response contains a list of potential matching celebrities, accompanied by their confidence scores.
* Enhanced analysis  
  Analyze to provide additional details related to categories from the 86-category taxonomy. This option is available for use in applications where users want to get generic image analysis in addition to details from one or more domain-specific models. When this method is invoked, the 86-category taxonomy classifier is called first. If any of the categories match that of known or matching models, a second pass of classifier invocations follows. For example, if the `details` parameter of the HTTP POST call is either set to "all" or includes "celebrities", the method calls the celebrity classifier after the 86-category classifier is called. If the image is classified as `people_` or a subcategory of that category, then the celebrity classifier is called.

## Listing domain-specific models

You can list the domain-specific models supported by Computer Vision. Currently, Computer Vision supports the following domain-specific models for detecting domain-specific content:

| Name | Description |
|------|-------------|
| celebrities | Celebrity recognition, supported for images classified in the `people_` category |
| landmarks | Landmark recognition, supported for images classified in the `outdoor_` or `building_` categories |

### Domain model list example

The following JSON response lists the domain-specific models supported by Computer Vision.

```json
{
    "models": [
        {
            "name": "celebrities",
            "categories": ["people_", "人_", "pessoas_", "gente_"]
        },
        {
            "name": "landmarks",
            "categories": ["outdoor_", "户外_", "屋外_", "aoarlivre_", "alairelibre_",
                "building_", "建筑_", "建物_", "edifício_"]
        }
    ]
}
```

## Next steps

Learn concepts about [categorizing images](concept-categorizing-images.md).