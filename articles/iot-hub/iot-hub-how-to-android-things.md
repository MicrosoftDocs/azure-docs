---
title: Develop for Android Things platform using Azure IoT SDKs | Microsoft Docs
description: Developer guide - Learn about how to develop on Android Things using Azure IoT Hub SDKs.
author: yzhong94
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 1/30/2019
ms.author: yizhon
---

# Develop for mobile devices using Azure IoT SDKs

[Azure IoT Hub SDKs](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-sdks) provide first tier support for a wide range of popular platforms, including Windows, Linux, OSX, MBED, and mobile platforms like Android and iOS.  As part of our commitment to enable greater choice and flexibility in IoT deployments, the Java SDK also supports [Android Things](https://developer.android.com/things/) platform.  Developers can leverage the benefits of Android Things operating system on the device side, while using [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/about-iot-hub) as the central message hub that scales to millions of simultaneously connected devices. 

This tutorial outlines the steps to build a device side application on Android Things using the Azure IoT Java SDK.

## Prerequisites
* An Android Things supported hardware with Android Things OS running.  You can follow [Android Things documentation](https://developer.android.com/things/get-started/kits#flash-at) on how to flash Android Things.  Make sure your Android Things device is connected to the internet with essential peripherals such as keyboard, display and mouse attached.  This tutorial uses Raspberry Pi 3.
* Latest version of [Android Studio](https://developer.android.com/studio/)
* An active IoT Hub.  Learn about how to create an IoT Hub in this [documentation](iot-hub-create-through-portal.md).
* Latest version of [Git](https://git-scm.com/)

## Building an Android Things application
1.  ADD A STEP ABOUT CREATING A DEVICE
2.  The first step to building an Android Things application is connecting to your Android Things devices.  Connect your Android Things device to a display and connect it to the internet.  Android Things provide [documentation](https://developer.android.com/things/get-started/kits) on how to connect to WiFi.  After you have connected to the internet, take a note of the IP address listed under Networks.
3.  Use the [adb](https://developer.android.com/studio/command-line/adb) tool to connect to your Android Things device with the IP address noted above.  Double check the connection by using this command from your terminal.  You should see your devices listed as "connected"
    ```
    adb devices
    ```
4.  Download our sample for Android/Android Things from this [repository](https://github.com/Azure-Samples/azure-iot-samples-java) or use Git.
    ```
    git clone https://github.com/Azure-Samples/azure-iot-samples-java.git
    ```
5.  In Android Studio, open the Android Project in "\azure-iot-samples-java\iot-hub\Samples\device\AndroidSample".
6.  Open gradle.properties file, and replace "Device_connection_string" with your device connection string.
7.  Go to Run - Debug and select your device to deploy this code to your Android Things devices

## Next steps

* [IoT Hub REST API reference](https://docs.microsoft.com/rest/api/iothub/)
* [Azure IoT C SDK source code](https://github.com/Azure/azure-iot-sdk-c)
