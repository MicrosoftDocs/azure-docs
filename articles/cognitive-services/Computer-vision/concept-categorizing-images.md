---
title: Categorizing images - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to categorizing images using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: conceptual
ms.date: 08/29/2018
ms.author: pafarley
---

# Categorizing images

In addition to tagging and descriptions, Computer Vision returns the taxonomy-based categories defined in previous versions. These categories are organized as a taxonomy with parent/child hereditary hierarchies. All categories are in English. They can be used alone or with our new tagging models.

## The 86-category concept

Based on a list of 86 concepts seen in the following diagram, an image can be categorized ranging from broad to specific. For the full taxonomy in text format, see [Category Taxonomy](category-taxonomy.md).

![Analyze Categories](./Images/analyze_categories.png)

## Image categorization examples

The following JSON response illustrates what Computer Vision returns when categorizing the example image based on its visual features.

![Woman Roof](./Images/woman_roof.png)

```json
{
    "categories": [
        {
            "name": "people_",
            "score": 0.81640625
        }
    ],
    "requestId": "bae7f76a-1cc7-4479-8d29-48a694974705",
    "metadata": {
        "height": 200,
        "width": 300,
        "format": "Jpeg"
    }
}
```

The following table illustrates a typical image set and the category returned by Computer Vision for each image.

| Image | Category |
|-------|----------|
| ![Family Photo](./Images/family_photo.png) | people_group |
| ![Cute Dog](./Images/cute_dog.png) | animal_dog |
| ![Outdoor Mountain](./Images/mountain_vista.png) | outdoor_mountain |
| ![Vision Analyze Food Bread](./Images/bread.png) | food_bread |

## Next steps

Learn concepts about [tagging images](concept-tagging-images.md) and [describing images](concept-describing-images.md).