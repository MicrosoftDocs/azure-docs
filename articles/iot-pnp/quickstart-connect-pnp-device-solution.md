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

# Quickstart: Connect a Plug and Play device to my solution

Plug and Play simplifies IoT by enabling you to interact with device capabilities without knowledge of the underlying device implementation. This quickstart shows you how to connect with a Plug and Play device to your solution.

## Prerequisites

1. Download Node.js from [nodejs.org](https://nodejs.org).
2. [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest).
1. Add the Microsoft Azure IoT Extension for Azure CLI.

    ```azurecli-interactive
    az extension add --name azure-cli-iot-ext
    ```
3. Register a device in IoT Hub.

   Run the following command in Azure Cloud Shell to create the device identity. Replace the **YourIoTHubName** and **YourDevice** with your actual names. If you don't have an IoT Hub, follow the instructions [here](https://review.docs.microsoft.com/en-us/azure/iot-hub/iot-hub-create-using-cli?branch=pr-en-us-82761) to create one.

    ```azurecli-interactive
    az iot hub device-identity create --hub-name [YourIoTHubName] --device-id [YourDevice]
    ```
4. Get device connection string.

    Run the following commands in Azure Cloud Shell to get the _device connection string_ for the device you just registered:

    ```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name [YourIoTHubName] --device-id [YourDevice] --output table
    ```

## Connect your device

In this quickstart, you use a sample environmental sensor that's written in Node.js as the Plug and Play device. Please follow the instructions below to install and run the device. 

1. Clone the Github repository.
    ```cmd/sh
    git clone http://github.com/Azure/NodeSamplePlaceHolder
1. In a terminal, go to the root folder of your cloned repository, navigate to the **Device** folder, and install all the dependencies by running the command below.

    ```cmd/sh
    npm install
    ```

3. Configure the _device connection string_. 

    ```cmd/sh
    set DEVICE_CONNECTION_STRING=<your device connection string>
    ```


4. Run the sample with the following command:

    ```cmd/she
    node simple_sample.js
    ```
5. You should see messages describing that the device has sent telemetry and updated properties. It is now ready to receive commands and property updates. Don’t close this terminal, as you’re going to need it to confirm the service samples also worked later.


## Build the solution

In this quickstart, you use a sample IoT solution in Node.js to interact with the sample device.

1. Open another terminal. Go to the folder of your cloned repository, and navigate to the **Service** folder. Install all the dependencies under this folder by running the command below.

    ```cmd/sh
    npm install
    ```
2. Configure the _hub connection string_. 

    ```cmd/sh
    set IOTHUB_CONNECTION_STRING=<your device connection string>
    ```


### Update a writable property
1. Open the file **update_digital_twin_property.js**. 
1. At the beginning of the file, a set of constants are defined with uppercase placeholders. Replace the _deviceID_ with the ID you created earlier, and replace below values with the examples then save the file.
    ```
    const componentName = 'environmentalSensor'; 
    const propertyName = 'brightness'; 
    const propertyValue = 60; 
    ```
3. Use below command to run the sample.
    ```cmd/sh
    node update_digital_twin_property.js
    ```
1. From the service terminal, you will see the digital twin information associated with your device. Find the component _environmentalSensor_, you should see the new brightness value 60.
    ```
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


1. Go to your device terminal, you should see that the device has recieved the update.
    ```
    Received an update for brightness: 60
    updated the property
    ```

### Invoke a command 
1. Open the file **invoke_command.js**. 
1. At the beginning of the file, replace the _deviceID_ with the ID you created earlier, and replace below values with examples then save the file.
    ```
        const componentName = 'environmentalSensor'; 
        const commandName = 'blink';
    ```
1. Go back to your service terminal. Use below command to run the sample.
    ```cmd/sh
    node invoke_command.js
    ```
4. From the service terminal, a success would look like
    ```
    invoking command blink on component environmentalSensor for device test...
    {
      "result": "helpful response text",
      "statusCode": 200,
      "requestId": "33e536d3-14f7-4105-88f3-629b9933851c",
      "_response": "helpful response text"
    }
    ```
5. Go to the device terminal, you'll see the command has been acknowledged. 
    ```
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
