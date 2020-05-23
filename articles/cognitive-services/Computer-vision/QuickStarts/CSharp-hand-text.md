---
title: "Quickstart: Computer Vision 2.1, and 3.0 - Extract printed and handwritten text - REST, C#"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you extract printed and handwritten text from an image using the Computer Vision API with C#.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: quickstart
ms.date: 05/22/2020
ms.author: pafarley
ms.custom: seodec18
---
# Quickstart: Extract printed and handwritten text using the Computer Vision 3.0 REST API and C#

In this quickstart, you'll extract printed and handwritten text from an image using the Computer Vision REST API. With the [Batch](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/5d986960601faab4bf452005) and [Get Read Result](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/5d9869604be85dee480c8750) methods, you can detect text in an image and extract recognized characters into a machine-readable character stream. 

> [!IMPORTANT]
> The [Read](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/5d986960601faab4bf452005) method runs asynchronously. This method does not return any information in the body of a successful response. Instead, the Batch Read method returns a URI in the value of the `Operation-Location` response header field. You can then call this URI, which represents the [Get Read Result](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/5d9869604be85dee480c8750) API, to both check the status and return the results of the Read method call.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/ai/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=cognitive-services) before you begin.

- You must have [Visual Studio 2015 or later](https://visualstudio.microsoft.com/downloads/).
- You must have a subscription key for Computer Vision. You can get a free trial key from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=computer-vision). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Computer Vision and get your key. 
- [Create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key and service endpoint string, named `COMPUTER_VISION_SUBSCRIPTION_KEY` and `COMPUTER_VISION_ENDPOINT`, respectively.

## Create and run the sample application

To create the sample in Visual Studio:

1. Create a new Visual Studio solution in Visual Studio, using the Visual C# Console App template.
2. Install the Newtonsoft.Json NuGet package.
    1. On the menu, click **Tools**, select **NuGet Package Manager**, then **Manage NuGet Packages for Solution**.
    2. Click the **Browse** tab, and in the **Search** box type "Newtonsoft.Json".
    3. Select **Newtonsoft.Json** when it displays, then click the checkbox next to your project name, and **Install**.
3. Run the program.
4. At the prompt, enter the path to a local image and the language to recognize.

```csharp
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;

namespace CSHttpClientSample
{
    static class Program
    {
        // Add your Computer Vision subscription key and endpoint to your environment variables.
        static string subscriptionKey = Environment.GetEnvironmentVariable("COMPUTER_VISION_SUBSCRIPTION_KEY");

        // An endpoint should have a format like "https://westus.api.cognitive.microsoft.com"
        static string endpoint = Environment.GetEnvironmentVariable("COMPUTER_VISION_ENDPOINT");

        // the Batch Read method endpoint
        static string uriBase = endpoint + "/vision/v3.0-preview//read/analyze";

        // Add a local image with text here (png or jpg is OK)
        static string imageFilePath = @"my-image.png";
        // Add a language, either "en" or "es"
        static string language = "en";


        static void Main(string[] args)
        {
            // Call the REST API method.
            Console.WriteLine("\nExtracting text...\n");
            ReadText(imageFilePath, language).Wait();

            Console.WriteLine("\nPress Enter to exit...");
            Console.ReadLine();
        }

        /// <summary>
        /// Gets the text from the specified image file by using
        /// the Computer Vision REST API.
        /// </summary>
        /// <param name="imageFilePath">The image file with text.</param>
        static async Task ReadText(string imageFilePath, string language)
        {
            try
            {
                HttpClient client = new HttpClient();

                // Request headers.
                client.DefaultRequestHeaders.Add(
                    "Ocp-Apim-Subscription-Key", subscriptionKey);

                var builder = new UriBuilder(uriBase);
                builder.Port = -1;
                var query = HttpUtility.ParseQueryString(builder.Query);
                query["language"] = language;
                builder.Query = query.ToString();
                string url = builder.ToString();

                HttpResponseMessage response;

                // Two REST API methods are required to extract text.
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

                    // The first REST API method, Batch Read, starts
                    // the async process to analyze the written text in the image.
                    response = await client.PostAsync(url, content);
                }

                // The response header for the Batch Read method contains the URI
                // of the second method, Read Operation Result, which
                // returns the results of the process in the response body.
                // The Batch Read operation does not return anything in the response body.
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
                // Note: The response may not be immediately available. Text
                // recognition is an asynchronous operation that can take a variable
                // amount of time depending on the length of the text.
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
                while (i < 60 && contentString.IndexOf("\"status\":\"succeeded\"") == -1);

                if (i == 60 && contentString.IndexOf("\"status\":\"succeeded\"") == -1)
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
  "status": "succeeded",
  "createdDateTime": "2020-02-11T16:44:36Z",
  "lastUpdatedDateTime": "2020-02-11T16:44:36Z",
  "analyzeResult": {
    "version": "3.0.0",
    "readResults": [
      {
        "page": 1,
        "language": "es",
        "angle": -0.8011,
        "width": 401,
        "height": 119,
        "unit": "pixel",
        "lines": [
          {
            "language": "es",
            "boundingBox": [
              15,
              42,
              372,
              38,
              373,
              91,
              15,
              97
            ],
            "text": "¡Buenos días!",
            "words": [
              {
                "boundingBox": [
                  15,
                  43,
                  243,
                  40,
                  244,
                  93,
                  17,
                  98
                ],
                "text": "¡Buenos",
                "confidence": 0.56
              },
              {
                "boundingBox": [
                  254,
                  40,
                  370,
                  38,
                  371,
                  91,
                  255,
                  93
                ],
                "text": "días!",
                "confidence": 0.872
              }
            ]
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

Explore a basic Windows application that uses Computer Vision to perform optical character recognition (OCR). Create smart-cropped thumbnails; plus detect, categorize, tag, and describe visual features, including faces, in an image.

> [!div class="nextstepaction"]
> [Computer Vision API C# Tutorial](../Tutorials/CSharpTutorial.md)
