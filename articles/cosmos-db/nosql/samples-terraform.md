---
title: Terraform samples for Azure Cosmos DB for NoSQL
description: Use Terraform to create and configure Azure Cosmos DB for NoSQL. 
author: ginsiucheng
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022, devx-track-terraform
ms.topic: conceptual
ms.date: 09/16/2022
ms.author: mjbrown
ms.reviewer: mjbrown
---

# Terraform samples for Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article shows Terraform samples for NoSQL accounts.

## API for NoSQL

| **Sample** | **Description** |
| --- | --- |
| [Create an Azure Cosmos account, database, container with autoscale throughput](manage-with-terraform.md#create-autoscale) | Create an API for NoSQL account in two regions, a database and container with autoscale throughput. |
| [Create an Azure Cosmos account, database, container with analytical store](manage-with-terraform.md#create-analytical-store) | Create an API for NoSQL account in one region with a container configured with Analytical TTL enabled and option to use manual or autoscale throughput. |
| [Create an Azure Cosmos account, database, container with standard (manual) throughput](manage-with-terraform.md#create-manual) | Create an API for NoSQL account in two regions, a database and container with standard throughput. |
| [Create an Azure Cosmos account, database and container with a stored procedure, trigger and UDF](manage-with-terraform.md#create-sproc) | Create an API for NoSQL account in two regions with a stored procedure, trigger and UDF for a container. |
| [Create an Azure Cosmos account with Microsoft Entra identity, Role Definitions and Role Assignment](manage-with-terraform.md#create-rbac) | Create an API for NoSQL account with Microsoft Entra identity, Role Definitions and Role Assignment on a Service Principal. |
| [Create a free-tier Azure Cosmos account](manage-with-terraform.md#free-tier) |  Create an Azure Cosmos DB API for NoSQL account on free-tier. |

## Next steps

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.

* If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md)
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
