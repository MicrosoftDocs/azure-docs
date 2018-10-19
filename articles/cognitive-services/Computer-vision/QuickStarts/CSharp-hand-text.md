---
title: "Quickstart: Extract handwritten text - REST, C# - Computer Vision"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you extract handwritten text from an image using the Computer Vision API with C#.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: quickstart
ms.date: 09/10/2018
ms.author: pafarley
---
# Quickstart: Extract handwritten text using the REST API and C&#35; in Computer Vision

In this quickstart, you extract handwritten text from an image by using Computer Vision's REST API. With the [Recognize Text](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/587f2c6a154055056008f200) and the [Get Recognize Text Operation Result](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/587f2cf1154055056008f201) methods, you can detect handwritten text in an image, then extract recognized characters into a machine-usable character stream.

> [!IMPORTANT]
> Unlike the [OCR](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fc) method, the [Recognize Text](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/587f2c6a154055056008f200) method runs asynchronously. This method does not return any information in the body of a successful response. Instead, the Recognize Text method returns a URI in the value of the `Operation-Content` response header field. You can then call this URI, which represents the [Get Recognize Text Operation Result](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/587f2cf1154055056008f201) method, to both check the status and return the results of the Recognize Text method call.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/ai/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=cognitive-services) before you begin.

## Prerequisites

- You must have [Visual Studio 2015](https://visualstudio.microsoft.com/downloads/) or later.
- You must have a subscription key for Computer Vision. To get a subscription key, see [Obtaining Subscription Keys](../Vision-API-How-to-Topics/HowToSubscribe.md).

## Create and run the sample application

To create the sample in Visual Studio, do the following steps:

1. Create a new Visual Studio solution in Visual Studio, using the Visual C# Console App template.
1. Install the Newtonsoft.Json NuGet package.
    1. On the menu, click **Tools**, select **NuGet Package Manager**, then **Manage NuGet Packages for Solution**.
    1. Click the **Browse** tab, and in the **Search** box type "Newtonsoft.Json".
    1. Select **Newtonsoft.Json** when it displays, then click the checkbox next to your project name, and **Install**.
1. Replace the code in `Program.cs` with the following code, and then make the following changes in code where needed:
    1. Replace the value of `subscriptionKey` with your subscription key.
    1. Replace the value of `uriBase` with the endpoint URL for the [Recognize Text](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/587f2c6a154055056008f200) method from the Azure region where you obtained your subscription keys, if necessary.
1. Run the program.
1. At the prompt, enter the path to a local image.

```csharp
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace CSHttpClientSample
{
    static class Program
    {
        // Replace <Subscription Key> with your valid subscription key.
        const string subscriptionKey = "<Subscription Key>";

        // You must use the same Azure region in your REST API method as you used to
        // get your subscription keys. For example, if you got your subscription keys
        // from the West US region, replace "westcentralus" in the URL
        // below with "westus".
        //
        // Free trial subscription keys are generated in the West Central US region.
        // If you use a free trial subscription key, you shouldn't need to change
        // this region.
        const string uriBase =
            "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/recognizeText";

        static void Main()
        {
            // Get the path and filename to process from the user.
            Console.WriteLine("Handwriting Recognition:");
            Console.Write(
                "Enter the path to an image with handwritten text you wish to read: ");
            string imageFilePath = Console.ReadLine();

            if (File.Exists(imageFilePath))
            {
                // Call the REST API method.
                Console.WriteLine("\nWait a moment for the results to appear.\n");
                ReadHandwrittenText(imageFilePath).Wait();
            }
            else
            {
                Console.WriteLine("\nInvalid file path");
            }
            Console.WriteLine("\nPress Enter to exit...");
            Console.ReadLine();
        }

        /// <summary>
        /// Gets the handwritten text from the specified image file by using
        /// the Computer Vision REST API.
        /// </summary>
        /// <param name="imageFilePath">The image file with handwritten text.</param>
        static async Task ReadHandwrittenText(string imageFilePath)
        {
            try
            {
                HttpClient client = new HttpClient();

                // Request headers.
                client.DefaultRequestHeaders.Add(
                    "Ocp-Apim-Subscription-Key", subscriptionKey);

                // Request parameter.
                string requestParameters = "mode=Handwritten";

                // Assemble the URI for the REST API method.
                string uri = uriBase + "?" + requestParameters;

                HttpResponseMessage response;

                // Two REST API methods are required to extract handwritten text.
                // One method to submit the image for processing, the other method
                // to retrieve the text found in the image.

                // operationLocation stores the URI of the second REST API method,
                // returned by the first REST API method.
                string operationLocation;

                // Reads the contents of the specified local image
                // into a byte array.
                byte[] byteData = GetImageAsByteArray(imageFilePath);

                // Adds the byte array as an octet stream to the request body.
                using (ByteArrayContent content = new ByteArrayContent(byteData))
                {
                    // This example uses the "application/octet-stream" content type.
                    // The other content types you can use are "application/json"
                    // and "multipart/form-data".
                    content.Headers.ContentType =
                        new MediaTypeHeaderValue("application/octet-stream");

                    // The first REST API method, Recognize Text, starts
                    // the async process to analyze the written text in the image.
                    response = await client.PostAsync(uri, content);
                }

                // The response header for the Recognize Text method contains the URI
                // of the second method, Get Recognize Text Operation Result, which
                // returns the results of the process in the response body.
                // The Recognize Text operation does not return anything in the response body.
                if (response.IsSuccessStatusCode)
                    operationLocation =
                        response.Headers.GetValues("Operation-Location").FirstOrDefault();
                else
                {
                    // Display the JSON error data.
                    string errorString = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("\n\nResponse:\n{0}\n",
                        JToken.Parse(errorString).ToString());
                    return;
                }

                // If the first REST API method completes successfully, the second 
                // REST API method retrieves the text written in the image.
                //
                // Note: The response may not be immediately available. Handwriting
                // recognition is an asynchronous operation that can take a variable
                // amount of time depending on the length of the handwritten text.
                // You may need to wait or retry this operation.
                //
                // This example checks once per second for ten seconds.
                string contentString;
                int i = 0;
                do
                {
                    System.Threading.Thread.Sleep(1000);
                    response = await client.GetAsync(operationLocation);
                    contentString = await response.Content.ReadAsStringAsync();
                    ++i;
                }
                while (i < 10 && contentString.IndexOf("\"status\":\"Succeeded\"") == -1);

                if (i == 10 && contentString.IndexOf("\"status\":\"Succeeded\"") == -1)
                {
                    Console.WriteLine("\nTimeout error.\n");
                    return;
                }

                // Display the JSON response.
                Console.WriteLine("\nResponse:\n\n{0}\n",
                    JToken.Parse(contentString).ToString());
            }
            catch (Exception e)
            {
                Console.WriteLine("\n" + e.Message);
            }
        }

        /// <summary>
        /// Returns the contents of the specified file as a byte array.
        /// </summary>
        /// <param name="imageFilePath">The image file to read.</param>
        /// <returns>The byte array of the image data.</returns>
        static byte[] GetImageAsByteArray(string imageFilePath)
        {
            // Open a read-only file stream for the specified file.
            using (FileStream fileStream =
                new FileStream(imageFilePath, FileMode.Open, FileAccess.Read))
            {
                // Read the file's contents into a byte array.
                BinaryReader binaryReader = new BinaryReader(fileStream);
                return binaryReader.ReadBytes((int)fileStream.Length);
            }
        }
    }
}
```

## Examine the response

A successful response is returned in JSON. The sample application parses and displays a successful response in the console window, similar to the following example:

```json
{
    "status": "Succeeded",
    "recognitionResult": {
        "lines": [
            {
                "boundingBox": [
                    99,
                    195,
                    1309,
                    45,
                    1340,
                    292,
                    130,
                    442
                ],
                "text": "when you write them down",
                "words": [
                    {
                        "boundingBox": [
                            152,
                            191,
                            383,
                            154,
                            341,
                            421,
                            110,
                            458
                        ],
                        "text": "when"
                    },
                    {
                        "boundingBox": [
                            436,
                            145,
                            607,
                            118,
                            565,
                            385,
                            394,
                            412
                        ],
                        "text": "you"
                    },
                    {
                       "boundingBox": [
                            644,
                            112,
                            873,
                            76,
                            831,
                            343,
                            602,
                            379
                        ],
                        "text": "write"
                    },
                    {
                        "boundingBox": [
                            895,
                            72,
                            1092,
                            41,
                            1050,
                            308,
                            853,
                            339
                        ],
                        "text": "them"
                    },
                    {
                        "boundingBox": [
                            1140,
                            33,
                            1400,
                            0,
                            1359,
                            258,
                            1098,
                            300
                        ],
                        "text": "down"
                    }
                ]
            },
            {
                "boundingBox": [
                    142,
                    222,
                    1252,
                    62,
                    1269,
                    180,
                    159,
                    340
                ],
                "text": "You remember things better",
                "words": [
                    {
                        "boundingBox": [
                            140,
                            223,
                            267,
                            205,
                            288,
                            324,
                            162,
                            342
                        ],
                        "text": "You"
                    },
                    {
                        "boundingBox": [
                            314,
                            198,
                            740,
                            137,
                            761,
                            256,
                            335,
                            317
                        ],
                        "text": "remember"
                    },
                    {
                        "boundingBox": [
                            761,
                            134,
                            1026,
                            95,
                            1047,
                            215,
                            782,
                            253
                        ],
                        "text": "things"
                    },
                    {
                        "boundingBox": [
                            1046,
                            92,
                            1285,
                            58,
                            1307,
                            177,
                            1068,
                            212
                        ],
                        "text": "better"
                    }
                ]
            },
            {
                "boundingBox": [
                    155,
                    405,
                    537,
                    338,
                    557,
                    449,
                    175,
                    516
                ],
                "text": "by hand",
                "words": [
                    {
                        "boundingBox": [
                            146,
                            408,
                            266,
                            387,
                            301,
                            495,
                            181,
                            516
                        ],
                        "text": "by"
                    },
                    {
                        "boundingBox": [
                            290,
                            383,
                            569,
                            334,
                            604,
                            443,
                            325,
                            491
                        ],
                        "text": "hand"
                    }
                ]
            }
        ]
    }
}
```

## Clean up resources

When no longer needed, delete the Visual Studio solution. To do so, open File Explorer, navigate to the folder in which you created the Visual Studio solution, and delete the folder.

## Next steps

Explore a basic Windows application that uses Computer Vision to perform optical character recognition (OCR); create smart-cropped thumbnails; plus detect, categorize, tag, and describe visual features, including faces, in an image. To rapidly experiment with the Computer Vision APIs, try the [Open API testing console](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa/console).

> [!div class="nextstepaction"]
> [Computer Vision API C&#35; Tutorial](../Tutorials/CSharpTutorial.md)
