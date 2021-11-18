---
title: 'Quickstart: System prerequisites'
description: In this quickstart, get the system prerequisites needed to run Microsoft Defender for IoT.
ms.date: 11/09/2021
ms.topic: quickstart
---

# Quickstart: System prerequisites

This article lists the system prerequisites for running Microsoft Defender for IoT.

## Prerequisites

- None

## Minimum requirements

- Network switches that support traffic monitoring via SPAN port.
- Hardware appliances for NTA sensors.
- The Azure Subscription Contributor role. It's required only during onboarding for defining committed devices and connection to Microsoft Sentinel.
- Azure IoT Hub (Free or Standard tier) **Contributor** role, for cloud-connected management. Make sure that the **Microsoft Defender for IoT** feature is enabled.

## Supported service regions

Defender for IoT routes all traffic from all European regions to the West Europe regional datacenter. It routes traffic from all remaining regions to the Central US regional datacenter.

For more information, see [IoT Hub supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub).

## Next steps

> [!div class="nextstepaction"]
> [Identify required appliances](how-to-identify-required-appliances.md)
