<properties 
	pageTitle="Use Azure storage in Windows Store Apps | Azure" 
	description="Learn how to use Azure blobs, queues, and tables to store data for a Windows Store app." 
	services="storage" 
	documentationCenter="" 
	authors="tamram" 
	manager="adinah" 
	editor="cgronlun"/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/05/2015" 
	ms.author="tamram"/>





# How to use Azure Storage in Windows Store Apps

## Overview

This guide shows how to get started with developing a Windows Store app that makes use of Azure Storage.

## Download Required Tools ##

- [Visual Studio 2012](http://msdn.microsoft.com/library/windows/apps/br211384) makes it easy to build, debug, localize, package, and deploy Windows Store apps.
- [Azure Storage Client Library for Windows Runtime](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/11/05/windows-azure-storage-client-library-for-windows-runtime.aspx) provides a class library for working with Azure Storage.
- [WCF Data Services Tools for Windows Store Apps](http://www.microsoft.com/download/details.aspx?id=30714) extends the Add Service Reference experience with client-side OData support for Windows Store Apps in Visual Studio 2012 and later.

## Develop Apps ##

### Getting ready

Create a new Windows Store app project in Visual Studio 2012 or later:

![store-apps-storage-vs-project][store-apps-storage-vs-project]

Next, add a reference to the Azure Storage Client Library by right clicking on **References**, then choosing **Add Reference**, and browsing to the Storage Client Library for Windows Runtime that you downloaded:

![store-apps-storage-choose-library][store-apps-storage-choose-library]

### Using the library with the Blob and Queue services

At this point, your app is ready to call the Blob and Queue services. Add the following **using** statements so that Azure Storage types can be referenced directly:

    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Auth;
    
Next, add a button to your page. Add the following code to its **Click** event and modify your event handler method with the [async keyword](http://msdn.microsoft.com/library/vstudio/hh156513.aspx):
    
    var credentials = new StorageCredentials(accountName, accountKey);
    var account = new CloudStorageAccount(credentials, true);
    var blobClient = account.CreateCloudBlobClient();
    var container = blobClient.GetContainerReference("container1");
    await container.CreateIfNotExistsAsync();
    
This code assumes that you have two string variables, *accountName* and *accountKey*, which represent the name of your storage account and the account key associated with that account.

Build and run the application. Clicking on the button will first check if a container named *container1* exists in your account and create it if not.

### Using the library with the Table service

Types used to communicate with Table service depend on WCF Data Services for Windows Store Apps library. Next, add a reference to the required WCF libraries by using Package Manager Console:

![store-apps-storage-package-manager][store-apps-storage-package-manager]

Use the following command to point Package Manager to the location on your machine:
    
    Install-Package Microsoft.Data.OData.WindowsStore -Source "C:\Program Files (x86)\Microsoft WCF Data Services\5.0\bin\NuGet"

This command will automatically add all required references to your project. If you do not want to use the Package Manager Console, you can also add the WCF Data Services NuGet folder on your local machine to the list of Package Sources and then add the reference through the UI as described in [Managing NuGet Packages Using the Dialog](http://docs.nuget.org/docs/start-here/Managing-NuGet-Packages-Using-The-Dialog).

When you have referenced the WCF Data Services NuGet package, change the code in your button's **Click** event:
    
    var credentials = new StorageCredentials(accountName, accountKey);
    var account = new CloudStorageAccount(credentials, true);
    var tableClient = account.CreateCloudTableClient();
    var table = tableClient.GetTableReference("table1");
    await table.CreateIfNotExistsAsync();
    
This code checks whether a table named *table1* exists in your account, and creates it if not.

You can also add a reference to Microsoft.WindowsAzure.Storage.Table.dll, available in the same package that you downloaded. This library contains additional functionality such as reflection based serialization and generic queries. Note that this library does not support JavaScript.



[store-apps-storage-vs-project]: ./media/storage-use-store-apps/store-apps-storage-vs-project.png
[store-apps-storage-choose-library]: ./media/storage-use-store-apps/store-apps-storage-choose-library.png
[store-apps-storage-package-manager]: ./media/storage-use-store-apps/store-apps-storage-package-manager.png
