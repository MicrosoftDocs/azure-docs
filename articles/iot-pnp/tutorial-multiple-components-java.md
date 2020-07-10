---
title: Connect IoT Plug and Play Preview sample device code to IoT Hub  | Microsoft Docs
description: Build and run IoT Plug and Play Preview sample device code on  Windows that connects to an IoT hub. Use the Azure CLI to view the information sent by the device to the hub.
author: ericmitt
ms.author: ericmitt
ms.date: 04/23/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device developer, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties and telemetry, and responding to commands. As a solution developer, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Tutorial: Connect an IoT Plug and Play Multiple component device application running on Windows to IoT Hub (Java)

[!INCLUDE [iot-pnp-quickstarts-device-selector.md](../../includes/iot-pnp-quickstarts-device-selector.md)]

This quickstart shows you how to build a multiple component sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure CLI to view the telemetry it sends. The sample application is written in Java and is included in the Azure IoT device SDK for Java. A solution developer can use the Azure CLI to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites for Windows

To complete this quickstart on Windows, install the following software on your local Windows environment:

* Java SE Development Kit 8. In [Java long-term support for Azure and Azure Stack](https://docs.microsoft.com/en-us/java/azure/jdk/?view=azure-java-stable), under **Long-term support**, select **Java 8**.
* [Apache Maven 3](https://maven.apache.org/download.cgi).

### Azure IoT explorer

To interact with the sample device in the second part of this quickstart, you use the **Azure IoT explorer** tool. [Download and install the latest release of **Azure IoT explorer**](./howto-install-iot-explorer.md) for your operating system.

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub. Make a note of this connection string, you use it later in this quickstart:

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

> [!TIP]
> You can also use the Azure IoT Explorer tool to find the IoT hub connection string.

## Download the code

### Code slope
In this quickstart, you prepare a development environment you can use to clone and build the Azure IoT Hub Device Java SDK.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Azure IoT Java SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-java) GitHub repository into this location:

```cmd\bash
git clone https://github.com/Azure/azure-iot-sdk-java.git
```

You should expect this operation to take several minutes to complete.

## Build the code

On Windows, navigate to the root folder of the cloned Java SDK repository. Then navigate to the \device\iot-device-samples\pnp-device-sample\temerature-controller-device-sample folder.

Run the following command to build the sample application:

```java
mvn clean package
```

## Run the device sample

First create an environment variable and store in it, this device's connection string: **IOTHUB_DEVICE_CONNECTION_STRING**

Run the following commad to run the sample application:

```java
mvn exec:java -Dexec.mainClass="samples.com.microsoft.azure.sdk.iot.device.TemperatureController"
```

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

### Use the Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

## Review the code

This code sample implement a simple temperature controller defined in this [DTDL file](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json)

In this sample we are going to implement a simple PnP device. As explained in <See concept article about PnP> the multiple component  sample will have a DTDL document with different component, each of them will have their specific telemetry twin properties and command the device implement. See the DTDL model above.

In this case the device code will connect the IoT hub 'as usual' via

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

As you see the ModelID is transmitted as an option, the device is now a PnP device!

The ModelId is stored in the code as:

```java
private static final String MODEL_ID = "dtmi:com:example:TemperatureController;1";
```
After connecting, the code registers method handler:

```java
deviceClient.subscribeToDeviceMethod(new MethodCallback(), null, new MethodIotHubEventCallback(), null);
```
Same for the desired properties:

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

Then the code is sending the temperatures measure, one for thermosta1 one for thermostat2:

```java
sendTemperatureReading(THERMOSTAT_1);
sendTemperatureReading(THERMOSTAT_2);
```

In `sendTemperatureReading` function, we can see the usage of PnpHelper class and method (in PnpHelpers.java file), to create message for a specific component:

```java
Message message = PnpHelper.createIotHubMessageUtf8(telemetryName, currentTemperature, componentName);
```

This class PnpHelper contains 6 sample methods, to use for either root interface or multiple compoments model. Easy to reuse for your own devices.

As a result of execution you can see the differents compoments, follow telemetry for thermostat1 or thermostat2, same for propertis and commands:

![Default component](iotexplorerMultipleComponent.JPG)


[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)