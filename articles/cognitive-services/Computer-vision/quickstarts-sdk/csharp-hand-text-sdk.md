---
title: "Quickstart: Extract handwritten text - SDK, C#"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you extract text from an image using the Computer Vision Windows C# client library.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: quickstart
ms.date: 07/03/2019
ms.author: pafarley
ms.custom: seodec18
---
# Quickstart: Extract handwritten text using the Computer Vision C# SDK

In this quickstart, you will extract handwritten or printed text from an image using the Computer Vision SDK for C#. If you wish, you can download the code in this guide as a complete sample app from the [Cognitive Services Csharp Vision](https://github.com/Azure-Samples/cognitive-services-vision-csharp-sdk-quickstarts/tree/master/ComputerVision) repo on GitHub.

## Prerequisites

* A Computer Vision subscription key. You can get a free trial key from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=computer-vision). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Computer Vision and get your key.
* Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/).
* The [Microsoft.Azure.CognitiveServices.Vision.ComputerVision](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.ComputerVision) client library NuGet package. It isn't necessary to download the package. Installation instructions are provided below.

## Create and run the sample app

To run the sample, do the following steps:

1. Create a new Visual C# Console App in Visual Studio.
1. Install the Computer Vision client library NuGet package.
    1. On the menu, click **Tools**, select **NuGet Package Manager**, then **Manage NuGet Packages for Solution**.
    1. Click the **Browse** tab, and in the **Search** box type "Microsoft.Azure.CognitiveServices.Vision.ComputerVision".
    1. Select **Microsoft.Azure.CognitiveServices.Vision.ComputerVision** when it displays, then click the checkbox next to your project name, and **Install**.
1. Replace `Program.cs` with the following code. The `BatchReadFileAsync` and `BatchReadFileInStreamAsync` methods wrap the [Batch Read API](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/2afb498089f74080d7ef85eb) for remote and local images, respectively. The `GetReadOperationResultAsync` method wraps the [Get Read Operation Result API](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/5be108e7498a4f9ed20bf96d).

    ```csharp
    using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
    using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;

    using System;
    using System.IO;
    using System.Threading.Tasks;

    namespace ExtractText
    {
        class Program
        {
            // subscriptionKey = "0123456789abcdef0123456789ABCDEF"
            private const string subscriptionKey = "<Subscription key>";

            // localImagePath = @"C:\Documents\LocalImage.jpg"
            private const string localImagePath = @"<LocalImage>";

            private const string remoteImageUrl =
                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Cursive_Writing_on_Notebook_paper.jpg/800px-Cursive_Writing_on_Notebook_paper.jpg";

            private const int numberOfCharsInOperationId = 36;

            static void Main(string[] args)
            {
                ComputerVisionClient computerVision = new ComputerVisionClient(
                    new ApiKeyServiceClientCredentials(subscriptionKey),
                    new System.Net.Http.DelegatingHandler[] { });

                // You must use the same region as you used to get your subscription
                // keys. For example, if you got your subscription keys from westus,
                // replace "westcentralus" with "westus".
                //
                // Free trial subscription keys are generated in the westcentralus
                // region. If you use a free trial subscription key, you shouldn't
                // need to change the region.

                // Specify the Azure region
                computerVision.Endpoint = "https://westcentralus.api.cognitive.microsoft.com";

                Console.WriteLine("Images being analyzed ...");
                var t1 = ExtractRemoteTextAsync(computerVision, remoteImageUrl);
                var t2 = ExtractLocalTextAsync(computerVision, localImagePath);

                Task.WhenAll(t1, t2).Wait(5000);
                Console.WriteLine("Press ENTER to exit");
                Console.ReadLine();
            }

            // Read text from a remote image
            private static async Task ExtractRemoteTextAsync(
                ComputerVisionClient computerVision, string imageUrl)
            {
                if (!Uri.IsWellFormedUriString(imageUrl, UriKind.Absolute))
                {
                    Console.WriteLine(
                        "\nInvalid remoteImageUrl:\n{0} \n", imageUrl);
                    return;
                }

                // Start the async process to read the text
                BatchReadFileHeaders textHeaders =
                    await computerVision.BatchReadFileAsync(
                        imageUrl);

                await GetTextAsync(computerVision, textHeaders.OperationLocation);
            }

            // Recognize text from a local image
            private static async Task ExtractLocalTextAsync(
                ComputerVisionClient computerVision, string imagePath)
            {
                if (!File.Exists(imagePath))
                {
                    Console.WriteLine(
                        "\nUnable to open or read localImagePath:\n{0} \n", imagePath);
                    return;
                }

                using (Stream imageStream = File.OpenRead(imagePath))
                {
                    // Start the async process to recognize the text
                    BatchReadFileInStreamHeaders textHeaders =
                        await computerVision.BatchReadFileInStreamAsync(
                            imageStream);

                    await GetTextAsync(computerVision, textHeaders.OperationLocation);
                }
            }

            // Retrieve the recognized text
            private static async Task GetTextAsync(
                ComputerVisionClient computerVision, string operationLocation)
            {
                // Retrieve the URI where the recognized text will be
                // stored from the Operation-Location header
                string operationId = operationLocation.Substring(
                    operationLocation.Length - numberOfCharsInOperationId);

                Console.WriteLine("\nCalling GetHandwritingRecognitionOperationResultAsync()");
                ReadOperationResult result =
                    await computerVision.GetReadOperationResultAsync(operationId);

                // Wait for the operation to complete
                int i = 0;
                int maxRetries = 10;
                while ((result.Status == TextOperationStatusCodes.Running ||
                        result.Status == TextOperationStatusCodes.NotStarted) && i++ < maxRetries)
                {
                    Console.WriteLine(
                        "Server status: {0}, waiting {1} seconds...", result.Status, i);
                    await Task.Delay(1000);

                    result = await computerVision.GetReadOperationResultAsync(operationId);
                }

                // Display the results
                Console.WriteLine();
                var recResults = result.RecognitionResults;
                foreach (TextRecognitionResult recResult in recResults)
                {
                    foreach (Line line in recResult.Lines)
                    {
                        Console.WriteLine(line.Text);
                    }
                }
                Console.WriteLine();
            }
        }
    }
    ```

1. Replace `<Subscription Key>` with your valid subscription key.
1. Change `computerVision.Endpoint` to the Azure region associated with your subscription keys, if necessary.
1. Replace `<LocalImage>` with the path and file name of a local image.
1. Optionally, set `remoteImageUrl` to a different image.
1. Run the program.

## Examine the response

A successful response prints the lines of recognized text for each image.

```console
Calling GetHandwritingRecognitionOperationResultAsync()

Calling GetHandwritingRecognitionOperationResultAsync()
Server status: Running, waiting 1 seconds...
Server status: Running, waiting 1 seconds...

dog
The quick brown fox jumps over the lazy
Pack my box with five dozen liquor jugs
```

See [Quickstart: Extract handwritten text - REST, C#](../QuickStarts/CSharp-hand-text.md#examine-the-response) for an example of the raw JSON output from the API call.

## Next steps

Explore the Computer Vision APIs used to analyze an image, detect celebrities and landmarks, create a thumbnail, and extract printed and handwritten text.

> [!div class="nextstepaction"]
> [Explore Computer Vision APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44)
