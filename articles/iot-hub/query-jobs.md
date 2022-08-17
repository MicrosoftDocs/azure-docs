---
title: Query on jobs with the Azure IoT Hub query language | Microsoft Docs
description: Developer guide - retrieve information about jobs from your IoT hub using the queries.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 08/12/2022
ms.author: kgremban
---

## Queries for IoT Hub jobs

[Jobs](iot-hub-devguide-jobs.md) provide a way to execute operations on sets of devices. Each device twin contains the information of the jobs of which it is part in a collection called **jobs**.

```json
{
    "deviceId": "myDeviceId",
    "etag": "AAAAAAAAAAc=",
    "tags": {
        ...
    },
    "properties": {
        ...
    },
    "jobs": [
        {
            "deviceId": "myDeviceId",
            "jobId": "myJobId",
            "jobType": "scheduleTwinUpdate",
            "status": "completed",
            "startTimeUtc": "2016-09-29T18:18:52.7418462",
            "endTimeUtc": "2016-09-29T18:20:52.7418462",
            "createdDateTimeUtc": "2016-09-29T18:18:56.7787107Z",
            "lastUpdatedDateTimeUtc": "2016-09-29T18:18:56.8894408Z",
            "outcome": {
                "deviceMethodResponse": null
            }
        },
        ...
    ]
}
```

Currently, this collection is queryable as **devices.jobs** in the IoT Hub query language.

> [!IMPORTANT]
> Currently, the jobs property is never returned when querying device twins. That is, queries that contain `FROM devices`. The jobs property can only be accessed directly with queries using `FROM devices.jobs`.

For example, the following query returns all jobs (past and scheduled) that affect a single device:

```sql
SELECT * FROM devices.jobs
  WHERE devices.jobs.deviceId = 'myDeviceId'
```

Note how this query provides the device-specific status (and possibly the direct method response) of each job returned.

It is also possible to filter with arbitrary Boolean conditions on all object properties in the **devices.jobs** collection.

For example, the following query retrieves all completed device twin update jobs that were created after September 2016 for a specific device:

```sql
SELECT * FROM devices.jobs
  WHERE devices.jobs.deviceId = 'myDeviceId'
    AND devices.jobs.jobType = 'scheduleTwinUpdate'
    AND devices.jobs.status = 'completed'
    AND devices.jobs.createdTimeUtc > '2016-09-01'
```

You can also retrieve the per-device outcomes of a single job.

```sql
SELECT * FROM devices.jobs
  WHERE devices.jobs.jobId = 'myJobId'
```

### Jobs query limitations

Query expressions can have a maximum length of 8192 characters.

Currently, queries on **devices.jobs** do not support:

* Projections, therefore only `SELECT *` is possible.
* Conditions that refer to the device twin in addition to job properties (see the preceding section).
* Performing aggregations, such as count, avg, group by.