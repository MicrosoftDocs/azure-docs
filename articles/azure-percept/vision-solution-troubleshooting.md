---
title: Troubleshoot issues with Azure Percept Vision and vision modules
description: Get troubleshooting tips for some of the more common issues found in the vision AI prototyping experiences
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 03/29/2021
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

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-device-modules-inline.png" alt-text="IoT Edge page for selected device showing the modules tab contents." lightbox= "./media/vision-solution-troubleshooting/vision-device-modules.png":::

## Delete a device

1. Go to the [Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden#home).

1. Click on the **Iot Hub** icon.

1. Select the IoT Hub that your target device is connected to.

1. Select **IoT Edge** and check the box next to your target device ID. Click the trash can icon to delete your device.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-delete-device.png" alt-text="Delete icon highlighted in IoT Edge homepage.":::

## Eye module troubleshooting tips

### Check the runtime status of azureeyemodule

If there is a problem with **WebStreamModule**, ensure that **azureeyemodule**, which handles the vision model inferencing, is running. To check the runtime status, go to the [Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden#home) and navigate to **All resources** -> **\<your IoT hub>** -> **IoT Edge** -> **\<your device ID>**. Click the **Modules** tab to see the runtime status of all installed modules.

:::image type="content" source="./media/vision-solution-troubleshooting/over-the-air-iot-edge-device-page-inline.png" alt-text="Device module runtime status screen." lightbox= "./media/vision-solution-troubleshooting/over-the-air-iot-edge-device-page.png":::

If the runtime status of **azureeyemodule** is not listed as **running**, click **Set modules** -> **azureeyemodule**. On the **Module Settings** page, set **Desired Status** to **running** and click **Update**.

 :::image type="content" source="./media/vision-solution-troubleshooting/firmware-desired-status-stopped.png" alt-text="Module setting configuration screen.":::

### Update TelemetryIntervalNeuralNetworkMs

If you encounter the following count limitation error, the TelemetryIntervalNeuralNetworkMs value in the azureeyemodule module twin settings will need to be updated.

|Error Message|
|------|
|Total number of messages on IotHub 'xxxxxxxxx' exceeded the allocated quota. Max allowed message count: '8000', current message count: 'xxxx'. Send and Receive operations are blocked for this hub until the next UTC day. Consider increasing the units for this hub to increase the quota.|

TelemetryIntervalNeuralNetworkMs determines how often to send messages (in milliseconds) from the neural network. Azure subscriptions have a limited number of messages per day, depending on your subscription tier. If you find yourself locked out due to having sent too many messages, increase this to a higher number. 12000 (meaning once every 12 seconds) will give you a nice round 7200 messages per day, which is under the 8000 message limit for the free subscription.

To update your TelemetryIntervalNeuralNetworkMs value, follow these steps:

1. Log in to the [Azure portal](https://ms.portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod#home) and open **All resources**.

1. On the **All resources** page, click on the name of the IoT Hub that was provisioned to your devkit during the setup experience.

1. On the left side of the IoT Hub page, click on **IoT Edge** under **Automatic Device Management**. On the IoT Edge devices page, find the device ID of your devkit. Click the device ID of your devkit to open its IoT Edge device page.

1. Select **azureeyemodule** under the **Modules** tab.

1. On the azureeyemodule page, open **Module Identity Twin**.

    :::image type="content" source="./media/vision-solution-troubleshooting/module-page-inline.png" alt-text="Screenshot of module page." lightbox= "./media/vision-solution-troubleshooting/module-page.png":::

1. Scroll down to **properties**. The properties "Running" and "Logging" are not active at this time.

    :::image type="content" source="./media/vision-solution-troubleshooting/module-identity-twin-inline.png" alt-text="Screenshot of module twin properties." lightbox= "./media/vision-solution-troubleshooting/module-identity-twin.png":::

1. Update the **TelemetryIntervalNeuralNetworkMs** value as desired and click the **Save** icon.

## View device RTSP video stream

View your device's RTSP video stream in [Azure Percept Studio](./how-to-view-video-stream.md) or [VLC media player](https://www.videolan.org/vlc/index.html).

To open the RTSP stream in VLC media player, go to **Media** -> **Open network stream** -> **rtsp://[device IP address]:8554/result**.

## Next steps

See the [general troubleshooting guide](./troubleshoot-dev-kit.md) for more information on troubleshooting your Azure Percept DK.