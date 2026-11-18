---
title: Configuration deviation notifications
titleSuffix: Azure Workload Center for Oracle
description: Learn how to set up configuration deviation notifications for an Oracle workload and act on them.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: how-to
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Configuration deviation notifications

In this article, you learn how to set up configuration deviation notifications for a WVI and how to act on them. For how notifications work, see [Configuration validation](configuration-validation.md). The **Deviation alert** field on the WVI **Overview** page shows whether notifications are active.

## Prerequisites

- You need an Azure Monitor action group that contains the email addresses of the recipients. You can select an existing action group or create one.

> [!TIP]  
> Use a distribution list as the recipient, so that notifications keep reaching the right people when roles change.

## Configure notification recipients

1.  Open the WVI. On the **Overview** page, under **Workload validation**, find **Deviation alert**.

:::image type="content" source="media/configuration-deviation-notifications/deviation-alert-disabled.png" alt-text="Screenshot that shows the Overview page of a WVI with the Deviation alert field set to Disabled." lightbox="media/configuration-deviation-notifications/deviation-alert-disabled.png":::

2.  Select the **Deviation alert** value, such as **Disabled**. The **Set deviation notification** pane opens.

3.  Select **Enable notifications**.

4.  For **Notification level**, select **Default (Recommended)** to get notified about high-impact deviations, or **All deviations** to get notified about every new deviation.

5.  For **Action group**, select an existing action group, or select **Create new**.

6.  If you create an action group, on the **Notifications** tab, select **Email/SMS message/Push/Voice**, select **Email**, and enter the recipient address. Repeat for each recipient. Select **Review + create**, and then select **Create**.

7.  Select **Apply**.

:::image type="content" source="media/configuration-deviation-notifications/set-deviation-notification.png" alt-text="Screenshot that shows the Set deviation notification pane with notifications enabled, the notification level, and an action group." lightbox="media/configuration-deviation-notifications/set-deviation-notification.png":::

For more information, see [Create and manage action groups in the Azure portal](/azure/azure-monitor/alerts/action-groups).

## Act on a notification

1.  Open the notification email. It lists the new deviations and links to the full list in the portal.

2.  Select the link. The **Check results** page of the WVI opens.

3.  Open a deviation and select **Click here for more suggestions** to get resolution steps from the Azure Copilot Run Oracle Agent.

4.  Apply the fix. The next hourly validation run checks the configuration again.

5.  When the check passes, the deviation clears. If your notification profile includes **Deviation resolved** notifications, you also get one.

Each notification email has an option to unsubscribe.
