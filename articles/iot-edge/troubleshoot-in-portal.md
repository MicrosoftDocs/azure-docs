---
title: Troubleshoot from the Azure portal - Azure IoT Edge | Microsoft Docs 
description: Use the troubleshooting page in the Azure portal to monitor IoT Edge devices and modules
author: PatAltimore

ms.author: patricka
ms.date: 3/15/2023
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Troubleshoot IoT Edge devices from the Azure portal

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

IoT Edge provides a streamlined way of monitoring and troubleshooting modules in the Azure portal. The troubleshooting page is a wrapper for the IoT Edge agent's direct methods so that you can easily retrieve logs from deployed modules and remotely restart them. This article shows you how to access and filter device and module logs in the Azure portal.

## Access the troubleshooting page

You can access the troubleshooting page in the portal through either the IoT Edge device details page or the IoT Edge module details page.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.

1. In the left pane, select **Devices** under the **Device management** menu.

1. Select the IoT Edge device that you want to monitor from the list of devices.

1. On this device details page, you can either select **Troubleshoot** from the menu.

   :::image type="content" source="./media/troubleshoot-in-portal/troubleshoot-tab.png" alt-text="Screenshot of the location of the Troubleshoot tab on the Azure portal, device details page.":::

   Or, select the runtime status of a particular module that you want to inspect.

   :::image type="content" source="./media/troubleshoot-in-portal/runtime-status.png" alt-text="Screenshot of the location of the Runtime status column on the Azure portal, device details page." lightbox="./media/troubleshoot-in-portal/runtime-status.png":::

1. From the device details page, you can also select the name of a module to open the module details page. From there, you can select **Troubleshoot** from the menu.

   :::image type="content" source="./media/troubleshoot-in-portal/troubleshoot-module.png" alt-text="Screenshot of the location of the Troubleshoot tab on the Azure portal, module details page.":::

## View module logs in the portal

On the **Troubleshoot** page of your device, you can view and download logs from any of the running modules on your IoT Edge device.

This page has a maximum limit of 1500 log lines, and any logs longer than that will be truncated. If the logs are too large, the attempt to get module logs will fail. In that case, try to change the time range filter to retrieve less data or consider using direct methods to [Retrieve logs from IoT Edge deployments](how-to-retrieve-iot-edge-logs.md) to gather larger log files.

Use the dropdown menu to choose which module to inspect.

:::image type="content" source="./media/troubleshoot-in-portal/select-module.png" alt-text="Screenshot showing how to choose a module from the dropdown menu that you want to inspect.":::

By default, this page displays the last fifteen minutes of logs. Select the **Time range** filter to see different logs. Use the slider to select a time window within the last 60 minutes, or check **Enter time instead** to choose a specific datetime window.

:::image type="content" source="./media/troubleshoot-in-portal/select-time-range.png" alt-text="Screenshot showing how to choose a time or time range from the time range popup filter.":::

Once you have the logs and set your time filter from the module you want to troubleshoot, you can use the **Find** filter to retrieve specific lines from the logs. You can filter for either warnings or errors, or provide a specific term or phrase to search for. 

:::image type="content" source="./media/troubleshoot-in-portal/find-filter.png" alt-text="Screenshot showing how to use a dotnet regex pattern to search the logs, using the Find filter.":::

The **Find** feature supports plaintext searches or [.NET regular expressions](/dotnet/standard/base-types/regular-expression-language-quick-reference) for more complex searches.

You can download the module logs as a text file. The downloaded log file reflects any active filters you applied to the logs.

>[!TIP]
>The CPU utilization on a device spikes temporarily as it gathers logs in response to a request from the portal. This behavior is expected, and the utilization should stabilize after the task is complete.

## Restart modules

The **Troubleshoot** page includes a feature to restart a module. Selecting this option sends a command to the IoT Edge agent to restart the selected module. Restarting a module won't affect your ability to retrieve logs from before the restart.

:::image type="content" source="./media/troubleshoot-in-portal/restart-module.png" alt-text="Screenshot that shows how to restart a module from the Troubleshoot page.":::

## Next steps

Find more tips for [Troubleshooting your IoT Edge device](troubleshoot.md) or learn about [Common issues and resolutions](troubleshoot-common-errors.md). 

If you have more questions, create a [Support request](https://portal.azure.com/#create/Microsoft.Support) for help.
