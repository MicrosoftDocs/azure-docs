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
ms.date: 11/08/2023
ms.custom: references_regions
# CustomerIntent: As a database owner, I want customers/developers to be able to evaluate the service for free.
---


# Build applications for free with Azure Cosmos DB for MongoDB (vCore)-Free Tier

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Azure Cosmos DB for MongoDB vCore now introduces a new SKU, the "Free Tier," enabling users to explore the platform without any financial commitments. The free tier lasts for the lifetime of your account, 
boasting command and feature parity with a regular Azure Cosmos DB for MongoDB vCore account.

It makes it easy for you to get started, develop, test your applications, or even run small production workloads for free. With Free Tier, you get a dedicated MongoDB cluster with 32-GB storage, perfect 
for all of your learning & evaluation needs. Users can provision a single free DB server per supported Azure region for a given subscription. This feature is currently available for our users in the East US, and Southeast Asia regions. 


## Get started

Follow this document to [create a new Azure Cosmos DB for MongoDB vCore](quickstart-portal.md) cluster and just select 'Free Tier' checkbox. 
Alternatively, you can also use [Bicep template](quickstart-bicep.md) to provision the resource.

:::image type="content" source="media/how-to-scale-cluster/provision-free-tier.jpg" alt-text="Screenshot of the free tier provisioning.":::

## Upgrade to higher tiers

As your application grows, and the need for more powerful machines arises, you can effortlessly transition to any of our available paid tiers with just a click. Just select the cluster tier of your choice from the Scale blade, 
specify your storage requirements, and you're all set. Rest assured, your data, connection string, and network rules remain intact throughout the upgrade process.

:::image type="content" source="media/how-to-scale-cluster/upgrade-free-tier.jpg" alt-text="Screenshot of the free tier scaling.":::


## Benefits

* Zero cost
* Effortless onboarding
* Generous storage (32-GB)
* Seamless upgrade path


## Restrictions

* For a given subscription, only one free tier account is permissible in a region.
* Free tier is currently available in East US, and Southeast Asia regions only.
* High availability, Azure Active Directory (Azure AD) and Diagnostic Logging are not supported.


## Next steps

Having gained insights into the Azure Cosmos DB for MongoDB vCore's free tier, it's time to embark on a journey to understand how to perform a migration assessment and successfully migrate your MongoDB to the Azure.

> [!div class="nextstepaction"]
> [Migration options for Azure Cosmos DB for MongoDB vCore](migration-options.md)
