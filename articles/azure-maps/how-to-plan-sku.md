---
title: How to choose the right tier for your Azure Maps account | Microsoft Docs 
description: This article shows you the difference in Azure Maps tiers so you can make the right choice for your application.
author: dsk-2015
ms.author: dkshir
ms.date: 07/16/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# How to choose the right tier for your Azure Maps account

Azure Maps allows you to create an account in two different tiers - **Premium** and **Standard**, depending on the features and bandwidth you will need for your scenario. This article helps you decide which tier is right for you. 

If you're just starting out with Azure Maps, make sure to go through the article [Launch an interactive search map using Azure Maps](quick-demo-map-app) for a quick guidance on account setup and usage. For pricing information, read [Azure Maps pricing](https://azure.microsoft.com/pricing/details/azure-maps/). 

## Premium Vs Standard tier
The Azure Maps Premium tier is an enterprise-ready tier, which includes all features of the Standard tier, in addition to **decreased throttling**. The Standard tier throttles customer transactions at 50 requests per second. Premium tier lifts this throttling to service large-scale enterprise customers on the order of multiple thousand requests per second. 

The Standard tier is sufficient for customers who are small to mid-sized enterprises and/or who do not expect high volumes of concurrent users. This tier is generally available, which means it is applicable for all stages of production, from proof of concept and early stage testing to application production and deployment. 

In contrast, customers who need support for large-scale enterprise, mission-critical applications, high volumes of concurrent users or required advanced geospatial services can try out the new Premium tier. Note that this tier is currently in public preview, so it will not be yet available for production environments.

[!IMPORTANT] To use Premium tier services, you will need to create an additional Azure Maps Premium account. The Standard account cannot be upgraded to Premium. 


## Services available in Premium tier

The following table shows the service availability in Standard and Premium tiers.

| Service | Standard tier | Premium tier |
| ---------- | ------------ | ------------- |
| [Search](https://docs.microsoft.com/rest/api/maps/search) | Yes | Yes |
| [Route](https://docs.microsoft.com/rest/api/maps/route) | Yes | Yes |
| [Traffic](https://docs.microsoft.com/rest/api/maps/traffic) | Yes | Yes |
| [Render](https://docs.microsoft.com/rest/api/maps/render) | Yes | Yes |
| [Timezone](https://docs.microsoft.com/rest/api/maps/timezone) | Yes | Yes |
| Batch Search and Geocoding | No | Yes |
| Return Polygons for Area | No | Yes |
| Batch Routing | No | Yes |
| Matrix Routing | No | Yes |
| Reachable Range (Isochrones) | No | Yes |

The Premium tier features these advanced mapping services:

### Batch Search and Geocoding Service

This service provides batch operations for large sets of search queries. This means the developers can pass a batch of search calls into the Maps service, and get all of the resulting location information in a single response. For example, a large retail business can get coordinates for all their stores by doing a batch search, and store them in a database in order to find all stores within a certain radius of a given location.

### Return Polygons for Area Features

This provides the ability to fetch a polygon for a given geographic entity. This means the developers can pass a batch of route calls into the Maps service, and get all the routing information in a single response. For example, a logistics company might send a batch request for all delivery routes for that day, and then pass along a route to each of the drivers. 

### Batch Routing Service

This service provides batch operations for large sets of routing queries.

### Matrix Routing Service

This provides a collection of batch operations for large routing queryt sets. 

## Calculate Reachable Range(Route) Service

This provides the ability to calculate a range of distances based on area, time and energy. 


## Next steps

- To learn more about the Azure Maps capabilities, pricing and performance per tier, see Azure Maps pricing.  
- To learn how to create an account in your choice of tier, read TBD. 