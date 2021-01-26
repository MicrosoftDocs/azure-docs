---
title: Upload large amounts of random data in parallel to Azure Storage 
description: Learn how to use the Azure Storage client library to upload large amounts of random data in parallel to an Azure Storage account
author: roygara
ms.service: storage
ms.topic: tutorial
ms.date: 01/25/2021
ms.author: rogarana
ms.subservice: blobs
---

# Upload large amounts of random data in parallel to Azure storage

This tutorial is part two of a series. This tutorial shows you deploy an application that uploads large amount of random data to an Azure storage account.

In part two of the series, you learn how to:

> [!div class="checklist"]
> * Configure the connection string
> * Build the application
> * Run the application
> * Validate the number of connections

Azure blob storage provides a scalable service for storing your data. To ensure your application is as performant as possible, an understanding of how blob storage works is recommended. Knowledge of the limits for Azure blobs is important, to learn more about these limits visit: [Scalability and performance targets for Blob storage](../blobs/scalability-targets.md).

[Partition naming](../blobs/storage-performance-checklist.md#partitioning) is another potentially important factor when designing a high-performance application using blobs. For block sizes greater than or equal to 4 MiB, [High-Throughput block blobs](https://azure.microsoft.com/blog/high-throughput-with-azure-blob-storage/) are used, and partition naming will not impact performance. For block sizes less than 4 MiB, Azure storage uses a range-based partitioning scheme to scale and load balance. This configuration means that files with similar naming conventions or prefixes go to the same partition. This logic includes the name of the container that the files are being uploaded to. In this tutorial, you use files that have GUIDs for names as well as randomly generated content. They are then uploaded to five different containers with random names.

## Prerequisites

To complete this tutorial, you must have completed the previous Storage tutorial: [Create a virtual machine and storage account for a scalable application][previous-tutorial].

## Remote into your virtual machine

Use the following command on your local machine to create a remote desktop session with the virtual machine. Replace the IP address with the publicIPAddress of your virtual machine. When prompted, enter the credentials you used when creating the virtual machine.

```console
mstsc /v:<publicIpAddress>
```

## Configure the connection string

In the Azure portal, navigate to your storage account. Select **Access keys** under **Settings** in your storage account. Copy the **connection string** from the primary or secondary key. Log in to the virtual machine you created in the previous tutorial. Open a **Command Prompt** as an administrator and run the `setx` command with the `/m` switch, this command saves a machine setting environment variable. The environment variable is not available until you reload the **Command Prompt**. Replace **\<storageConnectionString\>** in the following sample:

```console
setx storageconnectionstring "<storageConnectionString>" /m
```

When finished, open another **Command Prompt**, navigate to `D:\git\storage-dotnet-perf-scale-app` and type `dotnet build` to build the application.

## Run the application

Navigate to `D:\git\storage-dotnet-perf-scale-app`.

Type `dotnet run` to run the application. The first time you run `dotnet` it populates your local package cache, to improve restore speed and enable offline access. This command takes up to a minute to complete and only happens once.

```console
dotnet run
```

The application creates five randomly named containers and begins uploading the files in the staging directory to the storage account. The application sets the minimum threads to 100 and the [DefaultConnectionLimit](/dotnet/api/system.net.servicepointmanager.defaultconnectionlimit) to 100 to ensure that a large number of concurrent connections are allowed when running the application.

In addition to setting the threading and connection limit settings, the [BlobRequestOptions](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions) for the [UploadFromStreamAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblockblob.uploadfromstreamasync) method are configured to use parallelism and disable MD5 hash validation. The files are uploaded in 100-mb blocks, this configuration provides better performance but can be costly if using a poorly performing network as if there is a failure the entire 100-mb block is retried.

|Property|Value|Description|
|---|---|---|
|[ParallelOperationThreadCount](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.paralleloperationthreadcount)| 8| The setting breaks the blob into blocks when uploading. For highest performance, this value should be eight times the number of cores. |
|[DisableContentMD5Validation](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.disablecontentmd5validation)| true| This property disables checking the MD5 hash of the content uploaded. Disabling MD5 validation produces a faster transfer. But does not confirm the validity or integrity of the files being transferred.   |
|[StoreBlobContentMD5](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.storeblobcontentmd5)| false| This property determines if an MD5 hash is calculated and stored with the file.   |
| [RetryPolicy](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.retrypolicy)| 2-second backoff with 10 max retry |Determines the retry policy of requests. Connection failures are retried, in this example an [ExponentialRetry](/dotnet/api/microsoft.azure.batch.common.exponentialretry) policy is configured with a 2-second backoff, and a maximum retry count of 10. This setting is important when your application gets close to hitting the scalability targets for Blob storage. For more information, see [Scalability and performance targets for Blob storage](../blobs/scalability-targets.md).  |

The `UploadFilesAsync` task is shown in the following example:

# [.NET v12](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Scalable.cs" id="Snippet_UploadFilesAsync":::

# [.NET v11](#tab/dotnet11)

```csharp
private static async Task UploadFilesAsync()
{
    // Create random 5 characters containers to upload files to.
    CloudBlobContainer[] containers = await GetRandomContainersAsync();
    var currentdir = System.IO.Directory.GetCurrentDirectory();

    // path to the directory to upload
    string uploadPath = currentdir + "\\upload";
    Stopwatch time = Stopwatch.StartNew();
    try
    {
        Console.WriteLine("Iterating in directory: {0}", uploadPath);
        int count = 0;
        int max_outstanding = 100;
        int completed_count = 0;

        // Define the BlobRequestOptions on the upload.
        // This includes defining an exponential retry policy to ensure that failed connections are retried with a backoff policy. As multiple large files are being uploaded
        // large block sizes this can cause an issue if an exponential retry policy is not defined.  Additionally parallel operations are enabled with a thread count of 8
        // This could be should be multiple of the number of cores that the machine has. Lastly MD5 hash validation is disabled for this example, this improves the upload speed.
        BlobRequestOptions options = new BlobRequestOptions
        {
            ParallelOperationThreadCount = 8,
            DisableContentMD5Validation = true,
            StoreBlobContentMD5 = false
        };
        // Create a new instance of the SemaphoreSlim class to define the number of threads to use in the application.
        SemaphoreSlim sem = new SemaphoreSlim(max_outstanding, max_outstanding);

        List<Task> tasks = new List<Task>();
        Console.WriteLine("Found {0} file(s)", Directory.GetFiles(uploadPath).Count());

        // Iterate through the files
        foreach (string path in Directory.GetFiles(uploadPath))
        {
            // Create random file names and set the block size that is used for the upload.
            var container = containers[count % 5];
            string fileName = Path.GetFileName(path);
            Console.WriteLine("Uploading {0} to container {1}.", path, container.Name);
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);

            // Set block size to 100MB.
            blockBlob.StreamWriteSizeInBytes = 100 * 1024 * 1024;
            await sem.WaitAsync();

            // Create tasks for each file that is uploaded. This is added to a collection that executes them all asyncronously.  
            tasks.Add(blockBlob.UploadFromFileAsync(path, null, options, null).ContinueWith((t) =>
            {
                sem.Release();
                Interlocked.Increment(ref completed_count);
            }));
            count++;
        }

        // Creates an asynchronous task that completes when all the uploads complete.
        await Task.WhenAll(tasks);

        time.Stop();

        Console.WriteLine("Upload has been completed in {0} seconds. Press any key to continue", time.Elapsed.TotalSeconds.ToString());

        Console.ReadLine();
    }
    catch (DirectoryNotFoundException ex)
    {
        Console.WriteLine("Error parsing files in the directory: {0}", ex.Message);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }
}
```
---

The following example is a truncated application output running on a Windows system.

# [.NET v12](#tab/dotnet)

```console
Created container 75546049-1c2f-473d-9907-ee2d88055f39
Created container d9a0735e-3a20-4297-9ff3-728e6218dbde
Created container 003829f9-00df-4369-ab88-2f2e5bddc883
Created container 9c000a4a-8dbe-47ef-a1fb-859b0bd18d3a
Created container 6df97de0-84dd-467e-9f63-5ed968534948
Iterating in directory: C:\git\my-app\upload
Found 5 file(s)
Uploading C:\git\my-app\upload\1d596d16-f6de-4c4c-8058-50ebd8141e4d.pdf to container 75546049-1c2f-473d-9907-ee2d88055f39.
Uploading C:\git\my-app\upload\242ff392-78be-41fb-b9d4-aee8152a6279.pdf to container d9a0735e-3a20-4297-9ff3-728e6218dbde.
Uploading C:\git\my-app\upload\38d4d7e2-acb4-4efc-ba39-f9611d0d55ef.pdf to container 003829f9-00df-4369-ab88-2f2e5bddc883.
Uploading C:\git\my-app\upload\45930d63-b0d0-425f-a766-cda27ff00d32.pdf to container 9c000a4a-8dbe-47ef-a1fb-859b0bd18d3a.
Uploading C:\git\my-app\upload\5129b385-5781-43be-8bac-e2fbb7d2bd82.pdf to container 6df97de0-84dd-467e-9f63-5ed968534948.
Upload has been completed in 22.0269826 seconds.
```

# [.NET v11](#tab/dotnet11)

```console
Created container https://mystorageaccount.blob.core.windows.net/9efa7ecb-2b24-49ff-8e5b-1d25e5481076
Created container https://mystorageaccount.blob.core.windows.net/bbe5f0c8-be9e-4fc3-bcbd-2092433dbf6b
Created container https://mystorageaccount.blob.core.windows.net/9ac2f71c-6b44-40e7-b7be-8519d3ba4e8f
Created container https://mystorageaccount.blob.core.windows.net/47646f1a-c498-40cd-9dae-840f46072180
Created container https://mystorageaccount.blob.core.windows.net/38b2cdab-45fa-4cf9-94e7-d533837365aa
Iterating in directory: D:\git\storage-dotnet-perf-scale-app\upload
Found 50 file(s)
Starting upload of D:\git\storage-dotnet-perf-scale-app\upload\1d596d16-f6de-4c4c-8058-50ebd8141e4d.txt to container 9efa7ecb-2b24-49ff-8e5b-1d25e5481076.
Starting upload of D:\git\storage-dotnet-perf-scale-app\upload\242ff392-78be-41fb-b9d4-aee8152a6279.txt to container bbe5f0c8-be9e-4fc3-bcbd-2092433dbf6b.
Starting upload of D:\git\storage-dotnet-perf-scale-app\upload\38d4d7e2-acb4-4efc-ba39-f9611d0d55ef.txt to container 9ac2f71c-6b44-40e7-b7be-8519d3ba4e8f.
Starting upload of D:\git\storage-dotnet-perf-scale-app\upload\45930d63-b0d0-425f-a766-cda27ff00d32.txt to container 47646f1a-c498-40cd-9dae-840f46072180.
Starting upload of D:\git\storage-dotnet-perf-scale-app\upload\5129b385-5781-43be-8bac-e2fbb7d2bd82.txt to container 38b2cdab-45fa-4cf9-94e7-d533837365aa.
...
Upload has been completed in 142.0429536 seconds. Press any key to continue
```
---

### Validate the connections

While the files are being uploaded, you can verify the number of concurrent connections to your storage account. Open a **Command Prompt** and type `netstat -a | find /c "blob:https"`. This command shows the number of connections that are currently opened using `netstat`. The following example shows a similar output to what you see when running the tutorial yourself. As you can see from the example, 800 connections were open when uploading the random files to the storage account. This value changes throughout running the upload. By uploading in parallel block chunks, the amount of time required to transfer the contents is greatly reduced.

```
C:\>netstat -a | find /c "blob:https"
800

C:\>
```

## Next steps

In part two of the series, you learned about uploading large amounts of random data to a storage account in parallel, such as how to:

> [!div class="checklist"]
> * Configure the connection string
> * Build the application
> * Run the application
> * Validate the number of connections

Advance to part three of the series to download large amounts of data from a storage account.

> [!div class="nextstepaction"]
> [Download large amounts of random data from Azure storage](storage-blob-scalable-app-download-files.md)

[previous-tutorial]: storage-blob-scalable-app-create-vm.md