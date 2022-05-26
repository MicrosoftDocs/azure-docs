---
title: Cost Management API latency and rate limits
titleSuffix: Azure Cost Management + Billing
description: This article explains why the Cost Management API has latency and rate limits.
author: bandersmsft
ms.author: banders
ms.date: 05/26/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Cost Management API latency and rate limits

We recommend that you call the Cost Management APIs no more than once per day. Cost Management data is refreshed every four hours as new usage data is received from Azure resource providers. Calling more frequently doesn't provide more data. Instead, it creates increased load. To learn more about how often data changes and how data latency is handled, see [Understand cost management data](../costs/understand-cost-mgt-data.md).

## Error code 429 - Call count has exceeded rate limits

To enable a consistent experience for all Cost Management subscribers, Cost Management APIs are rate limited. When you reach the limit, you receive the HTTP status code `429: Too many requests`. Please wait for a period of time before attempting to call again. 

## Cost Details API Rate Limits
Rate limits for the [Cost Details API - UNPUBLISHED]() are outlined below.

| Program | Scope | Limit | Rate Limit | Comments |
| --- | --- | --- | --- | --- |
| EA/MCA | All | Per distinct scope | 2 calls/min, 10 calls/hour, 50 calls/day | See below for example URIs. |
| EA/MCA - CostDetailsOperation | All | Per Operation Id | 2 calls/min | See below for example URIs. |
| EA/MCA | Subscription Scope | Per Tenant Id | 10 calls/min | Across all subscriptions at a unique tenant ID level. See below for example URIs. |
| EA/MCA | Subscription Scope | Per Billing Account | 10 calls/min | Across all subscriptions at a unique billing account level. See below for example URIs. |
| EA/MCA | All Non-subscription scope | Per Billing Account | 5 calls/min | Across all non-subscription scope calls(including billing profile, customer scope calls) at a unique billing account level. See below for example URIs. |
| EA/MCA | All | Per client application id | 30 calls/min | Across all calls made by the client application. |

### API call pattern guidance per scenario

The cost details dataset oftentimes can be multiple Gbs or more month over month as your costs increase. Customer data ingestion workloads need to use call patterns that meet their scenarios while also abiding by the API rate limits. Some guidance on ways to call the API given these rate limits is below. 

If you are throttled, please refer to the `retry-after` header that is present in the error response to determine when to call the API next.

**Month-to-date datasets under a single scope**

In this scenario, customers may need to pull down a large multi Gb dataset for a single scope, such as a Billing Account or Subscription. In this case, we recommend placing multiple API calls for smaller date ranges in order to pull down all the data.

Please note that if you need to chunk the data per day in order to have reasonably sized file partitions, it may take you ~3 hours to fully download the dataset for the month across all partitions.

**Dataset requiring calls across multiple scopes**

In this scenario, customers may need to pull data across many different scopes or sub-scopes. Examples include: 
* *A large enterprise needs to pull down data across N different subscriptions that they manage.*
  * With rate limiting in place, you will be able to ingest data for 600 subscriptions per hour. If you need to pull down data faster than this, we recommend using a scope that is above subscription.
* *A partner needs to pull down data for N customers under their Billing Acccount.*
  * In this instance, we recommend placing a call per customer. With rate limiting in place, you will be able to ingest data for 300 customers per hour. If you need to chunk your requests by date range due to the dataset size, this number will be less.
* *A cloud solutions provider needs to pull down data across N Billing Accounts that reside in different tenants.*
  * We recommend using the same Client Application Id for all calls. API calls will be rate limited across both the application used and the other calls being made to the existing scopes by either the provider or the end customer. With rate limiting in place, provider client applications will be able to make 30 total calls per minute. If data needs to be chunked or multiple calls need to be made per tenant, then data ingestion time will increase accordingly.

**Multi-month one-time historical dataset download**

In this scenario, customers need to seed a 13 month historical dataset for a given scope, such as a Billing Account. In this case, we recommend placing a call for data 1 month at a time. If your dataset is too large, then we recommend reducing the date range until the data size is manageable for your workloads. Decreasing your date range will affect the time it will take for you to fully ingest the dataset. If you need to chunk your data per day, then it will take ~8 days for you to full ingest your data. Please note that if you have a 30Gb MoM dataset, then a 13 month historical dataset will be around 390Gb.

### Rate Limited URI Examples

Examples below show which API calls would apply to the rate limits outlined in the rate limit table above.

**Legacy/Modern - All scopes - Per distinct scope**
<ul><li>https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.CostManagement/CostDetails?api-version=2022-05-01</li>https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/providers/Microsoft.CostManagement/CostDetails?api-version=2022-05-01<li>https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/customers/{customerId}/providers/Microsoft.CostManagement/CostDetails?api-version=2022-05-01 </li><li>https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.CostManagement/CostDetails?api-version=2022-05-01 </li></ul>

**Legacy/Modern: CostDetailsOperation - All scopes - Per operation id**
<ul><li>https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts/{enrollmentAccountId}/providers/Microsoft.CostManagement/CostDetailsOperationStatus/{operationId}?api-version=2022-05-01 </li></ul>

**Legacy/Modern - Subscription scope - Per tenant id**
<ul><li>https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.CostManagement/CostDetails?api-version=2022-05-01</li></ul>

**Legacy/Modern - Subscription scope - Per Billing Account**
<ul><li>https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.CostManagement/CostDetails?api-version=2022-05-01</li></ul>

**Legacy/Modern - All Non-subscription scope - Per Billing Account**
<ul><li>https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.CostManagement/CostDetails?api-version=2022-05-01 </li><li>https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/providers/Microsoft.CostManagement/CostDetails?api-version=2022-05-01 </li><li>https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/customers/{customerId}/providers/Microsoft.CostManagement/CostDetails?api-version=2022-05-01</li></ul>

## Consumption Usage Details API Rate Limits

Rate limits for the [Consumption Usage Details API]() are outlined below. This API should only be used by legacy Pay-As-You-Go customers. If you are a Enterprise or Microsoft Customer Agreement customer you should use the Cost Details API or Exports.

|Program|Scope|Limit|Rate Limit|Comments|
|----|----|----|----|----|
|EA/MCA|Subscription Scope|Per Tenant Id|10 calls/min|Across all subscriptions at a unique tenant ID level|
|EA/MCA|Subscription Scope|Per Billing Account|10 calls/min|Across all subscriptions at a unique billing account level|
|MCA|All Non-subscription scope|Per Billing Account|6 calls/min|Across all non-subscription scope calls(including billing profile, customer scope calls) at a unique billing account level|
|EA|Management Group|Per management group|2 calls/min| |
|EA|Per Billing Account|Per Billing Account|6 calls/min| |
|EA|Per Department|Per Department|2 calls/min| |
|EA|Per EnrollmentAccount|Per EnrollmentAccount|2 calls/min| |
|EA/MCA|All|Per unique skipToken|2 calls/min|Usage Details provide next link with a URI including skip token. Here unique skip token calls are being considered next page calls which have unique skip token. Every next link uri is considered as unique skip token call|
|EA/MCA|Subscription Scope|Per Tenant Id|10 calls/min|Across all subscriptions at a unique tenant ID level|


## Charges API Rate Limits

Rate limits for the [Charges API]() are outlined below.

| Program | Scope | Limit | Rate Limit | Comments |
| --- | --- | --- | --- | --- |
| EA/MCA | All scopes | Per tenant | 125 calls / min |   |
| EA/MCA | Billing account | Per billing account | 20 calls / min |  |

## Pricesheet API Rate Limits

Rate limits for the [Pricesheet API]() are outlined below.

| Program | Scope | Limit | Rate Limit | Comments |
| --- | --- | --- | --- | --- |
| EA/MCA | Billing Account and Subscription | Per Billing Account | 30 calls / min |  |
| EA/MCA | Billing Account and Subscription | Per Subscription | 150 calls / min |  |

## Reservation Utilization Summaries API Rate Limits

Rate limits for the [Reservation Utilization Summaries API]() are outlined below.

| Program | Scope | Limit | Rate Limit | Comments |
| --- | --- | --- | --- | --- |
| EA/MCA |  | Per distinct URL | 10 calls / min | Across all scopes for a given URL + user (tenantId + objectId) |

## Reservation Utilization Details API Rate Limits

Rate limits for the [Reservation Utilization Details API]() are outlined below.

| Program | Scope | Limit | Rate Limit | Comments |
| --- | --- | --- | --- | --- |
| EA/MCA |  | Per distinct URL | 10 calls / min | Across all scopes for a given URL + user (tenantId + objectId) |

## Reservation Transactions API Rate Limits

Rate limits for the [Reservation Transactions API]() are outlined below.

| Program | Scope | Limit | Rate Limit | Comments |
| --- | --- | --- | --- | --- |
| EA/MCA |  | Per distinct URL | 10 calls / min | Across all scopes for a given URL + user (tenantId + objectId) |

## Next steps

- Learn more about Cost Management + Billing automation at [Cost Management automation overview](automation-overview.md).
