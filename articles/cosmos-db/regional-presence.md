---
title: Regional presence of Azure Cosmos DB
description: Information about the regional presence of Azure Cosmos DB and different cloud environments that are available
keywords: regions, global distribution
services: cosmos-db
author: rimman
manager: dharmas-cosmos

ms.service: cosmos-db
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 11/06/2018
ms.author: rimman
---
# Regional presence of Azure Cosmos DB

Currently, Microsoft Azure is available or announced in [54 regions](https://azure.microsoft.com/en-us/global-infrastructure/regions/) worldwide. Azure Cosmos DB is a foundational service in Azure and is available in all regions where Azure is available.

![Azure Cosmos DB regional availability](./media/regional-presence/regional-presence.png)

Cosmos DB is available in all five distinct Azure cloud environments available to customers:

1. Azure public cloud, available globally.
2. Azure China 21Vianet, available through a unique partnership between Microsoft and 21Vianet, one of the country’s largest Internet providers.
3. Azure Germany, which provides services under a data trustee model ensuring that customer data remains in Germany under the control of T-Systems International GmbH, a subsidiary of Deutsche Telecom, and acting as the German data trustee.
4. Azure Government, available in four regions in the United States to US government agencies and their partners.
5. Azure Government for DoD, available in two regions in the United States to the US Department of Defense.

The APIs exposed by Cosmos DB (including SQL, MongoDB, Cassandra, Gremlin, and Azure Table storage) are available in all Azure regions. For example, you can have MongoDB and Cassandra APIs exposed by Cosmos DB not only in all of the global Azure regions but in sovereign regions (China, Germany), Government, and Department of Defense (DoD) regions.

Cosmos DB is designed to be [globally distributed](distribute-data-globally.md) from the ground up. You can associate any number of Azure regions with your Cosmos account and your data will be automatically and transparently replicated. You can add or remove Azure regions to your Cosmos account at any time. With its turnkey global distribution capability and multi-mastered replication protocol, Cosmos DB offers less than 10 ms read and write latencies at the 99th percentile, 99.999 read and write availability, and ability to elastically scale provisioned throughput for reads and writes across all the regions associated with your Cosmos account. Cosmos DB, also offers five well-defined consistency models for you to choose from. Finally, Cosmos DB is the only database service in the industry that provides a comprehensive Service Level Agreement (SLA) encompassing provisioned throughput, latency at the 99th percentile, high availability, and consistency.

## Next steps

* [Azure regions](https://azure.microsoft.com/en-us/global-infrastructure/regions/)
* [Global data distribution](distribute-data-globally.md)
* [How to manage a Cosmos DB account](manage-account.md)
* [Provision throughput for containers and databases](set-throughput.md)
* [Cosmos DB SLA](https://azure.microsoft.com/en-us/support/legal/sla/cosmos-db/v1_2/)
