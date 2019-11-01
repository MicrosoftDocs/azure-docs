---
title: Troubleshooting Azure IoT Hub error 401003 IoTHubUnauthorized
description: Understand how to fix error 401003 IoTHubUnauthorized 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 401003 IoTHubUnauthorized errors.
---

# 401002 AuthenticationFailed

This article describes the causes and solutions for **401003 IoTHubUnauthorized** errors.

## Symptoms

Precisely describe what the customer should be experiencing when encountering the problem. If the title can't contain the complete message, expand on it here. If there is relevant general troubleshooting information available, link to it from here.

## Cause

IoT Hub couldn't authenticate the connection.

## Solution

Make sure that the SAS or other security token you use isn't expired. [Azure IoT SDKs](iot-hub-devguide-sdks.md) automatically generate tokens without requiring special configuration.

## Next steps

Include this section if there are 1 -3 concrete, highly relevant next steps the user should take. Delete if there are no next steps. This is not a place for a list of links. If you include links to next steps, make sure to include text to explain why the next steps are relevant or important.
