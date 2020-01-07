---
title: Deprecation TLS 1.0 and 1.1 in IoT Hub and Device Provisioning Service (DPS) | Microsoft Docs
description: Guidelines regarding deprecation of TLS 1.0 and 1.1 and supported ciphers in IoT Hub and DPS.
author: rezas
ms.author: reza
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 12/16/2019
---

# TLS 1.0 and 1.1 deprecation in IoT Hub and Device Provisioning Service

To provide best-in-class encryption, IoT Hub and Device Provisioning Service (DPS) are moving to Transport Layer Security (TLS) 1.2 as the encryption mechanism of choice for IoT devices and services. As such, legacy support for TLS 1.0 and TLS 1.1 as well as several non-recommended legacy ciphers will be deprecated in **July 1, 2020**.


## Impact
Based on customers' specific circumstances and configurations, deprecation of TLS 1.0 and 1.1 and non-recommended legacy ciphers can be an impactful change for your IoT devices and services communicating with IoT Hub or DPS. In some cases, devices and services that are incompatible with these changes will not be able to connect to the IoT Hub or DPS after the aforementioned cut-off date.


## Supported ciphers

Only the following ciphers will be allowed during TLS handshake:

* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384


## Customer feedback

While the TLS 1.2 enforcement is an industry-wide best-in-class encryption choice and will be enabled as planned, we still would like to hear from customers regarding their specific deployments and difficulties adopting TLS 1.2. For this purpose, you can send your comments to [iot_tls1_deprecation@microsoft.com](mailto:iot_tls1_deprecation@microsoft.com).