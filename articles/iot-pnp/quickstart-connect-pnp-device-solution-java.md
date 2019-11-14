---
title: Interact with an IoT Plug and Play Preview device connected to your Azure IoT solution | Microsoft Docs
description: Use Java to connect to and interact with an IoT Plug and Play Preview device that's connected to your Azure IoT solution.
author: baanders
ms.author: baanders
ms.date: 11/14/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.

# ################################INCOMPLETE###############################
# ASSUMPTIONS/QUESTIONS:
# 32                         -     Version of Java?
# 40-46                      -     Do I need Maven? Version?
# 56, 59                     -     Uses Azure IoT samples for Java (https://github.com/azure-samples/azure-iot-samples-java)
#     59                           -    Branch needed?
# 63, 87                     -     Project folder path?
# 66, 90                     -     Is this how I build?
# 78, 112, 136, 176, 202     -     How do I run?
# 72, 96                     -     The terminal variables are the same in the Java project as they were in the Node.js one
# 99-222                     -     The files, key names, and outputs are the same in the Java project as they were in the Node.js one
---

# Quickstart: Interact with an IoT Plug and Play Preview device that's connected to your solution (Java)

[!INCLUDE [iot-pnp-quickstarts-3-selector.md](../../includes/iot-pnp-quickstarts-3-selector.md)]

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This quickstart shows you how to use Java to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

To complete this quickstart, you need Java SE 7 on your development machine. You can download Java SE 7 from [Oracle's Java SE Downloads](https://www.oracle.com/technetwork/java/javase/downloads/index.html). Make sure your `PATH` and `JAVA_HOME` environment variables include the full path to the `jdk1.7.x` directory.

You can check that the environment variables are set correctly and verify the version of Java on your development machine by running the following command in a local terminal window: 

```cmd/sh
java -version
```

To build the samples, you also need to install Maven 3. You can download Maven for multiple platforms from [Apache Maven](https://maven.apache.org/download.cgi). Make sure your `PATH` environment variable includes the full path to the `apache-maven-3.x.x\bin` directory.

You can check that the environment variables are set correctly and verify the version of Maven on your development machine by running the following command in a local terminal window:

```cmd/sh
mvn --version
```

These setup steps are also included with the source code of this quickstart's sample device application, under [Java setup instructions](https://github.com/Azure/azure-iot-sdk-java-digital-twin/blob/master/digital-twin/doc/java-devbox-setup.md).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [iot-pnp-prepare-iot-hub-windows.md](../../includes/iot-pnp-prepare-iot-hub-windows.md)]

## Connect your device

In this quickstart, you use a sample environmental sensor that's written in Java as the IoT Plug and Play device. The following instructions show you how to install and run the device:

1. Clone the [Microsoft Azure IoT SDKs for Java](https://github.com/Azure/azure-iot-sdk-java-digital-twin) GitHub repository:

    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-java-digital-twin
    ```

1. Open a terminal window for running the device (this will be your _device_ terminal). Go to your cloned repository and navigate to the **/azure-iot-sdk-java-digital-twin/digital-twin** folder. Install the required libraries and build the simulated device application by running the following command:

    ```cmd/sh
    mvn clean install -DskipTests
    ```

1. Configure the _device connection string_:

    ```cmd/sh
    set DIGITAL_TWIN_DEVICE_CONNECTION_STRING=<your device connection string>
    ```

1. Run the following commands to navigate to the device folder and run the sample:

    ```cmd/sh
    java -jar device-samples\target\environmental-sensor-sample-with-deps.jar
    ```

1. You see messages saying that the device has sent telemetry and its properties. The device is now ready to receive commands and property updates. Don't close this terminal, you'll need it later to confirm the service samples also worked.

## Build the solution

In this quickstart, you use a sample IoT solution in Java to interact with the sample device.

1. Open another terminal window (this will be your _service_ terminal). Go to the folder of your cloned repository, and navigate to the **/azure-iot-sdk-java-digital-twin/digital-twin** folder. Install the required libraries and build the simulated device application by running the following command:

    ```cmd/sh
    mvn clean install -DskipTests
    ```

1. Configure the _IoT hub connection string_ and _device ID_:

    ```cmd/sh
    set IOTHUB_CONNECTION_STRING=<your IoT hub connection string>
    set DIGITAL_TWIN_ID=<your device ID>
    ```

### Read a property

1. When you connected the _device_ in its terminal, you saw the following message:

    ```cmd/sh
    reported state property as online
    ```

1. Go to the _service_ terminal and use the following command to run the sample:

    ```cmd/sh
    java -jar service-samples/get-digital-twin/target/get-digital-twin-with-deps.jar
    ```

1. In the output, under the _environmentalSensor_ component, you see the state has been reported as online:

    ```JSON
    "state": {
      "reported": {
        "value": "online"
      }
    ```

### Update a writable property

1. Go to the _service_ terminal and set the following variables:
    ```cmd/sh
    set INTERFACE_INSTANCE_NAME=environmentalSensor
    set PROPERTY_NAME=brightness
    set PROPERTY_VALUE=42
    ```

1. Use the following command to run the sample:

    ```cmd/sh
    java -jar service-samples/update-digital-twin/target/update-digital-twin-with-deps.jar
    ```

1. In the _service_ terminal, you see the digital twin information associated with your device. Find the component _environmentalSensor_ to see the new brightness value of 42.

    ```json
    "environmentalSensor": {
        "name": "environmentalSensor",
        "properties": {
          "name": {
            "reported": {
              "value": "Name",
              "desiredState": {
                "code": 200,
                "version": 12,
                "description": "helpful descriptive text"
              }
            },
            "desired": {
              "value": "Name"
            }
          },
          "brightness": {
            "desired": {
              "value": 42
            }
          },
          "state": {
            "reported": {
              "value": "online"
            }
          }
        }
      }
    ```

1. Go to your _device_ terminal, you see the device has received the update:

    ```cmd/sh
    Received an update for brightness: 42
    updated the property
    ```
2. Go back to your _service_ terminal and run the below command to get the device information again, to confirm the property has been updated.
    
    ```cmd/sh
    java -jar service-samples/get-digital-twin/target/get-digital-twin-with-deps.jar
    ```
3. In the output, under the _environmentalSensor_ component, you see the updated brightness value has been reported. Note: it might take a while for the device to finish the update. You can repeat this step until the device has actually processed the property update.
    
    ```json
      "brightness": {
        "reported": {
          "value": 42,
          }
       }
    ```

### Invoke a command

1. Go to the _service_ terminal and set the following variables:
    ```cmd/sh
    set INTERFACE_INSTANCE_NAME=environmentalSensor
    set COMMAND_NAME=blink
    ```

1. Use the following command to run the sample:

    ```cmd/sh
    java -jar service-samples/invoke-digital-twin-command/target/invoke-digital-twin-command-with-deps.jar
    ```

1. In the _service_ terminal, success looks like the following output:

    ```cmd/sh
    invoking command blink on component environmentalSensor for device <device ID>...
    {
      "result": "helpful response text",
      "statusCode": 200,
      "requestId": "<some ID value>",
      "_response": "helpful response text"
    }
    ```

1. Go to the _device_ terminal, you see the command has been acknowledged:

    ```cmd/sh
    received command: blink for component: environmentalSensor
    acknowledgement succeeded.
    ```

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
