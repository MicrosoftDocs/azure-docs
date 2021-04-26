---
title: Choose the right pricing tier for Microsoft Azure Maps
description: Learn about Azure Maps pricing tiers. See which features are offered at which tiers, and view key considerations for choosing a pricing tier. 
author: anastasia-ms
ms.author: v-stharr
ms.date: 04/26/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Choose the right pricing tier in Azure Maps

Azure Maps now offers two pricing tiers:  Gen 1 and Gen 2. The Gen 2 new pricing tier contains all Azure Maps capabilities without any QPS (Queries Per Second) restriction and allows you to achieve cost savings as Azure Maps transactions increases. The purpose of this article is to help you choose the right pricing tier for your needs.


## Pricing tier targeted customers

See the **pricing tier targeted customers** table below for a better understanding of Gen 1 and Gen 2 pricing tiers.  For more information, see [Azure Maps pricing](https://azure.microsoft.com/pricing/details/azure-maps/). If you're a current Azure Maps customer, you can learn how to change from Gen 1 to Gen 2 pricing [here](how-to-manage-pricing-tier.md)

| Pricing tier  | SKU | Targeted Customers|
|-----------------|----| -----------------|
| **Gen 1** | S0            |    The S0 pricing tier works for applications in all stages of production: from proof-of-concept development and early stage testing to application production and deployment. However, this tier is designed for small-scale development, or customers with low concurrent users, or both.
|        |S1            |    The S1 pricing tier is for customers with large-scale enterprise applications, mission-critical applications, or high volumes of concurrent users. It's also for those customers who require advanced geospatial services.
| **Gen 2** | Maps |
|     | Location Insights |Gen2 pricing is perfect for new and current Azure Maps customers as it comes with a free monthly tier of transactions to be used to test and build on Azure maps. Maps and Locations Insights SKU’s contain all current and future Azure Maps capabilities.   Additionally, there’s no QPS (Queries Per Second) restrictions and for most services, achieve cost savings as Azure Maps transactions increase.  

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
| Weather                       |✓                    |✓        |
|  Creator (Preview)                         |                   |✓        |
|  Elevation (Preview)                        |                   |✓        |

Consider these additional points:

* What type of enterprise do you have?
* How critical is your application?

## Next steps

Learn more about how to view and change pricing tiers:

> [!div class="nextstepaction"]
> [Manage a pricing tier](how-to-manage-pricing-tier.md)
