---
title: Overview - Microsoft Defender for IoT for organizations
description: Learn about Microsoft Defender for IoT's features for end-user organizations and comprehensive IoT security for OT and Enterprise IoT networks.
ms.topic: overview
ms.date: 12/25/2022
ms.custom: enterprise-iot
---

# Welcome to Microsoft Defender for IoT for organizations

> [!NOTE]
> OT monitoring with Microsoft Defender for IoT is now available for purchase with site-based licenses, purchased on the Microsoft 365 admin center.

The Internet of Things (IoT) supports billions of connected devices that use both operational technology (OT) and IoT networks. IoT/OT devices and networks are often built using specialized protocols, and may prioritize operational challenges over security.

When IoT/OT devices can't be protected by traditional security monitoring systems, each new wave of innovation increases the risk and possible attack surfaces across those IoT devices and OT networks.

Microsoft Defender for IoT is a unified security solution built specifically to identify IoT and OT devices, vulnerabilities, and threats. Use Defender for IoT to secure your entire IoT/OT environment, including existing devices that may not have built-in security agents.

Defender for IoT provides agentless, network layer monitoring, and integrates with both industrial equipment and security operation center (SOC) tools.

:::image type="content" source="media/overview/end-to-end-coverage.png" alt-text="Diagram showing an example of Defender for IoT's end-to-end coverage solution.":::

## Agentless device monitoring

If your IoT and OT devices don't have embedded security agents, they may remain unpatched, misconfigured, and invisible to IT and security teams. Un-monitored devices can be soft targets for threat actors looking to pivot deeper into corporate networks.

Defender for IoT uses agentless monitoring to provide visibility and security across your network, and identifies specialized protocols, devices, or machine-to-machine (M2M) behaviors.

- **Discover IoT/OT devices** in your network, their details, and how they communicate. Gather data from network sensors, Microsoft Defender for Endpoint, and third-party sources.

- **Assess risks and manage vulnerabilities** using machine learning, threat intelligence, and behavioral analytics. For example:

  - Identify unpatched devices, open ports, unauthorized applications, unauthorized connections, changes to device configurations, PLC code, firmware, and more.

  - Run searches in historical traffic across all relevant dimensions and protocols. Access full-fidelity PCAPs to drill down further.

  - Detect advanced threats that you may have missed by static indicators of compromise (IOCs), such as zero-day malware, fileless malware, and living-off-the-land tactics.

- **Respond to threats** by integrating with Microsoft services such as Microsoft Sentinel, other partner systems, and APIs. Integrate with security information and event management (SIEM) services, security operations and response (SOAR) services, extended detection and response (XDR) services, and more.

Defender for IoT's centralized user experience in the Azure portal lets the security and OT monitoring teams visualize and secure all their IT, IoT, and OT devices regardless of where the devices are located.

## Support for cloud, on-premises, and hybrid OT networks

Install OT network sensors on-premises, at strategic locations in your network to detect devices across your entire OT environment. Then, use any of the following configurations to view your devices and security value:

- **Cloud services**:

    While OT network sensors have their own UI console that displays details and security data about detected devices, connect your sensors to Azure to extend your journey to the cloud.

    From the Azure portal, view data from all connected sensors in a central location, and integrate with other Microsoft services, like Microsoft Sentinel.

- **Air-gapped and on-premises services**:

    If you have an air-gapped environment and want to keep all your OT network data fully on-premises, connect your OT network sensors to an on-premises management console for central visibility and control.

    Continue to view detailed device data and security value in each sensor console.

- **Hybrid services**:

    You may have hybrid network requirements where you can deliver some data to the cloud and other data must remain on-premises.

    In this case, set up your system in a flexible and scalable configuration to fit your needs. Connect some of your OT sensors to the cloud and view data on the Azure portal, and keep other sensors managed on-premises only.

For more information, see [System architecture for OT system monitoring](architecture.md).

## Extend support to proprietary OT protocols

IoT and industrial control system (ICS) devices can be secured using both embedded protocols and proprietary, custom, or non-standard protocols. If you have devices that run on protocols that aren't supported by Defender for IoT out-of-the-box, use the Horizon Open Development Environment (ODE) SDK to develop dissector plug-ins to decode network traffic for your protocols.

Create custom alerts for your plugin to pinpoint specific network activity and effectively update your security, IT, and operational teams. For example, have alerts triggered when:

- The sensor detects a write command to a memory register on a specific IP address and Ethernet destination.
- Any access is performed to a specific IP address.

For more information, see [Manage proprietary protocols with Horizon plugins](resources-manage-proprietary-protocols.md).

## Protect enterprise IoT networks

Extend Defender for IoT's agentless security features beyond OT environments to enterprise IoT devices. Add an Enterprise IoT plan in Microsoft Defender for Endpoint for added alerts, vulnerabilities, and recommendations for IoT devices in Defender for Endpoint. An Enterprise IoT plan also provides a shared device inventory across the Azure portal and Microsoft 365 Defender.

Enterprise IoT devices can include devices such as printers, smart TVs, and conferencing systems and purpose-built, proprietary devices.

For more information, see [Securing IoT devices in the enterprise](concept-enterprise.md).

## Defender for IoT for device builders

Defender for IoT also provides a lightweight security micro-agent that you can use to build security straight into your new IoT innovations.

For more information, see the [Microsoft Defender for IoT for device builders documentation](../device-builders/overview.md).

## Supported service regions

Defender for IoT routes all traffic from all European regions to the *West Europe* regional datacenter. It routes traffic from all remaining regions to the *East US* regional datacenter.

## Next steps

> [!div class="nextstepaction"]
> [View ICS/OT Security videos](https://www.youtube.com/playlist?list=PLmAptfqzxVEXz5txCCKYUdpQETAMpeOhu)

> [!div class="nextstepaction"]
> [Get started with OT security monitoring](getting-started.md)

> [!div class="nextstepaction"]
> [Get started with Enterprise IoT security monitoring](eiot-defender-for-endpoint.md)
