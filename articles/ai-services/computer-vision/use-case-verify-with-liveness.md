---
title: "tbd"
titleSuffix: Azure AI services
description: tbd
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 07/22/2022
ms.author: pafarley
---

# Overview: Verify user with liveness detection

intro 


## Benefits for your business 

tbd

## Key features 


tbd
* Face Detection ("Detection" / "Detect") answers the question, "Are there one or more human faces in this image?" Detection finds human faces in an image and returns bounding boxes indicating their locations. Face detection models alone don't find individually identifying features, only a bounding box. All of the other operations are dependent on Detection: before Face can identify or verify a person (see below), it must know the locations of the faces to be recognized.
* Face Detection for attributes: The Detect API can optionally be used to analyze attributes about each face, such as head pose and facial landmarks, using other AI models. The attribute functionality is separate from the verification and identification functionality of Face. The full list of attributes is described in the [Face detection concept guide](concept-face-detection.md). The values returned by the API for each attribute are predictions of the perceived attributes and are best used to make aggregated approximations of attribute representation rather than individual assessments. 
* Face Verification ("Verification" / "Verify") builds on Detect and addresses the question, "Are these two images of the same person?" Verification is also called "one-to-one" matching because the probe image is compared to only one enrolled template. Verification can be used in access control scenarios to verify that a picture matches a previously captured image (such as from a photo from a government-issued ID card).
* Face Group ("Group") also builds on Detect and creates smaller groups of faces that look similar to each other from all enrollment templates.  

## Next steps

tbd
> [!div class="nextstepaction"]
> [tbd](tbd)
