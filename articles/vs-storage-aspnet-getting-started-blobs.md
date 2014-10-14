<properties title="Getting Started with Azure Storage" pageTitle="Getting Started with Azure Storage" metaKeywords="Azure, Getting Started, Storage" description="" services="storage" documentationCenter="" authors="ghogen, kempb" />

<tags ms.service="storage" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/10/2014" ms.author="ghogen, kempb" />

## Getting Started with Azure Storage

[WACOM.INCLUDE [vs-storage-aspnet-getting-started-intro](../includes/vs-storage-aspnet-getting-started-intro.md)]

### Getting Started

> [AZURE.SELECTOR]
> - [Blobs](/en-us/documentation/articles/vs-storage-aspnet-getting-started-blobs)
> - [Queues](/en-us/documentation/articles/vs-storage-aspnet-getting-started-queues)
> - [Tables](/en-us/documentation/articles/vs-storage-aspnet-getting-started-tables)

Azure Blob storage is a service for storing large amounts of unstructured data that can be accessed from anywhere in the world via HTTP or HTTPS. A single blob can be any size. Blobs can be things like images, audio and video files, raw data, and document files.

To get started, you need to create an Azure storage account and then create one or more containers in the storage. For example, you could make a storage called “Scrapbook,” then create containers in the storage called “images” to store pictures and another called “audio” to store audio files. After you create the containers, you can upload individual blob files to them. See [How to use Blob Storage from .NET](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-blobs/ "How to use Blob Storage from .NET") for more information on programmatically manipulating blobs.

Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access Azure Storage.
	
	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage.Blob;

#####Get the storage connection string
Before you can do anything with a blob, you need to get the connection string for the storage account the blobs will live in. You can use the **CloudStorageAccount** type to represent your storage account information. For ASP.NET projects, you can you use the **ConfigurationManager** type to retrieve your storage connection string and storage account information from the Azure service configuration, as shown in the following code.

	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
      ConfigurationManager.GetSetting("<storageAccountName>_AzureStorageConnectionString"));

[WACOM.INCLUDE [vs-storage-getting-started-blobs-include](../includes/vs-storage-getting-started-blobs-include.md)]
