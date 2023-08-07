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

Azure Maps now offers two pricing tiers: Gen 1 and Gen 2. The new Gen 2 pricing tier contains all Azure Maps capabilities included in the Gen 1 tier, but with increased QPS (Queries Per Second) limits, allowing you to achieve cost savings as Azure Maps transactions increase. This article helps you determine the right pricing tier for your needs.

## Pricing tier targeted customers

The following **pricing tier targeted customers** table shows the Gen 1 and Gen 2 pricing tiers.  For more information, see [Azure Maps pricing]. If you're a current Azure Maps customer, you can learn how to change from Gen 1 to Gen 2 pricing in the [Manage the pricing tier of your Azure Maps account] article.

| Pricing tier  | SKU | Targeted Customers|
|---------------|:---:| ------------------|
|**Gen 1**|S0| The S0 pricing tier works for applications in all stages of production: from proof-of-concept development and early stage testing to application production and deployment. However, this tier is designed for small-scale development, or customers with low concurrent users, or both. S0 has a restriction of 50 QPS for all services combined.
|         |S1| The S1 pricing tier is for customers with large-scale enterprise applications, mission-critical applications, or high volumes of concurrent users. It's also for those customers who require advanced geospatial services.
| **Gen 2** | Maps/Location Insights | Gen 2 pricing is for new and current Azure Maps customers. Gen 2 comes with a free monthly tier of transactions to be used to test and build on Azure maps. Maps and Location Insights SKUs contain all Azure Maps capabilities. It allows you to achieve cost savings as Azure Maps transactions increases. Additionally, it has higher QPS limits than Gen 1. The Gen 2 pricing tier is required when using [Creator for indoor maps].

For more information on QPS limits, see [Azure Maps QPS rate limits].

For pricing information on [Creator for indoor maps], see the *Creator* section in [Azure Maps pricing].

## Next steps

Learn more about how to view and change pricing tiers:

> [!div class="nextstepaction"]
> [Manage the pricing tier of your Azure Maps account]

[Azure Maps pricing]: https://aka.ms/CreatorPricing
[Manage the pricing tier of your Azure Maps account]: how-to-manage-pricing-tier.md
[Creator for indoor maps]: creator-indoor-maps.md
[Azure Maps QPS rate limits]: azure-maps-qps-rate-limits.md
