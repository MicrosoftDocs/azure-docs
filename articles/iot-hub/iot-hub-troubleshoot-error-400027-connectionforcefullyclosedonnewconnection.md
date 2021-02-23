---
title: Troubleshooting Azure IoT Hub error 400027 ConnectionForcefullyClosedOnNewConnection
description: Understand how to fix error 400027 ConnectionForcefullyClosedOnNewConnection 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 01/30/2020
ms.author: jlian
ms.custom: [mqtt, fasttrack-edit, iot]
# As a developer or operator for Azure IoT Hub, I want to resolve 400027 ConnectionForcefullyClosedOnNewConnection errors.
---

# 400027 ConnectionForcefullyClosedOnNewConnection

This article describes the causes and solutions for **400027 ConnectionForcefullyClosedOnNewConnection** errors.

## Symptoms

Your device get disconnected with **Communication_Error** as **ConnectionStatusChangeReason** using .NET SDK and MQTT transport type.

Your device-to-cloud twin operation (such as read or patch reported properties) or direct method invocation fails with the error code **400027**.

## Cause

Another client created a new connection to IoT Hub using the same credentials, so IoT Hub closed the previous connection. IoT Hub doesn't allow more than one client to connect using the same set of credentials.

## Solution

Ensure that each client connects to IoT Hub using its own identity.