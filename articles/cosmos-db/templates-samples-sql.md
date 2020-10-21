---
title: Azure Resource Manager templates for Azure Cosmos DB Core (SQL API)
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/14/2020
ms.author: mjbrown
---

# Azure Resource Manager templates for Azure Cosmos DB

This article only shows Azure Resource Manager template examples for Core (SQL) API accounts. You can also find template examples for [Cassandra](templates-samples-cassandra.md), [Gremlin](templates-samples-gremlin.md), [MongoDB](templates-samples-mongodb.md), and [Table](templates-samples-table.md) APIs.

## Core (SQL) API

|**Template**|**Description**|
|---|---|
|[Create an Azure Cosmos account, database, container with autoscale throughput](manage-with-templates.md#create-autoscale) | This template creates a Core (SQL) API account in two regions, a database and container with autoscale throughput. |
|[Create an Azure Cosmos account, database, container with analytical store](manage-with-templates.md#create-analytical-store) | This template creates a Core (SQL) API account in one region with a container configured with Analytical TTL enabled and option to use manual or autoscale throughput. |
|[Create an Azure Cosmos account, database, container with standard (manual) throughput](manage-with-templates.md#create-manual) | This template creates a Core (SQL) API account in two regions, a database and container with standard throughput. |
|[Create an Azure Cosmos account, database and container with a stored procedure, trigger and UDF](manage-with-templates.md#create-sproc) | This template creates a Core (SQL) API account in two regions with a stored procedure, trigger and UDF for a container. |
|[Create a private endpoint for an existing Azure Cosmos account](how-to-configure-private-endpoints.md#create-a-private-endpoint-by-using-a-resource-manager-template) |  This template creates a private endpoint for an existing Azure Cosmos Core (SQL) API account in an existing virtual network. |
|[Create a free-tier Azure Cosmos account](manage-with-templates.md#free-tier) |  This template creates an Azure Cosmos DB Core (SQL) API account on free-tier. |

See [Azure Resource Manager reference for Azure Cosmos DB](/azure/templates/microsoft.documentdb/allversions) page for the reference documentation.
