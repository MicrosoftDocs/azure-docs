---
title: Add a preview audience for a Managed Service offer
description: Add a preview audience for a Managed Service offer in Azure Marketplace.
author: Microsoft-BradleyWright
ms.author: brwrigh
ms.reviewer: anbene
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 7/16/2021
---

# Add a preview audience for a Managed Service offer

This article describes how to configure a preview audience for a Managed Service offer in the commercial marketplace using Partner Center. The preview audience can review your offer before it goes live.

## Define a preview audience

On the **Preview audience** page, you can define a limited audience who can review your Managed Service offer before you publish it live to the broader marketplace audience. You define the preview audience using Azure subscription IDs, along with an optional description for each. Neither of these fields can be seen by customers. You can find your Azure subscription ID on the **Subscriptions** page on the Azure portal.

Add at least one Azure subscription ID, either individually (up to 10) or by uploading a CSV file (up to 100) to define who can preview your offer before it’s published live. If your offer is already live, you may still define a preview audience for testing updates to your offer.

> [!NOTE]
> A *preview* audience differs from a *private* audience. A preview audience is allowed access to your offer before it's published live in the online stores. They can see and validate all plans, including those which will be available only to a private audience after your offer is fully published in the marketplace. You can make a plan available only to a private audience. A private audience (defined in a plan’s Availability tab) has exclusive access to a particular plan.

## Add email addresses manually

1. On the **Preview audience** page, add a single Azure subscription ID and an optional description in the boxes provided.
2. To add another email address, select the **Add ID (Max 10)** link.
3. Select **Save draft** before continuing to the next tab.

## Add email addresses using a CSV file

1. On the **Preview audience** page, select the **Export Audience (csv)** link.
2. Open the CSV file. In the **Id** column, enter the Azure subscription IDs you want to add to the preview audience.
3. In the **Description** column, you have the option to add a description for each entry.
4. In the **Type** column, add **SubscriptionId** to each row that has an ID.
5. Save the file as a CSV file.
6. On the **Preview audience** page, select the **Import Audience (csv)** link.
7. In the **Confirm** dialog box, select **Yes**, then upload the CSV file.

Select **Save draft** before continuing to the next tab, **Plan overview**.

## Next steps

* [Create plans](create-managed-service-offer-plans.md)
