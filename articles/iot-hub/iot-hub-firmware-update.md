<properties
 pageTitle="How to do a firmware update | Microsoft Azure"
 description="This tutorial shows you how to do a firmware update"
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

# Tutorial: How to do a firmware update

## Introduction
In the [Get started with device management][lnk-dm-getstarted] tutorial, you saw how to use the [device twin][lnk-devtwin] and [cloud-to-device (C2D) methods][lnk-c2dmethod] primitives to remotely reboot a device. This tutorial uses the same IoT Hub primitives and provides guidance and shows you how to do an end-to-end simulated firmware update.  This pattern is used in the firmware update implementation for the Intel Edison device sample.

This tutorial shows you how to:

- Create a console application that calls the firmwareUpdate direct method on the simulated device via your IoT hub.
- Create a simulated device that implements a firmwareUpdate direct method which goes through a multi-stage process that waits to download the firmware image, downloads the firmware image, and finally applies th firmware image.  Throughout executing each stage the device uses the twin reported properties to update progress.

At the end of this tutorial, you have two Node.js console applications:

**dmpatterns_fwupdate_service.js**, which calls a direct method on the simulated device, displays the response, and periodically (every 500ms) displays the updated device twin reported properties.

**dmpatterns_fwupdate_device.js**, which connects to your IoT hub with the device identity created earlier, receives a firmwareUpdate direct method, runs through a multi-state process to simulate a firmware update including: waiting for the image download, downloading the new image, and finally applying the image.


To complete this tutorial, you need the following:

Node.js version 0.12.x or later, <br/>  [Prepare your development environment][lnk-dev-setup] describes how to install Node.js for this tutorial on either Windows or Linux.

An active Azure account. (If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].)

Follow the [Get started with device management](iot-hub-device-management-get-started.md) article to create your IoT hub and get your connection string.

[AZURE.INCLUDE [iot-hub-get-started-create-hub-pp](../../includes/iot-hub-get-started-create-hub-pp.md)]

## Create a simulated device app

In this section, you create a Node.js console app that responds to a direct method called by the cloud, which triggers a simulated device firmware update and uses the device twin reported properties to enable device twin queries to identify devices and when they last rebooted.

1. Create a new empty folder called **manageddevice**.  In the **manageddevice** folder, create a package.json file using the following command at your command-prompt.  Accept all the defaults:

    ```
    npm init
    ```
    
2. At your command-prompt in the **manageddevice** folder, run the following command to install the **azure-iot-device** Device SDK package and **azure-iot-device-mqtt** package:

    ```
    npm install azure-iot-device azure-iot-device-mqtt --save
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

6. Add the following function which will be used to update twin reported properties

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

8. Add the following function which will update the firmware update status through the twin reported properties to waiting to download.  Typically, devices are informed of an avaiable update and an administrator defined policy causes the device to start downloading and applying the update.  This is where the logic to enable that policy would run.  For simplicity, we're delaying for 4 seconds and proceeding to download the firmware image. 

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
    
9. Add the following function which will update the firmware update status through the twin reported properties to downloading the firmware image.  It follows up by simulating a firmware download and finally updates the firmware update status to inform of either a download success or failure.

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
    
10. Add the following function which will update the firmware update status through the twin reported properties to applying the firmware image.  It follows up by simulating a applying of the firmware image and finally updates the firmware update status to inform of either a apply success or failure.

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
      
      response.write(JSON.stringify('FirmwareUpdate started'));
      
      // Respond the cloud app for the direct method
      response.end(200, function(err) {
        if (!!err) {
          console.error('An error occured when sending a method response:\n' + err.toString());
        } else {
          console.error('Response to method \'' + request.methodName + '\' sent successfully.');
        }
      });

      // Get the parameter from the body of the method request
      var fwPackageUri = JSON.parse(JSON.parse(request.body.toString())).fwPackageUri;

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

 [AZURE.NOTE] To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].

## Trigger a remote firmware update on the device using a direct method 

In this section, you create a Node.js console app that initiates a remote firmware update on a device using a direct method and uses device twin queries to periodically get the status of the active firmware update on that  device.


1. Create a new empty folder called **triggerfwupdateondevice**.  In the **triggerfwupdateondevice** folder, create a package.json file using the following command at your command-prompt.  Accept all the defaults:

    ```
    npm init
    ```
    
2. At your command-prompt in the **triggerfwupdateondevice** folder, run the following command to install the **azure-iothub** Device SDK package and **azure-iot-device-mqtt** package:

    ```
    npm install azure-iot-hub --save
    ```
    
3. Using a text editor, create a new **dmpatterns_getstarted_service.js** file in the **triggerfwupdateondevice** folder.

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

8. Finally, Add the following function to code to start the firmware update sequence and start periodically showing the twin reported properties:

    ```
    startFirmwareUpdateDevice();
    setInterval(queryTwinFWUpdateReported, 500);
    ```
    
9. Save and close the **dmpatterns_fwupdate_service.js** file.

## Run the applications

You are now ready to run the applications.

1. At the command-prompt in the **manageddevice** folder, run the following command to begin listening for the reboot direct method.

    ```
    node dmpatterns_fwupdate_device.js
    ```

2. At the command-prompt in the **triggerfwupdateondevice** folder, run the following command to trigger the remote reboot and query for the device twin to find the last reboot time.

    ```
    node dmpatterns_fwupdate_service.js
    ```

3. You will see the react to the direct method by printing out the message

## Next steps

In this tutorial, you used a direct method to trigger a remote firmware update on a device and periodically used the twin reported properties to understand the progress of the firmware update process.  

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

[lnk-devtwin]: iot-hub-devguide-device-twins.md
[lnk-c2dmethod]: iot-hub-devguide-direct-methods.md
[lnk-dm-getstarted]: iot-hub-device-management-get-started.md
[lnk-tutorial-jobs]: iot-hub-schedule-jobs.md

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/get_started/node-devbox-setup.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
