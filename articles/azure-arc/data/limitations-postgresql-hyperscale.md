---
title: Limitations of Azure Arc-enabled PostgreSQL Hyperscale
description: Limitations of Azure Arc-enabled PostgreSQL Hyperscale
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: grrlgeek
ms.author: jeschult
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Limitations of Azure Arc-enabled PostgreSQL Hyperscale

This article describes limitations of Azure Arc-enabled PostgreSQL Hyperscale. 

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Backup and restore
Backup/restore capabilities have been temporarily removed as we finalize designs and experiences.

## High availability
Configuring high availability and ensuring failover in case of failures of the infrastructure is not yet available.

## Databases
Hosting more than one database in a server group is not supported if you scaled out the deployment on several worker nodes.

## Roles and responsibilities

The roles and responsibilities between Microsoft and its customers differ between Azure managed services (Platform As A Service or PaaS) and Azure hybrid (like Azure Arc-enabled PostgreSQL Hyperscale). 

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

- **Try it out.** Get started quickly with [Azure Arc Jumpstart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM. 

- **Create your own.** Follow these steps to create on your own Kubernetes cluster: 
   1. [Install the client tools](install-client-tools.md)
   2. [Plan an Azure Arc-enabled data services deployment](plan-azure-arc-data-services.md)
   3. [Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-hyperscale-server-group.md) 

- **Learn**
   - [Read more about Azure Arc-enabled data services](https://azure.microsoft.com/services/azure-arc/hybrid-data-services)
   - [Read about Azure Arc](https://aka.ms/azurearc)
