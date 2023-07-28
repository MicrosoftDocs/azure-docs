---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

This tutorial shows you how to build a sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure IoT explorer tool to view the telemetry it sends. The sample application is written in Java and is included in the Azure IoT device SDK for Java. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[![Browse code](../articles/iot-central/core/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples/pnp-device-sample)

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

You can run this tutorial on Linux or Windows. The shell commands in this tutorial follow the Linux convention for path separators '`/`', if you're following along on Windows be sure to swap these separators for '`\`'.

To complete this tutorial, install the following software in your local development environment:

* [Java SE Development Kit 8 or later](/java/openjdk/install).
* [Apache Maven 3](https://maven.apache.org/download.cgi).

## Download the code

In this tutorial, you prepare a development environment you can use to clone and build the Azure IoT Hub Device Java SDK.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Azure IoT Java SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-java) GitHub repository into this location:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-java.git
```

## Build the code

Navigate to the root folder of the thermostat sample in the cloned Java SDK repository and build it:

```cmd
cd azure-iot-sdk-java/device/iot-device-samples/pnp-device-sample/thermostat-device-sample
mvn clean package
```

## Run the device sample

[!INCLUDE [iot-pnp-environment](iot-pnp-environment.md)]

To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-java/blob/main/iothub/device/iot-device-samples/pnp-device-sample/readme.md).

From the */device/iot-device-samples/pnp-device-sample/thermostat-device-sample* folder, run the application:

```cmd/sh
mvn exec:java -Dexec.mainClass="samples.com.microsoft.azure.sdk.iot.device.Thermostat"
```

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](iot-pnp-iot-explorer.md)]

## Review the code

This sample implements a simple IoT Plug and Play thermostat device. The model this sample implements doesn't use IoT Plug and Play [components](../articles/iot-develop/concepts-modeling-guide.md). The [DTDL model file for the thermostat device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json) defines the telemetry, properties, and commands the device implements.

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

The code that updates properties, handles commands, and sends telemetry is identical to the code for a device that doesn't use the IoT Plug and Play conventions.

The sample uses a JSON library to parse JSON objects in the payloads sent from your IoT hub:

```java
import com.google.gson.Gson;

...

Date since = new Gson().fromJson(jsonRequest, Date.class);
```
