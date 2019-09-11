---
title: Interact with an IoT Plug and Play Preview device connected to your Azure IoT solution | Microsoft Docs
description: Use Node.js to connect to and interact with an IoT Plug and Play Preview device that's connected to your Azure IoT solution.
author: miagdp
ms.author: miag
ms.date: 08/02/2019
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.
---

# Quickstart: Interact with an IoT Plug and Play Preview device that's connected to your solution

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This quickstart shows you how to use Node.js to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

Download and install Node.js from [nodejs.org](https://nodejs.org).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prepare an IoT hub

You also need an Azure IoT hub in your Azure subscription to complete this quickstart. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!NOTE]
> During public preview, IoT Plug and Play features are only available on IoT hubs created in the **Central US**, **North Europe**, and **Japan East** regions.

Add the Microsoft Azure IoT Extension for Azure CLI:

```azurecli-interactive
az extension add --name azure-cli-iot-ext
```

Run the following command to create the device identity in your IoT hub. Replace the **YourIoTHubName** and **YourDevice** with your actual names. If you don't have an IoT Hub, follow [these instructions](../iot-hub/iot-hub-create-using-cli.md) to create one:

```azurecli-interactive
az iot hub device-identity create --hub-name [YourIoTHubName] --device-id [YourDevice]
```

Run the following commands to get the _device connection string_ for the device you just registered:

```azurecli-interactive
az iot hub device-identity show-connection-string --hub-name [YourIoTHubName] --device-id [YourDevice] --output table
```

Run the following commands to get the _IoT hub connection string_ for your hub:

```azurecli-interactive
az iot hub show-connection-string --hub-name [YourIoTHubName] --output table
```

## Connect your device

In this quickstart, you use a sample environmental sensor that's written in Node.js as the IoT Plug and Play device. The following instructions show you how to install and run the device:

1. Clone the GitHub repository:

    ```cmd/sh
    git clone https://github.com/azure-samples/azure-iot-samples-node
    ```

1. In a terminal, go to the root folder of your cloned repository, navigate to the **/azure-iot-samples-node/digital-twins/Quickstarts/Device** folder, and then install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

1. Configure the _device connection string_:

    ```cmd/sh
    set DEVICE_CONNECTION_STRING=<your device connection string>
    ```

1. Run the sample with the following command:

    ```cmd/sh
    node sample_device.js
    ```

1. You see messages saying that the device has sent telemetry and its properties. The device is now ready to receive commands and property updates. Don't close this terminal, you need it later to confirm the service samples also worked.

## Build the solution

In this quickstart, you use a sample IoT solution in Node.js to interact with the sample device.

1. Open another terminal. Go to the folder of your cloned repository, and navigate to the **/azure-iot-samples-node/digital-twins/Quickstarts/Service** folder. Install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

1. Configure the _hub connection string_:

    ```cmd/sh
    set IOTHUB_CONNECTION_STRING=<your hub connection string>
    ```

### Read a property

1. When you connect the device in the terminal, you  see the following message:

    ```cmd/sh
    reported state property as online
    ```

1. Open the file **get_digital_twin.js**. Replace the `deviceID` with your device ID and save the file.

1. Go to the terminal you opened for running service sample, and run following command:

    ```cmd/sh
    node get_digital_twin.js
    ```

1. In the output, under the _environmentalSensor_ component, you see the same state has been reported:

    ```JSON
    reported state property as online
    ```

### Update a writable property

1. Open the file **update_digital_twin_property.js**.

1. At the beginning of the file, there's a set of constants defined with uppercase placeholders. Replace the **deviceID** with your actual device ID, update the constants with the following values, and save the file:

    ```javascript
    const componentName = 'environmentalSensor';
    const propertyName = 'brightness';
    const propertyValue = 60;
    ```

1. Go to the terminal you opened for running service sample, and use the following command to run the sample:

    ```cmd/sh
    node update_digital_twin_property.js
    ```

1. In the terminal, you see the digital twin information associated with your device. Find the component _environmentalSensor_, you see the new brightness value 60.

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

1. Go to your _device_ terminal, you see the device has received the update:

    ```cmd/sh
    Received an update for brightness: 60
    updated the property
    ```
2. Go back to your _service_ terminal, run below command again to confirm the property has been updated.
    
    ```cmd/sh
    node get_digital_twin.js
    ```
3. In the output, under the environmentalSensor component, you see the updated brightness value has been reported. Note: it might take a while for the device to finish the update. You can repeat this step until the device has actually processed the property update.
    
    ```json
      "brightness": {
        "reported": {
          "value": 60,
          }
       }
    ```

### Invoke a command

1. Open the file **invoke_command.js**.

1. At the beginning of the file, replace the `deviceID` with your actual device ID. Update the constants with the following values, and then save the file:

    ```javascript
    const interfaceInstanceName = 'environmentalSensor';
    const commandName = 'blink';
    ```

1. Go to the terminal you opened for running service sample. Use the following command to run the sample:

    ```cmd/sh
    node invoke_command.js
    ```

1. In the terminal, success looks like the following output:

    ```cmd/sh
    invoking command blink on component environmentalSensor for device test...
    {
      "result": "helpful response text",
      "statusCode": 200,
      "requestId": "33e536d3-14f7-4105-88f3-629b9933851c",
      "_response": "helpful response text"
    }
    ```

1. Go to the _device_ terminal, you see the command has been acknowledged:

    ```cmd/sh
    received command: blink for component: environmentalSensor
    acknowledgement succeeded.
    ```

## Clean up resources

If you plan to continue with later articles, you can keep the resources you used in this quickstart. Otherwise you can delete the resources you've created for this quickstart to avoid additional charges.

To delete the hub and registered device, complete the following steps using the Azure CLI:

```azurecli-interactive
az group delete --name <Your group name>
```

To delete just the device you registered with your IoT Hub, complete the following steps using the Azure CLI:

```azurecli-interactive
az iot hub device-identity delete --hub-name [YourIoTHubName] --device-id [YourDevice]
```

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
