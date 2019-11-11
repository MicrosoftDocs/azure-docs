---
title: Connect IoT Plug and Play Preview sample device code to IoT Hub | Microsoft Docs
description: Using Java, build and run IoT Plug and Play Preview sample device code that connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: baanders
ms.author: baanders
ms.date: 10/24/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device developer, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties, commands and telemetry. As a solution developer, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.

# ################################INCOMPLETE###############################
# ASSUMPTIONS/QUESTIONS:
# 27, 57, 59, 61, 64     -    Uses Microsoft Azure IoT device SDK for Java (Azure/azure-iot-sdk-java)
#    93                      -    "preview-test" branch
# 31                     -    Version of Java?
# 39-45                  -    Do I need Maven? Version?
# 69-79                  -    How do I build? This section needs to be filled in or replaced.
# 81-89                  -    Where is the project that you run? How do you run it?
#     83, 88                -    takes same parameter as C project
---

# Quickstart: Connect a sample IoT Plug and Play Preview device application to IoT Hub

This quickstart shows you how to build a sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written in Java and is included in the Azure IoT Hub device SDK for Java. A solution developer can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this quickstart, you need Java SE 8 on your development machine. You can download the Java SE Development Kit 8 for multiple platforms from [Java long-term support for Azure and Azure Stack](https://docs.microsoft.com/en-us/java/azure/jdk/?view=azure-java-stable). Make sure you select **Java 8** under **Long-term support** to get to downloads for JDK 8.

You can verify the current version of Java on your development machine using the following command: 

```cmd/sh
java -version
```

To build the samples, you need to install Maven 3. You can download Maven for multiple platforms from [Apache Maven](https://maven.apache.org/download.cgi).

You can verify the current version of Maven on your development machine using the following command:

```cmd/sh
mvn --version
```

### Install the Azure IoT explorer

Download and install the latest release of **Azure IoT explorer** from the tool's [repository](https://github.com/Azure/azure-iot-explorer/releases) page, by selecting the .msi file under "Assets" for the most recent update.

[!INCLUDE [iot-pnp-prepare-iot-hub-windows.md](../../includes/iot-pnp-prepare-iot-hub-windows.md)]

## Prepare the development environment

In this quickstart, you prepare a development environment you can use to clone and build the Azure IoT Hub device SDK for Java.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Microsoft Azure IoT SDKs for Java](https://github.com/Azure/azure-iot-sdk-java) GitHub repository into this location:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-java --recursive -b preview-test
```

You should expect this operation to take several minutes to complete.

## Build the code

You use the device SDK to build the included sample code. The application you build simulates a device that connects to an IoT hub. The application sends telemetry and properties and receives commands.

1. In a local terminal window, navigate to ...

1. In the local terminal window, run the following command to install the required libraries and build the simulated device application:

    ```cmd/sh
    mvn clean package
    ```

## Run the device sample

Run a sample application in the SDK to simulate an IoT Plug and Play device that sends telemetry to your IoT hub. To run the sample application, use these commands and pass the _device connection string_ as a parameter.

```cmd\sh
cd digitaltwin_client\samples\digitaltwin_sample_device\Release
copy ..\EnvironmentalSensor.interface.json .
digitaltwin_sample_device.exe "<your device connection string>"
```

The simulated device starts sending telemetry data to IoT Hub, listening for commands, and listening for property updates.

## Use the Azure IoT explorer to validate the code

[!INCLUDE [iot-pnp-iot-explorer-1.md](../../includes/iot-pnp-iot-explorer-1.md)]

4. To ensure the tool can read the interface model definitions from your device, select **Settings**. In the Settings menu, **On the connected device** may already appear in the list of locations to check; if it does not, select **+ Add module definition source** and then **On the connected device** to add it.

1. On the device overview page, find the device identity you created previously, and select it to view more details.

1. Expand the interface with ID **urn:YOUR_COMPANY_NAME_HERE:EnvironmentalSensor:1** to reveal the interface and IoT Plug and Play primitives—properties, commands, and telemetry.

[!INCLUDE [iot-pnp-iot-explorer-2.md](../../includes/iot-pnp-iot-explorer-2.md)]

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with an IoT Plug and Play Preview device](howto-develop-solution.md)
