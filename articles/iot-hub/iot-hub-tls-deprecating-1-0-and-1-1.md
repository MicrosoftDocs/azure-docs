---
title: Deprecating TLS 1.0 and 1.1 in IoT Hub | Microsoft Docs
description: Guidelines regarding deprecation of TLS 1.0 and 1.1 and supported ciphers in IoT Hub.
author: kgremban
ms.author: kgremban
ms.service: azure-iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/14/2020
---

# Deprecation of TLS 1.0 and 1.1 in IoT Hub

To provide best-in-class encryption, IoT Hub is moving to Transport Layer Security (TLS) 1.2 as the encryption mechanism of choice for IoT devices and services. 

## Timeline

IoT Hub will continue to support TLS 1.0/1.1 until further notice. However, we recommend that all customers migrate to TLS 1.2 as soon as possible.

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
 
