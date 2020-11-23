---
title: Azure Security Benchmark V2 - Endpoint Security
description: Azure Security Benchmark V2 Endpoint Security
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 09/20/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control V2: Endpoint Security

Endpoint Security covers controls in endpoint detection and response. This includes use of endpoint detection and response (EDR) and anti-malware service for endpoints in Azure environments.

## ES-1: Use Endpoint Detection and Response (EDR)

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| ES-1 | 8.1 | SI-2, SI-3, SC-3 |

Enable Endpoint Detection and Response (EDR) capabilities for servers and clients and integrate with SIEM and Security Operations processes.

Microsoft Defender Advanced Threat Protection provides EDR capability as part of an enterprise endpoint security platform to prevent, detect, investigate, and respond to advanced threats. 

- [Microsoft Defender Advanced Threat Protection Overview](/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection)

- [Microsoft Defender ATP service for Windows servers](/windows/security/threat-protection/microsoft-defender-atp/configure-server-endpoints)

- [Microsoft Defender ATP service for non-Windows servers](/windows/security/threat-protection/microsoft-defender-atp/configure-endpoints-non-windows)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security)

- [Threat intelligence](/azure/cloud-adoption-framework/organize/cloud-security-threat-intelligence)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

## ES-2: Use centrally managed modern anti-malware software

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| ES-2 | 8.1 | SI-2, SI-3, SC-3 |

Use a centrally managed endpoint anti-malware solution capable of real time and periodic scanning

Azure Security Center can automatically identify the use of a number of popular anti-malware solutions for your virtual machines and report the endpoint protection running status and make recommendations. 

Microsoft Antimalware for Azure Cloud Services is the default anti-malware for Windows virtual machines (VMs). For Linux VMs, use third-party antimalware solution.  Also, you can use Azure Security Center's Threat detection for data services to detect malware uploaded to Azure Storage accounts. 

- [How to configure Microsoft Antimalware for Cloud Services and Virtual Machines](../fundamentals/antimalware.md)

- [Supported endpoint protection solutions](../../security-center/security-center-services.md?tabs=features-windows#supported-endpoint-protection-solutions-)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security)

- [Threat intelligence](/azure/cloud-adoption-framework/organize/cloud-security-threat-intelligence)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

## ES-3: Ensure anti-malware software and signatures are updated

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| ES-3 | 8.2 | SI-2, SI-3 |

Ensure anti-malware signatures are updated rapidly and consistently. 

Follow recommendations in Azure Security Center: "Compute &amp; Apps" to ensure all endpoints are up to date with the latest signatures. Microsoft Antimalware will automatically install the latest signatures and engine updates by default. For Linux, use third-party antimalware solution.

- [How to deploy Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../fundamentals/antimalware.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security)

- [Threat intelligence](/azure/cloud-adoption-framework/organize/cloud-security-threat-intelligence)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

- [Endpoint protection assessment and recommendations in Azure Security Center](../../security-center/security-center-endpoint-protection.md)