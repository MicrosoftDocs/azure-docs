---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to write to a single blob, the blob output binding can bind to the following types:

| Type | Description |
| --- | --- |
| `string` | The blob content as a string. Use when the blob content is simple text. |
| `byte[]` | The bytes of the blob content. |
| JSON serializable types | An object representing the content of a JSON blob. Functions attempts to serialize a plain-old CLR object (POCO) type into JSON data. |

When you want the function to write to multiple blobs, the blob output binding can bind to the following types:

| Type | Description |
| --- | --- |
| `T[]` where `T` is one of the single blob output binding types | An array containing content for multiple blobs. Each entry represents the content of one blob. | 

For other output scenarios, create and use a [BlobClient] or [BlobContainerClient] with other types from [Azure.Storage.Blobs] directly. See [Register Azure clients](../articles/azure-functions/dotnet-isolated-process-guide.md#register-azure-clients) for an example of using dependency injection to create a client type from the Azure SDK.

[Azure.Storage.Blobs]: /dotnet/api/azure.storage.blobs
[BlobClient]: /dotnet/api/azure.storage.blobs.blobclient
[BlobContainerClient]: /dotnet/api/azure.storage.blobs.blobcontainerclient
