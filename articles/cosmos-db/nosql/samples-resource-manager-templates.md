---
title: Azure Resource Manager templates for Azure Cosmos DB for NoSQL
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB. 
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022, devx-track-arm-template
ms.topic: conceptual
ms.date: 08/26/2021
ms.author: sidandrews
ms.reviewer: mjbrown
---

# Azure Resource Manager templates for Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article only shows Azure Resource Manager template examples for API for NoSQL accounts. You can also find template examples for [Cassandra](../cassandra/templates-samples.md), [Gremlin](../graph/resource-manager-template-samples.md), [MongoDB](../mongodb/resource-manager-template-samples.md), and [Table](../table/resource-manager-templates.md) APIs.

## API for NoSQL

|**Template**|**Description**|
|---|---|
|[Create an Azure Cosmos DB account, database, container with autoscale throughput](manage-with-templates.md#create-autoscale) | This template creates a API for NoSQL account in two regions, a database and container with autoscale throughput. |
|[Create an Azure Cosmos DB account, database, container with analytical store](manage-with-templates.md#create-analytical-store) | This template creates a API for NoSQL account in one region with a container configured with Analytical TTL enabled and option to use manual or autoscale throughput. |
|[Create an Azure Cosmos DB account, database, container with standard (manual) throughput](manage-with-templates.md#create-manual) | This template creates a API for NoSQL account in two regions, a database and container with standard throughput. |
|[Create an Azure Cosmos DB account, database and container with a stored procedure, trigger and UDF](manage-with-templates.md#create-sproc) | This template creates a API for NoSQL account in two regions with a stored procedure, trigger and UDF for a container. |
|[Create an Azure Cosmos DB account with Microsoft Entra identity, Role Definitions and Role Assignment](manage-with-templates.md#create-rbac) | This template creates a API for NoSQL account with Microsoft Entra identity, Role Definitions and Role Assignment on a Service Principal. |
|[Create a private endpoint for an existing Azure Cosmos DB account](../how-to-configure-private-endpoints.md#create-a-private-endpoint-by-using-a-resource-manager-template) |  This template creates a private endpoint for an existing Azure Cosmos DB for NoSQL account in an existing virtual network. |
|[Create a free-tier Azure Cosmos DB account](manage-with-templates.md#free-tier) |  This template creates an Azure Cosmos DB for NoSQL account on free-tier. |

See [Azure Resource Manager reference for Azure Cosmos DB](/azure/templates/microsoft.documentdb/allversions) page for the reference documentation.

## Next steps

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
