---
title: Review Azure service resource usage with REST API | Microsoft Docs
description: Learn how to use Azure REST APIs to review Azure service resource usage.
services: billing
documentationcenter: na
author: lleonard-msft
manager: MBaldwin
editor: ''
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/15/2018
ms.author: alleonar

# As an administrator or developer, I want to use REST APIs to review resource and service usage data under my control.

---

# Review Azure resource usage using the REST API


Azure [Consumption APIs](https://docs.microsoft.com/rest/api/consumption/) help you review the cost and usage data for your Azure resources.

In this article, you learn how to retrieve and aggregate resource usage information for resources in an Azure resource group, as well as how to filter these results based on [Azure resource manager tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags).

## Get usage for a resource group

To get resource usage for compute, database, and other resources in a resource group, use the `usageDetails` REST operation and filter the results by resource group.

```http
https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Consumption/usageDetails?api-version=2018-06-30&filter=properties/resourceGroup eq '{resource-group}]
Content-Type: application/json   
Authorization: Bearer
```

The `{subscription-id}` parameter is required and should contain a subscription ID that can access the {resource-group} resource group with a Reader role. 

The following headers are required: 

|Request header|Description|  
|--------------------|-----------------|  
|*Content-Type:*| Required. Set to `application/json`. |  
|*Authorization:*| Required. Set to a valid `Bearer` token. |

### Response  

Status code 200 (OK) is returned for a successful response, which contains a list of usage statistics for each Azure resource in the resource group with subscriptipon ID `00000000-0000-0000-0000-000000000000`.

```json
{
  "value": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Billing/billingPeriods/201702/providers/Microsoft.Consumption/usageDetails/usageDetailsId1",
      "name": "usageDetailsId1",
      "type": "Microsoft.Consumption/usageDetails",
      "properties": {
        "billingPeriodId": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Billing/billingPeriods/201702",
        "invoiceId": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Billing/invoices/201703-123456789",
        "usageStart": "2017-02-13T00:00:00Z",
        "usageEnd": "2017-02-13T23:59:59Z",
        "instanceName": "shared1",
        "instanceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group/providers/Microsoft.Web/sites/shared1",
        "instanceLocation": "eastasia",
        "currency": "USD",
        "usageQuantity": 0.00328,
        "billableQuantity": 0.00328,
        "pretaxCost": 0.67,
        "isEstimated": false,
        "meterId": "00000000-0000-0000-0000-000000000000",
        "partNumber": "Part Number 1",
        "resourceGuid": "00000000-0000-0000-0000-000000000000",
        "offerId": "Offer Id 1",
        "chargesBilledSeparately": true,
        "location": "EU West"
      }
    } ] }
```

## Get usage for tagged resources

To get resource usage for resources in organized by tags, use the `usageDetails` REST operation and filter the results by the tag name using the `$filter` query parameter.

```http
https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Consumption/usageDetails?$filter=tags eq 'tag1'&api-version=2018-06-30
Content-Type: application/json   
Authorization: Bearer
```

The `{subscription-id}` parameter is required and should contain a subscription ID that can access the tagged resources.


### Response  

Status code 200 (OK) is returned for a successful response, which contains a list of usage statistics for each Azure resource in the resource group with subscriptipon ID `00000000-0000-0000-0000-000000000000` and tag name key vault pair is `dev` and `tools`. 

Sample response:

```json
{
  "value": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Billing/billingPeriods/201702/providers/Microsoft.Consumption/usageDetails/usageDetailsId1",
      "name": "usageDetailsId1",
      "type": "Microsoft.Consumption/usageDetails",
      "tags": {
        "dev": "tools"
      },
      "properties": {
        "billingPeriodId": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Billing/billingPeriods/201702",
        "invoiceId": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Billing/invoices/201703-123456789",
        "usageStart": "2017-02-13T00:00:00Z",
        "usageEnd": "2017-02-13T23:59:59Z",
        "instanceName": "shared1",
        "instanceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Default-Web-eastasia/providers/Microsoft.Web/sites/shared1",
        "instanceLocation": "eastasia",
        "currency": "USD",
        "usageQuantity": 0.00328,
        "billableQuantity": 0.00328,
        "pretaxCost": 0.67,
        "isEstimated": false,
        "meterId": "00000000-0000-0000-0000-000000000000",
        "partNumber": "Part Number 1",
        "resourceGuid": "00000000-0000-0000-0000-000000000000",
        "offerId": "Offer Id 1",
        "chargesBilledSeparately": true,
        "location": "EU West"
      }
    }
  ]
}
```

## Next steps
- [Get started with Azure REST API](https://docs.microsoft.com/rest/api/azure/)   
