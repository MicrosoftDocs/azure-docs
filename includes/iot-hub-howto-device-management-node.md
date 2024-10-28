---
title: Device management using direct methods (Node.js)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub direct methods with the Azure IoT SDK for Node.js for device management tasks including invoking a remote device reboot.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 10/09/2024
ms.custom: mqtt, devx-track-js
---

  * **Node.js** - Requires Node.js version 10.0.x or later.

## Overview

This article describes how to use the [Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) to create device and backend service application code for device direct methods.

## Create a device application

This section describes how to use device application code to:

* Respond to a direct method called by the cloud
* Trigger a simulated device reboot
* Use the reported properties to enable device twin queries to identify devices and when they were last rebooted

### Install SDK packages

The [azure-iot-device](/javascript/api/azure-iot-device) package contains objects that interface with IoT devices. Run this command to install the **azure-iot-device** device SDK on your development machine:

```cmd/sh
npm install azure-iot-device --save
```

### Choose a transport protocol

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

### Create a client object

Create a `Client` object using the installed package.

For example:

```javascript
const Client = require('azure-iot-device').Client;
```

### Create a protocol object

Create a `Protocol` object using an installed transport package.

This example assigns the AMQP protocol:

```javascript
const Protocol = require('azure-iot-device-amqp').Amqp;
```

### Add the device connection string and transport protocol

Call [fromConnectionString](/javascript/api/azure-iot-device/client?#azure-iot-device-client-fromconnectionstring) to supply device connection parameters:

* **connStr** - The device connection string.
* **transportCtor** - The transport protocol.

This example uses the `Amqp` transport protocol:

```javascript
const deviceConnectionString = "{IoT hub device connection string}"
const Protocol = require('azure-iot-device-mqtt').Amqp;
let client = Client.fromConnectionString(deviceConnectionString, Protocol);
```

### Open the connection to IoT Hub

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

Call [onDeviceMethod](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-on-method-request-received) to create a handler function or coroutine that is called when a direct method is received. The listener is associated with a method name keyword, such as "reboot". The method name can be used in an IoT Hub or backend application to trigger the callback method on the device.

This example sets up a direct method handler named `onReboot`.

```javascript
client.onDeviceMethod('reboot', onReboot);
```

In this example, the `onReboot` callback method implements the direct method on the device. The code is executed when the "rebootDevice" direct method is called from a service application. This code updates reported properties related to a simulated device reboot. The reported properties can be read and verified by an IoT Hub or backend application, as demonstrated in the **Create a backend application** section of this article.

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

    // Report the reboot before the physical restart
    var date = new Date();
    var patch = {
        iothubDM : {
            reboot : {
                lastReboot : date.toISOString(),
            }
        }
    };

    // Get device Twin
    client.getTwin(function(err, twin) {
        if (err) {
            console.error('could not get twin');
        } else {
            console.log('twin acquired');
            twin.properties.reported.update(patch, function(err) {
                if (err) throw err;
                console.log('Device reboot twin state reported')
            });  
        }
    });

    // Add your device's reboot API for physical restart.
    console.log('Rebooting!');
};
```

### SDK device samples

The Azure IoT SDK for Node.js provides working samples of device apps that handle device management tasks. For more information, see [The device management pattern samples](https://github.com/Azure/azure-iot-sdk-node/blob/a85e280350a12954f46672761b0b516d08d374b5/doc/dmpatterns.md).

## Create a backend application

This section describes how to initiate a remote reboot on a device using a direct method. The app uses device twin queries to discover the last reboot time for that device.

### Install service SDK package

Run this command to install **azure-iothub** on your development machine:

```cmd/sh
npm install azure-iothub --save
```

### Create a Registry object

The [Registry](/javascript/api/azure-iothub/registry) class exposes all methods required to interact with direct methods from a backend application.

### Connect to IoT hub

Use [fromConnectionString](/javascript/api/azure-iothub/registry?#azure-iothub-registry-fromconnectionstring) to connect to IoT hub.

To invoke a direct method on a device through IoT Hub, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

As a parameter to `CreateFromConnectionString`, supply the **service** shared access policy connection string. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

```javascript
var Registry = require('azure-iothub').Registry;
var Client = require('azure-iothub').Client;
var connectionString = '{IoT hub shared access policy connection string}';
var client = Client.fromConnectionString(connectionString);
var registry = Registry.fromConnectionString(serviceConnectionString);
```

### Invoke a method on a device

Use [invokeDeviceMethod](/javascript/api/azure-iothub/client?#azure-iothub-client-invokedevicemethod) to invoke a direct method by name on a device. The method name parameter identifies the direct method. The method name is "reboot" in the examples within this article.

```javascript
var startRebootDevice = function(twin) {

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

This example function uses device twin queries to discover the last reboot time for the device that was updated as described in the **Create a direct method callback** section of this article.

```javascript
var queryTwinLastReboot = function() {

    registry.getTwin(deviceToReboot, function(err, twin){

        if (twin.properties.reported.iothubDM != null)
        {
            if (err) {
                console.error('Could not query twins: ' + err.constructor.name + ': ' + err.message);
            } else {
                var lastRebootTime = twin.properties.reported.iothubDM.reboot.lastReboot;
                console.log('Last reboot time: ' + JSON.stringify(lastRebootTime, null, 2));
            }
        } else 
            console.log('Waiting for device to report last reboot time.');
    });
};
```

### SDK service samples

The Azure IoT SDK for Node.js provides working samples of service apps that handle device management tasks. For more information, see [The device management pattern samples](https://github.com/Azure/azure-iot-sdk-node/blob/a85e280350a12954f46672761b0b516d08d374b5/doc/dmpatterns.md).
