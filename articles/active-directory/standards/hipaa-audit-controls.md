---
title: Configure Microsoft Entra HIPAA audit control safeguards
description: Guidance on how to configure Microsoft Entra HIPAA audit control safeguards
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: janicericketts
ms.author: jricketts
manager: martinco
ms.reviewer: martinco
ms.date: 04/13/2023
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Audit controls safeguard guidance

Microsoft Entra ID meets identity-related practice requirements for implementing Health Insurance Portability and Accountability Act of 1996 (HIPAA) safeguards. To be HIPAA compliant, implement the safeguards using this guidance, with other needed configurations or processes.

For the audit controls:

* Establish data governance for personal data storage.

* Identify and label sensitive data.

* Configure audit collection and secure log data.

* Configure data loss prevention.

* Enable information protection.

For safeguard:

* Determine where Protected Health Information (PHI) data is stored.

* Identify and mitigate any risks for data that is stored.

This article provides relevant HIPAA safeguard wording, followed by a table with Microsoft recommendations and guidance to help achieve HIPAA compliance.

## Audit controls

The following content is safeguard guidance from HIPAA. Find Microsoft recommendations to meet safeguard implementation requirements.

**HIPAA safeguard - audit controls**

```Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.```

| Recommendation | Action |
| - | - |
| Enable Microsoft Purview | [Microsoft Purview](/purview/purview) helps to manage and monitor data by providing data governance. Using Purview helps to minimize compliance risks and meet regulatory requirements.</br>Microsoft Purview in the governance portal provides a [unified data governance](/microsoft-365/compliance/manage-data-governance) service that helps you manage your on-premises, multicloud and Software-as-service (SaaS) data.</br>Microsoft Purview is a framework, a suite of products that work together to provide visualization of sensitive data lifecycle protection for data, and data loss prevention. |
| Enable Microsoft Sentinel | [Microsoft Sentinel](../../sentinel/overview.md) provides security information and event management (SIEM) and security orchestration, automation, and response (SOAR) solutions. Microsoft Sentinel collects audit logs and uses built-in AI to help analyze large volumes of data. </br>SIEM enables an organization to detect incidents that could go undetected. |
| Configure Azure Monitor | [Use Azure Monitor Logs](../../azure-monitor/logs/data-security.md) collects and organizes logs, expanding to cloud and hybrid environments. It provides recommendations on key areas on how to protect resources combined with Azure trust center. |
| Enable logging and monitoring | </br>[Logging and monitoring](/security/benchmark/azure/security-control-logging-monitoring) are essential to securing an environment. The data supports investigations and helps detect potential threats by identifying unusual patterns. Enable logging and monitoring of services to reduce the risk of unauthorized access.</br>We recommend you monitor [Microsoft Entra activity logs](../reports-monitoring/howto-access-activity-logs.md). |
| Scan environment for electronic protected health information (ePHI) data | [Microsoft Purview](../../purview/overview.md) can be enabled in audit mode to scan what ePHI is sitting in the data estate and the resources that being used to store that data. This capability helps in establishing data classification and labeling based on the sensitivity of the data. |
| Create a data loss prevention (DLP) policy | DLP policies help establish processes to ensure that sensitive data isn't lost, misused, or accessed by unauthorized users. It prevents data breaches and exfiltration.</br>[Microsoft Purview DLP](/microsoft-365/compliance/dlp-policy-reference) examines email messages, navigate to the Microsoft Purview compliance portal to review the polices and customize them for your organization. |
| Enable monitoring through Azure Policy | [Azure Policy](../../governance/policy/overview.md) helps to enforce organizational standards, and enables the ability to assess the state of compliance across an environment. This approach ensures consistency, regulatory compliance and monitoring providing security recommendations through [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md) |
| Assess device management requirements | [Microsoft Intune](/mem/intune/) can be used to provide mobile device management (MDM) and mobile application management (MAM). Microsoft Intune provides control over company and personal devices. Capabilities include managing how devices can be used and enforcing policies that give you direct control over mobile applications. |
| Application protection | Microsoft Intune can help establish a [data protection framework](/mem/intune/apps/app-protection-policy) that covers the Microsoft 365 office applications, and incorporating them across devices. App protection policies ensure that organizational data remains safe and contained in the app on both personal (BYOD) to corporate owned devices. |
| Configure insider risk management | Microsoft Purview [Insider Risk Management](/microsoft-365/compliance/insider-risk-management-solution-overview) correlates signals to identify potential malicious or inadvertent insider risks, such as IP theft, data leakage, and security violations. Insider Risk Management enables you to create policies to manage security and compliance. This capability is built upon the principle of privacy by design, users are pseudonymized by default, and role-based access controls and audit logs are in place to help ensure user-level privacy. |
| Configure communication compliance | Microsoft Purview [Communication Compliance](/microsoft-365/compliance/communication-compliance-solution-overview) provides the tools to help organizations detect regulatory compliance such as compliance for Securities and Exchange Commission (SEC) or Financial Industry Regulatory Authority (FINRA) standards. The tool monitors for business conduct violations such as sensitive or confidential information, harassing or threatening language, and sharing of adult content. This capability is built with privacy by design, usernames are pseudonymized by default, role-based access controls are built in, investigators are opted in by an admin, and audit logs are in place to help ensure user-level privacy. |

## Safeguard controls

The following content provides the safeguard controls guidance from HIPAA. Find Microsoft recommendations to meet HIPAA compliance.

**HIPAA - safeguard**

```Conduct an accurate and thorough safeguard of the potential risks and vulnerabilities to the confidentiality, integrity, and availability of electronic protected health information held by the covered entity.```

| Recommendation | Action |
| - | - |
| Scan environment for ePHI data | [Microsoft Purview](../../purview/overview.md) can be enabled in audit mode to scan what ePHI is sitting in the data estate, and the resources that are being used to store that data. This information helps in establishing data classification and labeling the sensitivity of the data.</br>In addition, using [Content Explorer](/microsoft-365/compliance/data-classification-content-explorer) provides visibility into where the sensitive data is located. This information helps start the labeling journey from manually applying labeling or labeling recommendations on the client-side to service-side autolabeling. |
| Enable Priva to safeguard Microsoft 365 data | [Microsoft Priva](/privacy/priva/priva-overview) evaluate ePHI data stored in Microsoft 365, scanning, and evaluating for sensitive information. |
|Enable Azure Security benchmark |[Microsoft cloud security benchmark](/security/benchmark/azure/introduction) provides control for data protection across Azure services and provides a baseline for implementation for services that store ePHI. Audit mode provides those recommendations and remediation steps to secure the environment. |
| Enable Defender Vulnerability Management | [Microsoft Defender Vulnerability management](../../defender-for-cloud/remediate-vulnerability-findings-vm.md) is a built-in module in **Microsoft Defender for Endpoint**. The module helps you identify and discover vulnerabilities and misconfigurations in real-time. The module also helps you prioritize presenting the findings in a dashboard, and reports across devices, VMs and databases. |

## Learn more

* [Zero Trust Pillar: Devices, Data, Application, Visibility, Automation and Orchestration](/security/zero-trust/zero-trust-overview)

* [Zero Trust Pillar: Data, Visibility, Automation and Orchestration](/security/zero-trust/zero-trust-overview)

## Next steps

* [Access Controls Safeguard guidance](hipaa-access-controls.md)

* [Audit Controls Safeguard guidance](hipaa-audit-controls.md)

* [Other Safeguard guidance](hipaa-other-controls.md)
