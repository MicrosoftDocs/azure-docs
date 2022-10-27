---
title: Upload a blob using .NET - Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the .NET client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 03/28/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: csharp, python
ms.custom: "devx-track-csharp, devx-track-python"
---

# Upload a blob to Azure Storage by using the .NET client library

You can upload a blob, open a blob stream and write to that, or upload large blobs in blocks.

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md) article. Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. To learn how to create a container, see [Create a container in Azure Storage with .NET](storage-blob-container-create.md). 

To upload a blob by using a file path, a stream, a binary object or a text string, use either of the following methods:

- [Upload](/dotnet/api/azure.storage.blobs.blobclient.upload)
- [UploadAsync](/dotnet/api/azure.storage.blobs.blobclient.uploadasync)

To open a stream in Blob Storage, and then write to that stream, use either of the following methods:

- [OpenWrite](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.openwrite)
- [OpenWriteAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.openwriteasync)

## Upload by using a file path

The following example uploads a blob by using a file path:

```csharp
public static async Task UploadFile
    (BlobContainerClient containerClient, string localFilePath)
{
    string fileName = Path.GetFileName(localFilePath);
    BlobClient blobClient = containerClient.GetBlobClient(fileName);

    await blobClient.UploadAsync(localFilePath, true);
}
```

## Upload by using a Stream

The following example uploads a blob by creating a [Stream](/dotnet/api/system.io.stream) object, and then uploading that stream.

```csharp
public static async Task UploadStream
    (BlobContainerClient containerClient, string localFilePath)
{
    string fileName = Path.GetFileName(localFilePath);
    BlobClient blobClient = containerClient.GetBlobClient(fileName);

    FileStream fileStream = File.OpenRead(localFilePath);
    await blobClient.UploadAsync(fileStream, true);
    fileStream.Close();
}
```

## Upload by using a BinaryData object

The following example uploads a [BinaryData](/dotnet/api/system.binarydata) object.

```csharp
public static async Task UploadBinary
    (BlobContainerClient containerClient, string localFilePath)
{
    string fileName = Path.GetFileName(localFilePath);
    BlobClient blobClient = containerClient.GetBlobClient(fileName);

    FileStream fileStream = File.OpenRead(localFilePath);
    BinaryReader reader = new BinaryReader(fileStream);

    byte[] buffer = new byte[fileStream.Length];

    reader.Read(buffer, 0, buffer.Length);

    BinaryData binaryData = new BinaryData(buffer);

    await blobClient.UploadAsync(binaryData, true);

    fileStream.Close();
}
```

## Upload a string

The following example uploads a string:

```csharp
public static async Task UploadString
    (BlobContainerClient containerClient, string localFilePath)
{
    string fileName = Path.GetFileName(localFilePath);
    BlobClient blobClient = containerClient.GetBlobClient(fileName);

    await blobClient.UploadAsync(BinaryData.FromString("hello world"), overwrite: true);
}
```

## Upload with index tags

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. You can perform this task by adding tags to a [BlobUploadOptions](/dotnet/api/azure.storage.blobs.models.blobuploadoptions) instance, and then passing that instance into the [UploadAsync](/dotnet/api/azure.storage.blobs.blobclient.uploadasync) method.

The following example uploads a blob with three index tags.

```csharp
public static async Task UploadBlobWithTags
    (BlobContainerClient containerClient, string localFilePath)
{
    string fileName = Path.GetFileName(localFilePath);
    BlobClient blobClient = containerClient.GetBlobClient(fileName);

    BlobUploadOptions options = new BlobUploadOptions();
    options.Tags = new Dictionary<string, string>
    {
        { "Sealed", "false" },
        { "Content", "image" },
        { "Date", "2020-04-20" }
    };

    await blobClient.UploadAsync(localFilePath, options);
}
```

## Upload to a stream in Blob Storage

You can open a stream in Blob Storage and write to that stream. The following example creates a zip file in Blob Storage and writes files to that file. Instead of building a zip file in local memory, only one file at a time is in memory. 

```csharp
public static async Task UploadToStream
    (BlobContainerClient containerClient, string localDirectoryPath)
{
    string zipFileName = Path.GetFileName
        (Path.GetDirectoryName(localDirectoryPath)) + ".zip";
    
    BlockBlobClient blockBlobClient = 

        containerClient.GetBlockBlobClient(zipFileName);
    
    using (Stream stream = await blockBlobClient.OpenWriteAsync(true))
    {
        using (ZipArchive zip = new ZipArchive
            (stream, ZipArchiveMode.Create, leaveOpen: false))
        {
            foreach (var fileName in Directory.EnumerateFiles(localDirectoryPath))
            {
                using (var fileStream = File.OpenRead(fileName))
                {
                    var entry = zip.CreateEntry(Path.GetFileName
                        (fileName), CompressionLevel.Optimal);
                    using (var innerFile = entry.Open())
                    {
                        await fileStream.CopyToAsync(innerFile);
                    }
                }
            }
        }
    }

}
```

## Upload by staging blocks and then committing them

You can have greater control over how to divide our uploads into blocks by manually staging individual blocks of data. When all of the blocks that make up a blob are staged, you can commit them to Blob Storage. You can use this approach if you want to enhance performance by uploading blocks in parallel. 

```csharp
public static async Task UploadInBlocks
    (BlobContainerClient blobContainerClient, string localFilePath, int blockSize)
{
    string fileName = Path.GetFileName(localFilePath);
    BlockBlobClient blobClient = blobContainerClient.GetBlockBlobClient(fileName);

    FileStream fileStream = File.OpenRead(localFilePath);

    ArrayList blockIDArrayList = new ArrayList();

    byte[] buffer;

    var bytesLeft = (fileStream.Length - fileStream.Position);

    while (bytesLeft > 0)
    {
        if (bytesLeft >= blockSize)
        {
            buffer = new byte[blockSize];
            await fileStream.ReadAsync(buffer, 0, blockSize);
        }
        else
        {
            buffer = new byte[bytesLeft];
            await fileStream.ReadAsync(buffer, 0, Convert.ToInt32(bytesLeft));
            bytesLeft = (fileStream.Length - fileStream.Position);
        }

        using (var stream = new MemoryStream(buffer))
        {
            string blockID = Convert.ToBase64String
                (Encoding.UTF8.GetBytes(Guid.NewGuid().ToString()));
            
            blockIDArrayList.Add(blockID);


            await blobClient.StageBlockAsync(blockID, stream);
        }

        bytesLeft = (fileStream.Length - fileStream.Position);

    }

    string[] blockIDArray = (string[])blockIDArrayList.ToArray(typeof(string));

    await blobClient.CommitBlockListAsync(blockIDArray);
}
```

## See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)
