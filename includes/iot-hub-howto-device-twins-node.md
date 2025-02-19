---
title: Get started with Azure IoT Hub device twins (Node.js)
titleSuffix: Azure IoT Hub
description: How to use the Azure IoT SDK for Node.js to create device and backend service application code for device twins.
author: kgremban
ms.author: kgremban
ms.service: azure-iot-hub
ms.devlang: nodejs
ms.topic: include
ms.date: 07/20/2024
ms.custom: mqtt, devx-track-js
---

  *  Requires Node.js version 10.0.x or later

## Overview

This article describes how to use the [Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) to create device and backend service application code for device twins.

## Create a device application

Device applications can read and write twin reported properties, and be notified of desired twin property changes that are set by a backend application or IoT Hub.

This section describes how to use the [azure-iot-device](/javascript/api/azure-iot-device) package in the Azure IoT SDK for Node.js to create a device application to:

* Retrieve a device twin and examine reported properties
* Update reported device twin properties
* Receive notice of desired property changes

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

### Install device SDK package

Run this command to install the **azure-iot-device** device SDK on your development machine:

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

The [azure-iot-device](/javascript/api/azure-iot-device) package contains objects that interface with IoT devices. The [Twin](/javascript/api/azure-iot-device/twin) class includes twin-specific objects. This section describes `Client` class code that is used to read and write device twin data.

### Choose a transport protocol

The `Client` object supports these protocols:

* `Amqp`
* `Http` - When using `Http`, the `Client` instance checks for messages from IoT Hub infrequently (a minimum of every 25 minutes).
* `Mqtt`
* `MqttWs`
* `AmqpWs`

Install needed transport protocols on your development machine.

For example, this command installs the `Mqtt` protocol:

```cmd/sh
npm install azure-iot-device-mqtt --save
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

This example assigns the MQTT protocol:

```javascript
const Protocol = require('azure-iot-device-mqtt').Mqtt;
```

### Add the device connection string and transport protocol

Call [fromConnectionString](/javascript/api/azure-iot-device/client?#azure-iot-device-client-fromconnectionstring) to supply device connection parameters:

* **connStr** - A connection string that encapsulates "device connect" permissions for an IoT hub. The connection string contains hostname, device ID & shared access key in this format:
"HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>".
* **transportCtor** - The transport protocol.

This example uses the `Mqtt` transport protocol:

```javascript
const deviceConnectionString = "{IoT hub device connection string}"
const Protocol = require('azure-iot-device-mqtt').Mqtt;
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

### Retrieve a device twin and examine reported properties

Call [getTwin](/javascript/api/azure-iot-device/client?#azure-iot-device-client-gettwin-1) to retrieve current device twin information into a [Twin](/javascript/api/azure-iot-device/twin) object.

For example:

```javascript
client.getTwin(function(err, twin))
if (err)
    console.error('could not get twin');
```

### Update reported device twin properties

Use [update](/javascript/api/azure-iothub/twin?#azure-iothub-twin-update) to update device reported properties. Include a JSON-formatted patch as the first parameter and function execution status callback method as the second parameter to the method.

In this example, a JSON-formatted device twin patch is stored in the `patch` variable. The patch contains a device twin `connectivity` update value of `cellular`. The patch and error handler are passed to the `update` method. If there's an error, a console error message is displayed.

```javascript
var patch = {
    connectivity: {
        type: 'cellular'
    }
}
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

The Azure IoT SDK for Node.js contains two device twin samples:

* [Simple sample device twin](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/simple_sample_device_twin.js)

* [Simple sample device twin with SAS](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/simple_sample_device_with_sas.js)

## Create a backend application

A backend application connects to a device through IoT Hub and can read device reported and desired properties, write device desired properties, and run device queries.

This section describes how to create a backend application that:

* Retrieves and updates a device twin
* Creates a device twin query

### Install service SDK package

Run this command to install **azure-iothub** on your development machine:

```cmd/sh
npm install azure-iothub --save
```

The [Registry](/javascript/api/azure-iothub/registry) class exposes all methods required to interact with device twins from a backend application.

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Use [fromConnectionString](/javascript/api/azure-iothub/registry?#azure-iothub-registry-fromconnectionstring) to connect to IoT hub. Your application needs the **service connect** permission to modify desired properties of a device twin, and it needs **registry read** permission to query the identity registry. There is no default shared access policy that contains only these two permissions, so you need to create one if a one does not already exist. Supply this shared access policy connection string as a parameter to `fromConnectionString`. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

```javascript
'use strict';
var iothub = require('azure-iothub');
var connectionString = '{Shared access policy connection string}';
var registry = iothub.Registry.fromConnectionString(connectionString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-node](iot-hub-howto-connect-service-iothub-entra-node.md)]

### Retrieve and update a device twin

You can create a patch that contains tag and desired property updates for a device twin.

To update a device twin:

1. Call [getTwin](/javascript/api/azure-iothub/registry?#azure-iothub-registry-gettwin-1) to retrieve the device twin object.
* Format a patch that contains the device twin update. The patch is formatted in JSON as described in [Twin class](/javascript/api/azure-iothub/twin?#azure-iothub-twin-update-1). A backend service patch can contain tag and desired property updates. For more patch format information, see [Tags and properties format](/azure/iot-hub/iot-hub-devguide-device-twins#tags-and-properties-format).

1. Call [update](/javascript/api/azure-iothub/twin?#azure-iothub-twin-update-1) to update the device twin with the patch.

In this example, the device twin is retrieved for `myDeviceId`, then a patch is applied to the twins that contains `location` tag update of `region: 'US', plant: 'Redmond43'`.

```javascript
     registry.getTwin('myDeviceId', function(err, twin){
         if (err) {
             console.error(err.constructor.name + ': ' + err.message);
         } else {
             var patch = {
                 tags: {
                     location: {
                         region: 'US',
                         plant: 'Redmond43'
                   }
                 }
             };

             twin.update(patch, function(err) {
               if (err) {
                 console.error('Could not update twin: ' + err.constructor.name + ': ' + err.message);
               } else {
                 console.log(twin.deviceId + ' twin updated successfully');
                 queryTwins();
               }
             });
         }
     });
```

### Create a device twin query

You can create SQL-like device queries to gather information from device twins.

Use [createQuery](/javascript/api/azure-iothub/registry?#azure-iothub-registry-createquery) to create a query that can be run on an IoT hub instance to find information about devices or jobs.

`createQuery` includes two parameters:

* **sqlQuery** - The query written as an SQL string.
* **pageSize** - The desired number of results per page (optional. default: 1000, max: 10000).

If the **pageSize** parameter is specified, the query object contains a `hasMoreResults` boolean property that you can check and use the `nextAsTwin` method to get the next twin results page as many times as needed to retrieve all results. A method called `next` is available for results that are not device twins, for example, the results of aggregation queries.

This example query selects only the device twins of devices located in the `Redmond43` plant.

```javascript
var queryTwins = function() {
var query = registry.createQuery("SELECT * FROM devices WHERE tags.location.plant = 'Redmond43'", 100);
query.nextAsTwin(function(err, results) {
    if (err) {
        console.error('Failed to fetch the results: ' + err.message);
    } else {
        console.log("Devices in Redmond43: " + results.map(function(twin) {return twin.deviceId}).join(','));
    }
});
```

This example query refines the first query to select only the devices that are also connected through cellular network.

```javascript
query = registry.createQuery("SELECT * FROM devices WHERE tags.location.plant = 'Redmond43' AND properties.reported.connectivity.type = 'cellular'", 100);
query.nextAsTwin(function(err, results) {
    if (err) {
        console.error('Failed to fetch the results: ' + err.message);
    } else {
        console.log("Devices in Redmond43 using cellular network: " + results.map(function(twin) {return twin.deviceId}).join(','));
    }
});
};
```

### Service SDK sample

The Azure IoT SDK for Node.js provides a working sample of a service app that handles device twin tasks. For more information, see [Device Twin Backend Service](https://github.com/Azure/azure-iot-sdk-node/tree/main/device/samples/helpers/device-twin-service) - This project is used to send device twin patch updates for a specific device.
