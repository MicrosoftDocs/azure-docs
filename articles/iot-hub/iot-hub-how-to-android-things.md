---
title: Develop for Android Things platform using Azure IoT SDKs | Microsoft Docs
description: Developer guide - Learn about how to develop on Android Things using Azure IoT Hub SDKs.
author: yzhong94
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/30/2019
ms.author: yizhon
---
# Develop for Android Things platform using Azure IoT SDKs

[Azure IoT Hub SDKs](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-sdks) provide first tier support for popular platforms such as Windows, Linux, OSX, MBED, and mobile platforms like Android and iOS.  As part of our commitment to enable greater choice and flexibility in IoT deployments, the Java SDK also supports [Android Things](https://developer.android.com/things/) platform.  Developers can leverage the benefits of Android Things operating system on the device side, while using [Azure IoT Hub](about-iot-hub.md) as the central message hub that scales to millions of simultaneously connected devices.

This tutorial outlines the steps to build a device side application on Android Things using the Azure IoT Java SDK.

## Prerequisites

* An Android Things supported hardware with Android Things OS running.  You can follow [Android Things documentation](https://developer.android.com/things/get-started/kits#flash-at) on how to flash Android Things OS.  Make sure your Android Things device is connected to the internet with essential peripherals such as keyboard, display, and mouse attached.  This tutorial uses Raspberry Pi 3.

* Latest version of [Android Studio](https://developer.android.com/studio/)

* Latest version of [Git](https://git-scm.com/)

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Register a device

A device must be registered with your IoT hub before it can connect. In this quickstart, you use the Azure Cloud Shell to register a simulated device.

1. Run the following commands in Azure Cloud Shell to add the IoT Hub CLI extension and to create the device identity.

   **YourIoTHubName** : Replace this placeholder below with the name you choose for your IoT hub.

   **MyAndroidThingsDevice** : This is the name given for the registered device. Use MyAndroidThingsDevice as shown. If you choose a different name for your device, you will also need to use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az extension add --name azure-cli-iot-ext
    az iot hub device-identity create --hub-name YourIoTHubName --device-id MyAndroidThingsDevice
    ```

2. Run the following commands in Azure Cloud Shell to get the *device connection string* for the device you just registered. Replace `YourIoTHubName` below with the name you choose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name YourIoTHubName --device-id MyAndroidThingsDevice --output table
    ```

    Make a note of the device connection string, which looks like:

   `HostName={YourIoTHubName}.azure-devices.net;DeviceId=MyAndroidThingsDevice;SharedAccessKey={YourSharedAccessKey}`

    You use this value later in the quickstart.

## Building an Android Things application

1. The first step to building an Android Things application is connecting to your Android Things devices. Connect your Android Things device to a display and connect it to the internet. Android Things provide [documentation](https://developer.android.com/things/get-started/kits) on how to connect to WiFi. After you have connected to the internet, take a note of the IP address listed under Networks.

2. Use the [adb](https://developer.android.com/studio/command-line/adb) tool to connect to your Android Things device with the IP address noted above. Double check the connection by using this command from your terminal. You should see your devices listed as "connected".

   ```
   adb devices
   ```

3. Download our sample for Android/Android Things from this [repository](https://github.com/Azure-Samples/azure-iot-samples-java) or use Git.

   ```
   git clone https://github.com/Azure-Samples/azure-iot-samples-java.git
   ```

4. In Android Studio, open the Android Project in located in "\azure-iot-samples-java\iot-hub\Samples\device\AndroidSample".

5. Open gradle.properties file, and replace "Device_connection_string" with your device connection string noted earlier.
 
6. Click on Run - Debug and select your device to deploy this code to your Android Things devices.

7. When the application is started successfully, you can see an application running on your Android Things device. This sample application sends randomly generated temperature readings.

## Read the telemetry from your hub

You can view the data through your IoT hub as it is received. The IoT Hub CLI extension can connect to the service-side **Events** endpoint on your IoT Hub. The extension receives the device-to-cloud messages sent from your simulated device. An IoT Hub back-end application typically runs in the cloud to receive and process device-to-cloud messages.

Run the following commands in Azure Cloud Shell, replacing `YourIoTHubName` with the name of your IoT hub:

```azurecli-interactive
az iot hub monitor-events --device-id MyAndroidThingsDevice --hub-name YourIoTHubName
```

## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources](../../includes/iot-hub-quickstarts-clean-up-resources.md)]

## Next steps

* Learn about [how to manage connectivity and reliable messaging](iot-hub-reliability-features-in-sdks.md) using the IoT Hub SDKs.
* Learn about how to [develop for mobile platforms](iot-hub-how-to-develop-for-mobile-devices.md) such as iOS and Android.
* [Azure IoT SDK platform support](iot-hub-device-sdk-platform-support.md)
