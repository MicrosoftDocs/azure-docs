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
# Reporting APIs for Enterprise customers - Price Sheet

The Price Sheet API provides the applicable rate for each Meter for the given Enrollment and Billing Period.

##Request
Common header properties that need to be added are specified [here](billing-enterprise-api.md). If a billing period is not specified, then data for the current billing period is returned.

|Method | Request URI|
|-|-|
|GET|https://consumption.azure.com/v2/enrollments/{enrollmentNumber}/pricesheet|
|GET|https://consumption.azure.com/v2/enrollments/{enrollmentNumber}/billingPeriods/{billingPeriod}/pricesheet|

> [!Note]
> To use the preview version of API, replace v2 with v1 in the above URL.
>

## Response

	
  		[
    		{
    		  	"id": "enrollments/57354989/billingperiods/201601/products/343/pricesheets",
    	  		"billingPeriodId": "201704",
				"meterId": "dc210ecb-97e8-4522-8134-2385494233c0",
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
				"meterId": "dc210ecb-97e8-4522-8134-5385494233c0",
    	  		"meterName": "Locally Redundant Storage Premium Storage - Snapshots - AU East",
    	  		"unitOfMeasure": "100 GB",
    	  		"includedQuantity": 0,
    	  		"partNumber": "N9H-00402",
    	  		"unitPrice": 0.00,
    	  		"currencyCode": "USD"
    		},
			...
		]
	

> [!Note]
>If you are using the Preview API, meterId field is not available.
>

**Response property definitions**

|Property Name| Type| Description
|-|-|-|
|id| string| The unique Id that represents a particular PriceSheet item (meter by billing period)|
|billingPeriodId| string| The unique Id that represents a particular Billing period|
|meterId| string| The identifier for the meter. It can be mapped to the usage meterId.|
|meterName| string| The meter name|
|unitOfMeasure| string| The Unit of Measure for measuring the service|
|includedQuantity| decimal| Quantity that is included |
|partNumber| string| The part number associated with the Meter|
|unitPrice| decimal| The unit price for the meter|
|currencyCode| string| The currency code for the unitPrice|
<br/>
## See also

* [Billing Periods API](billing-enterprise-api-billing-periods.md)

* [Usage Detail API](billing-enterprise-api-usage-detail.md)

* [Balance and Summary API](billing-enterprise-api-balance-summary.md)

* [Marketplace Store Charge API](billing-enterprise-api-marketplace-storecharge.md)
