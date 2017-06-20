---
title: Azure Billing Enterprise APIs - Billing periods| Microsoft Docs
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
# Reporting APIs for Enterprise customers - Billing Periods (Preview)

The Billing Periods API returns a list of billing periods that have consumption data for the specified Enrollment in reverse chronological order. Each Period contains a property pointing to the API route for the four sets of data - BalanceSummary, UsageDetails, Marktplace Charges, and PriceSheet. If the period does not have data, the corresponding property is null. 


##Request 
Common header properties that need to be added are specified [here](billing-enterprise-api.md). 

|Method | Request URI|
|-|-|
|GET| https://consumption.azure.com/v1/enrollments/{enrollmentNumber}/billingperiods|


## Response
 
	
	
  	  [
		    {
    		  	"billingPeriodId": "201704",
      			"billingStart": "2017-04-01T00:00:00Z",
      			"billingEnd": "2017-04-30T11:59:59Z",
				"balanceSummary": "/v1/enrollments/100/billingperiods/201704/balancesummary",
      			"usageDetails": "/v1/enrollments/100/billingperiods/201704/usagedetails",
      			"marketplaceCharges": "/v1/enrollments/100/billingperiods/201704/marketplacecharges",
      			"priceSheet": "/v1/enrollments/100/billingperiods/201704/pricesheet"
    		},    		
			....
  	  ]
	

**Response property definitions**

|Property Name| Type| Description
|-|-|-|
|billingPeriodId| string| The unique Id that represents a particular Billing period|
|billingStart| datetime| ISO 8601 string representing the period start date|
|billingEnd| datetime| ISO 8601 string representing the period end date|
|balanceSummary| string| The URL path that routes to the Balance Summary data for this period|
|usageDetails| string| The URL path that routes to the Usage Details data for this period|
|marketplaceCharges| string| The URL path that routes to the Marketplace Charges data for this period|
|priceSheet| string| The URL path that routes to the PriceSheet data for this period|

<br/>
## See Also
* [Balance and Summary API](billing-enterprise-api-balance-summary.md)

* [Usage Detail API](billing-enterprise-api-usage-detail.md) 

* [Marketplace Store Charge API](billing-enterprise-api-marketplace-storecharge.md) 

* [Price Sheet API](billing-enterprise-api-pricesheet.md)