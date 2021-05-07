---
title: What is the Azure Face service?
titleSuffix: Azure Cognitive Services
description: The Azure Face service provides AI algorithms that you use to detect, recognize, and analyze human faces in images.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: overview
ms.date: 04/19/2021
ms.author: pafarley
ms.custom: cog-serv-seo-aug-2020
keywords: facial recognition, facial recognition software, facial analysis, face matching, face recognition app, face search by image, facial recognition search
#Customer intent: As the developer of an app that deals with images of humans, I want to learn what the Face service does so I can determine if I should use its features.
---

# What is the Azure Face service?

> [!WARNING]
> On June 11, 2020, Microsoft announced that it will not sell facial recognition technology to police departments in the United States until strong regulation, grounded in human rights, has been enacted. As such, customers may not use facial recognition features or functionality included in Azure Services, such as Face or Video Indexer, if a customer is, or is allowing use of such services by or for, a police department in the United States.

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

The Azure Face service provides AI algorithms that detect, recognize, and analyze human faces in images. Facial recognition software is important in many different scenarios, such as  security, natural user interface, image content analysis and management, mobile apps, and robotics.

The Face service provides several different facial analysis functions which are each outlined in the following sections.

This documentation contains the following types of articles:
* The [quickstarts](./Quickstarts/client-libraries.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time. 
* The [how-to guides](./Face-API-How-to-Topics/HowtoDetectFacesinImage.md) contain instructions for using the service in more specific or customized ways.
* The [conceptual articles](./concepts/face-detection.md) provide in-depth explanations of the service's functionality and features.
* The [tutorials](./enrollment-overview.md) are longer guides that show you how to use this service as a component in broader business solutions.

## Face detection

The Detect API detects human faces in an image and returns the rectangle coordinates of their locations. Optionally, face detection can extract a series of face-related attributes, such as head pose, gender, age, emotion, facial hair, and glasses. These attributes are general predictions, not actual classifications. 

> [!NOTE]
> The face detection feature is also available through the [Computer Vision service](../computer-vision/overview.md). However, if you want to do further Face operations like Identify, Verify, Find Similar, or Group, you should use this Face service instead.

![An image of a woman and a man, with rectangles drawn around their faces and age and gender displayed](./Images/Face.detection.jpg)

For more information on face detection, see the [Face detection](concepts/face-detection.md) concepts article. Also see the [Detect API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) reference documentation.

## Face verification

The Verify API builds on Detection and addresses the question, "Are these two images the same person?". Verification is also called "one-to-one" matching because the probe image is compared to only one enrolled template. Verification can be used in identity verification or access control scenarios to verify a picture matches a previously captured image (such as from a photo from a government issued ID card). For more information, see the [Facial recognition](concepts/face-recognition.md) concepts guide or the [Verify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a) reference documentation.

## Face identification

The Identify API also starts with Detection and answers the question, "Can this detected face be matched to any enrolled face in a database?" Because it's like face recognition search, is also called "one-to-many" matching. Candidate matches are returned based on how closely the probe template with the detected face matches each of the enrolled templates.

The following image shows an example of a database named `"myfriends"`. Each group can contain up to 1 million different person objects. Each person object can have up to 248 faces registered.

![A grid with three columns for different people, each with three rows of face images](./Images/person.group.clare.jpg)

After you create and train a database, you can do identification against the group with a new detected face. If the face is identified as a person in the group, the person object is returned.

For more information about person identification, see the [Facial recognition](concepts/face-recognition.md) concepts guide or the [Identify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239) reference documentation.

## Find similar faces

The Find Similar API does face matching between target face and a set of candidate faces, finding a smaller set of faces that look similar to the target face. This operation is useful for doing a face search by image. 

Two working modes, **matchPerson** and **matchFace**, are supported. The **matchPerson** mode returns similar faces after filtering for the same person by using the [Verify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a). The **matchFace** mode ignores the same-person filter. It returns a list of similar candidate faces that may or may not belong to the same person.

The following example shows the target face:

![A woman smiling](./Images/FaceFindSimilar.QueryFace.jpg)

And these images are the candidate faces:

![Five images of people smiling. Images a and b show the same person.](./Images/FaceFindSimilar.Candidates.jpg)

To find four similar faces, the **matchPerson** mode returns a and b, which show the same person as the target face. The **matchFace** mode returns a, b, c, and d&mdash;exactly four candidates, even if some aren't the same person as the target or have low similarity. For more information, see the [Facial recognition](concepts/face-recognition.md) concepts guide or the [Find Similar API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237) reference documentation.

## Face grouping

The Group API divides a set of unknown faces into several groups based on similarity. Each group is a disjoint proper subset of the original set of faces. All of the faces in a group are likely to belong to the same person. There can be several different groups for a single person. The groups are differentiated by another factor, such as expression, for example. For more information, see the [Facial recognition](concepts/face-recognition.md) concepts guide or the [Group API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238) reference documentation.


## Sample apps

The following sample applications show a few ways to use the Face service:

- [Face API: Windows Client Library and sample](https://github.com/Microsoft/Cognitive-Face-Windows) is a WPF app that demonstrates several scenarios of Face detection, analysis, and identification.
- [FamilyNotes UWP app](https://github.com/Microsoft/Windows-appsample-familynotes) is a Universal Windows Platform (UWP) app that uses face identification along with speech, Cortana, ink, and camera in a family note-sharing scenario.

## Data privacy and security

As with all of the Cognitive Services resources, developers who use the Face service must be aware of Microsoft's policies on customer data. For more information, see the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center.

## Next steps

Follow a quickstart to code the basic components of a face recognition app in the language of your choice.

- [Client library quickstart](quickstarts/client-libraries.md).
