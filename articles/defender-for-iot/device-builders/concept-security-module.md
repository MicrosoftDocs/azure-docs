---
title: Defender-IoT-micro-agent and device twins
description: Learn about the concept of Defender-IoT-micro-agent twins and how they're used in Defender for IoT.
ms.topic: conceptual
ms.date: 03/28/2022
---

# Defender-IoT-micro-agent

This article explains how Defender for IoT uses device twins and modules.

## Device twins

For IoT solutions built in Azure, device twins play a key role in both device management and process automation.

Defender for IoT offers full integration with your existing IoT device management platform, enabling you to manage your device security status as well as make use of existing device control capabilities. Integration is achieved by making use of the IoT Hub twin mechanism.

Learn more about the concept of [Device twins](../../iot-hub/iot-hub-devguide-device-twins.md#device-twins) in Azure IoT Hub.

## Defender-IoT-micro-agent twins

Defender for IoT maintains a Defender-IoT-micro-agent twin for each device in the service.
The Defender-IoT-micro-agent twin holds all the information relevant to device security for each specific device in your solution.
Device security properties are maintained in a dedicated Defender-IoT-micro-agent twin for safer communication and for enabling updates and maintenance that requires fewer resources.

See [Create Defender-IoT-micro-agent twin](quickstart-create-security-twin.md) and [Configure security agents](how-to-agent-configuration.md) to learn how to create, customize, and configure the twin. See [Understand and use module twins in IoT Hub](../../iot-hub/iot-hub-devguide-module-twins.md) to learn more about the concept of module twins in IoT Hub.

## See also

- [Defender for IoT overview](overview.md)
- [Deploy security agents](how-to-deploy-agent.md)
- [Security agent authentication methods](concept-security-agent-authentication-methods.md)
