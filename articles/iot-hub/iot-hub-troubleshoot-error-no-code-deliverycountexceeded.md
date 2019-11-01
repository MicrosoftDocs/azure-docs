---
title: Troubleshooting Azure IoT Hub error DeliveryCountExceeded (no error code)
description: Understand how to fix error DeliveryCountExceeded (no error code)
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve DeliveryCountExceeded errors.
---

# DeliveryCountExceeded (no error code)

This article describes the causes and solutions for **DeliveryCountExceeded** errors. This error does not return a numeric error code.

## Symptoms

Precisely describe what the customer should be experiencing when encountering the problem. If the title can't contain the complete message, expand on it here. If there is relevant general troubleshooting information available, link to it from here.

## Cause

A message was abandoned or the lock timed-out (transition between the Enqueued and Invisible states) too many times, exceeding the configured maxDeliveryCount value.

## Solution

Find the device ID and delivery count values (properties column) and consider [changing the maxDeliveryCount configuration](./iot-hub-devguide-messages-c2d.md#cloud-to-device-configuration-options).

## Next steps

Include this section if there are 1 -3 concrete, highly relevant next steps the user should take. Delete if there are no next steps. This is not a place for a list of links. If you include links to next steps, make sure to include text to explain why the next steps are relevant or important.
