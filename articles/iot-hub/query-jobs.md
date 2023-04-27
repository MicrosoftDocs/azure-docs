---
title: Run queries on Azure IoT Hub jobs
description: This article describes how to retrieve information about device jobs from your Azure IoT hub using the query language.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 09/29/2022
---

# Queries for IoT Hub jobs

[Jobs](iot-hub-devguide-jobs.md) provide a way to execute operations on sets of devices. Each device twin contains the information of the jobs that target it in a collection called **jobs**.  IoT Hub enables you to query jobs as a single JSON document containing all twin information.

Here's a sample IoT hub device twin that is part of a job called **myJobId**:

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
            "jobType": "scheduleUpdateTwin",
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
> Currently, the jobs property is not returned when querying device twins. That is, queries that contain `FROM devices`. The jobs property can only be accessed directly with queries using `FROM devices.jobs`.

For example, the following query returns all jobs (past and scheduled) that affect a single device:

```sql
SELECT * FROM devices.jobs
  WHERE devices.jobs.deviceId = 'myDeviceId'
```

Note how this query provides the device-specific status (and possibly the direct method response) of each job returned.

It's also possible to filter with arbitrary Boolean conditions on all object properties in the **devices.jobs** collection.

For example, the following query retrieves all completed device twin update jobs that were created after September 2016 for a specific device:

```sql
SELECT * FROM devices.jobs
  WHERE devices.jobs.deviceId = 'myDeviceId'
    AND devices.jobs.jobType = 'scheduleUpdateTwin'
    AND devices.jobs.status = 'completed'
    AND devices.jobs.createdTimeUtc > '2016-09-01'
```

You can also retrieve the per-device outcomes of a single job.

```sql
SELECT * FROM devices.jobs
  WHERE devices.jobs.jobId = 'myJobId'
```

## Jobs query limitations

Query expressions can have a maximum length of 8192 characters.

Currently, queries on **devices.jobs** don't support:

* Projections, therefore only `SELECT *` is possible.
* Conditions that refer to the device twin in addition to job properties (see the preceding section).
* Aggregations, such as count, avg, and group by.

## Next steps

* Understand the basics of the [IoT Hub query language](iot-hub-devguide-query-language.md)
