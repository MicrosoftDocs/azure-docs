---
title: What happened to my cloud service project? | Microsoft Docs
description: Describes what happens in a cloud services project after connecting to an Azure storage account using Visual Studio connected services
services: storage
author: ghogen
manager: douge
ms.assetid: ca0ea68d-f417-4ce8-9413-40d76f69cdea
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 12/02/2016
ms.author: ghogen
---
# What happened to my cloud services project (Visual Studio Azure Storage connected service)?
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
Elements were created with the selected storage account's connection string and key. Modifications were made to the following files:

* **ServiceDefinition.csdef**
* **ServiceConfiguration.Cloud.cscfg**
* **ServiceConfiguration.Local.cscfg**

