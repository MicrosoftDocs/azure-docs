---
title: EA tasks in a Microsoft Customer Agreement - Azure
description: Learn how to complete Enterprise Agreement tasks in your new billing account.
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 02/13/2024
ms.author: banders
---

# Complete Enterprise Agreement tasks in your billing account for a Microsoft Customer Agreement

If your organization signed a Microsoft Customer Agreement to renew your Enterprise Agreement enrollment, a new billing account is created for the agreement. The billing organization in your new account is organized differently than your Enterprise Agreement. This article describes how you can use the new billing account to perform tasks that you performed in your Enterprise Agreement.

## Billing organization in the new account

The following diagram describes how billing is organized in your new billing account.

:::image type="content" border="false" source="./media/mca-enterprise-operations/mca-post-transition-hierarchy.png" alt-text="Diagram showing the post-transition hierarchy.":::

| Enterprise Agreement   | Microsoft Customer Agreement    |
|------------------------|--------------------------------------------------------|
| Enrollment            | You use a billing profile to manage billing for your organization, similar to your Enterprise Agreement enrollment. Enterprise administrators become owners of the billing profile. For more information about billing profiles, see [Understand billing profiles](../understand/mca-overview.md#billing-profiles).
| Department            | You use an invoice section to organize your costs, similar to departments in your Enterprise Agreement enrollment. Department becomes invoice sections and department administrators become owners of the respective invoice sections. For more information about invoice sections, see [Understand invoice sections](../understand/mca-overview.md#invoice-sections). |
| Account               | The accounts that were created in your Enterprise Agreement aren't supported in the new billing account. The account's subscriptions belong to the respective invoice section for their department. Account owners can create and manage subscriptions for their invoice sections. |

## Changes for enterprise administrators

The following changes apply to enterprise administrators on an Enterprise Agreement that got renewed to a Microsoft Customer Agreement.

- A billing profile is created for the enrollment. You use the billing profile to manage billing for your organization, like your Enterprise Agreement enrollment. For more information about billing profiles, [Understand billing profiles](../understand/mca-overview.md#billing-profiles).
- An invoice section is created for each department in your Enterprise Agreement enrollment. You use the invoice sections to manage your departments. You can create new invoice sections to set up more departments. For more information about invoice sections, see [Understand invoice sections](../understand/mca-overview.md#invoice-sections).
- You use the Azure subscription creator role on invoice sections to give others permission to create Azure subscriptions, like the accounts that were created in Enterprise Agreement enrollment.
- You use the [Azure portal](https://portal.azure.com) to manage billing for your organization.

You're given the following roles on the new billing account:

**Billing profile owner** - You're assigned the billing profile owner role on the billing profile that was created when the agreement was signed. The role lets you manage the billing for your organization. You can view charges and invoices, organize costs on the invoice, manage payment methods, and control access to your organization's billing.

**Invoice section owner** - You're assigned the invoice section owner role on all invoice sections that are created for the departments in your Enterprise Agreement enrollment. The role lets you control who can create Azure subscriptions and purchase other products.

### View charges and credits balance for your organization

You use your billing profile to track charges and Azure credits balance for your organization, similar to your Enterprise Agreement enrollment.

- For more information about how to view credit balance for a billing profile, see [Track Azure credit balance for your billing profile](mca-check-azure-credits-balance.md).
- For more information about how to view charges for a billing profile, see [Understand the charges on your Microsoft Customer Agreement's invoice](../understand/review-customer-agreement-bill.md).

### View charges for a department

An invoice section is created for each department that you had in your Enterprise Agreement. You can view charges for an invoice section in the Azure portal. For more information, see [View transactions by invoice sections](../understand/review-customer-agreement-bill.md#view-transactions-by-invoice-sections).

### View charges for an account

The accounts that were created in your Enterprise Agreement enrollment aren't supported in the new billing account. Now, the account's subscriptions belong to the respective invoice section for their department. Account owners can create and manage subscriptions for their invoice sections.

To view the aggregate cost for subscriptions that belonged to an account, you must set a cost center for each subscription. Then, you can use the Azure usage and charges .csv file to filter the subscriptions by the cost center.

### Download usage and charges csv, price sheet, and tax documents

A monthly invoice is generated for each billing profile in your billing account. For each invoice, you can download the Azure usage and charges .csv file, price sheet, and tax documents (if applicable). You can also download the Azure usage and charges .csv file for the current month's charges.

- For more information about how to download the Azure usage and charges .csv file, see [Download usage for your Microsoft Customer Agreement](../understand/download-azure-daily-usage.md).
- For more information about how to download the price sheet, see [Download pricing for your Microsoft Customer Agreement](ea-pricing.md).
- For more information about how to download tax documents, see [View the tax documents for your Microsoft Customer Agreement](../understand/mca-download-tax-document.md#view-and-download-tax-documents).

### Add another enterprise administrator

You give users access to the billing profile to let them view and manage billing for your organization. You can use the **Access Control (IAM)** page in the Azure portal to give them access. 

- For more information about billing profile roles, see [Billing profile roles and tasks](understand-mca-roles.md#billing-profile-roles-and-tasks).
- For more information about how to provide access to your billing profile, see [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

### Create a new invoice section for a department

Create an invoice section to organize your costs based on your needs. Invoice sections are like departments in your old Enterprise Agreement enrollment. You can create a new invoice section in the Azure portal. For more information, see [Create sections on your invoice to organize your costs](mca-section-invoice.md).

### Create a new account

Assign users the Azure subscription creator role on invoice sections to give them permission to create Azure subscriptions. The Azure subscription creator role is similar to an Enterprise Agreement enrollment account. For more information on assigning roles, see [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal)

## Changes for department administrators

The following changes apply to department administrators on an Enterprise Agreement that got renewed to a Microsoft Customer Agreement.

- An invoice section is created for each department in your Enterprise Agreement enrollment. You use invoice sections to manage your departments. For more information about invoice sections, see [Understand invoice sections](../understand/mca-overview.md#invoice-sections).
- You use the Azure subscription creator role on the invoice section to give others permission to create Azure subscriptions. The Azure subscription creator role is like an account that was created in an Enterprise Agreement enrollment.
- You use the Azure portal to manage billing for your organization.

You're given the following roles on the new billing account:

**Invoice section owner** - You're assigned the invoice section owner role on the invoice section that's created for the departments you had in the Enterprise Agreement. The role lets you view and track charges and control who can create Azure subscriptions and buy other products for the invoice section.

### View charges for your department

You can view charges for the invoice section that's created for your department in the Azure portal's [Cost Management + Billing](https://portal.azure.com/#blade/Microsoft_Azure_Billing/ModernBillingMenuBlade/Overview) page.

### Add another department administrator

An invoice section is created for each department you had in your Enterprise Agreement. You can use the Azure portal's **Access Control(IAM)** page to give others access to view and manage the invoice section.

- For more information about invoice section roles, see [Invoice section roles and tasks](understand-mca-roles.md#invoice-section-roles-and-tasks).
- For more information about how to provide access to your invoice section, see [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

### Create a new account in your department

Assign users the Azure subscription creator role on the invoice section that's created for your department. For more information on assigning roles, see [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal)

### View charges for accounts in your departments

The accounts that were created in your Enterprise Agreement enrollment aren't supported in the new billing account. The account's subscriptions belong to the respective invoice section for their department. Account owners can create and manage subscriptions for their invoice sections.

To view the aggregate cost for subscriptions that belonged to an account in your department, you must set a cost center for each subscription. Then, you can use the Azure usage and charges file to filter the subscriptions by the cost center.

## Changes for account owners

Account owners on the Enterprise Agreement get permission to create Azure subscriptions on the new billing account. Your existing Azure subscriptions belong to the invoice section that is created for your department. If your account doesn't belong to a department, your subscriptions belong to the `Default invoice section`.

To create more Azure subscriptions, you're given the following role on the new billing account:

**Azure subscription creator** - You're assigned the Azure subscription creator role on the invoice section that is created for your department in the Enterprise Agreement. If your account doesn't belong to a department, you get the Azure subscription creator role on the `Default invoice section`. The role lets you create Azure subscriptions for the invoice section.

### Create an Azure subscription

You can create Azure subscriptions for your invoice section in the Azure portal. For more information, see [Create an another Azure subscription for Microsoft Customer Agreement](create-subscription.md)

### View charges for your account

To view charges for the subscriptions that belonged to an account, go to the [subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal. The subscriptions page displays charges for all your subscriptions.

### View charges for a subscription

You can view charges for a subscription either on the [subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) or in Cost analysis. For more information about Cost analysis, see [Explore and analyze costs with Cost analysis](../costs/quick-acm-cost-analysis.md).

> [!NOTE]
> To understand the changes that happen during migration from Enterprise Agreement to Microsoft Customer Agreement, see [Migrate from Enterprise Agreement to Microsoft Customer Agreement APIs](../costs/migrate-cost-management-api.md) .

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Understand billing account for a Microsoft Customer Agreement](../understand/mca-overview.md)
- [Understand your invoice](../understand/review-individual-bill.md)
- [Understand your bill](../understand/understand-invoice.md)
- [Get billing ownership of Azure subscriptions from other users](mca-request-billing-ownership.md)
