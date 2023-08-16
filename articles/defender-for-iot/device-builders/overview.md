---
title: What is Microsoft Defender for IoT for device builders?
description: Learn about how Microsoft Defender for IoT helps device builders to embed security into new IoT/OT devices.
ms.topic: overview
ms.date: 01/12/2023
#Customer intent: As a device builder, I want to understand how Defender for IoT can help secure my new IoT/OT initiatives.
---

# What is Microsoft Defender for IoT for device builders?

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

For IoT implementers, security is a near-universal concern. IoT devices have unique needs for endpoint monitoring, security posture management, and threat detection – all with highly specific performance requirements.

Microsoft Defender for IoT provides lightweight security agents so that you can build security directly into your new IoT/OT initiatives. The micro agent provides endpoint visibility into security posture management and threat detection, and integrates with other Microsoft tools for unified security management.

- **Security posture management**: Monitor the security posture of your IoT devices. Defender for IoT provides security posture recommendations based on the CIS benchmark, along with device-specific recommendations. Get visibility into operating system security, including OS configuration, firewall settings, and permissions.
- **Endpoint threat detection**: Detect threats like botnets, brute force attempts, crypto miners, hardware connections, and suspicious network activity using the Microsoft TI database.
- **Device vulnerabilities management**: Monitor a full list of device vulnerabilities based on a real-time dynamic SBoM and your operating system.
- **Microsoft Sentinel integration**: Use Microsoft Sentinel to investigate and manage your device security, create custom dashboards and automatic response playbooks.
- **Raw events investigation**: Investigate all the raw events sent from your devices in your Log Analytics workspace.

## Defender for IoT micro agent

The Defender for IoT micro agent provides deep security protection, and visibility into device behavior.

- The micro agent collects, aggregates, and analyzes raw security events from your devices. Events can include IP connections, process creation, user logons, and other security-relevant information.
- Defender for IoT device agents handle event aggregation, to help avoid high network throughput.
- The micro agent has flexible deployment options. The micro agent includes source code, so you can incorporate it into firmware, or customize it to include only what you need. It's also available as a binary package, or integrated directly into other Azure IoT solutions. The micro agent is available for standard IoT operating systems, such as Linux and Azure RTOS.
- The agents are highly customizable, allowing you to use them for specific tasks, such as sending only important information at the fastest SLA, or for aggregating extensive security information and context into larger segments, avoiding higher service costs.

:::image type="content" source="media/overview/micro-agent-architecture.png" alt-text="Diagram of the micro agent architecture." lightbox="media/overview/micro-agent-architecture.png":::

## Next steps

[Review the agent portfolio](concept-agent-portfolio-overview-os-support.md)

