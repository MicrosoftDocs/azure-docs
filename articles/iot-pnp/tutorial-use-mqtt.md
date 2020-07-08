---
title: Use MQTT to create an Azure IoT Plug and Play Preview device client | Microsoft Docs
description: Use the MQTT protocol directly to create an IoT Plug and Play Preview device client without using the Azure IoT Device SDKs
author: ericmitt
ms.author: ericmitt
ms.date: 05/13/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device developer, I want to see how I can use the MQTT protocol to create an IoT Plug and Play Preview device client without using the Azure IoT Device SDKs.
---

# Use MQTT to develop an IoT Plug and Play Preview device client

You should use one of the Azure IoT Device SDKs to build your IoT Plug and Play device clients if at all possible. However, in scenarios such as using a memory constrained device, you may need to use an MQTT library to communicate with your IoT hub.

The sample in this tutorial uses the [Eclipse Mosquitto](http://mosquitto.org/) MQTT library and Visual Studio. The steps in this tutorial assume you're using Windows on your development machine.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this tutorial on Windows, install the following software on your local Windows environment:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure you include the **Desktop Development with C++** workload when you [install](https://docs.microsoft.com/cpp/build/vscpp-step-0-installation?view=vs-2019) Visual Studio
* [Git](https://git-scm.com/download/)
* [CMake](https://cmake.org/download/)
* [Azure IoT explorer](howto-install-iot-explorer.md)

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the shared access signature the device to connect to your hub. Make a note of this string, you use it later in this tutorial:

```azurecli-interactive
az iot hub generate-sas-token -d <YourDeviceID> -n <YourIoTHubName>
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

Use the IoT hub connection string to configure the **Azure IoT explorer** tool:

* Launch the **Azure IoT explorer** tool.
* On the **Settings** page, paste the IoT hub connection string into the **App configurations** settings.
* Select **Save and Connect**.
* The device you added previously is in the device list on the main page.

## Clone sample repo

Use the following command to clone the sample repository to a suitable location on your local machine:

```cmd
git clone https://github.com/Azure-Samples/IoTMQTTSample.git
```

## Install MQTT library

Use the `vcpkg` tool to download and build the Eclipse Mosquitto library.

Use the following command to clone the **Vcpkg** repository to a suitable location on your local machine:

```cmd
git clone https://github.com/Microsoft/vcpkg.git
```

Use the following commands to prepare the `vcpkg` environment. You need an elevated command prompt when you run `vcpkg integrate install`:

```cmd
cd vcpkg
.\bootstrap-vcpkg.bat
.\vcpkg integrate install
```

Use the following command to download and build the Eclipse Mosquitto library:

```cmd
.\vcpkg install mosquitto:x64-windows
```

## Review sample code

Update the code with details of your IoT hub and device before you build and run it.

To view the sample code in Visual Studio, open the *MQTTWin32.sln* solution file in the *IoTMQTTSample\src\Windows* folder.

In **Solution Explorer**, right-click on the **PnPMQTTWin32** project and select **Set as Startup Project**.

In the **PnPMQTTWin32** project, open the **PnPMQTTWin32.cpp** source file. Update the connection information definitions with the device details you made a note of previously. Replace the token string placeholder for the:

* `IOTHUBNAME` identifier with the name of the IoT hub you created.
* `DEVICEID` identifier with the name of the device you created.
* `PWD` identifier with the shared access signature value you generated for the device.

> [!NOTE]
> By default a shared access signature is only valid for 60 minutes.

Before you build and run the sample, review the key features of sample code:

### Certificate file

The client uses the `IoTHubRootCA_Baltimore.pem` root certificate file to verify the identity of the IoT hub it connects to.

### MQTT topics

The following definitions are for the MQTT topics the device uses to send information to the IoT hub:

* The `DEVICE_CAPABILITIES_MESSAGE` defines the topic the device uses to report the interfaces it implements.
* The `DEVICETWIN_PATCH_MESSAGE` defines the topic the device uses to report property updates to the IoT hub.
* The `DEVICE_TELEMETRY_MESSAGE` defines the topic the device uses to send telemetry to your IoT hub.

### Messages

The `publish_next_packet` function shows how to build the messages sent to the different MQTT topics. For example:

* The message sent to the `DEVICE_CAPABILITIES_MESSAGE` topic lists the four interfaces the device implements: `ModelInformation`, `SDKInformation`, `DeviceInformation`, and `built_in_sensors`.
* The message sent to the `DEVICETWIN_PATCH_MESSAGE` topic includes properties defined in the `SDKInformation` and `DeviceInformation` interfaces.
* The message sent to the `DEVICE_TELEMETRY_MESSAGE` topic includes the temperature telemetry.

### Main loop

The `main` method first initializes the Eclipse Mosquitto library and sets up some callbacks. After it sets up the secure TLS connection to your IoT hub, it then sets up the Mosquitto processing loop.

## Build and run sample code

To build the project, right-click on the **PnPMQTTWin32** project in **Solution Explorer** and select **Build**.

If it's not already running, launch the **Azure IoT explorer** tool. In the list of devices, click on the device you added to the hub. In the menu on the left-hand side, select **Telemetry**, and then **Start**. The status changes to **Receiving events**.

In Visual Studio, on the main menu, select **Debug > Start Debugging**. The command prompt window shows the following output:

```cmd
Using MQTT to send message to youriothub.azure-devices.net.
Using certificate: IoTHubRootCA_Baltimore.pem
Setting up options OK
Connecting...
Connect returned OK
Entering Mosquitto Loop...
Connect callback returned result: No error.

Publishing device capabilities....
Publish returned OK
Publish OK. mid=1

Publishing device twin properties....
Publish returned OK
Publish OK. mid=2

Publishing device telemetry....
Publish returned OK
Publish OK. mid=3
```

In the **Azure IoT explorer** tool, you see a message on the **Telemetry** page that looks like the following JSON snippet:

```json
{
  "body": {
    "Temperature": 32
  },
  "enqueuedTime": "2020-07-07T08:49:35.521Z",
  "properties": {
    "iothub-message-schema": "Temperature"
  }
}
```

On the **Device twin** page, you see the properties the device sent. On the **IoT Plug and Play components** page, you see a list of the interfaces the device says it supports.

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about how Azure IoT Plug and Play, see:

> [!div class="nextstepaction"]
> [Architecture](concepts-architecture.md)

To learn more about IoT Hub support for the MQTT protocol, see:

> [!div class="nextstepaction"]
> [Communicate with your IoT hub using the MQTT protocol](../iot-hub/iot-hub-mqtt-support.md)
