---
title: Connect a Raspberry Pi to Azure IoT Suite using C to support firmware updates | Microsoft Docs
description: Use the Microsoft Azure IoT Starter Kit for the Raspberry Pi 3 and Azure IoT Suite. Use C to connect your Raspberry Pi to the remote monitoring solution, send telemetry from sensors to the cloud, and perform a remote firmware update.
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
ms.date: 04/25/2017
ms.author: dobett

---
# Connect your Raspberry Pi 3 to the remote monitoring solution and enable remote firmware updates using C

[!INCLUDE [iot-suite-raspberry-pi-kit-selector](../../includes/iot-suite-raspberry-pi-kit-selector.md)]

This tutorial shows you how to use the Microsoft Azure IoT Starter Kit for Raspberry Pi 3 to:

* Develop a temperature and humidity reader that can communicate with the cloud.
* Enable and perform a remote firmware update to update the client application on the Raspberry Pi.

The tutorial uses:

- Raspbian OS, the C programming language, and the Microsoft Azure IoT SDK for C to implement a sample device.
- The IoT Suite remote monitoring preconfigured solution as the cloud-based back end.

## Overview

In this tutorial, you complete the following steps:

- Deploy an instance of the remote monitoring preconfigured solution to your Azure subscription. This step automatically deploys and configures multiple Azure services.
- Set up your device and sensors to communicate with your computer and the remote monitoring solution.
- Update the sample device code to connect to the remote monitoring solution, and send telemetry that you can view on the solution dashboard.
- Use the sample device code to update the client application.

[!INCLUDE [iot-suite-raspberry-pi-kit-prerequisites](../../includes/iot-suite-raspberry-pi-kit-prerequisites.md)]

[!INCLUDE [iot-suite-provision-remote-monitoring](../../includes/iot-suite-provision-remote-monitoring.md)]

> [!WARNING]
> The remote monitoring solution provisions a set of Azure services in your Azure subscription. The deployment reflects a real enterprise architecture. To avoid unnecessary Azure consumption charges, delete your instance of the preconfigured solution at azureiotsuite.com when you have finished with it. If you need the preconfigured solution again, you can easily recreate it. For more information about reducing consumption while the remote monitoring solution runs, see [Configuring Azure IoT Suite preconfigured solutions for demo purposes][lnk-demo-config].

[!INCLUDE [iot-suite-raspberry-pi-kit-view-solution](../../includes/iot-suite-raspberry-pi-kit-view-solution.md)]

[!INCLUDE [iot-suite-raspberry-pi-kit-prepare-pi](../../includes/iot-suite-raspberry-pi-kit-prepare-pi.md)]

## Download and configure the sample

You can now download and configure the remote monitoring client application on your Raspberry Pi.

### Clone the repositories

If you haven't done so already, clone the required repositories by running the following commands on your Pi:

`cd ~`

`git clone --recursive https://github.com/Azure-Samples/iot-remote-monitoring-c-raspberrypi-getstartedkit.git`

### Update the device connection string

Open the sample configuration file in the **nano** editor using the following command:

`nano ~/iot-remote-monitoring-c-raspberrypi-getstartedkit/advanced/config/deviceinfo`

Replace the placeholder values with the device ID and IoT Hub information you created and saved at the start of this tutorial.

When you are done, the contents of the deviceinfo file should look like the following example:

```conf
yourdeviceid
HostName=youriothubname.azure-devices.net;DeviceId=yourdeviceid;SharedAccessKey=yourdevicekey
```

Save your changes (**Ctrl-O**, **Enter**) and exit the editor (**Ctrl-X**).

## Build the sample

If you have not already done so, install the prerequisite packages for the Microsoft Azure IoT Device SDK for C by running the following commands in a terminal on the Raspberry Pi:

`sudo apt-get update`

`sudo apt-get install g++ make cmake git libcurl4-openssl-dev libssl-dev uuid-dev`

You can now build the sample solution on the Raspberry Pi:

`chmod +x ~/iot-remote-monitoring-c-raspberrypi-getstartedkit/advanced/1.0/build.sh`

`~/iot-remote-monitoring-c-raspberrypi-getstartedkit/advanced/1.0/build.sh`

You can now run the sample program on the Raspberry Pi. Enter the command:

  `sudo ~/cmake/remote_monitoring/remote_monitoring`

The following sample output is an example of the output you see at the command prompt on the Raspberry Pi:

![Output from Raspberry Pi app][img-raspberry-output]

Press **Ctrl-C** to exit the program at any time.

[!INCLUDE [iot-suite-raspberry-pi-kit-view-telemetry-advanced](../../includes/iot-suite-raspberry-pi-kit-view-telemetry-advanced.md)]

1. In the solution dashboard, click **Devices** to visit the **Devices** page. Select your Raspberry Pi in the **Device List**. Then choose **Methods**:

    ![List devices in dashboard][img-list-devices]

1. On the **Invoke Method** page, choose **InitiateFirmwareUpdate** in the **Method** dropdown.

1. In the **FWPackageURI** field, enter **https://github.com/Azure-Samples/iot-remote-monitoring-c-raspberrypi-getstartedkit/raw/master/advanced/2.0/package/remote_monitoring.zip**. This archive file contains the implementation of version 2.0 of the firmware.

1. Choose **InvokeMethod**. The app on the Raspberry Pi sends an acknowledgment back to the solution dashboard. It then starts the firmware update process by downloading the new version of the firmware:

    ![Show method history][img-method-history]

## Observe the firmware update process

You can observe the firmware update process as it runs on the device and by viewing the reported properties in the solution dashboard:

1. You can view the progress in of the update process on the Raspberry Pi:

    ![Show update progress][img-update-progress]

    > [!NOTE]
    > The remote monitoring app restarts silently when the update completes. Use the command `ps -ef` to verify it is running. If you want to terminate the process, use the `kill` command with the process id.

1. You can view the status of the firmware update, as reported by the device, in the solution portal. The following screenshot shows the status and duration of each stage of the update process, and the new firmware version:

    ![Show job status][img-job-status]

    If you navigate back to the dashboard, you can verify the device is still sending telemetry following the firmware update.

> [!WARNING]
> If you leave the remote monitoring solution running in your Azure account, you are billed for the time it runs. For more information about reducing consumption while the remote monitoring solution runs, see [Configuring Azure IoT Suite preconfigured solutions for demo purposes][lnk-demo-config]. Delete the preconfigured solution from your Azure account when you have finished using it.

## Next steps

Visit the [Azure IoT Dev Center](https://azure.microsoft.com/develop/iot/) for more samples and documentation on Azure IoT.


[img-raspberry-output]: ./media/iot-suite-raspberry-pi-kit-c-get-started-advanced/app-output.png
[img-update-progress]: ./media/iot-suite-raspberry-pi-kit-c-get-started-advanced/updateprogress.png
[img-job-status]: ./media/iot-suite-raspberry-pi-kit-c-get-started-advanced/jobstatus.png
[img-list-devices]: ./media/iot-suite-raspberry-pi-kit-c-get-started-advanced/listdevices.png
[img-method-history]: ./media/iot-suite-raspberry-pi-kit-c-get-started-advanced/methodhistory.png

[lnk-demo-config]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/Docs/configure-preconfigured-demo.md