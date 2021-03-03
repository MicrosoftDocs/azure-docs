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

See the following guidance for information on troubleshooting no-code vision solutions in Azure Percept Studio.

## Delete a vision project

1. Go to https://www.customvision.ai/projects.

1. Hover over the project you would like to delete and click the trash can icon to delete the project.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-delete-project.png" alt-text="Projects page in Custom Vision with delete icon highlighted.":::

## Check which modules are on a device

1. Go to the [Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden#home).

1. Click on the **Iot Hub** icon.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-iot-hub-2-inline.png" alt-text="Azure portal homepage with Iot Hub icon highlighted." lightbox= "./media/vision-solution-troubleshooting/vision-iot-hub-2.png":::

1. Select the IoT Hub that your target device is connected to.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-iot-hub.png" alt-text="List of IoT Hubs.":::

1. Select **IoT Edge** and click on your device under the **Device ID** tab.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-iot-edge.png" alt-text="IoT Edge homepage.":::

1. Your device modules will be listed under the **Modules** tab.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-device-modules-inline.png" alt-text="Iot Edge page for selected device showing the modules tab contents." lightbox= "./media/vision-solution-troubleshooting/vision-device-modules.png":::

## Delete a device

1. Go to the [Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden#home).

1. Click on the **Iot Hub** icon.

1. Select the IoT Hub that your target device is connected to.

1. Select **IoT Edge** and check the box next to your target device ID. Click the trash can icon to delete your device.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-delete-device.png" alt-text="Delete icon highlighted in Iot Edge homepage.":::

## Eye module troubleshooting tips

If there is a problem with **WebStreamModule**, ensure that **azureeyemodule**, which does the vision model inferencing, is running. To check the runtime status, go to the [Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden#home) and navigate to **All resources** -> **\<your IoT hub>** -> **IoT Edge** -> **\<your device ID>**. Click the **Modules** tab to see the runtime status of all installed modules.

:::image type="content" source="./media/vision-solution-troubleshooting/over-the-air-iot-edge-device-page-inline.png" alt-text="Device module runtime status screen." lightbox= "./media/vision-solution-troubleshooting/over-the-air-iot-edge-device-page.png":::

If the runtime status of **azureeyemodule** is not listed as **running**, click **Set modules** -> **azureeyemodule**. On the **Module Settings** page, set **Desired Status** to **running** and click **Update**.

 :::image type="content" source="./media/vision-solution-troubleshooting/firmware-desired-status-stopped.png" alt-text="Module setting configuration screen.":::

## View device RTSP video stream

View your device's RTSP video stream in [Azure Percept Studio](./how-to-view-video-stream.md) or [VLC media player](https://www.videolan.org/vlc/index.html).

To open the RTSP stream in VLC media player, go to **Media** -> **Open network stream** -> **rtsp://[device IP address]/result**.

## Next steps

See the [general troubleshooting guide](./troubleshoot-dev-kit.md) for more information on troubleshooting your Azure Percept DK.