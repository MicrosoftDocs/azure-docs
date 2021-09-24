---
title: Move an Azure Cosmos DB account to another region
description: Learn how to move an Azure Cosmos DB account to another region.
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 05/13/2021
ms.author: mjbrown
---

# Move an Azure Cosmos DB account to another region
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

This article describes how to either:

- Move a region where data is replicated in Azure Cosmos DB.
- Migrate account (Azure Resource Manager) metadata and data from one region to another.

## Move data from one region to another

Azure Cosmos DB supports data replication natively, so moving data from one region to another is simple. You can accomplish it by using the Azure portal, Azure PowerShell, or the Azure CLI. It involves the following steps:

1. Add a new region to the account.

    To add a new region to an Azure Cosmos DB account, see [Add/remove regions to an Azure Cosmos DB account](how-to-manage-database-account.md#addremove-regions-from-your-database-account).

1. Perform a manual failover to the new region.

    When the region that's being removed is currently the write region for the account, you'll need to start a failover to the new region added in the previous step. This is a zero-downtime operation. If you're moving a read region in a multiple-region account, you can skip this step. 
    
    To start a failover, see [Perform manual failover on an Azure Cosmos account](how-to-manage-database-account.md#manual-failover).

1. Remove the original region.

    To remove a region from an Azure Cosmos DB account, see [Add/remove regions from your Azure Cosmos DB account](how-to-manage-database-account.md#addremove-regions-from-your-database-account).

## Migrate Azure Cosmos DB account metadata

Azure Cosmos DB does not natively support migrating account metadata from one region to another. To migrate both the account metadata and customer data from one region to another, you must create a new account in the desired region and then copy the data manually. 

A near-zero-downtime migration for the SQL API requires the use of the [change feed](change-feed.md) or a tool that uses it. If you're migrating the MongoDB API, the Cassandra API, or another API, or to learn more about options for migrating data between accounts, see [Options to migrate your on-premises or cloud data to Azure Cosmos DB](cosmosdb-migrationchoices.md). 

The following steps demonstrate how to migrate an Azure Cosmos DB account for the SQL API and its data from one region to another:

1. Create a new Azure Cosmos DB account in the desired region.

    To create a new account via the Azure portal, PowerShell, or the Azure CLI, see [Create an Azure Cosmos DB account](how-to-manage-database-account.md#create-an-account).

1. Create a new database and container.

    To create a new database and container, see [Create an Azure Cosmos container](how-to-create-container.md).

1. Migrate data by using the Azure Cosmos DB Live Data Migrator tool.

    To migrate data with near zero downtime, see [Azure Cosmos DB Live Data Migrator tool](https://github.com/Azure-Samples/azure-cosmosdb-live-data-migrator).

1. Update the application connection string.

    With the Live Data Migrator tool still running, update the connection information in the new deployment of your application. You can retrieve the endpoints and keys for your application from the Azure portal.

    :::image type="content" source="./media/secure-access-to-data/nosql-database-security-master-key-portal.png" alt-text="Access control in the Azure portal, demonstrating NoSQL database security.":::

1. Redirect requests to the new application.

    After the new application is connected to Azure Cosmos DB, you can redirect client requests to your new deployment.

1. Delete any resources that you no longer need.

    With requests now fully redirected to the new instance, you can delete the old Azure Cosmos DB account and the Live Data Migrator tool.

## Next steps

For more information and examples on how to manage the Azure Cosmos account as well as databases and containers, read the following articles:

* [Manage an Azure Cosmos account](how-to-manage-database-account.md)
* [Change feed in Azure Cosmos DB](change-feed.md)
