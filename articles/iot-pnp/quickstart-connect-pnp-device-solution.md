---
title: Connect Plug and Play device to solution | Microsoft Docs
description: Connect a Plu and Play device to my solution
author: miagdp
ms.author: miag
ms.date: 06/26/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to connect a Plug and Play device to my solution so I can collect telemetry and control the device.
---

# Quickstart: Connect a Plug and Play device to your solution

Plug and Play simplifies IoT by enabling you to interact with device capabilities without knowledge of the underlying device implementation. This quickstart shows you how to connect with a Plug and Play device to your solution.

## Prerequisites

1. Download Node.js from [nodejs.org](https://nodejs.org).

1. [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest).

1. Add the Microsoft Azure IoT Extension for Azure CLI.

    ```azurecli-interactive
    az extension add --name azure-cli-iot-ext
    ```

1. Register a device in IoT Hub.

   Run the following command in Azure Cloud Shell to create the device identity. Replace the **YourIoTHubName** and **YourDevice** with your actual names. If you don't have an IoT Hub, follow the instructions [here](../iot-hub/iot-hub-create-using-cli.md) to create one.

    ```azurecli-interactive
    az iot hub device-identity create --hub-name [YourIoTHubName] --device-id [YourDevice]
    ```

1. Get the device connection string.

    Run the following commands in Azure Cloud Shell to get the _device connection string_ for the device you just registered:

    ```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name [YourIoTHubName] --device-id [YourDevice] --output table
    ```

## Connect your device

In this quickstart, you use a sample environmental sensor that's written in Node.js as the Plug and Play device. The following instructions show you how to install and run the device:

1. Clone the Github repository:

    ```cmd/sh
    git clone http://github.com/Azure/NodeSamplePlaceHolder
    ```

1. In a terminal, go to the root folder of your cloned repository, navigate to the **Device** folder, and install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

1. Configure the _device connection string_.

    ```cmd/sh
    set DEVICE_CONNECTION_STRING=<your device connection string>
    ```

1. Run the sample with the following command:

    ```cmd/she
    node simple_sample.js
    ```

1. You see messages saying that the device has sent telemetry and updated its properties. The device is now ready to receive commands and property updates. Don't close this terminal, you need it later to confirm the service samples also worked.

## Build the solution

In this quickstart, you use a sample IoT solution in Node.js to interact with the sample device.

1. Open another terminal. Go to the folder of your cloned repository, and navigate to the **Service** folder. Install all the dependencies under this folder by running the following command:

    ```cmd/sh
    npm install
    ```

1. Configure the _hub connection string_:

    ```cmd/sh
    set IOTHUB_CONNECTION_STRING=<your device connection string>
    ```

### Update a writable property

1. Open the file **update_digital_twin_property.js**.

1. At the beginning of the file there is a set of constants defined with uppercase placeholders. Replace the `deviceID` with the ID you created earlier, update the constants with the following values, and then save the file:

    ```javascript
    const componentName = 'environmentalSensor';
    const propertyName = 'brightness';
    const propertyValue = 60;
    ```

1. Use the following command to run the sample:

    ```cmd/sh
    node update_digital_twin_property.js
    ```

1. In the service terminal, you see the digital twin information associated with your device. Find the component _environmentalSensor_, you see the new brightness value 60.

    ```json
        "environmentalSensor": {
        "name": "environmentalSensor",
        "properties": {
          "brightness": {
            "reported": {
              "value": 60,
              "desiredState": {
                "code": 200,
                "version": 14,
                "description": "helpful descriptive text"
              }
            },
            "desired": {
              "value": 60
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

1. Go to your device terminal, you should see  the device has received the update:

    ```cmd/sh
    Received an update for brightness: 60
    updated the property
    ```

### Invoke a command

1. Open the file **invoke_command.js**.

1. At the beginning of the file, replace the `deviceID` with the ID you created earlier, update the constants with the following values, and then save the file:

    ```javascript
    const componentName = 'environmentalSensor'; 
    const commandName = 'blink';
    ```

1. Go back to your service terminal. Use the following command to run the sample.

    ```cmd/sh
    node invoke_command.js
    ```

1. In the service terminal, success looks like the following output:

    ```cmd/sh
    invoking command blink on component environmentalSensor for device test...
    {
      "result": "helpful response text",
      "statusCode": 200,
      "requestId": "33e536d3-14f7-4105-88f3-629b9933851c",
      "_response": "helpful response text"
    }
    ```

1. Go to the device terminal, you see the command has been acknowledged:

    ```cmd/sh
    received command: blink for component: environmentalSensor
    acknowledgement succeeded.
    ```

## Clean up resources

If you plan to continue with later articles, you can keep these resources. Otherwise you can delete the resource you've created for this quickstart to avoid additional charges.

To delete the hub and registered device, complete the following steps using the Azure CLI:

```azurecli-interactive
az group delete --name <Your group name>
```

## Next step

In this quickstart, you've learned how to connect a Plug and Play device to a IoT solution. To learn more about how to find Plug and Play devices to connect to your solution, see:

> [!div class="nextstepaction"]
> How-to: Use the device catalog to find devices
