---
title: Use the REST API to manage jobs in Azure IoT Central
description: How to use the IoT Central REST API to create and manage jobs in an application to bulk manage your devices
author: dominicbetts
ms.author: dobett
ms.date: 06/14/2023
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to create and manage jobs

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to create and manage jobs in your IoT Central application. The REST API lets you:

- List jobs and view job details in your application.
- Create jobs in your application.
- Stop, resume, and rerun jobs in your application.
- Schedule jobs and view scheduled job details in your application.

Scheduled jobs are created to run at a future time. You can set a start date and time for a scheduled job to run one-time, daily, or weekly. Nonscheduled jobs run only one-time.

This article describes how to use the `/jobs/{job_id}` API to control devices in bulk. You can also control devices individually.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

To learn how to create and manage jobs in the UI, see [Manage devices in bulk in your Azure IoT Central application](howto-manage-devices-in-bulk.md).

[!INCLUDE [iot-central-postman-collection](../../../includes/iot-central-postman-collection.md)]

## Job payloads

Many of the APIs described in this article include a definition that looks like the following JSON snippet:

```json
{
  "id": "job-014",
  "displayName": "Set target temperature",
  "description": "Set target temperature for all thermostat devices",
  "group": "833d7a7d-8f99-4e04-9e56-745806bdba6e",
  "batch": {
    "type": "percentage",
    "value": 25
  },
  "cancellationThreshold": {
    "type": "percentage",
    "value": 10,
    "batch": false
  },
  "data": [
    {
      "type": "PropertyJobData",
      "target": "dtmi:modelDefinition:zomtmdxh:eqod32zbyl",
      "path": "targetTemperature",
      "value": "56"
    }
  ],
  "status": "complete"
}
```

The following table describes the fields in the previous JSON snippet:

| Field | Description |
| ----- | ----------- |
| `id` | A unique ID for the job in your application. |
| `displayName` | The display name for the job in your application. |
| `description` | A description of the job. |
| `group` | The ID of the device group that the job applies to. Use the `deviceGroups` preview REST API to get a list of the device groups in your application. |
| `status` | The [status](howto-manage-devices-in-bulk.md#view-job-status) of the job. One of `complete`, `cancelled`, `failed`, `pending`, `running`, `stopped`. |
| `batch` | If present, this section defines how to [batch](howto-manage-devices-in-bulk.md#create-and-run-a-job) the devices in the job. |
| `batch/type` | The size of each batch is either a `percentage` of the total devices in the group or a `number` of devices. |
| `batch/value` | Either the percentage of devices or the number of devices in each batch. |
| `cancellationThreshold` | If present, this section defines the [cancellation threshold](howto-manage-devices-in-bulk.md#create-and-run-a-job) for the job. |
| `cancellationThreshold/batch` | `true` or `false`. If true, the cancellation threshold is set for each batch. If `false`, the cancellation threshold applies to the whole job. |
| `cancellationThreshold/type` | The cancellation threshold for the job is either a `percentage` or a `number` of devices. |
| `cancellationThreshold/value` | Either the percentage of devices or the number of devices that define the cancellation threshold. |
| `data` | An array of operations the job performs. |
| `data/type` | One of `PropertyJobData`, `CommandJobData`, `CloudPropertyJobData`, or `DeviceTemplateMigrationJobData`. The preview version of the API includes `DeviceManifestMigrationJobData`. |
| `data/target` | The model ID of the target devices. |
| `data/path` | The name of the property, command, or cloud property. |
| `data/value` | The property value to set or the command parameter to send. |

## Get job information

Use the following request to retrieve the list of the jobs in your application:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/jobs?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "value": [
    {
      "id": "job-006",
      "displayName": "Set customer name",
      "description": "Set the customer name cloud property",
      "group": "4fcbec3b-5ee8-4324-855d-0f03b56bcf7f",
      "data": [
        {
          "type": "CloudPropertyJobData",
          "target": "dtmi:modelDefinition:bojo9tfju:yfvu5gv2vl",
          "path": "CustomerName",
          "value": "Contoso"
        }
      ],
      "status": "complete"
    },
    {
      "id": "job-005",
      "displayName": "Set target temperature",
      "description": "Set target temperature device property",
      "group": "833d7a7d-8f99-4e04-9e56-745806bdba6e",
      "data": [
        {
          "type": "PropertyJobData",
          "target": "dtmi:modelDefinition:zomtmdxh:eqod32zbyl",
          "path": "targetTemperature",
          "value": 56
        }
      ],
      "status": "complete"
    },
    {
      "id": "job-004",
      "displayName": "Run device report",
      "description": "Call command to run the device reports",
      "group": "833d7a7d-8f99-4e04-9e56-745806bdba6e",
      "batch": {
        "type": "percentage",
        "value": 25
      },
      "cancellationThreshold": {
        "type": "percentage",
        "value": 10,
        "batch": false
      },
      "data": [
        {
          "type": "CommandJobData",
          "target": "dtmi:modelDefinition:zomtmdxh:eqod32zbyl",
          "path": "getMaxMinReport",
          "value": "2021-06-15T05:00:00.000Z"
        }
      ],
      "status": "complete"
    }
  ]
}
```

Use the following request to retrieve an individual job by ID:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/jobs/job-004?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "id": "job-004",
  "displayName": "Run device report",
  "description": "Call command to run the device reports",
  "group": "833d7a7d-8f99-4e04-9e56-745806bdba6e",
  "batch": {
    "type": "percentage",
    "value": 25
  },
  "cancellationThreshold": {
    "type": "percentage",
    "value": 10,
    "batch": false
  },
  "data": [
    {
      "type": "CommandJobData",
      "target": "dtmi:modelDefinition:zomtmdxh:eqod32zbyl",
      "path": "getMaxMinReport",
      "value": "2021-06-15T05:00:00.000Z"
    }
  ],
  "status": "complete"
}
```

Use the following request to retrieve the details of the devices in a job:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/jobs/job-004/devices?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "value": [
    {
      "id": "therm-01",
      "status": "completed"
    },
    {
      "id": "therm-02",
      "status": "completed"
    },
    {
      "id": "therm-03",
      "status": "completed"
    },
    {
      "id": "therm-04",
      "status": "completed"
    }
  ]
}
```

## Create a job

Use the following request to create a job:

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/jobs/job-006?api-version=2022-07-31
```

The `group` field in the request body identifies a device group in your IoT Central application. A job uses a device group to identify the set of devices the job operates on.

If you don't already have a suitable device group, you can create one with REST API call. The following example creates a device group with `group1` as the group ID:

```http
PUT https://{your app subdomain}/api/deviceGroups/group1?api-version=2022-07-31
```

When you create a device group, you define a `filter` that selects the devices to include in the group. A filter identifies a device template and any properties to match. The following example creates device group that contains all devices associated with the "dtmi:modelDefinition:dtdlv2" device template where the `provisioned` property is `true`.

```json
{
  "displayName": "Device group 1",
  "description": "Custom device group.",
  "filter": "SELECT * FROM devices WHERE $template = \"dtmi:modelDefinition:dtdlv2\" AND $provisioned = true"
}
```

The response to this request looks like the following example:

```json
{
  "id": "group1",
  "displayName": "Device group 1",
  "description": "Custom device group.",
  "filter": "SELECT * FROM devices WHERE $template = \"dtmi:modelDefinition:dtdlv2\" AND $provisioned = true"
}
```

You can now use the `id` value from the response to create a new job.

```json
{
  "displayName": "Set target temperature",
  "description": "Set target temperature device property",
  "group": "group1",
  "batch": {
    "type": "percentage",
    "value": 25
  },
  "cancellationThreshold": {
    "type": "percentage",
    "value": 10,
    "batch": false
  },
  "data": [
    {
      "type": "PropertyJobData",
      "target": "dtmi:modelDefinition:zomtmdxh:eqod32zbyl",
      "path": "targetTemperature",
      "value": "55"
    }
  ]
}
```

The response to this request looks like the following example. The initial job status is `pending`:

```json
{
  "id": "job-006",
  "displayName": "Set target temperature",
  "description": "Set target temperature device property",
  "group": "group1",
  "batch": {
    "type": "percentage",
    "value": 25
  },
  "cancellationThreshold": {
    "type": "percentage",
    "value": 10,
    "batch": false
  },
  "data": [
    {
      "type": "PropertyJobData",
      "target": "dtmi:modelDefinition:zomtmdxh:eqod32zbyl",
      "path": "targetTemperature",
      "value": "55"
    }
  ],
  "status": "pending"
}
```

## Stop, resume, and rerun jobs

Use the following request to stop a running job:

```http
POST https://{your app subdomain}.azureiotcentral.com/api/jobs/job-006/stop?api-version=2022-07-31
```

If the request succeeds, it returns a `204 - No Content` response.

Use the following request to resume a stopped job:

```http
POST https://{your app subdomain}.azureiotcentral.com/api/jobs/job-006/resume?api-version=2022-07-31
```

If the request succeeds, it returns a `204 - No Content` response.

Use the following command to rerun an existing job on any failed devices:

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/jobs/job-006/rerun/rerun-001?api-version=2022-07-31
```

## Create a scheduled job

The payload for a scheduled job is similar to a standard job but includes the following extra fields:

| Field               | Description |
| ------------------- | ----------- |
| schedule/start      |The start date and time for the job in ISO 8601 format |
| schedule/recurrence | One of `daily`, `monthly`, `yearly |`
| schedule/end        | An optional field that either specifies the number of occurrences for the job or an end date in ISO 8601 format |

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/scheduledJobs/scheduled-Job-001?api-version=2022-07-31
```

The following example shows a request body that creates a scheduled job.

```json
{
    "displayName": "New Scheduled Job",
    "group": "6fecf96f-a26c-49ed-8076-6960f8efba31",
    "data": [
        {
            "type": "cloudProperty",
            "target": "dtmi:azurertos:devkit:hlby5jgib2o",
            "path": "Company",
            "value": "Contoso"
        }
    ],
    "schedule": {
        "start": "2022-10-24T22:29:01Z",
        "recurrence": "daily",
        "end": {
            "type": "date",
            "date": "2022-12-30"
        }
    }
}
```

The response to this request looks like the following example:

```json
{
    "id": "scheduled-Job-001",
    "displayName": "New Scheduled Job",
    "description": "",
    "group": "6fecf96f-a26c-49ed-8076-6960f8efba31",
    "data": [
        {
            "type": "cloudProperty",
            "target": "dtmi:azurertos:devkit:hlby5jgib2o",
            "path": "Company",
            "value": "Contoso"
        }
    ],
    "schedule": {
        "start": "2022-10-24T22:29:01Z",
        "recurrence": "daily",
        "end": {
            "type": "date",
            "date": "2022-12-30"
        }
    },
    "enabled": false,
    "completed": false,
    "etag": "\"88003877-0000-0700-0000-631020670000\""
}
```

## Get a scheduled job

Use the following request to get a scheduled job:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/scheduledJobs/scheduled-Job-001?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
    "id": "scheduled-Job-001",
    "displayName": "New Scheduled Job",
    "description": "",
    "group": "6fecf96f-a26c-49ed-8076-6960f8efba31",
    "data": [
        {
            "type": "cloudProperty",
            "target": "dtmi:azurertos:devkit:hlby5jgib2o",
            "path": "Company",
            "value": "Contoso"
        }
    ],
    "schedule": {
        "start": "2022-10-24T22:29:01Z",
        "recurrence": "daily"
    },
    "enabled": false,
    "completed": false,
    "etag": "\"88003877-0000-0700-0000-631020670000\""
}
```

## List scheduled jobs

Use the following request to get a list of scheduled jobs:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/scheduledJobs?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "id": "scheduled-Job-001",
            "displayName": "New Scheduled Job",
            "description": "",
            "group": "6fecf96f-a26c-49ed-8076-6960f8efba31",
            "data": [
                {
                    "type": "cloudProperty",
                    "target": "dtmi:azurertos:devkit:hlby5jgib2o",
                    "path": "Company",
                    "value": "Contoso"
                }
            ],
            "schedule": {
                "start": "2022-10-24T22:29:01Z",
                "recurrence": "daily"
            },
            "enabled": false,
            "completed": false,
            "etag": "\"88003877-0000-0700-0000-631020670000\""
        },
        {
            "id": "46480dff-dc22-4542-924e-a5d45bf347aa",
            "displayName": "test",
            "description": "",
            "group": "cdd04344-bb55-425b-a55a-954d68383289",
            "data": [
                {
                    "type": "cloudProperty",
                    "target": "dtmi:rigado:evxfmi0xim",
                    "path": "test",
                    "value": 2
                }
            ],
            "schedule": {
                "start": "2022-09-01T03:00:00.000Z"
            },
            "enabled": true,
            "completed": true,
            "etag": "\"88000f76-0000-0700-0000-631020310000\""
        }
    ]
}
```

## Update a scheduled job

Use the following request to update a scheduled job:

```http
PATCH https://{your app subdomain}.azureiotcentral.com/api/scheduledJobs/scheduled-Job-001?api-version=2022-07-31
```

The following example shows a request body that updates a scheduled job.

```json
{
  "schedule": {
    "start": "2022-10-24T22:29:01Z",
    "recurrence": "weekly"
  }
}
```

The response to this request looks like the following example:

```json
{
    "id": "scheduled-Job-001",
    "displayName": "New Scheduled Job",
    "description": "",
    "group": "6fecf96f-a26c-49ed-8076-6960f8efba31",
    "data": [
        {
            "type": "cloudProperty",
            "target": "dtmi:azurertos:devkit:hlby5jgib2o",
            "path": "Company",
            "value": "Contoso"
        }
    ],
    "schedule": {
        "start": "2022-10-24T22:29:01Z",
        "recurrence": "weekly"
    },
    "enabled": false,
    "completed": false,
    "etag": "\"88003877-0000-0700-0000-631020670000\""
}
```

## Delete a scheduled job

Use the following request to delete a scheduled job

```http
GET https://{your app subdomain}.azureiotcentral.com/api/scheduledJobs/scheduled-Job-001?api-version=2022-07-31
```

## Next steps

Now that you've learned how to manage jobs with the REST API, a suggested next step is to learn how to [Tutorial: Use the REST API to manage an Azure IoT Central application](tutorial-use-rest-api.md).
