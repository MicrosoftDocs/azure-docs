## Create a simulated device app
In this section, you:

* Create a Node.js console app that responds to a direct method called by the cloud
* Trigger a simulated firmware update
* Use the reported properties to enable device twin queries to identify devices and when they last completed a firmware update

Step 1: Create an empty folder called **manageddevice**.  In the **manageddevice** folder, create a package.json file using the following command at your command prompt. Accept all the defaults:
   
    ```
    npm init
    ```

Step 2: At your command prompt in the **manageddevice** folder, run the following command to install the **azure-iot-device** and **azure-iot-device-mqtt** Device SDK packages:
   
    ```
    npm install azure-iot-device azure-iot-device-mqtt --save
    ```

Step 3: Using a text editor, create a **dmpatterns_fwupdate_device.js** file in the **manageddevice** folder.

Step 4: Add the following 'require' statements at the start of the **dmpatterns_fwupdate_device.js** file:
   
    ```
    'use strict';
   
    var Client = require('azure-iot-device').Client;
    var Protocol = require('azure-iot-device-mqtt').Mqtt;
    ```
Step 5: Add a **connectionString** variable and use it to create a **Client** instance. Replace the `{yourdeviceconnectionstring}` placeholder with the connection string you previously made a note of in the "Create a device identity" section previously:
   
    ```
    var connectionString = '{yourdeviceconnectionstring}';
    var client = Client.fromConnectionString(connectionString, Protocol);
    ```

Step 6: Add the following function that is used to update reported properties:
   
    ```
    var reportFWUpdateThroughTwin = function(twin, firmwareUpdateValue) {
      var patch = {
          iothubDM : {
            firmwareUpdate : firmwareUpdateValue
          }
      };
   
      twin.properties.reported.update(patch, function(err) {
        if (err) throw err;
        console.log('twin state reported: ' + firmwareUpdateValue.status);
      });
    };
    ```

Step 7: Add the following functions that simulate downloading and applying the firmware image:
   
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

Step 8: Add the following function that updates the firmware update status through the reported properties to **waiting**. Typically, devices are informed of an available update and an administrator defined policy causes the device to start downloading and applying the update. This function is where the logic to enable that policy should run. For simplicity, the sample waits for four seconds before proceeding to download the firmware image:
   
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

Step 9: Add the following function that updates the firmware update status through the reported properties to **downloading**. The function then simulates a firmware download and finally updates the firmware update status to either **downloadFailed** or **downloadComplete**:
   
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

Step 10: Add the following function that updates the firmware update status through the reported properties to **applying**. The function then simulates applying the firmware image and finally updates the firmware update status to either **applyFailed** or **applyComplete**:
    
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

Step 11: Add the following function that handles the **firmwareUpdate** direct method and initiates the multi-stage firmware update process:
    
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
      var fwPackageUri = request.payload.fwPackageUri;
    
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

Step 12: Finally, add the following code that connects to your IoT hub:
    
    ```
    client.open(function(err) {
      if (err) {
        console.error('Could not connect to IotHub client');
      }  else {
        console.log('Client connected to IoT Hub.  Waiting for firmwareUpdate direct method.');
      }
    
      client.onDeviceMethod('firmwareUpdate', onFirmwareUpdate);
    });
    ```

> [!NOTE]
> To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in the MSDN article [Transient Fault Handling](https://msdn.microsoft.com/library/hh675232.aspx).
> 
> 