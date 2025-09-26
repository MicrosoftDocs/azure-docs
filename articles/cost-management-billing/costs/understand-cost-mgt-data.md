---
title: Understand Cost Management data
titleSuffix: Microsoft Cost Management
description: This article helps you better understand data included in Cost Management. It also explains how frequently data is processed, collected, shown, and closed.
author: vikramdesai01
ms.author: vikdesai
ms.date: 06/27/2025
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: vikdesai
---

# Understand Cost Management data

This article helps you better understand Azure cost and usage data included in Cost Management. It explains how frequently data is processed, collected, shown, and closed. Billing cycles are typically monthly periods, however, the cycle start and end dates vary by subscription type. How often Cost Management receives usage data varies based on different factors. Such factors include how long it takes to process the data and how frequently Azure services emit usage to the billing system.

Cost Management includes all usage and purchases, including commitment discounts (that is, reservations and savings plans) and third-party offerings, for Enterprise Agreement (EA) and Microsoft Customer Agreement (MCA) accounts. Microsoft Online Services Agreement (MOSA) accounts only include usage from Azure and Marketplace services with applicable commitment discounts applied but don't include Marketplace or commitment discounts purchases. Support and other costs aren't included. Costs are estimated until an invoice is generated and don't factor in credits. Cost Management also includes costs associated with New Commerce products like Microsoft 365 and Dynamics 365 that are invoiced along with Azure.

If you have a new subscription, you can't immediately use Cost Management features. It might take up to 48 hours before you can use all the Cost Management features. However, at subscription creation time you can immediately configure a budget to track your costs and alert you of any unexpected spikes.

## Supported Microsoft Azure offers

The following information shows the currently supported [Microsoft Azure offers](https://azure.microsoft.com/support/legal/offer-details/) in Cost Management. An Azure offer is the type of Azure subscription that you have. Data is available in Cost Management starting on the **Data available from** date. Summarized data in Cost Analysis is only available for the last 13 months. If a subscription changes offers, costs before the offer change date aren't available.

| **Category**  | **Offer name** | **Quota ID** | **Offer number** | **Data available from** |
| --- | --- | --- | --- | --- |
| **Azure Government** | Azure Government Enterprise    | EnterpriseAgreement_2014-09-01 | MS-AZR-USGOV-0017P | May 2014 |
| **Azure Government** | Azure Government pay-as-you-go | Pay-as-you-go_2014-09-01 | MS-AZR-USGOV-0003P | October 2, 2018 |
| **Enterprise Agreement (EA)** | Enterprise Dev/Test        | MSDNDevTest_2014-09-01 | MS-AZR-0148P | May 2014 |
| **Enterprise Agreement (EA)** | Microsoft Azure Enterprise | EnterpriseAgreement_2014-09-01 | MS-AZR-0017P | May 2014 |
| **Microsoft Customer Agreement** | Microsoft Azure Plan | EnterpriseAgreement_2014-09-01 | MS-AZR-0017G | March 2019¹ |
| **Microsoft Customer Agreement** | Microsoft Azure Plan for Dev/Test | MSDNDevTest_2014-09-01 | MS-AZR-0148G | March 2019¹ |
| **Microsoft Customer Agreement supported by partners** | Microsoft Azure Plan | CSP_2015-05-01, CSP_MG_2017-12-01, and CSPDEVTEST_2018-05-01³ | N/A | October 2019 |
| **Microsoft Developer Network (MSDN)** | MSDN Platforms² | MSDN_2014-09-01 | MS-AZR-0062P | October 2, 2018 |
| **Pay-as-you-go** | Pay-as-you-go                  | Pay-as-you-go_2014-09-01 | MS-AZR-0003P | October 2, 2018 |
| **Pay-as-you-go** | Pay-as-you-go Dev/Test         | MSDNDevTest_2014-09-01 | MS-AZR-0023P | October 2, 2018 |
| **Pay-as-you-go** | Microsoft Cloud Partner Program (MPN)      | MPN_2014-09-01 | MS-AZR-0025P | October 2, 2018 |
| **Pay-as-you-go** | Free Trial²         | FreeTrial_2014-09-01 | MS-AZR-0044P | October 2, 2018 |
| **Pay-as-you-go** | Azure in Open²      | AzureInOpen_2014-09-01 | MS-AZR-0111P | October 2, 2018 |
| **Pay-as-you-go** | Azure Pass²         | AzurePass_2014-09-01 | MS-AZR-0120P, MS-AZR-0122P - MS-AZR-0125P, MS-AZR-0128P - MS-AZR-0130P | October 2, 2018 |
| **Visual Studio** | Visual Studio Enterprise – MPN²     | MPN_2014-09-01 | MS-AZR-0029P | October 2, 2018 |
| **Visual Studio** | Visual Studio Professional²         | MSDN_2014-09-01 | MS-AZR-0059P | October 2, 2018 |
| **Visual Studio** | Visual Studio Test Professional²    | MSDNDevTest_2014-09-01 | MS-AZR-0060P | October 2, 2018 |
| **Visual Studio** | Visual Studio Enterprise²           | MSDN_2014-09-01 | MS-AZR-0063P | October 2, 2018 |


_¹ Microsoft Customer Agreements started in March 2019 and don't have any historical data before this point._

_² Historical data for credit-based and pay-in-advance subscriptions might not match your invoice. See the following [Historical data might not match invoice](#historical-data-might-not-match-invoice) section._

_³ Quota IDs are the same across Microsoft Customer Agreement and classic subscription offers. Classic Cloud Solution Provider (CSP) subscriptions aren't supported._

The following offers aren't supported:

| **Category**  | **Offer name** | **Quota ID** | **Offer number** |
| --- | --- | --- | --- |
| **Enterprise Agreement (EA)** | EA Azure Sponsorship |  | MS-AZR-0136P  |
| **Cloud Solution Provider (CSP)** | Microsoft Azure                                    | CSP_2015-05-01 | MS-AZR-0145P |
| **Cloud Solution Provider (CSP)** | Azure Government CSP                               | CSP_2015-05-01 | MS-AZR-USGOV-0145P |
| **Cloud Solution Provider (CSP)** | Azure Germany in CSP for Microsoft Cloud Germany   | CSP_2015-05-01 | MS-AZR-DE-0145P |
| **Pay-as-you-go** | Azure for Students Starter | DreamSpark_2015-02-01 | MS-AZR-0144P |
| **Pay-as-you-go** | Azure for Students² | AzureForStudents_2018-01-01 | MS-AZR-0170P |
| **Pay-as-you-go** | Microsoft Azure Sponsorship | Sponsored_2016-01-01 | MS-AZR-0036P |
| **Support Plans** | Standard support                    | Default_2014-09-01 | MS-AZR-0041P |
| **Support Plans** | Professional Direct support         | Default_2014-09-01 | MS-AZR-0042P |
| **Support Plans** | Developer support                   | Default_2014-09-01 | MS-AZR-0043P |
| **Support Plans** | Germany support plan                | Default_2014-09-01 | MS-AZR-DE-0043P |
| **Support Plans** | Azure Government Standard Support   | Default_2014-09-01 | MS-AZR-USGOV-0041P |
| **Support Plans** | Azure Government Pro-Direct Support | Default_2014-09-01 | MS-AZR-USGOV-0042P |
| **Support Plans** | Azure Government Developer Support  | Default_2014-09-01 | MS-AZR-USGOV-0043P |

### Free trial to pay-as-you-go upgrade

For information about the availability of free tier services after you upgrade to pay-as-you-go pricing from a Free trial, see the [Azure free account FAQ](https://azure.microsoft.com/free/free-account-faq/).

### View billing account

Your billing account type, and the subscriptions created under it, are based on your Azure offer. If you want to view the properties of your billing account, including its offer ID information, see [Check the type of your account](../manage/view-all-accounts.md#check-the-type-of-your-account).

## Costs included in Cost Management

The following table shows included and not included data in Cost Management. Costs shown don't include free and prepaid credits.

All included costs are estimated until an invoice is generated. Estimated costs shown in Cost Management during the open month, before invoice generation, don't consider tiered pricing plans. The cost estimates calculated during this time are based on the highest tier for a product. After an invoice is issued, charges in Cost Management are updated and they should match the invoice.

| **Included** | **Not included** |
| --- | --- |
| Azure service usage (including deleted resources)⁴ | Unbilled services (for example, free tier resources) |
| Marketplace offering usage⁵ | Support charges - For more information, see [Invoice terms explained](../understand/understand-invoice.md). |
| Marketplace purchases⁵      | Taxes - For more information, see [Invoice terms explained](../understand/understand-invoice.md). |
| Commitment discount purchases⁶      | Credits - For more information, see [Invoice terms explained](../understand/understand-invoice.md). |
| Amortization of commitment discount purchases⁶      |  |
| New Commerce non-Azure products (Microsoft 365 and Dynamics 365) ⁷ | |

_⁴ Azure service usage is based on commitment discounts and negotiated prices._

_⁵ Marketplace purchases aren't currently available for MSDN and Visual Studio offers._

_⁶ Commitment discount purchases are currently only available for Enterprise Agreement (EA) and Microsoft Customer Agreement accounts._

_⁷ Only available for specific offers._

Cost Management data only includes the usage and purchases from services and resources that are actively running. The cost data you see is based on past records. It includes resources, resource groups, and subscriptions that might be stopped, deleted, or canceled. So, it might not match with the current resources, resource groups, and subscriptions you see in tools like Azure Resource Manager or Azure Resource Graph, as they only display currently deployed resources in your subscriptions. Not all resources emit usage and therefore might not be represented in the cost data. Similarly, Azure Resource Manager doesn't track some resources so they might not be represented in subscription resources. 

## How tags are used in cost and usage data

Cost Management receives tags as part of each usage record submitted by the individual services. The following constraints apply to these tags:

- Tags must be applied directly to resources and aren't implicitly inherited from the parent resource group.
- Resource tags are only supported for the resources deployed to resource groups.
- Some deployed resources might not support tags or might not include tags in usage data.
- Resource tags are only included in usage data while the tag is applied to the resource – tags aren't applied to historical data or to future data, after the tag is removed.
- Resource tags are only available in Cost Management after the data is refreshed.
- Resource tags are only available in Cost Management when the resource is active/running and producing usage records.
- Managing tags requires contributor access to each resource or the [tag contributor](../../role-based-access-control/built-in-roles.md#tag-contributor) Azure role-based-access-control (RBAC) role.
- Managing tag policies requires either owner or policy contributor access to a management group, subscription, or resource group.
- Records for purchases completed in the Marketplace Azure store will also include tags for MCA customers.
    
If you don't see a specific tag in Cost Management, consider the following questions:

- Was the tag applied directly to the resource?
- Was the tag applied more than 24 hours ago?
- Does the resource type support tags? Some resource types don't support tags in usage data. See [Tags support for Azure resources](../../azure-resource-manager/management/tag-support.md) for the full list of what is supported.
    
Here are a few tips for working with tags:

- Plan ahead and define a tagging strategy that allows you to break down costs by organization, application, environment, and so on.
- [Group and allocate costs using tag inheritance](enable-tag-inheritance.md). This will enable you to apply resource group and subscription tags to child resource usage records. If you're using Azure policy to enforce tagging for cost reporting, consider enabling the tag inheritance setting for easier management and more flexibility.
- Use the Tags API with either Query or Cost and Usage Details APIs to get all cost based on the current tags.

## Cost and usage data updates and retention

For EA and MCA subscriptions, cost and usage data is typically available in Cost Management within 8-24 hours. For pay-as-you-go subscriptions, it could take up to 72 hours for cost and usage data to become available.

Keep the following points in mind as you review costs:

- Each Azure service (such as Storage, Compute, and SQL) emits usage at different intervals – You might see data for some services sooner than others.
- Estimated charges for the current billing period are updated six times per day.
- Estimated charges for the current billing period can change as you incur more usage.
- Each update is cumulative and includes all the line items and information from the previous update.
- Azure finalizes or _closes_ the current billing period typically up to 72 hours (three calendar days) after the billing period ends.
- During the open month (uninvoiced) period, Cost Management data should be considered as estimated only. In some cases, charges might appear with some delay in Cost Management, after the usage occurred.

The following examples demonstrate how different end dates of a billing period might affect data availability:

* Enterprise Agreement (EA) subscriptions – If the billing month ends on March 31, estimated charges are updated up to 72 hours later. In this example, by midnight (UTC) April 4. There are uncommon circumstances where it might take longer than 72 hours to finalize a billing period.
* Pay-as-you-go subscriptions – If the billing month ends on May 15, then the estimated charges might get updated up to 72 hours later. In this example, by midnight (UTC) May 19.

Usage charges can continue to accrue and can change until the fifth day after your current billing period ends, as Azure completes processing all data. Charges on invoice should be considered as final when invoice is issued. If your invoice was issued but the usage file isn't ready, you will see a message on the Invoices page in the Azure portal stating `Your usage and charges file is not ready`. Check back after the suggested time. After the usage file is available, it will become available for you to download. 

When cost and usage data becomes available in Cost Management, it gets retained for at least seven years. Cost Management experiences in the Azure portal provide data for the last 13 months. This includes Cost Analysis, [Exports](tutorial-improved-exports.md) and the [Cost Details API](../automate/usage-details-best-practices.md#cost-details-api). To retrieve historical data that is older than 13 months, use the [Exports REST API](/rest/api/cost-management/exports).

### Rerated data

Whether you use the Cost Management APIs, Power BI, or the Azure portal to retrieve data, take into consideration that the current billing period's charges might get rerated. Charges might change until the invoice is closed. 

## Cost rounding

Costs shown in Cost Management are rounded. Rounding varies by experience. Costs in Cost analysis in the portal are rounded, while costs returned by the Query API and those shown in your cost and usage data files aren't rounded. For example:

- Cost Analysis in the portal - Charges are rounded using standard rounding rules: values more than 0.5 and higher are rounded up, otherwise costs are rounded down. Rounding occurs only when values are shown. Rounding doesn't happen during data processing and aggregation. For example, Cost Analysis aggregates costs as follows:
  - Charge 1: $0.004
  - Charge 2: $0.004
  - Aggregate charge rendered: 0.004 + 0.004 = 0.008. The charge shown is $0.01.
- Query API - Charges are shown at eight decimal places and rounding doesn't occur.
- Cost and usage data files - Rounding doesn't occur.

### Cost rounding for Azure Commitment discount

Currency rounding for Azure Commitment discount (ACD) takes place on the unit rate aspect of the effective rate. Currency rounding depends on currency *precision* (or "minimal accountable currency unit" or "minor units"). For most world currencies, the precision is 1/100. It corresponds to two digits after the decimal point.

For example, assume a discount recieved as part of your ACD is 12.5%:

- After a 0.125 discount on a $0.09 market price, it equals 0.07875. When rounded, it’s a $0.08 unit rate.
- After a 0.125 discount on a 0.6 market price, it equals 0.525. When rounded, it’s a $0.53 unit rate.
- The total cost equals the billable quantity, multiplied by the rounded unit rate.

Charges are rounded using standard rounding rules: values of 0.5 and higher are rounded up, otherwise costs are rounded down.

The *effective price* can be specified for an Azure meter per one hour, while a billable unit might be 10 hours. In such cases, currency rounding happens on unit price and effective price per hour is scaled down 10 times the value.

For example, an unrounded single unit price after a 0.125 discount is applied to a per-hour price of 0.018 resulting in 0.01575000000. The billable QuantityPerUnit for the meter is 10 (hours), so Azure rounds to cents. The calculation is 10 * 0.01575 = 0.1575 and then gets rounded to $0.16. The *Quantity Per Unit* is rounded for your currency. In this example, it’s $0.16 per 10 hours. Because the EffectivePrice is per one hour, the currency-rounded unit price of 10 hours gets scaled down 10 times. Then, the Effective price per once per hour is computed and it has three digits after the decimal point. That results in $0.16 / 10 equaling $0.016.

Your usage and charges file shows all of the data involved in rounding. You can download the file from the Azure portal. For more information, see [Download usage and charges data](../understand/download-azure-daily-usage.md).

## Historical data might not match invoice

Historical data for credit-based and pay-in-advance offers might not match your invoice. Some Azure pay-as-you-go, MSDN, and Visual Studio offers can have Azure credits and advanced payments applied to the invoice. The historical data (closed month data) shown in Cost Management is based on your estimated consumption charges only. For the following listed offers, Cost Management historical data doesn't include payments and credits. Additionally, price changes might affect it. *The price shown on your invoice might differ from the price used for cost estimation.*

For example, you get invoiced on January 5 for a service consumed in the month of December. It has a price of $86 per unit. On January 1, the unit price changed to $100. When you look at your estimated charges in Cost Management, you see that your cost is the result of your consumed quantity * $100 (not $86, as shown in your  invoice).

>[!NOTE]
>The price change might result in a price decrease, not only an increase, as explained in this example.

Historical data shown for the following offers might not match exactly with your invoice.

- Azure for Students (MS-AZR-0170P)
- Azure in Open (MS-AZR-0111P)
- Azure Pass (MS-AZR-0120P, MS-AZR-0123P, MS-AZR-0125P, MS-AZR-0128P, MS-AZR-0129P)
- Free Trial (MS-AZR-0044P)
- MSDN (MS-AZR-0062P)
- Visual Studio (MS-AZR-0029P, MS-AZR-0059P, MS-AZR-0060P, MS-AZR-0063P)

## Related content

- If you didn't complete the first quickstart for Cost Management, read it at [Start analyzing costs](./quick-acm-cost-analysis.md).
