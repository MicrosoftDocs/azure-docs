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
| [Stream] | _(Preview<sup>1</sup>)_<br/>An input stream of the blob content. |
| [BlobClient],<br/>[BlockBlobClient],<br/>[PageBlobClient],<br/>[AppendBlobClient],<br/>[BlobBaseClient] | _(Preview<sup>1</sup>)_<br/>A client connected to the blob. This offers the most control for processing the blob and can be used to write back to it if the connection has sufficient permission. |

When you want the function to process multiple blobs from a container, the blob input binding can bind to the following types:

| Type | Description |
| --- | --- |
| `T[]` or `List<T>` where `T` is one of the single blob input binding types | An array or list of multiple blobs. Each entry represents one blob from the container. You can also bind to any interfaces implemented by these types, such as `IEnumerable<T>`. |
| [BlobContainerClient] | _(Preview<sup>1</sup>)_<br/>A client connected to the container. This offers the most control for processing the container and can be used to write to it if the connection has sufficient permission.<br/><br/>The `BlobPath` configuration for an input binding to [BlobContainerClient] currently requires the presence of a blob name. It is not sufficient to provide just the container name. A placeholder value may be used and will not change the behavior. For example, setting `[BlobInput("samples-workitems/placeholder.txt")] BlobContainerClient containerClient` does not consider whether any `placeholder.txt` exists or not, and the client will work with the overall "samples-workitems" container.|

<sup>1</sup> To use these types, you need to reference [Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs 5.1.1-preview2 or later](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs/5.1.1-preview2) and the [common dependencies for SDK type bindings](../articles/azure-functions/dotnet-isolated-process-guide.md#sdk-types-preview).

[Stream]: /dotnet/api/system.io.stream

[BlobClient]: /dotnet/api/azure.storage.blobs.blobclient
[BlockBlobClient]: /dotnet/api/azure.storage.blobs.specialized.blockblobclient
[PageBlobClient]: /dotnet/api/azure.storage.blobs.specialized.pageblobclient
[AppendBlobClient]: /dotnet/api/azure.storage.blobs.specialized.appendblobclient
[BlobBaseClient]: /dotnet/api/azure.storage.blobs.specialized.blobbaseclient
[BlobContainerClient]: /dotnet/api/azure.storage.blobs.blobcontainerclient
