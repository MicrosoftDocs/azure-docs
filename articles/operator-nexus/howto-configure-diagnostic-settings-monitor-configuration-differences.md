---
title: How to configure diagnostic settings and monitor configuration differences in Nexus Network Fabric
description: Process of configuring diagnostic settings and monitor configuration differences in Nexus Network Fabric
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/18/2024
ms.custom: template-how-to
---

# How to configure diagnostic settings and monitor configuration differences in Nexus Network Fabric

In this guide, we walk you through the process of setting up diagnostic settings and monitoring configuration differences in Nexus Network Fabric.

## Step 1: Accessing device settings in Azure portal

- Sign in to the Azure portal.

- In **Search resources, service, and docs (G+/)** at the top of the portal page, enter **Network Device**.

    :::image type="content" source="media/search-network-device.png" alt-text="Screenshot of search box for Network Device in portal.":::

- Select the appropriate network device from the search results. Ensure that you choose the device for which you need to configure diagnostic settings.

## Step 2: Adding diagnostic setting

- After selecting the appropriate network device, navigate to the monitoring and select diagnostic settings.

- After accessing the diagnostic settings section, select "Add diagnostic setting".

    :::image type="content" source="media/network-device-diagnostics-settings.png" alt-text="Screenshot of diagnostics settings page for network device.":::

- Within the diagnostic settings, provide a descriptive name for the diagnostic setting to easily identify its purpose.

- In the diagnostic settings, select the desired categories of data that you want to collect for this diagnostic setting.

    :::image type="content" source="media/network-device-system-session-history-updates.png" alt-text="Showcases specific categories of data to collect in portal.":::

## Step 3: Choosing log destination

- Once the diagnostic setting is added, locate the section where the log destination can be specified.

- Select the log destination from several choices, including Log Analytics Workspace, Storage account, and Event Hubs.

    :::image type="content" source="media/network-device-log-analytics-workspace.png" alt-text="Screenshot of configuration page for selecting Log Analytics Workspace as the log destination for a network device.":::

> [!Note]
> In our example, we'll push the logs to the Log Analytics Workspace.<br>
> To set up the Log Analytics Workspace, if you haven't done so already, you might need to create one. Simply follow the prompts to create a new workspace or select an existing one.

- Once the log destination is configured, confirm the settings and save.

## Step 5: Monitoring configuration differences

- Navigate to the Log Analytics Workspace where the logs from the network device are being stored.

- Within the Log Analytics Workspace, access the query interface or log search functionality.

    :::image type="content" source="media/network-device-configuration-difference.png" alt-text="Screenshot of comparison of configuration differences for a network device in a visual format.":::

- In the query interface, specify the event category as "MNFSystemSessionHistoryUpdates". This will filter the logs to specifically show configuration updates and changes comprehensively.
