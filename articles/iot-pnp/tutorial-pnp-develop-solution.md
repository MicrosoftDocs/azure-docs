---
title: Solution developers guide to connect and interact with an Azure IoT Plug and Play device | Microsoft Docs
description: As a solution developer, learn about how to use service SDK to interact with IoT Plug and Play devices.
author: YasinMSFT
ms.author: yahajiza
ms.date: 07/24/2019
ms.topic: Tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea

# As a solution developer, I want to use Node service SDK to get/set properties and send commands, plus telemetry routing and queries.
---

# Tutorial: Connect and interact with an Azure IoT Plug and Play device

This tutorial shows you how, as a solution builder, to connect a Plug and Play device to your solution and interact with it. Azure IoT Plug and Play simplifies IoT by enabling you to interact with device capabilities without knowledge of the underlying device implementation.

In this tutorial, you learn how to:

> * Run the Node device SDK sample as the simulated device
> * Retrieve a digital twin and list the interfaces
> * Get / set properties using the Node service SDK
> * Send a command and retrieve the response using the Node service SDK
> * Connect to the global repository and retrieve a model definition using the Node service SDK
> * Set up digital twin change notifications in IoT Hub
> * Route telemetry based on Plug and Play message headers
> * Run queries in IoT Hub

## Prerequisites

To complete this tutorial, you need:

1. Install [Node.js](https://nodejs.org/dist/v10.16.0/node-v10.16.0-x64.msi)

1. Install [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)

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

    Run the following commands in [Azure Cloud Shell](https://shell.azure.com/) to get the _device connection string_ for the device you just registered:

    ```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name [YourIoTHubName] --device-id [YourDevice] --output table
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

In this tutorial, you use a sample IoT solution in Node.js to interact with the sample device.

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

## Install dependencies for service samples

The service samples use a different client library, geared toward cloud developers rather than device developers.

1. Open a second terminal, go to the root folder of your cloned repository, navigate to the **Service** folder, and install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

This step is going to take anywhere between a few seconds to a few minutes, and it should end with no errors. Once complete, you can move on to the next step which is to configure the connection string for the service.

## Configure the service connection string

To run the service samples, you’ll need your IoT Hub connection string. Refer to [this article](https://devblogs.microsoft.com/iotdev/understand-different-connection-strings-in-azure-iot-hub/) for instructions to obtain the connection string.

Just like with device samples, you’ll need to configure an environment variable in the same terminal you’re going to run the code from. Open a new terminal window and use the instructions below to set the **IOTHUB_CONNECTION_STRING** environment variable. Note that the name is different from the device samples: it’s IOTHUB_CONNECTION_STRING. Be careful with double quotes: depending on the terminal program you’re using, you may or may not need them:

```cmd/sh
set IOTHUB_CONNECTION_STRING=<your_hub connection_string>
```

In order to check that the environment variable was set properly, run the following using CMD:

```cmd/sh
echo %IOTHUB_CONNECTION_STRING%
```

This should print the entire connection string.

### Run the Node device SDK sample as the simulated device

Once you’ve authored the samples and set your connection string in an environment variable, you can run any of the service samples using the following command (just replace **sample_name.js** with the name of the file that corresponds to the feature you want to test):

### Retrieve a digital twin and list the interfaces

**get_digital_twin.js** gets the digital twin associated with your device and prints its component in the command line. It does not require a running device sample to succeed.

**get_digital_twin_component.js** gets a single component of digital twin associated with your device and prints it in the command line. It does not require the device sample to run.

### Get / set properties using the Node service SDK

**update_digital_twin.js** updates a writable property on your device digital twin using a full patch. You can update multiple properties on multiple interfaces if you want to. For it to succeed, the device sample needs to be running at the same time. Success looks like the device sample is printing something about updating a property the service sample printing an updated digital twin in the terminal.

### Send a command and retrieve the response using the Node service SDK

**invoke_command.js** will invoke a synchronous command on your device digital twin. For it to succeed, the device sample needs to be running at the same time. Success looks like the device sample is printing something about acknowledging a command, and the service client printing the result of the command in the terminal.

### Connect to the global repository and retrieve a model definition using the Node service SDK

Using the same instructions as for the service and device samples, you’ll need to set up 4 environment variables:

AZURE_IOT_MODEL_REPO_ID
AZURE_IOT_MODEL_REPO_KEY_ID
AZURE_IOT_MODEL_REPO_KEY_SECRET
AZURE_IOT_MODEL_REPO_HOSTNAME

These values can be obtained from your model repository connection string.

Once you’ve set these 4 environment variables, you can run the sample the same way you ran the other samples:

```cmd/sh
node model_repo.js
```

This sample downloads the ModelDiscovery interface and will print this model in the terminal.

### Run queries in IoT Hub based on capabality models and interfaces

We support HAS_INTERFACE and HAS_CAPABILITYMODEL.

select * from devices where HAS_INTERFACE('id without version', version)

select * from devices where HAS_CAPABILITYMODEL('id without version', version)

Note: If you want to get new pnp interface data format, use INTERFACES instead of *

## Clean up resources

If you plan to continue with later articles, you can keep these resources. Otherwise you can delete the resource you've created for this tutorial to avoid additional charges.

To delete the hub and registered device, complete the following steps using the Azure CLI:

```azurecli-interactive
az group delete --name <Your group name>
```

## Next steps

Now that you've built an IoT Plug and Play ready for certification, learn how to:

> [!div class="nextstepaction"]
> [Build a device that's ready for certification](tutorial-build-device-certification.md)
