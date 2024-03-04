---
title: Download large amounts of random data from Azure Storage 
description: Learn how to use the Azure SDK to download large amounts of random data from an Azure Storage account 
author: roygara
ms.service: azure-storage
ms.topic: tutorial
ms.date: 02/04/2021
ms.author: rogarana
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Download large amounts of random data from Azure storage

This tutorial is part three of a series. This tutorial shows you how to download large amounts of data from Azure storage.

In part three of the series, you learn how to:

> [!div class="checklist"]
> - Update the application
> - Run the application
> - Validate the number of connections

## Prerequisites

To complete this tutorial, you must have completed the previous Storage tutorial: [Upload large amounts of random data in parallel to Azure storage][previous-tutorial].

## Remote into your virtual machine

 To create a remote desktop session with the virtual machine, use the following command on your local machine. Replace the IP address with the publicIPAddress of your virtual machine. When prompted, enter the credentials used when creating the virtual machine.

```console
mstsc /v:<publicIpAddress>
```

## Update the application

In the previous tutorial, you only uploaded files to the storage account. Open `D:\git\storage-dotnet-perf-scale-app\Program.cs` in a text editor. Replace the `Main` method with the following sample. This example comments out the upload task and uncomments the download task and the task to delete the content in the storage account when complete.

```csharp
public static void Main(string[] args)
{
    Console.WriteLine("Azure Blob storage performance and scalability sample");
    // Set threading and default connection limit to 100 to 
    // ensure multiple threads and connections can be opened.
    // This is in addition to parallelism with the storage 
    // client library that is defined in the functions below.
    ThreadPool.SetMinThreads(100, 4);
    ServicePointManager.DefaultConnectionLimit = 100; // (Or More)

    bool exception = false;
    try
    {
        // Call the UploadFilesAsync function.
        // await UploadFilesAsync();

        // Uncomment the following line to enable downloading of files from the storage account.
        // This is commented out initially to support the tutorial at 
        // https://learn.microsoft.com/azure/storage/blobs/storage-blob-scalable-app-download-files
        await DownloadFilesAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        exception = true;
    }
    finally
    {
        // The following function will delete the container and all files contained in them.
        // This is commented out initially as the tutorial at 
        // https://learn.microsoft.com/azure/storage/blobs/storage-blob-scalable-app-download-files
        // has you upload only for one tutorial and download for the other.
        if (!exception)
        {
            // await DeleteExistingContainersAsync();
        }
        Console.WriteLine("Press any key to exit the application");
        Console.ReadKey();
    }
}
```

After the application has been updated, you need to build the application again. Open a `Command Prompt` and navigate to `D:\git\storage-dotnet-perf-scale-app`. Rebuild the application by running `dotnet build` as seen in the following example:

```console
dotnet build
```

## Run the application

Now that the application has been rebuilt it is time to run the application with the updated code. If not already open, open a `Command Prompt` and navigate to `D:\git\storage-dotnet-perf-scale-app`.

Type `dotnet run` to run the application.

```console
dotnet run
```

The `DownloadFilesAsync` task is shown in the following example:

The application reads the containers located in the storage account specified in the **storageconnectionstring**. It iterates through the blobs using the [GetBlobs](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobs) method and downloads them to the local machine using the [DownloadToAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadtoasync) method.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Scalable.cs" id="Snippet_DownloadFilesAsync":::

### Validate the connections

While the files are being downloaded, you can verify the number of concurrent connections to your storage account. Open a console window and type `netstat -a | find /c "blob:https"`. This command shows the number of connections that are currently opened. As you can see from the following example, over 280 connections were open when downloading files from the storage account.

```console
C:\>netstat -a | find /c "blob:https"
289

C:\>
```

## Next steps

In part three of the series, you learned about downloading large amounts of data from a storage account, including how to:

> [!div class="checklist"]
> - Run the application
> - Validate the number of connections

Go to part four of the series to verify throughput and latency metrics in the portal.

> [!div class="nextstepaction"]
> [Verify throughput and latency metrics in the portal](storage-blob-scalable-app-verify-metrics.md)

[previous-tutorial]: storage-blob-scalable-app-upload-files.md
