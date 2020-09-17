---
title: Azure Security Benchmark V2 - Governance and Strategy
description: Azure Security Benchmark V2 Governance and Strategy
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 09/13/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control: Governance and Strategy

Backup and Recovery covers controls to ensure that data and configuration backups at the different service tiers are performed, validated, and protected.

## GS-1: Define asset management and protection strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-1 | 2, 13 | SC, AC |

Ensure you document and communicate a clear strategy for continuous monitoring and protection of systems and data. Prioritize discovery, assessment, protection, and monitoring of business-critical data and systems. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Data classification standard in accordance with the business risks

-	Security organization visibility into risks and asset inventory 

-	Security organization approval of Azure services for use 

-	Security of assets through their lifecycle

-	Required access control strategy in accordance with organizational data classification

-	Use of Azure native and third party data protection capabilities

-	Data encryption requirements for in-transit and at-rest use cases

-	Appropriate cryptographic standards

Note: Your asset management and protection approach for cloud and on-premises may be different depending on multiple factors, such as application service/hosting model, business risks, and compliance requirement. 

- [Azure Security Architecture Recommendation - Storage, data, and encryption](https://docs.microsoft.com/azure/architecture/framework/security/storage-data-encryption?toc=/security/compass/toc.json&amp;bc=/security/compass/breadcrumb/toc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](https://docs.microsoft.com/azure/security/fundamentals/data-encryption-best-practices?toc=/azure/cloud-adoption-framework/toc.json&amp;bc=/azure/cloud-adoption-framework/_bread/toc.json)

- [Azure Security Benchmark - Asset management](/azure/security/benchmarks/security-controls-v2-asset-management)

- [Azure Security Benchmark - Data Protection](/azure/security/benchmarks/security-controls-v2-data-protection)

**Responsibility**: Customer

**Customer Security Stakeholders**:

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-2: Define security posture management strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-2 | 20, 3, 5 | RA, CM, SC |

Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](/azure/security/benchmarks/security-controls-v2-posture-vulnerability-management)

**Responsibility**: Customer

**Customer Security Stakeholders**:

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-3: Align organization roles, responsibilities, and accountabilities

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-3 | N/A | PL, PM |

Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, education on the shared responsibility model, and technical education for cloud security. 

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](https://aka.ms/AzSec1)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](https://aka.ms/AzSec2)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](https://aka.ms/AzSec3)

**Responsibility**: Customer

**Customer Security Stakeholders**:

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-4: Define network security strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-4 | 9 | CA, SC |

Establish an Azure network security approach as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Centralized network management and security responsibility

-	Virtual network segmentation model aligned with the enterprise segmentation strategy

-	Remediation strategy in different threat and attack scenarios

-	Internet edge and ingress and egress strategy

-	Hybrid cloud and on-premises interconnectivity strategy

-	Up-to-date network security artifacts (e.g. network diagrams, reference network architecture)

Note: Your network security approach for cloud and on-premises may be different depending on multiple factors, such as application service model, threat exposure, and hybrid network setup.

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](https://aka.ms/AzSec11)

- [Azure Security Benchmark - Network Security](/azure/security/benchmarks/security-controls-v2-network-security)

- [Azure network security overview](../fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Responsibility**: Customer

**Customer Security Stakeholders**:

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-5: Define identity and privileged access strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-5 | 16, 4 | AC, AU, SC |

Establish an Azure identity and privileged access approaches as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	A centralized identity and authentication system and its interconnectivity with other internal and external identity systems

-	Strong authentication methods in different use cases and conditions

-	Protection of highly privileged users

-	Anomaly user activities monitoring and handling  

-	User identity and access review and reconciliation process

Note: Your identity and privileged access approach for cloud and on-premises may be different depending on multiple factors, such as data/application access path, service model, and customer/partner access strategy.

- [Azure Security Benchmark - Identity management](/azure/security/benchmarks/security-controls-v2-identity-management)

- [Azure Security Benchmark - Privileged access](/azure/security/benchmarks/security-controls-v2-privileged-access)

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](https://aka.ms/AzSec11)

- [Azure identity management security overview](../fundamentals/identity-management-overview.md) 

**Responsibility**: Customer

**Customer Security Stakeholders**:

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-6: Define logging and threat response strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-6 | 19 | IR, AU, RA, SC |

Establish a logging and threat response strategy to rapidly detect and remediate threats while meeting compliance requirements. Prioritize providing analysts with high quality alerts and seamless experiences so that they can focus on threats rather than integration and manual steps. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	The security operations (SecOps) organization’s role and responsibilities 

-	A well-defined incident response process aligning with NIST or another industry framework 

-	Log capture and retention to support threat detection, incident response, and compliance needs

-	Centralized visibility of and correlation information about threats, using SIEM, native Azure capabilities, and other sources 

-	Communication and notification plan with your customers, suppliers, and public parties of interest

-	Use of Azure native and third-party platforms for incident handling, such as logging and threat detection, forensics, and attack remediation and eradication

-	Processes for handling incidents and post-incident activities, such as lessons learned and evidence retention

Note: Your logging and threat detection approach for cloud and on-premises may be  different depending on multiple factors, such as compliance requirement, threat landscape, and detection and remediation capability. 

- [Azure Security Benchmark - Logging and threat detection](/azure/security/benchmarks/security-controls-v2-logging-threat-detection)

- [Azure Security Benchmark - Incident response](/azure/security/benchmarks/security-controls-v2-incident-response)

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](https://aka.ms/AzSec11)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

- [Azure enterprise scale, management, and monitoring](/azure/cloud-adoption-framework/ready/enterprise-scale/management-and-monitoring)

**Responsibility**: Customer

**Customer Security Stakeholders**:

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

## GS-7: Define backup and recovery strategy

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| GS-7 | 10 | CP |

Establish an Azure backup and recovery strategy for your organization. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Recovery time objective (RTO) and recovery point objective (RPO) definitions in accordance with your business resiliency objectives

-	Redundancy design in your applications and infrastructure setup

-	Protection of backup using access control and data encryption

Note: Your backup and recovery approach for cloud and on-premises may be different depending on the multiple factors, such as infrastructure redundancy, application service/hosting model, and compliance requirements.

- [Azure Security Benchmark - Backup and recovery](/azure/security/benchmarks/security-controls-v2-backup-recovery)

- [Azure Well-Architecture Framework - Backup and disaster recover for Azure applications](/azure/architecture/framework/resiliency/backup-and-recovery)

- [Azure Adoption Framework - business continuity and disaster recovery](/azure/cloud-adoption-framework/ready/enterprise-scale/business-continuity-and-disaster-recovery)

**Responsibility**: Customer

**Customer Security Stakeholders**:

- [All stakeholders](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)

