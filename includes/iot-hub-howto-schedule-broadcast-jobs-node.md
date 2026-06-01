---
title: Schedule and broadcast jobs (Node.js)
titleSuffix: Azure IoT Hub
description: How to use the Azure IoT SDK for Node.js to create backend service application code for job scheduling.
author: SoniaLopezBravo
ms.author: sonialopez
ms.service: azure-iot-hub
ms.devlang: nodejs
ms.topic: include
ms.date: 1/15/2025
ms.custom: [amqp, mqtt, devx-track-js]
---

  *  Requires Node.js version 10.0.x or later

## Overview

This article describes how to use the [Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) to create backend service application code to schedule job to invoke a direct method or perform a device twin update on one or more devices.

### Install service SDK package

Run this command to install **azure-iothub** on your development machine:

```cmd/sh
npm install azure-iothub --save
```

The [JobClient](/javascript/api/azure-iothub/jobclient) class exposes all methods required to interact with job scheduling from a backend application.

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Use [fromConnectionString](/javascript/api/azure-iothub/jobclient?#azure-iothub-jobclient-fromconnectionstring) to connect to IoT hub.

This article describes back-end code that can schedule a job to invoke a direct method, schedule a job to update a device twin, and monitors the progress of a job for one or more devices. To perform these operations, your service needs the **registry read** and **registry write permissions**. By default, every IoT hub is created with a shared access policy named **registryReadWrite** that grants these permissions.

For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

For example:

```javascript
'use strict';
var JobClient = require('azure-iothub').JobClient;
var connectionString = '{Shared access policy connection string}';
var jobClient = JobClient.fromConnectionString(connectionString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-node](iot-hub-howto-connect-service-iothub-entra-node.md)]

### Create a direct method job

Use [scheduleDeviceMethod](/javascript/api/azure-iothub/jobclient?#azure-iothub-jobclient-scheduledevicemethod) to schedule a job to run a direct method on one or multiple devices.

First, create a direct method update variable with method name, payload, and response time-out information. For example:

```javascript
var methodParams = {
    methodName: 'lockDoor',
    payload: null,
    responseTimeoutInSeconds: 15 // Time-out after 15 seconds if device is unable to process method
};
```

Then call `scheduleDeviceMethod` to schedule the direct method call job:

* Each job must have a unique job ID. You can use this job ID to monitor a job as described in the **Monitor a job** section of this article.
* Specify a `queryCondition` parameter to evaluate which devices to run the job on. For more information about query conditions, see [IoT Hub query language for device and module twins, jobs, and message routing](/azure/iot-hub/iot-hub-devguide-query-language).
* Check the `jobResult` callback for the job schedule result. If the job was successfully scheduled, you can monitor the job status as shown in the **Monitor a job** section of this article.

For example:

```javascript
var methodJobId = uuid.v4();
var queryCondition = "deviceId IN ['myDeviceId']";
var startTime = new Date();
var maxExecutionTimeInSeconds =  300;

jobClient.scheduleDeviceMethod(methodJobId,
                            queryCondition,
                            methodParams,
                            startTime,
                            maxExecutionTimeInSeconds,
                            function(err) {
    if (err) {
        console.error('Could not schedule direct method job: ' + err.message);
    } else {
        monitorJob(methodJobId, function(err, result) {
            if (err) {
                console.error('Could not monitor direct method job: ' + err.message);
            } else {
                console.log(JSON.stringify(result, null, 2));
            }
        });
    }
});
```

### Schedule a device twin update job

Use [scheduleTwinUpdate](/javascript/api/azure-iothub/jobclient?#azure-iothub-jobclient-scheduletwinupdate) to create a new job to run a device twin update on one or multiple devices.

First, create a device twin desired property update variable.

```javascript
var twinPatch = {
   etag: '*',
   properties: {
       desired: {
           building: '43',
           floor: 3
       }
   }
};
```

Then call `scheduleTwinUpdate` to schedule the device twin desired property update job:

* Each job must have a unique job ID. You can use this job ID to monitor a job as described in the **Monitor a job** section of this article.
* Specify a `queryCondition` parameter to evaluate which devices to run the job on. For more information about query conditions, see [IoT Hub query language for device and module twins, jobs, and message routing](/azure/iot-hub/iot-hub-devguide-query-language).
* Check the `jobResult` callback for the job schedule result. If the job was successfully scheduled, you can monitor the job status as shown in the **Monitor a job** section of this article.

For example:

```javascript
var twinJobId = uuid.v4();
var queryCondition = "deviceId IN ['myDeviceId']";
var startTime = new Date();
var maxExecutionTimeInSeconds =  300;

console.log('scheduling Twin Update job with id: ' + twinJobId);
jobClient.scheduleTwinUpdate(twinJobId,
                            queryCondition,
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

### Monitor a job

Use [getJob](/javascript/api/azure-iothub/jobclient?#azure-iothub-jobclient-getjob) to monitor the job status for a specific job ID.

This example function checks the job status for a specific job ID periodically until the job is complete or failed.

```javascript
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

### SDK schedule job example

The Azure IoT SDK for Node.js provides a working sample of a service app that handles job scheduling tasks. For more information, see [Job client E2E test](https://github.com/Azure/azure-iot-sdk-node/blob/a85e280350a12954f46672761b0b516d08d374b5/e2etests/test/job_client.js).
