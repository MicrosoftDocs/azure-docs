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

When trying to send a cloud-to-device message, the request fails with the error **403004** or **DeviceMaximumQueueDepthExceeded**.

## Cause

The number of messages enqueued for the device exceeds the [queue limit (50)](./iot-hub-devguide-quotas-throttling.md#other-limits).

## Solution

Enhance device side logic to process (complete, reject, or abandon) queued messages promptly, shorten the time to live, or consider sending fewer messages. See [C2D message time to live](./iot-hub-devguide-messages-c2d.md#message-expiration-time-to-live).