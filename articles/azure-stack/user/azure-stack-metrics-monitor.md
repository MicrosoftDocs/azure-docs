---
title: Title | Microsoft Docs
description: description
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/28/2018
ms.author: mabrigg

---

# Consume monitoring data from Azure Stack

This is about how to consume data from Azure Stack.
 
Across the Azure Stack platform, we bring together monitoring data in a single place with the Azure Monitor pipeline, just like what Azure Monitor did on Azure. But practically acknowledge that today not all monitoring data is available in that pipeline yet. In this article, we will summarize the various ways you can programmatically access monitoring data from Azure service. 
 
## Options for data consumption 

| Data type | Category | Supported Services | Methods of Access |
|-------------------------------------------------------------|----------|------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Azure Monitor platform-level metrics | Metrics | See the list here: Supported metrics with Azure Monitor on Azure Stack | REST API: <br>Storage blob or event hub: not supported yet. |
| Compute guest OS metrics(eg. Perf count) | Metrics | Windows and Linux Virtual Machines | Storage table or blob: Windows or Linux Azure Diagnostics <br>Event Hub: Windows Azure Diagnostics |
| Storage metrics | Metrics | Azure Storage | Storage table: Storage Analytics |
| Activity log | Events | All Azure Services | REST API: Azure Monitor Event API <br>Storage blob or Event Hub: not supported yet. |
| Compute guest OS logs(eg. IIS, ETW, syslogs) | Events | Windows and Linux Virtual Machines | Storage table or blob: Windows or Linux Azure Diagnostics <br>Event Hub: Windows Azure Diagnostics |
| App service logs - TBD |  |  |  |
| Storage logs | Events | Azure Storage | Storage table: Storage Analytics |
|  |  |  | (Vita: how about hybrid OMS/AppInsights, shall we mention?) |

## Next steps