# Migrate off Consumption Usage Details API

This article discusses migration away from the [Consumption Usage Details API](https://docs.microsoft.com/en-us/rest/api/consumption/usage-details/list). The Consumption Usage Details API is deprecated. The exact date for when this API will be turned off is still to be determined. We recommend migrating to the newer solutions at your earliest convenience.

# Migration destinations

Please read through usage details best practices \&lt;need link\&gt; prior to choosing which solution is right for your workload. Generally, [Exports](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data?tabs=azure-portal) is recommended if you have ongoing data ingestion needs and/or a large usage details dataset month to month. To learn more, please see Get large usage datasets \&lt;need link\&gt;.

If you have a smaller usage details dataset or a scenario that does not appear to be met by Exports consider using the Generate Detailed Cost Report API \&lt;need link\&gt; instead. To learn more, please see Get small usage datasets on demand \&lt;need link\&gt;.

\*\*Please note that the Generate Detailed Cost Report API \&lt;need link\&gt; is only available for customers with an Enterprise Agreement or Microsoft Customer Agreement. If you are an MSDN, Pay-As-You-Go or Visual Studio customer you can migrate onto Exports or continue using the Consumption Usage Details API at this time.

# Benefits of Migration

Our new solutions provide many benefits over the Consumption Usage Details API. These benefits are summarized below.

- **Scalability:** The [Consumption Usage Details API](https://docs.microsoft.com/en-us/rest/api/consumption/usage-details/list) is deprecated because it promotes a call pattern that will not be able to scale as your usage of Azure increases. The usage details dataset can get extremely large as you deploy more resources into the cloud. The Consumption Usage Details API is a paginated synchronous API and as such is not optimized to effectively transfer large volumes of data over the network with high efficiency and reliability. Exports and the Generate Detailed Cost Report API \&lt;need link\&gt; are asynchronous and provide you with a CSV file that can be directly downloaded over the network.
- **API improvements:** Exports and the Generate Detailed Cost Report API are the solutions the Azure Cost Management team is focusing on for the future. All new features built by the team will be integrated into these solutions for you to use moving forward.
- **Schema consistency:** The Generate Details Cost API \&lt;need link\&gt; and [Exports](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data?tabs=azure-portal) provide files with matching fields. This means you can move from one solution to the other based on your scenario.
- **Cost Allocation integration:** Enterprise Agreement and Microsoft Customer Agreement customers using Exports or the Generate Detailed Cost Report API can view charges in relation to the cost allocation rules that they have configured. To learn more about cost allocation, please see [Allocate costs](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/allocate-costs).

# Field Differences

The following table summarizes the field differences between the Consumption Usage Details API and Exports / Generate Detailed Cost Report API. Please note that both of the new solutions provide a CSV file download as opposed to the paginated JSON response that is provided by the Consumption API.

## Enterprise Agreement field mapping

Enterprise Agreement customers who are using the Consumption Usage Details API have usage details records of the kind &quot;legacy&quot;. A legacy usage details record is identified using the highlighted field below. All Enterprise Agreement customers have records of this kind due to the underlying billing system that is used for these customers.

{

&quot;value&quot;: [

{

&quot;id&quot;: &quot;{id}&quot;,

&quot;name&quot;: &quot;{name}&quot;,

&quot;type&quot;: &quot;Microsoft.Consumption/usageDetails&quot;,

&quot;kind&quot;: &quot;legacy&quot;,

&quot;tags&quot;: {

&quot;env&quot;: &quot;newcrp&quot;,

&quot;dev&quot;: &quot;tools&quot;

},

&quot;properties&quot;: {

…...

}

}

An full example legacy Usage Details record can be found here: [Usage Details - List - REST API (Azure Consumption) | Microsoft Docs](https://docs.microsoft.com/en-us/rest/api/consumption/usage-details/list#billingaccountusagedetailslist-legacy)

Please find a mapping between the old and new fields below. New properties are available in the CSV files produced by Exports and the Generate Detailed Cost Report API. To learn more about the fields in these solutions, please see Understand usage details fields \&lt;need link\&gt;.

| **Old Property** | **New Property** |
| --- | --- |
| accountName | AccountName |
| | AccountOwnerId |
| additionalInfo | AdditionalInfo |
| | AvailabilityZone |
| billingAccountId | BillingAccountId |
| billingAccountName | BillingAccountName |
| billingCurrency | BillingCurrencyCode |
| billingPeriodEndDate | BillingPeriodEndDate |
| billingPeriodStartDate | BillingPeriodStartDate |
| billingProfileId | BillingProfileId |
| billingProfileName | BillingProfileName |
| chargeType | ChargeType |
| consumedService | ConsumedService |
| cost | CostInBillingCurrency |
| costCenter | CostCenter |
| date | Date |
| effectivePrice | EffectivePrice |
| frequency | Frequency |
| invoiceSection | InvoiceSectionName |
| | InvoiceSectionId |
| isAzureCreditEligible | IsAzureCreditEligible |
| meterCategory | MeterCategory |
| meterId | MeterId |
| meterName | MeterName |
| | MeterRegion |
| meterSubCategory | MeterSubCategory |
| offerId | OfferId |
| partNumber | PartNumber |
| | PayGPrice |
| | PlanName |
| | PricingModel |
| product | ProductName |
| | ProductOrderId |
| | ProductOrderName |
| | PublisherName |
| | PublisherType |
| quantity | Quantity |
| | ReservationId |
| | ReservationName |
| resourceGroup | ResourceGroup |
| resourceId | ResourceId |
| resourceLocation | ResourceLocation |
| resourceName | ResourceName |
| serviceFamily | ServiceFamily |
| | ServiceInfo1 |
| | ServiceInfo2 |
| subscriptionId | SubscriptionId |
| subscriptionName | SubscriptionName |
| | Tags |
| | Term |
| unitOfMeasure | UnitOfMeasure |
| unitPrice | UnitPrice |
|
 | CostAllocationRuleName |

## Microsoft Customer Agreement field mapping

Microsoft Customer Agreement customers who are using the Consumption Usage Details API have usage details records of the kind &quot;modern&quot;. A modern usage details record is identified using the highlighted field below. All Microsoft Customer Agreement customers have records of this kind due to the underlying billing system that is used for these customers.

{

&quot;value&quot;: [

{

&quot;id&quot;: &quot;{id}&quot;,

&quot;name&quot;: &quot;{name}&quot;,

&quot;type&quot;: &quot;Microsoft.Consumption/usageDetails&quot;,

&quot;kind&quot;: &quot;modern&quot;,

&quot;tags&quot;: {

&quot;env&quot;: &quot;newcrp&quot;,

&quot;dev&quot;: &quot;tools&quot;

},

&quot;properties&quot;: {

…...

}

}

An full example legacy Usage Details record can be found here: [Usage Details - List - REST API (Azure Consumption) | Microsoft Docs](https://docs.microsoft.com/en-us/rest/api/consumption/usage-details/list#billingaccountusagedetailslist-modern)

Please find a mapping between the old and new fields below. New properties are available in the CSV files produced by Exports and the Generate Detailed Cost Report API. Fields that will need a mapping due to differences across the solutions have been made **bold**.

To learn more about the fields in these solutions, please see Understand usage details fields \&lt;need link\&gt;.

| **Old property** | **New property** |
| --- | --- |
| invoiceId | invoiceId |
| previousInvoiceId | previousInvoiceId |
| billingAccountId | billingAccountId |
| billingAccountName | billingAccountName |
| billingProfileId | billingProfileId |
| billingProfileName | billingProfileName |
| invoiceSectionId | invoiceSectionId |
| invoiceSectionName | invoiceSectionName |
| partnerTenantId | partnerTenantId |
| partnerName | partnerName |
| resellerName | resellerName |
| resellerMpnId | resellerMpnId |
| customerTenantId | customerTenantId |
| customerName | customerName |
| costCenter | costCenter |
| billingPeriodEndDate | billingPeriodEndDate |
| billingPeriodStartDate | billingPeriodStartDate |
| servicePeriodEndDate | servicePeriodEndDate |
| servicePeriodStartDate | servicePeriodStartDate |
| date | date |
| | serviceFamily |
| productOrderId | productOrderId |
| productOrderName | productOrderName |
| consumedService | consumedService |
| meterId | meterId |
| | meterName |
| | meterCategory |
| | meterSubCategory |
| | meterRegion |
| **productIdentifier** | **ProductId** |
| **product** | **ProductName** |
| **subscriptionGuid** | **SubscriptionId** |
| subscriptionName | subscriptionName |
| publisherType | publisherType |
| publisherId | publisherId |
| publisherName | publisherName |
| **resourceGroup** | **resourceGroupName** |
| instanceName | ResourceId |
| **resourceLocationNormalized** |
 |
| **resourceLocation** | **location** |
| | effectivePrice |
| quantity | quantity |
| | unitOfMeasure |
| chargeType | chargeType |
| **billingCurrencyCode** | **billingCurrency** |
| **pricingCurrencyCode** | **pricingCurrency** |
| costInBillingCurrency | costInBillingCurrency |
| costInPricingCurrency | costInPricingCurrency |
| costInUsd | costInUsd |
| paygCostInBillingCurrency | paygCostInBillingCurrency |
| paygCostInUSD | paygCostInUsd |
| exchangeRatePricingToBilling | exchangeRatePricingToBilling |
| exchangeRateDate | exchangeRateDate |
| isAzureCreditEligible | isAzureCreditEligible |
| serviceInfo1 | serviceInfo1 |
| serviceInfo2 | serviceInfo2 |
| additionalInfo | additionalInfo |
| | tags |
| partnerEarnedCreditRate | partnerEarnedCreditRate |
| partnerEarnedCreditApplied | partnerEarnedCreditApplied |
| **marketPrice** | **PayGPrice** |
| frequency | frequency |
| term | term |
| reservationId | reservationId |
| reservationName | reservationName |
| | pricingModel |
| unitPrice | |
| exchangeRate |
 |