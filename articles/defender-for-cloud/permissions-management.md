---
title: Permissions Management (CIEM)
description: Learn about permissions (CIEM) in Microsoft Defender for Cloud and enhance the security of your cloud infrastructure.
ms.topic: concept-article
author: Elazark
ms.author: elkrieger
ms.date: 05/08/2024
#customer intent: As a user, I want to understand how to manage permissions effectively so that I can enhance the security of my cloud infrastructure.
---

# Permissions Management (CIEM)

Microsoft Defender for Cloud's integration with [Microsoft Entra Permissions Management](/entra/permissions-management/overview) (Permissions Management) provides a Cloud Infrastructure Entitlement Management (CIEM) security model that helps organizations manage and control user access and entitlements in their cloud infrastructure. CIEM is a critical component of the Cloud Native Application Protection Platform (CNAPP) solution that provides visibility into who or what has access to specific resources. CIEM ensures that access rights adhere to the principle of least privilege (PoLP), where users or workload identities, such as apps and services, receive only the minimum levels of access necessary to perform their tasks. CIEM also helps organizations to monitor and manage permissions across multiple cloud environments, including Azure, AWS, and GCP.

Integrating Permissions Management with Defender for Cloud (CNAPP) strengthens cloud security by preventing security breaches caused by excessive permissions or misconfigurations. Permissions Management continuously monitors and manages cloud entitlements, helping to discover attack surfaces, detect threats, right-size access permissions, and maintain compliance. This integration enhances the capabilities of Defender for Cloud in securing cloud-native applications and protecting sensitive data.

This integration brings the following insights derived from the Microsoft Entra Permissions Management suite into the Microsoft Defender for Cloud portal. For more information, see the [feature matrix](#feature-matrix).

## Common use-cases and scenarios

Permissions Management capabilities integrate as a valuable component within the Defender [Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) plan. The integrated capabilities are foundational, providing the essential functionalities within Microsoft Defender for Cloud. With these added capabilities, you can track permissions analytics, unused permissions for active identities, and over-permissioned identities and mitigate them to support the best practice of least privilege.

The integration creates recommendations under the Manage Access and Permissions security control on the Recommendations page in Defender for Cloud.

## Known limitations

AWS and GCP accounts that were onboarded to Permissions Management before being onboarded to Defender for Cloud can't be integrated through Microsoft Defender for Cloud.

## Feature matrix

The integration feature comes as part of Defender CSPM plan and doesn't require a Permissions Management license. To learn more about other capabilities that you can receive from Permissions Management, refer to the feature matrix:

| Category  | Capabilities                                                 | Defender for Cloud | Permissions Management |
| --------- | ------------------------------------------------------------ | ------------------ | ---------------------- |
| Discover  | Permissions  discovery for risky identities (including unused identities, overprovisioned  active identities, super identities) in Azure, AWS, GCP | ✓                  | ✓                      |
| Discover  | Permissions  Creep Index (PCI) for multicloud environments (Azure, AWS, GCP) and all  identities | ✓                  | ✓                      |
| Discover  | Permissions  discovery for all identities, groups in Azure, AWS, GCP | ❌                  | ✓                      |
| Discover  | Permissions  usage analytics, role / policy assignments in Azure, AWS, GCP | ❌                  | ✓                      |
| Discover  | Support  for Identity Providers (including AWS IAM Identity Center, Okta, GSuite) | ❌                  | ✓                      |
| Remediate | Automated  deletion of permissions                           | ❌                  | ✓                      |
| Remediate | Remediate  identities by attaching / detaching the permissions | ❌                  | ✓                      |
| Remediate | Custom role / AWS Policy generation based on activities of identities, groups, etc. | ❌                  | ✓                      |
| Remediate | Permissions  on demand (time-bound access) for human and workload identities via Microsoft Entra admin center, APIs, ServiceNow app. | ❌                  | ✓                      |
| Monitor   | Machine  Learning-powered anomaly detections                 | ❌                  | ✓                      |
| Monitor   | Activity  based, rule-based alerts                           | ❌                  | ✓                      |
| Monitor   | Context-rich  forensic reports (for example PCI history report, user entitlement &  usage report, etc.) | ❌                  | ✓                      |

## Related content

Learn how to [enable Permissions Management](enable-permissions-management.md) in Microsoft Defender for Cloud.
