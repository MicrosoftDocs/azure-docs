---
author: deepganguly
ms.author: deepganguly
ms.service: azure-container-apps
ms.topic: include
ms.date: 03/11/2026
---

Identify any instances where your services read from or write to the local file system. Note which files are short-term or temporary and which files are long-lived.

Azure Container Apps offers several types of storage. By using ephemeral storage, you can read and write temporary data within a running container or replica. By using Azure Files, you can provide permanent storage that multiple containers can share. For more information, see [Use storage mounts in Azure Container Apps](../storage-mounts.md).

If your application serves **read-only static content**, consider moving it to Azure Blob Storage and adding Azure CDN for global distribution. For more information, see [Static website hosting in Azure Storage](/azure/storage/blobs/storage-blob-static-website) and [Quickstart: Integrate an Azure storage account with Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn).

If your application handles **dynamically published static content** (uploaded or generated content that doesn't change after creation), you can integrate Azure Blob Storage and Azure CDN. You can also use an Azure Function to manage uploads and trigger CDN refreshes. For a sample implementation, see [Uploading and CDN-preloading static content with Azure Functions](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).
