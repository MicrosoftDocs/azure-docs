---
title: Working with Azure Cosmos DB accounts 
description: This article describes how create and use Azure Cosmos DB accounts
author: dharmas-cosmos
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 11/08/2018
ms.author: dharmas
ms.reviewer: sngun

---

# Work with Azure Cosmos DB account

Azure Cosmos DB is a fully managed platform-as-a-service (PaaS). To begin using Azure Cosmos DB, you should initially create an Azure Cosmos DB account in your Azure subscription. Your Azure Cosmos DB account contains a unique DNS name and you can manage an account by using Azure portal, Azure CLI or by using different language-specific SDKs. For more information, see [how to manage your Azure Cosmos DB account](how-to-manage-database-account.md).

The Azure Cosmos DB account is the fundamental unit of global distribution and high availability. For globally distributing your data and throughput across multiple Azure regions, you can add and remove Azure regions to your Azure Cosmos account at any time. You can configure your Azure Cosmos DB account to have either a single or multiple write regions. For more information, see [how to add and remove Azure regions to your Azure Cosmos DB account](how-to-manage-database-account.md). You can configure the [default consistency](consistency-levels.md) level on Azure Cosmos DB account. Azure Cosmos DB provides comprehensive SLAs encompassing throughput, latency at the 99th percentile, consistency, and high availability. For more information, see [Azure Cosmos DB SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_2/).

To securely manage access to all the data within your Azure Cosmos DB account, you can use the master keys associated with your account. To further secure access to your data, you can configure a VNET service endpoint and IP-firewall on your Azure Cosmos DB account. 

## Elements in an Azure Cosmos DB account

Azure Cosmos DB container is the fundamental unit of scalability. You can virtually have an unlimited provisioned throughput (RU/s) and storage on a container. Azure Cosmos DB transparently partitions your container using the logical partition key that you specify in order to elastically scale your provisioned throughput and storage. For more information, see [working with Azure Cosmos DB containers and items](databases-containers-items.md).

Currently, you can create a maximum of 100 Azure Cosmos DB accounts under an Azure subscription. A single Azure Cosmos DB account can virtually manage unlimited amount of data and provisioned throughput. To manage your data and provisioned throughput, you can create one or more Azure Cosmos DB databases under your account and within that database, you can create one or more containers. The following image shows the hierarchy of elements in an Azure Cosmos DB account:

![Hierarchy of a Azure Cosmos DB account](./media/account-overview/hierarchy.png)

## Next steps

You can now proceed to learn how to manage your Azure Cosmos DB account or see other concepts associated with Azure Cosmos DB:

* [How-to manage your Azure Cosmos DB account](how-to-manage-database-account.md)
* [Global distribution](distribute-data-globally.md)
* [Consistency levels](consistency-levels.md)
* [Working with Azure Cosmos containers and items](databases-containers-items.md)
* [VNET service endpoint for your Azure Cosmos DB account](vnet-service-endpoint.md)
* [IP-firewall for your Azure Cosmos DB account](firewall-support.md)
* [How-to add and remove Azure regions to your Azure Cosmos DB account](how-to-manage-database-account.md)
* [Azure Cosmos DB SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_2/)
