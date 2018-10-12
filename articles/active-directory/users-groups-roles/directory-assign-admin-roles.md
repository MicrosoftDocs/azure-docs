---
title: Administrator role permissions in Azure Active Directory | Microsoft Docs
description: An admin role can add users, assign administrative roles, reset user passwords, manage user licenses, or manage domains.
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.workload: identity
ms.component: users-groups-roles
ms.topic: article
ms.date: 09/25/2018
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

---

# Administrator role permissions in Azure Active Directory

Using Azure Active Directory (Azure AD), you can designate separate administrators to serve different functions. Administrators can be designated in the Azure AD portal to perform tasks such as adding or changing users, assigning administrative roles, resetting user passwords, managing user licenses, and managing domain names.

The Global Administrator has access to all administrative features. By default, the person who signs up for an Azure subscription is assigned the Global Administrator role for the directory. Only Global Administrators can delegate administrator roles.

## Assign or remove administrator roles

To learn how to assign administrative roles to a user in Azure Active Directory, see [View and assign administrator roles in Azure Active Directory](directory-manage-roles-portal.md).

## Available roles

The following administrator roles are available:

* **[Application Administrator](#application-administrator)**: Users in this role can create and manage all aspects of enterprise applications, application registrations, and application proxy settings. This role also grants the ability to consent to delegated permissions, and application permissions excluding Microsoft Graph and Azure AD Graph. Members of this role are not added as owners when creating new application registrations or enterprise applications.

  <b>Important</b>: This role grants the ability to manage application credentials. Users assigned this role can add credentials to an application, and use those credentials to impersonate the application’s identity. If the application’s identity has been granted access to Azure Active Directory, such as the ability to create or update User or other objects, then a user assigned to this role could perform those actions while impersonating the application. This ability to impersonate the application’s identity may be an elevation of privilege over what the user can do via their role assignments in Azure AD. It is important to understand that assigning a user to the Application Administrator role gives them the ability to impersonate an application’s identity.

* **[Application Developer](#application-developer)**: Users in this role can create application registrations when the "Users can register applications" setting is set to No. This role also allows members to consent on their own behalf when the "Users can consent to apps accessing company data on their behalf" setting is set to No. Members of this role are added as owners when creating new application registrations or enterprise applications.

* **[Billing Administrator](#billing-administrator)**: Makes purchases, manages subscriptions, manages support tickets, and monitors service health.

* **[Cloud Application Administrator](#cloud-application-administrator)**: Users in this role have the same permissions as the Application Administrator role, excluding the ability to manage application proxy. This role grants the ability to create and manage all aspects of enterprise applications and application registrations. This role also grants the ability to consent to delegated permissions, and application permissions excluding Microsoft Graph and Azure AD Graph. Members of this role are not added as owners when creating new application registrations or enterprise applications.

  <b>Important</b>: This role grants the ability to manage application credentials. Users assigned this role can add credentials to an application, and use those credentials to impersonate the application’s identity. If the application’s identity has been granted access to Azure Active Directory, such as the ability to create or update User or other objects, then a user assigned to this role could perform those actions while impersonating the application. This ability to impersonate the application’s identity may be an elevation of privilege over what the user can do via their role assignments in Azure AD. It is important to understand that assigning a user to the Cloud Application Administrator role gives them the ability to impersonate an application’s identity.

* **[Cloud Device Administrator](#cloud-device-administrator)**: Users in this role can enable, disable, and delete devices in Azure AD and read Windows 10 BitLocker keys (if present) in the Azure portal. The role does not grant permissions to manage any other properties on the device.

* **[Compliance Administrator](#compliance-administrator)**: Users with this role have management permissions within in the Office 365 Security & Compliance Center and Exchange Admin Center. More information at [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

* **[Conditional Access Administrator](#conditional-access-administrator)**: Users with this role have the ability to manage Azure Active Directory conditional access settings.
  > [!NOTE]
  > To deploy Exchange ActiveSync conditional access policy in Azure, the user must also be a Global Administrator.
  
* **[Device Administrators](#device-administrators)**: This role is available for assignment only as an additional local administrator in [Device settings](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/DevicesMenuBlade/DeviceSettings/menuId/). Users with this role become local machine administrators on all Windows 10 devices that are joined to Azure Active Directory. They do not have the ability to manage devices objects in Azure Active Directory. 

* **[Directory Readers](#directory-readers)**: This is a legacy role that is to be assigned to applications that do not support the [Consent Framework](../develop/quickstart-v1-integrate-apps-with-azure-ad.md). It should not be assigned to any users.

* **[Directory Synchronization Accounts](#directory-synchronization-accounts)**: Do not use. This role is automatically assigned to the Azure AD Connect service, and is not intended or supported for any other use.

* **[Directory Writers](#directory-writers)**: This is a legacy role that is to be assigned to applications that do not support the [Consent Framework](../develop/quickstart-v1-integrate-apps-with-azure-ad.md). It should not be assigned to any users.

* **[Dynamics 365 service administrator / CRM Service Administrator](#dynamics-365-service-administrator)**: Users with this role have global permissions within Microsoft Dynamics 365 Online, when the service is present, as well as the ability to manage support tickets and monitor service health. More information at [Use the service admin role to manage your tenant](https://docs.microsoft.com/dynamics365/customer-engagement/admin/use-service-admin-role-manage-tenant).

* **[Exchange Service Administrator](#exchange-service-administrator)**: Users with this role have global permissions within Microsoft Exchange Online, when the service is present. More information at [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

* **[Global Administrator / Company Administrator](#company-administrator)**: Users with this role have access to all administrative features in Azure Active Directory, as well as services that use Azure Active Directory identities like Exchange Online, SharePoint Online, and Skype for Business Online. The person who signs up for the Azure Active Directory tenant becomes a global administrator. Only global administrators can assign other administrator roles. There can be more than one global administrator at your company. Global admins can reset the password for any user and all other administrators.

  > [!NOTE]
  > In Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell, this role is identified as "Company Administrator". It is "Global Administrator" in the [Azure portal](https://portal.azure.com).
  >
  >

* **[Guest Inviter](#guest-inviter)**: Users in this role can manage Azure Active Directory B2B guest user invitations when the **Members can invite** user setting is set to No. More information about B2B collaboration at [About Azure AD B2B collaboration](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b). It does not include any other permissions.

* **[Information Protection Administrator](#information-protection-administrator)**: Users with this role have all permissions in the Azure Information Protection service. This role allows configuring labels for the Azure Information Protection policy, managing protection templates, and activating protection. This role does not grant any permissions in Identity Protection Center, Privileged Identity Management, Monitor Office 365 Service Health, or Office 365 Security & Compliance Center.

* **[Intune Service Administrator](#intune-service-administrator)**: Users with this role have global permissions within Microsoft Intune Online, when the service is present. Additionally, this role contains the ability to manage users and devices in order to associate policy, as well as create and manage groups. More information at [Role-based administration control (RBAC) with Microsoft Intune](https://docs.microsoft.com/intune/role-based-access-control)

* **[License Administrator](#license-administrator)**: 
Users in this role can add, remove, and update license assignments on users, groups (using group-based licensing), and manage the usage location on users. The role does not grant the ability to purchase or manage subscriptions, create or manage groups, or create or manage users beyond the usage location.

* **[Message Center Reader](#message-center-reader)**: Users in this role can monitor notifications and advisory health updates in [Office 365 Message center](https://support.office.com/article/Message-center-in-Office-365-38FB3333-BFCC-4340-A37B-DEDA509C2093) for their organization on configured services such as Exchange, Intune, and Microsoft Teams. Message Center Readers receive weekly email digests of posts, updates, and can share message center posts in Office 365. In Azure AD, users assigned to this role will only have read-only access on Azure AD services such as users and groups. 

* **[Partner Tier1 Support](#partner-tier1-support)**: Do not use. This role has been deprecated and will be removed from Azure AD in the future. This role is intended for use by a small number of Microsoft resale partners, and is not intended for general use.

* **[Partner Tier2 Support](#partner-tier2-support)**: Do not use. This role has been deprecated and will be removed from Azure AD in the future. This role is intended for use by a small number of Microsoft resale partners, and is not intended for general use.

* **[Password Administrator / Helpdesk Administrator](#helpdesk-administrator)**: Users with this role can change passwords, invalidate refresh tokens, manage service requests, and monitor service health. Invalidating a refresh token forces the user to sign in again. Helpdesk administrators can reset passwords and invalidate refresh tokens of other users who are non-administrators or members of the following roles only:
  * Directory Readers
  * Guest Inviter
  * Helpdesk Administrator
  * Message Center Reader
  * Reports Reader
  
  > [!NOTE]
  > In Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell, this role is identified as "Helpdesk Administrator". It is "Password Administrator" in the [Azure portal](https://portal.azure.com/).
  >
  
* **[Power BI Service Administrator](#power-bi-service-administrator)**: Users with this role have global permissions within Microsoft Power BI, when the service is present, as well as the ability to manage support tickets and monitor service health. More information at [Understanding the Power BI admin role](https://docs.microsoft.com/power-bi/service-admin-role).

* **[Privileged Role Administrator](#privileged-role-administrator)**: Users with this role can manage role assignments in Azure Active Directory, as well as within Azure AD Privileged Identity Management. In addition, this role allows management of all aspects of Privileged Identity Management.

  <b>Important</b>: This role grants the ability to manage membership in all Azure AD roles including the Global Administrator role. This role does not include any other privileged abilities in Azure AD like creating or updating users. However, users assigned to this role can grant themselves or others’ additional privilege by assigning additional roles.

* **[Reports Reader](#reports-reader)**: Users with this role can view usage reporting data and the reports dashboard in Office 365 admin center and the adoption context pack in Power BI. Additionally, the role provides access to sign-in reports and activity in Azure AD and data returned by the Microsoft Graph reporting API. A user assigned to the Reports Reader role can access only relevant usage and adoption metrics. They don't have any admin permissions to configure settings or access the product-specific admin centers like Exchange. 

* **[Security Administrator](#security-administrator)**: Users with this role have all of the read-only permissions of the Security reader role, plus the ability to manage configuration for security-related services: Azure Active Directory Identity Protection, Azure Information Protection, and Office 365 Security & Compliance Center. More information about Office 365 permissions is available at [Permissions in the Office 365 Security & Compliance Center](https://support.office.com/article/Permissions-in-the-Office-365-Security-Compliance-Center-d10608af-7934-490a-818e-e68f17d0e9c1).
  
  | In | Can do |
  | --- | --- |
  | Identity Protection Center |<ul><li>All permissions of the Security Reader role.<li>Additionally, the ability to perform all IPC operations except for resetting passwords. |
  | Privileged Identity Management |<ul><li>All permissions of the Security Reader role.<li>**Cannot** manage Azure AD role memberships or settings. |
  | <p>Monitor Office 365 Service Health</p><p>Office 365 Security & Compliance Center |<ul><li>All permissions of the Security Reader role.<li>Can configure all settings in the Advanced Threat Protection feature (malware & virus protection, malicious URL config, URL tracing, etc.). |
  
* **[Security Reader](#security-reader)**: Users with this role have global read-only access, including all information in Azure Active Directory, Identity Protection, Privileged Identity Management, as well as the ability to read Azure Active Directory sign-in reports and audit logs. The role also grants read-only permission in Office 365 Security & Compliance Center. More information about Office 365 permissions is available at [Permissions in the Office 365 Security & Compliance Center](https://support.office.com/article/Permissions-in-the-Office-365-Security-Compliance-Center-d10608af-7934-490a-818e-e68f17d0e9c1).

  | In | Can do |
  | --- | --- |
  | Identity Protection Center |Read all security reports and settings information for security features<ul><li>Anti-spam<li>Encryption<li>Data loss prevention<li>Anti-malware<li>Advanced threat protection<li>Anti-phishing<li>Mailflow rules |
  | Privileged Identity Management |<p>Has read-only access to all information surfaced in Azure AD PIM: Policies and reports for Azure AD role assignments, security reviews and in the future read access to policy data and reports for scenarios besides Azure AD role assignment.<p>**Cannot** sign up for Azure AD PIM or make any changes to it. In PIM's portal or via PowerShell, someone in this role can activate additional roles (for example, Global Admin or Privileged Role Administrator), if the user is a candidate for them. |
  | <p>Monitor Office 365 Service Health</p><p>Office 365 Security & Compliance Center</p> |<ul><li>Read and manage alerts<li>Read security policies<li>Read threat intelligence, Cloud App Discovery, and Quarantine in Search and Investigate<li>Read all reports |

* **[Service Support Administrator](#service-support-administrator)**: Users with this role can open support requests with Microsoft for Azure and Office 365 services, and views the service dashboard and message center in the Azure portal and Office 365 admin portal. More information at [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

* **[SharePoint Service Administrator](#sharepoint-service-administrator)**: Users with this role have global permissions within Microsoft SharePoint Online, when the service is present, as well as the ability to manage support tickets and monitor service health. More information at [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

* **[Skype for Business / Lync Service Administrator](#lync-service-administrator)**: Users with this role have global permissions within Microsoft Skype for Business, when the service is present, as well as manage Skype-specific user attributes in Azure Active Directory. Additionally, this role grants the ability to manage support tickets and monitor service health, and to access the Teams and Skype for Business Admin Center. The account must also be licensed for Teams or it can't run Teams PowerShell cmdlets. More information at [About the Skype for Business admin role](https://support.office.com/article/about-the-skype-for-business-admin-role-aeb35bda-93fc-49b1-ac2c-c74fbeb737b5) and Teams licensing information at [Skype for Business and Microsoft Teams add-on licensing](https://docs.microsoft.com/skypeforbusiness/skype-for-business-and-microsoft-teams-add-on-licensing/skype-for-business-and-microsoft-teams-add-on-licensing)

  > [!NOTE]
  > In Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell, this role is identified as "Lync Service Administrator". It is "Skype for Business Service Administrator" in the [Azure portal](https://portal.azure.com/).
  >
  >

* **[Teams Communications Administrator](#teams-communications-administrator)**: Users in this role can manage aspects of the Microsoft Teams workload related to voice & telephony. This includes the management tools for telephone number assignment, voice and meeting policies, and full access to the call analytics toolset.

* **[Teams Communications Support Engineer](#teams-communications-support-engineer)**: Users in this role can troubleshoot communication issues within Microsoft Teams & Skype for Business using the user call troubleshooting tools in the Microsoft Teams & Skype for Business admin center. Users in this role can view full call record information for all participants involved.

* **[Teams Communications Support Specialist](#teams-communications-support-specialist)**: Users in this role can troubleshoot communication issues within Microsoft Teams & Skype for Business using the user call troubleshooting tools in the Microsoft Teams & Skype for Business admin center. Users in this role can only view user details in the call for the specific user they have looked up.

* **[Teams Service Administrator](#teams-service-administrator)**: Users in this role can manage all aspects of the Microsoft Teams workload via the Microsoft Teams & Skype for Business admin center and the respective PowerShell modules. This includes, among other areas, all management tools related to telephony, messaging, meetings, and the teams themselves. This role also grants the ability to manage Office 365 groups.

* **[User Account Administrator](#user-account-administrator)**: Users with this role can create users, and manage all aspects of users with some restrictions (see below). Additionally, users with this role can create and manage all groups. This role also includes the ability to create and manage user views, manage support tickets, and monitor service health.

  | | |
  | --- | --- |
  |General permissions|<p>Create users and groups</p><p>Create and manage user views</p><p>Manage Office support tickets|
  |<p>On all users, including all admins</p>|<p>Manage licenses</p><p>Manage all user properties except User Principal Name</p>
  |Only on users who are non-admins or in any of the following limited admin roles:<ul><li>Directory Readers<li>Guest Inviter<li>Helpdesk Administrator<li>Message Center Reader<li>Reports Reader<li>User Account Administrator|<p>Delete and restore</p><p>Disable and enable</p><p>Invalidate refresh Tokens</p><p>Manage all user properties including User Principal Name</p><p>Reset password</p><p>Update (FIDO) device keys</p>

The following tables describe the specific permissions in Azure Active Directory given to each role. Some roles may have additional permissions in Microsoft services outside of Azure Active Directory.

### Application Administrator
Can create and manage all aspects of app registrations and enterprise apps.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/applications/audience/update | Update applications.audience property in Azure Active Directory. |
| microsoft.aad.directory/applications/authentication/update | Update applications.authentication property in Azure Active Directory. |
| microsoft.aad.directory/applications/basic/update | Update basic properties on applications in Azure Active Directory. |
| microsoft.aad.directory/applications/create | Create applications in Azure Active Directory. |
| microsoft.aad.directory/applications/credentials/update | Update applications.credentials property in Azure Active Directory. |
| microsoft.aad.directory/applications/delete | Delete applications in Azure Active Directory. |
| microsoft.aad.directory/applications/owners/update | Update applications.owners property in Azure Active Directory. |
| microsoft.aad.directory/applications/permissions/update | Update applications.permissions property in Azure Active Directory. |
| microsoft.aad.directory/applications/policies/update | Update applications.policies property in Azure Active Directory. |
| microsoft.aad.directory/appRoleAssignments/create | Create appRoleAssignments in Azure Active Directory. |
| microsoft.aad.directory/appRoleAssignments/read | Read appRoleAssignments in Azure Active Directory. |
| microsoft.aad.directory/appRoleAssignments/update | Update appRoleAssignments in Azure Active Directory. |
| microsoft.aad.directory/appRoleAssignments/delete | Delete appRoleAssignments in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/basic/read | Read policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/basic/update | Update policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/create | Create policies in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/delete | Delete policies in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/owners/read | Read policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/owners/update | Update policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/policyAppliedTo/read | Read policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/basic/update | Update basic properties on servicePrincipals in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/create | Create servicePrincipals in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/delete | Delete servicePrincipals in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/appRoleAssignedTo/update | Update servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/appRoleAssignments/update | Update servicePrincipals.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/owners/update | Update servicePrincipals.owners property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/policies/update | Update servicePrincipals.policies property in Azure Active Directory. |
| microsoft.aad.directory/users/assignLicense | Manage licenses on users in Azure Active Directory. |
| microsoft.aad.reports/allEntities/read | Read Azure AD Reports. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Application Developer
Can create application registrations independent of the ‘Users can register applications’ setting.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/applications/createAsOwner | Create applications in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.aad.directory/appRoleAssignments/createAsOwner | Create appRoleAssignments in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.aad.directory/oAuth2PermissionGrants/createAsOwner | Create oAuth2PermissionGrants in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.aad.directory/servicePrincipals/createAsOwner | Create servicePrincipals in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |

### Billing Administrator
Can perform common billing related tasks like updating payment information.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/organization/basic/update | Update basic properties on organization in Azure Active Directory. |
| microsoft.aad.directory/organization/trustedCAsForPasswordlessAuth/update | Update organization.trustedCAsForPasswordlessAuth property in Azure Active Directory. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.commerce.billing/allEntities/allTasks | Manage all aspects of Office 365 billing. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Cloud Application Administrator
Can create and manage all aspects of app registrations and enterprise apps except App Proxy.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/applications/audience/update | Update applications.audience property in Azure Active Directory. |
| microsoft.aad.directory/applications/authentication/update | Update applications.authentication property in Azure Active Directory. |
| microsoft.aad.directory/applications/basic/update | Update basic properties on applications in Azure Active Directory. |
| microsoft.aad.directory/applications/create | Create applications in Azure Active Directory. |
| microsoft.aad.directory/applications/credentials/update | Update applications.credentials property in Azure Active Directory. |
| microsoft.aad.directory/applications/delete | Delete applications in Azure Active Directory. |
| microsoft.aad.directory/applications/owners/update | Update applications.owners property in Azure Active Directory. |
| microsoft.aad.directory/applications/permissions/update | Update applications.permissions property in Azure Active Directory. |
| microsoft.aad.directory/applications/policies/update | Update applications.policies property in Azure Active Directory. |
| microsoft.aad.directory/appRoleAssignments/create | Create appRoleAssignments in Azure Active Directory. |
| microsoft.aad.directory/appRoleAssignments/update | Update appRoleAssignments in Azure Active Directory. |
| microsoft.aad.directory/appRoleAssignments/delete | Delete appRoleAssignments in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/create | Create policies in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/basic/read | Read policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/basic/update | Update policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/delete | Delete policies in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/owners/read | Read policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/owners/update | Update policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.aad.directory/policies/applicationConfiguration/policyAppliedTo/read | Read policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/appRoleAssignedTo/update | Update servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/appRoleAssignments/update | Update servicePrincipals.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/basic/update | Update basic properties on servicePrincipals in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/create | Create servicePrincipals in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/delete | Delete servicePrincipals in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/owners/update | Update servicePrincipals.owners property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/policies/update | Update servicePrincipals.policies property in Azure Active Directory. |
| microsoft.aad.directory/users/assignLicense | Manage licenses on users in Azure Active Directory. |
| microsoft.aad.reports/allEntities/read | Read Azure AD Reports. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Cloud Device Administrator
Full access to manage devices in Azure AD.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/devices/delete | Delete devices in Azure Active Directory. |
| microsoft.aad.directory/devices/disable | Disable devices in Azure Active Directory. |
| microsoft.aad.directory/devices/enable | Enable devices in Azure Active Directory. |
| microsoft.aad.reports/allEntities/read | Read Azure AD Reports. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |

### Company Administrator
Can manage all aspects of Azure AD and Microsoft services that use Azure AD identities.

  > [!NOTE]
  > This role inherits additional permissions from the  role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/administrativeUnits/allProperties/allTasks | Create and delete administrativeUnits, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/applications/allProperties/allTasks | Create and delete applications, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/appRoleAssignments/allProperties/allTasks | Create and delete appRoleAssignments, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/contacts/allProperties/allTasks | Create and delete contacts, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/contracts/allProperties/allTasks | Create and delete contracts, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/devices/allProperties/allTasks | Create and delete devices, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/directoryRoles/allProperties/allTasks | Create and delete directoryRoles, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/directoryRoleTemplates/allProperties/allTasks | Create and delete directoryRoleTemplates, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/domains/allProperties/allTasks | Create and delete domains, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/groups/allProperties/allTasks | Create and delete groups, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/groupSettings/allProperties/allTasks | Create and delete groupSettings, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/groupSettingTemplates/allProperties/allTasks | Create and delete groupSettingTemplates, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/loginTenantBranding/allProperties/allTasks | Create and delete loginTenantBranding, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete oAuth2PermissionGrants, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/organization/allProperties/allTasks | Create and delete organization, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/policies/allProperties/allTasks | Create and delete policies, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/roleAssignments/allProperties/allTasks | Create and delete roleAssignments, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/roleDefinitions/allProperties/allTasks | Create and delete roleDefinitions, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/scopedRoleMemberships/allProperties/allTasks | Create and delete scopedRoleMemberships, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/serviceAction/activateService | Can perform the Activateservice service action in Azure Active Directory |
| microsoft.aad.directory/serviceAction/disableDirectoryFeature | Can perform the Disabledirectoryfeature service action in Azure Active Directory |
| microsoft.aad.directory/serviceAction/enableDirectoryFeature | Can perform the Enabledirectoryfeature service action in Azure Active Directory |
| microsoft.aad.directory/serviceAction/getAvailableExtentionProperties | Can perform the Getavailableextentionproperties service action in Azure Active Directory |
| microsoft.aad.directory/servicePrincipals/allProperties/allTasks | Create and delete servicePrincipals, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/subscribedSkus/allProperties/allTasks | Create and delete subscribedSkus, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directory/users/allProperties/allTasks | Create and delete users, and read and update all properties in Azure Active Directory. |
| microsoft.aad.directorySync/allEntities/allTasks | Perform all actions in Azure AD Connect. |
| microsoft.aad.identityProtection/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.aad.identityProtection. |
| microsoft.aad.privilegedIdentityManagement/allEntities/read | Read all resources in microsoft.aad.privilegedIdentityManagement. |
| microsoft.aad.reports/allEntities/allTasks | Read and configure Azure AD Reports. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.informationProtection/allEntities/allTasks | Manage all aspects of Azure Information Protection. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.commerce.billing/allEntities/allTasks | Manage all aspects of Office 365 billing. |
| microsoft.intune/allEntities/allTasks | Manage all aspects of Intune. |
| microsoft.office365.complianceManager/allEntities/allTasks | Manage all aspects of Office 365 Compliance Manager |
| microsoft.office365.exchange/allEntities/allTasks | Manage all aspects of Exchange Online. |
| microsoft.office365.lockbox/allEntities/allTasks | Manage all aspects of Office 365 Customer Lockbox |
| microsoft.powerApps.powerBI/allEntities/allTasks | Manage all aspects of Power BI. |
| microsoft.office365.protectionCenter/allEntities/allTasks | Manage all aspects of Office 365 Protection Center. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.sharepoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.office365.sharepoint. |
| microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.powerApps.dynamics365/allEntities/allTasks | Manage all aspects of Dynamics 365. |

### Compliance Administrator
Can read and manage compliance configuration and reports in Azure AD and Office 365.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.complianceManager/allEntities/allTasks | Manage all aspects of Office 365 Compliance Manager |
| microsoft.office365.exchange/allEntities/allTasks | Manage all aspects of Exchange Online. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.sharepoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.office365.sharepoint. |
| microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Conditional Access Administrator
Can manage conditional access capabilities.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/policies/conditionalAccess/basic/read | Read policies.conditionalAccess property in Azure Active Directory. |
| microsoft.aad.directory/policies/conditionalAccess/basic/update | Update policies.conditionalAccess property in Azure Active Directory. |
| microsoft.aad.directory/policies/conditionalAccess/create | Create policies in Azure Active Directory. |
| microsoft.aad.directory/policies/conditionalAccess/delete | Delete policies in Azure Active Directory. |
| microsoft.aad.directory/policies/conditionalAccess/owners/read | Read policies.conditionalAccess property in Azure Active Directory. |
| microsoft.aad.directory/policies/conditionalAccess/owners/update | Update policies.conditionalAccess property in Azure Active Directory. |
| microsoft.aad.directory/policies/conditionalAccess/policiesAppliedTo/read | Read policies.conditionalAccess property in Azure Active Directory. |

### CRM Service Administrator
Can manage all aspects of the Dynamics 365 product.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.powerApps.dynamics365/allEntities/allTasks | Manage all aspects of Dynamics 365. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Customer LockBox Access Approver
Can approve Microsoft support requests to access customer organizational data.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.office365.lockbox/allEntities/allTasks | Manage all aspects of Office 365 Customer Lockbox |

### Device Administrators
Members of this role are added to the local administrators group on Azure AD-joined devices.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/groupSettings/basic/read | Read basic properties on groupSettings in Azure Active Directory. |
| microsoft.aad.directory/groupSettingTemplates/basic/read | Read basic properties on groupSettingTemplates in Azure Active Directory. |

### Directory Readers
Can read basic directory information. For granting access to applications, not intended for users.

  > [!NOTE]
  > This role inherits additional permissions from the  role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/administrativeUnits/basic/read | Read basic properties on administrativeUnits in Azure Active Directory. |
| microsoft.aad.directory/administrativeUnits/members/read | Read administrativeUnits.members property in Azure Active Directory. |
| microsoft.aad.directory/applications/audience/read | Read applications.audience property in Azure Active Directory. |
| microsoft.aad.directory/applications/authentication/read | Read applications.authentication property in Azure Active Directory. |
| microsoft.aad.directory/applications/basic/read | Read basic properties on applications in Azure Active Directory. |
| microsoft.aad.directory/applications/credentials/read | Read applications.credentials property in Azure Active Directory. |
| microsoft.aad.directory/applications/owners/read | Read applications.owners property in Azure Active Directory. |
| microsoft.aad.directory/applications/permissions/read | Read applications.permissions property in Azure Active Directory. |
| microsoft.aad.directory/applications/policies/read | Read applications.policies property in Azure Active Directory. |
| microsoft.aad.directory/contacts/basic/read | Read basic properties on contacts in Azure Active Directory. |
| microsoft.aad.directory/contacts/memberOf/read | Read contacts.memberOf property in Azure Active Directory. |
| microsoft.aad.directory/contracts/basic/read | Read basic properties on contracts in Azure Active Directory. |
| microsoft.aad.directory/devices/basic/read | Read basic properties on devices in Azure Active Directory. |
| microsoft.aad.directory/devices/memberOf/read | Read devices.memberOf property in Azure Active Directory. |
| microsoft.aad.directory/devices/registeredOwners/read | Read devices.registeredOwners property in Azure Active Directory. |
| microsoft.aad.directory/devices/registeredUsers/read | Read devices.registeredUsers property in Azure Active Directory. |
| microsoft.aad.directory/directoryRoles/basic/read | Read basic properties on directoryRoles in Azure Active Directory. |
| microsoft.aad.directory/directoryRoles/eligibleMembers/read | Read directoryRoles.eligibleMembers property in Azure Active Directory. |
| microsoft.aad.directory/directoryRoles/members/read | Read directoryRoles.members property in Azure Active Directory. |
| microsoft.aad.directory/domains/basic/read | Read basic properties on domains in Azure Active Directory. |
| microsoft.aad.directory/groups/appRoleAssignments/read | Read groups.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/groups/basic/read | Read basic properties on groups in Azure Active Directory. |
| microsoft.aad.directory/groups/memberOf/read | Read groups.memberOf property in Azure Active Directory. |
| microsoft.aad.directory/groups/members/read | Read groups.members property in Azure Active Directory. |
| microsoft.aad.directory/groups/owners/read | Read groups.owners property in Azure Active Directory. |
| microsoft.aad.directory/groups/settings/read | Read groups.settings property in Azure Active Directory. |
| microsoft.aad.directory/groupSettings/basic/read | Read basic properties on groupSettings in Azure Active Directory. |
| microsoft.aad.directory/groupSettingTemplates/basic/read | Read basic properties on groupSettingTemplates in Azure Active Directory. |
| microsoft.aad.directory/oAuth2PermissionGrants/basic/read | Read basic properties on oAuth2PermissionGrants in Azure Active Directory. |
| microsoft.aad.directory/organization/basic/read | Read basic properties on organization in Azure Active Directory. |
| microsoft.aad.directory/organization/trustedCAsForPasswordlessAuth/read | Read organization.trustedCAsForPasswordlessAuth property in Azure Active Directory. |
| microsoft.aad.directory/roleAssignments/basic/read | Read basic properties on roleAssignments in Azure Active Directory. |
| microsoft.aad.directory/roleDefinitions/basic/read | Read basic properties on roleDefinitions in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/appRoleAssignedTo/read | Read servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/appRoleAssignments/read | Read servicePrincipals.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/basic/read | Read basic properties on servicePrincipals in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/memberOf/read | Read servicePrincipals.memberOf property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/oAuth2PermissionGrants/basic/read | Read servicePrincipals.oAuth2PermissionGrants property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/ownedObjects/read | Read servicePrincipals.ownedObjects property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/owners/read | Read servicePrincipals.owners property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/policies/read | Read servicePrincipals.policies property in Azure Active Directory. |
| microsoft.aad.directory/subscribedSkus/basic/read | Read basic properties on subscribedSkus in Azure Active Directory. |
| microsoft.aad.directory/users/appRoleAssignments/read | Read users.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/users/basic/read | Read basic properties on users in Azure Active Directory. |
| microsoft.aad.directory/users/directReports/read | Read users.directReports property in Azure Active Directory. |
| microsoft.aad.directory/users/invitedBy/read | Read users.invitedBy property in Azure Active Directory. |
| microsoft.aad.directory/users/invitedUsers/read | Read users.invitedUsers property in Azure Active Directory. |
| microsoft.aad.directory/users/manager/read | Read users.manager property in Azure Active Directory. |
| microsoft.aad.directory/users/memberOf/read | Read users.memberOf property in Azure Active Directory. |
| microsoft.aad.directory/users/oAuth2PermissionGrants/basic/read | Read users.oAuth2PermissionGrants property in Azure Active Directory. |
| microsoft.aad.directory/users/ownedDevices/read | Read users.ownedDevices property in Azure Active Directory. |
| microsoft.aad.directory/users/ownedObjects/read | Read users.ownedObjects property in Azure Active Directory. |
| microsoft.aad.directory/users/registeredDevices/read | Read users.registeredDevices property in Azure Active Directory. |

### Directory Synchronization Accounts
Only used by Azure AD Connect service.

  > [!NOTE]
  > This role inherits additional permissions from the  role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/organization/dirSync/update | Update organization.dirSync property in Azure Active Directory. |
| microsoft.aad.directory/policies/create | Create policies in Azure Active Directory. |
| microsoft.aad.directory/policies/delete | Delete policies in Azure Active Directory. |
| microsoft.aad.directory/policies/basic/read | Read basic properties on policies in Azure Active Directory. |
| microsoft.aad.directory/policies/basic/update | Update basic properties on policies in Azure Active Directory. |
| microsoft.aad.directory/policies/owners/read | Read policies.owners property in Azure Active Directory. |
| microsoft.aad.directory/policies/owners/update | Update policies.owners property in Azure Active Directory. |
| microsoft.aad.directory/policies/policiesAppliedTo/read | Read policies.policiesAppliedTo property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/appRoleAssignedTo/read | Read servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/appRoleAssignedTo/update | Update servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/appRoleAssignments/read | Read servicePrincipals.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/appRoleAssignments/update | Update servicePrincipals.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/basic/read | Read basic properties on servicePrincipals in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/basic/update | Update basic properties on servicePrincipals in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/create | Create servicePrincipals in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/memberOf/read | Read servicePrincipals.memberOf property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/oAuth2PermissionGrants/basic/read | Read servicePrincipals.oAuth2PermissionGrants property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/owners/read | Read servicePrincipals.owners property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/owners/update | Update servicePrincipals.owners property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/ownedObjects/read | Read servicePrincipals.ownedObjects property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/policies/read | Read servicePrincipals.policies property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/policies/update | Update servicePrincipals.policies property in Azure Active Directory. |
| microsoft.aad.directorySync/allEntities/allTasks | Perform all actions in Azure AD Connect. |

### Directory Writers
Can read & write basic directory information. For granting access to applications, not intended for users.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/groups/create | Create groups in Azure Active Directory. |
| microsoft.aad.directory/groups/createAsOwner | Create groups in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.aad.directory/groups/appRoleAssignments/update | Update groups.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/groups/basic/update | Update basic properties on groups in Azure Active Directory. |
| microsoft.aad.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.aad.directory/groups/owners/update | Update groups.owners property in Azure Active Directory. |
| microsoft.aad.directory/groups/settings/update | Update groups.settings property in Azure Active Directory. |
| microsoft.aad.directory/groupSettings/basic/update | Update basic properties on groupSettings in Azure Active Directory. |
| microsoft.aad.directory/groupSettings/create | Create groupSettings in Azure Active Directory. |
| microsoft.aad.directory/groupSettings/delete | Delete groupSettings in Azure Active Directory. |
| microsoft.aad.directory/users/appRoleAssignments/update | Update users.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/users/assignLicense | Manage licenses on users in Azure Active Directory. |
| microsoft.aad.directory/users/basic/update | Update basic properties on users in Azure Active Directory. |
| microsoft.aad.directory/users/invalidateAllRefreshTokens | Invalidate all user refresh tokens in Azure Active Directory. |
| microsoft.aad.directory/users/manager/update | Update users.manager property in Azure Active Directory. |
| microsoft.aad.directory/users/userPrincipalName/update | Update users.userPrincipalName property in Azure Active Directory. |

### Exchange Service Administrator
Can manage all aspects of the Exchange product.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.exchange/allEntities/allTasks | Manage all aspects of Exchange Online. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Guest Inviter
Can invite guest users independent of the ‘members can invite guests’ setting.

  > [!NOTE]
  > This role inherits additional permissions from the  role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/users/appRoleAssignments/read | Read users.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/users/basic/read | Read basic properties on users in Azure Active Directory. |
| microsoft.aad.directory/users/directReports/read | Read users.directReports property in Azure Active Directory. |
| microsoft.aad.directory/users/invitedBy/read | Read users.invitedBy property in Azure Active Directory. |
| microsoft.aad.directory/users/inviteGuest | Invite guest users in Azure Active Directory. |
| microsoft.aad.directory/users/invitedUsers/read | Read users.invitedUsers property in Azure Active Directory. |
| microsoft.aad.directory/users/manager/read | Read users.manager property in Azure Active Directory. |
| microsoft.aad.directory/users/memberOf/read | Read users.memberOf property in Azure Active Directory. |
| microsoft.aad.directory/users/oAuth2PermissionGrants/basic/read | Read users.oAuth2PermissionGrants property in Azure Active Directory. |
| microsoft.aad.directory/users/ownedDevices/read | Read users.ownedDevices property in Azure Active Directory. |
| microsoft.aad.directory/users/ownedObjects/read | Read users.ownedObjects property in Azure Active Directory. |
| microsoft.aad.directory/users/registeredDevices/read | Read users.registeredDevices property in Azure Active Directory. |

### Helpdesk Administrator
Can reset passwords for non-administrators and Helpdesk Administrators.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/users/invalidateAllRefreshTokens | Invalidate all user refresh tokens in Azure Active Directory. |
| microsoft.aad.directory/users/password/update | Update passwords for all users in Azure Active Directory. See online documentation for more detail. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Information Protection Administrator
Can manage all aspects of the Azure Information Protection product.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.informationProtection/allEntities/allTasks | Manage all aspects of Azure Information Protection. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Intune Service Administrator
Can manage all aspects of the Intune product.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/contacts/basic/update | Update basic properties on contacts in Azure Active Directory. |
| microsoft.aad.directory/contacts/create | Create contacts in Azure Active Directory. |
| microsoft.aad.directory/contacts/delete | Delete contacts in Azure Active Directory. |
| microsoft.aad.directory/devices/basic/update | Update basic properties on devices in Azure Active Directory. |
| microsoft.aad.directory/devices/create | Create devices in Azure Active Directory. |
| microsoft.aad.directory/devices/delete | Delete devices in Azure Active Directory. |
| microsoft.aad.directory/devices/registeredOwners/update | Update devices.registeredOwners property in Azure Active Directory. |
| microsoft.aad.directory/devices/registeredUsers/update | Update devices.registeredUsers property in Azure Active Directory. |
| microsoft.aad.directory/groups/appRoleAssignments/update | Update groups.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/groups/basic/update | Update basic properties on groups in Azure Active Directory. |
| microsoft.aad.directory/groups/create | Create groups in Azure Active Directory. |
| microsoft.aad.directory/groups/createAsOwner | Create groups in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.aad.directory/groups/delete | Delete groups in Azure Active Directory. |
| microsoft.aad.directory/groups/hiddenMembers/read | Read groups.hiddenMembers property in Azure Active Directory. |
| microsoft.aad.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.aad.directory/groups/owners/update | Update groups.owners property in Azure Active Directory. |
| microsoft.aad.directory/groups/restore | Restore groups in Azure Active Directory. |
| microsoft.aad.directory/groups/settings/update | Update groups.settings property in Azure Active Directory. |
| microsoft.aad.directory/users/appRoleAssignments/update | Update users.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/users/basic/update | Update basic properties on users in Azure Active Directory. |
| microsoft.aad.directory/users/manager/update | Update users.manager property in Azure Active Directory. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.intune/allEntities/allTasks | Manage all aspects of Intune. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### License Administrator
Can manage product licenses on users and groups.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/users/assignLicense | Manage licenses on users in Azure Active Directory. |
| microsoft.aad.directory/users/usageLocation/update | Update users.usageLocation property in Azure Active Directory. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |

### Lync Service Administrator
Can manage all aspects of the Skype for Business product.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Message Center Reader
Can read messages and updates for their organization in Office 365 Message Center only. 

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.accessmessagecenter/allEntities/allTasks | Create and delete all resources, and read and update standard properties in Message Center. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |

### Partner Tier1 Support
Do not use - not intended for general use.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/contacts/basic/update | Update basic properties on contacts in Azure Active Directory. |
| microsoft.aad.directory/contacts/create | Create contacts in Azure Active Directory. |
| microsoft.aad.directory/contacts/delete | Delete contacts in Azure Active Directory. |
| microsoft.aad.directory/groups/create | Create groups in Azure Active Directory. |
| microsoft.aad.directory/groups/createAsOwner | Create groups in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.aad.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.aad.directory/groups/owners/update | Update groups.owners property in Azure Active Directory. |
| microsoft.aad.directory/users/appRoleAssignments/update | Update users.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/users/assignLicense | Manage licenses on users in Azure Active Directory. |
| microsoft.aad.directory/users/basic/update | Update basic properties on users in Azure Active Directory. |
| microsoft.aad.directory/users/delete | Delete users in Azure Active Directory. |
| microsoft.aad.directory/users/invalidateAllRefreshTokens | Invalidate all user refresh tokens in Azure Active Directory. |
| microsoft.aad.directory/users/manager/update | Update users.manager property in Azure Active Directory. |
| microsoft.aad.directory/users/password/update | Update passwords for all users in Azure Active Directory. See online documentation for more detail. |
| microsoft.aad.directory/users/restore | Restore deleted users in Azure Active Directory. |
| microsoft.aad.directory/users/userPrincipalName/update | Update users.userPrincipalName property in Azure Active Directory. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Partner Tier2 Support
Do not use - not intended for general use.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/contacts/basic/update | Update basic properties on contacts in Azure Active Directory. |
| microsoft.aad.directory/contacts/create | Create contacts in Azure Active Directory. |
| microsoft.aad.directory/contacts/delete | Delete contacts in Azure Active Directory. |
| microsoft.aad.directory/domains/allTasks | Create and delete domains, and read and update standard properties in Azure Active Directory. |
| microsoft.aad.directory/groups/create | Create groups in Azure Active Directory. |
| microsoft.aad.directory/groups/delete | Delete groups in Azure Active Directory. |
| microsoft.aad.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.aad.directory/groups/restore | Restore groups in Azure Active Directory. |
| microsoft.aad.directory/organization/basic/update | Update basic properties on organization in Azure Active Directory. |
| microsoft.aad.directory/organization/trustedCAsForPasswordlessAuth/update | Update organization.trustedCAsForPasswordlessAuth property in Azure Active Directory. |
| microsoft.aad.directory/users/appRoleAssignments/update | Update users.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/users/assignLicense | Manage licenses on users in Azure Active Directory. |
| microsoft.aad.directory/users/basic/update | Update basic properties on users in Azure Active Directory. |
| microsoft.aad.directory/users/delete | Delete users in Azure Active Directory. |
| microsoft.aad.directory/users/invalidateAllRefreshTokens | Invalidate all user refresh tokens in Azure Active Directory. |
| microsoft.aad.directory/users/manager/update | Update users.manager property in Azure Active Directory. |
| microsoft.aad.directory/users/password/update | Update passwords for all users in Azure Active Directory. See online documentation for more detail. |
| microsoft.aad.directory/users/restore | Restore deleted users in Azure Active Directory. |
| microsoft.aad.directory/users/userPrincipalName/update | Update users.userPrincipalName property in Azure Active Directory. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Power BI Service Administrator
Can manage all aspects of the Power BI product.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.powerApps.powerBI/allEntities/allTasks | Manage all aspects of Power BI. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Privileged Role Administrator
Can manage role assignments in Azure AD,  and all aspects of Privileged Identity Management.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/directoryRoles/update | Update directoryRoles in Azure Active Directory. |
| microsoft.aad.privilegedIdentityManagement/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.aad.privilegedIdentityManagement. |

### Reports Reader
Can read sign-in and audit reports.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.reports/allEntities/read | Read Azure AD Reports. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.usageReports/allEntities/read | Read Office 365 usage reports. |

### Security Administrator
Can read security information and reports,  and manage configuration in Azure AD and Office 365.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/applications/policies/update | Update applications.policies property in Azure Active Directory. |
| microsoft.aad.directory/policies/basic/update | Update basic properties on policies in Azure Active Directory. |
| microsoft.aad.directory/policies/create | Create policies in Azure Active Directory. |
| microsoft.aad.directory/policies/delete | Delete policies in Azure Active Directory. |
| microsoft.aad.directory/policies/owners/update | Update policies.owners property in Azure Active Directory. |
| microsoft.aad.directory/servicePrincipals/policies/update | Update servicePrincipals.policies property in Azure Active Directory. |
| microsoft.aad.identityProtection/allEntities/read | Read all resources in microsoft.aad.identityProtection. |
| microsoft.aad.identityProtection/allEntities/update | Update all resources in microsoft.aad.identityProtection. |
| microsoft.aad.privilegedIdentityManagement/allEntities/read | Read all resources in microsoft.aad.privilegedIdentityManagement. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.protectionCenter/allEntities/read | Read all aspects of Office 365 Protection Center. |
| microsoft.office365.protectionCenter/allEntities/update | Update all resources in microsoft.office365.protectionCenter. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |

### Security Reader
Can read security information and reports in Azure AD and Office 365.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.identityProtection/allEntities/read | Read all resources in microsoft.aad.identityProtection. |
| microsoft.aad.privilegedIdentityManagement/allEntities/read | Read all resources in microsoft.aad.privilegedIdentityManagement. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.protectionCenter/allEntities/read | Read all aspects of Office 365 Protection Center. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |

### Service Support Administrator
Can read service health information and manage support tickets.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### SharePoint Service Administrator
Can manage all aspects of the SharePoint service.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.sharepoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.office365.sharepoint. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Teams Communications Administrator
Can manage calling and meetings features within the Microsoft Teams service.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/policies/basic/read | Read basic properties on policies in Azure Active Directory. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.office365.usageReports/allEntities/read | Read Office 365 usage reports. |

### Teams Communications Support Engineer
Can troubleshoot communications issues within Teams using advanced tools.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/policies/basic/read | Read basic properties on policies in Azure Active Directory. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |

### Teams Communications Support Specialist
Can troubleshoot communications issues within Teams using basic tools.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/policies/basic/read | Read basic properties on policies in Azure Active Directory. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |

### Teams Service Administrator
Can manage the Microsoft Teams service.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

  > [!NOTE]
  > This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/groups/hiddenMembers/read | Read groups.hiddenMembers property in Azure Active Directory. |
| microsoft.aad.directory/policies/basic/read | Read basic properties on policies in Azure Active Directory. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.office365.usageReports/allEntities/read | Read Office 365 usage reports. |

### User Account Administrator
Can manage all aspects of users and groups, including resetting passwords for limited admins.

  > [!NOTE]
  > This role inherits additional permissions from the Directory Readers role.
  >
  >

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.directory/appRoleAssignments/create | Create appRoleAssignments in Azure Active Directory. |
| microsoft.aad.directory/appRoleAssignments/delete | Delete appRoleAssignments in Azure Active Directory. |
| microsoft.aad.directory/appRoleAssignments/update | Update appRoleAssignments in Azure Active Directory. |
| microsoft.aad.directory/contacts/basic/update | Update basic properties on contacts in Azure Active Directory. |
| microsoft.aad.directory/contacts/create | Create contacts in Azure Active Directory. |
| microsoft.aad.directory/contacts/delete | Delete contacts in Azure Active Directory. |
| microsoft.aad.directory/groups/appRoleAssignments/update | Update groups.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/groups/basic/update | Update basic properties on groups in Azure Active Directory. |
| microsoft.aad.directory/groups/create | Create groups in Azure Active Directory. |
| microsoft.aad.directory/groups/createAsOwner | Create groups in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.aad.directory/groups/delete | Delete groups in Azure Active Directory. |
| microsoft.aad.directory/groups/hiddenMembers/read | Read groups.hiddenMembers property in Azure Active Directory. |
| microsoft.aad.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.aad.directory/groups/owners/update | Update groups.owners property in Azure Active Directory. |
| microsoft.aad.directory/groups/restore | Restore groups in Azure Active Directory. |
| microsoft.aad.directory/groups/settings/update | Update groups.settings property in Azure Active Directory. |
| microsoft.aad.directory/users/appRoleAssignments/update | Update users.appRoleAssignments property in Azure Active Directory. |
| microsoft.aad.directory/users/assignLicense | Manage licenses on users in Azure Active Directory. |
| microsoft.aad.directory/users/basic/update | Update basic properties on users in Azure Active Directory. |
| microsoft.aad.directory/users/create | Create users in Azure Active Directory. |
| microsoft.aad.directory/users/delete | Delete users in Azure Active Directory. |
| microsoft.aad.directory/users/invalidateAllRefreshTokens | Invalidate all user refresh tokens in Azure Active Directory. |
| microsoft.aad.directory/users/manager/update | Update users.manager property in Azure Active Directory. |
| microsoft.aad.directory/users/password/update | Update passwords for all users in Azure Active Directory. See online documentation for more detail. |
| microsoft.aad.directory/users/restore | Restore deleted users in Azure Active Directory. |
| microsoft.aad.directory/users/userPrincipalName/update | Update users.userPrincipalName property in Azure Active Directory. |
| microsoft.azure.accessService/allEntities/allTasks | Manage all aspects of Azure Access service. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |


## Deprecated roles

The following roles should not be used. They have been deprecated and will be removed from Azure AD in the future.

* AdHoc License Administrator
* Device Join
* Device Managers
* Device Users
* Email Verified User Creator
* Mailbox Administrator
* Workplace Device Join

## Next steps

* To learn more about how to assign a user as an administrator of an Azure subscription, see [Manage access using RBAC and the Azure portal](../../role-based-access-control/role-assignments-portal.md)
* To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](../../role-based-access-control/rbac-and-directory-admin-roles.md)
* For more information on how Azure Active Directory relates to your Azure subscription, see [How Azure subscriptions are associated with Azure Active Directory](../fundamentals/active-directory-how-subscriptions-associated-directory.md)
