---
title: Understand Cost Management data
titleSuffix: Microsoft Cost Management
description: This article helps you better understand data included in Cost Management. It also explains how frequently data is processed, collected, shown, and closed.
author: bandersmsft
ms.author: banders
ms.date: 02/16/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: micflan
---

# Understand Cost Management data

This article helps you better understand Azure cost and usage data included in Cost Management. It explains how frequently data is processed, collected, shown, and closed. You're billed for Azure usage monthly. Although billing cycles are monthly periods, cycle start and end dates vary by subscription type. How often Cost Management receives usage data varies based on different factors. Such factors include how long it takes to process the data and how frequently Azure services emit usage to the billing system.

Cost Management includes all usage and purchases, including reservations and third-party offerings for Enterprise Agreement (EA) accounts. Microsoft Customer Agreement accounts and individual subscriptions with pay-as-you-go rates  only include usage from Azure and Marketplace services. Support and other costs aren't included. Costs are estimated until an invoice is generated and don't factor in credits. Cost Management also includes costs associated with New Commerce products like Microsoft 365 and Dynamics 365 that are invoiced along with Azure. Currently, only Partners can purchase New Commerce non-Azure products.

If you have a new subscription, you can't immediately use Cost Management features. It might take up to 48 hours before you can use all Cost Management features.

## Supported Microsoft Azure offers

The following information shows the currently supported [Microsoft Azure offers](https://azure.microsoft.com/support/legal/offer-details/) in Cost Management. An Azure offer is the type of the Azure subscription that you have. Data is available in Cost Management starting on the **Data available from** date. Summarized data in cost analysis is only available for the last 13 months. If a subscription changes offers, costs before the offer change date aren't available.

| **Category**  | **Offer name** | **Quota ID** | **Offer number** | **Data available from** |
| --- | --- | --- | --- | --- |
| **Azure Government** | Azure Government Enterprise    | EnterpriseAgreement_2014-09-01 | MS-AZR-USGOV-0017P | May 2014 |
| **Azure Government** | Azure Government pay-as-you-go | Pay-as-you-go_2014-09-01 | MS-AZR-USGOV-0003P | October 2, 2018 |
| **Enterprise Agreement (EA)** | Enterprise Dev/Test        | MSDNDevTest_2014-09-01 | MS-AZR-0148P | May 2014 |
| **Enterprise Agreement (EA)** | Microsoft Azure Enterprise | EnterpriseAgreement_2014-09-01 | MS-AZR-0017P | May 2014 |
| **Microsoft Customer Agreement** | Microsoft Azure Plan | EnterpriseAgreement_2014-09-01 | N/A | March 2019¹ |
| **Microsoft Customer Agreement** | Microsoft Azure Plan for Dev/Test | MSDNDevTest_2014-09-01 | N/A | March 2019¹ |
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

The following offers aren't supported yet:

| **Category**  | **Offer name** | **Quota ID** | **Offer number** |
| --- | --- | --- | --- |
| **Azure Germany** | Azure Germany pay-as-you-go | Pay-as-you-go_2014-09-01 | MS-AZR-DE-0003P |
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

### Determine your offer type

If you're unable to view data for a particular subscription, you can verify whether this subscription is included in the list of supported offers. To validate an Azure subscription is supported, sign in to the Azure portal. Then select **All Services** in the left menu pane. In the list of services, select **Subscriptions**. In the subscription list menu, select the subscription that you want to verify. Your subscription is shown on the Overview tab and you can see the **Offer** and **Offer ID**. The following image shows an example.

:::image type="content" border="true" source="./media/understand-cost-mgt-data/offer-and-offer-id.png" alt-text="Screenshot showing the Subscription Overview tab with Offer and Offer ID.":::

## Costs included in Cost Management

The following table shows included and not included data in Cost Management. All costs are estimated until an invoice is generated. Costs shown don't include free and prepaid credits.

| **Included** | **Not included** |
| --- | --- |
| Azure service usage (including deleted resources)⁴ | Unbilled services (for example, free tier resources) |
| Marketplace offering usage⁵ | Support charges - For more information, see [Invoice terms explained](../understand/understand-invoice.md). |
| Marketplace purchases⁵      | Taxes - For more information, see [Invoice terms explained](../understand/understand-invoice.md). |
| Reservation purchases⁶      | Credits - For more information, see [Invoice terms explained](../understand/understand-invoice.md). |
| Amortization of reservation purchases⁶      |  |
| New Commerce non-Azure products (Microsoft 365 and Dynamics 365) ⁷ | |

_⁴ Azure service usage is based on reservation and negotiated prices._

_⁵ Marketplace purchases aren't available for MSDN and Visual Studio offers at this time._

_⁶ Reservation purchases are only available for Enterprise Agreement (EA) and Microsoft Customer Agreement accounts at this time._

_⁷ Only available for specific offers._

Cost Management data only includes the usage and purchases from services and resources that are actively running. The cost data you see is based on past records. It includes resources, resource groups, and subscriptions that might be stopped, deleted, or canceled. So, it might not match with the current resources, resource groups, and subscriptions you see in tools like Azure Resource Manager or Azure Resource Graph. They only display currently deployed resources in your subscriptions. Not all resources emit usage and therefore might not be represented in the cost data. Similarly, Azure Resource Manager doesn't track some resources so they might not be represented in subscription resources. 

## How tags are used in cost and usage data

Cost Management receives tags as part of each usage record submitted by the individual services. The following constraints apply to these tags:

- Tags must be applied directly to resources and aren't implicitly inherited from the parent resource group.
- Resource tags are only supported for resources deployed to resource groups.
- Some deployed resources might not support tags or might not include tags in usage data.
- Resource tags are only included in usage data while the tag is applied – tags aren't applied to historical data.
- Resource tags are only available in Cost Management after the data is refreshed.
- Resource tags are only available in Cost Management when the resource is active/running and producing usage records. For example, when a virtual machine (VM) is deallocated.
- Managing tags requires contributor access to each resource or the [tag contributor](../../role-based-access-control/built-in-roles.md#tag-contributor) Azure role-based-access-control (RBAC) role.
- Managing tag policies requires either owner or policy contributor access to a management group, subscription, or resource group.
    
If you don't see a specific tag in Cost Management, consider the following questions:

- Was the tag applied directly to the resource?
- Was the tag applied more than 24 hours ago?
- Does the resource type support tags? Some resource types don't support tags in usage data. See [Tags support for Azure resources](../../azure-resource-manager/management/tag-support.md) for the full list of what is supported.
    
Here are a few tips for working with tags:

- Plan ahead and define a tagging strategy that allows you to break down costs by organization, application, environment, and so on.
- [Group and allocate costs using tag inheritance](enable-tag-inheritance.md) to apply resource group and subscription tags to child resource usage records. If you're using Azure policy to enforce tagging for cost reporting, consider enabling the tag inheritance setting for easier management and more flexibility.
- Use the Tags API with either Query or UsageDetails to get all cost based on the current tags.

## Cost and usage data updates and retention

Cost and usage data is typically available in Cost Management within 8-24 hours. Keep the following points in mind as you review costs:

- Each Azure service (such as Storage, Compute, and SQL) emits usage at different intervals – You might see data for some services sooner than others.
- Estimated charges for the current billing period are updated six times per day.
- Estimated charges for the current billing period can change as you incur more usage.
- Each update is cumulative and includes all the line items and information from the previous update.
- Azure finalizes or _closes_ the current billing period up to 72 hours (three calendar days) after the billing period ends.
- During the open month (uninvoiced) period, cost management data should be considered an estimate only. In some cases, charges might be latent in arriving to the system after the usage actually occurred.

The following examples illustrate how billing periods could end:

* Enterprise Agreement (EA) subscriptions – If the billing month ends on March 31, estimated charges are updated up to 72 hours later. In this example, by midnight (UTC) April 4. There are uncommon circumstances where it might take longer than 72 hours to finalize a billing period.
* Pay-as-you-go subscriptions – If the billing month ends on May 15, then the estimated charges might get updated up to 72 hours later. In this example, by midnight (UTC) May 19.

Usage charges can continue to accrue and can change until the fifth day of the month after your current billing period ends, as Azure completes processing all data. If the usage file isn't ready, you see a message on the Invoices page in the Azure portal stating `Your usage and charges file is not ready`. After the usage file is available, you can download it.

When cost and usage data becomes available in Cost Management, it gets retained for at least seven years. Only the last 13 months are available from the Azure portal under Cost Management portal under [Exports](tutorial-export-acm-data.md). It's also available in the [Cost Details API](../automate/usage-details-best-practices.md#cost-details-api). To retrieve historical data that is older than 13 months, use the [Exports REST API](/rest/api/cost-management/exports).

### Rerated data

Whether you use the Cost Management APIs, Power BI, or the Azure portal to retrieve data, expect the current billing period's charges to get rerated. Charges might change until the invoice is closed.

## Cost rounding

Costs shown in Cost Management are rounded. Costs returned by the Query API aren't rounded. For example:

- Cost analysis in the portal - Charges are rounded using standard rounding rules: values more than 0.5 and higher are rounded up, otherwise costs are rounded down. Rounding occurs only when values are shown. Rounding doesn't happen during data processing and aggregation. For example, cost analysis aggregates costs as follows:
  -    Charge 1: $0.004
  - Charge 2: $0.004
  -    Aggregate charge rendered: 0.004 + 0.004 = 0.008. The charge shown is $0.01.
- Query API - Charges are shown at eight decimal places and rounding doesn't occur.

## Historical data might not match invoice

Historical data for credit-based and pay-in-advance offers might not match your invoice. Some Azure pay-as-you-go, MSDN, and Visual Studio offers can have Azure credits and advanced payments applied to the invoice. The historical data shown in Cost Management is based on your estimated consumption charges only. Cost Management historical data doesn't include payments and credits. Historical data shown for the following offers might not match exactly with your invoice.

- Azure for Students (MS-AZR-0170P)
- Azure in Open (MS-AZR-0111P)
- Azure Pass (MS-AZR-0120P, MS-AZR-0123P, MS-AZR-0125P, MS-AZR-0128P, MS-AZR-0129P)
- Free Trial (MS-AZR-0044P)
- MSDN (MS-AZR-0062P)
- Visual Studio (MS-AZR-0029P, MS-AZR-0059P, MS-AZR-0060P, MS-AZR-0063P)

## Next steps

- If you didn't complete the first quickstart for Cost Management, read it at [Start analyzing costs](./quick-acm-cost-analysis.md).
