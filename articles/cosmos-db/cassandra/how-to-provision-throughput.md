---
title: Provision throughput on Azure Cosmos DB for Apache Cassandra resources
description: Learn how to provision container, database, and autoscale throughput in Azure Cosmos DB for Apache Cassandra resources. You will use Azure portal, CLI, PowerShell and various other SDKs. 
author: TheovanKraay
ms.author: thvankra
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: how-to
ms.date: 10/15/2020
ms.devlang: csharp
ms.custom: devx-track-azurecli, ignite-2022, devx-track-arm-template, devx-track-azurepowershell, devx-track-dotnet
---

# Provision database, container or autoscale throughput on Azure Cosmos DB for Apache Cassandra resources
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

This article explains how to provision throughput in Azure Cosmos DB for Apache Cassandra. You can provision standard(manual) or autoscale throughput on a container, or a database and share it among the containers within the database. You can provision throughput using Azure portal, Azure CLI, or Azure Cosmos DB SDKs.

If you are using a different API, see [API for NoSQL](../how-to-provision-container-throughput.md), [API for MongoDB](../mongodb/how-to-provision-throughput.md), [API for Gremlin](../gremlin/how-to-provision-throughput.md) articles to provision the throughput.

## <a id="portal-cassandra"></a> Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos DB account](../mongodb/create-mongodb-dotnet.md#create-an-azure-cosmos-db-account), or select an existing Azure Cosmos DB account.

1. Open the **Data Explorer** pane, and select **New Table**. Next, provide the following details:

   * Indicate whether you are creating a new keyspace or using an existing one. Select the **Provision database throughput** option if you want to provision throughput at the keyspace level.
   * Enter the table ID within the CQL command.
   * Enter a primary key value (for example, `/userrID`).
   * Enter a throughput that you want to provision (for example, 1000 RUs).
   * Select **OK**.

    :::image type="content" source="./media/how-to-provision-throughput/provision-table-throughput-portal-cassandra-api.png" alt-text="Screenshot of Data Explorer, when creating a new collection with database level throughput":::

> [!Note]
> If you are provisioning throughput on a container in an Azure Cosmos DB account configured with API for Cassandra, use `/myPrimaryKey` for the partition key path.

## <a id="dotnet-cassandra"></a> .NET SDK

### Provision throughput for a Cassandra table

```csharp
// Create a Cassandra table with a partition (primary) key and provision throughput of 400 RU/s
session.Execute("CREATE TABLE myKeySpace.myTable(
    user_id int PRIMARY KEY,
    firstName text,
    lastName text) WITH cosmosdb_provisioned_throughput=400");

```
Similar commands can be issued through any CQL-compliant driver.

### Alter or change throughput for a Cassandra table

```csharp
// Altering the throughput too can be done through code by issuing following command
session.Execute("ALTER TABLE myKeySpace.myTable WITH cosmosdb_provisioned_throughput=5000");
```

Similar command can be executed through any CQL compliant driver.

```csharp
// Create a Cassandra keyspace and provision throughput of 400 RU/s
session.Execute("CREATE KEYSPACE IF NOT EXISTS myKeySpace WITH cosmosdb_provisioned_throughput=400");
```

## Azure Resource Manager

Azure Resource Manager templates can be used to provision autoscale throughput on database or container-level resources for all Azure Cosmos DB APIs. See [Azure Resource Manager templates for Azure Cosmos DB](templates-samples.md) for samples.

## Azure CLI

Azure CLI can be used to provision autoscale throughput on a database or container-level resources for all Azure Cosmos DB APIs. For samples see [Azure CLI Samples for Azure Cosmos DB](cli-samples.md).

## Azure PowerShell

Azure PowerShell can be used to provision autoscale throughput on a database or container-level resources for all Azure Cosmos DB APIs. For samples see [Azure PowerShell samples for Azure Cosmos DB](powershell-samples.md).

## Next steps

See the following articles to learn about throughput provisioning in Azure Cosmos DB:

* [Request units and throughput in Azure Cosmos DB](../request-units.md)
