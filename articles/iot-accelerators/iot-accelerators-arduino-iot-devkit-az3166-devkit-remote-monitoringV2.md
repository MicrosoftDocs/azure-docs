---
title: IoT DevKit to cloud -- Connect IoT DevKit AZ3166 to Remote Monitoring IoT solution accelerator | Microsoft Docs
description: In this tutorial, learn how to send status of sensors on IoT DevKit AZ3166 to Remote Monitoring IoT solution accelerator for monitoring and visualization.
author: isabelcabezasm
manager: 
ms.service: iot-accelerators
services: iot-accelerators
ms.devlang: c
ms.topic: conceptual
ms.date: 05/09/2018
ms.author: isacabe
---
# Connect MXChip IoT DevKit AZ3166 to the IoT Remote Monitoring solution accelerator

[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

You will learn how to run a sample app on your IoT DevKit to send sensor data to your solution accelerator.

The [MXChip IoT DevKit](https://aka.ms/iot-devkit) is an all-in-one Arduino compatible board with rich peripherals and sensors. You can develop for it using [Azure IoT Workbench](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-iot-workbench) in Visual Studio Code. And it comes with a growing [projects catalog](https://microsoft.github.io/azure-iot-developer-kit/docs/projects/) to guide you prototype Internet of Things (IoT) solutions that take advantage of Microsoft Azure services.

## What you need

Go through the [Getting Started Guide](https://docs.microsoft.com/azure/iot-hub/iot-hub-arduino-iot-devkit-az3166-get-started) and **finish the following sections only**:

* Prepare your hardware
* Configure Wi-Fi
* Start using the DevKit
* Prepare the development environment

## Open the Remote Monitoring sample in VS Code

1. Make sure your IoT DevKit is **not connected** to your computer. Start VS Code first, and then connect the DevKit to your computer.

2. Click `F1` to open the command palette, type and select **IoT Workbench: Examples**. Then select **IoT DevKit** as board.

3. Find **Remote Monitoring** and click **Open Sample**. It opens a new VS Code window with project folder in it.
  ![IoT Workbench, select Remote Monitoring example](media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringv2/iot-workbench-example.png)

## Configure IoT Hub device connection string

1. Switch the IoT DevKit into **Configuration mode**. To do so:
   * Hold down button **A**.
   * Push and release the **Reset** button.

2. The screen displays the DevKit ID and 'Configuration'.
   
  ![IoT DevKit Configuration Mode](media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringv2/devkit-configuration-mode.png)

3. Click `F1` to open the command palette, type and select **IoT Workbench: Device > Config Device Settings**.

4. Paste the connection string you just copied click `Enter` to configure it.

## Build and upload the device code

1. Click `F1` to open the command palette, type and select **IoT Workbench: Device > Device Upload**.
  ![IoT Workbench: Device - > Upload](media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringv2/iot-workbench-device-upload.png)

1. VS Code then starts compiling and uploading the code to your DevKit.
  ![IoT Workbench: Device - > Uploaded](media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringv2/iot-workbench-device-uploaded.png)

The DevKit reboots and starts running the code.

## Test the project

### View the telemetry sent to Remote Monitoring solution

When the sample app runs, DevKit sends sensor data over Wi-Fi to your Remote Monitoring solution. To see the result, follow these steps:

1. Go to your solution dashboard, and click **Devices**.

2. Click on the device name, on the right hand tab, you can see the sensor status on DevKit in real time.
  ![Sensor data in Azure IoT Suite](media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringv2/azure-iot-suite-dashboard.png)

### Send a C2D message

Remote Monitoring solution allows you to invoke remote method on the device. The sxample code publishes three methods that you can see in the **Method** section when the sensor is selected.

![IoT DevKit Methods](media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringv2/azure-iot-suite-methods.png)

Let us try change the color of one of the DevKit LEDs using the method "LedColor".

1. Select the device name from device list and click on the **Jobs**.

  ![Create a Job](media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringv2/azure-iot-suite-job.png)

2. Configure the Jobs as below and click **Apply**.
  * Select Job: **Run method**
  * Method name: **LedColor**
  * Job Name: **ChangeLedColor**
  
  ![Job settings](media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringv2/iot-suite-change-color.png)

In several seconds, your DevKit should change the color of the RGB LED (below the button A).

![IoT DevKit red led](media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringv2/azure-iot-suite-devkit-led.png)

## Clean up resources

If you plan to move on to the tutorials, leave the Remote Monitoring solution accelerator deployed.

If you no longer need the solution accelerator, delete it from the Provisioned solutions page, by selecting it, and then clicking Delete Solution:

![Delete solution](media/quickstart-remote-monitoring-deploy/deletesolution.png)

## Problems and feedback

If you encounter problems, refer to [the IoT DevKit FAQs](https://microsoft.github.io/azure-iot-developer-kit/docs/faq/) or reach out to us using the following channels:

* [Gitter.im](http://gitter.im/Microsoft/azure-iot-developer-kit)
* [Stackoverflow](https://stackoverflow.com/questions/tagged/iot-devkit)

## Next steps

Now that you have learned how to connect a DevKit device to your Azure IoT Remote Monitoring solution accelerator and visualize the sensor data, here are the suggested next steps:

* [Azure IoT solution accelerators overview](https://docs.microsoft.com/azure/iot-suite/)
* [Customize the UI](../iot-accelerators/iot-accelerators-remote-monitoring-customize.md)
* [Connect IoT DevKit to your Azure IoT Central application](../iot-central/howto-connect-devkit.md)