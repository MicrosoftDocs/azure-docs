---
title: Migrate EA to Microsoft Customer Agreement APIs - Azure
description: This article helps you understand the consequences of migrating a Microsoft Enterprise Agreement (EA) to a Microsoft Customer Agreement.
author: bandersmsft
ms.author: banders
ms.date: 01/07/2025
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: micflan
---

# Migrate from Enterprise Agreement to Microsoft Customer Agreement APIs

This article helps you understand the data structure, API, and other system integration differences between Enterprise Agreement (EA) and Microsoft Customer Agreement (MCA) accounts. Cost Management supports APIs for both account types. Review the [Setup billing account for](../manage/mca-setup-account.md) Microsoft Customer Agreement article before continuing.

Organizations with an existing EA account should review this article when they set up an MCA account. Previously, renewing an EA account required some minimal work to move from an old enrollment to a new one. However, migrating to an MCA account requires extra effort. Extra effort is because of changes in the underlying billing subsystem, which affect all cost-related APIs and service offerings.

## MCA APIs and integration

MCA APIs and new integration allow you to:

- Have complete API availability through native Azure APIs.
- Configure multiple invoices in a single billing account.
- Access a combined API with Azure service usage, third-party Marketplace usage, and Marketplace purchases.
- View costs across billing profiles (the same as enrollments) using Cost Management.
- Access new APIs to show costs, get notified when costs exceed predefined thresholds, and export raw data automatically.

## Migration checklist

The following items help you transition to MCA APIs.

- Familiarize yourself with the new [Microsoft Customer Agreement billing account](../understand/mca-overview.md).
- Determine which APIs you use and see which ones are replaced in the following section.
- Familiarize yourself with [Azure Resource Manager REST APIs](/rest/api/azure).
- If you're not already using Azure Resource Manager APIs, [register your client app with Microsoft Entra ID](/rest/api/azure/#register-your-client-application-with-azure-ad).
- Grant the application that was created during Microsoft Entra app registration read access to the billing account using Access control (IAM).
- Update any programming code to [use Microsoft Entra authentication](/rest/api/azure/#create-the-request).
- Update any programming code to replace EA API calls with MCA API calls.
- Update error handling to use new error codes.
- Review other integration offerings like Power BI for other needed action.

## EA APIs replaced with MCA APIs

EA APIs use an API key for authentication and authorization. MCA APIs use Microsoft Entra authentication.

> [!NOTE]
> All Azure Enterprise Reporting APIs are retired. You should [Migrate to Microsoft Cost Management APIs](../automate/migrate-ea-reporting-arm-apis-overview.md) as soon as possible.

| Purpose | EA API | MCA API |
| --- | --- | --- |
| Balance and credits | /balancesummary | Microsoft.Billing/billingAccounts/billingProfiles/availableBalanceussae |
| Usage (JSON) | /usagedetails<br>/usagedetailsbycustomdate | [Choose a cost details solution](../automate/usage-details-best-practices.md) |
| Usage (CSV) | /usagedetails/download<br>/usagedetails/submit | [Choose a cost details solution](../automate/usage-details-best-practices.md) |
| Marketplace Usage (CSV) | /marketplacecharges<br>/marketplacechargesbycustomdate | [Choose a cost details solution](../automate/usage-details-best-practices.md) |
| Billing periods | /billingperiods | Microsoft.Billing/billingAccounts/billingProfiles/invoices |
| Price sheet | /pricesheet | Microsoft.Billing/billingAccounts/billingProfiles/pricesheet/default/download format=json or csv <br> Microsoft.Billing/billingAccounts/…/billingProfiles/…/invoices/… /pricesheet/default/download format=json or csv <br> Microsoft.Billing/billingAccounts/../billingProfiles/../providers/Microsoft.Consumption/pricesheets/download  |
| Reservation purchases | /reservationcharges | Microsoft.Billing/billingAccounts/billingProfiles/transactions |
| Reservation recommendations | /SharedReservationRecommendations <br>/SingleReservationRecommendations | [Microsoft.Consumption/reservationRecommendations](/rest/api/consumption/reservationrecommendations/list) |
| Reservation usage | /reservationdetails<br>/reservationsummaries | [Microsoft.Consumption/reservationDetails](/rest/api/consumption/reservationsdetails)<br>[Microsoft.Consumption/reservationSummaries](/rest/api/consumption/reservationssummaries) |

¹ Azure service and third-party Marketplace usage are available with the [Usage Details API](/rest/api/consumption/usagedetails).

The following APIs are available to MCA billing accounts:

| Purpose | Microsoft Customer Agreement (MCA) API |
| --- | --- |
| Billing accounts² | Microsoft.Billing/billingAccounts |
| Billing profiles² | Microsoft.Billing/billingAccounts/billingProfiles |
| Invoice sections² | Microsoft.Billing/billingAccounts/invoiceSections |
| Invoices | Microsoft.Billing/billingAccounts/billingProfiles/invoices |
| Billing subscriptions | {scope}/billingSubscriptions |

² APIs return lists of objects, which are scopes, where Cost Management experiences in the Azure portal and APIs operate. For more information about Cost Management scopes, see [Understand and work with scopes](understand-work-scopes.md).

If you use any existing EA APIs, you need to update them to support MCA billing accounts. The following table shows other integration changes:

| Purpose | Old offering | New offering |
| --- | --- | --- |
| Power BI | [Microsoft Consumption Insights](/power-bi/desktop-connect-azure-consumption-insights) content pack and connector |  [Azure Consumption Insights connector](/power-bi/connect-data/desktop-connect-azure-cost-management) |

## APIs to get balance and credits

The Get Balance Summary was used to give you a monthly summary of:

- Balances
- New purchases
- Azure Marketplace service charges
- Adjustments
- Service overage charges

All Consumption APIs are replaced by native Azure APIs that use Microsoft Entra ID for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request).

The Get Balance Summary API is replaced by the Microsoft.Billing/billingAccounts/billingProfiles/availableBalance API.

To get available balances with the Available Balance API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/availableBalances?api-version=2018-11-01-preview` |

## APIs to get cost and usage

Get a daily breakdown of costs from Azure service usage, third-party Marketplace usage, and other Marketplace purchases with the following APIs. The following separate APIs were merged for Azure services and third-party Marketplace usage. The old APIs are replaced by either [Exports](ingest-azure-usage-at-scale.md) or the [Cost Details API](/rest/api/cost-management/generate-cost-details-report/create-operation). To choose the solution that's right for you, see [Choose a cost details solution](../automate/usage-details-best-practices.md). Both solutions provide the same Cost Details file and have marketplace purchases in the data, which were previously only shown in the balance summary to date.

Exports and the Cost Details API, as with all Cost Management APIs, are available at multiple scopes. For invoiced costs, as you would traditionally receive at an enrollment level, use the billing profile scope. For more information about Cost Management scopes, see [Understand and work with scopes](understand-work-scopes.md).

| **Type** | **ID format** |
| --- | --- |
| Billing account | /Microsoft.Billing/billingAccounts/{billingAccountId} |
| Billing profile | /Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId} |
| Subscription | /subscriptions/{subscriptionId} |
| Resource group | /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName} |

Some property names have changed in the new Cost Details dataset available through Exports and Cost Details API. The following table shows corresponding properties.

| Old property | New property | Notes |
| --- | --- | --- |
| AccountId | N/A | The subscription creator isn't tracked. Use invoiceSectionId (same as departmentId). |
| AccountNameAccountOwnerId and AccountOwnerEmail | N/A | The subscription creator isn't tracked. Use invoiceSectionName (same as departmentName). |
| AdditionalInfo | additionalInfo |     |
| ChargesBilledSeparately | isAzureCreditEligible | The properties are opposites. If isAzureCreditEnabled is true, ChargesBilledSeparately would be false. |
| ConsumedQuantity | quantity |    |
| ConsumedService | consumedService | Exact string values might differ. |
| ConsumedServiceId | None |    |
| CostCenter | costCenter |    |
| Date and usageStartDate | date |     |
| Day | None | Parses day from date. |
| DepartmentId | invoiceSectionId | Exact values differ. |
| DepartmentName | invoiceSectionName | Exact string values might differ. Configure invoice sections to match departments, if needed. |
| ExtendedCost and Cost | costInBillingCurrency |     |
| InstanceId | resourceId |     |
| Is Recurring Charge | None |     |
| Location | location |     |
| MeterCategory | meterCategory | Exact string values might differ. |
| MeterId | meterId | Exact string values differ. |
| MeterName | meterName | Exact string values might differ. |
| MeterRegion | meterRegion | Exact string values might differ. |
| MeterSubCategory | meterSubCategory | Exact string values might differ. |
| Month | None | Parses month from date. |
| Offer Name | None | Use publisherName and productOrderName. |
| OfferID | None |     |
| Order Number | None |     |
| PartNumber | None | Use meterId and productOrderName to uniquely identify prices. |
| Plan Name | productOrderName |     |
| Product | Product |   |
| ProductId | productId | Exact string values differ. |
| Publisher Name | publisherName |     |
| ResourceGroup | resourceGroupName |     |
| ResourceGuid | meterId | Exact string values differ. |
| ResourceLocation | resourceLocation |     |
| ResourceLocationId | None |     |
| ResourceName | None |     |
| ResourceRate | effectivePrice |     |
| ServiceAdministratorId | N/A |     |
| ServiceInfo1 | serviceInfo1 |     |
| ServiceInfo2 | serviceInfo2 |     |
| ServiceName | meterCategory | Exact string values might differ. |
| ServiceTier | meterSubCategory | Exact string values might differ. |
| StoreServiceIdentifier | N/A |     |
| SubscriptionGuid | subscriptionId |     |
| SubscriptionId | subscriptionId |     |
| SubscriptionName | subscriptionName |     |
| Tags | tags | The tags property applies to the root object, not to the properties nested property. |
| UnitOfMeasure | unitOfMeasure | Exact string values differ. |
| usageEndDate | date |     |
| Year | None | Parses year from date. |
| (new) | billingCurrency | Currency used for the charge. |
| (new) | billingProfileId | Unique ID for the billing profile (same as enrollment). |
| (new) | billingProfileName | Name of the billing profile (same as enrollment). |
| (new) | chargeType | Use to differentiate Azure service usage, Marketplace usage, and purchases. |
| (new) | invoiceId | Unique ID for the invoice. Empty for the current, open month. |
| (new) | publisherType | Type of publisher for purchases. Empty for usage. |
| (new) | serviceFamily | Type of purchase. Empty for usage. |
| (new) | servicePeriodEndDate | End date for the purchased service. |
| (new) | servicePeriodStartDate | Start date for the purchased service. |

## Billing Periods API replaced by Invoices API

MCA billing accounts don't use billing periods. Instead, they use invoices to scope costs to specific billing periods. The Billing Periods API is replaced by the Invoices API. All Consumption APIs are replaced by native Azure APIs that use Microsoft Entra ID for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request).

To get invoices with the Invoices API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/invoices?api-version=2018-11-01-preview` |

## Price Sheet APIs

This section discusses existing Price Sheet APIs and provides recommendations to move to the Price Sheet API for Microsoft Customer Agreements. It also discusses the Price Sheet API for Microsoft Customer Agreements and explains fields in the price sheets. The Enterprise Get price sheet and Enterprise Get billing periods APIs are replaced by the Price Sheet API for Microsoft Customer Agreements (Microsoft.Billing/billingAccounts/billingProfiles/pricesheet). The new API supports both JSON and CSV formats, in asynchronous REST formats. All Consumption APIs are replaced by native Azure APIs that use Microsoft Entra ID for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request).

### Billing Enterprise APIs

You used Billing Enterprise APIs with Enterprise enrollments to get price and billing period information. Authentication and authorization used Microsoft Entra web tokens.

To get applicable prices for the specified Enterprise Enrollment with the Price Sheet and Billing Period APIs:

| Method | Request URI |
| --- | --- |
| GET | `https://consumption.azure.com/v2/enrollments/{enrollmentNumber}/pricesheet` |
| GET | `https://consumption.azure.com/v2/enrollments/{enrollmentNumber}/billingPeriods/{billingPeriod}/pricesheet` |

### Price Sheet API for Microsoft Customer Agreements

Use the Price Sheet API for Microsoft Customer Agreements to view prices for all Azure Consumption and Marketplace consumption services. The prices shown for the billing profile apply to all subscriptions that belong to the billing profile.

Use the Price Sheet API to view all Azure Consumption services Price Sheet data in CSV format:

| Method | Request URI |
| --- | --- |
| POST | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/providers/Microsoft.CostManagement/pricesheet/default/download?api-version=2018-11-01-preview&startDate=2019-01-01&endDate=2019-01-31&format=csv` |

Use the Price Sheet API to view all Azure Consumption services Price Sheet data in JSON format:

| Method | Request URI |
| --- | --- |
| POST | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/providers/Microsoft.CostManagement/pricesheet/default/download?api-version=2018-11-01-preview&startDate=2019-01-01&endDate=2019-01-31&format=json` |

Using the API returns the price sheet for the entire account. However, you can also get a condensed version of the price sheet in PDF format. The summary includes Azure Consumption and Marketplace consumption services that are billed for a specific invoice. The invoice is identified by the {invoiceId}, which is the same as the **Invoice Number** shown in the Invoice Summary PDF files. Here's an example.

:::image type="content" border="true" source="./media/migrate-cost-management-api/invoicesummary.png" alt-text="Screenshot showing the Invoice Number that corresponds to the Invoice ID.":::

To view invoice information with the Price Sheet API in CSV format:

| Method | Request URI |
| --- | --- |
| POST | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/invoices/{invoiceId}/pricesheet/default/download?api-version=2018-11-01-preview&format=csv` |

To view invoice information with the Price Sheet API in JSON Format:

| Method | Request URI |
| --- | --- |
| POST | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/invoices/{invoiceId}/pricesheet/default/download?api-version=2018-11-01-preview&format=json` |

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

The APIs support the [Azure REST asynchronous](../../azure-resource-manager/management/async-operations.md) format. Call the API using GET and you receive the following response:

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

Make another GET call to the location. The response to the GET call is the same until the operation reaches a completion or failure state. When completed, the response to the GET call location returns the download URL as if the operation was executed at the same time. Here's an example:

```
HTTP Status 200

{
  "id": "providers/Microsoft.Consumption/operationresults/{operationId}",
  "name": {operationId},
  "type": “Microsoft.Consumption/operationResults",
  "properties" : {
    "downloadUrl": {urltoblob},
    "validTill": "Date"
  }
}
```

The client can also make a GET call for the `Azure-AsyncOperation`. The endpoint returns the status for the operation.

The following table shows fields in the older Enterprise Get price sheet API. It includes corresponding fields in the new price sheet for Microsoft Customer Agreements:

| Old property | New property | Notes |
| --- | --- | --- |
| billingPeriodId  | _Not applicable_ | Not applicable. For Microsoft Customer Agreements, the invoice and associated price sheet replaced the concept of billingPeriodId. |
| meterId  | meterId |     |
| unitOfMeasure  | unitOfMeasure | Exact string values might differ. |
| includedQuantity  | includedQuantity | Not applicable for services in Microsoft Customer Agreements. |
| partNumber  | _Not applicable_ | Instead, use a combination of productOrderName (same as offerID) and meterID. |
| unitPrice  | unitPrice | Unit price is applicable for services consumed in Microsoft Customer Agreements. |
| currencyCode  | pricingCurrency | Microsoft Customer Agreements have price representations in pricing currency and billing currency. The currencyCode corresponds to the pricingCurrency in Microsoft Customer Agreements. |
| offerID | productOrderName | Instead of OfferID, you can use productOrderName but isn't the same as OfferID. However, productOrderName and meter determine pricing in Microsoft Customer Agreements related to meterId and OfferID in legacy enrollments. |

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

Instead of the above API endpoints, use the following ones for Microsoft Customer Agreements:

**Price Sheet API for Microsoft Customer Agreements (asynchronous REST API)**

This API is for Microsoft Customer Agreements and it provides extra attributes.

**Price Sheet for a Billing Profile scope in a Billing Account**

This API is the existing API. It was updated to provide the price sheet for a billing profile in a billing account.

## Price Sheet for a scope by billing account

Azure Resource Manager authentication is used when you get the Price Sheet at the enrollment scope in a billing account.

To get the Price Sheet at the enrollment account in a billing account:

| Method | Request URI |
| --- | --- |
| GET | `/providers/Microsoft.Billing/billingAccounts/65085863/providers/Microsoft.Consumption/pricesheets/download?api-version=2019-01-01` |

For a Microsoft Customer Agreement, use the information in the following section. It provides the field properties used for Microsoft Customer agreements.

### Price Sheet for a billing profile scope in a billing account

The updated Price Sheet by billing account API gets the Price Sheet in CSV format. To get the Price Sheet at the billing profile scope for an MCA:

| Method | Request URI |
| --- | --- |
| GET | `/providers/Microsoft.Billing/billingAccounts/{billing AccountId}/billingProfiles/{billingProfileId}/providers/Microsoft.Consumption/pricesheets/download?api-version=2019-01-01` |

At the EA's enrollment scope, the API response and properties are identical. The properties correspond to the same MCA properties.

The older properties for [Azure Resource Manager Price Sheet APIs](/rest/api/consumption/pricesheet) and the same new properties are in the following table.

| Old Azure Resource Manager Price Sheet API Property  | New Microsoft Customer Agreement Price Sheet API property   | Description |
| --- | --- | --- |
| Meter ID | _meterId_ | Unique identifier for the meter. Same as meterID. |
| Meter name | meterName | Name of the meter. Meter represents the Azure service deployable resource. |
| Meter category  | service | Name of the classification category for the meter. Same as the service in the Microsoft Customer Agreement Price Sheet. Exact string values differ. |
| Meter subcategory | meterSubCategory | Name of the meter subclassification category. Based on the classification of high-level feature set differentiation in the service. For example, Basic SQL DB vs Standard SQL DB. |
| Meter region | meterRegion |     |
| Unit | _Not applicable_ | Can be parsed from unitOfMeasure. |
| Unit of measure | unitOfMeasure |     |
| Part number | _Not applicable_ | Instead of part number, use productOrderName and MeterID to uniquely identify the price for a billing profile. Fields are listed on the MCA invoice instead of the part number in MCA invoices. |
| Unit price | unitPrice | Microsoft Customer Agreement unit price. |
| Currency code | pricingCurrency | Microsoft Customer Agreements represent prices in pricing currency and billing currency. Currency code is the same as the pricingCurrency in Microsoft Customer Agreements. |
| Included quantity | includedQuantity | Not applicable to services in Microsoft Customer Agreements. Show with values of zero. |
|  Offer ID  | productOrderName | Instead of OfferID, use productOrderName. Not the same as OfferID, however the productOrderName and meter determine pricing in Microsoft Customer Agreements. Related to meterId and OfferID in legacy enrollments. |

The price for Microsoft Customer Agreements is defined differently than Enterprise agreements. The price for services in the Enterprise enrollment is unique for product, part number, meter, and offer. The part number isn't used in Microsoft Customer Agreements.

The Azure Consumption service price that's part of a Microsoft Customer Agreement is unique for productOrderName and meterID. They represent the service meter and the product plan.

To reconcile between the price sheet and the usage in the Usage Details API, you can use the productOrderName and meterID.

Users that have billing profile owner, contributor, reader, and invoice manager rights can download the price sheet.

The price sheet includes prices for services whose price is based on usage. The services include Azure consumption and Marketplace consumption. The latest price at the end of each service period is locked and applied to usage in a single service period. For Azure consumption services, the service period is usually a calendar month.

### Retired Price Sheet API fields

The following fields are either not available in Microsoft Customer Agreement Price Sheet APIs or have the same fields.

|Retired field| Description|
|---|---|
| billingPeriodId | No applicable. Corresponds to InvoiceId for MCA. |
| offerID | Not applicable. Corresponds to productOrderName in MCA. |
| meterCategory  | Not applicable. Corresponds to Service in MCA. |
| unit | Not applicable. Can be parsed from unitOfMeasure. |
| currencyCode | Same as the pricingCurrency in MCA. |
| meterLocation | Same as the meterRegion in MCA. |
| partNumber | Not applicable because part number isn't listed in MCA invoices. Instead of part number, use the meterId and productOrderName combination to uniquely identify prices. |
| totalIncludedQuantity | Not applicable. |
| pretaxStandardRate  | Not applicable. |

## Reservation Instance Charge API replaced

You can get billing transactions for reservation purchases with the Reserved Instance Charge API. The new API includes all purchases, including third-party Marketplace offerings. All Consumption APIs are replaced by native Azure APIs that use Microsoft Entra ID for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request). The Reserved Instance Charge API is replaced by the Transactions API.

To get reservation purchase transactions with the Transactions API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/transactions?api-version=2018-11-01-preview` |

## Recommendations APIs replaced

Reserved Instance Purchase Recommendations APIs provide virtual machine usage over the last 7, 30, or 60 days. APIs also provide reservation purchase recommendations. They include:

- Shared Reserved Instance Recommendation API
- Single Reserved Instance Recommendations API

All Consumption APIs are replaced by native Azure APIs that use Microsoft Entra ID for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request). The reservation recommendations APIs listed previously are replaced by the [Microsoft.Consumption/reservationRecommendations](/rest/api/consumption/reservationrecommendations/list) API.

To get reservation recommendations with the Reservation Recommendations API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/providers/Microsoft.Consumption/reservationRecommendations?api-version=2019-01-01` |

## Reservation Usage APIs replaced

You can get reservation usage in an enrollment with the Reserved Instance Usage API. If there's more than one reserved instance in an enrollment, you can also get the usage of all the reserved instance purchases using this API.

They include:

- Reserved Instance Usage Details
- Reserved Instance Usage Summary

All Consumption APIs are replaced by native Azure APIs that use Microsoft Entra ID for authentication and authorization. For more information about calling Azure REST APIs, see [Getting started with REST](/rest/api/azure/#create-the-request). The reservation recommendations APIs listed previously are replaced by the [Microsoft.Consumption/reservationDetails](/rest/api/consumption/reservationsdetails) and [Microsoft.Consumption/reservationSummaries](/rest/api/consumption/reservationssummaries) APIs.

To get reservation details with the Reservation Details API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/providers/Microsoft.Consumption/reservationDetails?api-version=2019-01-01` |

To get reservation summaries with the Reservation Summaries API:

| Method | Request URI |
| --- | --- |
| GET | `https://management.azure.com/providers/Microsoft.Consumption/reservationSummaries?api-version=2019-01-01` |


## Power BI integration

You can also use Power BI for cost reporting. The [Cost Management connector](/power-bi/desktop-connect-azure-cost-management) for Power BI Desktop can be used to create powerful, customized reports that help you better understand your Azure spend. The Cost Management connector currently supports customers with either a Microsoft Customer Agreement or an Enterprise Agreement (EA).

## Related content

- Read the [Cost Management documentation](../index.yml) to learn how to monitor and control Azure spending. Or, if you want to optimize resource use with Cost Management.
