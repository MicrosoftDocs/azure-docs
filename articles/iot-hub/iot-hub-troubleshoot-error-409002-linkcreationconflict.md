---
title: Troubleshooting Azure IoT Hub error 409002 LinkCreationConflict
description: Understand how to fix error 409002 LinkCreationConflict 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 409002 LinkCreationConflict errors.
---

# 409002 LinkCreationConflict

This article describes the causes and solutions for **409002 LinkCreationConflict** errors.

## Symptoms

You see the error `LinkCreationConflict` logged in diagnostic logs along with device disconnection. 

When using AMQP?

## Cause

A device has more than one connection. When a new connection request comes for a device, IoT Hub closes the previous one with this error.

## Solution

In the most common case, a device detects a disconnect and tries to reestablish the connection, but IoT Hub still considers the device connected. IoT Hub closes the previous connection and logs this error. This error usually appears as a side effect of a different, transient issue, so look for other errors in the logs to troubleshoot further. Otherwise, make sure to issue a new connection request only if the connection drops.
