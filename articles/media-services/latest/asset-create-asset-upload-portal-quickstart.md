---
title: Use portal to upload, encode, and stream content
description: This quickstart shows you how to use portal to upload, encode, and stream content with Azure Media Services.
ms.topic: quickstart
ms.date: 01/14/2022
author: IngridAtMicrosoft
ms.author: inhenkel
manager: femila
ms.custom: mode-ui
---
# Quickstart: Upload, encode, and stream content with portal

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This quickstart shows you how to use the Azure portal to upload, encode, and stream content with Azure Media Services.
  
## Overview

* To start managing, encrypting, encoding, analyzing, and streaming media content in Azure, you need to [create a Media Services account](account-create-how-to.md). 
    
    > [!NOTE]
    > If you previously uploaded a video into the Media Services account using Media Services v3 API or the content was generated based on a live output, you will not see the **Encode**, **Analyze**, or **Encrypt** buttons in the Azure portal. Use the Media Services v3 APIs to perform these tasks.

    Review the following: 
    * [Assets concept](assets-concept.md)
    * [Cloud upload and storage](storage-account-concept.md)
    * [Naming conventions for resource names](media-services-apis-overview.md#naming-conventions)
   
* Once you upload your high-quality digital media file into an asset (an input asset), you can process it (encode or analyze). The processed content goes into another asset (output asset).
    * [Encode](encode-concept.md) your uploaded file into formats that can be played on a wide variety of browsers and devices.
    * [Analyze](analyze-video-audio-files-concept.md) your uploaded file. 

    Presently, when using the Azure portal, you can perform the operations such as generating TTML and WebVTT closed caption files. Files in these formats can be used to make the audio and video files accessible to people with hearing or visual disability. You can also extract keywords from your content.

    For a rich experience that enables you to extract insights from your audio and video files, use Media Services v3 presets. For more information, see [Tutorial: Analyze videos with Media Services v3](analyze-videos-tutorial.md). If you require detailed insights, use [Video Analyzer for Media](../../azure-video-analyzer/video-analyzer-for-media-docs/index.yml) directly.

* After the content gets processed, you can deliver media content to the client players. To make the videos in the output asset available to the clients for playback, you have to create a [streaming locator](stream-streaming-locators-concept.md). When creating a streaming locator, you need to specify a [streaming policy](stream-streaming-policy-concept.md). Streaming policies enable you to define streaming protocols and encryption options (if any) for your streaming locators. For information on packaging and filtering content, see [Packaging and delivery](encode-dynamic-packaging-concept.md) and [Filters](filters-concept.md).

* You can protect your content by encrypting it with Advanced Encryption Standard (AES-128) or/and any of the three major DRM systems like Microsoft PlayReady, Google Widevine, and Apple FairPlay. For information on how to configure the content protection, see [Quickstart: Use portal to encrypt content](drm-encrypt-content-how-to.md).
        
## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

Follow the steps to [Create a Media Services account](account-create-how-to.md).

## Upload a new video

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Locate and select your Media Services account.
1. In the left navigation pane, select **Assets** under **Media Services**.
1. Select **Upload** at the top of the window. 
1. Choose a **Storage account** from the pull-down menu. 
1. Browse the file that you want to upload. An **Asset name** gets created for your media. If necessary, you can edit this **Asset name**.

    > [!TIP]
    > If you want to choose multiple files, add them to one folder in Windows File Explorer. When browsing to **Upload files**, select all the files. This creates multiple assets. 
 
1. Select the desired option at the bottom of the **Upload new assets** window. 
1. Navigate to your **Assets** resource window. After a successful upload, a new asset gets added to the list.
    
## Add transform

1. Under the **Media Services** services, select **Transforms + jobs**.
1. Select **Add transform**.
1. In the **Add a transform** window, enter the details. 
1. If your media is a video, select **Encoding** as your **Transform type**. Select a **Built-in preset name** from the pull-down menu. For more information, see [EncoderNamedPreset](/rest/api/media/transforms/create-or-update#encodernamedpreset).
1. Select **Add**.

## Encode (Add job)

1. Select either **Assets** or **Transforms + jobs**. 
1. Select **Add job** at the top of the resource window.
1. In **Create a job** window, enter the details. Select **Create**.
1. Navigate to **Transforms + jobs**. Select the **Transform name** to check the job status. A job goes through multiple states like **Scheduled** , **Queued**, **Processing**, and **Final**. If the job encounters an error, you get the **Error** state.
1. Navigate to your **Assets** resource window. After the job gets created successfully, it generates an output asset that contains the encoded content.
    
## Publish and stream

To publish an asset, you need to add a streaming locator to your asset and run the streaming endpoint.

### Add streaming locator 

1. Under Media Services, select **Assets**. 
1. Select the output asset.
1. Select **New streaming locator**.
1. In **Add streaming locator** window, enter the details. Select a predefined **Streaming policy**. For more information, see [streaming policies](stream-streaming-policy-concept.md).
1. If you want your stream to be encrypted, [Create a content key policy](drm-encrypt-content-how-to.md#create-a-content-key-policy) and select it in the **Add streaming locator** window.
1. Select **Add**. This action publishes the asset and generates the streaming URLs.

### Start streaming endpoint
1. Once the asset gets published, you can stream it right in the portal. You can also copy the streaming URL and use it in your client player. Make sure the [streaming endpoint](stream-streaming-endpoint-concept.md) is running. When you first create a Media Services account, a default streaming endpoint gets created and remains in a stopped state. **Start** the streaming endpoint to stream your content. You're only billed when your streaming endpoint is in the running state.
1. Select the output asset. 
1. Select **Start streaming endpoint?**. Select **Start** to run the streaming endpoint. The status of **default** streaming endpoint changes from **Stopped** to **Running**. Your billing will start now. You can now use the streaming URLs to deliver content.
1. Select **Reload player**. 

### Stop streaming endpoint

1. Navigate to **Media Services** and select **Streaming endpoints**. 
1. Select your streaming endpoint **Name**. In this quickstart, we are using the **default** streaming endpoint. The current state is **Running**.
1. Select **Stop**. A **Stop streaming endpoint?** window gets opened. Select **Yes**. Now, the **default** streaming endpoint is in a **Stopped** state. You cannot use the streaming URLs to deliver the content.

## Cleanup resources

If you intend to try the other quickstarts, you should hold on to the resources created for this quickstart. Otherwise, sign in to the Azure portal, browse to your resource group, select the resource group under which you followed this quickstart, and delete all the resources.
