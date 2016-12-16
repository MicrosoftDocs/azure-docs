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

After you sign up for Azure, there are several things you can do to get better idea of your spend. In the Azure portal, you can see your current spend and burn rate. You can also download past invoices and detail usage files. As an advanced user, you should check out the billing API and resource tagging functionality. 

If you're on Enterprise Agreement (EA), Cloud Solution Provider (CSP), or Azure Sponsorship then information in this article may not apply to you. See [Additional resources](#other-offers) and talk to your account manager or Azure partner to get started.

## Things to note before you add Azure services

### Estimate cost online using the pricing calculator

Check out the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) and [total cost of ownership calculator](https://aka.ms/azure-tco-calculator) to get an estimate the monthly cost of the service you're interested in. For example, an A1 Windows Virtual Machine (VM) is estimated to cost $66.96 USD per month:

![Example: an A1 Windows VM is estimated to cost $66.96 USD per month](./media/billing-getting-started/pricing-calc.PNG)

To learn more about pricing, see the [pricing FAQ](https://azure.microsoft.com/pricing/faq/) or call 1-800-867-1389 if you want to talk to a person.

### Check your subscription and access

<!-- This is very hard to explain! -->

To manage billing, you have to be the Account Administrator (AA). The AA is the person who went through the sign-up process. See [How to add or change Azure administrator roles](../billing-add-change-azure-subscription-administrator.md) to learn more about administrator roles.

To see if you're the AA, go to the [Subscriptions blade in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and look at the list of subscriptions you have access to. Look under **My Role**. If it says *Account admin*, then you're set. If it says something else like *Owner*, then you don't have full privileges.

![You should see your role in the Subscriptions view in the Azure portal](./media/billing-getting-started/sub-blade-view.PNG)

If you're not the AA, then somebody probably gave you partial access via [Azure Active Directory Role-based Access Control (RBAC)](../active-directory/role-based-access-control-configure.md). Ask the AA ([find out the AA is](../billing-subscription-transfer.md#whoisaa)) to perform the billing-related tasks or have them [transfer the subscription to you](../billing-subscription-transfer.md) so that you can start doing cost management.

If your AA is absent and you need to manage billing, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). 

### See if you have a spending limit on 

If you're on a *credit offer* - [monthly Azure credit via Visual Studio](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or other benefits - then the spending limit is turned on for you by default. This way, when you spend all your credits, your credit card doesn't get charged. 

> [!WARNING] 
> Once you hit your spending limit, we disable you (your VMs get deallocated)! If you don't want to get disabled, then you must turn off the spending limit so any overage gets charged onto a credit card on file. 

To see if you've got spending limit on, go to the [Subscriptions view in the Account Center](https://account.windowsazure.com/Subscriptions). A banner appears if your spending limit is on:

![You should see a warning about spending limit being on in the Account Center](./media/billing-getting-started/spending-limit-banner.PNG)

To remove the spending limit, click the banner and follow prompts. To learn more, see [Azure spending limit – How it works and how to enable or remove it](https://azure.microsoft.com/pricing/spending-limits/)

### Set up billing alerts

You can set up billing alerts for when your spend exceeds some number or if your monthly credits drop below some number. See [Set up billing alerts for your Microsoft Azure subscriptions](https://docs.microsoft.com/azure/billing-set-up-alerts).

![Set up billing alerts in the Account Center](./media/billing-getting-started/billing-alert.png)

> [!NOTE]
> This feature is still in preview.

Since earlier you estimated your costs using the pricing calculator, it would be a good idea to use that as a guideline for setting up your first alerts. 

### Understand limits and quotas for your subscription

There are default limits to each subscription for things Like the number of CPU cores, IP address, etc. Be mindful of these limits. See [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md). You can request an increase by [contacting support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). 

## What to do when you're adding a service

### Note the estimated cost in the portal

Typically when you add a service in the Azure portal, there's a view that shows you a similar estimated cost per month. For instance, when you're choosing the size of your Windows VM you should see the estimated monthly cost:

![Example: an A1 Windows VM is estimated to cost $66.96 USD per month](./media/billing-getting-started/vm-size-cost.PNG)

Take note of this estimate.

### Add tags to your resources to group your billing data

You can use tags to group billing data for supported services. For example, if you are running several VMs for different teams, then you can use tags to categorize costs by cost center (HR, marketing, finance) or environment (production, pre-production, test). 

![Use tags in to group your resources](./media/billing-getting-started/tags.PNG)

They show up in your [usage CSV](#invoice-and-usage) later:

![Tags can be found in the usage CSV](./media/billing-getting-started/csv.png)

See [Using tags to organize your Azure resources](../azure-resource-manager/resource-group-using-tags.md) for details. 

### Consider enabling cost-cutting features like auto-shutdown for VMs

Depending on your use case, you could configure auto-shutdown for your VMs in the Azure portal. See [Auto-shutdown for VMs using Azure Resource Manager](https://azure.microsoft.com/blog/announcing-auto-shutdown-for-vms-using-azure-resource-manager/).

![Set up auto-shutdown in the portal](./media/billing-getting-started/auto-shutdown.PNG)

> [!NOTE]
> This shutdown is not the same as shutting down inside the VM (like using Windows power options). It stops and deallocates your VMs to stop billing. See pricing FAQ for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) and [Windows](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/windows/) VMs.

## Ways to view and analyze your costs

### View your cost breakdown and burn rate regularly

After you get your services running, you should regularly check how much they're costing you. You can see the current spend and burn rate in Azure portal. 

1. Visit the [Subscriptions blade in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade)

2. Select your subscription you want to see. You might only have one to select.

3. You should see the cost breakdown and burn rate in the popup blade. It may not be supported for your offer (a warning would be displayed near the top). Wait 24 hours for the data to populate.
    
    ![See the burn rate and breakdown in the Azure portal](./media/billing-getting-started/burn-rate.PNG)

4. You could pin the view to your dashboard.

We recommend checking what you see here against the estimates found earlier. If it's wildly out of expectations, then double check the pricing plan (A1 vs A0 VM, for example) you've selected for your services. 

### <a name="invoice-and-usage"></a> Download invoice and detail usage after your first billing period

After your first billing period, you can download your PDF invoice and usage CSV files. See [How to download your Azure billing invoice and daily usage data](https://docs.microsoft.com/azure/billing-download-azure-invoice-daily-usage-date)

![Download to see your pdf invoice](./media/billing-getting-started/invoice.png)

Confused? See [Understand your bill for Microsoft Azure](https://docs.microsoft.com/azure/billing/billing-understand-your-bill).

### Billing API

We have billing API for you to programmatically get usage data. Use the RateCard API together with the usage API then you can get your billed usage. See [Gain insights into your Microsoft Azure resource consumption](https://docs.microsoft.com/azure/billing-usage-rate-card-overview) for the API overview.

## <a name="other-offers"></a> Additional resources for EA, CSP, and Sponsorship

| Offer | Resources |
|-------------------------------|-----------------------------------------------------------------------------------|
| Enterprise Agreement (EA) | [EA portal](https://ea.azure.com/) and [help docs](https://ea.azure.com/helpdocs) |
| Cloud Solution Provider (CSP) | Talk to your provider |
| Azure Sponsorship | [Sponsorship portal](https://www.microsoftazuresponsorships.com/) |

If you're working with enterprise IT, we recommend reading [Azure enterprise scaffold](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-subscription-governance#resource-group) and the [enterprise IT white paper](http://download.microsoft.com/download/F/F/F/FFF60E6C-DBA1-4214-BEFD-3130C340B138/Azure_Onboarding_Guide_for_IT_Organizations_EN_US.pdf) (PDF download, English only).
