---
author: dominicbetts
ms.author: dobett
ms.service: iot-pnp
ms.topic: include
ms.date: 11/20/2020
---

This tutorial shows you how to build a multiple component sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure CLI to view the telemetry it sends. The sample application is written in Java and is included in the Azure IoT device SDK for Java. A solution builder can use the Azure CLI to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

This tutorial shows you how to build a sample IoT Plug and Play device application with components, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written in Java and is included in the Azure IoT device SDK for Java. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

In this tutorial, you:

> [!div class="checklist"]
> * Download the sample code.
> * Build the sample code.
> * Run the sample device application and validate that it connects to your IoT hub.
> * Review the source code.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

To complete this tutorial on Windows, install the following software on your local Windows environment:

* Java SE Development Kit 8. In [Java long-term support for Azure and Azure Stack](/java/azure/jdk/), under **Long-term support**, select **Java 8**.
* [Apache Maven 3](https://maven.apache.org/download.cgi).

## Download the code

If you completed [Quickstart: Connect a sample IoT Plug and Play device application running on Windows to IoT Hub (Java)](../articles/iot-pnp/quickstart-connect-device.md), you've already cloned the repository.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Azure IoT Java SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-java) GitHub repository into this location:

```cmd
git clone https://github.com/Azure/azure-iot-sdk-java.git
```

Expect this operation to take several minutes to complete.

## Build the code

On Windows, navigate to the root folder of the cloned Java SDK repository. Run the following command to build the dependencies:

```cmd/sh
mvn install -T 2C -DskipTests
```

## Run the device sample

[!INCLUDE [iot-pnp-environment](iot-pnp-environment.md)]

To run the sample application, navigate to the *\device\iot-device-samples\pnp-device-sample\temperature-controller-device-sample* folder and run the following command:

```cmd/sh
mvn exec:java -Dexec.mainClass="samples.com.microsoft.azure.sdk.iot.device.TemperatureController"
```

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](iot-pnp-iot-explorer.md)]

## Review the code

This sample implements an IoT Plug and Play temperature controller device. The model this sample implements uses [multiple components](../articles/iot-pnp/concepts-modeling-guide.md). The [Digital Twins definition language (DTDL) model file for the temperature device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) defines the telemetry, properties, and commands the device implements.

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

:::image type="content" source="media/iot-pnp-multiple-components-java/multiple-component.png" alt-text="Multiple component device in Azure IoT explorer":::

You can also use the Azure IoT explorer tool to call commands in either of the two thermostat components, or in the default component.
