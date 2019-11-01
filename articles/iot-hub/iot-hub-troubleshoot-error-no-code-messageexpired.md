---
title: Troubleshooting Azure IoT Hub error MessageExpired (no error code)
description: Understand how to fix error MessageExpired (no error code)
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve MessageExpired errors.
---

# MessageExpired (no error code)

This article describes the causes and solutions for **MessageExpired** errors. This error does not return a numeric error code.

## Symptoms

Precisely describe what the customer should be experiencing when encountering the problem. If the title can't contain the complete message, expand on it here. If there is relevant general troubleshooting information available, link to it from here.

## Cause

The C2D message expired because the device hasn't processed the message in time. Typically this is because device was offline. 

## Solution

To resolve, see [C2D message time to live](./iot-hub-devguide-messages-c2d.md#message-expiration-time-to-live).

## Next steps

Include this section if there are 1 -3 concrete, highly relevant next steps the user should take. Delete if there are no next steps. This is not a place for a list of links. If you include links to next steps, make sure to include text to explain why the next steps are relevant or important.
