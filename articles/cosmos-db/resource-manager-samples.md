---
title: Azure Resource Manager templates for Azure Cosmos DB
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/14/2020
ms.author: mjbrown
---

# Azure Resource Manager templates for Azure Cosmos DB

The following tables include links to Azure Resource Manager templates for Azure Cosmos DB:

## SQL (Core) API

|**Template**|**Description**|
|---|---|
|[Create an Azure Cosmos account, database, container](manage-sql-with-resource-manager.md#create-resource) | This template creates a SQL (Core) API account in two regions with two containers with shared database throughput and a container with dedicated throughput. Throughput can be updated by resubmitting the template with updated throughput property value. |
|[Create an Azure Cosmos account, database and container with a stored procedure, trigger and UDF](manage-sql-with-resource-manager.md#create-sproc) | This template creates a SQL (Core) API account in two regions with a stored procedure, trigger and UDF for a container. |
|[Create a private endpoint for an existing Azure Cosmos account](how-to-configure-private-endpoints.md#create-a-private-endpoint-by-using-a-resource-manager-template) |  This template creates a private endpoint for an existing Azure Cosmos SQL API account in an existing virtual network. |

## MongoDB API

|**Template**|**Description**|
|---| ---|
|[Create an Azure Cosmos account, database, collection](manage-mongodb-with-resource-manager.md#create-resource) | This template creates an account using Azure Cosmos DB API for MongoDB in two regions with multi-master enabled. The Azure Cosmos account will have two containers that share database-level throughput. |

## Cassandra API

|**Template**|**Description**|
|---| ---|
|[Create an Azure Cosmos account, keyspace, table](manage-cassandra-with-resource-manager.md#create-resource) | This template creates a Cassandra API account in two regions with multi-master enabled. The Azure Cosmos account will have two tables that share keyspace-level throughput. |

## Gremlin API

|**Template**|**Description**|
|---| ---|
|[Create an Azure Cosmos account, database, graph](manage-gremlin-with-resource-manager.md#create-resource) | This template creates a Gremlin API account in two regions with multi-master enabled. The Azure Cosmos account will have two graphs that share database-level throughput. |

## Table API

|**Template**|**Description**|
|---| ---|
|[Create an Azure Cosmos account, table](manage-table-with-resource-manager.md#create-resource) | This template  creates a Table API account in two regions with multi-master enabled. The Azure Cosmos account will have a single table. |

> [!TIP]
> To enable shared throughput when using Table API, enable account-level throughput in the Azure Portal.

See [Azure Resource Manager reference for Azure Cosmos DB](/azure/templates/microsoft.documentdb/allversions) page for the reference documentation.
