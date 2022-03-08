---
title: Stream video files with Azure Media Services - .NET 
description: Follow the steps of this tutorial to use .NET to create a new Azure Media Services account, encode a file, and stream it to Azure Media Player.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
keywords: azure media services, stream

ms.service: media-services
ms.workload: media
ms.topic: tutorial
ms.custom: mvc
ms.date: 07/23/2021
ms.author: inhenkel
#Customer intent: As a developer, I want to create a Media Services account so that I can store, encrypt, encode, manage, and stream media content in Azure.
---

# Tutorial: Encode a remote file based on URL and stream the video - .NET

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This tutorial shows you how easy it is to encode and start streaming videos on a wide variety of browsers and devices using Azure Media Services. An input content can be specified using HTTPS URLs, SAS URLs, or paths to files located in Azure Blob storage.
The sample in this topic encodes content that you make accessible via an HTTPS URL. Note that currently, AMS v3 does not support chunked transfer encoding over HTTPS URLs.

By the end of the tutorial you will be able to stream a video.  

![Play the video](./media/stream-files-dotnet-quickstart/final-video.png)

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- Install [Visual Studio Code for Windows/macOS/Linux](https://code.visualstudio.com/) or [Visual Studio 2019 for Windows or Mac](https://visualstudio.microsoft.com/).
- Install [.NET 5.0 SDK](https://dotnet.microsoft.com/download)
- [Create a Media Services account](./account-create-how-to.md). Be sure to copy the **API Access** details in JSON format or store the values needed to connect to the Media Services account in the *.env* file format used in this sample.
- Follow the steps in [Access the Azure Media Services API with the Azure CLI](./access-api-howto.md). Be sure to *save the credentials*. You'll need to use them to access the API in this sample, or enter them into the *.env* file format.

## Download and configure the sample

Clone a GitHub repository that contains the streaming .NET sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts.git
 ```

The sample is located in the [EncodeAndStreamFiles](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/tree/master/AMSV3Quickstarts/EncodeAndStreamFiles) folder under AMSV3Quickstarts.

[!INCLUDE [appsettings or .env file](./includes/note-appsettings-or-env-file.md)]

The sample performs the following actions:

1. Creates a **Transform** (first, checks if the specified Transform exists). 
2. Creates an output **Asset** that is used as the encoding **Job**'s output.
3. Creates the **Job**'s input that is based on an HTTPS URL.
4. Submits the encoding **Job** using the input and output that was created earlier.
5. Checks the Job's status.
6. Creates a **Streaming Locator**.
7. Builds streaming URLs.

For explanations about what each function in the sample does, examine the code and look at the comments in [this source file](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs).

## Run the sample app

When you run the app, URLs that can be used to playback the video using different protocols are displayed. 

1. Open AMSV3Quickstarts in VSCode.
2. Press Ctrl+F5 to run the *EncodeAndStreamFiles* application with .NET. This may take a few minutes.
3. The app will output three URLs. You will use these URLs to test the stream in the next step.

![Screenshot of the output from the EncodeAndStreamFiles app in Visual Studio showing three streaming URLs for use in the Azure Media Player.](./media/stream-files-tutorial-with-api/output.png)

In the sample's [source code](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs), you can see how the URL is built. To build it, you need to concatenate the streaming endpoint's host name and the streaming locator path.  

## Test with Azure Media Player

To test the stream, this article uses Azure Media Player. 

> [!NOTE]
> If a player is hosted on an https site, make sure to update the URL to "https".

1. Open a web browser and navigate to [https://aka.ms/azuremediaplayer/](https://aka.ms/azuremediaplayer/).
2. In the **URL:** box, paste one of the streaming URL values you got when you ran the application. 
 
     You can paste the URL in HLS, Dash, or Smooth format and Azure Media Player will switch to an appropriate streaming protocol for playback on your device automatically.
3. Press **Update Player**. This should start playing the video file in the repository.

Azure Media Player can be used for testing but should not be used in a production environment. 

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this tutorial, delete the resource group.

Execute the following CLI command:

```azurecli
az group delete --name amsResourceGroup
```

## Examine the code

For explanations about what each function in the sample does, examine the code and look at the comments in [this source file](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs).

The [upload, encode, and stream files](stream-files-tutorial-with-api.md) tutorial gives you a more advanced streaming example with detailed explanations. 

### Job error codes

See [Error codes](/rest/api/media/jobs/get#joberrorcode).

## Multithreading

The Azure Media Services v3 SDKs are not thread-safe. When working with multi-threaded application, you should generate a new  AzureMediaServicesClient object per thread.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: upload, encode, and stream files](stream-files-tutorial-with-api.md)
