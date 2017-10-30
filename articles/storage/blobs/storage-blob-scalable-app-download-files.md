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
> * Run the application

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

##


### Download files
```csharp
private static async Task DownloadFilesAsync(string[] args, CloudBlobContainer[] containers, string downloadDir)
{
    var directory = Directory.CreateDirectory("download");
    string destPath = downloadDir + "\\downloaded_";
    BlobContinuationToken continuationToken = null;
    BlobResultSegment resultSegment = null;
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
                        Console.WriteLine("Starting download of {0}", blockBlob.Name);
                        Tasks.Add(blockBlob.DownloadToFileAsync(destPath + blockBlob.Name, FileMode.Create, null, new BlobRequestOptions() { DisableContentMD5Validation = true, StoreBlobContentMD5 = false }, null));
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
}
```