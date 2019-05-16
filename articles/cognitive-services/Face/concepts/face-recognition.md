---
title: "Face recognition concepts"
titleSuffix: Azure Cognitive Services
description: Learn concepts about face recognition.
services: cognitive-services
author: PatrickFarley
manager: nitime

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 04/23/2019
ms.author: pafarley
---

# Face recognition concepts

This article explains the concepts of the various face recognition operations (verification, find similar, grouping, identification) and the underlying data structures. Broadly, recognition describes the work of comparing two different faces to determine if they are similar or belong to the same person.

## Recognition-related data structures

The recognition operations use mainly the following data structures. These objects are stored in the cloud and can be referenced by their ID strings. ID strings are therefore always unique within a subscription, whereas name fields can be duplicated.

|Name|Description|
|:--|:--|
|**DetectedFace**| This is a single face representation retrieved by the [face detection](../Face-API-How-to-Topics/HowtoDetectFacesinImage.md) operation. Its ID expires 24 hours after it is created.|
|**PersistedFace**| When **DetectedFace** objects are added to a group (such as **FaceList** or **Person**), they become **PersistedFace** objects, which can be [retrieved](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524c) at any time and do not expire.|
|**[FaceList](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b)**/**[LargeFaceList](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc)**| This is an assorted list of **PersistedFace** objects. A **FaceList** has a unique ID, a name string, and optionally a user data string.|
|**[Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c)**| This is a list of **PersistedFace** objects that belong to the same person. It has a unique ID, a name string, and optionally a user data string.|
|**[PersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244)**/**[LargePersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d)**| This is an assorted list of **Person** objects. It has a unique ID, a name string, and optionally a user data string. A **PersonGroup** must be [trained](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249) before it can be used in recognition operations.|

## Recognition operations

This section details how the four recognition operations use the above data structures. See the [Overview](../Overview.md) for a broad description of each recognition operation.

### Verification

The [Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a) operation takes a face ID (**DetectedFace** or **PersistedFace**) and either another face ID or a **Person** object and determines whether they belong to the same person. If you pass in a **Person**, you can optionally pass in a **PersonGroup** to which that **Person** belongs in order to improve performance.

### Find similar

The [Find similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237) operation takes a face ID (**DetectedFace** or **PersistedFace**) and either a **FaceList** or an array of other face IDs. With a **FaceList**, it returns a smaller **FaceList** of faces that are similar to the given face. With an array of face IDs, it similarly returns a smaller array.

### Grouping

The [Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238) operation takes an array of assorted face IDs (**DetectedFace** or **PersistedFace**) and returns the same IDs grouped into several smaller arrays. Each "groups" array contains face IDs that appear similar, and a single "messyGroup" array contains face IDs for which no similarities were found.

### Identification

The [Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239) operation takes one or several face IDs (**DetectedFace** or **PersistedFace**) and a **PersonGroup** and returns a list of **Person** objects that each face might belong to. Returned **Person** objects are wrapped as **Candidate** objects, which have a prediction confidence value.

## Input data

Use the following tips to ensure that your input images give the most accurate recognition results:

* The supported input image formats are JPEG, PNG, GIF (the first frame), BMP.
* Image file size should be no larger than 4 MB.
* When creating **Person** objects, you should use photos that feature a variety of angles and lighting.
* Some faces may not be recognized because of technical challenges:
  * Images with extreme lighting (for example, severe backlighting).
  * Obstructions blocking one or both eyes.
  * Differences in hair style or facial hair.
  * Changes in face appearance due to age.
  * Extreme facial expressions.

## Next steps

Now that you are familiar with face recognition concepts, learn how to write a simple script that identifies faces against a trained **PersonGroup**.

* [How to identify faces in images](../Face-API-How-to-Topics/HowtoIdentifyFacesinImage.md)