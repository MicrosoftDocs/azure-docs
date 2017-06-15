---
title: Azure Billing Enterprise APIs - Balance and Summary| Microsoft Docs
description: Learn about Azure Billing Usage and RateCard APIs, which are used to provide insights into Azure resource consumption and trends.
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
# Reporting APIs for Enterprise customers - Balance and Summary (Preview)

The Balance and Charge API offers a monthly summary of information on balances, new purchases, Azure Marketplace service charges, adjustments, and overage charges.


##Request 
Common header properties that need to be added are specified [here](billing-enterprise-api.md). If a billing period is not specified, then data for the current billing period is returned.

|Method | Request URI|
|-|-|
|GET| https://consumption.azure.com/v1/enrollments/{enrollmentNumber}/balancesummary|
|GET| https://consumption.azure.com/v1/enrollments/{enrollmentNumber}/billingPeriods/{billingPeriod}/balancesummary|


## Response

		{
		    "id": "enrollments/100/billingperiods/201507/balancesummaries",
      		"billingPeriodId": 201507,
      		"currencyCode": "USD",
      		"beginningBalance": 0,
      		"endingBalance": 1.1,
      		"newPurchases": 1,
      		"adjustments": 1.1,
      		"utilized": 1.1,
      		"serviceOverage": 1,
      		"chargesBilledSeparately": 1,
      		"totalOverage": 1,
      		"totalUsage": 1.1,
      		"azureMarketplaceServiceCharges": 1,
      		"newPurchasesDetails": [
        		{
          		"name": "",
          		"value": 1
        		}
      		],
      		"adjustmentDetails": [
        		{
          		"name": "Promo Credit",
          		"value": 1.1
        		},
        		{
          		"name": "SIE Credit",
          		"value": 1.0
        		}
      		]
		}


**Response property definitions**

|Property Name| Type| Description
|-|-|-|
|id|string|The unique Id for a specific billing period and enrollment|
|billingPeriodId|string |The billing period Id|
|currencyCode|string |The currency code|
|beginningBalance|decimal| The beginning balance for the billing period|
|endingBalance|decimal| The ending balance for the billing period (for open periods this will be updated daily)|
|newPurchases|decimal| Total new purchase amount|
|adjustments|decimal| Total adjustment amount|
|utilized|decimal| Total Commitment usage|
|serviceOverage|decimal| Overage for Azure services|
|chargesBilledSeparately|decimal| Charges Billed separately|
|totalOverage|decimal| serviceOverage + chargesBilledSeparately|
|totalUsage|decimal| Azure service commitment + total Overage|
|azureMarketplaceServiceCharges|decimal| Total charges for Azure Marketplace|
|newPurchasesDetails|JSON string array of Name Value pairs|List of new purchases|
|adjustmentDetails|JSON string array of Name Value pairs|List of Adjustments (Promo credit, SIE credit etc.) |


<br/>
## See Also
* [Billing Periods API](billing-enterprise-api-billing-periods.md)

* [Usage Detail API](billing-enterprise-api-usage-detail.md) 

* [Marketplace Store Charge API](billing-enterprise-api-marketplace-storecharge.md) 

* [Price Sheet API](billing-enterprise-api-pricesheet.md)