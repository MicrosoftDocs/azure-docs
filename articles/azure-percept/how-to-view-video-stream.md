---
title: View your Azure Percept DK RTSP video stream
description: Learn how to view the RTSP video stream from Azure Percept DK
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/12/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# View your Azure Percept DK RTSP video stream

Follow this guide to view the RTSP video stream from the Azure Percept DK within Azure Percept Studio. Inferencing from vision AI models deployed to your device will be viewable in the web stream.

## Prerequisites

- Azure Percept DK (devkit)
- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md): you connected your devkit to a Wi-Fi network, created an IoT Hub, and connected your devkit to the IoT Hub

## View the RTSP video stream

1. Power on your devkit.

1. Navigate to [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819).

1. On the left side of the overview page, click **Devices**.

    :::image type="content" source="./media/how-to-view-video-stream/overview-devices-inline.png" alt-text="Azure Percept Studio overview screen." lightbox="./media/how-to-view-video-stream/overview-devices.png":::

1. Select your devkit from the list.

    :::image type="content" source="./media/how-to-view-video-stream/select-device.png" alt-text="Screenshot of available devices in Azure Percept Studio.":::

1. Click **View your device stream**.

    :::image type="content" source="./media/how-to-view-video-stream/view-device-stream.png" alt-text="Screenshot of the device page showing available vision project actions.":::

    This opens a separate tab showing the live web stream from your Azure Percept DK.

    :::image type="content" source="./media/how-to-view-video-stream/webstream.png" alt-text="Screenshot of the device web stream.":::

## Next steps

Learn how to view your [Azure Percept DK telemetry](./how-to-view-telemetry.md).