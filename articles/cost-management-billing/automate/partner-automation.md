---
title: Cost Management automation for partners
titleSuffix: Microsoft Cost Management
description: This article explains how Microsoft partners and their customers can use Cost Management APIs for common tasks.
author: bandersmsft
ms.author: banders
ms.date: 11/17/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Automation for partners

Azure Cost Management is natively available for direct partners who have onboarded their customers to a Microsoft Customer Agreement and have [purchased an Azure Plan](/partner-center/purchase-azure-plan). Partners and their customers can use Cost Management APIs common tasks. For more information about non-automation scenarios, see [Cost Management for Partners](../costs/get-started-partners.md).

## Azure Cost Management APIs - Direct and indirect providers

Partners with access to billing scopes in a partner tenant can use the following APIs to view invoiced costs.

APIs at the subscription scope can be called by a partner regardless of the cost policy, as long as they have access to the subscription. Other users with access to the subscription, like the customer or reseller, can call the APIs only after the partner enables the cost policy for the customer tenant.

### To get a list of billing accounts

```http
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts?api-version=2019-10-01-preview 
```

### To get a list of customers

```http
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/customers?api-version=2019-10-01-preview 
```

### To get a list of subscriptions

```http
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/billingSubscriptions?api-version=2019-10-01-preview 
```

### To get a list of invoices for a period of time

```http
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/invoices?api-version=2019-10-01-preview&periodStartDate={periodStartDate}&periodEndDate={periodEndDate} 
```
The API call returns an array of invoices that has elements similar to the following JSON code.

```json
   {      "id": "/providers/Microsoft.Billing/billingAccounts/{billingAccountID}/billingProfiles/{BillingProfileID}/invoices/{InvoiceID}",      "name": "{InvoiceID}",      "properties": {        "amountDue": {          "currency": "USD",          "value": x.xx        },        ...    } 
```

Use the preceding returned ID field value and replace it in the following example as the scope to query for usage details.

```http
GET https://management.azure.com/{id}/providers/Microsoft.Consumption/UsageDetails?api-version=2019-10-01 
```

The example returns the usage records associated with the specific invoice.

### To get the policy for customers to view costs

```http
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/customers/{customerID}/policies/default?api-version=2019-10-01-preview 
```

### To set the policy for customers to view costs

```http
PUT https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/customers/{customerID}/policies/default?api-version=2019-10-01-preview 
```

### To get Azure service usage for a billing account

We recommend that you configure an Export for these scenarios. For more information, see [Retrieve large usage datasets with exports](../costs/ingest-azure-usage-at-scale.md).

### To download a customer's Azure service usage

We recommend that you configure an Export for this scenario as well. If you need to download the data on demand, however, you can use the [Cost Details](/rest/api/cost-management/generate-cost-details-report) API. For more information, see [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).

### To get or download the price sheet for consumed Azure services

First, use the following post.

```http
POST https://management.azure.com/providers/Microsoft.Billing/BillingAccounts/{billingAccountName}/billingProfiles/{billingProfileID}/pricesheet/default/download?api-version=2019-10-01-preview&format=csv" -verbose 
```

Then, call the asynchronous operation property value. For example:

```http
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/billingProfiles/{billingProfileID}/pricesheetDownloadOperations/{operation}?sessiontoken=0:11186&api-version=2019-10-01-preview 
```

The preceding get call returns the download link containing the price sheet.

### To get aggregated costs

```http
POST https://management.azure.com/providers/microsoft.billing/billingAccounts/{billingAccountName}/providers/microsoft.costmanagement/query?api-version=2019-10-01 
```

### Create a budget for a partner

```http
PUT https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/providers/Microsoft.CostManagement/budgets/partnerworkshopbudget?api-version=2019-10-01 
```

### Create a budget for a customer

```http
PUT https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/customers/{customerID}/providers/Microsoft.Consumption/budgets/{budgetName}?api-version=2019-10-01 
```

### Delete a budget

```http
DELETE https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.CostManagement/budgets/{budgetName}?api-version=2019-10-01 
```

## Next steps

- Learn more about Cost Management automation at [Cost Management automation overview](automation-overview.md).
Automation scenarios.
- [Get started with Azure Cost Management for partners](../costs/get-started-partners.md#cost-management-rest-apis).
- [Retrieve large usage datasets with exports](../costs/ingest-azure-usage-at-scale.md).
- [Understand usage details fields](understand-usage-details-fields.md). 