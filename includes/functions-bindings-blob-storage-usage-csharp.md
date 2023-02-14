---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 12/02/2021
ms.author: glenga
---

# [In-process class library](#tab/in-process)

An in-process class library is a compiled C# function runs in the same process as the Functions runtime.
 
# [Isolated process](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.  
   
# [C# script](#tab/csharp-script)

C# script is used primarily when creating C# functions in the Azure portal.

---

Choose a version to see usage details for the mode and version. 

# [Extension 5.x and higher](#tab/extensionv5/in-process)

The following parameter types are supported for all versions:

* `Stream`
* `TextReader`
* `string`
* `Byte[]`

The following parameter types are extension version-specific and require `FileAccess.ReadWrite` in your C# class library:

+ [BlobClient](/dotnet/api/azure.storage.blobs.blobclient)
+ [BlockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient)
+ [PageBlobClient](/dotnet/api/azure.storage.blobs.specialized.pageblobclient)
+ [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient)
+ [BlobBaseClient](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient)

For examples using these types, see [the GitHub repository for the extension](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Microsoft.Azure.WebJobs.Extensions.Storage.Blobs#examples). Learn more about these new types are different and how to migrate to them from the [Azure.Storage.Blobs Migration Guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/storage/Azure.Storage.Blobs/AzureStorageNetMigrationV12.md).

[!INCLUDE [functions-bindings-blob-storage-attribute](functions-bindings-blob-storage-attribute.md)]

# [Extension 2.x and higher](#tab/extensionv2/in-process)

The following parameter types are supported for all versions:

* `Stream`
* `TextReader`
* `string`
* `Byte[]`

The following parameter types are extension version-specific and require `FileAccess.ReadWrite` in your C# class library:

+ [ICloudBlob](/dotnet/api/microsoft.azure.storage.blob.icloudblob)
+ [CloudBlockBlob](/dotnet/api/microsoft.azure.storage.blob.cloudblockblob)
+ [CloudPageBlob](/dotnet/api/microsoft.azure.storage.blob.cloudpageblob) 
+ [CloudAppendBlob](/dotnet/api/microsoft.azure.storage.blob.cloudappendblob) 

[!INCLUDE [functions-bindings-blob-storage-attribute](functions-bindings-blob-storage-attribute.md)]

# [Extension 5.x and higher](#tab/extensionv5/isolated-process)

Isolated worker process currently only supports binding to string parameters.

# [Extension 2.x and higher](#tab/extensionv2/isolated-process)

Isolated worker process currently only supports binding to string parameters.

# [Extension 5.x and higher](#tab/extensionv5/csharp-script)

The following parameter types are supported for all versions:

* `Stream`
* `TextReader`
* `string`
* `Byte[]`

The following parameter types require you to set `inout` for `direction` in the *function.json* file. 

+ [BlobClient](/dotnet/api/azure.storage.blobs.blobclient)
+ [BlockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient)
+ [PageBlobClient](/dotnet/api/azure.storage.blobs.specialized.pageblobclient)
+ [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient)
+ [BlobBaseClient](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient)

# [Extension 2.x and higher](#tab/extensionv2/csharp-script)

The following parameter types are supported for all versions:

* `Stream`
* `TextReader`
* `string`
* `Byte[]`

The following parameter types are extension version-specific and require you to set `inout` for `direction` in the *function.json* file. 

+ [ICloudBlob](/dotnet/api/microsoft.azure.storage.blob.icloudblob)
+ [CloudBlockBlob](/dotnet/api/microsoft.azure.storage.blob.cloudblockblob)
+ [CloudPageBlob](/dotnet/api/microsoft.azure.storage.blob.cloudpageblob) 
+ [CloudAppendBlob](/dotnet/api/microsoft.azure.storage.blob.cloudappendblob) 

---

Binding to `string`, or `Byte[]` is only recommended when the blob size is small. This is recommended because the entire blob contents are loaded into memory. For most blobs, use a `Stream` or `CloudBlockBlob` type. For more information, see [Concurrency and memory usage](../articles/azure-functions/functions-bindings-storage-blob-trigger.md#concurrency-and-memory-usage).

If you get an error message when trying to bind to one of the Storage SDK types, make sure that you have a reference to [the correct Storage SDK version](../articles/azure-functions/functions-bindings-storage-blob.md#tabpanel_2_functionsv1_in-process).