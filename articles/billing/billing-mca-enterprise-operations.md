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
# Complete common Enterprise Agreement tasks in your billing account for a Microsoft Customer Agreement

If your organization has signed a Microsoft Customer Agreement to renew your Enterprise Agreement enrollment, then you must set up the new billing account created for the agreement. Your new billing account provides you enhanced billing and cost management capabilities through a new streamlined, unified management experience. For more information, see [Set up your billing account for a Microsoft Customer Agreement](billing-mca-setup-account.md)

This article describes how to use your new billing account to complete tasks that you performed in your Enterprise Agreement enrollment.

## Mapping of Enterprise Agreement's billing to the new billing account

The billing in your new account is organized differently than your Enterprise Agreement enrollment. The following table explains the mapping of billing from your Enterprise Agreement enrollment to your new billing account.

| Enterprise Agreement   | Microsoft Customer Agreement    |
|------------------------|--------------------------------------------------------|
| Enrollment            | You use a billing profile to manage billing for your organization, similar to your Enterprise Agreement enrollment. Enterprise administrators become owners of the billing profile. To learn more about billing profiles, see [Understand billing profiles](billing-mca-overview.md#understand-billing-profiles).
| Department            | You use an invoice section to organize your costs based on your needs, similar to departments in your Enterprise Agreement enrollment. Department becomes invoice sections and department administrators become owners of the respective invoice sections. To learn more about invoice sections, see [Understand invoice sections](billing-mca-overview.md#understand-invoice-sections). |
| Account               | The accounts that were created in your Enterprise Agreement aren’t supported in the new billing account. The account's subscriptions belong to the respective invoice section for their department. Account owners can create and manage subscriptions for their invoice sections. |

## Tasks performed by an enterprise administrator

If you are an enterprise administrator on an Enterprise Agreement that got renewed to a Microsoft Customer Agreement, you are assigned the following roles on the new billing account created for the agreement:

**Billing profile owner** - You are assigned this role on the billing profile that was created when the agreement was signed. The role lets you manage the billing for your organization. You can view charges and invoices, organize costs on the invoice, manage payment methods, and control access to your organization's billing.

**Invoice section owner** - You are assigned this role on all invoice sections that are created for the departments in your Enterprise Agreement enrollment. The role lets you view and track charges, and control who can create Azure subscriptions and purchase other products.

### View charges and credits balance for your organization

You use your billing profile to track charges and Azure credits balance for your organization similar to your Enterprise Agreement enrollment.

To learn how to view credit balance for a billing profile, see [Track Azure credit balance for your billing profile](billing-mca-check-azure-credits-balance.md).

To learn how to view charges for a billing profile, see [Understand the charges on your billing profile's invoice](billing-understand-your-bill-mca.md).

### View charges for a department

An invoice section is created for each department you had in your Enterprise Agreement. You can view charges for an invoice section in the Azure portal. For more information, see [View charges by invoice sections](billing-understand-your-bill-mca.md#view-charges-by-invoice-section).

### View charges for an account

The accounts that were created in your Enterprise Agreement enrollment are not supported in the new billing account. The account's subscriptions belong to the respective invoice section for their department. Account owners can create and manage subscriptions for their invoice sections.

To analyze aggregate cost for subscriptions that belong to an account, you must set up cost analysis for the subscriptions. For more information, see [Set up cost analysis for subscriptions](billing-transition-enterprise-agreement#section-costanalysis).

### Download usage and charges csv, price sheet, and tax documents

A monthly invoice is generated for each billing profile in your billing account. For each invoice, you can download Azure usage and charges csv file, price sheet, and tax document (if applicable). You can also download Azure usage and charges csv file for the current month's charges.

To learn how to download Azure usage and charges csv file, see [Download or view your Azure billing invoice and daily usage data](billing-download-azure-invoice-daily-usage-date.md).

To learn how to download price sheet and tax documents, see [Download tax documents for your invoice](billing-download-azure-invoice-daily-usage-date.md).

### Add an additional enterprise administrator

Administrators in your billing account use the billing profile to manage billing for your organization. You can use the **Access Control(IAM)** page in the Azure portal to give others access to view and manage the billing profile. To learn more about billing profile roles, see [Billing profile tasks](billing-understand-mca-roles.md#billing-profile-tasks).

To learn how to provide,  access to a billing profile, see [Provide others access to your billing profile](billing-understand-mca-roles.md#billing-profile-tasks).

### Create a new department

In your new billing account, you use an invoice section to organize your costs based on your needs, similar to departments in your Enterprise Agreement enrollment. You can create a new invoice section in the Azure portal to set up Azure for a new department. To learn more, see [Organize your costs with invoice section](billing-section-invoice.md).

### Create a new account

The account billing context in your Enterprise Agreement isn't supported in the new billing account. However, you can provide Azure subscription creator role to users in your organization to allow them to create Azure subscriptions. For more information, see [Give permission to create Azure subscriptions](billing-mca-create-subscription.md#give-others-permission-to-create-azure-subscriptions).

## Tasks performed by a department administrator

If you are a department administrator on an Enterprise agreement that renewed to a Microsoft Customer Agreement, you are assigned the following roles on the new billing account:

**Invoice section owner** - You are assigned this role on all invoice sections that are created for the departments that you were an administrator on. The role lets you view and track charges, and control who can create Azure subscriptions and buy other products.

You are assigned Invoice section owner role on each invoice section that was created for the department that you had access on.

### View charges for your department

An invoice section is created for each department you had in your Enterprise Agreement. The invoice section has the same name as your department in the Enterprise Agreement. You can view charges for the invoice section in the Azure portal. For more information, see [View charges by invoice sections](billing-understand-your-bill-mca.md#view-charges-by-invoice-section).

### Add an additional department administrator

An invoice section is created for each department you had in your Enterprise Agreement. You can use the **Access Control(IAM)** page in the Azure portal to give others access to view and manage the invoice section. To learn more about invoice section roles, see [Invoice profile tasks](billing-understand-mca-roles.md#invoice-section-tasks).

To learn how to provide,  access to an invoice section, see [Provide others access to your billing profile](billing-understand-mca-roles.md#billing-profile-tasks).

### Create a new account in your department

The account billing context in Enterprise Agreement isn't supported in the new billing account. However, you can provide Azure subscription creator role to users in your organization to allow them to create Azure subscriptions. For more information, see [Give permission to create Azure subscriptions](billing-mca-create-subscription.md#give-others-permission-to-create-azure-subscriptions)

### View charges for accounts in your departments

The account billing context in Enterprise Agreement isn't supported in the new billing account. The account's subscriptions belong to the invoice section created for your department. Account owners can create and manage subscriptions for the invoice sections. To analyze aggregate cost for subscriptions that belong to an account, you must set up cost analysis for the subscriptions. For more information, see [Set up cost analysis for subscriptions](billing-transition-enterprise-agreement#section-costanalysis).

## Tasks performed by an account owner

If you are an account owner on an Enterprise Agreement that got renewed to a Microsoft Customer Agreement, you are assigned the following role on the new billing account created for the agreement:

**Azure subscription creator** - You are assigned this role on the invoice section that is created for your department in Enterprise Agreement. If your account doesn't belong to a department, your subscriptions will belong to the invoice section named Default section and you get Azure subscription creator on the section. The role lets you create Azure subscriptions for the invoice section.

### View charges for your account

The account billing context in Enterprise Agreement isn't supported in the new billing account. The account's subscriptions belong to the invoice section created for your account's department. A To analyze aggregate cost for subscriptions that belong to your account, you must set up cost analysis for the subscriptions. For more information, see [Set up cost analysis for subscriptions](billing-transition-enterprise-agreement#section-costanalysis).

### View charges for a subscription

You can use Azure cost analysis to view charges for a subscription. For more information, see [Explore and analyze costs with Cost analysis](../cost-management/quick-acm-cost-analysis.md).

### Create an Azure subscription

You can create Azure subscriptions for your invoice section in the Azure portal. For more information, see [Create an additional Azure subscription for your billing account](billing-mca-create-subscription.md)

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Understand billing account for a Microsoft Customer Agreement](billing-mca-overview.md)
- [Understand your invoice](billing-understand-your-bill.md)
- [Understand your bill](billing-understand-your-invoice.md)
- [Get billing ownership of Azure subscriptions from other users](billing-mca-request-billing-ownership.md)
