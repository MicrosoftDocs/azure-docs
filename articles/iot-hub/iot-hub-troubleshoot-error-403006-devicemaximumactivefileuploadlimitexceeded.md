---
title: Troubleshooting Azure IoT Hub error 403006 DeviceMaximumActiveFileUploadLimitExceeded
description: Understand how to fix error 403006 DeviceMaximumActiveFileUploadLimitExceeded 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 403006 DeviceMaximumActiveFileUploadLimitExceeded errors.
---

# 403006 DeviceMaximumActiveFileUploadLimitExceeded

This article describes the causes and solutions for **403006 DeviceMaximumActiveFileUploadLimitExceeded** errors.

## Symptoms

When trying to initiate a file upload request, the request fails with the error code **403006** and a message "Number of active file upload requests cannot exceed 10".

## Cause

Each device client is limited to [10 concurrent file uploads](./iot-hub-devguide-quotas-throttling.md#other-limits). Most likely, you're exceeding the limit because IoT Hub wasn't notified that previous file uploads are completed.

## Solution

To prevent the number of concurrent file uploads from piling up and exceeding the limit of 10, implement device side logic to promptly [notify IoT Hub file upload completion](./iot-hub-devguide-file-upload.md#notify-iot-hub-of-a-completed-file-upload).

## Next steps

To learn more about file uploads, see [Upload files with IoT Hub](./iot-hub-devguide-file-upload.md) and [Configure IoT Hub file uploads using the Azure portal](./iot-hub-configure-file-upload.md).