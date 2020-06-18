---
title: How to specify a recognition model - Face
titleSuffix: Azure Cognitive Services
description: This article will show you how to choose which recognition model to use with your Azure Face application.
services: cognitive-services
author: longli0
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 12/03/2019
ms.author: longl
---

# Specify a face recognition model

This guide shows you how to specify a face recognition model for face detection, identification and similarity search using the Azure Face service.

The Face service uses machine learning models to perform operations on human faces in images. We continue to improve the accuracy of our models based on customer feedback and advances in research, and we deliver these improvements as model updates. Developers have the option to specify which version of the face recognition model they'd like to use; they can choose the model that best fits their use case.

If you are a new user, we recommend you use the latest model. Read on to learn how to specify it in different Face operations while avoiding model conflicts. If you are an advanced user and are not sure whether you should switch to the latest model, skip to the [Evaluate different models](#evaluate-different-models) section to evaluate the new model and compare results using your current data set.

## Prerequisites

You should be familiar with the concepts of AI face detection and identification. If you aren't, see these how-to guides first:

* [How to detect faces in an image](HowtoDetectFacesinImage.md)
* [How to identify faces in an image](HowtoIdentifyFacesinImage.md)

## Detect faces with specified model

Face detection identifies the visual landmarks of human faces and finds their bounding-box locations. It also extracts the face's features and stores them for use in identification. All of this information forms the representation of one face.

The recognition model is used when the face features are extracted, so you can specify a model version when performing the Detect operation.

When using the [Face - Detect] API, assign the model version with the `recognitionModel` parameter. The available values are:

* `recognition_01`
* `recognition_02`

Optionally, you can specify the _returnRecognitionModel_ parameter (default **false**) to indicate whether _recognitionModel_ should be returned in response. So, a request URL for the [Face - Detect] REST API will look like this:

`https://westus.api.cognitive.microsoft.com/face/v1.0/detect[?returnFaceId][&returnFaceLandmarks][&returnFaceAttributes][&recognitionModel][&returnRecognitionModel]&subscription-key=<Subscription key>`

If you are using the client library, you can assign the value for `recognitionModel` by passing a string representing the version.
If you leave it unassigned, the default model version (_recognition_01_) will be used. See the following code example for the .NET client library.

```csharp
string imageUrl = "https://news.microsoft.com/ceo/assets/photos/06_web.jpg";
var faces = await faceClient.Face.DetectWithUrlAsync(imageUrl, true, true, recognitionModel: "recognition_02", returnRecognitionModel: true);
```

## Identify faces with specified model

The Face service can extract face data from an image and associate it with a **Person** object (through the [Add face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) API call, for example), and multiple **Person** objects can be stored together in a **PersonGroup**. Then, a new face can be compared against a **PersonGroup** (with the [Face - Identify] call), and the matching person within that group can be identified.

A **PersonGroup** should have one unique recognition model for all of the **Person**s, and you can specify this using the `recognitionModel` parameter when you create the group ([PersonGroup - Create] or [LargePersonGroup - Create]). If you do not specify this parameter, the original `recognition_01` model is used. A group will always use the recognition model it was created with, and new faces will become associated with this model when they are added to it; this cannot be changed after a group's creation. To see what model a **PersonGroup** is configured with, use the [PersonGroup - Get] API with the _returnRecognitionModel_ parameter set as **true**.

See the following code example for the .NET client library.

```csharp
// Create an empty PersonGroup with "recognition_02" model
string personGroupId = "mypersongroupid";
await faceClient.PersonGroup.CreateAsync(personGroupId, "My Person Group Name", recognitionModel: "recognition_02");
```

In this code, a **PersonGroup** with ID `mypersongroupid` is created, and it is set up to use the _recognition_02_ model to extract face features.

Correspondingly, you need to specify which model to use when detecting faces to compare against this **PersonGroup** (through the [Face - Detect] API). The model you use should always be consistent with the **PersonGroup**'s configuration; otherwise, the operation will fail due to incompatible models.

There is no change in the [Face - Identify] API; you only need to specify the model version in detection.

## Find similar faces with specified model

You can also specify a recognition model for similarity search. You can assign the model version with `recognitionModel` when creating the face list with [FaceList - Create] API or [LargeFaceList - Create]. If you do not specify this parameter, the original `recognition_01` model is used. A face list will always use the recognition model it was created with, and new faces will become associated with this model when they are added to it; this cannot be changed after creation. To see what model a face list is configured with, use the [FaceList - Get] API with the _returnRecognitionModel_ parameter set as **true**.

See the following code example for the .NET client library.

```csharp
await faceClient.FaceList.CreateAsync(faceListId, "My face collection", recognitionModel: "recognition_02");
```

This code creates a face list called `My face collection`, using the _recognition_02_ model for feature extraction. When you search this face list for similar faces to a new detected face, that face must have been detected ([Face - Detect]) using the _recognition_02_ model. As in the previous section, the model needs to be consistent.

There is no change in the [Face - Find Similar] API; you only specify the model version in detection.

## Verify faces with specified model

The [Face - Verify] API checks whether two faces belong to the same person. There is no change in the Verify API with regard to recognition models, but you can only compare faces that were detected with the same model. So, the two faces will both need to have been detected using `recognition_01` or `recognition_02`.

## Evaluate different models

If you'd like to compare the performances of the _recognition_01_ and _recognition_02_ models on your data, you will need to:

1. Create two **PersonGroup**s with _recognition_01_ and _recognition_02_ respectively.
1. Use your image data to detect faces and register them to **Person**s for these two **PersonGroup**s, and trigger the training process with [PersonGroup - Train] API.
1. Test with [Face - Identify] on both **PersonGroup**s and compare the results.

If you normally specify a confidence threshold (a value between zero and one that determines how confident the model must be to identify a face), you may need to use different thresholds for different models. A threshold for one model is not meant to be shared to another and will not necessarily produce the same results.

## Next steps

In this article, you learned how to specify the recognition model to use with different Face service APIs. Next, follow a quickstart to get started using face detection.

* [Face .NET SDK](../Quickstarts/csharp-sdk.md)
* [Face Python SDK](../Quickstarts/python-sdk.md)
* [Face Go SDK](../Quickstarts/go-sdk.md)

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
