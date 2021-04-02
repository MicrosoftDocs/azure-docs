---
title: System prerequisites
description: Get system prerequisites needed to run Azure Defender for IoT.
ms.date: 11/30/2020
ms.topic: quickstart
---

# System prerequisites
This article lists the system prerequisites for running Azure Defender for IoT.

## Minimum requirements

- Network switches that support traffic monitoring via SPAN port.
- Hardware appliances for NTA sensors.
- The Azure Subscription Contributor role. It's required only during onboarding for defining committed devices and connection to Azure Sentinel.
- Azure IoT Hub (Free or Standard tier) **Contributor** role, for cloud-connected management. Make sure that the **Azure Defender for IoT** feature is enabled.
- For device-level Defender-IoT-micro-agent support, Defender for IoT agents support a growing list of devices and platforms. See the [list of supported platforms](how-to-deploy-agent.md).

## Supported service regions

Defender for IoT routes all traffic from all European regions to the West Europe regional datacenter. It routes traffic from all remaining regions to the Central US regional datacenter.

For more information, see [IoT Hub supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub).

## See also

- [Identify required appliances](how-to-identify-required-appliances.md)
- [About Azure Defender for IoT network setup](how-to-set-up-your-network.md)
