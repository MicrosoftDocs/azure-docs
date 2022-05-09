---
title: "Call the detect API - Face"
titleSuffix: Azure Cognitive Services
description: This guide demonstrates how to use face detection to extract attributes like age, emotion, or head pose from a given image.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: how-to
ms.date: 08/04/2021
ms.author: pafarley
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Call the detect API

This guide demonstrates how to use the face detection API to extract attributes like age, emotion, or head pose from a given image. You'll learn the different ways to configure the behavior of this API to meet your needs.

The code snippets in this guide are written in C# by using the Azure Cognitive Services Face client library. The same functionality is available through the [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).


## Setup

This guide assumes that you already constructed a [FaceClient](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient) object, named `faceClient`, with a Face subscription key and endpoint URL. For instructions on how to set up this feature, follow one of the quickstarts.

## Submit data to the service

To find faces and get their locations in an image, call the [DetectWithUrlAsync](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperationsextensions.detectwithurlasync) or [DetectWithStreamAsync](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperationsextensions.detectwithstreamasync) method. **DetectWithUrlAsync** takes a URL string as input, and **DetectWithStreamAsync** takes the raw byte stream of an image as input.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="basic1":::

You can query the returned [DetectedFace](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.detectedface) objects for their unique IDs and a rectangle that gives the pixel coordinates of the face. This way, you can tell which face ID maps to which face in the original image.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="basic2":::

For information on how to parse the location and dimensions of the face, see [FaceRectangle](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.facerectangle). Usually, this rectangle contains the eyes, eyebrows, nose, and mouth. The top of head, ears, and chin aren't necessarily included. To use the face rectangle to crop a complete head or get a mid-shot portrait, you should expand the rectangle in each direction.

## Determine how to process the data

This guide focuses on the specifics of the Detect call, such as what arguments you can pass and what you can do with the returned data. We recommend that you query for only the features you need. Each operation takes more time to complete.

### Get face landmarks

[Face landmarks](../concepts/face-detection.md#face-landmarks) are a set of easy-to-find points on a face, such as the pupils or the tip of the nose. To get face landmark data, set the _detectionModel_ parameter to `DetectionModel.Detection01` and the _returnFaceLandmarks_ parameter to `true`.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="landmarks1":::

### Get face attributes

Besides face rectangles and landmarks, the face detection API can analyze several conceptual attributes of a face. For a full list, see the [Face attributes](../concepts/face-detection.md#attributes) conceptual section.

To analyze face attributes, set the _detectionModel_ parameter to `DetectionModel.Detection01` and the _returnFaceAttributes_ parameter to a list of [FaceAttributeType Enum](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.faceattributetype) values.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="attributes1":::


## Get results from the service

### Face landmark results

The following code demonstrates how you might retrieve the locations of the nose and pupils:

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="landmarks2":::

You also can use face landmark data to accurately calculate the direction of the face. For example, you can define the rotation of the face as a vector from the center of the mouth to the center of the eyes. The following code calculates this vector:

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="direction":::

When you know the direction of the face, you can rotate the rectangular face frame to align it more properly. To crop faces in an image, you can programmatically rotate the image so the faces always appear upright.


### Face attribute results

The following code shows how you might retrieve the face attribute data that you requested in the original call.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/sdk/detect.cs" id="attributes2":::

To learn more about each of the attributes, see the [Face detection and attributes](../concepts/face-detection.md) conceptual guide.

## Next steps

In this guide, you learned how to use the various functionalities of face detection and analysis. Next, integrate these features into an app to add face data from users.

- [Tutorial: Add users to a Face service](../enrollment-overview.md)

## Related articles

- [Reference documentation (REST)](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236)
- [Reference documentation (.NET SDK)](/dotnet/api/overview/azure/cognitiveservices/face-readme)

# JS


### Get detected face objects

Create a new method to detect faces. The `DetectFaceExtract` method processes three of the images at the given URL and creates a list of **[DetectedFace](/javascript/api/@azure/cognitiveservices-face/detectedface)** objects in program memory. The list of **[FaceAttributeType](/javascript/api/@azure/cognitiveservices-face/faceattributetype)** values specifies which features to extract. 

The `DetectFaceExtract` method then parses and prints the attribute data for each detected face. Each attribute must be specified separately in the original face detection API call (in the **[FaceAttributeType](/javascript/api/@azure/cognitiveservices-face/faceattributetype)** list). The following code processes every attribute, but you will likely only need to use one or a few.

The "QualityForRecognition" attribute is an indicator of the overall image quality regarding whether the image being used in the detection is of sufficient quality to attempt face recognition on. To leverage the quality attribute, users need to assign the model version by setting the detectionModel parameter to detection_01 or detection_03, recognitionModel parameter to recognition_03 or recognition_04, and include the QualityForRecognition attribute in the request as shown in the example above.    

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="detect":::

The above code processes the following remote images:

![Photo of a woman smiling](../../media/quickstarts/detection-1.jpg)
![Photo of a man, woman, and baby](../../media/quickstarts/detection-5.jpg)
![Photo of an older man and woman](../../media/quickstarts/detection-6.jpg)

> [!TIP]
> You can also detect faces in a local image. See the [Face](/javascript/api/@azure/cognitiveservices-face/face) methods such as [DetectWithStreamAsync](/javascript/api/@azure/cognitiveservices-face/face#detectWithStream_msRest_HttpRequestBody__FaceDetectWithStreamOptionalParams__ServiceCallback_DetectedFace____).


## Python


## Detect and analyze faces

Face detection is required in Face Analysis and Identity Verification. This section shows how to return the extra face attribute data. If you only want to detect faces for face identification or verification, skip to the later sections.


The following code detects a face in a remote image. It prints the detected face's ID to the console and also stores it in program memory. Then, it detects the faces in an image with multiple people and prints their IDs to the console as well. By changing the parameters in the [detect_with_url](/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.operations.faceoperations#detect-with-url-url--return-face-id-true--return-face-landmarks-false--return-face-attributes-none--recognition-model--recognition-01---return-recognition-model-false--detection-model--detection-01---custom-headers-none--raw-false----operation-config-) method, you can return different information with each [DetectedFace](/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.models.detectedface) object.

The "QualityForRecognition" attribute is an indicator of the overall image quality regarding whether the image being used in the detection is of sufficient quality to attempt face recognition on. To leverage the quality attribute, users need to assign the model version by setting the detectionModel parameter to detection_01 or detection_03, recognitionModel parameter to recognition_03 or recognition_04, and include the QualityForRecognition attribute in the request as shown in the example above.    

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_detect)]

> [!TIP]
> You can also detect faces in a local image. See the [FaceOperations](/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.operations.faceoperations) methods such as **detect_with_stream**.

### Display and frame faces

The following code outputs the given image to the display and draws rectangles around the faces, using the DetectedFace.faceRectangle property.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_frame)]

![A young woman with a red rectangle drawn around the face](../../images/face-rectangle-result.png)

## rest tbd

You'll use a command like the following to call the Face API and get face attribute data from an image. First, copy the code into a text editor&mdash;you'll need to make changes to certain parts of the command before you can run it.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="detection_model_3":::

Make the following changes:
1. Assign `Ocp-Apim-Subscription-Key` to your valid Face subscription key.
1. Change the first part of the query URL to match the endpoint that corresponds to your subscription key.
   [!INCLUDE [subdomains-note](../../../../includes/cognitive-services-custom-subdomains-note.md)]
1. Optionally change the URL in the body of the request to point to a different image.

Once you've made your changes, open a command prompt and enter the new command. The code will process the following remote image.

![An older man and woman](../../media/quickstarts/lillian-gish.jpg)

### Examine the results

You should see the face information displayed as JSON data in the console window. For example:

```json
[
  {
    "faceId": "49d55c17-e018-4a42-ba7b-8cbbdfae7c6f",
    "faceRectangle": {
      "top": 131,
      "left": 177,
      "width": 162,
      "height": 162
    }
  }
]  
```

### Get face attributes
 
To extract face attributes, call the Detect API again, but set `detectionModel` to `detection_01`. Add the `returnFaceAttributes` query parameter as well. The command should now look like the following. As before, insert your Face subscription key and endpoint.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="detection_model_1":::

### Examine the results

The returned face information now includes face attributes. For example:

```json
[
  {
    "faceId": "49d55c17-e018-4a42-ba7b-8cbbdfae7c6f",
    "faceRectangle": {
      "top": 131,
      "left": 177,
      "width": 162,
      "height": 162
    },
    "faceAttributes": {
      "smile": 0,
      "headPose": {
        "pitch": 0,
        "roll": 0.1,
        "yaw": -32.9
      },
      "glasses": "NoGlasses",
      "emotion": {
        "anger": 0,
        "contempt": 0,
        "disgust": 0,
        "fear": 0,
        "happiness": 0,
        "neutral": 0.986,
        "sadness": 0.009,
        "surprise": 0.005
      },
      "blur": {
        "blurLevel": "low",
        "value": 0.06
      },
      "exposure": {
        "exposureLevel": "goodExposure",
        "value": 0.67
      },
      "noise": {
        "noiseLevel": "low",
        "value": 0
      },
      "makeup": {
        "eyeMakeup": true,
        "lipMakeup": true
      },
      "accessories": [],
      "occlusion": {
        "foreheadOccluded": false,
        "eyeOccluded": false,
        "mouthOccluded": false
      },
      "hair": {
        "bald": 0,
        "invisible": false,
        "hairColor": [
          {
            "color": "brown",
            "confidence": 1
          },
          {
            "color": "black",
            "confidence": 0.87
          },
          {
            "color": "other",
            "confidence": 0.51
          },
          {
            "color": "blond",
            "confidence": 0.08
          },
          {
            "color": "red",
            "confidence": 0.08
          },
          {
            "color": "gray",
            "confidence": 0.02
          }
        ]
      }
    }
  }
]
```

