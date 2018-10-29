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

The Azure Face API is a cognitive service that provides algorithms for detecting, recognizing, and analyzing human faces in images and video. 

## What it does
The Face API has two main functions: face detection with attributes and face recognition.

### Face detection

The Face API can detect up to 64 human faces and return the locations of faces in an image with high precision. 

![An image of a woman and a man, with rectangles drawn around their faces and age and sex displayed](./Images/Face.detection.jpg)

Optionally, face detection can extract a series of face-related attributes such as pose, gender, age, head pose, facial hair, and glasses. For more information, see the [Detect API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

### Face recognition

The ability to identify human faces is important in many scenarios including security, natural user interface, image content analysis and management, mobile apps, and robotics. The Face API service provides four face recognition functions: face verification, finding similar faces, face grouping, and person identification.

#### Face verification

The Verify API performs an authentication against two detected faces or from one detected face to one person object. Practically, it evaluates whether two faces belong to the same person. For more information, see the [Verify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).

#### Finding similar faces

The Find Similar API takes a target face and a set of candidate faces and finds a smaller set of faces that look most similar to the target face. Two working modes, **matchPerson** and **matchFace** are supported. **matchPerson** mode returns similar faces after filtering for the same person (using the [Verify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a)). **matchFace** mode ignores the same-person filter and returns a list of similar candidate faces that may or may not belong to the same person. In the following example, this is the target face.

![A woman smiling](./Images/FaceFindSimilar.QueryFace.jpg)

And these are the candidate faces.

![Five images of people smiling. Images a) and b) are of the same person](./Images/FaceFindSimilar.Candidates.jpg)

To find four similar faces, **matchPerson** mode would return (a) and (b), which depict the same person as the target face. **matchFace** mode returns (a), (b), (c) and (d)&mdash;exactly four candidates, even if some are not the same person as the target or have low similarity. For more information, see the [Find Similar API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237).

#### Face grouping

The Group API divides a set of unknown faces into several groups based on similarity. Each group is a disjoint proper subset of the original set of faces. All of the faces in a group are likely to belong to the same person, but there can be several different groups for a single person (differentiated by another factor, such as expression for example). For more information, see the [Group API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238).

#### Person identification

The Identify API can be used to identify a detected face against a database of people. You create this database in advance, and it can be edited over time.

The following image depicts an example of a database named "myfriends." Each group may contain up to 1,000,000/10,000 different person objects. Each person object can have up to 248 faces registered.

![Overview - LargePersonGroup/PersonGroup](./Images/person.group.clare.jpg)

After a database has been created and trained, identification can be performed against the group with a new detected face. If the face is identified as a person in the group, the person object is returned.

For more information about person identification, see the [Identify API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239).


## Sample apps

Take a look at these sample applications that make use of Face API.

- [Microsoft Face API: Windows Client Library & Sample](https://github.com/Microsoft/Cognitive-Face-Windows)
  - WPF sample app that demonstrates several scenarios of Face detection, analysis and identification.
- [FamilyNotes UWP app](https://github.com/Microsoft/Windows-appsample-familynotes)
  - Universal Windows Platform (UWP) sample app that shows usage of speech, Cortana, ink, and camera through a family note sharing scenario.
- [Video Frame Analysis Sample](https://github.com/microsoft/cognitive-samples-videoframeanalysis)
  - Win32 sample app that shows analyzing live video streams in near real time using the Face, Computer Vision, and Emotion APIs.

## Tutorials
The following tutorials demonstrate the Face API's basic functionalities and subscriptions processes:
- [Getting Started with Face API in CSharp Tutorial](Tutorials/FaceAPIinCSharpTutorial.md)
- [Getting Started with Face API in Java for Android Tutorial](Tutorials/FaceAPIinJavaForAndroidTutorial.md)
- [Getting Started with Face API in Python Tutorial](Tutorials/FaceAPIinPythonTutorial.md)

## Next steps

Try a quickstart to implement a simple Face API scenario.
- [Quickstart: Detect faces in an image using C#](quickstarts/csharp.md) (other languages available)
