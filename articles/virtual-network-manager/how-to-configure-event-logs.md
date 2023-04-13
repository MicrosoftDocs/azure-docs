---
title: Configure Event Logs for Azure Virtual Network Manager
description: This article describes how to configure and view event logs for Azure Virtual Network Manager. This includes how to access event logs with Log Analytics and a storage account.
author: mbender-ms
ms.author: mbender
ms.topic: how-to
ms.service: azure-virtual-network-manager
ms.date: 04/12/2023
---

# Configure Event Logs for Azure Virtual Network Manager

When configurations are changed in Azure Virtual Network Manager, this can impact virtual networks that are associated with network groups in your instance. With Azure Monitor, you can monitor Azure Virtual Network Manager for virtual network changes. 

In this article, you'll learn how to monitor Azure Virtual Network Manager for virtual network changes with Log Analytics or a storage account. 

## Prerequisites

- [Azure Virtual Network Manager](../concept-virtual-network-manager.md) is enabled on your subscription.
# - [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview) is enabled on your subscription.
-  You deployed either a [Log Analytics workspace](../azure-monitor/logs/tutorial-resource-logs). or a [storage account](../storage/common/storage-account-create.md) to monitor Azure Virtual Network Manager.

## Configuring Diagnostic Settings

### Configure event logs with Log Analytics 

1. Navigate to the network manager you want to obtain the logs of.
1. Under the **Monitoring** in the left pane, select the **Diagnostic settings**.
1. Select **+ Add diagnostic setting** and enter a diagnostic setting name.
1. Under **Logs**, select **Network Group Membership Change**.
1. Under **Destination details**, select **Send to Log Analytics** and choose your subscription and Log Analytics worskpace from the dropdown menus.
    
    :::image type="content" source="media/how-to-configure-event-logging/log-analytics-diagnostic-settings.png" alt-text="Screenshot of Diagnostic settings page for setting up Log Analytics workspace.":::

1. Select **Save** and close the window.

### Configure event logs with a storage account

Navigate to the network manager you want to obtain the logs of.
1. Under the **Monitoring** in the left pane, select the **Diagnostic settings**.
1. Select **+ Add diagnostic setting** and enter a diagnostic setting name.
1. 1. Under **Destination details**, select **Send to storage account** and choose your subscription and storage account from the dropdown menus.
1. Under **Logs**, select **Network Group Membership Change** and enter a retention period.

    :::image type="content" source="media/how-to-configure-event-logging/storage-account-diagnostic-settings.png" alt-text="Screenshot of Diagnostic settings for storage account.":::

1. Select **Save** and close the window.

## Viewing Azure Virtual Network Manager logs

1. Under the **Monitoring** in the left pane, select the **Logs**.
1. In the **Diagnostics** window, select **Run** or **Load to editor** under **Get recent Network Group Membership Changes**.

    :::image type="content" source="media/how-to-configure-event-logging/view-logs.png" alt-text="Screenshot of Logs page.":::

1. If you choose **Run**, the **Results* tab displays the event logs and you can expand each log to view the details.
1. When completed reviewing the logs, close the window and select **ok** to discard changes.

    :::image type="content" source="media/how-to-configure-event-logging/workspace-log-details.png" alt-text="Screenshot of log details.":::

> [!NOTE]
> When you close the **Query editor** window, you will be be returned to the **Azure Home** page. If you need to return to the **Logs** page, browse to your virtual network manager instance, and select **Logs** under the **Monitoring** in the left pane.

1. If you choose **Load to editor**, the **Query editor** window displays the query. Choose **Run** to display the event logs and you can expand each log to view the details.

    :::image type="content" source="media/how-to-configure-event-logging/workspace-log-details.png" alt-text="Screenshot of log details.":::
1. 