---
title: Translate modbus protocols with gateways - Azure IoT Edge | Microsoft Docs
description: Allow devices that use Modbus TCP to communicate with Azure IoT Hub by creating an IoT Edge gateway device
author: kgremban
manager: philmea
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 06/28/2019
ms.author: kgremban
ms.custom: seodec18
---

# Connect Modbus TCP devices through an IoT Edge device gateway

If you want to connect IoT devices that use Modbus TCP or RTU protocols to an Azure IoT hub, use an IoT Edge device as a gateway. The gateway device reads data from your Modbus devices, then communicates that data to the cloud using a supported protocol.

![Modbus devices connect to IoT Hub through IoT Edge gateway](./media/deploy-modbus-gateway/diagram.png)

This article covers how to create your own container image for a Modbus module (or you can use a prebuilt sample) and then deploy it to the IoT Edge device that will act as your gateway.

This article assumes that you're using Modbus TCP protocol. For more information about how to configure the module to support Modbus RTU, see the [Azure IoT Edge Modbus module](https://github.com/Azure/iot-edge-modbus) project on GitHub.

## Prerequisites
* An Azure IoT Edge device. For a walkthrough on how to set up one, see [Deploy Azure IoT Edge on Windows](quickstart.md) or [Linux](quickstart-linux.md).
* The primary key connection string for the IoT Edge device.
* A physical or simulated Modbus device that supports Modbus TCP.

## Prepare a Modbus container

If you want to test the Modbus gateway functionality, Microsoft has a sample module that you can use. You can access the module from the Azure Marketplace, [Modbus](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft_iot.edge-modbus?tab=Overview), or with the image URI, **mcr.microsoft.com/azureiotedge/modbus:1.0**.

If you want to create your own module and customize it for your environment, there is an open-source [Azure IoT Edge Modbus module](https://github.com/Azure/iot-edge-modbus) project on GitHub. Follow the guidance in that project to create your own container image. To create a container image, refer to [Develop C# modules in Visual Studio](how-to-visual-studio-develop-csharp-module.md) or [Develop modules in Visual Studio Code](how-to-vs-code-develop-module.md). Those articles provide instructions on creating new modules and publishing container images to a registry.

## Try the solution

This section walks through deploying Microsoft's sample Modbus module to your IoT Edge device.

1. On the [Azure portal](https://portal.azure.com/), go to your IoT hub.

2. Go to **IoT Edge** and click on your IoT Edge device.

3. Select **Set modules**.

4. Add the Modbus module:

   1. Click **Add** and select **IoT Edge module**.

   2. In the **Name** field, enter "modbus".

   3. In the **Image** field, enter the image URI of the sample container: `mcr.microsoft.com/azureiotedge/modbus:1.0`.

   4. Check the **Enable** box to update the module twin's desired properties.

   5. Copy the following JSON into the text box. Change the value of **SlaveConnection** to the IPv4 address of your Modbus device.

      ```JSON
      {
        "properties.desired":{
          "PublishInterval":"2000",
          "SlaveConfigs":{
            "Slave01":{
              "SlaveConnection":"<IPV4 address>","HwId":"PowerMeter-0a:01:01:01:01:01",
              "Operations":{
                "Op01":{
                  "PollingInterval": "1000",
                  "UnitId":"1",
                  "StartAddress":"40001",
                  "Count":"2",
                  "DisplayName":"Voltage"
                }
              }
            }
          }
        }
      }
      ```

   6. Select **Save**.

5. Back in the **Add Modules** step, select **Next**.

7. In the **Specify Routes** step, copy the following JSON into the text box. This route sends all messages collected by the Modbus module to IoT Hub. In this route, **modbusOutput** is the endpoint that Modbus module uses to output data and **$upstream** is a special destination that tells IoT Edge hub to send messages to IoT Hub.

   ```JSON
   {
     "routes": {
       "modbusToIoTHub":"FROM /messages/modules/modbus/outputs/modbusOutput INTO $upstream"
     }
   }
   ```

8. Select **Next**.

9. In the **Review Deployment** step, select **Submit**.

10. Return to the device details page and select **Refresh**. You should see the new **modbus** module running along with the IoT Edge runtime.

## View data
View the data coming through the modbus module:
```cmd/sh
iotedge logs modbus
```

You can also view the telemetry the device is sending by using the [Azure IoT Hub Toolkit extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) (formerly Azure IoT Toolkit extension).

## Next steps

- To learn more about how IoT Edge devices can act as gateways, see [Create an IoT Edge device that acts as a transparent gateway](./how-to-create-transparent-gateway.md).
- For more information about how IoT Edge modules work, see [Understand Azure IoT Edge modules](iot-edge-modules.md).
