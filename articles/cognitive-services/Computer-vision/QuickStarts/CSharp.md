---
title: Computer Vision API C# quick starts | Microsoft Docs
description: Get information and code samples to help you quickly get started using C# and the Computer Vision API in Cognitive Services.
services: cognitive-services
author: JuliaNik
manager: ytkuo

ms.service: cognitive-services
ms.technology: computer-vision
ms.topic: article
ms.date: 02/20/2017
ms.author: juliakuz
---

# Computer Vision C# Quick Starts
This article provides information and code samples to help you quickly get started using the Computer Vision API with C# to accomplish the following tasks: 
* [Analyze an image](#AnalyzeImage) 
* [Intelligently generate a thumbnail](#GetThumbnail)
* [Detect and extract text from an Image](#OCR)

## Prerequisites
* Get the Microsoft Computer Vision API Windows SDK [here](https://github.com/Microsoft/Cognitive-vision-windows)
* Learn more about obtaining free Subscription Keys [here](../Vision-API-How-to-Topics/HowToSubscribe.md)

## Analyze an Image With Computer Vision API Using C# <a name="AnalyzeImage"> </a>
With the [Analyze Image method](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa) you can extract visual features based on image content. You can upload an image or specify an image URL and choose which features to return, including:
* The category defined in this [taxonomy](https://www.microsoft.com/cognitive-services/en-us/Computer-Vision-API/documentation/Category-Taxonomy). 
* A detailed list of tags related to the image content. 
* A description of image content in a complete sentence. 
* The coordinates, gender, and age of any faces contained in the image.
* The ImageType (clipart or a line drawing).
* The dominant color, the accent color, or whether an image is black & white.
* Whether the image contains pornographic or sexually suggestive content. 

#### Analyze an Image C# Example Request

```c#
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;

namespace CSHttpClientSample
{
    static class Program
    {
        static void Main()
        {
            Console.Write("Enter image file path: ");
            string imageFilePath = Console.ReadLine();

            MakeAnalysisRequest(imageFilePath);

            Console.WriteLine("\n\n\nHit ENTER to exit...");
            Console.ReadLine();
        }

        static byte[] GetImageAsByteArray(string imageFilePath)
        {
            FileStream fileStream = new FileStream(imageFilePath, FileMode.Open, FileAccess.Read);
            BinaryReader binaryReader = new BinaryReader(fileStream);
            return binaryReader.ReadBytes((int)fileStream.Length);
        }

        static async void MakeAnalysisRequest(string imageFilePath)
        {
            var client = new HttpClient();

            // Request headers. Replace the second parameter with a valid subscription key.
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "13hc77781f7e4b19b5fcdd72a8df7156");

            // Request parameters. A third optional parameter is "details".
            string requestParameters = "visualFeatures=Categories&language=en";
            string uri = "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + requestParameters;
            Console.WriteLine(uri);

            HttpResponseMessage response;

            // Request body. Try this sample with a locally stored JPEG image.
            byte[] byteData = GetImageAsByteArray(imageFilePath);

            using (var content = new ByteArrayContent(byteData))
            {
                // This example uses content type "application/octet-stream".
                // The other content types you can use are "application/json" and "multipart/form-data".
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response = await client.PostAsync(uri, content);
            }
        }
    }
}
```
#### Analyze an Image Response
A successful response will be returned in JSON. Following is an example of a successful response: 

```json
{
  "categories": [
    {
      "name": "abstract_",
      "score": 0.00390625
    },
    {
      "name": "people_",
      "score": 0.83984375,
      "detail": {
        "celebrities": [
          {
            "name": "Satya Nadella",
            "faceRectangle": {
              "left": 597,
              "top": 162,
              "width": 248,
              "height": 248
            },
            "confidence": 0.999028444
          }
        ]
      }
    }
  ],
  "adult": {
    "isAdultContent": false,
    "isRacyContent": false,
    "adultScore": 0.0934349000453949,
    "racyScore": 0.068613491952419281
  },
  "tags": [
    {
      "name": "person",
      "confidence": 0.98979085683822632
    },
    {
      "name": "man",
      "confidence": 0.94493889808654785
    },
    {
      "name": "outdoor",
      "confidence": 0.938492476940155
    },
    {
      "name": "window",
      "confidence": 0.89513939619064331
    }
  ],
  "description": {
    "tags": [
      "person",
      "man",
      "outdoor",
      "window",
      "glasses"
    ],
    "captions": [
      {
        "text": "Satya Nadella sitting on a bench",
        "confidence": 0.48293603002174407
      }
    ]
  },
  "requestId": "0dbec5ad-a3d3-4f7e-96b4-dfd57efe967d",
  "metadata": {
    "width": 1500,
    "height": 1000,
    "format": "Jpeg"
  },
  "faces": [
    {
      "age": 44,
      "gender": "Male",
      "faceRectangle": {
        "left": 593,
        "top": 160,
        "width": 250,
        "height": 250
      }
    }
  ],
  "color": {
    "dominantColorForeground": "Brown",
    "dominantColorBackground": "Brown",
    "dominantColors": [
      "Brown",
      "Black"
    ],
    "accentColor": "873B59",
    "isBWImg": false
  },
  "imageType": {
    "clipArtType": 0,
    "lineDrawingType": 0
  }
}

```

## Get a Thumbnail with Computer Vision API Using C# <a name="GetThumbnail"> </a>
Use the [Get Thumbnail method](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fb) to crop an image based on its region of interest (ROI) to the height and width you desire, even if the aspect ratio differs from the input image. 

#### Get a Thumbnail C# Example Request

```c#
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;

namespace CSHttpClientSample
{
    static class Program
    {
        static void Main()
        {
            Console.Write("Enter image file path: ");
            string imageFilePath = Console.ReadLine();

            MakeThumbNailRequest(imageFilePath);

            Console.WriteLine("\n\n\nHit ENTER to exit...");
            Console.ReadLine();
        }

        static byte[] GetImageAsByteArray(string imageFilePath)
        {
            FileStream fileStream = new FileStream(imageFilePath, FileMode.Open, FileAccess.Read);
            BinaryReader binaryReader = new BinaryReader(fileStream);
            return binaryReader.ReadBytes((int)fileStream.Length);
        }

        static async void MakeThumbNailRequest(string imageFilePath)
        {
            var client = new HttpClient();

            // Request headers
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "13hc77781f7e4b19b5fcdd72a8df7156");

            // Request parameters and URI
            string requestParameters = "width=200&height=150&smartCropping=true";
            string uri = "https://westus.api.cognitive.microsoft.com/vision/v1.0/generateThumbnail?" + requestParameters;

            HttpResponseMessage response;

            // Request body. Try this sample with a locally stored JPEG image.
            byte[] byteData = GetImageAsByteArray(imageFilePath);

            using (var content = new ByteArrayContent(byteData))
            {
                // This example uses content type "application/octet-stream".
                // The other content types you can use are "application/json" and "multipart/form-data".
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response = await client.PostAsync(uri, content);
            }
        }
    }
}
```
#### Get a Thumbnail Response
A successful response contains the thumbnail image binary. If the request fails, the response will contain an error code and a message to help determine what went wrong.


## Optical Character Recognition (OCR) with Computer Vision API Using C#<a name="OCR"> </a>
Use the [Optical Character Recognition (OCR) method](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fc) to detect text in an image and extract recognized characters into a machine-usable character stream.

#### OCR C# Example Request
```C#
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;

namespace CSHttpClientSample
{
    static class Program
    {
        static void Main()
        {
            Console.Write("Enter image file path: ");
            string imageFilePath = Console.ReadLine();

            MakeOCRRequest(imageFilePath);

            Console.WriteLine("\n\n\nHit ENTER to exit...");
            Console.ReadLine();
        }

        static byte[] GetImageAsByteArray(string imageFilePath)
        {
            FileStream fileStream = new FileStream(imageFilePath, FileMode.Open, FileAccess.Read);
            BinaryReader binaryReader = new BinaryReader(fileStream);
            return binaryReader.ReadBytes((int)fileStream.Length);
        }

        static async void MakeOCRRequest(string imageFilePath)
        {
            var client = new HttpClient();

            // Request headers
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "13hc77781f7e4b19b5fcdd72a8df7156");

            // Request parameters and URI
            string requestParameters = "language=unk&detectOrientation =true";
            string uri = "https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr?" + requestParameters;

            HttpResponseMessage response;

            // Request body. Try this sample with a locally stored JPEG image.
            byte[] byteData = GetImageAsByteArray(imageFilePath);

            using (var content = new ByteArrayContent(byteData))
            {
                // This example uses content type "application/octet-stream".
                // The other content types you can use are "application/json" and "multipart/form-data".
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response = await client.PostAsync(uri, content);
            }
        }
    }
}
```

#### OCR Example Response
Upon success, the OCR results returned include text, bounding box for regions, lines, and words. 

```json
{
  "language": "en",
  "textAngle": -2.0000000000000338,
  "orientation": "Up",
  "regions": [
    {
      "boundingBox": "462,379,497,258",
      "lines": [
        {
          "boundingBox": "462,379,497,74",
          "words": [
            {
              "boundingBox": "462,379,41,73",
              "text": "A"
            },
            {
              "boundingBox": "523,379,153,73",
              "text": "GOAL"
            },
            {
              "boundingBox": "694,379,265,74",
              "text": "WITHOUT"
            }
          ]
        },
        {
          "boundingBox": "565,471,289,74",
          "words": [
            {
              "boundingBox": "565,471,41,73",
              "text": "A"
            },
            {
              "boundingBox": "626,471,150,73",
              "text": "PLAN"
            },
            {
              "boundingBox": "801,472,53,73",
              "text": "IS"
            }
          ]
        },
        {
          "boundingBox": "519,563,375,74",
          "words": [
            {
              "boundingBox": "519,563,149,74",
              "text": "JUST"
            },
            {
              "boundingBox": "683,564,41,72",
              "text": "A"
            },
            {
              "boundingBox": "741,564,153,73",
              "text": "WISH"
            }
          ]
        }
      ]
    }
  ]
}

```