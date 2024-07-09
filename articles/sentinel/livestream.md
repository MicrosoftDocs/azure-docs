---
title: Detect threats by using hunting livestream in Microsoft Sentinel 
description: Learn how to use hunting livestream in Microsoft Sentinel to actively monitor a compromise event.
ms.topic: how-to
ms.date: 04/24/2024
ms.author: austinmc
author: austinmccollum
ms.collection: usx-security
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
---

# Detect threats by using hunting livestream in Microsoft Sentinel

Use hunting livestream to create interactive sessions that let you test newly created queries as events occur, get notifications from the sessions when a match is found, and launch investigations if necessary. You can quickly create a livestream session using any Log Analytics query.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Create a livestream session

You can create a livestream session from an existing hunting query, or create your session from scratch.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Threat management**, select **Hunting**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Threat management** > **Hunting**.

1. To create a livestream session from a hunting query:
    
    1. From the **Queries** tab, locate the hunting query to use.
    1. Right-click the query and select **Add to livestream**. For example:
    
    > [!div class="mx-imgBorder"]
    > ![create Livestream session from Microsoft Sentinel hunting query](./media/livestream/livestream-from-query.png)

1. To create a livestream session from scratch: 
    
    1. Select the **Livestream** tab.
    1. Select **+ New livestream**.
    
1. On the **Livestream** pane:
    
    - If you started livestream from a query, review the query and make any changes you want to make.
    - If you started livestream from scratch, create your query.

    Livestream supports **cross-resource queries** of data in Azure Data Explorer. [**Learn more about cross-resource queries**](../azure-monitor/logs/azure-monitor-data-explorer-proxy.md).

1. Select **Play** from the command bar.
    
    The status bar under the command bar indicates whether your livestream session is running or paused. In the following example, the session is running:
    
    > [!div class="mx-imgBorder"]
    > ![create livestream session from Microsoft Sentinel hunting](./media/livestream/livestream-session.png)

1. Select **Save** from the command bar.
    
    Unless you select **Pause**, the session continues to run until you're signed out from the Azure portal.

## View your livestream sessions

Find your livestream sessions on the **Hunting** > **Livestream** tab.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Threat management**, select **Hunting**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Threat management** > **Hunting**.

1. Select the **Livestream** tab.

1. Select the livestream session you want to view or edit. For example:
    
    > [!div class="mx-imgBorder"]
    > ![create livestream session from Microsoft Sentinel hunting query](./media/livestream/livestream-tab.png)
    
    Your selected livestream session opens for you to play, pause, edit, and so on.

## Receive notifications when new events occur

Livestream notifications for new events appear with the Azure or Defender portal notifications. For example:

![Azure portal notification for livestream](./media/livestream/notification.png)

1. In the Azure or Defender portal, go to the notifications on the top right-hand side of the portal page.
1. Select the notification to open the **Livestream** pane.
 
## Elevate a livestream session to an alert

Promote a livestream session to a new alert by selecting **Elevate to alert** from the command bar on the relevant livestream session:

> [!div class="mx-imgBorder"]
> ![Elevate livestream session to an alert](./media/livestream/elevate-to-alert.png)

This action opens the rule creation wizard, which is prepopulated with the query that is associated with the livestream session.

## Next steps

In this article, you learned how to use hunting livestream in Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles:

- [Proactively hunt for threats](hunting.md)
- [Use notebooks to run automated hunting campaigns](notebooks.md)
