---
title: Standalone micro agent overview (Preview)
description: The Azure Defender for IoT security agents allows you to build security directly into your new IoT devices and Azure IoT projects.
ms.date: 11/04/2021
ms.topic: article
---

# Standalone micro agent overview (Preview)

Security is a near-universal concern for IoT implementers. IoT devices have unique needs for endpoint monitoring, security posture management, and threat detection – all with highly specific performance requirements.

The Azure Defender for IoT security agents allows you to build security directly into your new IoT devices and Azure IoT projects. The micro agent has flexible deployment options, including the ability to deploy as a binary package or modify source code. And the micro agent is available for standard IoT operating systems like Linux and Azure RTOS.

The Azure Defender for IoT micro agent provides endpoint visibility into security posture management, threat detection, and integration into Microsoft's other security tools for unified security management.

## Security posture management

Proactively monitor the security posture of your IoT devices. Azure Defender for IoT provides security posture recommendations based on the CIS benchmark, along with device-specific recommendations. Get visibility into operating system security, including OS configuration, firewall configuration, and permissions.

## Endpoint IoT and OT threat detection

Detect threats like botnets, brute force attempts, crypto miners, and suspicious network activity. Create custom alerts to target the most important threats in your unique organization.

## Flexible distribution and deployment models

The Azure Defender for IoT micro agent includes source code, allowing you to incorporate the micro agent into firmware, or customize it to include only what you need. Micro agent is also available as a binary package, or integrated directly into other Azure IoT solutions.

## Meets the needs of your IoT devices, with minimal impact

The Azure Defender for IoT micro agent is easy to deploy, and has minimal performance impact on the endpoint. With Defender for IoT micro agent you can:

- **Optimize for performance**: The Azure Defender for IoT micro agent has a small footprint and low CPU consumption.  

- **Plug and Play**: There are no specific OS kernel dependencies, or support necessary for all major IoT operating systems. Azure Defender for IoT micro agent meets your devices where they are.

- **Flexible deployment**: As a standalone agent, Azure Defender for IoT’s micro agent supports different distribution models and flexible deployment.

## Data processing and residency

> [!Note]
> Azure Defender for IoT data processing and residency may take place in a region that is different than the IoT Hub region. Azure Defender for IoT is using device twin, unmasked IP and additional configuration data as part of its security detection logic.

Azure Defender for IoT data processing, and residency can occur in regions that are different than the IoT Hub's region. The mapping between the IoT Hub, and Azure Defender for IoT regions is as follows;

- For a Hub located in Europe, the data is stored in the *West Europe* region.

- For a Hub located outside Europe, the data is stored in the *East US* region.

Azure Defender for IoT, uses the device twin, unmasked IP addresses, and additional configuration data as part of its security detection logic by default. To disable the device twin, and unmask the IP address collection, navigate to the data collection's settings page.

:::image type="content" source="media/data-collection-settings.png" alt-text="Screenshot of the data collections setting page.":::

For additional details, see how to [customize your Defender for IoT solution](concept-micro-agent-configuration.md).

## Next steps

Check your [Micro agent authentication methods (Preview)](concept-security-agent-authentication.md).
