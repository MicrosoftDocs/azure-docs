---
title: Create sections on your invoice to group your charges | Microsoft Docs
description: Learn to group charges on your invoice with invoice section.
services: ''
author: amberbhargava
manager: amberb
editor: cwatson
tags: billing

ms.service: billing
ms.topic: conceptual
ms.workload: na
ms.date: 01/19/2019
ms.author: cwatson
---

# Create sections on your invoice to group your charges

You can create sections on your invoice to group and organize your charges. For example, you can create sections for each department or development environment.

You provide others permissions to the section. They can create Azure subscriptions or purchase other products. Charges for these subscriptions and products are applied to the section. You can view the total charges for the section on your invoice, on Azure portal or analyze them through Azure cost analysis.

This article describes how to create a new invoice section and give others permissions to create Azure subscriptions that apply charges to the section.

This article applies to Billing account for a Microsoft Customer Agreement. [Check if you have a Microsoft Customer Agreement](#check-your-access-to-a-billing-account-for-microsoft-customer-agreement).

## Create an invoice section in the Azure portal

To create an invoice section, you need to be a **Basic purchaser** on the Billing account. [Learn more](billing-understand-mca-roles.md#manage-invoice-sections-for-billing-account)

1. Sign in to the [Azure portal]( http://portal.azure.com).

2. Select **Cost Management + Billing** from the lower-left side of the portal.

3. Select **Invoice sections** from the left-hand pane. Depending on your access, you may need to select a Billing account or a Billing profile and then select **Invoice sections**

4. From the top of the page, select **Add**.

5. Enter the name of the invoice section.

   ![Screenshot that shows invoice section creation page](./media/billing-mca-section-invoice/mca-create-invoice-section.png)

6. Select a Billing profile for the invoice section. Your invoice section will appear on the selected Billing profile's invoice.

7. Select **Create**.

## Give others permission to create Azure subscriptions in the invoice section

1. Sign in to the [Azure portal]( http://portal.azure.com).

2. Select **Cost Management + Billing** from the lower-left side of the portal.

3. Go to the invoice section. Depending on your access, you may need to select a Billing account or a Billing profile, select **Invoice sections** and then select an invoice section.

4. Select **Access Management (IAM)** from the left-hand pane.

5. From the top of the page, select **Add**.

6. Select **Azure subscription creator** for role and enter the email address of the user.
  <!--TODO - Add screenshot for the IAM blade >

7. Select **Save**.

## Check your access to a Billing account for Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
