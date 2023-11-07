---
title: User roles and permissions
description: This article explains how Microsoft Defender for Cloud uses role-based access control to assign permissions to users and identify the permitted actions for each role.
ms.topic: limits-and-quotas
ms.custom: ignite-2022
ms.date: 10/09/2023
---

# User roles and permissions

Microsoft Defender for Cloud uses [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md) to provide [built-in roles](../role-based-access-control/built-in-roles.md). You can assign these roles to users, groups, and services in Azure to give users access to resources according to the access defined in the role.

Defender for Cloud assesses the configuration of your resources to identify security issues and vulnerabilities. In Defender for Cloud, you only see information related to a resource when you're assigned one of these roles for the subscription or for the resource group the resource is in: Owner, Contributor, or Reader.

In addition to the built-in roles, there are two roles specific to Defender for Cloud:

- **Security Reader**: A user that belongs to this role has read-only access to Defender for Cloud. The user can view recommendations, alerts, a security policy, and security states, but can't make changes.
- **Security Admin**: A user that belongs to this role has the same access as the Security Reader and can also update the security policy, and dismiss alerts and recommendations.

We recommend that you assign the least permissive role needed for users to complete their tasks. For example, assign the Reader role to users who only need to view information about the security health of a resource but not take action, such as applying recommendations or editing policies.

## Roles and allowed actions

The following table displays roles and allowed actions in Defender for Cloud.

| **Action**   | [Security Reader](../role-based-access-control/built-in-roles.md#security-reader) /<br> [Reader](../role-based-access-control/built-in-roles.md#reader) | [Security Admin](../role-based-access-control/built-in-roles.md#security-admin) | [Contributor](../role-based-access-control/built-in-roles.md#contributor) / [Owner](../role-based-access-control/built-in-roles.md#owner) | [Contributor](../role-based-access-control/built-in-roles.md#contributor) | [Owner](../role-based-access-control/built-in-roles.md#owner) |
|:-|:-:|:-:|:-:|:-:|:-:|
|  |  |  | **(Resource group level)** | **(Subscription level)** | **(Subscription level)** |
| Add/assign initiatives (including) regulatory compliance standards) | - | ✔ | - | - | ✔ |
| Edit security policy | - | ✔ | - | - | ✔ |
| Enable / disable Microsoft Defender plans | - | ✔ | - | ✔ | ✔ |
| Dismiss alerts | - | ✔ | - | ✔ | ✔ |
| Apply security recommendations for a resource</br> (and use [Fix](implement-security-recommendations.md#fix-button)) | - | - | ✔ | ✔ | ✔ |
| View alerts and recommendations | ✔ | ✔ | ✔ | ✔ | ✔ |
| Exempt security recommendations | - | - | ✔ | ✔ | ✔ |

The specific role required to deploy monitoring components depends on the extension you're deploying. Learn more about [monitoring components](monitoring-components.md).

## Roles used to automatically provision agents and extensions

To allow the Security Admin role to automatically provision agents and extensions used in Defender for Cloud plans, Defender for Cloud uses policy remediation in a similar way to [Azure Policy](../governance/policy/how-to/remediate-resources.md). To use remediation, Defender for Cloud needs to create service principals, also called managed identities that assign roles at the subscription level. For example, the service principals for the Defender for Containers plan are:

| Service Principal | Roles |
|:-|:-|
| Defender for Containers provisioning AKS Security Profile | • Kubernetes Extension Contributor<br>• Contributor<br>• Azure Kubernetes Service Contributor<br>• Log Analytics Contributor |
| Defender for Containers provisioning Arc-enabled Kubernetes | • Azure Kubernetes Service Contributor<br>• Kubernetes Extension Contributor<br>• Contributor<br>• Log Analytics Contributor |
| Defender for Containers provisioning Azure Policy for Kubernetes  | • Kubernetes Extension Contributor<br>• Contributor<br>• Azure Kubernetes Service Contributor |
| Defender for Containers provisioning Policy extension for Arc-enabled Kubernetes | • Azure Kubernetes Service Contributor<br>• Kubernetes Extension Contributor<br>• Contributor |

## Next steps

This article explained how Defender for Cloud uses Azure RBAC to assign permissions to users and identified the allowed actions for each role. Now that you're familiar with the role assignments needed to monitor the security state of your subscription, edit security policies, and apply recommendations, learn how to:

- [Set security policies in Defender for Cloud](tutorial-security-policy.md)
- [Manage security recommendations in Defender for Cloud](review-security-recommendations.md)
- [Manage and respond to security alerts in Defender for Cloud](managing-and-responding-alerts.md)
- [Monitor partner security solutions](./partner-integration.md)
