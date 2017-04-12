---
title: Device firmware update with Azure IoT Hub (Node) | Microsoft Docs
description: How to use device management on Azure IoT Hub to initiate a device firmware update. You use the Azure IoT SDKs for Node.js to implement a simulated device app and a service app that triggers the firmware update.
services: iot-hub
documentationcenter: .net
author: juanjperez
manager: timlt
editor: ''

ms.assetid: 70b84258-bc9f-43b1-b7cf-de1bb715f2cf
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/06/2017
ms.author: juanpere

---
# Use device management to initiate a device firmware update (Node/Node)
[!INCLUDE [iot-hub-selector-firmware-update](../../includes/iot-hub-selector-firmware-update.md)]

## Introduction
In the [Get started with device management][lnk-dm-getstarted] tutorial, you saw how to use the [device twin][lnk-devtwin] and [direct methods][lnk-c2dmethod] primitives to remotely reboot a device. This tutorial uses the same IoT Hub primitives and provides guidance and shows you how to do an end-to-end simulated firmware update.  This pattern is used in the firmware update implementation for the Intel Edison device sample.

This tutorial shows you how to:

* Create a Node.js console app that calls the firmwareUpdate direct method in the simulated device app through your IoT hub.
* Create a simulated device app that implements a **firmwareUpdate** direct method. This method initiates a multi-stage process that waits to download the firmware image, downloads the firmware image, and finally applies the firmware image. During each stage of the update, the device uses the reported properties to report on progress.

At the end of this tutorial, you have two Node.js console apps:

**dmpatterns_fwupdate_service.js**, which calls a direct method in the simulated device app, displays the response, and periodically (every 500ms) displays the updated reported properties.

**dmpatterns_fwupdate_device.js**, which connects to your IoT hub with the device identity created earlier, receives a firmwareUpdate direct method, runs through a multi-state process to simulate a firmware update including: waiting for the image download, downloading the new image, and finally applying the image.

To complete this tutorial, you need the following:

* Node.js version 0.12.x or later, <br/>  [Prepare your development environment][lnk-dev-setup] describes how to install Node.js for this tutorial on either Windows or Linux.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

Follow the [Get started with device management](iot-hub-node-node-device-management-get-started.md) article to create your IoT hub and get your IoT Hub connection string.

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity](../../includes/iot-hub-get-started-create-device-identity.md)]

## Trigger a remote firmware update on the device using a direct method
In this section, you create a Node.js console app that initiates a remote firmware update on a device. The app uses a direct method to initiate the update and uses device twin queries to periodically get the status of the active firmware update.

1. Create an empty folder called **triggerfwupdateondevice**.  In the **triggerfwupdateondevice** folder, create a package.json file using the following command at your command prompt.  Accept all the defaults:
   
    ```
    npm init
    ```
2. At your command prompt in the **triggerfwupdateondevice** folder, run the following command to install the **azure-iot-hub** and **azure-iot-device-mqtt** Device SDK packages:
   
    ```
    npm install azure-iothub --save
    ```
3. Using a text editor, create a **dmpatterns_getstarted_service.js** file in the **triggerfwupdateondevice** folder.
4. Add the following 'require' statements at the start of the **dmpatterns_getstarted_service.js** file:
   
    ```
    'use strict';
   
    var Registry = require('azure-iothub').Registry;
    var Client = require('azure-iothub').Client;
    ```
5. Add the following variable declarations and replace the placeholder values:
   
    ```
    var connectionString = '{device_connectionstring}';
    var registry = Registry.fromConnectionString(connectionString);
    var client = Client.fromConnectionString(connectionString);
    var deviceToUpdate = 'myDeviceId';
    ```
6. Add the following function to find and display the value of the firmwareUpdate reported property.
   
    ```
    var queryTwinFWUpdateReported = function() {
        registry.getTwin(deviceToUpdate, function(err, twin){
            if (err) {
              console.error('Could not query twins: ' + err.constructor.name + ': ' + err.message);
            } else {
              console.log((JSON.stringify(twin.properties.reported.iothubDM.firmwareUpdate)) + "\n");
            }
        });
    };
    ```
7. Add the following function to invoke the firmwareUpdate method to reboot the target device:
   
    ```
    var startFirmwareUpdateDevice = function() {
      var params = {
          fwPackageUri: 'https://secureurl'
      };
   
      var methodName = "firmwareUpdate";
      var payloadData =  JSON.stringify(params);
   
      var methodParams = {
        methodName: methodName,
        payload: payloadData,
        timeoutInSeconds: 30
      };
   
      client.invokeDeviceMethod(deviceToUpdate, methodParams, function(err, result) {
        if (err) {
          console.error('Could not start the firmware update on the device: ' + err.message)
        } 
      });
    };
    ```
8. Finally, Add the following function to code to start the firmware update sequence and start periodically showing the reported properties:
   
    ```
    startFirmwareUpdateDevice();
    setInterval(queryTwinFWUpdateReported, 500);
    ```
9. Save and close the **dmpatterns_fwupdate_service.js** file.

[!INCLUDE [iot-hub-device-firmware-update](../../includes/iot-hub-device-firmware-update.md)]

## Run the apps
You are now ready to run the apps.

1. At the command prompt in the **manageddevice** folder, run the following command to begin listening for the reboot direct method.
   
    ```
    node dmpatterns_fwupdate_device.js
    ```
2. At the command prompt in the **triggerfwupdateondevice** folder, run the following command to trigger the remote reboot and query for the device twin to find the last reboot time.
   
    ```
    node dmpatterns_fwupdate_service.js
    ```
3. You see the device response to the direct method in the console.

## Next steps
In this tutorial, you used a direct method to trigger a remote firmware update on a device and used the reported properties to follow the progress of the firmware update.

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

[lnk-devtwin]: iot-hub-devguide-device-twins.md
[lnk-c2dmethod]: iot-hub-devguide-direct-methods.md
[lnk-dm-getstarted]: iot-hub-node-node-device-management-get-started.md
[lnk-tutorial-jobs]: iot-hub-node-node-schedule-jobs.md

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdk-node/tree/master/doc/node-devbox-setup.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
