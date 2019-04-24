---
title: "Face detection and attributes concepts"
titleSuffix: Azure Cognitive Services
description: Learn concepts about face detection and face attributes.
services: cognitive-services
author: PatrickFarley
manager: nitime

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 04/23/2019
ms.author: pafarley
---

# Face detection and attributes

This article explains the concepts of face detection and face attribute data. Face detection is the action of locating human faces in an image and optionally returning a variety of face-related data.

You use the [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) operation to detect faces in an image. At a minimum, each detected face will correspond to a **faceRectangle** field in the response. This is a set of pixel coordinates (left, top, width, height) marking the located face. Using these coordinates, you can get the location of the face as well as its size. In the API response, faces are listed in size order from largest to smallest.

## Face ID

The face ID is simply a unique identifier string for each detected face in an image. You can request a face ID in your [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) API call.

## Face landmarks

Face landmarks are a set of easy-to-find points on a face such as the pupils or the tip of nose. By default, there are 27 predefined landmark points. The following figure shows all 27 points:

![A face diagram with all 27 landmarks labeled](../Images/landmarks.1.jpg)

The coordinates of the points are returned in units of pixels.

## Attributes

Attributes are a set of additional face features that can optionally be detected by the [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) API. The following are attributes that can be detected:

* **Age** The estimated age, in years, of a particular face.
* **Blur** The blurriness of the face in the image. This returns a value between zero and one as well as an informal rating ("low", "medium", "high").
* **Exposure** The exposure of the face in the image. This returns a value between zero and one as well as an informal rating ("underExposure", "goodExposure", "overExposure").
* **Emotion** A list of emotions with their detection confidence for the given face. Confidence scores are normalized: the scores across all emotions will add up to one. The emotions returned are happiness, sadness, neutral, anger, contempt, disgust, surprise, and fear.
* **Facial hair** The estimated facial hair presence and length of the given face.
* **Gender** The estimated gender of the given face. Possible values are "male", "female", and "genderless".
* **Glasses** Whether the given face has eyeglasses. Possible values are "NoGlasses", "ReadingGlasses", "Sunglasses", and "Swimming Goggles".
* **Hair** The hair style of the face. This shows whether the hair is visible, whether baldness is detected, and what hair colors are detected.
* **Head pose** The face's orientation in 3D space. This is described by the pitch, roll, and yaw angles in degrees. The value ranges of roll and yaw are [-180, 180] and [-90, 90] degrees respectively. Pitch calculation is currently unavailable and will always return 0. See the following diagram for angle mappings:

    ![A head with the pitch, roll, and yaw axes labeled](../Images/headpose.1.jpg)
* **Makeup** Whether the face has makeup. This returns a boolean value for "eyeMakeup" and "lipMakeup".
* **Noise** The visual noise detected in the face image. This returns a value between zero and one as well as an informal rating ("low", "medium", "high").
* **Occlusion** Whether there are objects blocking parts of the face. This returns a boolean value for "eyeOccluded", "foreheadOccluded", and "mouthOccluded".
* **Smile** The smile expression of the given face. This is a value between zero (no smile) and one (clear smile).

> [!IMPORTANT]
> Face attributes are predicted through the use of statistical algorithms and may not always be accurate. Use caution when making decisions based on attribute data.

## Input data

Use the following tips to ensure your input images give the most accurate detection results:

* The supported input image formats are JPEG, PNG, GIF(the first frame), BMP.
* Image file size should be no larger than 4 MB.
* The detectable face size range is 36x36 to 4096x4096 pixels. Faces outside of this range won't be detected.
* Some faces may not be detected because of technical challenges. Extreme face angles (head pose) or face occlusion (objects such as sunglasses or hands blocking part of the face) can affect detection. Frontal and near-frontal faces give the best results.

## Next steps

Now that you are familiar with face detection concepts, learn how to write a simple script that detects faces in a given image.

* [How to detect faces in an image](../Face-API-How-to-Topics/HowtoDetectFacesinImage.md)