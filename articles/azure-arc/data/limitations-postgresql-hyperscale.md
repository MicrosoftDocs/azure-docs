---
title: Limitations of Azure Arc enabled PostgreSQL Hyperscale
description: Limitations of Azure Arc enabled PostgreSQL Hyperscale
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 01/21/2021
ms.topic: how-to
---

# Limitations of Azure Arc enabled PostgreSQL Hyperscale

## Backup and restore
- Point in time restore (like restoring to specific date and time) to the same server group is not supported. When doing a point in time restore, you must restore on a different server group that you have deployed before restoring. After restoring to the new server group you may delete the server group of origin. .
- Doing a full restore (restoring the entire content of a backup) to the same server group is supported for PosrgreSQL version 12 but not for PostgreSQL version 11 due to a limitation of the PostgreSQL engine with timelines. To do a full restore of a PostgreSQL server group of version 11 you must restore it to a different server group.


## Databases
- Hosting more than one database in a server group is not yet supported.


## Security
- Managing users and roles is not yet supported. For now, continue to use the postgres standard user.


## Roles and responsibilities
The roles and responsibilities between Microsoft and its customers differ between Azure PaaS services (Platform As A Service) and Azure Hybrid (like Azure Arc enabled PostgreSQL Hyperscale). The table below summarized what they are:
|                                   | Azure Platform As A Service (PaaS) | Azure Arc hybrid services |
|:-----------------------------------|:------------------------------------:|:---------------------------:|
| Who provides the infrastructure?  | Microsoft                          | Customer                  |
| Who provides the software*?       | Microsoft                          | Microsoft                 |
| Who does the operations?|actually | Microsoft                          | Customer                  |
| Does Microsoft provide SLAs?      | Yes                                | No                        |
| Who’s in charge of SLAs?|actually | Microsoft                          | Customer                  |

_*Azure services_

__Why doesn't Microsoft provide SLAs on Azure Arc hybrid services?__ Because Microsoft does not own the infrastructure and does not operate it. Customers do.




## Next steps
- **Create**
   > **Just want to try things out? You do not have a Kubernetes cluster available? We provide you with a sandbox:**  
   > Get started quickly with [Azure Arc Jumpstart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.

   - **Create:**
      - [Install the client tools](install-client-tools.md)
      - [Create the Azure Arc data controller](create-data-controller.md) (requires installing the client tools first)
      - [Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-hyperscale-server-group.md) (Requires creation of an Azure Arc data controller first.)
- [**Read more about Azure Arc enabled data services**](https://azure.microsoft.com/services/azure-arc/hybrid-data-services)
- [**Read about Azure Arc**](https://aka.ms/azurearc)
