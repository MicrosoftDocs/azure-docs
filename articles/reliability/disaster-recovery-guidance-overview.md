---
title: Disaster recovery guidance overview for Microsoft Azure products and services
description: Disaster recovery guidance overview for Microsoft Azure products and services
author: anaharris-ms
ms.service: reliability
ms.subservice: disaster-recovery
ms.topic: conceptual
ms.date: 11/08/2022
ms.author: anaharris
ms.custom: subject-reliability
---

# Disaster recovery guidance overview for Microsoft Azure products and services

A disaster is a single, major event with a larger and longer-lasting impact than an application can mitigate through the high availability part of its design. Disaster recovery (DR) is about recovering from high-impact events, such as natural disasters or failed deployments, that result in downtime and data loss. Regardless of the cause, the best remedy for a disaster is a well-defined and tested DR plan and an application design that actively supports DR.  For more information, see [What is disaster recovery?](./disaster-recovery-overview.md).

The table below lists each product that offers disaster recovery guidance and/or information. 

## Azure services migration guides

### ![An icon that signifies this service is foundational.](media/icon-foundational.svg) Foundational services 

| **Products**  | 
| --- | 
| [Azure Application Gateway (V2)](migrate-app-gateway-v2.md) |
| [Azure Backup and Azure Site Recovery](migrate-recovery-services-vault.md)  | 
| [Azure Functions](migrate-functions.md)|
| [Azure Load Balancer](migrate-load-balancer.md)|
| [Azure Service Fabric](migrate-service-fabric.md)  | 
| [Azure SQL Database](migrate-sql-database.md) |
| [Azure Storage account: Blob Storage, Azure Data Lake Storage, Files Storage](migrate-storage.md) |
| [Azure Storage: Managed Disks](migrate-vm.md)|
| [Azure Virtual Machines and Azure Virtual Machine Scale Sets](migrate-vm.md)|  


\*VMs that support availability zones: AV2-series, B-series, DSv2-series, DSv3-series, Dv2-series, Dv3-series, ESv3-series, Ev3-series, F-series, FS-series, FSv2-series, and M-series.

### ![An icon that signifies this service is mainstream.](media/icon-mainstream.svg) Mainstream services

| **Products**   | 
| --- | 
| [Azure API Management](migrate-api-mgt.md)|
| [Azure App Configuration](migrate-app-configuration.md)|
| [Azure Cache for Redis](migrate-cache-redis.md)|
| [Azure Cognitive Search](migrate-search-service.md)|
| [Azure Container Instances](migrate-container-instances.md)|
| [Azure Database for MySQL - Flexible Server](migrate-database-mysql-flex.md)|
| [Azure Monitor: Log Analytics](migrate-monitor-log-analytics.md)|
| [Azure SQL Managed Instance](migrate-sql-managed-instance.md)|


## Workload and general guidance
| **Workloads**   | 
| --- | 
| [Azure Kubernetes Service (AKS) and MySQL Flexible Server](migrate-workload-aks-mysql.md)|


