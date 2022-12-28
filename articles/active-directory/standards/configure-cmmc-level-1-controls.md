---
title: Configure CMMC Level 1 controls
description: Learn how to configure Azure AD identities to meet CMMC Level 1 requirements.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 12/13/2022
ms.author: jricketts
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Configure CMMC Level 1 controls

Azure Active Directory meets identity-related practice requirements in each Cybersecurity Maturity Model Certification (CMMC) level. To be compliant with requirements in CMMC, it's the responsibility of companies performing work with, and on behalf of, the US Dept. of Defense (DoD) to complete other configurations or processes.
In CMMC Level 1, there are three domains that have one or more practices related to identity. The three domains are:

* Access Control (AC)
* Identification and Authentication (IA)
* System and Information integrity (SI)

Learn more:

* DoD CMMC website - [Office of the Under Secretary of Defense for Acquisition & Sustainment Cybersecurity Maturity Model Certification](https://www.acq.osd.mil/cmmc/index.html)
* Microsoft Download Center - [Microsoft Product Placemat for CMMC Level 3 (preview)](https://www.microsoft.com/download/details.aspx?id=102536)

The remainder of this content is organized by domain and associated practices. For each domain, there's a table with links to content that provides step-by-step guidance to accomplish the practice.

## Access Control domain

The following table provides a list of control IDs and associated customer responsibilities and guidance.

| *Control* | *Guidance* |
| - | - |
| AC.L1-3.1.1 | You're responsible for provisioning Azure AD accounts. Provisioning accounts in Azure AD is accomplished from external HR systems, on-premises Active Directory, or directly in the cloud. You configure Conditional Access to only grant access from a known (Registered/Managed) device. Additionally, apply the concept of least privilege when granting application permissions. Where possible, use delegated permission. <br><br>Provision users<br><li>[Plan cloud HR application to Azure Active Directory user provisioning](../app-provisioning/plan-cloud-hr-provision.md) <li>[Azure AD Connect sync: Understand and customize synchronization](../hybrid/how-to-connect-sync-whatis.md)<li>[Add or delete users – Azure Active Directory](../fundamentals/add-users-azure-active-directory.md)<br><br>Provision devices<li>[What is device identity in Azure Active Directory](../devices/overview.md)<br><br>Configure applications<li>[QuickStart: Register an app in the Microsoft identity platform](../develop/quickstart-register-app.md)<li>[Microsoft identity platform scopes, permissions, & consent](../develop/v2-permissions-and-consent.md)<li>[Securing service principals in Azure Active Directory](../fundamentals/service-accounts-principal.md)<br><br>Conditional access<li>[What is Conditional Access in Azure Active Directory](../conditional-access/overview.md)<li>[Conditional Access require managed device](../conditional-access/require-managed-devices.md) |
| AC.L1-3.1.2 | You're responsible for configuring access controls such as Role Based Access Controls (RBAC) with built-in or custom roles. Use role assignable groups to manage role assignments for multiple users requiring same access. Configure Attribute Based Access Controls (ABAC) with default or custom security attributes. The objective is to granularly control access to resources protected with Azure AD.<br><br>Provision RBAC<li>[Overview of role-based access control in Active Directory ](../roles/custom-overview.md)[Azure AD built-in roles](../roles/permissions-reference.md)<li>[Create and assign a custom role in Azure Active Directory](../roles/custom-create.md)<br><br>Provision ABAC<li>[What is Azure attribute-based access control (Azure ABAC)](/azure/role-based-access-control/conditions-overview)<li>[What are custom security attributes in Azure AD?](/azure/active-directory/fundamentals/custom-security-attributes-overview)<br><br>Provision groups for role assignment<li>[Use Azure AD groups to manage role assignments](../roles/groups-concept.md) |
| AC.L1-3.1.20 | You're responsible for configuring conditional access policies using device controls and or network locations to control and or limit connections and use of external systems. Configure Terms of Use (TOU) for recorded user acknowledgment of terms and conditions for use of external systems for access.<br><br>Provision Conditional Access as required<li>[What is Conditional Access?](../conditional-access/overview.md)<li>[Require managed devices for cloud app access with Conditional Access](../conditional-access/require-managed-devices.md)<li>[Require device to be marked as compliant](../conditional-access/require-managed-devices.md)<li>[Conditional Access: Filter for devices](/azure/active-directory/conditional-access/concept-condition-filters-for-devices)<br><br>Use Conditional Access to block access<li>[Conditional Access - Block access by location](../conditional-access/howto-conditional-access-policy-location.md)<br><br>Configure terms of use<li>[Terms of use - Azure Active Directory](../conditional-access/terms-of-use.md)<li>[Conditional Access require terms of use ](../conditional-access/require-tou.md) |
| AC.L1-3.1.22 | You're responsible for configuring Privileged Identity Management (PIM) to manage access to systems where posted information is publicly accessible. Require approvals with justification prior to role assignment in PIM. Configure Terms of Use (TOU) for systems where posted information is publicly accessible for recorded acknowledgment of terms and conditions for posting of publicly accessible information.<br><br>Plan PIM deployment<li>[What is Privileged Identity Management?](../privileged-identity-management/pim-configure.md)<li>[Plan a Privileged Identity Management deployment](../privileged-identity-management/pim-deployment-plan.md)<br><br>Configure terms of use<li>[Terms of use - Azure Active Directory](../conditional-access/terms-of-use.md)<li>[Conditional Access require terms of use ](../conditional-access/require-tou.md)<li>[Configure Azure AD role settings in PIM - Require Justification](../privileged-identity-management/pim-how-to-change-default-settings.md) |

## Identification and Authentication (IA) domain

The following table provides a list of control IDs and associated customer responsibilities and guidance.

| *Control* | *Guidance* |
| - | - |
| IA.L1-3.5.1 | Azure AD uniquely identifies users, processes (service principal/workload identities), and devices via the ID property on the respective directory objects. You can filter log files to help with your assessment using the following links. Use the following reference to meet assessment objectives.<br><br>Filtering logs by user properties<li>[User resource type: ID Property](/graph/api/resources/user?view=graph-rest-1.0&preserve-view=true)<br><br>Filtering logs by service properties<li>[ServicePrincipal resource type: ID Property](/graph/api/resources/serviceprincipal?view=graph-rest-1.0&preserve-view=true)<br><br>Filtering logs by device properties<li>[Device resource type: ID Property](/graph/api/resources/device?view=graph-rest-1.0&preserve-view=true) |
IA.L1-3.5.2 | Azure AD uniquely authenticates or verifies each user, process acting on behalf of user, or device as a prerequisite to system access. Use the following reference to meet assessment objectives.<br><br>Provision user accounts<li>[What is Azure Active Directory authentication?](../authentication/overview-authentication.md)<br><br>[Configure Azure Active Directory to meet NIST authenticator assurance levels](../standards/nist-overview.md)<br><br>Provision service principal accounts<li>[Service principal authentication](../fundamentals/service-accounts-principal.md)<br><br>Provision Device accounts<li>[What is a device identity?](../devices/overview.md)<li>[How it works: Device registration](../devices/device-registration-how-it-works.md)<li>[What is a Primary Refresh Token?](../devices/concept-primary-refresh-token.md)<li>[What does the Primary Refresh Token (PRT) contain?](/azure/active-directory/devices/concept-primary-refresh-token#what-does-the-prt-contain)|

## System and Information Integrity (SI) domain

The following table provides a list of control IDs and associated responsibilities and guidance.

| *Control* | *Guidance* |
| - | - |
| SI.L1-3.14.1<br><br>SI.L1-3.14.2<br><br>SI.L1-3.14.4<br><br>SI.L1-3.14.5 | **Consolidated Guidance for legacy managed devices**<br>Configure conditional access to require Hybrid Azure AD joined device. For devices that are joined to an on-premises AD, it's assumed that the control over these devices is enforced using management solutions such as Configuration Manager or group policy (GP). Because there's no method for Azure AD to determine whether any of these methods has been applied to a device, requiring a hybrid Azure AD joined device is a relatively weak mechanism to require a managed device. The administrator judges whether the methods applied to your on-premises domain-joined devices are strong enough to constitute a managed device, if the device is also a Hybrid Azure AD joined device.<br><br>**Consolidated guidance for cloud-managed (or co-management) devices**<br>Configure conditional access to require a device to be marked as compliant, the strongest form to request a managed device. This option requires a device to be registered with Azure AD, and to be marked as compliant by Intune or third-party mobile device management (MDM) system that manages Windows 10 devices via Azure AD integration.

### Next steps

* [Configure Azure Active Directory for CMMC compliance](configure-azure-active-directory-for-cmmc-compliance.md)

* [Configure CMMC Level 2 Access Control (AC) controls](configure-cmmc-level-2-access-control.md)

* [Configure CMMC Level 2 Identification and Authentication (IA) controls](configure-cmmc-level-2-identification-and-authentication.md)

* [Configure CMMC Level 2 additional controls](configure-cmmc-level-2-additional-controls.md)
