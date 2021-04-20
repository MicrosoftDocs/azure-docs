---
title: "Face identity verification concepts"
titleSuffix: Azure Cognitive Services
description: This article explains the concept of Face identity verification, its related operations, and the underlying data structures.
services: cognitive-services
author: PatrickFarley
manager: nitime

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 04/23/2019
ms.author: pafarley
---

# Identity verification concepts

This article explains the concept of Face identity verification, its related operations, and the underlying data structures. Broadly, identity verification is one-to-many matching that takes a single source image as input and returns a set of matching candidates from a database. This is useful in security scenarios like granting building access to a certain group of people or verifying the user of a device.

## Related data structures

The identification operations use mainly the following data structures. These objects are stored in the cloud and can be referenced by their ID strings. ID strings are always unique within a subscription. Name fields may be duplicated.

|Name|Description|
|:--|:--|
|DetectedFace| This single face representation is retrieved by the [face detection](../Face-API-How-to-Topics/HowtoDetectFacesinImage.md) operation. Its ID expires 24 hours after it's created.|
|PersistedFace| When DetectedFace objects are added to a group, such as FaceList or Person, they become PersistedFace objects. They can be [retrieved](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524c) at any time and don't expire.|
|[FaceList](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b) or [LargeFaceList](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc)| This data structure is an assorted list of PersistedFace objects. A FaceList has a unique ID, a name string, and optionally a user data string.|
|[Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c)| This data structure is a list of PersistedFace objects that belong to the same person. It has a unique ID, a name string, and optionally a user data string.|
|[PersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) or [LargePersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d)| This data structure is an assorted list of Person objects. It has a unique ID, a name string, and optionally a user data string. A PersonGroup must be [trained](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249) before it can be used in identity verification operations.|

## Identification operations

This section details how the underlying operations use the data structures previously described to identify and verify a face.

### Face detection for identification

You use the [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) operation to upload face data from images to the cloud service. All face data (both from the source image and the set of candidates) originally comes from a call to the Detect API.

### PersonGroup creation and training

You need to create a [PersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) or [LargePersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d) to store the set of match candidates. PersonGroups hold [Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c) objects, which each represent an individual person and hold a set of face data belonging to that person.

The [Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249) operation prepares the data set to be used in face data comparisons.

### Identification

The [Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239) operation takes one or several source face IDs (from a DetectedFace or PersistedFace object) and a PersonGroup or LargePersonGroup. It returns a list of the Person objects that each source face might belong to. Returned Person objects are wrapped as Candidate objects, which have a prediction confidence value.


### Verification

The [Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a) operation takes a single face ID (from a DetectedFace or PersistedFace object) and a Person object. It determines whether the face belongs to that same person. Verification is one-to-one matching and can be used as a final check on the results from the Identify API call. However, you can optionally pass in the PersonGroup to which the candidate Person belongs to improve the API performance.


## Input data

Use the following tips to ensure that your input images give the most accurate identity verification results:

* The supported input image formats are JPEG, PNG, GIF (the first frame), BMP.
* Image file size should be no larger than 6 MB.
* When you create Person objects, use photos that feature different kinds of angles and lighting.
* Some faces might not be recognized because of technical challenges, such as:
  * Images with extreme lighting, for example, severe backlighting.
  * Obstructions that block one or both eyes.
  * Differences in hair type or facial hair.
  * Changes in facial appearance because of age.
  * Extreme facial expressions.

## Next steps

Now that you're familiar with identity verification concepts, Write a script that identifies faces against a trained PersonGroup.

* [Face client library quickstart](../Quickstarts/client-libraries.md)