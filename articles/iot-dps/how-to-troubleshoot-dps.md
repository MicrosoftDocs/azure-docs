---
title: Diagnose and troubleshoot disconnects with Azure IoT Hub DPS
description: Learn to diagnose and troubleshoot common errors with device connectivity for Azure IoT Hub Device Provisioning Service (DPS)
author: xujing-ms
manager: nberdy
ms.service: iot-dps
services: iot-dps
ms.topic: conceptual
ms.date: 09/09/2019
ms.author: xujing
# As an operator for Azure IoT Hub DPS, I need to know how to find out when devices are disconnecting unexpectedly and troubleshoot resolve those issues right away
---
# Troubleshooting with Azure IoT Hub Device Provisioning Service

Connectivity issues for IoT devices can be difficult to troubleshoot because there are many possible points of failures such as attestation failures, registration failures etc. This article provides guidance on how to detect and troubleshoot device connectivity issues via [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview).

## Using Azure Monitor to view metrics and set up alerts

The following procedure describes how to view and set up alert on IoT Hub Device Provisioning Service metric. 

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Browse to your IoT Hub Device Provisioning Service.

3. Select **Metrics**.

4. Select the desired metric. 
   <br />Currently there are three metrics for DPS:

    | Metric Name | Description |
    |-------|------------|
    | Attestation attempts | Number of devices that attempted to authenticate with Device Provisioning Service|
    | Registration attempts | Number of devices that attempted to register to IoT Hub after successful authentication|
    | Device assigned | Number of devices that successfully assigned to IoT Hub|

5. Select desired aggregation method to create a visual view of the metric. 

6. To set up an alert of a metric, select **New alert rules** from the top right of the metric blade, similarly you can go to **Alert** blade and select **New alert rules**.

7. Select **Add condition**, then select the desired metric and threshold by following prompts.

To learn more, see [What are classic alerts in Microsoft Azure?](../azure-monitor/platform/alerts-overview.md)

## Using Log Analytic to view and resolve errors

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Browse to your IoT hub.

3. Select **Diagnostics settings**.

4. Select **Turn on diagnostics**.

5. Enable the desired logs to be collected.

    | Log Name | Description |
    |-------|------------|
    | DeviceOperations | Logs related to device connection events |
    | ServiceOperations | Event logs related to using service SDK (e.g. Creating or updating enrollment groups)|

6. Turn on **Send to Log Analytics** ([see pricing](https://azure.microsoft.com/pricing/details/log-analytics/)). 

7. Go to **Logs** tab in the Azure portal under Device Provisioning Service resource.

8. Click **Run** to view recent events.

9. If there are results, look for `OperationName`, `ResultType`, `ResultSignature`, and `ResultDescription` (error message) to get more detail on the error.


## Common error codes
Use this table to understand and resolve common errors.

| Error Code| Description | HTTP Status Code |
|-------|------------|------------|
| 400 | The body of the request is not valid; for example, it cannot be parsed, or the object cannot be validated.| 400 Bad format |
| 401 | The authorization token cannot be validated; for example, it is expired or does not apply to the request’s URI. This error code is also returned to devices as part of the TPM attestation flow. | 401 Unauthorized|
| 404 | The Device Provisioning Service instance, or a resource (e.g. an enrollment) does not exist. |404 Not Found |
| 412 | The ETag in the request does not match the ETag of the existing resource, as per RFC7232. | 412 Precondition failed |
| 429 | Operations are being throttled by the service. For specific service limits, see [IoT Hub Device Provisioning Service limits](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#iot-hub-device-provisioning-service-limits). | 429 Too many requests |
| 500 | An internal error occurred. | 500 Internal Server Error|
