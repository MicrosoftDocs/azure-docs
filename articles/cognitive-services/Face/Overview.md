---
title: What is the Face API?
titleSuffix: Azure Cognitive Services
description: Learn how to use the Face service to detect and analyze faces in images.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: overview
ms.date: 07/03/2019
ms.author: pafarley
#Customer intent: As the developer of an app that deals with images of humans, I want to learn what the Face API does so I can determine if I should use its features.
---

# What is the Azure Face API?

The Azure Cognitive Services Face API provides algorithms that are used to detect, recognize, and analyze human faces in images. The ability to process human face information is important in many different software scenarios. Example scenarios are security, natural user interface, image content analysis and management, mobile apps, and robotics.

The Face API provides several different functions. Each function is outlined in the following sections. Read on to learn more about them.

## Face detection

The Face API detects human faces in an image and returns the rectangle coordinates of their locations. Optionally, face detection can extract a series of face-related attributes. Examples are head pose, gender, age, emotion, facial hair, and glasses.

> [!NOTE]
> The face detection feature is also available through the [Computer Vision API](https://docs.microsoft.com/azure/cognitive-services/computer-vision/home). If you want to do further operations with face data, use the Face API, which is the service discussed in this article.

![An image of a woman and a man, with rectangles drawn around their faces and age and gender displayed](./Images/Face.detection.jpg)

For more information on face detection, see the [Face detection](concepts/face-detection.md) concepts article. Also see the [Detect API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) reference documentation.

## Face verification

The Verify API performs an authentication against two detected faces or from one detected face to one person object. Practically, it evaluates whether two faces belong to the same person. This capability is potentially useful in security scenarios. For more information, see the [Face recognition](concepts/face-recognition.md) concepts guide or the [Verify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a) reference documentation.

## Find similar faces

The Find Similar API compares a target face with a set of candidate faces to find a smaller set of faces that look similar to the target face. Two working modes, matchPerson and matchFace, are supported. The matchPerson mode returns similar faces after it filters for the same person by using the [Verify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a). The matchFace mode ignores the same-person filter. It returns a list of similar candidate faces that might or might not belong to the same person.

The following example shows the target face:

![A woman smiling](./Images/FaceFindSimilar.QueryFace.jpg)

And these are the candidate faces:

![Five images of people smiling. Images a and b show the same person.](./Images/FaceFindSimilar.Candidates.jpg)

To find four similar faces, the matchPerson mode returns a and b, which show the same person as the target face. The matchFace mode returns a, b, c, and d, exactly four candidates, even if some aren't the same person as the target or have low similarity. For more information, see the [Face recognition](concepts/face-recognition.md) concepts guide or the [Find Similar API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237) reference documentation.

## Face grouping

The Group API divides a set of unknown faces into several groups based on similarity. Each group is a disjoint proper subset of the original set of faces. All of the faces in a group are likely to belong to the same person. There can be several different groups for a single person. The groups are differentiated by another factor, such as expression, for example. For more information, see the [Face recognition](concepts/face-recognition.md) concepts guide or the [Group API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238) reference documentation.

## Person identification

The Identify API is used to identify a detected face against a database of people. This feature might be useful for automatic image tagging in photo management software. You create the database in advance, and you can edit it over time.

The following image shows an example of a database named `"myfriends"`. Each group can contain up to 1 million different person objects. Each person object can have up to 248 faces registered.

![A grid with three columns for different people, each with three rows of face images](./Images/person.group.clare.jpg)

After you create and train a database, you can perform identification against the group with a new detected face. If the face is identified as a person in the group, the person object is returned.

For more information about person identification, see the [Face recognition](concepts/face-recognition.md) concepts guide or the [Identify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239) reference documentation.

## Use containers

[Use the Face container](face-how-to-install-containers.md) to detect, recognize, and identify faces by installing a standardized Docker container closer to your data.

## Sample apps

The following sample applications show a few ways to use the Face API:

- [Microsoft Face API: Windows Client Library and sample](https://github.com/Microsoft/Cognitive-Face-Windows) is a WPF app that demonstrates several scenarios of Face detection, analysis, and identification.
- [FamilyNotes UWP app](https://github.com/Microsoft/Windows-appsample-familynotes) is a Universal Windows Platform (UWP) app that uses face identification along with speech, Cortana, ink, and camera in a family note-sharing scenario.

## Data privacy and security

As with all of the Cognitive Services resources, developers who use the Face service must be aware of Microsoft's policies on customer data. For more information, see the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center.

## Next steps

Follow a quickstart to implement a face-detection scenario in code:

- [Quickstart: Detect faces in an image by using the .NET SDK with C#](quickstarts/csharp.md). Other languages are available.
