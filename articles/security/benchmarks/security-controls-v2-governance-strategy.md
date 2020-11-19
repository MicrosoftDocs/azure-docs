---
title: Azure Security Benchmark V2 - Governance and Strategy
description: Azure Security Benchmark V2 Governance and Strategy
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 09/20/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control V2: Governance and Strategy

Governance and Strategy provides guidance for ensuring a coherent security strategy and documented governance approach to guide and sustain security assurance, including establishing roles and responsibilities for the different cloud security functions, unified technical strategy, and supporting policies and standards.

## GS-1: Define asset management and data protection strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-1 | 2, 13 | SC, AC |

Ensure you document and communicate a clear strategy for continuous monitoring and protection of systems and data. Prioritize discovery, assessment, protection, and monitoring of business-critical data and systems. 

This strategy should include documented guidance, policy, and standards for the following elements: 

- Data classification standard in accordance with the business risks

- Security organization visibility into risks and asset inventory 

- Security organization approval of Azure services for use 

- Security of assets through their lifecycle

- Required access control strategy in accordance with organizational data classification

- Use of Azure native and third party data protection capabilities

- Data encryption requirements for in-transit and at-rest use cases

- Appropriate cryptographic standards

For more information, see the following references:
- [Azure Security Architecture Recommendation - Storage, data, and encryption](/azure/architecture/framework/security/storage-data-encryption?amp;bc=%252fsecurity%252fcompass%252fbreadcrumb%252ftoc.json&toc=%252fsecurity%252fcompass%252ftoc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](../fundamentals/data-encryption-best-practices.md?amp;bc=%252fazure%252fcloud-adoption-framework%252f_bread%252ftoc.json&toc=%252fazure%252fcloud-adoption-framework%252ftoc.json)

- [Azure Security Benchmark - Asset management](security-controls-v2-asset-management.md)

- [Azure Security Benchmark - Data Protection](security-controls-v2-data-protection.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-2: Define enterprise segmentation strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-2 | 4, 9, 16 | AC, CA, SC |

Establish an enterprise-wide strategy to segmenting access to assets using a combination of identity, network, application, subscription, management group, and other controls.

Carefully balance the need for security separation with the need to enable daily operation of the systems that need to communicate with each other and access data.

Ensure that the segmentation strategy is implemented consistently across control types including network security, identity and access models, and application permission/access models, and human process controls.

- [Guidance on segmentation strategy in Azure (video)](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Guidance on segmentation strategy in Azure (document)](/security/compass/governance#enterprise-segmentation-strategy)

- [Align network segmentation with enterprise segmentation strategy](/security/compass/network-security-containment#align-network-segmentation-with-enterprise-segmentation-strategy)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-3: Define security posture management strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-3 | 20, 3, 5 | RA, CM, SC |

Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](security-controls-v2-posture-vulnerability-management.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-4: Align organization roles, responsibilities, and accountabilities

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-4 | N/A | PL, PM |

Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, educating everyone on the shared responsibility model, and educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](/azure/cloud-adoption-framework/security/security-top-10#1-people-educate-teams-about-the-cloud-security-journey)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](/azure/cloud-adoption-framework/security/security-top-10#2-people-educate-teams-on-cloud-security-technology)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-5: Define network security strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-5 | 9 | CA, SC |

Establish an Azure network security approach as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

- Centralized network management and security responsibility

- Virtual network segmentation model aligned with the enterprise segmentation strategy

- Remediation strategy in different threat and attack scenarios

- Internet edge and ingress and egress strategy

- Hybrid cloud and on-premises interconnectivity strategy

- Up-to-date network security artifacts (e.g. network diagrams, reference network architecture)

For more information, see the following references:

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure Security Benchmark - Network Security](security-controls-v2-network-security.md)

- [Azure network security overview](../fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-6: Define identity and privileged access strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-6 | 16, 4 | AC, AU, SC |

Establish an Azure identity and privileged access approaches as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

- A centralized identity and authentication system and its interconnectivity with other internal and external identity systems

- Strong authentication methods in different use cases and conditions

- Protection of highly privileged users

- Anomaly user activities monitoring and handling  

- User identity and access review and reconciliation process

For more information, see the following references:

- [Azure Security Benchmark - Identity management](security-controls-v2-identity-management.md)

- [Azure Security Benchmark - Privileged access](security-controls-v2-privileged-access.md)

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure identity management security overview](../fundamentals/identity-management-overview.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-7: Define logging and threat response strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-7 | 19 | IR, AU, RA, SC |

Establish a logging and threat response strategy to rapidly detect and remediate threats while meeting compliance requirements. Prioritize providing analysts with high quality alerts and seamless experiences so that they can focus on threats rather than integration and manual steps. 

This strategy should include documented guidance, policy, and standards for the following elements: 

- The security operations (SecOps) organization’s role and responsibilities 

- A well-defined incident response process aligning with NIST or another industry framework 

- Log capture and retention to support threat detection, incident response, and compliance needs

- Centralized visibility of and correlation information about threats, using SIEM, native Azure capabilities, and other sources 

- Communication and notification plan with your customers, suppliers, and public parties of interest

- Use of Azure native and third-party platforms for incident handling, such as logging and threat detection, forensics, and attack remediation and eradication

- Processes for handling incidents and post-incident activities, such as lessons learned and evidence retention

For more information, see the following references:
- [Azure Security Benchmark - Logging and threat detection](security-controls-v2-logging-threat-detection.md)

- [Azure Security Benchmark - Incident response](security-controls-v2-incident-response.md)

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](/azure/cloud-adoption-framework/security/security-top-10#3-process-assign-accountability-for-cloud-security-decisions)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

- [Azure enterprise scale, management, and monitoring](/azure/cloud-adoption-framework/ready/enterprise-scale/management-and-monitoring)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-8: Define backup and recovery strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-8 | 10 | CP |

Establish an Azure backup and recovery strategy for your organization. 

This strategy should include documented guidance, policy, and standards for the following elements: 

- Recovery time objective (RTO) and recovery point objective (RPO) definitions in accordance with your business resiliency objectives

- Redundancy design in your applications and infrastructure setup

- Protection of backup using access control and data encryption

For more information, see the following references:
- [Azure Security Benchmark - Backup and recovery](security-controls-v2-backup-recovery.md)

- [Azure Well-Architecture Framework - Backup and disaster recover for Azure applications](/azure/architecture/framework/resiliency/backup-and-recovery)

- [Azure Adoption Framework - business continuity and disaster recovery](/azure/cloud-adoption-framework/ready/enterprise-scale/business-continuity-and-disaster-recovery)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)