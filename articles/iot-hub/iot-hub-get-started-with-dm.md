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

# Tutorial: Get started with device management 

## Introduction
IoT cloud applications can use primitives in Azure IoT Hub, namely the device twin and cloud-to-device (C2D) methods, to remotely start and monitor device management actions on devices.  This article provides guidance and code for how an IoT cloud application and a device work together to initiate and monitor a remote device reboot using IoT Hub.

Device management actions (such as reboot, factory reset, and firmware update) are initiated using a C2D method from an IoT cloud application to a device.  [Learn more about C2D methods].  It is the responsibility of the device to handle the method request (from the cloud), initiate the corresponding device specific action (on the device), and provide status updates through the device twin reported properties (in th cloud).

IoT cloud applications can run device twin queries to report on progress of device management actions.

## Create a device management enabled IoT Hub

First, you need to create a device management enabled IoT Hub. The following steps show you how to complete this task using the Azure portal.

1.  Sign in to the [Azure portal].
2.  In the Jumpbar, click **New**, then click **Internet of Things**, and then click **Azure IoT Hub**.

	![][img-new-hub]

3.  In the **IoT Hub** blade, choose the configuration for your IoT Hub.

	![][img-configure-hub]

  -   In the **Name** box, enter a name for your IoT Hub. If the **Name** is valid and available, a green check mark appears in the **Name** box.
  -   Select a **Pricing and scale tier**. This tutorial does not require a specific tier.
  -   In **Resource group**, create a new resource group, or select an existing one. For more information, see [Using resource groups to manage your Azure resources].
  -   Check the box to **Enable Device Management**.
  -   In **Location**, select the location to host your IoT Hub. IoT Hub device management is only available in East US, North Europe, and East Asia during public preview. In the future, it will be available in all regions.

    > [AZURE.NOTE] By checking **Enable Device Management**, you create a preview IoT Hub supported only in East US, North Europe, and East Asia and not intended for production scenarios. You cannot migrate devices into and out of device management enabled hubs.

4.  When you have chosen your IoT Hub configuration options, click **Create**. It can take a few minutes for Azure to create your IoT Hub. To check the status, you can monitor the progress on the **Startboard** or in the **Notifications** panel.

	![][img-monitor]

5.  When the IoT Hub has been created successfully, open the blade of the new IoT Hub, make a note of the **Hostname**, and then click **Shared access policies**.

	![][img-keys]

6.  Click the **iothubowner** policy, then copy and make note of the connection string in the **iothubowner** blade. Copy it to a location you can access later because you need it to complete the rest of this tutorial.

 	> [AZURE.NOTE] In production scenarios, make sure to refrain from using the **iothubowner** credentials.

	![][img-connection]

You have now created a device management enabled IoT Hub. You need the connection string to complete the rest of this tutorial.

## Register your device with IoT Hub
TODO: Use the IoT Hub explorer to register your device 

## The IoT cloud application code
With the IoT Hub connection string, we can now create our code for the IoT cloud application.

1. Open a shell

2. Use npm to add the Azure IoT SDK

    ```
    npm install azure-iothub
    ```

3. Create serviceApp.js and copy/paste the following code.

    ```
    var Registry = require('azure-iothub').Registry;
    var Client = require('azure-iothub').Client;
     
    var connectionString = '[Connection string goes here]';
    var registry = Registry.fromConnectionString(connectionString);
    var client = Client.fromConnectionString(connectionString);

    var queryTwinLastReboot = function() {
    registry.findTwins("SELECT properties.reported.iothubDM.reboot.lastReboot FROM devices WHERE deviceId = 'deviceId'", function(err, queryResult) {
        if (err) {
        console.error('Could not query twins: ' + err.constructor.name + ': ' + err.message);
        } else {
        console.log('Last reboot time: ' + queryResult.result[0])
        }
    });
    };
     
    var startRebootDevice = function(twin) {
        var params = {
        };
        client.c2dmethod('ihdmReboot', params, function(err) {
            if (err) {
            console.error('Could not initiate the firmware update on the device: '+ err.constructor.name + ': ' + err.message)
            } 
        });
    };

    registry.getDeviceTwin('deviceId', function(err, twin){
      if (err) {
        console.error(err.constructor.name + ': ' + err.message);
      } else {
        startRebootDevice();
        setInterval(queryTwinLastReboot, 1000);
    });  

    ```

4. Run the code.  Since the device is not running, you'll see the reboot C2D method fail and the Last reboot time reported in the device twin reported property empty.

    ```
    node serviceApp.js
    ```
    
## The IoT device code
The following will show the how to create the device code that handles the reboot C2D method and reports progress through device twin reported properties.

1. Use npm to add the Azure IoT SDK

    ```
    npm install azure-iothub
    ```
    
2. Create deviceApp.js and copy/paste the following code.

    ```
    var Client = require('azure-iot-device').Client;
    var Protocol = require('azure-iot-device-mqtt').Mqtt;
    var time = require('time');

    var connectionString = '[IoT device connection string]';
    var client = Client.fromConnectionString(connectionString, Protocol);

    var reportRebootThroughTwin = function() {
    var now = new time.Date();

    var patch = {
        reported : {
            iothubDM : {
                reboot : {
                lastReboot : now.time(),
                }
            }
        }
    };

    client.reportTwinState(patch, function(err) {
            if (err) throw err;
            console.log('twin state reported')
        });
    };

    var deviceSpecificPhysicalRestart = function() {
        // Add call to restart device - this is device specific
    };

    client.open(function(err) {
    if (err) {
        console.error('could not open IotHub client');
    }  else {
        console.log('client opened');
    }
    
    client.on('ihdmReboot', function(desiredChange) {
            // Report the reboot before the physical restart
            reportRebootThroughTwin();
            
            deviceSpecificPhysicalRestart();
        })
    });
    ```
    
3. Run the code to start the device.  Do not quit the running device app as the next step will require that it is running in the background.

    ```
    node deviceApp.js
    ```
    
## Rerun the IoT cloud app to trigger and end-to-end reboot
 
Rerun the service app in a new shell while the device app is running in the background. 

1. Open a new shell

2. Run the service app to initiate the remote reboot and monitor the periodic reported property after the simulated reboot.

    ```
    node serviceApp.js
    ```

## Customizing and extending the device management actions

Your IoT solutions can expand on defined defined device management patterns or enable custom patterns through the use of the IoT Hub device twin and C2D method primitives.  Some examples of other device management actions include factory reset, firmware update, software update, power management, network and connectivity management, data encryption, among others.

[Link to Olivier's Intel Edison sample that includes reboot, factory reset, and firmware update]

## Device maintenance windows

Devices are usually configured to take action at a time that minimizes interruptions and downtime.  Device maintenance windows are a commonly used pattern to define the time when a device should update configuration.  Your IoT cloud solutions can use the desired properties of the device twin to define and activate a policy on your device that enables a devices maintenance window.  Upon receiving the maintenance window policy, the device would then use the reported property of the device twin to report the status of the policy.  The IoT cloud app can then use device twin queries to attest to compliance of devices and each policy.

<!-- images and links -->
[img-new-hub]: media/iot-hub-get-started-with-dm/image1.png
[img-configure-hub]: media/iot-hub-get-started-with-dm/image2.png
[img-monitor]: media/iot-hub-get-started-with-dm/image3.png
[img-keys]: media/iot-hub-get-started-with-dm/image4.png
[img-connection]: media/iot-hub-get-started-with-dm/image5.png
[img-output]: media/iot-hub-get-started-with-dm/image6.png
[img-dm-ui]: media/iot-hub-get-started-with-dm/dmui.png

[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[Azure portal]: https://portal.azure.com/
[Using resource groups to manage your Azure resources]: ../azure-portal/resource-group-portal.md
[lnk-dm-github]: https://github.com/Azure/azure-iot-device-management
[lnk-sample-ui]: iot-hub-device-management-ui-sample.md
[lnk-gateway-SDK]: iot-hub-linux-gateway-sdk-get-started.md