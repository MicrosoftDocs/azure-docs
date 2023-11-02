---
title: Azure Arc-enabled SQL Managed Instance service tiers
description: Explains the service tiers available for Azure Arc-enabled SQL Managed Instance deployments. 
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.custom: event-tier1-build-2022
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/19/2023
ms.topic: conceptual
---

# Azure Arc-enabled SQL Managed Instance service tiers

As part of the family of Azure SQL products, Azure Arc-enabled SQL Managed Instance is available in two [vCore](/azure/azure-sql/database/service-tiers-vcore) service tiers.

- **General Purpose** is a budget-friendly tier designed for most workloads with common performance and availability features.
- **Business Critical** tier is designed for performance-sensitive workloads with higher availability features.

In Azure, storage and compute is provided by Microsoft with guaranteed service level agreements (SLAs) for performance, throughput, availability, and etc. across each of the service tiers. With Azure Arc-enabled data services, customers provide the storage and compute. Hence, there are no guaranteed SLAs provided to customers with Azure Arc-enabled data services. However, customers get the flexibility to bring their own performant hardware irrespective of the service tier. 

## Service tier comparison

Following is a description of the various capabilities available from Azure Arc-enabled data services across the two service tiers:


Area | Business Critical | General Purpose
----------|-----------------|------------------
SQL Feature set | Same as SQL Server Enterprise Edition | Same as SQL Server Standard Edition
CPU limit/instance | Unlimited  | 24 cores
Memory limit/instance | Unlimited | 128 GB
Scale up/down | Available | Available
Monitoring | Built-in available locally, and optionally export to Azure Monitor | Built-in available locally, and optionally export to Azure Log Analytics
Logging | Built-in available locally, and optionally export to Azure Log Analytics | Built-in available locally, and optionally export to Azure Monitor
Point in time Restore | Built-in | Built-in
High availability | Contained Availability groups over kubernetes redeployment | Single instance w/ Kubernetes redeploy + shared storage.
Read scale out | Availability group | None
Disaster Recovery | Available via Failover Groups | Available via Failover Groups
AHB exchange rates for IP component of price | 1:1 Enterprise Edition <br> 4:1 Standard Edition | 1:4 Enterprise Edition​ <br> 1:1 Standard Edition 
Dev/Test pricing | No cost | No cost

## How to choose between the service tiers

Since customers bring their own hardware with performance and availability requirements based on their business needs, the primary differentiators between the service tiers are what is provided at the software level. 

### Choose General Purpose if

- CPU/memory requirements meet or are within the limits of the General Purpose service tier
- The high availability options provided by Kubernetes, such as pod redeployments, is sufficient for the workload
- Application does not need read scale out
- The application does not require any of the features found in the Business Critical service tier (same as SQL Server Enterprise Edition)

### Choose Business Critical if

- CPU/memory requirements exceed the limits of the General Purpose service tier
- Application requires a higher level of High Availability such as built-in Availability Groups to handle application failovers than what is offered by Kubernetes. 
- Application can take advantage of read scale out to offload read workloads to the secondary replicas
- Application requires features found only in the Business Critical service tier (same as SQL Server Enterprise Edition)
