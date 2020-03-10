---
title: Interact with an IoT Plug and Play Preview device connected to your Azure IoT solution | Microsoft Docs
description: Use Java to connect to and interact with an IoT Plug and Play Preview device that's connected to your Azure IoT solution.
author: dominicbetts
ms.author: dobett
ms.date: 12/27/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.
---

# Quickstart: Interact with an IoT Plug and Play Preview device that's connected to your solution (Java)

[!INCLUDE [iot-pnp-quickstarts-3-selector.md](../../includes/iot-pnp-quickstarts-3-selector.md)]

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This quickstart shows you how to use Java to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

To complete this quickstart, you need Java SE 8 on your development machine. You also need to install Maven 3.

For details on how to get set up with these, see [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-java/blob/preview/doc/java-devbox-setup.md) in the Microsoft Azure IoT device SDK for Java.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub (note for use later):

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

## Run the sample device

In this quickstart, you use a sample environmental sensor that's written in Java as the IoT Plug and Play device. The following instructions show you how to install and run the device:

1. Open a terminal window in the directory of your choice. Execute the following command to clone the [Azure IoT Samples for Java](https://github.com/Azure-Samples/azure-iot-samples-java) GitHub repository into this location:

    ```cmd/sh
    git clone https://github.com/Azure-Samples/azure-iot-samples-java
    ```

1. This terminal window will now be used as your _device_ terminal. Go to the folder of your cloned repository, and navigate to the **/azure-iot-samples-java/digital-twin/Samples/device/JdkSample** folder. Install the required libraries and build the simulated device application by running the following command:

    ```cmd/sh
    mvn clean install -DskipTests
    ```

1. Configure the _device connection string_:

    ```cmd/sh
    set DIGITAL_TWIN_DEVICE_CONNECTION_STRING=<YourDeviceConnectionString>
    ```

1. Run the following command to run the sample from the device folder.

    ```cmd/sh
    java -jar environmental-sensor-sample\target\environmental-sensor-sample-with-deps.jar
    ```

1. You see messages saying that the device is connected, performing various setup steps, and waiting for service updates, followed by telemetry logs. This indicates that the device is now ready to receive commands and property updates, and has begun sending telemetry data to the hub. Keep the sample running as you complete the next steps. Don't close this terminal, you'll need it later to confirm the service samples also worked.

## Run the sample solution

In this quickstart, you use a sample IoT solution in Java to interact with the sample device.

1. Open another terminal window (this will be your _service_ terminal). Go to the folder of your cloned repository, and navigate to the **/azure-iot-samples-java\digital-twin\Samples\service\JdkSample** folder.

1. Install the required libraries and build the service sample by running the following command:

    ```cmd/sh
    mvn clean install -DskipTests
    ```

1. Configure the _IoT hub connection string_ and _device ID_ to allow the service to connect to both of these:

    ```cmd/sh
    set IOTHUB_CONNECTION_STRING=<YourIoTHubConnectionString>
    set DEVICE_ID=<YourDeviceID>
    ```

### Read a property

1. When you connected the _device_ in its terminal, one of the output messages was the following message to indicate its online status. The `state` property, which is used to indicate whether or not the device is online, is _true_:

    ```cmd/sh
    State of environmental sensor was set to true
    ```

1. Go to the _service_ terminal and use the following command to run the service sample for reading device information:

    ```cmd/sh
    java -jar get-digital-twin/target/get-digital-twin-with-deps.jar
    ```

1. In the _service_ terminal output, scroll to the `environmentalSensor` component. You see that the `state` property has been reported as _true_:
    ```JSON
    "environmentalSensor" : {
      "name" : "environmentalSensor",
      "properties" : {
        "state" : {
          "reported" : {
            "value" : true,
            "desiredState" : null
          },
          "desired" : null
        }
      }
    }
    ```

### Update a writable property

1. Go to the _service_ terminal and set the following variables to define which property to update:
    ```cmd/sh
    set INTERFACE_INSTANCE_NAME=environmentalSensor
    set PROPERTY_NAME=brightness
    set PROPERTY_VALUE=42
    ```

1. Use the following command to run the service sample for updating the property:

    ```cmd/sh
    java -jar update-digital-twin/target/update-digital-twin-with-deps.jar
    ```

1. The _service_ terminal output shows the updated device information. Scroll to the `environmentalSensor` component to see the new brightness value of 42.

    ```json
    "environmentalSensor": {
        "name": "environmentalSensor",
        "properties": {
            "brightness": {
                "reported": null,
                "desired": {
                    "value": "42"
                }
            },
    ```

1. Go to your _device_ terminal, you see the device has received the update:

    ```cmd/sh
    OnPropertyUpdate called: propertyName=brightness, reportedValue=null, desiredVersion=2, desiredValue={"value":"42"}
    Report property: propertyName=brightness, reportedValue={"value":"42"}, desiredVersion=2 was DIGITALTWIN_CLIENT_OK
    ```
2. Go back to your _service_ terminal and run the below command to get the device information again, to confirm the property has been updated.
    
    ```cmd/sh
    java -jar get-digital-twin/target/get-digital-twin-with-deps.jar
    ```
3. In the _service_ terminal output, under the `environmentalSensor` component, you see the updated brightness value has been reported. Note: it might take a while for the device to finish the update. You can repeat this step until the device has actually processed the property update.
    
    ```json
    "environmentalSensor" : {
      "name" : "environmentalSensor",
      "properties" : {
        "brightness" : {
          "reported" : {
            "value" : {
              "value" : "42"
            },
            "desiredState" : {
              "code" : 200,
              "version" : 2,
              "description" : "OK"
            }
          },
          "desired" : {
            "value" : "42"
          }
        },
        "state" : {
          "reported" : {
            "value" : true,
            "desiredState" : null
          },
          "desired" : null
        }
      }
    },       
    ```

### Invoke a command

1. Go to the _service_ terminal and set the following variables to define which command to invoke:
    ```cmd/sh
    set INTERFACE_INSTANCE_NAME=environmentalSensor
    set COMMAND_NAME=blink
    set PAYLOAD=10
    ```

1. Use the following command to run the service sample for invoking the command:

    ```cmd/sh
    java -jar invoke-digital-twin-command/target/invoke-digital-twin-command-with-deps.jar
    ```

1. Output in the _service_ terminal should show the following confirmation:

    ```cmd/sh
    Invoking blink on device <YourDeviceID> with interface instance name environmentalSensor
    Command invoked on the device successfully, the returned status was 200 and the request id was <some ID value>
    The returned PAYLOAD was
    ```

1. Go to the _device_ terminal, you see the command has been acknowledged:

    ```cmd/sh
    OnCommandReceived called: commandName=blink, requestId=<some ID value>, commandPayload="10"
    EnvironmentalSensor is blinking every 10 seconds.
    ```

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
