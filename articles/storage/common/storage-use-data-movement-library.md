---
title: Transfer data with the Data Movement library for .NET
titleSuffix: Azure Storage
description: Use the Data Movement library to move or copy data to or from blob and file content. Copy data to Azure Storage from local files, or copy data within or between storage accounts. Easily migrate your data to Azure Storage.
services: storage
author: tamram

ms.service: storage
ms.devlang: dotnet
ms.topic: how-to
ms.date: 12/04/2019
ms.author: tamram
ms.subservice: common
---

# Transfer data with the Data Movement library

The Azure Storage Data Movement library is a cross-platform open source library that is designed for high performance uploading, downloading, and copying of blobs and files. This library is the core data movement framework that powers [AzCopy](../storage-use-azcopy.md). The Data Movement library provides convenient methods that aren't available in the Azure Storage client library for .NET. These methods provide the ability to set the number of parallel operations, track transfer progress, easily resume a canceled transfer, and much more.

This library also uses .NET Core, which means you can use it when building .NET apps for Windows, Linux and macOS. To learn more about .NET Core, refer to the [.NET Core documentation](https://dotnet.github.io/). This library also works for traditional .NET Framework apps for Windows.

This document demonstrates how to create a .NET Core console application that runs on Windows, Linux, and macOS and performs the following scenarios:

- Upload files and directories to Blob Storage.
- Define the number of parallel operations when transferring data.
- Track data transfer progress.
- Resume canceled data transfer.
- Copy file from URL to Blob Storage.
- Copy from Blob Storage to Blob Storage.

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- An [Azure storage account](storage-account-create.md)

## Setup

1. Visit the [.NET Core Installation Guide](https://www.microsoft.com/net/core) to install .NET Core. When selecting your environment, choose the command-line option.
2. From the command line, create a directory for your project. Navigate into this directory, then type `dotnet new console -o <sample-project-name>` to create a C# console project.
3. Open this directory in Visual Studio Code. This step can be quickly done via the command line by typing `code .` in Windows.
4. Install the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) from the Visual Studio Code Marketplace. Restart Visual Studio Code.
5. At this point, you should see two prompts. One is for adding "required assets to build and debug." Click "yes." Another prompt is for restoring unresolved dependencies. Click "restore."
6. Modify `launch.json` under `.vscode` to use external terminal as a console. This setting should read as `"console": "externalTerminal"`
7. Visual Studio Code allows you to debug .NET Core applications. Hit `F5` to run your application and verify that your setup is working. You should see "Hello World!" printed to the console.

## Add the Data Movement library to your project

1. Add the latest version of the Data Movement library to the `dependencies` section of your `<project-name>.csproj` file. At the time of writing, this version would be `"Microsoft.Azure.Storage.DataMovement": "0.6.2"`
2. A prompt should display to restore your project. Click the "restore" button. You can also restore your project from the command line by typing the command `dotnet restore` in the root of your project directory.

Modify `<project-name>.csproj`:

```xml
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <OutputType>Exe</OutputType>
        <TargetFramework>netcoreapp2.0</TargetFramework>
    </PropertyGroup>
    <ItemGroup>
        <PackageReference Include="Microsoft.Azure.Storage.DataMovement" Version="0.6.2" />
        </ItemGroup>
    </Project>
```

## Set up the skeleton of your application

The first thing we do is set up the "skeleton" code of our application. This code prompts us for a Storage account name and account key and uses those credentials to create a `CloudStorageAccount` object. This object is used to interact with our Storage account in all transfer scenarios. The code also prompts us to choose the type of transfer operation we would like to execute.

Modify `Program.cs`:

```csharp
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using Microsoft.Azure.Storage.DataMovement;

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

            ExecuteChoice(account);
        }

        public static void ExecuteChoice(CloudStorageAccount account)
        {
            Console.WriteLine("\nWhat type of transfer would you like to execute?\n1. Local file --> Azure Blob\n2. Local directory --> Azure Blob directory\n3. URL (e.g. Amazon S3 file) --> Azure Blob\n4. Azure Blob --> Azure Blob");
            int choice = int.Parse(Console.ReadLine());

            if(choice == 1)
            {
                TransferLocalFileToAzureBlob(account).Wait();
            }
            else if(choice == 2)
            {
                TransferLocalDirectoryToAzureBlobDirectory(account).Wait();
            }
            else if(choice == 3)
            {
                TransferUrlToAzureBlob(account).Wait();
            }
            else if(choice == 4)
            {
                TransferAzureBlobToAzureBlob(account).Wait();
            }
        }

        public static async Task TransferLocalFileToAzureBlob(CloudStorageAccount account)
        {

        }

        public static async Task TransferLocalDirectoryToAzureBlobDirectory(CloudStorageAccount account)
        {

        }

        public static async Task TransferUrlToAzureBlob(CloudStorageAccount account)
        {

        }

        public static async Task TransferAzureBlobToAzureBlob(CloudStorageAccount account)
        {

        }
    }
}
```

## Upload a local file to a blob

Add the methods `GetSourcePath` and `GetBlob` to `Program.cs`:

```csharp
public static string GetSourcePath()
{
    Console.WriteLine("\nProvide path for source:");
    string sourcePath = Console.ReadLine();

    return sourcePath;
}

public static CloudBlockBlob GetBlob(CloudStorageAccount account)
{
    CloudBlobClient blobClient = account.CreateCloudBlobClient();

    Console.WriteLine("\nProvide name of Blob container:");
    string containerName = Console.ReadLine();
    CloudBlobContainer container = blobClient.GetContainerReference(containerName);
    container.CreateIfNotExistsAsync().Wait();

    Console.WriteLine("\nProvide name of new Blob:");
    string blobName = Console.ReadLine();
    CloudBlockBlob blob = container.GetBlockBlobReference(blobName);

    return blob;
}
```

Modify the `TransferLocalFileToAzureBlob` method:

```csharp
public static async Task TransferLocalFileToAzureBlob(CloudStorageAccount account)
{
    string localFilePath = GetSourcePath();
    CloudBlockBlob blob = GetBlob(account);
    Console.WriteLine("\nTransfer started...");
    await TransferManager.UploadAsync(localFilePath, blob);
    Console.WriteLine("\nTransfer operation complete.");
    ExecuteChoice(account);
}
```

This code prompts us for the path to a local file, the name of a new or existing container, and the name of a new blob. The `TransferManager.UploadAsync` method performs the upload using this information.

Hit `F5` to run your application. You can verify that the upload occurred by viewing your Storage account with the [Microsoft Azure Storage Explorer](https://storageexplorer.com/).

## Set the number of parallel operations

One feature offered by the Data Movement library is the ability to set the number of parallel operations to increase the data transfer throughput. By default, the Data Movement library sets the number of parallel operations to 8 * the number of cores on your machine.

Keep in mind that many parallel operations in a low-bandwidth environment may overwhelm the network connection and actually prevent operations from fully completing. You'll need to experiment with this setting to determine what works best based on your available network bandwidth.

Let's add some code that allows us to set the number of parallel operations. Let's also add code that times how long it takes for the transfer to complete.

Add a `SetNumberOfParallelOperations` method to `Program.cs`:

```csharp
public static void SetNumberOfParallelOperations()
{
    Console.WriteLine("\nHow many parallel operations would you like to use?");
    string parallelOperations = Console.ReadLine();
    TransferManager.Configurations.ParallelOperations = int.Parse(parallelOperations);
}
```

Modify the `ExecuteChoice` method to use `SetNumberOfParallelOperations`:

```csharp
public static void ExecuteChoice(CloudStorageAccount account)
{
    Console.WriteLine("\nWhat type of transfer would you like to execute?\n1. Local file --> Azure Blob\n2. Local directory --> Azure Blob directory\n3. URL (e.g. Amazon S3 file) --> Azure Blob\n4. Azure Blob --> Azure Blob");
    int choice = int.Parse(Console.ReadLine());

    SetNumberOfParallelOperations();

    if(choice == 1)
    {
        TransferLocalFileToAzureBlob(account).Wait();
    }
    else if(choice == 2)
    {
        TransferLocalDirectoryToAzureBlobDirectory(account).Wait();
    }
    else if(choice == 3)
    {
        TransferUrlToAzureBlob(account).Wait();
    }
    else if(choice == 4)
    {
        TransferAzureBlobToAzureBlob(account).Wait();
    }
}
```

Modify the `TransferLocalFileToAzureBlob` method to use a timer:

```csharp
public static async Task TransferLocalFileToAzureBlob(CloudStorageAccount account)
{
    string localFilePath = GetSourcePath();
    CloudBlockBlob blob = GetBlob(account);
    Console.WriteLine("\nTransfer started...");
    Stopwatch stopWatch = Stopwatch.StartNew();
    await TransferManager.UploadAsync(localFilePath, blob);
    stopWatch.Stop();
    Console.WriteLine("\nTransfer operation completed in " + stopWatch.Elapsed.TotalSeconds + " seconds.");
    ExecuteChoice(account);
}
```

## Track transfer progress

Knowing how long it took for the data to transfer is helpful. However, being able to see the progress of the transfer *during* the transfer operation would be even better. To achieve this scenario, we need to create a `TransferContext` object. The `TransferContext` object comes in two forms: `SingleTransferContext` and `DirectoryTransferContext`. The former is for transferring a single file and the latter is for transferring a directory of files.

Add the methods `GetSingleTransferContext` and `GetDirectoryTransferContext` to `Program.cs`:

```csharp
public static SingleTransferContext GetSingleTransferContext(TransferCheckpoint checkpoint)
{
    SingleTransferContext context = new SingleTransferContext(checkpoint);

    context.ProgressHandler = new Progress<TransferStatus>((progress) =>
    {
        Console.Write("\rBytes transferred: {0}", progress.BytesTransferred );
    });

    return context;
}

public static DirectoryTransferContext GetDirectoryTransferContext(TransferCheckpoint checkpoint)
{
    DirectoryTransferContext context = new DirectoryTransferContext(checkpoint);

    context.ProgressHandler = new Progress<TransferStatus>((progress) =>
    {
        Console.Write("\rBytes transferred: {0}", progress.BytesTransferred );
    });

    return context;
}
```

Modify the `TransferLocalFileToAzureBlob` method to use `GetSingleTransferContext`:

```csharp
public static async Task TransferLocalFileToAzureBlob(CloudStorageAccount account)
{
    string localFilePath = GetSourcePath();
    CloudBlockBlob blob = GetBlob(account);
    TransferCheckpoint checkpoint = null;
    SingleTransferContext context = GetSingleTransferContext(checkpoint);
    Console.WriteLine("\nTransfer started...\n");
    Stopwatch stopWatch = Stopwatch.StartNew();
    await TransferManager.UploadAsync(localFilePath, blob, null, context);
    stopWatch.Stop();
    Console.WriteLine("\nTransfer operation completed in " + stopWatch.Elapsed.TotalSeconds + " seconds.");
    ExecuteChoice(account);
}
```

## Resume a canceled transfer

Another convenient feature offered by the Data Movement library is the ability to resume a canceled transfer. Let's add some code that allows us to temporarily cancel the transfer by typing `c`, and then resume the transfer 3 seconds later.

Modify `TransferLocalFileToAzureBlob`:

```csharp
public static async Task TransferLocalFileToAzureBlob(CloudStorageAccount account)
{
    string localFilePath = GetSourcePath();
    CloudBlockBlob blob = GetBlob(account);
    TransferCheckpoint checkpoint = null;
    SingleTransferContext context = GetSingleTransferContext(checkpoint);
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
        context = GetSingleTransferContext(checkpoint);
        Console.WriteLine("\nResuming transfer...\n");
        await TransferManager.UploadAsync(localFilePath, blob, null, context);
    }

    stopWatch.Stop();
    Console.WriteLine("\nTransfer operation completed in " + stopWatch.Elapsed.TotalSeconds + " seconds.");
    ExecuteChoice(account);
}
```

Up until now, our `checkpoint` value has always been set to `null`. Now, if we cancel the transfer, we retrieve the last checkpoint of our transfer, then use this new checkpoint in our transfer context.

## Transfer a local directory to Blob storage

It would be disappointing if the Data Movement library could only transfer one file at a time. Luckily, this is not the case. The Data Movement library provides the ability to transfer a directory of files and all of its subdirectories. Let's add some code that allows us to do just that.

First, add the method `GetBlobDirectory` to `Program.cs`:

```csharp
public static CloudBlobDirectory GetBlobDirectory(CloudStorageAccount account)
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

Then, modify `TransferLocalDirectoryToAzureBlobDirectory`:

```csharp
public static async Task TransferLocalDirectoryToAzureBlobDirectory(CloudStorageAccount account)
{
    string localDirectoryPath = GetSourcePath();
    CloudBlobDirectory blobDirectory = GetBlobDirectory(account);
    TransferCheckpoint checkpoint = null;
    DirectoryTransferContext context = GetDirectoryTransferContext(checkpoint);
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
        context = GetDirectoryTransferContext(checkpoint);
        Console.WriteLine("\nResuming transfer...\n");
        await TransferManager.UploadDirectoryAsync(localDirectoryPath, blobDirectory, options, context);
    }

    stopWatch.Stop();
    Console.WriteLine("\nTransfer operation completed in " + stopWatch.Elapsed.TotalSeconds + " seconds.");
    ExecuteChoice(account);
}
```

There are a few differences between this method and the method for uploading a single file. We're now using `TransferManager.UploadDirectoryAsync` and the `getDirectoryTransferContext` method we created earlier. In addition, we now provide an `options` value to our upload operation, which allows us to indicate that we want to include subdirectories in our upload.

## Copy a file from URL to a blob

Now, let's add code that allows us to copy a file from a URL to an Azure Blob.

Modify `TransferUrlToAzureBlob`:

```csharp
public static async Task TransferUrlToAzureBlob(CloudStorageAccount account)
{
    Uri uri = new Uri(GetSourcePath());
    CloudBlockBlob blob = GetBlob(account);
    TransferCheckpoint checkpoint = null;
    SingleTransferContext context = GetSingleTransferContext(checkpoint);
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
        context = GetSingleTransferContext(checkpoint);
        Console.WriteLine("\nResuming transfer...\n");
        await TransferManager.CopyAsync(uri, blob, true, null, context, cancellationSource.Token);
    }

    stopWatch.Stop();
    Console.WriteLine("\nTransfer operation completed in " + stopWatch.Elapsed.TotalSeconds + " seconds.");
    ExecuteChoice(account);
}
```

One important use case for this feature is when you need to move data from another cloud service (e.g. AWS) to Azure. As long as you have a URL that gives you access to the resource, you can easily move that resource into Azure Blobs by using the `TransferManager.CopyAsync` method. This method also introduces a new boolean parameter. Setting this parameter to `true` indicates that we want to do an asynchronous server-side copy. Setting this parameter to `false` indicates a synchronous copy - meaning the resource is downloaded to our local machine first, then uploaded to Azure Blob. However, synchronous copy is currently only available for copying from one Azure Storage resource to another.

## Copy a blob

Another feature that's uniquely provided by the Data Movement library is the ability to copy from one Azure Storage resource to another.

Modify `TransferAzureBlobToAzureBlob`:

```csharp
public static async Task TransferAzureBlobToAzureBlob(CloudStorageAccount account)
{
    CloudBlockBlob sourceBlob = GetBlob(account);
    CloudBlockBlob destinationBlob = GetBlob(account);
    TransferCheckpoint checkpoint = null;
    SingleTransferContext context = GetSingleTransferContext(checkpoint);
    CancellationTokenSource cancellationSource = new CancellationTokenSource();
    Console.WriteLine("\nTransfer started...\nPress 'c' to temporarily cancel your transfer...\n");

    Stopwatch stopWatch = Stopwatch.StartNew();
    Task task;
    ConsoleKeyInfo keyinfo;
    try
    {
        task = TransferManager.CopyAsync(sourceBlob, destinationBlob, true, null, context, cancellationSource.Token);
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
        context = GetSingleTransferContext(checkpoint);
        Console.WriteLine("\nResuming transfer...\n");
        await TransferManager.CopyAsync(sourceBlob, destinationBlob, false, null, context, cancellationSource.Token);
    }

    stopWatch.Stop();
    Console.WriteLine("\nTransfer operation completed in " + stopWatch.Elapsed.TotalSeconds + " seconds.");
    ExecuteChoice(account);
}
```

In this example, we set the boolean parameter in `TransferManager.CopyAsync` to `false` to indicate that we want to do a synchronous copy. This means that the resource is downloaded to our local machine first, then uploaded to Azure Blob. The synchronous copy option is a great way to ensure that your copy operation has a consistent speed. In contrast, the speed of an asynchronous server-side copy is dependent on the available network bandwidth on the server, which can fluctuate. However, synchronous copy may generate additional egress cost compared to asynchronous copy. The recommended approach is to use synchronous copy in an Azure VM that is in the same region as your source storage account to avoid egress cost.

The data movement application is now complete. [The full code sample is available on GitHub](https://github.com/azure-samples/storage-dotnet-data-movement-library-app).

## Next steps

[Azure Storage Data Movement library reference documentation](https://azure.github.io/azure-storage-net-data-movement).

[!INCLUDE [storage-try-azure-tools-blobs](../../../includes/storage-try-azure-tools-blobs.md)]
