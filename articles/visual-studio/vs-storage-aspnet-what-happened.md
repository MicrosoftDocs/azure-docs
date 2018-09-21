---
title: What happened to my ASP.NET project? | Microsoft Docs
description: Describes what happens after adding Azure Storage to a ASP.NET project using Visual Studio connected services
services: storage
author: ghogen
manager: douge
ms.assetid: e1fe1b6d-4e3d-476d-8b2f-f7ade050515e
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 12/02/2016
ms.author: ghogen
---
# What happened to my ASP.NET project (Visual Studio Azure Storage connected service)?
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

## Connection string for Azure Storage added
In the web.config file of your project, an element was created with the selected storage account's connection string and key.

For more information, see [ASP.NET](http://www.asp.net).

