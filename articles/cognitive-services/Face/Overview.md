---
title: Face API Service overview | Microsoft Docs
description: The glossary explains terms that you might encounter as you work with the Face API Service.
author: v-royhar
manager: yutkuo

ms.service: cognitive-services
ms.technology: face
ms.topic: article
ms.date: 03/17/2017
ms.author: anroth
---

# Face API

Welcome to the Microsoft Face API, a cloud-based service that provides the most advanced face algorithms. Face API has two main functions: face detection with attributes and face recognition.

## Face Detection

Face API detects up to 64 human faces with high precision face location in an image. And the image can be specified by file in bytes or valid URL.

![Overview - Face Detection](./Images/Face.detection.jpg)

Face rectangle (left, top, width and height) indicating the face location in the image is returned along with each detected face. Optionally, face detection extracts a series of face related attributes such as pose, gender, age, head pose, facial hair and glasses. Refer to [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) for more details.

## Face Recognition

Face recognition is widely used in many scenarios including security, natural user interface, image content analysis and management, mobile apps, and robotics. Four face recognition functions are provided: face verification, finding similar faces, face grouping, and person identification.


### Face Verification

Face API verification performs an authentication against two detected faces or authentication from one detected face to one person object. Refer to [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a) for more details.

### Finding Similar Face

Given target detected face and a set of candidate faces to search with, our service finds a small set of faces that look most similar to the target face. Two working modes, `matchFace` and `matchPerson` are supported. `matchPerson` mode returns similar faces after applying a same-person threshold derived from [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a). `matchFace` mode ignores the same-person threshold and returns top similar candidate faces. Take the following example, candidate faces are listed.      
![Overview - Face Find Similar](./Images/FaceFindSimilar.Candidates.jpg)
And query face is

![Overview - Face Find Similar](./Images/FaceFindSimilar.QueryFace.jpg)

To find 4 similar faces, `matchPerson` mode returns (a) and (b), which belong to the same person with query face. `matchFace` mode returns (a), (b), (c) and (d), exactly 4 candidates even if low similarity. Refer to [Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237) for more details.

### Face Grouping

Given one set of unknown faces, face grouping API automatically divides them into several groups based on similarity. Each group is a disjointed proper subset of the original unknown face set, and contains similar faces. And all the faces in the same group can be considered to belong to the same person object. Refer to [Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238) for more details.

### Face Identification

Face API can be used to identify people based on a detected face and people database (defined as a person group) which needs to be created in advance and can be edited over time.

The following figure is an example of a person group named "myfriends". Each group may contain up to 1,000 person objects. Meanwhile, each person object can have one or more faces registered.

![Overview - Person Group](./Images/person.group.clare.jpg)

After a person group has been created and trained, identification can be performed against the group and a new detected face. If the face is identified as a person object in the group, the person object will be returned.

For more details about person identification, please refer to the API guides listed below:

[Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239)  
[Person Group - Create a Person Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244)  
[Person - Create a Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c)  
[Person Group - Train Person Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249)

### Face Storage
Face Storage allows a Standard subscription to store additional persisted faces when using Person objects ([Person - Add A Person Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b)) or Face Lists ([Face List - Add a Face to a Face List](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250)) for identification or similarity matching with the Face API. The stored images are charged at $0.5 per 1000 faces and this rate is prorated on a daily basis. Free tier subscriptions are free, but limited to 1,000 total persons.

Pricing for Face Storage is prorated daily. For example, if your account used 10,000 persisted faces each day for the first half of the month and none the second half, you would be billed only for the 10,000 faces for the days stored. Alternatively, if each day during the month you persist 1,000 faces for a few hours and then delete them each night, you would still be billed for 1,000 persisted faces each day.

## Getting Started Tutorials
The following tutorials demonstrate the Face API basic functionalities and subscriptions processes:
- [Getting Started with Face API in CSharp Tutorial](Tutorials/FaceAPIinCSharpTutorial.md)
- [Getting Started with Face API in Java for Android Tutorial](Tutorials/FaceAPIinJavaForAndroidTutorial.md)
- [Getting Started with Face API in Python Tutorial](Tutorials/FaceAPIinPythonTutorial.md)

## Sample Apps
Take a look at these sample applications which make use of Face API.
- [FamilyNotes UWP app](https://github.com/Microsoft/Windows-appsample-familynotes)
 - Universal Windows Platform (UWP) sample app that shows usage of speech, Cortana, ink, and camera through a family note sharing scenario.
- [Video Frame Analysis Sample](https://github.com/microsoft/cognitive-samples-videoframeanalysis)
 - Universal Windows Platform (UWP) sample app that shows analyzing live video streams in near real-time using the Face, Computer Vision, and Emotion APIs.

## Related Topics
- [Face API Version 1.0 Release Notes](ReleaseNotes.md)
- [How to Detect Faces in Image](Face-API-How-to-Topics/HowtoDetectFacesinImage.md)
- [How to Identify Faces in Image](Face-API-How-to-Topics/HowtoIdentifyFacesinImage.md)
