---
title: Choosing the right pricing tier for Azure Maps | Microsoft Docs
description: Learn about pricing tiers offered by Azure Maps 
author: walsehgal
ms.author: v-musehg
ms.date: 11/19/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
---

Azure Maps offers two pricing tiers based on the APIs and throughput. The purpose of this article is to help you choose which pricing tier is right for you. We discuss both pricing tiers below. For more information on Azure Maps pricing, see, [Azure Maps Pricing](https://azure.microsoft.com/pricing/details/azure-maps/). 

## Pricing Tiers:
The two pricing tiers offered by Azure Maps are based on two main categories of customers. See the table below for details.

### S0 Pricing Tier:
The S0 pricing tier is for customers who are either small or medium-sized enterprises, it is a right pricing tier for you if you do not expect high volumes of concurrent users and/or your service requirements are met by the core geospatial APIs as indicated by the table below. This tier is generally available and is applicable for applications in all stages of production from proof of concept development and early stage testing to application production and deployment.

### S1 pricing Tier:
The S1 pricing tier is for customers who need support for large-scale enterprise, mission critical application, high volumes of concurrent users and/or require advanced geospatial services.

| ID                                      |        S0           |  S1   | 
|-----------------------------------------|:-------------------:|:-----:|
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
| **Throughput (Queries per Second)**     |   Up to 50 QPS     |  >50 QPS  |

## Next steps

Learn more about viewing and changing pricing tier:

> [!div class="nextstepaction"]
> [Change Pricing Tier](https://azure.microsoft.com/pricing/details/azure-maps/)