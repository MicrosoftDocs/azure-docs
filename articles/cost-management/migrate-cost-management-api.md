---
title: Migrate from Enterprise Agreement to Microsoft Customer Agreement APIs - Azure | Microsoft Docs
description: This article helps you understand what happens with APIs when you migrate a Microsoft Enterprise Agreement (EA) to a Microsoft Customer Agreement.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 03/20/2019
ms.topic: conceptual
ms.service: cost-management
manager: micflan
ms.custom:
---

# Migrate from Enterprise Agreement to Microsoft Customer Agreement APIs

This article helps you understand the data structure, API, and other system integration differences between Enterprise Agreement (EA) and Microsoft Customer Agreement (MCA) accounts. Azure Cost Management supports APIs for both account types. Review the [Setup billing account for](../billing/billing-mca-setup-account.md) Microsoft Customer Agreement article before continuing.

Organizations with an existing EA account should review this article in conjunction with setting up an MCA account. Previously, renewing an EA account required some minimal work to move from an old enrollment to a new one. However, migrating to an MCA account requires additional effort. The additional effort is due to changes in the underlying billing subsystem, which affect all cost-related APIs and service offerings.

## MCA APIs and integration

MCA APIs and new integration allow you to:

- Have complete API availability through native Azure APIs.
- Configure multiple invoices in a single billing account.
- Access a consolidated API with Azure service usage, third-party Marketplace usage, and Marketplace purchases.
- View costs across billing profiles (enrollment equivalent) using Azure Cost Management.
- Access new APIs to summarize costs, get notified when costs exceed predefined thresholds, and export raw data automatically.

## Migration checklist

The following items help you transition to MCA APIs.

- Familiarize yourself with the new [Microsoft Customer Agreement billing account](../billing/billing-mca-overview.md).
- Determine which APIs you use and see which ones are replaced in the following section.
- Familiarize yourself with [Azure Resource Manager REST APIs](/rest/api/azure).
- If you're not already using Azure Resource Manager APIs, [register your client app with Azure AD](/rest/api/azure/#register-your-client-application-with-azure-ad).
- Update any programming code to [use Azure AD authentication](/rest/api/azure/#create-the-request).
- Update any programming code to replace EA API calls with MCA API calls.
- Update error handling to utilize new error codes.
- Review additional integration offerings, like Cloudyn and Power BI, for other needed action.

## EA APIs replaced with MCA APIs

EA APIs use an API key for authentication and authorization. MCA APIs use Azure AD authentication.

| Purpose | EA API | MCA API |
| --- | --- | --- |
| Balance and credits | [/balancesummary](/rest/api/billing/enterprise/billing-enterprise-api-balance-summary) | Microsoft.Billing/billingAccounts/billingProfiles/availableBalanceussae |
| Usage (JSON) | [/usagedetails](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail#json-format)[/usagedetailsbycustomdate](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail#json-format) | [Microsoft.Consumption/usageDetails](/rest/api/consumption/usagedetails)<sup>1</sup> |
| Usage (CSV) | [/usagedetails/download](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail#csv-format)[/usagedetails/submit](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail#csv-format) | [Microsoft.Consumption/usageDetails/download](/rest/api/consumption/usagedetails)<sup>1</sup> |
| Marketplace Usage (CSV) | [/marketplacecharges](/rest/api/billing/enterprise/billing-enterprise-api-marketplace-storecharge)[/marketplacechargesbycustomdate](/rest/api/billing/enterprise/billing-enterprise-api-marketplace-storecharge) | [Microsoft.Consumption/usageDetails/download](/rest/api/consumption/usagedetails)<sup>1</sup> |
| Billing periods | [/billingperiods](/rest/api/billing/enterprise/billing-enterprise-api-billing-periods) | Microsoft.Billing/billingAccounts/billingProfiles/invoices |
| Price sheet | [/pricesheet](/rest/api/billing/enterprise/billing-enterprise-api-pricesheet) | Microsoft.Billing/billingAccounts/billingProfiles/pricesheet/default/download format=json|csv Microsoft.Billing/billingAccounts/…/billingProfiles/…/invoices/… /pricesheet/default/download..format=json|csv Microsoft.Billing/billingAccounts/../billingProfiles/../providers/Microsoft.Consumption/pricesheets/download  |
| Reservation purchases | [/reservationcharges](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-charges) | Microsoft.Billing/billingAccounts/billingProfiles/transactions |
| Reservation recommendations | [/SharedReservationRecommendations](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation#request-for-shared-reserved-instance-recommendations)[/](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation#request-for-single-reserved-instance-recommendations)[SingleReservationRecommendations](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation#request-for-single-reserved-instance-recommendations) | [Microsoft.Consumption/reservationRecommendations](/rest/api/consumption/reservationrecommendations/list) |
| Reservation usage | [/reservationdetails](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage#request-for--reserved-instance-usage-details)[/reservationsummaries](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage#request-for--reserved-instance-usage-summary) | [Microsoft.Consumption/reservationDetails](/rest/api/consumption/reservationsdetails)[Microsoft.Consumption/reservationSummaries](/rest/api/consumption/reservationssummaries) |

<sup>1</sup> Azure service and third-party Marketplace usage are available with the [Usage Details API](/rest/api/consumption/usagedetails).

The following APIs are available to MCA billing accounts:

| Purpose | Microsoft Customer Agreement (MCA) API |
| --- | --- |
| Billing accounts<sup>2</sup> | Microsoft.Billing/billingAccounts |
| Billing profiles<sup>2</sup> | Microsoft.Billing/billingAccounts/billingProfiles |
| Invoice sections<sup>2</sup> | Microsoft.Billing/billingAccounts/invoiceSections |
| Invoices | Microsoft.Billing/billingAccounts/billingProfiles/invoices |
| Billing subscriptions | {scope}/billingSubscriptions |

<sup>2</sup> APIs return lists of objects, which are scopes, where Cost Management experiences in the Azure portal and APIs operate. For more information about Cost Management scopes, see [Understand and work with scopes](understand-work-scopes.md).

If you use any existing EA APIs, you need to update them to support MCA billing accounts. The following table shows other integration changes:

| Purpose | Old offering | New offering |
| --- | --- | --- |
| Cloudyn | [Cloudyn.com](https://www.cloudyn.com) | [Azure Cost Management](https://azure.microsoft.com/services/cost-management/) |
| Power BI | [Microsoft Consumption Insights](../power-bi/desktop-connect-azure-consumption-insights.md) content pack and connector | [Microsoft Azure Consumption Insights Power BI app](https://appsource.microsoft.com/product/power-bi/pbi_azureconsumptioninsights.pbi-azure-consumptioninsights?tab=overview) and [ Azure Consumption Insights connector](/power-bi/desktop-connect-azure-consumption-insights) |

## APIs to get balance and credits

You can get a monthly summary of balances, new purchases, Azure Marketplace service charges, adjustments, and service overage charges with the [Get Balance Summary](/rest/api/billing/enterprise/billing-enterprise-api-balance-summary) API. All Consumption APIs are replaced by native Azure APIs which use Azure AD for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request).

The Get Balance Summary API is replaced by the Microsoft.Billing/billingAccounts/billingProfiles/availableBalance API.

To get available balances with the Available Balance API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/availableBalances?api-version=2018-11-01-preview` |

## APIs to get cost and usage

Get a daily breakdown of costs accrued from Azure service usage, third-party Marketplace usage, and other Marketplace purchases with the following APIs. The following separate APIs were merged for Azure services and third-party Marketplace usage. The old APIs are replaced by the [Microsoft.Consumption/usageDetails](/rest/api/consumption/usagedetails) API. It adds Marketplace purchases, which were previously only summarized in the balance summary to date.

- [Get usage detail/download](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail#csv-format)
- [Get usage detail/submit](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail#csv-format)
- [Get usage detail/usagedetails](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail#json-format)
- [Get usage detail/usagedetailsbycustomdate](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail#json-format)
- [Get marketplace store charge/marketplacecharges](/rest/api/billing/enterprise/billing-enterprise-api-marketplace-storecharge)
- [Get marketplace store charge/marketplacechargesbycustomdate](/rest/api/billing/enterprise/billing-enterprise-api-marketplace-storecharge)

All Consumption APIs are replaced by native Azure APIs which use Azure AD for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request).

All the preceding APIs are replaced by the Consumption/Usage Details API.

To get usage details with the Usage Details API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?api-version=2019-01-01` |

The Usage Details API, as with all Cost Management APIs, is available at multiple scopes. For invoiced costs, as you would traditionally receive at an enrollment level, use the billing profile scope.  For more information about Cost Management scopes, see [Understand and work with scopes](https://docs.microsoft.com/en-us/azure/cost-management/understand-work-scopes).

| Type | ID format |
| --- | --- |
| Billing account | `/Microsoft.Billing/billingAccounts/{billingAccountId}` |
| Billing profile | `/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}` |
| Subscription | `/subscriptions/{subscriptionId}` |
| Resource group | `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}` |

Use the following querystring parameters to update any programming code.

| Old parameters | New parameters |
| --- | --- |
| `billingPeriod={billingPeriod}` | Not supported |
| `endTime=yyyy-MM-dd` | `endDate=yyyy-MM-dd` |
| `startTime=yyyy-MM-dd` | `startDate=yyyy-MM-dd` |

The body of the response also changed.

Old response body:

```
{
  "id": "string",
  "data": [{...}, ...],
  "nextLink": "string"
}
```

New response body:

```
{
  "value": [{
    "id": "{scope}/providers/Microsoft.Consumption/usageDetails/###",
    "name": "###",
    "type": "Microsoft.Consumption/usageDetails",
    "tags": {...},
    "properties": [{...}, ...],
    "nextLink": "string"
  }, ...]
}
```

The property name containing the array of usage records changed from data to _values_. Each record used to have a flat list of detailed properties. However, each record now all details are in a nested _properties_ property, except for tags. The new structure is consistent with other Azure APIs. Some property names have changed. The following table shows corresponding properties.

| Old property | New property | Notes |
| --- | --- | --- |
| AccountId | N/A | The subscription creator isn't tracked. Use invoiceSectionId (departmentId equivalent). |
| AccountNameAccountOwnerId and AccountOwnerEmail | N/A | The subscription creator isn't tracked. Use invoiceSectionName (departmentName equivalent). |
| AdditionalInfo | additionalInfo | &nbsp;  |
| ChargesBilledSeparately | isAzureCreditEligible | Note these are opposites. If isAzureCreditEnabled is true, ChargesBilledSeparately would be false, and vice-versa. |
| ConsumedQuantity | quantity | &nbsp; |
| ConsumedService | consumedService | Exact string values might differ. |
| ConsumedServiceId | None | &nbsp; |
| CostCenter | costCenter | &nbsp; |
| Date and usageStartDate | date | &nbsp;  |
| Day | None | Parses day from date. |
| DepartmentId | invoiceSectionId | Exact values differ. |
| DepartmentName | invoiceSectionName | Exact string values might differ. Configure invoice sections to match departments, if needed. |
| ExtendedCost and Cost | costInBillingCurrency | &nbsp;  |
| InstanceId | resourceId | &nbsp;  |
| Is Recurring Charge | None | &nbsp;  |
| Location | location | &nbsp;  |
| MeterCategory | meterCategory | Exact string values might differ. |
| MeterId | meterId | Exact string values differ. |
| MeterName | meterName | Exact string values might differ. |
| MeterRegion | meterRegion | Exact string values might differ. |
| MeterSubCategory | meterSubCategory | Exact string values might differ. |
| Month | None | Parses month from date. |
| Offer Name | None | Use publisherName and productOrderName. |
| OfferId | None | &nbsp;  |
| Order Number | None | &nbsp;  |
| PartNumber | None | Use meterId and productOrderName to uniquely identify prices. |
| Plan Name | productOrderName | &nbsp;  |
| Product | Product |   |
| ProductId | productId | Exact string values differ. |
| Publisher Name | publisherName | &nbsp;  |
| ResourceGroup | resourceGroupName | &nbsp;  |
| ResourceGuid | meterId | Exact string values differ. |
| ResourceLocation | resourceLocation | &nbsp;  |
| ResourceLocationId | None | &nbsp;  |
| ResourceRate | effectivePrice | &nbsp;  |
| ServiceAdministratorId | N/A | &nbsp;  |
| ServiceInfo1 | serviceInfo1 | &nbsp;  |
| ServiceInfo2 | serviceInfo2 | &nbsp;  |
| ServiceName | meterCategory | Exact string values might differ. |
| ServiceTier | meterSubCategory | Exact string values might differ. |
| StoreServiceIdentifier | N/A | &nbsp;  |
| SubscriptionGuid | subscriptionId | &nbsp;  |
| SubscriptionId | subscriptionId | &nbsp;  |
| SubscriptionName | subscriptionName | &nbsp;  |
| Tags | tags | The tags property applies to root object, not to the nested properties property. |
| UnitOfMeasure | unitOfMeasure | Exact string values differ. |
| usageEndDate | date | &nbsp;  |
| Year | None | Parses year from date. |
| (new) | billingCurrency | Currency used for the charge. |
| (new) | billingProfileId | Unique ID for the billing profile (enrollment equivalent). |
| (new) | billingProfileName | Name of the billing profile (enrollment equivalent). |
| (new) | chargeType | Use to differentiate Azure service usage, Marketplace usage, and purchases. |
| (new) | invoiceId | Unique ID for the invoice. Empty for the current, open month. |
| (new) | publisherType | Type of publisher for purchases. Empty for usage. |
| (new) | serviceFamily | Type of purchase. Empty for usage. |
| (new) | servicePeriodEndDate | End date for the purchased service. |
| (new) | servicePeriodStartDate | Start date for the purchased service. |

## Billing Periods API replaced by Invoices API

MCA billing accounts don't use billing periods. Instead, they use invoices to scope costs to specific billing periods. The [Billing Periods API](/rest/api/billing/enterprise/billing-enterprise-api-billing-periods) is replaced by the Invoices API. All Consumption APIs are replaced by native Azure APIs which use Azure AD for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request).

To get invoices with the Invoices API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/invoices?api-version=2018-11-01-preview` |

## Price Sheet APIs

This section discusses existing Price Sheet APIs and provides recommendations to move to the Price Sheet API for Microsoft Customer Agreements. It also discusses the Price Sheet API for Microsoft Customer Agreements and explains fields in the price sheets. The [Enterprise Get price sheet](/rest/api/billing/enterprise/billing-enterprise-api-pricesheet) and [Enterprise Get billing periods](/rest/api/billing/enterprise/billing-enterprise-api-billing-periods) APIs are replaced by the Price Sheet API for Microsoft Customer Agreements (Microsoft.Billing/billingAccounts/billingProfiles/pricesheet). The new API supports both JSON and CSV formats, in asynchronous REST formats. All Consumption APIs are replaced by native Azure APIs which use Azure AD for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request).

### Billing Enterprise APIs

You used Billing Enterprise APIs with Enterprise enrollments to get price and billing period information. Authentication and authorization used Azure Active Directory web tokens.

To get applicable prices for the specified Enterprise Enrollment with the Price Sheet and Billing Period APIs:

| Method | Request URI |
| --- | --- |
| GET | `https://consumption.azure.com/v2/enrollments/{enrollmentNumber}/pricesheet` |
| GET | `https://consumption.azure.com/v2/enrollments/{enrollmentNumber}/billingPeriods/{billingPeriod}/pricesheet` |

### Price Sheet API for Microsoft Customer Agreements

Use the Price Sheet API for Microsoft Customer Agreements to view prices for all Azure Consumption and Marketplace consumption services. The prices shown for the billing profile apply to all subscriptions that belong to the billing profile.

To view all Azure Consumption services Price Sheet data for a Microsoft Customer Agreement billing profile with the Price Sheet API in CSV format:

| Method | Request URI |
| --- | --- |
| POST | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/pricesheet/default/download?api-version=2018-11-01-preview&startDate=2019-01-01&endDate=2019-01-31&format=csv` |

To view all Azure Consumption services Price Sheet data for a Microsoft Customer Agreement billing profile with the Price Sheet API in JSON format:

| Method | Request URI |
| --- | --- |
| POST | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/pricesheet/default/download?api-version=2018-11-01-preview&startDate=2019-01-01&endDate=2019-01-31&format=json` |

In addition to using the API, which returns the price sheet for the entire account, you can also get a summarized version of the price sheet in PDF format. The summary includes Azure Consumption and Marketplace consumption services that are billed for a specific invoice. The invoice is identified by the {invoiceId}, which is the same as the **Invoice Number** shown in the Invoice Summary PDF files. Here's an example.

![Example image showing the Invoice Number that corresponds to the InvoiceId](./media/migrate-cost-management-api/invoicesummary.png)

To view invoice information with the Price Sheet API in CSV format:

| Method | Request URI |
| --- | --- |
| POST | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/2909cffc-b0a2-5de1-bb7b-5d3383764184/billingProfiles/2dcffe0c-ee92-4265-8647-515b8fe7dc78/invoices/{invoiceId}/pricesheet/default/download?api-version=2018-11-01-preview&format=csv` |

To view invoice information with the Price Sheet API in JSON Format:

| Method | Request URI |
| --- | --- |
| POST | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/2909cffc-b0a2-5de1-bb7b-5d3383764184/billingProfiles/2dcffe0c-ee92-4265-8647-515b8fe7dc78/invoices/{invoiceId}/pricesheet/default/download?api-version=2018-11-01-preview&format=json` |

You can also see estimated prices for any Azure Consumption or Marketplace consumption service in the current open billing cycle or service period.

To view estimated prices for consumption services with the Price Sheet API in CSV format:

| Method | Request URI |
| --- | --- |
| POST | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billing AccountId}/billingProfiles/{billingProfileId}/pricesheet/default/download?api-version=2018-11-01-preview&format=csv` |

To view estimated prices for consumption services with the Price Sheet API in JSON format:

| Method | Request URI |
| --- | --- |
| POST | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billing AccountId}/billingProfiles/{billingProfileId}/pricesheet/default/download?api-version=2018-11-01-preview&format=json` |

The Microsoft Customer Agreement Price Sheet APIs are *asynchronous REST APIs*. The responses for the APIs changed from the older synchronous APIs. The body of the API response also changed.

#### Old response body

Here's an example of the synchronous REST API response:

```
[
        {
            "id": "enrollments/573549891/billingperiods/2016011/products/343/pricesheets",
            "billingPeriodId": "201704",
            "meterId": "dc210ecb-97e8-4522-8134-2385494233c0",
            "meterName": "A1 VM",
            "unitOfMeasure": "100 Hours",
            "includedQuantity": 0,
            "partNumber": "N7H-00015",
            "unitPrice": 0.00,
            "currencyCode": "USD"
        },
        {
    ]
```

#### New response body

The APIs support the [Azure REST asynchronous](../azure-resource-manager/resource-manager-async-operations.md) format. Call the API using GET and you receive the following response:

```
No Response Body

HTTP Status 202 Accepted
```

The following headers are sent with the location of the output:

```
Location:https://management.azure.com/providers/Microsoft.Consumption/operationresults/{operationId}?sessiontoken=XZDFSnvdkbkdsb==

Azure-AsyncOperation:https://managment.azure.com/providers/Microsoft.Consumption/operationStatus/{operationId}?sessiontoken=XZDFSnvdkbkdsb==

Retry-After: 10

OData-EntityId: {operationId}

```

Make a subsequent GET call to the location. The response for the call to GET on the location is the same one that was shown previously until the operation reaches a completion or failure state. When completed, the response to the call for the GET on Location returns the download URL as if the operation were executed at the same time. Here's an example:

```
HTTP Status 200

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

The client can also make a GET call for the `Azure-AsyncOperation`. The endpoint returns the status for the operation.

The following table shows fields in the older Enterprise Get price sheet API with corresponding ones in the new price sheet for Microsoft Customer Agreements:

| Old property | New property | Notes |
| --- | --- | --- |
| billingPeriodId  | _Not applicable_ | Not applicable. For Microsoft Customer Agreements, the invoice and associated price sheet replaced the concept of billingPeriodId . |
| meterId  | meterId | &nbsp;  |
| unitOfMeasure  | unitOfMeasure | Exact string values might differ. |
| includedQuantity  | includedQuantity | Not applicable for services in Microsoft Customer Agreements. |
| partNumber  | _Not applicable_ | Instead, use a combination of productOrderName (equivalent for offerId) and meterid. |
| unitPrice  | unitPrice | Unit price is applicable for services consumed in Microsoft Customer Agreements. |
| currencyCode  | pricingCurrency | Microsoft Customer Agreements have price representations in pricing currency and billing currency. The currencyCode corresponds to the pricingCurrency in Microsoft Customer Agreements. |
| offerId | productOrderName | Instead of OfferId, you can use productOrderName but isn't the same as OfferId. However, productOrderName and meter determine pricing in Microsoft Customer Agreements related to meterId and Offerid in legacy enrollments. |

## Consumption Price Sheet API operations

For Enterprise Agreements, you used the Consumption Price Sheet API [Get](/rest/api/consumption/pricesheet/get) and [Get By Billing Period](/rest/api/consumption/pricesheet/getbybillingperiod) operations for a scope by subscriptionId or a billing period. The API uses Azure Resource Management authentication.

To get the Price Sheet information for a scope with the Price Sheet API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Consumption/pricesheets/default?api-version=2018-10-01` |

To get Price Sheet information by billing period with the Price Sheet API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Billing/billingPeriods/{billingPeriodName}/providers/Microsoft.Consumption/pricesheets/default?api-version=2018-10-01` |

Instead of the above API endpoints, use the following for Microsoft Customer Agreements:

**Price Sheet API for Microsoft Customer Agreements (asynchronous REST API)**

This API is for Microsoft Customer Agreements and it provides additional attributes.

**Price Sheet for a Billing Profile scope in a Billing Account**

This API is the existing API. It was updated to provide the price sheet for a billing profile in a billing account.

## Price Sheet for a scope by billing account at the enrollment scope

Azure Resource Manager authentication is used when you get the Price Sheet at the enrollment scope in a billing account.

To get the Price Sheet at the enrollment account in a billing account:

| Method | Request URI |
| --- | --- |
| GET | `/providers/Microsoft.Billing/billingAccounts/65085863/providers/Microsoft.Consumption/pricesheets/download?api-version=2019-01-01` |

For a Microsoft Customer Agreement, use the information in the following section. It provides the field properties used for Microsoft Customer agreements.

### Price Sheet for a billing profile scope in a billing account

The updated Price Sheet by billing account API gets the Price Sheet at the billing profile scope for a Microsoft Customer Agreement in CSV format.

To get the Price Sheet at the billing profile scope for a Microsoft Customer Agreement:

| Method | Request URI |
| --- | --- |
| GET | `/providers/Microsoft.Billing/billingAccounts/28ae4b7f-41bb-581e-9fa4-8270c857aa5f/billingProfiles/ef37facb-cd6f-437a-9261-65df15b673f9/providers/Microsoft.Consumption/pricesheets/download?api-version=2019-01-01` |

The response and properties of the API are identical to the Price Sheet by billing account at the Enterprise Agreement's enrollment scope. The properties correspond to equivalent Microsoft Customer Agreement properties.

The older properties for [Azure Resource Manager Price Sheet APIs](/rest/api/consumption/pricesheet) and equivalent new properties in the Price Sheet API for Microsoft Customer Agreements are shown in the following table.

| Old Azure Resource Manager Price Sheet API Property  | New Microsoft Customer Agreement Price Sheet API property   | Description |
| --- | --- | --- |
| Meter ID | _meterId_ | Unique identifier for the meter. Equivalent to meterId. |
| Meter name | meterName | Name of the meter. Meter represents the Azure service deployable resource. |
| Meter category  | service | Name of the classification category for the meter. Equivalent to the service in the Microsoft Customer Agreement Price Sheet. Exact string values differ. |
| Meter sub-category | meterSubCategory | Name of the meter sub-classification category. It is based on the classification of high-level feature set differentiation in the service. For example, Basic SQL DB vs Standard SQL DB. |
| Meter region | meterRegion | &nbsp;  |
| Unit | _Not applicable_ | Can be parsed from unitOfMeasure. |
| Unit of measure | unitOfMeasure | &nbsp;  |
| Part number | _Not applicable_ | Instead of partNumber, use productOrderName and MeterId to uniquely identify the price for a billing profile. These fields are listed on the Microsoft Customer Agreement invoice instead of the partNumber in Microsoft Customer Agreement invoices. |
| Unit price | unitPrice | Microsoft Customer Agreement unit price. |
| Currency code | pricingCurrency | Microsoft Customer Agreements represent prices in pricing currency and billing currency. Currency code is equivalent to the pricingCurrency in Microsoft Customer Agreements. |
| Included quantity | includedQuantity | Not applicable to services in Microsoft Customer Agreements. Show with values of zero. |
|  Offer Id  | productOrderName | Instead of OfferId, use productOrderName. Not equivalent to OfferId, however the productOrderName and meter determine pricing in Microsoft Customer Agreements. Related to meterId and Offerid in legacy enrollments. |

The price for Microsoft Customer Agreements is defined differently than Enterprise agreements. The price for services in the Enterprise enrollment is unique for product, PartNumber, meter, and offer. The PartNumber isn't used in Microsoft Customer Agreements.

The Azure Consumption service price that's part of a Microsoft Customer Agreement is unique for productOrderName and meterId. They represent the service meter and the product plan.

To reconcile between the price sheet and the usage in the Usage Details API, you can use the productOrderName and meterId.

Users that have billing profile owner, contributor, reader, and invoice manager rights can download the price sheet.

The price sheet includes prices for services whose price is based on usage including, Azure consumption and Marketplace consumption. The latest price at the end of each service period is locked and applied to usage in a single service period. For Azure consumption services, the service period is usually a calendar month.

### Retired Price Sheet API fields

The following fields are either not available in Microsoft Customer Agreement Price Sheet APIs or have equivalent fields.

|Retired field| Description|
|---|---|
| billingPeriodId | No applicable. Corresponds to InvoiceId for MCA. |
| offerId | Not applicable. Corresponds to productOrderName in MCA. |
| meterCategory  | Not applicable. Corresponds to Service in MCA. |
| unit | Not applicable. Can be parsed from unitOfMeasure. |
| currencyCode | Equivalent to the pricingCurrency in MCA. |
| meterLocation | Equivalent to the meterRegion in MCA. |
| partNumber partnumber | Not applicable because part number is not listed in MCA invoices. Instead of partnumber, use the meterId and productOrderName combination to uniquely identify prices. |
| totalIncludedQuantity | Not applicable. |
| pretaxStandardRate  | Not applicable. |

## Reservation Instance Charge API replaced by Transactions API

You can get billing transactions for reservation purchases with the [Reserved Instance Charge API](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-charges). The new API includes all purchases, including third-party Marketplace offerings. All Consumption APIs are replaced by native Azure APIs which use Azure AD for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request). The Reserved Instance Charge API is replaced by the Transactions API.

To get reservation purchase transactions with the Transactions API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/transactions?api-version=2018-11-01-preview` |

## Reservation Recommendations APIs replaced

You can get virtual machine usage over the last seven, 30, or 60 days and reservation purchase recommendations with the Reserved Instance Purchase Recommendations APIs. They include:

- [Shared Reserved Instance Recommendation API](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation#request-for-shared-reserved-instance-recommendations)
- [Single Reserved Instance Recommendations API](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation#request-for-single-reserved-instance-recommendations)

All Consumption APIs are replaced by native Azure APIs which use Azure AD for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request). The reservation recommendations APIs listed previously are replaced by the [Microsoft.Consumption/reservationRecommendations](/rest/api/consumption/reservationrecommendations/list) API.

To get reservation recommendations with the Reservation Recommendations API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/providers/Microsoft.Consumption/reservationRecommendations?api-version=2019-01-01` |

## Reservation Usage APIs replaced by Reservation Summaries API

You can get reservation usage in an enrollment with the Reserved Instance Usage API. If there is more than one reserved instance in an enrollment, you can also get the usage of all the reserved instance purchases using this API.

They include:

- [Reserved Instance Usage Details](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage#request-for--reserved-instance-usage-details)
- [Reserved Instance Usage Summary](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage#request-for--reserved-instance-usage-summary)

All Consumption APIs are replaced by native Azure APIs which use Azure AD for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request). The reservation recommendations APIs listed previously are replaced by the [Microsoft.Consumption/reservationDetails](/rest/api/consumption/reservationsdetails) and [Microsoft.Consumption/reservationSummaries](/rest/api/consumption/reservationssummaries) APIs.

To get reservation details with the Reservation Details API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/providers/Microsoft.Consumption/reservationDetails?api-version=2019-01-01` |

To get reservation summaries with the Reservation Summaries API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/providers/Microsoft.Consumption/reservationSummaries?api-version=2019-01-01` |



## Move from Cloudyn to Cost Management

Organizations using [Cloudyn](https://cloudyn.com) should start using [Azure Cost Management](https://azure.microsoft.com/services/cost-management/) for any cost management needs. Cost Management is available in the Azure portal with no onboarding and an eight-hour latency. For more information, see the [Cost Management documentation](index.yml).

With Azure Cost Management, you can:

- View costs over time against a predefined budget. Analyze daily cost patterns to identify and stop spending anomalies. Break costs down by tags, resource group, service, and location.
- Create budgets to set limits on usage and costs and get notified when important thresholds are approached. Set up automation with action groups to trigger custom events and enforce hard limits on your terms.
- Optimize cost and usage with recommendations from Azure Advisor. Discover purchase optimizations with reservations, downsize underused virtual machines, and delete unused resources to stay within budgets.
- Schedule a cost and usage data export to publish a CSV file to your storage account daily. Automate integration with external systems to keep billing data in sync and up to date.

## Power BI integration

If you use Power BI for cost reporting, you need to switch to the Microsoft Azure Consumption Insights Power BI app or Azure Consumption Insights desktop connector as part of the transition. The connector is recommended for organizations wanting the most flexibility. However, the Power BI app is also available for quick set up.

- Install the [Microsoft Azure Consumption Insights Power BI app](https://appsource.microsoft.com/product/power-bi/pbi_azureconsumptioninsights.pbi-azure-consumptioninsights?tab=overview)
- [Connect with the Azure Consumption Insights connector](/power-bi/desktop-connect-azure-consumption-insights)

The older Consumption Insights content pack and connector both worked at an enrollment level and required at least read access. The new Consumption Insights Power BI app and the new Azure Consumption Insights connector are available for billing profile users. Teams that need a finer-grained access to costs or a view across billing profiles should use in [Cost analysis](https://ms.portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/costanalysis) the Azure portal.

# Next steps

- To learn more about how to monitor and control Azure spending and optimize resource use with Cost Management, read the [Cost Management documentation](index.yml).
