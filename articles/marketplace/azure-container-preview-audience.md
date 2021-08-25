---
title: Set the preview audience for an Azure Container offer in Microsoft AppSource.
description: Set the preview audience for an Azure Container offer in Microsoft AppSource.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: keferna
ms.author: keferna
ms.date: 03/30/2021
---

# Set the preview audience for an Azure Container offer

This article describes how to configure a preview audience for an Azure Container offer in the commercial marketplace using Partner Center. The preview audience can review your offer before it goes live.

## Define a preview audience

On the **Preview audience** page, define a limited audience who can review your Container offer before you publish it live to the broader marketplace audience. You define the preview audience using Azure subscription IDs, along with an optional description for each. Neither of these fields can be seen by customers. You can find your Azure subscription ID on the **Subscriptions** page on the Azure portal.

Add at least one Azure subscription ID, either individually (up to 10) or by uploading a CSV file (up to 100) to define who can preview your offer. If your offer is already live, you may still define a preview audience for testing updates to your offer.

## Add email addresses manually

1. On the **Preview audience** page, add a single Azure subscription ID and an optional description in the boxes provided.
1. To add another email address, select the **Add ID (Max 10)** link.
1. Select **Save draft** before continuing to the next tab to set up plans.

## Add email addresses using a CSV file

1. On the **Preview audience** page, select the **Export Audience (csv)** link.
1. Open the CSV file. In the **Id** column, enter the Azure subscription IDs you want to add to the preview audience.
1. In the **Description** column, you have the option to add a description for each entry.
1. In the **Type** column, add **SubscriptionId** to each row that has an ID.
1. Save the file as a CSV file.
1. On the **Preview audience** page, select the **Import Audience (csv)** link.
1. In the **Confirm** dialog box, select **Yes**, then upload the CSV file.
1. Select **Save draft** before continuing to the next tab to set up plans.

> [!IMPORTANT]
> After you view your offer in Preview, you must select **Go live** to publish your offer to the public.

## Next steps

- [Create and manage plans](azure-container-plan-overview.md)
