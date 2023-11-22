---
title: Configure event logs for Azure Virtual Network Manager
description: This article describes how to configure and view event logs for Azure Virtual Network Manager. This includes how to access event logs in a Log Analytics workspace and a storage account.
author: mbender-ms
ms.author: mbender
ms.topic: how-to
ms.service: virtual-network-manager
ms.date: 04/13/2023
---

# Configure event logs for Azure Virtual Network Manager

When configurations are changed in Azure Virtual Network Manager, this can affect virtual networks that are associated with network groups in your instance. With Azure Monitor, you can monitor Azure Virtual Network Manager for virtual network changes. 

In this article, you learn how to monitor Azure Virtual Network Manager for virtual network changes with Log Analytics or a storage account. 

## Prerequisites
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed instance of [Azure Virtual Network Manager](./create-virtual-network-manager-portal.md) in your subscription, with managed virtual networks.
-  You deployed either a [Log Analytics workspace](../azure-monitor/essentials/tutorial-resource-logs.md#create-a-log-analytics-workspace) or a [storage account](../storage/common/storage-account-create.md) to store event logs and observe data related to Azure Virtual Network Manager.

## Configure Diagnostic Settings

Depending on how you consume event logs, you need to set up a Log Analytics workspace or a storage account for storing your log events. These are as storage targets when configuring diagnostic settings for Azure Virtual Network Manager. Once you have configured your diagnostic settings, you can view the event logs in the Log Analytics workspace or storage account.

> [!NOTE]
> At least one virtual network must be added or removed from a network group in order to generate logs for the Network Group Membership Change schema. A log will generate for this event a couple minutes after network group membership change occurs. 
### Configure event logs with Log Analytics

Log analytics is one option for storing event logs. In this task, you configure your Azure Virtual Network Manager Instance to use a Log Analytics workspace. This task assumes you have already deployed a Log Analytics workspace. If you haven't, see [Create a Log Analytics workspace](../azure-monitor/essentials/tutorial-resource-logs.md#create-a-log-analytics-workspace).

1. Navigate to the network manager you want to obtain the logs of.
1. Under the **Monitoring** in the left pane, select the **Diagnostic settings**.
1. Select **+ Add diagnostic setting** and enter a diagnostic setting name.
1. Under **Logs**, select **Network Group Membership Change** or **Rule Collection Change**.
1. Under **Destination details**, select **Send to Log Analytics** and choose your subscription and Log Analytics workspace from the dropdown menus.
    
    :::image type="content" source="media/how-to-configure-event-logging/log-analytics-diagnostic-settings.png" alt-text="Screenshot of Diagnostic settings page for setting up Log Analytics workspace.":::

1. Select **Save** and close the window.

### Configure event logs with a storage account

A storage account is another option for storing event logs. In this task, you configure your Azure Virtual Network Manager Instance to use a storage account. This task assumes you have already deployed a storage account. If you haven't, see [Create a storage account](../storage/common/storage-account-create.md).

1. Navigate to the network manager you want to obtain the logs of.
1. Under the **Monitoring** in the left pane, select the **Diagnostic settings**.
1. Select **+ Add diagnostic setting** and enter a diagnostic setting name.
1. Under **Destination details**, select **Send to storage account** and choose your subscription and storage account from the dropdown menus.
1. Under **Logs**, select **Network Group Membership Change** or **Rule Collection Change** and enter a retention period.

    :::image type="content" source="media/how-to-configure-event-logging/storage-account-diagnostic-settings.png" alt-text="Screenshot of Diagnostic settings for storage account.":::

1. Select **Save** and close the window.

## View Azure Virtual Network Manager event logs

In this task, you access the event logs for your Azure Virtual Network Manager instance.

1. Under the **Monitoring** in the left pane, select the **Logs**.
1. In the **Diagnostics** window, select **Run** or **Load to editor** under **Get recent Network Group Membership Changes** or any other preloaded query available from your selected schema(s).

    :::image type="content" source="media/how-to-configure-event-logging/run-query.png" alt-text="Screenshot of Run and Load to editor buttons in the diagnostics window.":::

1. If you choose **Run**, the **Results** tab displays the event logs, and you can expand each log to view the details.

    :::image type="content" source="media/how-to-configure-event-logging/workspace-log-details.png" alt-text="Screenshot of the event log details from the defined query.":::

1. When completed reviewing the logs, close the window and select **ok** to discard changes.
 
    > [!NOTE]
    > When you close the **Query editor** window, you will be returned to the **Azure Home** page. If you need to return to the **Logs** page, browse to your virtual network manager instance, and select **Logs** under the **Monitoring** in the left pane.

1. If you choose **Load to editor**, the **Query editor** window displays the query. Choose **Run** to display the event logs and you can expand each log to view the details.

    :::image type="content" source="media/how-to-configure-event-logging/workspace-log-details.png" alt-text="Screenshot of log details.":::
1. Close the window and select **ok** to discard changes.

## Next steps

- Learn about [Security admin rules](concept-security-admins.md)
- Learn how to [Use queries in Azure Monitor Log Analytics](../azure-monitor/logs/queries.md)
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md).
