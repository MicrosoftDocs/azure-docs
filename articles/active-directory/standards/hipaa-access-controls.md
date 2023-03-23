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
ms.date: 03/17/2023
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Access Controls Safeguard guidance

Azure Active Directory meets identity-related practice requirements for implementing HIPAA safeguards. To be HIPAA compliant, it's the responsibility of companies to implement the safeguards using this guidance along with any other configurations or processes needed.

To better understand the **User Identification Safeguard**, we recommend you research and set objectives that enable you to:

* Ensure IDs are unique to everyone that needs to connect to the domain.

* Establish a Joiner, Mover, and Leaver (JML) process.

* Enabler auditing for identity tracking.

For the **Authorized Access Control Safeguard**, we recommend you research and set objectives so that:

* System access is limited to authorized users.

* Authorized users are identified.

* Access to personal data is limited to authorized users.

For the **Emergency Access Procedure Safeguard**, we recommend you research and plan to:

* Ensure high availability of core services.

* Eliminate single points of failure.

* Establish a disaster recovery plan.

* Ensure backups of high-risk data.

* Establish and maintain emergency access accounts.

For the **Automatic Logoff Safeguard**, we recommend you:

* Establish a procedure that terminates an electronic session after a predetermined time of inactivity.

* Configure and implement an automatic sign out policy.

The following table provides a list of the Access Control Safeguards from the HIPAA guidance and Microsoft’s recommendations to enable you to meet the safeguard implementation requirements with Azure AD.

| HIPAA safeguard | Guidance and recommendations |
| - | - |
| **Unique User Identification** – Assign a unique name and/or number for identifying and tracking user identity. | You're responsible for provisioning Azure AD accounts. Provisioning accounts can be accomplished from manual creation; however we recommend integrating with external HR systems, on-premises Active Directory (AD), or directly in Azure AD. You can filter log files to help with your safeguard objectives.<p><p>Configure hybrid identities to integrate with Azure AD<p>[Integrate Active Directory (AD) with Azure AD](../hybrid/how-to-connect-install-express.md) with Azure AD Connect<p>[Prerequisites for install](../hybrid/how-to-connect-install-prerequisites.md)<p>[Provisioning agent](../cloud-sync/tutorial-pilot-aadc-aadccp.md) for multi-forest environments<p>[Password Hash Sync](../hybrid/whatis-phs.md)<p><p>**Provision user accounts**<p>Azure Active Directory authentication<p>[Configuring users](../fundamentals/add-users-azure-active-directory.md)<p>[Provision users for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)<p><p>HR-driven provisioning<p>[Plan HR user provisioning](../app-provisioning/plan-cloud-hr-provision.md)<p><p>Create lifecycle workflows<p>[Understanding lifecycle workflows](../governance/understanding-lifecycle-workflows.md)<p>[Use templates](../governance/lifecycle-workflow-templates.md)<p><p>Manage privileged identities<p>[Implement Azure AD Privileged Identity Management](../privileged-identity-management/pim-configure.md)<p><p>Monitoring and alerting<p>[Implement Identity Protection](../identity-protection/overview-identity-protection.md)<p>[Download activity logs for review](../reports-monitoring/howto-download-logs.md)<p>[View logs with Azure Monitor](../reports-monitoring/concept-activity-logs-azure-monitor.md)<p>[Use ID properties to filter logs](/graph/api/resources/user?view=graph-rest-1.0&preserve-view=true) |
| **Authorized Access Control** - Person or entity authentication, implement procedures to verify that a person or entity seeking access to electronic protected health information is the one claimed.| You're responsible for configuring access controls such as Multifactor Authentication (MFA) and Role Based Access Controls (RBAC) with built-in or custom rules that provide granular control over Azure AD objects. Use role assignable groups to manage role assignments for multiple users requiring same access. Configure Attribute Based Access Controls (ABAC) with default or custom security attributes.<p><p>Enable MFA<p>[Multifactor authentication (MFA) in Azure AD](../authentication/concept-mfa-howitworks.md)<p>[Use Authenticator app with MFA](https://support.microsoft.com/account-billing/set-up-an-authenticator-app-as-a-two-step-verification-method-2db39828-15e1-4614-b825-6e2b524e7c95)<p>[Configure passwordless authentication](../authentication/concept-authentication-passwordless.md)<p><p>Enable Conditional Access policies<p>[Build a Conditional Access policy](../conditional-access/concept-conditional-access-policies.md)<p><p>Provision RBAC<p>[Use RBAC](../roles/custom-overview.md)<p>[Use built-in roles](../roles/permissions-reference.md)<p>[Use custom roles](../roles/custom-create.md)<p><p>Provision ABAC<p>[Use ABAC](../../role-based-access-control/conditions-overview.md)<p><p>User group access in SharePoint<p>[Use SharePoint groups](/sharepoint/dev/general-development/authorization-users-groups-and-the-object-model-in-sharepoint) |
| **Emergency Access Procedure** - Establish (and implement as needed) procedures and policies for obtaining necessary electronic protected health information during an emergency or occurrence.| You're responsible for reducing the risk and eliminating single points of failure for continuous operations and uptime for access to patient information. You're also responsible for backup of data incorporated within a disaster recovery plan, and configuring break glass accounts.<p><p>Provision Azure Recovery Services<p>[Azure Backup](../../backup/backup-architecture.md)<p>[Backup policies](../../backup/backup-architecture.md)<p>[Azure Site Recovery](../../site-recovery/site-recovery-overview.md)<p>[Failover/failback](../../site-recovery/failover-failback-overview-modernized.md)<p><p>Setup resiliency<p>[About resiliency in Azure AD](/azure/architecture/framework/resiliency/overview)<p>[Create a plan](/architecture/checklist/resiliency-per-service)<p>[Microsoft 365 resiliency](/compliance/assurance/assurance-sharepoint-onedrive-data-resiliency)<p><p>Create break glass accounts<p>[Manage emergency access](../roles/security-emergency-access.md)<p>[Passwordless options and cautions](../authentication/concept-authentication-passwordless.md) |
| **Automatic Logoff** - Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity.| You're responsible for determining a policy and procedure to determine the length of time that a user is allowed to stay logged on, after a predetermined period of inactivity.<p><p>Create Group Policy<p>[Use Group Policy](../../active-directory-domain-services/manage-group-policy.md)<p><p>Assess device management requirements<p>[Microsoft Intune capabilities](/mem/intune/fundamentals/what-is-intune)<p><p>Device conditional access policy<p>[Restrict access using Conditional Access](../conditional-access/concept-conditional-access-grant.md)<p>[Joined devices](../conditional-access/concept-conditional-access-grant.md)<p>[Authentication session management](../conditional-access/howto-conditional-access-session-lifetime.md)<p><p>Configure session time out for Microsoft 365<p>[Idle session timeout setting](/microsoft-365/admin/manage/idle-session-timeout-web-apps)<p><p>Configure session time out for Azure portal<p>[Manage portal settings](../../azure-portal/set-preferences.md)<p><p>Review application access sessions<p>[Configure continuous access evaluations](../conditional-access/concept-continuous-access-evaluation.md) |

## Learn more

* [Zero Trust Pillar: Identity, Devices](/security/zero-trust/zero-trust-overview)

* [Zero Trust Pillar: Identity, Data](/security/zero-trust/zero-trust-overview)

* [Zero Trust Pillar: Devices, Identity, Application](/security/zero-trust/zero-trust-overview)

### Next Steps

* [Access Controls Safeguard guidance](hipaa-access-controls.md)

* [Audit Controls Safeguard guidance](hipaa-audit-controls.md)

* [Other Safeguard guidance](hipaa-other-controls.md)
