---
title: "Quickstart: Detect faces in an image with the Azure REST API and C#"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you will use the Azure Face REST API with C# to detect faces in an image.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: quickstart
ms.date: 08/05/2020
ms.author: pafarley
#Customer intent: As a C# developer, I want to implement a simple Face detection scenario with REST calls, so that I can build more complex scenarios later on.
---

# Quickstart: Detect faces in an image using the Face REST API and C#

In this quickstart, you'll use the Azure Face REST API with C# to detect human faces in an image.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Face API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
- Any edition of [Visual Studio](https://www.visualstudio.com/downloads/).

## Create the Visual Studio project

1. In Visual Studio, create a new **Console app (.NET Framework)** project and name it **FaceDetection**.
1. If there are other projects in your solution, select this one as the single startup project.

## Add face detection code

Open the new project's *Program.cs* file. Here, you will add the code needed to load images and detect faces.

### Include namespaces

Add the following `using` statements to the top of your *Program.cs* file.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/rest/detect.cs" id="dependencies":::

### Add essential fields

Add the **Program** class containing the following fields. This data specifies how to connect to the Face service and where to get the input data. You'll need to update the `subscriptionKey` field with the value of your subscription key, and you may need to change the `uriBase` string so that it contains your resource endpoint string.

[!INCLUDE [subdomains-note](../../../../includes/cognitive-services-custom-subdomains-note.md)]

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/rest/detect.cs" id="environment":::

### Receive image input

Add the following code to the **Main** method of the **Program** class. This code writes a prompt to the console asking the user to enter their local image file path. Then it calls another method, **MakeAnalysisRequest**, to process the image at that location.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/rest/detect.cs" id="main":::

### Call the face detection REST API

Add the following method to the **Program** class. It constructs a REST call to the Face API to detect face information in the remote image (the `requestParameters` string specifies which face attributes to retrieve). Then it writes the output data to a JSON string.

You will define the helper methods in the following steps.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/rest/detect.cs" id="request":::

### Process the input image data

Add the following method to the **Program** class. This method converts the image at the specified file path into a byte array.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/rest/detect.cs" id="getimage":::

### Parse the JSON response

Add the following method to the **Program** class. This method formats the JSON input to be more easily readable. Your app will write this string data to the console. You can then close the class and namespace.

:::code language="csharp" source="~/cognitive-services-quickstart-code/dotnet/Face/rest/detect.cs" id="print":::

## Run the app

A successful response will display Face data in easily readable JSON format. For example:

```json
[
   {
      "faceId": "f7eda569-4603-44b4-8add-cd73c6dec644",
      "faceRectangle": {
         "top": 131,
         "left": 177,
         "width": 162,
         "height": 162
      }
   }
]
```

## Extract Face Attributes
 
To extract face attributes, use detection model 1 and add the `returnFaceAttributes` query parameter.

```csharp
string requestParameters = "detectionModel=detection_01&returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise";
```

The response now includes face attributes. For example:

```json
[
   {
      "faceId": "f7eda569-4603-44b4-8add-cd73c6dec644",
      "faceRectangle": {
         "top": 131,
         "left": 177,
         "width": 162,
         "height": 162
      },
      "faceAttributes": {
         "smile": 0.0,
         "headPose": {
            "pitch": 0.0,
            "roll": 0.1,
            "yaw": -32.9
         },
         "gender": "female",
         "age": 22.9,
         "facialHair": {
            "moustache": 0.0,
            "beard": 0.0,
            "sideburns": 0.0
         },
         "glasses": "NoGlasses",
         "emotion": {
            "anger": 0.0,
            "contempt": 0.0,
            "disgust": 0.0,
            "fear": 0.0,
            "happiness": 0.0,
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
            "value": 0.0
         },
         "makeup": {
            "eyeMakeup": true,
            "lipMakeup": true
         },
         "accessories": [

         ],
         "occlusion": {
            "foreheadOccluded": false,
            "eyeOccluded": false,
            "mouthOccluded": false
         },
         "hair": {
            "bald": 0.0,
            "invisible": false,
            "hairColor": [
               {
                  "color": "brown",
                  "confidence": 1.0
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

## Next steps

In this quickstart, you created a simple .NET console application that uses REST calls with the Azure Face service to detect faces in an image and return their attributes. Next, explore the Face API reference documentation to learn more about the supported scenarios.

> [!div class="nextstepaction"]
> [Face API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236)
