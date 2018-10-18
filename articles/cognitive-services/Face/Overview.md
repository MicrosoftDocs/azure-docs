---
title: What is the Face API service?
titleSuffix: Azure Cognitive Services
description: This topic explains the Face API service and related terms.
author: SteveMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: face-api
ms.topic: overview
ms.date: 10/11/2018
ms.author: sbowles
---

# What is the Face API service?

The Face API service is a cloud-based service that provides algorithms for analyzing human faces in images and video. The Face API has two main functions: face detection with attributes and face recognition.

## Face detection

The Face API can detect up to 64 human faces with high-precision face location in an image. The image can be specified by file (a byte stream) or with a valid URL.

![Overview - Face Detection](./Images/Face.detection.jpg)

The face rectangle (left, top, width, and height) indicating the face location in the image is returned along with each detected face. Optionally, face detection extracts a series of face-related attributes such as pose, gender, age, head pose, facial hair, and glasses. For more information, see [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

## Face recognition

The ability to identify human faces is important in many scenarios including security, natural user interface, image content analysis and management, mobile apps, and robotics. The Face API service provides four face recognition functions: face verification, finding similar faces, face grouping, and person identification.

### Face verification

Face verification performs an authentication against two detected faces or from one detected face to one person object. For more detailed information, see [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).

### Finding similar faces

Given a target detected face and a set of candidate faces to search with, the service finds a small set of faces that look most similar to the target face. Two working modes, **matchFace** and **matchPerson** are supported. **matchPerson** mode returns similar faces after applying a same-person threshold derived from [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a). **matchFace** mode ignores the same-person threshold and returns top similar candidate faces. In the following example, candidate faces are listed.
![Overview - Face Find Similar](./Images/FaceFindSimilar.Candidates.jpg)
The query face is this.
![Overview - Face Find Similar](./Images/FaceFindSimilar.QueryFace.jpg)

To find four similar faces, **matchPerson** mode would return (a) and (b), which depict the same person as the query face. **matchFace** mode returns (a), (b), (c) and (d), exactly four candidates even if some have low similarity. For more information, see [Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237).

### Face grouping

Given one set of unknown faces, the face grouping API automatically divides them into several groups based on similarity. Each group is a disjointed proper subset of the original unknown face set and contains similar faces. All the faces in the same group can be considered to belong to the same person. For more information, see [Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238).

### Person identification

The Face API can be used to identify people based on a detected face and a people database. You create this database in advance, and it can be edited over time.

The following figure is an example of a database named "myfriends." Each group may contain up to 1,000,000/10,000 different person objects. Each person object can have up to 248 faces registered.

![Overview - LargePersonGroup/PersonGroup](./Images/person.group.clare.jpg)

After a database has been created and trained, identification can be performed against the group with a new detected face. If the face is identified as a person in the group, the person object is returned.

For more information about person identification, see the following API guides:

[Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239)  
[PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244)  
[PersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c)  
[PersonGroup - Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249)  
[LargePersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d)  
[LargePersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adcba3a7b9412a4d53f40)  
[LargePersonGroup - Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599ae2d16ac60f11b48b5aa4)  

#### Face storage and pricing

Face Storage allows a Standard subscription to store additional persisted faces when using LargePersonGroup/PersonGroup Person objects ([PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b)/[LargePersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adf2a3a7b9412a4d53f42)) or LargeFaceLists/FaceLists ([FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250)/[LargeFaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a158c10d2de3616c086f2d3)) for identification or similarity matching with the Face API. The stored images are charged at $0.50 per 1000 faces and this rate is prorated on a daily basis. Free tier subscriptions are limited to 1,000 total persons.

For example, if your account used 10,000 persisted faces each day for the first half of the month and none the second half, you would be billed only for the 10,000 faces for the days stored. Alternatively, if each day during the month you persist 1,000 faces for a few hours and then delete them each night, you would still be billed for 1,000 persisted faces each day.

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
