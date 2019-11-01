---
title: Troubleshooting Azure IoT Hub error 403004 DeviceMaximumQueueDepthExceeded
description: Understand how to fix error 403004 DeviceMaximumQueueDepthExceeded 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 403004 DeviceMaximumQueueDepthExceeded errors.
---

# 403004 DeviceMaximumQueueDepthExceeded

This article describes the causes and solutions for **403004 DeviceMaximumQueueDepthExceeded** errors.

## Symptoms

Precisely describe what the customer should be experiencing when encountering the problem. If the title can't contain the complete message, expand on it here. If there is relevant general troubleshooting information available, link to it from here.

## Cause

The number of messages enqueued for the device exceeds the [queue limit (50)](./iot-hub-devguide-quotas-throttling.md#other-limits).

## Solution

Enhance device side logic to process (complete, reject, or abandon) queued messages promptly, shorten the time to live, or consider sending fewer messages. See [C2D message time to live](./iot-hub-devguide-messages-c2d.md#message-expiration-time-to-live).

## Next steps

Include this section if there are 1 -3 concrete, highly relevant next steps the user should take. Delete if there are no next steps. This is not a place for a list of links. If you include links to next steps, make sure to include text to explain why the next steps are relevant or important.
