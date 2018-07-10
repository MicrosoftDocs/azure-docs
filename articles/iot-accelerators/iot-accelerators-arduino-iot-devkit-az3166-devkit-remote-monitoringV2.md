---
title: 'IoT DevKit to cloud: Connect IoT DevKit AZ3166 to Remote Monitoring IoT solution accelerator | Microsoft Docs'
description: In this tutorial, learn how to send status of sensors on IoT DevKit AZ3166 to Remote Monitoring IoT solution accelerator for monitoring and visualization.
author: isabelcabezasm
manager: 
ms.service: iot-accelerators
services: iot-accelerators
ms.devlang: c
ms.topic: conceptual
ms.date: 12/03/2018
ms.author: isacabe
---
# Connect MXChip IoT DevKit AZ3166 to the IoT Remote Monitoring solution accelerator


[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

In this tutorial, you learn how to run a sample app on your DevKit to send sensor data to your solution accelerator.

The [MXChip IoT DevKit](https://aka.ms/iot-devkit) is an all-in-one Arduino compatible board with rich peripherals and sensors. You can develop for it using [Visual Studio Code extension for Arduino](https://aka.ms/arduino). And it comes with a growing [projects catalog](https://microsoft.github.io/azure-iot-developer-kit/docs/projects/) to guide you prototype Internet of Things (IoT) solutions that take advantage of Microsoft Azure services.

## What you need

Finish the [Getting Started Guide](https://docs.microsoft.com/azure/iot-hub/iot-hub-arduino-iot-devkit-az3166-get-started) to:

* Have your DevKit connected to Wi-Fi
* Prepare the development environment


## Open the RemoteMonitoring sample

1. Disconnect the DevKit from your computer, if it is connected.

2. Start VS Code.

3. Connect the DevKit to your computer. VS Code automatically detects your DevKit and opens the following pages:
  * The DevKit introduction page.
  * Arduino Examples: Hands-on samples to get started with DevKit.

4. Expand left side **ARDUINO EXAMPLES** section, browse to **Examples for MXCHIP AZ3166 > AzureIoT**, and select **RemoteMonitoringv2**. It opens a new VS Code window with a project folder in it.

  ![Open Remote Monitoring project](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-arduino-examples.png)


  > [!NOTE]
  > If you happen to close the pane, you can reopen it. Use `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`) to open the command palette, type **Arduino**, and then find and select **Arduino: Examples**.

## Add a new physical device

In the portal, go to **Devices** section and there, click in the  **+New Device** button. 

![Adding a new device](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-add-device.png)

The *new device form* should be filled in.
1. Click **Physical** in the *Device type* section.
2. Define your own Device ID (for example *MXChip* or *AZ3166*).
3. Choose **Auto generate keys** in the *Authentication key* section.
4. Click *Apply* button.

![Adding a new device form](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-add-new-device-form.png)

Wait until the portal finishes the provisioning of the new device.

![Provisioning a new device ](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-add-device-provisioning.png)


Then the configuration of the new device, will be shown.
Copy the **Connection String** generated.

![Device Connection String](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-new-device-connstring.png)


This connection string will be used in the next section.





## Build and upload the device code

Go back to the Visual Studio Code: 

1. Use `Ctrl+P` (macOS: `Cmd + P`) and type **task config-device-connection**.

  ![choose your Azure Subscription and your IoT Hub](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/iot-suite-task-config-device-conexion.png)

2. The terminal asks you whether you want to use connection string of IoT device would you like to use. Select *create new*, and now paste it.

  ![paste connection string](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/iot-suite-task-config-device-conexion-choose-iot-hub-press-button-A.png)

3. The terminal sometimes prompts you to enter configuration mode. To do so, hold down button A, then push and release the reset button and then release the button A. 
The screen displays the DevKit ID and 'Configuration'.

  ![Device DevKit Screen](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-devkit-screen.png)

  > [!NOTE]
  > The connection string should be saved in your clipboard if you followed the last section of this tutorial. If not, you should go to the Azure portal and look for the IoT Hub of your Remote Monitoring resource group. There, you can see the IoT Hub connected devices and copy the Device connection string.

  ![look for the connection string](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-connection-string-of-a-device.png)


Now, you can see your new physical device in the VS Code section "Azure IoT Hub Devices":

![Notice the new IoT Hub Device](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/iot-suite-new-iot-hub-device.png)

## Test the project

When the sample app runs, DevKit sends sensor data over Wi-Fi to your IoT solution accelerators. To see the result, follow these steps:

1. Go to your IoT solution accelerator, and click **DASHBOARD**.

2. On the IoT solution accelerator console, you will see your DevKit sensor status. 

![Sensor data in IoT solution accelerators](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-dashboard.png)

If you click on the sensor name (AZ3166) a tab opens on the right side of the dashboard, where you can see the MX Chip sensors chart in real time.


## Send a C2D message
Remote Monitoring v2 allows you to invoke remote method on the device.
The MX Chip example code publishes three methods that you can see in the Method section when the sensor is selected.

![Methods  MX Chip](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-methods.png)

You can change the color of one of the MX Chip leds using the method "LedColor". For doing it, select the checkbox of the device and click on the Schedule button. 

![Methods  MX Chip](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-schedule.png)

Choose the method called ChangeColor in the dropdown where all the methods appear, write a name, and Apply.

![Dropdown  MX Chip](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/iot-suite-change-color.png)

In several seconds, your physical MX Chip should change the color of the RGB led (below of the A button)

![Led  MX Chip](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-devkit-led.png)


## Change device ID

You can change the device ID in IoT Hub by following [this guide](https://microsoft.github.io/azure-iot-developer-kit/docs/customize-device-id/).


## Problems and feedback

If you encounter problems, refer to [FAQs](https://microsoft.github.io/azure-iot-developer-kit/docs/faq/) or reach out to us from the following channels:

* [Gitter.im](http://gitter.im/Microsoft/azure-iot-developer-kit)
* [Stackoverflow](https://stackoverflow.com/questions/tagged/iot-devkit)

## Next steps

Now that you have learned how to connect a DevKit device to your IoT solution accelerators and visualize the sensor data, here are the suggested next steps:

* [IoT solution accelerators overview](https://docs.microsoft.com/azure/iot-suite/)
* [Connect an MXChip IoT DevKit device to your Microsoft IoT Central application](https://docs.microsoft.com/microsoft-iot-central/howto-connect-devkit)
