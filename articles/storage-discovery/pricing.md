---
title: Understand Storage Discovery Pricing | Microsoft Docs
titleSuffix: Azure Storage Discovery
description: Storage Discovery pricing and features available with each pricing plan.
author: pthippeswamy
ms.service: azure-storage-mover
ms.topic: overview
ms.date: 08/01/2025
ms.author: shaas
---

# Azure Storage Discovery pricing

Azure Storage Discovery provides a centralized view of storage across subscriptions and regions, aggregating metrics on capacity, activity, and configuration. This article describes how you plan for and manage costs for Azure Storage Discovery.

## Understand the full billing model for Azure Storage Discovery

Azure Storage Discovery is available in free and paid 

For each Discovery workspace, you can select from free or paid options. The number of insights and their retention varies. 

| Discovery pricing plan | Description |
|---|---| 
| Free | Includes limited Capacity and Resource configuration insights for up to 15 days with daily updates of the data. | 
| Standard | Includes insights for Capacity, Operations, Resource and security configurations with hourly updates. Upon workspace creation, historic data is aggregated for the prior 30 days and all data is retained for up to 18 months.| 

## Azure Storage Discovery meters

The total cost of a Storage Discovery workspace will depend on its configuration.  

You can configure a workspace to observe storage resources (e.g. storage accounts).  
In the case of Azure Blob Storage, storage accounts contain objects. The cost of a Discovery workspace depends on the number of storage account resources and blobs within them.