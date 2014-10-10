<properties title="Getting Started with Azure Storage" pageTitle="Getting Started with Azure Storage" metaKeywords="Azure, Getting Started, Storage" description="" services="storage" documentationCenter="" authors="ghogen, kempb" />

<tags ms.service="storage" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/10/2014" ms.author="ghogen, kempb" />

[WACOM.INCLUDE [vs-storage-aspnet-getting-started-intro](../includes/vs-storage-aspnet-getting-started-intro.md)]

### Getting Started with Azure Storage
<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/vs-storage-cloud-services-getting-started-blobs" title="Blobs" class="current">Blobs</a><a href="/en-us/documentation/articles/vs-storage-cloud-services-getting-started-queues" title="Queues">Queues</a><a href="/en-us/documentation/articles/vs-storage-cloud-services-getting-started-tables" title="Tables">Tables</a></div>

Azure queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message can be up to 64 KB in size, and a queue can contain millions of messages, up to the total capacity limit of a storage account. See [How to use Queue Storage from .NET](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-queues/ "How to use Queue Storage from .NET") for more information.

To programmatically access queues in a cloud service project, you need to do the following tasks.

1.	Get the Microsoft.WindowsAzure.Storage.dll assembly. You can use NuGet to do this. Right-click your project in Solution Explorer and choose Manage NuGet Packages. Search online for "WindowsAzure.Storage" and click Install to install the Azure Storage package and dependencies. Add a reference to this assembly to your project.
2.	Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access Azure Storage.

	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage.Queue;

######Get the storage connection string
Before you can do anything with a queue, you need to get the connection string for the storage account the queue will live in. You can use the **CloudStorageAccount** type to represent your storage account information. For cloud service projects, you can you use the **CloudConfigurationManager** type to retrieve your storage connection string and storage account information from the Azure service configuration, as shown in the following code.

	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
      CloudConfigurationManager.GetSetting("<storageAccountName>_AzureStorageConnectionString"));

[WACOM.INCLUDE [vs-storage-getting-started-queues-include](../includes/vs-storage-getting-started-queues-include.md)]
