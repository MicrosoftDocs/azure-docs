---
title: Stream video files with Azure Media Services - .NET | Microsoft Docs
description: Follow the steps of this quickstart to create a new Azure Media Services account, encode a file, and stream it to Azure Media Player.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''
keywords: azure media services, stream

ms.service: media-services
ms.workload: media
ms.topic: quickstart
ms.custom: mvc
ms.date: 09/25/2018
ms.author: juliako
#Customer intent: As a developer, I want to create a Media Services account so that I can store, encrypt, encode, manage, and stream media content in Azure.
---

# Quickstart: Stream video files - .NET

> [!NOTE]
> The latest version of Azure Media Services is in Preview and may be referred to as v3. To start using v3 APIs, you should create a new Media Services account, as described in this quickstart. 

This quickstart shows you how easy it is to encode and start streaming videos on a wide variety of browsers and devices using Azure Media Services. An input content can be specified using HTTPS URLs, SAS URLs, or paths to files located in Azure Blob storage.
The sample in this topic encodes content that you make accessible via an HTTPS URL. Note that currently, AMS v3 does not support chunked transfer encoding over HTTPS URLs.

By the end of the quickstart you will be able to stream a video.  

![Play the video](./media/stream-files-dotnet-quickstart/final-video.png)

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

If you do not have Visual Studio installed, you can get [Visual Studio Community 2017](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=15).

## Download the sample

Clone a GitHub repository that contains the streaming .NET sample to your machine using the following command:  

 ```bash
 git clone http://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts.git
 ```

The sample is located in the [EncodeAndStreamFiles](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/tree/master/AMSV3Quickstarts/EncodeAndStreamFiles) folder.

The sample performs the following actions:

1. Creates a Transform (first, checks if the specified Transform exists). 
2. Creates an output Asset that is used as the encoding Job's output.
3. Creates the Job's input that is based on an HTTPS URL.
4. Submits the encoding Job using the input and output that was created earlier.
5. Checks the Job's status.
6. Creates a StreamingLocator.
7. Builds streaming URLs.

For explanations about what each function in the sample does, examine the code and look at the comments in [this source file](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs).

## Log in to Azure

Log in to the [Azure portal](http://portal.azure.com).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [media-services-cli-create-v3-account-include](../../../includes/media-services-cli-create-v3-account-include.md)]

[!INCLUDE [media-services-v3-cli-access-api-include](../../../includes/media-services-v3-cli-access-api-include.md)]

## Run the sample app

When you run the app, URLs that can be used to playback the video using different protocols are displayed. 

1. Press Ctrl+F5 to run the *EncodeAndStreamFiles* application.
2. Choose the Apple's **HLS** protocol (ends with *manifest(format=m3u8-aapl)*) and copy the streaming URL from the console.

![Output](./media/stream-files-tutorial-with-api/output.png)

In the sample's [source code](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs), you can see how the URL is built. To build it, you need to concatenate the streaming endpoint's host name and the streaming locator path.  

## Test with Azure Media Player

To test the stream, this article uses Azure Media Player. 

> [!NOTE]
> If a player is hosted on an https site, make sure to update the URL to "https".

1. Open a web browser and navigate to [https://aka.ms/azuremediaplayer/](https://aka.ms/azuremediaplayer/).
2. In the **URL:** box, paste one of the streaming URL values you got when you ran the application. 
3. Press **Update Player**.

Azure Media Player can be used for testing but should not be used in a production environment. 

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this Quickstart, delete the resource group. You can use the **CloudShell** tool.

In the **CloudShell**, execute the following command:

```azurecli-interactive
az group delete --name amsResourceGroup
```

## Examine the code

For explanations about what each function in the sample does, examine the code and look at the comments in [this source file](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs).

The [upload, encode, and stream files](stream-files-tutorial-with-api.md) tutorial gives you a more advanced streaming example with detailed explanations. 

## Multithreading

The Azure Media Services v3 SDKs are not thread-safe. When working with multi-threaded application, you should generate a new  AzureMediaServicesClient object per thread.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: upload, encode, and stream files](stream-files-tutorial-with-api.md)
