---
title: Azure Billing Enterprise APIs - Usage Details| Microsoft Docs
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
# Reporting APIs for Enterprise customers - Usage Details (Preview)

The Usage Detail API offers a daily breakdown of consumed quantities and estimated charges by an Enrollment. The result also includes information on instances, meters and departments. The API can be queried by Billing period or by a specified start and end date. 
## Consumption APIs


##Request 
Common header properties that need to be added are specified [here](billing-enterprise-api.md). If a billing period is not specified, then data for the current billing period is returned. Custom time ranges can be specified with the start and end date parameters that are in the format yyyy-MM-dd. The maximum supported time range is 36 months.  

|Method | Request URI|
|-|-|
|GET|https://consumption.azure.com/v1/enrollments/{enrollmentNumber}/usagedetails 
|GET|https://consumption.azure.com/v1/enrollments/{enrollmentNumber}/billingPeriods/{billingPeriod}/usagedetails|
|GET|https://consumption.azure.com/v1/enrollments/{enrollmentNumber}/usagedetailsbycustomdate?startTime=2017-01-01&endTime=2017-01-10|

## Response

> Due to the potentially large volume of data the result set is paged. The nextLink property, if present, specifies the link for the next page of data. If the link is empty, it denotes that is the last page. 
<br/>

	{
		"id": "string",
		"data": [
			{						
			"accountId": 0,
			"productId": 0,
			"resourceLocationId": 0,
			"consumedServiceId": 0,
			"departmentId": 0,
			"accountOwnerEmail": "string",
			"accountName": "string",
			"serviceAdministratorId": "string",
			"subscriptionId": 0,
			"subscriptionGuid": "string",
			"subscriptionName": "string",
			"date": "2017-04-27T23:01:43.799Z",
			"product": "string",
			"meterId": "string",
			"meterCategory": "string",
			"meterSubCategory": "string",
			"meterRegion": "string",
			"meterName": "string",
			"consumedQuantity": 0,
			"resourceRate": 0,
			"extendedCost": 0,
			"resourceLocation": "string",
			"consumedService": "string",
			"instanceId": "string",
			"serviceInfo1": "string",
			"serviceInfo2": "string",
			"additionalInfo": "string",
			"tags": "string",
			"storeServiceIdentifier": "string",
			"departmentName": "string",
			"costCenter": "string",
			"unitOfMeasure": "string",
			"resourceGroup": "string"
			}
		]
		"nextLink": "string"
	}

<br/>

**Response property definitions**

|Property Name| Type| Description
|-|-|-|
|id| string| The unique Id for the API call. |
|data| JSON array| The Array of daily usage details for every instance\meter|
|nextLink| string| When there are more pages of data the nextLink points to the URL to return the next page of data |

## See Also
* [Billing Periods API](billing-enterprise-api-billing-periods.md)

* [Balance and Summary API](billing-enterprise-api-balance-summary.md)

* [Marketplace Store Charge API](billing-enterprise-api-marketplace-storecharge.md) 

* [Price Sheet API](billing-enterprise-api-pricesheet.md)