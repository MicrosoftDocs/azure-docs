---
title: Azure Enterprise Reporting APIs
description: Learn about the Azure Enterprise Reporting APIs that enable customers to pull consumption data programmatically.
author: bandersmsft
ms.reviewer: adwise
ms.service: cost-management-billing
ms.subservice: enterprise
ms.topic: reference
ms.date: 02/22/2024
ms.author: banders

---
# Overview of the Azure Enterprise Reporting APIs

> [!NOTE]
> On May 1, 2024, Azure Enterprise Reporting APIs will be retired. Any remaining Enterprise Reporting APIs will stop responding to requests. Customers need to transition to using Microsoft Cost Management APIs before then.
> To learn more, see [Migrate from Azure Enterprise Reporting to Microsoft Cost Management APIs overview](../automate/migrate-ea-reporting-arm-apis-overview.md).

The Azure Enterprise Reporting APIs enable Enterprise Azure customers to programmatically pull consumption and billing data into preferred data analysis tools. Enterprise customers signed an [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/) with Azure to make negotiated Azure Prepayment (previously called monetary commitment) and gain access to custom pricing for Azure resources.

All date and time parameters required for APIs must be represented as combined Coordinated Universal Time (UTC) values. Values returned by APIs are shown in UTC format.

## Enabling data access to the API
* **Generate or retrieve the API key** - For more information, see [API key generation](enterprise-rest-apis.md#api-key-generation).
* **Passing keys in the API** - The API key needs to be passed for each call for Authentication and Authorization. The following property needs to be to the HTTP headers.

|Request Header Key | Value|
|-|-|
|Authorization| Specify the value in this format: **bearer {API_KEY}** <br/> Example: bearer eyr....09|

## Consumption-based APIs
A Swagger endpoint is available [here](https://consumption.azure.com/swagger/ui/index) for the following APIs. They should enable easy introspection of the API and the ability to generate client software development kits (SDK)s using [AutoRest](https://github.com/Azure/AutoRest) or [Swagger CodeGen](https://swagger.io/swagger-codegen/). Data beginning May 1, 2014 is available through this API.

* **Balance and Summary** - The [Balance and Summary API](/rest/api/billing/enterprise/billing-enterprise-api-balance-summary) offers a monthly summary of information on balances, new purchases, Azure Marketplace service charges, adjustments, and overage charges.

* **Usage Details** - The [Usage Detail API](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail) offers a daily breakdown of consumed quantities and estimated charges by an Enrollment. The result also includes information on instances, meters, and departments. Query the API by Billing period or by a specified start and end date.

* **Marketplace Store Charge** - The [Marketplace Store Charge API](/rest/api/billing/enterprise/billing-enterprise-api-marketplace-storecharge) returns the usage-based marketplace charges breakdown by day for the specified Billing Period or start and end dates (one time fees aren't included).

* **Price Sheet** - The [Price Sheet API](/rest/api/billing/enterprise/billing-enterprise-api-pricesheet) provides the applicable rate for each Meter for the given Enrollment and Billing Period.

* **Reserved Instance Details** - The [Reserved Instance usage API](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) returns the usage of the Reserved Instance purchases. The [Reserved Instance charges API](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) shows the billing transactions made.

## Data Freshness
Etags are returned in the response of all the above API. A change in Etag indicates the data was refreshed. In subsequent calls to the same API using the same parameters, pass the captured Etag with the key "If-None-Match" in the header of http request. The response status code is `NotModified` if the data isn't refreshed further and no data is returned. API returns the full dataset for the required period whenever there's an etag change.

## Helper APIs
 **List Billing Periods** - The [Billing Periods API](/rest/api/billing/enterprise/billing-enterprise-api-billing-periods) returns a list of billing periods that have consumption data for the specified Enrollment in reverse chronological order. Each Period contains a property pointing to the API route for the four sets of data - BalanceSummary, UsageDetails, Marketplace Charges, and Price Sheet.


## API Response Codes   
|Response Status Code|Message|Description|
|-|-|-|
|200| OK|No error|
|400| Bad Request| Invalid params – Date ranges, EA numbers etc.|
|401| Unauthorized| API Key not found, Invalid, Expired etc.|
|404| Unavailable| Report endpoint not found|
|429 | TooManyRequests | The request was throttled. Retry after waiting for the time specified in the <code>x-ms-ratelimit-microsoft.consumption-retry-after</code> header.|
|500| Server Error| Unexpected error processing request|
| 503 | ServiceUnavailable | The service is temporarily unavailable. Retry after waiting for the time specified in the <code>Retry-After</code> header.|
