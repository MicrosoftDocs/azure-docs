---
title: IoT DevKit to cloud -- Connect IoT DevKit AZ3166 to Remote Monitoring IoT solution accelerator | Microsoft Docs
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

Go through the [Getting Started Guide](https://docs.microsoft.com/azure/iot-hub/iot-hub-arduino-iot-devkit-az3166-get-started) and **finish the following sections only**:

* Prepare your hardware
* Configure Wi-Fi
* Start using the DevKit
* Prepare the development environment


## Open the RemoteMonitoring sample in VS Code

1. Disconnect the MXChip DevKit from your computer, if it is connected.

2. Start VS Code.

3. Connect the MXChip DevKit to your computer.

4. Use `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`) to open the command palette, type **Arduino**, and then find and select **Arduino: Examples**.

 5. Expand left side **ARDUINO EXAMPLES** section, browse to **Examples for MXCHIP AZ3166 > AzureIoT**, and select **RemoteMonitoringv2**. It opens a new VS Code window with a project folder in it.

  > [!NOTE]
  > If you you don't see **Examples for MXCHIP**, use `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`) to open the command palette and type **Arduino Board Manager**. Select it, then search for **AZ3166** within the board manager. You should then be able to repeat step 5 above and see the examples.

  ![Open Remote Monitoring project](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-arduino-examples.png)

  > [!NOTE]
  > If you happen to close the pane, you can reopen it. Use `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`) to open the command palette, type **Arduino**, and then find and select **Arduino: Examples**.

## Build and upload the device code to your MXChip

1. Use `Ctrl+P` (macOS: `Cmd + P`) and type **task config-device-connection**.

  ![choose your Azure Subscription and your IoT Hub](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/iot-suite-task-config-device-conexion.png)

2. The terminal asks you whether you want to use connection string of IoT device would you like to use. Select *create new*, and now paste it.

  ![paste connection string](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/iot-suite-task-config-device-conexion-choose-iot-hub-press-button-A.png)

3. The terminal sometimes prompts you to enter configuration mode. To do so, hold down **button A**, then push and release the **reset button** and then release the button A. 
The screen displays the DevKit ID and 'Configuration'.

  ![Device DevKit Screen](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-devkit-screen.png)

  > [!NOTE]
  > The connection string should be saved in your clipboard if you followed the last section of this tutorial. If not, you should go to the Azure portal and look for the IoT Hub of your Remote Monitoring resource group. There, you can see the IoT Hub connected devices and copy the Device connection string.

  ![look for the connection string](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-connection-string-of-a-device.png)

  Now you have successfully connected and verified your MXChip device to the IoT Hub. In order to see your new physical device in the VS Code section of "Azure IoT Hub Devices", you must download the [Azure IoT Toolkit extension.](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) 

  Now, you can see your new physical device in the VS Code section "Azure IoT Hub Devices":

  ![Notice the new IoT Hub Device](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/iot-suite-new-iot-hub-device.png)

4. Finally, you will upload the RemoteMonitoringV2.ino code onto your MxChip to begin sending data to your IoT solution accelerator. Use `Ctrl + Shift + P` (macOS: `Cmd + Shift + P`) and type **Arduino Upload**. VS Code will then start uploading the code onto your MXChip and notify you when complete. 

## Test the project

When the sample app runs, your MXChip DevKit sends sensor data over Wi-Fi to your IoT solution accelerators. To see the result, follow these steps:

1. Go to your IoT solution accelerator, and click **DASHBOARD**.

2. On the IoT solution accelerator console, you will see your MXChip DevKit sensor status. 

![Sensor data in IoT solution accelerators](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-dashboard.png)

If you click on the sensor name (AZ3166) a tab opens on the right side of the dashboard, where you can see the MXChip sensors chart in real time.


## Send a C2D message
Remote Monitoring v2 allows you to invoke remote method on the device.
The MX Chip example code publishes three methods that you can see in the Method section when the sensor is selected.

![Methods  MX Chip](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-methods.png)

You can change the color of one of the MX Chip LEDs using the method "LedColor". For doing it, select the checkbox of the device and click on the Schedule button. 

![Methods  MX Chip](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-schedule.png)

Choose the method called ChangeColor in the dropdown where all the methods appear, write a name, and Apply.

![Dropdown  MX Chip](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/iot-suite-change-color.png)

In several seconds, your physical MX Chip should change the color of the RGB LED (below of the A button)

![LED  MX Chip](./media/iot-accelerators-arduino-iot-devkit-az3166-devkit-remote-monitoringV2/azure-iot-suite-devkit-led.png)

## Problems and feedback

If you encounter problems, refer to [FAQs](https://microsoft.github.io/azure-iot-developer-kit/docs/faq/) or reach out to us from the following channels:

* [Gitter.im](http://gitter.im/Microsoft/azure-iot-developer-kit)
* [Stackoverflow](https://stackoverflow.com/questions/tagged/iot-devkit)

## Next steps

Now that you have learned how to connect a DevKit device to your IoT solution accelerators and visualize the sensor data, here are the suggested next steps:

* [IoT solution accelerators overview](https://docs.microsoft.com/azure/iot-suite/)
* [Connect an MXChip IoT DevKit device to your Microsoft IoT Central application](https://docs.microsoft.com/microsoft-iot-central/howto-connect-devkit)
* [IoT developer kit](https://microsoft.github.io/azure-iot-developer-kit/)
