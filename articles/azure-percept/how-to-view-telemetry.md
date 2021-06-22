---
title: View your Azure Percept DK's model inference telemetry
description: Learn how to view your Azure Percept DK's vision model inference telemetry in Azure IoT Explorer
author: mimcco
ms.author: mimcco
ms.service: azure-percept 
ms.topic: how-to
ms.date: 02/17/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# View your Azure Percept DK's model inference telemetry

Follow this guide to view your Azure Percept DK's vision model inference telemetry in [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases).

## Prerequisites

- Azure Percept DK (devkit)
- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md): you connected your devkit to a Wi-Fi network, created an IoT Hub, and connected your devkit to the IoT Hub
- [Vision AI model has been deployed to your Azure Percept DK](./how-to-deploy-model.md)

## View telemetry

1. Power on your devkit.

1. Download and install [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases). If you are a Windows user, select the .msi file.

    :::image type="content" source="./media/how-to-view-telemetry/azure-iot-explorer-download.png" alt-text="Download screen for Azure IoT Explorer.":::

1. Connect your IoT Hub to Azure IoT Explorer:

    1. Go to the [Azure portal](https://portal.azure.com).

    1. Select **All resources**.

        :::image type="content" source="./media/how-to-view-telemetry/azure-portal.png" alt-text="Azure portal homepage.":::

    1. Select the IoT Hub that your Azure Percept DK is connected to.

        :::image type="content" source="./media/how-to-view-telemetry/iot-hub.png" alt-text="IoT Hub list in Azure portal.":::

    1. On the left side of your IoT Hub page, select **Shared access policies**.

        :::image type="content" source="./media/how-to-view-telemetry/shared-access-policies.png" alt-text="IoT Hub page showing shared access policies.":::

    1. Click on **iothubowner**.

        :::image type="content" source="./media/how-to-view-telemetry/iothubowner.png" alt-text="Shared access policies screen with iothubowner highlighted.":::

    1. Click the blue copy icon next to **Connection string—primary key**.

        :::image type="content" source="./media/how-to-view-telemetry/connection-string.png" alt-text="iothubowner window with connection string copy button highlighted.":::

    1. Open Azure IoT Explorer and click **+ Add connection**.

    1. Paste the connection string into the **Connection string** box on the **Add connection string** window and click **Save**.

        :::image type="content" source="./media/how-to-view-telemetry/add-connection-string.png" alt-text="Azure Iot Explorer window with box for pasting connection string into.":::

    1. Point the Vision SoM at an object for model inferencing.

    1. Select **Telemetry**.

    1. Click **Start** to view telemetry events from the device.

## Next steps
Learn how to view your [Azure Percept DK video stream](./how-to-view-video-stream.md).