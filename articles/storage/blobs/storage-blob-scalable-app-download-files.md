---
title: Download large amounts of random data from Azure Storage  | Microsoft Docs 
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

# Download large amounts of random data from Azure storage

This tutorial is part three of a series. This tutorial shows you can download larges amounts of data from Azure storage. When you're finished, you have a console application running on a virtual machine that you upload and download large amounts of data to and from a storage account.

In part two of the series, you learn how to:

> [!div class="checklist"]
> * Run the application
> * Validate the number of connections

## Prerequisites

To complete this tutorial, you must have completed the previous Storage tutorial: [Upload large amounts of random data in parallel to Azure storage][previous-tutorial].

## Remote into your virtual machine

Use the following command, on your local machine, to create a remote desktop session with the virtual machine. Replace the IP address with the publicIPAddress of your virtual machine. When prompted, enter the credentials used when creating the virtual machine.

```
mstsc /v:<publicIpAddress>
```

## Update the application

In the prevous tutorial you only uploaded files to the storage account. Open `c:\git\StoragePerfandScalabilityExample\Program.cs` in a text editor.  Replace the `Main` method with the sample below. This example comments out the upload task and uncomments the download task and the task to delete the content in the storage account when complete.

```csharp
static void Main(string[] args)
{
    // Set threading and default connection limit to 100 to ensure multiple threads and connections can be opened.
    // This is in addition to parallelism with the storage client library that is defined in the functions below.
    ThreadPool.SetMinThreads(100, 4);
    ServicePointManager.DefaultConnectionLimit = 100; //(Or More)

    // Call the UploadFilesAsync function.
    //UploadFilesAsync().Wait();
    // Uncomment the following line to enable downloading of files from the storage account.  This is commented out
    // initially to support the tutorial at http://inserturlhere.
    DownloadFilesAsync().Wait();
    Console.WriteLine("Application complete. After you press any key the container and blobs will be deleted.");
    Console.ReadKey();
    // The following function will delete the container and all files contained in them.  This is commented out initialy
    // As the tutorial at http://inserturlhere has you upload only for one tutorial and download for the other. 
    Util.DeleteExistingContainersAsync().Wait();
}
```

After the application has been updated, the application needs to be re-built.  Open a `Command Prompt` and navigate to `c:\git\StoragePerfandScalabilityExample`. Rebuild the applictaion by running `dotnet build` as seen in the following example.  

```
dotnet build
```

## Run the application

Now that the application has been rebuilt it is time to run the application. If not already open, open a `Command Prompt` and navigate to `c:\git\StoragePerfandScalabilityExample`.

Type `dotnet run` to run the application.

```
dotnet run
```

The application reads the containers located in the storage accound as specified in the `Config.json` file. It iterates through the blobs in the containers and downloads them to the local machine using the [DownloadToFileAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob.downloadtofileasync?view=azure-dotnet#Microsoft_WindowsAzure_Storage_Blob_CloudBlob_DownloadToFileAsync_System_String_System_IO_FileMode_Microsoft_WindowsAzure_Storage_AccessCondition_Microsoft_WindowsAzure_Storage_Blob_BlobRequestOptions_Microsoft_WindowsAzure_Storage_OperationContext_) method.
The following table shows the [BlobRequestOptions](/dotnet/api/microsoft.windowsazure.storage.blob.blobrequestoptions?view=azure-dotnet) that are defined for each blob as it is downloaded.

|Property|Value|Description|
|---|---|---|
|[DisableContentMD5Validation](/dotnet/api/microsoft.windowsazure.storage.blob.blobrequestoptions.disablecontentmd5validation?view=azure-dotnet)| true| This property disables checking the MD5 hash of the content uploaded. Disabling MD5 validation produces a faster transfer. |
|[StorBlobContentMD5](/dotnet/api/microsoft.windowsazure.storage.blob.blobrequestoptions.storeblobcontentmd5?view=azure-dotnet#Microsoft_WindowsAzure_Storage_Blob_BlobRequestOptions_StoreBlobContentMD5)| false| This property determines if an MD5 hash is calculated and stored   |

The `DownloadFilesAsync` task is shown in the following example:

```csharp
private static async Task DownloadFilesAsync(string[] args)
{
    // Retrieve the list of containers in the storage account.  Create a directory and configure variables for use later.
    List<CloudBlobContainer> containers = await Util.ListContainers();
    var directory = Directory.CreateDirectory("download");
    BlobContinuationToken continuationToken = null;
    BlobResultSegment resultSegment = null;
    Stopwatch time = Stopwatch.StartNew();
    // download thee blob
    try
    {
        List<Task> Tasks = new List<Task>();
        // Iterate throung the containers
        foreach (CloudBlobContainer container in containers)
        {
            do
            {
                // Return the blobs from the container lazily 10 at a time.
                resultSegment = await container.ListBlobsSegmentedAsync("", true, BlobListingDetails.All, 10, continuationToken, null, null);
                {
                    foreach (var blobItem in resultSegment.Results)
                    {
                        // Get the blob and add a task to download the blob asynchronously from the storage account.
                        CloudBlockBlob blockBlob = container.GetBlockBlobReference(((CloudBlockBlob)blobItem).Name);
                        Console.WriteLine("Starting download of {0} from container {1}", blockBlob.Name, container.Name);
                        Tasks.Add(blockBlob.DownloadToFileAsync(directory.FullName + "\\" + blockBlob.Name, FileMode.Create, null, new BlobRequestOptions() { DisableContentMD5Validation = true, StoreBlobContentMD5 = false }, null));
                    }
                }
            }
            while (continuationToken != null);
        }
        await Task.WhenAll(Tasks);
    }
    catch (Exception e)
    {
        Console.WriteLine("\nThe transfer is canceled: {0}", e.Message);
    }
    time.Stop();
    Console.WriteLine("Download has been completed in {0} seconds. Press any key to continue", time.Elapsed.TotalSeconds.ToString());
    Console.ReadLine();
}
```

### Validate the connections

While the files are being downloaded, you can verify the number of concurrent connections to your storage account. Open a `Command Prompt` and type `netstat -a | find /c "blob:https"`.  This shows the number of connections that are currently opened using `netstat`. The following example shows a similar output to what you see when running the tutorial yourself. As you can see from the example over 280 connections were open when downloading the random files from the storage account.

```
C:\>netstat -a | find /c "blob:https"
289

C:\>
```

## Next steps

In part two of the series, you learned about downloading large amounts of random data from a storage account, such as how to:

> [!div class="checklist"]
> * Run the application
> * Validate the number of connections

Advance to part four of the series to verify throughtput and latency metrics in the portal.

> [!div class="nextstepaction"]
> [Verify throughput and latency metrics in the portal](storage-blob-scalable-app-verify-metrics.md)

[previous-tutorial]: storage-blob-scalable-app-upload-files.md