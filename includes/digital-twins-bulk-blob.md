---
author: baanders
ms.service: digital-twins
description: include for uploading a file for bulk import to Azure Blob Storage
ms.topic: include
ms.date: 01/26/2023
ms.author: baanders
---

Next, the file needs to be uploaded into an append blob in [Azure Blob Storage](../articles/storage/blobs/storage-blobs-introduction.md). For instructions on how to create an Azure storage container, see [Create a container](../articles/storage/blobs/storage-quickstart-blobs-portal.md#create-a-container). Then, upload the file using your preferred upload method (some options are the [AzCopy command](../articles/storage/common/storage-use-azcopy-blobs-upload.md), the [Azure CLI](../articles/storage/blobs/storage-quickstart-blobs-cli.md#upload-a-blob), or the [Azure portal](https://portal.azure.com)).

Once the NDJSON file has been uploaded to the container, get its **URL** within the blob container. You'll use this value later in the body of the bulk import API call.

Here's a screenshot showing the URL value of a blob file in the Azure portal:

:::image type="content" source="../articles/digital-twins/media/includes/blob-file-url.png" alt-text="Screenshot of the Azure portal showing the URL of a file in a storage container." lightbox="../articles/digital-twins/media/includes/blob-file-url.png":::