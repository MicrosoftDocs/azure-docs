---
title: Complete Enterprise Agreement tasks in Microsoft Customer Agreement - Azure | Microsoft Docs
description: Learn how to complete Enterprise Agreement tasks in your new billing account.
services: ''
documentationcenter: ''
author: amberbhargava
manager: amberb
editor: banders
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/24/2018
ms.author: banders

---
# Complete Enterprise Agreement tasks in your billing account for a Microsoft Customer Agreement

If your organization has signed a Microsoft Customer Agreement to renew your Enterprise Agreement enrollment, then you must set up the new billing account created for the agreement. Your new billing account provides you enhanced billing and cost management capabilities through a new streamlined, unified management experience. For more information, see [Set up your billing account for a Microsoft Customer Agreement](billing-mca-setup-account.md).

Once the setup is completed, use this article to understand how to perform tasks that you performed in your Enterprise Agreement enrollment.

This article applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-your-access-to-a-microsoft-customer-agreement).

## Mapping of Enterprise Agreement's billing to the new billing account

The billing in your new account is organized differently than your Enterprise Agreement enrollment. The following table describes the mapping of billing from your Enterprise Agreement enrollment to your new billing account. To learn more about your new billing account, see [Get started with your billing account for Microsoft Customer Agreement](billing-mca-overview.md).

| Enterprise Agreement   | Microsoft Customer Agreement    |
|------------------------|--------------------------------------------------------|
| Enrollment            | You use a billing profile to manage billing for your organization, similar to your Enterprise Agreement enrollment. Enterprise administrators become owners of the billing profile. To learn more about billing profiles, see [Understand billing profiles](billing-mca-overview.md#understand-billing-profiles).
| Department            | You use an invoice section to organize your costs, similar to departments in your Enterprise Agreement enrollment. Department becomes invoice sections and department administrators become owners of the respective invoice sections. To learn more about invoice sections, see [Understand invoice sections](billing-mca-overview.md#understand-invoice-sections). |
| Account               | The accounts that were created in your Enterprise Agreement aren’t supported in the new billing account. The account's subscriptions belong to the respective invoice section for their department. Account owners can create and manage subscriptions for their invoice sections. |

## Tasks performed by an enterprise administrator

If you are an enterprise administrator on an Enterprise Agreement that got renewed to a Microsoft Customer Agreement, you are assigned the following roles on the new billing account created for the agreement:

**Billing profile owner** - You are assigned the billing profile owner role on the billing profile that was created when the agreement was signed. The role lets you manage the billing for your organization. You can view charges and invoices, organize costs on the invoice, manage payment methods, and control access to your organization's billing.

**Invoice section owner** - You are assigned the invoice section owner role on all invoice sections that are created for the departments in your Enterprise Agreement enrollment. The role lets you control who can create Azure subscriptions and purchase other products.

### View charges and credits balance for your organization

You use your billing profile to track charges and Azure credits balance for your organization similar to your Enterprise Agreement enrollment.

To learn how to view credit balance for a billing profile, see [Track Azure credit balance for your billing profile](billing-mca-check-azure-credits-balance.md).

To learn how to view charges for a billing profile, see [Understand the charges on your Microsoft Customer Agreement's invoice](billing-mca-understand-your-bill.md).

### View charges for a department

An invoice section is created for each department you had in your Enterprise Agreement. You can view charges for an invoice section in the Azure portal. For more information, see [View transactions by invoice sections](billing-mca-understand-your-bill.md#view-transactions-by-invoice-sections).

### View charges for an account

The accounts that were created in your Enterprise Agreement enrollment are not supported in the new billing account. The account's subscriptions belong to the respective invoice section for their department. Account owners can create and manage subscriptions for their invoice sections.

To view aggregate cost for subscriptions that belonged to an account, you must set a cost center for each subscription. Then you can use the Azure usage and charges csv file to filter the subscriptions by the cost center.

### Download usage and charges csv, price sheet, and tax documents

A monthly invoice is generated for each billing profile in your billing account. For each invoice, you can download Azure usage and charges csv file, price sheet, and tax document (if applicable). You can also download Azure usage and charges csv file for the current month's charges.

To learn how to download Azure usage and charges csv file, see [Download or view your Azure billing invoice and daily usage data](billing-download-azure-invoice-daily-usage-date.md). <!--Todo update the link -->

To learn how to download price sheet and tax documents, see [Download tax documents for your invoice](billing-download-azure-invoice-daily-usage-date.md). <!--Todo update the link -->

### Add an additional enterprise administrator

Use the **Access Control(IAM)** page in the Azure portal to give others access to view and manage the billing profile. To learn more about billing profile roles, see [Billing profile roles and tasks](billing-understand-mca-roles.md#billing-profile-roles-and-tasks).

To learn how to provide,  access to your billing profile, see [Manage billing roles in the Azure portal](billing-understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

### Create a new department

In your new billing account, you use an invoice section to organize your costs based on your needs, similar to departments in your Enterprise Agreement enrollment. You can create a new invoice section in the Azure portal to set up Azure for a new department. To learn more, see [Create sections on your invoice to organize your costs](billing-mca-section-invoice.md).

### Create a new account

The account billing context in your Enterprise Agreement isn't supported in the new billing account. However, you can provide Azure subscription creator role to users in your organization to allow them to create Azure subscriptions. For more information, see [Give others permission to create Azure subscriptions](billing-mca-create-subscription.md#give-others-permission-to-create-azure-subscriptions).

## Tasks performed by a department administrator

If you are a department administrator on an Enterprise Agreement that renewed to a Microsoft Customer Agreement, you are assigned the following roles on the new billing account:

**Invoice section owner** - You are assigned the invoice section owner role on the invoice section that is created for the departments you had in Enterprise Agreement. The role lets you view and track charges, and control who can create Azure subscriptions and buy other products for the invoice section.

If you are a department administrator on multiple departments in Enterprise Agreement, you are assigned invoice section owner role on all the invoice sections created for the departments.

### View charges for your department

An invoice section is created for each department you had in your Enterprise Agreement. The invoice section has the same name as your department in the Enterprise Agreement. You can view charges for the invoice section in the Azure portal. <!-- Todo Add a link -->

### Add an additional department administrator

An invoice section is created for each department you had in your Enterprise Agreement. You can use the **Access Control(IAM)** page in the Azure portal to give others access to view and manage the invoice section. To learn more about invoice section roles, see [Invoice profile roles and tasks](billing-understand-mca-roles.md#invoice-section-roles-and-tasks).

To learn how to provide, access to your invoice section, see [Manage billing roles in the Azure portal](billing-understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

### Create a new account in your department

The account billing context in your Enterprise Agreement isn't supported in the new billing account. However, you can provide Azure subscription creator role to users in your organization to allow them to create Azure subscriptions. For more information, see [Give others permission to create Azure subscriptions](billing-mca-create-subscription.md#give-others-permission-to-create-azure-subscriptions).

### View charges for accounts in your departments

The account billing context in your Enterprise Agreement isn't supported in the new billing account. The account's subscriptions belong to the invoice section created for your department. Account owners can create and manage subscriptions for the invoice sections.

To view aggregate cost for subscriptions that belonged to an account in your department, you must set a cost center for each subscription. Then you can use the Azure usage and charges file to filter the subscriptions by the cost center. <!-- Todo - can they go to cost analysis -->

## Tasks performed by an account owner

If you are an account owner on an Enterprise Agreement that got renewed to a Microsoft Customer Agreement, you are assigned the following role on the new billing account created for the agreement:

**Azure subscription creator** - You are assigned the azure subscription creator role on the invoice section that is created for your department in Enterprise Agreement. If your account doesn't belong to a department, your subscriptions will belong to the invoice section named Default invoice section and you get Azure subscription creator on the section. The role lets you create Azure subscriptions for the invoice section.

### View charges for your account

The account billing context in your Enterprise Agreement isn't supported in the new billing account. The account's subscriptions belong to the invoice section created for your account's department.

To view charges for subscriptions that belonged to an account, go to the **Subscriptions page** in the Azure portal. The subscriptions page displays charges for all your subscription. <!-- Todo - can they go to cost analysis -->

### View charges for a subscription

You can use Azure cost analysis to view charges for a subscription. For more information, see [Explore and analyze costs with Cost analysis](../cost-management/quick-acm-cost-analysis.md).

### Create an Azure subscription

You can create Azure subscriptions for your invoice section in the Azure portal. For more information, see [Create an additional Azure subscription for Microsoft Customer Agreement](billing-mca-create-subscription.md)

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Understand billing account for a Microsoft Customer Agreement](billing-mca-overview.md)
- [Understand your invoice](billing-understand-your-bill.md)
- [Understand your bill](billing-understand-your-invoice.md)
- [Get billing ownership of Azure subscriptions from other users](billing-mca-request-billing-ownership.md)
