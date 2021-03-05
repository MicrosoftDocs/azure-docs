---
title: Send device telemetry to Azure IoT Hub quickstart (Node.js)
description: In this quickstart, you use the Azure IoT Hub Device SDK for Node.js to send telemetry from a device to an Iot hub.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: node
ms.topic: quickstart
ms.date: 01/11/2021
---

# Quickstart: Send telemetry from a device to an IoT hub (Node.js)

**Applies to**: [Device application development](about-iot-develop.md#device-application-development)

In this quickstart, you learn a basic IoT device application development workflow. You use the Azure CLI to create an Azure IoT hub and a simulated device, then you use the Azure IoT Node.js SDK to access the device and send telemetry to the hub.

## Prerequisites
- If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Azure CLI. You can run all commands in this quickstart using the Azure Cloud Shell, an interactive CLI shell that runs in your browser. If you use the Cloud Shell, you don't need to install anything. If you prefer to use the CLI locally, this quickstart requires Azure CLI version 2.0.76 or later. Run az --version to find the version. To install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).
- [Node.js 10+](https://nodejs.org). If you are using the Azure Cloud Shell, do not update the installed version of Node.js. The Azure Cloud Shell already has the latest Node.js version.

    Verify the current version of Node.js on your development machine by using the following command:

    ```cmd/sh
        node --version
    ```

[!INCLUDE [iot-hub-include-create-hub-cli](../../includes/iot-hub-include-create-hub-cli.md)]

## Use the Node.js SDK to send messages
In this section, you will use the Node.js SDK to send messages from your simulated device to your IoT hub. 

1. Open a new terminal window. You will use this terminal to install the Node.js SDK and work with Node.js sample code. You should now have two terminals open: the one you just opened to work with Node.js, and the CLI shell that you used in previous sections to enter Azure CLI commands. 

1. Copy the [Azure IoT Node.js SDK device samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/device/samples) to your local machine:

    ```console
    git clone https://github.com/Azure/azure-iot-sdk-node
    ```

1. Navigate to the *azure-iot-sdk-node/device/samples* directory:

    ```console
    cd azure-iot-sdk-node/device/samples
    ```
1. Install the Azure IoT Node.js SDK and necessary dependencies:

    ```console
    npm install
    ```
    This command installs the proper dependencies as specified in the *package.json* file in the device samples directory.

1. Set the Device Connection String as an environment variable called `DEVICE_CONNECTION_STRING`. The string value to use is the string you obtained in the previous section after creating your simulated Node.js device. 

    **Windows (cmd)**

    ```console
    set DEVICE_CONNECTION_STRING=<your connection string here>
    ```

    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the connection string.

    **Linux (bash)**

    ```bash
    export DEVICE_CONNECTION_STRING="<your connection string here>"
    ```

1. In your open CLI shell, run the [az iot hub monitor-events](/cli/azure/ext/azure-iot/iot/hub#ext-azure-iot-az-iot-hub-monitor-events) command to begin monitoring for events on your simulated IoT device.  Event messages will be printed in the terminal as they arrive.

    ```azurecli
    az iot hub monitor-events --output table --hub-name {YourIoTHubName}
    ```

1. In your Node.js terminal, run the code for the installed sample file *simple_sample_device.js* . This code accesses the simulated IoT device and sends a message to the IoT hub.

    To run the Node.js sample from the terminal:
    ```console
    node ./simple_sample_device.js
    ```

    Optionally, you can run the Node.js code from the sample in your JavaScript IDE:
    ```javascript
    'use strict';

    const Protocol = require('azure-iot-device-mqtt').Mqtt;
    // Uncomment one of these transports and then change it in fromConnectionString to test other transports
    // const Protocol = require('azure-iot-device-amqp').AmqpWs;
    // const Protocol = require('azure-iot-device-http').Http;
    // const Protocol = require('azure-iot-device-amqp').Amqp;
    // const Protocol = require('azure-iot-device-mqtt').MqttWs;
    const Client = require('azure-iot-device').Client;
    const Message = require('azure-iot-device').Message;

    // String containing Hostname, Device Id & Device Key in the following formats:
    //  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
    const deviceConnectionString = process.env.DEVICE_CONNECTION_STRING;
    let sendInterval;

    function disconnectHandler () {
    clearInterval(sendInterval);
    client.open().catch((err) => {
        console.error(err.message);
    });
    }

    // The AMQP and HTTP transports have the notion of completing, rejecting or abandoning the message.
    // For example, this is only functional in AMQP and HTTP:
    // client.complete(msg, printResultFor('completed'));
    // If using MQTT calls to complete, reject, or abandon are no-ops.
    // When completing a message, the service that sent the C2D message is notified that the message has been processed.
    // When rejecting a message, the service that sent the C2D message is notified that the message won't be processed by the device. the method to use is client.reject(msg, callback).
    // When abandoning the message, IoT Hub will immediately try to resend it. The method to use is client.abandon(msg, callback).
    // MQTT is simpler: it accepts the message by default, and doesn't support rejecting or abandoning a message.
    function messageHandler (msg) {
    console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
    client.complete(msg, printResultFor('completed'));
    }

    function generateMessage () {
    const windSpeed = 10 + (Math.random() * 4); // range: [10, 14]
    const temperature = 20 + (Math.random() * 10); // range: [20, 30]
    const humidity = 60 + (Math.random() * 20); // range: [60, 80]
    const data = JSON.stringify({ deviceId: 'myFirstDevice', windSpeed: windSpeed, temperature: temperature, humidity: humidity });
    const message = new Message(data);
    message.properties.add('temperatureAlert', (temperature > 28) ? 'true' : 'false');
    return message;
    }

    function errorCallback (err) {
    console.error(err.message);
    }

    function connectCallback () {
    console.log('Client connected');
    // Create a message and send it to the IoT Hub every two seconds
    sendInterval = setInterval(() => {
        const message = generateMessage();
        console.log('Sending message: ' + message.getData());
        client.sendEvent(message, printResultFor('send'));
    }, 2000);

    }

    // fromConnectionString must specify a transport constructor, coming from any transport package.
    let client = Client.fromConnectionString(deviceConnectionString, Protocol);

    client.on('connect', connectCallback);
    client.on('error', errorCallback);
    client.on('disconnect', disconnectHandler);
    client.on('message', messageHandler);

    client.open()
    .catch(err => {
    console.error('Could not connect: ' + err.message);
    });

    // Helper function to print results in the console
    function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
    }
    ```

As the Node.js code sends a simulated telemetry message from your device to the IoT hub, the message appears in your CLI shell that is monitoring events:

```output
event:
  component: ''
  interface: ''
  module: ''
  origin: <your device name>
  payload: '{"deviceId":"myFirstDevice","windSpeed":11.853592092144627,"temperature":22.62484121157508,"humidity":66.17960805575937}'
```

Your device is now securely connected and sending telemetry to Azure IoT Hub.

## Clean up resources
If you no longer need the Azure resources created in this quickstart, you can use the Azure CLI to delete them.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. 

To delete a resource group by name:
1. Run the [az group delete](/cli/azure/group#az-group-delete) command. This command removes the resource group, the IoT Hub, and the device registration you created.

    ```azurecli
    az group delete --name MyResourceGroup
    ```
1. Run the [az group list](/cli/azure/group#az-group-list) command to confirm the resource group is deleted.  

    ```azurecli
    az group list
    ```

## Next steps

In this quickstart, you learned a basic Azure IoT application workflow for securely connecting a device to the cloud and sending device-to-cloud telemetry. You used the Azure CLI to create an IoT hub and a simulated device, then you used the Azure IoT Node.js SDK to access the device and send telemetry to the hub. 

As a next step, explore the Azure IoT Node.js SDK through application samples.

- [More Node.js Samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/device/samples): This directory contains more samples from the Node.js SDK repository to showcase IoT Hub scenarios.