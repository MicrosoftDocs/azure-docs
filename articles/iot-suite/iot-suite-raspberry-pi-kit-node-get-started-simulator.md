---
title: Connect a Raspberry Pi to Azure IoT Suite using Node.js with simulated telemetry | Microsoft Docs
description: Use the Microsoft Azure IoT Starter Kit for the Raspberry Pi 3 and Azure IoT Suite. Use Node.js to connect your Raspberry Pi to the remote monitoring solution, send simulated telemetry to the cloud, and respond to methods invoked from the solution dashboard.
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.service: iot-suite
ms.devlang: node.js
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/26/2017
ms.author: dobett

---
# Connect your Raspberry Pi 3 to the remote monitoring solution and send simulated telemetry using Node.js

[!INCLUDE [iot-suite-raspberry-pi-kit-selector](../../includes/iot-suite-raspberry-pi-kit-selector.md)]

This tutorial shows you how to use the Raspberry Pi 3 to simulate temperature and humidity data to send to the cloud. The tutorial uses:

- Raspbian OS, the Node.js programming language, and the Microsoft Azure IoT SDK for Node.js to implement a sample device.
- The IoT Suite remote monitoring preconfigured solution as the cloud-based back end.

[!INCLUDE [iot-suite-raspberry-pi-kit-overview-simulator](../../includes/iot-suite-raspberry-pi-kit-overview-simulator.md)]

[!INCLUDE [iot-suite-provision-remote-monitoring](../../includes/iot-suite-provision-remote-monitoring.md)]

> [!WARNING]
> The remote monitoring solution provisions a set of Azure services in your Azure subscription. The deployment reflects a real enterprise architecture. To avoid unnecessary Azure consumption charges, delete your instance of the preconfigured solution at azureiotsuite.com when you have finished with it. If you need the preconfigured solution again, you can easily recreate it. For more information about reducing consumption while the remote monitoring solution runs, see [Configuring Azure IoT Suite preconfigured solutions for demo purposes][lnk-demo-config].

[!INCLUDE [iot-suite-raspberry-pi-kit-view-solution](../../includes/iot-suite-raspberry-pi-kit-view-solution.md)]

[!INCLUDE [iot-suite-raspberry-pi-kit-prepare-pi-simulator](../../includes/iot-suite-raspberry-pi-kit-prepare-pi-simulator.md)]

## Download and configure the sample

You can now download and configure the remote monitoring client application on your Raspberry Pi.

### Install Node.js

If you haven't done so already, install Node.js on your Raspberry Pi. The IoT SDK for Node.js requires version 0.11.5 of Node.js or later. The following steps show you how to install Node.js v6.10.2 on your Raspberry Pi:

1. Use the following command to update your Raspberry Pi:

    `sudo apt-get update`

1. Use the following command to download the Node.js binaries to your Raspberry Pi:

    `wget https://nodejs.org/dist/v6.10.2/node-v6.10.2-linux-armv7l.tar.gz`

1. Use the following command to install the binaries:

    `sudo tar -C /usr/local --strip-components 1 -xzf node-v6.10.2-linux-armv7l.tar.gz`

1. Use the following command to verify you have installed Node.js v6.10.2 successfully:

    `node --version`

### Clone the repositories

If you haven't already done so, clone the required repositories by running the following commands in a terminal on your Pi:

`cd ~`

`git clone --recursive https://github.com/Azure-Samples/iot-remote-monitoring-node-raspberrypi-getstartedkit.git`

### Update the device connection string

Open the sample source file in the **nano** editor using the following command:

`nano ~/iot-remote-monitoring-node-raspberrypi-getstartedkit/simulator/remote_monitoring.js`

Find the line:

```javascript
var connectionString = 'HostName=[Your IoT hub name].azure-devices.net;DeviceId=[Your device id];SharedAccessKey=[Your device key]';
```

Replace the placeholder values with the device and IoT Hub information you created and saved at the start of this tutorial. Save your changes (**Ctrl-O**, **Enter**) and exit the editor (**Ctrl-X**).

## Run the sample

Run the following commands to install the prerequisite packages for the sample:

`cd ~/iot-remote-monitoring-node-raspberrypi-getstartedkit/simulator`

`npm install`

You can now run the sample program on the Raspberry Pi. Enter the command:

`sudo node ~/iot-remote-monitoring-node-raspberrypi-getstartedkit/simulator/remote_monitoring.js`

The following sample output is an example of the output you see at the command prompt on the Raspberry Pi:

![Output from Raspberry Pi app][img-raspberry-output]

Press **Ctrl-C** to exit the program at any time.

[!INCLUDE [iot-suite-raspberry-pi-kit-view-telemetry-simulator](../../includes/iot-suite-raspberry-pi-kit-view-telemetry-simulator.md)]

## Next steps

Visit the [Azure IoT Dev Center](https://azure.microsoft.com/develop/iot/) for more samples and documentation on Azure IoT.


[img-raspberry-output]: ./media/iot-suite-raspberry-pi-kit-node-get-started-simulator/app-output.png

[lnk-demo-config]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/Docs/configure-preconfigured-demo.md
