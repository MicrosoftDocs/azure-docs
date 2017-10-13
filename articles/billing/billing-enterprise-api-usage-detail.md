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
# Reporting APIs for Enterprise customers - Usage Details

The Usage Detail API offers a daily breakdown of consumed quantities and estimated charges by an Enrollment. The result also includes information on instances, meters and departments. The API can be queried by Billing period or by a specified start and end date. 
## Consumption APIs


##Request 
Common header properties that need to be added are specified [here](billing-enterprise-api.md). If a billing period is not specified, then data for the current billing period is returned. Custom time ranges can be specified with the start and end date parameters that are in the format yyyy-MM-dd. The maximum supported time range is 36 months.  

|Method | Request URI|
|-|-|
|GET|https://consumption.azure.com/v2/enrollments/{enrollmentNumber}/usagedetails 
|GET|https://consumption.azure.com/v2/enrollments/{enrollmentNumber}/billingPeriods/{billingPeriod}/usagedetails|
|GET|https://consumption.azure.com/v2/enrollments/{enrollmentNumber}/usagedetailsbycustomdate?startTime=2017-01-01&endTime=2017-01-10|

> [!Note]
> To use the preview version of API, replace v2 with v1 in the above URL.
>

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
			"Cost": 0,
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
		],
		"nextLink": "string"
	}

<br/>
**Response property definitions**

|Property Name| Type| Description
|-|-|-|
|id| string| The unique Id for the API call. |
|data| JSON array| The Array of daily usage details for every instance\meter.|
|nextLink| string| When there are more pages of data the nextLink points to the URL to return the next page of data. |
|accountId| int| Obsolete field. Present for backward compatibility. |
|productId| int| Obsolete field. Present for backward compatibility. |
|resourceLocationId| int| Obsolete field. Present for backward compatibility. |
|consumedServiceID| int| Obsolete field. Present for backward compatibility. |
|departmentId| int| Obsolete field. Present for backward compatibility. |
|accountOwnerEmail| string| Email account of the account owner. |
|accountName| string| Customer entered name of the account. |
|serviceAdministratorId| string| Email Address of Service Administrator. |
|subscriptionId| int| Obsolete field. Present for backward compatibility. |
|subscriptionGuid| string| Global Unique Identifier for the subscription. |
|subscriptionName| string| Name of the subscription. |
|date| string| The date on which consumption occurred. |
|product| string| Additional details on the meter. Example: A1(VM)Windows - AP East|
|meterId| string| The identifier for the meter which emitted usage. |
|meterCategory| string| The Azure platform service that was used. |
|meterSubCategory| string| Defines the Azure service type that can affect the rate. Example: A1 VM (Non-Windows|
|meterRegion| string| Identifies the location of the datacenter for certain services that are priced based on datacenter location. |
|meterName| string| Name of the meter. |
|consumedQuantity| double| The amount of the meter that has been consumed. |
|resourceRate| double| The rate applicable per billable unit. |
|cost| double| The charge that has been incurred for the meter. |
|resourceLocation| string| Identifies the datacenter where the meter is running. |
|consumedService| string| The Azure platform service that was used. |
|instanceId| string| This identifier is the name of the resource or the fully qualified Resource ID. For more information, see [Azure Resource Manager API](https://docs.microsoft.com/rest/api/resources/resources) |
|serviceInfo1| string| Internal Azure Service Metadata. |
|serviceInfo2| string| For example, an image type for a virtual machine and ISP name for ExpressRoute. |
|additionalInfo| string| Service-specific metadata. For example, an image type for a virtual machine. |
|tags| string| Customer added tags. For more information, see [Organize your Azure resources with tags](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags). |
|storeServiceIdentifier| string| This columns is not used. Present for backward compatibility. |
|departmentName| string| Name of the department. |
|costCenter| string| The cost center that the usage is associated with. |
|unitOfMeasure| string| Identifies the unit that the service is charged in. Example: GB, hours, 10,000 s. |
|resourceGroup| string| The resource group in which the deployed meter is running in. For more information, see [Azure Resource Manager overview](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview). |
<br/>
## See also

* [Billing Periods API](billing-enterprise-api-billing-periods.md)

* [Balance and Summary API](billing-enterprise-api-balance-summary.md)

* [Marketplace Store Charge API](billing-enterprise-api-marketplace-storecharge.md) 

* [Price Sheet API](billing-enterprise-api-pricesheet.md)
