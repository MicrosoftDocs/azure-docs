---
title: How to specify a recognition model - Face
titleSuffix: Azure AI services
description: This article shows you how to choose which recognition model to use with your Azure AI Face application.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 01/19/2024
ms.author: pafarley
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Specify a face recognition model

[!INCLUDE [Gate notice](../includes/identity-gate-notice.md)]

This guide shows you how to specify a face recognition model for face detection, identification and similarity search using the Azure AI Face service.

The Face service uses machine learning models to perform operations on visible human faces in images. We continue to improve the accuracy of our models based on customer feedback and advances in research, and we deliver these improvements as model updates. Developers can specify which version of the face recognition model they'd like to use, choosing the model that best fits their use case.

## Model compatibility

The Azure AI Face service has four recognition models available. The models _recognition_01_ (published 2017), _recognition_02_ (published 2019), and _recognition_03_ (published 2020) are continually supported to ensure backwards compatibility for customers using **FaceList**s or **PersonGroup**s created with these models. A **FaceList** or **PersonGroup** always uses the recognition model it was created with, and new faces become associated with this model when they're added. This can't be changed after creation and customers need to use the corresponding recognition model with the corresponding **FaceList** or **PersonGroup**.

You can move to later recognition models at your own convenience; however, you'll need to create new FaceLists and PersonGroups with the recognition model of your choice.

## Recommended model

The _recognition_04_ model (published 2021) is the most accurate model currently available. If you're a new customer, we recommend using this model. _Recognition_04_ provides improved accuracy for both similarity comparisons and person-matching comparisons. _Recognition_04_ improves recognition for enrolled users wearing face covers (surgical masks, N95 masks, cloth masks). Now you can build safe and seamless user experiences that use the latest _detection_03_ model to detect whether an enrolled user is wearing a face cover. Then you can use the latest _recognition_04_ model to recognize their identity. Each model operates independently of the others, and a confidence threshold set for one model isn't meant to be compared across the other recognition models.

Read on to learn how to specify a selected model in different Face operations while avoiding model conflicts. If you're an advanced user and would like to determine whether you should switch to the latest model, skip to the [Evaluate different models](#evaluate-different-models) section. You can evaluate the new model and compare results using your current data set.


## Prerequisites

You should be familiar with the concepts of AI face detection and identification. If you aren't, see these guides first:

* [Face detection concepts](../concept-face-detection.md)
* [Face recognition concepts](../concept-face-recognition.md)
* [Call the detect API](identity-detect-faces.md)

## Detect faces with specified model

Face detection identifies the visual landmarks of human faces and finds their bounding-box locations. It also extracts the face's features and stores them temporarily for up to 24 hours for use in identification. All of this information forms the representation of one face.

The recognition model is used when the face features are extracted, so you can specify a model version when performing the Detect operation.

When using the [Detect] API, assign the model version with the `recognitionModel` parameter. The available values are:
* `recognition_01`
* `recognition_02`
* `recognition_03`
* `recognition_04`


Optionally, you can specify the _returnRecognitionModel_ parameter (default **false**) to indicate whether _recognitionModel_ should be returned in response. So, a request URL for the [Detect] REST API will look like this:

`https://westus.api.cognitive.microsoft.com/face/v1.0/detect[?returnFaceId][&returnFaceLandmarks][&returnFaceAttributes][&recognitionModel][&returnRecognitionModel]&subscription-key=<Subscription key>`

If you're using the client library, you can assign the value for `recognitionModel` by passing a string representing the version. If you leave it unassigned, a default model version of `recognition_01` will be used. See the following code example for the .NET client library.

```csharp
string imageUrl = "https://news.microsoft.com/ceo/assets/photos/06_web.jpg";
var faces = await faceClient.Face.DetectWithUrlAsync(url: imageUrl, returnFaceId: true, returnFaceLandmarks: true, recognitionModel: "recognition_01", returnRecognitionModel: true);
```

> [!NOTE]
> The _returnFaceId_ parameter must be set to `true` in order to enable the face recognition scenarios in later steps.

## Identify faces with the specified model

The Face service can extract face data from an image and associate it with a **Person** object (through the [Add Person Group Person Face] API call, for example), and multiple **Person** objects can be stored together in a **PersonGroup**. Then, a new face can be compared against a **PersonGroup** (with the [Identify From Person Group] call), and the matching person within that group can be identified.

A **PersonGroup** should have one unique recognition model for all of the **Person**s, and you can specify this using the `recognitionModel` parameter when you create the group ([Create Person Group] or [Create Large Person Group]). If you don't specify this parameter, the original `recognition_01` model is used. A group will always use the recognition model it was created with, and new faces will become associated with this model when they're added to it. This can't be changed after a group's creation. To see what model a **PersonGroup** is configured with, use the [Get Person Group] API with the _returnRecognitionModel_ parameter set as **true**.

See the following code example for the .NET client library.

```csharp
// Create an empty PersonGroup with "recognition_04" model
string personGroupId = "mypersongroupid";
await faceClient.PersonGroup.CreateAsync(personGroupId, "My Person Group Name", recognitionModel: "recognition_04");
```

In this code, a **PersonGroup** with ID `mypersongroupid` is created, and it's set up to use the _recognition_04_ model to extract face features.

Correspondingly, you need to specify which model to use when detecting faces to compare against this **PersonGroup** (through the [Detect] API). The model you use should always be consistent with the **PersonGroup**'s configuration; otherwise, the operation will fail due to incompatible models.

There is no change in the [Identify From Person Group] API; you only need to specify the model version in detection.

## Find similar faces with the specified model

You can also specify a recognition model for similarity search. You can assign the model version with `recognitionModel` when creating the **FaceList** with [Create Face List] API or [Create Large Face List]. If you don't specify this parameter, the `recognition_01` model is used by default. A **FaceList** will always use the recognition model it was created with, and new faces will become associated with this model when they're added to the list; you can't change this after creation. To see what model a **FaceList** is configured with, use the [Get Face List] API with the _returnRecognitionModel_ parameter set as **true**.

See the following code example for the .NET client library.

```csharp
await faceClient.FaceList.CreateAsync(faceListId, "My face collection", recognitionModel: "recognition_04");
```

This code creates a **FaceList** called `My face collection`, using the _recognition_04_ model for feature extraction. When you search this **FaceList** for similar faces to a new detected face, that face must have been detected ([Detect]) using the _recognition_04_ model. As in the previous section, the model needs to be consistent.

There is no change in the [Find Similar] API; you only specify the model version in detection.

## Verify faces with the specified model

The [Verify Face To Face] API checks whether two faces belong to the same person. There is no change in the Verify API with regard to recognition models, but you can only compare faces that were detected with the same model.

## Evaluate different models

If you'd like to compare the performances of different recognition models on your own data, you'll need to:
1. Create four **PersonGroup**s using _recognition_01_, _recognition_02_, _recognition_03_, and _recognition_04_ respectively.
1. Use your image data to detect faces and register them to **Person**s within these four **PersonGroup**s. 
1. Train your **PersonGroup**s using the [Train Person Group] API.
1. Test with [Identify From Person Group] on all four **PersonGroup**s and compare the results.

If you normally specify a confidence threshold (a value between zero and one that determines how confident the model must be to identify a face), you may need to use different thresholds for different models. A threshold for one model isn't meant to be shared to another and won't necessarily produce the same results.

## Next steps

In this article, you learned how to specify the recognition model to use with different Face service APIs. Next, follow a quickstart to get started with face detection.

* [Face .NET SDK](../quickstarts-sdk/identity-client-library.md?pivots=programming-language-csharp%253fpivots%253dprogramming-language-csharp)
* [Face Python SDK](../quickstarts-sdk/identity-client-library.md?pivots=programming-language-python%253fpivots%253dprogramming-language-python)

[Detect]: /rest/api/face/face-detection-operations/detect
[Verify Face To Face]: /rest/api/face/face-recognition-operations/verify-face-to-face
[Identify From Person Group]: /rest/api/face/face-recognition-operations/identify-from-person-group
[Find Similar]: /rest/api/face/face-recognition-operations/find-similar-from-large-face-list
[Create Person Group]: /rest/api/face/person-group-operations/create-person-group
[Get Person Group]: /rest/api/face/person-group-operations/get-person-group
[Train Person Group]: /rest/api/face/person-group-operations/train-person-group
[Add Person Group Person Face]: /rest/api/face/person-group-operations/add-person-group-person-face
[Create Large Person Group]: /rest/api/face/person-group-operations/create-large-person-group
[Create Face List]: /rest/api/face/face-list-operations/create-face-list
[Get Face List]: /rest/api/face/face-list-operations/get-face-list
[Create Large Face List]: /rest/api/face/face-list-operations/create-large-face-list
