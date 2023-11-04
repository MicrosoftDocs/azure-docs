---
title: "Face recognition - Face"
titleSuffix: Azure AI services
description: Learn the concept of Face recognition, its related operations, and the underlying data structures.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.topic: conceptual
ms.date: 12/27/2022
ms.author: pafarley
---

# Face recognition

This article explains the concept of Face recognition, its related operations, and the underlying data structures. Broadly, face recognition is the act of verifying or identifying individuals by their faces. Face recognition is important in implementing the identification scenario, which enterprises and apps can use to verify that a (remote) user is who they claim to be.

You can try out the capabilities of face recognition quickly and easily using Vision Studio.
> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)


## Face recognition operations

[!INCLUDE [Gate notice](./includes/identity-gate-notice.md)]

### PersonGroup creation and training

You need to create a [PersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) or [LargePersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d) to store the set of people to match against. PersonGroups hold [Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c) objects, which each represent an individual person and hold a set of face data belonging to that person.

The [Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249) operation prepares the data set to be used in face data comparisons.

### Identification

The [Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239) operation takes one or several source face IDs (from a DetectedFace or PersistedFace object) and a PersonGroup or LargePersonGroup. It returns a list of the Person objects that each source face might belong to. Returned Person objects are wrapped as Candidate objects, which have a prediction confidence value.

### Verification

The [Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a) operation takes a single face ID (from a DetectedFace or PersistedFace object) and a Person object. It determines whether the face belongs to that same person. Verification is one-to-one matching and can be used as a final check on the results from the Identify API call. However, you can optionally pass in the PersonGroup to which the candidate Person belongs to improve the API performance.

## Related data structures

The recognition operations use mainly the following data structures. These objects are stored in the cloud and can be referenced by their ID strings. ID strings are always unique within a subscription, but name fields may be duplicated.

|Name|Description|
|:--|:--|
|DetectedFace| This single face representation is retrieved by the [face detection](./how-to/identity-detect-faces.md) operation. Its ID expires 24 hours after it's created.|
|PersistedFace| When DetectedFace objects are added to a group, such as FaceList or Person, they become PersistedFace objects. They can be [retrieved](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524c) at any time and don't expire.|
|[FaceList](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b) or [LargeFaceList](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc)| This data structure is an assorted list of PersistedFace objects. A FaceList has a unique ID, a name string, and optionally a user data string.|
|[Person](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c)| This data structure is a list of PersistedFace objects that belong to the same person. It has a unique ID, a name string, and optionally a user data string.|
|[PersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) or [LargePersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d)| This data structure is an assorted list of Person objects. It has a unique ID, a name string, and optionally a user data string. A PersonGroup must be [trained](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249) before it can be used in recognition operations.|
|PersonDirectory | This data structure is like **LargePersonGroup** but offers additional storage capacity and other added features. For more information, see [Use the PersonDirectory structure (preview)](./how-to/use-persondirectory.md).


## Input data

Use the following tips to ensure that your input images give the most accurate recognition results:

* The supported input image formats are JPEG, PNG, GIF (the first frame), BMP.
* Image file size should be no larger than 6 MB.
* When you create Person objects, use photos that feature different kinds of angles and lighting.
* Some faces might not be recognized because of technical challenges, such as:
  * Images with extreme lighting, for example, severe backlighting.
  * Obstructions that block one or both eyes.
  * Differences in hair type or facial hair.
  * Changes in facial appearance because of age.
  * Extreme facial expressions.
* You can utilize the qualityForRecognition attribute in the [face detection](./how-to/identity-detect-faces.md) operation when using applicable detection models as a general guideline of whether the image is likely of sufficient quality to attempt face recognition on. Only "high" quality images are recommended for person enrollment and quality at or above "medium" is recommended for identification scenarios.

## Next steps

Now that you're familiar with face recognition concepts, Write a script that identifies faces against a trained PersonGroup.

* [Face quickstart](./quickstarts-sdk/identity-client-library.md)
