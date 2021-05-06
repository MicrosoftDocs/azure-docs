---
title: Deploy a vision AI model to your Azure Percept DK
description: Learn how to deploy a vision AI model to your Azure Percept DK from Azure Percept Studio
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/12/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Deploy a vision AI model to your Azure Percept DK

Follow this guide to deploy a vision AI model to your Azure Percept DK from within Azure Percept Studio.

## Prerequisites

- Azure Percept DK (devkit)
- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md): you connected your devkit to a Wi-Fi network, created an IoT Hub, and connected your devkit to the IoT Hub

## Model deployment

1. Power on your devkit.

1. Navigate to [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819).

1. On the left side of the overview page, click **Devices**.

    :::image type="content" source="./media/how-to-deploy-model/overview-devices-inline.png" alt-text="Azure Percept Studio overview screen." lightbox="./media/how-to-deploy-model/overview-devices.png":::

1. Select your devkit from the list.

    :::image type="content" source="./media/how-to-deploy-model/select-device.png" alt-text="Percept devices list.":::

1. On the next page, click **Deploy a sample model** if you would like to deploy one of the pre-trained sample vision models. If you would like to deploy an existing [custom no-code vision solution](./tutorial-nocode-vision.md), click **Deploy a Custom Vision project**.

    :::image type="content" source="./media/how-to-deploy-model/deploy-model.png" alt-text="Model choices for deployment.":::

1. If you opted to deploy a no-code vision solution, select your project and your preferred model iteration, and click **Deploy**.

1. If you opted to deploy a sample model, select the model and click **Deploy to device**.

1. When your model deployment is successful, you will receive a status message in the upper right corner of your screen. To view your model inferencing in action, click the **View stream** link in the status message to see the RTSP video stream from the Vision SoM of your devkit.

## Next steps

Learn how to view your [Azure Percept DK telemetry](how-to-view-telemetry.md).