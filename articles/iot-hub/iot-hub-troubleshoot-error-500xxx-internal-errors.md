---
title: Troubleshooting Azure IoT Hub 500xxx Internal errors
description: Understand how to fix 500xxx Internal errors 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 01/30/2020
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 500xxx Internal errors.
---

# 500xxx Internal errors

This article describes the causes and solutions for **500xxx Internal errors**.

## Symptoms

Your request to IoT Hub fails with an error that begins with 500 and/or some sort of "server error". Some possibilities are:

* **500001 ServerError**: IoT Hub ran into a server-side issue.

* **500008 GenericTimeout**: IoT Hub couldn't complete the connection request before timing out.

* **ServiceUnavailable (no error code)**: IoT Hub encountered an internal error.

* **InternalServerError (no error code)**: IoT Hub encountered an internal error.

## Cause

There can be a number of causes for a 500xxx error response. In all cases, the issue is most likely transient. While the IoT Hub team works hard to maintain [the SLA](https://azure.microsoft.com/support/legal/sla/iot-hub/), small subsets of IoT Hub nodes can occasionally experience transient faults. When your device tries to connect to a node that's having issues, you receive this error.

## Solution

To mitigate 500xxx errors, issue a retry from the device. To [automatically manage retries](./iot-hub-reliability-features-in-sdks.md#connection-and-retry), make sure you use the latest version of the [Azure IoT SDKs](./iot-hub-devguide-sdks.md). For best practice on transient fault handling and retries, see [Transient fault handling](https://docs.microsoft.com/azure/architecture/best-practices/transient-faults).  If the problem persists, check [Resource Health](./iot-hub-monitor-resource-health.md#use-azure-resource-health) and [Azure Status](https://status.azure.com/) to see if IoT Hub has a known problem. You can also use the [manual failover feature](./tutorial-manual-failover.md). If there are no known problems and the issue continues, [contact support](https://azure.microsoft.com/support/options/) for further investigation.
