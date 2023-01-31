---
title: "Image Analysis versions"
titleSuffix: "Azure Cognitive Services"
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 01/20/2023
ms.author: pafarley
---

## Image Analysis versions

> [!IMPORTANT]
> Select the Image Analysis API version that best fits your requirements.
>
> | Version | Features available | Recommendation |
> |----------|--------------|-------------------------|
> | v4.0 | Tags, Objects, Descriptions, People, Read, Crop suggestions | Better models; use version 4.0 if it supports your use case. |
> | v3.2 | Tags, Objects, Descriptions, Brands, Faces, Image type, Color scheme, Landmarks, Celebrities, Adult content, Crop suggestions,  | Wider range of features; use version 3.2 if your use case is not yet supported in version 4.0 |
> 
> We recommend you use the Image Analysis 4.0 API, except in the following cases:
> * You want to use any of the Image Analysis features that are only available in Image Analysis 3.2:
>    * Brand detection
>    * Image categorization
>    * Face detection
>    * Get thumbnail
>    * Landmark detection
>    * Celebrity recognition
>    * Image type analysis
>    * Color scheme analysis
>    * Adult content detection
> * You want to do image captioning and your Azure Computer Vision resource is outside the 4.0-supported regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, and West US. The image captioning feature in Image Analysis 4.0 is only supported in these Azure regions. Image captioning in version 3.2 is available in all Computer Vision regions.
