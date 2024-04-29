---
title: How to Configure Diagnostic Settings and Monitor Configuration Differences in Nexus Network Fabric
description: Process of Configuring diagnostic Settings and Monitor Configuration Differences in Nexus Network Fabric
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/18/2024
ms.custom: template-how-to
---

# How to Configure Diagnostic Settings and Monitor Configuration Differences in Nexus Network Fabric

In this guide, we'll walk you through the process of setting up diagnostic settings and monitoring configuration differences in Nexus Network Fabric.

## Step 1: Accessing device settings in Azure Portal

- Log in to the Azure Portal.

- In the search bar at the top of the portal, type "Network Device" and press Enter.

:::image type="content" source="media/search-network-device.png" alt-text="Search box for Network Device in portal.":::

- Select the appropriate network device from the search results. Ensure that you choose the device for which you need to configure diagnostic settings.

## Step 2: Adding diagnostic setting

- After selecting the appropriate network device, navigate to the monitoring and select diagnostic settings.

- Within the diagnostic settings section, select the option "Add diagnostic setting".

:::image type="content" source="media/network-device-dignostics-settings.png" alt-text="Showcases diagnostics settings page for network device.":::

- In the diagnostic settings, provide a descriptive name for the diagnostic setting to easily identify its purpose.

- Select the desired categories of data that you want to collect for this diagnostic setting. In this case, select "System Session History Updates" from the list of available categories.

:::image type="content" source="media/network-device-system-session-history-updates.png" alt-text="Showcases specific categories of data to collect in portal.":::

## Step 3: Choosing Log Destination

After adding the diagnostic setting, choose the destination for pushing the logs.

Options include Log Analytics Workspace, Storage account, and Event Hub.

In our example, we'll push the logs to the Log Analytics Workspace.

## Step 4: Configuring Diagnostic Settings

image "diagnostics settings.png" 

## Step 5: Monitoring Configuration Differences

Access the Log Analytics Workspace.

Choose logs and run appropriate queries based on your requirements.

Select the event category as "MNFSystemSessionHistoryUpdates" to view configuration results comprehensively.