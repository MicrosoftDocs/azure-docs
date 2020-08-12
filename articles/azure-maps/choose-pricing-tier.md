---
title: Choose the right pricing tier for Microsoft Azure Maps
description: Learn about Azure Maps pricing tiers. See which features are offered at which tiers, and view key considerations for choosing a pricing tier. 
author: anastasia-ms
ms.author: v-stharr
ms.date: 08/12/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Choose the right pricing tier in Azure Maps

Azure Maps offers two pricing tiers: S0 and S1. The purpose of this article is to help you choose the right pricing tier for your needs. To choose the right pricing tier, ask yourself the following two questions.

## How many concurrent users do I plan to support?

The S0 and S1 pricing tiers handle different amounts of data throughput. The S0 pricing tier handles up to **50 queries per second**. Whereas the S1 tier handles **more than 50 queries per second**.

## What geospatial capabilities do I plan to use?

If the core geospatial APIs meet your service requirements, choose the S0 pricing tier. If you want more advanced capabilities for your application, consider choosing for the S1 pricing tier. Advanced capabilities include: Aerial plus hybrid imagery, getting route range, and batch geocoding. To select the pricing tier most suitable for your application, review the **pricing tier capabilities** table below:

### Pricing tier capabilities

| Capability                              |        S0           |  S1      |
|-----------------------------------------|:-------------------:|:--------:|
| Map Render                              | ✓                   | ✓       |
| Satellite Imagery                       |                     | ✓        |
| Search                                  | ✓                    | ✓        |
| Batch Search                            |                     | ✓        |
| Route                                   | ✓                    |✓        |
| Batch Routing                            |                    | ✓        |
| Matrix Routing                          |                     | ✓        |
| Route Range (Isochrones)                |                     | ✓        |
| Traffic                                |✓                    |✓        |
| Time Zone                               |✓                    |✓        |
| Geolocation (Preview)                    |✓                   |✓        |
| Spatial Operations                        |                    |✓        |
| Geofencing                                |                    |✓        |
| Azure Maps Data (Preview)                |                     | ✓        |
| Mobility (Preview)                       |                     | ✓        |
| Weather (Preview)                        |✓                    |✓        |
|  Creator (Preview)                         |                   |✓        |

Consider these additional points:

* What type of enterprise do you have?
* How critical is your application?

### Pricing tier targeted customers

See the **pricing tier targeted customers** table to get a better sense of the S0 and S1 pricing tiers. For more information, see [Azure Maps pricing](https://azure.microsoft.com/pricing/details/azure-maps/). 

| Pricing tier  |     Targeted customers                                                                |
|-----------------|:-----------------------------------------------------------------------------------------|
| S0            |    The S0 pricing tier works for applications in all stages of production: from proof-of-concept development and early stage testing to application production and deployment. However, this tier is designed for small-scale development, or customers with low concurrent users, or both. 
| S1            |    The S1 pricing tier is for customers with large-scale enterprise applications, mission-critical applications, or high volumes of concurrent users. It's also for those customers who require advanced geospatial services.

## Next steps

Learn more about how to view and change pricing tiers:

> [!div class="nextstepaction"]
> [Manage a pricing tier](how-to-manage-pricing-tier.md)
