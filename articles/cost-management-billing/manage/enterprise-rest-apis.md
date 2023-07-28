---
title: Azure Enterprise REST APIs
description: This article describes the REST APIs for use with your Azure enterprise enrollment.
author: bandersmsft
ms.author: banders
ms.date: 02/14/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: enterprise
ms.reviewer: banders
---

# Azure Enterprise REST APIs

This article describes the REST APIs for use with your Azure enterprise enrollment. It also explains how to resolve common issues with REST APIs.

## Consumption and Usage APIs

Microsoft Enterprise Azure customers can get usage and billing information through REST APIs. The role owner (Enterprise Administrator, Department Administrator, Account Owner) must enable access to the API by generating a key from the Azure EA portal. Then, anyone provided with the enrollment number and key can access the data through the API.

## Available APIs

**Balance and Summary -** The [Balance and Summary API](/rest/api/billing/enterprise/billing-enterprise-api-balance-summary) provides a monthly summary of information about balances, new purchases, Azure Marketplace service charges, adjustments, and overage charges. For more information, see [Reporting APIs for Enterprise customers - Balance and Summary](/rest/api/billing/enterprise/billing-enterprise-api-balance-summary).

**Usage Detail -** The [Usage Detail API](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail) provides a daily breakdown of consumed quantities and estimated charges by an enrollment. The result also includes information about instances, meters, and departments. You can query the API by billing period or by a specified start and end date. For more information, see [Reporting APIs for Enterprise customers - Usage Details](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail).

**Marketplace Store Charge -** The [Marketplace Store Charge API](/rest/api/billing/enterprise/billing-enterprise-api-marketplace-storecharge) returns usage-based marketplace charges, broken down day for the specified billing period or start and end dates. For more information, see [Reporting APIs for Enterprise customers - Marketplace Store Charge](/rest/api/billing/enterprise/billing-enterprise-api-marketplace-storecharge).

**Price Sheet -** The [Price Sheet API](/rest/api/billing/enterprise/billing-enterprise-api-pricesheet) provides the applicable rate for each meter for an enrollment and billing period. For more information, see [Reporting APIs for Enterprise customers - Price Sheet](/rest/api/billing/enterprise/billing-enterprise-api-pricesheet).

**Billing Periods -** The [Billing Periods API](/rest/api/billing/enterprise/billing-enterprise-api-billing-periods) returns a list of billing periods that have consumption data for an enrollment in reverse chronological order. Each period contains a property pointing to the API route for the four sets of data, BalanceSummary, UsageDetails, Marketplace Charges, and PriceSheet. For more information, see [Reporting APIs for Enterprise customers - Billing Periods](/rest/api/billing/enterprise/billing-enterprise-api-billing-periods).

## API key generation

Role owners can perform the following steps in the Azure portal to enable API data access.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for Cost Management + Billing and then select it.
3. Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
4. In the left navigation menu, select **Usage + Charges**.
5. Select **Manage API Access Keys** to open the Manage API Access Keys window.  
    :::image type="content" source="./media/enterprise-rest-apis/manage-api-access-keys.png" alt-text="Screenshot showing the Manage API Access Keys option." lightbox="./media/enterprise-rest-apis/manage-api-access-keys.png" :::

In the Manage API Access Keys window, you can perform the following tasks:

- Generate and view primary and secondary access keys
- View start and end dates for access keys
- Disable access keys

> [!NOTE]
> 1. If you are on Enrollment Admin, then you can generate the keys from only Usage & Charges blade at enrollment level but not at Accounts & department level.
> 2. If you are an Department owner only, then you can generate the keys at Department level and at the Account level for which you are an account owner for.
> 3. If you are Account owner only, then you can generate the keys at Acount level only. 

### Generate the primary or secondary API key

1. Sign in to the Azure portal as an enterprise administrator.
2. Select **Cost Management + Billing**.
3. Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
4. In the navigation menu, select **Usage + Charges**.
5. Select **Manage API Access Keys**.
6. Select **Generate** to generate the key.  
    :::image type="content" source="./media/enterprise-rest-apis/manage-api-access-keys-window.png" alt-text="Screenshot showing the Manage API Access Keys window." lightbox="./media/enterprise-rest-apis/manage-api-access-keys-window.png" :::
7. Select the **expand symbol** or select **Copy** to get the API access key for immediate use.  
    :::image type="content" source="./media/enterprise-rest-apis/expand-symbol-copy.png" alt-text="Screenshot showing the expand symbol and Copy option." lightbox="./media/enterprise-rest-apis/expand-symbol-copy.png" :::

### Regenerate the primary or secondary API key

1. Sign in to the Azure portal as an enterprise administrator.
2. Select **Cost Management + Billing**.
3. Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
4. In the navigation menu, select **Usage + Charges**.
5. Select **Manage API Access Keys**.
6. Select **Regenerate** to regenerate the key.

### Revoke the primary or secondary API key

1. Sign in to the Azure portal as an enterprise administrator.
2. Search for and select **Cost Management + Billing**.
3. Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
4. In the navigation menu, select **Usage + Charges**.
5. Select **Manage API Access Keys**.
6. Select **Revoke** to revoke the key.

### Allow API access to non-administrators

If you want to give the API access keys to people who aren't enterprise administrators in your enrollment, perform the following steps.

The steps give API access to key holders so they can view cost and pricing information in usage reports.

1. In the left navigation window, select **Policies**.
2. Select **On** under the DEPARTMENT ADMINS CAN VIEW CHARGES section and then select **Save**.
3. Select **On** under the ACCOUNT OWNERS CAN VIEW CHARGES section and then select **Save**.  
    :::image type="content" source="./media/enterprise-rest-apis/policies-view-charges.png" alt-text="Screenshot showing the Polices window where you change view charges options." lightbox="./media/enterprise-rest-apis/policies-view-charges.png" :::

## Pass keys in the API

Pass the API key for each call for authentication and authorization. Pass the following property to HTTP headers:

| Request header key | Value |
| --- | --- |
| Authorization | Specify the value in this format: **bearer {API\_KEY}**
Example: bearer \<APIKey\> |

## Swagger

A Swagger endpoint is available at [Enterprise Reporting v3 APIs](https://consumption.azure.com/swagger/ui/index)for the following APIs. Swagger helps inspect the API. Use Swagger to generate client SDKs using [AutoRest](https://github.com/Azure/AutoRest) or [Swagger CodeGen](https://swagger.io/swagger-codegen/). Data available after May 1, 2014 is available through the API.

## API response codes

When you're using an API, response status codes are shown. The following table describes them.

| Response status code | Message | Description |
| --- | --- | --- |
| 200 | OK | No error |
| 401 | Unauthorized | API Key not found, Invalid, Expired etc. |
| 404 | Unavailable | Report endpoint not found |
| 400 | Bad Request | Invalid parameters – Date ranges, EA numbers etc. |
| 500 | Server Error | Unexpected error processing request |

## Usage and billing data update frequency

Usage and billing data files are updated every 24 hours for the current billing month. However, data latency can occur for up to three days. For example, if usage is incurred on Monday, data might not appear in the data file until Thursday.

## Azure service catalog

You can download all Azure services in the Azure portal as part of the Price Sheet download. For more information about downloading your price sheet, see [Download pricing for an Enterprise Agreement](ea-pricing.md#download-pricing-for-an-enterprise-agreement).

## CSV data file details

The following information describes the properties of API reports.

### Usage summary

JSON format is generated from the CSV report. As a result, the format is same as the summary CSV format. The column name is wielded, so you should deserialize into a data table when you consume the JSON summary data.

| CSV column name | JSON column name | JSON new column | Comment |
| --- | --- | --- | --- |
| AccountOwnerId | AccountOwnerLiveId | AccountOwnerLiveId |   |
| Account Name | AccountName | AccountName |   |
| ServiceAdministratorId | ServiceAdministratorLiveId | ServiceAdministratorLiveId |   |
| SubscriptionId | SubscriptionId | SubscriptionId |   |
| SubscriptionGuid | MOSPSubscriptionGuid | SubscriptionGuid |   |
| Subscription Name | SubscriptionName | SubscriptionName |   |
| Date | Date | Date | Shows the date that the service catalog report ran. The format is a date string without a time stamp. |
| Month | Month | Month |   |
| Day | Day | Day |   |
| Year | Year | Year |   |
| Product | BillableItemName | Product |   |
| Meter ID | ResourceGUID | MeterId |   |
| Meter Category | Service | MeterCategory | Useful to help find  services. Relevant for services that have multiple ServiceType. For example, Virtual Machines. |
| Meter Sub-Category | ServiceType | MeterSubCategory | Provides a second level of details for a service. For example, A1 VM (Non-Windows).  |
| Meter Region | ServiceRegion | MeterRegion | The third level of detail required for a service. Useful to find the region context of the ResourceGUID. |
| Meter Name | ServiceResource | MeterName | The name of the service. |
| Consumed Quantity | ResourceQtyConsumed | ConsumedQuantity |   |
| ResourceRate | ResourceRate | ResourceRate |   |
| ExtendedCost | ExtendedCost | ExtendedCost |   |
| Resource Location | ServiceSubRegion | ResourceLocation |   |
| Consumed Service | ServiceInfo | ConsumedService |   |
| Instance ID | Component | InstanceId |   |
| ServiceInfo1 | ServiceInfo1 | ServiceInfo1 |   |
| ServiceInfo2 | ServiceInfo2 | ServiceInfo2 |   |
| AdditionalInfo | AdditionalInfo | AdditionalInfo |   |
| Tags | Tags | Tags |   |
| Store Service Identifier   | OrderNumber | StoreServiceIdentifier   |   |
| Department Name | DepartmentName | DepartmentName |   |
| Cost Center | CostCenter | CostCenter |   |
| Unit of Measure | UnitOfMeasure | UnitOfMeasure | Example values: Hours, GB, Events, Pushes, Unit, Unit Hours, MB, Daily Units |
| ResourceGroup | ResourceGroup | ResourceGroup |   |

### Azure Marketplace report

| CSV column name | JSON column name | JSON new column |
| --- | --- | --- |
| AccountOwnerId | AccountOwnerId | AccountOwnerId |
| Account Name | AccountName | AccountName |
| SubscriptionId | SubscriptionId | SubscriptionId |
| SubscriptionGuid | SubscriptionGuid | SubscriptionGuid |
| Subscription Name | SubscriptionName |  SubscriptionName |
| Date | BillingCycle |  Date  (Date String only. No time stamp)
| Month | Month |  Month |
| Day | Day |  Day |
| Year | Year |  Year |
| Meter ID | MeterResourceId |  MeterId |
| Publisher Name | PublisherFriendlyName |  PublisherName |
| Offer Name | OfferFriendlyName |  OfferName |
| Plan Name | PlanFriendlyName |  PlanName |
| Consumed Quantity | BilledQty |  ConsumedQuantity |
| ResourceRate | ResourceRate | ResourceRate |
| ExtendedCost | ExtendedCost | ExtendedCost |
| Unit of Measure | UnitOfMeasure | UnitOfMeasure |
| Instance ID | InstanceId | InstanceId |
| Additional Info | AdditionalInfo | AdditionalInfo |
| Tags | Tags | Tags |
| Order Number | OrderNumber | OrderNumber |
| Department Name | DepartmentNames | DepartmentName |
| Cost Center | CostCenters |  CostCenter |
| Resource Group | ResourceGroup |  ResourceGroup |

### Price sheet

| CSV column name | JSON column name | Comment |
| --- | --- | --- |
| Service | Service |  No change to price |
| Unit of Measure | UnitOfMeasure |   |
| Overage Part Number | ConsumptionPartNumber |   |
| Overage Unit Price | ConsumptionPrice |   |
| Currency Code | CurrencyCode |     |

## Common API issues

As you use Azure Enterprise REST APIs, you might encounter any of the following common issues.

You might try to use an API key that doesn't have the correct authorization type. API keys are generated by:

- Enterprise Administrator
- Department Administrator (DA)
- Account Owner (AO)

A key generated by the EA admin gives access to all information for that enrollment. A read-only EA admin can't generate an API key.

A key generated by a DA or AO doesn't provide access to balance, charge, and price sheet information.

An API key expires every six months. If expired, you need to regenerate it.

If you receive a timeout error, you can resolve it by increasing the timeout threshold limit.

You might receive a 401 error (unauthorized) expiration error. The error is normally caused by an expired key. If the key is expired, you can regenerate it.

You might receive 400 and 404 (unavailable) errors returned from an API call when there's no current data available for the date range selected. For example, this error might occur because an enrollment transfer was recently initiated. Data from a specific date and later now resides in a new enrollment. Otherwise, the error might occur if you're using a new enrollment number to retrieve information that resides in an old enrollment.

## Next steps

- Azure EA portal administrators should read [Azure EA portal administration](ea-portal-administration.md) to learn about common administrative tasks.
- If you need help with troubleshooting Azure EA portal issues, see [Troubleshoot Azure EA portal access](ea-portal-troubleshoot.md).
