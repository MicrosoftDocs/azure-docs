---
title: Get started with Microsoft Customer Agreement billing account - Azure
description: Learn about your Microsoft Customer Agreement billing account, including billing profiles and invoice payment methods.
author: bandersmsft
ms.reviewer: amberbhargava
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 08/29/2023
ms.author: banders
---

# Get started with your Microsoft Customer Agreement billing account

A billing account is created when you sign up to use Azure. You use your billing account to manage invoices, payments, and track costs. You can have access to multiple billing accounts. For example, you might have signed up for Azure for your personal projects. You could also have access to Azure through your organization's Enterprise Agreement or Microsoft Customer Agreement. For each of these scenarios, you would have a separate billing account.

This article applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement).

## Your billing account

Your billing account for the Microsoft Customer Agreement contains one or more billing profiles that let you manage your invoices and payment methods. Each billing profile contains one or more invoice sections that let you organize costs on the billing profile's invoice.

The following diagram shows the relationship between a billing account, billing profiles, and invoice sections.

:::image type="content" border="false" source="./media/mca-overview/mca-billing-hierarchy.png" alt-text="Diagram showing the Microsoft Customer Agreement billing hierarchy.":::

Roles on the billing account have the highest level of permissions. By default, only the user who signed up for Azure gets access to the billing account. These roles should be assigned to users that need to view invoices, and track costs for your entire organization like finance or IT managers. For more information, see [billing account roles and tasks](../manage/understand-mca-roles.md#billing-account-roles-and-tasks).

## Billing profiles

Use a billing profile to manage your invoice and payment methods. A monthly invoice is generated at the beginning of the month for each billing profile in your account. The invoice contains respective charges for all Azure subscriptions and other purchases from the previous month.

A billing profile is automatically created for your billing account. It contains one invoice section by default. You may create more sections to easily track and organize costs based on your needs whether is it per project, department, or development environment. The sections are shown on the billing profile's invoice reflecting the usage of each subscription and purchases you've assigned to it.

Roles on the billing profiles have permissions to view and manage invoices and payment methods. Assign these roles to users who pay invoices like members of the accounting team in your organization. For more information, see [billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).


### Each billing profile gets a monthly invoice

A monthly invoice is generated at the beginning of the month for each billing profile. The invoice contains all charges from the previous month.

You can view the invoice, download documents and the change setting to get future invoices by email, in the Azure portal. For more information, see [download invoices for a Microsoft Customer Agreement](../manage/download-azure-invoice-daily-usage-date.md#download-invoices-for-a-microsoft-customer-agreement).

If an invoice becomes overdue, past-due email notifications are only sent to users with role assignments on the overdue billing profile. Ensure that users who should receive overdue notifications have one of the following roles:

- Billing profile owner
- Billing profile contributor
- Invoice manager

### Invoice payment methods

Each billing profile has its own payment methods that are used to pay its invoices. The following payment methods are supported:

| Type             | Definition  |
|------------------|-------------|
|Azure credits    |  Credits are automatically applied to the eligible charges on your invoice, reducing the amount that you need to pay. For more information, see [track Azure credit balance for your billing profile](../manage/mca-check-azure-credits-balance.md). |
|Wire transfer | If your account is approved for payment through wire transfer, you can pay the amount due for your invoice with a wire transfer. The instructions for payment are given on the invoice. |
|Credit card | Customers who sign up for Azure through the Azure website can pay through a credit card. |

### Apply policies to control purchases

Apply policies to control Azure Marketplace and Reservation purchases using a billing profile. You can set policies to disable purchase of Azure Reservations and Marketplace products. When the policies are applied, subscriptions that are billed to the billing profile can't be used to make these purchases.

### Azure plans determine pricing and service level agreement for subscriptions

Azure plans determine the pricing and service level agreements for Azure subscriptions. They're automatically enabled when you create a billing profile. All invoice sections that are associated with the billing profile can use these plans. Users with access to the invoice section use the plans to create Azure subscriptions. The following Azure plans are supported in billing accounts for Microsoft Customer Agreement:

| Plan             | Definition  |
|------------------|-------------|
|Microsoft Azure Plan   | Allow users to create subscriptions that can run any workloads.  |
|Microsoft Azure Plan for Dev/Test | Allow Visual Studio subscribers to create subscriptions that are restricted for development or testing workloads. These subscriptions get benefits such as lower rates and access to exclusive virtual machine images in the Azure portal. Azure Plan for DevTest is only available for Microsoft Customer Agreement customers who purchase through a Microsoft Sales representative. |

## Invoice sections

Create invoice sections to organize the costs on your invoice. For example, you may need a single invoice for your organization but want to organize costs by department, team, or project. For this scenario, you have a single billing profile where you create an invoice section for each department, team, or project.

When an invoice section is created, you can give others permission to create Azure subscriptions that are billed to the section. Any usage charges and purchases for the subscriptions are then billed to the section.

Roles on the invoice section have permissions to control who creates Azure subscriptions. Assign these roles to users who set up Azure environment for teams in our organization like engineering leads and technical architects. For more information, see [invoice section roles and tasks](../manage/understand-mca-roles.md#invoice-section-roles-and-tasks).

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Need help? Contact support.

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

See the following articles to learn about your billing account:

- [Understand Microsoft Customer Agreement administrative roles in Azure](../manage/understand-mca-roles.md)
- [Create an additional Azure subscription for Microsoft Customer Agreement](../manage/create-subscription.md)
- [Create sections on your invoice to organize your costs](../manage/mca-section-invoice.md)
