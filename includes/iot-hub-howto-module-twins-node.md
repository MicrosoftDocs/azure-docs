---
title: Get started with module identities and module identity twins (Node.js)
titleSuffix: Azure IoT Hub
description: Learn how to create module identities and update module identity twins using the Azure IoT Hub SDK for Node.js.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: nodejs
ms.topic: include
ms.date: 1/3/2025
ms.custom: mqtt, devx-track-js
---

  * Requires Node.js version 10.0.x or later

## Overview

This article describes how to use the [Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) to create device and backend service application code for module identity twins.

## Create a device application

This section describes how to use the [azure-iot-device](/javascript/api/azure-iot-device) package in the Azure IoT SDK for Node.js to create a device application to:

* Retrieve a module identity twin and examine reported properties
* Update module identity reported twin properties
* Receive notice of module identity twin desired property changes

The [azure-iot-device](/javascript/api/azure-iot-device) package contains objects that interface with IoT devices. The [Twin](/javascript/api/azure-iot-device/twin) class includes twin-specific objects. This section describes `Client` class code that is used to read and write device module identity twin data.

### Install SDK package

Run this command to install the **azure-iot-device** device SDK on your development machine:

```cmd/sh
npm install azure-iot-device --save
```

### Connect a device to IoT Hub

A device app can authenticate with IoT Hub using the following methods:

* Shared access key
* X.509 certificate

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

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

For more information about the differences between MQTT, AMQP, and HTTPS support, see [Cloud-to-device communications guidance](../articles/iot-hub/iot-hub-devguide-c2d-guidance.md) and [Choose a device communication protocol](../articles/iot-hub/iot-hub-devguide-protocols.md).

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

* **connStr** - The IoT hub identity module connection string.
* **transportCtor** - The transport protocol.

This example uses the `Amqp` transport protocol:

```javascript
const deviceConnectionString = "{IoT hub identity module connection string}"
const Protocol = require('azure-iot-device-mqtt').Amqp;
let client = Client.fromConnectionString(deviceConnectionString, Protocol);
```

##### Open the connection to IoT Hub

Use the [open](/javascript/api/azure-iot-device/client?#azure-iot-device-client-open) method to open a connection between an IoT device and IoT Hub.

For example:

```javascript
client.open(function(err) {
  if (err) {
    console.error('error connecting to hub: ' + err);
    process.exit(1);
  }
})
```

#### Authenticate using an X.509 certificate

[!INCLUDE [iot-hub-howto-auth-device-cert-node](iot-hub-howto-auth-device-cert-node.md)]

### Retrieve a module identity twin and examine reported properties

Call [getTwin](/javascript/api/azure-iot-device/client?#azure-iot-device-client-gettwin-1) to retrieve current module identity twin information into a [Twin](/javascript/api/azure-iot-device/twin) object.

Device code can then access the module identity twin properties.

For example:

```javascript
// Retrieve the current module identity twin
client.getTwin(function(err, twin))
if (err)
    console.error('could not get twin');

// Display the current properties
console.log('twin contents:');
console.log(twin.properties);
```

### Update module identity twin reported properties

Use [update](/javascript/api/azure-iothub/twin?#azure-iothub-twin-update) to update device reported properties. Include a JSON-formatted patch as the first parameter and function execution status callback method as the second parameter to the method.

In this example, a JSON-formatted module identity twin patch is stored in the `patch` variable. The patch contains a module identity twin `connectivity` update value of `cellular`. The patch and error handler are passed to the `update` method. If there's an error, a console error message is displayed.

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

### Receive notice of module identity twin desired property changes

Create a module identity twin desired property update event listener that executes when a desired property is changed by passing the callback handler method name to [twin.on](/javascript/api/azure-iot-device/twin?#azure-iot-device-twin-on).

The desired property event listener can take the following forms:

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

1. This code sets up a desired property change event listener that triggers for any changes within the `properties.desired.climate` property grouping. If there's a desired property change within this group, min and max temperature change messages are displayed to the console:

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

#### Complete example

This example encapsulates the principles of this section, including multi-level callback function nesting.

```javascript
var Client = require('azure-iot-device').Client;
var Protocol = require('azure-iot-device-amqp').Amqp;
// Copy/paste your module connection string here.
var connectionString = 'HostName=xxx.azure-devices.net;DeviceId=myFirstDevice2;ModuleId=myFirstModule2;SharedAccessKey=xxxxxxxxxxxxxxxxxx';
// Create a client using the Amqp protocol.
var client = Client.fromConnectionString(connectionString, Protocol);
client.on('error', function (err) {
  console.error(err.message);
});
// connect to the hub
client.open(function(err) {
  if (err) {
    console.error('error connecting to hub: ' + err);
    process.exit(1);
  }
  console.log('client opened');
// Create device Twin
  client.getTwin(function(err, twin) {
    if (err) {
      console.error('error getting twin: ' + err);
      process.exit(1);
    }
    // Output the current properties
    console.log('twin contents:');
    console.log(twin.properties);
    // Add a handler for desired property changes
    twin.on('properties.desired', function(delta) {
        console.log('new desired properties received:');
        console.log(JSON.stringify(delta));
    });
    // create a patch to send to the hub
    var patch = {
      updateTime: new Date().toString(),
      firmwareVersion:'1.2.1',
      weather:{
        temperature: 75,
        humidity: 20
      }
    };
    // send the patch
    twin.properties.reported.update(patch, function(err) {
      if (err) throw err;
      console.log('twin state reported');
    });

  });
});
```

### Device SDK samples

The Azure IoT SDK for Node.js provides working samples of device apps that handle module identity twin tasks. For more information, see:

* [Module Identity Twin](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/module_twin.js)
* [Module Test Helper](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/module_test_helper.js)
* [Twin e2e tests](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/twin_e2e_tests.js)

## Create a backend application

This section describes how to create a backend application that retrieves a module identity twin and updates desired properties.

### Install service SDK package

Run this command to install **azure-iothub** on your development machine:

```cmd/sh
npm install azure-iothub --save
```

### Create a Registry object

The [Registry](/javascript/api/azure-iothub/registry) class exposes all methods required to interact with module identity twins from a backend application.

```javascript
let Registry = require('azure-iothub').Registry;
```

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Use [fromConnectionString](/javascript/api/azure-iothub/registry?#azure-iothub-registry-fromconnectionstring) to connect to IoT hub.

The `update` method used in this section requires the **Service Connect** shared access policy permission to add desired properties to a module. As a parameter to `fromConnectionString`, supply a shared access policy connection string that includes **Service Connect** permission. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

```javascript
let connectionString = '{IoT hub shared access policy connection string}';
let registry = Registry.fromConnectionString(serviceConnectionString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-node](iot-hub-howto-connect-service-iothub-entra-node.md)]

### Retrieve a module identity twin and update desired properties

You can create a patch that contains desired property updates for a module identity twin.

To update a module identity twin:

1. Call [getModuleTwin](/javascript/api/azure-iothub/registry?#azure-iothub-registry-getmoduletwin-1) to retrieve the device [Twin](/javascript/api/azure-iothub/twin) object.

1. Format a patch that contains the module identity twin update. The patch is formatted in JSON as described in [Twin class](/javascript/api/azure-iothub/twin). A backend service patch contains desired property updates. For more patch format information, see [Tags and properties format](/azure/iot-hub/iot-hub-devguide-device-twins#tags-and-properties-format).

1. Call [update](/javascript/api/azure-iothub/twin?#azure-iothub-twin-update) to update the module identity twin with the patch.

In this example, the module identity twin is retrieved for `myDeviceId` and `myModuleId`. Then a patch is applied to the twins that contains `climate` information.

```javascript
// Insert your device ID and moduleId here.
var deviceId = 'myFirstDevice2';
var moduleId = 'myFirstModule2';

// Retrieve the current module identity twin
registry.getModuleTwin(deviceId, moduleId, function (err, twin) {
  console.log('getModuleTwin returned ' + (err ? err : 'success'));
  if (err) {
    console.log(err);
  } else {
    console.log('success');
    console.log('Current twin:' + JSON.stringify(twin))

    // Format a desired property patch
    const twinPatch1 = {
      properties: {
        desired: {
          climate: { minTemperature: 69, maxTemperature: 77, },
        },
      },
    };

    // Send the desired property patch to IoT Hub
    twin.update(twinPatch1, function(err) {
    if (err) throw err;
    console.log('twin state reported');
    });
  }
});
```

### Service SDK samples

The Azure IoT SDK for Node.js provides working samples of service apps that handle module identity twin tasks. For more information, see:

* [Module Identity Twin](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/module_twin.js)
* [Module Test Helper](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/module_test_helper.js)
* [Twin e2e tests](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/twin_e2e_tests.js)
