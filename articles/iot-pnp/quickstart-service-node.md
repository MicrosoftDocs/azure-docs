---
title: Interact with an IoT Plug and Play Preview device connected to your Azure IoT solution (Node.js) | Microsoft Docs
description: Use Node.js to connect to and interact with an IoT Plug and Play Preview device that's connected to your Azure IoT solution.
author: ericmitt
ms.author: ericmitt
ms.date: 05/04/2020
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.
---

# Quickstart: Interact with an IoT Plug and Play Preview device that's connected to your solution (Node.js)

[!INCLUDE [iot-pnp-quickstarts-service-selector.md](../../includes/iot-pnp-quickstarts-service-selector.md)]

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This quickstart shows you how to use Node.js to connect to and control an IoT Plug and Play device that's connected to your solution.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this quickstart, you need Node.js on your development machine. You can download the latest recommended version for multiple platforms from [nodejs.org](https://nodejs.org).

You can verify the current version of Node.js on your development machine using the following command: 

```cmd/sh
node --version
```

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub (note for use later):

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```
**Install the Node Service SDK**
You can install the [Node service SDK with PnP support](https://www.npmjs.com/package/azure-iot-digitaltwins-service/v/1.0.0-pnp-refresh.2) by running the following command: 

`npm i azure-iot-digitaltwins-service@1.0.0-pnp-refresh.2`

## Run the sample device

In this quickstart, you can use a sample thermostat device that's written in Node.js as the IoT Plug and Play device. For full instructions on how to set up this device, see [this page](dummy link to node no component device documentation). As a summary for using this device, you should:

1. **Get the Node Plug and Play samples**. Open a terminal window in the directory of your choice. Execute the following command to clone the [Microsoft Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) GitHub repository into this location:

    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-node 
    ```

    This operation may take a few minutes to complete.

1. This terminal window is used as your _device_ terminal. Go to the folder of your cloned repository, and navigate to the **/azure-iot-sdk-node/device/samples/pnp** folder. Install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

1. Configure the _device connection string_:

    ```cmd/sh
    set DEVICE_CONNECTION_STRING=<YourDeviceConnectionString>
    ```

1. Run the sample thermostat device with the following command:

    ```cmd/sh
    node simple_thermostat.js
    ```

1. You see messages saying that the device has sent some information and reported itself online. These messages indicate that the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates. Don't close this terminal, you'll need it later to confirm the service samples also worked.

## Run the sample solution

In this quickstart, you use a sample IoT solution in Node.js to interact with the sample device.

1. Open another terminal window to use as your _service_ terminal. The service SDK is in preview, so you will need to clone the samples from a [preview branch of the Node SDK](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp):

    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-node -b public-preview-pnp
    ```

1. Go to the folder of this cloned repository branch, and navigate to the **/azure-iot-samples-node/digital-twins/samples/service/javascript** folder. Install all the dependencies by running the following command:

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
    properties have been reported for component
    sending telemetry message 0...
    ```

1. In the **/azure-iot-samples-node/digital-twins/samples/service/javascript** folder, open the file **get_digital_twin.js**. Be sure to set the environment variable for your device ID as well.

    ```cmd/sh
    set IOTHUB_DEVICE_ID=<your device ID> (i.e. mySimpleThermostat)
    ```

1. Go to the _service_ terminal and use the following command to run the sample for reading device information:

    ```cmd/sh
    node get_digital_twin.js
    ```

1. In the _service_ terminal output, notice the response of the digital twin. You should see the device's model ID and associated properties reported:

    ```JSON
     {
      '$dtId': 'mySimpleThermostat',
      serialNumber: '123abc',
      maxTempSinceLastReboot: 51.96167432818655,
      '$metadata': {
        '$model': 'dtmi:com:example:Thermostat;1',
        serialNumber: { lastUpdateTime: '2020-07-09T14:04:00.6845182Z' },
        maxTempSinceLastReboot: { lastUpdateTime: '2020-07-09T14:04:00.6845182Z' }
      },
    ```
    
1. Also notice how to retrieve the device twin's model ID, which, in this case, is for the simple thermostat model. 

```javascript
    console.log("Model Id: " + inspect(digitalTwin.$metadata.$model))
```
In this scenario, it outputs `Model Id: dtmi:com:example:Thermostat;1`

### Update a writable property

1. Open the file **update_digital_twin_property.js**.

1. Be sure that your environment variables for the IOTHUB_CONNECTION_STRING and IOTHUB_DEVICE_ID are properly set:

    ```cmd/sh
    set IOTHUB_CONNECTION_STRING=<YourIoTHubConnectionString>
    set IOTHUB_DEVICE_ID=<your device ID> (i.e. mySimpleThermostat)
    ```
1. Take a quick look through the sample code. You'll see a JSON patch created which will update your device's digital twin. Notice how it is currently set to replace the thermostat's temperature with the value 42: 

    ```javascript
    const patch = [{
        op: 'add',
        path: 'targetTemperature',
        value: '42'
      }]
    ```

1. Go to the _service_ terminal and use the following command to run the sample for updating the property:

    ```cmd/sh
    node update_digital_twin_property.js
    ```

1. The _service_ terminal output shows the updated device information. Scroll to the `thermostat1` component to see the new targetTemperature value of 42. You can also verify this on Azure Device Explorer:

    ```json
    "modelId": "dtmi:com:example:Thermostat;1",
        "version": 12,
        "properties": {
            "desired": {
                "targetTemperature": "42",
                "$metadata": {
                    "$lastUpdated": "2020-07-09T13:55:50.7976985Z",
                    "$lastUpdatedVersion": 5,
                    "targetTemperature": {
                        "$lastUpdated": "2020-07-09T13:55:50.7976985Z",
                        "$lastUpdatedVersion": 5
                    }
                },
                "$version": 5
            },
            "reported": {
                "serialNumber": "123abc",
                "maxTempSinceLastReboot": 32.279942997143785,
                "targetTemperature": {
                    "value": "42",
                    "ac": 200,
                    "ad": "Successfully executed patch for targetTemperature",
                    "av": 2
                },
    ```

1. Go to your _device_ terminal, you see the device has received the update:

    ```cmd/sh
    Received an update for targetTemperature: 42
    updated the property
    ```

1. Go back to your _service_ terminal and run the below command to get the device information again, to confirm the property has been updated.

    ```cmd/sh
    node get_digital_twin.js
    ```

1. In the _service_ terminal output, in the digital twin response under the `thermostat1` component, you see the updated target temperature has been reported. Note: it might take a while for the device to finish the update. You can repeat this step until the device has processed the property update.

    ```json
    '$model': 'dtmi:com:example:Thermostat;1',
    targetTemperature: {
      desiredValue: '42',
      desiredVersion: 4,
      ackVersion: 4,
      ackCode: 200,
      ackDescription: 'Successfully executed patch for targetTemperature',
      lastUpdateTime: '2020-07-09T13:55:30.5062641Z'
    },
    ```

### Invoke a command

1. Open the file **invoke_command.js**.

1. Be sure to set all of the environment variables or hard code values into their corresponding fields:

    ```javascript
    const deviceId = process.env.IOTHUB_DEVICE_ID; // your device ID
    const componentName = process.env.IOTHUB_COMPONENT_NAME; // for this example, thermostat1
    const commandName = process.env.IOTHUB_COMMAND_NAME; // for this example, getMaxMinReport
    const commandArgument = process.env.IOTHUB_COMMAND_PAYLOAD; // for this example, any string is fine
    ```

1. Go to the _service_ terminal. Use the following command to run the sample for invoking the command:

    ```cmd/sh
    node invoke_command.js
    ```

1. Output in the _service_ terminal should show the following confirmation:

    ```cmd/sh
    {   
        xMsCommandStatuscode: 200,  
        xMsRequestId: 'ee9dd3d7-4405-4983-8cee-48b4801fdce2',  
        connection: 'close',  'content-length': '18',  
        'content-type': 'application/json; charset=utf-8',  
        date: 'Thu, 09 Jul 2020 15:05:14 GMT',  
        server: 'Microsoft-HTTPAPI/2.0',  vary: 'Origin',  
        body: 'min/max response' 
    }
    ```

1. Go to the _device_ terminal, you see the command has been acknowledged:

    ```cmd/sh
    MaxMinReport [object Object]
    Response to method 'getMaxMinReport' sent successfully.
    ```

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
