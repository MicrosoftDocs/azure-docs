---
title: Create sections on your invoice to organize your costs - Azure | Microsoft Docs
description: Learn to group charges on your invoice with invoice sections.
services: ''
author: amberbhargava
manager: amberb
editor: banders
tags: billing

ms.service: billing
ms.topic: conceptual
ms.workload: na
ms.date: 01/19/2019
ms.author: banders
---

# Create sections on your invoice to organize your costs

You can create sections on your invoice to group and organize costs by a department, development environment, or anyway you like. Then give others permission to create Azure subscriptions for the section. Any usage charges or purchases for the subscriptions then show on the invoice section. View the total charges for the section on your invoice, in the Azure portal, or review them in Azure cost analysis. For more information, see [Understanding invoice sections](billing-understand-mca-roles.md#manage-invoice-sections-for-billing-account).
<!--Todo fix the link -->

This article applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-your-access-to-a-billing-account-for-microsoft-customer-agreement).

## Create an invoice section in the Azure portal

To create an invoice section, you need to be an **Owner** or a **Contributor** on a billing profile. For more information, see [Invoice sections tasks](billing-understand-mca-roles.md#invoice-section-tasks).

1. Sign in to the [Azure portal](http://portal.azure.com).

2. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-mca-section-invoice/billing-search-costmanagement+billing.png)

3. Select **Invoice sections** from the left-hand pane. Depending on your access, you may need to select a billing profile or a billing account and then select **Invoice sections**.
    <!--Todo Add a screenshot -->

4. From the top of the page, select **Add**.

5. Enter the name of the invoice section.

   ![Screenshot that shows invoice section creation page](./media/billing-mca-section-invoice/mca-create-invoice-section.png)
   <!--Todo update the screenshot -->

6. Select **Create**.

## Check your access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Next steps

- [Create an Azure subscription for your invoice section](billing-mca-create-subscription.md)
- [Give others permission to create Azure subscription](billing-mca-create-subscription.md#give-others-permission-to-create-azure-subscriptions)
- [Request billing ownership of Azure subscriptions from users in other billing accounts](billing-mca-request-billing-ownership.md)

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
