---
title: View your billing accounts in Azure portal  | Microsoft Docs
description: Learn how to view your billing accounts in Azure portal.
services: ''
documentationcenter: ''
author: amberbhargava
manager: amberb
editor: ''
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/11/2018
ms.author: banders
---

# View billing accounts in Azure portal  

A billing account is created when you sign up to use Azure. You use your billing account to manage your invoices, payments, and track costs. You can have access to multiple billing accounts. For example, you might have signed up for Azure for your personal projects. You could also have access through your organization's Enterprise Agreement or Microsoft Customer Agreement. For each of these scenarios, you would have a separate billing account.

Azure portal currently supports the following type of billing accounts:

- **Microsoft Online Services Program**: A billing account for a Microsoft Online Services Program is created when you sign up for Azure through the Azure website. For example, when you sign up for an [Azure Free Account](https://azure.microsoft.com/offers/ms-azr-0044p/), [account with pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/) or as a [Visual studio subscriber](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/).

- **Enterprise Agreement**: A billing account for an Enterprise Agreement is created when your organization signs an [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/) to use Azure.

- **Microsoft Customer Agreement**: A billing account for a Microsoft Customer Agreement is created when your organization works with a Microsoft representative to sign a Microsoft Customer Agreement. Some customers in select regions, who sign up through the Azure website for an [account with pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/) or upgrade their [Azure Free Account](https://azure.microsoft.com/offers/ms-azr-0044p/) may have a billing account for a Microsoft Customer Agreement as well. For more information, see [Get started with your billing account for Microsoft Customer Agreement](billing-mca-overview.md).

<!--Todo Add section to identify the type of accounts -->

## Scopes for billing accounts
A scope is a node within a billing account that users use to view and manage billing. It is where users manage billing data, payments, invoices, and conduct general account management. 

### Microsoft Online Services Program

|Scope  |Definition  |
|---------|---------|
|Billing account     | Represents a single owner (Account administrator) for one or more Azure subscriptions. An Account Administrator is authorized to perform various billing tasks like create subscriptions, view invoices or change the billing for subscriptions.  |
|Subscription     |  Represents a grouping of Azure resources. Invoice is generated at this scope. It has its own payment methods that are used to pay its invoice.|


### Enterprise Agreement

|Scope  |Definition  |
|---------|---------|
|Billing account    | Represents an Enterprise Agreement enrollment. Invoice is generated at this scope. It is structured using departments and enrollment accounts.  |
|Department     |  Optional grouping of enrollment accounts.      |
|Enrollment account     |  Represents a single account owner. Azure subscriptions are created under this scope.  |


### Microsoft Customer Agreement

|Scope  |Tasks  |
|---------|---------|
|Billing account     |   Represents a customer agreement for multiple Microsoft products and services. It is structured using billing profiles and invoice sections.   |
|Billing profile     |  Represents an invoice and its payment methods. Invoice is generated at this scope. It can have multiple invoice sections.      |
|Invoice section     |   Represents a group of costs in an invoice. Subscriptions and other purchases are associated to this scope.    |


## Switch billing scope in the Azure portal


1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-view-all-accounts/billing-search-cost-management-billing.png)

3. Select **All billing scopes** from the left-hand side.

   ![Screenshot that shows all billing scopes](./media/billing-view-all-accounts/billing-list-of-accounts.png)

   ** You will not see **All billing scopes** if you only have access to one scope.

4. Select a scope to view details.



## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps
- Learn how to start [analyzing your costs](../cost-management/quick-acm-cost-analysis.md).