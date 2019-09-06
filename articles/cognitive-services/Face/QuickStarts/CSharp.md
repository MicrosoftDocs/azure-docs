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
ms.date: 07/03/2019
ms.author: pafarley
#Customer intent: As a C# developer, I want to implement a simple Face detection scenario with REST calls, so that I can build more complex scenarios later on.
---

# Quickstart: Detect faces in an image using the Face REST API and C#

In this quickstart, you will use the Azure Face REST API with C# to detect human faces in an image.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Prerequisites

- A Face API subscription key. You can get a free trial subscription key from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=face-api). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to the Face API service and get your key.
- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/).

## Create the Visual Studio project

1. In Visual Studio, create a new **Console app (.NET Framework)** project and name it **FaceDetection**. 
1. If there are other projects in your solution, select this one as the single startup project.

## Add face detection code

Open the new project's *Program.cs* file. Here, you will add the code needed to load images and detect faces.

### Include namespaces

Add the following `using` statements to the top of your *Program.cs* file.

```csharp
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
```

### Add essential fields

Add the **Program** class containing the following fields. This data specifies how to connect to the Face service and where to get the input data. You'll need to update the `subscriptionKey` field with the value of your subscription key, and you may need to change the `uriBase` string so that it contains the correct region identifier (see the [Face API docs](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) for a list of all region endpoints).


```csharp
namespace DetectFace
{
    class Program
    {

        // Replace <Subscription Key> with your valid subscription key.
        const string subscriptionKey = "<Subscription Key>";

        // NOTE: You must use the same region in your REST call as you used to
        // obtain your subscription keys. For example, if you obtained your
        // subscription keys from westus, replace "westcentralus" in the URL
        // below with "westus".
        //
        // Free trial subscription keys are generated in the "westus" region.
        // If you use a free trial subscription key, you shouldn't need to change
        // this region.
        const string uriBase =
            "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";
```

### Receive image input

Add the following code to the **Main** method of the **Program** class. This code writes a prompt to the console asking the user to enter an image URL. Then it calls another method, **MakeAnalysisRequest**, to process the image at that location.

```csharp
        static void Main(string[] args)
        {

            // Get the path and filename to process from the user.
            Console.WriteLine("Detect faces:");
            Console.Write(
                "Enter the path to an image with faces that you wish to analyze: ");
            string imageFilePath = Console.ReadLine();

            if (File.Exists(imageFilePath))
            {
                try
                {
                    MakeAnalysisRequest(imageFilePath);
                    Console.WriteLine("\nWait a moment for the results to appear.\n");
                }
                catch (Exception e)
                {
                    Console.WriteLine("\n" + e.Message + "\nPress Enter to exit...\n");
                }
            }
            else
            {
                Console.WriteLine("\nInvalid file path.\nPress Enter to exit...\n");
            }
            Console.ReadLine();
        }
```

### Call the face detection REST API

Add the following method to the **Program** class. It constructs a REST call to the Face API to detect face information in the remote image (the `requestParameters` string specifies which face attributes to retrieve). Then it writes the output data to a JSON string.

You will define the helper methods in the following steps.

```csharp
        // Gets the analysis of the specified image by using the Face REST API.
        static async void MakeAnalysisRequest(string imageFilePath)
        {
            HttpClient client = new HttpClient();

            // Request headers.
            client.DefaultRequestHeaders.Add(
                "Ocp-Apim-Subscription-Key", subscriptionKey);

            // Request parameters. A third optional parameter is "details".
            string requestParameters = "returnFaceId=true&returnFaceLandmarks=false" +
                "&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses," +
                "emotion,hair,makeup,occlusion,accessories,blur,exposure,noise";

            // Assemble the URI for the REST API Call.
            string uri = uriBase + "?" + requestParameters;

            HttpResponseMessage response;

            // Request body. Posts a locally stored JPEG image.
            byte[] byteData = GetImageAsByteArray(imageFilePath);

            using (ByteArrayContent content = new ByteArrayContent(byteData))
            {
                // This example uses content type "application/octet-stream".
                // The other content types you can use are "application/json"
                // and "multipart/form-data".
                content.Headers.ContentType =
                    new MediaTypeHeaderValue("application/octet-stream");

                // Execute the REST API call.
                response = await client.PostAsync(uri, content);

                // Get the JSON response.
                string contentString = await response.Content.ReadAsStringAsync();

                // Display the JSON response.
                Console.WriteLine("\nResponse:\n");
                Console.WriteLine(JsonPrettyPrint(contentString));
                Console.WriteLine("\nPress Enter to exit...");
            }
        }
```

### Process the input image data

Add the following method to the **Program** class. This method converts the image at the specified URL into a byte array.

```csharp
        // Returns the contents of the specified file as a byte array.
        static byte[] GetImageAsByteArray(string imageFilePath)
        {
            using (FileStream fileStream =
                new FileStream(imageFilePath, FileMode.Open, FileAccess.Read))
            {
                BinaryReader binaryReader = new BinaryReader(fileStream);
                return binaryReader.ReadBytes((int)fileStream.Length);
            }
        }
```

### Parse the JSON response

Add the following method to the **Program** class. This method formats the JSON input to be more easily readable. Your app will write this string data to the console. You can then close the class and namespace.

```csharp
        // Formats the given JSON string by adding line breaks and indents.
        static string JsonPrettyPrint(string json)
        {
            if (string.IsNullOrEmpty(json))
                return string.Empty;

            json = json.Replace(Environment.NewLine, "").Replace("\t", "");

            StringBuilder sb = new StringBuilder();
            bool quote = false;
            bool ignore = false;
            int offset = 0;
            int indentLength = 3;

            foreach (char ch in json)
            {
                switch (ch)
                {
                    case '"':
                        if (!ignore) quote = !quote;
                        break;
                    case '\'':
                        if (quote) ignore = !ignore;
                        break;
                }

                if (quote)
                    sb.Append(ch);
                else
                {
                    switch (ch)
                    {
                        case '{':
                        case '[':
                            sb.Append(ch);
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', ++offset * indentLength));
                            break;
                        case '}':
                        case ']':
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', --offset * indentLength));
                            sb.Append(ch);
                            break;
                        case ',':
                            sb.Append(ch);
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', offset * indentLength));
                            break;
                        case ':':
                            sb.Append(ch);
                            sb.Append(' ');
                            break;
                        default:
                            if (ch != ' ') sb.Append(ch);
                            break;
                    }
                }
            }

            return sb.ToString().Trim();
        }
    }
}
```

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

In this quickstart, you created a simple .NET console application that uses REST calls with the Azure Face API to detect faces in an image and return their attributes. Next, explore the Face API reference documentation to learn more about the supported scenarios.

> [!div class="nextstepaction"]
> [Face API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236)
