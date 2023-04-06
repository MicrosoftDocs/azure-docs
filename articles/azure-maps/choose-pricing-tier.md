---
title: Choose the right pricing tier for Microsoft Azure Maps
description: Learn about Azure Maps pricing tiers. See which features are offered at which tiers, and view key considerations for choosing a pricing tier. 
author: eriklindeman
ms.author: eriklind
ms.date: 11/11/2021
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---

# Choose the right pricing tier in Azure Maps

Azure Maps now offers two pricing tiers: Gen 1 and Gen 2. The new Gen 2 pricing tier contains all Azure Maps capabilities with increased QPS (Queries Per Second) limits over Gen 1, and it allows you to achieve cost savings as Azure Maps transactions increases. The purpose of this article is to help you choose the right pricing tier for your needs.

## Pricing tier targeted customers

See the **pricing tier targeted customers** table below for a better understanding of Gen 1 and Gen 2 pricing tiers.  For more information, see [Azure Maps pricing](https://aka.ms/CreatorPricing). If you're a current Azure Maps customer, you can learn how to change from Gen 1 to Gen 2 pricing in the [Manage pricing tier](how-to-manage-pricing-tier.md) article.

| Pricing tier  | SKU | Targeted Customers|
|---------------|:---:| ------------------|
|**Gen 1**|S0| The S0 pricing tier works for applications in all stages of production: from proof-of-concept development and early stage testing to application production and deployment. However, this tier is designed for small-scale development, or customers with low concurrent users, or both. S0 has a restriction of 50 QPS for all services combined.
|         |S1| The S1 pricing tier is for customers with large-scale enterprise applications, mission-critical applications, or high volumes of concurrent users. It's also for those customers who require advanced geospatial services.
| **Gen 2** | Maps/Location Insights | Gen 2 pricing is for new and current Azure Maps customers. Gen 2 comes with a free monthly tier of transactions to be used to test and build on Azure maps. Maps and Location Insights SKU’s contain all Azure Maps capabilities. It allows you to achieve cost savings as Azure Maps transactions increases. Additionally, it has higher QPS limits than Gen 1. The Gen 2 pricing tier is required when using [Creator for indoor maps](creator-indoor-maps.md).
|     |  |

For more information on QPS limits, please refer to [Azure Maps QPS rate limits](azure-maps-qps-rate-limits.md).

For additional pricing information on [Creator for indoor maps](creator-indoor-maps.md), see the *Creator* section in [Azure Maps pricing](https://aka.ms/CreatorPricing).

## Next steps

Learn more about how to view and change pricing tiers:

> [!div class="nextstepaction"]
> [Manage a pricing tier](how-to-manage-pricing-tier.md)
