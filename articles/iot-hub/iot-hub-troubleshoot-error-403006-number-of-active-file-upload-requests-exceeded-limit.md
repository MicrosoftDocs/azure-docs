---
title: Troubleshooting Azure IoT Hub error 403006 Number of active file upload requests exceeded limit
description: Understand how to fix error 403006 Number of active file upload requests exceeded limit 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 403006 Number of active file upload requests exceeded limit errors.
---

# 403006 Number of active file upload requests exceeded limit

This article describes the causes and solutions for **403006 Number of active file upload requests exceeded limit** errors.

## Symptoms

Precisely describe what the customer should be experiencing when encountering the problem. If the title can't contain the complete message, expand on it here. If there is relevant general troubleshooting information available, link to it from here.

## Cause

Each device client is limited to [10 concurrent file uploads](./iot-hub-devguide-quotas-throttling.md#other-limits).

## Solution

[Verify the previous uploads are completed](./iot-hub-devguide-file-upload.md#notify-iot-hub-of-a-completed-file-upload).

To learn more about file uploads, see [Upload files with IoT Hub](./iot-hub-devguide-file-upload.md) and [Configure IoT Hub file uploads using the Azure portal](./iot-hub-configure-file-upload.md).

## Next steps

Include this section if there are 1 -3 concrete, highly relevant next steps the user should take. Delete if there are no next steps. This is not a place for a list of links. If you include links to next steps, make sure to include text to explain why the next steps are relevant or important.
