---
title: Limitations of Azure Arc-enabled PostgreSQL Hyperscale
description: Limitations of Azure Arc-enabled PostgreSQL Hyperscale
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 02/11/2021
ms.topic: how-to
---

# Limitations of Azure Arc-enabled PostgreSQL Hyperscale

This article describes limitations of Azure Arc-enabled PostgreSQL Hyperscale. 

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Backup and restore

- Point in time restore (like restoring to specific date and time) to the same server group is not supported. When doing a point in time restore, you must restore on a different server group that you have deployed before restoring. After restoring to the new server group, you may delete the server group of origin.
- Restoring the entire content of a backup (as opposed to restoring up to a specific point in time) to the same server group is supported for PostgreSQL version 12. It is not supported for PostgreSQL version 11 due to a limitation of the PostgreSQL engine with timelines. To restore the entire content of a backup for a PostgreSQL server group of version 11, you must restore it to a different server group.


## Databases

Hosting more than one database in a server group is not supported.


## Security

Managing users and roles is not  supported. For now, continue to use the postgres standard user.

## Roles and responsibilities

The roles and responsibilities between Microsoft and its customers differ between Azure PaaS services (Platform As A Service) and Azure hybrid (like Azure Arc-enabled PostgreSQL Hyperscale). 

### Frequently asked questions

The table below summarizes answers to frequently asked questions regarding support roles and responsibilities.

| Question                      | Azure Platform As A Service (PaaS) | Azure Arc hybrid services |
|:----------------------------------|:------------------------------------:|:---------------------------:|
| Who provides the infrastructure?  | Microsoft                          | Customer                  |
| Who provides the software?*       | Microsoft                          | Microsoft                 |
| Who does the operations? | Microsoft                          | Customer                  |
| Does Microsoft provide SLAs?      | Yes                                | No                        |
| Who’s in charge of SLAs? | Microsoft                          | Customer                  |

\* Azure services

__Why doesn't Microsoft provide SLAs on Azure Arc hybrid services?__ Because Microsoft does not own the infrastructure and does not operate it. Customers do.

## Next steps

- **Try it out.** Get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM. 

- **Create your own.** Follow these steps to create on your own Kubernetes cluster: 
   1. [Install the client tools](install-client-tools.md)
   2. [Create the Azure Arc data controller](create-data-controller.md)
   3. [Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-hyperscale-server-group.md) 

- **Learn**
   - [Read more about Azure Arc-enabled data services](https://azure.microsoft.com/services/azure-arc/hybrid-data-services)
   - [Read about Azure Arc](https://aka.ms/azurearc)
