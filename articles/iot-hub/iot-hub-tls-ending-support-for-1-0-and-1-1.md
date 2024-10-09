---
title: Ending Support for TLS 1.0 and 1.1 in IoT Hub | Microsoft Docs
description: Guidelines regarding deprecation of TLS 1.0 and 1.1 and supported ciphers in IoT Hub.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/14/2020
---

# Ending Support for TLS 1.0 and 1.1 in IoT Hub

To provide improved security with features such as perfect forward secrecy and stronger cipher suites, IoT Hub is ending support for TLS 1.0 and 1.1 on July 1st, 2025, and will only support TLS 1.2 and above.  

## Deprecating TLS 1.1 ciphers

* `TLS_ECDHE_RSA_WITH_AES_256_CBC_SH`
* `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA`
* `TLS_RSA_WITH_AES_256_CBC_SHA`
* `TLS_RSA_WITH_AES_128_CBC_SHA`
* `TLS_RSA_WITH_3DES_EDE_CBC_SHA`

## Deprecating TLS 1.0 ciphers

* `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA`
* `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA`
* `TLS_RSA_WITH_AES_256_CBC_SHA`
* `TLS_RSA_WITH_AES_128_CBC_SHA`
* `TLS_RSA_WITH_3DES_EDE_CBC_SHA`

## TLS 1.2 cipher suites

See [IoT Hub TLS 1.2 cipher suites](iot-hub-tls-support.md#cipher-suites).
 
## Checking TLS version(s) for IoT Hub devices
Azure IoT Hub can provide diagnostic logs for several categories that can be analyzed using Azure Monitor Logs. In the connections log you can find the TLS Version for your IoT Hub devices.

To view these logs please follow these steps:
1. In the [Azure portal](https://portal.azure.com), go to your IoT hub.
2. In the resource menu under **Monitoring**,  select **Diagnostic settings**. Ensure that you have added diagnostic settings and have "Connections" checked.
3. In the resource menu under **Monitoring**,  select **Logs**.
4. Enter the following query:
```azurecli
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
| where Category == "Connections"
| where OperationName == "deviceConnect"
| extend props_json = parse_json(properties_s)
| project DeviceId = props_json.deviceId, TLSVersion = props_json.tlsVersion
```
5. An example of the query results will look like:
:::image type="content" source="./media/iot-hub-tls-ending-support-for-1-0-and-1-1/queryresult.png" alt-text="Diagram showing the query for device TLS version.":::
6. Note: Devices using HTTPS connections will not generate an event in Azure Monitor logs. 

