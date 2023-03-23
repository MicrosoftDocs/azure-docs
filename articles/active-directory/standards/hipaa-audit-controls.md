---
title: Configure Azure Active Directory HIPAA Audit Control safeguards
description: Guidance on how to configure Azure Active Directory HIPAA Audit Control safeguards.
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: janicericketts
ms.author: jricketts
manager: martinco
ms.reviewer: martinco
ms.date: 03/17/2023
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Audit Controls Safeguard guidance

Azure Active Directory meets identity-related practice requirements for implementing HIPAA safeguards. To be HIPAA compliant, it's the responsibility of companies to implement the safeguards using this guidance along with any other configurations or processes needed.

For the Audit Controls Safeguard, we recommend you:

* Establish data governance for personal data storage.

* Identify and label sensitive data.

* Configure audit collection and secure log data.

* Configure data loss prevention.

* Enable information protection.

For Safeguard, we recommend that you:

* Determine where Protected Health Information (PHI) data is stored.

* Identify and mitigate any risks for data that is stored.

 The following table provides a list of the Audit and Monitoring Controls (AM) safeguards from the HIPAA guidance and Microsoft's recommendations to enable you to meet the safeguard implementation requirements with Azure AD.

| HIPAA safeguard | Guidance and recommendations |
| - | - |
| **Audit Controls** - Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.| You're responsible for establishing a data governance model to determine where electronic PHI (ePHI) data is stored. Taking key actions on labeling and enabling auditing for access reviews.<p><p>Enable Microsoft Purview<p>[Data governance with Microsoft Purview](/purview/purview)<p>[Microsoft Purview capabilities](../../purview/overview.md)<p><p>Enable Microsoft Sentinel<p>[Microsoft Sentinel](../../sentinel/overview.md)<p><p>Configure Azure Monitor<p>[Use Azure Monitor Logs](../../azure-monitor/logs/data-security.md)<p><p>Enable logging and monitoring<p>[Security Control for logging and monitoring](/security/benchmark/azure/security-control-logging-monitoring)<p>[Access activity logs in Azure AD](../reports-monitoring/howto-access-activity-logs.md)<p><p>Scan environment for ePHI data<p>[Microsoft Purview to monitor data estate](../../purview/overview.md)<p><p>Create a data loss prevention (DLP) policy<p>[Microsoft Purview DLP for managing email governance](/microsoft-365/compliance/dlp-policy-reference)<p><p>Enable monitoring through Azure Policy<p>[Using Azure Policy](../../governance/policy/overview.md)<p>[Using Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md)<p><p>Application protection<p>[Using Microsoft Intune for application protection](/mem/intune/apps/app-protection-policy)<p><p>Insider risk management<p>[Using Microsoft Purview for risk management](/microsoft-365/compliance/insider-risk-management-solution-overview)<p><p>Communication compliance<p>[Using Microsoft Purview for communication compliance](/microsoft-365/compliance/communication-compliance-solution-overview) |
| Safeguard - Conduct an accurate and thorough Safeguard of the potential risks and vulnerabilities to the confidentiality, integrity, and availability of electronic protected health information held by the covered entity.| You're responsible for determining a map of your data landscape to establish where PHI data is stored, and key actions to protect the data.<p><p>Scan environment for ePHI data<p>[Use Microsoft Purview for scanning](../../purview/overview.md)<p><p>Enable Priva to safeguard Microsoft 365 data<p>[Using Microsoft Priva](/privacy/priva/priva-overview)<p>Enable Azure Security benchmark<p>[Microsoft cloud security benchmark](/security/benchmark/azure/introduction)<p><p>Enable Microsoft Defender for Cloud<p>[Virtual machine (VM) management](../../defender-for-cloud/remediate-vulnerability-findings-vm.md) |

## Learn More

* [Zero Trust Pillar: Devices, Data, Application, Visibility, Automation and Orchestration](/security/zero-trust/zero-trust-overview)

* [Zero Trust Pillar: Data, Visibility, Automation and Orchestration](/security/zero-trust/zero-trust-overview)

### Next Steps

* [Access Controls Safeguard guidance](hipaa-access-controls.md)

* [Audit Controls Safeguard guidance](hipaa-audit-controls.md)

* [Other Safeguard guidance](hipaa-other-controls.md)
