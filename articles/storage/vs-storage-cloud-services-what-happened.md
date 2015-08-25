<properties
	pageTitle="Getting started with Azure Storage"
	description="Describes what happens when Azure Storage is used in a Visual Studio cloud service project"
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
	ms.date="07/22/2015"
	ms.author="patshea123"/>

# What happened to my project?

> [AZURE.SELECTOR]
> - [Getting started](vs-storage-cloud-services-getting-started-blobs.md)
> - [What happened](vs-storage-cloud-services-what-happened.md)

###What happened to my project?

###### References added

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

######Connection string for Azure Storage added
Elements were created with the selected storage account's connection string and key. Modifications were made to the following files:

- `ServiceDefinition.csdef`
- `ServiceConfiguration.Cloud.cscfg`
- `ServiceConfiguration.Local.cscfg`
