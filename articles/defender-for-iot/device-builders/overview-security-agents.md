---
title: Security agents
description: Get started with understanding, configuring, deploying, and using Microsoft Defender for IoT security service agents on your IoT devices.
ms.topic: conceptual
ms.date: 03/28/2022
---

# Get started with Microsoft Defender for IoT device micro agents


Defender for IoT security agents offers enhanced security capabilities, such as monitoring operating system configuration best practices. Take control of your device field threat protection and security posture with a single service.

The Defender for IoT security agents handle raw event collection from the device operating system, event aggregation to reduce cost, and configuration through a device module twin. Security messages are sent through your IoT Hub, into Defender for IoT analytics services.

Use the following workflow to deploy and test your Defender for IoT security agents:

1. [Enable Defender for IoT service to your IoT Hub](quickstart-onboard-iot-hub.md).

1. If your IoT Hub has no registered devices, [Register a new device](/previous-versions/azure/iot-accelerators/iot-accelerators-device-simulation-overview).

1. [Create a DefenderIotMicroAgent module twin](quickstart-create-micro-agent-module-twin.md) for your devices.

1. To install the agent on an Azure simulated device instead of installing on an actual device, [spin up a new Azure Virtual Machine (VM)](../../virtual-machines/linux/quick-create-portal.md).

1. [Deploy a Defender for IoT security agent](how-to-deploy-linux-cs.md) on your IoT device, or new VM.

1. Follow the instructions for [trigger_events](https://aka.ms/iot-security-github-trigger-events) to run an OS baseline event.

1. Verify Defender for IoT recommendations in response to the simulated OS baseline check failure in the previous step. Begin verification 30 minutes after running the script.

## Next steps

- Configure your [solution](quickstart-configure-your-solution.md)
- [Create Defender-IoT-micro-agents](quickstart-create-security-twin.md)
- Configure [custom alerts](quickstart-create-custom-alerts.md)
- [Deploy a security agent](how-to-deploy-agent.md)
