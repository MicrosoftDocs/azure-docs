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
ms.date: 04/04/2022
ms.author: pafarley
ms.custom: 
---

# Use the Find Similar feature


## Find similar faces

The following code takes a single detected face (source) and searches a set of other faces (target) to find matches (face search by image). When it finds a match, it prints the ID of the matched face to the console.

### Detect faces for comparison

First, define a second face detection method. You need to detect faces in images before you can compare them, and this detection method is optimized for comparison operations. It doesn't extract detailed face attributes like in the section above, and it uses a different recognition model.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_face_detect_recognize)]

### Find matches

The following method detects faces in a set of target images and in a single source image. Then, it compares them and finds all the target images that are similar to the source image.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_find_similar)]

In this program, the following remote image will be used as the source:

![Photo of a man smiling](../../media/quickstarts/find-similar.jpg)

### Print matches

The following code prints the match details to the console:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_find_similar_print)]

In this program, the face detected in this image should be returned as the face that's similar to the source image face.

![Photo of a man smiling; this is the same person as the previous image](../../media/quickstarts/family-1-dad-1.jpg)


## Find similar faces

The following code takes a single detected face (source) and searches a set of other faces (target) to find matches (face search by image). When it finds a match, it prints the ID of the matched face to the console.

### Detect faces for comparison

First, save a reference to the face you detected in the [Detect and analyze](#detect-and-analyze-faces) section. This face will be the source.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_similar_single_ref)]

Then enter the following code to detect a set of faces in a different image. These faces will be the target.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_similar_multiple_ref)]

### Find matches

The following code uses the **[FindSimilar](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#Client.FindSimilar)** method to find all of the target faces that match the source face.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_similar)]

### Print matches

The following code prints the match details to the console.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_similar_print)]


## Find similar faces

The following code takes a single detected face (source) and searches a set of other faces (target) to find matches (face search by image). When it finds a match, it prints the ID of the matched face to the console.

### Detect faces for comparison

First, define a second face detection method. You need to detect faces in images before you can compare them, and this detection method is optimized for comparison operations. It doesn't extract detailed face attributes like in the section above, and it uses a different recognition model.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="recognize":::

### Find matches

The following method detects faces in a set of target images and in a single source image. Then, it compares them and finds all the target images that are similar to the source image. Finally, it prints the match details to the console.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="find_similar":::

In this program, the following remote image will be used as the source:

![Photo of a man smiling](../../media/quickstarts/find-similar.jpg)

The face detected in this image should be returned as the face that's similar to the source image face.

![Photo of a man smiling; this is the same person as the previous image](../../media/quickstarts/family-1-dad-1.jpg)


## Find similar faces

The following code takes a single detected face (source) and searches a set of other faces (target) to find matches (face search by image). When it finds a match, it prints the ID of the matched face to the console.

### Find matches

First, run the code in the above section ([Detect and analyze faces](#detect-and-analyze-faces)) to save a reference to a single face. Then run the following code to get references to several faces in a group image.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_detectgroup)]

Then add the following code block to find instances of the first face in the group. See the [find_similar](/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.operations.faceoperations#find-similar-face-id--face-list-id-none--large-face-list-id-none--face-ids-none--max-num-of-candidates-returned-20--mode--matchperson---custom-headers-none--raw-false----operation-config-) method to learn how to modify this behavior.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_findsimilar)]

### Print matches

Use the following code to print the match details to the console.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_findsimilar_print)]



## Find similar faces

This operation takes a single detected face (source) and searches a set of other faces (target) to find matches (face search by image). When it finds a match, it prints the ID of the matched face to the console.

### Detect faces for comparison

First, you need to detect faces in images before you can compare them. Run this command as you did in the [Detect and analyze](#detect-and-analyze-faces) section. This detection method is optimized for comparison operations. It doesn't extract detailed face attributes like in the section above, and it uses a different detection model.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="detect_for_similar":::

Find the `"faceId"` value in the JSON response and save it to a temporary location. Then, call the above command again for these other image URLs, and save their face IDs as well. You'll use these IDs as the target group of faces from which to find a similar face.

:::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar_group":::

Finally, detect the single source face that you'll use for matching, and save its ID. Keep this ID separate from the others.

:::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar_matcher":::

![Photo of a man smiling](../../media/quickstarts/find-similar.jpg)

### Find matches

Copy the following command to a text editor.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar":::

Then make the following changes:
1. Assign `Ocp-Apim-Subscription-Key` to your valid Face subscription key.
1. Change the first part of the query URL to match the endpoint that corresponds to your subscription key.

Use the following JSON content for the `body` value:

:::code language="JSON" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar_body":::

1. Use the source face ID for `"faceId"`.
1. Paste the other face IDs as terms in the `"faceIds"` array.

### Examine the results

You'll receive a JSON response that lists the IDs of the faces that match your query face. 

```json
[
    {
        "persistedFaceId" : "015839fb-fbd9-4f79-ace9-7675fc2f1dd9",
        "confidence" : 0.82
    },
    ...
] 
```

In this program, the face detected in this image should be returned as the face that's similar to the source image face.

![Photo of a man smiling; this is the same person as the previous image](../../media/quickstarts/family-1-dad-1.jpg)