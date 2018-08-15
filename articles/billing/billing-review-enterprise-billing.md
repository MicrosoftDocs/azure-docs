---
title: Review Azure enterprise enrollment billing data with REST API | Microsoft Docs
description: Learn how to use Azure REST APIs to review enterprise enrollment billing information.
services: billing
documentationcenter: na
author: lleonard-msft
manager: MBaldwin
editor: ''

ms.assetid: 82D50B98-40F2-44B1-A445-4391EA9EBBAA
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/06/2018
ms.author: alleonar

# As an administrator or developer, I want to use REST APIs to review billing data for all subscriptions and departments in the enterprise enrollment.

---

# Review enterprise enrollment billing using REST APIs

Azure Reporting APIs help you review and manage your Azure costs.

Here, you learn to retrieve the current bill associated with an enterprise account enrollment.

To retrieve the current bill:
``` http
GET https://consumption.azure.com/v2/enrollments/{enrollmentID}/usagedetails
Content-Type: application/json   
Authorization: Bearer
```

## Build the request  

The `{enrollmentID}` parameter is required and should contain the enrollment ID for the Enterprise Account (EA).

The following headers are required: 

|Request header|Description|  
|--------------------|-----------------|  
|*Content-Type:*|Required. Set to `application/json`.|  
|*Authorization:*|Required. Set to a valid `Bearer` [API key](https://docs.microsoft.com/rest/api/billing/enterprise/billing-enterprise-api-usage-detail#asynchronous-call-polling-based). |  

This example shows a synchronous call that returns details for the current billing cycle. For performance reasons, synchronous calls return information for the last month.  You can also call the [API asynchronously](https://docs.microsoft.com/rest/api/billing/enterprise/billing-enterprise-api-usage-detail#asynchronous-call-polling-based) to return data for 36 months.


## Response  

Status code 200 (OK) is returned for a successful response, which contains a list of detailed costs for your account.

``` json
{
    "id": "${id}",
    "data": [
        {
            "cost": ${cost}, 
            "departmentId": ${departmentID},
            "subscriptionGuid" : ${subscriptionGuid} 
            "date": "${date}",
            "tags": "${tags}",
            "resourceGroup": "${resourceGroup}"
        } // ...
    ],
    "nextLink": "${nextLinkURL}"
}
```  

Each item in **data** represents a charge:

|Response property|Description|
|----------------|----------|
|**cost** | The amount charged, in a currency appropriate for the datacenter location. |
|**subscriptionGuid** | Globally unique ID for the subscription. | 
|**departmentId** | ID for the department, if any. |
|**date** | Date the charge was billed. |
|**tags** | JSON string containing tags associated with the subscription. |
|**resourceGroup**|Name of the resource group containing the object that incurred the cost. |
|**nextLink**| When set, specifies a URL for the next "page" of details. Blank when the page is the last one. |  
||
  
Department IDs, resource groups, tags, and related fields are defined by the EA administrator.  

This example is abbreviated; see [Get usage detail](https://docs.microsoft.com/rest/api/billing/enterprise/billing-enterprise-api-usage-detail) for a complete description of each response field. 

Other status codes indicate error conditions. In these cases, the response object explains why the request failed.

``` json
{  
  "error": [  
    { "code": "Error type." 
      "message": "Error response describing why the operation failed."  
    }  
  ]  
}  
```  

## Next steps 
- Review [Enterprise reporting overview](https://docs.microsoft.com/azure/billing/billing-enterprise-api)
- Investigate [Enterprise Billing REST API](https://docs.microsoft.com/rest/api/billing/)   
- [Get started with Azure REST API](https://docs.microsoft.com/rest/api/azure/)   
