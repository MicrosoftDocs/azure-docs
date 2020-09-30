---
title: Interact with an IoT Plug and Play device connected to your Azure IoT solution (Node.js) | Microsoft Docs
description: Use Node.js to connect to and interact with an IoT Plug and Play device that's connected to your Azure IoT solution.
author: elhorton
ms.author: elhorton
ms.date: 08/11/2020
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc, devx-track-js

# As a solution builder, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.
---

# Quickstart: Interact with an IoT Plug and Play device that's connected to your solution (Node.js)

[!INCLUDE [iot-pnp-quickstarts-service-selector.md](../../includes/iot-pnp-quickstarts-service-selector.md)]

IoT Plug and Play simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This quickstart shows you how to use Node.js to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](../../includes/iot-pnp-prerequisites.md)]

To complete this quickstart, you need Node.js on your development machine. You can download the latest recommended version for multiple platforms from [nodejs.org](https://nodejs.org).

You can verify the current version of Node.js on your development machine using the following command:

```cmd/sh
node --version
```

### Clone the SDK repository with the sample code

Clone the samples from a [the Node SDK repository](https://github.com/Azure/azure-iot-sdk-node). Open a terminal window in a folder of your choice. Run the following command to clone the [Microsoft Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) GitHub repository:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-node
```

## Run the sample device

[!INCLUDE [iot-pnp-environment](../../includes/iot-pnp-environment.md)]

To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-node/blob/master/device/samples/pnp/readme.md).

In this quickstart, you can use a sample thermostat device that's written in Node.js as the IoT Plug and Play device. To run the sample device:

1. Open a terminal window and navigate to the local folder that contains the Microsoft Azure IoT SDK for Node.js repository you cloned from GitHub.

1. This terminal window is used as your **device** terminal. Go to the folder of your cloned repository, and navigate to the */azure-iot-sdk-node/device/samples/pnp* folder. Install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

1. Run the sample thermostat device with the following command:

    ```cmd/sh
    node simple_thermostat.js
    ```

1. You see messages saying that the device has sent some information and reported itself online. These messages indicate that the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates. Don't close this terminal, you need it to confirm the service sample is working.

## Run the sample solution

In [Set up your environment for the IoT Plug and Play quickstarts and tutorials](set-up-environment.md) you created two environment variables to configure the sample to connect to your IoT hub and device:

* **IOTHUB_CONNECTION_STRING**: the IoT hub connection string you made a note of previously.
* **IOTHUB_DEVICE_ID**: `"my-pnp-device"`.

In this quickstart, you use a sample IoT solution in Node.js to interact with the sample device you just set up.

1. Open another terminal window to use as your **service** terminal.

1. In the cloned Node SDK repository, navigate to the */azure-iot-sdk-node/service/samples/javascript* folder. Install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

### Read a property

1. When you ran the sample thermostat device in the **device** terminal, you saw the following messages indicating its online status:

    ```cmd/sh
    properties have been reported for component
    sending telemetry message 0...
    ```

1. Go to the **service** terminal and use the following command to run the sample for reading device information:

    ```cmd/sh
    node get_digital_twin.js
    ```

1. In the **service** terminal output, notice the response of the digital twin. You see the device's model ID and associated properties reported:

    ```json
    "$dtId": "mySimpleThermostat",
    "serialNumber": "123abc",
    "maxTempSinceLastReboot": 51.96167432818655,
    "$metadata": {
      "$model": "dtmi:com:example:Thermostat;1",
      "serialNumber": { "lastUpdateTime": "2020-07-09T14:04:00.6845182Z" },
      "maxTempSinceLastReboot": { "lastUpdateTime": "2020-07-09T14:04:00.6845182" }
    }
    ```

1. The following snippet shows the code in *get_digital_twin.js* that retrieves the device twin's model ID:

    ```javascript
    console.log("Model Id: " + inspect(digitalTwin.$metadata.$model))
    ```

In this scenario, it outputs `Model Id: dtmi:com:example:Thermostat;1`.

### Update a writable property

1. Open the file *update_digital_twin.js* in a code editor.

1. Review the sample code. You can see how to create a JSON patch to update your device's digital twin. In this sample, the code replaces the thermostat's temperature with the value 42:

    ```javascript
    const patch = [{
        op: 'add',
        path: '/targetTemperature',
        value: '42'
      }]
    ```

1. In the **service** terminal, use the following command to run the sample for updating the property:

    ```cmd/sh
    node update_digital_twin.js
    ```

1. In your **device** terminal, you see the device has received the update:

    ```cmd/sh
    The following properties will be updated for the default component:
    {
      targetTemperature: {
        value: 42,
        ac: 200,
        ad: 'Successfully executed patch for targetTemperature',
        av: 2
      }
    }
    updated the property
    Properties have been reported for component
    ```

1. In your **service** terminal, run the following command to confirm the property is updated:

    ```cmd/sh
    node get_digital_twin.js
    ```

1. In the **service** terminal output, in the digital twin response under the `thermostat1` component, you see the updated target temperature reported. It might take a while for the device to finish the update. Repeat this step until the device has processed the property update:

    ```json
    targetTemperature: 42,
    ```

### Invoke a command

1. Open the file *invoke_command.js* and review the code.

1. Go to the **service** terminal. Use the following command to run the sample for invoking the command:

    ```cmd/sh
    set IOTHUB_COMMAND_NAME=getMaxMinReport
    set IOTHUB_COMMAND_PAYLOAD=commandpayload
    node invoke_command.js
    ```

1. Output in the **service** terminal shows the following confirmation:

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

1. In the **device** terminal, you see the command is acknowledged:

    ```cmd/sh
    MaxMinReport commandpayload
    Response to method 'getMaxMinReport' sent successfully.
    ```

## Next steps

In this quickstart, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about IoT Plug and Play device models, see:

> [!div class="nextstepaction"]
> [IoT Plug and Play modeling developer guide](concepts-developer-guide-device-csharp.md)
