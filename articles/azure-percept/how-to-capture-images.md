---
title: Capture images for a no-code vision solution in Azure Percept Studio
description: How to capture images with your Azure Percept DK in Azure Percept Studio
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/12/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Capture images for a vision project in Azure Percept Studio

Follow this guide to capture images using Azure Percept DK for an existing vision project. If you haven't created a vision project yet, see the [no-code vision tutorial](./tutorial-nocode-vision.md).

## Prerequisites

- Azure Percept DK (devkit)
- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md): you connected your devkit to a Wi-Fi network, created an IoT Hub, and connected your devkit to the IoT Hub
- [No-code vision project](./tutorial-nocode-vision.md)

## Capture images

1. Power on your devkit.

1. Navigate to [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819).

1. On the left side of the overview page, select **Devices**.

    :::image type="content" source="./media/how-to-capture-images/overview-devices-inline.png" alt-text="Azure Percept Studio overview screen." lightbox="./media/how-to-capture-images/overview-devices.png":::

1. Select your devkit from the list.

    :::image type="content" source="./media/how-to-capture-images/select-device.png" alt-text="Percept devices list.":::

1. On your device page, select **Capture images for a project**.

    :::image type="content" source="./media/how-to-capture-images/capture-images.png" alt-text="Percept devices page with available actions listed.":::

1. In the **Image capture** window, follow these steps:

    1. In the **Project** dropdown menu, select the vision project you would like to collect images for.

    1. Select **View device stream** to ensure the camera of the Vision SoM is placed correctly.

    1. Select **Take photo** to capture an image.

    1. Instead, check the box next to **Automatic image capture** to set up a timer for image capture:

        1. Select your preferred imaging rate under **Capture rate**.
        1. Select the total number of images you would like to collect under **Target**.

    :::image type="content" source="./media/how-to-capture-images/take-photo.png" alt-text="Image capture screen.":::

All images will be accessible in [Custom Vision](https://www.customvision.ai/).

## Next steps

[Test and retrain your no-code vision model](../cognitive-services/custom-vision-service/test-your-model.md).