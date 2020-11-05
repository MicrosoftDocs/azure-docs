---
title: Troubleshooting Azure IoT Hub error 401003 IoTHubUnauthorized
description: Understand how to fix error 401003 IoTHubUnauthorized 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 01/30/2020
ms.author: jlian
ms.custom: [amqp, mqtt]
# As a developer or operator for Azure IoT Hub, I want to resolve 401003 IoTHubUnauthorized errors.
---

# 401003 IoTHubUnauthorized

This article describes the causes and solutions for **401003 IoTHubUnauthorized** errors.

## Symptoms

### Symptom 1

In logs, you see a pattern of devices disconnecting with **401003 IoTHubUnauthorized**, followed by **404104 DeviceConnectionClosedRemotely**, and then successfully connecting shortly after.

### Symptom 2

Requests to IoT Hub fail with one of the following error messages:

* Authorization header missing
* IotHub '\*' does not contain the specified device '\*'
* Authorization rule '\*' does not allow access for '\*'
* Authentication failed for this device, renew token or certificate and reconnect
* Thumbprint does not match configuration: Thumbprint: SHA1Hash=\*, SHA2Hash=\*; Configuration: PrimaryThumbprint=\*, SecondaryThumbprint=\*

## Cause

### Cause 1

For MQTT, some SDKs rely on IoT Hub to issue the disconnect when the SAS token expires to know when to refresh it. So,

1. The SAS token expires
1. IoT Hub notices the expiration, and disconnects the device with **401003 IoTHubUnauthorized**
1. The device completes the disconnection with **404104 DeviceConnectionClosedRemotely**
1. The IoT SDK generates a new SAS token
1. The device reconnects with IoT Hub successfully

### Cause 2

IoT Hub couldn't authenticate the auth header, rule, or key. This could be due to any of the reasons cited in the symptoms.

## Solution

### Solution 1

No action needed if using IoT SDK for connection using the device connection string. IoT SDK regenerates the new token to reconnect on SAS token expiration.

The default token lifespan is 60 minutes across SDKs; however, for some SDKs the token lifespan and the token renewal threshold is configurable. Additionally, the errors generated when a device disconnects and reconnects on token renewal differs for each SDK. To learn more, and for information about how to determine which SDK your device is using in logs, see [MQTT device disconnect behavior with Azure IoT SDKs](iot-hub-troubleshoot-connectivity.md#mqtt-device-disconnect-behavior-with-azure-iot-sdks).

For device developers, if the volume of errors is a concern, switch to the C SDK, which renews the SAS token before expiration. For AMQP, the SAS token can refresh without disconnection.

### Solution 2

In general, the error message presented should explain how to fix the error. If for some reason you don't have access to the error message detail, make sure:

- The SAS or other security token you use isn't expired.
- For X.509 certificate authentication, the device certificate or the CA certificate associated with the device isn't expired. To learn how to register X.509 CA certificates with IoT Hub, see [Set up X.509 security in your Azure IoT hub](iot-hub-security-x509-get-started.md).
- For X.509 certificate thumbprint authentication, the thumbprint of the device certificate is registered with IoT Hub.
- The authorization credential is well formed for the protocol that you use. To learn more, see [Control access to IoT Hub](iot-hub-devguide-security.md).
- The authorization rule used has the permission for the operation requested.

## Next steps

- To make authenticating to IoT Hub easier, we recommend using [Azure IoT SDKs](iot-hub-devguide-sdks.md).
- For detail about authentication with IoT Hub, see [Control Access to IoT Hub](iot-hub-devguide-security.md).
