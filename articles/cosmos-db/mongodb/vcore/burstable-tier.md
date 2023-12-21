---
title: Burstable tier
titleSuffix: Introduction to Burstable Tier on Azure Cosmos DB for MongoDB vCore
description: Introduction to Burstable Tier on Azure Cosmos DB for MongoDB vCore.
author: suvishodcitus
ms.author: suvishod
ms.reviewer: abramees
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 11/01/2023
---

# Burstable Tier (M25) on Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]


## What is burstable SKU (M25)?

Burstable tier offers an intelligent solution tailored for small database workloads. By providing minimal CPU performance during idle periods, these clusters optimize 
resource utilization. However, the real brilliance lies in their ability to seamlessly scale up to full CPU power in response to increased traffic or workload demands. 
This adaptability ensures peak performance precisely when it's needed, all while delivering substantial cost savings.

By reducing the initial price point of the service, Azure Cosmos DB's Burstable Cluster Tier aims to facilitate user onboarding and exploration of MongoDB for vCore 
at significantly reduced prices. This democratization of access empowers businesses of all sizes to harness the power of Cosmos DB without breaking the bank. 
Whether you're a startup, a small business, or an enterprise, this tier opens up new possibilities for cost-effective scalability.

Provisioning a Burstable Tier is as straightforward as provisioning regular tiers; you only need to choose "M25" in the cluster tier option. Here's a quick start 
guide that offers step-by-step instructions on how to set up a Burstable Tier with [Azure Cosmos DB for MongoDB vCore](quickstart-portal.md)


  | Setting | Value |
  | --- | --- |
  | **Cluster tier** | M25 Tier, 2 vCores, 8-GiB RAM |
  | **Storage** | 32 GiB, 64 GiB or 128 GiB |

### Restrictions

While the Burstable Cluster Tier offers unparalleled flexibility, it's crucial to be mindful of certain constraints:

* Supported disk sizes include 32GB, 64GB, and 128GB. 
* High availability (HA) is not supported.
* Supports one shard only.

## Next steps

In this article, we delved into the Burstable Tier of Azure Cosmos DB for MongoDB vCore. Now, let's expand our knowledge by exploring the product further and 
examining the diverse migration options available for moving your MongoDB to Azure.

> [!div class="nextstepaction"]
> [Migration options for Azure Cosmos DB for MongoDB vCore](migration-options.md)
