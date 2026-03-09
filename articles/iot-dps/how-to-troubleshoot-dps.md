---
title: Diagnose and troubleshoot provisioning errors with DPS 
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Learn to diagnose and troubleshoot common errors for Azure IoT Hub Device Provisioning Service (DPS)
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
ms.topic: troubleshooting
ms.date: 01/05/2026
ms.subservice: azure-iot-hub-dps
---

# Troubleshoot Azure IoT Hub Device Provisioning Service

Provisioning issues for IoT devices can be difficult to troubleshoot because there are many possible points of failures such as attestation failures, registration failures, etc. To learn more about using Azure Monitor with DPS, see [Monitor Azure IoT Hub Device Provisioning Service](monitor-iot-dps.md).

## Common error codes

Use this table to understand and resolve common errors.

| Error Code| Description | HTTP Status Code |
|-------|------------|------------|
| 400 | The body of the request isn't valid; for example, it can't be parsed, or the object can't be validated.| 400 Bad format |
| 401 | The authorization token can't be validated; for example, it expired or doesn't apply to the request's URI. This error code is also returned to devices as part of the TPM attestation flow. | 401 Unauthorized |
| 404 | The Device Provisioning Service instance, or a resource (for example, an enrollment) doesn't exist. | 404 Not Found |
| 405 | The client service knows the request method, but the target service doesn't recognize this method; for example, a rest operation is missing the enrollment or registration ID parameters | 405 Method Not Allowed |
| 409 | The request couldn't be completed due to a conflict with the current state of the target Device Provisioning Service instance. For example, the customer created a data point and is attempting to recreate the same data point again. | 409 Conflict |
| 412 | The ETag in the request doesn't match the ETag of the existing resource, as per RFC7232. | 412 Precondition failed |
| 415 | The server refuses to accept the request because the payload format is in an unsupported format. For supported formats, see [Azure IoT Hub Device Provisioning Service REST API](/rest/api/iot-dps/) | 415 Unsupported Media Type |
| 429 | Operations are being throttled by the service. For specific service limits, see [Azure IoT Hub Device Provisioning Service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-iot-hub-device-provisioning-service-limits). | 429 Too many requests |
| 500 | An internal error occurred. | 500 Internal Server Error |

### Suggested actions

* If an IoT Edge device fails to start with error message `failed to provision with IoT Hub, and no valid device backup was found dps client error`, see [DPS client error](/previous-versions/azure/iot-edge/troubleshoot-common-errors#dps-client-error) in the IoT Edge (1.1) documentation.

* For 401 Unauthorized, 403 Forbidden, or 404 Not Found errors perform a full re-registration by calling the [DPS registration API](/rest/api/iot-dps/device/runtime-registration).

* For a 429 error, follow the retry pattern of IoT Hub that has exponential backoff with a random jitter. You can follow the retry-after header provided by the SDK.

* For 500-series server errors, retry your [connection](./concepts-deploy-at-scale.md#iot-hub-connectivity-considerations) using cached credentials or a [Device Registration Status Lookup](/rest/api/iot-dps/device/runtime-registration/device-registration-status-lookup) API call.

For related best practices, such as retrying operations, see [Best practices for large-scale IoT device deployments](./concepts-deploy-at-scale.md).

## 4042xx Device Registration Service NotFound errors

You might see that your requests to IoT Hub fail with an error that begins with **4042**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**404201 EnrollmentNotFound**| The specified enrollment isn't found. | Check the enrollment ID and try again. |
|**404202 DeviceRegistrationNotFound**| The specified device registration isn't found. | Check the device registration ID and try again. |
|**404203 AsyncOperationNotFound**| The specified asynchronous operation isn't found. | Check the operation ID and try again. |
|**404204 EnrollmentGroupNotFound**| The specified enrollment group isn't found. | Check the enrollment group ID and try again. |
|**404205 DeviceRecordNotFound**| The specified device record isn't found. | Check the device record ID and try again. |
|**404206 GroupRecordNotFound**| The specified group record isn't found. | Check the group record ID and try again. |
|**404207 DeviceGroupNotFound**| The specified device group isn't found. | Check the device group ID and try again. |
|**404208 ProvisioningSettingsNotFound**| The specified provisioning settings aren't found. | Check the provisioning settings ID and try again. |
|**404209 ProvisioningRecordNotFound**| The specified provisioning record isn't found. | Check the provisioning record ID and try again. |
|**404210 LinkedHubNotFound**| The specified linked hub isn't found. | Check the linked hub ID and try again. |
|**404211 CertificateAuthorityNotFound**| The specified certificate authority isn't found. | Check the certificate authority ID and try again. |

## 4092xx Device Provisioning Service conflict errors

You might see that your requests to IoT Hub fail with an error that begins with **4092**. The following table lists the error codes, their descriptions, and possible solutions.

| Error Code | Description | Solution |
|------------|-------------|----------|
|**409201  EnrollmentConflict**| The specified enrollment already exists. | Check the enrollment ID and try again. |
|**409202  EnrollmentGroupConflict**| The specified enrollment group already exists. | Check the enrollment group ID and try again. |
|**409203  RegistrationStatusConflict**| The specified registration status is conflicting. | Check the registration status and try again. |
|**409205  DeviceRecordConflict**| The specified device record is conflicting. | Check the device record and try again. |
|**409206  GroupRecordConflict**| The specified group record is conflicting. | Check the group record and try again. |
|**409207  DeviceGroupConflict**| The specified device group is conflicting. | Check the device group and try again. |
|**409208  ProvisioningSettingsConflict**| The specified provisioning settings are conflicting. | Check the provisioning settings and try again. |
|**409209  ProvisioningRecordConflict**| The specified provisioning record is conflicting. | Check the provisioning record and try again. |
|**409210  LinkedHubConflict**| The specified linked hub is conflicting. | Check the linked hub and try again. |
|**409211  CertificateAuthorityConflict**| The specified certificate authority is conflicting. | Check the certificate authority and try again. |

## Related content

- [Monitor Azure IoT Hub Device Provisioning Service](monitor-iot-dps.md)
- [Azure IoT Hub Device Provisioning Service monitoring data reference](monitor-iot-dps-reference.md)
- [Understand and resolve Azure IoT Hub errors](../iot-hub/troubleshoot-error-codes.md)