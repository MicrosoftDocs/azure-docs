---
title: Choose the right pricing tier | Microsoft Azure Maps
description: In this article, you will learn about pricing tiers offered by Microsoft Azure Maps. 
author: walsehgal
ms.author: v-musehg
ms.date: 01/15/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
---

# Choose the right pricing tier in Azure Maps

Azure Maps offers two pricing tiers, S0 and S1. The purpose of this article is to help you choose the right pricing tier for your needs. To help choose the right pricing tier, ask yourself the following two questions.

## What geospatial capabilities do I plan to use?
The S0 pricing tier is right for you if the core geospatial APIs meet your service requirements. If you want more advanced capabilities for your application, consider opting for the S1 pricing tier. Example of advanced capabilities: Aerial plus hybrid imagery, getting route range, and batch geocoding. The **pricing tier capabilities** table can help you choose a pricing tier most suitable for your application.

## How many concurrent users do I plan to support? 
The S0 and S1 pricing tiers handle different amounts of data throughput. The S0 pricing tier handles up to **50 queries per second**, while the S1 tier handles **more than 50 queries per second**.

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

These additional data points are worth considering:
* What type of enterprise do you have?
* How critical is your application?

### Pricing tier targeted customers

See the **pricing tier targeted customers** table to get a better sense of the S0 and S1 pricing tiers. For more information, see [Azure Maps pricing](https://azure.microsoft.com/pricing/details/azure-maps/). 

| Pricing tier  |     Targeted customers                                                                |
|-----------------|:-----------------------------------------------------------------------------------------|
| S0            |    <p>The S0 pricing tier works for applications in all stages of production: from proof-of-concept development and early stage testing to application production and deployment. However, this tier is designed for small-scale development, or customers with low concurrent users, or both. <p>|
| S1            |    <p>The S1 pricing tier is for customers in need of support for large-scale enterprise, mission-critical applications, or high volumes of concurrent users. It's also for those customers who require advanced geospatial services.</p>|

## Next steps

Learn more about how to view and change pricing tiers:

> [!div class="nextstepaction"]	
> [Manage a pricing tier](how-to-manage-pricing-tier.md)
