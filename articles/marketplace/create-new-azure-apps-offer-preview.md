---
title: How to add a preview audience for your Azure Application offer to your Azure Application offer
description: Learn how to add a preview audience for your Azure application offer in Partner Center.
author: aarathin
ms.author: aarathin
ms.reviewer: dannyevers
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 11/06/2020
---

# How to add a preview audience for your Azure Application offer to your Azure Application offer

This article describes how to configure a preview audience for an Azure Application offer in the commercial marketplace. You need to define a preview audience who can review your offer listing before it goes live.

## Define a preview audience

On the **Preview audience** page, you can define a limited audience who can review your Azure Application offer before you publish it live to the broader marketplace audience. You define the preview audience using Azure subscription IDs, along with an optional description for each. Neither of these fields can be seen by customers. You can find your Azure subscription ID on the **Subscriptions** page in Azure portal.

Add a minimum of one and up to 10 Azure subscription IDs, either individually (up to 10) or by uploading a CSV file (up to 100) to define who can preview your offer before it is published live. If your offer is already live, you may still define a preview audience for testing offer changes or updates to your offer.

> [!NOTE]
> A preview audience differs from a private audience. A preview audience is allowed access to your offer before it's published live in the online stores. They can see and validate all plans, including those which will be available only to a private audience after your offer is fully published to the marketplace. You can make a plan available only to a private audience. A private audience (defined in a plan’s **Availability** tab) has exclusive access to a particular plan.

### Add email addresses manually

1. On the **Preview audience** page, add a single Azure Subscription ID and an optional description in the boxes provided.
1. To add another email address, select the **Add ID (Max 10)** link.
1. Select **Save draft** before continuing to the next tab: Technical configuration.
1. Go to [Next steps](#next-steps).

### Add email addresses using the CSV file

1. On the **Preview audience** page, select the **Export Audience (csv)** link.
1. Open the .CSV file in an application, such as Microsoft Excel.
1. In the .CSV file, in the **ID** column, enter the Azure Subscription IDs you want to add to the preview audience.
1. In the **Description** column, you can optionally add a description for each email address.
1. In the **Type** column, add **SubscriptionID** to each row that has an email address.
1. Save the file as a .CSV file.
1. On the **Preview audience** page, select the **Import Audience (csv)** link.
1. In the **Confirm** dialog box, select **Yes**.
1. Select the .CSV file and then select **Open**.
1. Select **Save draft** before continuing to the next tab: Technical configuration.

## Next steps

- [How to add technical details for your Azure Application offer](create-new-azure-apps-offer-technical.md)
