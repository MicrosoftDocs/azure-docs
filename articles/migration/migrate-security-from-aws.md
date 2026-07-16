---
title: Migrate security services from Amazon Web Services (AWS)
description: Learn about replatforming security services from AWS to Microsoft Cloud to support the security requirements of the workload. Discover key similarities and differences between AWS and Microsoft.
ms.author: rhackenberg
author: reginahack
ms.reviewer: rhackenberg, chkittel
ms.date: 07/08/2026
ms.topic: concept-article
ms.service: azure
ms.collection:
  - migration
  - aws-to-azure
ms.custom: migration-hub
---

# Migrate security services from Amazon Web Services (AWS)

This article describes scenarios for migrating security services from Amazon Web Services (AWS) to Azure. Security services are part of the foundation for workload monitoring, threat detection, identity, secrets, and network protection. During migration, keep security coverage active in both clouds until you validate the Azure design and retire the AWS controls safely.

These scenarios cover security monitoring and SOC operations, cloud security posture and compliance, identity, secrets and keys, data security, and network protection.

## Component comparison

Start by comparing the AWS security and identity services used by the workload with the closest Azure services. The goal is to identify which Azure services should own monitoring, posture management, identity, secrets, encryption keys, and traffic inspection after migration.

For identity and security comparisons, see [Compare AWS and Azure identity management solutions](/azure/architecture/aws-professional/security-identity). For AWS environments that still need Microsoft security coverage during transition, see [Microsoft security solutions for AWS](/azure/architecture/guide/aws/aws-azure-security-solutions).

> [!NOTE]
> This comparison doesn't cover every service capability. Validate service behavior, data formats, retention, access controls, and operational processes before you cut over production security operations.

### Migration scenarios

Use this section as category navigation. Pick the security capability category and migration scenario first, and then follow the link to detailed Azure, Cloud Adoption Framework, Well-Architected Framework, or Azure Architecture Center guidance.

Inventory your current AWS security controls, then choose the matching scenario:

- If you own SOC operations, start with [Microsoft Sentinel](/azure/sentinel/migration) and [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction).
- If you own platform security architecture, start with [posture management](/azure/defender-for-cloud/concept-cloud-security-posture-management) and the service comparison.  
- If you own application customer identity, start with [Microsoft Entra External ID](/entra/external-id/customers/migrate-to-external-id).

These Azure services cover the closest-fit capabilities, not every AWS feature. Keep security coverage active in both clouds, and validate behavior before you cut over and retire AWS controls. There are three distinct categories under the Microsoft Entra product family: workforce and directory identity, customer identity, and workload or application identity, including managed identities. Microsoft Entra External ID covers customer identity for consumer or business-facing apps. It doesn't replace AWS IAM for cloud resource access, which maps to workload identity. Use the linked identity comparison to choose the right Azure solution path for workforce, application, and resource access scenarios.

| Category                              | Scenario                                                                                                                  | Where to go                                                                                                                                                                                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Threat detection and SIEM/SOC         | Migrate security monitoring, detections, and SOC operations to a cloud-native SIEM.                                       | [Microsoft Sentinel](/azure/sentinel/migration)                                                                                                                                                                                               |
| Cloud security posture and compliance | Assess multicloud posture and meet regulatory compliance requirements.                                                    | [Microsoft Defender for Cloud](/azure/defender-for-cloud/quickstart-onboard-aws), [posture management](/azure/defender-for-cloud/concept-cloud-security-posture-management)                                                                   |
| Vulnerability and workload protection | Move vulnerability assessment and workload protection for servers and containers.                                         | [Microsoft Defender for Servers](/azure/defender-for-cloud/enable-agentless-scanning-vms), [Microsoft Defender for Containers](/azure/defender-for-cloud/defender-for-containers-deployment-overview)                                         |
| Customer identity                     | Migrate customer identity and access management for consumer or business-facing apps.                                     | [Microsoft Entra External ID](/entra/external-id/customers/migrate-to-external-id)                                                                                                                                                            |
| Workforce and directory identity      | Migrate workforce sign-in, directory, and access management from AWS, and plan identity governance and privileged access. | [Compare AWS and Azure identity management solutions](/azure/architecture/aws-professional/security-identity)                                                                                                                                 |
| Workload and resource identity        | Replace AWS IAM roles used for workload and resource-to-resource access.                                                  | [Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview), [Compare AWS and Azure identity management solutions](/azure/architecture/aws-professional/security-identity)                          |
| Application and API authentication    | Move application and API authentication from Amazon Cognito to the Microsoft identity platform.                           | [Compare AWS and Azure identity management solutions](/azure/architecture/aws-professional/security-identity), [Migrate from Amazon Cognito to Microsoft Entra External ID](/entra/external-id/customers/migrate-from-cognito-to-external-id) |
| Secrets and key management            | Move application secrets, encryption keys, and HSM-backed keys.                                                           | [Azure Key Vault](/azure/key-vault/secrets/about-secrets), [Azure Managed HSM](/azure/key-vault/managed-hsm/overview)                                                                                                                         |
| Data security and classification      | Discover and classify sensitive data across clouds.                                                                       | [Microsoft Purview](/purview/register-scan-amazon-s3)                                                                                                                                                                                         |
| Web application protection            | Protect web applications with a web application firewall.                                                                 | [Azure Web Application Firewall](/azure/web-application-firewall/overview) on [Azure Front Door](/azure/web-application-firewall/afds/afds-overview) or [Azure Application Gateway](/azure/web-application-firewall/ag/ag-overview)           |
| Network protection and inspection     | Inspect and filter network traffic.                                                                                       | [Azure Firewall](/azure/firewall/overview)                                                                                                                                                                                                    |

## Related workload components

Security services make up only part of your cloud workload. Explore other components you might migrate:

- [Compute](migrate-compute-from-aws.md)
- [Databases](migrate-databases-from-aws.md)
- [Storage](migrate-storage-from-aws.md)
- [Networking](migrate-networking-from-aws.md)

Migrating security scenarios requires identity to be centralized. Compare [AWS identity services](/azure/architecture/aws-professional/security-identity) used in the workload to their closest Azure counterparts.

## Related content

- [Microsoft security solutions for AWS](/azure/architecture/guide/aws/aws-azure-security-solutions)
- [Compare AWS and Azure identity management solutions](/azure/architecture/aws-professional/security-identity)
- [Perform your cloud adoption securely](/azure/cloud-adoption-framework/secure/adopt)
- [Security design principles](/azure/well-architected/security/principles)
- [Azure Well-Architected Framework service guides](/azure/well-architected/service-guides/)

