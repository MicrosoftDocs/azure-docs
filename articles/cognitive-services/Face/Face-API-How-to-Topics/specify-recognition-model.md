---
title: How to specify a recognition model - Face API
titleSuffix: Azure Cognitive Services
description: This article will show you how to choose which recognition model to use with your Azure Face API application.
services: cognitive-services
author: longl
manager: nitinme

ms.service: cognitive-services
ms.component: face-api
ms.topic: conceptual
ms.date: 01/14/2019
ms.author: longl
---

# Specify a recognition model

This guide demonstrates how to specify a recognition model for face detection, identification and similarity search using the Azure Face API.

The Face API uses deep learning models to perform face-related operations. We continue to improve the accuracy of the models based on customer feedback and advances in deep learning research, and we ship these improvements as model updates. Developers have the option to specify which version of face recognition model they want to use; they can choose the model that best fits their use case. 

If you are a new user, we recommend using the latest model. Read on to learn how to specify it in different Face operation. If you are an advanced user and are not sure whether you should switch to the latest model, skip to the [Evaluate different models](#Evaluate-different-models) section to evaluate the new model and compare results using your current data set. 

## Prerequisites

You should be familiar with the concepts of AI face detection and identification. If you aren't, see these how-to guides first:

* [How to detect faces in an image](HowtoDetectFacesinImage.md)
* [How to identify faces in an image](HowtoIdentifyFacesinImage.md)


## Detect faces with specified model

Face detection identifies the visual landmarks of human faces and finds their bounding-box locations. It also extracts the face's features and stores them in Azure Storage for use in identification. All of this information forms the representation of one face.

The recognition model is used when the face features are extracted, so you can specify a model version when performing the Detect operation.

When using the [Face - Detect] API, assign the model version with the `recognitionModelType` parameter.

Available values:
- `recognition_v01`
- `recognition_v02`

So, a request URL for the [Face - Detect] API will look like this:
```
https://westus.api.cognitive.microsoft.com/face/v1.0/detect[?returnFaceId][&returnFaceLandmarks][&returnFaceAttributes][&recognitionModelType]
&subscription-key=<Subscription key>
```

If you are using the client library, you can assign the value for `recognitionModelType` by passing a string representing the version.
If you leave it unassigned, the default model version (_recognition_v01_) will be used.

```csharp
string imageUrl = "http://news.microsoft.com/ceo/assets/photos/06_web.jpg";
var faces = await faceServiceClient.DetectAsync(imageUrl, true, true, "recognition_v02");
```

## Identify faces with specified model

When the Face API extracts face feature data from an image, the service builds a **PersonGroup** object for person identification.

A **PersonGroup** should have one unique recognition model for all of the Persons, and you can specify this when you create the group ([PersonGroup - Create] or [LargePersonGroup - Create]). You can assign the model version with `recognitionModelType` parameter.

See the following code example for the .NET client library.

```csharp 
// Create an empty PersonGroup with "recognition_v02" model
string personGroupId = "myfriends";
await faceServiceClient.CreatePersonGroupAsync(personGroupId, "My Friends", "recognition_v02");
```

In this code, a **PersonGroup** with id `myfriends` is created, and it is set up to use the new _recognition_v02_ model to extract face features.

Correspondingly, you need to specify which model to use when identifying faces against this PersonGroup (through [Face - Detect] API). The model you use should always be consistent with the **PersonGroup**'s configuration, otherwise the identification result might be incorrect.

There is no change in the [Face - Identify] API; you only specify the model version in detection.

## Find similar faces with specified model

You can also specify a recognition model for similarity search. You can assign the model version with `recognitionModelType` when creating the face list with [FaceList - Create] API or [LargeFaceList - Create].

See the following code example for the .NET client library.

```csharp
await faceServiceClient.CreateFaceListAsync(faceListId, "My face collection", "recognition_v02");
```
This code creates a face list called `My face collection`, using the _recognition_v02_ model for feature extraction. So, when you search for similar faces in this face list with a `faceId`, that `faceId`'s corresponding face should also be detected with the [Face - Detect] API using _recognition_v02_. As in the previous section, the model needs to be consistent.

There is no change in the [Face - Find Similar] API; you only specify the model version in detection.

## Evaluate different models

If you'd like to compare the performances of the _recognition_v01_ and _recognition_v02_ models on your data, you will need to:

1. Create two **PersonGroup**s with _recognition_v01_ and _recognition_v02_ respectively.
2. Use your image data to create Persons for these two **PersonGroup**s, and trigger the training process with [PersonGroup - Train] API.
3. Test faces on both **PersonGroup**s.

If you normally specify a confidence threshold (a value between zero and one that determines how confident the model must be to identify a face), note that you may need to use different thresholds for different models. A threshold for one model is not meant to be shared to another and will not necessarily produce the same results.

[Face - Detect]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d
[Face - Find Similar]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237
[Face - Identify]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239
[PersonGroup - Create]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244
[PersonGroup Person - Add Face]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b
[PersonGroup - Train]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249
[LargePersonGroup - Create]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d
[FaceList - Create]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b
[LargeFaceList - Create]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc