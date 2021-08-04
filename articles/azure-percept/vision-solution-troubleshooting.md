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

## Check the runtime status of azureeyemodule

If there's a problem with **WebStreamModule**, ensure that **azureeyemodule**, which handles the vision model inferencing, is running. To check the runtime status:

1. Go to the [Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden#home), and go to **All resources** > *\<your IoT hub>* > **IoT Edge** > *\<your device ID>*. 
1. Select the **Modules** tab to see the runtime status of all installed modules.

   :::image type="content" source="./media/vision-solution-troubleshooting/over-the-air-iot-edge-device-page-inline.png" alt-text="Screenshot that shows the device module runtime status screen." lightbox= "./media/vision-solution-troubleshooting/over-the-air-iot-edge-device-page.png":::

1. If the runtime status of **azureeyemodule** isn't listed as **running**, select **Set modules** > **azureeyemodule**. 
1. On the **Module Settings** page, set **Desired Status** to **running**, and select **Update**.

    :::image type="content" source="./media/vision-solution-troubleshooting/firmware-desired-status-stopped.png" alt-text="Screenshot that shows the Module Settings configuration screen.":::

## Change how often messages are sent from the azureeyemodule

Your subscription tier may cap the number of messages that can be sent from your device to IoT Hub. For instance, the Free Tier will limit the number of messages to 8,000 per day. Once that limit is reached, your azureeyemodule will stop functioning and you may receive this error:

|Error message|
|------|
|*Total number of messages on IotHub 'xxxxxxxxx' exceeded the allocated quota. Max allowed message count: '8000', current message count: 'xxxx'. Send and Receive operations are blocked for this hub until the next UTC day. Consider increasing the units for this hub to increase the quota.*|

Using the azureeyemodule module twin, it's possible change the interval rate for how often messages are sent. The value entered for the interval rate indicates the frequency that each message gets sent, in milliseconds. The larger the number the more time there is between each message. For example, if you set the interval rate to 12,000 it means one message will be sent every 12 seconds. For a model that is running for the entire day this rate factors out to 7,200 messages per day, which is under the Free Tier limit. The value that you choose depends on how responsive you need your vision model to be.

> [!NOTE]
> Changing the message interval rate does not impact the size of each message. The message size depends on a few different factors such as the model type and the number of objects being detected in each message. As such, it is difficult to determine message size.

Follow these steps to update the message interval:

1. Sign in to the [Azure portal](https://ms.portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod#home), and open **All resources**.

1. On the **All resources** page, select the name of the IoT hub that was provisioned to your development kit during setup.

1. On the left side of the **IoT Hub** page, under **Automatic Device Management**, select **IoT Edge**. On the IoT Edge devices page, find the device ID of your development kit. Select the device ID of your development kit to open its IoT Edge device page.

1. On the **Modules** tab, select **azureeyemodule**.

1. On the **azureeyemodule** page, open **Module Identity Twin**.

    :::image type="content" source="./media/vision-solution-troubleshooting/module-page-inline.png" alt-text="Screenshot of a module page." lightbox= "./media/vision-solution-troubleshooting/module-page.png":::

1. Scroll down to **properties**
1. Find **TelemetryInterval** and replace it with **TelemetryIntervalNeuralNetworkMs**

    :::image type="content" source="./media/vision-solution-troubleshooting/module-identity-twin-inline-02.png" alt-text="Screenshot of Module Identity Twin properties." lightbox= "./media/vision-solution-troubleshooting/module-identity-twin.png":::

1. Update the **TelemetryIntervalNeuralNetworkMs** value to the needed value

1. Select the **Save** icon.

## View device RTSP video stream

View your device's RTSP video stream in [Azure Percept Studio](./how-to-view-video-stream.md) or [VLC media player](https://www.videolan.org/vlc/index.html).

To open the RTSP stream in VLC media player, go to **Media** > **Open network stream** > **rtsp://[device IP address]:8554/result**.

## Next steps

For more information on troubleshooting your Azure Percept DK instance, see the [General troubleshooting guide](./troubleshoot-dev-kit.md).