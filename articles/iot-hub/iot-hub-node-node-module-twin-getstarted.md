---
title: Get started with Azure IoT Hub module identity and module twin (Node.js) | Microsoft Docs
description: Learn how to create module identity and update module twin using IoT SDKs for Node.js.
author: chrissie926
manager: 
ms.service: iot-hub
services: iot-hub
ms.devlang: node
ms.topic: conceptual
ms.date: 04/26/2018
ms.author: menchi
---

# Get started with IoT Hub module identity and module twin using Node.js back end and Node.js device

> [!NOTE]
> [Module identities and module twins](iot-hub-devguide-module-twins.md) are similar to Azure IoT Hub device identity and device twin, but provide finer granularity. While Azure IoT Hub device identity and device twin enable the back-end application to configure a device and provides visibility on the device’s conditions, a module identity and module twin provide these capabilities for individual components of a device. On capable devices with multiple components, such as operating system based devices or firmware devices, it allows for isolated configuration and conditions for each component.

At the end of this tutorial, you have two Node.js apps:

* **CreateIdentities**, which creates a device identity, a module identity and associated security key to connect your device and module clients.
* **UpdateModuleTwinReportedProperties**, which sends updated module twin reported properties to your IoT Hub.

> [!NOTE]
> For information about the Azure IoT SDKs that you can use to build both applications to run on devices, and your solution back end, see [Azure IoT SDKs][lnk-hub-sdks].

To complete this tutorial, you need the following:

* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)
* An IoT Hub.
* Install the latest [Node.js SDK](https://github.com/Azure/azure-iot-sdk-node).


You have now created your IoT hub, and you have the host name and IoT Hub connection string that you need to complete the rest of this tutorial.

## Create a device identity and a module identity in IoT Hub

In this section, you create a Node.js app that creates a device identity and a module identity in the identity registry in your IoT hub. A device or module cannot connect to IoT hub unless it has an entry in the identity registry. For more information, see the "Identity registry" section of the [IoT Hub developer guide][lnk-devguide-identity]. When you run this console app, it generates a unique ID and key for both device and module. Your device and module use these values to identify itself when it sends device-to-cloud messages to IoT Hub. The IDs are case-sensitive.

1. 	Create a directory to hold your code.
2. Inside of that directory, first run **npm init -y** to create an empty package.json with defaults. This is the project file for your code.
3. Run **npm install -S azure-iothub@modules-preview** to install the service SDK inside the **node_modules** subdirectory. 

    > [!NOTE] 
    > The subdirectory name node_modules uses the word module to mean "a node library". The term here has nothing to do with IoT Hub modules.

4. Create the following .js file in your directory. Call it **add.js**. Copy and paste your hub connection string and hub name.

    ```javascript
    var Registry = require('azure-iothub').Registry;
    var uuid = require('uuid');
    // Copy/paste your connection string and hub name here
    var serviceConnectionString = '<hub connection string from portal>';
    var hubName = '<hub name>.azure-devices.net';
    // Create an instance of the IoTHub registry
    var registry = Registry.fromConnectionString(serviceConnectionString);
    // Insert your device ID and moduleId here.
    var deviceId = 'myFirstDevice';
    var moduleId = 'myFirstModule';
    // Create your device as a SAS authentication device
    var primaryKey = new Buffer(uuid.v4()).toString('base64');
    var secondaryKey = new Buffer(uuid.v4()).toString('base64');
    var deviceDescription = {
      deviceId: deviceId,
      status: 'enabled',
      authentication: {
        type: 'sas',
        symmetricKey: {
          primaryKey: primaryKey,
          secondaryKey: secondaryKey
        }
      }
    };

    // First, create a device identity
    registry.create(deviceDescription, function(err) {
      if (err) {
        console.log('Error creating device identity: ' + err);
        process.exit(1);
      }
      console.log('device connection string = "HostName=' + hubName + ';DeviceId=' + deviceId + ';SharedAccessKey=' + primaryKey + '"');

    // Then add a module to that device
      registry.addModule({ deviceId: deviceId, moduleId: moduleId }, function(err) {
        if (err) {
          console.log('Error creating module identity: ' + err);
          process.exit(1);
        }

    // Finally, retrieve the module details from the hub so we can construct the connection string
        registry.getModule(deviceId, moduleId, function(err, foundModule) {
          if (err) {
            console.log('Error getting module back from hub: ' + err);
            process.exit(1);
          }
          console.log('module connection string = "HostName=' + hubName + ';DeviceId=' + foundModule.deviceId + ';ModuleId='+foundModule.moduleId+';SharedAccessKey=' + foundModule.authentication.symmetricKey.primaryKey + '"');
          process.exit(0);
        });
      });
    });

    ```

This app creates a device identity with ID **myFirstDevice** and a module identity with ID **myFirstModule** under device **myFirstDevice**. (If that module ID already exists in the identity registry, the code simply retrieves the existing module information.) The app then displays the primary key for that identity. You use this key in the simulated module app to connect to your IoT hub.

5. Run this using node add.js. It will give you a connection string for your device identity and another one for your module identity.

    > [!NOTE]
    > The IoT Hub identity registry only stores device and module identities to enable secure access to the IoT hub. The identity registry stores device IDs and keys to use as security credentials. The identity registry also stores an enabled/disabled flag for each device that you can use to disable access for that device. If your application needs to store other device-specific metadata, it should use an application-specific store. There is no enabled/disabled flag for module identities. For more information, see [IoT Hub developer guide][lnk-devguide-identity].

## Update the module twin using Node.js device SDK

In this section, you create a Node.js app on your simulated device that updates the module twin reported properties.

1. **Get your module connection string** -- now if you login to [Azure portal][lnk-portal]. Navigate to your IoT Hub and click IoT Devices. Find myFirstDevice, open it and you see myFirstModule was successfuly created. Copy the module connection string. It is needed in the next step.

    ![Azure portal module detail][15]

2. Similar to you did in the step above, create a directory for your device code and use NPM to initialize it and install the device SDK (**npm install -S azure-iot-device-amqp@modules-preview**).

    > [!NOTE]
    > The npm install command may feel slow. Be patient, it's pulling down lots of code from the package repository.

    > [!NOTE] 
    > If you see an error that says npm ERR! registry error parsing json, this is safe to ignore. If you see an error that says npm ERR! registry error parsing json, this is safe to ignore.

3. Create a file called twin.js. Copy and paste your module identity string.

    ```javascript
    var Client = require('azure-iot-device').Client;
    var Protocol = require('azure-iot-device-amqp').Amqp;
    // Copy/paste your module connection string here.
    var connectionString = '<insert module connection string here>';
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
            temperature: 72,
            humidity: 17
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

2. Now, run this using the command **node twin.js**.

    ```
    F:\temp\module_twin>node twin.js
    client opened
    twin contents:
    { reported: { update: [Function: update], '$version': 1 },
      desired: { '$version': 1 } }
    new desired properties received:
    {"$version":1}
    twin state reported
    ```

## Next steps

To continue getting started with IoT Hub and to explore other IoT scenarios, see:

* [Getting started with device management][lnk-device-management]
* [Getting started with IoT Edge][lnk-iot-edge]


<!-- Images. -->
[15]: ./media\iot-hub-csharp-csharp-module-twin-getstarted/module-detail.JPG
<!-- Links -->
[lnk-hub-sdks]: iot-hub-devguide-sdks.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-portal]: https://portal.azure.com/

[lnk-device-management]: iot-hub-node-node-device-management-get-started.md
[lnk-iot-edge]: ../iot-edge/tutorial-simulate-device-linux.md
[lnk-devguide-identity]: iot-hub-devguide-identity-registry.md
[lnk-nuget-service-sdk]: https://www.nuget.org/packages/Microsoft.Azure.Devices/