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

# 401003 IoTHubUnauthorized

This article describes the causes and solutions for **401003 IoTHubUnauthorized** errors.

## Symptoms

Several possible symptoms fall under this error code. In general, the error shows when trying during requests to IoT Hub service for almost anything. Additional detail is included in the error message which could include:

>* Authorization header missing
>* IotHub '\*' does not contain the specified device '\*'
>* Authorization rule '\*' does not allow access for '\*'
>* Authentication failed for this device, renew token or certificate and reconnect
>* Thumbprint does not match configuration: Thumbprint: SHA1Hash=\*, SHA2Hash=\*; Configuration: PrimaryThumbprint=\*, SecondaryThumbprint=\*

## Cause

The authorization header, rule, or key was not considered as sufficient by IoT Hub for authentication.

## Solution

In general, the error message presented should explain how to fix the error. If for some reason you don't have access to the error message detail, make sure:

- The SAS or other security token you use isn't expired. 
- The authorization credential is well-formed for the protocol that you use. To learn more, see [IoT Hub access control](iot-hub-devguide-security.md).
- The authorization rule used has the permission for the operation requested.

## Next steps

To make authenticating to IoT Hub easier, we recommend using [Azure IoT SDKs](iot-hub-devguide-sdks.md).