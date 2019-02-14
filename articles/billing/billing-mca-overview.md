---
title: Get started with your billing account for Microsoft Customer Agreement - Azure | Microsoft Docs
description: Understand billing account for Microsoft Customer Agreement
services: 'billing'
documentationcenter: ''
author: amberbhargava
manager: amberbhargava
editor: banders

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/30/2019
ms.author: banders    
---

# Get started with your billing account for Microsoft Customer Agreement

Use your billing account to organize billing and track costs for your agreement. A billing account is created for each agreement you sign with Microsoft.

This article applies to billing accounts for Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-your-access-to-a-billing-account-for-microsoft-customer-agreement).

## Understand billing account

Your billing account for the Microsoft Customer Agreement contains one or more billing profiles. Each billing profile has its own invoice and payment methods to pay the invoice. The billing profile contains one or more invoice sections that let you group charges on its invoice.

The following diagram shows the relationship between a billing account, the billing profiles, and invoice sections.

![Diagram that shows billing hierarchy for Microsoft Customer Agreement](./media/billing-mca-overview/mca-billing-hierarchy.png)
<!--- TODO - Update the info graphic -->

Roles on the billing account have the highest level of permissions. Assign these roles to users that need to view and manage costs or organize billing for the agreement like finance or IT managers in your organization. For more information, see [Billing account tasks](billing-understand-mca-roles.md#billing-account-tasks).

## Understand billing profiles

Use the billing profile to control your purchases and customize your invoice. You can apply policies on the billing profile to control purchases such as Azure reservations and Marketplace products. A monthly invoice is generated for the products bought using the billing profile. You can customize the invoice such as update the purchase order number and email invoice preference.

A billing profile is automatically created for your billing account. You can create new billing profiles to set up additional invoices. For example, you may want different invoices for each department or project in your organization.

Roles on the billing profiles have permissions to control purchases, and view and manage invoices. Assign these roles to users who track, organize, and pay invoices like members of the procurement team in your organization. For more information, see [Billing profile tasks](billing-understand-mca-roles.md#billing-profile-tasks).

### Charges include all invoice sections

You create invoice sections to group charges on a billing profile's invoice. Charges for Azure subscriptions and products bought for an invoice section show up on the section. The billing profile shows the aggregated charges for all invoice sections.

### Monthly invoice generated for each billing profile

A monthly invoice is generated on the invoice date for each billing profile. You can find the invoice date for your billing profile in the Azure portal. For more information, see [Understand your bill for Microsoft Azure](billing-understand-your-bill.md).<!--- TODO - Update the link to invoice doc --> The invoice contains all charges for a billing month.

You can use the Azure portal to view your invoices, download documents for your invoice and set up email invoices preference. For more information, see [Understand your bill for Microsoft Azure](billing-understand-your-bill.md).
<!--- TODO - Update the link to the mca section of invoice doc -->

### Invoices paid through payment methods

Each billing profile has its own payment methods that are used to pay its invoices. Billing profiles support the following payment methods:

| Type             | Definition  |
|------------------|-------------|
|Azure credits    |  Credits are automatically applied to the total billed amount on your invoice to calculate the amount due. For more information, see [Track Azure credit balance for your billing profile](billing-mca-check-azure-credits-balance.md). |
|Check or wire transfer | You can pay the amount due for your invoice either through check or wire transfer. The instructions for check or wire transfer are given on the invoice |

### Policies are applied to control purchases

Apply policies to control purchases made using a billing profile. You can set up policies to disable purchase of Azure reservations and Marketplace products. When the policies are applied, subscriptions created for the invoice sections in the billing profile can't be used to purchase Azure reservations and Marketplace products.

### Azure plans enable subscription creation

You enable Azure plans when you create a billing profile. All invoice sections in the billing profile get access to these plans. Users with access to the invoice section use the plans to create Azure subscriptions. They can't create Azure subscriptions unless an Azure plan is enabled for the billing profile. The following Azure plans are supported in the billing accounts for Microsoft Customer Agreement:

| Plan             | Definition  |
|------------------|-------------|
|Microsoft Azure Plan   | Allow users to create subscriptions that can run any workloads | <!--- TODO - Add the link to plan details page -->
|Microsoft Azure Plan for Dev/Test | Allow users to create subscriptions that are restricted for development or testing workloads. These subscriptions get benefits such as lower rates and access to exclusive virtual machine images in the Azure portal | <!--- TODO - Add the link to plan details page -->

## Understand invoice sections

Use invoice section to organize your costs. An invoice section is automatically created for each billing profile in your billing account. You can create new invoice sections to group charges on your invoice. For example, you may need a single invoice for your organization but want to group charges by each department, team, or project. For this scenario, you have a single billing profile where you create an invoice section for each department, team, or project.

Roles on the invoice section have permissions to create Azure subscriptions, make purchases and manage costs for the invoice section. Assign these roles to users who set up Azure environment for teams in our organization like engineering leads and technical architects. For more information, see [Invoice section tasks](billing-understand-mca-roles.md#invoice-section-tasks).

Users with access to an invoice section create Azure subscriptions and purchase other products like Azure Reservations for the section. Charges for these subscriptions and products show up on the invoice section.

## Check your access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Next steps

See the following articles to learn about your billing account:

- [Create sections on your invoice to organize your costs](billing-mca-section-invoice.md)
- [Create an additional subscription](billing-mca-create-subscription.md)
- [Give others permission to create Azure subscriptions](billing-mca-create-subscription.md#give-others-permission-to-create-azure-subscriptions)

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.