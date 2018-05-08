---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Assets in Azure Media Services | Microsoft Docs
description: This article gives an explanation of what assets are, and how they are used by Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 03/19/2018
ms.author: juliako
---

# Assets

An **Asset** contains digital files (including video, audio, images, thumbnail collections, text tracks and closed caption files) and the metadata about these files. After the digital files are uploaded into an asset, they could be used in the Media Services encoding and streaming workflows.

An asset is mapped to a blob container in the [Azure Storage account](storage-account-concept.md) and the files in the asset are stored as block blobs in that container. You can interact with the Asset files in the containers using the Storage SDK clients.

Azure Media Services supports Blob tiers when the account uses General-purpose v2 (GPv2) storage. With GPv2, you can move files to cool or cold storage. Cold storage is suitable for archiving mezzanine files when no longer needed (for example, after they have been encoded.)

In Media Services v3, the job input can be created from assets or from HTTP(s) URLs. To create an asset that can be used as an input for your job, see [Create a job input from a local file](job-input-from-local-file-how-to.md).

Also, read about [storage accounts in Media Services](storage-account-concept.md) and [transforms and jobs](transform-concept.md).

## Next steps

> [!div class="nextstepaction"]
> [Stream a file](stream-files-dotnet-quickstart.md)
