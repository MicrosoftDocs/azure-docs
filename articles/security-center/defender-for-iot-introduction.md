---
title: Azure Defender for IoT 
description: Learn about Azure Defender for IoT 
author: memildin
ms.author: memildin
ms.date: 9/22/2020
ms.topic: overview
ms.service: security-center
manager: rkarlin

---

# Introduction to Azure Defender for IoT

Unify security management and enable end-to-end threat detection and analysis across hybrid cloud workloads and your Azure IoT solution.

Azure Defender for IoT, provides:

- **Asset discovery and network mapping**, including details like device manufacturer, device type, and how devices  communicate on the network
- **Vulnerability management**, including information about CVEs, open ports, and unauthorized internet connections
- **Continuous threat monitoring**, with real-time alerts indicating any anomalous or unauthorized activity such as targeted attacks or malware

Full details are available in [the dedicated documentation](https://docs.microsoft.com/azure/asc-for-iot/overview).

## Availability
|Aspect|Details|
|----|:----|
|Release state:|Generally available (GA)|
|Pricing:|Requires [Azure Defender](security-center-pricing.md)|
|Required roles and permissions:|Write permissions on the machine’s NSGs|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![Yes](./media/icons/yes-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)|
|||

## What devices can Azure Defender for IoT secure?
By combining the capabilities of Security Center, Azure Defender, and CyberX Agentless Technology, you can secure:

- **Greenfield devices** connected via IoT Hub. This enables organizations to accelerate their IoT initiatives by securing both modern, internet-native devices and traditional ICS/SCADA devices with a single unified solution.
    - Onboard new devices, and apply security policies across your workloads (Leaf devices, Microsoft Edge devices, IoT Hub) to ensure compliance with security standards and improved security posture.

- **Unmanaged brownfield devices** used in Operational Technology (OT) environments such as manufacturing, building management systems (BMS), life sciences, energy and water utilities, oil & gas, and logistics. 
    - To protect unmanaged devices, Azure Defender for IoT uses an on-premises sensor for passive, non-invasive Network Traffic Analysis (NTA) that has zero performance impact on OT environments. 
    - It also incorporates an in-depth understanding of specialized IoT/OT protocols - combined with patented, IoT/OT-aware behavioral analytics and machine learning - to eliminate the need to configure any rules or signatures, resulting in typical deployments in minutes or hours rather than days or weeks. 


## Azure Defender for IoT integration with Azure Sentinel
To enable unified IT/OT security monitoring and governance, Azure Defender for IoT natively integrates with [Azure Sentinel](../sentinel/overview.md).

SecOps teams can:

- Rapidly detect and respond to IoT/OT threats via OT-specific SOAR playbooks included with Sentinel
- Benefit from continuously updated IoT/OT-specific threat intelligence supplied by Section 52, Microsoft’s in-house IoT/OT threat intelligence team
- Integrate Azure Defender for IoT with existing SOC workflows and third-party security tools such as Splunk, IBM QRadar, and ServiceNow


## Next steps

In this article, you learned about Azure Defender for IoT in Azure Security Center. For more information, see:

- [Introducing Azure Security Center for IoT](../asc-for-iot/overview.md)
