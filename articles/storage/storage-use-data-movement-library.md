---
title: Transfer Data with the Microsoft Azure Storage Data Movement Library | Microsoft Docs
description: Use the Data Movement Library to move or copy data to or from blob and file content. Copy data to Azure Storage from local files, or copy data within or between storage accounts. Easily migrate your data to Azure Storage.
services: storage
documentationcenter: ''
author: micurd
manager: jahogg
editor: tysonn

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 01/18/2017
ms.author: micurd

---
# Transfer Data with the Microsoft Azure Storage Data Movement Library

## Overview
The Microsoft Azure Storage Data Movement Library is a cross-platform open source library that is designed for high-performance uploading, downloading and copying of Azure Storage Blobs and Files. This library is the core data movement framework that powers [AzCopy](storage-use-azcopy.md). Everything that can be done with the Data Movement Library can also be done with our traditional [.NET Azure Storage Client Library](storage-dotnet-how-to-use-blobs.md). However, if you're looking for a more convenient way to move data in parallel, track transfer progress, or easily resume a paused or failed transfer, then consider using the Data Movement Library.  

This library also leverages the .Net Standard runtime library, which means you can use it when building .NET apps for Windows, Linux and MacOS. To learn more about .NET Core, please refer to the [.NET Core documentation](https://dotnet.github.io/).

This document will demonstrate how to create a .NET Core console application that that runs on Windows, Linux, and MacOS and performs the following:

- Download, upload, and copy blobs and files.
- Copy blobs and files synchronously and asynchronously.
- Define the number of parallel operations when transferring data.
- Download a specific blob snapshot.
- Track data transfer progress.
- Resume paused or failed data transfer.
- Set access condition.
- Set user agent suffix.
- Include subdirectories when performing a directory transfer. 

**What you'll need:**

* [Visual Studio Code](https://code.visualstudio.com/).
* An [Azure storage account](storage-create-storage-account.md#create-a-storage-account)

> [!NOTE]
> This guide assumes that you are already familiar with [Azure Storage](https://azure.microsoft.com/services/storage/). If not, reading the [Introduction to Azure Storage](storage-introduction.md) documentation will be helpful. Most importantly, you will need to [create a Storage account](storage-create-storage-account.md#create-a-storage-account) in order to start using the Data Movement Library.
> 
> 

## Setup  

1. Visit the [.NET Core Installation Guide](https://www.microsoft.com/net/core) to install .NET Core. When selecting your environment, choose the command line option. 
2. From the command line, create a directory for your project. Navigate into this directory, then type `dotnet new` to create a new C# console project.
3. Open this directory in Visual Studio Code. This can be quickly done via the command-line by typing `code .`.  
4. Install the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) from the Visual Studio Code Marketplace. Restart Visual Studio Code. 
5. At this point, you should see two prompts. One will be for adding "required assets to build and debug". Click "yes". Another prompt will be for restoring unresolved dependendencies. Click "restore".
6. Your application should now contain a `launch.json` file under the `.vscode` directory. In this file, change the `externalConsole` value to `true`.
7. Visual Studio Code provides the ability to debug .NET Core applications. Hit `F5` to run your application and verify that your setup is working. You should see "Hello World!" printed to the console. 

## Add Data Movement Library to your project

1. Add the latest version of the Data Movement Library to the `dependendencies` section of your `project.json` file. At the time of writing, this would be `"Microsoft.Azure.Storage.DataMovement": "0.5.0"` 
2. Add `"portable-net45+win8"` to the `imports` section. 
3. You should then be prompted to hit the "restore" button. You can also restore your project from the command line by typing the command `dotnet restore` in the root of your project directory.

Your `project.json` should look like the following:

    {
      "version": "1.0.0-*",
      "buildOptions": {
        "debugType": "portable",
        "emitEntryPoint": true
      },
      "dependencies": {
        "Microsoft.Azure.Storage.DataMovement": "0.5.0"
      },
      "frameworks": {
        "netcoreapp1.1": {
          "dependencies": {
            "Microsoft.NETCore.App": {
              "type": "platform",
              "version": "1.1.0"
            }
          },
          "imports": [
            "dnxcore50",
            "portable-net45+win8"
          ]
        }
      }
    }

## Upload, copy, and download a blob
Next, you'll add some code to the shared class `Program.cs` that creates a container, uploads a blob into this container, copies the blob, then downloads that blob to your local directory. `Program.cs` should look like the following:

```csharp
using System;
using System.Threading;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.DataMovement;

namespace DMLibSample
{
    public class Program
    {
        public static void Main()
        {
            // Setup Storage context
            string storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=your_account_name_here;AccountKey=your_account_key_here";
            CloudStorageAccount account = CloudStorageAccount.Parse(storageConnectionString);
            CloudBlobClient blobClient = account.CreateCloudBlobClient();
            CloudBlobContainer blobContainer = blobClient.GetContainerReference("mycontainer");
            CloudBlockBlob blob = blobContainer.GetBlockBlobReference("blob1");
            CloudBlockBlob otherBlob = blobContainer.GetBlockBlobReference("blob2");

            string sourcePath = "C:\\path\\for\\upload\\file.extension";
            string destPath = "C:\\path\\for\\download\\file.extension";

            // Setup the number of the concurrent operations
            TransferManager.Configurations.ParallelOperations = 64;

            // Setup the transfer context to track upload and download progress
            SingleTransferContext uploadContext = new SingleTransferContext();
            uploadContext.ProgressHandler = new Progress<TransferStatus>((progress) =>
            {
                Console.WriteLine("Bytes uploaded: {0}", progress.BytesTransferred);
            });

            SingleTransferContext downloadContext = new SingleTransferContext();
            downloadContext.ProgressHandler = new Progress<TransferStatus>((progress) =>
            {
                Console.WriteLine("Bytes downloaded: {0}", progress.BytesTransferred);
            });

            // Upload blob
            Console.WriteLine("\nUploading blob...");
            var task = TransferManager.UploadAsync(sourcePath, blob, null, uploadContext, CancellationToken.None);
            task.Wait();
            Console.WriteLine("Upload operation completed.");

            // Copy blob
            Console.WriteLine("\nCopying blob...");
            task = TransferManager.CopyAsync(blob, otherBlob, true);
            task.Wait();
            Console.WriteLine("Copy operation completed.");

            // Download blob
            Console.WriteLine("\nDownloading blob...");
            task = TransferManager.DownloadAsync(otherBlob, destPath, null, downloadContext, CancellationToken.None);
            task.Wait();
            Console.WriteLine("Download operation completed.");

            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }
    }
}
```

Make sure to replace "your_account_name_here" and "your_account_key_here" with your actual account name and key. Futhermore, replace `"C:\\path\\for\\upload\\file.extension"` with a path to a file that exists locally. Escaping the backslash is required, hence the reason for the `\\`. Replace `"C:\\path\\for\\download\\file.extension"` with the path to the file that doesn't exist yet. 

## Run the application
Hit `F5` to run the application. As you'll see, your program will create the container `mycontainer` (if it doesn't exist already). It will then upload the file you provided in `sourcePath` as a blob, named `blob1`, into `mycontainer`. Next, `blob1` will be copied to a new blob, `blob2`. Then `blob2` will be downloaded to the path and file name you provided in `destPath`. You can verify all of this by using the [Microsoft Azure Storage Explorer](http://storageexplorer.com/) to view your storage account. 

## Next steps
In this getting started, you learned how to create an application that interacts with Azure Storage and runs on Windows, Linux and MacOS. This getting started specifically focused on a few scenarios in Blob Storage. However, this same knowledge can be applied to File Storage. Please check out [Azure Storage Data Movement Library reference documentation](https://azure.github.io/azure-storage-net-data-movement) to learn more.

[!INCLUDE [storage-try-azure-tools-blobs](../../includes/storage-try-azure-tools-blobs.md)]








