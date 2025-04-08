---
author: baanders
ms.service: azure-digital-twins
description: include for uploading a file for bulk import to Azure Blob Storage
ms.topic: include
ms.date: 03/03/2025
ms.author: baanders
---

Next, the file needs to be uploaded into an append blob in [Azure Blob Storage](../../storage/blobs/storage-blobs-introduction.md). For instructions on how to create an Azure storage container, see [Create a container](../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container). Then, upload the file using your preferred upload method (some options are the [AzCopy command](../../storage/common/storage-use-azcopy-blobs-upload.md), the [Azure CLI](../../storage/blobs/storage-quickstart-blobs-cli.md#upload-a-blob), or the [Azure portal](https://portal.azure.com)).

Once the NDJSON file is uploaded to the container, get its **URL** within the blob container. You use this value later in the body of the bulk import API call.

Here's a screenshot showing the URL value of a blob file in the Azure portal:

:::image type="content" source="../media/includes/blob-file-url.png" alt-text="Screenshot of the Azure portal showing the URL of a file in a storage container." lightbox="../media/includes/blob-file-url.png":::