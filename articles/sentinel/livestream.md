---
title: Use hunting Livestream in Azure Sentinel to detect threats| Microsoft Docs
description: This article describes how to use hunting Livestream in Azure Sentinel to keep track of data.
services: sentinel
documentationcenter: na
author: cabailey
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/04/2019
ms.author: cabailey
---

# Use hunting Livestream in Azure Sentinel to detect threats

> [!IMPORTANT]
> Hunting Livestream in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


Use hunting Livestream to create interactive sessions that let you test newly created queries as events occur, get notifications from the sessions when a match is found, and launch investigations if necessary. You can quickly create a Livestream session using any Log Analytics query.

- **Test newly created queries as events occur**
    
    You can test and adjust queries without any conflicts to current rules that are being actively applied to events. After you confirm these new queries work as expected, it's easy to promote them to custom alert rules by selecting an option that elevates the session to an alert.

- **Get notified when threats occur**
    
    You can compare threat data feeds to aggregated log data and be notified when a match occurs. Threat data feeds are ongoing streams of data that are related to potential or current threats, so the notification might indicate a potential threat to your organization. Create a Livestream session instead of a custom alert rule when you want to be notified of a potential issue without the overheads of maintaining a custom alert rule.

- **Launch investigations**
    
    If there is an active investigation that involves an asset such as a host or user, you can view specific (or any) activity in the log data as it occurs on that asset. You can be notified when that activity occurs.


## Create a Livestream session

You can create a Livestream session from an existing hunting query, or create your session from scratch.

1. In the Azure portal, navigate to **Sentinel** > **Threat management** > **Hunting**.

2. To create a Livestream session from a hunting query:
    
    1. From the **Queries** tab, locate the hunting query to use.
    2. Right-click the query and select **Add to Livestream**. For example:
    
    > [!div class="mx-imgBorder"]
    > ![create Livestream session from Azure Sentinel hunting query](./media/livestream/livestream-from-query.png)

3. To create a Livestream session from scratch: 
    
    1. Select the **Livestream** tab
    2. Select **Go to Livestream**.
    
4. On the **Livestream** blade:
    
    - If you started Livestream from a query, review the query and make any changes you want to make.
    - If you started Livestream from scratch, create your query. 

5. Select **Play** from the command bar.
    
    The status bar under the command bar indicates whether your Livestream is running or paused. In the following example, the session is running:
    
    > [!div class="mx-imgBorder"]
    > ![create Livestream session from Azure Sentinel hunting](./media/livestream/livestream-session.png)

6. Select **Save** from the command bar.
    
    Unless you select **Pause**, the session continues to run until you are signed out from the Azure portal.

## View your Livestream sessions

1. In the Azure portal, navigate to **Sentinel** > **Threat management** > **Hunting** > **Livestream** tab.

2. Select the Livestream session you want to view or edit. For example:
    
    > [!div class="mx-imgBorder"]
    > ![create Livestream session from Azure Sentinel hunting query](./media/livestream/livestream-tab.png)
    
    Your selected Livestream session opens for you to play, pause, edit, and so on.

## Receive notifications when new events occur

Because Livestream notifications for new events use Azure portal notifications, you see these notifications whenever you use the Azure portal. For example:

![Azure portal notification for Livestream](./media/livestream/notification.png)

Select the notification to open the **Livestream** blade.
 
## Elevate a Livestream session to an alert

You can promote a Livestream session to a new alert by selecting **Elevate to alert** from the command bar on the relevant Livestream session:

> [!div class="mx-imgBorder"]
> ![Elevate Livestream session to an alert](./media/livestream/elevate-to-alert.png)

This action opens the rule creation wizard, which is prepopulated with the query that is associated with the Livestream session.

## Next steps

In this article, you learned how to use hunting Livestream in Azure Sentinel. To learn more about Azure Sentinel, see the following articles:


- [Proactively hunt for threats](hunting.md)
- [Use notebooks to run automated hunting campaigns](notebooks.md)
