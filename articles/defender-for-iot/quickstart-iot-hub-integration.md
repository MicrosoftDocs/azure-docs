---
title: Onboard to Defender for IoT agent-based solution
description: Get started with the built-in workflow of the Defender for IoT service.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
<<<<<<< Updated upstream
author: mlottner
=======
author: shhazam-ms
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
<<<<<<< Updated upstream
ms.date: 12/14/2020
ms.author: mlottner
---

# Get started with built-in IoT Hub integration

This option enables you to use the service without using Defender for IoT security agents.

## Enable built-in IoT Hub integration

To enable monitoring your device identity management, device to cloud, and cloud to device communication patterns, do the following to start the service:

1. Open your **IoT Hub**.
1. Select the **Security overview** menu.
1. Click **Secure your IoT solution** and complete the onboarding form.
=======
ms.date: 1/24/2021
ms.author: shhazam
---

# Onboard to Defender for IoT agent-based solution

This article describes how to enable the Defender for IoT service on your existing IoT Hub. To create an IoT Hub, see [Create an IoT Hub using the Azure portal](../iot-hub/iot-hub-create-through-portal.md) to get started.

The gateway, by which, to manage your IoT security is through the Defender for IoTs, IoT Hub. The management portal in the IoT Hub gives you the ability to: 

1. Manage your IoT Hub security.

1. Manage your IoT devices security, without having to install an agent-based IoT Hub telemetry.

1. Advance management of your IoT device's security based on the micro agent.

> [!Note]
> The Defender for IoT agent based offering only supports standard tier IoT Hubs.

## Onboard to Defender for IoT in IoT Hub

### Onboard Defender for IoT to a new IoT Hub

Defender for IoT is on by default for all newly created IoT Hubs. During the IoT Hub creation, make sure “Defender for IoT” toggle is turned on: 

:::image type="content" source="media/onboard-to-defender-for-iot-agent-based-solution/turn-on.png" alt-text="Ensure that the Defender for IoT is toggled to on.":::

### Onboard Defender for IoT to an existing IoT Hub 

To enable monitoring for your device identity management, device to cloud, and cloud to device communication patterns, follow these steps:

1. Open your **IoT Hub**.

1. Select the **Security overview** menu.

1. Select **Secure your IoT solution** and complete the onboarding form.
>>>>>>> Stashed changes

Congratulations! You've completed enabling the Defender for IoT service on your IoT Hub.

## Next steps

- Configure your [solution](quickstart-configure-your-solution.md)
- [Create security modules](quickstart-create-security-twin.md)
- Configure [custom alerts](quickstart-create-custom-alerts.md)
