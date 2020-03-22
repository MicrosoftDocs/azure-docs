---
title: Connect IoT Plug and Play Preview sample device code to IoT Hub | Microsoft Docs
description: Using Java, build and run IoT Plug and Play Preview sample device code that connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: dominicbetts
ms.author: dobett
ms.date: 12/27/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device developer, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties, commands and telemetry. As a solution developer, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect a sample IoT Plug and Play Preview device application to IoT Hub (Java)

[!INCLUDE [iot-pnp-quickstarts-2-selector.md](../../includes/iot-pnp-quickstarts-2-selector.md)]

This quickstart shows you how to build a sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written in Java, and is provided as part of the Azure IoT Samples for Java collection. A solution developer can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this quickstart, you need Java SE 8 on your development machine. You also need to install Maven 3.

For details on how to get set up with these, see [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-java/blob/preview/doc/java-devbox-setup.md) in the Microsoft Azure IoT device SDK for Java.

### Install the Azure IoT explorer

Download and install the latest release of **Azure IoT explorer** from the tool's [repository](https://github.com/Azure/azure-iot-explorer/releases) page, by selecting the .msi file under "Assets" for the most recent update.

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub (note for use later):

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

## Prepare the development environment

In this quickstart, you prepare a development environment you can use to clone and build the Azure IoT Samples for Java.

Open a terminal window in the directory of your choice. Execute the following command to clone the [Azure IoT Samples for Java](https://github.com/Azure-Samples/azure-iot-samples-java) GitHub repository into this location:

```cmd/sh
git clone https://github.com/Azure-Samples/azure-iot-samples-java
```

This operation may take several minutes to complete.

## Build the code

You use the cloned sample code to build an application simulating a device that connects to an IoT hub. The application sends telemetry and properties and receives commands.

1. In a local terminal window, go to the folder of your cloned repository and navigate to the **/azure-iot-samples-java/digital-twin/Samples/device/JdkSample** folder. Then run the following command to install the required libraries and build the simulated device application:

    ```cmd/sh
    mvn clean install -DskipTests
    ```

1. Configure the _device connection string_:

    ```cmd/sh
    set DIGITAL_TWIN_DEVICE_CONNECTION_STRING=<YourDeviceConnectionString>
    ```

## Run the device sample

Run a sample application to simulate an IoT Plug and Play device that sends telemetry to your IoT hub. To run the sample application, use the following command:

```cmd\sh
java -jar environmental-sensor-sample\target\environmental-sensor-sample-with-deps.jar
```

You see messages saying that the device is connected, performing various setup steps, and waiting for service updates, followed by telemetry logs. This indicates that the device is now ready to receive commands and property updates, and has begun sending telemetry data to the hub. Keep the sample running as you complete the next steps.

## Use the Azure IoT explorer to validate the code

[!INCLUDE [iot-pnp-iot-explorer-1.md](../../includes/iot-pnp-iot-explorer-1.md)]

4. To ensure the tool can read the interface model definitions from your device, select **Settings**. In the Settings menu, **On the connected device** may already appear in the Plug and Play configurations; if it does not, select **+ Add module definition source** and then **On the connected device** to add it.

1. Back on the **Devices** overview page, find the device identity you created previously. With the device application still running in the command prompt, check that the device's **Connection state** in Azure IoT explorer is reporting as _Connected_ (if not, hit **Refresh** until it is). Select the device to view more details.

1. Expand the interface with ID **urn:java_sdk_sample:EnvironmentalSensor:1** to reveal the interface and IoT Plug and Play primitives—properties, commands, and telemetry.

[!INCLUDE [iot-pnp-iot-explorer-2.md](../../includes/iot-pnp-iot-explorer-2.md)]

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with an IoT Plug and Play Preview device](howto-develop-solution.md)
