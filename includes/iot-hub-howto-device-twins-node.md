---
title: Get started with Azure IoT Hub device twins (Node.js)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub device twins and the Azure IoT SDKs for Node.js to create and simulate devices, add tags to device twins, and execute IoT Hub queries. 
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: nodejs
ms.topic: include
ms.date: 07/20/2024
ms.custom: mqtt, devx-track-js
---

## Create a device application

Device applications can read and write twin reported properties, and be notified of desired twin property changes that have been set by a backend application or IoT Hub.

This section describes how to use the [azure-iot-device](/javascript/api/azure-iot-device) package in the Azure IoT SDK for Node.js to create a device application to:

* Retrieve a device twin and examine reported properties
* Update reported device twin properties
* Receive notice of desired property changes

### Install SDK packages

Run these command to install the **azure-iot-device** device SDK, the **azure-iot-device-mqtt** on your development machine:

```cmd/sh
npm init --yes
npm install azure-iot-device azure-iot-device-mqtt --save
```

The [azure-iot-device](/javascript/api/azure-iot-device) package contains objects that interface with IoT devices. The [Twin](/javascript/api/azure-iot-device/twin) class includes twin-specific objects. This section describes `Client` class code that is used to read and write device twin data.

### Create modules

Create Client and Protocol modules using the installed packages.

```javascript
const Client = require('azure-iot-device').Client;
const Protocol = require('azure-iot-device-mqtt').Mqtt;
```

### Choose a transport protocol

The `Client` object supports these protocols:

* `Amqp`
* `Http` - When using `Http`, the `Client` instance checks for messages from IoT Hub infrequently (a minimum of every 25 minutes).
* `Mqtt`
* `MqttWs`
* `AmqpWs`

For more information about the differences between MQTT, AMQP, and HTTPS support, see [Cloud-to-device communications guidance](../articles/iot-hub/iot-hub-devguide-c2d-guidance.md) and [Choose a communication protocol](../articles/iot-hub/iot-hub-devguide-protocols.md).

This example assigns the AMQP protocol to a `Protocol` variable.

```javascript
const Protocol = require('azure-iot-device-mqtt').Amqp;
```

### Add the IoT Hub string and transport protocol

Call [fromConnectionString](/javascript/api/azure-iot-device/client?#azure-iot-device-client-fromconnectionstring) to establish a device-to-IoT hub connection using these parameters:

* **connStr** - A connection string which encapsulates "device connect" permissions for an IoT hub. The connection string contains Hostname, Device ID & Shared Access Key in this format:
"HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>". See the prerequisites section for how to look up the device primary connection string.
* **transportCtor** - The transport protocol.

```javascript
const Protocol = require('azure-iot-device-mqtt').Amqp;
let client = Client.fromConnectionString(deviceConnectionString, Protocol);
```

### Open the connection to IoT Hub

Use the [open](/javascript/api/azure-iot-device/client?#azure-iot-device-client-open) method to open a connection between an IoT device and IoT Hub.
Use `.catch(err)` to catch an error and call handler code.

For example:

```javascript
client.open()  //open the connection
.catch((err) => {
  console.error('Could not connect: ' + err.message);
});
```

### Retrieve a device twin and examine reported properties

Call [getTwin](/javascript/api/azure-iot-device/client?#azure-iot-device-client-gettwin-1) to assign the twin object. This object can be used to read device twin information.

For example:

```javascript
client.getTwin(function(err, twin) {
if (err)
    console.error('could not get twin');
```

### Update reported device twin properties

Use [update](/javascript/api/azure-iothub/twin?#azure-iothub-twin-update) to update device reported properties. Include a JSON-formatted patch as the first parameter and callback method as the second parameter to the method.

In this example, a JSON-formatted device twin patch is stored in the `patch` variable. The patch contains a device twin `connectivity` update value of `cellular`. The patch and error handler are passed to the `update` method. If there is an error, a console error message is displayed.

```javascript
var patch = {
    connectivity: {
        type: 'cellular'
    }
}
twin.properties.reported.update(patch, function(err) {
    if (err) {
        console.error('could not update twin');
    } else {
        console.log('twin state reported');
        process.exit();
    }
});
```

### Receive notice of desired property changes

You can create a desired property update event listener that executes when a desired property is changed in the device by passing the callback handler method name to [twin.on](/javascript/api/azure-iot-device/twin?#azure-iot-device-twin-on).

The desired property event listener can take one of the following forms:

#### Receive all patches with a single event handler

You can create code to receive any desired property change.

This code will output any properties that are received from the service.

```javascript
twin.on('properties.desired', function (delta) {
    console.log('new desired properties received:');
    console.log(JSON.stringify(delta));
});
```

#### Receive an event if anything changes under a properties grouping

You can create code to receive an event if anything under a property grouping changes.

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

1. This code sets up a desired properties change event listener that triggers for any changes within the `properties.desired.climate` property grouping. If there is a desired property change within this group, min and max temperature change messages will be displayed to the console:

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

In this example, a backend application applies this desired property patch:

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

The listener triggers only when the `fanOn` property changes:

```javascript
twin.on('properties.desired.climate.hvac.systemControl', function (fanOn) {
    console.log('setting fan state to ' + fanOn);
});
```

### SDK samples

The SDK contains two device twin samples:

* [Simple sample device twin](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/simple_sample_device_twin.js)

* [Simple sample device twin with SAS](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/simple_sample_device_with_sas.js)

## Create a backend application

A backend application:

* Connects to a device through IoT Hub
* Can read device reported and desired properties, write device desired properties, and run device queries

This section describes how to create a backend application that:

* Retrieve and update a device twin
* Create a device twin query

### Install service SDK packages

Run these command to install **azure-iothub** on your development machine:

```cmd/sh
npm init --yes
npm install azure-iothub --save
```

The [Registry](/javascript/api/azure-iothub/registry?#azure-iothub-registry-gettwin-1) object exposes all methods required to interact with device twins from a backend application.

### Connect to IoT hub

Use [fromConnectionString](/javascript/api/azure-iothub/registry?#azure-iothub-registry-fromconnectionstring) to connect to IoT hub. As a parameter, supply the IoT Hub service connection string that you created in the Prerequisites section.

```javascript
'use strict';
var iothub = require('azure-iothub');
var connectionString = '{iot Hub service connection string}';
var registry = iothub.Registry.fromConnectionString(connectionString);
```

### Retrieve and update a device twin

You can create a patch that contains tag and desired property updates for a device twin.

To update a device twin:

* Use [getTwin](/javascript/api/azure-iothub/registry?#azure-iothub-registry-gettwin-1) to retrieve the device twin object.
* Format a patch that contains the device twin update. The patch is formatted in JSON as described in [Twin class](/javascript/api/azure-iothub/twin?#azure-iothub-twin-update-1). A backend service patch can contain tag and desired property updates. For more patch format information, see [Tags and properties format](/azure/iot-hub/iot-hub-devguide-device-twins#tags-and-properties-format).

* Use [update](/javascript/api/azure-iothub/twin?#azure-iothub-twin-update-1) to update the device twin with the patch.

In this example, the the device twin is retrieved for `myDeviceId`, then a patch is applied to the twins that contains `location` tag update of `region: 'US', plant: 'Redmond43'`.

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

When the code creates the query object, it specifies the maximum number of returned documents in the second parameter. The query object contains a `hasMoreResults` boolean property that you can use to invoke the `nextAsTwin` methods multiple times to retrieve all results. A method called `next` is available for results that are not device twins, for example, the results of aggregation queries.

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
