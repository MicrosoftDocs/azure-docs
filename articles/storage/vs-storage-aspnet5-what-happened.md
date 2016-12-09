---
title: What happened to my ASP.NET 5 project (Visual Studio connected services) | Microsoft Docs
description: Describes what happens after connecting to an Azure storage account in a Visual Studio ASP.NET 5 project using Visual Studio connected services
services: storage
documentationcenter: ''
author: TomArcher
manager: douge
editor: ''

ms.assetid: e7caa9fa-c780-45eb-a546-299fc1c68455
ms.service: storage
ms.workload: web
ms.tgt_pltfrm: vs-what-happened
ms.devlang: na
ms.topic: article
ms.date: 12/02/2016
ms.author: tarcher

---
# What happened to my ASP.NET 5 project (Visual Studio Azure Storage connected services)?
## References added
The Azure Storage NuGet package was added to your Visual Studio project.  
This package adds the following .NET references:

* **Microsoft.Data.Edm**
* **Microsoft.Data.OData**
* **Microsoft.Data.Services.Client**
* **Microsoft.WindowsAzure.Configuration**
* **Microsoft.WindowsAzure.Storage**
* **Newtonsoft.Json**
* **System.Data**
* **System.Spatial**

Also, the NuGet package **Microsoft.Framework.Configuration.Json** was added.

## Connection string for Azure Storage added
In the config.json file of your project, an element was created with the selected storage account's connection string and key.

For more information, see [ASP.NET 5](http://www.asp.net/vnext).

