---
title: Managing public network access for your IoT hub
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

:::image type="content" source="media/iot-hub-publicnetworkaccess/turn-off-publicnetworkaccess.png" alt-text="Image showing Azure portal where to turn off public network access" lightbox="media/iot-hub-publicnetworkaccess/turn-off-publicnetworkaccess.png":::

To turn on public network access, selected **Enabled**, then **Save**.

## IP Filter 

If public network access is disabled, all [IP Filter](iot-hub-ip-filtering.md) rules are ignored. This is because all IPs from the public internet are blocked. To use IP Filter, use the **Selected IP ranges** option.

## Disabling public network access will disable access to built-in Event Hub compatible endpoint on 30 September 2020

There is a bug with IoT Hub where the [built-in Event Hub compatible endpoint](iot-hub-devguide-messages-read-builtin.md) continues to be accessible via public internet when public network access to the IoT Hub is disabled. On 30 September 2020, this behavior will change, and public access to the built-in endpoint will be disabled when public network access is disabled for IoT Hub. If you have clients reading from the built-in endpoint while public network access is disabled, they will not be able to read from the built-in endpoint anymore.

For example, Azure Stream Analytics (ASA) integrates with IoT Hub by reading from the built-in endpoint. If you have ASA integration with IoT Hub set up and you have public network access disabled, ASA will stop receiving messages from your IoT hub on 30 September 2020 unless you act.

### Required action

Enable public network access for your built-in Event Hub compatible endpoint by following these steps:

1. Visit [Azure portal](https://portal.azure.com)
2. Navigate to your IoT hub.
3. Select **Networking** from the left-side menu.
4. Under “Allow public network access to”, check if **Disabled** is selected.
5. If so, make sure that you don’t rely on being able to read from the built-in Event Hub endpoint (for example, using Azure Stream Analytics) while having public network access disabled.
6. If you do rely on accessing the built-in endpoint, you must **Enable** public network access or change the setting to **Selected IP ranges** to set up [IP Filter](iot-hub-ip-filtering.md).

If you have any questions or need more time to change the implementation on your side, [contact us](mailto:IoTHubPublicNetworkAccessBugFix@service.microsoft.com) by 15 September 2020 and we can preserve the legacy behavior for your IoT hub for a limited time.

