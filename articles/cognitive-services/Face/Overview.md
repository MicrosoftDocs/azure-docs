---
title: What is the Face API?
titleSuffix: Azure Cognitive Services
description: Learn how to use the Face service to detect and analyze faces in images.
author: SteveMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: face-api
ms.topic: overview
ms.date: 10/29/2018
ms.author: sbowles
#Customer intent: As the developer of an app that deals with images of humans, I want to learn what the Face API does so I can determine if I should use its features.
---

# What is the Azure Face API?

The Azure Face API is a cognitive service that provides algorithms for detecting, recognizing, and analyzing human faces in images. The ability to process human face information is important in many different software scenarios, such as security, natural user interface, image content analysis and management, mobile apps, and robotics.

The Face API provides several different functions, each outlined in the following sections. Read on to learn more about each one and determine if it suits your needs.

## Face detection

The Face API can detect human faces in an image and return the rectangle coordinates of their locations. Optionally, face detection can extract a series of face-related attributes such as pose, gender, age, head pose, facial hair, and glasses.

![An image of a woman and a man, with rectangles drawn around their faces and age and sex displayed](./Images/Face.detection.jpg)

The face detection feature is also available through the [Computer Vision API](https://docs.microsoft.com/azure/cognitive-services/computer-vision/home), but if you wish to do further operations with face data, you should use the Face API (this service). For more information on face detection, see the [Detect API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

## Face verification

The Verify API performs an authentication against two detected faces or from one detected face to one person object. Practically, it evaluates whether two faces belong to the same person. This is potentially useful in security scenarios. For more information, see the [Verify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).

## Find similar faces

The Find Similar API takes a target face and a set of candidate faces and finds a smaller set of faces that look most similar to the target face. Two working modes, **matchPerson** and **matchFace** are supported. **matchPerson** mode returns similar faces after filtering for the same person (using the [Verify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a)). **matchFace** mode ignores the same-person filter and returns a list of similar candidate faces that may or may not belong to the same person.

In the following example, this is the target face:

![A woman smiling](./Images/FaceFindSimilar.QueryFace.jpg)

And these are the candidate faces:

![Five images of people smiling. Images a) and b) are of the same person](./Images/FaceFindSimilar.Candidates.jpg)

To find four similar faces, **matchPerson** mode would return (a) and (b), which depict the same person as the target face. **matchFace** mode returns (a), (b), (c) and (d)&mdash;exactly four candidates, even if some are not the same person as the target or have low similarity. For more information, see the [Find Similar API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237).

## Face grouping

The Group API divides a set of unknown faces into several groups based on similarity. Each group is a disjoint proper subset of the original set of faces. All of the faces in a group are likely to belong to the same person, but there can be several different groups for a single person (differentiated by another factor, such as expression for example). For more information, see the [Group API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238).

## Person identification

The Identify API can be used to identify a detected face against a database of people. This may be useful for automatic image tagging in photo management software. You create the database in advance, and it can be edited over time.

The following image depicts an example of a database named "myfriends." Each group may contain up to 1,000,000 different person objects, and each person object can have up to 248 faces registered.

![A grid with 3 columns for different people, each with 3 rows of face images](./Images/person.group.clare.jpg)

After a database has been created and trained, you can perform identification against the group with a new detected face. If the face is identified as a person in the group, the person object is returned.

For more information about person identification, see the [Identify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239).

## Use containers

[Use the Face container](face-how-to-install-containers.md) to detect, recognize, and identify faces, by installing a standardized Docker container closer to your data.

## Sample apps

The following sample applications showcase a few of the ways the Face API can be used.

- [Microsoft Face API: Windows Client Library & Sample](https://github.com/Microsoft/Cognitive-Face-Windows) - a WPF app that demonstrates several scenarios of Face detection, analysis and identification.
- [FamilyNotes UWP app](https://github.com/Microsoft/Windows-appsample-familynotes) - a Universal Windows Platform (UWP) app that uses face identification along with speech, Cortana, ink, and camera in a family note-sharing scenario.

## Next steps

Follow a quickstart to implement a simple face detection scenario in code.
- [Quickstart: Detect faces in an image using the .NET SDK with C#](quickstarts/csharp.md) (other languages available)
