---
title: List of Azure Diagnostics configuration schema versions | Microsoft Docs
description: Used to configure the collection of perf counters in Azure Virtual Machines, VM Scale Sets, Service Fabric, and Cloud Services.
services: monitoring-and-diagnostics
documentationcenter: .net
author: rboucher
manager: carmonm
editor: ''

ms.assetid:
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 02/09/2017
ms.author: robb

---
# List of Azure Diagnostics Versions
This page indexes Azure Diagnostics Schema versions shipped as part of the Microsoft Azure SDK.  

> [!NOTE]
> Azure Diagnostics is the component used to collect performance counters and other statistics from Azure Virtual Machines, Virtual Machine Scale Sets, Service
> Fabric, and Cloud Services.  This page is only relevant if you are using one of these services.
>

Azure Diagnostics is used with other Microsoft diagnostics products like Azure Monitor, Application Insights, and Log Analytics.

## Azure SDK and Diagnostics versions shipping chart  

|Azure SDK version | Azure Diagnostics version | Model|  
|------------------|---------------------------|------|  
|1.x               |1.0                         | plug-in|  
|2.0 - 2.4         |1.0                         |"|  
|2.5               |1.2                         |extension|  
|2.6               |1.3                         |"|  
|2.7               |1.4                         |"|  
|2.8               |1.5                         |"|  
|2.9               |1.6                         |"|
|2.96              |1.7                         |"|



 Azure Diagnostics version 1.0 first shipped in a plug-in model, meaning that when you installed the Azure SDK, you got the version of Azure diagnostics shipped with it.  

 Starting with SDK 2.5 (diagnostics version 1.2), Azure diagnostics went to an extension model. The tools to utilize new features were only available in newer Azure SDKs, but any Cloud Service or Virtual Machine using diagnostics would pick up the latest shipping version directly from Azure.  

 For example, anyone still using SDK 2.5 would be loading Diagnostics 1.5, whether or not they were using the newer features.  

## Azure Diagnostics schemas index  
[Diagnostics 1.0 Configuration Schema](azure-diagnostics-schema-1dot0.md)  

[Diagnostics 1.2 Configuration Schema](azure-diagnostics-schema-1dot2.md)  

[Diagnostics 1.3 and later Configuration Schema](azure-diagnostics-schema-1dot3-and-later.md)  
