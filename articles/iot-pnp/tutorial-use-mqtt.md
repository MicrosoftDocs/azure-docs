---
title: Use MQTT to create an IoT Plug and Play Preview device client | Microsoft Docs
description: Use the MQTT protocol directly to create an IoT Plug and Play Preview device client without using the Azure IoT Device SDKs
author: ericmitt
ms.author: ericmitt
ms.date: 05/13/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp

# As a device builder, I want to see how I can use the MQTT protocol to create an IoT Plug and Play Preview device client without using the Azure IoT Device SDKs.
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

1. Launch the **Azure IoT explorer** tool.
1. On the **Settings** page, paste the IoT hub connection string into the **App configurations** settings.
1. Select **Save and Connect**.
1. The device you added previously is in the device list on the main page.

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

## Migrate the sample to IoT Plug and Play

### Review the non-IoT Plug and Play sample code

Update the code with details of your IoT hub and device before you build and run it.

To view the sample code in Visual Studio, open the *MQTTWin32.sln* solution file in the *IoTMQTTSample\src\Windows* folder.

In **Solution Explorer**, right-click on the **TelemetryMQTTWin32** project and select **Set as Startup Project**.

In the **TelemetryMQTTWin32** project, open the **MQTT_Mosquitto.cpp** source file. Update the connection information definitions with the device details you made a note of previously. Replace the token string placeholder for the:

* `IOTHUBNAME` identifier with the name of the IoT hub you created.
* `DEVICEID` identifier with the name of the device you created.
* `PWD` identifier with the shared access signature value you generated for the device.

Verify the code is working correctly, by starting Azure IoT explorer, start listening the telemetry.

Run the application (Ctrl+F5), after couple of seconds you see output that looks like:

:::image type="content" source="media/tutorial-use-mqtt/mqtt-sample-output.png" alt-text="Output from MQTT sample application":::

In Azure IoT explorer, you can see that the device isn't an IoT Plug and Play device:

:::image type="content" source="media/tutorial-use-mqtt/non-pnp-iot-explorer.png" alt-text="Non-IoT Plug and Play device in Azure IoT explorer":::

### Make the device an IoT Plug and Play device

IoT Plug and Play device must follow a set of simple conventions. If a device sends a model ID when it connects, it becomes an IoT Plug and Play device.

In this sample, you add a model ID** to the MQTT connection packet. You pass the model ID as querystring parameter in the `USERNAME` and change the `api-version` to `2020-05-31-preview`:

```c
// computed Host Username and Topic
//#define USERNAME IOTHUBNAME ".azure-devices.net/" DEVICEID "/?api-version=2018-06-30"
#define USERNAME IOTHUBNAME ".azure-devices.net/" DEVICEID "/?api-version=2020-05-31-preview&model-id=dtmi:com:example:Thermostat;1"
#define PORT 8883
#define HOST IOTHUBNAME //".azure-devices.net"
#define TOPIC "devices/" DEVICEID "/messages/events/"
```

Rebuild and run the sample.

The device twin now includes the model ID:

:::image type="content" source="media/tutorial-use-mqtt/model-id-iot-explorer.png" alt-text="View the model ID in Azure IoT explorer":::

You can now navigate the IoT Plug and Play component:

:::image type="content" source="media/tutorial-use-mqtt/components-iot-explorer.png" alt-text="View components in Azure IoT explorer":::

You can now modify your device code to implement the telemetry, properties, and commands defined in your model. To see an example implementation of the thermostat device using the Mosquitto library, see [Using MQTT PnP with Azure IoTHub without the IoT SDK on Windows](https://github.com/Azure-Samples/IoTMQTTSample/tree/master/src/Windows/PnPMQTTWin32) on GitHub.

> [!NOTE]
> By default a shared access signature is only valid for 60 minutes.

> [!NOTE]
>The client uses the `IoTHubRootCA_Baltimore.pem` root certificate file to verify the identity of the IoT hub it connects to.

### MQTT topics

The following definitions are for the MQTT topics the device uses to send information to the IoT hub. To learn more, see [Communicate with your IoT hub using the MQTT protocol](../iot-hub/iot-hub-mqtt-support.md):

* The `DEVICE_CAPABILITIES_MESSAGE` defines the topic the device uses to report the interfaces it implements.
* The `DEVICETWIN_PATCH_MESSAGE` defines the topic the device uses to report property updates to the IoT hub.
* The `DEVICE_TELEMETRY_MESSAGE` defines the topic the device uses to send telemetry to your IoT hub.

For more information about MQTT, visit the [MQTT Samples for Azure IoT](https://github.com/Azure-Samples/IoTMQTTSample/) GitHub repository.

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this tutorial, you learned how to modify an MQTT device client to follow the IoT Plug and Play conventions. To learn more about IoT Plug and Play, see:

> [!div class="nextstepaction"]
> [Architecture](concepts-architecture.md)

To learn more about IoT Hub support for the MQTT protocol, see:

> [!div class="nextstepaction"]
> [Communicate with your IoT hub using the MQTT protocol](../iot-hub/iot-hub-mqtt-support.md)
