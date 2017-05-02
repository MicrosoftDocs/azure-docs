---
title: Azure Billing Enterprise APIs - PriceSheet| Microsoft Docs
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
# Reporting APIs for Enterprise customers - PriceSheet (Preview)

The Price Sheet API provides the applicable rate for each Meter for the given Enrollment and Billing Period.

##Request
Common header properties that need to be added are specified [here](billing-enterprise-api.md). If a billing period is not specified, then data for the current billing period is returned.

|Method | Request URI|
|-|-|
|GET|https://consumption.azure.com/v1/enrollments/{enrollmentNumber}/pricesheet|
|GET|https://consumption.azure.com/v1/enrollments/{enrollmentNumber}/billingPeriods/{billingPeriod}/pricesheet|


## Response

	
  		[
    		{
    		  	"id": "enrollments/57354989/billingperiods/201601/products/343/pricesheets",
    	  		"billingPeriodId": "201704",
    	  		"meterName": "A1 VM",
    	  		"unitOfMeasure": "100 Hours",
    	 	 	"includedQuantity": 0,
    	  		"partNumber": "N7H-00015",
    	  		"unitPrice": 0.00,
    	  		"currencyCode": "USD"
    		},
    		{
    	  		"id": "enrollments/57354989/billingperiods/201601/products/2884/pricesheets",
    	  		"billingPeriodId": "201404",
    	  		"meterName": "Locally Redundant Storage Premium Storage - Snapshots - AU East",
    	  		"unitOfMeasure": "100 GB",
    	  		"includedQuantity": 0,
    	  		"partNumber": "N9H-00402",
    	  		"unitPrice": 0.00,
    	  		"currencyCode": "USD"
    		},
			...
		]
	

**Response property definitions**

|Property Name| Type| Description
|-|-|-|
|id| string| The unique Id that represents a particular PriceSheet item (meter by billing period)|
|billingPeriodId| string| The unique Id that represents a particular Billing period|
|meterName| string| The meter name|
|unitOfMeasure| string| The Unit of Measure for measuring the service|
|includedQuantity| decimal| Quantity that is included |
|partNumber| string| The part number associated with the Meter|
|unitPrice| decimal| The unit price for the meter|
|currencyCode| string| The currency code for the unitPrice|
<br/>
## See Also

* [Billing Periods API](billing-enterprise-api-billing-periods.md)

* [Usage Detail API](billing-enterprise-api-usage-detail.md)

* [Balance and Summary API](billing-enterprise-api-balance-summary.md)

* [Marketplace Store Charge API](billing-enterprise-api-marketplace-storecharge.md)
