---
title: Getting started with Azure billing and cost management | Microsoft Docs
description: Learn about best practices and first things to do to optimize your bill
services: ''
documentationcenter: ''
author: jlian
manager: mattstee
editor: ''
tags: billing

ms.assetid: 
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/15/2016
ms.author: jlian

---
# Getting started with Azure billing and cost management

After you sign up for Azure, there are several things you can do to get better idea of your spend. In the Azure portal, you can see your current usage and burn rate. You can also download past invoices and detail usage files. If you want to group costs for resources used for different projects or teams, look at resource tagging. If your organization has a reporting system that you prefer to use, check out the billing APIs. 

If you're an Enterprise Agreement (EA), Cloud Solution Provider (CSP), or Azure Sponsorship customer then information in this article may not apply to you. See [Additional resources](#other-offers). 

## Before you add Azure services

### Estimate cost online using the pricing calculator

Check out the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) and [total cost of ownership calculator](https://aka.ms/azure-tco-calculator) to get an estimate the monthly cost of the service you're interested in. For example, an A1 Windows Virtual Machine (VM) is estimated to cost $66.96 USD per month if you leave it running the whole time:

![Screenshot of the pricing calculator showing that an A1 Windows VM is estimated to cost $66.96 USD per month](./media/billing-getting-started/pricing-calc.PNG)

For more information, see [pricing FAQ](https://azure.microsoft.com/pricing/faq/). Or if you want to talk to a person, call 1-800-867-1389.

### Check your subscription and access

<!-- This is very hard to explain! -->

To manage billing, you have to be the Account admin. The Account admin is the person who went through the sign-up process. See [How to add or change Azure administrator roles](../billing-add-change-azure-subscription-administrator.md) to learn more about being an Account admin.

To see if you're the Account admin, go to the [Subscriptions blade in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and look at the list of subscriptions you have access to. Look under **My Role**. If it says *Account admin*, then you're ok. If it says something else like *Owner*, then you don't have full privileges.

![Screenshot of your role in the Subscriptions view in the Azure portal](./media/billing-getting-started/sub-blade-view.PNG)

If you're not the Account admin, then somebody probably gave you partial access via [Azure Active Directory Role-based Access Control](../active-directory/role-based-access-control-configure.md) (RBAC). [Ask the Account admin](../billing-subscription-transfer.md#whoisaa) to perform the billing-related tasks or have them [transfer the subscription to you](../billing-subscription-transfer.md) so you could start doing cost management.

If your Account admin is no longer with your organization and you need to manage billing, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). 

### Check if you have a spending limit on 

If you're using a *credit offer*, like the [monthly Azure credit via Visual Studio](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/), then the spending limit is turned on for you by default. This way, when you spend all your credits, your credit card doesn't get charged. 

If you hit your spending limit, your services get disabled. That means your VMs are deallocated. To avoid service downtime, you must turn off the spending limit. Any overage gets charged onto a credit card on file. 

To see if you've got spending limit on, go to the [Subscriptions view in the Account Center](https://account.windowsazure.com/Subscriptions). A banner appears if your spending limit is on:

![Screenshot that shows a warning about spending limit being on in the Account Center](./media/billing-getting-started/spending-limit-banner.PNG)

Click the banner and follow prompts to remove the spending limit. For more information, see [Azure spending limit – How it works and how to enable or remove it](https://azure.microsoft.com/pricing/spending-limits/).

### Set up billing alerts

Set up billing alerts to get emails when your usage costs exceed an amount that you specify. If you have monthly credits, set up alerts for when you use up a specified amount. See [Set up billing alerts for your Microsoft Azure subscriptions](https://docs.microsoft.com/azure/billing-set-up-alerts).

![Screenshot of a billing alert email](./media/billing-getting-started/billing-alert.png)

> [!NOTE]
> This feature is still in preview so you should check your usage regularly.

You might want to use the cost estimate from the pricing calculator as a guideline for your first alert.

### Understand limits and quotas for your subscription

There are default limits to each subscription for things like the number of CPU cores, IP address, etc. Be mindful of these limits. See [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md). You can request an increase to your limit or quota by [contacting support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## What to do when as you add a service

### Review the estimated cost in the portal

Typically when you add a service in the Azure portal, there's a view that shows you a similar estimated cost per month. For example, when you choose the size of your Windows VM you see the estimated monthly cost:

![Example: an A1 Windows VM is estimated to cost $66.96 USD per month](./media/billing-getting-started/vm-size-cost.PNG)

### Add tags to your resources to group your billing data

You can use tags to group billing data for supported services. For example, if you run several VMs for different teams, then you can use tags to categorize costs by cost center (HR, marketing, finance) or environment (production, pre-production, test). 

![Screenshot that shows setting up tags in the portal](./media/billing-getting-started/tags.PNG)

The tags show up in your [usage CSV](#invoice-and-usage) after your first billing period:

![Screenshot that shows tags in the usage CSV](./media/billing-getting-started/csv.png)

For more information, see [Using tags to organize your Azure resources](../azure-resource-manager/resource-group-using-tags.md).

### Consider enabling cost-cutting features like auto-shutdown for VMs

Depending on your scenario, you could configure auto-shutdown for your VMs in the Azure portal. See [Auto-shutdown for VMs using Azure Resource Manager](https://azure.microsoft.com/blog/announcing-auto-shutdown-for-vms-using-azure-resource-manager/).

![Screenshot of auto-shutdown option in the portal](./media/billing-getting-started/auto-shutdown.PNG)

Auto-shutdown isn't the same as when you shut down within the VM with power options. Auto-shutdown stops and deallocates your VMs. to stop additional usage charges. See pricing FAQ for [Linux VMs](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) and [Windows VMs](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/windows/) to learn more about VM states.

## <a name="cost-reporting"></a> Ways to view and analyze your costs

### View your usage and costs regularly

After you get your services running, regularly check how much they're costing you. You can see the current spend and burn rate in Azure portal. 

1. Visit the [Subscriptions blade in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).

2. Select your subscription you want to see. You might only have one to select.

3. You should see the cost breakdown and burn rate in the popup blade. It may not be supported for your offer (a warning would be displayed near the top). Wait 24 hours after you add a service for the data to populate.
    
    ![Screenshot of burn rate and breakdown in the Azure portal](./media/billing-getting-started/burn-rate.PNG)

4. You might want to pin the view to your dashboard.

<!-- TODO: add small screenshot -->

We recommend that you check the charges you see with the estimates you saw when you selected the services. If the charges wildly differ from the estimates, then double check the pricing plan (A1 vs A0 VM, for example) that you've selected for your services. 

### <a name="invoice-and-usage"></a> Download invoice and detail usage after your first billing period

After your first billing period, you can download your Portable Document Format (.pdf) invoice and usage Comma-Separated Values (.csv) files. For more information, see [How to download your Azure billing invoice and daily usage data](https://docs.microsoft.com/azure/billing-download-azure-invoice-daily-usage-date).

![Screenshot of a PDF invoice](./media/billing-getting-started/invoice.png)

Confused? For more information, see [Understand your bill for Microsoft Azure](https://docs.microsoft.com/azure/billing/billing-understand-your-bill).

### Billing API

Use our billing API to programmatically get usage data. Use the RateCard API and the Usage API together to get your billed usage. For more information, see [Gain insights into your Microsoft Azure resource consumption](https://docs.microsoft.com/azure/billing-usage-rate-card-overview).

## <a name="other-offers"></a> Additional resources for EA, CSP, and Sponsorship

Talk to your account manager or Azure partner to get started.

| Offer | Resources |
|-------------------------------|-----------------------------------------------------------------------------------|
| Enterprise Agreement (EA) | [EA portal](https://ea.azure.com/) and [help docs](https://ea.azure.com/helpdocs) |
| Cloud Solution Provider (CSP) | Talk to your provider |
| Azure Sponsorship | [Sponsorship portal](https://www.microsoftazuresponsorships.com/) |

If you're working with enterprise IT, we recommend reading [Azure enterprise scaffold](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-subscription-governance#resource-group) and the [enterprise IT white paper](http://download.microsoft.com/download/F/F/F/FFF60E6C-DBA1-4214-BEFD-3130C340B138/Azure_Onboarding_Guide_for_IT_Organizations_EN_US.pdf) (PDF download, English only).
