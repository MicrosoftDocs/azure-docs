---
title: Device management using direct methods (Node.js)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub direct methods with the Azure IoT SDK for Node.js for device management tasks including invoking a remote device reboot.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 1/6/2025
ms.custom: mqtt, devx-track-js
---

  *  Requires Node.js version 10.0.x or later

## Overview

This article describes how to use the [Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) to create device and backend service application code for device direct methods.

## Create a device application

This section describes how to use device application code to create a direct method callback.

### Install SDK package

The [azure-iot-device](/javascript/api/azure-iot-device) package contains objects that interface with IoT devices. Run this command to install the **azure-iot-device** device SDK on your development machine:

```cmd/sh
npm install azure-iot-device --save
```

### Connect a device to IoT Hub

A device app can authenticate with IoT Hub using the following methods:

* X.509 certificate
* Shared access key

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

#### Authenticate using an X.509 certificate

[!INCLUDE [iot-hub-howto-auth-device-cert-node](iot-hub-howto-auth-device-cert-node.md)]

#### Authenticate using a shared access key

##### Choose a transport protocol

The `Client` object supports these protocols:

* `Amqp`
* `Http` - When using `Http`, the `Client` instance checks for messages from IoT Hub infrequently (a minimum of every 25 minutes).
* `Mqtt`
* `MqttWs`
* `AmqpWs`

Install needed transport protocols on your development machine.

For example, this command installs the `Amqp` protocol:

```cmd/sh
npm install azure-iot-device-amqp --save
```

For more information about the differences between MQTT, AMQP, and HTTPS support, see [Cloud-to-device communications guidance](../articles/iot-hub/iot-hub-devguide-c2d-guidance.md) and [Choose a communication protocol](../articles/iot-hub/iot-hub-devguide-protocols.md).

##### Create a client object

Create a `Client` object using the installed package.

For example:

```javascript
const Client = require('azure-iot-device').Client;
```

##### Create a protocol object

Create a `Protocol` object using an installed transport package.

This example assigns the AMQP protocol:

```javascript
const Protocol = require('azure-iot-device-amqp').Amqp;
```

##### Add the device connection string and transport protocol

Call [fromConnectionString](/javascript/api/azure-iot-device/client?#azure-iot-device-client-fromconnectionstring) to supply device connection parameters:

* **connStr** - The device connection string.
* **transportCtor** - The transport protocol.

This example uses the `Amqp` transport protocol:

```javascript
const deviceConnectionString = "{IoT hub device connection string}"
const Protocol = require('azure-iot-device-mqtt').Amqp;
let client = Client.fromConnectionString(deviceConnectionString, Protocol);
```

##### Open the connection to IoT Hub

Use the [open](/javascript/api/azure-iot-device/client?#azure-iot-device-client-open) method to open connection between an IoT device and IoT Hub.

For example:

```javascript
client.open(function(err) {
  if (err) {
    console.error('error connecting to hub: ' + err);
    process.exit(1);
  }
})
```

### Create a direct method callback

Call [onDeviceMethod](/javascript/api/azure-iot-device/client?#azure-iot-device-client-ondevicemethod) to create a callback handler function or coroutine that is called when a direct method is received. The listener is associated with a method name keyword, such as "reboot". The method name can be used in an IoT Hub or backend application to trigger the callback method on the device.

The callback handler function should call `response.send` to send a response acknowledgment message to the calling application.

This example sets up a direct method handler named `onReboot` that is called when the "reboot" direct method name is used.

```javascript
client.onDeviceMethod('reboot', onReboot);
```

In this example, the `onReboot` callback method implements the direct method on the device. The code is executed when the "reboot" direct method is called from a service application. The function calls `response.send` to send a response acknowledgment message to the calling application.

```javascript
var onReboot = function(request, response) {

    // Respond the cloud app for the direct method
    response.send(200, 'Reboot started', function(err) {
        if (err) {
            console.error('An error occurred when sending a method response:\n' + err.toString());
        } else {
            console.log('Response to method \'' + request.methodName + '\' sent successfully.');
        }
    });

    // Add your device's reboot API for physical restart.
    console.log('Rebooting!');
};
```

### SDK device samples

The Azure IoT SDK for Node.js provides working samples of device apps that handle device management tasks. For more information, see:

* [Device method sample](https://github.com/Azure/azure-iot-sdk-node/blob/a85e280350a12954f46672761b0b516d08d374b5/device/samples/javascript/device_methods.js)
* [Device methods E2E test](https://github.com/Azure/azure-iot-sdk-node/blob/a85e280350a12954f46672761b0b516d08d374b5/e2etests/test/device_method.js)
* [DM patterns reboot device](https://github.com/Azure/azure-iot-sdk-node/blob/a85e280350a12954f46672761b0b516d08d374b5/device/samples/javascript/dmpatterns_reboot_device.js)

## Create a backend application

This section describes how to invoke a direct method on a device.

### Install service SDK package

Run this command to install **azure-iothub** on your development machine:

```cmd/sh
npm install azure-iothub --save
```

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Use [fromConnectionString](/javascript/api/azure-iothub/client?#azure-iothub-client-fromconnectionstring) to connect to IoT hub.

To invoke a direct method on a device through IoT Hub, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

As a parameter to `CreateFromConnectionString`, supply the **service** shared access policy connection string. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

```javascript
var Client = require('azure-iothub').Client;
var connectionString = '{IoT hub shared access policy connection string}';
var client = Client.fromConnectionString(connectionString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-node](iot-hub-howto-connect-service-iothub-entra-node.md)]

### Invoke a method on a device

Use [invokeDeviceMethod](/javascript/api/azure-iothub/client?#azure-iothub-client-invokedevicemethod) to invoke a direct method by name on a device. The method name parameter identifies the direct method.

This example calls the "reboot" method to initiate a reboot on the device. The "reboot" method is mapped to a callback handler function on the device as described in the **Create a direct method callback** section of this article.

```javascript
var startRebootDevice = function(deviceToReboot) {

    var methodName = "reboot";

    var methodParams = {
        methodName: methodName,
        payload: null,
        timeoutInSeconds: 30
    };

    client.invokeDeviceMethod(deviceToReboot, methodParams, function(err, result) {
        if (err) {
            console.error("Direct method error: "+err.message);
        } else {
            console.log("Successfully invoked the device to reboot.");  
        }
    });
};
```

### SDK service samples

The Azure IoT SDK for Node.js provides working samples of service apps that handle device management tasks. For more information, see:

* [Module methods](https://github.com/Azure/azure-iot-sdk-node/blob/a85e280350a12954f46672761b0b516d08d374b5/e2etests/test/module_methods.js)
* [Device method tests](https://github.com/Azure/azure-iot-sdk-node/blob/a85e280350a12954f46672761b0b516d08d374b5/ts-e2e/src/device_methods.tests.ts)
* [Device method E2E tests](https://github.com/Azure/azure-iot-sdk-node/blob/a85e280350a12954f46672761b0b516d08d374b5/e2etests/test/device_method.js)
* [Method disconnect](https://github.com/Azure/azure-iot-sdk-node/blob/a85e280350a12954f46672761b0b516d08d374b5/e2etests/test/method_disconnect.js)
