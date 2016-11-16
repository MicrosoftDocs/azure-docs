---
title: How to do a firmware update | Microsoft Docs
description: This tutorial shows you how to do a firmware update
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
ms.date: 09/30/2016
ms.author: juanpere

---
# Tutorial: How to do a firmware update (preview)
[!INCLUDE [iot-hub-selector-firmware-update](../../includes/iot-hub-selector-firmware-update.md)]

## Introduction
In the [Get started with device management][lnk-dm-getstarted] tutorial, you saw how to use the [device twin][lnk-devtwin] and [cloud-to-device (C2D) methods][lnk-c2dmethod] primitives to remotely reboot a device. This tutorial uses the same IoT Hub primitives and provides guidance and shows you how to do an end-to-end simulated firmware update.  This pattern is used in the firmware update implementation for the Intel Edison device sample.

This tutorial shows you how to:

* Create a console application that calls the firmwareUpdate direct method on the simulated device via your IoT hub.
* Create a simulated device that implements a firmwareUpdate direct method which goes through a multi-stage process that waits to download the firmware image, downloads the firmware image, and finally applies th firmware image.  Throughout executing each stage the device uses the device twin reported properties to update progress.

At the end of this tutorial, you have a Node.js console applications for the device side and a .NET (C#) console application for the service side:

**dmpatterns_fwupdate_service.js**, which calls a direct method on the simulated device, displays the response, and periodically (every 500ms) displays the updated device twin reported properties.

**TriggerFWUpdate**, which connects to your IoT hub with the device identity created earlier, receives a firmwareUpdate direct method, runs through a multi-state process to simulate a firmware update including: waiting for the image download, downloading the new image, and finally applying the image.

To complete this tutorial, you need the following:

* Microsoft Visual Studio 2015.
* Node.js version 0.12.x or later, <br/>  [Prepare your development environment][lnk-dev-setup] describes how to install Node.js for this tutorial on either Windows or Linux.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

Follow the [Get started with device management](iot-hub-device-management-get-started.md) article to create your IoT hub and get your connection string.

[!INCLUDE [iot-hub-get-started-create-hub-pp](../../includes/iot-hub-get-started-create-hub-pp.md)]

## Trigger a remote firmware update on the device using a direct method
In this section, you create a .NET console app (using C#) that initiates a remote firmware update on a device using a direct method and uses device twin queries to periodically get the status of the active firmware update on that  device.

1. In Visual Studio, add a Visual C# Windows Classic Desktop project to the current solution by using the **Console Application** project template. Name the project **TriggerFWUpdate**.

    ![New Visual C# Windows Classic Desktop project][img-createapp]

2. In Solution Explorer, right-click the **TriggerFWUpdate** project, and then click **Manage Nuget Packages**.
3. In the **Nuget Package Manager** window, select **Browse**, search for **microsoft.azure.devices**, select **Install** to install the **Microsoft.Azure.Devices** package, and accept the terms of use. This procedure downloads, installs, and adds a reference to the [Microsoft Azure IoT Service SDK][lnk-nuget-service-sdk] Nuget package and its dependencies.

    ![Nuget Package Manager window][img-servicenuget]
4. Add the following `using` statements at the top of the **Program.cs** file:
   
        using Microsoft.Azure.Devices;
        
5. Add the following fields to the **Program** class. Replace the placeholder value with the connection string for the IoT hub that you created in the previous section.
   
        static RegistryManager registryManager;
        static string connString = "{iot hub connection string}";
        static ServiceClient client;
        static JobClient jobClient;
        static string targetDevice = "{deviceIdForTargetDevice}";
        
6. Add the following method to the **Program** class:
   
        public static async Task QueryTwinFWUpdateReported()
        {
            Twin twin = await registryManager.GetTwinAsync(targetDevice);
            Console.WriteLine(twin.Properties.Reported.ToJson());
        }
        
7. Add the following method to the **Program** class:

        public static async Task StartFirmwareUpdate()
        {
            client = ServiceClient.CreateFromConnectionString(connString);
            CloudToDeviceMethod method = new CloudToDeviceMethod("firmwareUpdate");
            method.ResponseTimeout = TimeSpan.FromSeconds(30);
            method.SetPayloadJson(
                @"{
                    fwPackageUri : 'https://someurl'
                }");

            CloudToDeviceMethodResult result = await client.InvokeDeviceMethodAsync(targetDevice, method);

            Console.WriteLine("Invoked firmware update on device.");
        }

7. Finally, add the following lines to the **Main** method:
   
        registryManager = RegistryManager.CreateFromConnectionString(connString);
        StartFirmwareUpdate().Wait();
        QueryTwinFWUpdateReported().Wait();
        Console.WriteLine("Press ENTER to exit.");
        Console.ReadLine();
        
8. Build the solution.

## Create a simulated device app
In this section, you create a Node.js console app that responds to a direct method called by the cloud, which triggers a simulated device firmware update and uses the device twin reported properties to enable device twin queries to identify devices and when they last rebooted.

1. Create a new empty folder called **manageddevice**.  In the **manageddevice** folder, create a package.json file using the following command at your command-prompt.  Accept all the defaults:
   
    ```
    npm init
    ```
2. At your command-prompt in the **manageddevice** folder, run the following command to install the **azure-iot-device@dtpreview** Device SDK package and **azure-iot-device-mqtt@dtpreview** package:
   
    ```
    npm install azure-iot-device@dtpreview azure-iot-device-mqtt@dtpreview --save
    ```
3. Using a text editor, create a new **dmpatterns_fwupdate_device.js** file in the **manageddevice** folder.
4. Add the following 'require' statements at the start of the **dmpatterns_fwupdate_device.js** file:
   
    ```
    'use strict';
   
    var Client = require('azure-iot-device').Client;
    var Protocol = require('azure-iot-device-mqtt').Mqtt;
    ```
5. Add a **connectionString** variable and use it to create a device client.  
   
    ```
    var connectionString = 'HostName={youriothostname};DeviceId=myDeviceId;SharedAccessKey={yourdevicekey}';
    var client = Client.fromConnectionString(connectionString, Protocol);
    ```
6. Add the following function which will be used to update device twin reported properties
   
    ```
    var reportFWUpdateThroughTwin = function(twin, firmwareUpdateValue) {
      var patch = {
          iothubDM : {
            firmwareUpdate : firmwareUpdateValue
          }
      };
   
      twin.properties.reported.update(patch, function(err) {
        if (err) throw err;
        console.log('twin state reported')
      });
    };
    ```
7. Add the following functions which will simulate the download and apply of the firmware image.
   
    ```
    var simulateDownloadImage = function(imageUrl, callback) {
      var error = null;
      var image = "[fake image data]";
   
      console.log("Downloading image from " + imageUrl);
   
      callback(error, image);
    }
   
    var simulateApplyImage = function(imageData, callback) {
      var error = null;
   
      if (!imageData) {
        error = {message: 'Apply image failed because of missing image data.'};
      }
   
      callback(error);
    }
    ```
8. Add the following function which will update the firmware update status through the device twin reported properties to waiting to download.  Typically, devices are informed of an avaiable update and an administrator defined policy causes the device to start downloading and applying the update.  This is where the logic to enable that policy would run.  For simplicity, we're delaying for 4 seconds and proceeding to download the firmware image. 
   
    ```
    var waitToDownload = function(twin, fwPackageUriVal, callback) {
      var now = new Date();
   
      reportFWUpdateThroughTwin(twin, {
        fwPackageUri: fwPackageUriVal,
        status: 'waiting',
        error : null,
        startedWaitingTime : now.toISOString()
      });
      setTimeout(callback, 4000);
    };
    ```
9. Add the following function which will update the firmware update status through the device twin reported properties to downloading the firmware image.  It follows up by simulating a firmware download and finally updates the firmware update status to inform of either a download success or failure.
   
    ```
    var downloadImage = function(twin, fwPackageUriVal, callback) {
      var now = new Date();   
   
      reportFWUpdateThroughTwin(twin, {
        status: 'downloading',
      });
   
      setTimeout(function() {
        // Simulate download
        simulateDownloadImage(fwPackageUriVal, function(err, image) {
   
          if (err)
          {
            reportFWUpdateThroughTwin(twin, {
              status: 'downloadfailed',
              error: {
                code: error_code,
                message: error_message,
              }
            });
          }
          else {        
            reportFWUpdateThroughTwin(twin, {
              status: 'downloadComplete',
              downloadCompleteTime: now.toISOString(),
            });
   
            setTimeout(function() { callback(image); }, 4000);   
          }
        });
   
      }, 4000);
    }
    ```
10. Add the following function which will update the firmware update status through the device twin reported properties to applying the firmware image.  It follows up by simulating a applying of the firmware image and finally updates the firmware update status to inform of either a apply success or failure.
    
    ```
    var applyImage = function(twin, imageData, callback) {
      var now = new Date();   
    
      reportFWUpdateThroughTwin(twin, {
        status: 'applying',
        startedApplyingImage : now.toISOString()
      });
    
      setTimeout(function() {
    
        // Simulate apply firmware image
        simulateApplyImage(imageData, function(err) {
          if (err) {
            reportFWUpdateThroughTwin(twin, {
              status: 'applyFailed',
              error: {
                code: err.error_code,
                message: err.error_message,
              }
            });
          } else { 
            reportFWUpdateThroughTwin(twin, {
              status: 'applyComplete',
              lastFirmwareUpdate: now.toISOString()
            });    
    
          }
        });
    
        setTimeout(callback, 4000);
    
      }, 4000);
    }
    ```
11. Add the following functoin which handle the firmwareUpdate method and initiate the multi-stage firmware update process.
    
    ```
    var onFirmwareUpdate = function(request, response) {
    
      // Respond the cloud app for the direct method
      response.send(200, 'FirmwareUpdate started', function(err) {
        if (!err) {
          console.error('An error occured when sending a method response:\n' + err.toString());
        } else {
          console.log('Response to method \'' + request.methodName + '\' sent successfully.');
        }
      });
    
      // Get the parameter from the body of the method request
      var fwPackageUri = JSON.parse(request.payload).fwPackageUri;
    
      // Obtain the device twin
      client.getTwin(function(err, twin) {
        if (err) {
          console.error('Could not get device twin.');
        } else {
          console.log('Device twin acquired.');
    
          // Start the multi-stage firmware update
          waitToDownload(twin, fwPackageUri, function() {
            downloadImage(twin, fwPackageUri, function(imageData) {
              applyImage(twin, imageData, function() {});    
            });  
          });
    
        }
      });
    }
    ```
12. Finally, add the following code which connects to IoT hub as a device, 
    
    ```
    client.open(function(err) {
      if (err) {
        console.error('Could not connect to IotHub client');
      }  else {
        console.log('Client connected to IoT Hub.  Waiting for firmwareUpdate direct method.');
      }
    
      client.onDeviceMethod('firmwareUpdate', onFirmwareUpdate(request, response));
    });
    ```

> [!NOTE]
> To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].
> 
> 

## Run the applications
You are now ready to run the applications.

1. At the command-prompt in the **manageddevice** folder, run the following command to begin listening for the reboot direct method.
   
    ```
    node dmpatterns_fwupdate_device.js
    ```
2. Run the C# console app **TriggerFWUpdate**- right click on the **TriggerFWUpdate** project, select **Debug** and **Start new instance**.

3. You will see the react to the direct method by printing out the message

## Next steps
In this tutorial, you used a direct method to trigger a remote firmware update on a device and periodically used the device twin reported properties to understand the progress of the firmware update process.  

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

<!-- images -->
[img-servicenuget]: media/iot-hub-csharp-node-firmware-update/servicesdknuget.png
[img-createapp]: media/iot-hub-csharp-node-firmware-update/createnetapp.png

[lnk-devtwin]: iot-hub-devguide-device-twins.md
[lnk-c2dmethod]: iot-hub-devguide-direct-methods.md
[lnk-dm-getstarted]: iot-hub-device-management-get-started.md
[lnk-tutorial-jobs]: iot-hub-schedule-jobs.md

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/get_started/node-devbox-setup.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
