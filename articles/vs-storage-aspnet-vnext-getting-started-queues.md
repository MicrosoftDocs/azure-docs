<properties title="Getting Started with Azure Storage" pageTitle="Getting Started with Azure Storage" metaKeywords="Azure, Getting Started, Storage" description="" services="storage" documentationCenter="" authors="ghogen, kempb" />

<tags ms.service="storage" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/10/2014" ms.author="ghogen, kempb" />

> [AZURE.SELECTOR]
> - [Getting Started](/documentation/articles/vs-storage-aspnet-vnext-getting-started-queues/)
> - [What Happened](/documentation/articles/vs-storage-aspnet-vnext-what-happened/)

## Getting Started with Azure Storage (ASP.NET vNext Projects)

> [AZURE.SELECTOR]
> - [Blobs](/documentation/articles/vs-storage-aspnet-vnext-getting-started-blobs/)
> - [Queues](/documentation/articles/vs-storage-aspnet-vnext-getting-started-queues/)
> - [Tables](/documentation/articles/vs-storage-aspnet-vnext-getting-started-tables/)

Azure queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message can be up to 64 KB in size, and a queue can contain millions of messages, up to the total capacity limit of a storage account. See [How to use Queue Storage from .NET](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-queues/ "How to use Queue Storage from .NET") for more information.

To programmatically access queues in ASP.NET vNext projects, you need to do the following tasks.

1. Add the following code namespace declaration to the top of any C# file in which you wish to programmatically access Azure Storage.

		using Microsoft.Framework.ConfigurationModel;

2. Use the following code to get the configuration setting.

		var config = new Configuration();
		config.AddJsonFile("config.json");

#####Get the storage connection string
Before you can do anything with a queue, you need to get the connection string for the storage account the queues will live in. You can use the **CloudStorageAccount** type to represent your storage account information. If you’re using an ASP.NET vNext project, you can you call the get method of the Configuration object to get your storage connection string and storage account information from the Azure service configuration, as shown in the following code.

	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
      config.Get("MicrosoftAzureStorage:<storageAccountName>_AzureStorageConnectionString"));

[WACOM.INCLUDE [vs-storage-getting-started-queues-include](../includes/vs-storage-getting-started-queues-include.md)]

For more information, see [ASP.NET vNext](http://www.asp.net/vnext).