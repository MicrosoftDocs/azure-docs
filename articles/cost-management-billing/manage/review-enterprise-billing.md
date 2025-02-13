---
title: Review Azure enterprise enrollment billing data with REST API
description: Learn how to use Azure REST APIs to review enterprise enrollment billing information.
author: bandersmsft
ms.reviewer: sapnakeshari
ms.service: cost-management-billing
ms.subservice: enterprise
ms.topic: article
ms.date: 01/22/2025
ms.author: banders

#Customer intent: As an administrator or developer, I want to use REST APIs to review billing data for all subscriptions and departments in the enterprise enrollment.

---

# Review enterprise enrollment billing using REST APIs

Azure Reporting APIs help you review and manage your Azure costs.

In this article, you learn to retrieve the billing information associated with billing accounts, department, or enterprise agreement (EA) enrollment accounts using the Azure REST APIs.

## Individual account billing

To get usage details for accounts in a department:

```http
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Consumption/usageDetails?api-version=2018-06-30
Content-Type: application/json   
Authorization: Bearer
```

The `{billingAccountId}` parameter is required and should contain the ID for the account.

The following headers are required:

|Request header|Description|  
|--------------------|-----------------|  
|*Content-Type:*|Required. Set to `application/json`.|  
|*Authorization:*|Required. Set to a valid `Bearer` API key. |  

This example shows a synchronous call that returns details for the current billing cycle. For performance reasons, synchronous calls return information for the last month.  You can also call the API asynchronously to return data for 36 months.


## Response  

Status code 200 (OK) is returned for a successful response, which contains a list of detailed costs for the account.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/BillingAccounts/1234/providers/Microsoft.Billing/billingPeriods/201702/providers/Microsoft.Consumption/usageDetails/usageDetailsId1",
      "name": "usageDetailsId1",
      "type": "Microsoft.Consumption/usageDetails",
      "properties": {
        ...
        "usageStart": "2017-02-13T00:00:00Z",
        "usageEnd": "2017-02-13T23:59:59Z",
        "instanceName": "shared1",
        "instanceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/Default-Web-eastasia/providers/Microsoft.Web/sites/shared1",
        "currency": "USD",
        "usageQuantity": 0.00328,
        "billableQuantity": 0.00328,
        "pretaxCost": 0.67,
        "isEstimated": false,
        ...
      }
    }
  ]
}
```  

This example is abbreviated; see [Get usage detail for a billing account](/rest/api/consumption/usagedetails/list#billingaccountusagedetailslist-legacy) for a complete description of each response field and error handling.

## Department billing

Get usage details aggregated for all accounts in a department.

```http
GET https://management.azure.com/providers/Microsoft.Billing/departments/{departmentId}/providers/Microsoft.Consumption/usageDetails?api-version=2018-06-30
Content-Type: application/json   
Authorization: Bearer
```

The `{departmentId}` parameter is required and should contain the ID for the department in the enrollment account.

The following headers are required:

|Request header|Description|  
|--------------------|-----------------|  
|*Content-Type:*|Required. Set to `application/json`.|  
|*Authorization:*|Required. Set to a valid `Bearer` API key. |  

This example shows a synchronous call that returns details for the current billing cycle. For performance reasons, synchronous calls return information for the last month.  You can also call the API asynchronously to return data for 36 months.

### Response  

Status code 200 (OK) is returned for a successful response, which contains a list of detailed usage information and costs for a given billing period and invoice ID for the department.


The following example shows the output of the REST API for department `1234`.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/Departments/1234/providers/Microsoft.Billing/billingPeriods/201702/providers/Microsoft.Consumption/usageDetails/usageDetailsId1",
      "name": "usageDetailsId1",
      "type": "Microsoft.Consumption/usageDetails",
      "properties": {
        "billingPeriodId": "/providers/Microsoft.Billing/Departments/1234/providers/Microsoft.Billing/billingPeriods/201702",
        "invoiceId": "/providers/Microsoft.Billing/Departments/1234/providers/Microsoft.Billing/invoices/201703-123456789",
        "usageStart": "2017-02-13T00:00:00Z",
        "usageEnd": "2017-02-13T23:59:59Z",
        "instanceName": "shared1",
        "instanceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/Default-Web-eastasia/providers/Microsoft.Web/sites/shared1",
        "instanceLocation": "eastasia",
        "currency": "USD",
        "usageQuantity": 0.00328,
        "billableQuantity": 0.00328,
        "pretaxCost": 0.67,
        ...
      }
    }
  ]
}
```  

This example is abbreviated; see [Get usage detail for a department](/rest/api/consumption/usagedetails/list#departmentusagedetailslist-legacy) for a complete description of each response field and error handling.

## Enrollment account billing

Get usage details aggregated for the enrollment account.

```http
GET https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts/{enrollmentAccountId}/providers/Microsoft.Consumption/usageDetails?api-version=2018-06-30
Content-Type: application/json   
Authorization: Bearer
```

The `{enrollmentAccountId}` parameter is required and should contain the ID for the enrollment account.

The following headers are required:

|Request header|Description|  
|--------------------|-----------------|  
|*Content-Type:*|Required. Set to `application/json`.|  
|*Authorization:*|Required. Set to a valid `Bearer` API key. |  

This example shows a synchronous call that returns details for the current billing cycle. For performance reasons, synchronous calls return information for the last month.  You can also call the API asynchronously to return data for 36 months.

### Response  

Status code 200 (OK) is returned for a successful response, which contains a list of detailed usage information and costs for a given billing period and invoice ID for the department.

The following example shows the output of the REST API for enterprise enrollment `1234`.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/EnrollmentAccounts/1234/providers/Microsoft.Billing/billingPeriods/201702/providers/Microsoft.Consumption/usageDetails/usageDetailsId1",
      "name": "usageDetailsId1",
      "type": "Microsoft.Consumption/usageDetails",
      "properties": {
        "billingPeriodId": "/providers/Microsoft.Billing/EnrollmentAccounts/1234/providers/Microsoft.Billing/billingPeriods/201702",
        "invoiceId": "/providers/Microsoft.Billing/EnrollmentAccounts/1234/providers/Microsoft.Billing/invoices/201703-123456789",
        "usageStart": "2017-02-13T00:00:00Z",
        "usageEnd": "2017-02-13T23:59:59Z",
        ....
        "currency": "USD",
        "usageQuantity": 0.00328,
        "billableQuantity": 0.00328,
        "pretaxCost": 0.67,
        ...
      }
    }
  ]
}
```

This example is abbreviated; see [Get usage detail for an enrollment account](/rest/api/consumption/usagedetails/list#enrollmentaccountusagedetailslist-legacy) for a complete description of each response field and error handling.

## Next steps
- [Get started with Azure REST API](/rest/api/azure/)