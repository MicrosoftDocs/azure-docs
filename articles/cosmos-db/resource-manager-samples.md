---
title: Azure Resource Manager templates for Azure Cosmos DB
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/08/2020
ms.author: mjbrown
---

# Azure Resource Manager templates for Azure Cosmos DB

The following tables include links to Azure Resource Manager templates for Azure Cosmos DB:

## Core (SQL) API

|**Template**|**Description**|
|---|---|
|[Create an Azure Cosmos account, database, container with autoscale throughput](manage-sql-with-resource-manager.md#create-autoscale) | This template creates a Core (SQL) API account in two regions, a database and container with autoscale throughput. |
|[Create an Azure Cosmos account, database, container with analytical store](manage-sql-with-resource-manager.md#create-analytical-store) | This template creates a Core (SQL) API account in one region with a container configured with Analytical TTL enabled and option to use manual or autoscale throughput. |
|[Create an Azure Cosmos account, database, container with standard (manual) throughput](manage-sql-with-resource-manager.md#create-manual) | This template creates a Core (SQL) API account in two regions, a database and container with standard throughput. |
|[Create an Azure Cosmos account, database and container with a stored procedure, trigger and UDF](manage-sql-with-resource-manager.md#create-sproc) | This template creates a Core (SQL) API account in two regions with a stored procedure, trigger and UDF for a container. |
|[Create a private endpoint for an existing Azure Cosmos account](how-to-configure-private-endpoints.md#create-a-private-endpoint-by-using-a-resource-manager-template) |  This template creates a private endpoint for an existing Azure Cosmos Core (SQL) API account in an existing virtual network. |
|[Create a free-tier Azure Cosmos account](manage-sql-with-resource-manager.md#free-tier) |  This template creates an Azure Cosmos DB Core (SQL) API account on free-tier. |

## MongoDB API

|**Template**|**Description**|
|---| ---|
|[Create an Azure Cosmos account, database, collection with autoscale throughput](manage-mongodb-with-resource-manager.md#create-autoscale) | This template creates an account using Azure Cosmos DB API for MongoDB in two regions with two containers that share database-level autoscale throughput. |
|[Create an Azure Cosmos account, database, collection with standard (manual) throughput](manage-mongodb-with-resource-manager.md#create-manual) | This template creates an account using Azure Cosmos DB API for MongoDB in two regions with two containers that share database-level standard throughput. |

## Cassandra API

|**Template**|**Description**|
|---| ---|
|[Create an Azure Cosmos account, keyspace, table with autoscale throughput](manage-cassandra-with-resource-manager.md#create-autoscale) | This template creates a Cassandra API account in two regions with a keyspace and table with autoscale throughput. |
|[Create an Azure Cosmos account, keyspace, table with standard (manual) throughput](manage-cassandra-with-resource-manager.md#create-manual) | This template creates a Cassandra API account in two regions with a keyspace and table with manual throughput. |

## Gremlin API

|**Template**|**Description**|
|---| ---|
|[Create an Azure Cosmos account, database, graph with autoscale throughput](manage-gremlin-with-resource-manager.md#create-autoscale) | This template creates a Gremlin API account in two regions with a database and graph with autoscale throughput. |
|[Create an Azure Cosmos account, database, graph with standard (manual) throughput](manage-gremlin-with-resource-manager.md#create-manual) | This template creates a Gremlin API account in two regions with a database and graph with standard throughput. |

## Table API

|**Template**|**Description**|
|---| ---|
|[Create an Azure Cosmos account, table with autoscale throughput](manage-table-with-resource-manager.md#create-autoscale) | This template  creates a Table API account in two regions and a single table with autoscale throughput. |
|[Create an Azure Cosmos account, table with standard (manual) throughput](manage-table-with-resource-manager.md#create-manual) | This template  creates a Table API account in two regions and a single table with standard throughput. |

See [Azure Resource Manager reference for Azure Cosmos DB](/azure/templates/microsoft.documentdb/allversions) page for the reference documentation.
