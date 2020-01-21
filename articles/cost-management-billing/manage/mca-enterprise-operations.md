---
title: EA tasks in a Microsoft Customer Agreement - Azure
description: Learn how to complete Enterprise Agreement tasks in your new billing account.
author: amberbhargava
manager: amberb
editor: banders
tags: billing
ms.service: cost-management-billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/02/2020
ms.author: banders

---
# Complete Enterprise Agreement tasks in your billing account for a Microsoft Customer Agreement

If your organization has signed a Microsoft Customer Agreement to renew your Enterprise Agreement enrollment, a new billing account is created for the agreement. The billing in your new account is organized differently than your Enterprise Agreement. This article describes how you can use the new billing account to perform tasks that you performed in your Enterprise Agreement.

## Billing organization in the new account

The following diagram describes how billing is organized in your new billing account.

![Image of ea-mca-post-transition-hierarchy](./media/mca-enterprise-operations/mca-post-transition-hierarchy.png)

| Enterprise Agreement   | Microsoft Customer Agreement    |
|------------------------|--------------------------------------------------------|
| Enrollment            | You use a billing profile to manage billing for your organization, similar to your Enterprise Agreement enrollment. Enterprise administrators become owners of the billing profile. To learn more about billing profiles, see [Understand billing profiles](../understand/mca-overview.md#billing-profiles).
| Department            | You use an invoice section to organize your costs, similar to departments in your Enterprise Agreement enrollment. Department becomes invoice sections and department administrators become owners of the respective invoice sections. To learn more about invoice sections, see [Understand invoice sections](../understand/mca-overview.md#invoice-sections). |
| Account               | The accounts that were created in your Enterprise Agreement aren’t supported in the new billing account. The account's subscriptions belong to the respective invoice section for their department. Account owners can create and manage subscriptions for their invoice sections. |

## Changes for enterprise administrators

The following changes apply to enterprise administrators on an Enterprise Agreement that got renewed to a Microsoft Customer Agreement.

- A billing profile is created for your enrollment. You’ll use the billing profile to manage billing for your organization, like your Enterprise Agreement enrollment. To learn more about billing profiles, [understand billing profiles](../understand/mca-overview.md#billing-profiles).
- An invoice section is created for each department in your Enterprise Agreement enrollment. You’ll use the invoice sections to manage your departments. You can create new invoice sections to set up additional departments. To learn more about invoice sections, see [understand invoice sections](../understand/mca-overview.md#invoice-sections).
- You’ll use the Azure subscription creator role on invoice sections to give others permission to create Azure subscription, like the accounts that were created in Enterprise Agreement enrollment.
- You’ll use the [Azure portal](https://portal.azure.com) to manage billing for your organization, instead of the Azure EA portal.

You are given the following roles on the new billing account:

**Billing profile owner** - You are assigned the billing profile owner role on the billing profile that was created when the agreement was signed. The role lets you manage the billing for your organization. You can view charges and invoices, organize costs on the invoice, manage payment methods, and control access to your organization's billing.

**Invoice section owner** - You are assigned the invoice section owner role on all invoice sections that are created for the departments in your Enterprise Agreement enrollment. The role lets you control who can create Azure subscriptions and purchase other products.

### View charges and credits balance for your organization

You use your billing profile to track charges and Azure credits balance for your organization similar to your Enterprise Agreement enrollment.

To learn how to view credit balance for a billing profile, see [track Azure credit balance for your billing profile](mca-check-azure-credits-balance.md).

To learn how to view charges for a billing profile, see [understand the charges on your Microsoft Customer Agreement's invoice](../understand/review-customer-agreement-bill.md).

### View charges for a department

An invoice section is created for each department you had in your Enterprise Agreement. You can view charges for an invoice section in the Azure portal. For more information, see [view transactions by invoice sections](../understand/review-customer-agreement-bill.md#view-transactions-by-invoice-sections).

### View charges for an account

The accounts that were created in your Enterprise Agreement enrollment are not supported in the new billing account. The account's subscriptions belong to the respective invoice section for their department. Account owners can create and manage subscriptions for their invoice sections.

To view aggregate cost for subscriptions that belonged to an account, you must set a cost center for each subscription. Then you can use the Azure usage and charges csv file to filter the subscriptions by the cost center.

### Download usage and charges csv, price sheet, and tax documents

A monthly invoice is generated for each billing profile in your billing account. For each invoice, you can download Azure usage and charges csv file, price sheet, and tax document (if applicable). You can also download Azure usage and charges csv file for the current month's charges.

To learn how to download Azure usage and charges csv file, see [download usage for your Microsoft Customer Agreement](../understand/download-azure-daily-usage.md).

To learn how to download price sheet, see [download pricing for your Microsoft Customer Agreement](ea-pricing.md).

To learn how to download tax documents, see [view the tax documents for your Microsoft Customer Agreement](../understand/mca-download-tax-document.md#view-and-download-tax-documents).

### Add an additional enterprise administrator

Give users access to the billing profile to let them view and manage billing for your organization. You can use the **Access Control (IAM)** page in the Azure portal to give access.  To learn more about billing profile roles, see [Billing profile roles and tasks](understand-mca-roles.md#billing-profile-roles-and-tasks).

To learn how to provide,  access to your billing profile, see [manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

### Create a new department

Create an invoice section to organize your costs based on your needs, like departments in your Enterprise Agreement enrollment. You can create a new invoice section in the Azure portal. To learn more, see [create sections on your invoice to organize your costs](mca-section-invoice.md).

### Create a new account

Assign users the Azure subscription creator role on invoice sections to give them permission to create Azure subscription, like the accounts that are created in Enterprise Agreement enrollment. For more information on assigning roles, see [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal)

## Changes for department administrators

The following changes apply to department administrators on an Enterprise Agreement that got renewed to a Microsoft Customer Agreement.

- An invoice section is created for each department in your Enterprise Agreement enrollment. You’ll use the invoice section(s) to manage your department(s). To learn more about invoice sections, see [understand invoice sections](../understand/mca-overview.md#invoice-sections).
- You’ll use the Azure subscription creator role on the invoice section to give others permission to create Azure subscription, like the accounts that are created in Enterprise Agreement enrollment.
- You’ll use the Azure portal to manage billing for your organization, instead of the Azure EA portal.

You are given the following roles on the new billing account:

**Invoice section owner** - You are assigned the invoice section owner role on the invoice section that is created for the department(s) you had in Enterprise Agreement. The role lets you view and track charges, and control who can create Azure subscriptions and buy other products for the invoice section.

### View charges for your department

You can view charges for the invoice section that’s created for your department, in the Azure portal’s [Cost Management + Billing page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/ModernBillingMenuBlade/Overview).

### Add an additional department administrator

An invoice section is created for each department you had in your Enterprise Agreement. You can use the **Access Control(IAM)** page in the Azure portal to give others access to view and manage the invoice section. To learn more about invoice section roles, see [invoice section roles and tasks](understand-mca-roles.md#invoice-section-roles-and-tasks).

To learn how to provide, access to your invoice section, see [manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

### Create a new account in your department

Assign users the Azure subscription creator role on invoice section that’s created for your department. For more information on assigning roles, see [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal)

### View charges for accounts in your departments

The accounts that were created in your Enterprise Agreement enrollment are not supported in the new billing account. The account's subscriptions belong to the respective invoice section for their department. Account owners can create and manage subscriptions for their invoice sections.

To view aggregate cost for subscriptions that belonged to an account in your department, you must set a cost center for each subscription. Then you can use the Azure usage and charges file to filter the subscriptions by the cost center.

## Changes for account owners

Account owners on the Enterprise Agreement get permission to create Azure subscriptions on the new billing account. Your existing Azure subscriptions belong to the invoice section that is created for your department. If your account doesn’t belong to a department, your subscriptions belong to an invoice section named Default invoice section.

To create additional Azure subscriptions, you are given the following role on the new billing account.

**Azure subscription creator** - You are assigned the azure subscription creator role on the invoice section that is created for your department in Enterprise Agreement. If your account doesn't belong to a department, you get Azure subscription creator role on a section named Default invoice section. The role lets you create Azure subscriptions for the invoice section.

### Create an Azure subscription

You can create Azure subscriptions for your invoice section in the Azure portal. For more information, see [create an additional Azure subscription for Microsoft Customer Agreement](create-subscription.md)

### View charges for your account

To view charges for subscriptions that belonged to an account, go to the [subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal. The subscriptions page displays charges for all your subscription.

### View charges for a subscription

You can view charges for a subscription either on the [subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) or the Azure cost analysis. For more information on Azure cost analysis, see [explore and analyze costs with Cost analysis](../costs/quick-acm-cost-analysis.md).

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Understand billing account for a Microsoft Customer Agreement](../understand/mca-overview.md)
- [Understand your invoice](../understand/review-individual-bill.md)
- [Understand your bill](../understand/understand-invoice.md)
- [Get billing ownership of Azure subscriptions from other users](mca-request-billing-ownership.md)
