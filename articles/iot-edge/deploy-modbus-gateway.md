---
title: Translate modbus protocols with gateways - Azure IoT Edge | Microsoft Docs
description: Allow devices that use Modbus TCP to communicate with Azure IoT Hub by creating an IoT Edge gateway device
author: PatAltimore

ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 09/22/2022
ms.author: patricka
---

# Connect Modbus TCP devices through an IoT Edge device gateway

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

If you want to connect IoT devices that use Modbus TCP or RTU protocols to an Azure IoT hub, you can use an IoT Edge device as a gateway. The gateway device reads data from your Modbus devices, then communicates that data to the cloud using a supported protocol.

:::image type="content" source="./media/deploy-modbus-gateway/diagram.png" alt-text="Screenshot of Modbus devices that connect to IoT Hub through IoT Edge gateway.":::

This article covers how to create your own container image for a Modbus module (or you can use a prebuilt sample) and then deploy it to the IoT Edge device that will act as your gateway.

This article assumes that you're using Modbus TCP protocol. For more information about how to configure the module to support Modbus RTU, see the [Azure IoT Edge Modbus module](https://github.com/Azure/iot-edge-modbus) project on GitHub.

## Prerequisites

* An Azure IoT Edge device. For a walkthrough on how to set up one, see [Deploy Azure IoT Edge on Windows](quickstart.md) or [Linux](quickstart-linux.md).
* The primary key connection string for the IoT Edge device.
* A physical or simulated Modbus device that supports Modbus TCP. You will need to know its IPv4 address.

## Prepare a Modbus container

If you want to test the Modbus gateway functionality, Microsoft has a sample module that you can use. You can access the module from the Azure Marketplace, [Modbus](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft_iot.edge-modbus?tab=Overview), or with the image URI, `mcr.microsoft.com/azureiotedge/modbus:1.0`.

If you want to create your own module and customize it for your environment, there is an open-source [Azure IoT Edge Modbus module](https://github.com/Azure/iot-edge-modbus) project on GitHub. Follow the guidance in that project to create your own container image. To create a container image, refer to [Develop C# modules in Visual Studio](./how-to-visual-studio-develop-module.md) or [Develop Azure IoT Edge modules using Visual Studio Code](tutorial-develop-for-linux.md). Those articles provide instructions on creating new modules and publishing container images to a registry.

## Try the solution

This section walks through deploying Microsoft's sample Modbus module to your IoT Edge device.

1. On the [Azure portal](https://portal.azure.com/), go to your IoT hub.

2. Go to **Devices** and select your IoT Edge device.

3. Select **Set modules**.

4. In the **IoT Edge Modules** section, add the Modbus module:

   1. Click the **Add** dropdown and select **Marketplace Module**.
   2. Search for `Modbus` and select the **Modbus TCP Module** by Microsoft.
   3. The module is automatically configured for your IoT Hub and appears in the list of IoT Edge Modules. The Routes are also automatically configured. Select **Review + create**.
   4. Review the deployment manifest and select **Create**.

5. Select the Modbus module, `ModbusTCPModule`, in the list and select the **Module Twin Settings** tab. The required JSON for the module twin desired properties is auto populated.

6. Look for the **SlaveConnection** property in the JSON and set its value to the IPv4 address of your Modbus device.

7. Select **Update**.

8. Select **Review + create**, review the deployment, and then select **Create**.

9. Return to the device details page and select **Refresh**. You should see the new `ModbusTCPModule` module running along with the IoT Edge runtime.

## View data

View the data coming through the Modbus module:

```cmd/sh
iotedge logs modbus
```

You can also view the telemetry the device is sending by using the [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) (formerly Azure IoT Toolkit extension).

## Next steps

* To learn more about how IoT Edge devices can act as gateways, see [Create an IoT Edge device that acts as a transparent gateway](./how-to-create-transparent-gateway.md).
* For more information about how IoT Edge modules work, see [Understand Azure IoT Edge modules](iot-edge-modules.md).