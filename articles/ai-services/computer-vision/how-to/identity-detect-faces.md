---
title: "Call the Detect API - Face"
titleSuffix: Azure AI services
description: This guide demonstrates how to use face detection to extract attributes like age, emotion, or head pose from a given image.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.topic: how-to
ms.date: 02/14/2024
ms.author: pafarley
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Call the Detect API

[!INCLUDE [Gate notice](../includes/identity-gate-notice.md)]

[!INCLUDE [Sensitive attributes notice](../includes/identity-sensitive-attributes.md)]

This guide demonstrates how to use the face detection API to extract attributes from a given image. You'll learn the different ways to configure the behavior of this API to meet your needs.

The code snippets in this guide are written in C# by using the Azure AI Face client library. The same functionality is available through the [REST API](/rest/api/face/face-detection-operations/detect).


## Setup

This guide assumes that you already constructed a [FaceClient](/dotnet/api/azure.ai.vision.face.faceclient) object, named `faceClient`, using a Face key and endpoint URL. For instructions on how to set up this feature, follow one of the quickstarts.

## Submit data to the service

To find faces and get their locations in an image, call the [DetectAsync](/dotnet/api/azure.ai.vision.face.faceclient.detectasync). It takes either a URL string or the raw image binary as input.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/Detect.cs" id="basic1":::

The service returns a [FaceDetectionResult](/dotnet/api/azure.ai.vision.face.facedetectionresult) object, which you can query for different kinds of information, specified below.

For information on how to parse the location and dimensions of the face, see [FaceRectangle](/dotnet/api/azure.ai.vision.face.facedetectionresult.facerectangle). Usually, this rectangle contains the eyes, eyebrows, nose, and mouth. The top of head, ears, and chin aren't necessarily included. To use the face rectangle to crop a complete head or get a mid-shot portrait, you should expand the rectangle in each direction.

## Determine how to process the data

This guide focuses on the specifics of the Detect call, such as what arguments you can pass and what you can do with the returned data. We recommend that you query for only the features you need. Each operation takes more time to complete.

### Get face ID

If you set the parameter _returnFaceId_ to `true` (approved customers only), you can get the unique ID for each face, which you can use in later face recognition tasks.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/Detect.cs" id="basic2":::

The optional _faceIdTimeToLive_ parameter specifies how long (in seconds) the face ID should be stored on the server. After this time expires, the face ID is removed. The default value is 86400 (24 hours).

### Get face landmarks

[Face landmarks](../concept-face-detection.md#face-landmarks) are a set of easy-to-find points on a face, such as the pupils or the tip of the nose. To get face landmark data, set the _detectionModel_ parameter to `FaceDetectionModel.Detection03` and the _returnFaceLandmarks_ parameter to `true`.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/Detect.cs" id="landmarks1":::

### Get face attributes

Besides face rectangles and landmarks, the face detection API can analyze several conceptual attributes of a face. For a full list, see the [Face attributes](../concept-face-detection.md#attributes) conceptual section.

To analyze face attributes, set the _detectionModel_ parameter to `FaceDetectionModel.Detection03` and the _returnFaceAttributes_ parameter to a list of [FaceAttributeType Enum](/dotnet/api/azure.ai.vision.face.faceattributetype) values.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/Detect.cs" id="attributes1":::


## Get results from the service

### Face landmark results

The following code demonstrates how you might retrieve the locations of the nose and pupils:

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/Detect.cs" id="landmarks2":::

You also can use face landmark data to accurately calculate the direction of the face. For example, you can define the rotation of the face as a vector from the center of the mouth to the center of the eyes. The following code calculates this vector:

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/Detect.cs" id="direction":::

When you know the direction of the face, you can rotate the rectangular face frame to align it more properly. To crop faces in an image, you can programmatically rotate the image so the faces always appear upright.


### Face attribute results

The following code shows how you might retrieve the face attribute data that you requested in the original call.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/Detect.cs" id="attributes2":::

To learn more about each of the attributes, see the [Face detection and attributes](../concept-face-detection.md) conceptual guide.

## Next steps

In this guide, you learned how to use the various functionalities of face detection and analysis. Next, integrate these features into an app to add face data from users.

- [Tutorial: Add users to a Face service](../enrollment-overview.md)

## Related articles

- [Reference documentation (REST)](/rest/api/face/operation-groups)
- [Reference documentation (.NET SDK)](https://aka.ms/azsdk-csharp-face-ref)
