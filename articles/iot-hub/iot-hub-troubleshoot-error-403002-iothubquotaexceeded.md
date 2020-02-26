---
title: Troubleshooting Azure IoT Hub error 403002 IoTHubQuotaExceeded
description: Understand how to fix error 403002 IoTHubQuotaExceeded 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 01/30/2020
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 403002 IoTHubQuotaExceeded errors.
---

# 403002 IoTHubQuotaExceeded

This article describes the causes and solutions for **403002 IoTHubQuotaExceeded** errors.

## Symptoms

All requests to IoT Hub fail with the error  **403002 IoTHubQuotaExceeded**. In Azure portal, the IoT hub device list doesn't load.

## Cause

The daily message quota for the IoT hub is exceeded. 

## Solution

[Upgrade or increase the number of units on the IoT hub](iot-hub-upgrade.md) or wait for the next UTC day for the daily quota to refresh.

## Next steps

* To understand how operations are counted toward the quota, such as twin queries and direct methods, see [Understand IoT Hub pricing](iot-hub-devguide-pricing.md#charges-per-operation)
* To set up monitoring for daily quota usage, set up an alert with the metric *Total number of messages used*. For step-by-step instructions, see [Set up metrics and alerts with IoT Hub](tutorial-use-metrics-and-diags.md#set-up-metrics)