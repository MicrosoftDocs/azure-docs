---
title: Configure Diagnostic Settings and Monitor Configuration Differences in Azure Operator Nexus Network Fabric
description: Learn about the process of configuring diagnostic settings and monitoring configuration differences in Azure Operator Nexus Network Fabric.
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/18/2024
ms.custom: template-how-to
---

# Configure diagnostic settings and monitor configuration differences in Azure Operator Nexus Network Fabric

In this article, we walk you through the process of setting up diagnostic settings and monitoring configuration differences in Azure Operator Nexus Network Fabric.

## Step 1: Access device settings in the Azure portal

1. Sign in to the Azure portal.

1. In the search box at the top of the portal page, enter **network devices**.

    :::image type="content" source="media/search-network-device.png" alt-text="Screenshot that shows the search box for Network Devices in the portal.":::

1. Select the appropriate network device from the search results. Ensure that you choose the device for which you need to configure diagnostic settings.

## Step 2: Add a diagnostic setting

1. After you select the appropriate network device, on the left pane under **Monitoring**, select **Diagnostic settings**.

1. After you access the **Diagnostic settings** section, select **Add diagnostic setting**.

    :::image type="content" source="media/network-device-diagnostics-settings.png" alt-text="Screenshot of the Diagnostics settings page for a network device.":::

1. Within the diagnostic settings, provide a descriptive name for the diagnostic setting to easily identify its purpose.

1. In the diagnostic settings, select the categories of data that you want to collect for this diagnostic setting.

    :::image type="content" source="media/network-device-system-session-history-updates.png" alt-text="Screenshot that shows specific categories of data to collect in the portal.":::

## Step 3: Choose a log destination

1. After the diagnostic setting is added, locate the section where the log destination is specified.

1. Select the log destination from several choices, including a Log Analytics workspace, a storage account, or an event hub.

    :::image type="content" source="media/network-device-log-analytics-workspace.png" alt-text="Screenshot that shows the configuration page for selecting Log Analytics workspace as the log destination for a network device.":::

   > [!NOTE]
   > In this example, you push the logs to the Log Analytics workspace.
   >
   > To set up the Log Analytics workspace, if you haven't done so already, you might need to create one. Follow the prompts to create a new workspace or select an existing one.

1. After the log destination is configured, confirm the settings and save.

## Step 4: Monitor configuration differences

1. Go to the Log Analytics workspace where the logs from the network device are being stored.

1. In the Log Analytics workspace, access the query interface or log search functionality.

    :::image type="content" source="media/network-device-configuration-difference.png" alt-text="Screenshot that shows the comparison of configuration differences for a network device in a visual format.":::

1. In the query interface, specify the event category as `MNFSystemSessionHistoryUpdates`. This category filters the logs to specifically show configuration updates and changes comprehensively.
