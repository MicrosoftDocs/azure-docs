---
title: Create a job input from a local file
description: This article demonstrates how to create an Azure Media Services job input from a local file.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.workload: 
ms.topic: how-to
ms.date: 05/25/2021
ms.author: inhenkel
---

# Create a job input from a local file

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

In Media Services v3, when you submit Jobs to process your videos, you have to tell Media Services where to find the input video. The input video can be stored as a Media Service Asset, in which case you create an input asset based on a file (stored locally or in Azure Blob storage). This topic shows how to create a job input from a local file. For a full example, see this [GitHub sample](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/main/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs).

## Prerequisites

* [Create a Media Services account](./account-create-how-to.md).

## .NET sample

The following code shows how to create an input asset and use it as the input for the job. The CreateInputAsset function performs the following actions:

* Creates the Asset
* Gets a writable [SAS URL](../../storage/common/storage-sas-overview.md) to the Asset’s [container in storage](../../storage/blobs/storage-quickstart-blobs-dotnet.md#upload-blobs-to-a-container)
* Uploads the file into the container in storage using the SAS URL

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#CreateInputAsset)]

The following code snippet creates an output asset if it doesn't already exist:

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#CreateOutputAsset)]

The following code snippet submits an encoding job:

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#SubmitJob)]

## Job error codes

See [Error codes](/rest/api/media/jobs/get#joberrorcode).

## Next steps

[Create a job input from an HTTPS URL](job-input-from-http-how-to.md).
