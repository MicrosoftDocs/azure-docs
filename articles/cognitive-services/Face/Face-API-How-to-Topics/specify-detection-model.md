---
title: How to specify a detection model - Face API
titleSuffix: Azure Cognitive Services
description: This article will show you how to choose which face detection model to use with your Azure Face API application.
services: cognitive-services
author: yluiu
manager: nitinme

ms.service: cognitive-services
ms.component: face-api
ms.topic: conceptual
ms.date: 05/16/2019
ms.author: yluiu
---

# Specify a face detection model

This guide shows you how to specify a face detection model for the Azure Face API.

The Face API uses machine learning models to perform operations on human faces in images. We continue to improve the accuracy of our models based on customer feedback and advances in research, and we deliver these improvements as model updates. Developers have the option to specify which version of the face detection model they'd like to use; they can choose the model that best fits their use case.

Read on to learn how to specify the face detection model in certain face operations. If you are an advanced user and are not sure whether you should use the latest model, skip to the [Evaluate different models](#evaluate-different-models) section to evaluate the new model and compare results using your current data set.

## Prerequisites

You should be familiar with the concept of AI face detection. If you aren't, see the face detection conceptual guide or how-to guide:

* [Face detection concepts](../concepts/face-detection.md)
* [How to detect faces in an image](HowtoDetectFacesinImage.md)

## Detect faces with specified model

Face detection identifies the visual landmarks of human faces and finds their bounding-box locations. It also extracts the face's features and stores them for use in identification. All of this information forms the representation of a face.

The Face API uses face detection whenever it converts an image of a face into some other form of data.

When using the [Face - Detect] API, assign the model version with the `detectionModel` parameter. The available values are:

* `detection_01`
* `detection_02`

A request URL for the [Face - Detect] REST API will look like this:

`https://westus.api.cognitive.microsoft.com/face/v1.0/detect[?returnFaceId][&returnFaceLandmarks][&returnFaceAttributes][&recognitionModel][&returnRecognitionModel][&detectionModel]
&subscription-key=<Subscription key>`

If you are using the client library, you can assign the value for `detectionModel` by passing a string representing the version.
If you leave it unassigned, the default model version (_detection_01_) will be used. See the following code example for the .NET client library.

```csharp
string imageUrl = "https://news.microsoft.com/ceo/assets/photos/06_web.jpg";
var faces = await faceServiceClient.Face.DetectWithUrlAsync(imageUrl, true, true, recognitionModel: "recognition_02", returnRecognitionModel: true, detectionModel: "detection_02");
```

## Add face to Person

The Face API can extract face data from an image and associate it with a **Person** object (through the [Add face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) API call, for example), and multiple **Person** objects can be stored together in a **PersonGroup**. Then, a new face can be compared against a **PersonGroup** (with the [Face - Identify] call), and the matching person within that group can be identified.

A **PersonGroup** could have different detection model for all of the **Person face**s, and you can specify this using the `detectionModel` parameter when you add face to a **Person** after the group is created([PersonGroup - Create] or [LargePersonGroup - Create]). If you do not specify this parameter, the original `detection_01` model is used.

See the following code example for the .NET client library.

```csharp
// Create a PersonGroup and add a person with face detected by "detection_02" model
string personGroupId = "mypersongroupid";
await faceServiceClient.PersonGroup.CreateAsync(personGroupId, "My Person Group Name", recognitionModel: "recognition_02");

string personId = (await faceServiceClient.PersonGroupPerson.CreateAsync(personGroupId, "My Person Name")).PersonId;

string imageUrl = "https://news.microsoft.com/ceo/assets/photos/06_web.jpg";
await client.PersonGroupPerson.AddFaceFromUrlAsync(personGroupId, personId, imageUrl, detectionModel: "detection_02");
```

In this code, a **PersonGroup** with ID `mypersongroupid` is created, and add a **Person** to this **PersonGroup**, then add a **Face** to this Person with *detection_02* model.

Correspondingly, you can also specify which detection model to use when detecting faces to compare against this **PersonGroup** (through the [Face - Detect] API). The model you use could different with the **PersonGroupPersonFace**'s configuration.

There is no change in the [Face - Identify] API; you only need to specify the model version in detection.

## Add face to FaceList

You can also specify a detection model for similarity search. You can assign the model version with `detectionModel` when adding face to a created face list with [FaceList - Create] API or [LargeFaceList - Create]. If you do not specify this parameter, the original `detection_01` model is used. 

See the following code example for the .NET client library.

```csharp
await faceServiceClient.FaceList.CreateAsync(faceListId, "My face collection", recognitionModel: "recognition_02");

string imageUrl = "https://news.microsoft.com/ceo/assets/photos/06_web.jpg";
await client.FaceList.AddFaceFromUrlAsync(faceListId, imageUrl, detectionModel: "detection_02");
```

This code creates a face list called `My face collection`, then add a Face to the face list with *detection_02* model. When you search this face list for similar faces to a new detected face, that face could been detected ([Face - Detect]) using different detection model.

There is no change in the [Face - Find Similar] API; you only specify the model version in detection.

## Verify faces with specified model

The [Face - Verify] API checks whether two faces belong to the same person. There is no change in the Verify API with regard to detection models, and you can compare faces that were detected with different model.

## Evaluate different models

If you'd like to compare the performances of the _detection_01_ and _detection_02_ models on your data, you will need to:

1. **Need to add a description**.
1. **Need to add a description**.
1. **Need to add a description**.

**Need to add a description**.

## Next steps

In this article, you learned how to specify the detection model to use with different Face service APIs. Next, follow a quickstart to get started using face detection.

* [Detect faces in an image](../quickstarts/csharp-detect-sdk.md)

[Face - Detect]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d
[Face - Find Similar]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237
[Face - Identify]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239
[Face - Verify]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a
[PersonGroup - Create]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244
[PersonGroup - Get]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395246
[PersonGroup Person - Add Face]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b
[PersonGroup - Train]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249
[LargePersonGroup - Create]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d
[FaceList - Create]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b
[FaceList - Get]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524c
[LargeFaceList - Create]: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc