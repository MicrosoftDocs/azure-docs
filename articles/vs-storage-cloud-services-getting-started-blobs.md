<properties title="Getting Started with Azure Storage" pageTitle="Getting Started with Azure Storage" metaKeywords="Azure, Getting Started, Storage" description="" services="storage" documentationCenter="" authors="ghogen, kempb" />

<tags ms.service="storage" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/9/2014" ms.author="ghogen, kempb" />

[WACOM.INCLUDE [vs-storage-dotnet-getting-started-intro](../includes/vs-storage-dotnet-getting-started-intro.md)]

# Getting Started with Azure Storage

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/vs-storage-dotnet-getting-started-blobs" title="Blobs" class="current">Blobs</a><a href="/en-us/documentation/articles/vs-storage-dotnet-getting-started-queues" title="Queues">Queues</a><a href="/en-us/documentation/articles/vs-storage-dotnet-getting-started-tables" title="Tables">Tables</a></div>

<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/web-sites-custom-domain-name/" title="Websites" class="current">Website</a> | <a href="/en-us/documentation/articles/web-sites-traffic-manager-custom-domain-name/" title="Website using Traffic Manager">Website using Traffic Manager</a></div>

Azure Blob storage is a service for storing large amounts of unstructured data that can be accessed from anywhere in the world via HTTP or HTTPS. A single blob can be any size. Blobs can be things like images, audio and video files, raw data, and document files.

To get started, you need to create an Azure storage account and then create one or more containers in the storage. For example, you could make a storage called "Scrapbook," then create containers in the storage called "images" to store pictures and another called "audio" to store audio files. After you create the containers, you can upload individual blob files to them. See [How to use Blob Storage from .NET](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-blobs/#download-blobs) for more information on programmatically manipulating blobs.

To programmatically access blobs, you need to do the following tasks.

1.	Get the Microsoft.WindowsAzure.Storage.dll assembly. You can use NuGet to do this. Right-click your project in Solution Explorer and choose Manage NuGet Packages. Search online for "WindowsAzure.Storage" and click Install to install the Azure Storage package and dependencies. Add a reference to this assembly to your project.
2.	Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access Azure Storage.
	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage.Queue;

###Get the storage connection string
Before you can do anything with a blob, you need to get the connection string for the storage account the blobs will live in. You can use the CloudStorageAccount type to represent your storage account information. If you’re using an Azure project template or have a reference to the Microsoft.WindowsAzure.CloudConfigurationManager namespace, you can you use the CloudConfigurationManager type to retrieve your storage connection string and storage account information from the Azure service configuration, as shown in the following code.

	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

If you’re creating an application without a reference to Microsoft.WindowsAzure.CloudConfigurationManager, and your connection string is located in the web.config or app.config as shown above, then you can use ConfigurationManager to retrieve the connection string. You will need to add a reference to System.Configuration.dll to your project, and add another namespace declaration for it:

	using System.Configuration;

[WACOM.INCLUDE [vs-storage-getting-started-blobs](../includes/vs-storage-getting-started-blobs.md)]
