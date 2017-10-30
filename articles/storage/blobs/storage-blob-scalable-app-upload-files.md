---
title: Upload large amounts of random data in parallel to Azure Storage  | Microsoft Docs 
description: Build a scalable application using Azure blob storage
services: storage
documentationcenter: 
author: georgewallace
manager: timlt
editor: ''

ms.service: storage
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: csharp
ms.topic: tutorial
ms.date: 10/23/2017
ms.author: gwallace
ms.custom: mvc
---

# Upload large amounts of random data in parallel to Azure storage

This tutorial is part two of a series. This tutorial shows you deploy an application that uploads large amount of random data and download data with an Azure storage account. When you're finished, you have a console application running on a virtual machine that you upload and download large amounts of data to a storage account.

In part two of the series, you learn how to:

> [!div class="checklist"]
> * Configure the connection string
> * Build the application
> * Run the application

Azure blob storage provides a scalable service for storing your data. To ensure your application is as performant as possible, an understanding of how blob storage works is recommended. Knowledge of the limits for Azure blobs is important, to learn more about these limits visit: [blob storage scalability targets](../common/storage-scalability-targets?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#azure-blob-storage-scale-targets).  [Partition naming](../common/storage-performance-checklist?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#subheading47) is another im

## Prerequisites

To complete this tutorial you must have completed the previous Storage tutorial: [Create a virtual machine and storage account for a scalable application][previous-tutorial].

## Remote into your virtual machine

Use the following command, on your local machine, to create a remote desktop session with the virtual machine. Replace the IP address with the publicIPAddress of your virtual machine. When prompted, enter the credentials used when creating the virtual machine.

```
mstsc /v:<publicIpAddress>
```

## Configure the connection string

Login to the virtual machine you created in the previous tutorial. Navigate to `C:\Git\StoragePerfandScalabilityExample` and open the `Program.cs` file in notepad.

In the Azure portal, navigate to your storage account. Select **Access keys** under **Settings** in your storage account in the Azure portal. Copy the **connection string** from the primary or secondary key and paste it in the **App.config** file. Select **Save**, to save the file when complete.

Replace the connectionString variable with the connection string.

```csharp
string connectionString = "UseDevelopmentStorage=true;";
```

When finished open a `Command Prompt`, navigate to `c:\git\StoragePerfandScalabilityExample` and type `dotnet build` to re-build the application.

## Run the application

Open a `Command Prompt` and navigate to `c:\git\StoragePerfandScalabilityExample`.

Type `dotnet run` to run the application. .NET decompresses and expands the project.

```
dotnet run
```

The application creates 5 random named containers and begins uploading the files in the staging directory to the storage account. The application sets the minimum threads to 100 and the `DefaultConnectionLimit` to 100 to ensure that a large amount of concurrent connections are allowed when running the application.

In addition to setting the threading and connection limit settings, the [BlobRequestOptions](/dotnet/api/microsoft.windowsazure.storage.blob.blobrequestoptions?view=azure-dotnet) for the [UploadFromStreamAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblockblob.uploadfromstreamasync?view=azure-dotnet) method are configured to configure parallelism and disabling MD5 hash validation.

|Property|Value|Description|
|---|---|---|
|[ParallelOperationThreadCount](/dotnet/api/microsoft.windowsazure.storage.blob.blobrequestoptions.paralleloperationthreadcount?view=azure-dotnet)| 8| The setting breaks the blob into blocks when uploading. For highest performance this value should be 8 times the number of cores. |
|[DisableContentMD5Validation](/dotnet/api/microsoft.windowsazure.storage.blob.blobrequestoptions.disablecontentmd5validation?view=azure-dotnet)| true| This property disables checking the MD5 hash of the content uploaded. This produces a faster transfer. |
|[StorBlobContentMD5](/dotnet/api/microsoft.windowsazure.storage.blob.blobrequestoptions.storeblobcontentmd5?view=azure-dotnet#Microsoft_WindowsAzure_Storage_Blob_BlobRequestOptions_StoreBlobContentMD5)| false| This property determines if an MD5 hash is calculated and stored   |

The `UploadFilesAsync` task is shown in the following example:

```csharp
private static async Task UploadFilesAsync(string[] args, CloudBlobContainer[] containers)
{
    // path to the directory to upload
    string path = "test";
    if (args.Length > 0)
    {
        path = System.Convert.ToString(args[0]);
    }

    Stopwatch time = Stopwatch.StartNew();
    try
    {
        Console.WriteLine("iterating in directiory:", path);

        // Seed the Random value using the Ticks representing current time and date
        // Since int is used as seen we cast (loss of long data)
        int count = 0;
        List<Task> Tasks = new List<Task>();

        foreach (string fileName in Directory.GetFiles(path))
        {
            Console.WriteLine("Starting {0}", fileName);
            var container = containers[count % 5];
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);
            blockBlob.StreamWriteSizeInBytes = 100 * 1024 * 1024;
            Tasks.Add(blockBlob.UploadFromFileAsync(fileName, null, new BlobRequestOptions() { ParallelOperationThreadCount = 8, DisableContentMD5Validation = true, StoreBlobContentMD5 = false }, null));
            count++;
        }

        await Task.WhenAll(Tasks);

    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }
    time.Stop();

    Console.WriteLine("Upload has been completed in {0} seconds.", time.Elapsed.TotalSeconds.ToString());
    Console.ReadLine();
}
```

### Validate the connections

Open a `Command Prompt` and type `netstat -a | find /c "blob:https"`

```
C:\>netstat -a | find /c "blob:https"
289

C:\>
```
[previous-tutorial]: storage-blob-scalable-app-create-vm.md