---
title: Defender for IoT azureiotsecurity for IoT Edge
description: Understand the architecture and capabilities of Microsoft Defender for IoT azureiotsecurity for IoT Edge.
ms.topic: conceptual
ms.date: 03/28/2022
---

# Microsoft Defender for IoT Edge azureiotsecurity

[Azure IoT Edge](../../iot-edge/index.yml) provides powerful capabilities to manage and perform business workflows at the edge. The key part that IoT Edge plays in IoT environments make it particularly attractive for malicious actors.

Defender for IoT azureiotsecurity provides a comprehensive security solution for your IoT Edge devices. Defender for IoT module collects, aggregates and analyzes raw security data from your Operating System and container system into actionable security recommendations and alerts.

Similar to Defender for IoT security agents for IoT devices, the Defender for IoT Edge module is highly customizable through its module twin. See [Configure your agent](how-to-agent-configuration.md) to learn more.

Defender for IoT azureiotsecurity for IoT Edge offers the following features:

- Collects raw security events from the underlying Operating System (Linux), and the IoT Edge Container systems.

  See [Defender for IoT agent configuration](how-to-agent-configuration.md) to learn more about available security data collectors.

- Analysis of IoT Edge deployment manifests.

- Aggregates raw security events into messages sent through [IoT Edge Hub](../../iot-edge/iot-edge-runtime.md#iot-edge-hub).

- Remove configuration through use of the azureiotsecurity twin.

  See [Configure a Defender for IoT agent](how-to-agent-configuration.md) to learn more.

Defender for IoT azureiotsecurity for IoT Edge runs in a privileged mode under IoT Edge. Privileged mode is required to allow the module to monitor the Operating System, and other IoT Edge modules.

## Module supported platforms

Defender for IoT azureiotsecurity for IoT Edge is currently only available for Linux.

## Next steps

In this article, you learned about the architecture and capabilities of Defender for IoT azureiotsecurity for IoT Edge.

To continue getting started with Defender for IoT deployment, use the following articles:

- Deploy [azureiotsecurity for IoT Edge](how-to-deploy-edge.md)
- Learn how to [configure your Defender-IoT-micro-agent](how-to-agent-configuration.md)
- Learn how to [Enable Defender for IoT service in your IoT Hub](quickstart-onboard-iot-hub.md)
- Learn more about the service from the [Defender for IoT FAQ](resources-agent-frequently-asked-questions.md)
