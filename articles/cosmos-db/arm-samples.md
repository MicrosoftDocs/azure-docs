---
title: Azure Resource Manager templates for Azure Cosmos DB
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: mjbrown
---

# Azure Resource Manager templates for Azure Cosmos DB

The following table includes links to Azure Resource Manager templates for Azure Cosmos DB:

|**API type** | **link to sample**| **Description** |
|---|---| ---|
|Core (SQL) API| [Create an Azure Cosmos DB account (multi-master)](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cosmosdb-sql) | This template creates a SQL API account in two regions with multi-master enabled. The Azure Cosmos account will have two containers that share database-level throughput. |
|Core (SQL) API | [Create an account with VNet Service endpoint integration](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cosmosdb-sql-shared-ru) | This template creates an Azure Cosmos account with Virtual Network service endpoint integration. |
| MongoDB API | [Create an Azure Cosmos DB account (multi-master)](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cosmosdb-mongodb) | This template creates an account using Azure Cosmos DB's API for MongoDB in two regions with multi-master enabled. The Azure Cosmos account will have two containers that share database-level throughput. |
| Cassandra API | [Create an Azure Cosmos DB account (multi-master)](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cosmosdb-cassandra) | This template creates a Cassandra API account in two regions with multi-master enabled. The Azure Cosmos account will have two tables that share keyspace-level throughput. |
| Gremlin API| [Create an Azure Cosmos DB account (multi-master)](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cosmosdb-gremlin) | This template creates a Gremlin API account in two regions with multi-master enabled. The Azure Cosmos account will have two graphs that share database-level throughput. |
| Table API | [Create an Azure Cosmos DB account (multi-master)](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cosmosdb-table) | This template  creates a Table API account in two regions with multi-master enabled. The Azure Cosmos account will have a single table. |

> [!TIP]
> To enable shared throughput when using Table API, enable account-level throughput in the Azure Portal.

To learn how to deploy the templates by using Azure CLI and Azure PowerShell, see the following docs:

* [Deploy Azure Cosmos DB SQL API resources](manage-sql-with-arm.md) using a Resource Manager template.
* [Deploy Azure Cosmos DB Cassandra API resources](manage-cassandra-with-arm.md) using a Resource Manager template.
* [Deploy Azure Cosmos DB's API for MongoDB resources](manage-mongodb-with-arm.md) using a Resource Manager template.
* [Deploy Azure Cosmos DB Gremlin API resources](manage-gremlin-with-arm.md) using a Resource Manager template.
* [Deploy Azure Cosmos DB Table API resources](manage-table-with-arm.md) using a Resource Manager template.

See [ARM reference for Azure Cosmos DB](azure/templates/microsoft.documentdb/allversions) page for the reference documentation.