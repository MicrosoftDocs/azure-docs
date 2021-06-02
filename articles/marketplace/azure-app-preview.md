---
title: Add a preview audience for an Azure Application offer
description: Add a preview audience for an Azure application offer in Partner Center (Azure Marketplace).
author: aarathin
ms.author: aarathin
ms.reviewer: dannyevers
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 06/01/2021
---

# Add a preview audience for an Azure Application offer

This article describes how to configure a preview audience for an Azure Application offer in the commercial marketplace. You need to define a preview audience who can review your offer listing before it goes live.

## Define a preview audience

On the **Preview audience** page, you can define a limited audience who can review your Azure Application offer before you publish it live to the broader marketplace audience. You define the preview audience using Azure subscription IDs, along with an optional description for each. Neither of these fields can be seen by customers. You can find your Azure subscription ID on the **Subscriptions** page in Azure portal.

Add a minimum of one and up to 10 Azure subscription IDs, either individually (up to 10) or by uploading a CSV file (up to 100) to define who can preview your offer before it is published live. If your offer is already live, you may still define a preview audience for testing offer changes or updates to your offer.

> [!NOTE]
> A preview audience differs from a private audience. A preview audience is allowed access to your offer before it's published live in the online stores. They can see and validate all plans, including those which will be available only to a private audience after your offer is fully published to the marketplace. You can make a plan available only to a private audience. A private audience (defined in a plan’s **Availability** tab) has exclusive access to a particular plan.

### Add subscription IDs manually

1. On the **Preview audience** page, add a single Azure Subscription ID and an optional description in the boxes provided.
1. To add another ID, select the **Add ID (Max 10)** link.
1. Select **Save draft** before continuing to the next tab: Technical configuration.
1. Go to [Next steps](#next-steps).

### Add subscription IDs with a CSV file

1. On the **Preview Audience** page, select the **Export Audience (csv)** link.
1. Open the .CSV file in a suitable application such as Microsoft Excel.
1. In the .CSV file, in the **ID** column, enter the Azure Subscription IDs you want to add to the preview audience.
1. In the **Description** column, you can optionally add a description for each email address.
1. For each Subscription ID you enter in column B, enter a **Type** in column A of "SubscriptionID".
1. Save as a .CSV file.
1. On the **Preview audience** page, select the **Import Audience (csv)** link.
1. In the **Confirm** dialog box, select **Yes**.
1. Select the .CSV file and then **Open**.
1. Select **Save draft** before continuing to the next tab: Technical configuration.

## Next steps

- [Add technical details to this offer](azure-app-technical-configuration.md)
