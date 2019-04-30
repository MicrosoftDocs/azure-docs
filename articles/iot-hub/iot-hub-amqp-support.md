---
title: Understand Azure IoT Hub AMQP support | Microsoft Docs
description: Developer guide - support for devices connecting to an IoT Hub device-facing and service-facing endpoints using the AMQP protocol. Includes information about built-in AMQP support in the Azure IoT device SDKs.
author: rezasherafat
manager: 
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/30/2019
ms.author: rezas
---

# Communicate with your IoT hub using the AMQP protocol

IoT Hub supports [AMQP version 1.0](http://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-complete-v1.0-os.pdf) to deliver a variety of functionalities through device-facing and service-facing endpoints. This document describes the use of AMQP clients to connect to IoT Hub in order to use IoT Hub functionality.

## Connection and authenticating to IoT Hub
TBD

## Invoking cloud-to-device messages
The cloud-to-device message exchange between service and IoT Hub as well as between device and IoT Hub is describe [here](iot-hub-devguide-messages-c2d.md). 

| Created by | Link type | Link path | Description |
|------------|-----------|-----------|-------------|
| Service | Sender link | `/messages/devicebound` | C2D messages destined to devices are sent to think link by the service. |
| Service | Receiver link | `/messages/serviceBound/feedback` | Completion, rejection, and abandonment messages coming from devices received on this link by service. |
| Devices | Receiver link | `/devices/<deviceID>/messages/devicebound` | C2D messages destined to devices are received on this link by each destination device. |
| Devices | Sender link | `/messages/serviceBound/feedback` | C2D message feedbacks sent to service over this link by devices. |
| Modules | Receiver link | `/devices/<deviceID>/modules/<moduleID>/messages/devicebound` | C2D messages destined to modules are received on this link by each destination module. |
| Modules | Sender link | `/messages/serviceBound/feedback` | C2D message feedbacks sent to service over this link by modules. |