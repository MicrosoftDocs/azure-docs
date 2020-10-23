---
title: Upload media
titleSuffix: Azure Media Services
description: Learn how to upload media for streaming or encoding.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: how-to
ms.date: 08/31/2020
ms.author: inhenkel
---

# Upload media for streaming or encoding

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

In Media Services, you upload your digital files (media) into a blob container associated with an asset. The [Asset](/rest/api/media/operations/asset) entity can contain video, audio, images, thumbnail collections, text tracks and closed caption files (and the metadata about these files). Once the files are uploaded into the asset's container, your content is stored securely in the cloud for further processing  and streaming.

Before you get started though, you'll need to collect or think about a few values.

1. The local file path to the file you want to upload
1. The asset ID for the asset (container)
1. The name you want to use for the uploaded file including the extension
1. The name of the storage account you are using
1. The access key for your storage account

## [Portal](#tab/portal/)

[!INCLUDE [Upload files with the portal](./includes/task-upload-file-to-asset-portal.md)]

## [CLI](#tab/cli/)

[!INCLUDE [Upload files with the portal](./includes/task-upload-file-to-asset-cli.md)]

## [REST](#tab/rest/)

Once you have [created an asset using Postman or other REST method and gotten the SAS URL for the asset](how-to-create-asset.md?tabs=rest), use the Azure Storage APIs or SDKs (for example, the [Storage REST API](../../storage/common/storage-rest-api-auth.md) or [.NET SDK](../../storage/blobs/storage-quickstart-blobs-dotnet.md).

---
<!-- add these to the tabs when available -->
For other methods see the [Azure Storage documentation](../../storage/blobs/index.yml) for working with blobs in [.NET](../../storage/blobs/storage-quickstart-blobs-dotnet.md), [Java](../../storage/blobs/storage-quickstart-blobs-java.md), [Python](../../storage/blobs/storage-quickstart-blobs-python.md), and [JavaScript (Node.js)](../../storage/blobs/storage-quickstart-blobs-nodejs.md).

## Next steps

> [Media Services overview](media-services-overview.md)