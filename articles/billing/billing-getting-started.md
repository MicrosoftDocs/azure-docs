---
title: Prevent unexpected costs, manage billing in Azure | Microsoft Docs
description: Learn how to avoid unexpected charges on your Azure bill. Use cost-tracking and management features for a Microsoft Azure subscription.
services: ''
documentationcenter: ''
author: tonguyen10
manager: tonguyen
editor: ''
tags: billing

ms.assetid: 482191ac-147e-4eb6-9655-c40c13846672
ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/24/2018
ms.author: cwatson
---
# Prevent unexpected charges with Azure billing and cost management

When you sign up for Azure, there are several things you can do to get a better idea of your spend. The [pricing calculator](https://azure.microsoft.com/pricing/calculator/) can provide an estimate of costs before you create an Azure resource. The [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) provides you with the current cost breakdown and forecast for your subscription. If you want to group and understand costs for different projects or teams, look at [resource tagging](../azure-resource-manager/resource-group-using-tags.md). If your organization has a reporting system that you prefer to use, check out the [billing APIs](billing-usage-rate-card-overview.md). 

- If your subscription is an Enterprise Agreement (EA), the public preview for seeing your costs in the Azure portal is available. If your subscription is through Cloud Solution Provider (CSP), or Azure Sponsorship, then some of the following features may not apply to you. See [Additional resources for EA, CSP, and Sponsorship](#other-offers) for more info.

- If your subscription is a Free Trial, [Visual Studio](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/), Azure in Open (AIO), or BizSpark, your subscription is automatically disabled when all your credits are used. Learn about [spending limits](#spending-limit) to avoid having your subscription unexpectantly disabled.

- If you have signed up for [Azure free account](https://azure.microsoft.com/free/), [you can use some of the most popular Azure services for free for 12 months](billing-create-free-services-included-free-account.md). Along with the recommendations listed below, see [Avoid getting charged for free account](billing-avoid-charges-free-account.md).

> [!div class="nextstepaction"]
> [Help improve Azure billing docs](https://go.microsoft.com/fwlink/p/?linkid=2010091) 

## Get estimated costs before adding Azure services

### Estimate cost online using the pricing calculator

Check out the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to get an estimated monthly cost of the service you're interested in. You can add any first party Azure resource to get an estimate cost.

![Screenshot of the pricing calculator menu](./media/billing-getting-started/pricing-calc.png)

For example, an A1 Windows Virtual Machine (VM) is estimated to cost $66.96 USD/month in compute hours if you leave it running the whole time:

![Screenshot of the pricing calculator showing that an A1 Windows VM is estimated to cost $66.96 USD per month](./media/billing-getting-started/pricing-calcVM.png)

For more information on pricing, see this [FAQ](https://azure.microsoft.com/pricing/faq/). Or if you want to talk to an Azure salesperson, contact 1-800-867-1389.

### Review the estimated cost in the Azure portal

Typically when you add a service in the Azure portal, there's a view that shows you a similar estimated cost per month. For example, when you choose the size of your Windows VM, you see the estimated monthly cost for the compute hours:

![Example: an A1 Windows VM is estimated to cost $66.96 USD per month](./media/billing-getting-started/vm-size-cost.PNG)

### <a name="spending-limit"></a> Check if you have a spending limit on

If you have a subscription that uses credits, then the spending limit is turned on for you by default. This way, when you spend all your credits, your credit card doesn't get charged. See the [full list of Azure offers and the availability of spending limit](https://azure.microsoft.com/support/legal/offer-details/).

However, if you hit your spending limit, your services get disabled. That means your VMs are deallocated. To avoid service downtime, you must turn off the spending limit. Any overage gets charged onto your credit card on file. 

To see if you've got spending limit on, go to the [Subscriptions view in the Account Center](https://account.windowsazure.com/Subscriptions). A banner appears if your spending limit is on:

![Screenshot that shows a warning about spending limit being on in the Account Center](./media/billing-getting-started/spending-limit-banner.PNG)

Click the banner and follow prompts to remove the spending limit. If you didn't enter credit card information when you signed up, you must enter it to remove the spending limit. For more information, see [Azure spending limit – How it works and how to enable or remove it](https://azure.microsoft.com/pricing/spending-limits/).

## Ways to monitor your costs when using Azure services

### <a name="tags"></a> Add tags to your resources to group your billing data

You can use tags to group billing data for supported services. For example, if you run several VMs for different teams, then you can use tags to categorize costs by cost center (HR, marketing, finance) or environment (production, pre-production, test). 

![Screenshot that shows setting up tags in the portal](./media/billing-getting-started/tags.PNG)

The tags show up throughout different cost reporting views. For example, they're visible in your [cost analysis view](#costs) right away and [detail usage .csv](#invoice-and-usage) after your first billing period.

For more information, see [Using tags to organize your Azure resources](../azure-resource-manager/resource-group-using-tags.md).

### <a name="costs"></a> Regularly check the portal for cost breakdown and burn rate

After you get your services running, regularly check how much they're costing you. You can see the current spend and burn rate in Azure portal. 

1. Visit the [Subscriptions blade in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and select a subscription.

2. You should see the cost breakdown and burn rate in the popup blade. It may not be supported for your offer (a warning would be displayed near the top).

    ![Screenshot of burn rate and breakdown in the Azure portal](./media/billing-getting-started/burn-rate.PNG)

3. Click **Cost analysis** in the list to the left to see the cost breakdown by resource. Wait 24 hours after you add a service for the data to populate.

    ![Screenshot of the cost analysis view in Azure portal](./media/billing-getting-started/cost-analysis.PNG)

4. You can filter by different properties like [tags](#tags), resource group, and timespan. Click **Apply** to confirm the filters and **Download** if you want to export the view to a Comma-Separated Values (.csv) file.

5. Additionally, you can click a resource to see daily spend history and how much the resource costs each day.

    ![Screenshot of the spend history view in Azure portal](./media/billing-getting-started/costhistory.PNG)

We recommend that you check the costs you see with the estimates you saw when you selected the services. If the costs wildly differ from estimates, double check the pricing plan (A1 vs A0 VM, for example) that you've selected for your resources. 

### Consider enabling cost-cutting features like auto-shutdown for VMs

Depending on your scenario, you could configure auto-shutdown for your VMs in the Azure portal. For more information, see [Auto-shutdown for VMs using Azure Resource Manager](https://azure.microsoft.com/blog/announcing-auto-shutdown-for-vms-using-azure-resource-manager/).

![Screenshot of auto-shutdown option in the portal](./media/billing-getting-started/auto-shutdown.PNG)

Auto-shutdown isn't the same as when you shut down within the VM with power options. Auto-shutdown stops and deallocates your VMs to stop additional usage charges. For more information, see pricing FAQ for [Linux VMs](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) and [Windows VMs](https://azure.microsoft.com/pricing/details/virtual-machines/windows/) about VM states.

For more cost-cutting features for your development and test environments, check out [Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab/).

### Turn on and check out Azure Advisor recommendations

[Azure Advisor](../advisor/advisor-overview.md) is a feature that helps you reduce costs by identifying resources with low usage. Visit Advisor in the Azure portal:

![Screenshot of Azure Advisor button in Azure portal](./media/billing-getting-started/advisor-button.PNG)

Then, you can get actionable recommendations in the **Cost** tab in the Advisor dashboard:

![Screenshot of Advisor cost recommendation example](./media/billing-getting-started/advisor-action.PNG)

For more information, see [Advisor Cost recommendations](../advisor/advisor-cost-recommendations.md).

## Reviewing costs at the end of your billing cycle

After the end of your billing cycle, your invoice will become available. You can also [download past invoices and detail usage files](billing-download-azure-invoice-daily-usage-date.md) to make sure you were charged correctly. For more information about comparing your daily usage with your invoice, see [Understand your bill for Microsoft Azure](billing-understand-your-bill.md).

### Billing API

Use our billing API to programmatically get usage data. Use the RateCard API and the Usage API together to get your billed usage. For more information, see [Gain insights into your Microsoft Azure resource consumption](billing-usage-rate-card-overview.md).

## <a name="other-offers"></a> Additional resources and special cases

### EA, CSP, and Sponsorship customers
Talk to your account manager or Azure partner to get started.

| Offer | Resources |
|-------------------------------|-----------------------------------------------------------------------------------|
| Enterprise Agreement (EA) | [EA portal](https://ea.azure.com/), [help docs](https://ea.azure.com/helpdocs), and [Power BI report](https://powerbi.microsoft.com/documentation/powerbi-content-pack-azure-enterprise/) |
| Cloud Solution Provider (CSP) | Talk to your provider |
| Azure Sponsorship | [Sponsorship portal](https://www.microsoftazuresponsorships.com/) |

If you're managing IT for a large organization, we recommend reading [Azure enterprise scaffold](/azure/architecture/cloud-adoption-guide/subscription-governance) and the [enterprise IT white paper](http://download.microsoft.com/download/F/F/F/FFF60E6C-DBA1-4214-BEFD-3130C340B138/Azure_Onboarding_Guide_for_IT_Organizations_EN_US.pdf) (.pdf download, English only).

#### <a name="EA"></a> Preview Enterprise Agreement cost views within Azure Portal 

Enterprise cost views are currently in Public Preview. Items to note:
- Subscription costs are based on usage and do not account for prepaid amounts, overages, included quantities, adjustments, and taxes. Actual charges are computed at the Enrollment level. 
- Amounts displayed within the Azure portal might be delayed compared to values in the Enterprise portal.  
- If you are not seeing costs, it might be due to one of the following reasons:
    - You don't have enough RBAC permission at the subscription level. To see enterprise cost views, you must be a Billing Reader, Reader, Contributor, or Owner at the subscription level.
    - You are an Account Owner and your Enrollment Administrator has disabled the "AO view charges" setting.  Contact your Enrollment Administrator to get access to costs. 
    - You are a Department Administrator and your Enrollment Administrator has disabled the "DA view charges" setting.  Contact your Enrollment Administrator to gain access. 
    - You purchased Azure through a channel partner, and the partner has not released pricing information.  
- When settings related to cost access are updated within the Enterprise portal, there is a delay of a few minutes before the changes are reflected in the Azure portal.
- Spending limit, and invoice guidance don't apply to EA Subscriptions.

### Check your subscription and access

Viewing costs require [subscriptions-level access to billing information](billing-manage-access.md), but only the Account admin can access the [Account Center](https://account.azure.com/Subscriptions), change billing info, and manage subscriptions. The Account admin is the person who went through the sign-up process. For more information, see [Add or change Azure administrator roles that manage the subscription or services](billing-add-change-azure-subscription-administrator.md).

To see if you're the Account admin, go to the [Subscriptions blade in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and look at the list of subscriptions you have access to. Look under **My role**. If it says *Account admin*, then you're ok. If it says something else like *Owner*, then you don't have full privileges.

![Screenshot of your role in the Subscriptions view in the Azure portal](./media/billing-getting-started/sub-blade-view.PNG)

If you're not the Account admin, then somebody probably gave you partial access via [Azure Active Directory Role-based Access Control](../role-based-access-control/role-assignments-portal.md) (RBAC). To manage subscriptions and change billing info, [find the Account admin](billing-subscription-transfer.md#whoisaa) and ask them to perform the tasks or [transfer the subscription to you](billing-subscription-transfer.md).

If your Account admin is no longer with your organization and you need to manage billing, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). 
## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
