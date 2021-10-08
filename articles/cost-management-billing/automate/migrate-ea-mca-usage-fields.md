# Migrate from EA to MCA usage fields

If you were an EA customer, you&#39;ll notice that the terms in the Azure billing profile usage CSV file differ from the terms in the Azure EA usage CSV file. Please find a mapping below of EA usage terms to billing profile usage terms.

## **Changes from Azure EA usage and charges**

CHANGES FROM AZURE EA USAGE AND CHARGES

| **Old property** | **New property** | **Notes** |
| --- | --- | --- |
| AccountId | N/A | The subscription creator isn&#39;t tracked. Use invoiceSectionId (same as departmentId). |
| AccountNameAccountOwnerId and AccountOwnerEmail | N/A | The subscription creator isn&#39;t tracked. Use invoiceSectionName (same as departmentName). |
| AdditionalInfo | additionalInfo | |
| ChargesBilledSeparately | isAzureCreditEligible | Note that these properties are opposites. If isAzureCreditEnabled is true, ChargesBilledSeparately would be false. |
| ConsumedQuantity | quantity | |
| ConsumedService | consumedService | Exact string values might differ. |
| ConsumedServiceId | None | |
| CostCenter | costCenter | |
| Date and usageStartDate | date | |
| Day | None | Parses day from date. |
| DepartmentId | invoiceSectionId | Exact values differ. |
| DepartmentName | invoiceSectionName | Exact string values might differ. Configure invoice sections to match departments, if needed. |
| ExtendedCost and Cost | costInBillingCurrency | |
| InstanceId | resourceId | |
| Is Recurring Charge | None | |
| Location | location | |
| MeterCategory | meterCategory | Exact string values might differ. |
| MeterId | meterId | Exact string values differ. |
| MeterName | meterName | Exact string values might differ. |
| MeterRegion | meterRegion | Exact string values might differ. |
| MeterSubCategory | meterSubCategory | Exact string values might differ. |
| Month | None | Parses month from date. |
| Offer Name | None | Use publisherName and productOrderName. |
| OfferID | None | |
| Order Number | None | |
| PartNumber | None | Use meterId and productOrderName to uniquely identify prices. |
| Plan Name | productOrderName | |
| Product | Product | |
| ProductId | productId | Exact string values differ. |
| Publisher Name | publisherName | |
| ResourceGroup | resourceGroupName | |
| ResourceGuid | meterId | Exact string values differ. |
| ResourceLocation | resourceLocation | |
| ResourceLocationId | None | |
| ResourceRate | effectivePrice | |
| ServiceAdministratorId | N/A | |
| ServiceInfo1 | serviceInfo1 | |
| ServiceInfo2 | serviceInfo2 | |
| ServiceName | meterCategory | Exact string values might differ. |
| ServiceTier | meterSubCategory | Exact string values might differ. |
| StoreServiceIdentifier | N/A | |
| SubscriptionGuid | subscriptionId | |
| SubscriptionId | subscriptionId | |
| SubscriptionName | subscriptionName | |
| Tags | tags | The tags property applies to root object, not to the nested properties property. |
| UnitOfMeasure | unitOfMeasure | Exact string values differ. |
| usageEndDate | date | |
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