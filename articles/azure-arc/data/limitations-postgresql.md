---
title: Limitations of Azure Arc-enabled PostgreSQL
description: Limitations of Azure Arc-enabled PostgreSQL
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Limitations of Azure Arc-enabled PostgreSQL

This article describes limitations of Azure Arc-enabled PostgreSQL. 

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## High availability

Configuring high availability to recover from infrastructure failures isn't yet available.

## Monitoring

Currently, local monitoring with Grafana is only available for the default `postgres` database. Metrics dashboards for user created databases will be empty.

## Configuration

System configurations that are stored in `postgresql.auto.conf` are backed up when a base backup is created. This means that changes made after the last base backup, will not be present in a restored server until a new base backup is taken to capture those changes.

## Roles and responsibilities

The roles and responsibilities between Microsoft and its customers differ between Azure managed services (Platform As A Service or PaaS) and Azure hybrid (like Azure Arc-enabled PostgreSQL). 

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

__Why doesn't Microsoft provide SLAs on Azure Arc hybrid services?__ Because with a hybrid service, you or your provider owns the infrastructure.

## Related content

- **Try it out.** Get started quickly with [Azure Arc Jumpstart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM. 

- **Create your own.** Follow these steps to create on your own Kubernetes cluster: 
   1. [Install the client tools](install-client-tools.md)
   2. [Plan an Azure Arc-enabled data services deployment](plan-azure-arc-data-services.md)
   3. [Create an Azure Database for PostgreSQL server on Azure Arc](create-postgresql-server.md) 

- **Learn**
   - [Read more about Azure Arc-enabled data services](https://azure.microsoft.com/services/azure-arc/hybrid-data-services)
   - [Read about Azure Arc](https://aka.ms/azurearc)
