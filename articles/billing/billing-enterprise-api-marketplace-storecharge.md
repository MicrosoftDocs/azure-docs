---
title: Azure Billing Enterprise APIs - Marketplace Charges| Microsoft Docs
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
# Reporting APIs for Enterprise customers - Marketplace Charges (Preview)

The Marketplace Store Charge API returns the usage-based marketplace charges breakdown by day for the specified Billing Period or start and end dates (one time fees are not included).

##Request 
Common header properties that need to be added are specified [here](billing-enterprise-api.md). If a billing period is not specified, then data for the current billing period is returned. Custom time ranges can be specified with the start and end date parameters which are in the format yyyy-MM-dd, the maximum supported time range is 36 months.  

|Method | Request URI|
|-|-|
|GET|https://consumption.azure.com/v1/enrollments/{enrollmentNumber}/marketplacecharges|
|GET|https://consumption.azure.com/v1/enrollments/{enrollmentNumber}/billingPeriods/{billingPeriod}/marketplacecharges|
|GET|https://consumption.azure.com/v1/enrollments/{enrollmentNumber}/marketplacechargesbycustomdate?startTime=2017-01-01&endTime=2017-01-10|

## Response
 
	
		[
			{
				"id": "id",
				"subscriptionGuid": "00000000-0000-0000-0000-000000000000",
				"subscriptionName": "subName",
				"meterId": "2core",
				"usageStartDate": "2015-09-17T00:00:00Z",
				"usageEndDate": "2015-09-17T23:59:59Z",
				"offerName": "Virtual LoadMaster™ (VLM) for Azure",
				"resourceGroup": "Res group",
				"instanceId": "id",
				"additionalInfo": "{\"ImageType\":null,\"ServiceType\":\"Medium\"}",
				"tags": "",
				"orderNumber": "order",
				"unitOfMeasure": "",
				"costCenter": "100",
				"accountId": 100,
				"accountName": "Account Name",
				"accountOwnerId": "account@live.com",
				"departmentId": 101,
				"departmentName": "Department 1",
				"publisherName": "Publisher 1",
				"planName": "Plan name",
				"consumedQuantity": 1.15,
				"resourceRate": 0.1,
				"extendedCost": 1.11
			},
			...
		]
	

**Response property definitions**

|Property Name| Type| Description
|-|-|-|
|id|string|Unique Id for the marketplace charge item|
|subscriptionGuid|Guid|The Subscription Guid|
|subscriptionName|string|The Subscription Name|
|meterId|string|Id for the emitted Meter|
|usageStartDate|DateTime|Start time for the usage record|
|usageEndDate|DateTime|End time for the usage record|
|offerName|string|The Offer name|
|resourceGroup|string|The resource Group|
|instanceId|string|Instance Id|
|additionalInfo|string|Additional info JSON string|
|tags|string|Tag JSON string|
|orderNumber|string|The order number|
|unitOfMeasure|string|Unit of measure for the meter|
|costCenter|string|The cost center|
|accountId|int|The account Id|
|accountName|string |The Account Name|
|accountOwnerId|string|The Account Owner Id|
|departmentId|int|The department Id|
|departmentName|string|The department name|
|publisherName|string|The publisher name|
|planName|string|The Plan name|
|consumedQuantity|decimal|Consumed Quantity during this time period|
|resourceRate|decimal|Unit price for the meter|
|extendedCost|decimal|Estimated charge based on Consumed Quantity and Extended cost|
<br/>
## See Also
* [Billing Periods API](billing-enterprise-api-billing-periods.md)

* [Usage Detail API](billing-enterprise-api-usage-detail.md) 

* [Balance and Summary API](billing-enterprise-api-balance-summary.md)

* [Price Sheet API](billing-enterprise-api-pricesheet.md)