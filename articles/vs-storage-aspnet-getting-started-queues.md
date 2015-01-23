<properties title="" pageTitle="Getting Started with Azure Storage" metaKeywords="Azure, Getting Started, Storage" description="" services="storage" documentationCenter="" authors="kempb" manager="douge" editor=""/>

<tags ms.service="storage" ms.workload="web" ms.tgt_pltfrm="vs-getting-started" ms.devlang="na" ms.topic="article" ms.date="10/10/2014" ms.author="kempb" />

> [AZURE.SELECTOR]
> - [Getting Started](/documentation/articles/vs-storage-aspnet-getting-started-queues/)
> - [What Happened](/documentation/articles/vs-storage-aspnet-what-happened/)

## Getting Started with Azure Storage (ASP.NET Projects)

> [AZURE.SELECTOR]
> - [Blobs](/documentation/articles/vs-storage-aspnet-getting-started-blobs/)
> - [Queues](/documentation/articles/vs-storage-aspnet-getting-started-queues/)
> - [Tables](/documentation/articles/vs-storage-aspnet-getting-started-tables/)

Azure queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message can be up to 64 KB in size, and a queue can contain millions of messages, up to the total capacity limit of a storage account. See [How to use Queue Storage from .NET](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-queues/) for more information.

Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access Azure Storage.

	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage.Queue;

#####Get the storage connection string
Before you can do anything with a queue, you need to get the connection string for the storage account the queues will live in. You can use the **CloudStorageAccount** type to represent your storage account information. For ASP.NET projects, you can you use the **ConfigurationManager** type to retrieve your storage connection string and storage account information from the Azure service configuration, as shown in the following code.

	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
      ConfigurationManager.GetSetting("<storageAccountName>_AzureStorageConnectionString"));

[AZURE.INCLUDE [vs-storage-getting-started-queues-include](../includes/vs-storage-getting-started-queues-include.md)]

For more information, see [ASP.NET](http://www.asp.net).