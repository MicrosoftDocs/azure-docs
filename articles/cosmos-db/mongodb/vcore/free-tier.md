---
title: Free tier
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Free tier on Azure Cosmos DB for MongoDB vCore.
author: suvishodcitus
ms.author: suvishod
ms.reviewer: abramees
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 10/14/2023
# CustomerIntent: As a database owner, I want customers/developers to be able to evaluate the service for free.
---


# Build applications for free with Azure Cosmos DB for MongoDB (vCore)-Free Tier

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Azure Cosmos DB for MongoDB vCore now introduces a new SKU, the "Free Tier," enabling users to explore the platform without any financial commitments. The free tier lasts for the lifetime of your account, 
boasting command and feature parity with a regular Azure Cosmos DB for MongoDB vCore account.

It makes it easy for you to get started, develop, test your applications, or even run small production workloads for free. With Free Tier, you get a dedicated MongoDB cluster with 32-GB storage, perfect 
for all of your learning & evaluation needs. Users can provision a single free DB server per supported Azure region for a given subscription. This feature is currently available for our users in the East US, West Europe, and Southeast Asia regions, with more regions being added later on. 


## Getting started

Follow this document to [create a new Azure Cosmos DB for MongoDB vCore](https://learn.microsoft.com/azure/cosmos-db/mongodb/vcore/quickstart-portal) cluster and just select 'Free Tier' checkbox. 
Alternatively, you can also use [Bicep template](https://learn.microsoft.com/azure/cosmos-db/mongodb/vcore/quickstart-bicep?tabs=azure-cli) to provision the resource.

:::image type="content" source="articles/cosmos-db/mongodb/vcore/media/how-to-scale-cluster/provision-freetier.jpg" alt-text="Screenshot of the freetier provisioning.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

## Upgrade to higher tiers

As your application grows, and the need for more powerful machines arises, you can effortlessly transition to any of our available paid tiers with just a click. Just select the cluster tier of your choice from the Scale blade, 
specify your storage requirements, and you're all set. Rest assured, your data, connection string, and network rules remain intact throughout the upgrade process.

:::image type="content" source="articles/cosmos-db/mongodb/vcore/media/how-to-scale-cluster/upgrade-freetier.jpg" alt-text="Screenshot of the freetier scaling.":::


## Benefits

1. Zero Cost
2. Effortless Onboarding
3. Generous Storage (32-GB)
4. Seamless Upgrade Path


## Restrictions

1. For a given subscription, only one free tier account is permissible in a region.
2. Free tier is currently available in East US, West Europe, and Southeast Asia regions only. Support for more regions will be added over time.
3. High availability, Azure Active Directory (AAD) and Diagnostic Logging are not supported.


## Next steps

> [!div class="nextstepaction"]
> [Migration options for Azure Cosmos DB for MongoDB vCore](migration-options.md)
