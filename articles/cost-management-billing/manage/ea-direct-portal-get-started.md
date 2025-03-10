---
title: Get started with your Enterprise Agreement billing account
description: This article explains how Azure Enterprise Agreement (Azure EA) customers can use the Azure portal to manage their billing.
author: bandersmsft
ms.reviewer: sapnakeshari
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 01/22/2025
ms.author: banders
---

# Get started with your Enterprise Agreement billing account

>[!NOTE]
> On February 15, 2024, the [EA portal](https://ea.azure.com) retired. It's now read only. All EA customers and partners use Cost Management + Billing in the Azure portal to manage their enrollments.

This article helps direct and indirect Azure Enterprise Agreement (Azure EA) customers with their billing administration on the [Azure portal](https://portal.azure.com). Get basic information about:

- Roles used to manage the Enterprise billing account in the Azure portal
- Subscription creation
- Cost analysis in the Azure portal

We have several videos that walk you through getting started with the Azure portal for Enterprise Agreements. Check out the series at [Enterprise Customer Billing Experience in the Azure portal](https://www.youtube.com/playlist?list=PLeZrVF6SXmsoHSnAgrDDzL0W5j8KevFIm).

Here's the first video.

>[!VIDEO https://www.youtube.com/embed/sfJyTZZ6RxQ]

## Understanding EA user roles and introduction to user hierarchy

To help manage your organization's usage and spend, Azure Enterprise Agreement (EA) administrators can assign the following distinct administrative roles:

- Enterprise Administrator
- Enterprise Administrator (read only)
- Department Administrator
- Department Administrator (read only)
- Account Owner

Each role has a varying degree of user limits and permissions. For more information, see [Organization structure and permissions by role](understand-ea-roles.md#organization-structure-and-permissions-by-role).

## Activate your enrollment, create a subscription, and other administrative tasks

For more information about activating your enrollment, creating a department or subscription, adding administrators and account owners, and other administrative tasks, see [Azure EA billing administration](direct-ea-administration.md).

If you’d like to know more about transferring an Enterprise subscription to a pay-as-you-go subscription, see [Azure Enterprise transfers](ea-transfers.md).

## View your enterprise department and account lists

If you’d like to view all the departments and accounts in your billing account, use the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the navigation menu, select **Department** or **Account** to view its details.

## View usage summary and download reports

You view a summary of your usage data, Azure Prepayment consumed, and charges associated with other usage in the Azure portal. Charges are presented at the summary level across all accounts and subscriptions of the enrollment.
To view a usage summary, price sheet, and download reports, see [Review usage charges](direct-ea-azure-usage-charges-invoices.md#review-usage-charges).

## View and download invoice

As a direct EA customer, you can view and download your Azure EA invoice in the Azure portal. It's a self-serve capability and an EA admin of a direct EA enrollment has access to manage invoices. Your invoice is a representation of your bill and should be reviewed for accuracy. For more information, see [Download or view your Azure billing invoice](direct-ea-azure-usage-charges-invoices.md#download-or-view-your-azure-billing-invoice).

## Azure Prepayment and unbilled usage

Azure Prepayment, previously called monetary commitment, is an amount paid up front for Azure services. The Azure Prepayment is consumed as services are used. First-party Azure services are billed against the Azure Prepayment. However, some charges are billed separately, and Azure Marketplace services don't consume Azure Prepayment.

For more information about paying overages with Azure Prepayment, see [Pay your overage with your Azure Prepayment](direct-ea-administration.md#pay-your-overage-with-azure-prepayment).

## View Microsoft Azure Consumption Commitment (MACC)

You view and track your Microsoft Azure Consumption Commitment (MACC) in the Azure portal. If your organization has a MACC for an EA billing account, you can check important aspects of your commitment, including start and end dates, remaining commitment, and eligible spend in the Azure portal. For more information, see [MACC overview](track-consumption-commitment.md?tabs=portal.md#track-your-macc-commitment).

## Now that you're familiar with the basics, here are some more links to help you get onboarded

[Azure EA pricing](./ea-pricing-overview.md) provides details about how usage is calculated. It also explains how charges for various Azure services in the Enterprise Agreement, where the calculations are more complex.

If you'd like to know about how Azure reservations for virtual machine (VM) reserved instances can help you save money with your enterprise enrollment, see [Azure EA VM reserved instances](ea-portal-vm-reservations.md).


[Azure EA agreements and amendments](./ea-portal-agreements.md) describes how Azure EA agreements and amendments might affect your access, use, and payments for Azure services.

[Azure Marketplace](./ea-azure-marketplace.md) explains how EA customers and partners can view marketplace charges and enable Azure Marketplace purchases.

For explanations about the common tasks that a partner EA administrator accomplishes in the Azure portal, see [EA billing administration for partners in the Azure portal](ea-billing-administration-partners.md).

## Related content

- Read the [Cost Management + Billing FAQ](../cost-management-billing-faq.yml) for questions and answers about getting started with the EA billing administration.
- Azure Enterprise administrators should read [Azure EA billing administration](direct-ea-administration.md) to learn about common administrative tasks.
