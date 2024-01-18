---
title: "Find similar faces"
titleSuffix: Azure AI services
description: Use the Face service to find similar faces (face search by image).
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.topic: how-to
ms.date: 11/07/2022
ms.author: pafarley
ms.custom: 
---

# Find similar faces

[!INCLUDE [Gate notice](../includes/identity-gate-notice.md)]

The Find Similar operation does face matching between a target face and a set of candidate faces, finding a smaller set of faces that look similar to the target face. This is useful for doing a face search by image.

This guide demonstrates how to use the Find Similar feature in the different language SDKs. The following sample code assumes you have already authenticated a Face client object. For details on how to do this, follow a [quickstart](../quickstarts-sdk/identity-client-library.md).

## Set up sample URL

This guide uses remote images that are accessed by URL. Save a reference to the following URL string. All of the images accessed in this guide are located at this URL path.

```
https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/Face/images/
```

## Detect faces for comparison

You need to detect faces in images before you can compare them. In this guide, the following remote image, called *findsimilar.jpg*, will be used as the source:

![Photo of a man who is smiling.](../media/quickstarts/find-similar.jpg) 

#### [C#](#tab/csharp)

The following face detection method is optimized for comparison operations. It doesn't extract detailed face attributes, and it uses an optimized recognition model.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_face_detect_recognize)]

The following code uses the above method to get face data from a series of images.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_loadfaces)]


#### [JavaScript](#tab/javascript)

The following face detection method is optimized for comparison operations. It doesn't extract detailed face attributes, and it uses an optimized recognition model.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="recognize":::

The following code uses the above method to get face data from a series of images.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="snippet_loadfaces":::


#### [REST API](#tab/rest)

Copy the following cURL command and insert your key and endpoint where appropriate. Then run the command to detect one of the target faces.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="detect_for_similar":::

Find the `"faceId"` value in the JSON response and save it to a temporary location. Then, call the above command again for these other image URLs, and save their face IDs as well. You'll use these IDs as the target group of faces from which to find a similar face.

:::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar_group":::

Finally, detect the single source face that you'll use for matching, and save its ID. Keep this ID separate from the others.

:::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar_matcher":::

---

## Find and print matches

In this guide, the face detected in the *Family1-Dad1.jpg* image should be returned as the face that's similar to the source image face.

![Photo of a man who is smiling; this is the same person as the previous image.](../media/quickstarts/family-1-dad-1.jpg)

#### [C#](#tab/csharp)

The following code calls the Find Similar API on the saved list of faces.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_find_similar)]

The following code prints the match details to the console:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_find_similar_print)]

#### [JavaScript](#tab/javascript)

The following method takes a set of target faces and a single source face. Then, it compares them and finds all the target faces that are similar to the source face. Finally, it prints the match details to the console.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="find_similar":::


#### [REST API](#tab/rest)

Copy the following cURL command and insert your key and endpoint where appropriate.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar":::

Paste in the following JSON content for the `body` value:

:::code language="JSON" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar_body":::

Then, copy over the source face ID value to the `"faceId"` field. Then copy the other face IDs, separated by commas, as terms in the `"faceIds"` array.

Run the command, and the returned JSON should show the correct face ID as a similar match.

---

## Next steps

In this guide, you learned how to call the Find Similar API to do a face search by similarity in a larger group of faces. Next, learn more about the different recognition models available for face comparison operations.

* [Specify a face recognition model](specify-recognition-model.md)
