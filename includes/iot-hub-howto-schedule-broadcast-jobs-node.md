---
title: Schedule and broadcast jobs (Node.js)
titleSuffix: Azure IoT Hub
description: How to use the Azure IoT SDK for Node.js to create backend service application code for job scheduling.
author: kgremban
ms.author: kgremban
ms.service: azure-iot-hub
ms.devlang: nodejs
ms.topic: include
ms.date: 1/7/2025
ms.custom: [amqp, mqtt, devx-track-js]
---

  *  Requires Node.js version 10.0.x or later

## Overview

This article describes how to use the [Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) to create backend service application code for job scheduling.

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

In this article, you create a back-end service that schedules a job to invoke a direct method on a device, schedules a job to update the device twin, and monitors the progress of each job. To perform these operations, your service needs the **registry read** and **registry write permissions**. By default, every IoT hub is created with a shared access policy named **registryReadWrite** that grants these permissions.

For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

```javascript
'use strict';
var JobClient = require('azure-iothub').JobClient;
var connectionString = '{Shared access policy connection string}';
var jobClient = JobClient.fromConnectionString(connectionString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-node](iot-hub-howto-connect-service-iothub-entra-node.md)]

### Create a device method update job

Use [scheduleDeviceMethod](/javascript/api/azure-iothub/jobclient?#azure-iothub-jobclient-scheduledevicemethod) to create a new device method job to run a device method on one or multiple devices.

This example schedules a device method call job for a specific job ID.

```javascript
var methodParams = {
    methodName: 'lockDoor',
    payload: null,
    responseTimeoutInSeconds: 15 // Timeout after 15 seconds if device is unable to process method
};

var methodJobId = uuid.v4();
console.log('scheduling Device Method job with id: ' + methodJobId);
jobClient.scheduleDeviceMethod(methodJobId,
                            queryCondition,
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

### Schedule a device twin update job

Use [scheduleTwinUpdate](/javascript/api/azure-iothub/jobclient?#azure-iothub-jobclient-scheduletwinupdate) to create a new job to run a device twin update on one or multiple devices.

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

var twinJobId = uuid.v4();

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

Use [getJob](/javascript/api/azure-iothub/jobclient?#azure-iothub-jobclient-getjob) to monitor a job status.

This example checks the job status for a specific job ID periodically until the job is complete or failed.

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

The Azure IoT SDK for Node.js provides a working sample of a service app that handles job scheduling tasks. For more information, see [Job client E2E test](https://github.com/Azure/azure-iot-sdk-node/blob/a85e280350a12954f46672761b0b516d08d374b5/e2etests/test/job_client.js)
