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
ms.date: 01/20/2017
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
- Resume cancelled data transfer.
- Set access condition.
- Set user agent suffix. 

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

## Set up skeleton of your application
The first thing we'll do is set up a "skeleton" of our application. This application will prompt us for a Storage account name and account key and use those credentials to create a `CloudStorageAccount` object. This object will be used to interact with our Storage account in all transfer scenarios. The application will then prompt us to choose the type of transfer operation we would like to execute. 

`Program.cs` should look like the following:

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
            Console.WriteLine("Enter Storage account name:");           
            string accountName = Console.ReadLine();

            Console.WriteLine("Enter Storage account key:");           
            string accountKey = Console.ReadLine();

            string storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=" + accountName + ";AccountKey=" + accountKey;
            CloudStorageAccount account = CloudStorageAccount.Parse(storageConnectionString);

            Console.WriteLine("What type of transfer would you like to execute?\n1.  Local file --> Azure Blob\n2.  Azure Blob --> local file\n3.  Azure Blob --> Azure Blob\n4.  Local directory --> Azure Blob directory\n5.  Azure Blob directory --> local directory\n6.  Azure Blob directory --> Azure Blob directory\n7.  Local file --> Azure File\n8.  Azure File --> local file \n9.  Azure File --> Azure File\n10. Local directory --> Azure File directory\n11. Azure File directory --> local directory\n12. Azure File directory --> Azure File directory\n13. Public URL (e.g. Public Amazon S3 file) --> Azure Blob");
            string choice = Console.ReadLine();
            executeChoice(choice, account);
        }

        public static void executeChoice(string choice, CloudStorageAccount account){
            if(choice == "1"){
                transferLocalFileToAzureBlob(account);
            }
            else if(choice == "2"){
                transferAzureBlobToLocalFile(account);
            }
            else if(choice == "3"){
                transferAzureBlobToAzureBlob(account);
            }
            else if(choice == "4"){
                transferLocalDirectoryToAzureBlobDirectory(account);
            }
            else if(choice == "5"){
                transferAzureBlobDirectoryToLocalDirectory(account);
            }
            else if(choice == "6"){
                transferAzureBlobDirectoryToAzureBlobDirectory(account);
            }
            else if(choice == "7"){
                transferLocalFileToAzureFile(account);
            }
            else if(choice == "8"){
                transferAzureFileToLocalFile(account);
            }
            else if(choice == "9"){
                transferAzureFileToAzureFile(account);
            }
            else if(choice == "10"){
                transferLocalDirectoryToAzureFileDirectory(account);
            }
            else if(choice == "11"){
                transferAzureFileDirectoryToLocalDirectory(account);
            }
            else if(choice == "12"){
                transferAzureFileDirectoryToAzureFileDirectory(account);
            }
            else if(choice == "13"){
                transferPublicUrlToAzureBlob(account);
            }
        }

        public static void transferLocalFileToAzureBlob(CloudStorageAccount account){ 
            
        }

        public static void transferAzureBlobToLocalFile(CloudStorageAccount account){ 
            
        }

        public static void transferAzureBlobToAzureBlob(CloudStorageAccount account){ 
            
        }

        public static void transferLocalDirectoryToAzureBlobDirectory(CloudStorageAccount account){ 
            
        }

        public static void transferAzureBlobDirectoryToLocalDirectory(CloudStorageAccount account){ 
            
        }

        public static void transferAzureBlobDirectoryToAzureBlobDirectory(CloudStorageAccount account){ 
            
        }

        public static void transferLocalFileToAzureFile(CloudStorageAccount account){ 
            
        }

        public static void transferAzureFileToLocalFile(CloudStorageAccount account){ 
            
        }

        public static void transferAzureFileToAzureFile(CloudStorageAccount account){ 
            
        }

        public static void transferLocalDirectoryToAzureFileDirectory(CloudStorageAccount account){ 
            
        }

        public static void transferAzureFileDirectoryToLocalDirectory(CloudStorageAccount account){ 
            
        }

        public static void transferAzureFileDirectoryToAzureFileDirectory(CloudStorageAccount account){ 
            
        }

        public static void transferPublicUrlToAzureBlob(CloudStorageAccount account){
            
        }
    }
}
```

## Next steps
In this getting started, you learned how to create an application that interacts with Azure Storage and runs on Windows, Linux and MacOS. Please check out [Azure Storage Data Movement Library reference documentation](https://azure.github.io/azure-storage-net-data-movement) to learn more.

[!INCLUDE [storage-try-azure-tools-blobs](../../includes/storage-try-azure-tools-blobs.md)]








