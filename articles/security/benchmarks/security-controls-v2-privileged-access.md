---
title: Azure Security Benchmark V2 - Privileged Access
description: Azure Security Benchmark V2 Privileged Access
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 02/22/2021
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control V2: Privileged Access

Privileged Access covers controls to protect privileged access to your Azure tenant and resources. This includes a range of controls to protect your administrative model, administrative accounts, and privileged access workstations against deliberate and inadvertent risk.

To see the applicable built-in Azure Policy, see [Details of the Azure Security Benchmark Regulatory Compliance built-in initiative: Privileged Access](../../governance/policy/samples/azure-security-benchmark.md#privileged-access)

## PA-1: Protect and limit highly privileged users

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| PA-1 | 4.3, 4.8 | AC-2 |

Limit the number of highly privileged user accounts, and protect these accounts at an elevated level. 
The most critical built-in roles in Azure AD are Global Administrator and the Privileged Role Administrator, because users assigned to these two roles can delegate administrator roles. With these privileges, users can directly or indirectly read and modify every resource in your Azure environment:

- Global Administrator: Users with this role have access to all administrative features in Azure AD, as well as services that use Azure AD identities.

- Privileged Role Administrator: Users with this role can manage role assignments in Azure AD, as well as within Azure AD Privileged Identity Management (PIM). In addition, this role allows management of all aspects of PIM and administrative units.

Note: You may have other critical roles that need to be governed if you use custom roles with certain privileged permissions assigned. And you may also want to apply similar controls to the administrator account of critical business assets.

You can enable just-in-time (JIT) privileged access to Azure resources and Azure AD using Azure AD Privileged Identity Management (PIM). JIT grants temporary permissions to perform privileged tasks only when users need it. PIM can also generate security alerts when there is suspicious or unsafe activity in your Azure AD organization.

- [Administrator role permissions in Azure AD](../../active-directory/roles/permissions-reference.md)

- [Use Azure Privileged Identity Management security alerts](../../active-directory/privileged-identity-management/pim-how-to-configure-security-alerts.md)

- [Securing privileged access for hybrid and cloud deployments in Azure AD](../../active-directory/roles/security-planning.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

- [Security Operations](/azure/cloud-adoption-framework/organize/cloud-security-operations-center)

## PA-2: Restrict administrative access to business-critical systems

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| PA-2 | 13.2, 2.10 | AC-2, SC-3, SC-7 |

Isolate access to business-critical systems by restricting which accounts are granted privileged access to the subscriptions and management groups they are in. 
Ensure that you also restrict access to the management, identity, and security systems that have administrative access to your business critical assets, such as Active Directory Domain Controllers (DCs), security tools, and system management tools with agents installed on business critical systems. Attackers who compromise these management and security systems can immediately weaponize them to compromise business critical assets. 

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access control. 

Ensure to assign separate privileged accounts that are distinct from the standard user accounts used for email, browsing, and productivity tasks.

- [Azure Components and Reference model](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Management Group Access](../../governance/management-groups/overview.md#management-group-access)

- [Azure subscription administrators](../../cost-management-billing/manage/add-change-subscription-administrator.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

## PA-3: Review and reconcile user access regularly

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| PA-3 | 4.1, 16.9, 16.10 | AC-2 |

Review user accounts and access assignment regularly to ensure the accounts and their level of access are valid. You can use Azure AD access reviews to review group memberships, access to enterprise applications, and role assignments. Azure AD reporting can provide logs to help discover stale accounts. You can also use Azure AD Privileged Identity Management to create an access review report workflow that facilitates the review process.
In addition, Azure Privileged Identity Management can be configured to alert when an excessive number of administrator accounts are created, and to identify administrator accounts that are stale or improperly configured. 

Note: Some Azure services support local users and roles that aren't managed through Azure AD. You must manage these users separately.

- [Create an access review of Azure resource roles in Privileged Identity Management(PIM)](../../active-directory/privileged-identity-management/pim-resource-roles-start-access-review.md)

- [How to use Azure AD identity and access reviews](../../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

## PA-4: Set up emergency access in Azure AD

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| PA-4 | 16 | AC-2, CP-2 |

To prevent being accidentally locked out of your Azure AD organization, set up an emergency access account for access when normal administrative accounts cannot be used. Emergency access accounts are usually highly privileged, and they should not be assigned to specific individuals. Emergency access accounts are limited to emergency or "break glass"' scenarios where normal administrative accounts can't be used.
You should ensure that the credentials (such as password, certificate, or smart card) for emergency access accounts are kept secure and known only to individuals who are authorized to use them only in an emergency.

- [Manage emergency access accounts in Azure AD](../../active-directory/roles/security-emergency-access.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

- [Security Operations (SecOps)](/azure/cloud-adoption-framework/organize/cloud-security-operations-center)

## PA-5: Automate entitlement management

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| PA-5 | 16 | AC-2, AC-5, PM-10 |

Use Azure AD entitlement management features to automate access request workflows, including access assignments, reviews, and expiration. Dual or multi-stage approval is also supported.
- [What are Azure AD access reviews](../../active-directory/governance/access-reviews-overview.md) 

- [What is Azure AD entitlement management](../../active-directory/governance/entitlement-management-overview.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

## PA-6: Use privileged access workstations

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| PA-6 | 4.6, 11.6, 12.12 | AC-2, SC-3, SC-7 |

Secured, isolated workstations are critically important for the security of sensitive roles like administrator, developer, and critical service operator. Use highly secured user workstations and/or Azure Bastion for administrative tasks. Use Azure Active Directory, Microsoft Defender Advanced Threat Protection (ATP), and/or Microsoft Intune to deploy a secure and managed user workstation for administrative tasks. The secured workstations can be centrally managed to enforce secured configuration, including strong authentication, software and hardware baselines, and restricted logical and network access. 

- [Understand privileged access workstations](/security/compass/privileged-access-deployment)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Security Operations (SecOps)](/azure/cloud-adoption-framework/organize/cloud-security-operations-center)

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

## PA-7: Follow just enough administration (least privilege principle)

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| PA-7 | 14.6 | AC-2, AC-3, SC-3 |

Azure role-based access control (Azure RBAC) allows you to manage Azure resource access through role assignments. You can assign these roles to users, group service principals, and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell, and the Azure portal. The privileges you assign to resources through Azure RBAC should always be limited to what's required by the roles. Limited privileges complement the just in time (JIT) approach of Azure AD Privileged Identity Management (PIM), and those privileges should be reviewed periodically.

Use built-in roles to allocate permissions and only create custom roles when required.

- [What is Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md)

- [How to configure Azure RBAC](../../role-based-access-control/role-assignments-portal.md)

- [How to use Azure AD identity and access reviews](../../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

## PA-8: Choose approval process for Microsoft support 

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| PA-8 | 16 | AC-2, AC-3, AC-4 |

In support scenarios where Microsoft needs to access customer data, Customer Lockbox provides a capability for you to explicitly review and approve or reject each customer data access request.

- [Understand Customer Lockbox](../fundamentals/customer-lockbox-overview.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management) 

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)