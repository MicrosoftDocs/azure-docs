<properties
 pageTitle="Get started with device management | Microsoft Azure"
 description="This tutorial shows you how to get started with device management on Azure IoT Hub"
 services="iot-hub"
 documentationCenter=".net"
 authors="juanjperez"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/30/2016" 
 ms.author="juanpere"/>

# Tutorial: Get started with device management (preview)

## Introduction
IoT cloud applications can use primitives in Azure IoT Hub, namely the device twin and direct methods, to remotely start and monitor device management actions on devices.  This article provides guidance and code for how an IoT cloud application and a device work together to initiate and monitor a remote device reboot using IoT Hub.

To remotely start and monitor device management actions on your devices from a cloud-based, back-end app, use Azure IoT Hub primitives such as [device twin][lnk-devtwin] and [cloud-to-device (C2D) methods][lnk-c2dmethod]. This tutorial shows you how a back-end app and a device can work together to enable you initiate and monitor remote device reboot from IoT Hub.

You use a C2D method to initiate device management actions (such as reboot, factory reset, and firmware update) from a back-end app in the cloud. The device is responsible for:

- Handling the method request sent from IoT Hub.
- Initiating the corresponding device specific action on the device.
- Providing status updates through the device twin reported properties to IoT Hub.

You can use a back-end app in the cloud to run device twin queries to report on the progress of your device management actions.

This tutorial shows you how to:

- Use the Azure portal to create an IoT Hub and create a device identity in your IoT hub.
- Create a simulated device that has a direct method which enables reboot which can be called by the cloud.
- Create a console application that calls the reboot direct method on the simulated device via your IoT hub.

At the end of this tutorial, you have two Node.js console applications:

**dmpatterns_getstarted_device.js**, which connects to your IoT hub with the device identity created earlier, receives a reboot direct method, simulates a physical reboot, and reports the time for the last reboot.

**dmpatterns_getstarted_service.js**, which calls a direct method on the simulated device, displays the response, and displays the updated device twin reported properties.

To complete this tutorial, you need the following:

Node.js version 0.12.x or later, <br/>  [Prepare your development environment][lnk-dev-setup] describes how to install Node.js for this tutorial on either Windows or Linux.

An active Azure account. (If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].)

[AZURE.INCLUDE [iot-hub-get-started-create-hub-pp](../../includes/iot-hub-get-started-create-hub-pp.md)]

## Create a simulated device app

In this section, you create a Node.js console app that responds to a direct method called by the cloud, which triggers a simulated device reboot and uses the device twin reported properties to enable device twin queries to identify devices and when they last rebooted.

1. Create a new empty folder called **manageddevice**.  In the **manageddevice** folder, create a package.json file using the following command at your command-prompt.  Accept all the defaults:

    ```
    npm init
    ```
    
2. At your command-prompt in the **manageddevice** folder, run the following command to install the **azure-iot-device@dtpreview** Device SDK package and **azure-iot-device-mqtt@dtpreview** package:

    ```
    npm install azure-iot-device@dtpreview azure-iot-device-mqtt@dtpreview --save
    ```

3. Using a text editor, create a new **dmpatterns_getstarted_device.js** file in the **manageddevice** folder.

4. Add the following 'require' statements at the start of the **dmpatterns_getstarted_device.js** file:

    ```
    'use strict';

    var Client = require('azure-iot-device').Client;
    var Protocol = require('azure-iot-device-mqtt').Mqtt;
    ```

5. Add a **connectionString** variable and use it to create a device client.  Replace the connection string with your device connection string.  

    ```
    var connectionString = 'HostName={youriothostname};DeviceId=myDeviceId;SharedAccessKey={yourdevicekey}';
    var client = Client.fromConnectionString(connectionString, Protocol);
    ```

6. Add the following function to implement the direct method on the device

    ```
    var onReboot = function(request, response) {
        
        // Respond the cloud app for the direct method
        response.send(200, 'Reboot started', function(err) {
            if (!err) {
                console.error('An error occured when sending a method response:\n' + err.toString());
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

7. Open the connection to your IoT hub and start the direct method listener:

    ```
    client.open(function(err) {
        if (err) {
            console.error('Could not open IotHub client');
        }  else {
            console.log('Client opened.  Waiting for reboot method.');
            client.onDeviceMethod('reboot', onReboot);
        }
    });
    ```
    
8. Save and close the **dmpatterns_getstarted_device.js** file.

 [AZURE.NOTE] To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].

## Trigger a remote reboot on the device using a direct method 

In this section, you create a Node.js console app that initiates a remote reboot on a device using a direct method and uses device twin queries to find the last reboot time for that device.

1. Create a new empty folder called **triggerrebootondevice**.  In the **triggerrebootondevice** folder, create a package.json file using the following command at your command-prompt.  Accept all the defaults:

    ```
    npm init
    ```
    
2. At your command-prompt in the **triggerrebootondevice** folder, run the following command to install the **azure-iothub@dtpreview** Device SDK package and **azure-iot-device-mqtt@dtpreview** package:

    ```
    npm install azure-iothub@dtpreview --save
    ```
    
3. Using a text editor, create a new **dmpatterns_getstarted_service.js** file in the **triggerrebootondevice** folder.

4. Add the following 'require' statements at the start of the **dmpatterns_getstarted_service.js** file:

    ```
    'use strict';

    var Registry = require('azure-iothub').Registry;
    var Client = require('azure-iothub').Client;
    ```

5. Add the following variable declarations and replace the placeholder values:

    ```
    var connectionString = '{iothubconnectionstring}';
    var registry = Registry.fromConnectionString(connectionString);
    var client = Client.fromConnectionString(connectionString);
    var deviceToReboot = 'myDeviceId';
    ```
    
6. Add the following function to invoke the device method to reboot the target device:

    ```
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

7. Add the following function to query for the device and get the last reboot time:

    ```
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
    
8. Add the following code to call the functions that will trigger the reboot direct method and query for the last reboot time:

    ```
    startRebootDevice();
    setInterval(queryTwinLastReboot, 2000);
    ```
    
9. Save and close the **dmpatterns_getstarted_service.js** file.

## Run the applications

You are now ready to run the applications.

1. At the command-prompt in the **manageddevice** folder, run the following command to begin listening for the reboot direct method.

    ```
    node dmpatterns_getstarted_device.js
    ```

2. At the command-prompt in the **triggerrebootondevice** folder, run the following command to trigger the remote reboot and query for the device twin to find the last reboot time.

    ```
    node dmpatterns_getstarted_service.js
    ```

3. You will see the react to the direct method by printing out the message

## Customize and extend the device management actions

Your IoT solutions can expand the defined set of device management patterns or enable custom patterns through the use of the device twin and C2D method primitives. Other examples of device management actions include factory reset, firmware update, software update, power management, network and connectivity management, and data encryption.

## Device maintenance windows

Typically, you configure devices to perform actions at a time that minimizes interruptions and downtime.  Device maintenance windows are a commonly used pattern to define the time when a device should update its configuration. Your back-end solutions can use the desired properties of the device twin to define and activate a policy on your device that enables a maintenance window. When a device receives the maintenance window policy, it can use the reported property of the device twin to report the status of the policy. The back-end app can then use device twin queries to attest to compliance of devices and each policy.

## Next steps

In this tutorial, you used a direct method to trigger a remote reboot on a device, used the device twin reported properties to report the last reboot time from the device, and queried for the device twin to discover the last reboot time of the device from the cloud.

To continue getting started with IoT Hub and device management patterns such as remote over the air firmware update, see:

[Tutorial: How to do a firmware update][lnk-fwupdate]

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

To continue getting started with IoT Hub, see [Getting started with the Gateway SDK][lnk-gateway-SDK].


<!-- images and links -->
[img-output]: media/iot-hub-get-started-with-dm/image6.png
[img-dm-ui]: media/iot-hub-get-started-with-dm/dmui.png

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/get_started/node-devbox-setup.md

[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-fwupdate]: iot-hub-firmware-update.md
[Azure portal]: https://portal.azure.com/
[Using resource groups to manage your Azure resources]: ../azure-portal/resource-group-portal.md
[lnk-dm-github]: https://github.com/Azure/azure-iot-device-management
[lnk-tutorial-jobs]: iot-hub-schedule-jobs.md
[lnk-gateway-SDK]: iot-hub-linux-gateway-sdk-get-started.md

[lnk-devtwin]: iot-hub-devguide-device-twins.md
[lnk-c2dmethod]: iot-hub-devguide-direct-methods.md
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx