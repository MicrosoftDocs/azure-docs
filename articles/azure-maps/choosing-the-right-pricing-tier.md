---
title: Choosing the right pricing tier for Azure Maps | Microsoft Docs
description: Learn about pricing tiers offered by Azure Maps 
author: walsehgal
ms.author: v-musehg
ms.date: 11/23/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
---

# Choosing the right pricing tier in Azure Maps

Azure Maps offers two pricing tiers. The purpose of this article is to help you choose which pricing tier is right for you. To help yourself choosing the right pricing tier, ask yourself two questions:

**What geospatial capabilities do I plan to use?**
If you feel that your service requirements are met by the core geospatial APIs, then the S0 pricing tier is right for you. If you want more advanced capabilities for your application such as areal+hybrid imagery, getting route range, batch geocoding etc. then consider opting for the S1 pricing tier. The table below with **pricing tier capabilities** will provide you with a better idea of your application's needs and will also help you choose a pricing tier most suitable for your application.

**How many concurrent users do I plan to support?** 
S0 and S1 pricing tiers can handle different amounts of data throughput. Before choosing an Azure Maps pricing tier consider asking yourself questions like how many concurrent users do you want to support? The S0 pricing tier can handle up to **50 queries per second** and the S1 pricing tier can handle **more than 50 queries per second**.


<br>

<center>**Pricing tier capabilities**</center>

| Capability                              |        S0           |  S1      |
|-----------------------------------------|:-------------------:|:--------:|
| Search                                  |        ✓           |     ✓    |
| Routing                                 |        ✓           |     ✓    |
| Render                                  |        ✓           |     ✓    |
| Traffic                                 |        ✓           |     ✓    |
| Time Zones                              |        ✓           |     ✓    |
| Imagery + Hybrid Imagery (preview)      |                    |     ✓    |
| Route Range (Preview)                   |                    |     ✓    |
| IP 2 Location (preview)                 |                    |     ✓    |
| Polygons from search (Preview)          |                    |     ✓    |
| Batch Geocoding (preview)               |                    |     ✓    |
| Batch Routing (preview)                 |                    |     ✓    |
| Matrix Routing (preview)                |                    |     ✓    |


Some additional data points worth considering are, what kind enterprise do you have or how critical is the application being built?

See the **pricing tier targeted customers** table to get a better sense of the S0 and S1 pricing tiers. For more information on Azure Maps pricing, see, [Azure Maps Pricing](https://azure.microsoft.com/pricing/details/azure-maps/). 

<br>

<center>**Pricing tier targeted customers**</center>

| Pricing Tier  |        Targeted Customers                                                                |
|---------------|:-----------------------------------------------------------------------------------------|
| S0            |    The S0 pricing tier is for customers who are either small or medium-sized enterprises.<br>It is a right pricing tier for you if you do not expect high volumes of concurrent<br>users and your service requirements are met by the core geospatial APIs as indicated<br>by the table below. This tier is generally available and is applicable for<br>applications in all stages of production from proof of concept development and early<br>stage testing to application production and deployment.|
| S1            |    <p>The S1 pricing tier is for customers in need of support for large-scale enterprise, mission critical applications, high volumes of concurrent users, or require advanced geospatial services.</p>|


## Next steps

Learn more about viewing and changing pricing tier:

> [!div class="nextstepaction"]
> [Manage Pricing Tier](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-manage-pricing-tier)