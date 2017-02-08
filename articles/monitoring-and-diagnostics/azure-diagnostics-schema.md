---
title: Overview of Azure Diagnostics | Microsoft Docs
description: Schema used for Azure diagnostics shipped as part of the Microsoft Azure SDK.
services: multiple
documentationcenter: .net
author: rboucher
manager: carmonm
editor: ''

ms.assetid:
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 01/15/2017
ms.author: robb

---
# Overview of Azure Diagnostics
This page is an index of the Azure Diagnostics Schemas shipped as part of the Microsoft Azure SDK.  

## Azure SDK and Diagnostics versions shipping chart  

|Azure SDK version | Azure Diagnostics version | Model|  
|------------------|---------------------------|------|  
|1.x               | 1.0              | plug-in|  
|2.0 - 2.4         |1.0               |"|  
|2.5               |1.2               |extension|  
|2.6               |1.3               |"|  
|2.7               |1.4               |"|  
|2.8               |1.5               |"|  

 Azure Diagnostics version 1.0 first shipped in a plug-in model, meaning that when you installed the Azure SDK, you got the version of Azure diagnostics shipped with it.  

 Starting with version 1.2, diagnostics went to an extension model. The tools to utilize new features were only available in newer Azure SDKs, but any Cloud Service or Virtual Machine using diagnostics would pick up the latest shipping version directly from Azure.  

 For example, anyone still using SDK 2.5 would be loading Diagnostics 1.5, whether or not they were using the newer features.  

## Azure Diagnostics schemas index  
[Diagnostics 1.0 Configuration Schema](azure-diagnostics-schema-1dot0.md)  

[Diagnostics 1.2 Configuration Schema](azure-diagnostics-schema-1dot2.md)  

[Diagnostics 1.3 to 1.5 Configuration Schema](azure-diagnostics-schema-1dot3-to-1dot5.md)  
