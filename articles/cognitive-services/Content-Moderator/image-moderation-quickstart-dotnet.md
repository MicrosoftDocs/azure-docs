---
title: "Quickstart: Analyze images for objectionable content in C# - Content Moderator"
titlesuffix: Azure Cognitive Services
description: How to analyze image content for various objectionable materials using the Content Moderator SDK for .NET
services: cognitive-services
author: sanjeev3
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: quickstart
ms.date: 07/03/2019
ms.author: sajagtap

#As a C# developer of content management software, I want to analyze images for offensive or inappropriate material so that I can categorize and handle it accordingly.
---

# Quickstart: Analyze images for objectionable content in C#

This article provides information and code samples to help you get started using the [Content Moderator SDK for .NET](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.ContentModerator/). You'll learn how to scan for adult or racy content, extractable text, and human faces with the aim of moderating potentially objectionable material.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Prerequisites

- A Content Moderator subscription key. Follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Content Moderator and get your key.
- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/)


> [!NOTE]
> This guide uses a free-tier Content Moderator subscription. For information on what is provided with each subscription tier, see the [Pricing and limits](https://azure.microsoft.com/pricing/details/cognitive-services/content-moderator/) page.

## Create the Visual Studio project

1. In Visual Studio, create a new **Console app (.NET Framework)** project and name it **ImageModeration**. 
1. If there are other projects in your solution, select this one as the single startup project.
1. Get the required NuGet packages. Right-click on your project in the Solution Explorer and select **Manage NuGet Packages**; then find and install the following packages:
    - Microsoft.Azure.CognitiveServices.ContentModerator
    - Microsoft.Rest.ClientRuntime
    - Newtonsoft.Json

## Add image moderation code

Next, you'll copy and paste the code from this guide into your project to implement a basic content moderation scenario.

### Include namespaces

Add the following `using` statements to the top of your *Program.cs* file.

[!code-csharp[](~/cognitive-services-content-moderator-samples/documentation-samples/csharp/image-moderation-quickstart-dotnet.cs?range=1-8)]

### Create the Content Moderator client

Add the following code to your *Program.cs* file to create a Content Moderator client provider for your subscription. Add the code alongside the **Program** class, in the same namespace. You'll need to update the **AzureRegion** and **CMSubscriptionKey** fields with the values of your region identifier and subscription key.

[!code-csharp[](~/cognitive-services-content-moderator-samples/documentation-samples/csharp/image-moderation-quickstart-dotnet.cs?range=84-107)]


### Set up input and output targets

Add the following static fields to the **Program** class in _Program.cs_. These fields specify the files for input image content and output JSON content.

[!code-csharp[](~/cognitive-services-content-moderator-samples/documentation-samples/csharp/image-moderation-quickstart-dotnet.cs?range=49-53)]

You will need to create the *_ImageFiles.txt* input file and update its path accordingly (relative paths are relative to the execution directory). Open _ImageFiles.txt_ and add the URLs of images to moderate. This quickstart uses the following URLs as its sample input.

```
https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg
https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png
```

### Create a class to handle results

Add the following code to *Program.cs*, alongside the **Program** class in the same namespace. You will use an instance of this class to record the moderation results for each of the reviewed images.

[!code-csharp[](~/cognitive-services-content-moderator-samples/documentation-samples/csharp/image-moderation-quickstart-dotnet.cs?range=109-124)]


### Define the image evaluation method

Add the following method to the **Program** class. This method evaluates a single image in three different ways and returns the evaluation results. If you want to learn more about what the individual operations do, follow the link in the [Next steps](#next-steps) section.

[!code-csharp[](~/cognitive-services-content-moderator-samples/documentation-samples/csharp/image-moderation-quickstart-dotnet.cs?range=55-81)]

### Load the input images

Add the following code to the **Main** method in the **Program** class. This code sets up the program to retrieve evaluation data for each image URL in the input file. It then writes this data to a single output file.

[!code-csharp[](~/cognitive-services-content-moderator-samples/documentation-samples/csharp/image-moderation-quickstart-dotnet.cs?range=17-46)]

## Run the program

The program will write JSON string data to the _ModerationOutput.json_ file. The sample images used in this quickstart give the following output. Each image has different sections for `ImageModeration`, `FaceDetection`, and `TextDetection`, which correspond to the three API calls in your **EvaluateImage** method.

```json
[{
  "ImageUrl": "https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg",
  "ImageModeration": {
    "cacheID": "7733c303-3b95-4710-a41e-7a322ae81a15_636488005858745661",
    "result": false,
    "trackingId": "WE_e1f20803b4ed471fb5de7df551f5bd9f_ContentModerator.Preview_687c356d-0f00-4aeb-ae5f-c7555af80247",
    "adultClassificationScore": 0.019196987152099609,
    "isImageAdultClassified": false,
    "racyClassificationScore": 0.032390203326940536,
    "isImageRacyClassified": false,
    "advancedInfo": [
      {
        "key": "ImageDownloadTimeInMs",
        "value": "116"
      },
      {
        "key": "ImageSizeInBytes",
        "value": "273405"
      }
    ],
    "status": {
      "code": 3000.0,
      "description": "OK",
      "exception": null
    }
  },
  "TextDetection": {
    "status": {
      "code": 3000.0,
      "description": "OK",
      "exception": null
    },
    "metadata": [
      {
        "key": "ImageDownloadTimeInMs",
        "value": "12"
      },
      {
        "key": "ImageSizeInBytes",
        "value": "273405"
      }
    ],
    "trackingId": "WE_e1f20803b4ed471fb5de7df551f5bd9f_ContentModerator.Preview_814fa162-c5d6-4ca6-997b-30ed0686ca83",
    "cacheId": "3fb69496-c64b-4de9-affd-6dd6d23f3e78_636488005876558920",
    "language": "eng",
    "text": "IF WE DID \r\nALL \r\nTHE THINGS \r\nWE ARE \r\nCAPABLE \r\nOF DOING, \r\nWE WOULD \r\nLITERALLY \r\nASTOUND \r\nOURSELVE \r\n",
    "candidates": []
  },
  "FaceDetection": {
    "status": {
      "code": 3000.0,
      "description": "OK",
      "exception": null
    },
    "trackingId": "WE_e1f20803b4ed471fb5de7df551f5bd9f_ContentModerator.Preview_a2c40dbe-609d-4eb8-b01c-9988388804ea",
    "cacheId": "e4c0b500-ea8e-4a31-8fb3-35f98c4fbd65_636488005889528303",
    "result": false,
    "count": 0,
    "advancedInfo": [
      {
        "key": "ImageDownloadTimeInMs",
        "value": "11"
      },
      {
        "key": "ImageSizeInBytes",
        "value": "273405"
      }
    ],
    "faces": []
  }
},
{
  "ImageUrl": "https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png",
  "ImageModeration": {
    "cacheID": "b4866aa2-5e69-44ed-806a-f9a5d618c8ae_636488005930693926",
    "result": false,
    "trackingId": "WE_e1f20803b4ed471fb5de7df551f5bd9f_ContentModerator.Preview_fdce5510-f689-4791-b081-c2ad54dcfe78",
    "adultClassificationScore": 0.0035635426174849272,
    "isImageAdultClassified": false,
    "racyClassificationScore": 0.021369094029068947,
    "isImageRacyClassified": false,
    "advancedInfo": [
      {
        "key": "ImageDownloadTimeInMs",
        "value": "109"
      },
      {
        "key": "ImageSizeInBytes",
        "value": "2278902"
      }
    ],
    "status": {
      "code": 3000.0,
      "description": "OK",
      "exception": null
    }
  },
  "TextDetection": {
    "status": {
      "code": 3000.0,
      "description": "OK",
      "exception": null
    },
    "metadata": [
      {
        "key": "ImageDownloadTimeInMs",
        "value": "46"
      },
      {
        "key": "ImageSizeInBytes",
        "value": "2278902"
      }
    ],
    "trackingId": "WE_e1f20803b4ed471fb5de7df551f5bd9f_ContentModerator.Preview_08a4bc19-6010-41bb-a440-a77278e167d8",
    "cacheId": "28b37471-41b3-4f79-bd23-965498bcff51_636488005950851288",
    "language": "eng",
    "text": "",
    "candidates": []
  },
  "FaceDetection": {
    "status": {
      "code": 3000.0,
      "description": "OK",
      "exception": null
    },
    "trackingId": "WE_e1f20803b4ed471fb5de7df551f5bd9f_ContentModerator.Preview_40f2ce07-14ba-47cd-ba09-58b557a89854",
    "cacheId": "ec9c1be3-99b7-4bd9-8bc4-dc958c74459f_636488005964914299",
    "result": true,
    "count": 6,
    "advancedInfo": [
      {
        "key": "ImageDownloadTimeInMs",
        "value": "60"
      },
      {
        "key": "ImageSizeInBytes",
        "value": "2278902"
      }
    ],
    "faces": [
      {
        "bottom": 598,
        "left": 44,
        "right": 268,
        "top": 374
      },
      {
        "bottom": 620,
        "left": 308,
        "right": 532,
        "top": 396
      },
      {
        "bottom": 575,
        "left": 594,
        "right": 773,
        "top": 396
      },
      {
        "bottom": 563,
        "left": 812,
        "right": 955,
        "top": 420
      },
      {
        "bottom": 611,
        "left": 972,
        "right": 1151,
        "top": 432
      },
      {
        "bottom": 510,
        "left": 1232,
        "right": 1456,
        "top": 286
      }
    ]
  }
}]
```

## Next steps

In this quickstart, you've developed a simple .NET application that uses the Content Moderator service to return relevant information about a given image sample. Next, learn more about what the different flags and classifications mean so you can decide which data you need and how your app should handle it.

> [!div class="nextstepaction"]
> [Image moderation guide](image-moderation-api.md)
