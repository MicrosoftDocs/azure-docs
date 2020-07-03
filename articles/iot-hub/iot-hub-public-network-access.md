---
title: Managing public network access for Azure IoT hub
description: Documentation on how to disable and enable public network access for IoT hub
author: jlian
ms.author: jlian
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/01/2020
---

# Managing public network access for your IoT hub

To restrict access to only [private endpoint for your IoT hub in your VNet](virtual-network-support.md), disable public network access. To do so, use Azure portal or the `publicNetworkAccess` API. 

## Turn off public network access using Azure portal

1. Visit [Azure portal](https://portal.azure.com)
2. Navigate to your IoT hub.
3. Select **Networking** from the left-side menu.
4. Under “Allow public network access to”, select **Disabled**
5. Select **Save**.

:::image type="content" source="media/iot-hub-publicnetworkaccess/turn-off-public-network-access.png" alt-text="Image showing Azure portal where to turn off public network access" lightbox="media/iot-hub-publicnetworkaccess/turn-off-public-network-access.png":::

To turn on public network access, selected **Enabled**, then **Save**.

## IP Filter 

If public network access is disabled, all [IP Filter](iot-hub-ip-filtering.md) rules are ignored. This is because all IPs from the public internet are blocked. To use IP Filter, use the **Selected IP ranges** option.

## Bug fix with built-in Event Hub compatible endpoint

There is a bug with IoT Hub where the [built-in Event Hub compatible endpoint](iot-hub-devguide-messages-read-builtin.md) continues to be accessible via public internet when public network access to the IoT Hub is disabled. To learn more and contact us about this bug, see [Disabling public network access for IoT Hub disables access to built-in Event Hub endpoint](https://azure.microsoft.com/updates/iot-hub-public-network-access-bug-fix).