---
title: Relocate an Azure Cosmos DB NoSQL account to another region
description: Learn how to relocate an Azure Cosmos DB NoSQL account to another region.
author: seesharprun
ms.service: azure-cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.custom:
  - subject-relocation
ms.date: 06/11/2024
ms.author: sidandrews
ms.reviewer: mjbrown
---

# Relocate an Azure Cosmos DB NoSQL account to another region

[!INCLUDE [relocate-reasons](./includes/service-relocation-reason-include.md)]


This article describes how to either:

- Relocate a region where data is replicated in Azure Cosmos DB.
- Migrate account (Azure Resource Manager) metadata and data from one region to another.


## Prerequisites

- An app registration must be created with delegated permission to the source and target resource group instance and “API permission” for “User.ReadBasic.All”.

- The selected Cosmos DB API must remain same from source to target. This document uses SQL DB API.

- Account names must be limited to 44 characters, all lowercase.

- When you add or remove locations to an Azure Cosmos account, you can’t simultaneously modify other properties.

- Identify all Cosmos DB dependent resources.


## Downtime

## Considerations for Service Endpoints

The virtual network service endpoints for Azure Cosmos DB restrict access to a specified virtual network. The endpoints can also restrict access to a list of IPv4 (internet protocol version 4) address ranges. Any user connecting to the Event Hubs from outside those sources is denied access. If Service endpoints were configured in the source region for the Event Hubs resource, the same would need to be done in the target one.

For a successful recreation of the Azure Cosmos DB to the target region, the VNet and Subnet must be created beforehand. In case the move of these two resources is being carried out with the Azure Resource Mover tool, the service endpoints won’t be configured automatically. Hence, they need to be configured manually, which can be done through the [Azure portal](/azure/key-vault/general/quick-create-portal), the [Azure CLI](/azure/key-vault/general/quick-create-cli), or [Azure PowerShell](/azure/key-vault/general/quick-create-powershell).



## Redeploy without data

For cases where the Cosmos DB instance needs to be relocated alone without the configuration and customer data, the instance itself can be created using [Microsoft.DocumentDB databaseAccounts](/azure/templates/microsoft.documentdb/2021-04-15/databaseaccounts?tabs=json&pivots=deployment-language-arm-template)

## Redeploy with data

Azure Cosmos DB supports data replication natively, so moving data from one region to another is simple. You can accomplish it by using the Azure portal, Azure PowerShell, or the Azure CLI. It involves the following steps:

1. Add a new region to the account.

    To add a new region to an Azure Cosmos DB account, see [Add/remove regions to an Azure Cosmos DB account](/azure/cosmos-db/how-to-manage-database-account#add-remove-regions-from-your-database-account).

1. Perform a manual failover to the new region.

    When the region that's being removed is currently the write region for the account, you'll need to start a failover to the new region added in the previous step. This is a zero-downtime operation. If you're moving a read region in a multiple-region account, you can skip this step. 
    
    To start a failover, see [Perform manual failover on an Azure Cosmos DB account](/azure/cosmos-db/how-to-manage-database-account#perform-manual-failover-on-an-azure-cosmos-db-account).

1. Remove the original region.

    To remove a region from an Azure Cosmos DB account, see [Add/remove regions from your Azure Cosmos DB account](/azure/cosmos-db/how-to-manage-database-account#add-remove-regions-from-your-database-account).

> [!NOTE]
> If you perform a failover operation or add/remove a new region while an [asynchronous throughput scaling operation](/azure/cosmos-db/scaling-provisioned-throughput-best-practices#background-on-scaling-rus) is in progress, the throughput scale-up operation will be paused. It will resume automatically when the failover or add/remove region operation is complete. 

## Redeploy Azure Cosmos DB account metadata

Azure Cosmos DB does not natively support migrating account metadata from one region to another. To migrate both the account metadata and customer data from one region to another, you must create a new account in the desired region and then copy the data manually.

> [!IMPORTANT]
> It is not necessary to migrate the account metadata if the data is stored or moved to a different region. The region in which the account metadata resides has no impact on the performance, security or any other operational aspects of your Azure Cosmos DB account.

A near-zero-downtime migration for the API for NoSQL requires the use of the [change feed](/azure/cosmos-db/change-feed) or a tool that uses it.

The following steps demonstrate how to migrate an Azure Cosmos DB account for the API for NoSQL and its data from one region to another:

1. Create a new Azure Cosmos DB account in the desired region.

    To create a new account via the Azure portal, PowerShell, or the Azure CLI, see [Create an Azure Cosmos DB account](/azure/cosmos-db/how-to-manage-database-account#create-an-account).

1. Create a new database and container.

    To create a new database and container, see [Create an Azure Cosmos DB container](/azure/cosmos-db/nosql/how-to-create-container).

1. Migrate data by using the Azure Cosmos DB Spark Connector live migration sample.

    To migrate data with near zero downtime, see [Live Migrate Azure Cosmos DB SQL API Containers data with Spark Connector](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples/DatabricksLiveContainerMigration).

1. Update the application connection string.

    With the Live Data Migration sample still running, update the connection information in the new deployment of your application. You can retrieve the endpoints and keys for your application from the Azure portal.

    :::image type="content" source="/azure/cosmos-db/media/secure-access-to-data/nosql-database-security-master-key-portal.png" alt-text="Access control in the Azure portal, demonstrating NoSQL database security.":::

1. Redirect requests to the new application.

    After the new application is connected to Azure Cosmos DB, you can redirect client requests to your new deployment.

1. Delete any resources that you no longer need.

    With requests now fully redirected to the new instance, you can delete the old Azure Cosmos DB account and stop the Live Data Migrator sample.

## Next steps

For more information and examples on how to manage the Azure Cosmos DB account as well as databases and containers, read the following articles:

* [Manage an Azure Cosmos DB account](/azure/cosmos-db/how-to-manage-database-account)
* [Change feed in Azure Cosmos DB](/azure/cosmos-db/change-feed)
