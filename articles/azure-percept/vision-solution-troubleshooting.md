---
title: Troubleshoot issues with Azure Percept Vision and vision modules
description: Get troubleshooting tips for some of the more common issues found in the vision AI prototyping experiences
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/18/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Vision solution troubleshooting

## Delete a vision project

1. Go to https://www.customvision.ai/projects.

1. Hover over the project you would like to delete and click the trash can icon to delete the project.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision_delete_project.png" alt-text="Image.":::

## Check which modules are on a device

1. Go to the [Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden#home).

1. Click on the **Iot Hub** icon.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision_iot_hub_2.png" alt-text="Image.":::

1. Select the IoT Hub that your target device is connected to.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision_iot_hub.png" alt-text="Image.":::

1. Select **Iot Edge** and click on your device under the **Device ID** tab.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision_iot_edge.png" alt-text="Image.":::

1. Your device modules will be listed under the **Modules** tab.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision_device_modules.png" alt-text="Image.":::

## Delete a device

1. Go to the [Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden#home).

1. Click on the **Iot Hub** icon.

1. Select the IoT Hub that your target device is connected to.

1. Select **Iot Edge** and check the box next to your target device ID. Click the trash can icon to delete your device.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision_delete_device.png" alt-text="Image.":::

## Eye module troubleshooting tips

In case of problems with **WebStreamModule**, ensure that **azureeyemodule**, which does the vision model inferencing, is running. To check the runtime status, go to the [Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden#home) and navigate to **All resources** -> **\<your IoT hub>** -> **IoT Edge** -> **\<your device ID>**. Click the **Modules** tab to see the runtime status of all installed modules.

:::image type="content" source="./media/vision-solution-troubleshooting/ota_iot_edge_device_page.png" alt-text="Image.":::

If the runtime status of **azureeyemodule** is not listed as **running**, click **Set modules** -> **azureeyemodule**. On the **Module Settings** page, set **Desired Status** to **running** and click **Update**.

 :::image type="content" source="./media/vision-solution-troubleshooting/firmware_desired_status_stopped.png" alt-text="Image.":::

## View device RTSP video stream

View your device's RTSP video stream in [Azure Percept Studio](./how-to-view-video-stream.md) or [VLC media player](https://www.videolan.org/vlc/index.html).

To open the RTSP stream in VLC media player, go to **Media** -> **Open network stream** -> **rtsp://[device IP address]/result**.