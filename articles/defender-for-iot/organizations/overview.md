---
title: Overview - Microsoft Defender for IoT for organizations
description: Learn about Microsoft Defender for IoT's features for end-user organizations and comprehensive IoT security for OT and Enterprise IoT networks.
ms.topic: overview
ms.date: 06/02/2022
ms.custom: ignite-fall-2021
---

# Welcome to Microsoft Defender for IoT for organizations

The Internet of Things (IoT) supports billions of connected devices that use operational technology (OT) networks. IoT/OT devices and networks are often designed without prioritizing security, and therefore can't be protected by traditional systems. With each new wave of innovation, the risk to IoT devices and OT networks increases the possible attack surfaces.

Microsoft Defender for IoT is a unified security solution for identifying IoT and OT devices, vulnerabilities, and threats. With Defender for IoT, you can manage them through a central interface. This set of documentation describes how end-user organizations can secure their entire IoT/OT environment, including protecting existing devices or building security into new IoT innovations.

:::image type="content" source="media/overview/end-to-end-coverage.png" alt-text="Diagram showing an example of Defender for IoT's end-to-end coverage solution.":::

**For end-user organizations**, Microsoft Defender for IoT provides an agentless, network-layer monitoring that integrates smoothly with industrial equipment and SOC tools. You can deploy Microsoft Defender for IoT in Azure-connected and hybrid environments, or completely on-premises.

**For IoT device builders**, Microsoft Defender for IoT also offers a lightweight micro-agent that supports standard IoT operating systems, such as Linux and RTOS. The Microsoft Defender device builder agent helps you ensure that security is built into your IoT/OT projects, from the cloud. For more information, see [Microsoft Defender for IoT for device builders documentation](../device-builders/overview.md).

## Agentless device monitoring

Many legacy IoT and OT devices don't support agents, and can therefore remain unpatched, misconfigured, and invisible to IT teams. These devices become soft targets for threat actors who want to pivot deeper into corporate networks.

Traditional network security monitoring tools may lack understanding of networks containing specialized protocols, devices, and relevant machine-to-machine (M2M) behaviors. Agentless monitoring in Defender for IoT provides visibility and security into those networks.

- **Discover IoT/OT devices** in your network, their details, and how they communicate. Gather data from network sensors, Microsoft Defender for Endpoint, and third-party sources.

- **Assess risks and manage vulnerabilities** using machine learning, threat intelligence, and behavioral analytics. For example:

  - Identify unpatched devices, open ports, unauthorized applications, unauthorized connections, changes to device configurations, PLC code, firmware, and more.

  - Run searches in historical traffic across all relevant dimensions and protocols. Access full-fidelity PCAPs to drill down further.

  - Detect advanced threats that you may have missed by static IOCs, such as zero-day malware, fileless malware, and living-off-the-land tactics.

- **Respond to threats** by integrating with Microsoft services, such as Microsoft Sentinel, non-Microsoft systems, and APIs. Use advanced integrations for security information and event management (SIEM), security operations and response (SOAR), extended detection and response (XDR) services, and more.

A centralized user experience lets the security team visualize and secure all their IT, IoT, and OT devices regardless of where the devices are located.

## Support for cloud, on-premises, and hybrid networks

Defender for IoT can support various network configurations:

- **Cloud**: Extend your journey to the cloud by delivering your data to Azure. There you can visualize data from a central location. That data can be shared with other Microsoft services for end-to-end security monitoring and response.

- **On-premises**: For example, in air-gapped environments, you might want to keep all of your data fully on-premises. Use the data provided by each sensor and the central visualizations provided by an on-premises management console to ensure security on your network.

- **Hybrid**: You may have hybrid network requirements where you can deliver some data to the cloud and other data must remain on-premises. In this case, set up your system in a flexible and scalable configuration that fits your needs.

Regardless of configuration, data detected by a specific sensor is also always available in the sensor console.

## Extend support to proprietary protocols

IoT and ICS devices can be secured using both embedded protocols and proprietary, custom, or non-standard protocols. Use the Horizon Open Development Environment (ODE) SDK to develop dissector plug-ins that decode network traffic, regardless of protocol type.

For example, in an environment running MODBUS, you can generate an alert when the sensor detects a write command to a memory register on a specific IP address and Ethernet destination. Or you might want to generate an alert when any access is performed to a specific IP address. Alerts are triggered when Horizon alert rule conditions are met.

Use custom, condition-based alert triggering and messaging to help pinpoint specific network activity and effectively update your security, IT, and operational teams.
Contact [ms-horizon-support@microsoft.com](mailto:ms-horizon-support@microsoft.com) for details about working with the Open Development Environment (ODE) SDK and creating protocol plugins.

## Protect enterprise networks

Microsoft Defender for IoT can protect IoT and OT devices, whether they're connected to IT, OT, or dedicated IoT networks.

Enterprise IoT network protection extends agentless features beyond operational environments, providing coverage for all IoT devices in your environment. For example, an enterprise IoT environment may include printers, cameras, and purpose-built, proprietary, devices.

When you expand Microsoft Defender for IoT into the enterprise network, you can apply Microsoft 365 Defender's features for asset discovery and use Microsoft Defender for Endpoint for a single, integrated package that can secure all of your IoT/OT infrastructure.

Use Microsoft Defender for IoT's sensors as extra data sources. They provide visibility in areas of your organization's network where Microsoft Defender for Endpoint isn't deployed, and when employees are accessing information remotely. Microsoft Defender for IoT's sensors provide visibility into both the IoT-to-IoT and the IoT-to-internet communications. Integrating Defender for IoT and Defender for Endpoint synchronizes any enterprise IoT devices discovered on the network by either service.

For more information, see the [Microsoft 365 Defender](/microsoft-365/security/defender/microsoft-365-defender) and [Microsoft Defender for Endpoint documentation](/microsoft-365/security/defender-endpoint).

## Next steps

For more information, see:

- [ICS/OT Security video series](https://www.youtube.com/playlist?list=PLmAptfqzxVEXz5txCCKYUdpQETAMpeOhu)
- [OT threat monitoring in enterprise SOCs](concept-sentinel-integration.md)
- [Microsoft Defender for IoT architecture](architecture.md)
- [Quickstart: Get started with Defender for IoT](getting-started.md)
