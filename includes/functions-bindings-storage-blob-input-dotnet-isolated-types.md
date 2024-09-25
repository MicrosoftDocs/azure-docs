---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to process a single blob, the blob input binding can bind to the following types:

| Type | Description |
| --- | --- |
| `string` | The blob content as a string. Use when the blob content is simple text. |
| `byte[]` | The bytes of the blob content. |
| JSON serializable types | When a blob contains JSON data, Functions tries to deserialize the JSON data into a plain-old CLR object (POCO) type. |
| [Stream]<sup>1</sup> | An input stream of the blob content. |
| [BlobClient]<sup>1</sup>,<br/>[BlockBlobClient]<sup>1</sup>,<br/>[PageBlobClient]<sup>1</sup>,<br/>[AppendBlobClient]<sup>1</sup>,<br/>[BlobBaseClient]<sup>1</sup> | A client connected to the blob. This set of types offers the most control for processing the blob and can be used to write back to it if the connection has sufficient permission. |

When you want the function to process multiple blobs from a container, the blob input binding can bind to the following types:

| Type | Description |
| --- | --- |
| `T[]` or `List<T>` where `T` is one of the single blob input binding types | An array or list of multiple blobs. Each entry represents one blob from the container. You can also bind to any interfaces implemented by these types, such as `IEnumerable<T>`. |
| [BlobContainerClient]<sup>1</sup> | A client connected to the container. This type offers the most control for processing the container and can be used to write to it if the connection has sufficient permission.|

<sup>1</sup> To use these types, you need to reference [Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs 6.0.0 or later](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs/6.0.0) and the [common dependencies for SDK type bindings](../articles/azure-functions/dotnet-isolated-process-guide.md#sdk-types).

[Stream]: /dotnet/api/system.io.stream

[BlobClient]: /dotnet/api/azure.storage.blobs.blobclient
[BlockBlobClient]: /dotnet/api/azure.storage.blobs.specialized.blockblobclient
[PageBlobClient]: /dotnet/api/azure.storage.blobs.specialized.pageblobclient
[AppendBlobClient]: /dotnet/api/azure.storage.blobs.specialized.appendblobclient
[BlobBaseClient]: /dotnet/api/azure.storage.blobs.specialized.blobbaseclient
[BlobContainerClient]: /dotnet/api/azure.storage.blobs.blobcontainerclient
