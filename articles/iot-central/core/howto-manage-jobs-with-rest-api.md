---
title: Use the REST API to manage jobs in Azure IoT Central
description: How to use the IoT Central REST API to create and manage jobs in an application
author: dominicbetts
ms.author: dobett
ms.date: 06/21/2020
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to create and manage jobs

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to create and manage jobs in your IoT Central application. The REST API lets you:

- List jobs and view job details in your application.
- Create jobs in your application.
- Stop, resume, and rerun jobs in your application.

> [!IMPORTANT]
> The jobs API is currently in preview. All The REST API calls described in this article should include `?api-version=preview`.

This article describes how to use the `/jobs/{job_id}` API to control devices in bulk. You can also control devices individually.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

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
| `data/type` | One of `PropertyJobData`, `CommandJobData`, or `CloudPropertyJobData` |
| `data/target` | The model ID of the target devices. |
| `data/path` | The name of the property, command, or cloud property. |
| `data/value` | The property value to set or the command parameter to send. |

## Get job information

Use the following request to retrieve the list of the jobs in your application:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/jobs?api-version=preview
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
GET https://{your app subdomain}.azureiotcentral.com/api/jobs/job-004?api-version=preview
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
GET https://{your app subdomain}.azureiotcentral.com/api/jobs/job-004/devices?api-version=preview
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

Use the following request to retrieve the details of the devices in a job:

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/jobs/job-006?api-version=preview
{
  "displayName": "Set target temperature",
  "description": "Set target temperature device property",
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
      "value": "55"
    }
  ],
  "status": "pending"
}
```

## Stop, resume, and rerun jobs

Use the following request to stop a running job:

```http
POST https://{your app subdomain}.azureiotcentral.com/api/jobs/job-006/stop?api-version=preview
```

If the request succeeds, it returns a `204 - No Content` response.

Use the following request to resume a stopped job:

```http
POST https://{your app subdomain}.azureiotcentral.com/api/jobs/job-006/resume?api-version=preview
```

If the request succeeds, it returns a `204 - No Content` response.

Use the following command to rerun an existing job on any failed devices:

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/jobs/job-006/rerun/rerun-001?api-version=preview
```

## Next steps

Now that you've learned how to manage jobs with the REST API, a suggested next step is to learn how to [Manage IoT Central applications with the REST API](/learn/modules/manage-iot-central-apps-with-rest-api/).
