---
title: "Find similar faces"
titleSuffix: Azure Cognitive Services
description: Use the Face service to find similar faces (face search by image).
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: how-to
ms.date: 05/05/2022
ms.author: pafarley
ms.custom: 
---

# Find similar faces

The Find Similar operation does face matching between a target face and a set of candidate faces, finding a smaller set of faces that look similar to the target face. This is useful for doing a face search by image.

This guide demonstrates how to use the Find Similar feature in the different language SDKs. The following sample code assumes you have already authenticated a Face client object. For details on how to do this, follow a [quickstart](../Quickstarts/client-libraries.md).

## Set up sample URL

This guide uses remote images that are accessed by URL. Save a reference to the following URL string. All of the images accessed in this guide are located at this URL path.

```
"https://csdx.blob.core.windows.net/resources/Face/Images/"
```

## Detect faces for comparison

You need to detect faces in images before you can compare them. 

In this guide, the following remote image will be used as the source:

![Photo of a man smiling](../media/quickstarts/find-similar.jpg) 

#### [C#](#tab/csharp)

The following face detection method is optimized for comparison operations. It doesn't extract detailed face attributes, and it uses an optimized recognition model.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_face_detect_recognize)]

The following code uses the above method to load a list of faces into memory.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_loadfaces)]


#### [JavaScript](#tab/javascript)

The following face detection method is optimized for comparison operations. It doesn't extract detailed face attributes, and it uses an optimized recognition model.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="recognize":::

The following code uses the above method to load a list of faces into memory.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="snippet_loadfaces":::


#### [REST API](#tab/rest)

Run the following command to detect a target face and save a reference to it.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="detect_for_similar":::

Find the `"faceId"` value in the JSON response and save it to a temporary location. 

Then, call the above command again for these other image URLs, and save their face IDs as well. You'll use these IDs as the target group of faces from which to find a similar face.

:::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar_group":::

Finally, detect the single source face that you'll use for matching, and save its ID. Keep this ID separate from the others.

:::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar_matcher":::

---

## Find and print matches

In this guide, the face detected in this image should be returned as the face that's similar to the source image face.

![Photo of a man smiling; this is the same person as the previous image](../media/quickstarts/family-1-dad-1.jpg)

The following code calls the Find Similar API and should return a reference to this face as the result.

#### [C#](#tab/csharp)

The following code calls the Find Similar API on the saved list of faces.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_find_similar)]

The following code prints the match details to the console:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_find_similar_print)]

#### [JavaScript](#tab/javascript)

### Find matches

The following method detects faces in a set of target images and in a single source image. Then, it compares them and finds all the target images that are similar to the source image. Finally, it prints the match details to the console.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="find_similar":::


#### [REST API](#tab/rest)

Copy the following command to a text editor.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar":::

Then make the following changes:
1. Assign `Ocp-Apim-Subscription-Key` to your valid Face subscription key.
1. Change the first part of the query URL to match the endpoint that corresponds to your subscription key.

Use the following JSON content for the `body` value:

:::code language="JSON" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar_body":::

1. Use the source face ID for `"faceId"`.
1. Paste the other face IDs as terms in the `"faceIds"` array.

---

## Next steps

In this guide, you learned how to call the Find Similar API to do a face search by similarity in a larger group of faces. Next, learn more about the different recognition models available for face comparison operations.

* [Specify a face recognition model](specify-recognition-model.md)