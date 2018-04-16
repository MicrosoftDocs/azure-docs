---
title: Stream video files with Azure Media Services - .NET | Microsoft Docs
description: Follow the steps of this quickstart to create a new Azure Media Services account, encode a file, and stream it to Azure Media Player.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''
keywords: azure media services, stream

ms.service: media-services
ms.workload: media
ms.topic: quickstart
ms.custom: mvc
ms.date: 04/08/2018
ms.author: juliako
#Customer intent: As a developer, I want to create a Media Services account so that I can store, encrypt, encode, manage, and stream media content in Azure.
---

# Quickstart: Stream video files - .NET

> [!NOTE]
> The latest version of Azure Media Services is in Preview and may be referred to as v3. To start using v3 APIs, you should create a new Media Services account, as described in this quickstart. 

This quickstart shows you how easy it is to start streaming videos on a wide variety of browsers and devices using Azure Media Services. 

By the end of the quickstart you will be able to stream a video.  

![Play the video](./media/stream-files-dotnet-quickstart/final-video.png)

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

+ An active [GitHub](https://github.com) account. 
+ Visual Studio. The example described in this quickstart uses Visual Studio 2017. 

    If you do not have Visual Studio installed, you can get [Visual Studio Community 2017, Visual Studio Professional 2017, or Visual Studio Enterprise 2017](https://www.visualstudio.com/downloads/).
+ An Azure Media Services account. See the steps described in [Create a Media Services account](create-account-cli-quickstart.md).

## Clone the sample application

First, let's clone the [StreamAndEncodeFiles](https://github.com/azure-samples/media-services-v3-dotnet-quickstarts) app from GitHub. Visual Studio 2017 was used to create the sample.

1. Open a git terminal window, such as git bash, and `CD` to a working directory.  
2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts.git
    ```
3. Open the solution file in Visual Studio. 
4. Right-click the **EncodeAndStreamFiles** project and select **Set as StartUp project**.
5. Build the solution. 

You can open the Program.cs file and examine the code and code comments. If you want to understand more about what the code is doing, please see the [Upload, encode, and stream videos](stream-files-tutorial-with-api.md) tutorial. 

## Configure your app

To run the app and access the Media Services APIs, you need to specify the correct values in App.config. 
    
To get the values, see [Accessing APIs](access-api-cli-how-to.md).

## Run the app and get a streaming URL

When you run the application it prints streaming URLs for DASH, HLS, and Smooth Streaming. Copy the Smooth Streaming URL.

## Test with Azure Media Player

1. Open a web browser and browse to https://ampdemo.azureedge.net/.
2. In the **URL:** box, paste the Streaming URL value you got when you ran the application.  
3. Press **Update Player**.

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services account you created for this Quickstart, delete the resource group. You can use the **CloudShell** tool.

In the **CloudShell**, execute the following command:

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: upload, encode, and stream files](stream-files-tutorial-with-api.md)
