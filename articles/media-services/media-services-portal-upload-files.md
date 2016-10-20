<properties
	pageTitle=" Upload files into a Media Services account using the Azure portal | Microsoft Azure"
	description="This tutorial walks you through the steps of uploading files into a Media Services account using the Azure portal"
	services="media-services"
	documentationCenter=""
	authors="Juliako"
	manager="erikre"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="10/14/2016"
	ms.author="juliako"/>


# Upload files into a Media Services account using the Azure portal 

> [AZURE.SELECTOR]
- [Portal](media-services-portal-upload-files.md)
- [.NET](media-services-dotnet-upload-files.md)
- [REST](media-services-rest-upload-files.md)

> [AZURE.NOTE] To complete this tutorial, you need an Azure account. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/). 

In Media Services, you upload your digital files into an asset. The Asset  can contain video, audio, images, thumbnail collections, text tracks and closed caption files (and the metadata about these files.) Once the files are uploaded, your content is stored securely in the cloud for further processing and streaming.
 
1. In the [Azure portal](https://portal.azure.com/), select your Azure Media Services account.

2. On the **Settings** blade, click **Assets**.

	![Upload files](./media/media-services-portal-vod-get-started/media-services-upload.png)

3. Click the **Upload** button.

	The **Upload a video asset** window appears.

	>[AZURE.NOTE] There is no file size limitation.
	
4. Browse to the desired video on your computer, select it, and hit OK.  

	The upload starts and you can see the progress under the file name.  

Once the upload completes, you will see the new asset listed in the **Assets** window. 


## Next steps

You can now encode your uploaded assets. For more information, see [Encode assets](media-services-portal-encode.md).

## Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]


