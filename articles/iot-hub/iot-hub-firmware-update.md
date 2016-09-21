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
In the [Get started with device management][lnk-dm-getstarted] tutorial, you saw how to use the [device twin][lnk-devtwin] and [cloud-to-device (C2D) methods][lnk-c2dmethod] primitives to remotely reboot a device. This tutorial uses the same IoT Hub primitives and provides guidance and shows you how to do an end-to-end simulated firmware update.  This pattern is used in the firmware update implementation for the Intel Edison device sample. [Link to Edison doc/sample]  

## Add the IoT back-end code

Using the same IoT Hub connection string from the [getting started with device management tutorial][lnk-dm-getstarted], you can now create code for the back-end app that initiates the firmware update.

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

    var createFWUpdateReported = function(twin) {
        return 'FWUpdate reported: ' + JSON.stringify(twin.properties.reported.iothubDM.firmwareUpdate);
    };

    var queryTwinFWUpdateReported = function() {
        registry.findTwins("SELECT * FROM devices WHERE deviceId = 'deviceId'", function(err, queryResult) {
            if (err) {
            console.error('Could not query twins: ' + err.constructor.name + ': ' + err.message);
            } else {
            console.log(createFWUpdateReported(queryResult.result[0]));
            }
        });
    };
     
    var startFirmwareUpdateDevice = function(twin) {
        var params = {
            fwPackageUri: 'https://secureurl'
        };
        client.c2dmethod('ihdmFirmwareUpdate', params, function(err) {
            if (err) {
            console.error('Could not start the firmware update on the device: '+ err.constructor.name + ': ' + err.message)
            } 
        });
    };

    registry.getDeviceTwin('deviceId', function(err, twin) {
      if (err) {
        console.error(err.constructor.name + ': ' + err.message);
      } else {
        startFirmwareUpdateDevice();
        setInterval(queryTwinFWUpdateReported, 1000);
    });  

    ```
    
4. Run the code. Since the device is not running, you see the firmware update C2D method fails and the **firmwareUpdate** reported property is empty.
    ```
    node serviceApp.js
    ```

## Add the IoT device code

The steps below show you how to create the device code that handles the firmware update C2D method and reports progress through device twin reported properties. The device code implements a finite state machine to handle this flow:

- Prepare to download the image.
- Download the image.
- Apply the image.  

Within these states there can be several failure conditions that must be handled and reported through the device twin.

[AZURE.NOTE] For this tutorial, you run this code on your development machine rather than on a device to make it easy to test.
 
1. Use npm to add the Azure IoT SDK

    ```
    npm install azure-iothub
    ```
    
2. Create deviceApp.js and copy/paste the following code.

```
var Client = require('azure-iot-device').Client;
var Protocol = require('azure-iot-device-mqtt').Mqtt;
var time = require('time');
var StateMachine = require('javascript-state-machine');

var imageData = null;

var reportFWUpdateThroughTwin = function(firmwareUpdateValue) {
  var patch = {
    reported : {
      iothubDM : {
        firmwareUpdate : firmwareUpdateValue,
      }
    }
  };

  client.reportTwinState(patch, function(err) {
    if (err) throw err;
    console.log('twin state reported')
  });
};

var simulateDownloadImage = function(imageUrl, callback) {
  var error = null;
  
  console.log("Downloading image from " + imageUrl);
  
  callback(error);
}

var simulateApplyImage = function(imageData, callback) {
  var error = null;
  
  if (!imageData) {
    error = {message: 'Apply image failed because of missing image data.'};
  }
  
  callback(error);
}

var fsm = StateMachine.create({
  initial: 'idle',
  events: [
    {name: 'waitToDownload', from: 'idle', to: 'waiting'},
    {name: 'downloadImage', from: 'waiting', to: 'downloading'},
    {name: 'applyImage', from: 'downloading', to: 'idle'},

  ],
  callbacks: {
    onwaitToDownload: 
      function(event, from, to, fwPackageUriVal) { 
        reportFWUpdateThroughTwin({
          fwPackageUri: fwPackageUriVal,
          status: 'waiting',
          error : null,
        });
        setTimeout(function() {}, 3000);
      },
    
    ondownloadImage: 
      function(event, from, to, fwPackageUriVal) { 
        reportFWUpdateThroughTwin({
          status: 'downloading',
        });
        
        setTimeout(function() {}, 3000);
        
        // Simulate download
        simulateDownloadImage(fwPackageUriVal, function(err, image) {
          var now = new time.Date(); 
          
          if (err)
          {
            reportFWUpdateThroughTwin({
              staus: 'downloadfailed',
              error: {
                code: error_code,
                message: error_message,
              }
            });
          }
          else {
            imageData = image;
            
            reportFWUpdateThroughTwin({
              status: 'downloadComplete',
              downloadCompleteTime: now.time,
            });
          }
          
          fsm.transition();
        });
        
        return StateMachine.ASYNC;
      },
    
    onapplyImage: 
      function(event, from, to, fwPackageUriVal) { 
        reportFWUpdateThroughTwin({
          status: 'applying',
        })
        
        setTimeout(function() {}, 3000);
        
        // Simulate apply firmware image
        simulateApplyImage(imageData, function(err) {
          
          if (err) {
            reportFWUpdateThroughTwin({
              status: 'applyFailed',
              error: {
                code: err.error_code,
                message: err.error_message,
              }
            });
          } else {
            var now = new time.Date(); 
            reportFWUpdateThroughTwin({
              status: 'applyComplete',
              lastFirmwareUpdate: now.time
            });    
            
          }
        })
      },
    
      
    
  }
})

var connectionString = '[IoT device connection string]';
var client = Client.fromConnectionString(connectionString, Protocol);

client.open(function(err) {
  if (err) {
    console.error('could not open IotHub client');
  }  else {
    console.log('client opened');
  }
  
  client.on('ihdmFirmwareUpdate', function(params) {
      fsm.waitToDownload(params.fwPackageUri);
      fsm.downloadImage(params.fwPackageUri);
      fsm.applyImage(imageData);
  });
});
```

3. Run the code to start the device.  Do not quit the running device app as the next step will require that it is running in the background.

    ```
    node deviceApp.js
    ```
    
## Trigger the end-to-end firmware update
 
Rerun the back-end app in a new shell while the device app is running in the background. 

1. Open a new shell

2. Run the back-end app to initiate the simulated firmware update and monitor the periodic reported properties

    ```
    node serviceApp.js
    ```


[lnk-devtwin]: iot-hub-devguide-device-twins.md
[lnk-c2dmethod]: iot-hub-devguide-direct-methods.md
[lnk-dm-getstarted]: iot-hub-device-management-get-started.md