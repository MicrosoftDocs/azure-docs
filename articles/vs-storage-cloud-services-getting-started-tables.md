<properties title="Getting Started with Azure Storage" pageTitle="Getting Started with Azure Storage" metaKeywords="Azure, Getting Started, Storage" description="" services="storage" documentationCenter="" authors="ghogen, kempb" />

<tags ms.service="storage" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/17/2014" ms.author="ghogen, kempb" />

[WACOM.INCLUDE [vs-storage-cloud-services-getting-started-intro](../includes/vs-storage-cloud-services-getting-started-intro.md)]

### Getting Started with Azure Storage

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/vs-storage-cloud-services-getting-started-blobs" title="Blobs" class="current">Blobs</a><a href="/en-us/documentation/articles/vs-storage-cloud-services-getting-started-queues" title="Queues">Queues</a><a href="/en-us/documentation/articles/vs-storage-cloud-services-getting-started-tables" title="Tables">Tables</a></div>

The Azure Table storage service enables you to store large amounts of structured data. The service is a NoSQL datastore that accepts authenticated calls from inside and outside the Azure cloud. Azure tables are ideal for storing structured, non-relational data.  See [How to use Table Storage from .NET](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-tables/#create-table "How to use Table Storage from .NET") for more information.

To programmatically access tables in a cloud service project, you need to do the following tasks.

1.	Get the Microsoft.WindowsAzure.Storage.dll assembly. You can use NuGet to do this. Right-click your project in Solution Explorer and choose Manage NuGet Packages. Search online for "WindowsAzure.Storage" and click Install to install the Azure Storage package and dependencies. Add a reference to this assembly to your project.
2.	Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access Azure Storage.

	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage.Queue;

######Get the storage connection string
Before you can do anything with a table, you need to get the connection string for the storage account the tables will live in. You can use the **CloudStorageAccount** type to represent your storage account information. For cloud service projects, you can you use the **CloudConfigurationManager** type to retrieve your storage connection string and storage account information from the Azure service configuration, as shown in the following code.

	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
      CloudConfigurationManager.GetSetting("<storageAccountName>_AzureStorageConnectionString"));

[WACOM.INCLUDE [vs-storage-getting-started-tables-include](../includes/vs-storage-getting-started-tables-include.md)]
