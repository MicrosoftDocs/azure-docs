---
title: What is Microsoft Defender for IoT for device builders?
description: Learn about how Microsoft Defender for IoT helps device builders to embed security into new IoT/OT devices.
ms.topic: overview
ms.date: 12/19/2021
#Customer intent: As a device builder, I want to understand how Defender for IoT can help secure my new IoT/OT initiatives.
---

# What is Microsoft Defender for IoT for device builders?

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

For IoT implementers, security is a near-universal concern. IoT devices have unique needs for endpoint monitoring, security posture management, and threat detection – all with highly specific performance requirements.

Microsoft Defender for IoT provides lightweight security agents so that you can build security directly into your new IoT/OT initiatives. The micro agent provides endpoint visibility into security posture management and threat detection, and integrates with other Microsoft tools for unified security management.

- **Security posture management**: You can proactively monitor the security posture of your IoT devices. Defender for IoT provides security posture recommendations based on the CIS benchmark, along with device-specific recommendations. Get visibility into operating system security, including OS configuration, firewall settings, and permissions.
- **Endpoint threat detection**: Detect threats like botnets, brute force attempts, crypto miners, and suspicious network activity. Create custom alerts to target the most important threats in your organization. 
- **IoT Hub integration**: Defender for IoT is enabled by default in every new IoT Hub that is created. Defender for IoT provides real-time monitoring, recommendations, and alerts, without requiring agent installation on any devices. Defender for IoT uses advanced analytics on logged IoT Hub meta data to analyze and protect your field devices and IoT hubs.


## Security posture management


The Defender for IoT micro agent enables you to quickly improve your organization's device security and defense capabilities by offering CIS best practice configurations, along with constant identification of any existing weak links in your OS security posture. CIS benchmark-based OS baseline recommendations help identify issues with device security hygiene, and prioritize changes for security hardening.  

- CIS benchmarks are the best practices for securely configuring a target system. CIS benchmarks are developed through a unique, consensus-based process, comprised of cybersecurity professionals and subject matter experts around the world.
- CIS benchmarks are the only consensus-based, best-practice security configuration guides that are both developed, and accepted by government, business, industry, and academia.



## Defender for IoT micro agent

The Defender for IoT micro agent provides deep security protection, and visibility into device behavior.

- The micro agent collects, aggregates, and analyzes raw security events from your devices. Events can include IP connections, process creation, user logons, and other security-relevant information.
- Defender for IoT device agents handle event aggregation, to help avoid high network throughput.
- The micro agent has flexible deployment options. The micro agent includes source code, so you can incorporate it into firmware, or customize it to include only what you need. It's also available as a binary package, or integrated directly into other Azure IoT solutions. The micro agent is available for standard IoT operating systems, such as Linux and Azure RTOS.
- The agents are highly customizable, allowing you to use them for specific tasks, such as sending only important information at the fastest SLA, or for aggregating extensive security information and context into larger segments, avoiding higher service costs.


## IoT Hub integration

- Device agents, and other applications use the **Azure send security message SDK** to send security information into Azure IoT hub. IoT hub gets this information and forwards it to the Defender for IoT service.
- Once the Defender for IoT service is enabled, in addition to the forwarded data, IoT hub also sends out all of its internal data for analysis by Defender for IoT. This data includes device-cloud operation logs, device identities, and hub configuration. All of this information helps to create the Defender for IoT analytics pipeline.

## Analytics pipeline

The Defender for IoT analytics pipeline also receives other threat intelligence streams from various sources within Microsoft and Microsoft partners. The entire analytics pipeline works with every customer configuration made on the service, such as custom alerts and use of the send security message SDK.

Using the analytics pipeline, Defender for IoT combines all streams of information to generate actionable recommendations and alerts. The pipeline contains both custom rules created by security researchers and experts, as well as   machine learning models searching for deviation from standard device behavior, and risk analysis.


:::image type="content" source="media/overview/micro-agent-architecture.png" alt-text="The micro agent architecture.":::

## Next steps

[Review the agent portfolio](concept-agent-portfolio-overview-os-support.md)
