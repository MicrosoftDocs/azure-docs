---
title: Security agent overview
description: Get started with understanding, configuring, deploying and using Azure Defender for IoT security service agents on your IoT devices.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''


ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/23/2019
ms.author: mlottner
---

# Get started with Azure Defender for IoT device security agents

Defender for IoT security agents offer enhanced security capabilities, such as monitoring remote connections, active applications, login events, and operating system configuration best practices. Take control of your device field threat protection and security posture with a single service.

Reference architecture for Linux and Windows security agents, both in C# and C are provided.

The Defender for IoT security agents handle raw event collection from the device operating system, event aggregation to reduce cost, and configuration through a device module twin. Security messages are sent through your IoT Hub, into Defender for IoT analytics services.

Use the following workflow to deploy and test your Defender for IoT security agents:

1. [Enable Defender for IoT service to your IoT Hub](quickstart-onboard-iot-hub.md)
1. If your IoT Hub has no registered devices, [Register a new device](https://docs.microsoft.com/azure/iot-accelerators/quickstart-device-simulation-deploy).
1. [Create an azureiotsecurity security module](quickstart-create-security-twin.md) for your devices.
1. To install the agent on an Azure simulated device instead of installing on an actual device, [spin up a new Azure Virtual Machine (VM)](https://docs.microsoft.com/azure/virtual-machines/linux/quick-create-portal) in an available zone.
1. [Deploy an Defender for IoT security agent](how-to-deploy-linux-cs.md) on your IoT device, or new VM.
1. Follow the instructions for [trigger_events](https://aka.ms/iot-security-github-trigger-events) to run a harmless simulation of an attack.
1. Verify Defender for IoT alerts in response to the simulated attack in the previous step. Begin verification five minutes after running the script.
1. Explore [alerts](concept-security-alerts.md), [recommendations](concept-recommendations.md), and [deep dive using Log Analytics](how-to-security-data-access.md) using IoT Hub.

## Next steps

- Configure your [solution](quickstart-configure-your-solution.md)
- [Create security modules](quickstart-create-security-twin.md)
- Configure [custom alerts](quickstart-create-custom-alerts.md)
- [Deploy a security agent](how-to-deploy-agent.md)
