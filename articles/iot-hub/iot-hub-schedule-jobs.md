<properties
 pageTitle="How to schedule jobs | Microsoft Azure"
 description="This tutorial shows you how to schedule jobs"
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

# Tutorial: Schedule and broadcast jobs (preview)

## Introduction
Azure IoT Hub is a fully managed service that enables an application back end to create and track jobs that schedule and update millions of devices.  Jobs can be used for the following actions:

- Update device twin desired properties
- Update device twin tags
- Invoke cloud-to-device methods

Conceptually, a job wraps one of these actions and tracks the progress of execution against a set of devices, which is defined by a twin query.  For example, using a job an application back end can invoke a reboot method on 10,000 devices, specified by a twin query and scheduled at a future time.  That application can then track progress as each of those devices receive and execute the reboot method.

Learn more about each of these capabilities in these articles:

- Device twin and properties: [Get started with twin][lnk-get-started-twin] and [Tutorial: How to use twin properties][lnk-twin-props]
- Cloud-to-device methods: [Developer guide - direct methods][lnk-dev-methods] and [Tutorial: C2D methods][lnk-c2d-methods]

This tutorial shows you how to:

- Create a simulated device that has a direct method which enables lockDoor which can be called by the application back end.
- Create a console application that calls the lockDoor direct method on the simulated device using a job and updates the twin desired properties using a device job.

At the end of this tutorial, you have two Node.js console applications:

**simDevice.js**, which connects to your IoT hub with the device identity and receives a lockDoor direct method.

**scheduleJobService.js**, which calls a direct method on the simulated device  and update the twin's disired properties using a job.

To complete this tutorial, you need the following:

Node.js version 0.12.x or later, <br/>  [Prepare your development environment][lnk-dev-setup] describes how to install Node.js for this tutorial on either Windows or Linux.

An active Azure account. (If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].)

[AZURE.INCLUDE [iot-hub-get-started-create-hub-pp](../../includes/iot-hub-get-started-create-hub-pp.md)]

## Create a simulated device app

In this section, you create a Node.js console app that responds to a direct method called by the cloud, which triggers a simulated device reboot and uses the device twin reported properties to enable device twin queries to identify devices and when they last rebooted.

1. Create a new empty folder called **simDevice**.  In the **simDevice** folder, create a package.json file using the following command at your command-prompt.  Accept all the defaults:

    ```
    npm init
    ```
    
2. At your command-prompt in the **simDevice** folder, run the following command to install the **azure-iot-device** Device SDK package and **azure-iot-device-mqtt** package:

    ```
    npm install azure-iot-device azure-iot-device-mqtt --save
    ```

3. Using a text editor, create a new **simDevice.js** file in the **simDevice** folder.

4. Add the following 'require' statements at the start of the **simDevice.js** file:

    ```
    'use strict';

    var Client = require('azure-iot-device').Client;
    var Protocol = require('azure-iot-device-mqtt').Mqtt;
    ```

5. Add a **connectionString** variable and use it to create a device client.  

    ```
    var connectionString = 'HostName={youriothostname};DeviceId={yourdeviceid};SharedAccessKey={yourdevicekey}';
    var client = Client.fromConnectionString(connectionString, Protocol);
    ```

6. Add the following function to handle the lockDoor method.

    ```
    var onLockDoor = function(request, response) {
        
        // Respond the cloud app for the direct method
        response.end(200, function(err) {
            if (!!err) {
                console.error('An error occured when sending a method response:\n' + err.toString());
            } else {
                console.error('Response to method \'' + request.methodName + '\' sent successfully.');
            }
        });
        
        console.log('Locking Door!');
    };
    ```

7. Add the following code to register the handler for the lockDoor method.

    ```
    client.open(function(err) {
        if (err) {
            console.error('Could not connect to IotHub client.');
        }  else {
            console.log('Client connected to IoT Hub.  Waiting for reboot direct method.');
            client.onDeviceMethod('lockDoor', onLockDoor);
        }
    });
    ```
    
8. Save and close the **simDevice.js** file.

> [AZURE.NOTE] To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].

## Schedule jobs for calling a direct method and updating a twin's properties

In this section, you create a Node.js console app that initiates a remote lockDoor on a device using a direct method and update the twin's properties.

1. Create a new empty folder called **scheduleJobService**.  In the **scheduleJobService** folder, create a package.json file using the following command at your command-prompt.  Accept all the defaults:

    ```
    npm init
    ```
    
2. At your command-prompt in the **scheduleJobService** folder, run the following command to install the **azure-iothub** Device SDK package and **azure-iot-device-mqtt** package:

    ```
    npm install azure-iot-hub --save
    ```
    
3. Using a text editor, create a new **scheduleJobService.js** file in the **scheduleJobService** folder.

4. Add the following 'require' statements at the start of the **dmpatterns_gscheduleJobServiceetstarted_service.js** file:

    ```
    'use strict';

    var uuid = require('uuid');
    var JobClient = require('azure-iothub').JobClient;
    ```

5. Add the following variable declarations and replace the placeholder values:

    ```
    var connectionString = '{iothubconnectionstring}';
    var startTime = new Date();
    var maxExecutionTimeInSeconds =  3600;
    var jobClient = JobClient.fromConnectionString(connectionString);
    ```
    
6. Add the following function that will be used to monitor the execution of the job:

    ```
    function monitorJob (jobId, callback) {
        var jobMonitorInterval = setInterval(function() {
            jobClient.getJob(jobId, function(err, result) {
            if (err) {
                console.error('Could not get job status: ' + err.message);
            } else {
                console.log('Job: ' + jobId + ' - status: ' + result.status);
                if (result.status === 'completed' || result.status === 'failed' || result.status === 'cancelled') {
                clearInterval(jobMonitorInterval);
                callback(null, result);
                }
            }
            });
        }, 5000);
    }
    ```

7. Add the following code to schedule the job that calls the device method:

    ```
    var methodParams = {
        methodName: 'lockDoor',
        payload: null,
        timeoutInSeconds: 45
    };

    var methodJobId = uuid.v4();
    console.log('scheduling Device Method job with id: ' + methodJobId);
    jobClient.scheduleDeviceMethod(methodJobId,
                                'SELECT * FROM devices',
                                methodParams,
                                startTime,
                                maxExecutionTimeInSeconds,
                                function(err) {
        if (err) {
            console.error('Could not schedule device method job: ' + err.message);
        } else {
            monitorJob(methodJobId, function(err, result) {
                if (err) {
                    console.error('Could not monitor device method job: ' + err.message);
                } else {
                    console.log(JSON.stringify(result, null, 2));
                }
            });
        }
    });
    ```
        
8. Add the following code to schedule the job to update the twin:

    ```
    var twinPatch = {
        etag: '*',
        desired: {
            building: '43',
            floor: 3
        }
    };

    var twinJobId = uuid.v4();

    console.log('scheduling Twin Update job with id: ' + twinJobId);
    jobClient.scheduleTwinUpdate(twinJobId,
                                'SELECT * FROM devices',
                                twinPatch,
                                startTime,
                                maxExecutionTimeInSeconds,
                                function(err) {
        if (err) {
            console.error('Could not schedule twin update job: ' + err.message);
        } else {
            monitorJob(twinJobId, function(err, result) {
                if (err) {
                    console.error('Could not monitor twin update job: ' + err.message);
                } else {
                    console.log(JSON.stringify(result, null, 2));
                }
            });
        }
    });
    ```
    
9. Save and close the **scheduleJobService.js** file.

## Run the applications

You are now ready to run the applications.

1. At the command-prompt in the **simDevice** folder, run the following command to begin listening for the reboot direct method.

    ```
    node simDevice.js
    ```

2. At the command-prompt in the **scheduleJobService** folder, run the following command to trigger the remote reboot and query for the device twin to find the last reboot time.

    ```
    node scheduleJobService.js
    ```

3. You will see the output from both device and back end applications.


## Next steps

In this tutorial, you used a job to schedule a direct method to a device and the update of the device twin's properties.

To continue getting started with IoT Hub and device management patterns such as remote over the air firmware update, see:

[Tutorial: How to do a firmware update][lnk-fwupdate]

To continue getting started with IoT Hub, see [Getting started with the Gateway SDK][lnk-gateway-SDK].

[lnk-get-started-twin]: iot-hub-node-node-twin-getstarted.md
[lnk-twin-props]: iot-hub-node-node-twin-how-to-configure.md
[lnk-c2d-methods]: iot-hub-c2d-methods.md
[lnk-dev-methods]: iot-hub-devguide-direct-methods.md
[lnk-fwupdate]: iot-hub-firmware-update.md
[lnk-gateway-SDK]: iot-hub-linux-gateway-sdk-get-started.md
[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/get_started/node-devbox-setup.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx