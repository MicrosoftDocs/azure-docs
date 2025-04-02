---
title: Schedule and broadcast jobs (Python)
titleSuffix: Azure IoT Hub
description: How to use the Azure IoT SDK for Python to create backend service application code for job scheduling.
author: SoniaLopezBravo
ms.author: sonialopez
ms.service: azure-iot-hub
ms.devlang: python
ms.topic: include
ms.date: 1/15/2025
ms.custom: mqtt, devx-track-python, py-fresh-zinc
---

  * Python SDK - [Python version 3.7 or later](https://www.python.org/downloads/) is recommended. Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable.

## Overview

This article describes how to use the [Azure IoT SDK for Python](https://github.com/Azure/azure-iot-sdk-python) to create backend service application code to schedule job to invoke a direct method or perform a device twin desired property update on one or more devices.

## Install package

The **azure-iot-hub** library must be installed to create backend service applications.

```cmd/sh
pip install azure-iot-hub
```

### Import statements

The [IoTHubJobManager](/python/api/azure-iot-hub/azure.iot.hub.iothubjobmanager) class exposes all methods required to create a backend application to schedule jobs from the service.

Add the following `import` statements.

```python
import os
import sys
import datetime
import time
import threading
import uuid
import msrest

from azure.iot.hub import IoTHubJobManager
from azure.iot.hub.models import JobProperties, JobRequest, Twin, TwinProperties, CloudToDeviceMethod
```

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Connect to IoT hub using [from_connection_string](/python/api/azure-iot-hub/azure.iot.hub.iothubjobmanager?#azure-iot-hub-iothubjobmanager-from-connection-string).

This article describes back-end code that can schedule a job to invoke a direct method, schedule a job to update a device twin, and monitors the progress of a job for one or more devices. To perform these operations, your service needs the **registry read** and **registry write permissions**. By default, every IoT hub is created with a shared access policy named **registryReadWrite** that grants these permissions.

For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

For example:

```python
IoTHubConnectionString = "{Shared access policy connection string}"
iothub_job_manager = IoTHubJobManager.from_connection_string(IoTHubConnectionString)
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-python](iot-hub-howto-connect-service-iothub-entra-dotnet.md)]

### Schedule a direct method job

Use [create_scheduled_job](/python/api/azure-iot-hub/azure.iot.hub.iothubjobmanager?#azure-iot-hub-iothubjobmanager-create-scheduled-job) to schedule a new direct method to run a direct method on one or multiple devices:

`create_scheduled_job` parameter notes:

* `job_id` must be unique
* Set `type` to `scheduleDeviceMethod`
* Use `cloud_to_device_method` to set the direct method name and payload
* Use `max_execution_time_in_seconds` to specify the execution time in seconds
* Use `query_condition` to specify the devices to be included for the direct method call. For more information about query conditions, see [IoT Hub query language for device and module twins, jobs, and message routing](/azure/iot-hub/iot-hub-devguide-query-language).

For example:

```python
METHOD_NAME = "lockDoor"
METHOD_PAYLOAD = "{\"lockTime\":\"10m\"}"
job_id = uuid.uuid4()
DEVICE_ID = "Device-1"
TIMEOUT = 60

job_request = JobRequest()
job_request.job_id = job_id
job_request.type = "scheduleDeviceMethod"
job_request.start_time = datetime.datetime.utcnow().isoformat()
job_request.cloud_to_device_method = CloudToDeviceMethod(method_name=METHOD_NAME, payload=METHOD_PAYLOAD)
job_request.max_execution_time_in_seconds = TIMEOUT
job_request.query_condition = "DeviceId in ['{}']".format(device_id)

new_job_response = iothub_job_manager.create_scheduled_job(job_id, job_request)
```

### Schedule a device twin update job

Use [create_scheduled_job](/python/api/azure-iot-hub/azure.iot.hub.iothubjobmanager?#azure-iot-hub-iothubjobmanager-create-scheduled-job) to create a new job to run a device twin desired properties update on one or multiple devices.

`create_scheduled_job` parameter notes:

* `job_id` must be unique
* Set `type` to `scheduleUpdateTwin`
* Use `update_twin` to set the direct method name and payload
* Use `max_execution_time_in_seconds` to specify the execution time in seconds
* Use `query_condition` to specify a condition for one or more devices that have the direct method call. For more information about query conditions, see [IoT Hub query language for device and module twins, jobs, and message routing](/azure/iot-hub/iot-hub-devguide-query-language).

For example:

```python
UPDATE_PATCH = {"building":43,"floor":3}
job_id = uuid.uuid4()
TIMEOUT = 60

job_request = JobRequest()
job_request.job_id = job_id
job_request.type = "scheduleUpdateTwin"
job_request.start_time = datetime.datetime.utcnow().isoformat()
job_request.update_twin = Twin(etag="*", properties=TwinProperties(desired=UPDATE_PATCH))
job_request.max_execution_time_in_seconds = TIMEOUT
job_request.query_condition = "DeviceId in ['{}']".format(device_id)

new_job_response = iothub_job_manager.create_scheduled_job(job_id, job_request)
```

### Monitor a job

Use [get_scheduled_job](/python/api/azure-iot-hub/azure.iot.hub.iothubjobmanager?#azure-iot-hub-iothubjobmanager-get-scheduled-job) to retrieve the details of a specific job on an IoT Hub.

This example checks the job status for a specific job ID every five seconds until the job is complete.

```python
while True:
    get_job_response = iothub_job_manager.get_scheduled_job(job_request.job_id)
    print_job_response("Get job response: ", get_job_response)
    if get_job_response.status == "completed":
      print ( "Job is completed." )
    time.sleep(5)
```

### SDK schedule job examples

The Azure IoT SDK for Python provides working samples of service apps that handle job scheduling tasks. For more information, see:

* [Schedule a direct method job](https://github.com/Azure/azure-iot-hub-python/blob/8c8f315e8b26c65c5517541a7838a20ef8ae668b/samples/iothub_job_manager_method_sample.py)
* [Schedule a device twin update](https://github.com/Azure/azure-iot-hub-python/blob/8c8f315e8b26c65c5517541a7838a20ef8ae668b/samples/iothub_job_manager_twin_update_sample.py).
