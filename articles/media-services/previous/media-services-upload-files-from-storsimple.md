---
title: Upload files into an Azure Media Services account from Azure StorSimple | Microsoft Docs
description: This article gives a brief overview of Azure StorSimple Data Manager. The article also links to tutorials that show you how to extract data from StorSimple and upload it as assets to an Azure Media Services account.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.assetid: 1dd09328-262b-43ef-8099-73241b49a925
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/20/2019
ms.author: juliako

---
# Upload files into an Azure Media Services account from Azure StorSimple  

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)
>
> 
> Azure StorSimple Data Manager is currently in private preview. 
> 

## Overview

In Media Services, you upload your digital files into an asset. The Asset  can contain video, audio, images, thumbnail collections, text tracks and closed caption files (and the metadata about these files.) Once the files are uploaded, your content is stored securely in the cloud for further processing and streaming.

[Azure StorSimple](https://docs.microsoft.com/azure/storsimple/) uses cloud storage as an extension of the on-premises solution and automatically tiers data across the on-premises storage and cloud storage. The StorSimple device dedupes and compresses your data before sending it to the cloud making it very efficient for sending large files to the cloud. The [StorSimple Data Manager](../../storsimple/storsimple-data-manager-overview.md) service provides APIs that enable you to extract data from StorSimple and present it as AMS assets.

## Get started

1. [Create a Media Services account](media-services-portal-create-account.md) into which you want to transfer the assets.
2. Sign up for Data Manager preview, as described in the [StorSimple Data Manager](../../storsimple/storsimple-data-manager-overview.md) article.
3. Create a StorSimple Data Manager account.
4. Create a data transformation job that when runs, extracts data from a StorSimple device and transfers it into an AMS account as assets. 

	When the job starts running, a storage queue is created. This queue is populated with messages about transformed blobs as they are ready. The name of this queue is the same as the name of the job definition. You can use this queue to determine when as asset is ready and call your desired Media Services operation to run on it. For example, you can use this queue to trigger an Azure Function that has the necessary Media Services code in it.

## See also

[Use the .NET SDK to trigger jobs in the Data Manager](../../storsimple/storsimple-data-manager-dotnet-jobs.md)

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Next steps

You can now encode your uploaded assets. For more information, see [Encode assets](media-services-portal-encode.md).
