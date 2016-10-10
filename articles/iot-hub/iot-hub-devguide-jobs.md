<properties
 pageTitle="Developer guide - jobs | Microsoft Azure"
 description="Azure IoT Hub developer guide - scheduling jobs to run on multiple devices connected to your hub"
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

# Schedule jobs on multiple devices (preview)

## Overview

As described by previous articles, Azure IoT Hub enables a number of building blocks ([device twin properties and tags][lnk-twin-devguide] and [cloud-to-device methods][lnk-dev-methods]).  Typically, IoT back end applications enable device administrators and operators to update and interact with IoT devices in bulk and at a scheduled time.  Jobs encapsulate the execution of device twin updates and C2D methods against a set of devices at a schedule time.  For example, an operator would use a back end application that would initiate and track a job to reboot a set of devices in building 43 and floor 3 at a time that would not be disruptive to the operations of the building.

### When to use

Consider using jobs when: a solution back end needs to schedule and track progress any of the following activities on a set of device:

- Update device twin desired properties
- Update device twin tags
- Invoke C2D methods

## Job lifecycle

Jobs are initiated by the solution back end and maintained by IoT Hub.  You can initiate a job through a service-facing URI (`{iot hub}/jobs/v2/{device id}/methods/<jobID>?api-version=2016-09-30-preview`) and query for progress on an executing job through a service-facing URI (`{iot hub}/jobs/v2/<jobId>?api-version=2016-09-30-preview`).  Once a job is initiated, querying for jobs will enable the back end application to refresh the status of running jobs.

> [AZURE.NOTE] When you initiate a job, property names and values can only contain US-ASCII printable alphanumeric, except any in the following set: ``{'$', '(', ')', '<', '>', '@', ',', ';', ':', '\', '"', '/', '[', ']', '?', '=', '{', '}', SP, HT}``.

## Reference

For all HTTP requests, see the following references:

- Query condition: [Details for querying of twins][lnk-query]
- Method details: [Details for C2D methods][lnk-dev-methods]

## Jobs to execute C2D methods

The following is the HTTP 1.1 request details for executing a C2D method on a set of devices using a job:

    ```
    PUT /jobs/v2/<jobId>?api-version=2016-09-30-preview
    
    Authorization: <config.sharedAccessSignature>
    Content-Type: application/json; charset=utf-8
    Request-Id: <guid>
    User-Agent: <sdk-name>/<sdk-version>

    {
        jobId: '<jobId>',
        type: 'scheduleDirectRequest', 
        cloudToDeviceMethod: {
            methodName: '<methodName>',
            payload: <payload>,                 
            timeoutInSeconds: methodTimeoutInSeconds 
        },
        queryCondition: '<queryOrDevices>', // if the queryOrDevices parameter is a string
        deviceIds: '<queryOrDevices>',      // if the queryOrDevices parameter is an array
        startTime: <jobStartTime>,          // as an ISO-8601 date string
        maxExecutionTimeInSeconds: <maxExecutionTimeInSeconds>        
    }
    ```
    
## Jobs to update device twin properties

The following is the HTTP 1.1 request details for updating device twin properties using a job:

    ```
    PUT /jobs/v2/<jobId>?api-version=2016-09-30-preview
    Authorization: <config.sharedAccessSignature>
    Content-Type: application/json; charset=utf-8
    Request-Id: <guid>
    User-Agent: <sdk-name>/<sdk-version>

    {
        jobId: '<jobId>',
        type: 'scheduleTwinUpdate', 
        updateTwin: <patch>                 // Valid JSON object
        queryCondition: '<queryOrDevices>', // if the queryOrDevices parameter is a string
        deviceIds: '<queryOrDevices>',      // if the queryOrDevices parameter is an array
        startTime: <jobStartTime>,          // as an ISO-8601 date string
        maxExecutionTimeInSeconds: <maxExecutionTimeInSeconds>        // format TBD
    }
    ```

## Querying for progress on jobs

The following is the HTTP 1.1 request details for querying for jobs:

    ```
    GET /jobs/v2/query?api-version=2016-09-30-preview[&jobType=<jobType>][&jobStatus=<jobStatus>][&pageSize=<pageSize>][&continuationToken=<continuationToken>]
    
    Authorization: <config.sharedAccessSignature>
    Content-Type: application/json; charset=utf-8
    Request-Id: <guid>
    User-Agent: <sdk-name>/<sdk-version>
    ```
    
The continuationToken is provided from the response.  

## Jobs Properties

The following is a list of properties and corresponding descriptions, which can be used when querying for jobs or job results.

| Property | Description |
| -------------- | -----------------|
| **jobId** | Application provided ID for the job. |
| **startTime** | Application provided start time (ISO-8601) for the job. |
| **endTime** | IoT Hub provided date (ISO-8601) for when the job completed. Valid only after the job reaches the 'completed' state. | 
| **type** | Types of jobs: |
| | **scheduledUpdateTwin**: A job used to update a set of twin desired properties or tags. |
| | **scheduledDeviceMethod**: A job used to invoke a device method on a set of twin. |
| **status** | Current state of the job. Possible values for status: |
| | **pending** : Scheduled and waiting to be picked up by the job service. |
| | **scheduled** : Scheduled for a time in the future. |
| | **running** : Currently active job. |
| | **cancelled** : Job has been cancelled. |
| | **failed** : Job failed. |
| | **completed** : Job has completed. |
| **deviceJobStatistics** | Statistics about the job's execution. |

During the preview, the deviceJobStatistics object is available only after the job is completed.

| Property | Description |
| -------------- | -----------------|
| **deviceJobStatistics.deviceCount** | Number of devices in the job. |
| **deviceJobStatistics.failedCount** | Number of devices where the job failed. |
| **deviceJobStatistics.succeededCount** | Number of devices where the job succeeded. |
| **deviceJobStatistics.runningCount** | Number of devices that are currently running the job. |
| **deviceJobStatistics.pendingCount** | Number of devices that are pending to run the job. |


### Additional reference material

Other reference topics in the Developer Guide include:

- [IoT Hub endpoints][lnk-endpoints] describes the various endpoints that each IoT hub exposes for runtime and management operations.
- [Throttling and quotas][lnk-quotas] describes the quotas that apply to the IoT Hub service and the throttling behavior to expect when you use the service.
- [IoT Hub device and service SDKs][lnk-sdks] lists the various language SDKs you an use when you develop both device and service applications that interact with IoT Hub.
- [Query language for twins, methods, and jobs][lnk-query] describes the query language you can use to retrieve information from IoT Hub about your device twins, methods and jobs.
- [IoT Hub MQTT support][lnk-devguide-mqtt] provides more information about IoT Hub support for the MQTT protocol.

## Next steps

If you would like to try out some of the concepts described in this article, you may be interested in the following IoT Hub tutorial:

- [Schedule and broadcast jobs][lnk-jobs-tutorial]

<!-- links and images -->

[lnk-endpoints]: iot-hub-devguide-endpoints.md
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md
[lnk-jobs-tutorial]: iot-hub-schedule-jobs.md
[lnk-c2d-methods]: iot-hub-c2d-methods.md
[lnk-dev-methods]: iot-hub-devguide-direct-methods.md
[lnk-get-started-twin]: iot-hub-node-node-twin-getstarted.md
[lnk-twin-devguide]: iot-hub-devguide-device-twins.md
