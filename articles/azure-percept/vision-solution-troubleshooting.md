---
title: Troubleshoot issues with Azure Percept Vision and vision modules
description: Get troubleshooting tips for some of the more common issues found in the vision AI prototyping experiences.
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 03/29/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Vision solution troubleshooting

This article provides information on troubleshooting no-code vision solutions in Azure Percept Studio.

## Delete a vision project

1. Go to the [Custom Vision projects](https://www.customvision.ai/projects) page.

1. Hover over the project you want to delete, and select the trash can icon to delete the project.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-delete-project.png" alt-text="Screenshot that shows the Projects page in Custom Vision with the delete icon highlighted.":::

## Check which modules are on a device

1. Go to the [Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden#home).

1. Select the **Iot Hub** icon.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-iot-hub-2-inline.png" alt-text="Screenshot that shows the Azure portal home page with the Iot Hub icon highlighted." lightbox= "./media/vision-solution-troubleshooting/vision-iot-hub-2.png":::

1. Select the IoT hub that your target device is connected to.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-iot-hub.png" alt-text="Screenshot that shows a list of IoT hubs.":::

1. Select **IoT Edge**, and select your device under the **Device ID** tab.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-iot-edge.png" alt-text="Screenshot that shows the IoT Edge home page.":::

1. Your device modules appear in a list on the **Modules** tab.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-device-modules-inline.png" alt-text="Screenshot that shows the IoT Edge page for the selected device showing the Modules tab contents." lightbox= "./media/vision-solution-troubleshooting/vision-device-modules.png":::

## Delete a device

1. Go to the [Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden#home).

1. Select the **Iot Hub** icon.

1. Select the IoT hub that your target device is connected to.

1. Select **IoT Edge**, and select the checkbox next to your target device ID. Select **Delete** to delete your device.

    :::image type="content" source="./media/vision-solution-troubleshooting/vision-delete-device.png" alt-text="Screenshot that shows the Delete button highlighted on the IoT Edge home page.":::

## Eye module troubleshooting tips

The following troubleshooting tips help with some of the more common issues found in the vision AI prototyping experiences.

### Check the runtime status of azureeyemodule

If there's a problem with **WebStreamModule**, ensure that **azureeyemodule**, which handles the vision model inferencing, is running. To check the runtime status:

1. Go to the [Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden#home), and go to **All resources** > *\<your IoT hub>* > **IoT Edge** > *\<your device ID>*. 
1. Select the **Modules** tab to see the runtime status of all installed modules.

   :::image type="content" source="./media/vision-solution-troubleshooting/over-the-air-iot-edge-device-page-inline.png" alt-text="Screenshot that shows the device module runtime status screen." lightbox= "./media/vision-solution-troubleshooting/over-the-air-iot-edge-device-page.png":::

1. If the runtime status of **azureeyemodule** isn't listed as **running**, select **Set modules** > **azureeyemodule**. 
1. On the **Module Settings** page, set **Desired Status** to **running**, and select **Update**.

    :::image type="content" source="./media/vision-solution-troubleshooting/firmware-desired-status-stopped.png" alt-text="Screenshot that shows the Module Settings configuration screen.":::

### Update TelemetryIntervalNeuralNetworkMs

If you see the following count limitation error, you need to update the TelemetryIntervalNeuralNetworkMs value in the azureeyemodule module twin settings.

|Error message|
|------|
|Total number of messages on IotHub 'xxxxxxxxx' exceeded the allocated quota. Max allowed message count: '8000', current message count: 'xxxx'. Send and Receive operations are blocked for this hub until the next UTC day. Consider increasing the units for this hub to increase the quota.|

TelemetryIntervalNeuralNetworkMs determines how often to send messages from the neural network. Messages are sent in milliseconds. Azure subscriptions have a limited number of messages per day.

The message amount is based on your subscription tier. If you find yourself locked out because you've sent too many messages, increase the amount to a higher number. An amount of 12,000 is one message every 12 seconds. This amount gives you 7,200 messages per day, which is under the 8,000-message limit for the free subscription.

To update your TelemetryIntervalNeuralNetworkMs value:

1. Sign in to the [Azure portal](https://ms.portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod#home), and open **All resources**.

1. On the **All resources** page, select the name of the IoT hub that was provisioned to your development kit during setup.

1. On the left side of the **IoT Hub** page, under **Automatic Device Management**, select **IoT Edge**. On the IoT Edge devices page, find the device ID of your development kit. Select the device ID of your development kit to open its IoT Edge device page.

1. On the **Modules** tab, select **azureeyemodule**.

1. On the **azureeyemodule** page, open **Module Identity Twin**.

    :::image type="content" source="./media/vision-solution-troubleshooting/module-page-inline.png" alt-text="Screenshot of a module page." lightbox= "./media/vision-solution-troubleshooting/module-page.png":::

1. Scroll down to **properties**. The **Running** and **Logging** properties aren't active at this time.

    :::image type="content" source="./media/vision-solution-troubleshooting/module-identity-twin-inline.png" alt-text="Screenshot of Module Identity Twin properties." lightbox= "./media/vision-solution-troubleshooting/module-identity-twin.png":::

1. Update the **TelemetryIntervalNeuralNetworkMs** value as you want it, and select the **Save** icon.

## View device RTSP video stream

View your device's RTSP video stream in [Azure Percept Studio](./how-to-view-video-stream.md) or [VLC media player](https://www.videolan.org/vlc/index.html).

To open the RTSP stream in VLC media player, go to **Media** > **Open network stream** > **rtsp://[device IP address]:8554/result**.

## Next steps

For more information on troubleshooting your Azure Percept DK instance, see the [General troubleshooting guide](./troubleshoot-dev-kit.md).