---
title: Understand Azure IoT Hub jobs | Microsoft Docs
description: Developer guide - scheduling jobs to run on multiple devices connected to your IoT hub. Jobs can update tags and desired properties and invoke direct methods on multiple devices.
author: robinsh
manager: philmea
ms.author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 05/06/2019
---

# Schedule jobs on multiple devices

Azure IoT Hub enables a number of building blocks like [device twin properties and tags](iot-hub-devguide-device-twins.md) and [direct methods](iot-hub-devguide-direct-methods.md). Typically, back-end apps enable device administrators and operators to update and interact with IoT devices in bulk and at a scheduled time. Jobs execute device twin updates and direct methods against a set of devices at a scheduled time. For example, an operator would use a back-end app that initiates and tracks a job to reboot a set of devices in building 43 and floor 3 at a time that would not be disruptive to the operations of the building.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

Consider using jobs when you need to schedule and track progress any of the following activities on a set of devices:

* Update desired properties
* Update tags
* Invoke direct methods

## Job lifecycle

Jobs are initiated by the solution back end and maintained by IoT Hub. You can initiate a job through a service-facing URI (`PUT https://<iot hub>/jobs/v2/<jobID>?api-version=2018-06-30`) and query for progress on an executing job through a service-facing URI (`GET https://<iot hub>/jobs/v2/<jobID?api-version=2018-06-30`). To refresh the status of running jobs once a job is initiated, run a job query.

> [!NOTE]
> When you initiate a job, property names and values can only contain US-ASCII printable alphanumeric, except any in the following set: `$ ( ) < > @ , ; : \ " / [ ] ? = { } SP HT`

## Jobs to execute direct methods

The following snippet shows the HTTPS 1.1 request details for executing a [direct method](iot-hub-devguide-direct-methods.md) on a set of devices using a job:

```
PUT /jobs/v2/<jobId>?api-version=2018-06-30

Authorization: <config.sharedAccessSignature>
Content-Type: application/json; charset=utf-8

{
    "jobId": "<jobId>",
    "type": "scheduleDeviceMethod",
    "cloudToDeviceMethod": {
        "methodName": "<methodName>",
        "payload": <payload>,
        "responseTimeoutInSeconds": methodTimeoutInSeconds
    },
    "queryCondition": "<queryOrDevices>", // query condition
    "startTime": <jobStartTime>,          // as an ISO-8601 date string
    "maxExecutionTimeInSeconds": <maxExecutionTimeInSeconds>
}
```

The query condition can also be on a single device ID or on a list of device IDs as shown in the following examples:

```
"queryCondition" = "deviceId = 'MyDevice1'"
"queryCondition" = "deviceId IN ['MyDevice1','MyDevice2']"
"queryCondition" = "deviceId IN ['MyDevice1']"
```

[IoT Hub Query Language](iot-hub-devguide-query-language.md) covers IoT Hub query language in additional detail.

The following snippet shows the request and response for a job scheduled to call a direct method named testMethod on all devices on contoso-hub-1:

```
PUT https://contoso-hub-1.azure-devices.net/jobs/v2/job01?api-version=2018-06-30 HTTP/1.1
Authorization: SharedAccessSignature sr=contoso-hub-1.azure-devices.net&sig=68iv------------------------------------v8Hxalg%3D&se=1556849884&skn=iothubowner
Content-Type: application/json; charset=utf-8
Host: contoso-hub-1.azure-devices.net
Content-Length: 317

{
    "jobId": "job01",
    "type": "scheduleDeviceMethod",
    "cloudToDeviceMethod": {
        "methodName": "testMethod",
        "payload": {},
        "responseTimeoutInSeconds": 30
    },
    "queryCondition": "*", 
    "startTime": "2019-05-04T15:53:00.077Z",
    "maxExecutionTimeInSeconds": 20
}

HTTP/1.1 200 OK
Content-Length: 65
Content-Type: application/json; charset=utf-8
Vary: Origin
Server: Microsoft-HTTPAPI/2.0
Date: Fri, 03 May 2019 01:46:18 GMT

{"jobId":"job01","type":"scheduleDeviceMethod","status":"queued"}
```

## Jobs to update device twin properties

The following snippet shows the HTTPS 1.1 request details for updating device twin properties using a job:

```
PUT /jobs/v2/<jobId>?api-version=2018-06-30

Authorization: <config.sharedAccessSignature>
Content-Type: application/json; charset=utf-8

{
    "jobId": "<jobId>",
    "type": "scheduleUpdateTwin",
    "updateTwin": <patch>                 // Valid JSON object
    "queryCondition": "<queryOrDevices>", // query condition
    "startTime": <jobStartTime>,          // as an ISO-8601 date string
    "maxExecutionTimeInSeconds": <maxExecutionTimeInSeconds>
}
```

> [!NOTE]
> The *updateTwin* property requires a valid etag match; for example, `etag="*"`.

The following snippet shows the request and response for a job scheduled to update device twin properties for test-device on contoso-hub-1:

```
PUT https://contoso-hub-1.azure-devices.net/jobs/v2/job02?api-version=2018-06-30 HTTP/1.1
Authorization: SharedAccessSignature sr=contoso-hub-1.azure-devices.net&sig=BN0U-------------------------------------RuA%3D&se=1556925787&skn=iothubowner
Content-Type: application/json; charset=utf-8
Host: contoso-hub-1.azure-devices.net
Content-Length: 339

{
    "jobId": "job02",
    "type": "scheduleUpdateTwin",
    "updateTwin": {
      "properties": {
        "desired": {
          "test1": "value1"
        }
      },
     "etag": "*"
     },
    "queryCondition": "deviceId = 'test-device'",
    "startTime": "2019-05-08T12:19:56.868Z",
    "maxExecutionTimeInSeconds": 20
}

HTTP/1.1 200 OK
Content-Length: 63
Content-Type: application/json; charset=utf-8
Vary: Origin
Server: Microsoft-HTTPAPI/2.0
Date: Fri, 03 May 2019 22:45:13 GMT

{"jobId":"job02","type":"scheduleUpdateTwin","status":"queued"}
```

## Querying for progress on jobs

The following snippet shows the HTTPS 1.1 request details for querying for jobs:

```
GET /jobs/v2/query?api-version=2018-06-30[&jobType=<jobType>][&jobStatus=<jobStatus>][&pageSize=<pageSize>][&continuationToken=<continuationToken>]

Authorization: <config.sharedAccessSignature>
Content-Type: application/json; charset=utf-8
```

The continuationToken is provided from the response.

You can query for the job execution status on each device using the [IoT Hub query language for device twins, jobs, and message routing](iot-hub-devguide-query-language.md).

## Jobs Properties

The following list shows the properties and corresponding descriptions, which can be used when querying for jobs or job results.

| Property | Description |
| --- | --- |
| **jobId** |Application provided ID for the job. |
| **startTime** |Application provided start time (ISO-8601) for the job. |
| **endTime** |IoT Hub provided date (ISO-8601) for when the job completed. Valid only after the job reaches the 'completed' state. |
| **type** |Types of jobs: |
| | **scheduleUpdateTwin**: A job used to update a set of desired properties or tags. |
| | **scheduleDeviceMethod**: A job used to invoke a device method on a set of device twins. |
| **status** |Current state of the job. Possible values for status: |
| | **pending**: Scheduled and waiting to be picked up by the job service. |
| | **scheduled**: Scheduled for a time in the future. |
| | **running**: Currently active job. |
| | **canceled**: Job has been canceled. |
| | **failed**: Job failed. |
| | **completed**: Job has completed. |
| **deviceJobStatistics** |Statistics about the job's execution. |
| | **deviceJobStatistics** properties: |
| | **deviceJobStatistics.deviceCount**: Number of devices in the job. |
| | **deviceJobStatistics.failedCount**: Number of devices where the job failed. |
| | **deviceJobStatistics.succeededCount**: Number of devices where the job succeeded. |
| | **deviceJobStatistics.runningCount**: Number of devices that are currently running the job. |
| | **deviceJobStatistics.pendingCount**: Number of devices that are pending to run the job. |

### Additional reference material

Other reference topics in the IoT Hub developer guide include:

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md) describes the various endpoints that each IoT hub exposes for run-time and management operations.

* [Throttling and quotas](iot-hub-devguide-quotas-throttling.md) describes the quotas that apply to the IoT Hub service and the throttling behavior to expect when you use the service.

* [Azure IoT device and service SDKs](iot-hub-devguide-sdks.md) lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.

* [IoT Hub query language for device twins, jobs, and message routing](iot-hub-devguide-query-language.md) describes the IoT Hub query language. Use this query language to retrieve information from IoT Hub about your device twins and jobs.

* [IoT Hub MQTT support](iot-hub-mqtt-support.md) provides more information about IoT Hub support for the MQTT protocol.

## Next steps

To try out some of the concepts described in this article, see the following IoT Hub tutorial:

* [Schedule and broadcast jobs](iot-hub-node-node-schedule-jobs.md)