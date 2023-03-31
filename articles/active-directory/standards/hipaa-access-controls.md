---
title: Configure Azure Active Directory HIPAA Access Control safeguards
description: Guidance on how to configure Azure Active Directory HIPAA Access Control safeguards.
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: janicericketts
ms.author: jricketts
manager: martinco
ms.reviewer: martinco
ms.date: 03/31/2023
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Access Controls Safeguard guidance

Azure Active Directory meets identity-related practice requirements for implementing HIPAA safeguards. To be HIPAA compliant, you must implement the safeguards using this guidance and may need to modify additional configurations or processes.

To better understand the **User Identification Safeguard**, we recommend you research and set objectives that enable you to:

* Ensure IDs are unique to everyone that needs to connect to the domain.

* Establish a Joiner, Mover, and Leaver (JML) process.

* Enabler auditing for identity tracking.

For the **Authorized Access Control Safeguard**, set objectives so that:

* System access is limited to authorized users.

* Authorized users are identified.

* Access to personal data is limited to authorized users.

For the **Emergency Access Procedure Safeguard**:

* Ensure high availability of core services.

* Eliminate single points of failure.

* Establish a disaster recovery plan.

* Ensure backups of high-risk data.

* Establish and maintain emergency access accounts.

For the **Automatic Logoff Safeguard**:

* Establish a procedure that terminates an electronic session after a predetermined time of inactivity.

* Configure and implement an automatic sign out policy.

## Unique User Identification

The following table provides a list of the Access Control Safeguards from the HIPAA guidance for unique user identification and Microsoft’s recommendations to enable you to meet safeguard implementation requirements.

**HIPAA Safeguard - Unique User Identification**

```Assign a unique name and/or number for identifying and tracking user identity.```

| Recommendation | Action |
| - | - |
| Setup hybrid to utilize Azure Active Directory (Azure AD) | [Azure AD Connect](../hybrid/how-to-connect-install-express.md) integrates on-premises directories with Azure AD, supporting the use of single identities to access on-premises applications and cloud services such as Microsoft 365. It orchestrates synchronization between Active Directory (AD) and Azure AD. To get started with Azure AD Connect review the prerequisites, making note of the server requirements and how to prepare your Azure AD tenant for management.<p>[Azure AD Connect sync](../cloud-sync/tutorial-pilot-aadc-aadccp.md) is a provisioning agent that is managed on the cloud. The provisioning agent supports synchronizing to Azure AD from a multi-forest disconnected AD environment. Lightweight agents are installed and can be used with Azure AD connect.<p>We highly recommend you use **Password Hash Sync** to help reduce the number of passwords and protect against leaked credential detection.|
| Provision user accounts |[Azure AD](../fundamentals/add-users-azure-active-directory.md) is a cloud-based identity and access management service that provides single sign-on, multifactor authentication and conditional access to guard against security attacks. To create a user account sign in into the Azure AD portal as a **User Admin** and create a new account by navigating to [All users](../fundamentals/add-users-azure-active-directory.md) in the menu.<p>Azure AD provides support for automated user provisioning for systems and applications. Capabilities include creating, updating, and deleting a user account. Automated provisioning creates new accounts in the right systems for new people when they join a team in an organization, and automated deprovisioning deactivates accounts when people leave the team. Configure provisioning by navigating to the Azure AD portal and selecting [enterprise applications](../app-provisioning/configure-automatic-user-provisioning-portal.md) to add and manage the app settings. |
|HR-driven provisioning | [Integrating Azure AD account provisioning](../app-provisioning/plan-cloud-hr-provision.md) within a Human Resources (HR) system reduces the risk of excessive access and access no longer required. The HR system becomes the start-of-authority, for newly created accounts, extending the capabilities to account deprovisioning.  Automation manages the identity lifecycle and reduces the risk of over-provisioning. This approach follows the security best practice of providing least privilege access. |
| Create lifecycle workflows | [Lifecycle workflows](../governance/understanding-lifecycle-workflows.md) provide identity governance for automating the joiner/mover/leaver (JML) lifecycle. Lifecycle workflows centralize the workflow process by either using the [built-in templates](../governance/lifecycle-workflow-templates.md) or creating your own custom workflows. this practice helps reduce or potentially remove manual tasks for organizational JML strategy requirements. Within the Azure portal, navigate to **Identity Governance** in the Azure AD menu to review or configure tasks that fit within your organizational requirements. |
| Manage privileged identities | [Azure AD Privileged Identity Management (PIM)](../privileged-identity-management/pim-configure.md) enables management, control, and the ability to monitor access. You provide access when it's needed, on a time-based and approval-based role activation. This approach limits the risk of excessive, unnecessary, or misused access permissions. |
| Monitoring and alerting | [Identity Protection](../identity-protection/overview-identity-protection.md) provides a consolidated view into risk events and potential vulnerabilities that could affect an organization’s identities. Enabling the protection applies the existing Azure AD anomaly detection capabilities and introduces risk event types that detect anomalies in real-time. Through the Azure AD portal, you can sign-in, audit, and review provisioning logs.<p>The logs can be [downloaded, archived, and streamed](../reports-monitoring/howto-download-logs.md) to your security information and event management (SIEM) tool. Azure AD logs can be located within the monitoring section of the Azure AD menu. The logs can also be sent to [Azure Monitor](../reports-monitoring/concept-activity-logs-azure-monitor.md) using an Azure log analytics workspace where you can setup alerting on the connected data.<p>Azure AD uniquely identifies users via the [ID property](/graph/api/resources/user?view=graph-rest-1.0&preserve-view=true) on the respective directory object. This approach enables you to filter for specific identities in the log files. |

## Authorized Access Control

The following table provides a list of the Access Control Safeguards from the HIPAA guidance for authorized access control and Microsoft’s recommendations to enable you to meet safeguard implementation requirements.

**HIPAA Safeguard - Authorized Access Control**

```Person or entity authentication, implement procedures to verify that a person or entity seeking access to electronic protected health information is the one claimed.```

| Recommendation | Action |
| - | - |
Enable multifactor authentication (MFA) | [MFA in Azure AD](../authentication/concept-mfa-howitworks.md) protects identities by adding another layer of security. The extra layer authentication is effective in helping prevent unauthorized access. Using an MFA approach enables you to require more validation of sign in credentials during the authentication process. Examples include setting up the [Authenticator app](https://support.microsoft.com/account-billing/set-up-an-authenticator-app-as-a-two-step-verification-method-2db39828-15e1-4614-b825-6e2b524e7c95) for one-click verification, or enabling [passwordless authentication](../authentication/concept-authentication-passwordless.md). |
| Enable Conditional Access (CA) policies | [Conditional Access](../conditional-access/concept-conditional-access-policies.md) policies help organizations restrict access to approved applications. Azure AD analyses signals from either the user, device, or the location to automate decisions and enforce organizational policies for access to resources and data. |
| Provision role-based access control (RBAC) | [RBAC](../roles/custom-overview.md) provides security on an enterprise level with the concept of separation of duties. RBAC enables you to adjust and review permissions to protect confidentiality, privacy and access management to resources and sensitive data along with the systems.<p>Azure AD provides support for [built-in roles](../roles/permissions-reference.md), which is a fixed set of permissions that can't be modified. You can also create your own [custom roles](../roles/custom-create.md) where you can add a preset list. |
| Provision attribute-based access control (ABAC) | [ABAC](../../role-based-access-control/conditions-overview.md) defines access based on attributes associated with security principles, resources, and environment. It provides fine-grained access control and reduces the number of role assignments. The use of ABAC can be scoped to the content within the dedicated Azure storage. |
| Setup user groups access in SharePoint | [SharePoint groups](/sharepoint/dev/general-development/authorization-users-groups-and-the-object-model-in-sharepoint) are a collection of users. The permissions are scoped to the site collection level for access to the content. Application of this constraint can be scoped to service accounts that require data flow access between applications. |

## Emergency Access Procedure

The following table provides a list of the Access Control Safeguards from the HIPAA guidance for emergency access procedures and Microsoft’s recommendations to enable you to meet safeguard implementation requirements.

**HIPAA Safeguard - Emergency Access Procedure**

```Establish (and implement as needed) procedures and policies for obtaining necessary electronic protected health information during an emergency or occurrence.```

| Recommendation | Action |
| - | - |
| Provision Azure Recovery Services | [Azure Backups](../../backup/backup-architecture.md) provide the support required to back up vital and sensitive data. Coverage includes storage/databases and cloud infrastructure, along with on-premises windows devices to the cloud. Establish [backup policies](../../backup/backup-architecture.md#backup-policy-essentials) to address risks of backup and recovery process that need to be carried out to ensure data is safely stored and can be retrieved with minimal downtime.<p>Azure Site Recovery provides near-constant data replication to ensure copies of are in sync. Initial steps prior to setting up the service are to determine the recovery point objective (RPO) and recovery time objective (RTO) to support your organizational requirements. |
| Setup resiliency | [Resiliency](/azure/architecture/framework/resiliency/overview) helps to maintain service levels when there's disruption to business operations and core IT services. The capability spans services, data, Azure AD and AD considerations. Determining a strategic [resiliency plan](/azure/architecture/checklist/resiliency-per-service) to include what systems and data rely on Azure AD and hybrid environments.<p>[Microsoft 365 resiliency](/compliance/assurance/assurance-sharepoint-onedrive-data-resiliency) covering the core services, which include Exchange, SharePoint, and OneDrive to protect against data corruption and applying resiliency data points to protect ePHI content. |
| Create break glass accounts | Establishing an emergency or a [break glass account](../roles/security-emergency-access.md) ensures that system and services can still be accessed in unforeseen circumstances, such as network failures or other reasons for administrative access loss. We recommend you don't associate this account with an [individual user](../authentication/concept-authentication-passwordless.md) or account. |

## Workstation Security - Automatic Logoff

The following table provides a list of the Automatic Logoff Safeguard from the HIPAA guidance and Microsoft’s recommendations to enable you to meet safeguard implementation requirements.

**HIPAA Safeguard - Automatic Logoff**

```Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity.| Create a policy and procedure to determine the length of time that a user is allowed to stay logged on, after a predetermined period of inactivity.```

| Recommendation | Action |
| - | - |
| Create Group Policy | Support for devices that haven't been migrated to Azure AD and managed by Intune, [Group Policy (GPO)](../../active-directory-domain-services/manage-group-policy.md) can enforce a sign out or lock screen time for devices on AD or in hybrid environments. |
| Assess device management requirements | [Microsoft IntTune](/mem/intune/fundamentals/what-is-intune) provides mobile device management (MDM) and mobile application management (MAM). It provides control over company and personal devices. This includes managing how devices can be used and enforcing policies that give you direct control over mobile applications. |
| Device conditional access policy | Implement device lock by using a conditional access policy to restrict access to [compliant](../conditional-access/concept-conditional-access-grant.md) or hybrid Azure AD joined devices. Configure [policy settings](../conditional-access/concept-conditional-access-grant.md#require-hybrid-azure-ad-joined-device).<p>For unmanaged devices, configure the [Sign-In Frequency](../conditional-access/howto-conditional-access-session-lifetime.md) setting to force users to reauthenticate. |
| Configure session time out for Microsoft 365 | Review the [session timeouts](/microsoft-365/admin/manage/idle-session-timeout-web-apps) for Microsoft 365 applications and services, to amend any prolonged timeouts. |
| Configure session time out for Azure portal | Review the [session timeouts for Azure portal session](../../azure-portal/set-preferences.md), by implementing a timeout due to inactivity it helps to protect resources from unauthorized access. |
| Review application access sessions | [Continuous access evaluation](../conditional-access/concept-continuous-access-evaluation.md) policies can deny or grant access to applications. If the sign-in is successful, the user is given an access token that is valid for one (1) hour. Once the access token expires the client is directed back to Azure AD, conditions are reevaluated, and the token is refreshed for another hour. |

### Learn more

* [Zero Trust Pillar: Identity, Devices](/security/zero-trust/zero-trust-overview)

* [Zero Trust Pillar: Identity, Data](/security/zero-trust/zero-trust-overview)

* [Zero Trust Pillar: Devices, Identity, Application](/security/zero-trust/zero-trust-overview)

### Next Steps

* [Access Controls Safeguard guidance](hipaa-access-controls.md)

* [Audit Controls Safeguard guidance](hipaa-audit-controls.md)

* [Other Safeguard guidance](hipaa-other-controls.md)
