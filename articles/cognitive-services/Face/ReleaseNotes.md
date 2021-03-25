---
title: What's new in Face service?
titleSuffix: Azure Cognitive Services
description: Release notes for the Face service include a history of release changes for various versions.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 03/05/2021
ms.author: pafarley
---

# What's new in Face service?

The Azure Face service is updated on an ongoing basis. Use this article to stay up to date with feature enhancements, fixes, and documentation updates.

## February 2021

* New Face API detection model: The new detection 03 model is the most accurate detection model currently available. If you're a new a customer, we recommend using this model. Detection 03 improves both recall and precision on smaller faces found within images (64x64 pixels). Additional improvements include an overall reduction in false positives and improved detection on rotated face orientations. Combining detection 03 with the new recognition 04 will provide improved recognition accuracy as well. See [Specify a face detection model](./face-api-how-to-topics/specify-detection-model.md) for more details.
* Face mask attribute: The face mask attribute is available with the latest detection 03 model, along with the additional attribute `"noseAndMouthCovered"` which detects whether the face mask is worn as intended, covering both the nose and mouth. To use the latest mask detection capability, users need to specify the detection model in the API request: assign the model version with the _detectionModel_ parameter to `detection_03`. See [Specify a face detection model](./face-api-how-to-topics/specify-detection-model.md) for more details.
* New Face API Recognition Model: The new recognition 04 model is the most accurate recognition model currently available. If you're a new customer, we recommend using this model for verification and identification. It improves upon the accuracy of recognition 03, including improved recognition for enrolled users wearing face covers (surgical masks, N95 masks, cloth masks). Now customers can build safe and seamless user experiences that detect whether an enrolled user is wearing a face cover with the latest detection 03 model, and recognize who they are with the latest recognition 04 model. See [Specify a face recognition model](./face-api-how-to-topics/specify-recognition-model.md) for more details.


## January 2021
* Mitigate latency when using the Face API: The Face team published a new article detailing potential causes of latency when using the service and possible mitigation strategies. See [Mitigate latency when using the Face service](./face-api-how-to-topics/how-to-mitigate-latency.md).

## December 2020
* Customer configuration for Face ID storage: While the Face Service does not store customer images, the extracted face feature(s) will be stored on server. The Face ID is an identifier of the face feature and will be used in [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239), [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a), and [Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237). The stored face features will expire and be deleted 24 hours after the original detection call. Customers can now determine the length of time these Face IDs are cached. The maximum value is still up to 24 hours, but a minimum value of 60 seconds can now be set. The new time ranges for Face IDs being cached is any value between 60 seconds and 24 hours. More details can be found in the [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) API reference (the *faceIdTimeToLive* parameter).

## November 2020
* Published a sample face enrollment app to demonstrate best practices for establishing meaningful consent and creating high-accuracy face recognition systems through high-quality enrollments. The open-source sample can be found in the [Build an enrollment app](build-enrollment-app.md) guide and on [GitHub](https://github.com/Azure-Samples/cognitive-services-FaceAPIEnrollmentSample), ready for developers to deploy or customize. 

## August 2020
* Customer-managed encryption of data at rest: The Face service automatically encrypts your data when persisting it to the cloud. The Face service encryption protects your data to help you meet your organizational security and compliance commitments. By default, your subscription uses Microsoft-managed encryption keys. There is also a new option to manage your subscription with your own keys called customer-managed keys (CMK). More details can be found at [Customer-managed keys](./encrypt-data-at-rest.md).

## April 2020
* New Face API Recognition Model: The new recognition 03 model is the most accurate model currently available. If you're a new customer, we recommend using this model. Recognition 03 will provide improved accuracy for both similarity comparisons and person-matching comparisons. More details can be found at [Specify a face recognition model](./face-api-how-to-topics/specify-recognition-model.md).

## June 2019

* Added a new face detection model with improved accuracy on small, side-view, occluded, and blurry faces. Use it through [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236), [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250), [LargeFaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a158c10d2de3616c086f2d3), [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) and [LargePersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adf2a3a7b9412a4d53f42) by specifying the new face detection model name `detection_02` in `detectionModel` parameter. More details in [How to specify a detection model](Face-API-How-to-Topics/specify-detection-model.md).

## April 2019

* Improved overall accuracy of the `age` and `headPose` attributes. The `headPose` attribute is also updated with the `pitch` value enabled now. Use these attributes by specifying them in the `returnFaceAttributes` parameter of [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) `returnFaceAttributes` parameter. 

* Improved speed of [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236), [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250), [LargeFaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a158c10d2de3616c086f2d3), [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) and [LargePersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adf2a3a7b9412a4d53f42).

## March 2019

* Added a new face recognition model with improved accuracy. Use it through [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236), [FaceList - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b), [LargeFaceList - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc), [PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) and [LargePersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d) by specifying the new face recognition model name `recognition_02` in `recognitionModel` parameter. More details in [How to specify a recognition model](Face-API-How-to-Topics/specify-recognition-model.md).

## January 2019

* Added Snapshot feature to support data migration across subscriptions: [Snapshot](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/snapshot-get). More details in [How to Migrate your face data to a different Face subscription](Face-API-How-to-Topics/how-to-migrate-face-data.md).

## October 2018

* Refined description for `status`, `createdDateTime`, `lastActionDateTime`, and `lastSuccessfulTrainingDateTime` in [PersonGroup - Get Training Status](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395247), [LargePersonGroup - Get Training Status](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599ae32c6ac60f11b48b5aa5), and [LargeFaceList - Get Training Status](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a1582f8d2de3616c086f2cf).

## May 2018

* Improved `gender` attribute significantly and also improved `age`, `glasses`, `facialHair`, `hair`, `makeup` attributes. Use them through [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) `returnFaceAttributes` parameter. 

* Increased input image file size limit from 4 MB to 6 MB in [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236), [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250), [LargeFaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a158c10d2de3616c086f2d3), [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) and [LargePersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adf2a3a7b9412a4d53f42).

## March 2018

* Added Million-Scale Container: [LargeFaceList](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc) and [LargePersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d). More details in [How to use the large-scale feature](Face-API-How-to-Topics/how-to-use-large-scale.md).

* Increased [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239) `maxNumOfCandidatesReturned` parameter from [1, 5] to [1, 100] and default to 10.

## May 2017

* Added `hair`, `makeup`, `accessory`, `occlusion`, `blur`, `exposure`, and `noise` attributes in [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) `returnFaceAttributes` parameter.

* Supported 10K persons in a PersonGroup and [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239).

* Supported pagination in [PersonGroup Person - List](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395241) with optional parameters: `start` and `top`.

* Supported concurrency in adding/deleting faces against different FaceLists and different persons in PersonGroup.

## March 2017
* Added `emotion` attribute in [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) `returnFaceAttributes` parameter.

* Fixed the face could not be redetected with rectangle returned from [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) as `targetFace` in [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250) and [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b).

* Fixed the detectable face size to make sure it is strictly between 36x36 to 4096x4096 pixels.

## November 2016
* Added Face Storage Standard subscription to store additional persisted faces when using [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) or [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250) for identification or similarity matching. The stored images are charged at $0.5 per 1000 faces and this rate is prorated on a daily basis. Free tier subscriptions continue to be limited to 1,000 total persons.

## October 2016
* Changed the error message of more than one face in the targetFace from 'There are more than one face in the image' to 'There is more than one face in the image' in [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250) and [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b).

## July 2016
* Supported Face to Person object authentication in [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).

* Added optional `mode` parameter enabling selection of two working modes: `matchPerson` and `matchFace` in [Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237) and default is `matchPerson`.

* Added optional `confidenceThreshold` parameter for user to set the threshold of whether one face belongs to a Person object in [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239).

* Added optional `start` and `top` parameters in [PersonGroup - List](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395248) to enable user to specify the start point and the total PersonGroups number to list.

## V1.0 changes from V0

* Updated service root endpoint from ```https://westus.api.cognitive.microsoft.com/face/v0/``` to ```https://westus.api.cognitive.microsoft.com/face/v1.0/```. Changes applied to:
 [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236), [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239), [Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237) and [Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238).

* Updated the minimal detectable face size to 36x36 pixels. Faces smaller than 36x36 pixels will not be detected.

* Deprecated the PersonGroup and Person data in Face V0. Those data cannot be accessed with the Face V1.0 service.

* Deprecated the V0 endpoint of Face API on June 30, 2016.