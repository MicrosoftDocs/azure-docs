---
title: Restore your Azure Automation deleted account
description: This article tells how to restore a deleted automation account.
services: automation
ms.service: automation
ms.subservice: process-automation
ms.date: 06/04/2021
ms.topic: conceptual 
---

# Restore a deleted Automation account

This article details on how you can recover a deleted automation account from Azure portal.

## Prerequisites

To recover a storage account, ensure that the following conditions are met:
- You've created the Automation account with the Azure Resource Manager deployment model and deleted within the past 30 days.
- Before you attempt to recover a deleted Automation account, ensure that resource group for that account exists.

> [!NOTE]
> You can't recover your Automation account if the resource group is deleted.

## Recover a deleted Automation account

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your Automation account.
1. On the **Automation Accounts** page, select **Manage deleted accounts**.
   
   :::image type="content" source="media/restore-deleted-account/automation-accounts-main-page-inline.png" alt-text="Screenshot showing the selection of Manage deleted accounts option." lightbox="media/restore-deleted-account/automation-accounts-main-page-expanded.png":::

1. In the **Manage deleted automation accounts** pane, select **Subscription** from the drop-down list.
   
   :::image type="content" source="media/restore-deleted-account/select-subscription-inline.png" alt-text="Screenshot showing the selection of subscription." lightbox="media/restore-deleted-account/select-subscription-expanded.png":::

   Deleted accounts list in that subscription is displayed.

1. Select the checkbox for the accounts you want to restore and click **Recover**.

   :::image type="content" source="media/restore-deleted-account/recover-automation-account-inline.png" alt-text="Screenshot showing the recovery of deleted Automation account." lightbox="media/restore-deleted-account/recover-automation-account-expanded.png":::

   A notification appears to confirm that account is restored.

   :::image type="content" source="media/restore-deleted-account/notification-inline.png" alt-text="Screenshot showing the notification of restoring the deleted Automation account." lightbox="media/restore-deleted-account/notification-expanded.png":::

   
## Next steps

* To create an Automation account from the Azure portal, see [Create a standalone Azure Automation account](automation-create-standalone-account.md). 
* If you prefer to create your account using a template, see [Create an Automation account using an Azure Resource Manager template](quickstart-create-automation-account-template.md).
