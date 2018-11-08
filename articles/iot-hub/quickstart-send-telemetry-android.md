---
title: Send telemetry to Azure IoT Hub quickstart (Android) | Microsoft Docs
description: In this quickstart, you run a sample Android application to send simulated telemetry to an IoT hub and to read telemetry from the IoT hub for processing in the cloud.
author: wesmc7777
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.devlang: java
ms.topic: quickstart
ms.custom: mvc
ms.date: 11/05/2018
ms.author: wesmc
# As a developer new to IoT Hub, I need to see how IoT Hub sends telemetry from an Android device to an IoT hub and how to read that telemetry data from the hub using a back-end application. 
---

# Quickstart: Send IoT telemetry from an Android device

[!INCLUDE [iot-hub-quickstarts-1-selector](../../includes/iot-hub-quickstarts-1-selector.md)]

IoT Hub is an Azure service that enables you to ingest high volumes of telemetry from your IoT devices into the cloud for storage or processing. In this quickstart, you send telemetry from a simulated device application, through IoT Hub, to a back-end application for processing.

The quickstart uses a pre-written Android application to send the telemetry. The telemetry will be read from the IoT Hub using the Azure Cloud Shell. Before you run the application, you create an IoT hub and register a device with the hub.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
The sample application you run in this quickstart is written in Android and you need Android SDK 27

To run the application, we are using Android studio IDE.

You can download Android studio from https://developer.android.com/studio/ and install it. For more information regarding Android studio installation, see the [android-installation]

Download the sample Android project from https://github.com/Azure/azure-iot-sdk-java/tree/master/device/iot-device-samples/android-sample.

## Create an IoT hub

[!INCLUDE [iot-hub-quickstarts-create-hub](../../includes/iot-hub-quickstarts-create-hub.md)]

## Register a device

A device must be registered with your IoT hub before it can connect. In this quickstart, you use the Azure Cloud Shell to register a simulated device.

1. Run the following commands in Azure Cloud Shell to add the IoT Hub CLI extension and to create the device identity. 

   **YourIoTHubName: Replace this placeholder below with the name you choose for your IoT hub.

   **MyAndroidDevice: MyAndroidDevice is the name given for the registered device. Use MyAndroidDevice as shown. If you choose a different name for your device, you will also need to use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az extension add --name azure-cli-iot-ext
    az iot hub device-identity create --hub-name YourIoTHubName --device-id MyAndroidDevice
    ```

2. Run the following commands in Azure Cloud Shell to get the _device connection string_ for the device you just registered:
    **YourIoTHubName: Replace this placeholder below with the name you choose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name YourIoTHubName --device-id MyAndroidDevice --output table
    ```

    Make a note of the device connection string, which looks like:

   `HostName={YourIoTHubName}.azure-devices.net;DeviceId=MyNodeDevice;SharedAccessKey={YourSharedAccessKey}`

    You use this value later in the quickstart.

## Send simulated telemetry

 Open the github sample Android project in Android Studio. Navigate to app/src/main/java/com/iothub/azure/microsoft/com/MainActivity.java file.

Replace the value of the `connString` variable with the device connection string you made a note of previously. Then save your changes to MainActivity.java file.

You can run the application using emulator or by connecting Android device. For more Information, see the [running-app]

Once the app loads, You can see the following screen:

![Application](media/quickstart-send-telemetry-android/edited-image.png)

Upon clicking `Send Message` button in the Android application, the simulated device connects to a device-specific endpoint on your IoT hub and sends simulated temperature and humidity telemetry.

## Read the telemetry from your hub

In this section, you will use the Azure Cloud Shell with the [IoT extension](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot?view=azure-cli-latest) to monitor the device messages that are sent by the simulated device.

1. Using the Azure Cloud Shell, run the following command to connect and read messages from your IoT hub:

   **YourIoTHubName: Replace this placeholder below with the name you choose for your IoT hub.

    ```azurecli-interactive
    az iot hub monitor-events --hub-name YourIoTHubName --output table
    ```
The following screenshot shows the output as the IoT hub receives telemetry sent by the simulated device:

  ![Read the device messages using the Azure CLI](media/quickstart-send-telemetry-android/read-data.png)


## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources](../../includes/iot-hub-quickstarts-clean-up-resources.md)]

## Next steps

In this quickstart, you've setup an IoT hub, registered a device, sent simulated telemetry to the hub using an Android application, and read the telemetry from the hub using the Azure Cloud Shell.

To learn how to control your simulated device from a back-end application, continue to the next quickstart.

> [!div class="nextstepaction"]
> [Quickstart: Control a device connected to an IoT hub](quickstart-control-device-java.md)

<!--Links-->
[running-app]: https://developer.android.com/training/basics/firstapp/running-app
[android-installation]: https://developer.android.com/studio/install 