<properties
    pageTitle="What happened to my cloud service project? | Microsoft Azure | Visual Studio connected services"
	description="Describes what happens in a cloud services project after connecting to an Azure storage account using Visual Studio connected services"
    services="storage"
	documentationCenter=""
	authors="TomArcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="storage"
	ms.workload="web"
	ms.tgt_pltfrm="vs-what-happened"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/08/2016"
	ms.author="tarcher"/>

# What happened to my cloud services project (Visual Studio Azure Storage connected service)?

## References added

The Azure Storage NuGet package was added to your Visual Studio project.  
This package adds the following .NET references:

- **Microsoft.Data.Edm**
- **Microsoft.Data.OData**
- **Microsoft.Data.Services.Client**
- **Microsoft.WindowsAzure.Configuration**
- **Microsoft.WindowsAzure.Storage**
- **Newtonsoft.Json**
- **System.Data**
- **System.Spatial**

## Connection string for Azure Storage added
Elements were created with the selected storage account's connection string and key. Modifications were made to the following files:

- **ServiceDefinition.csdef**
- **ServiceConfiguration.Cloud.cscfg**
- **ServiceConfiguration.Local.cscfg**
