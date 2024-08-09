---
title: Diagnose and troubleshoot provisioning errors with DPS 
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Learn to diagnose and troubleshoot common errors for Azure IoT Hub Device Provisioning Service (DPS)
author: kgremban

ms.author: kgremban
ms.service: iot-dps
ms.topic: troubleshooting
ms.date: 06/28/2024
---

# Troubleshooting with Azure IoT Hub Device Provisioning Service

Provisioning issues for IoT devices can be difficult to troubleshoot because there are many possible points of failures such as attestation failures, registration failures, etc. To learn more about using Azure Monitor with DPS, see [Monitor Azure IoT Hub Device Provisioning Service](monitor-iot-dps.md).

## Common error codes

Use this table to understand and resolve common errors.

| Error Code| Description | HTTP Status Code |
|-------|------------|------------|
| 400 | The body of the request is not valid; for example, it cannot be parsed, or the object cannot be validated.| 400 Bad format |
| 401 | The authorization token cannot be validated; for example, it is expired or does not apply to the request's URI. This error code is also returned to devices as part of the TPM attestation flow. | 401 Unauthorized|
| 404 | The Device Provisioning Service instance, or a resource (e.g. an enrollment) does not exist. | 404 Not Found|
| 405 | The client service knows the request method, but the target service doesn't recognize this method; for example, a rest operation is missing the enrollment or registration ID parameters | 405 Method Not Allowed |
| 409 | The request could not be completed due to a conflict with the current state of the target Device Provisioning Service instance; for example, the customer has already created the data point and is attempting to recreate the same datapoint again. | 409 Conflict |
| 412 | The ETag in the request does not match the ETag of the existing resource, as per RFC7232. | 412 Precondition failed |
| 415 | The server refuses to accept the request because the payload format is in an unsupported format. For supported formats, see [Iot Hub Device Provisioning Service REST API](/rest/api/iot-dps/) | 415 Unsupported Media Type |
| 429 | Operations are being throttled by the service. For specific service limits, see [IoT Hub Device Provisioning Service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#iot-hub-device-provisioning-service-limits). | 429 Too many requests |
| 500 | An internal error occurred. | 500 Internal Server Error|

### Suggested actions

* If an IoT Edge device fails to start with error message `failed to provision with IoT Hub, and no valid device backup was found dps client error`, see [DPS Client error](/previous-versions/azure/iot-edge/troubleshoot-common-errors#dps-client-error) in the IoT Edge (1.1) documentation.

* For 401 Unauthorized, 403 Forbidden, or 404 Not Found errors perform a full re-registration by calling the [DPS registration API](/rest/api/iot-dps/device/runtime-registration).

* For a 429 error, follow the retry pattern of IoT Hub that has exponential backoff with a random jitter. You can follow the retry-after header provided by the SDK.

* For 500-series server errors, retry your [connection](./concepts-deploy-at-scale.md#iot-hub-connectivity-considerations) using cached credentials or a [Device Registration Status Lookup API](/rest/api/iot-dps/device/runtime-registration/device-registration-status-lookup) call.

For related best practices, such as retrying operations, see [Best practices for large-scale IoT device deployments](./concepts-deploy-at-scale.md).

## Next Steps

- To learn more about using Azure Monitor with DPS, see [Monitor Device Provisioning Service](monitor-iot-dps.md).

- To learn about metrics, logs, and schemas emitted for DPS in Azure Monitor, see [Monitoring Device Provisioning Service data reference](monitor-iot-dps-reference.md).