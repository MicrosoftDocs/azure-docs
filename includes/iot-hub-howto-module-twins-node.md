---
title: Get started with module identity and module twins (Node.js)
titleSuffix: Azure IoT Hub
description: Learn how to create module identities and update module twins using the Azure IoT Hub SDK for Node.js.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: nodejs
ms.topic: include
ms.date: 09/03/2024
ms.custom: mqtt, devx-track-js
---

## Overview

This article describes how to use the [Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) to create device and backend service application code for module twins.

## Create a device application

Device applications can read and write module twin reported properties, and be notified of desired module twin property changes that are set by a backend application or IoT Hub.

This section describes how to use the [azure-iot-device](/javascript/api/azure-iot-device) package in the Azure IoT SDK for Node.js to create a device application to:

* Retrieve a module twin and examine reported properties
* Update reported module twin properties
* Receive notice of module desired property changes

### Install SDK packages

Run this command to install the **azure-iot-device** device SDK on your development machine:

```cmd/sh
npm install azure-iot-device --save
```

The [azure-iot-device](/javascript/api/azure-iot-device) package contains objects that interface with IoT devices. The [Twin](/javascript/api/azure-iot-device/twin) class includes twin-specific objects. This section describes `Client` class code that is used to read and write device module twin data.

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

### Create a client module

Create a `Client` module using the installed package.

For example:

```javascript
const Client = require('azure-iot-device').Client;
```

### Create a protocol module

Create a `Protocol` module using an installed transport package.

This example assigns the AMQP protocol:

```javascript
const Protocol = require('azure-iot-device-amqp').Amqp;
```

### Add the device connection string and transport protocol

Call [fromConnectionString](/javascript/api/azure-iot-device/client?#azure-iot-device-client-fromconnectionstring) to supply device connection parameters:

* **connStr** - A connection string that encapsulates "device connect" permissions for an IoT hub. The connection string contains hostname, device ID, module ID & shared access key in this format:
"HostName=<iothub_host_name>;DeviceId=<device_id>;ModuleId=<module_id>;SharedAccessKey=<device_key>".
* **transportCtor** - The transport protocol.

This example uses the `Amqp` transport protocol:

```javascript
const deviceConnectionString = "{IoT hub module connection string}"
const Protocol = require('azure-iot-device-mqtt').Amqp;
let client = Client.fromConnectionString(deviceConnectionString, Protocol);
```

### Open the connection to IoT Hub

Use the [open](/javascript/api/azure-iot-device/client?#azure-iot-device-client-open) method to open a connection between an IoT device and IoT Hub.
Use `.catch(err)` to catch an error and execute handler code.

For example:

```javascript
client.open()  //open the connection
.catch((err) => {
  console.error('Could not connect: ' + err.message);
});
```

### Retrieve a module twin and examine reported properties

Call [getTwin](/javascript/api/azure-iot-device/client?#azure-iot-device-client-gettwin-1) to retrieve current module twin information into a [Twin](/javascript/api/azure-iot-device/twin) object.

For example:

```javascript
// Retrieve the current module twin
client.getTwin(function(err, twin))
if (err)
    console.error('could not get twin');

// Display the current properties
console.log('twin contents:');
console.log(twin.properties);
```

### Update reported module twin properties

Use [update](/javascript/api/azure-iothub/twin?#azure-iothub-twin-update) to update device reported properties. Include a JSON-formatted patch as the first parameter and function execution status callback method as the second parameter to the method.

In this example, a JSON-formatted module twin patch is stored in the `patch` variable. The patch contains a module twin `connectivity` update value of `cellular`. The patch and error handler are passed to the `update` method. If there's an error, a console error message is displayed.

```javascript
// Create a patch to send to IoT Hub
var patch = {
  updateTime: new Date().toString(),
  firmwareVersion:'1.2.1',
  weather:{
    temperature: 72,
    humidity: 17
  }
};

// Apply the patch
twin.properties.reported.update(patch, function(err)
  {
    if (err)
      {
        console.error('could not update twin');
      } 
    else
      {
        console.log('twin state reported');
        process.exit();
      }
  });
```

### Receive notice of desired property changes

Create a desired property update event listener that executes when a desired property is changed in the device by passing the callback handler method name to [twin.on](/javascript/api/azure-iot-device/twin?#azure-iot-device-twin-on).

The desired property event listener can take one of the following forms:

* Receive all patches with a single event handler
* Receive an event if anything changes under a properties grouping
* Receive an event for a single property change

#### Receive all patches with a single event handler

You can create a listener to receive any desired property change.

This example code outputs any properties that are received from the service.

```javascript
twin.on('properties.desired', function (delta) {
    console.log('new desired properties received:');
    console.log(JSON.stringify(delta));
});
```

#### Receive an event if anything changes under a properties grouping

You can create a listener to receive an event if anything under a property grouping changes.

For example:

1. The `minTemperature` and `maxTemperature` properties are located under a property grouping named `properties.desired.climate changes`.

1. A backend service application applies this patch to update `minTemperature` and `maxTemperature` desired properties:

    ```javascript
    const twinPatch1 = {
    properties: {
       desired: {
        climate: { minTemperature: 68, maxTemperature: 76, },
        },
      },
     };
    ```

1. This code sets up a desired properties change event listener that triggers for any changes within the `properties.desired.climate` property grouping. If there's a desired property change within this group, min and max temperature change messages that are displayed to the console:

    ```javascript
    twin.on('properties.desired.climate', function (delta) {
        if (delta.minTemperature || delta.maxTemperature) {
            console.log('updating desired temp:');
            console.log('min temp = ' + twin.properties.desired.climate.minTemperature);
            console.log('max temp = ' + twin.properties.desired.climate.maxTemperature);
        }
    });
    ```

#### Receive an event for a single property change

You can set up a listener for a single property change. In this example, the code for this event is executed only if the `fanOn` boolean value is part of the patch. The code outputs the new desired `fanOn` state whenever the service updates it.

1. A backend application applies this desired property patch:

    ```javascript
     const twinPatch2 = {
      properties: {
        desired: {
          climate: {
            hvac: {
              systemControl: { fanOn: true, },
            },
          },
        },
      },
    };
    ```

1. The listener triggers only when the `fanOn` property changes:

    ```javascript
     twin.on('properties.desired.climate.hvac.systemControl', function (fanOn) {
         console.log('setting fan state to ' + fanOn);
      });
    ```

### Device SDK samples

The Azure IoT SDK for Node.js provides working samples of a service app that handles module twin tasks. For more information, see:

* [Module Twin](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/module_twin.js)
* [Module Test Helper](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/module_test_helper.js)
* [Twin e2e tests](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/twin_e2e_tests.js)

## Create a backend application

A backend application connects to a device through IoT Hub and can read and write device desired properties.

This section describes how to create a backend application that:

* Creates a module
* Retrieves and updates a module twin

### Install service SDK packages

Run this command to install **azure-iothub** on your development machine:

```cmd/sh
npm install azure-iothub --save
```

The [Registry](/javascript/api/azure-iothub/registry) class exposes all methods required to interact with module twins from a backend application.

### Connect to IoT hub

Use [fromConnectionString](/javascript/api/azure-iothub/registry?#azure-iothub-registry-fromconnectionstring) to connect to IoT hub.

The SDK methods in this section require shared access policy permissions that includes the following:

* **Registry Write** - required to add a module (or device) to the IoT Hub registry
* **Service Connect** - required to add desired properties to a module

As a parameter to `CreateFromConnectionString`, supply a shared access policy connection string that includes these permissions. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

```javascript
var iothub = require('azure-iothub');
var connectionString = '{IoT hub shared access policy connection string}';
var registry = iothub.Registry.fromConnectionString(connectionString);
```

### Create a module

Call [addModule](/javascript/api/azure-iothub/registry?#azure-iothub-registry-addmodule-1) to add a module to a device.

For example:

```javascript
// Add a module to a device
var deviceId = 'myFirstDevice';
var moduleId = 'myFirstModule';
registry.addModule({ deviceId: deviceId, moduleId: moduleId }, function(err) {
  if (err) {
    console.log('Error creating module identity: ' + err);
    process.exit(1);
  }
```

### Retrieve and update a module twin

You can create a patch that contains tag and desired property updates for a module twin.

To update a module twin:

1. Call [getModuleTwin](/javascript/api/azure-iothub/registry?#azure-iothub-registry-getmoduletwin-1) to retrieve the device [Twin](/javascript/api/azure-iothub/twin) object.

1. Format a patch that contains the module twin update. The patch is formatted in JSON as described in [Twin class](/javascript/api/azure-iothub/twin). A backend service patch can contain tag and desired property updates. For more patch format information, see [Tags and properties format](/azure/iot-hub/iot-hub-devguide-device-twins#tags-and-properties-format).

1. Call [updateModuleTwin](/javascript/api/azure-iothub/registry?&#azure-iothub-registry-updatemoduletwin-1) to update the module twin with the patch.

In this example, the module twin is retrieved for `myDeviceId` and `myModuleId`. Then a patch is applied to the twins that contains `updateTime`, `firmwareVersion`, and `weather` information.

```javascript
registry.getModuleTwin('myDeviceId', 'myModuleId', function(err, twin){
    if (err) {
        console.error(err.constructor.name + ': ' + err.message);
    } else {
        var patch = {
          updateTime: new Date().toString(),
          firmwareVersion:'1.2.0',
          weather:{
            temperature: 75,
            humidity: 23
          }
        };

        twin.updateModuleTwin('myDeviceId', 'myModuleId', patch, twin.etag,function(err) {
          if (err) {
            console.error('Could not update twin: ' + err.constructor.name + ': ' + err.message);
          } else {
            console.log(twin.deviceId + ' twin updated successfully');
          }
        });
    }
});
```

### Service SDK samples

The Azure IoT SDK for Node.js provides working samples of a service app that handles module twin tasks. For more information, see:

* [Module Twin](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/module_twin.js)
* [Module Test Helper](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/module_test_helper.js)
* [Twin e2e tests](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/twin_e2e_tests.js)
