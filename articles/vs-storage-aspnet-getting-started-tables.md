<properties title="" pageTitle="Getting Started with Azure Storage" metaKeywords="Azure, Getting Started, Storage" description="" services="storage" documentationCenter="" authors="kempb" manager="douge" editor=""/>

<tags ms.service="storage" ms.workload="web" ms.tgt_pltfrm="vs-getting-started" ms.devlang="na" ms.topic="article" ms.date="09/17/2014" ms.author="kempb" />

> [AZURE.SELECTOR]
> - [Getting Started](/documentation/articles/vs-storage-aspnet-getting-started-tables/)
> - [What Happened](/documentation/articles/vs-storage-aspnet-what-happened/)

## Getting Started with Azure Storage (ASP.NET Projects)

> [AZURE.SELECTOR]
> - [Blobs](/documentation/articles/vs-storage-aspnet-getting-started-blobs/)
> - [Queues](/documentation/articles/vs-storage-aspnet-getting-started-queues/)
> - [Tables](/documentation/articles/vs-storage-aspnet-getting-started-tables/)

The Azure Table storage service enables you to store large amounts of structured data. The service is a NoSQL datastore that accepts authenticated calls from inside and outside the Azure cloud. Azure tables are ideal for storing structured, non-relational data.  See [How to use Table Storage from .NET](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-tables/#create-table "How to use Table Storage from .NET") for more information.

Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access Azure Storage.

	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage.Table;

#####Get the storage connection string
Before you can do anything with a table, you need to get the connection string for the storage account the tables will live in. You can use the **CloudStorageAccount** type to represent your storage account information. For ASP.NET projects, you can you use the **ConfigurationManager** type to retrieve your storage connection string and storage account information from the Azure service configuration, as shown in the following code.

	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
      ConfigurationManager.GetSetting("<storageAccountName>_AzureStorageConnectionString"));

[WACOM.INCLUDE [vs-storage-getting-started-tables-include](../includes/vs-storage-getting-started-tables-include.md)]

For more information, see [ASP.NET](http://www.asp.net).
