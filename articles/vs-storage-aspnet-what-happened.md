<properties pageTitle="Getting Started with Azure Storage" description="" services="storage" documentationCenter="" authors="kempb" manager="douge" editor=""/>

<tags ms.service="storage" ms.workload="web" ms.tgt_pltfrm="vs-what-happened" ms.devlang="na" ms.topic="article" ms.date="10/10/2014" ms.author="kempb"/>

> [AZURE.SELECTOR]
> - [Getting Started](/documentation/articles/vs-storage-aspnet-getting-started-blobs/)
> - [What Happened](/documentation/articles/vs-storage-aspnet-what-happened/)

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

#####Connection string for Azure Storage added 
In the web.config file of your project, an element was created with the selected storage account's connection string and key.

For more information, see [ASP.NET](http://www.asp.net).