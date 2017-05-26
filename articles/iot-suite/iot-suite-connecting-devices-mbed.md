---
title: Connect a device using C on mbed | Microsoft Docs
description: Describes how to connect a device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in C running on an mbed device.
services: ''
suite: iot-suite
documentationcenter: na
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 9551075e-dcf9-488f-943e-d0eb0e6260be
ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/22/2017
ms.author: dobett

ROBOTS: NOINDEX
---
# Connect your device to the remote monitoring preconfigured solution (mbed)

## Scenario overview
In this scenario, you create a device that sends the following telemetry to the remote monitoring [preconfigured solution][lnk-what-are-preconfig-solutions]:

* External temperature
* Internal temperature
* Humidity

For simplicity, the code on the device generates sample values, but we encourage you to extend the sample by connecting real sensors to your device and sending real telemetry.

The device is also able to respond to methods invoked from the solution dashboard and desired property values set in the solution dashboard.

To complete this tutorial, you need an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].

## Before you start
Before you write any code for your device, you must provision your remote monitoring preconfigured solution and provision a new custom device in that solution.

### Provision your remote monitoring preconfigured solution
The device you create in this tutorial sends data to an instance of the [remote monitoring][lnk-remote-monitoring] preconfigured solution. If you haven't already provisioned the remote monitoring preconfigured solution in your Azure account, use the following steps:

1. On the <https://www.azureiotsuite.com/> page, click **+** to create a solution.
2. Click **Select** on the **Remote monitoring** panel to create your solution.
3. On the **Create Remote monitoring solution** page, enter a **Solution name** of your choice, select the **Region** you want to deploy to, and select the Azure subscription to want to use. Then click **Create solution**.
4. Wait until the provisioning process completes.

> [!WARNING]
> The preconfigured solutions use billable Azure services. Be sure to remove the preconfigured solution from your subscription when you are done with it to avoid any unnecessary charges. You can completely remove a preconfigured solution from your subscription by visiting the <https://www.azureiotsuite.com/> page.
> 
> 

When the provisioning process for the remote monitoring solution finishes, click **Launch** to open the solution dashboard in your browser.

![Solution dashboard][img-dashboard]

### Provision your device in the remote monitoring solution
> [!NOTE]
> If you have already provisioned a device in your solution, you can skip this step. You need to know the device credentials when you create the client application.
> 
> 

For a device to connect to the preconfigured solution, it must identify itself to IoT Hub using valid credentials. You can retrieve the device credentials from the solution dashboard. You include the device credentials in your client application later in this tutorial.

To add a device to your remote monitoring solution, complete the following steps in the solution dashboard:

1. In the lower left-hand corner of the dashboard, click **Add a device**.
   
   ![Add a device][1]
2. In the **Custom Device** panel, click **Add new**.
   
   ![Add a custom device][2]
3. Choose **Let me define my own Device ID**. Enter a Device ID such as **mydevice**, click **Check ID** to verify that name isn't already in use, and then click **Create** to provision the device.
   
   ![Add device ID][3]
4. Make a note the device credentials (Device ID, IoT Hub Hostname, and Device Key). Your client application needs these values to connect to the remote monitoring solution. Then click **Done**.
   
    ![View device credentials][4]
5. Select your device in the device list in the solution dashboard. Then, in the **Device Details** panel, click **Enable Device**. The status of your device is now **Running**. The remote monitoring solution can now receive telemetry from your device and invoke methods on the device.

[img-dashboard]: ./media/iot-suite-connecting-devices-mbed/dashboard.png
[1]: ./media/iot-suite-connecting-devices-mbed/suite0.png
[2]: ./media/iot-suite-connecting-devices-mbed/suite1.png
[3]: ./media/iot-suite-connecting-devices-mbed/suite2.png
[4]: ./media/iot-suite-connecting-devices-mbed/suite3.png

[lnk-what-are-preconfig-solutions]: iot-suite-what-are-preconfigured-solutions.md
[lnk-remote-monitoring]: iot-suite-remote-monitoring-sample-walkthrough.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/

## Build and run the C sample solution

The following instructions describe the steps for connecting an [mbed-enabled Freescale FRDM-K64F][lnk-mbed-home] device to the remote monitoring solution.

### Connect the mbed device to your network and desktop machine

1. Connect the mbed device to your network using an Ethernet cable. This step is necessary because the sample application requires internet access.

1. See [Getting Started with mbed][lnk-mbed-getstarted] to connect your mbed device to your desktop PC.

1. If your desktop PC is running Windows, see [PC Configuration][lnk-mbed-pcconnect] to configure serial port access to your mbed device.

### Create an mbed project and import the sample code

Follow these steps to add some sample code to an mbed project. You import the remote monitoring starter project and then change the project to use the MQTT protocol instead of the AMQP protocol. Currently, you need to use the MQTT protocol to use the device management features of IoT Hub.

1. In your web browser, go to the mbed.org [developer site](https://developer.mbed.org/). If you haven't signed up, you see an option to create an account (it's free). Otherwise, log in with your account credentials. Then click **Compiler** in the upper right-hand corner of the page. This action brings you to the *Workspace* interface.

1. Make sure the hardware platform you're using appears in the upper right-hand corner of the window, or click the icon in the right-hand corner to select your hardware platform.

1. Click **Import** on the main menu. Then click **Click here to import from URL**.
   
    ![Start import to mbed workspace][6]

1. In the pop-up window, enter the link for the sample code https://developer.mbed.org/users/AzureIoTClient/code/remote_monitoring/ then click **Import**.
   
    ![Import sample code to mbed workspace][7]

1. You can see in the mbed compiler window that importing this project also imports various libraries. Some are provided and maintained by the Azure IoT team ([azureiot_common](https://developer.mbed.org/users/AzureIoTClient/code/azureiot_common/), [iothub_client](https://developer.mbed.org/users/AzureIoTClient/code/iothub_client/), [iothub_amqp_transport](https://developer.mbed.org/users/AzureIoTClient/code/iothub_amqp_transport/), [azure_uamqp](https://developer.mbed.org/users/AzureIoTClient/code/azure_uamqp/)), while others are third-party libraries available in the mbed libraries catalog.
   
    ![View mbed project][8]

1. In the **Program Workspace**, right-click the **iothub\_amqp\_transport** library, click **Delete**, and then click **OK** to confirm.

1. In the **Program Workspace**, right-click the **azure\_amqp\_c** library, click **Delete**, and then click **OK** to confirm.

1. Right-click the **remote_monitoring** project in the **Program Workspace**, select **Import Library**, then select **From URL**.
   
    ![Start library import to mbed workspace][6]

1. In the pop-up window, enter the link for the MQTT transport library https://developer.mbed.org/users/AzureIoTClient/code/iothub\_mqtt\_transport/ then click **Import**.
   
    ![Import library to mbed workspace][12]

1. Repeat the previous step to add the MQTT library from https://developer.mbed.org/users/AzureIoTClient/code/azure\_umqtt\_c/.

1. Your workspace now looks like the following:

    ![View mbed workspace][13]

1. Open the remote\_monitoring\remote_monitoring.c file and replace the existing `#include` statements with the following code:

    ```c
    #include "iothubtransportmqtt.h"
    #include "schemalib.h"
    #include "iothub_client.h"
    #include "serializer_devicetwin.h"
    #include "schemaserializer.h"
    #include "azure_c_shared_utility/threadapi.h"
    #include "azure_c_shared_utility/platform.h"
    #include "parson.h"

    #ifdef MBED_BUILD_TIMESTAMP
    #include "certs.h"
    #endif // MBED_BUILD_TIMESTAMP
    ```
1. Delete all the remaining code in the remote\_monitoring\remote\_monitoring.c file.

[!INCLUDE [iot-suite-connecting-code](../../includes/iot-suite-connecting-code.md)]

## Build and run the sample

Add code to invoke the **remote\_monitoring\_run** function and then build and run the device application.

1. Add a **main** function with following code at the end of the remote\_monitoring.c file to invoke the **remote\_monitoring\_run** function:
   
    ```c
    int main()
    {
      remote_monitoring_run();
      return 0;
    }
    ```

1. Click **Compile** to build the program. You can safely ignore any warnings, but if the build generates errors, fix them before proceeding.

1. If the build is successful, the mbed compiler website generates a .bin file with the name of your project and downloads it to your local machine. Copy the .bin file to the device. Saving the .bin file to the device causes the device to restart and run the program contained in the .bin file. You can manually restart the program at any time by pressing the reset button on the mbed device.

1. Connect to the device using an SSH client application, such as PuTTY. You can determine the serial port your device uses by checking Windows Device Manager.
   
    ![][11]

1. In PuTTY, click the **Serial** connection type. The device typically connects at 9600 baud, so enter 9600 in the **Speed** box. Then click **Open**.

1. The program starts executing. You may have to reset the board (press CTRL+Break or press the board's reset button) if the program does not start automatically when you connect.
   
    ![][10]

[!INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]

[6]: ./media/iot-suite-connecting-devices-mbed/mbed1.png
[7]: ./media/iot-suite-connecting-devices-mbed/mbed2a.png
[8]: ./media/iot-suite-connecting-devices-mbed/mbed3a.png
[10]: ./media/iot-suite-connecting-devices-mbed/putty.png
[11]: ./media/iot-suite-connecting-devices-mbed/mbed6.png
[12]: ./media/iot-suite-connecting-devices-mbed/mbed7.png
[13]: ./media/iot-suite-connecting-devices-mbed/mbed8.png

[lnk-mbed-home]: https://developer.mbed.org/platforms/FRDM-K64F/
[lnk-mbed-getstarted]: https://developer.mbed.org/platforms/FRDM-K64F/#getting-started-with-mbed
[lnk-mbed-pcconnect]: https://developer.mbed.org/platforms/FRDM-K64F/#pc-configuration
