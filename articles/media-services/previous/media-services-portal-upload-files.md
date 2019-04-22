---
title: Upload files to a Media Services account in the Azure portal | Microsoft Docs
description: This tutorial walks you through the steps of uploading files to a Media Services account in the Azure portal.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.assetid: 3ad3dcea-95be-4711-9aae-a455a32434f6
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 04/01/2019
ms.author: juliako

---
# Upload files to a Media Services account in the Azure portal 

> [!div class="op_single_selector"]
> * [Portal](media-services-portal-upload-files.md)
> * [.NET](media-services-dotnet-upload-files.md)
> * [REST](media-services-rest-upload-files.md)
> 

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

In Azure Media Services, you upload your digital files to an asset. The asset can contain video, audio, images, thumbnail collections, text tracks, and closed caption files (and the metadata for these files). After the files are uploaded, your content is stored securely in the cloud for further processing and streaming.

Media Services has a maximum file size for processing files. For details about file size limits, see [Media Services quotas and limitations](media-services-quotas-and-limitations.md).

To complete this tutorial, you need an Azure account. For details, see [Azure free trial](https://azure.microsoft.com/pricing/free-trial/). 

## Upload files
1. In the [Azure portal](https://portal.azure.com/), select your Azure Media Services account.
2. Select **Settings** > **Assets**. Then, select the **Upload** button.
   
    ![Upload files](./media/media-services-portal-vod-get-started/media-services-upload.png)
   
    The **Upload a video asset** window appears.
   
   > [!NOTE]
   > Media Services doesn't limit the file size for uploading videos.
 
3. On your computer, go to the video that you want to upload. Select the video, and then select **OK**.  
   
    The upload begins. You can see the progress under the file name.  

When the upload is finished, the new asset is listed in the **Assets** pane. 

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Next steps
* Learn how to [encode your uploaded assets](media-services-portal-encode.md).

* You also can use Azure Functions to trigger an encoding job when a file arrives in the configured container. For more information, see the sample at [Media Services: Integrating Azure Media Services with Azure Functions and Logic Apps](https://azure.microsoft.com/resources/samples/media-services-dotnet-functions-integration/).


