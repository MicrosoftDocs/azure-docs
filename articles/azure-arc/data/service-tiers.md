---
title: Azure Arc-enabled SQL Managed Instance service tiers
description: Explains the service tiers available for Azure Arc-enabled SQL Managed Instance deployments. 
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 03/02/2021
ms.topic: overview
---

# Azure Arc-enabled SQL Managed Instance service tiers

As part of of the family of Azure SQL products, Azure Arc-enabled SQL Managed Instance is available in two [vCore](../../azure-sql/database/service-tiers-vcore.md) service tiers.

- **General purpose** is a budget-friendly tier designed for most workloads with common performance and availability features.
- **Business critical** tier is designed for performance-sensitive workloads with higher availability features.

In Azure, storage and compute is provided by Microsoft with guaranteed service level agreements (SLAs) for performance, throughput, availability, and etc. across each of the service tiers. With Azure Arc-enabled data services, customers provide the storage and compute. Hence, there are no guaranteed SLAs provided to customers with Azure Arc-enabled data services. However, customers get the flexibility to bring their own performant hardware irrespective of the service tier. 

## Service tier comparison

Following is a description of the various capabilities available from Azure Arc-enabled data services across the two service tiers:


Area | Business critical (preview)* | General purpose
----------|-----------------|------------------
Feature set | Same as SQL Server Enterprise Edition | Same as SQL Server Standard Edition
CPU limit/instance | Unlimited  | 24 cores
Memory limit/instance | Unlimited | 128 GB
High availability | Availability group | Single instance w/ Kubernetes redeploy + shared storage.
Read scale out | Availability group | None
AHB exchange rates for IP component of price | 1:1 Enterprise Edition <br> 4:1 Standard Edition | 1:4 Enterprise Edition​ <br> 1:1 Standard Edition 
Dev/Test pricing | No cost | No cost

/* Currently business critical service tier is in preview and does not incur any changes for use use during this preview. Some of the features may change as we get closer to general availability.

## How to choose between the service tiers

Since customers bring their own hardware with performance and availability requirements based on their business needs, the primary differentiators between the service tiers are what is provided at the software level. 

### Choose general purpose if

- CPU/memory requirements meet or are within the limits of SQL Server Standard edition 
- The high availability options provided by kubernetes, such as pod redeployments, is sufficient for the workload
- Application does not need read scale out

### Choose business critical if

- CPU/memory requirements exceed the limits of SQL Server Standard edition 
- Higher level of High Availability such as built-in Availability Groups to handle application failovers than what is offered by kubernetes. 
- take advantage of read scale out to offload read workloads to one of the secondaries