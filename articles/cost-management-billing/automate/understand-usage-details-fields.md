# Understand usage details fields

This document outlines the usage details fields available to you when using [Azure Portal download](https://docs.microsoft.com/en-us/azure/cost-management-billing/understand/download-azure-daily-usage), [Exports](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data?tabs=azure-portal) or the Generate Detailed Cost Report API \&lt;link needed\&gt;. These are our recommended solutions for getting usage details moving forward. To learn more see Usage details best practices \&lt;link needed\&gt;.

**Migration to new usage details formats**

If you are currently using an older usage details solution and want to migrate to Exports or the Generate Detailed Cost Report API \&lt;link needed\&gt;, please see one of our migration documents below.

- Migrate from Enterprise Reporting usage fields \&lt;link needed\&gt;
- Migrate from EA to MCA usage fields \&lt;link needed\&gt;
- Migrate from Consumption Usage Details fields \&lt;link needed\&gt;

## **List of fields and descriptions**

The following table describes the important terms used in the latest version of the Azure usage and charges file. The list covers pay-as-you-go (PAYG), Enterprise Agreement (EA), and Microsoft Customer Agreement (MCA) accounts. To identify what account type you are, please see[supported Microsoft Azure offers](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data#supported-microsoft-azure-offers).

LIST OF TERMS AND DESCRIPTIONS

| **Term** | **Account type** | **Description** |
| --- | --- | --- |
| AccountName | EA, PAYG | Display name of the EA enrollment account or PAYG billing account. |
| AccountOwnerId1 | EA, PAYG | Unique identifier for the EA enrollment account or PAYG billing account. |
| AdditionalInfo | All | Service-specific metadata. For example, an image type for a virtual machine. |
| BillingAccountId1 | All | Unique identifier for the root billing account. |
| BillingAccountName | All | Name of the billing account. |
| BillingCurrency | All | Currency associated with the billing account. |
| BillingPeriod | EA, PAYG | The billing period of the charge. |
| BillingPeriodEndDate | All | The end date of the billing period. |
| BillingPeriodStartDate | All | The start date of the billing period. |
| BillingProfileId1 | All | Unique identifier of the EA enrollment, PAYG subscription, MCA billing profile, or AWS consolidated account. |
| BillingProfileName | All | Name of the EA enrollment, PAYG subscription, MCA billing profile, or AWS consolidated account. |
| ChargeType | All | Indicates whether the charge represents usage ( **Usage** ), a purchase ( **Purchase** ), or a refund ( **Refund** ). |
| ConsumedService | All | Name of the service the charge is associated with. |
| CostCenter1 | EA, MCA | The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts). |
| Cost | EA, PAYG | See CostInBillingCurrency. |
| CostInBillingCurrency | MCA | Cost of the charge in the billing currency before credits or taxes. |
| CostInPricingCurrency | MCA | Cost of the charge in the pricing currency before credits or taxes. |
| Currency | EA, PAYG | See BillingCurrency. |
| Date1 | All | The usage or purchase date of the charge. |
| EffectivePrice | All | Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time. |
| ExchangeRateDate | MCA | Date the exchange rate was established. |
| ExchangeRatePricingToBilling | MCA | Exchange rate used to convert the cost in the pricing currency to the billing currency. |
| Frequency | All | Indicates whether a charge is expected to repeat. Charges can either happen once ( **OneTime** ), repeat on a monthly or yearly basis ( **Recurring** ), or be based on usage ( **UsageBased** ). |
| InvoiceId | PAYG, MCA | The unique document ID listed on the invoice PDF. |
| InvoiceSection | MCA | See InvoiceSectionName. |
| InvoiceSectionId1 | EA, MCA | Unique identifier for the EA department or MCA invoice section. |
| InvoiceSectionName | EA, MCA | Name of the EA department or MCA invoice section. |
| IsAzureCreditEligible | All | Indicates if the charge is eligible to be paid for using Azure credits (Values: True, False). |
| Location | MCA | Datacenter location where the resource is running. |
| MeterCategory | All | Name of the classification category for the meter. For example, _Cloud services_ and _Networking_. |
| MeterId1 | All | The unique identifier for the meter. |
| MeterName | All | The name of the meter. |
| MeterRegion | All | Name of the datacenter location for services priced based on location. See Location. |
| MeterSubCategory | All | Name of the meter subclassification category. |
| OfferId1 | All | Name of the offer purchased. |
| PayGPrice | All | Retail price for the resource. |
| PartNumber1 | EA, PAYG | Identifier used to get specific meter pricing. |
| PlanName | EA, PAYG | Marketplace plan name. |
| PreviousInvoiceId | MCA | Reference to an original invoice if this line item is a refund. |
| PricingCurrency | MCA | Currency used when rating based on negotiated prices. |
| PricingModel | All | Identifier that indicates how the meter is priced. (Values: On Demand, Reservation, Spot) |
| Product | All | Name of the product. |
| ProductId1 | MCA | Unique identifier for the product. |
| ProductOrderId | All | Unique identifier for the product order. |
| ProductOrderName | All | Unique name for the product order. |
| Provider | All | Identifier for product category or Line of Business. Eg. Azure, Microsoft 365, AWS, etc. |
| PublisherName | All | Publisher for Marketplace services. |
| PublisherType | All | Type of publisher (Values: **Azure** , **AWS** , **Marketplace** ). |
| Quantity | All | The number of units purchased or consumed. |
| ReservationId | EA, MCA | Unique identifier for the purchased reservation instance. |
| ReservationName | EA, MCA | Name of the purchased reservation instance. |
| ResourceGroup | All | Name of the [resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview) the resource is in. Not all charges come from resources deployed to resource groups. Charges that do not have a resource group will be shown as null/empty, **Others** , or **Not applicable**. |
| ResourceId1 | All | Unique identifier of the [Azure Resource Manager](https://docs.microsoft.com/en-us/rest/api/resources/resources) resource. |
| ResourceLocation | All | Datacenter location where the resource is running. See Location. |
| ResourceName | EA, PAYG | Name of the resource. Not all charges come from deployed resources. Charges that do not have a resource type will be shown as null/empty, **Others** , or **Not applicable**. |
| ResourceType | MCA | Type of resource instance. Not all charges come from deployed resources. Charges that do not have a resource type will be shown as null/empty, **Others** , or **Not applicable**. |
| ServiceFamily | MCA | Service family that the service belongs to. |
| ServiceInfo1 | All | Service-specific metadata. |
| ServiceInfo2 | All | Legacy field with optional service-specific metadata. |
| ServicePeriodEndDate | MCA | The end date of the rating period that defined and locked pricing for the consumed or purchased service. |
| ServicePeriodStartDate | MCA | The start date of the rating period that defined and locked pricing for the consumed or purchased service. |
| SubscriptionId1 | All | Unique identifier for the Azure subscription. |
| SubscriptionName | All | Name of the Azure subscription. |
| Tags1 | All | Tags assigned to the resource. Doesn&#39;t include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](https://azure.microsoft.com/updates/organize-your-azure-resources-with-tags/). |
| Term | All | Displays the term for the validity of the offer. For example: In case of reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is 1 month (SaaS, Marketplace Support). This is not applicable for Azure consumption. |
| UnitOfMeasure | All | The unit of measure for billing for the service. For example, compute services are billed per hour. |
| UnitPrice | EA, PAYG | The price per unit for the charge. |
| CostAllocationRuleName | EA, MCA | Name of the Cost Allocation rule that is applicable to this record. |

_ **1** _ _Fields used to build a unique ID for a single cost record._

Note some fields may differ in casing and spacing between account types. Older versions of pay-as-you-go usage files have separate sections for the statement and daily usage.

### **List of terms from older APIs**

The following table maps terms used in older APIs to the new terms. Refer to the above table for those descriptions.

LIST OF TERMS FROM OLDER APIS

| **Old term** | **New term** |
| --- | --- |
| ConsumedQuantity | Quantity |
| IncludedQuantity | N/A |
| InstanceId | ResourceId |
| Rate | EffectivePrice |
| Unit | UnitOfMeasure |
| UsageDate | Date |
| UsageEnd | Date |
| UsageStart | Date |

## **Next steps**

- Get an overview of how to ingest usage data \&lt;Link needed\&gt;
- Learn more about usage details best practices \&lt;Link needed\&gt;
- [Create and manage exported data](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data) in the Azure Portal with Exports.
- [Automate Export creation](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/ingest-azure-usage-at-scale) and ingestion at scale using the API.
- Understand usage details fields \&lt;Link needed\&gt;
- Learn how to get small usage datasets on demand \&lt;Link needed\&gt;