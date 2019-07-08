---
title: "Quickstart: Analyze an image - SDK, C#"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you analyze an image using the Computer Vision Windows C# client library.
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
# Quickstart: Analyze an image using the Computer Vision SDK and C#

In this quickstart, you will analyze both a local and a remote image to extract visual features using the Computer Vision client library for C#. If you wish, you can download the code in this guide as a complete sample app from the [Cognitive Services Csharp Vision](https://github.com/Azure-Samples/cognitive-services-vision-csharp-sdk-quickstarts/tree/master/ComputerVision) repo on GitHub.

## Prerequisites

* A Computer Vision subscription key. You can get a free trial subscription key from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=computer-vision). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Computer Vision and get your key.
* Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/).
* The [Microsoft.Azure.CognitiveServices.Vision.ComputerVision](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.ComputerVision) client library NuGet package. It isn't necessary to download the package. Installation instructions are provided below.

## Create and run the sample application

To run the sample, do the following steps:

1. Create a new Visual C# Console App in Visual Studio.
1. Install the Computer Vision client library NuGet package.
    1. On the menu, click **Tools**, select **NuGet Package Manager**, then **Manage NuGet Packages for Solution**.
    1. Click the **Browse** tab, and in the **Search** box type "Microsoft.Azure.CognitiveServices.Vision.ComputerVision".
    1. Select **Microsoft.Azure.CognitiveServices.Vision.ComputerVision** when it displays, then click the checkbox next to your project name, and **Install**.
1. Replace the contents of *Program.cs* with the following code. The `AnalyzeImageAsync` and `AnalyzeImageInStreamAsync` methods wrap the [Analyze Image REST API](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa) for remote and local images, respectively.

    ```csharp
    using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
    using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;

    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    namespace ImageAnalyze
    {
        class Program
        {
            // subscriptionKey = "0123456789abcdef0123456789ABCDEF"
            private const string subscriptionKey = "<SubscriptionKey>";

            // localImagePath = @"C:\Documents\LocalImage.jpg"
            private const string localImagePath = @"<LocalImage>";

            private const string remoteImageUrl =
                "https://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg";

            // Specify the features to return
            private static readonly List<VisualFeatureTypes> features =
                new List<VisualFeatureTypes>()
            {
                VisualFeatureTypes.Categories, VisualFeatureTypes.Description,
                VisualFeatureTypes.Faces, VisualFeatureTypes.ImageType,
                VisualFeatureTypes.Tags
            };

            static void Main(string[] args)
            {
                ComputerVisionClient computerVision = new ComputerVisionClient(
                    new ApiKeyServiceClientCredentials(subscriptionKey),
                    new System.Net.Http.DelegatingHandler[] { });

                // You must use the same region as you used to get your subscription
                // keys. For example, if you got your subscription keys from westus,
                // replace "westcentralus" with "westus".
                //
                // Free trial subscription keys are generated in the "westus"
                // region. If you use a free trial subscription key, you shouldn't
                // need to change the region.

                // Specify the Azure region
                computerVision.Endpoint = "https://westcentralus.api.cognitive.microsoft.com";

                Console.WriteLine("Images being analyzed ...");
                var t1 = AnalyzeRemoteAsync(computerVision, remoteImageUrl);
                var t2 = AnalyzeLocalAsync(computerVision, localImagePath);

                Task.WhenAll(t1, t2).Wait(5000);
                Console.WriteLine("Press ENTER to exit");
                Console.ReadLine();
            }

            // Analyze a remote image
            private static async Task AnalyzeRemoteAsync(
                ComputerVisionClient computerVision, string imageUrl)
            {
                if (!Uri.IsWellFormedUriString(imageUrl, UriKind.Absolute))
                {
                    Console.WriteLine(
                        "\nInvalid remoteImageUrl:\n{0} \n", imageUrl);
                    return;
                }

                ImageAnalysis analysis =
                    await computerVision.AnalyzeImageAsync(imageUrl, features);
                DisplayResults(analysis, imageUrl);
            }

            // Analyze a local image
            private static async Task AnalyzeLocalAsync(
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
                    ImageAnalysis analysis = await computerVision.AnalyzeImageInStreamAsync(
                        imageStream, features);
                    DisplayResults(analysis, imagePath);
                }
            }

            // Display the most relevant caption for the image
            private static void DisplayResults(ImageAnalysis analysis, string imageUri)
            {
                Console.WriteLine(imageUri);
                if (analysis.Description.Captions.Count != 0)
                {
                    Console.WriteLine(analysis.Description.Captions[0].Text + "\n");
                }
                else
                {
                    Console.WriteLine("No description generated.");
                }
            }
        }
    }
    ```

1. Replace `<Subscription Key>` with your valid subscription key.
1. Change `computerVision.Endpoint` to the Azure region associated with your subscription keys, if necessary.
1. Replace `<LocalImage>` with the path and file name of a local image.
1. Optionally, set `remoteImageUrl` to a different image URL.
1. Run the program.

## Examine the response

A successful response displays the most relevant caption for each image. You can change the `DisplayResults` method to output different image data. See the [AnalyzeLocalAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.computervision.computervisionclientextensions.analyzeimageinstreamasync?view=azure-dotnet) method to learn more.

See [API Quickstarts: Analyze a local image with C#](../QuickStarts/CSharp-analyze.md#examine-the-response) for an example of a raw JSON output.

```console
https://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg
a large waterfall over a rocky cliff
```

## Next steps

Explore the Computer Vision APIs used to analyze an image, detect celebrities and landmarks, create a thumbnail, and extract printed and handwritten text.

> [!div class="nextstepaction"]
> [Explore Computer Vision APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44)
