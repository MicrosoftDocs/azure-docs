---
title: Troubleshooting Azure IoT Hub error 409002 LinkCreationConflict
description: Understand how to fix error 409002 LinkCreationConflict 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 01/30/2020
ms.author: jlian
ms.custom: amqp
# As a developer or operator for Azure IoT Hub, I want to resolve 409002 LinkCreationConflict errors.
---

# 409002 LinkCreationConflict

This article describes the causes and solutions for **409002 LinkCreationConflict** errors.

## Symptoms

You see the error **409002 LinkCreationConflict** logged in diagnostic logs along with device disconnection or cloud-to-device message failure. 

<!-- When using AMQP? -->

## Cause

Generally, this error happens when IoT Hub detects a client has more than one connection. In fact, when a new connection request arrives for a device with an existing connection, IoT Hub closes the existing connection with this error.

### Cause 1

In the most common case, a separate issue (such as [404104 DeviceConnectionClosedRemotely](iot-hub-troubleshoot-error-404104-deviceconnectionclosedremotely.md)) causes the device to disconnect. The device tries to reestablish the connection immediately, but IoT Hub still considers the device connected. IoT Hub closes the previous connection and logs this error.

### Cause 2

Faulty device-side logic causes the device to establish the connection when one is already open.

## Solution

This error usually appears as a side effect of a different, transient issue, so look for other errors in the logs to troubleshoot further. Otherwise, make sure to issue a new connection request only if the connection drops.
