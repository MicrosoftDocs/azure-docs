---
title: Learn how to move an Azure Cosmos DB account to another region
description: Learn how to do move an Azure Cosmos DB account to another region
author: markjbrown
ms.service: cosmos-db
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 09/12/2020
ms.author: mjbrown
---

# How to move an Azure Cosmos DB account to another region

This article describes how to either move a region where data is replicated in Azure Cosmos DB or how to migrate the account (Azure Resource Manager) meta data as well as the data from one region to another.

## Move data from one region to another

Azure Cosmos DB supports data replication natively so moving data from one region to another is simple and can be accomplished using the Azure portal, Azure PowerShell, or Azure CLI and involves the following steps:

1. Add a new region to the account

    To add a new region to an Azure Cosmos DB account see, [Add/remove regions to an Azure Cosmos DB account](how-to-manage-database-account.md#addremove-regions-from-your-database-account)

1. Perform a manual failover to the new region

    In situations where the region being removed is currently the write region for the account, you will need to initiate a failover to the new region added above. This is a zero downtime operation. If you are moving a read region in a multi-region account you can skip this step. To initiate a failover see, [Perform manual failover on an Azure Cosmos account](how-to-manage-database-account.md#manual-failover)

1. Remove the original region

    To remove a region from an Azure Cosmos DB account see, [Add/remove regions to an Azure Cosmos DB account](how-to-manage-database-account.md#addremove-regions-from-your-database-account)

## Migrate Azure Cosmos DB account meta data

Azure Cosmos DB does not natively support migrating account meta data from one region to another. To migrate both the account meta data and customer data from one region to another, a new account must be created in the desired region and then the data must be copied manually. A near zero downtime migration for SQL API requires the use of [ChangeFeed](change-feed.md) or a tool which leverages it. If migrating MongoDB API, Cassandra or other API or to learn more about options when migrating data between accounts see [Options to migrate your on-premises or cloud data to Azure Cosmos DB](cosmosdb-migrationchoices.md). The steps below demonstrates how to migrate an Azure Cosmos DB account for SQL API and its data from one region to another:

1. Create a new Azure Cosmos DB account in the desired region

    To create a new account via Azure portal, PowerShell or CLI see, [Create an Azure Cosmos DB account](how-to-manage-database-account.md#create-an-account).

1. Create a new database and container

    To create a new database and container see, [Create an Azure Cosmos container](how-to-create-container.md)

1. Migrate data with the Azure Cosmos DB Live Data Migrator tool

    To migrate data with near zero downtime see [Azure Cosmos DB Live Data Migrator tool](https://github.com/Azure-Samples/azure-cosmosdb-live-data-migrator)

1. Update application connection string

    With the live migrator tool still running, update the connection information in the new deployment of your applications. The endpoints and keys for your application can be retrieved from the Azure portal.

    :::image type="content" source="./media/secure-access-to-data/nosql-database-security-master-key-portal.png" alt-text="Access control (IAM) in the Azure portal - demonstrating NoSQL database security":::

1. Redirect requests to new application

    Once the new application is connected to Azure Cosmos DB you can redirect client requests to your new deployment.

1. Delete any resources no longer needed

    With requests now fully redirected to the new instance, you can then delete the old Azure Cosmos DB account and the Live Data Migrator tool.

## Next steps

For more information and examples on how to manage the Azure Cosmos account as well as database and containers, read the following articles:

* [Manage an Azure Cosmos account](how-to-manage-database-account.md)
* [Change feed in Azure Cosmos DB](change-feed.md)
