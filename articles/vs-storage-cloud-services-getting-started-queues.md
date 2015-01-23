<properties pageTitle="Getting Started with Azure Storage" description="" services="storage" documentationCenter="" authors="kempb" manager="douge" editor=""/>

<tags ms.service="storage" ms.workload="web" ms.tgt_pltfrm="vs-getting-started" ms.devlang="na" ms.topic="article" ms.date="10/10/2014" ms.author="kempb"/>

> [AZURE.SELECTOR]
> - [Getting Started](/documentation/articles/vs-storage-cloud-services-getting-started-queues/)
> - [What Happened](/documentation/articles/vs-storage-cloud-services-what-happened/)

## Getting Started with Azure Storage (Cloud Service projects)

> [AZURE.SELECTOR]
> - [Blobs](/documentation/articles/vs-storage-cloud-services-getting-started-blobs)
> - [Queues](/documentation/articles/vs-storage-cloud-services-getting-started-queues/)
> - [Tables](/documentation/articles/vs-storage-cloud-services-getting-started-tables/)

Azure queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message can be up to 64 KB in size, and a queue can contain millions of messages, up to the total capacity limit of a storage account. See [How to use Queue Storage from .NET](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-queues/ "How to use Queue Storage from .NET") for more information.

Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access Azure Storage.

	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage.Queue;

#####Get the storage connection string
Before you can do anything with a queue, you need to get the connection string for the storage account the queue will live in. You can use the **CloudStorageAccount** type to represent your storage account information. For cloud service projects, you can you use the **CloudConfigurationManager** type to retrieve your storage connection string and storage account information from the Azure service configuration, as shown in the following code.

	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
      CloudConfigurationManager.GetSetting("<storageAccountName>_AzureStorageConnectionString"));

[WACOM.INCLUDE [vs-storage-getting-started-queues-include](../includes/vs-storage-getting-started-queues-include.md)]

