---
title: Connect Raspberry Pi web simulator to Azure IoT Hub (Node.js)
description: Connect Raspberry Pi web simulator to Azure IoT Hub for Raspberry Pi to send data to the Azure cloud.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: javascript
ms.topic: tutorial
ms.date: 11/22/2022
ms.custom: ['Role: Cloud Development', devx-track-js]
---

# Connect Raspberry Pi online simulator to Azure IoT Hub (Node.js)

[!INCLUDE [iot-hub-get-started-device-selector](../../includes/iot-hub-get-started-device-selector.md)]

In this tutorial, you begin by learning the basics of working with Raspberry Pi online simulator. You then learn how to seamlessly connect the Pi simulator to the cloud by using [Azure IoT Hub](about-iot-hub.md).

:::image type="content" source="media/iot-hub-raspberry-pi-web-simulator/3-banner.png" alt-text="Connect Raspberry Pi web simulator to Azure IoT Hub" border="false":::

[:::image type="content" source="media/iot-hub-raspberry-pi-web-simulator/6-button-default.png" alt-text="Start Raspberry Pi simulator":::](https://azure-samples.github.io/raspberry-pi-web-simulator/#getstarted)


If you have physical devices, visit [Connect Raspberry Pi to Azure IoT Hub](iot-hub-raspberry-pi-kit-node-get-started.md) to get started.

## What you do

* Learn the basics of Raspberry Pi online simulator.

* Create an IoT hub.

* Register a device for Pi in your IoT hub.

* Run a sample application on Pi to send simulated sensor data to your IoT hub.

You first connect the simulated Raspberry Pi to an IoT hub that you create. You then run a sample application with the simulated Pi to generate sensor data. Finally, you send the sensor data to your IoT hub.

## What you learn

* How to create an Azure IoT hub and get your new device connection string. If you don't have an Azure account, [create a free Azure trial account](https://azure.microsoft.com/free/) in just a few minutes.

* How to work with Raspberry Pi online simulator.

* How to send sensor data to your IoT hub.

## Overview of Raspberry Pi web simulator

Select the following button to start Raspberry Pi online simulator.

> [!div class="button"]
> <a href="https://azure-samples.github.io/raspberry-pi-web-simulator/#GetStarted" target="_blank">Start Raspberry Pi Simulator</a>

There are three areas in the web simulator.

1. Assembly area - A graphic depiction of the Pi simulator, and any simulated devices and connections.

   By default, the assembly area simulates connections from the Pi to two devices:
   * A BME280 humidity sensor connected to I2C.1
   * An LED connected to GPIO 4 

   The assembly area is locked in this preview version, so you currently can't customize the assembly.

2. Coding area - An online code editor for you to code with Raspberry Pi. The default sample application helps to collect sensor data from the simulated BME280 sensor and sends that data to your IoT hub. The application is fully compatible with real Pi devices. 

3. Integrated console window - A window that shows the output of your code. At the top of this window, there are three buttons.

   * **Run** - Run the application in the coding area.

   * **Reset** - Reset the coding area to the default sample application.

   * **Collapse/Expand** - On the right side, there's a button for you to collapse or expand the console window.

> [!NOTE]
> The Raspberry Pi web simulator is currently available in a preview version. We'd like to hear your voice in the [Gitter Chatroom](https://gitter.im/Microsoft/raspberry-pi-web-simulator). The source code is public on [GitHub](https://github.com/Azure-Samples/raspberry-pi-web-simulator).

![Overview of Pi online simulator](media/iot-hub-raspberry-pi-web-simulator/0-overview.png)

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Register a new device in the IoT hub

[!INCLUDE [iot-hub-include-create-device](../../includes/iot-hub-include-create-device.md)]

## Run a sample application on Pi web simulator

1. In the coding area, make sure you're working with the default sample application. Replace the placeholder in line 15 with the Azure IoT hub device connection string.
 
   ![Replace the device connection string](media/iot-hub-raspberry-pi-web-simulator/1-connectionstring.png)

2. Select **Run** or type `npm start` in the integrated console window to run the application.

You should see the following output that shows the sensor data and the messages that are sent to your IoT hub
![Output - sensor data sent from Raspberry Pi to your IoT hub](media/iot-hub-raspberry-pi-web-simulator/2-run-application.png)

## Read the messages received by your hub

One way to monitor messages received by your IoT hub from the simulated device is to use the Azure IoT Hub extension for Visual Studio Code. To learn more, see [Use the Azure IoT Hub extension for Visual Studio Code to send and receive messages between your device and IoT Hub](iot-hub-vscode-iot-toolkit-cloud-device-messaging.md).

For more ways to process data sent by your device, continue on to the next section.

## Next steps

You've run a sample application to collect sensor data and send it to your IoT hub.

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]
