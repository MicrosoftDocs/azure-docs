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

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

##


### Download files
```csharp
private static async Task DownloadFilesAsync(string[] args)
{
    List<CloudBlobContainer> containers = await Util.ListContainers();
    var directory = Directory.CreateDirectory("download");
    BlobContinuationToken continuationToken = null;
    BlobResultSegment resultSegment = null;
    Stopwatch time = Stopwatch.StartNew();
    // download thee blob
    try
    {
        List<Task> Tasks = new List<Task>();
        foreach (CloudBlobContainer container in containers)
        {
            do
            {
                resultSegment = await container.ListBlobsSegmentedAsync("", true, BlobListingDetails.All, 10, continuationToken, null, null);
                {
                    foreach (var blobItem in resultSegment.Results)
                    {
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
    Console.WriteLine("Download has been completed in {0} seconds.", time.Elapsed.TotalSeconds.ToString());
}
```