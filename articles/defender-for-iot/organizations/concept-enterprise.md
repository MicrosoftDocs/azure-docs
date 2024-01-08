---
title: Securing IoT devices | Microsoft Defender for IoT
description: Learn how integrating Microsoft Defender for Endpoint and Microsoft Defender for IoT's security content enhances your IoT network security.
ms.topic: concept-article
ms.date: 09/13/2023
ms.custom: enterprise-iot
#CustomerIntent: As a Defender for IoT customer, I want to understand how I can secure my enterprise IoT devices with Microsoft Defender for IoT so that I can protect my organization from IoT threats.
---

# Securing IoT devices in the enterprise

The number of IoT devices continues to grow exponentially across enterprise networks, such as printers, Voice over Internet Protocol (VoIP) devices, smart TVs, and conferencing systems scattered around many office buildings. 

While the number of IoT devices continues to grow, they often lack the security safeguards that are common on managed endpoints like laptops and mobile phones. To bad actors, these unmanaged devices can be used as a point of entry for lateral movement or evasion, and too often, the use of such tactics leads to the exfiltration of sensitive information.

[Microsoft Defender for IoT](./index.yml) seamlessly integrates with [Microsoft Defender XDR](/microsoft-365/security/defender) and [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) to provide both IoT device discovery and security value for IoT devices, including purpose-built alerts, recommendations, and vulnerability data.

## Enterprise IoT security in Microsoft Defender XDR

Enterprise IoT security in Microsoft Defender XDR provides IoT-specific security value, including alerts, risk and exposure levels, vulnerabilities, and recommendations in Microsoft Defender XDR.

- If you're a Microsoft 365 E5 (ME5)/ E5 Security and Defender for Endpoint P2 customer, [toggle on support](eiot-defender-for-endpoint.md) for **Enterprise IoT Security** in the Microsoft Defender Portal.

- If you don't have ME5/E5 Security licenses, but you're a Microsoft Defender for Endpoint customer, start with a [free trial](billing.md#free-trial) or purchase standalone, per-device licenses to gain the same IoT-specific security value.

:::image type="content" source="media/enterprise-iot/architecture-endpoint-only.png" alt-text="Diagram of the service architecture when you have an Enterprise IoT plan added to Defender for Endpoint." border="false":::

### Alerts

Most Microsoft Defender for Endpoint network-based detections are also relevant for Enterprise IoT devices. For example, network-based detections include alerts for scans involving managed endpoints.

For more information, see [Alerts queue in Microsoft 365 Defender](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response).

### Recommendations

The following Defender for Endpoint security recommendations are supported for Enterprise IoT devices:
- **Require authentication for Telnet management interface**
- **Disable insecure administration protocol – Telnet**
- **Remove insecure administration protocols SNMP V1 and SNMP V2**
- **Require authentication for VNC management interface**

For more information, see [Security recommendations](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation).

## Frequently asked questions

This section provides a list of frequently asked questions about securing Enterprise IoT networks with Microsoft Defender for IoT.

### What is the difference between OT and Enterprise IoT?

- **Operational Technology (OT)**: OT network sensors use agentless, patented technology to discover, learn, and continuously monitor network devices for a deep visibility into Operational Technology (OT) / Industrial Control System (ICS) risks. Sensors carry out data collection, analysis, and alerting on-site, making them ideal for locations with low bandwidth or high latency.

- **Enterprise IoT**: Enterprise IoT provides visibility and security for IoT devices in the corporate environment.

    Enterprise IoT network protection extends agentless features beyond operational environments, providing coverage for all IoT devices in your environment. For example, an enterprise IoT environment might include printers, cameras, and purpose-built, proprietary, devices.

### Which devices are supported for Enterprise IoT security?

Enterprise IoT security encompasses a broad spectrum of devices, identified by Defender for Endpoint using both passive and active discovery methods. 

The supported devices include an extensive range of hardware models and vendors, spanning corporate IoT devices such as printers, cameras, and VoIP phones, among others.

For more information, see [Defender for IoT devices](billing.md#defender-for-iot-devices).

### How can I start using Enterprise IoT?

Microsoft E5 (ME5) and E5 Security customers already have devices supported for enterprise IoT security. If you only have a Defender for Endpoint P2 license, you can purchase standalone, per-device licenses for enterprise IoT monitoring, or use a trial.

For more information, see:

- [Get started with enterprise IoT monitoring in Microsoft Defender XDR](eiot-defender-for-endpoint.md)
- [Manage enterprise IoT monitoring support with Microsoft Defender for IoT](manage-subscriptions-enterprise.md)

### What permissions do I need to use Enterprise IoT security with Defender for IoT?

For information on required permissions, see [Prerequisites](eiot-defender-for-endpoint.md#prerequisites).

### Which devices are billable?

For more information, see [Devices monitored by Defender for IoT](architecture.md#devices-monitored-by-defender-for-iot).

### How should I estimate the number of devices I want to monitor?

For more information, see [Calculate monitored devices for Enterprise IoT monitoring](manage-subscriptions-enterprise.md#calculate-monitored-devices-for-enterprise-iot-monitoring).

### How can I cancel Enterprise IoT?

For more information, see [Turn off enterprise IoT security](manage-subscriptions-enterprise.md#turn-off-enterprise-iot-security).

### What happens when the trial ends?

If you haven't added a standalone license by the time your trial ends, your trial is automatically canceled, and you lose access to Enterprise IoT security features.

For more information, see [Defender for IoT subscription billing](billing.md).

### How can I resolve billing issues associated with my Defender for IoT plan?

For any billing or technical issues, open a support ticket for Microsoft Defender XDR.

## Related content

For more information, see:

- [Get started with enterprise IoT monitoring in Microsoft 365 Defender](eiot-defender-for-endpoint.md)
- [Defender for IoT subscription billing](billing.md)
- [Device discovery overview](/microsoft-365/security/defender-endpoint/device-discovery)
- [Alerts queue in Microsoft 365 Defender](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response)
- [Security recommendations](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation)
- [Vulnerabilities in my organization](/microsoft-365/security/defender-vulnerability-management/tvm-weaknesses)
- [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Proactively hunt with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)

## Next steps

Start securing your Enterprise IoT network resources with by [onboarding to Defender for IoT from Microsoft Defender XDR](eiot-defender-for-endpoint.md).
