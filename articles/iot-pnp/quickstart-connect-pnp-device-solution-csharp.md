---
title: Interact with an IoT Plug and Play Preview device connected to your Azure IoT solution | Microsoft Docs
description: Use C# (.NET) to connect to and interact with an IoT Plug and Play Preview device that's connected to your Azure IoT solution.
author: dominicbetts
ms.author: dobett
ms.date: 12/30/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.
---

# Quickstart: Interact with an IoT Plug and Play Preview device that's connected to your solution (C#)

[!INCLUDE [iot-pnp-quickstarts-3-selector.md](../../includes/iot-pnp-quickstarts-3-selector.md)]

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This quickstart shows you how to use C# (with .NET) to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

To complete this quickstart, you need to install .NET Core (2.x.x or 3.x.x) on your development machine. You can download your preferred version of the .NET Core SDK for multiple platforms from [Download .NET Core](https://dotnet.microsoft.com/download/dotnet-core/).

You can verify the version of .NET that's on your development machine by running the following command in a local terminal window: 

```cmd/sh
dotnet --version
```

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub (note for use later):

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

## Run the sample device

In this quickstart, you use a sample environmental sensor that's written in C# as the IoT Plug and Play device. The following instructions show you how to install and run the device:

1. Open a terminal window in the directory of your choice. Execute the following command to clone the [Azure IoT Samples for C# (.NET)](https://github.com/Azure-Samples/azure-iot-samples-csharp) GitHub repository into this location:

    ```cmd/sh
    git clone https://github.com/Azure-Samples/azure-iot-samples-csharp
    ```

1. This terminal window will now be used as your _device_ terminal. Go to the folder of your cloned repository, and navigate to the **/azure-iot-samples-csharp/digitaltwin/Samples/device/EnvironmentalSensorSample** folder.

1. Configure the _device connection string_:

    ```cmd/sh
    set DIGITAL_TWIN_DEVICE_CONNECTION_STRING=<YourDeviceConnectionString>
    ```

1. Build the necessary packages and run the sample with the following command:

    ```cmd\sh
        dotnet run
    ```

1. You see messages saying that the device has successfully registered and is waiting for updates from the cloud. This indicates that the device is now ready to receive commands and property updates, and has begun sending telemetry data to the hub. Don't close this terminal, you'll need it later to confirm the service samples also worked.

## Run the sample solution

In this quickstart, you use a sample IoT solution in C# to interact with the sample device.

1. Open another terminal window (this will be your _service_ terminal). Go to the folder of your cloned repository, and navigate to the **/azure-iot-samples-csharp/digitaltwin/Samples/service** folder.

1. Configure the _IoT hub connection string_ and _device ID_ to allow the service to connect to both of these:

    ```cmd/sh
    set IOTHUB_CONNECTION_STRING=<YourIoTHubConnectionString>
    set DEVICE_ID=<YourDeviceID>
    ```

### Read a property

1. When you connected the _device_ in its terminal, you saw the following message indicating its online status:

    ```cmd/sh
    Waiting to receive updates from cloud...
    ```

1. Go to the _service_ terminal and use the following commands to run the sample for reading device information:

    ```cmd/sh
    cd GetDigitalTwin
    dotnet run
    ```

1. In the _service_ terminal output, scroll to the `environmentalSensor` component. You see that the `state` property, which is used to indicate whether or not the device is online, has been reported as _true_:

    ```JSON
    "environmentalSensor": {
      "name": "environmentalSensor",
      "properties": {
        "state": {
          "reported": {
            "value": true
          }
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

1. Use the following commands to run the sample for updating the property:

    ```cmd/sh
    cd ..\UpdateProperty
    dotnet run
    ```

1. The _service_ terminal output shows the updated device information. Scroll to the `environmentalSensor` component to see the new brightness value of 42.

    ```json
        "environmentalSensor": {
      "name": "environmentalSensor",
      "properties": {
        "brightness": {
          "desired": {
            "value": "42"
          }
        },
        "state": {
          "reported": {
            "value": true
          }
        }
      }
    }
    ```

1. Go to your _device_ terminal, you see the device has received the update:

    ```cmd/sh
    Received updates for property 'brightness'
    Desired brightness = '"42"'.
    Reported brightness = ''.
    Version is '2'.
    Sent pending status for brightness property.
    Sent completed status for brightness property.
    ```
2. Go back to your _service_ terminal and run the below commands to get the device information again, to confirm the property has been updated.
    
    ```cmd/sh
    cd ..\GetDigitalTwin
    dotnet run
    ```
3. In the _service_ terminal output, under the `environmentalSensor` component, you see the updated brightness value has been reported. Note: it might take a while for the device to finish the update. You can repeat this step until the device has actually processed the property update.
    
    ```json
    "environmentalSensor": {
      "name": "environmentalSensor",
      "properties": {
        "brightness": {
          "desired": {
            "value": "42"
          },
          "reported": {
            "value": "42",
            "desiredState": {
              "code": 200,
              "description": "Request completed",
              "version": 2
            }
          }
        },
        "state": {
          "reported": {
            "value": true
          }
        }
      }
    },
    ```

### Invoke a command

1. Go to the _service_ terminal and set the following variables to define which command to invoke:
    ```cmd/sh
    set INTERFACE_INSTANCE_NAME=environmentalSensor
    set COMMAND_NAME=blink
    ```

1. Use the following commands to run the sample for invoking the command:

    ```cmd/sh
    cd ..\InvokeCommand
    dotnet run
    ```

1. Output in the _service_ terminal should show the following confirmation:

    ```cmd/sh
    Invoking blink on device <YourDeviceID> with interface instance name environmentalSensor
    Command blink invoked on the device successfully, the returned status was 200 and the request id was <some ID value>
    The returned payload was
    {"description": "abc"}
    Enter any key to finish
    ```

1. Go to the _device_ terminal, you see the command has been acknowledged:

    ```cmd/sh
    Command - blink was invoked from the service
    Data - null
    Request Id - <some ID value>.
    ```

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
