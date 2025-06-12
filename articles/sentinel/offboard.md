---
title: Remove Microsoft Sentinel from your workspace
description: Learn how to delete your Microsoft Sentinel instance to discontinue use of Microsoft Sentinel and the associated costs.
author: cwatson-cat
ms.topic: how-to
ms.date: 02/06/2025
ms.author: cwatson
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal


#Customer intent: As an IT admin, I want to remove Microsoft Sentinel from my Log Analytics workspace so that I can discontinue its use and manage associated costs and configurations.

---

# Remove Microsoft Sentinel from your Log Analytics workspace

If you no longer want to use Microsoft Sentinel, this article explains how to remove it from your Log Analytics workspace.

If you instead want to offboard Microsoft Sentinel from the Defender portal, see [Offboard Microsoft Sentinel](/defender-xdr/microsoft-sentinel-onboard?#offboard-microsoft-sentinel).

## Prerequisites

Before you begin, make sure that you understand the effects of removing Microsoft Sentinel from your environment.

For example, you can't manage Microsoft Sentinel tables in Log Analytics after removing Microsoft Sentinel, such as to set extended data retention. Therefore, to avoid extra data retention charges, we recommend that you set per-table retention to 90 days or less for Microsoft Sentinel tables stored in Log Analytics that will be inaccessible after removing Microsoft Sentinel.

For more information, see [Implications of removing Microsoft Sentinel from your workspace](offboard-implications.md).

## Remove Microsoft Sentinel

Complete the following steps to remove Microsoft Sentinel from your Log Analytics workspace.

1. For Microsoft Sentinel in the [Azure portal](https://portal.microsoft.com), under **Configuration**, select **Settings**.<br>On the **Settings** page, select the **Settings** tab. <br><br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **System** > **Settings** > **Microsoft Sentinel**.

1. Select **Remove Microsoft Sentinel**.

    #### [Defender portal](#tab/defender-portal)
    :::image type="content" source="media/offboard/defender-settings-remove-sentinel.png" alt-text="Screenshot of Microsoft Sentinel settings in the Defender portal with the option to remove Microsoft Sentinel highlighted toward the end of the list.":::

    #### [Azure portal](#tab/azure-portal)
    :::image type="content" source="media/offboard/locate-remove-sentinel.png" alt-text="Screenshot to find the setting to remove Microsoft Sentinel from your workspace in the Azure portal.":::

    ----

1. Review the **Know before you go...** section and the rest of this document carefully. Take all the necessary actions before proceeding.

1. Select the appropriate checkboxes to let us know why you're removing Microsoft Sentinel. Enter any other details in the space provided, and indicate whether you want Microsoft to email you in response to your feedback.

1. Select **Remove Microsoft Sentinel from your workspace**.
    
    :::image type="content" source="media/offboard/remove-sentinel-reasons.png" alt-text="Screenshot that shows the section to remove the Microsoft Sentinel solution from your workspace.":::

## Clean up resources in the Azure portal (optional)

If you don't want to keep the workspace and the data collected for Microsoft Sentinel, delete the resources associated with the workspace in the Azure portal.


- Delete just the individual resources within the associated resource group that you no longer need. For more information, see [Delete resource](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource).
- Or, if you don't need any of the resources in the associated resource group, delete the resource group. For more information, see [Delete resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal).

## Related resources

If you change your mind and want to install Microsoft Sentinel again, see [Onboard Microsoft Sentinel](quickstart-onboard.md).

