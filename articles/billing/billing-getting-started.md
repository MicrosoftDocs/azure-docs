---
title: Getting started with Azure billing and cost management | Microsoft Docs
description: Learn about best practices and first things to do to optimize your bill
services: ''
documentationcenter: ''
author: jlian
manager: stevenpo
editor: ''
tags: billing

ms.assetid: 32eea268-161c-4b93-8774-bc435d78a8c9
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/07/2016
ms.author: jlian

---
# Getting started with Azure billing and cost management

After you sign up for Azure, there are several things you can do to get better idea of your spend. In the Azure portal you can see your current spend and burn rate. You can also download past invoices and detail usage csv files if you'd like to analyze a bit further. If you're an advanced user, then check out the billing API and resource tagging functionality. 

## Understand what offer you're on.

To get started, first you should know what offer (AKA subscription type) you're on. You can find it in the subscription summary page in the Account Center. 

### Free Trial, Pay-As-You-Go, or Visual Studio

Great, all the features and concepts in this article apply to you.

### Enterprise Agreement

Talk to your EA contact and visit the [EA help docs](https://ea.azure.com/helpdocs) for help managing departments, accounts, and enrollment. Some features in this article may not apply to you.

<!-- TODO: clarify -->

### Others

If you're on CSP, Sponsorship, Azure Pass, or others - you should speak to your account manager or Azure partner. The information may or may not apply to you. We're working on it.

<!-- TODO: include the sponsorship portal somehow? https://www.microsoftazuresponsorships.com/ -->

## Estimate the cost before you add services

Check out the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) and [total cost of ownership calculator](https://aka.ms/azure-tco-calculator) to get an estimate the monthly cost of the service you're interested in. For example, an A0 Windows Virtual Machine is estimated to cost $14.88 USD per month:

![Example: an A0 Windows VM is estimated to cost $14.88 USD per month](./media/billing-getting-started/pricing-calc.PNG)

Typically when you add a service in the Azure portal there's a view that shows you a similar estimated cost per month. For instance, when you're choosing the size of your Windows VM you should see the estimated monthly cost.

![Example: an A1 Windows VM is estimated to cost $66.96 USD per month](./media/billing-getting-started/vm-size-cost.PNG)

## View your cost breakdown and burn rate 

One of the first things you should do after you get your services running is to take a look at your costs. You can see the current spend and burn rate in the Azure Portal.

1. Go to Azure portal.

2. Click Subscriptions then select your subscription you want to see. You might only have one to select.

3. Look at the pie chart and burn rate chart
    ![See the burn rate and breakdown in the Azure portal](./media/billing-getting-started/burn-rate.PNG)

4. You could pin the view to your dashboard.

There's about 24-hour delay in the data so don't expect to use this feature for real time cost monitoring.

My advice: check this against the estimates we found earlier. If it's wildly out of expectations then double check your plan.

## Download invoice and usage

After your first billing period, you can download your PDF invoice and usage CSV files. See [How to download your Azure billing invoice and daily usage data](https://docs.microsoft.com/azure/billing-download-azure-invoice-daily-usage-date)

![Download to see your pdf invoice](./media/billing-getting-started/invoice.png)

Confused? See [Understand your bill for Microsoft Azure](https://docs.microsoft.com/azure/billing/billing-understand-your-bill).

## Billing alerts

You can set up billing alerts for when your spend exceeds some number or if your monthly credits drop below some number. See [Set up billing alerts for your Microsoft Azure subscriptions](https://docs.microsoft.com/azure/billing-set-up-alerts)

![Set up billing alerts in the Account Center](./media/billing-getting-started/billing-alert.png)

## Spending limits

If you're on a credit offer (free $ per month) then the spending limit is turned on for you by default. This way if you're just trying things out, you will never actually get charged any real money. To learn more and how to turn it off, see [Azure spending limit – How it works and how to enable or remove it](https://azure.microsoft.com/pricing/spending-limits/)

## Billing API

We have billing API for you to pragmatically get usage data. Use the RateCard API together with the usage API then you can get your billed usage. See [Gain insights into your Microsoft Azure resource consumption](https://docs.microsoft.com/azure/billing-usage-rate-card-overview) for the API overview. 

## Tagging your resources

Tags provide an easy way to organize application resources, but in order to be effective you need to ensure that: 

- Tags are correctly applied to the application resources at provisioning time. 
- Tags are properly used on the Showback/Chargeback process to tie the usage to the organization’s account structure. 

See [Using tags to organize your Azure resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#tags

## Concepts

### Azure resources and subscriptions 

TODO: explain subscriptions

See [Azure Resource Manager overview](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview).

If you're working with enterprise IT, we recommend reading [Azure enterprise scaffold](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-subscription-governance#resource-group) and the [enterprise IT white paper](http://download.microsoft.com/download/F/F/F/FFF60E6C-DBA1-4214-BEFD-3130C340B138/Azure_Onboarding_Guide_for_IT_Organizations_EN_US.pdf) (PDF download, English only).

### Account Administrator

If you're the one that signed up for the Azure subscriptions, you're the AA. If you weren't the one that signed up (say you were given access to it by your IT admin) then you should know that only the AA has the power to perform various management tasks. These include create being able to create subscriptions, cancel subscriptions, change the billing for a subscription, and change the Service Administrator

See [How to add or change Azure administrator roles](https://docs.microsoft.com/azure/billing-add-change-azure-subscription-administrator)

If you really want to do stuff but your AA has left, contact support. They can transfer the subscription to you.

Azure Active Directory Role-based Access Control (RBAC) allows users to be added to multiple roles. For more information, see [Azure Active Directory Role-based Access Control](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure).

### Quotas and limits

There are default limits to each subscription for things Like the number of CPU cores, IP address, etc. Be mindful of these limits. See [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-subscription-service-limits)