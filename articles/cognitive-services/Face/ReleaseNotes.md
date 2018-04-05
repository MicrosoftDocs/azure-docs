---
title: Release notes for the Face API Service | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: Release notes for the Face API Service include a history of release changes for various versions.
services: cognitive-services
author: SteveMSFT
manager: corncar

ms.service: cognitive-services
ms.technology: face
ms.topic: article
ms.date: 03/01/2018
ms.author: sbowles
---

# Face API Release Notes

This article pertains to Microsoft Face API Service version 1.0.

### Release changes in March 2018

* **New Feature** Million-Scale Container: [LargeFaceList](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc) and [LargePersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d) with more details in [How to use the large-scale feature](Face-API-How-to-Topics/how-to-use-large-scale.md).

### Release changes in May 2017

* **New Attribute** Hair, makeup, accessories, occlusion, blur, exposure, and noise attributes could be returned from [Face - Detect](https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) if `hair`, `makeup`, `accessory`, `occlusion`, `blur`, `exposure`, or `noise` are specified in `returnFaceAttributes`.

* **Enhancement** Support 10K persons in a PersonGroup, [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239) is also supported for the scale.

* **List Persons API** Pagination is supported in [PersonGroup Person - List](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395241) with extra optional parameters, `start`, and `top`.

* **Enhancement** Concurrency is supported in adding/deleting faces against different FaceLists or different persons in PersonGroup.

### Release changes in March 2017
* **New Attribute** Emotion attribute could be returned from [Face - Detect](https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) if `emotion` is specified in `returnFaceAttributes`.

* **Bug fix** For [FaceList - Add Face](https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250) and [PersonGroup Person - Add Face](https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) APIs, algorithm is upgraded to make sure that the face could be re-detected with rectangle returned from [Face - Detect](https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) as `targetFace`.

* **Bug fix** Make sure the detectable face size is strictly between 36x36 to 4096x4096 pixels.

### Release changes in November 2016
* **Face Storage Expansion**; Face Storage allows a Standard subscription to store additional persisted faces when using Person objects ([PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b)) or FaceLists ([FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250)) for identification or similarity matching with the Face API. The stored images are charged at $0.5 per 1000 faces and this rate is prorated on a daily basis. Free tier subscriptions continue to be limited to 1,000 total persons.

### Release changes in October 2016
* **Error Message Change**: In [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250) and [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) APIs, the error message of more than one face in the targetFace changes from There are more than one face in the image to There is more than one face in the image.

### Release changes in July 2016
* **Face Verification API**: Face to Person object authentication is supported – previously Face Verification requests only supported Face to Face authentication. More details can be found here: [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).

* **Finding Similar Face API**: Added optional mode field enabling selection of two working modes, default matchPerson works the same as before, and new mode matchFace removes the same person filtering. If mode field is not specified, the behavior is the same as the past release. More details can be found here: [Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237).

* **Face Identification API**: Optional user-specified confidenceThreshold is enabled for user to define the confidence threshold of whether one face belongs to a person object. More details can be found here: [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239).

* **List PersonGroups**: New optional start and top parameters in list PersonGroups to support user specifying the start point and the total PersonGroups number to list. More details can be found here: [PersonGroup - List](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395248).

>[!NOTE]
>*All of these changes are compatible with the last version service, and using the default value for the newly added parameters will not cause any changes to users' code*. 

### V1.0 changes from V0
* **API Signature**: In Face API V1.0, Service root endpoint changes from ```https://westus.api.cognitive.microsoft.com/face/v0/``` to ```https://westus.api.cognitive.microsoft.com/face/v1.0/```. There are several signature changes for API, including:
 * [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236)
 * [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239)
 * [Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237)
 * [Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238)

* **Face Sizes**: The previous version of Face API was not clear about the smallest face sizes the API could detect. With V1.0 the API correctly sets the minimal detectable size to 36x36 pixels. Faces smaller 36x36 pixels will not be detected.

* **Persisted Data**: Existing PersonGroup and Person data which has been set up with Face V0 cannot be accessed with the Face V1.0 service. This incompatible issue will occur for only this one time, following API updates will not affect persisted data any more.

>[!NOTE]
>*The V0 endpoint of Face API was retired on 06/30/2016*.
