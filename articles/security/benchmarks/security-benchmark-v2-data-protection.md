---
title: Azure Security Control - Privileged Access
description: Azure Security Control Privileged Access
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 09/01/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control: Privileged Access

Data protection recommendations focus on addressing issues related to encryption, access control lists, identity-based access control, and audit logging for data access.

## 4.1: Protect and limit the global administrators

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 4.1 | 4.3, 4.8 | AC-2 |

Users who are assigned to the Global administrator role can read and modify every administrative setting in your Azure AD organization. Limit the number of your Azure global administrator accounts to no more than two for each subscription. The most critical built-in roles in Azure AD are Global Administrator and the Privileged Role Administrator as users assigned to these two roles can delegate administrator roles:
- Global Administrator / Company Administrator: Users with this role have access to all administrative features in Azure AD, as well as services that use Azure AD identities.

- Privileged Role Administrator: Users with this role can manage role assignments in Azure AD, as well as within Azure AD Privileged Identity Management (PIM). In addition, this role allows management of all aspects of PIM and administrative units.

Note: You may have other critical roles that need to be governed if you use custom roles with certain privileged permissions assigned. And you  may also want to apply similar controls to the administrator account of critical business assets.  

You can enable just-in-time (JIT) privileged access to Azure resources and Azure AD using Azure AD Privileged Identity Management (PIM). JIT grants temporary permissions to perform privileged tasks only when users need it. PIM can also generate security alerts when there is suspicious or unsafe activity in your Azure AD organization.

Note: Some Azure services such as Azure SQL support local user authentication in addition to the Azure AD authentication. This type of local user authentication is not managed through Azure AD. You will need to manage these users separately.

- [Administrator role permissions in Azure AD](../../active-directory/users-groups-roles/directory-assign-admin-roles.md)

- [Azure custom roles](../../role-based-access-control/custom-roles.md)

- [Use Azure Privileged Identity Management security alerts](../../active-directory/privileged-identity-management/pim-how-to-configure-security-alerts.md)

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

- [Use Azure Security Center to monitor identity and access](../../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Customer Security Functions**:

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

## 4.2: Review and reconcile user access regularly

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 4.2 | 4.1, 16.9, 16.10 | AC-2 |

Review user accounts and access entitlements regularly to ensure the user accounts and their access are valid. 

Use Azure AD identity and access reviews to manage group memberships, access to enterprise applications, and role assignments. Azure AD reporting can provide logs to help discover stale accounts. You can also use Azure AD Privileged Identity Management to create access review report workflow to facilitate the review process.

For administrative users at the Azure service and workload level, a more frequent user and access review should be conducted. You can also use Azure Privileged Identity Management security alerts to detect when administrator accounts are created, and to find administrator accounts that are stale or improperly configured. 

Note: Some Azure services such as Azure SQL support local users which not managed through Azure AD. You will need to manage these users  separately.

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

- [Use Azure Security Center to monitor identity and access](../../security-center/security-center-identity-access.md)

- [Use Azure Privileged Identity Management security alerts](../../active-directory/privileged-identity-management/pim-how-to-configure-security-alerts.md)

- [Align administrative responsibilities across teams](/azure/cloud-adoption-framework/organize/raci-alignment) 

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring/)

- [How to use Azure AD identity and access reviews](../../active-directory/governance/access-reviews-overview.md)

- [Privileged Identity Management - Review access to Azure AD roles](../../active-directory/privileged-identity-management/pim-how-to-start-security-review.md)

- [Azure Security Center - Monitor identity and access](../../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Customer Security Functions**:

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Security compliance management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

## 4.3: Set up an emergency access account in Azure AD

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 4.3 | 12.3 | AC-2 |

To prevent being accidentally locked out of your Azure AD organization, set up an emergency access account for access when normal administrative accounts cannot be used. Emergency access accounts are usually highly privileged, and they should not be assigned to specific individuals. Emergency access accounts are limited to emergency or "break glass"' scenarios where normal administrative accounts can't be used.

You should ensure that the credentials (such as password, certificate, or smart card) for emergency access accounts are kept secure and known only to individuals who are authorized to use them only in an emergency.

- [Manage emergency access accounts in Azure AD](../../active-directory/users-groups-roles/directory-emergency-access.md)

**Responsibility**: Customer

**Customer Security Functions**:

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Security compliance management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

- [Security operations center (SOC)](/azure/cloud-adoption-framework/organize/cloud-security-operations-center)

## 4.4: Automate Azure identity and access request workflow

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 4.4 | N/A | AC-2, AC-5, PM-10 |

Use Azure AD entitlement management features to automate Azure access request workflows, including access assignments, reviews, and expiration. Dual or multi-stage approval is also supported.  

- [What is Azure AD entitlement management](../../active-directory/governance/entitlement-management-overview.md)

- [How to setup access request and approval process](../../active-directory/governance/entitlement-management-access-package-request-policy.md)

**Responsibility**: Customer

**Customer Security Functions**:

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Security compliance management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

## 4.5: Use highly secured machines for administrative tasks

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 4.5 | 4.6, 11.6, 12.12 | AC-2, SC-7 |

Secured, isolated workstations are critically important for the security of sensitive roles like administrators, developers, and critical service operators. Use highly secured user workstations and/or Azure Bastion for administrative tasks:
- Use Azure Active Directory, Microsoft Defender Advanced Threat Protection (ATP), and/or Microsoft Intune to deploy a secure and managed user workstation for administrative tasks. The secured workstations can be centrally managed to enforce secured configuration including strong authentication, software and hardware baselines, restricted logical and network access. 

- Use Azure Bastion feature for a secure path to access your virtual machines through RDP or SSH. Azure Bastion is a fully managed PaaS service that can be provisioned per virtual network without creating a new virtual network. 

- [Understand secure, Azure-managed workstations](../../active-directory/devices/concept-azure-managed-workstation.md)

- [Deploy a secure, Azure-managed workstation](../../active-directory/devices/howto-azure-managed-workstation.md)

- [Use Azure Bastion host](../../bastion/bastion-create-host-portal.md)

**Responsibility**: Customer

**Customer Security Functions**:

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Security operations center (SOC)](/azure/cloud-adoption-framework/organize/cloud-security-operations-center)

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

## 4.6: Assign privileges to resources using Azure RBAC

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 4.6 | 14.6 | AC-2, AC-3 |

Azure role-based access control (RBAC) allows you to manage privileges to Azure resource access through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal. 

- [What is Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md)

- [How to configure RBAC in Azure](../../role-based-access-control/role-assignments-portal.md)

**Responsibility**: Customer

**Customer Security Functions**:

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Security compliance management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

## 4.7: Choose approval process for Microsoft support

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 4.7 | 16 | AC-2, AC-3, AC-4 |

In support scenarios where Microsoft needs to access customer data, Customer Lockbox provides a capability for you to explicitly review and approve or reject each customer data access requests.

- [Understand Customer Lockbox](../fundamentals/customer-lockbox-overview.md)

**Responsibility**: Customer

**Customer Security Functions**:

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Security compliance management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

