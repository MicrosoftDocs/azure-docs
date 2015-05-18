<properties 
	pageTitle="Getting Started with Azure Storage" 
	description="Describes what happened when creating an Azure storage in a Visual Studio ASP.NET 5 project" 
	services="storage" 
	documentationCenter="" 
	authors="kempb" 
	manager="douge" 
	editor="tglee"/>

<tags 
	ms.service="storage" 
	ms.workload="web" 
	ms.tgt_pltfrm="vs-what-happened" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/20/2015" 
	ms.author="kempb"/>

# What happened to my project?

> [AZURE.SELECTOR]
> - [Getting Started](vs-storage-aspnet5-getting-started-blobs.md)
> - [What Happened](vs-storage-aspnet5-what-happened.md)

> [AZURE.SELECTOR]
> - [Blobs](vs-storage-aspnet5-getting-started-blobs.md)
> - [Queues](vs-storage-aspnet5-getting-started-queues.md)
> - [Tables](vs-storage-aspnet5-getting-started-tables.md)

###<span id="whathappened">What happened to my project?</span>

##### References Added

The Azure Storage NuGet package was added to your Visual Studio project.  
This package adds the following .NET references:

- `Microsoft.Data.Edm`
- `Microsoft.Data.OData`
- `Microsoft.Data.Services.Client`
- `Microsoft.WindowsAzure.Configuration`
- `Microsoft.WindowsAzure.Storage`
- `Newtonsoft.Json`
- `System.Data`
- `System.Spatial`

Also, the NuGet package **Microsoft.Framework.ConfigurationModel.Json** was added.

#####Connection string for Azure Storage added 
In the config.json file of your project, an element was created with the selected storage account's connection string and key.

For more information, see [ASP.NET 5](http://www.asp.net/vnext).
