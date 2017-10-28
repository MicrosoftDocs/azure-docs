---
title: Connect a gateway to Azure IoT Suite using an Intel NUC | Microsoft Docs
description: Use the Microsoft IoT Commercial Gateway Kit and the remote monitoring preconfigured solution. Use the Azure IoT Edge gateway to connect to the remote monitoring solution, send simulated telemetry to the cloud, and respond to methods invoked from the solution dashboard.
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.service: iot-suite
ms.devlang: c
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/05/2017
ms.author: dobett

---
# Connect your Azure IoT Edge gateway to the remote monitoring preconfigured solution and send simulated telemetry

[!INCLUDE [iot-suite-gateway-kit-selector](../../includes/iot-suite-gateway-kit-selector.md)]

This tutorial shows you how to use Azure IoT Edge to simulate temperature and humidity data to send to the remote monitoring preconfigured solution. The tutorial uses:

- Azure IoT Edge to implement a sample gateway.
- The IoT Suite remote monitoring preconfigured solution as the cloud-based back end.

## Overview

In this tutorial, you complete the following steps:

- Deploy an instance of the remote monitoring preconfigured solution to your Azure subscription. This step automatically deploys and configures multiple Azure services.
- Set up your Intel NUC gateway device to communicate with your computer and the remote monitoring solution.
- Configure the IoT Edge gateway to send simulated telemetry that you can view on the solution dashboard.

[!INCLUDE [iot-suite-gateway-kit-prerequisites](../../includes/iot-suite-gateway-kit-prerequisites.md)]

[!INCLUDE [iot-suite-provision-remote-monitoring](../../includes/iot-suite-provision-remote-monitoring.md)]

> [!WARNING]
> The remote monitoring solution provisions a set of Azure services in your Azure subscription. The deployment reflects a real enterprise architecture. To avoid unnecessary Azure consumption charges, delete your instance of the preconfigured solution at azureiotsuite.com when you have finished with it. If you need the preconfigured solution again, you can easily recreate it. For more information about reducing consumption while the remote monitoring solution runs, see [Configuring Azure IoT Suite preconfigured solutions for demo purposes][lnk-demo-config].

[!INCLUDE [iot-suite-gateway-kit-view-solution](../../includes/iot-suite-gateway-kit-view-solution.md)]

Repeat the previous steps to add a second device using a Device ID such as **device02**. The sample sends data from two simulated devices in the gateway to the remote monitoring solution.

[!INCLUDE [iot-suite-gateway-kit-prepare-nuc-connectivity](../../includes/iot-suite-gateway-kit-prepare-nuc-connectivity.md)]

[!INCLUDE [iot-suite-gateway-kit-prepare-nuc-software](../../includes/iot-suite-gateway-kit-prepare-nuc-software.md)]

## Build the custom IoT Edge module

You can now build the custom IoT Edge module that enables the gateway to send messages to the remote monitoring solution. For more information about configuring a gateway and IoT Edge modules, see [Azure IoT Edge concepts][lnk-gateway-concepts].

Download the source code for the custom IoT Edge modules from GitHub using the following commands:

```bash
cd ~
git clone https://github.com/Azure-Samples/iot-remote-monitoring-c-intel-nuc-gateway-getting-started.git
```

Build the custom IoT Edge module using the following commands:

```bash
cd ~/iot-remote-monitoring-c-intel-nuc-gateway-getting-started/simulator
chmod u+x build.sh
sed -i -e 's/\r$//' build.sh
./build.sh
```

The build script places the libsimulator.so custom IoT Edge module in the build folder.

## Configure and run the IoT Edge gateway

You can now configure the IoT Edge gateway to send simulated telemetry to your remote monitoring dashboard. For more information about configuring a gateway and IoT Edge modules, see [Azure IoT Edge concepts][lnk-gateway-concepts].

> [!TIP]
> In this tutorial, you use the standard `vi` text editor on the Intel NUC. If you have not used `vi` before, you should complete an introductory tutorial, such as [Unix - The vi Editor Tutorial][lnk-vi-tutorial] to familiarize yourself with this editor. Alternatively, you can install the more user-friendly [nano](https://www.nano-editor.org/) editor using the command `smart install nano -y`.

Open the sample configuration file in the **vi** editor using the following command:

```bash
vi ~/iot-remote-monitoring-c-intel-nuc-gateway-getting-started/simulator/remote_monitoring.json
```

Locate the following lines in the configuration for the IoTHub module:

```json
"args": {
  "IoTHubName": "<<Azure IoT Hub Name>>",
  "IoTHubSuffix": "<<Azure IoT Hub Suffix>>",
  "Transport": "http"
}
```

Replace the placeholder values with the IoT Hub information you created and saved at the start of this tutorial. The value for IoTHubName looks like **yourrmsolution37e08**, and the value for IoTSuffix is typically **azure-devices.net**.

Locate the following lines in the configuration for the mapping module:

```json
args": [
  {
    "macAddress": "AA:BB:CC:DD:EE:FF",
    "deviceId": "<<Azure IoT Hub Device ID>>",
    "deviceKey": "<<Azure IoT Hub Device Key>>>"
  },
  {
    "macAddress": "AA:BB:CC:DD:EE:FF",
    "deviceId": "<<Azure IoT Hub Device ID>>",
    "deviceKey": "<<Azure IoT Hub Device Key>>"
  }
]
```

Replace the **deviceID** and **deviceKey** placeholders with the IDs and keys for the two devices you created in the remote monitoring solution previously.

Save your changes.

You can now run the IoT Edge gateway using the following commands:

```bash
cd ~/iot-remote-monitoring-c-intel-nuc-gateway-getting-started/simulator
/usr/share/azureiotgatewaysdk/samples/simulated_device_cloud_upload/simulated_device_cloud_upload remote_monitoring.json
```

The gateway starts on the Intel NUC and sends simulated telemetry to the remote monitoring solution:

![IoT Edge gateway generates simulated telemetry][img-simulated telemetry]

Press **Ctrl-C** to exit the program at any time.

## View the telemetry

The IoT Edge gateway is now sending simulated telemetry to the remote monitoring solution. You can view the telemetry on the solution dashboard.

- Navigate to the solution dashboard.
- Select one of the two devices you configured in the gateway in the **Device to View** dropdown.
- The telemetry from the gateway devices displays on the dashboard.

![Display telemetry from the simulated gateway devices][img-telemetry-display]

> [!WARNING]
> If you leave the remote monitoring solution running in your Azure account, you are billed for the time it runs. For more information about reducing consumption while the remote monitoring solution runs, see [Configuring Azure IoT Suite preconfigured solutions for demo purposes][lnk-demo-config]. Delete the preconfigured solution from your Azure account when you have finished using it.

## Next steps

Visit the [Azure IoT Dev Center](https://azure.microsoft.com/develop/iot/) for more samples and documentation on Azure IoT.

[img-simulated telemetry]: ./media/iot-suite-gateway-kit-get-started-simulator/appoutput.png

[img-telemetry-display]: ./media/iot-suite-gateway-kit-get-started-simulator/telemetry.png

[lnk-demo-config]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/Docs/configure-preconfigured-demo.md

[lnk-vi-tutorial]: http://www.tutorialspoint.com/unix/unix-vi-editor.htm
[lnk-gateway-concepts]: https://docs.microsoft.com/azure/iot-hub/iot-hub-linux-iot-edge-get-started