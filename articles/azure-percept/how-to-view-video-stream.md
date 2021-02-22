---
title: View your Azure Percept DK's RTSP video stream
description: Learn how to view the RTSP video stream from the Vision SoM of the Azure Percept DK
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/12/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# View your Azure Percept DK's RTSP video stream

Follow this guide to view the RTSP video stream from the Vision SoM of the Azure Percept DK within Azure Percept Studio. Inferencing from vision AI models deployed to your device will be viewable in the webstream.

## Prerequisites

- Azure Percept DK (devkit)
- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure Percept DK setup experience](./quickstart-percept-dk-setup.md): you connected your devkit to a Wi-Fi network, created an IoT Hub, and connected your devkit to the IoT Hub

## View the RTSP video stream

1. Power on your devkit.

1. Navigate to [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819).

1. On the left side of the overview page, click **Devices**.

    :::image type="content" source="./media/how-to-view-video-stream/overview-devices-inline.png" alt-text="Azure Percept Studio overview screen." lightbox="./media/how-to-view-video-stream/overview-devices.png":::

1. Select your devkit from the list.

    :::image type="content" source="./media/how-to-view-video-stream/select-device.png" alt-text="Azure Percept Studio overview screen.":::

1. Click **View your device stream**.

    :::image type="content" source="./media/how-to-view-video-stream/view-device-stream.png" alt-text="Azure Percept Studio overview screen.":::

    This opens a separate tab showing the live webstream from the Vision SoM of your Azure Percept DK.

    :::image type="content" source="./media/how-to-view-video-stream/webstream.png" alt-text="Azure Percept Studio overview screen.":::

## Next steps

Learn how to view your [Azure Percept DK telemetry](how-to-view-telemetry.md).