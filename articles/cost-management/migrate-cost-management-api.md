---
title: Migrate from Enterprise Agreement to Microsoft Customer Agreement APIs - Azure | Microsoft Docs
description: This article helps you understand the impact to APIs when you migrate from a Microsoft Enterprise Agreement (EA) to a Microsoft Customer Agreement.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 03/02/2019
ms.topic: conceptual
ms.service: cost-management
manager: micflan
ms.custom:
---

# Migrate from Enterprise Agreement to Microsoft Customer Agreement APIs

This article helps you understand the impact to APIs when you migrate from a Microsoft Enterprise Agreement (EA) to a Microsoft Customer Agreement. The following new APIs are used to view costs and pricing:

- Pricesheet API for Microsoft Customer Agreements
  - Pricesheet by Invoice
  - Pricesheet by Billing Profile
  - Pricesheet for the open billing period
- Usage Details API for Microsoft Customer Agreements
  - Usage Details by Invoice for Billing Profile (filter by invoice section)
    - Usage Details by Usage Date
    - Usage Details for Billing Account
    - Usage Details for Billing Profile
    - Usage Details for Invoice Section
    - Usage details for subscription
  - Usage Details for Month to Date
    - Usage Details for Billing Account
    - Usage Details for Billing Profile
    - Usage Details for Invoice Section
    - Usage details for subscription
  - Usage Details by Billing Period
- Credits API for Microsoft Customer Agreement
  - Current Balance Summary API by Billing Profile
  - Credit events API by Billing Profile
  - Credit Lots API by Billing Profile
- Query API
- Charges API
  - Charges API by Billing Account
  - Charges API by Billing Profile
  - Charges API by Invoice Section
- Invoice List API
  - By Billing Profile
  - By Billing Account
- Reservation APIs
- Power BI Integration API
- Exports API
  - by Billing Account
  - by Billing Profile
  - By Invoice Section
- Transaction API
- Budgets API
- Aggregated Cost API

## Effect on automation

The APIs used with a Microsoft customer agreement differ from ones used with an Enterprise Agreement. You might have set up API automation previously using enterprise key-based APIs or Azure Resource Manager-based APIs for enterprise enrollments. If so, update your automation configuration for newer APIs used with Microsoft Customer Agreements.

To see a list of older unsupported APIs by Microsoft Customer Agreements, see [Unsupported APIs](#unsupported-apis).

APIs for Microsoft Customer Agreements support Azure Resource Manager authentication only — they don't support API key-based authentication.

## Pricesheet APIs show prices for Azure services

The Pricesheet APIs for Microsoft Customer Agreement include pricing information for all services that are rated for billing, based on usage quantity. The API doesn't include entitlement purchases. For example, Marketplace entitlement purchases, reserved instance prices, and support offerings. The API provides the unique price for each service for a specific meter and product order name.

### View the Pricesheet for Azure Consumption services by billing profile

You can view prices for all first and third-party Azure Consumption services in the Pricesheet for a billing profile. Use the API to view prices for Azure Consumption services. The prices shown for the billing profile apply to all subscriptions that belong to the billing profile.

- CSV format
  - POST
    -`https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/pricesheet/default/download?api-version=2018-11-01-preview&startDate=2019-01-01&endDate=2019-01-31& format=csv`
- JSON format
  - POST
    - `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/pricesheet/default/download?api-version=2018-11-01-preview&startDate=2019-01-01&endDate=2019-01-31&format=json`

### View current open billing or service period estimated prices

To view the estimated prices for any service in the current open billing cycle or service period, you can view the Pricesheet in either CSV or JSON format.

- CSV format
  - POST
    - `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billing AccountId}/billingProfiles/{billingProfileId}/pricesheet/default/download?api-version=2018-11-01-preview&format=csv`
- JSON format
  - POST
    - `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billing AccountId}/billingProfiles/{billingProfileId}/pricesheet/default/download?api-version=2018-11-01-preview&format=json`

Prices shown in the Pricesheet for the current service period always reflect the latest prices for the meter. Prices are refreshed daily, using the latest price for the meter and product order.

When reviewing costs based on the price in the open period, costs are estimated. The last locked price at the end of the open service period applies to usage in the open period.

The open period is the current service period where the usage hasn't yet been rated for costing and billing.

### View invoice by billing profile prices

You can view prices for Azure Consumption services that are billed in a specific invoice for a billing profile. Use the API to view prices only for the services that are listed in the invoice. The invoice is identified by the invoice number.

- CSV format
  - POST
    - `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/2909cffc-b0a2-5de1-bb7b-5d3383764184/billingProfiles/2dcffe0c-ee92-4265-8647-515b8fe7dc78/invoices/{invoiceId}/pricesheet/default/download?api-version=2018-11-01-preview&format=csv`

- JSON format
  - POST
    - `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/2909cffc-b0a2-5de1-bb7b-5d3383764184/billingProfiles/2dcffe0c-ee92-4265-8647-515b8fe7dc78/invoices/{invoiceId}/pricesheet/default/download?api-version=2018-11-01-preview&format=json`

The `{invoiceId}` listed previously is the same as the **Invoice Number** shown in the Invoice Summary PDF file. Here's an example.

![Example image showing the Invoice Number that corresponds to the InvoiceId](./media/migrate-cost-management-api/invoicesummary.png)

## Pricesheet API asynchronous response

The APIs support the [Azure REST  asynchronous](../azure-resource-manager/resource-manager-async-operations.md) format. After you call the APIs using GET, you see the following response:

```
            No Response Body
            HTTP Status 202 Accepted
```

 The following headers are sent with the location of the output.

```
Location: https://management.azure.com/providers/Microsoft.Consumption/operationresults/{operationId}?sessiontoken=XZDFSnvdkbkdsb==
Azure-AsyncOperation: https://managment.azure.com/providers/Microsoft.Consumption/operationStatus/{operationId}?sessiontoken=XZDFSnvdkbkdsb==
   Retry-After: 10
 OData-EntityId: {operationId}
```

The client can make a GET call to the location. The response to the GET call is the same as the example information shown previously, until the operation reaches a completion or failure state. When completed, the response to the call for the GET on Location returns the same response as if the operation was executed at the same time. Here's an example.

```
HTTP Status 200
i.e.
            {
    “id”: “providers/Microsoft.Consumption/operationresults/{operationId}”,
    “name”: {operationId},
    “type”: “Microsoft.Consumption/operationResults”,
    “properties” : {
          “downloadUrl”: {urltoblob},
          “vaildTill”: “Date”
}
}
```

Additionally, the client can also make a GET call for the `Azure-AsyncOperation`. The endpoint returns the status for the operation. Here's an example:

```
HTTP Status 200
               {
"id": “providers/Microsoft.Consumption/operationStatus/{operationId}",
"name": "operationId",
"status" : "Succeeded | Failed | Canceled",
"startTime": "<DateLiteral per ISO8601>",
"endTime": "<DateLiteral per ISO8601>",
"percentComplete": <double between 0 and 100>
"properties": {
    /\* The resource provider can choose the values here, but it should only be
       returned on a successful operation (status being "Succeeded"). \*/
},
"error" : {
    /\* This is the OData v4 format, used by the RPC and will go into the
     v2.2 Azure REST API guidelines \*/
    "code": "BadArgument",
    "message": "The provided database &#39;foo&#39; has an invalid username."
}
}
```

### Pricesheet fields

Review the information at [Understand the terms in your price sheet for a Microsoft Customer Agreement](../billing/billing-mca-understand-pricesheet.md) to view all the Pricesheet fields and their descriptions.

For pricing based on usage, the usage price is locked for the service period since the beginning of period. Service price is applied and locked on the date of purchase. The service period is usually a calendar month for Azure services.

The price for an Azure Consumption service in a Microsoft Customer Agreement is unique for a product order and meter.

The fields you can use to uniquely identify the price for Azure Consumption services are:

- productOrderName
- meterId (also, meterName)

The price for Microsoft Customer Agreements is defined differently than Enterprise agreements where the price for services in the enrollment is unique for:

- Product
- PartNumber
- meter
- offer

### Pricesheet support

Currently, the Pricesheet API only supports Microsoft Customer Agreement prices for Azure first-party and third-party consumption services. It doesn't support prices for Marketplace services, Reserved Instances, and Azure Hybrid Benefits (AHUB).

The API only provides the unit price that will be charged against the service. This price is equal or lesser than the negotiated price.

## Query for usage and costs

The Usage Details API provides access to Azure and third-party Marketplace service usage and costs. Prices are based on the negotiated prices for your agreement. EA customers moving to a Customer Agreement should use Usage Details for either the billing account or billing profile scope. You can be query at any scope, with the following exceptions:

|   | Customer Agreement | Enterprise Agreement | Individual Agreement (PAYG) |
| --- | --- | --- | --- |
| Billing account | Yes | Yes | N/A |
| Billing profiles (invoice) | Yes | N/A. See billing account. | N/A. See subscriptions. |
| Invoice sections | No. Use billing profiles with a filter. | N/A | N/A |
| EA departments | N/A | Yes | N/A |
| EA enrollment accounts | N/A | Yes | N/A. See subscriptions. |
| Management groups | No. Use billing account. | Yes | Yes |
| Subscriptions | Yes | Yes | Yes |
| Resource groups | No. Use subscriptions with a filter. | No. Use subscriptions with a filter. | No. Use subscriptions with a filter. |

The properties returned by UsageDetails per agreement type are different. See [UsageDetails API documentation](/rest/api/consumption/usagedetails/) for a full list.

### Power BI integration

EA customers moving to a Microsoft Customer Agreement should stop using any existing integration with Power BI to Microsoft Azure Consumption Insights using their EA information. Instead, you can use:

- Power BI Desktop – Create new Power BI reports for the Microsoft Customer agreement with the [Azure Cost Management connector](https://docs.microsoft.com/power-bi/desktop-connect-azure-consumption-insights).
- Power BI Service – Move from the [Microsoft Azure Consumption Insights](https://docs.microsoft.com/power-bi/service-connect-to-azure-consumption-insights) content pack to the Azure Cost Management (Customer Agreement) app, available at [AppSource](https://appsource.microsoft.com/product/power-bi/pbi_azureconsumptioninsights.pbi-azure-consumptioninsights?tab=overview).

## Unsupported APIs

The following Enterprise Agreement APIs aren't supported by Microsoft Customer Agreements. Alternatives to unsupported APIs are described.

[Get Pricesheet By Subscription](/rest/api/consumption/pricesheet/get/) is unsupported. It lists the prices for the scope of a subscriptionId. Instead, you can use **Pricesheet by Billing Profile**. The price of a service in the scope of a subscription is the same as the price in the scope of a billing profile. The user calling the API must have required permissions.

**Price Sheet - Get By Billing Period** is unsupported. It gets the price sheet for a scope by subscriptionId and billing period. Instead, you can use **Pricesheet by Billing Profile**. The service price in a subscription scope equals the service price in a billing profile scope. The user calling the API must have required permissions.

[Price Sheet for Enterprise customers by Enrollment](/rest/api/billing/enterprise/billing-enterprise-api-pricesheet/) isn't supported. And, [Pricesheet for Enterprise customers by Enrollment for a Billing Period](/rest/api/billing/enterprise/billing-enterprise-api-pricesheet/) isn't supported. Both provide the applicable rate for each meter for the given Enrollment and Billing Period. Instead, you can use **Pricesheet by Billing Profile**. The pricesheet at the enrollment scope is the pricesheet available for the billing profile. The user calling the API must have required permissions.

## See also
- Learn more about [Azure Consumption REST APIs](/rest/api/consumption/).
