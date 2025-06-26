---
title: Understand Storage Discovery Pricing | Microsoft Docs
description: Storage Discovery provides insights on storage capacity, transactions, and configurations - providing visibility into their storage estate at entire organization level and aiding business decisions.
author: pthippeswamy
ms.service: azure-storage-discovery
ms.topic: overview
ms.date: 06/15/2025
ms.author: pthippeswamy
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: NOT STARTED

REVIEW Stephen/Fabian: NOT STARTED
EDIT PASS: NOT STARTED

Document score: not run

!########################################################
-->

# What is Azure Storage Discovery?

Azure Storage Discovery provides a centralized view of storage across subscriptions and regions, aggregating metrics on capacity, activity, and configuration. This article describes how you plan for and manage costs for Azure Storage Discovery.

## Understand the full billing model for Azure Storage Discovery

Azure Storage Discovery is available in free and paid 

For each Discovery workspace, you can select from free or paid options. The number of insights and their retention varies. 

| Discovery pricing plan | Description |
|---|---| 
| Free | Includes limited Capacity and Resource configuration insights for up to 15 days with daily updates of the data. | 
| Standard | Includes insights for Capacity, Operations, Resource and security configurations. Upon workspace creation, historic data is aggregated for the prior 15 days and all data is retained for up to 18 months.| 

### Azure Storage Discovery meters

The total cost of a Storage Discovery workspace will depend on its configuration.  

You can configure a workspace to observe storage resources (e.g. storage accounts).  
In the case of Azure Blob Storage, storage accounts contain objects. The cost of a Discovery workspace depends on the number of storage account resources and blobs within them. 

| Prices per Discovery workspace  | Free pricing plan  | Standard pricing plan  |
|---|---|---| 
| Storage accounts analyzed  | Free | • $1.00 per storage account, up to 1,000 storage accounts analyzed<br>• $0.60 per storage account, greater than 1,000 and up to 10,000 storage accounts analyzed<br>• $0.20 per storage account, greater than 10,000 storage accounts analyzed |
| Total objects analyzed  | Free  | • $0.18 per 1 million objects, up to 25 billion objects analyzed<sup>1</sup><br>• $0.16 per 1 million objects, greater than 25 billion and up to 100 billion objects analyzed<br>• $0.12 per 1 million objects, greater than 100 billion objects analyzed |
| Workspace Early Delete  | Free | • Charged if the workspace is deleted less than 30 days from its creation<br>• Charged only if the workspace is downgraded to the Free pricing plan and if a paid plan was active for less than 30 days<br>• The penalty is charged for the following 30 days. The penalty value is based on the daily average cost of the workspace before the workspace was downgraded or prematurely deleted |

<sup>1</sup> A minimum charge of $0.18 applies when less than 1 million objects are analyzed.