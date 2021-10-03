---
title: Troubleshooting Azure IoT Hub error 429001 ThrottlingException
description: Understand how to fix error 429001 ThrottlingException 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 01/30/2020
ms.author: jlian
#Customer intent: As a developer or operator for Azure IoT Hub, I want to resolve 429001 ThrottlingException errors.
---

# 429001 ThrottlingException

This article describes the causes and solutions for **429001 ThrottlingException** errors.

## Symptoms

Your requests to IoT Hub fail with the error **429001 ThrottlingException**.

## Cause

IoT Hub [throttling limits](./iot-hub-devguide-quotas-throttling.md) have been exceeded for the requested operation.

## Solution

Check if you're hitting the throttling limit by comparing your *Telemetry message send attempts* metric against the limits specified above. You can also check the *Number of throttling errors* metric. For information about these metrics, see [Device telemetry metrics](monitor-iot-hub-reference.md#device-telemetry-metrics). For information about how use metrics to help you monitor your IoT hub, see [Monitor IoT Hub](monitor-iot-hub.md).

IoT Hub returns 429 ThrottlingException only after the limit has been violated for too long a period. This is done so that your messages aren't dropped if your IoT hub gets burst traffic. In the meantime, IoT Hub processes the messages at the operation throttle rate, which might be slow if there's too much traffic in the backlog. To learn more, see [IoT Hub traffic shaping](./iot-hub-devguide-quotas-throttling.md#traffic-shaping).

## Next steps

Consider [scaling up your IoT Hub](./iot-hub-scaling.md) if you're running into quota or throttling limits.