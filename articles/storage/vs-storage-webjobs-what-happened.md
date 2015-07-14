<properties 
	pageTitle="Getting Started with Azure Storage" 
	description="Describes what happened when creating an Azure storage in a Visual Studio Azure WebJob project" 
	services="storage" 
	documentationCenter="" 
	authors="patshea123" 
	manager="douge" 
	editor="tglee"/>

<tags 
	ms.service="storage" 
	ms.workload="web" 
	ms.tgt_pltfrm="vs-what-happened" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/13/2015" 
	ms.author="patshea123"/>

# What happened to my project?

> [AZURE.SELECTOR]
> - [Getting Started](vs-storage-webjobs-getting-started-blobs.md)
> - [What Happened](vs-storage-webjobs-what-happened.md)

###<span id="whathappened">What happened to my project?</span>

##### References Added

The Azure Storage NuGet package was added to or updated in your Visual Studio project.  
This package adds the following .NET references:

- `Microsoft.Data.Edm`
- `Microsoft.Data.OData`
- `Microsoft.Data.Services.Client`
- `Microsoft.WindowsAzure.ConfigurationManager`
- `Microsoft.WindowsAzure.Storage`
- `Newtonsoft.Json`
- `System.Data`
- `System.Spatial`

#####Connection string for Azure Storage added 
In the App.config file of your project, the `AzureWebJobsStorage` and `AzureWebJobsDashboard` were updated with the selected storage account's connection string and key. 

For more information, see [Azure WebJobs Recommended Resources](http://go.microsoft.com/fwlink/?linkid=390226). 