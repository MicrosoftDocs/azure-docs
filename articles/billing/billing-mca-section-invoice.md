---
title: Segment your invoice to organize your charges | Microsoft Docs
description: Learn to segment your invoice with invoice section.
services: ''
documentationcenter: ''
author: amberbhargava
manager: amberb
editor: cwatson
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/15/2018
ms.author: cwatson

---
# Segment your invoice to organize and manage your charges

If your organization has signed a Microsoft customer agreement, you can create sections on your invoice to organize your charges. For example, you can create sections for each department or development environment.

When a section is created, you provide others access to the section. They can create Azure subscriptions or purchase other products in the section. Charges for these Azure subscriptions and products appear on the section of the invoice.
 
## Check if you have a Microsoft customer agreement

Each agreement you sign with Microsoft gives you a billing account, which lets you manage billing for that agremeent. To determine if you have signed a Microsoft customer agreement, you can check the agreement type of your billing account.

1.	Log in to the [Azure portal]( http://portal.azure.com).

2.	From left navigation area, select **Cost Management + Billing** then select **Billing account**

3.	Billing account page list all billing accounts you have access to. You have a Microsoft customer agreement, if any billing account has an agreement type **Microsoft customer agreement**.

## Create an Invoice section on the Azure portal

To create an Invoice section, you need to be a **Basic purchaser** on the billing account. To learn more, view [Understand Microsoft Customer Agreement administrative roles in Azure](http://)

This article describes how to create a new section for an invoice and provide others access to create Azure subscriptions that direct charges to the Invoice section.

## Create a new Invoice section on the Azure portal

1.	Log in to the [Azure portal]( http://portal.azure.com).

2.	From left navigation area, select **Cost Management + Billing**.

3.	Select a billing profle which has invoice that you want to section, then select **Invoice sections**.
        3a. If you have access to just one billing profile, you'll see the overview page of that billing profile. Select **Invoice sections** from the left navigation area.
        3b. If you have access to multiple billing profiles, select a billing profile then select **Invoice sections** from the left navigation area.
        3c. If you have access to a billing account, select **Billing profiles** from the left navigation area. Select a billing profile from the list and then select **Invoice sections** from the left navigation area.

5.  From the top of the page, select **Add**.

6.  Enter the name of the invoice section. 
![Screenshot that shows invoice section creation page](./media/billing-check-usage-of-free-services/subscription-cost-information.png)

7.	Select **Create**.


## Provide users access to create Azure subscriptions

1.	Log in to the [Azure portal]( http://portal.azure.com).

2.	From left navigation area, select **Cost Management + Billing**.

3.	Select the Invoice section to provide access, then select **Access Management (IAM)**.
        3a. If you have access to just one Invoice section, you'll see the overview page of that Invoice section. Select **Access Management (IAM)** from the left navigation area.
        3b. If you have access to multiple Invoice sections, select an Invoice section then select **Access Management (IAM)** from the left navigation area.
        3c. If you have access to a Billing profile, select the Billing profile. Select **Invoice sections** from the left navigation area. Select the desired Invoice section and then select **Access Management (IAM)** from the left navigation area. 
        3c. If you have access to a billing account, select **Invoice sections** from the left navigation area. Select the desired Invoice section and then select **Access Management (IAM)** from the left navigation area.

4.  From the top of the page, select **Add**.

5.  Select **Azure subscription creator** for role and enter the email address of the user.
![Screenshot that shows adding a user on an Invoice section](./media/billing-check-usage-of-free-services/select-free-account-subscription.png)

6.  Select **Save**. 


## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
