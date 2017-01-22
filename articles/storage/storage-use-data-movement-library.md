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
ms.date: 01/23/2017
ms.author: micurd

---
# Transfer Data with the Microsoft Azure Storage Data Movement Library

## Overview
The Microsoft Azure Storage Data Movement Library is a cross-platform open source library that is designed for high performance uploading, downloading, and copying of Azure Storage Blobs and Files. This library is the core data movement framework that powers [AzCopy](storage-use-azcopy.md). Everything that can be done with the Data Movement Library can also be done with our traditional [.NET Azure Storage Client Library](storage-dotnet-how-to-use-blobs.md). However, if you're looking for a more convenient way to move data in parallel, track transfer progress, or easily resume a canceled transfer, then consider using the Data Movement Library.  

This library also uses .NET Core, which means you can use it when building .NET apps for Windows, Linux and MacOS. To learn more about .NET Core, refer to the [.NET Core documentation](https://dotnet.github.io/).

This document demonstrates how to create a .NET Core console application that that runs on Windows, Linux, and MacOS and performs the following scenarios:

- Upload files and directories to Blob Storage.
- Define the number of parallel operations when transferring data.
- Track data transfer progress.
- Resume canceled data transfer. 
- Copy file from URL to Blob Storage. 

**What you need:**

* [Visual Studio Code](https://code.visualstudio.com/)
* An [Azure storage account](storage-create-storage-account.md#create-a-storage-account)

> [!NOTE]
> This guide assumes that you are already familiar with [Azure Storage](https://azure.microsoft.com/services/storage/). If not, reading the [Introduction to Azure Storage](storage-introduction.md) documentation is helpful. Most importantly, you need to [create a Storage account](storage-create-storage-account.md#create-a-storage-account) to start using the Data Movement Library.
> 
> 

## Setup  

1. Visit the [.NET Core Installation Guide](https://www.microsoft.com/net/core) to install .NET Core. When selecting your environment, choose the command-line option. 
2. From the command line, create a directory for your project. Navigate into this directory, then type `dotnet new` to create a C# console project.
3. Open this directory in Visual Studio Code. This step can be quickly done via the command line by typing `code .`.  
4. Install the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) from the Visual Studio Code Marketplace. Restart Visual Studio Code. 
5. At this point, you should see two prompts. One is for adding "required assets to build and debug." Click "yes." Another prompt is for restoring unresolved dependencies. Click "restore."
6. Your application should now contain a `launch.json` file under the `.vscode` directory. In this file, change the `externalConsole` value to `true`.
7. Visual Studio Code allows you to debug .NET Core applications. Hit `F5` to run your application and verify that your setup is working. You should see "Hello World!" printed to the console. 

## Add Data Movement Library to your project

1. Add the latest version of the Data Movement Library to the `dependencies` section of your `project.json` file. At the time of writing, this version would be `"Microsoft.Azure.Storage.DataMovement": "0.5.0"` 
2. Add `"portable-net45+win8"` to the `imports` section. 
3. A prompt should display to restore your project. Click the "restore" button. You can also restore your project from the command line by typing the command `dotnet restore` in the root of your project directory.

Modify `project.json`:

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

## Set up the skeleton of your application
The first thing we do is set up the "skeleton" code of our application. This code prompts us for a Storage account name and account key and uses those credentials to create a `CloudStorageAccount` object. This object is used to interact with our Storage account in all transfer scenarios. The code also prompts us to choose the type of transfer operation we would like to execute. 

Modify `Program.cs`:

```csharp
using System;
using System.Threading;
using System.Diagnostics;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.DataMovement;

namespace DMLibSample
{
    public class Program
    {
        public static void Main()
        {
            Console.WriteLine("Enter Storage account name:");           
            string accountName = Console.ReadLine();

            Console.WriteLine("\nEnter Storage account key:");           
            string accountKey = Console.ReadLine();

            string storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=" + accountName + ";AccountKey=" + accountKey;
            CloudStorageAccount account = CloudStorageAccount.Parse(storageConnectionString);

            executeChoice(account);
        }

        public static void executeChoice(CloudStorageAccount account)
        {
            Console.WriteLine("\nWhat type of transfer would you like to execute?\n1. Local file --> Azure Blob\n2. Local directory --> Azure Blob directory\n3. URL (e.g. Amazon S3 file) --> Azure Blob");
            int choice = int.Parse(Console.ReadLine());

            if(choice == 1)
            {
                transferLocalFileToAzureBlob(account);
            }
            else if(choice == 2)
            {
                transferLocalDirectoryToAzureBlobDirectory(account);
            }
            else if(choice == 3)
            {
                transferUrlToAzureBlob(account);
            }
        }

        public static async void transferLocalFileToAzureBlob(CloudStorageAccount account)
        { 
            
        }

        public static async void transferLocalDirectoryToAzureBlobDirectory(CloudStorageAccount account)
        { 
            
        }

        public static async void transferUrlToAzureBlob(CloudStorageAccount account)
        {

        }
    }
}
```

## Transfer local file to Azure Blob
Add the methods `getSourcePath` and `getBlob` to `Program.cs`:

```csharp
public static string getSourcePath()
{
    Console.WriteLine("\nProvide path for source:");
    string sourcePath = Console.ReadLine();

    return sourcePath;
}

public static CloudBlockBlob getBlob(CloudStorageAccount account)
{
    CloudBlobClient blobClient = account.CreateCloudBlobClient();

    Console.WriteLine("\nProvide name of Blob container. This can be a new or existing Blob container:");
    string containerName = Console.ReadLine();
    CloudBlobContainer container = blobClient.GetContainerReference(containerName);
    container.CreateIfNotExistsAsync().Wait();

    Console.WriteLine("\nProvide name of new Blob:");
    string blobName = Console.ReadLine();
    CloudBlockBlob blob = container.GetBlockBlobReference(blobName);

    return blob;
}
```

Modify the `transferLocalFileToAzureBlob` method:

```csharp
public static async void transferLocalFileToAzureBlob(CloudStorageAccount account
{ 
    string localFilePath = getSourcePath();
    CloudBlockBlob blob = getBlob(account);
    Console.WriteLine("\nTransfer started...");
    TransferManager.UploadAsync(localFilePath, blob).Wait();
    Console.WriteLine("\nTransfer operation complete.");
    executeChoice(account);
}
```

This code prompts us for the path to a local file, the name of a new or existing container, and the name of a new blob. The `TransferManager.UploadAsync` method performs the upload using this information. 

Hit `F5` to run your application. You can verify that the upload occurred by viewing your Storage account with the [Microsoft Azure Storage Explorer](http://storageexplorer.com/).

## Set number of parallel operations
A great feature offered by the Data Movement Library is the ability to set the number of parallel operations to increase the data transfer throughput. By default, the Data Movement Library sets the number of parallel operations to 8 * the number of cores on your machine. 

Keep in mind that many parallel operations in a low-bandwidth environment may overwhelm the network connection and actually prevent operations from fully completing. You'll need to experiment with this setting to determine what works best based on your available network bandwidth. 

Let's add some code that allows us to set the number of parallel operations. Let's also add code that times how long it takes for the transfer to complete.

Add a `setNumberOfParallelOperations` method to `Program.cs`:

```csharp
public static void setNumberOfParallelOperations()
{
    Console.WriteLine("\nHow many parallel operations would you like to use?");
    string parallelOperations = Console.ReadLine();
    TransferManager.Configurations.ParallelOperations = int.Parse(parallelOperations);
}
```

Modify the `executeChoice` method to use `setNumberOfParallelOperations`:

```csharp
public static void executeChoice(CloudStorageAccount account)
{
    Console.WriteLine("\nWhat type of transfer would you like to execute?\n1. Local file --> Azure Blob\n2. Azure Blob --> local file\n3. Azure Blob --> Azure Blob\n4. Local directory --> Azure Blob directory\n5. Azure Blob directory --> local directory\n6. Azure Blob directory --> Azure Blob directory\n7. Public URL (e.g. Public Amazon S3 file) --> Azure Blob");
    int choice = int.Parse(Console.ReadLine());

    setNumberOfParallelOperations();

    if(choice == 1)
    {
        transferLocalFileToAzureBlob(account);
    }
    else if(choice == 2)
    {
        transferLocalDirectoryToAzureBlobDirectory(account);
    }
    else if(choice == 3)
    {
        transferUrlToAzureBlob(account);
    }
}
```

Modify the `transferLocalFileToAzureBlob` method to use a timer:

```csharp
public static async void transferLocalFileToAzureBlob(CloudStorageAccount account)
{ 
    string localFilePath = getSourcePath();
    CloudBlockBlob blob = getBlob(account);
    Console.WriteLine("\nTransfer started...");
    Stopwatch stopWatch = Stopwatch.StartNew();
    TransferManager.UploadAsync(localFilePath, blob).Wait();
    stopWatch.Stop();
    Console.WriteLine("\nTransfer operation completed in " + stopWatch.Elapsed.TotalSeconds + " seconds.");
    executeChoice(account);
}
```

## Track transfer progress
Knowing how long it took for our data to transfer is great. However, being able to see the progress of our transfer *during* the transfer operation would be even better. To achieve this scenario, we need to create a `TransferContext` object. The `TransferContext` object comes in two forms: `SingleTransferContext` and `DirectoryTransferContext`. The former is for transferring a single file (which is what we're doing now) and the latter is for transferring a directory of files (which we are adding later).

Add the methods `getSingleTransferContext` and `getDirectoryTransferContext` to `Program.cs`: 

```csharp
public static SingleTransferContext getSingleTransferContext(TransferCheckpoint checkpoint)
{
    SingleTransferContext context = new SingleTransferContext(checkpoint);

    context.ProgressHandler = new Progress<TransferStatus>((progress) =>
    {
        Console.Write("\rBytes transferred: {0}", progress.BytesTransferred );
    });
    
    return context;
}

public static DirectoryTransferContext getDirectoryTransferContext(TransferCheckpoint checkpoint)
{
    DirectoryTransferContext context = new DirectoryTransferContext(checkpoint);

    context.ProgressHandler = new Progress<TransferStatus>((progress) =>
    {
        Console.Write("\rBytes transferred: {0}", progress.BytesTransferred );
    });
    
    return context;
}
```

Modify the `transferLocalFileToAzureBlob` method to use `getSingleTransferContext`:

```csharp
public static async void transferLocalFileToAzureBlob(CloudStorageAccount account)
{ 
    string localFilePath = getSourcePath();
    CloudBlockBlob blob = getBlob(account);
    TransferCheckpoint checkpoint = null;
    SingleTransferContext context = getSingleTransferContext(checkpoint);
    Console.WriteLine("\nTransfer started...\n");
    Stopwatch stopWatch = Stopwatch.StartNew();
    TransferManager.UploadAsync(localFilePath, blob, null, context).Wait();
    stopWatch.Stop();
    Console.WriteLine("\nTransfer operation completed in " + stopWatch.Elapsed.TotalSeconds + " seconds.");
    executeChoice(account);
}
```

## Resume a canceled transfer
Another convenient feature offered by the Data Movement Library is the ability to resume a canceled transfer. Let's add some code that allows us to temporarily cancel the transfer by typing `c`, and then resume the transfer 3 seconds later.

Modify `transferLocalFileToAzureBlob`:

```csharp
public static async void transferLocalFileToAzureBlob(CloudStorageAccount account)
{ 
    string localFilePath = getSourcePath();
    CloudBlockBlob blob = getBlob(account);
    TransferCheckpoint checkpoint = null;
    SingleTransferContext context = getSingleTransferContext(checkpoint);
    CancellationTokenSource cancellationSource = new CancellationTokenSource();
    Console.WriteLine("\nTransfer started...\nPress 'c' to temporarily cancel your transfer...\n");
    Stopwatch stopWatch = Stopwatch.StartNew();
    Task task;
    ConsoleKeyInfo keyinfo;
    try
    {
        task = TransferManager.UploadAsync(localFilePath, blob, null, context, cancellationSource.Token);
        while(!task.IsCompleted)
        {
            if(Console.KeyAvailable)
            {
                keyinfo = Console.ReadKey(true);
                if(keyinfo.Key == ConsoleKey.C)
                {
                    cancellationSource.Cancel();
                }
            }
        }
        await task;
    }
    catch(Exception e)
    {
        Console.WriteLine("\nThe transfer is canceled: {0}", e.Message);  
    }
    if(cancellationSource.IsCancellationRequested)
    {
        Console.WriteLine("\nTransfer will resume in 3 seconds...");
        Thread.Sleep(3000);
        checkpoint = context.LastCheckpoint;
        context = getSingleTransferContext(checkpoint);
        Console.WriteLine("\nResuming transfer...\n");
        TransferManager.UploadAsync(localFilePath, blob, null, context).Wait(); 
    }
    stopWatch.Stop();
    Console.WriteLine("\nTransfer operation completed in " + stopWatch.Elapsed.TotalSeconds + " seconds.");
    executeChoice(account);
}
```

Up until now, our `checkpoint` value has always been set to `null`. Now, if we cancel the transfer, we retrieve the last checkpoint of our transfer, then use this new checkpoint in our transfer context. 

## Transfer local directory to Azure Blob directory
Now let's add some code that allows us to upload an entire directory (and its subdirectories) to a Blob container.

First, add the method `getBlobDirectory` to `Program.cs`:

```csharp
public static CloudBlobDirectory getBlobDirectory(CloudStorageAccount account)
{
    CloudBlobClient blobClient = account.CreateCloudBlobClient();

    Console.WriteLine("\nProvide name of Blob container. This can be a new or existing Blob container:");
    string containerName = Console.ReadLine();
    CloudBlobContainer container = blobClient.GetContainerReference(containerName);
    container.CreateIfNotExistsAsync().Wait();

    CloudBlobDirectory blobDirectory = container.GetDirectoryReference("");

    return blobDirectory;
}
```

Then, modify `transferLocalDirectoryToAzureBlobDirectory`:

```csharp
public static async void transferLocalDirectoryToAzureBlobDirectory(CloudStorageAccount account)
{ 
    string localDirectoryPath = getSourcePath();
    CloudBlobDirectory blobDirectory = getBlobDirectory(account); 
    TransferCheckpoint checkpoint = null;
    DirectoryTransferContext context = getDirectoryTransferContext(checkpoint); 
    CancellationTokenSource cancellationSource = new CancellationTokenSource();
    Console.WriteLine("\nTransfer started...\nPress 'c' to temporarily cancel your transfer...\n");
    Stopwatch stopWatch = Stopwatch.StartNew();
    Task task;
    ConsoleKeyInfo keyinfo;
    UploadDirectoryOptions options = new UploadDirectoryOptions()
    {
        Recursive = true
    };
    try
    {
        task = TransferManager.UploadDirectoryAsync(localDirectoryPath, blobDirectory, options, context, cancellationSource.Token);
        while(!task.IsCompleted)
        {
            if(Console.KeyAvailable)
            {
                keyinfo = Console.ReadKey(true);
                if(keyinfo.Key == ConsoleKey.C)
                {
                    cancellationSource.Cancel();
                }
            }
        }
        await task;
    }
    catch(Exception e)
    {
        Console.WriteLine("\nThe transfer is canceled: {0}", e.Message);  
    }
    if(cancellationSource.IsCancellationRequested)
    {
        Console.WriteLine("\nTransfer will resume in 3 seconds...");
        Thread.Sleep(3000);
        checkpoint = context.LastCheckpoint;
        context = getDirectoryTransferContext(checkpoint);
        Console.WriteLine("\nResuming transfer...\n");
        TransferManager.UploadDirectoryAsync(localDirectoryPath, blobDirectory, options, context).Wait();
    }
    stopWatch.Stop();
    Console.WriteLine("\nTransfer operation completed in " + stopWatch.Elapsed.TotalSeconds + " seconds.");
    executeChoice(account);
}
```

There are a few differences between this method and the method for uploading a single file. We're now using `TransferManager.UploadDirectoryAsync` and the `getDirectoryTransferContext` method we created earlier. In addition, we now provide an `options` value to our upload operation, which allows us to indicate that we want to include subdirectories in our upload. 

## Copy file from URL to Azure Blob
Finally, let's add code that allows us to copy a file from a URL to an Azure Blob. 

Modify `transferUrlToAzureBlob`:

```csharp
public static async void transferUrlToAzureBlob(CloudStorageAccount account)
{
    Uri uri = new Uri(getSourcePath());
    CloudBlockBlob blob = getBlob(account); 
    TransferCheckpoint checkpoint = null;
    SingleTransferContext context = getSingleTransferContext(checkpoint); 
    CancellationTokenSource cancellationSource = new CancellationTokenSource();
    Console.WriteLine("\nTransfer started...\nPress 'c' to temporarily cancel your transfer...\n");
    Stopwatch stopWatch = Stopwatch.StartNew();
    Task task;
    ConsoleKeyInfo keyinfo;
    try
    {
        task = TransferManager.CopyAsync(uri, blob, true, null, context, cancellationSource.Token);
        while(!task.IsCompleted)
        {
            if(Console.KeyAvailable)
            {
                keyinfo = Console.ReadKey(true);
                if(keyinfo.Key == ConsoleKey.C)
                {
                    cancellationSource.Cancel();
                }
            }
        }
        await task;
    }
    catch(Exception e)
    {
        Console.WriteLine("\nThe transfer is canceled: {0}", e.Message);  
    }
    if(cancellationSource.IsCancellationRequested)
    {
        Console.WriteLine("\nTransfer will resume in 3 seconds...");
        Thread.Sleep(3000);
        checkpoint = context.LastCheckpoint;
        context = getSingleTransferContext(checkpoint);
        Console.WriteLine("\nResuming transfer...\n");
        task = TransferManager.CopyAsync(uri, blob, true, null, context, cancellationSource.Token);
    }
    stopWatch.Stop();
    Console.WriteLine("\nTransfer operation completed in " + stopWatch.Elapsed.TotalSeconds + " seconds.");
    executeChoice(account);
}
```

One important use case for this feature is when you need to move data from another cloud service (e.g. AWS) to Azure. As long as you have a URL that gives you access to the resource, you can easily move that resource into Azure Blobs by using the `TransferManager.CopyAsync` method. This method also introduces a new boolean parameter. Setting this parameter to `true` indicates that we want to do an asynchronous server side copy. Setting this parameter to `false` indicates a synchronous copy - meaning the resource is downloaded to our local machine first, then uploaded to Azure Blob. However, synchronous copy is currently only available for copying from one Azure Storage resource to another. 

## Conclusion
Our data movement application is now complete. [The full code sample is available on GitHub](https://github.com/azure-samples/storage-dotnet-data-movement-library-app). 

## Next steps
In this getting started, we created an application that interacts with Azure Storage and runs on Windows, Linux, and MacOS. This getting started focused on Blob Storage. However, this same knowledge can be applied to File Storage. To learn more, check out [Azure Storage Data Movement Library reference documentation](https://azure.github.io/azure-storage-net-data-movement).

[!INCLUDE [storage-try-azure-tools-blobs](../../includes/storage-try-azure-tools-blobs.md)]




