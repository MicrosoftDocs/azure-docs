---
title: Deprecating TLS 1.0 and 1.1 in IoT Hub | Microsoft Docs
description: Guidelines regarding deprecation of TLS 1.0 and 1.1 and supported ciphers in IoT Hub.
author: jlian
ms.author: jlian
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/14/2020
---

# Deprecation of TLS 1.0 and 1.1 in IoT Hub

To provide best-in-class encryption, IoT Hub is moving to Transport Layer Security (TLS) 1.2 as the encryption mechanism of choice for IoT devices and services. 

## Timeline

IoT Hub will continue to support TLS 1.0/1.1 until further notice. However, we recommend that all customers migrate to TLS 1.2 as soon as possible.

## Supported ciphers

The timeline for availability of various ciphers used in TLS handshake is as follows:

* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 (currently supported)
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 (will be supported in second half of 2020)
* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (will be supported in second half of 2020)
* TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (will be supported in second half of 2020)

## Customer feedback

While the TLS 1.2 enforcement is an industry-wide best-in-class encryption choice and will be enabled as planned, we still would like to hear from customers regarding their specific deployments and difficulties adopting TLS 1.2. For this purpose, you can send your comments to [iot_tls1_deprecation@microsoft.com](mailto:iot_tls1_deprecation@microsoft.com).
