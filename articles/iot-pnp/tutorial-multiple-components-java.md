---
title: Connect IoT Plug and Play Preview sample Java component device code to IoT Hub | Microsoft Docs
description: Build and run IoT Plug and Play Preview sample Java device code that uses multiple components and connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: ericmitt
ms.author: ericmitt
ms.date: 07/14/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp

# As a device builder, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and using multiple components to send properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Tutorial: Connect a sample IoT Plug and Play Preview multiple component device application to IoT Hub (Java)

[!INCLUDE [iot-pnp-tutorials-device-selector.md](../../includes/iot-pnp-tutorials-device-selector.md)]

This tutorial shows you how to build a multiple component sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure CLI to view the telemetry it sends. The sample application is written in Java and is included in the Azure IoT device SDK for Java. A solution builder can use the Azure CLI to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

This tutorial shows you how to build a sample IoT Plug and Play device application with components and root interface, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written in Java and is included in the Azure IoT device SDK for Java. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this tutorial on Windows, install the following software on your local Windows environment:

* Java SE Development Kit 8. In [Java long-term support for Azure and Azure Stack](https://docs.microsoft.com/java/azure/jdk/?view=azure-java-stable), under **Long-term support**, select **Java 8**.
* [Apache Maven 3](https://maven.apache.org/download.cgi).

### Azure IoT explorer

To interact with the sample device in the second part of this quickstart, you use the **Azure IoT explorer** tool. [Download and install the latest release of Azure IoT explorer](./howto-use-iot-explorer.md) for your operating system.

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub. Make a note of this connection string, you use it later in this quickstart:

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

> [!TIP]
> You can also use the Azure IoT explorer tool to find the IoT hub connection string.

Run the following command to get the _device connection string_ for the device you added to the hub. Make a note of this connection string, you use it later in this quickstart:

```azurecli-interactive
az iot hub device-identity show-connection-string --hub-name <YourIoTHubName> --device-id <YourDeviceID> --output table
```

[!INCLUDE [iot-pnp-download-models.md](../../includes/iot-pnp-download-models.md)]

## Download the code

In this tutorial, you prepare a development environment you can use to clone and build the Azure IoT Hub Device Java SDK.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Azure IoT Java SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-java) GitHub repository into this location:

```cmd
git clone https://github.com/Azure/azure-iot-sdk-java.git
```

Expect this operation to take several minutes to complete.

## Build the code

On Windows, navigate to the root folder of the cloned Java SDK repository. Then navigate to the *\device\iot-device-samples\pnp-device-sample\temerature-controller-device-sample* folder.

Run the following command to build the sample application:

```java
mvn clean package
```

## Run the device sample

Create an environment variable called **IOTHUB_DEVICE_CONNECTION_STRING** to store the device connection string you made a note of previously.

To run the sample application, run the following command:

```java
mvn exec:java -Dexec.mainClass="samples.com.microsoft.azure.sdk.iot.device.TemperatureController"
```

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

## Review the code

This sample implements an IoT Plug and Play temperature controller device. The model this sample implements uses [multiple components](concepts-components.md). The [Digital Twins definition language (DTDL) model file for the temperature device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) defines the telemetry, properties, and commands the device implements.

The device code uses the standard `DeviceClient` class to connect to your IoT hub. The device sends the model ID of the DTDL model it implements in the connection request. A device that sends a model ID is an IoT Plug and Play device:

```java
private static void initializeDeviceClient() throws URISyntaxException, IOException {
    ClientOptions options = new ClientOptions();
    options.setModelId(MODEL_ID);
    deviceClient = new DeviceClient(deviceConnectionString, protocol, options);

    deviceClient.registerConnectionStatusChangeCallback((status, statusChangeReason, throwable, callbackContext) -> {
        log.debug("Connection status change registered: status={}, reason={}", status, statusChangeReason);

        if (throwable != null) {
            log.debug("The connection status change was caused by the following Throwable: {}", throwable.getMessage());
            throwable.printStackTrace();
        }
    }, deviceClient);

    deviceClient.open();
}
```

The model ID is stored in the code as shown in the following snippet:

```java
private static final String MODEL_ID = "dtmi:com:example:Thermostat;1";
```

After the device connects to your IoT hub, the code registers the command handlers.

```java
deviceClient.subscribeToDeviceMethod(new MethodCallback(), null, new MethodIotHubEventCallback(), null);
```

There are separate handlers for the desired property updates on the two thermostat components:

```java
deviceClient.startDeviceTwin(new TwinIotHubEventCallback(), null, new GenericPropertyUpdateCallback(), null);
Map<Property, Pair<TwinPropertyCallBack, Object>> desiredPropertyUpdateCallback = Stream.of(
        new AbstractMap.SimpleEntry<Property, Pair<TwinPropertyCallBack, Object>>(
                new Property(THERMOSTAT_1, null),
                new Pair<>(new TargetTemperatureUpdateCallback(), THERMOSTAT_1)),
        new AbstractMap.SimpleEntry<Property, Pair<TwinPropertyCallBack, Object>>(
                new Property(THERMOSTAT_2, null),
                new Pair<>(new TargetTemperatureUpdateCallback(), THERMOSTAT_2))
).collect(Collectors.toMap(AbstractMap.SimpleEntry::getKey, AbstractMap.SimpleEntry::getValue));

deviceClient.subscribeToTwinDesiredProperties(desiredPropertyUpdateCallback);
```

The sample code sends telemetry from each thermostat component:

```java
sendTemperatureReading(THERMOSTAT_1);
sendTemperatureReading(THERMOSTAT_2);
```

The `sendTemperatureReading` method uses the `PnpHhelper` class to create messages for each component:

```java
Message message = PnpHelper.createIotHubMessageUtf8(telemetryName, currentTemperature, componentName);
```

The `PnpHelper` class contains other sample methods that you can use with a multiple component model.

Use the Azure IoT explorer tool to view the telemetry and properties from the two thermostat components:

:::image type="content" source="media/tutorial-multiple-components-java/multiple-component.png" alt-text="Multiple component device in Azure IoT explorer":::

You can also use the Azure IoT explorer tool to call commands in either of the two thermostat components, or in the root interface.

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this tutorial, you've learned how to connect an IoT Plug and Play device with components to an IoT hub. To learn more about IoT Plug and Play device models, see:

> [!div class="nextstepaction"]
> [IoT Plug and Play Preview modeling developer guide](concepts-developer-guide.md)
