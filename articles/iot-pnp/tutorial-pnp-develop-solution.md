---
title: Interact with an IoT Plug and Play device from an Azure IoT solution | Microsoft Docs
description: As a solution developer, learn about how to use service SDK to interact with IoT Plug and Play devices.
author: YasinMSFT
ms.author: yahajiza
ms.date: 07/24/2019
ms.topic: tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea

# As a solution developer, I want to use Node service SDK to get/set properties and send commands to an IoT Plug and Play device, and manage telemetry routing and queries.
---

# Tutorial: Connect to and interact with an IoT Plug and Play device

This tutorial shows you, as a solution builder, how to connect to and interact with an IoT Plug and Play device. IoT Plug and Play simplifies IoT by letting you interact with devices without knowledge of the underlying device implementation.

In this tutorial, you learn how to:

> * Run the Node device SDK sample as the simulated device
> * Retrieve a digital twin and list the interfaces
> * Get and set properties using the Node service SDK
> * Send a command and retrieve the response using the Node service SDK
> * Connect to the global repository and retrieve a model definition using the Node service SDK
> * Set up digital twin change notifications in IoT Hub
> * Route telemetry based on IoT Plug and Play message headers
> * Run queries in IoT Hub

## Prerequisites

To complete this tutorial, you need:

1. Install [Node.js](https://nodejs.org/dist/v10.16.0/node-v10.16.0-x64.msi)

[!INCLUDE [cloud-shell-try-it.md](cloud-shell-try-it.md)]

1. Add the Microsoft Azure IoT Extension for Azure CLI:

    ```azurecli-interactive
    az extension add --name azure-cli-iot-ext
    ```

## Prepare an IoT hub

1. Register a device in IoT Hub:

   Run the following command in Azure Cloud Shell to create the device identity. Replace the **YourIoTHubName** and **YourDevice** with your actual names. If you don't have an IoT Hub, follow the instructions [here](../iot-hub/iot-hub-create-using-cli.md) to create one.

    ```azurecli-interactive
    az iot hub device-identity create --hub-name [YourIoTHubName] --device-id [YourDevice]
    ```

1. Get the device connection string:

    Run the following commands in [Azure Cloud Shell](https://shell.azure.com/) to get the device connection string for the device you just registered:

    ```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name [YourIoTHubName] --device-id [YourDevice] --output table
    ```

1. Get the IoT hub connection string:

    Run the following commands in [Azure Cloud Shell](https://shell.azure.com/) to get the IoT hub connection string for your hub:

    ```azurecli-interactive
    az iot hub show-connection-string --hub-name [YourIoTHubName] --output table
    ```

## Connect your device

In this tutorial, you use a sample environmental sensor that's written in Node.js as the IoT Plug and Play device. The following instructions show you how to install and run the device:

1. Clone the GitHub repository:

    ```cmd/sh
    git clone https://github.com/azure-samples/azure-iot-samples-node
    ```

1. In a terminal, go to the root folder of your cloned repository, navigate to the **Device** folder, and install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

1. Set the `DEVICE_CONNECTION_STRING` environment variable in the shell you use to run the device samples. Use the device connection string you retrieved previously:

    ```cmd/sh
    set DEVICE_CONNECTION_STRING=<your device connection string>
    ```

1. Run the sample with the following command:

    ```cmd/she
    node simple_sample.js
    ```

1. You see messages saying that the device has sent telemetry and updated its properties. The device is now ready to receive commands and property updates. Don't close this terminal, you need it later to confirm the service samples worked.

## Build the solution

In this tutorial, you use a sample IoT solution written in Node.js to interact with the sample device.

1. Open another terminal. Go to the folder of the cloned repository, and navigate to the **Service** folder. Install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

1. Set the `IOTHUB_CONNECTION_STRING` environment variable in the shell you use to run the service samples. Use the IoT hub connection string you retrieved previously:

    ```cmd/sh
    set IOTHUB_CONNECTION_STRING=<your IoT hub connection string>
    ```

    > [!NOTE]
    > The IoT hub connection string is different from the device connection string.

### Update a writable property

1. Open the file **update_digital_twin_property.js**.

1. At the start of this file, there's a set of constants defined with uppercase placeholders. Replace the `deviceID` with the ID you created earlier, update the constants with the following values, and then save the file:

    ```javascript
    const componentName = 'environmentalSensor';
    const propertyName = 'brightness';
    const propertyValue = 60;
    ```

1. Use the following command to run the sample:

    ```cmd/sh
    node update_digital_twin_property.js
    ```

1. In the service terminal, you see the digital twin information associated with your device. Find the component `environmentalSensor`, you see the new brightness value is 60.

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

1. Go to your device terminal, to see that the device received the update:

    ```cmd/sh
    Received an update for brightness: 60
    updated the property
    ```

### Invoke a command

1. Open the file **invoke_command.js**.

1. At the start of the file, replace the `deviceID` with the ID you created earlier, update the constants with the following values, and then save the file:

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

## Run additional service samples

Use the following samples to explore the capabilities of the Node.js service SDK. Make sure that the `IOTHUB_CONNECTION_STRING` environment variable is set in the shell you use:

### Retrieve a digital twin and list the interfaces

**get_digital_twin.js** gets the digital twin associated with your device and prints its component in the command line. It doesn't require a running device sample to succeed.

**get_digital_twin_component.js** gets a single component of digital twin associated with your device and prints it in the command line. It doesn't require the device sample to run.

### Get and set properties using the Node service SDK

**update_digital_twin.js** updates a writable property on your device digital twin using a full patch. You can update multiple properties on multiple interfaces if you want to. For it to succeed, the device sample needs to be running at the same time. Success looks like the device sample is printing something about updating a property the service sample printing an updated digital twin in the terminal.

### Send a command and retrieve the response using the Node service SDK

**invoke_command.js** will invoke a synchronous command on your device digital twin. For it to succeed, the device sample needs to be running at the same time. Success looks like the device sample is printing something about acknowledging a command, and the service client printing the result of the command in the terminal.

### Connect to the global repository and retrieve a model definition using the Node service SDK

Using the same instructions as for the service and device samples, you need to set the following four environment variables:

* `AZURE_IOT_MODEL_REPO_ID`
* `AZURE_IOT_MODEL_REPO_KEY_ID`
* `AZURE_IOT_MODEL_REPO_KEY_SECRET`
* `AZURE_IOT_MODEL_REPO_HOSTNAME`

You can get these values from your model repository connection string.

After you've set these four environment variables, run the sample the same way you ran the other samples:

```cmd/sh
node model_repo.js
```

This sample downloads the **ModelDiscovery** interface and prints this model in the terminal.

### Run queries in IoT Hub based on capability models and interfaces

The IoT Hub query language supports `HAS_INTERFACE` and `HAS_CAPABILITYMODEL` as shown in the following examples:

```sql
select * from devices where HAS_INTERFACE('id without version', version)
```

```sql
select * from devices where HAS_CAPABILITYMODEL('id without version', version)
```

> [!NOTE]
> To get the new IoT Plug and Play interface data format, use `INTERFACES` instead of `*`.

## Clean up resources

If you plan to continue with later articles, you can keep these resources. Otherwise you can delete the resources you've created for this tutorial to avoid additional charges.

To delete the resource group that contains the hub and registered device, complete the following steps using the Azure CLI:

```azurecli-interactive
az group delete --name <Your group name>
```

## Next steps

Now that you've created a service solution that interacts with your IoT Plug and Play devices, learn how to:

> [!div class="nextstepaction"]
> [Build a device that's ready for certification](tutorial-build-device-certification.md)
