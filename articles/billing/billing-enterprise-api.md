---
title: Azure Billing Enterprise APIs | Microsoft Docs
description: Learn about the Reporting APIs that enable Enterprise Azure customers to pull consumption data programmatically. 
services: ''
documentationcenter: ''
author: aedwin
manager: aedwin
editor: ''
tags: billing

ms.assetid: 3e817b43-0696-400c-a02e-47b7817f9b77
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: billing
ms.date: 04/25/2017
ms.author: aedwin

---
# Overview of Reporting APIs for Enterprise customers (Preview)
The Reporting APIs enable Enterprise Azure customers to programmatically pull consumption and billing data into preferred data analysis tools. 

## Enabling data access to the API
* **Generate\Retrieve the API Key** - Log in to the Enterprise portal and follow the tutorial under Help - Reporting APIs. The first section under this help article explains how to generate\retrieve the API key for the specified enrollment.
* **Passing keys in the API** - The API key needs to be passed for each call for Authentication and Authorization. The following property needs to be to the HTTP headers

|Request Header Key | Value|
|-|-|
|Authorization| Specify the value in this format: **bearer {API_KEY}** <br/> Example: bearer eyr....09|

## Consumption APIs
A Swagger endpoint is available [here](https://consumption.azure.com/v1/swagger) for the APIs described below which should enable easy introspection of the API and the ability to generate client SDKs using [AutoRest](https://github.com/Azure/AutoRest) or [Swagger CodeGen](http://swagger.io/swagger-codegen/). Data beginning May 1, 2014 is available through this API. 

* **Balance and Summary** - The [Balance and Summary API](billing-enterprise-api-balance-summary.md) offers a monthly summary of information on balances, new purchases, Azure Marketplace service charges, adjustments and overage charges.

* **Usage Details** - The [Usage Detail API](billing-enterprise-api-usage-detail.md) offers a daily breakdown of consumed quantities and estimated charges by an Enrollment. The result also includes information on instances, meters and departments. The API can be queried by Billing period or by a specified start and end date. 

* **Marketplace Store Charge** - The [Marketplace Store Charge API](billing-enterprise-api-marketplace-storecharge.md) returns the usage-based marketplace charges breakdown by day for the specified Billing Period or start and end dates (one time fees are not included).

* **Price Sheet** - The [Price Sheet API](billing-enterprise-api-pricesheet.md) provides the applicable rate for each Meter for the given Enrollment and Billing Period. 

## Helper APIs
 **List Billing Periods** - The [Billing Periods API](billing-enterprise-api-billing-periods.md) returns a list of billing periods that have consumption data for the specified Enrollment in reverse chronological order. Each Period contains a property pointing to the API route for the four sets of data - BalanceSummary, UsageDetails, Marketplace Charges, and PriceSheet.


## API Response Codes  
|Response Status Code|Message|Description|
|-|-|-|
|200| OK|No error|
|401| Unauthorized| API Key not found, Invalid, Expired etc.|
|404| Unavailable| Report endpoint not found|
|400| Bad Request| Invalid params – Date ranges, EA numbers etc.|
|500| Server Error| Unexoected error processing request| 









