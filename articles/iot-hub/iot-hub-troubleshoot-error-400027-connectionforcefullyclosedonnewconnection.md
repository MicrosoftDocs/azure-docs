---
title: Troubleshooting Azure IoT Hub error 400027 ConnectionForcefullyClosedOnNewConnection
description: Understand how to fix error 400027 ConnectionForcefullyClosedOnNewConnection 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 400027 ConnectionForcefullyClosedOnNewConnection errors.
---

# 400027 ConnectionForcefullyClosedOnNewConnection

This article describes the causes and solutions for **400027 ConnectionForcefullyClosedOnNewConnection** errors.

## Symptoms

Your device-to-cloud twin operation (such as read or patch reported properties) or direct method invocation fails with the error code **400027**. 

## Cause

The error means that the device created a new connection and so the previous connection was closed. This happens when more than one client tries to connect to IoT Hub using the same connection string.

## Solution

Ensure that each client connects to IoT Hub using its own authentication credentials, such as a connection string.