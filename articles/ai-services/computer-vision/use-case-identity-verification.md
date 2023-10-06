---
title: "Overview: Identity verification with Face"
titleSuffix: Azure AI services
description: Provide the best-in-class face verification experience in your business solution using Azure AI Face service. You can verify someone's identity against a government-issued ID card like a passport or driver's license.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 07/22/2022
ms.author: pafarley
---

# Overview: Identity verification with Face 

Provide the best-in-class face verification experience in your business solution using Azure AI Face service. You can verify someone's identity against a government-issued ID card like a passport or driver's license. Use this verification to grant access to digital or physical services or recover an account. Specific access scenarios include opening a new account, verifying a user, or proctoring an online assessment. Identity verification can be done when a person is onboarded to your service, and repeated when they access a digital or physical service.

:::image type="content" source="media/use-cases/face-recognition.png" alt-text="Photo of a person holding a phone up to his face to take a picture":::

## Benefits for your business 

Identity verification verifies that the user is who they claim to be. Most organizations require some type of identity verification. Biometric identity verification with Face service provides the following benefits to your business:

* Seamless end user experience: instead of entering a passcode manually, users can look at a camera to get access. 
* Improved security: biometric verification is more secure than alternative verification methods that request knowledge from users, since that can be more easily obtained by bad actors.  

## Key features 

Face service can power an end-to-end, low-friction, high-accuracy identity verification solution.

* Face Detection ("Detection" / "Detect") answers the question, "Are there one or more human faces in this image?" Detection finds human faces in an image and returns bounding boxes indicating their locations. Face detection models alone don't find individually identifying features, only a bounding box. All of the other operations are dependent on Detection: before Face can identify or verify a person (see below), it must know the locations of the faces to be recognized.
* Face Detection for attributes: The Detect API can optionally be used to analyze attributes about each face, such as head pose and facial landmarks, using other AI models. The attribute functionality is separate from the verification and identification functionality of Face. The full list of attributes is described in the [Face detection concept guide](concept-face-detection.md). The values returned by the API for each attribute are predictions of the perceived attributes and are best used to make aggregated approximations of attribute representation rather than individual assessments. 
* Face Verification ("Verification" / "Verify") builds on Detect and addresses the question, "Are these two images of the same person?" Verification is also called "one-to-one" matching because the probe image is compared to only one enrolled template. Verification can be used in identity verification or access control scenarios to verify that a picture matches a previously captured image (such as from a photo from a government-issued ID card).  
* Face Group ("Group") also builds on Detect and creates smaller groups of faces that look similar to each other from all enrollment templates.  

## Next steps

Follow a quickstart to do identity verification with Face. 

> [!div class="nextstepaction"]
> [Identity verification quickstart](./quickstarts-sdk/identity-client-library.md)
