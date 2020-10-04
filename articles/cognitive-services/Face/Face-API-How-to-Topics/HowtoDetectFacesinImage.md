---
title: "Detect faces in an image - Face"
titleSuffix: Azure Cognitive Services
description: This guide demonstrates how to use face detection to extract attributes like gender, age, or pose from a given image.
services: cognitive-services
author: SteveMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 04/18/2019
ms.author: sbowles
ms.custom: devx-track-csharp
---

# Get face detection data

This guide demonstrates how to use face detection to extract attributes like gender, age, or pose from a given image. The code snippets in this guide are written in C# by using the Azure Cognitive Services Face client library. The same functionality is available through the [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

This guide shows you how to:

- Get the locations and dimensions of faces in an image.
- Get the locations of various face landmarks, such as pupils, nose, and mouth, in an image.
- Guess the gender, age, emotion, and other attributes of a detected face.

## Setup

This guide assumes that you already constructed a [FaceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient?view=azure-dotnet) object, named `faceClient`, with a Face subscription key and endpoint URL. From here, you can use the face detection feature by calling either [DetectWithUrlAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperationsextensions.detectwithurlasync?view=azure-dotnet), which is used in this guide, or [DetectWithStreamAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperationsextensions.detectwithstreamasync?view=azure-dotnet). For instructions on how to set up this feature, follow one of the quickstarts.

This guide focuses on the specifics of the Detect call, such as what arguments you can pass and what you can do with the returned data. We recommend that you query for only the features you need. Each operation takes additional time to complete.

## Get basic face data

To find faces and get their locations in an image, call the [DetectWithUrlAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperationsextensions.detectwithurlasync?view=azure-dotnet) or [DetectWithStreamAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperationsextensions.detectwithstreamasync?view=azure-dotnet) method with the _returnFaceId_ parameter set to **true**. This setting is the default.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="basic1":::

You can query the returned [DetectedFace](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.detectedface?view=azure-dotnet) objects for their unique IDs and a rectangle that gives the pixel coordinates of the face.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="basic2":::

For information on how to parse the location and dimensions of the face, see [FaceRectangle](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.facerectangle?view=azure-dotnet). Usually, this rectangle contains the eyes, eyebrows, nose, and mouth. The top of head, ears, and chin aren't necessarily included. To use the face rectangle to crop a complete head or get a mid-shot portrait, perhaps for a photo ID-type image, you can expand the rectangle in each direction.

## Get face landmarks

[Face landmarks](../concepts/face-detection.md#face-landmarks) are a set of easy-to-find points on a face, such as the pupils or the tip of the nose. To get face landmark data, set the _detectionModel_ parameter to **DetectionModel.Detection01** and the _returnFaceLandmarks_ parameter to **true**.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="landmarks1":::

The following code demonstrates how you might retrieve the locations of the nose and pupils:

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="landmarks2":::

You also can use face landmarks data to accurately calculate the direction of the face. For example, you can define the rotation of the face as a vector from the center of the mouth to the center of the eyes. The following code calculates this vector:

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="direction":::

When you know the direction of the face, you can rotate the rectangular face frame to align it more properly. To crop faces in an image, you can programmatically rotate the image so that the faces always appear upright.

## Get face attributes

Besides face rectangles and landmarks, the face detection API can analyze several conceptual attributes of a face. For a full list, see the [Face attributes](../concepts/face-detection.md#attributes) conceptual section.

To analyze face attributes, set the _detectionModel_ parameter to **DetectionModel.Detection01** and the _returnFaceAttributes_ parameter to a list of [FaceAttributeType Enum](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.faceattributetype?view=azure-dotnet) values.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="attributes1":::

Then, get references to the returned data and do more operations according to your needs.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="attributes2":::

To learn more about each of the attributes, see the [Face detection and attributes](../concepts/face-detection.md) conceptual guide.

## Next steps

In this guide, you learned how to use the various functionalities of face detection. Next, integrate these features into your app by following an in-depth tutorial.

- [Tutorial: Create a WPF app to display face data in an image](../Tutorials/FaceAPIinCSharpTutorial.md)

## Related topics

- [Reference documentation (REST)](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236)
- [Reference documentation (.NET SDK)](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/faceapi?view=azure-dotnet)
