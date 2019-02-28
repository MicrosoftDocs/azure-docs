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

Use your billing account to manage billing and track costs for your organization. A billing account is created for each agreement you sign with Microsoft.

This article applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-your-access-to-a-microsoft-customer-agreement).

## Understand billing account

Your billing account for the Microsoft Customer Agreement contains one or more billing profiles. Each billing profile has its own invoice and payment methods to pay the invoice. The billing profile contains one or more invoice sections that let you organize costs on the billing profile's invoice.

The following diagram shows the relationship between a billing account, the billing profiles, and invoice sections.

![Diagram that shows billing hierarchy for Microsoft Customer Agreement](./media/billing-mca-overview/mca-billing-hierarchy.png)
<!--- TODO - Update the info graphic -->

Roles on the billing account have the highest level of permissions. Assign these roles to users that need to view and manage invoices, track costs and give others permission to billing profiles and invoice sections like finance or IT managers in your organization. For more information, see [Billing account roles and tasks](billing-understand-mca-roles.md#billing-account-roles-and-tasks).

## Understand billing profiles

Use a billing profile to manage your invoice and payment methods. A monthly invoice is generated for the Azure subscriptions and other products purchased using the billing profile. You use the payments methods to pay the invoice.

A billing profile is automatically created for your billing account. You can create new billing profiles to set up additional invoices. For example, you may want different invoices for each department or project in your organization.

You can also create invoice sections to group charges on a billing profile's invoice. Charges for Azure subscriptions and products purchased for an invoice section show up on the section. The billing profile shows the aggregated charges for all invoice sections.

Roles on the billing profiles have permissions to view and manage invoices and payment methods. Assign these roles to users who pay invoices like members of the accounting team in your organization. For more information, see [Billing profile roles and tasks](billing-understand-mca-roles.md#billing-profile-roles-and-tasks).

### Monthly invoice generated for each billing profile

A monthly invoice is generated on the invoice date for each billing profile. The invoice contains all charges for previous month.

You can use the Azure portal to view your invoices, download documents for an invoice and change setting to get invoices by email. For more information, see [Get your invoice in email](billing-download-azure-invoice-daily-usage-date.md#get-your-invoice-in-email-pdf)

### Invoices paid through payment methods

Each billing profile has its own payment methods that are used to pay its invoices. The following payment methods are supported:

| Type             | Definition  |
|------------------|-------------|
|Azure credits    |  Credits are automatically applied to the total billed amount on your invoice to calculate the amount due. For more information, see [Track Azure credit balance for your billing profile](billing-mca-check-azure-credits-balance.md). |
|Check or wire transfer | You can pay the amount due for your invoice either through check or wire transfer. The instructions for check or wire transfer are given on the invoice |

### Control Azure Marketplace and Reservation purchases by applying policies

Apply policies to control purchases made using a billing profile. You can set up policies to disable purchase of Azure reservations and Marketplace products. When the policies are applied, subscriptions created for the invoice sections in the billing profile can't be used to purchase Azure reservations and Marketplace products.

### Allow users to create Azure subscriptions

Azure plans are automatically enabled when you create a billing profile. All invoice sections in the billing profile get access to these plans. Users with access to the invoice section use the plans to create Azure subscriptions. They can't create Azure subscriptions unless an Azure plan is enabled for the billing profile. The following Azure plans are supported in the billing accounts for Microsoft Customer Agreement:

| Plan             | Definition  |
|------------------|-------------|
|Microsoft Azure Plan   | Allow users to create subscriptions that can run any workloads | <!--- TODO - Add the link to plan details page -->
|Microsoft Azure Plan for Dev/Test | Allow users to create subscriptions that are restricted for development or testing workloads. These subscriptions get benefits such as lower rates and access to exclusive virtual machine images in the Azure portal | <!--- TODO - Add the link to plan details page -->

## Understand invoice sections

Create invoice sections to organize costs on your invoice. An invoice section is automatically created for each billing profile in your billing account. You can create additional invoice sections to group charges on your invoice. For example, you may need a single invoice for your organization but want to group charges by each department, team, or project. For this scenario, you have a single billing profile where you create an invoice section for each department, team, or project.

Roles on the invoice section have permissions to control who creates Azure subscriptions for an invoice section. Assign these roles to users who set up Azure environment for teams in our organization like engineering leads and technical architects. For more information, see [Invoice section roles and tasks](billing-understand-mca-roles.md#invoice-section-roles-and-tasks).

Users with access to an invoice section create Azure subscriptions and purchase other products like Azure Reservations for the section. Charges for these subscriptions and products show up on the invoice section.

## Check your access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

See the following articles to learn about your billing account:

- [Understand Microsoft Customer Agreement administrative roles in Azure](billing-understand-mca-roles.md)
- [Create an Azure subscription for your billing account for Microsoft Customer Agreement](billing-mca-create-subscription.md)
- [Organize costs with invoice sections](billing-mca-section-invoice.md)