---
title: How to choose the right SKU for your Azure Maps account | Microsoft Docs 
description: This article shows you the difference in Azure Maps SKUs so you can choose the right SKU for your application.
author: dsk-2015
ms.author: dkshir
ms.date: 07/16/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# How to choose the right SKU or tier for your Azure Maps account

You can create your Azure Maps account in two different SKUs or tiers - **Premium** and **Standard**, depending on the APIs you will need for your scenario. This article helps you decide which SKU is right for you. 

If you're just starting out with Azure Maps, make sure to go through the article [Launch an interactive search map using Azure Maps](quick-demo-map-app) for a quick guidance on Azure Maps account setup and usage. For pricing information for different SKUs, read the [Azure Maps pricing](https://azure.microsoft.com/pricing/details/azure-maps/). 

## Why Premium SKU?

As an Azure Maps user, you will typically create an account with **Standard** SKU, which provides 250,000 free maps and traffic transactions per month. When you need to move on to **Premium** features, you will create another account for **Premium** SKU. The **Premium** SKU does not provide any free transactions, however it has the following feature advantages over the **Standard**: 

### Decreased throttling
Azure Maps Standard SKU throttles customer transactions at 50 requests per second. Premium SKU lifts this throttling to service large-scale enterprise customers on the order of multiple thousand requests per second. 

### Security
The Standard SKU secures customer use cases using key-based authentication. This is a fairly insecure method which largely leaves keys in plain text within the JavaScript map control. Premium SKU provides better security with Azure Active Directory. 

If you are an entreprise customer who needs higher transaction volumes to support live-site critical applications, and better security for your applications and services, you will want to choose the Premium SKU. 

[!IMPORTANT] If your application requires Premium SKU features, note that you will need to create a different Azure Maps Premium account. Currently the Standard account cannot be upgraded to Premium. 


## Service availability

In addition to services available with the Standard SKU, the Azure Maps Premium SKU provides the services listed below. 

### Batch Search and Geocoding Service

This provides batch operations for large sets of search queries. 

### Return Polygons for Area Features

This provides the ability to fetch a polygon for a given geographic entity. 

### Batch Routing Service

This provides batch operations for large sets of routing queries.

### Matrix Routing Service

This provides a collection of batch operations for large routing queryt sets. 

## Calculate Reachable Range(Route) Service

This provides the ability to calculate a range of distances based on area, time and energy. 


## Next steps

- To learn more about the Azure Maps capabilities, pricing and performance per SKU, see Azure Maps pricing.  
- To learn how to create an account in your choice of SKU, read TBD. 