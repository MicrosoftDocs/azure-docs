---
title: Regional presence with Azure Cosmos DB
description: This article explains about the regional presence of Azure Cosmos DB and different cloud environments.
author: rimman
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 12/07/2018
ms.author: rimman
ms.custom: seodec18
---

# Regional presence of Azure Cosmos DB

Currently, Azure is available in [54 regions](https://azure.microsoft.com/global-infrastructure/regions/) worldwide. Azure Cosmos DB is a foundational service in Azure and is available in all regions where Azure is available.

[![Regions where Azure Cosmos DB is available](./media/regional-presence/regional-presence.png)](./media/regional-presence/regional-presence.png#lightbox)

Cosmos DB is available in all five distinct Azure cloud environments available to customers:

* **Azure public** cloud, which is available globally.

* **Azure China** is available through a unique partnership between Microsoft and 21Vianet, one of the country’s largest internet providers.

* **Azure Germany** provides services under a data trustee model, which ensures that customer data remains in Germany under the control of T-Systems International GmbH, a subsidiary of Deutsche Telecom, acting as the German data trustee.

* **Azure Government** is available in four regions in the United States to US government agencies and their partners. 

* **Azure Government for Department of Defense(DoD)** is available in two regions in the United States to the US Department of Defense.

## Regional presence with global distribution

Different APIs exposed by Azure Cosmos DB (including SQL, MongoDB, Cassandra, Gremlin, and Azure Table storage) are available in all Azure regions. For example, you can have MongoDB and Cassandra APIs exposed by Azure Cosmos DB not only in all of the global Azure regions but also in Azure sovereign regions like China, Germany, Government, and Department of Defense (DoD) regions.

Azure Cosmos DB is a [globally distributed](distribute-data-globally.md) database. You can associate any number of Azure regions with your Azure Cosmos account and your data is automatically and transparently replicated. You can add or remove a region to your Azure Cosmos account at any time. With the turnkey global distribution capability and multi-mastered replication protocol, Azure Cosmos DB offers less than 10 ms read and write latencies at the 99th percentile, 99.999 read and write availability, and ability to elastically scale provisioned throughput for reads and writes across all the regions associated with your Azure Cosmos account. Azure Cosmos DB, also offers five well-defined consistency models and you can choose to apply a specific consistency model to your data. Finally, Azure Cosmos DB is the only database service in the industry that provides a comprehensive Service Level Agreement (SLA) encompassing provisioned throughput, latency at the 99th percentile, high availability, and consistency.

## Next steps

You can now learn about different concepts of Azure Cosmos DB with the following articles:

* [Global data distribution](distribute-data-globally.md)
* [How to manage an Azure Cosmos DB account](manage-account.md)
* [Provision throughput for Azure Cosmos containers and databases](set-throughput.md)
* [Cosmos DB SLA](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_2/)
