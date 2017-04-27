---
title: Connect a gateway to Azure IoT Suite using an Intel NUC | Microsoft Docs
description: Use the Microsoft IoT Commercial Gateway Kit and the remote monitoring preconfigured solution. Use the gateway to connect to the remote monitoring solution, send simulated telemetry to the cloud, and respond to methods invoked from the solution dashboard.
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
ms.date: 04/26/2017
ms.author: dobett

---
# Connect your Azure IoT gateway to the remote monitoring preconfigured solution and send simulated telemetry

[!INCLUDE [iot-suite-gateway-kit-selector](../../includes/iot-suite-gateway-kit-selector.md)]

This tutorial shows you how to use the Gateway SDK to simulate temperature and humidity data to send to the cloud. The tutorial uses:

- The Microsoft Azure IoT Gateway SDK to implement a sample gateway.
- The IoT Suite remote monitoring preconfigured solution as the cloud-based back end.

## Overview

In this tutorial, you complete the following steps:

- Deploy an instance of the remote monitoring preconfigured solution to your Azure subscription. This step automatically deploys and configures multiple Azure services.
- Set up your Intel NUC gateway device to communicate with your computer and the remote monitoring solution.
- Update the sample gateway code to connect to the remote monitoring solution, and send simulated telemetry that you can view on the solution dashboard.

[!INCLUDE [iot-suite-gateway-kit-prerequisites](../../includes/iot-suite-gateway-kit-prerequisites.md)]

[!INCLUDE [iot-suite-provision-remote-monitoring](../../includes/iot-suite-provision-remote-monitoring.md)]

> [!WARNING]
> The remote monitoring solution provisions a set of Azure services in your Azure subscription. The deployment reflects a real enterprise architecture. To avoid unnecessary Azure consumption charges, delete your instance of the preconfigured solution at azureiotsuite.com when you have finished with it. If you need the preconfigured solution again, you can easily recreate it. For more information about reducing consumption while the remote monitoring solution runs, see [Configuring Azure IoT Suite preconfigured solutions for demo purposes][lnk-demo-config].

[!INCLUDE [iot-suite-gateway-kit-view-solution](../../includes/iot-suite-gateway-kit-view-solution.md)]

Repeat the previous steps to add a second device using a Device ID such as **device02**. The sample sends data from two simulated devices in the gateway to the remote monitoring solution.

[!INCLUDE [iot-suite-gateway-kit-prepare-nuc-connectivity](../../includes/iot-suite-gateway-kit-prepare-nuc-connectivity.md)]

[!INCLUDE [iot-suite-gateway-kit-prepare-nuc-software](../../includes/iot-suite-gateway-kit-prepare-nuc-software.md)]

## Configure and run the sample

You can now configure the gateway software on your Intel NUC to communicate with the remote monitoring solution.

> [!NOTE]
> In this tutorial, you uses the standard `vi` text editor on the Intel NUC. If you have not used `vi` before, you should complete an introductory tutorial, such as [Unix - The vi Editor Tutorial][lnk-vi-tutorial] to familiarize yourself with the editor.

Open the sample configuration file in the **vi** editor using the following command:

`vi /tmp/azure-remote-monitoring-gateway-intelnuc/samples/simulated_device_cloud_upload/src/simulated_device_cloud_upload_lin.json`

Locate the following lines in the configuration for the IoTHub module:

```json
"args": {
  "IoTHubName": "<<insert here IoTHubName>>",
  "IoTHubSuffix": "<<insert here IoTHubSuffix>>",
  "Transport": "HTTP"
}
```

Replace the placeholder values with the IoT Hub information you created and saved at the start of this tutorial. The value for IoTHubName looks like **yourrmsolution37e08**, and the value for IoTSuffix is typically **azure-devices.net**. Change the **Transport** value to **amqp**.

Locate the following lines in the configuration for the mapping module:

```json
args": [
  {
    "macAddress": "01:01:01:01:01:01",
    "deviceId": "<<insert here deviceId>>",
    "deviceKey": "<<insert here deviceKey>>"
  },
  {
    "macAddress": "02:02:02:02:02:02",
    "deviceId": "<<insert here deviceId>>",
    "deviceKey": "<<insert here deviceKey>>"
  }
]
```

Replace the **deviceID** and **deviceKey** placeholders with the IDs and keys for the two devices you created in the remote monitoring solution previously.

Save your changes (**Esc**, **:wq** **Enter**).

You can now run the gateway using the following command:

```bash
cd /tmp/azure-remote-monitoring-gateway-intelnuc/build
sudo ./samples/simulated_device_cloud_upload/simulated_device_cloud_upload_sample ../samples/simulated_device_cloud_upload/src/simulated_device_cloud_upload_lin.json
```

The gateway starts on the Intel NUC and sends simulated telemetry to the remote monitoring solution:

![Gateway generates simulated telemetry][img-simulated telemetry]

Press **Ctrl-C** to exit the program at any time.

## View the telemetry

The gateway is now sending simulated telemetry to the remote monitoring solution. You can view the telemetry on the solution dashboard. You can also send messages to your gateway simulated devices from the solution dashboard.

- Navigate to the solution dashboard.
- Select one of the two devices you configured in the gateway in the **Device to View** dropdown.
- The telemetry from the gateway devices displays on the dashboard.

![Display telemetry from the simulated gateway devices][img-telemetry-display]

## Call a method

TODOTODO - Fix this section

From the solution dashboard, you can invoke methods on your Raspberry Pi. When the Raspberry Pi connects to the remote monitoring solution, it sends information about the methods it supports.

- In the solution dashboard, click **Devices** to visit the **Devices** page. Select your Raspberry Pi in the **Device List**. Then choose **Methods**:

    ![List devices in dashboard][img-list-devices]

- On the **Invoke Method** page, choose **LightBlink** in the **Method** dropdown.

- Choose **InvokeMethod**. The simulator prints a message in the console on the Raspberry Pi. The app on the Raspberry Pi sends an acknowledgment back to the solution dashboard:

    ![Show method history][img-method-history]

- You can switch the LED on and off using the **ChangeLightStatus** method with a **LightStatusValue** set to **1** for on or **0** for off.

> [!WARNING]
> If you leave the remote monitoring solution running in your Azure account, you are billed for the time it runs. For more information about reducing consumption while the remote monitoring solution runs, see [Configuring Azure IoT Suite preconfigured solutions for demo purposes][lnk-demo-config]. Delete the preconfigured solution from your Azure account when you have finished using it.


## Next steps

Visit the [Azure IoT Dev Center](https://azure.microsoft.com/develop/iot/) for more samples and documentation on Azure IoT.

[img-simulated telemetry]: ./media/iot-suite-gateway-kit-get-started-simulator/appoutput.png

[img-telemetry-display]: ./media/iot-suite-gateway-kit-get-started-simulator/telemetry.png

[img-list-devices]: ./media/iot-suite-gateway-kit-get-started-simulator/listdevices.png
[img-method-history]: ./media/iot-suite-gateway-kit-get-started-simulator/methodhistory.png

[lnk-demo-config]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/Docs/configure-preconfigured-demo.md

[lnk-vi-tutorial]: http://www.tutorialspoint.com/unix/unix-vi-editor.htm
