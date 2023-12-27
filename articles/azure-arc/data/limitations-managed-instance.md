---
title: Limitations of SQL Server Managed Instance enabled by Azure Arc
description: Limitations of SQL Server Managed Instance enabled by Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.custom: event-tier1-build-2022
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 09/07/2021
ms.topic: conceptual
---

# Limitations of SQL Server Managed Instance enabled by Azure Arc

This article describes limitations of SQL Managed Instance enabled by Azure Arc. 

## Back up and restore

### Automated backups 

-  User databases with SIMPLE recovery model are not backed up.
-  System database `model` is not backed up in order to prevent interference with creation/deletion of database. The database gets locked when admin operations are performed.

### Point-in-time restore (PITR)

-  Doesn't support restore from one SQL Managed Instance enabled by Azure Arc to another SQL Managed Instance enabled by Azure Arc.  The database can only be restored to the same Arc-enabled SQL Managed Instance where the backups were created.
-  Renaming databases is currently not supported, during point in time restore.
-  No support for restoring a TDE enabled database currently.
-  A deleted database cannot be restored currently.

## Other limitations 

- Transactional replication is currently not supported.
- Log shipping is currently blocked.
- All user databases need to be in a full recovery model because they participate in an always-on-availability group

## Roles and responsibilities

The roles and responsibilities between Microsoft and its customers differ between Azure PaaS services (Platform As A Service) and Azure hybrid (like SQL Managed Instance enabled by Azure Arc). 

### Frequently asked questions

This table summarizes answers to frequently asked questions regarding support roles and responsibilities.

| Question                          | Azure Platform As A Service (PaaS) | Azure Arc hybrid services |
|:----------------------------------|:------------------------------------:|:---------------------------:|
| Who provides the infrastructure?  | Microsoft                          | Customer                  |
| Who provides the software?*       | Microsoft                          | Microsoft                 |
| Who does the operations?          | Microsoft                          | Customer                  |
| Does Microsoft provide SLAs?      | Yes                                | No                        |
| Who’s in charge of SLAs?          | Microsoft                          | Customer                  |

\* Azure services

__Why doesn't Microsoft provide SLAs on Azure Arc hybrid services?__ Customers and their partners own and operate the infrastructure that Azure Arc hybrid services run on so Microsoft can't provide the SLA.

## Related content

- **Try it out.** Get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.com/azure_arc_jumpstart/azure_arc_data) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM. 

- **Create your own.** Follow these steps to create on your own Kubernetes cluster: 
   1. [Install the client tools](install-client-tools.md)
   2. [Plan an Azure Arc-enabled data services deployment](plan-azure-arc-data-services.md)
   3. [Deploy SQL Managed Instance enabled by Azure Arc](create-sql-managed-instance.md) 

- **Learn**
   - [Read more about Azure Arc-enabled data services](https://azure.microsoft.com/services/azure-arc/hybrid-data-services)
   - [Read about Azure Arc](https://aka.ms/azurearc)
