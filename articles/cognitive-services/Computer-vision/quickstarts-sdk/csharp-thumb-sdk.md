---
title: "Quickstart: Generate a thumbnail - SDK, C#"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you generate a thumbnail from an image using the Computer Vision Windows C# client library.
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
# Quickstart: Generate a thumbnail using the Computer Vision SDK and C#

In this quickstart, you will generate a smart-cropped thumbnail from an image using the Computer Vision SDK for C#. If you wish, you can download the code in this guide as a complete sample app from the [Cognitive Services Csharp Vision](https://github.com/Azure-Samples/cognitive-services-vision-csharp-sdk-quickstarts/tree/master/ComputerVision) repo on GitHub.

## Prerequisites

* A Computer Vision subscription key. You can get a free trial key from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=computer-vision). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Computer Vision and get your key.
* Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/).
* The [Microsoft.Azure.CognitiveServices.Vision.ComputerVision](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.ComputerVision) client library NuGet package. It isn't necessary to download the package. Installation instructions are provided below.

## GenerateThumbnailAsync method

 You can use these methods to generate a thumbnail of an image. You specify the height and width, which can differ from the aspect ratio of the input image. Computer Vision uses smart cropping to intelligently identify the area of interest and generate cropping coordinates based on that region.

To run the sample, do the following steps:

1. Create a new Visual C# Console App in Visual Studio.
1. Install the Computer Vision client library NuGet package.
    1. On the menu, click **Tools**, select **NuGet Package Manager**, then **Manage NuGet Packages for Solution**.
    1. Click the **Browse** tab, and in the **Search** box type "Microsoft.Azure.CognitiveServices.Vision.ComputerVision".
    1. Select **Microsoft.Azure.CognitiveServices.Vision.ComputerVision** when it displays, then click the checkbox next to your project name, and **Install**.
1. Replace `Program.cs` with the following code. The `GenerateThumbnailAsync` and `GenerateThumbnailInStreamAsync` methods wrap the [Get Thumbnail API](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fb) for remote and local images, respectively. 

    ```csharp
    using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;

    using System;
    using System.IO;
    using System.Threading.Tasks;

    namespace ImageThumbnail
    {
        class Program
        {
            private const bool writeThumbnailToDisk = false;

            // subscriptionKey = "0123456789abcdef0123456789ABCDEF"
            private const string subscriptionKey = "<SubscriptionKey>";

            // localImagePath = @"C:\Documents\LocalImage.jpg"
            private const string localImagePath = @"<LocalImage>";

            private const string remoteImageUrl =
                "https://upload.wikimedia.org/wikipedia/commons/9/94/Bloodhound_Puppy.jpg";

            private const int thumbnailWidth = 100;
            private const int thumbnailHeight = 100;

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

                Console.WriteLine("Images being analyzed ...\n");
                var t1 = GetRemoteThumbnailAsync(computerVision, remoteImageUrl);
                var t2 = GetLocalThumbnailAsnc(computerVision, localImagePath);

                Task.WhenAll(t1, t2).Wait(5000);
                Console.WriteLine("Press ENTER to exit");
                Console.ReadLine();
            }

            // Create a thumbnail from a remote image
            private static async Task GetRemoteThumbnailAsync(
                ComputerVisionClient computerVision, string imageUrl)
            {
                if (!Uri.IsWellFormedUriString(imageUrl, UriKind.Absolute))
                {
                    Console.WriteLine(
                        "\nInvalid remoteImageUrl:\n{0} \n", imageUrl);
                    return;
                }

                Stream thumbnail = await computerVision.GenerateThumbnailAsync(
                    thumbnailWidth, thumbnailHeight, imageUrl, true);

                string path = Environment.CurrentDirectory;
                string imageName = imageUrl.Substring(imageUrl.LastIndexOf('/') + 1);
                string thumbnailFilePath =
                    path + "\\" + imageName.Insert(imageName.Length - 4, "_thumb");

                // Save the thumbnail to the current working directory,
                // using the original name with the suffix "_thumb".
                SaveThumbnail(thumbnail, thumbnailFilePath);
            }

            // Create a thumbnail from a local image
            private static async Task GetLocalThumbnailAsnc(
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
                    Stream thumbnail = await computerVision.GenerateThumbnailInStreamAsync(
                        thumbnailWidth, thumbnailHeight, imageStream, true);

                    string thumbnailFilePath =
                        localImagePath.Insert(localImagePath.Length - 4, "_thumb");

                    // Save the thumbnail to the same folder as the original image,
                    // using the original name with the suffix "_thumb".
                    SaveThumbnail(thumbnail, thumbnailFilePath);
                }
            }

            // Save the thumbnail locally.
            // NOTE: This will overwrite an existing file of the same name.
            private static void SaveThumbnail(Stream thumbnail, string thumbnailFilePath)
            {
                if (writeThumbnailToDisk)
                {
                    using (Stream file = File.Create(thumbnailFilePath))
                    {
                        thumbnail.CopyTo(file);
                    }
                }
                Console.WriteLine("Thumbnail {0} written to: {1}\n",
                    writeThumbnailToDisk ? "" : "NOT", thumbnailFilePath);
            }
        }
    }
    ```

1. Replace `<Subscription Key>` with your valid subscription key.
1. Change `computerVision.Endpoint` to the Azure region associated with your subscription keys, if necessary.
1. Optionally, replace `<LocalImage>` with the path and file name of a local image (will be ignored if not set).
1. Optionally, set `remoteImageUrl` to a different image.
1. Optionally, set `writeThumbnailToDisk` to `true` to save the thumbnail to disk.
1. Run the program.


## Examine the response

A successful response saves the thumbnail for each image locally and displays the thumbnail's location, for example:

```console
Thumbnail written to: C:\Documents\LocalImage_thumb.jpg

Thumbnail written to: ...\bin\Debug\Bloodhound_Puppy_thumb.jpg
```

## Next steps

Explore the Computer Vision APIs used to analyze an image, detect celebrities and landmarks, create a thumbnail, and extract printed and handwritten text.

> [!div class="nextstepaction"]
> [Explore Computer Vision APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44)
