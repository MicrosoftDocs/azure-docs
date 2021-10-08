# Migrate from Consumption Marketplaces API

This article discusses migration away from the [Consumption Marketplaces API.](https://docs.microsoft.com/en-us/rest/api/consumption/marketplaces/list) The [Consumption Marketplaces API](https://docs.microsoft.com/en-us/rest/api/consumption/marketplaces/list) is deprecated. The exact date for when this API will be turned off is still to be determined. We recommend migrating to the newer solutions at your earliest convenience.

# Migration destinations

We have merged marketplace and Azure usage records into a single usage details dataset. Please read through usage details best practices \&lt;need link\&gt; prior to choosing which solution is right for your workload. Generally, [Exports](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data?tabs=azure-portal) is recommended if you have ongoing data ingestion needs and/or a large usage details dataset month to month. To learn more, please see Get large usage datasets \&lt;need link\&gt;.

If you have a smaller usage details dataset or a scenario that does not appear to be met by Exports consider using the Generate Detailed Cost Report API \&lt;need link\&gt; instead. To learn more, please see Get small usage datasets on demand \&lt;need link\&gt;.

\*\*Please note that the Generate Detailed Cost Report API \&lt;need link\&gt; is only available for customers with an Enterprise Agreement or Microsoft Customer Agreement. If you are an MSDN, Pay-As-You-Go or Visual Studio customer you can migrate onto Exports or continue using the Consumption Usage Details API at this time.

\&lt;what customers does this migration apply to? Only legacy EA/WD?\&gt;

# Benefits of Migration

Our new solutions provide many benefits over the Consumption Usage Details API. These benefits are summarized below.

- **Single dataset for all usage details:** We have merged Azure and marketplace usage details into one dataset moving forward. This reduces the number of APIs that you need to call to get a full picture of your charges.
- **Scalability:** The Marketplaces API is deprecated because it promotes a call pattern that will not be able to scale as your usage of Azure increases. The usage details dataset can get extremely large as you deploy more resources into the cloud. The Marketplaces API is a paginated synchronous API and as such is not optimized to effectively transfer large volumes of data over the network with high efficiency and reliability. Exports and the Generate Detailed Cost Report API \&lt;need link\&gt; are asynchronous and provide you with a CSV file that can be directly downloaded over the network.
- **API improvements:** Exports and the Generate Detailed Cost Report API are the solutions the Azure Cost Management team is focusing on for the future. All new features built by the team will be integrated into these solutions for you to use moving forward.
- **Schema consistency:** The Generate Details Cost API \&lt;need link\&gt; and [Exports](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data?tabs=azure-portal) provide files with matching fields. This means you can move from one solution to the other based on your scenario.
- **Cost Allocation integration:** Enterprise Agreement and Microsoft Customer Agreement customers using Exports or the Generate Detailed Cost Report API can view charges in relation to the cost allocation rules that they have configured. To learn more about cost allocation, please see [Allocate costs](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/allocate-costs).

# Field differences

The following table summarizes the field mapping needed to transition from the data provided by the Marketplaces API to Exports / Generate Detailed Cost Report API. Please note that both of the new solutions provide a CSV file download as opposed to the paginated JSON response that is provided by the Consumption API.

Usage records can be identified as marketplace records in the combined dataset through the PublisherType field. In addition, there are many new fields in the newer solutions that may also be of use to you. To learn more about the available fields moving forward, please see Understand usage details fields \&lt;need link\&gt;.

| **Old Property** | **New Property** | **Notes** |
| --- | --- | --- |
|
 | PublisherType | Used to identify a marketplace usage record |
| accountName | AccountName |
 |
| additionalProperties | AdditionalInfo | Is this correct? |
| costCenter | CostCenter |
 |
| departmentName | BillingProfileName | Is this correct? |
| billingPeriodId |
 | Use BillingPeriodStartDate / BillingPeriodEndDate |
| usageStart |
 | Use Date |
| usageEnd |
 | Use Date |
| instanceName | ResourceName |
 |
| instanceId | ResourceId |
 |
| currency | BillingCurrencyCode |
 |
| consumedQuantity | Quantity |
 |
| pretaxCost | CostInBillingCurrency |
 |
| isEstimated |
 | Is this available?? |
| meterId | MeterId |
 |
| offerName | OfferId |
 |
| resourceGroup | ResourceGroup |
 |
| orderNumber |
 | Is this available?? |
| publisherName | PublisherName |
 |
| planName | PlanName |
 |
| resourceRate | EffectivePrice |
 |
| subscriptionGuid | SubscriptionId |
 |
| subscriptionName | SubscriptionName |
 |
| unitOfMeasure | UnitOfMeasure |
 |
| isRecurringCharge | ChargeType | Will have info on if the charge is recurring |