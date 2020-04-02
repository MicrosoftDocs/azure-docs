---
title: Interact with an IoT Plug and Play Preview device connected to your Azure IoT solution | Microsoft Docs
description: Use Node.js to connect to and interact with an IoT Plug and Play Preview device that's connected to your Azure IoT solution.
author: miagdp
ms.author: miag
ms.date: 12/27/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.
---

# Quickstart: Interact with an IoT Plug and Play Preview device that's connected to your solution (Node.js)

[!INCLUDE [iot-pnp-quickstarts-3-selector.md](../../includes/iot-pnp-quickstarts-3-selector.md)]

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This quickstart shows you how to use Node.js to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

To complete this quickstart, you need Node.js on your development machine. You can download the latest recommended version for multiple platforms from [nodejs.org](https://nodejs.org).

You can verify the current version of Node.js on your development machine using the following command:

```cmd/sh
node --version
```

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub (note for use later):

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

## Run the sample device

In this quickstart, you use a sample environmental sensor that's written in Node.js as the IoT Plug and Play device. The following instructions show you how to install and run the device:

1. Open a terminal window in the directory of your choice. Execute the following command to clone the [Azure IoT Samples for Node.js](https://github.com/azure-samples/azure-iot-samples-node) GitHub repository into this location:

    ```cmd/sh
    git clone https://github.com/azure-samples/azure-iot-samples-node
    ```

1. This terminal window will now be used as your _device_ terminal. Go to the folder of your cloned repository, and navigate to the **/azure-iot-samples-node/digital-twins/Quickstarts/Device** folder. Install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

1. Configure the _device connection string_:

    ```cmd/sh
    set DEVICE_CONNECTION_STRING=<YourDeviceConnectionString>
    ```

1. Run the sample with the following command:

    ```cmd/sh
    node sample_device.js
    ```

1. You see messages saying that the device has sent some information and reported itself online. This indicates that the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates. Don't close this terminal, you'll need it later to confirm the service samples also worked.

## Run the sample solution

In this quickstart, you use a sample IoT solution in Node.js to interact with the sample device.

1. Open another terminal window (this will be your _service_ terminal). Go to the folder of your cloned repository, and navigate to the **/azure-iot-samples-node/digital-twins/Quickstarts/Service** folder. Install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

1. Configure the _IoT hub connection string_ to allow the service to connect to it:

    ```cmd/sh
    set IOTHUB_CONNECTION_STRING=<YourIoTHubConnectionString>
    ```

### Read a property

1. When you connected the _device_ in its terminal, you saw the following message indicating its online status:

    ```cmd/sh
    reported state property as online
    ```

1. In the **/azure-iot-samples-node/digital-twins/Quickstarts/Service** folder, open the file **get_digital_twin.js**. Replace the `<DEVICE_ID_GOES_HERE>` placeholder with your device ID and save the file.

1. Go to the _service_ terminal and use the following command to run the sample for reading device information:

    ```cmd/sh
    node get_digital_twin.js
    ```

1. In the _service_ terminal output, scroll to the `environmentalSensor` component. You see that the `state` property has been reported as _online_:

    ```JSON
    "environmentalSensor": {
      "name": "environmentalSensor",
      "properties": {
        "state": {
          "reported": {
            "value": "online"
          }
        }
      }
    }
    ```

### Update a writable property

1. Open the file **update_digital_twin_property.js**.

1. At the beginning of the file, there's a set of constants defined with uppercase placeholders. Replace the `<DEVICE_ID_GOES_HERE>` placeholder with your actual device ID, update the remaining constants with the following values, and save the file:

    ```javascript
    const interfaceInstanceName = 'environmentalSensor';
    const propertyName = 'brightness';
    const propertyValue = 42;
    ```

1. Go to the _service_ terminal and use the following command to run the sample for updating the property:

    ```cmd/sh
    node update_digital_twin_property.js
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
    node get_digital_twin.js
    ```

3. In the _service_ terminal output, under the `environmentalSensor` component, you see the updated brightness value has been reported. Note: it might take a while for the device to finish the update. You can repeat this step until the device has actually processed the property update.
    
    ```json
    "environmentalSensor": {
      "name": "environmentalSensor",
      "properties": {
        "brightness": {
          "reported": {
            "value": "42",
            "desiredState": {
              "code": 200,
              "version": 2,
              "description": "helpful descriptive text"
            }
          },
          "desired": {
            "value": "42"
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

### Invoke a command

1. Open the file **invoke_command.js**.

1. At the beginning of the file, replace the `<DEVICE_ID_GOES_HERE>` placeholder with your actual device ID. Update the remaining constants with the following values, and then save the file:

    ```javascript
    const interfaceInstanceName = 'environmentalSensor';
    const commandName = 'blink';
    const commandArgument = '<For the environmental sensor, this value does not matter. Any string will do.>'; 
    ```

1. Go to the _service_ terminal. Use the following command to run the sample for invoking the command:

    ```cmd/sh
    node invoke_command.js
    ```

1. Output in the _service_ terminal should show the following confirmation:

    ```cmd/sh
    invoking command blink on interface instanceenvironmentalSensor for device <device ID>...
    {
      "result": "helpful response text",
      "statusCode": 200,
      "requestId": "<some ID value>",
      "_response": "helpful response text"
    }
    ```

1. Go to the _device_ terminal, you see the command has been acknowledged:

    ```cmd/sh
    received command: blink for interfaceInstance: environmentalSensor
    acknowledgement succeeded.
    ```

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
