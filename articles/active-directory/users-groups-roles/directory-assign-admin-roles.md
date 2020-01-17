---
title: Admin role descriptions and permissions - Azure AD | Microsoft Docs
description: An admin role can add users, assign administrative roles, reset user passwords, manage user licenses, or manage domains.
services: active-directory
author: curtand
manager: daveba
search.appverid: MET150
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: reference
ms.date: 11/12/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
ms.custom: fasttrack-edit
ms.collection: M365-identity-device-management
---

# Administrator role permissions in Azure Active Directory

Using Azure Active Directory (Azure AD), you can designate limited administrators to manage identity tasks in less-privileged roles. Administrators can be assigned for such purposes as adding or changing users, assigning administrative roles, resetting user passwords, managing user licenses, and managing domain names. The default user permissions can be changed only in user settings in Azure AD.

## Limit the use of Global administrator

Users who are assigned to the Global administrator role can read and modify every administrative setting in your Azure AD organization. By default, the person who signs up for an Azure subscription is assigned the Global administrator role for the Azure AD organization. Only Global administrators and Privileged Role administrators can delegate administrator roles. To reduce the risk to your business, we recommend that you assign this role to the fewest possible people in your organization.

As a best practice, we recommend that you assign this role to fewer than 5 people in your organization. If you have over five users assigned to the Global Administrator role in your organization, here are some ways to reduce its use.

### Find the role you need

If it's frustrating for you to find the role you need out of a list of many roles, Azure AD can show you subsets of the roles based on role categories. Check out our new **Type** filter for [Azure AD Roles and administrators](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RolesAndAdministrators) to show you only the roles in the selected type.

### A role exists now that didn’t exist when you assigned the Global administrator role

It's possible that a role or roles were added to Azure AD that provide more granular permissions that were not an option when you elevated some users to Global administrator. Over time, we are rolling out additional roles that accomplish tasks that only the Global administrator role could do before. You can see these reflected in the following [Available roles](#available-roles).

## Assign or remove administrator roles

To learn how to assign administrative roles to a user in Azure Active Directory, see [View and assign administrator roles in Azure Active Directory](directory-manage-roles-portal.md).

## Available roles

The following administrator roles are available:

### [Application Administrator](#application-administrator-permissions)

Users in this role can create and manage all aspects of enterprise applications, application registrations, and application proxy settings. Note that users assigned to this role are not added as owners when creating new application registrations or enterprise applications.

Application Administrators can manage application credentials that allows them to impersonate the application. So, users assigned to  this role can manage application credentials of only those applications that are either not assigned to any Azure AD roles or those assigned to following admin roles only:
* Application Administrator
* Application Developer
* Cloud Application Administrator
* Directory Readers

If an application is assigned to any other role that are not mentioned above, then Application Administrator cannot manage credentials of that application. 
 
This role also grants the ability to _consent_ to delegated permissions and application permissions, with the exception of permissions on the Microsoft Graph and Azure AD Graph.

> [!IMPORTANT]
> This exception means that you can still consent to permissions for _other_ apps (e.g. third party apps or apps that you have registered), but not to permissions on Azure AD itself. You can still _request_ these permissions as part of the app registration, but _granting_ (i.e. consenting to) these permissions requires an Azure AD admin. This means that a malicious user cannot easily elevate their permissions, for example by creating and consenting to an app that can write to the entire directory and through that app's permissions elevate themselves to become a global admin.

### [Application Developer](#application-developer-permissions)

Users in this role can create application registrations when the "Users can register applications" setting is set to No. This role also grants permission to consent on one's own behalf when the "Users can consent to apps accessing company data on their behalf" setting is set to No. Users assigned to this role are added as owners when creating new application registrations or enterprise applications.

### [Authentication Administrator](#authentication-administrator-permissions)

The Authentication administrator role is currently in public preview. Users with this role can set or reset non-password credentials and can update passwords for all users. Authentication Administrators can require users to re-register against existing non-password credential (for example, MFA or FIDO) and revoke **remember MFA on the device**, which prompts for MFA on the next sign-in of users who are non-administrators or assigned the following roles only:

* Authentication Administrator
* Directory Readers
* Guest Inviter
* Message Center Reader
* Reports Reader

> [!IMPORTANT]
> Users with this role can change credentials for people who may have access to sensitive or private information or critical configuration inside and outside of Azure Active Directory. Changing the credentials of a user may mean the ability to assume that user's identity and permissions. For example:
>
>- Application Registration and Enterprise Application owners, who can manage credentials of apps they own. Those apps may have privileged permissions in Azure AD and elsewhere not granted to Authentication Administrators. Through this path an Authentication Administrator may be able to assume the identity of an application owner and then further assume the identity of a privileged application by updating the credentials for the application.
>- Azure subscription owners, who may have access to sensitive or private information or critical configuration in Azure.
>- Security Group and Office 365 Group owners, who can manage group membership. Those groups may grant access to sensitive or private information or critical configuration in Azure AD and elsewhere.
>- Administrators in other services outside of Azure AD like Exchange Online, Office Security and Compliance Center, and human resources systems.
>- Non-administrators like executives, legal counsel, and human resources employees who may have access to sensitive or private information.

### [Azure DevOps Administrator](#azure-devops-administrator-permissions)

Users with this role can manage the Azure DevOps policy to restrict new Azure DevOps organization creation to a set of configurable users or groups. Users in this role can manage this policy through any Azure DevOps organization that is backed the company’s Azure AD organization.

All enterprise Azure DevOps policies can be managed by users in this role.

### [Azure Information Protection Administrator](#azure-information-protection-administrator-permissions)

Users with this role have all permissions in the Azure Information Protection service. This role allows configuring labels for the Azure Information Protection policy, managing protection templates, and activating protection. This role does not grant any permissions in Identity Protection Center, Privileged Identity Management, Monitor Office 365 Service Health, or Office 365 Security & Compliance Center.

### [B2C User Flow Administrator](#b2c-user-flow-administrator-permissions)

Users with this role can create and manage B2C User Flows (also called "built-in" policies) in the Azure portal. By creating or editing user flows, these users can change the html/CSS/javascript content of the user experience, change MFA requirements per user flow, change claims in the token and adjust session settings for all policies in the tenant. On the other hand, this role does not include the ability to review user data, or make changes to the attributes that are included in the tenant schema. Changes to Identity Experience Framework (also known as Custom) policies is also outside the scope of this role.

### [B2C User Flow Attribute Administrator](#b2c-user-flow-attribute-administrator-permissions)

Users with this role add or delete custom attributes available to all user flows in the tenant. As such, users with this role can change or add new elements to the end user schema and impact the behavior of all user flows and indirectly result in changes to what data may be asked of end users and ultimately sent as claims to applications. This role cannot edit user flows.

### [B2C IEF Keyset Administrator](#b2c-ief-keyset-administrator-permissions)

User can create and manage policy keys and secrets for token encryption, token signatures, and claim encryption/decryption. By adding new keys to existing key containers, this limited administrator can rollover secrets as needed without impacting existing applications. This user can see the full content of these secrets and their expiration dates even after their creation.

> [!IMPORTANT]
> This is a sensitive role. The keyset administrator role should be carefully audited and assigned with care during pre-production and production.

### [B2C IEF Policy Administrator](#b2c-ief-policy-administrator-permissions)

Users in this role have the ability to create, read, update, and delete all custom policies in Azure AD B2C and therefore have full control over the Identity Experience Framework in the relevant Azure AD B2C tenant. By editing policies, this user can establish direct federation with external identity providers, change the directory schema, change all user-facing content (HTML, CSS, JavaScript), change the requirements to complete an authentication, create new users, send user data to external systems including full migrations, and edit all user information including sensitive fields like passwords and phone numbers. Conversely, this role cannot change the encryption keys or edit the secrets used for federation in the tenant.

> [!IMPORTANT]
> The B2 IEF Policy Administrator is a highly sensitive role which should be assigned on a very limited basis for tenants in production. Activities by these users should be closely audited, especially for tenants in production.

### [Billing Administrator](#billing-administrator-permissions)

Makes purchases, manages subscriptions, manages support tickets, and monitors service health.

### [Cloud Application Administrator](#cloud-application-administrator-permissions)

Users in this role have the same permissions as the Application Administrator role, excluding the ability to manage application proxy. This role grants the ability to create and manage all aspects of enterprise applications and application registrations. This role also grants the ability to consent to delegated permissions, and application permissions excluding Microsoft Graph and Azure AD Graph. Users assigned to this role are not added as owners when creating new application registrations or enterprise applications.

Cloud Application Administrators can manage application credentials that allows them to impersonate the application. So, users assigned to  this role can manage application credentials of only those applications that are either not assigned to any Azure AD roles or those assigned to following admin roles only:
* Application Developer
* Cloud Application Administrator
* Directory Readers

If an application is assigned to any other role that are not mentioned above, then Cloud Application Administrator cannot manage credentials of that application.

### [Cloud Device Administrator](#cloud-device-administrator-permissions)

Users in this role can enable, disable, and delete devices in Azure AD and read Windows 10 BitLocker keys (if present) in the Azure portal. The role does not grant permissions to manage any other properties on the device.

### [Compliance Administrator](#compliance-administrator-permissions)

Users with this role have permissions to manage compliance-related features in the Microsoft 365 compliance center, Microsoft 365 admin center, Azure, and Office 365 Security & Compliance Center. Assignees can also manage all features within the Exchange admin center and Teams & Skype for Business admin centers and create support tickets for Azure and Microsoft 365. More information is available at [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

In | Can do
----- | ----------
[Microsoft 365 compliance center](https://protection.office.com) | Protect and manage your organization’s data across Microsoft 365 services<br>Manage compliance alerts
[Compliance Manager](https://docs.microsoft.com/office365/securitycompliance/meet-data-protection-and-regulatory-reqs-using-microsoft-cloud) | Track, assign, and verify your organization's regulatory compliance activities
[Office 365 Security & Compliance Center](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d) | Manage data governance<br>Perform legal and data investigation<br>Manage Data Subject Request<br><br>This role has the same permissions as the [Compliance Administrator RoleGroup](https://docs.microsoft.com/microsoft-365/security/office-365-security/permissions-in-the-security-and-compliance-center#permissions-needed-to-use-features-in-the-security--compliance-center) in Office 365 Security & Compliance Center role-based access control.
[Intune](https://docs.microsoft.com/intune/role-based-access-control) | View all Intune audit data
[Cloud App Security](https://docs.microsoft.com/cloud-app-security/manage-admins) | Has read-only permissions and can manage alerts<br>Can create and modify file policies and allow file governance actions<br>Can view all the built-in reports under Data Management

### [Compliance Data Administrator](#compliance-data-administrator-permissions)

Users with this role have permissions to track data in the Microsoft 365 compliance center, Microsoft 365 admin center, and Azure. Users can also track compliance data within the Exchange admin center, Compliance Manager, and Teams & Skype for Business admin center and create support tickets for Azure and Microsoft 365.

In | Can do
----- | ----------
[Microsoft 365 compliance center](https://protection.office.com) | Monitor compliance-related policies across Microsoft 365 services<br>Manage compliance alerts
[Compliance Manager](https://docs.microsoft.com/office365/securitycompliance/meet-data-protection-and-regulatory-reqs-using-microsoft-cloud) | Track, assign, and verify your organization's regulatory compliance activities
[Office 365 Security & Compliance Center](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d) | Manage data governance<br>Perform legal and data investigation<br>Manage Data Subject Request<br><br>This role has the same permissions as the [Compliance Data Administrator RoleGroup](https://docs.microsoft.com/microsoft-365/security/office-365-security/permissions-in-the-security-and-compliance-center#permissions-needed-to-use-features-in-the-security--compliance-center) in Office 365 Security & Compliance Center role-based access control.
[Intune](https://docs.microsoft.com/intune/role-based-access-control) | View all Intune audit data
[Cloud App Security](https://docs.microsoft.com/cloud-app-security/manage-admins) | Has read-only permissions and can manage alerts<br>Can create and modify file policies and allow file governance actions<br>Can view all the built-in reports under Data Management

### [Conditional Access Administrator](#conditional-access-administrator-permissions)

Users with this role have the ability to manage Azure Active Directory Conditional Access settings.
> [!NOTE]
> To deploy Exchange ActiveSync Conditional Access policy in Azure, the user must also be a Global Administrator.

### [Customer Lockbox access approver](#customer-lockbox-access-approver-permissions)

Manages [Customer Lockbox requests](https://docs.microsoft.com/office365/admin/manage/customer-lockbox-requests) in your organization. They receive email notifications for Customer Lockbox requests and can approve and deny requests from the Microsoft 365 admin center. They can also turn the Customer Lockbox feature on or off. Only global admins can reset the passwords of people assigned to this role.

### [Desktop Analytics Administrator](#desktop-analytics-administrator-permissions)


Users in this role can manage the Desktop Analytics and Office Customization & Policy services. For Desktop Analytics, this includes the ability to view asset inventory, create deployment plans, view deployment and health status. For Office Customization & Policy service, this role enables users to manage Office policies.

### [Device Administrator](#device-administrators-permissions)

This role is available for assignment only as an additional local administrator in [Device settings](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/DevicesMenuBlade/DeviceSettings/menuId/). Users with this role become local machine administrators on all Windows 10 devices that are joined to Azure Active Directory. They do not have the ability to manage devices objects in Azure Active Directory.

### [Directory Readers](#directory-readers-permissions)

Users in this role can read basic directory information. This role should be used for:
* Granting a specific set of guest users read access instead of granting it to all guest users.
* Granting a specific set of non-admin users access to Azure portal when “Restrict access to Azure AD portal to admins only” is set to “Yes”.
* Granting service principals access to directory where Directory.Read.All is not an option.

### [Directory Synchronization Accounts](#directory-synchronization-accounts-permissions)

Do not use. This role is automatically assigned to the Azure AD Connect service, and is not intended or supported for any other use.

### [Directory Writers](#directory-writers-permissions)

This is a legacy role that is to be assigned to applications that do not support the [Consent Framework](../develop/quickstart-v1-integrate-apps-with-azure-ad.md). It should not be assigned to any users.

### [Dynamics 365 administrator / CRM Administrator](#crm-service-administrator-permissions)

Users with this role have global permissions within Microsoft Dynamics 365 Online, when the service is present, as well as the ability to manage support tickets and monitor service health. More information at [Use the service admin role to manage your tenant](https://docs.microsoft.com/dynamics365/customer-engagement/admin/use-service-admin-role-manage-tenant).

> [!NOTE]
> In Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell, this role is identified as "Dynamics 365 Service Administrator." It is "Dynamics 365 Administrator" in the [Azure portal](https://portal.azure.com).

### [Exchange Administrator](#exchange-service-administrator-permissions)

Users with this role have global permissions within Microsoft Exchange Online, when the service is present. Also has the ability to create and manage all Office 365 Groups, manage support tickets, and monitor service health. More information at [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

> [!NOTE]
> In Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell, this role is identified as "Exchange Service Administrator." It is "Exchange Administrator" in the [Azure portal](https://portal.azure.com). It is "Exchange Online administrator" in the [Exchange admin center](https://go.microsoft.com/fwlink/p/?LinkID=529144).

### [External Identity Provider Administrator](#external-identity-provider-administrator-permissions)

This administrator manages federation between Azure Active Directory tenants and external identity providers. With this role, users can add new identity providers and configure all available settings (e.g. authentication path, service ID, assigned key containers). This user can enable the tenant to trust authentications from external identity providers. The resulting impact on end user experiences depends on the type of tenant:

* Azure Active Directory tenants for employees and partners: The addition  of a federation (e.g. with Gmail) will immediately impact all guest invitations not yet redeemed. See [Adding Google as an identity provider for B2B guest users](https://docs.microsoft.com/azure/active-directory/b2b/google-federation).
* Azure Active Directory B2C tenants: The addition of a federation (for example, with Facebook, or with another Azure AD organization) does not immediately impact end user flows until the identity provider is added as an option in a user flow (also called a built-in policy). See [Configuring a Microsoft account as an identity provider](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-setup-msa-app) for an example. To change user flows, the limited role of "B2C User Flow Administrator" is required.

### [Global Administrator / Company Administrator](#company-administrator-permissions)

Users with this role have access to all administrative features in Azure Active Directory, as well as services that use Azure Active Directory identities like Microsoft 365 security center, Microsoft 365 compliance center, Exchange Online, SharePoint Online, and Skype for Business Online. The person who signs up for the Azure Active Directory tenant becomes a global administrator. Only global administrators can assign other administrator roles. There can be more than one global administrator at your company. Global admins can reset the password for any user and all other administrators.

> [!NOTE]
> In Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell, this role is identified as "Company Administrator". It is "Global Administrator" in the [Azure portal](https://portal.azure.com).
>
>

### [Global Reader](#global-reader-permissions)

Users in this role can read settings and administrative information across Microsoft 365 services but can't take management actions. Global reader is the read-only counterpart to Global administrator. Assign Global reader instead of Global administrator for planning, audits, or investigations. Use Global reader in combination with other limited admin roles like Exchange Administrator to make it easier to get work done without the assigning the Global Administrator role. Global reader works with Microsoft 365 admin center, Exchange admin center, Teams admin center, Security center, Compliance center, Azure AD admin center, and Device Management admin center.

> [!NOTE]
> Global reader role has a few limitations right now -
>
>- SharePoint admin center - SharePoint admin center does not support the Global reader role. You won't see 'SharePoint' in left pane under Admin Centers in [Microsoft 365 admin center](https://admin.microsoft.com/Adminportal/Home#/homepage).
>- [OneDrive admin center](https://admin.onedrive.com/) - OneDrive admin center does not support the Global reader role.
>- [Azure AD portal](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/) - Global reader can't read the provisioning mode of an enterprise app.
>- [M365 admin center](https://admin.microsoft.com/Adminportal/Home#/homepage) - Global reader can't read customer lockbox requests. You won't find the **Customer lockbox requests** tab under **Support** in the left pane of M365 Admin Center.
>- [M365 Security center](https://security.microsoft.com/homepage) - Global reader can't read sensitivity and retention labels. You won't find **Sensitivity labels**, **Retention labels**, and **Label analytics** tabs in the left pane of the M365 Security center.
>- [Office Security & Compliance Center](https://sip.protection.office.com/homepage) - Global reader can't read SCC audit logs or do content search.
>- [Teams admin center](https://admin.teams.microsoft.com) - Global reader cannot read **Teams lifecycle**, **Analytics & reports**, **IP phone device management** and **App catalog**.
>- [Privileged Access Management (PAM)](https://docs.microsoft.com/office365/securitycompliance/privileged-access-management-overview) doesn't support the Global reader role.
>- [Azure Information Protection](https://docs.microsoft.com/azure/information-protection/what-is-information-protection) - Global reader is supported [for central reporting](https://docs.microsoft.com/azure/information-protection/reports-aip) only, and when your Azure AD organization isn't on the [unified labeling platform](https://docs.microsoft.com/azure/information-protection/faqs#how-can-i-determine-if-my-tenant-is-on-the-unified-labeling-platform).
>
> These features are currently in development.
>

### [Group Administrator](#group-administrator-permissions)

Users in this role can create/manage groups and its settings like naming and expiration policies. It is important to understand that assigning a user to this role gives them the ability to manage all groups in the tenant across various workloads like Teams, SharePoint, Yammer in addition to Outlook. Also the user will be able to manage the various groups settings across various admin portals like Microsoft Admin Center, Azure portal, as well as workload specific ones like Teams and SharePoint Admin Centers.

### [Guest Inviter](#guest-inviter-permissions)

Users in this role can manage Azure Active Directory B2B guest user invitations when the **Members can invite** user setting is set to No. More information about B2B collaboration at [About Azure AD B2B collaboration](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b). It does not include any other permissions.

### [Helpdesk Administrator](#helpdesk-administrator-permissions)

Users with this role can change passwords, invalidate refresh tokens, manage service requests, and monitor service health. Invalidating a refresh token forces the user to sign in again. Helpdesk administrators can reset passwords and invalidate refresh tokens of other users who are non-administrators or assigned the following roles only:

* Directory Readers
* Guest Inviter
* Helpdesk Administrator
* Message Center Reader
* Reports Reader

> [!IMPORTANT]
> Users with this role can change passwords for people who may have access to sensitive or private information or critical configuration inside and outside of Azure Active Directory. Changing the password of a user may mean the ability to assume that user's identity and permissions. For example:
>
>- Application Registration and Enterprise Application owners, who can manage credentials of apps they own. Those apps may have privileged permissions in Azure AD and elsewhere not granted to Helpdesk Administrators. Through this path a Helpdesk Administrator may be able to assume the identity of an application owner and then further assume the identity of a privileged application by updating the credentials for the application.
>- Azure subscription owners, who might have access to sensitive or private information or critical configuration in Azure.
>- Security Group and Office 365 Group owners, who can manage group membership. Those groups may grant access to sensitive or private information or critical configuration in Azure AD and elsewhere.
>- Administrators in other services outside of Azure AD like Exchange Online, Office Security and Compliance Center, and human resources systems.
>- Non-administrators like executives, legal counsel, and human resources employees who may have access to sensitive or private information.

Delegating administrative permissions over subsets of users and applying policies to a subset of users is possible with [Administrative Units (now in public preview)](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-administrative-units).

This role was previously called "Password Administrator" in the [Azure portal](https://portal.azure.com/). The "Helpdesk Administrator" name in Azure AD now matches its name in Azure AD PowerShell, Azure AD Graph API and Microsoft Graph API.

### [Intune Administrator](#intune-service-administrator-permissions)

Users with this role have global permissions within Microsoft Intune Online, when the service is present. Additionally, this role contains the ability to manage users and devices in order to associate policy, as well as create and manage groups. More information at [Role-based administration control (RBAC) with Microsoft Intune](https://docs.microsoft.com/intune/role-based-access-control).

This role can create and manage all security groups. However, Intune Admin does not have admin rights over Office groups. That means the admin cannot update owners or memberships of all Office groups in the tenant. However, he/she can manage the Office group that he creates which comes as a part of his/her end user privileges. So, any Office group (not security group) that he/she creates should be counted against his/her quota of 250.

> [!NOTE]
> In Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell, this role is identified as "Intune Service Administrator ". It is "Intune Administrator" in the [Azure portal](https://portal.azure.com).

### [Kaizala Administrator](#kaizala-administrator-permissions)

Users with this role have global permissions to manage settings within Microsoft Kaizala, when the service is present, as well as the ability to manage support tickets and monitor service health. Additionally, the user can access reports related to adoption & usage of Kaizala by Organization members and business reports generated using the Kaizala actions.

### [License Administrator](#license-administrator-permissions)

Users in this role can add, remove, and update license assignments on users, groups (using group-based licensing), and manage the usage location on users. The role does not grant the ability to purchase or manage subscriptions, create or manage groups, or create or manage users beyond the usage location. This role has no access to view, create, or manage support tickets.

### [Message Center Privacy Reader](#message-center-privacy-reader-permissions)

Users in this role can monitor all notifications in the Message Center, including data privacy messages. Message Center Privacy Readers get email notifications including those related to data privacy and they can unsubscribe using Message Center Preferences. Only the Global Administrator and the Message Center Privacy Reader can read data privacy messages. Additionally, this role contains the ability to view groups, domains, and subscriptions. This role has no permission to view, create, or manage service requests.

### [Message Center Reader](#message-center-reader-permissions)

Users in this role can monitor notifications and advisory health updates in [Office 365 Message center](https://support.office.com/article/Message-center-in-Office-365-38FB3333-BFCC-4340-A37B-DEDA509C2093) for their organization on configured services such as Exchange, Intune, and Microsoft Teams. Message Center Readers receive weekly email digests of posts, updates, and can share message center posts in Office 365. In Azure AD, users assigned to this role will only have read-only access on Azure AD services such as users and groups. This role has no access to view, create, or manage support tickets.

### [Office Apps Administrator](#office-apps-administrator-permissions)

Users in this role can manage Office 365 apps' cloud settings. This includes managing cloud policies, self-service download management and the ability to view Office apps related report. This role additionally grants the ability to manage support tickets, and monitor service health within the main admin center. Users assigned to this role can also manage communication of new features in Office apps. 

### [Partner Tier1 Support](#partner-tier1-support-permissions)

Do not use. This role has been deprecated and will be removed from Azure AD in the future. This role is intended for use by a small number of Microsoft resale partners, and is not intended for general use.

### [Partner Tier2 Support](#partner-tier2-support-permissions)

Do not use. This role has been deprecated and will be removed from Azure AD in the future. This role is intended for use by a small number of Microsoft resale partners, and is not intended for general use.

### [Password Administrator](#password-administrator-permissions)

Users with this role have limited ability to manage passwords. This role does not grant the ability to manage service requests or monitor service health. Password administrators can reset passwords of other users who are non-administrators or members of the following roles only:

* Directory Readers
* Guest Inviter
* Password Administrator

### [Power BI Administrator](#power-bi-service-administrator-permissions)

Users with this role have global permissions within Microsoft Power BI, when the service is present, as well as the ability to manage support tickets and monitor service health. More information at [Understanding the Power BI admin role](https://docs.microsoft.com/power-bi/service-admin-role).

> [!NOTE]
> In Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell, this role is identified as "Power BI Service Administrator ". It is "Power BI Administrator" in the [Azure portal](https://portal.azure.com).

### [Power Platform Administrator](#power-platform-administrator-permissions)

Users in this role can create and manage all aspects of environments, PowerApps, Flows, Data Loss Prevention policies. Additionally, users with this role have the ability to manage support tickets and monitor service health.

### [Privileged Authentication Administrator](#privileged-authentication-administrator-permissions)

Users with this role can set or reset non-password credentials for all users, including global administrators, and can update passwords for all users. Privileged Authentication Administrators can force users to re-register against existing non-password credential (e.g. MFA, FIDO) and revoke ‘remember MFA on the device’, prompting for MFA on the next login of all users.

### [Privileged Role Administrator](#privileged-role-administrator-permissions)

Users with this role can manage role assignments in Azure Active Directory, as well as within Azure AD Privileged Identity Management. In addition, this role allows management of all aspects of Privileged Identity Management and administrative units.

> [!IMPORTANT]
> This role grants the ability to manage assignments for all Azure AD roles including the Global Administrator role. This role does not include any other privileged abilities in Azure AD like creating or updating users. However, users assigned to this role can grant themselves or others additional privilege by assigning additional roles.

### [Reports Reader](#reports-reader-permissions)

Users with this role can view usage reporting data and the reports dashboard in Microsoft 365 admin center and the adoption context pack in Power BI. Additionally, the role provides access to sign-in reports and activity in Azure AD and data returned by the Microsoft Graph reporting API. A user assigned to the Reports Reader role can access only relevant usage and adoption metrics. They don't have any admin permissions to configure settings or access the product-specific admin centers like Exchange. This role has no access to view, create, or manage support tickets.

### [Search Administrator](#search-administrator-permissions)

Users in this role have full access to all Microsoft Search management features in the Microsoft 365 admin center. Search Administrators can delegate the Search Administrators and Search Editor roles to users, and create and manage content, like bookmarks, Q&As, and locations. Additionally, these users can view the message center, monitor service health, and create service requests.

### [Search Editor](#search-editor-permissions)

Users in this role can create, manage, and delete content for Microsoft Search in the Microsoft 365 admin center, including bookmarks, Q&As, and locations.

### [Security Administrator](#security-administrator-permissions)

Users with this role have permissions to manage security-related features in the Microsoft 365 security center, Azure Active Directory Identity Protection, Azure Information Protection, and Office 365 Security & Compliance Center. More information about Office 365 permissions is available at [Permissions in the Office 365 Security & Compliance Center](https://support.office.com/article/Permissions-in-the-Office-365-Security-Compliance-Center-d10608af-7934-490a-818e-e68f17d0e9c1).

In | Can do
--- | ---
[Microsoft 365 security center](https://protection.office.com) | Monitor security-related policies across Microsoft 365 services<br>Manage security threats and alerts<br>View reports
Identity Protection Center | All permissions of the Security Reader role<br>Additionally, the ability to perform all Identity Protection Center operations except for resetting passwords
[Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-configure) | All permissions of the Security Reader role<br>**Cannot** manage Azure AD role assignments or settings
[Office 365 Security & Compliance Center](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d) | Manage security policies<br>View, investigate, and respond to security threats<br>View reports
Azure Advanced Threat Protection | Monitor and respond to suspicious security activity
Windows Defender ATP and EDR | Assign roles<br>Manage machine groups<br>Configure endpoint threat detection and automated remediation<br>View, investigate, and respond to alerts
[Intune](https://docs.microsoft.com/intune/role-based-access-control) | Views user, device, enrollment, configuration, and application information<br>Cannot make changes to Intune
[Cloud App Security](https://docs.microsoft.com/cloud-app-security/manage-admins) | Add admins, add policies and settings, upload logs and perform governance actions
[Azure Security Center](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles) | Can view security policies, view security states, edit security policies, view alerts and recommendations, dismiss alerts and recommendations
[Office 365 service health](https://docs.microsoft.com/office365/enterprise/view-service-health) | View the health of Office 365 services

### [Security operator](#security-operator-permissions)

Users with this role can manage alerts and have global read-only access on security-related feature, including all information in Microsoft 365 security center, Azure Active Directory, Identity Protection, Privileged Identity Management and Office 365 Security & Compliance Center. More information about Office 365 permissions is available at [Permissions in the Office 365 Security & Compliance Center](https://docs.microsoft.com/office365/securitycompliance/permissions-in-the-security-and-compliance-center).

In | Can do
--- | ---
[Microsoft 365 security center](https://protection.office.com) | All permissions of the Security Reader role<br>View, investigate, and respond to security threats alerts
Identity Protection Center | All permissions of the Security Reader role<br>Additionally, the ability to perform all Identity Protection Center operations except for resetting passwords
[Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-configure) | All permissions of the Security Reader role
[Office 365 Security & Compliance Center](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d) | All permissions of the Security Reader role<br>View, investigate, and respond to security alerts
Windows Defender ATP and EDR | All permissions of the Security Reader role<br>View, investigate, and respond to security alerts
[Intune](https://docs.microsoft.com/intune/role-based-access-control) | All permissions of the Security Reader role
[Cloud App Security](https://docs.microsoft.com/cloud-app-security/manage-admins) | All permissions of the Security Reader role
[Office 365 service health](https://docs.microsoft.com/office365/enterprise/view-service-health) | View the health of Office 365 services

### [Security Reader](#security-reader-permissions)

Users with this role have global read-only access on security-related feature, including all information in Microsoft 365 security center, Azure Active Directory, Identity Protection, Privileged Identity Management, as well as the ability to read Azure Active Directory sign-in reports and audit logs, and in Office 365 Security & Compliance Center. More information about Office 365 permissions is available at [Permissions in the Office 365 Security & Compliance Center](https://support.office.com/article/Permissions-in-the-Office-365-Security-Compliance-Center-d10608af-7934-490a-818e-e68f17d0e9c1).

In | Can do
--- | ---
[Microsoft 365 security center](https://protection.office.com) | View security-related policies across Microsoft 365 services<br>View security threats and alerts<br>View reports
Identity Protection Center | Read all security reports and settings information for security features<br><ul><li>Anti-spam<li>Encryption<li>Data loss prevention<li>Anti-malware<li>Advanced threat protection<li>Anti-phishing<li>Mailflow rules
[Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-configure) | Has read-only access to all information surfaced in Azure AD Privileged Identity Management: Policies and reports for Azure AD role assignments and security reviews.<br>**Cannot** sign up for Azure AD Privileged Identity Management or make any changes to it. In the Privileged Identity Management portal or via PowerShell, someone in this role can activate additional roles (for example, Global Admin or Privileged Role Administrator), if the user is eligible for them.
[Office 365 Security & Compliance Center](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d) | View security policies<br>View and investigate security threats<br>View reports
Windows Defender ATP and EDR | View and investigate alerts. When you turn on role-based access control in Windows Defender ATP, users with read-only permissions such as the Azure AD Security reader role lose access until they are assigned to a Windows Defender ATP role.
[Intune](https://docs.microsoft.com/intune/role-based-access-control) | Views user, device, enrollment, configuration, and application information. Cannot make changes to Intune.
[Cloud App Security](https://docs.microsoft.com/cloud-app-security/manage-admins) | Has read-only permissions and can manage alerts
[Azure Security Center](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles) | Can view recommendations and alerts, view security policies, view security states, but cannot make changes
[Office 365 service health](https://docs.microsoft.com/office365/enterprise/view-service-health) | View the health of Office 365 services

### [Service Support Administrator](#service-support-administrator-permissions)

Users with this role can open support requests with Microsoft for Azure and Office 365 services, and views the service dashboard and message center in the [Azure portal](https://portal.azure.com) and [Microsoft 365 admin center](https://admin.microsoft.com). More information at [About admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

> [!NOTE]
> In Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell, this role is identified as "Service Support Administrator." It is "Service Administrator" in the [Azure portal](https://portal.azure.com), the [Microsoft 365 admin center](https://admin.microsoft.com), and the Intune portal.

### [SharePoint Administrator](#sharepoint-service-administrator-permissions)

Users with this role have global permissions within Microsoft SharePoint Online, when the service is present, as well as the ability to create and manage all Office 365 Groups, manage support tickets, and monitor service health. More information at [About admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

> [!NOTE]
> In Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell, this role is identified as "SharePoint Service Administrator." It is "SharePoint Administrator" in the [Azure portal](https://portal.azure.com).

### [Skype for Business / Lync Administrator](#lync-service-administrator-permissions)

Users with this role have global permissions within Microsoft Skype for Business, when the service is present, as well as manage Skype-specific user attributes in Azure Active Directory. Additionally, this role grants the ability to manage support tickets and monitor service health, and to access the Teams and Skype for Business Admin Center. The account must also be licensed for Teams or it can't run Teams PowerShell cmdlets. More information at [About the Skype for Business admin role](https://support.office.com/article/about-the-skype-for-business-admin-role-aeb35bda-93fc-49b1-ac2c-c74fbeb737b5) and Teams licensing information at [Skype for Business and Microsoft Teams add-on licensing](https://docs.microsoft.com/skypeforbusiness/skype-for-business-and-microsoft-teams-add-on-licensing/skype-for-business-and-microsoft-teams-add-on-licensing)

> [!NOTE]
> In Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell, this role is identified as "Lync Service Administrator." It is "Skype for Business Administrator" in the [Azure portal](https://portal.azure.com/).

### [Teams Communications Administrator](#teams-communications-administrator-permissions)

Users in this role can manage aspects of the Microsoft Teams workload related to voice & telephony. This includes the management tools for telephone number assignment, voice and meeting policies, and full access to the call analytics toolset.

### [Teams Communications Support Engineer](#teams-communications-support-engineer-permissions)

Users in this role can troubleshoot communication issues within Microsoft Teams & Skype for Business using the user call troubleshooting tools in the Microsoft Teams & Skype for Business admin center. Users in this role can view full call record information for all participants involved. This role has no access to view, create, or manage support tickets.

### [Teams Communications Support Specialist](#teams-communications-support-specialist-permissions)

Users in this role can troubleshoot communication issues within Microsoft Teams & Skype for Business using the user call troubleshooting tools in the Microsoft Teams & Skype for Business admin center. Users in this role can only view user details in the call for the specific user they have looked up. This role has no access to view, create, or manage support tickets.

### [Teams Service Administrator](#teams-service-administrator-permissions)

Users in this role can manage all aspects of the Microsoft Teams workload via the Microsoft Teams & Skype for Business admin center and the respective PowerShell modules. This includes, among other areas, all management tools related to telephony, messaging, meetings, and the teams themselves. This role additionally grants the ability to create and manage all Office 365 Groups, manage support tickets, and monitor service health.

### [User Administrator](#user-administrator-permissions)

Users with this role can create users, and manage all aspects of users with some restrictions (see below), and can update password expiration policies. Additionally, users with this role can create and manage all groups. This role also includes the ability to create and manage user views, manage support tickets, and monitor service health. User administrators don't have permission to manage some user properties for users in most administrator roles. User with this role do not have permisssions to manage MFA. The roles that are exceptions to this restriction are listed in the following table.

| | |
| --- | --- |
|General permissions|<p>Create users and groups</p><p>Create and manage user views</p><p>Manage Office support tickets<p>Update password expiration policies|
|<p>On all users, including all admins</p>|<p>Manage licenses</p><p>Manage all user properties except User Principal Name</p>
|Only on users who are non-admins or in any of the following limited admin roles:<ul><li>Directory Readers<li>Guest Inviter<li>Helpdesk Administrator<li>Message Center Reader<li>Reports Reader<li>User Administrator|<p>Delete and restore</p><p>Disable and enable</p><p>Invalidate refresh Tokens</p><p>Manage all user properties including User Principal Name</p><p>Reset password</p><p>Update (FIDO) device keys</p>|

> [!IMPORTANT]
> Users with this role can change passwords for people who may have access to sensitive or private information or critical configuration inside and outside of Azure Active Directory. Changing the password of a user may mean the ability to assume that user's identity and permissions. For example:
>
>- Application Registration and Enterprise Application owners, who can manage credentials of apps they own. Those apps may have privileged permissions in Azure AD and elsewhere not granted to User Administrators. Through this path a User Administrator may be able to assume the identity of an application owner and then further assume the identity of a privileged application by updating the credentials for the application.
>- Azure subscription owners, who may have access to sensitive or private information or critical configuration in Azure.
>- Security Group and Office 365 Group owners, who can manage group membership. Those groups may grant access to sensitive or private information or critical configuration in Azure AD and elsewhere.
>- Administrators in other services outside of Azure AD like Exchange Online, Office Security and Compliance Center, and human resources systems.
>- Non-administrators like executives, legal counsel, and human resources employees who may have access to sensitive or private information.

## Role Permissions

The following tables describe the specific permissions in Azure Active Directory given to each role. Some roles may have additional permissions in Microsoft services outside of Azure Active Directory.

### Application Administrator permissions

Can create and manage all aspects of app registrations and enterprise apps.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/Application/appProxyAuthentication/update | Update App Proxy authentication properties on service principals in Azure Active Directory. |
| microsoft.directory/Application/appProxyUrlSettings/update | Update application proxy internal and external URLS in Azure Active Directory. |
| microsoft.directory/applications/applicationProxy/read | Read all of App Proxy properties. |
| microsoft.directory/applications/applicationProxy/update | Update all of App Proxy properties. |
| microsoft.directory/applications/audience/update | Update applications.audience property in Azure Active Directory. |
| microsoft.directory/applications/authentication/update | Update applications.authentication property in Azure Active Directory. |
| microsoft.directory/applications/basic/update | Update basic properties on applications in Azure Active Directory. |
| microsoft.directory/applications/create | Create applications in Azure Active Directory. |
| microsoft.directory/applications/credentials/update | Update applications.credentials property in Azure Active Directory. |
| microsoft.directory/applications/delete | Delete applications in Azure Active Directory. |
| microsoft.directory/applications/owners/update | Update applications.owners property in Azure Active Directory. |
| microsoft.directory/applications/permissions/update | Update applications.permissions property in Azure Active Directory. |
| microsoft.directory/applications/policies/update | Update applications.policies property in Azure Active Directory. |
| microsoft.directory/appRoleAssignments/create | Create appRoleAssignments in Azure Active Directory. |
| microsoft.directory/appRoleAssignments/read | Read appRoleAssignments in Azure Active Directory. |
| microsoft.directory/appRoleAssignments/update | Update appRoleAssignments in Azure Active Directory. |
| microsoft.directory/appRoleAssignments/delete | Delete appRoleAssignments in Azure Active Directory. |
| microsoft.directory/auditLogs/allProperties/read | Read all properties (including privileged properties) on auditLogs in Azure Active Directory. |
| microsoft.directory/connectorGroups/everything/read | Read application proxy connector group properties in Azure Active Directory. |
| microsoft.directory/connectorGroups/everything/update | Update all application proxy connector group properties in Azure Active Directory. |
| microsoft.directory/connectorGroups/create | Create application proxy connector groups in Azure Active Directory. |
| microsoft.directory/connectorGroups/delete | Delete application proxy connector groups in Azure Active Directory. |
| microsoft.directory/connectors/everything/read | Read all application proxy connector properties in Azure Active Directory. |
| microsoft.directory/connectors/create | Create application proxy connectors in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/basic/read | Read policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/basic/update | Update policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/create | Create policies in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/delete | Delete policies in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/owners/read | Read policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/owners/update | Update policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/policyAppliedTo/read | Read policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignments/update | Update servicePrincipals.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/audience/update | Update servicePrincipals.audience property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/authentication/update | Update servicePrincipals.authentication property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/basic/update | Update basic properties on servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/create | Create servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/credentials/update | Update servicePrincipals.credentials property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/delete | Delete servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/owners/update | Update servicePrincipals.owners property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/permissions/update | Update servicePrincipals.permissions property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/policies/update | Update servicePrincipals.policies property in Azure Active Directory. |
| microsoft.directory/signInReports/allProperties/read | Read all properties (including privileged properties) on signInReports in Azure Active Directory. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Application Developer permissions

Can create application registrations independent of the ‘Users can register applications’ setting.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/applications/createAsOwner | Create applications in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.directory/appRoleAssignments/createAsOwner | Create appRoleAssignments in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.directory/oAuth2PermissionGrants/createAsOwner | Create oAuth2PermissionGrants in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.directory/servicePrincipals/createAsOwner | Create servicePrincipals in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |

### Authentication Administrator permissions

Allowed to view, set and reset authentication method information for any non-admin user.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/users/invalidateAllRefreshTokens | Invalidate all user refresh tokens in Azure Active Directory. |
| microsoft.directory/users/strongAuthentication/update | Update strong authentication properties like MFA credential information. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.directory/users/password/update | Update passwords for all users in the Office 365 organization. See online documentation for more detail. |

### Azure DevOps Administrator permissions

Can manage Azure DevOps organization policy and settings.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see [role description](#azure-devops-administrator) above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.devOps/allEntities/allTasks | Read and configure Azure DevOps. |

### Azure Information Protection Administrator permissions

Can manage all aspects of the Azure Information Protection service.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see [role description](#) above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.informationProtection/allEntities/allTasks | Manage all aspects of Azure Information Protection. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### B2C User Flow Administrator permissions

Create and manage all aspects of user flows.

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.b2c/userFlows/allTasks | Read and configure user flows in  Azure Active Directory B2C. |

### B2C User Flow Attribute Administrator permissions

Create and manage the attribute schema available to all user flows.

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.b2c/userAttributes/allTasks | Read and configure user attributes in  Azure Active Directory B2C. |

### B2C IEF Keyset Administrator permissions

Manage secrets for federation and encryption in the Identity Experience Framework.

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.b2c/trustFramework/keySets/allTasks | Read and configure key sets in  Azure Active Directory B2C. |

### B2C IEF Policy Administrator permissions

Create and manage trust framework policies in the Identity Experience Framework.

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.b2c/trustFramework/policies/allTasks | Read and configure custom policies in  Azure Active Directory B2C. |

### Billing Administrator permissions

Can perform common billing related tasks like updating payment information.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/organization/basic/update | Update basic properties on organization in Azure Active Directory. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.commerce.billing/allEntities/allTasks | Manage all aspects of Office 365 billing. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Cloud Application Administrator permissions

Can create and manage all aspects of app registrations and enterprise apps except App Proxy.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/applications/audience/update | Update applications.audience property in Azure Active Directory. |
| microsoft.directory/applications/authentication/update | Update applications.authentication property in Azure Active Directory. |
| microsoft.directory/applications/basic/update | Update basic properties on applications in Azure Active Directory. |
| microsoft.directory/applications/create | Create applications in Azure Active Directory. |
| microsoft.directory/applications/credentials/update | Update applications.credentials property in Azure Active Directory. |
| microsoft.directory/applications/delete | Delete applications in Azure Active Directory. |
| microsoft.directory/applications/owners/update | Update applications.owners property in Azure Active Directory. |
| microsoft.directory/applications/permissions/update | Update applications.permissions property in Azure Active Directory. |
| microsoft.directory/applications/policies/update | Update applications.policies property in Azure Active Directory. |
| microsoft.directory/appRoleAssignments/create | Create appRoleAssignments in Azure Active Directory. |
| microsoft.directory/appRoleAssignments/update | Update appRoleAssignments in Azure Active Directory. |
| microsoft.directory/appRoleAssignments/delete | Delete appRoleAssignments in Azure Active Directory. |
| microsoft.directory/auditLogs/allProperties/read | Read all properties (including privileged properties) on auditLogs in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/create | Create policies in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/basic/read | Read policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/basic/update | Update policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/delete | Delete policies in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/owners/read | Read policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/owners/update | Update policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.directory/policies/applicationConfiguration/policyAppliedTo/read | Read policies.applicationConfiguration property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignments/update | Update servicePrincipals.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/audience/update | Update servicePrincipals.audience property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/authentication/update | Update servicePrincipals.authentication property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/basic/update | Update basic properties on servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/create | Create servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/credentials/update | Update servicePrincipals.credentials property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/delete | Delete servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/owners/update | Update servicePrincipals.owners property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/permissions/update | Update servicePrincipals.permissions property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/policies/update | Update servicePrincipals.policies property in Azure Active Directory. |
| microsoft.directory/signInReports/allProperties/read | Read all properties (including privileged properties) on signInReports in Azure Active Directory. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Cloud Device Administrator permissions

Full access to manage devices in Azure AD.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/auditLogs/allProperties/read | Read all properties (including privileged properties) on auditLogs in Azure Active Directory. |
| microsoft.directory/devices/bitLockerRecoveryKeys/read | Read devices.bitLockerRecoveryKeys property in Azure Active Directory. |
| microsoft.directory/devices/delete | Delete devices in Azure Active Directory. |
| microsoft.directory/devices/disable | Disable devices in Azure Active Directory. |
| microsoft.directory/devices/enable | Enable devices in Azure Active Directory. |
| microsoft.directory/signInReports/allProperties/read | Read all properties (including privileged properties) on signInReports in Azure Active Directory. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |

### Company Administrator permissions

Can manage all aspects of Azure AD and Microsoft services that use Azure AD identities. This role is also known as the Global Administrator role. 

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.cloudAppSecurity/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.aad.cloudAppSecurity. |
| microsoft.directory/administrativeUnits/allProperties/allTasks | Create and delete administrativeUnits, and read and update all properties in Azure Active Directory. |
| microsoft.directory/applications/allProperties/allTasks | Create and delete applications, and read and update all properties in Azure Active Directory. |
| microsoft.directory/appRoleAssignments/allProperties/allTasks | Create and delete appRoleAssignments, and read and update all properties in Azure Active Directory. |
| microsoft.directory/auditLogs/allProperties/read | Read all properties (including privileged properties) on auditLogs in Azure Active Directory. |
| microsoft.directory/contacts/allProperties/allTasks | Create and delete contacts, and read and update all properties in Azure Active Directory. |
| microsoft.directory/contracts/allProperties/allTasks | Create and delete contracts, and read and update all properties in Azure Active Directory. |
| microsoft.directory/devices/allProperties/allTasks | Create and delete devices, and read and update all properties in Azure Active Directory. |
| microsoft.directory/directoryRoles/allProperties/allTasks | Create and delete directoryRoles, and read and update all properties in Azure Active Directory. |
| microsoft.directory/directoryRoleTemplates/allProperties/allTasks | Create and delete directoryRoleTemplates, and read and update all properties in Azure Active Directory. |
| microsoft.directory/domains/allProperties/allTasks | Create and delete domains, and read and update all properties in Azure Active Directory. |
| microsoft.directory/groups/allProperties/allTasks | Create and delete groups, and read and update all properties in Azure Active Directory. |
| microsoft.directory/groupSettings/allProperties/allTasks | Create and delete groupSettings, and read and update all properties in Azure Active Directory. |
| microsoft.directory/groupSettingTemplates/allProperties/allTasks | Create and delete groupSettingTemplates, and read and update all properties in Azure Active Directory. |
| microsoft.directory/loginTenantBranding/allProperties/allTasks | Create and delete loginTenantBranding, and read and update all properties in Azure Active Directory. |
| microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete oAuth2PermissionGrants, and read and update all properties in Azure Active Directory. |
| microsoft.directory/organization/allProperties/allTasks | Create and delete organization, and read and update all properties in Azure Active Directory. |
| microsoft.directory/policies/allProperties/allTasks | Create and delete policies, and read and update all properties in Azure Active Directory. |
| microsoft.directory/roleAssignments/allProperties/allTasks | Create and delete roleAssignments, and read and update all properties in Azure Active Directory. |
| microsoft.directory/roleDefinitions/allProperties/allTasks | Create and delete roleDefinitions, and read and update all properties in Azure Active Directory. |
| microsoft.directory/scopedRoleMemberships/allProperties/allTasks | Create and delete scopedRoleMemberships, and read and update all properties in Azure Active Directory. |
| microsoft.directory/serviceAction/activateService | Can perform the Activateservice service action in Azure Active Directory |
| microsoft.directory/serviceAction/disableDirectoryFeature | Can perform the Disabledirectoryfeature service action in Azure Active Directory |
| microsoft.directory/serviceAction/enableDirectoryFeature | Can perform the Enabledirectoryfeature service action in Azure Active Directory |
| microsoft.directory/serviceAction/getAvailableExtentionProperties | Can perform the Getavailableextentionproperties service action in Azure Active Directory |
| microsoft.directory/servicePrincipals/allProperties/allTasks | Create and delete servicePrincipals, and read and update all properties in Azure Active Directory. |
| microsoft.directory/signInReports/allProperties/read | Read all properties (including privileged properties) on signInReports in Azure Active Directory. |
| microsoft.directory/subscribedSkus/allProperties/allTasks | Create and delete subscribedSkus, and read and update all properties in Azure Active Directory. |
| microsoft.directory/users/allProperties/allTasks | Create and delete users, and read and update all properties in Azure Active Directory. |
| microsoft.directorySync/allEntities/allTasks | Perform all actions in Azure AD Connect. |
| microsoft.aad.identityProtection/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.aad.identityProtection. |
| microsoft.aad.privilegedIdentityManagement/allEntities/read | Read all resources in microsoft.aad.privilegedIdentityManagement. |
| microsoft.azure.advancedThreatProtection/allEntities/read | Read all resources in microsoft.azure.advancedThreatProtection. |
| microsoft.azure.informationProtection/allEntities/allTasks | Manage all aspects of Azure Information Protection. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.commerce.billing/allEntities/allTasks | Manage all aspects of Office 365 billing. |
| microsoft.intune/allEntities/allTasks | Manage all aspects of Intune. |
| microsoft.office365.complianceManager/allEntities/allTasks | Manage all aspects of Office 365 Compliance Manager |
| microsoft.office365.desktopAnalytics/allEntities/allTasks | Manage all aspects of Desktop Analytics. |
| microsoft.office365.exchange/allEntities/allTasks | Manage all aspects of Exchange Online. |
| microsoft.office365.lockbox/allEntities/allTasks | Manage all aspects of Office 365 Customer Lockbox |
| microsoft.office365.messageCenter/messages/read | Read messages in microsoft.office365.messageCenter. |
| microsoft.office365.messageCenter/securityMessages/read | Read securityMessages in microsoft.office365.messageCenter. |
| microsoft.office365.protectionCenter/allEntities/allTasks | Manage all aspects of Office 365 Protection Center. |
| microsoft.office365.securityComplianceCenter/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.office365.securityComplianceCenter. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.sharepoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.office365.sharepoint. |
| microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.office365.usageReports/allEntities/read | Read Office 365 usage reports. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.powerApps.dynamics365/allEntities/allTasks | Manage all aspects of Dynamics 365. |
| microsoft.powerApps.powerBI/allEntities/allTasks | Manage all aspects of Power BI. |
| microsoft.windows.defenderAdvancedThreatProtection/allEntities/read | Read all resources in microsoft.windows.defenderAdvancedThreatProtection. |

### Compliance Administrator permissions

Can read and manage compliance configuration and reports in Azure AD and Office 365.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.complianceManager/allEntities/allTasks | Manage all aspects of Office 365 Compliance Manager |
| microsoft.office365.exchange/allEntities/allTasks | Manage all aspects of Exchange Online. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.sharepoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.office365.sharepoint. |
| microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Compliance Data Administrator permissions

Creates and manages compliance content.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.cloudAppSecurity/allEntities/allTasks | Read and configure Microsoft Cloud App Security. |
| microsoft.azure.informationProtection/allEntities/allTasks | Manage all aspects of Azure Information Protection. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.complianceManager/allEntities/allTasks | Manage all aspects of Office 365 Compliance Manager |
| microsoft.office365.exchange/allEntities/allTasks | Manage all aspects of Exchange Online. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.sharepoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.office365.sharepoint. |
| microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Conditional Access Administrator permissions

Can manage Conditional Access capabilities.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/policies/conditionalAccess/basic/read | Read policies.conditionalAccess property in Azure Active Directory. |
| microsoft.directory/policies/conditionalAccess/basic/update | Update policies.conditionalAccess property in Azure Active Directory. |
| microsoft.directory/policies/conditionalAccess/create | Create policies in Azure Active Directory. |
| microsoft.directory/policies/conditionalAccess/delete | Delete policies in Azure Active Directory. |
| microsoft.directory/policies/conditionalAccess/owners/read | Read policies.conditionalAccess property in Azure Active Directory. |
| microsoft.directory/policies/conditionalAccess/owners/update | Update policies.conditionalAccess property in Azure Active Directory. |
| microsoft.directory/policies/conditionalAccess/policiesAppliedTo/read | Read policies.conditionalAccess property in Azure Active Directory. |
| microsoft.directory/policies/conditionalAccess/tenantDefault/update | Update policies.conditionalAccess property in Azure Active Directory. |

### CRM Service Administrator permissions

Can manage all aspects of the Dynamics 365 product.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.powerApps.dynamics365/allEntities/allTasks | Manage all aspects of Dynamics 365. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Customer LockBox Access Approver permissions

Can approve Microsoft support requests to access customer organizational data.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.lockbox/allEntities/allTasks | Manage all aspects of Office 365 Customer Lockbox |

### Desktop Analytics Administrator permissions

Can manage the Desktop Analytics and Office Customization & Policy services. For Desktop Analytics, this includes the ability to view asset inventory, create deployment plans, view deployment and health status. For Office Customization & Policy service, this role enables users to manage Office policies.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.desktopAnalytics/allEntities/allTasks | Manage all aspects of Desktop Analytics. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Device Administrators permissions

Users assigned to this role are added to the local administrators group on Azure AD-joined devices.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/groupSettings/basic/read | Read basic properties on groupSettings in Azure Active Directory. |
| microsoft.directory/groupSettingTemplates/basic/read | Read basic properties on groupSettingTemplates in Azure Active Directory. |

### Directory Readers permissions
Can read basic directory information. For granting access to applications, not intended for users.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/administrativeUnits/basic/read | Read basic properties on administrativeUnits in Azure Active Directory. |
| microsoft.directory/administrativeUnits/members/read | Read administrativeUnits.members property in Azure Active Directory. |
| microsoft.directory/applications/basic/read | Read basic properties on applications in Azure Active Directory. |
| microsoft.directory/applications/owners/read | Read applications.owners property in Azure Active Directory. |
| microsoft.directory/applications/policies/read | Read applications.policies property in Azure Active Directory. |
| microsoft.directory/contacts/basic/read | Read basic properties on contacts in Azure Active Directory. |
| microsoft.directory/contacts/memberOf/read | Read contacts.memberOf property in Azure Active Directory. |
| microsoft.directory/contracts/basic/read | Read basic properties on contracts in Azure Active Directory. |
| microsoft.directory/devices/basic/read | Read basic properties on devices in Azure Active Directory. |
| microsoft.directory/devices/memberOf/read | Read devices.memberOf property in Azure Active Directory. |
| microsoft.directory/devices/registeredOwners/read | Read devices.registeredOwners property in Azure Active Directory. |
| microsoft.directory/devices/registeredUsers/read | Read devices.registeredUsers property in Azure Active Directory. |
| microsoft.directory/directoryRoles/basic/read | Read basic properties on directoryRoles in Azure Active Directory. |
| microsoft.directory/directoryRoles/eligibleMembers/read | Read directoryRoles.eligibleMembers property in Azure Active Directory. |
| microsoft.directory/directoryRoles/members/read | Read directoryRoles.members property in Azure Active Directory. |
| microsoft.directory/domains/basic/read | Read basic properties on domains in Azure Active Directory. |
| microsoft.directory/groups/appRoleAssignments/read | Read groups.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/groups/basic/read | Read basic properties on groups in Azure Active Directory. |
| microsoft.directory/groups/memberOf/read | Read groups.memberOf property in Azure Active Directory. |
| microsoft.directory/groups/members/read | Read groups.members property in Azure Active Directory. |
| microsoft.directory/groups/owners/read | Read groups.owners property in Azure Active Directory. |
| microsoft.directory/groups/settings/read | Read groups.settings property in Azure Active Directory. |
| microsoft.directory/groupSettings/basic/read | Read basic properties on groupSettings in Azure Active Directory. |
| microsoft.directory/groupSettingTemplates/basic/read | Read basic properties on groupSettingTemplates in Azure Active Directory. |
| microsoft.directory/oAuth2PermissionGrants/basic/read | Read basic properties on oAuth2PermissionGrants in Azure Active Directory. |
| microsoft.directory/organization/basic/read | Read basic properties on organization in Azure Active Directory. |
| microsoft.directory/organization/trustedCAsForPasswordlessAuth/read | Read organization.trustedCAsForPasswordlessAuth property in Azure Active Directory. |
| microsoft.directory/roleAssignments/basic/read | Read basic properties on roleAssignments in Azure Active Directory. |
| microsoft.directory/roleDefinitions/basic/read | Read basic properties on roleDefinitions in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignedTo/read | Read servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignments/read | Read servicePrincipals.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/basic/read | Read basic properties on servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/memberOf/read | Read servicePrincipals.memberOf property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/oAuth2PermissionGrants/basic/read | Read servicePrincipals.oAuth2PermissionGrants property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/ownedObjects/read | Read servicePrincipals.ownedObjects property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/owners/read | Read servicePrincipals.owners property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/policies/read | Read servicePrincipals.policies property in Azure Active Directory. |
| microsoft.directory/subscribedSkus/basic/read | Read basic properties on subscribedSkus in Azure Active Directory. |
| microsoft.directory/users/appRoleAssignments/read | Read users.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/users/basic/read | Read basic properties on users in Azure Active Directory. |
| microsoft.directory/users/directReports/read | Read users.directReports property in Azure Active Directory. |
| microsoft.directory/users/manager/read | Read users.manager property in Azure Active Directory. |
| microsoft.directory/users/memberOf/read | Read users.memberOf property in Azure Active Directory. |
| microsoft.directory/users/oAuth2PermissionGrants/basic/read | Read users.oAuth2PermissionGrants property in Azure Active Directory. |
| microsoft.directory/users/ownedDevices/read | Read users.ownedDevices property in Azure Active Directory. |
| microsoft.directory/users/ownedObjects/read | Read users.ownedObjects property in Azure Active Directory. |
| microsoft.directory/users/registeredDevices/read | Read users.registeredDevices property in Azure Active Directory. |

### Directory Synchronization Accounts permissions

Only used by Azure AD Connect service.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/organization/dirSync/update | Update organization.dirSync property in Azure Active Directory. |
| microsoft.directory/policies/create | Create policies in Azure Active Directory. |
| microsoft.directory/policies/delete | Delete policies in Azure Active Directory. |
| microsoft.directory/policies/basic/read | Read basic properties on policies in Azure Active Directory. |
| microsoft.directory/policies/basic/update | Update basic properties on policies in Azure Active Directory. |
| microsoft.directory/policies/owners/read | Read policies.owners property in Azure Active Directory. |
| microsoft.directory/policies/owners/update | Update policies.owners property in Azure Active Directory. |
| microsoft.directory/policies/policiesAppliedTo/read | Read policies.policiesAppliedTo property in Azure Active Directory. |
| microsoft.directory/policies/tenantDefault/update | Update policies.tenantDefault property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignedTo/read | Read servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignments/read | Read servicePrincipals.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignments/update | Update servicePrincipals.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/audience/update | Update servicePrincipals.audience property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/authentication/update | Update servicePrincipals.authentication property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/basic/read | Read basic properties on servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/basic/update | Update basic properties on servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/create | Create servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/credentials/update | Update servicePrincipals.credentials property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/memberOf/read | Read servicePrincipals.memberOf property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/oAuth2PermissionGrants/basic/read | Read servicePrincipals.oAuth2PermissionGrants property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/owners/read | Read servicePrincipals.owners property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/owners/update | Update servicePrincipals.owners property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/ownedObjects/read | Read servicePrincipals.ownedObjects property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/permissions/update | Update servicePrincipals.permissions property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/policies/read | Read servicePrincipals.policies property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/policies/update | Update servicePrincipals.policies property in Azure Active Directory. |
| microsoft.directorySync/allEntities/allTasks | Perform all actions in Azure AD Connect. |

### Directory Writers permissions

Can read & write basic directory information. For granting access to applications, not intended for users.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/groups/create | Create groups in Azure Active Directory. |
| microsoft.directory/groups/createAsOwner | Create groups in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.directory/groups/appRoleAssignments/update | Update groups.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/groups/basic/update | Update basic properties on groups in Azure Active Directory. |
| microsoft.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.directory/groups/owners/update | Update groups.owners property in Azure Active Directory. |
| microsoft.directory/groups/settings/update | Update groups.settings property in Azure Active Directory. |
| microsoft.directory/groupSettings/basic/update | Update basic properties on groupSettings in Azure Active Directory. |
| microsoft.directory/groupSettings/create | Create groupSettings in Azure Active Directory. |
| microsoft.directory/groupSettings/delete | Delete groupSettings in Azure Active Directory. |
| microsoft.directory/users/appRoleAssignments/update | Update users.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/users/assignLicense | Manage licenses on users in Azure Active Directory. |
| microsoft.directory/users/basic/update | Update basic properties on users in Azure Active Directory. |
| microsoft.directory/users/invalidateAllRefreshTokens | Invalidate all user refresh tokens in Azure Active Directory. |
| microsoft.directory/users/manager/update | Update users.manager property in Azure Active Directory. |
| microsoft.directory/users/userPrincipalName/update | Update users.userPrincipalName property in Azure Active Directory. |

### Exchange Service Administrator permissions

Can manage all aspects of the Exchange product.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/groups/unified/appRoleAssignments/update | Update groups.unified property in Azure Active Directory. |
| microsoft.directory/groups/unified/basic/update | Update basic properties of Office 365 Groups. |
| microsoft.directory/groups/unified/create | Create Office 365 Groups. |
| microsoft.directory/groups/unified/delete | Delete Office 365 Groups. |
| microsoft.directory/groups/unified/members/update | Update membership of Office 365 Groups. |
| microsoft.directory/groups/unified/owners/update | Update ownership of Office 365 Groups. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.exchange/allEntities/allTasks | Manage all aspects of Exchange Online. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### External Identity Provider Administrator permissions

Configure identity providers for use in direct federation.

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.b2c/identityProviders/allTasks | Read and configure identity providers in  Azure Active Directory B2C. |

### Global Reader permissions
Can read everything that a Global Administrator can, but not edit anything. 

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see [role description](#global-reader) above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.commerce.billing/allEntities/read	| Read all aspects of Office 365 billing. |
| microsoft.directory/administrativeUnits/basic/read	| Read basic properties on administrativeUnits in Azure Active Directory. |
| microsoft.directory/administrativeUnits/members/read	| Read administrativeUnits.members property in Azure Active Directory. |
| microsoft.directory/applications/basic/read	| Read basic properties on applications in Azure Active Directory. |
| microsoft.directory/applications/owners/read	| Read applications.owners property in Azure Active Directory. |
| microsoft.directory/applications/policies/read	| Read applications.policies property in Azure Active Directory. |
| microsoft.directory/contacts/basic/read	| Read basic properties on contacts in Azure Active Directory. |
| microsoft.directory/contacts/memberOf/read	| Read contacts.memberOf property in Azure Active Directory. |
| microsoft.directory/contracts/basic/read	| Read basic properties on contracts in Azure Active Directory. |
| microsoft.directory/devices/basic/read	| Read basic properties on devices in Azure Active Directory. |
| microsoft.directory/devices/memberOf/read	| Read devices.memberOf property in Azure Active Directory. |
| microsoft.directory/devices/registeredOwners/read	| Read devices.registeredOwners property in Azure Active Directory. |
| microsoft.directory/devices/registeredUsers/read	| Read devices.registeredUsers property in Azure Active Directory. |
| microsoft.directory/directoryRoles/basic/read	| Read basic properties on directoryRoles in Azure Active Directory. |
| microsoft.directory/directoryRoles/eligibleMembers/read	| Read directoryRoles.eligibleMembers property in Azure Active Directory. |
| microsoft.directory/directoryRoles/members/read	| Read directoryRoles.members property in Azure Active Directory. |
| microsoft.directory/domains/basic/read	| Read basic properties on domains in Azure Active Directory. |
| microsoft.directory/groups/appRoleAssignments/read	| Read groups.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/groups/basic/read	| Read basic properties on groups in Azure Active Directory. |
| microsoft.directory/groups/hiddenMembers/read	| Read groups.hiddenMembers property in Azure Active Directory. |
| microsoft.directory/groups/memberOf/read	| Read groups.memberOf property in Azure Active Directory. |
| microsoft.directory/groups/members/read	| Read groups.members property in Azure Active Directory. |
| microsoft.directory/groups/owners/read	| Read groups.owners property in Azure Active Directory. |
| microsoft.directory/groups/settings/read	| Read groups.settings property in Azure Active Directory. |
| microsoft.directory/groupSettings/basic/read	| Read basic properties on groupSettings in Azure Active Directory. |
| microsoft.directory/groupSettingTemplates/basic/read	| Read basic properties on groupSettingTemplates in Azure Active Directory. |
| microsoft.directory/oAuth2PermissionGrants/basic/read	| Read basic properties on oAuth2PermissionGrants in Azure Active Directory. |
| microsoft.directory/organization/basic/read	| Read basic properties on organization in Azure Active Directory. |
| microsoft.directory/organization/trustedCAsForPasswordlessAuth/read	| Read organization.trustedCAsForPasswordlessAuth property in Azure Active Directory. |
| microsoft.directory/policies/standard/read	| Read standard policies in Azure Active Directory. |
| microsoft.directory/roleAssignments/basic/read	| Read basic properties on roleAssignments in Azure Active Directory. |
| microsoft.directory/roleDefinitions/basic/read	| Read basic properties on roleDefinitions in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignedTo/read	| Read servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignments/read	| Read servicePrincipals.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/basic/read	| Read basic properties on servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/memberOf/read	| Read servicePrincipals.memberOf property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/oAuth2PermissionGrants/basic/read	| Read servicePrincipals.oAuth2PermissionGrants property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/ownedObjects/read	| Read servicePrincipals.ownedObjects property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/owners/read	| Read servicePrincipals.owners property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/policies/read	| Read servicePrincipals.policies property in Azure Active Directory. |
| microsoft.directory/signInReports/allProperties/read	| Read all properties (including privileged properties) on signInReports in Azure Active Directory. |
| microsoft.directory/subscribedSkus/basic/read	| Read basic properties on subscribedSkus in Azure Active Directory. |
| microsoft.directory/users/appRoleAssignments/read	| Read users.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/users/basic/read	| Read basic properties on users in Azure Active Directory. |
| microsoft.directory/users/directReports/read	| Read users.directReports property in Azure Active Directory. |
| microsoft.directory/users/manager/read	| Read users.manager property in Azure Active Directory. |
| microsoft.directory/users/memberOf/read	| Read users.memberOf property in Azure Active Directory. |
| microsoft.directory/users/oAuth2PermissionGrants/basic/read	| Read users.oAuth2PermissionGrants property in Azure Active Directory. |
| microsoft.directory/users/ownedDevices/read	| Read users.ownedDevices property in Azure Active Directory. |
| microsoft.directory/users/ownedObjects/read	| Read users.ownedObjects property in Azure Active Directory. |
| microsoft.directory/users/registeredDevices/read	| Read users.registeredDevices property in Azure Active Directory. |
| microsoft.directory/users/strongAuthentication/read	| Read strong authentication properties like MFA credential information. |
| microsoft.office365.exchange/allEntities/read	| Read all aspects of Exchange Online. |
| microsoft.office365.messageCenter/messages/read	| Read messages in microsoft.office365.messageCenter. |
| microsoft.office365.messageCenter/securityMessages/read	| Read securityMessages in microsoft.office365.messageCenter. |
| microsoft.office365.protectionCenter/allEntities/read	| Read all aspects of Office 365 Protection Center. |
| microsoft.office365.securityComplianceCenter/allEntities/read	| Read all standard properties in microsoft.office365.securityComplianceCenter. |
| microsoft.office365.usageReports/allEntities/read	| Read Office 365 usage reports. |
| microsoft.office365.webPortal/allEntities/standard/read	| Read standard properties on all resources in microsoft.office365.webPortal. |

### Group Administrator permissions
Can manage all aspects of groups and group settings like naming and expiration policies.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/groups/basic/read | Read standard properties on Groups in Azure Active Directory.  |
| microsoft.directory/groups/basic/update | Update basic properties on groups in Azure Active Directory. |
| microsoft.directory/groups/create | Create groups in Azure Active Directory. |
| microsoft.directory/groups/createAsOwner | Create groups in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.directory/groups/delete | Delete groups in Azure Active Directory. |
| microsoft.directory/groups/hiddenMembers/read | Read groups.hiddenMembers property in Azure Active Directory. |
| microsoft.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.directory/groups/owners/update | Update groups.owners property in Azure Active Directory. |
| microsoft.directory/groups/restore | Restore groups in Azure Active Directory. |
| microsoft.directory/groups/settings/update | Update groups.settings property in Azure Active Directory. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.messageCenter/messages/read | Read messages in microsoft.office365.messageCenter. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.office365.usageReports/allEntities/read | Read Office 365 usage reports. |

### Guest Inviter permissions
Can invite guest users independent of the ‘members can invite guests’ setting.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/users/appRoleAssignments/read | Read users.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/users/basic/read | Read basic properties on users in Azure Active Directory. |
| microsoft.directory/users/directReports/read | Read users.directReports property in Azure Active Directory. |
| microsoft.directory/users/inviteGuest | Invite guest users in Azure Active Directory. |
| microsoft.directory/users/manager/read | Read users.manager property in Azure Active Directory. |
| microsoft.directory/users/memberOf/read | Read users.memberOf property in Azure Active Directory. |
| microsoft.directory/users/oAuth2PermissionGrants/basic/read | Read users.oAuth2PermissionGrants property in Azure Active Directory. |
| microsoft.directory/users/ownedDevices/read | Read users.ownedDevices property in Azure Active Directory. |
| microsoft.directory/users/ownedObjects/read | Read users.ownedObjects property in Azure Active Directory. |
| microsoft.directory/users/registeredDevices/read | Read users.registeredDevices property in Azure Active Directory. |

### Helpdesk Administrator permissions

Can reset passwords for non-administrators and Helpdesk Administrators.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/devices/bitLockerRecoveryKeys/read | Read devices.bitLockerRecoveryKeys property in Azure Active Directory. |
| microsoft.directory/users/invalidateAllRefreshTokens | Invalidate all user refresh tokens in Azure Active Directory. |
| microsoft.directory/users/password/update | Update passwords for all users in Azure Active Directory. See online documentation for more detail. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Intune Service Administrator permissions

Can manage all aspects of the Intune product.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/contacts/basic/update | Update basic properties on contacts in Azure Active Directory. |
| microsoft.directory/contacts/create | Create contacts in Azure Active Directory. |
| microsoft.directory/contacts/delete | Delete contacts in Azure Active Directory. |
| microsoft.directory/devices/basic/update | Update basic properties on devices in Azure Active Directory. |
| microsoft.directory/devices/bitLockerRecoveryKeys/read | Read devices.bitLockerRecoveryKeys property in Azure Active Directory. |
| microsoft.directory/devices/create | Create devices in Azure Active Directory. |
| microsoft.directory/devices/delete | Delete devices in Azure Active Directory. |
| microsoft.directory/devices/registeredOwners/update | Update devices.registeredOwners property in Azure Active Directory. |
| microsoft.directory/devices/registeredUsers/update | Update devices.registeredUsers property in Azure Active Directory. |
| microsoft.directory/groups/appRoleAssignments/update | Update groups.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/groups/basic/update | Update basic properties on groups in Azure Active Directory. |
| microsoft.directory/groups/create | Create groups in Azure Active Directory. |
| microsoft.directory/groups/createAsOwner | Create groups in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.directory/groups/delete | Delete groups in Azure Active Directory. |
| microsoft.directory/groups/hiddenMembers/read | Read groups.hiddenMembers property in Azure Active Directory. |
| microsoft.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.directory/groups/owners/update | Update groups.owners property in Azure Active Directory. |
| microsoft.directory/groups/restore | Restore groups in Azure Active Directory. |
| microsoft.directory/groups/settings/update | Update groups.settings property in Azure Active Directory. |
| microsoft.directory/users/appRoleAssignments/update | Update users.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/users/basic/update | Update basic properties on users in Azure Active Directory. |
| microsoft.directory/users/manager/update | Update users.manager property in Azure Active Directory. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.intune/allEntities/allTasks | Manage all aspects of Intune. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |

### Kaizala Administrator permissions

Can manage settings for Microsoft Kaizala.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read Office 365 admin center. |

### License Administrator permissions

Can manage product licenses on users and groups.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/users/assignLicense | Manage licenses on users in Azure Active Directory. |
| microsoft.directory/users/usageLocation/update | Update users.usageLocation property in Azure Active Directory. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |

### Lync Service Administrator permissions

Can manage all aspects of the Skype for Business product.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Message Center Privacy Reader permissions

Can read Message Center posts, data privacy messages, groups, domains and subscriptions.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.messageCenter/messages/read | Read messages in microsoft.office365.messageCenter. |
| microsoft.office365.messageCenter/securityMessages/read | Read securityMessages in microsoft.office365.messageCenter. |

### Message Center Reader permissions
Can read messages and updates for their organization in Office 365 Message Center only. 

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.messageCenter/messages/read | Read messages in microsoft.office365.messageCenter. |

### Office Apps Administrator permissions
Can manage Office apps' cloud services, including policy and settings management, and manage the ability to select, unselect and publish "what's new" feature content to end-user’s devices.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.messageCenter/messages/read | Read messages in microsoft.office365.messageCenter. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.office365.usageReports/allEntities/read | Read Office 365 usage reports. |
| microsoft.office365.userCommunication/allEntities/allTasks | Read and update What’s New messages visibility. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |

### Partner Tier1 Support permissions

Do not use - not intended for general use.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/contacts/basic/update | Update basic properties on contacts in Azure Active Directory. |
| microsoft.directory/contacts/create | Create contacts in Azure Active Directory. |
| microsoft.directory/contacts/delete | Delete contacts in Azure Active Directory. |
| microsoft.directory/groups/create | Create groups in Azure Active Directory. |
| microsoft.directory/groups/createAsOwner | Create groups in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.directory/groups/owners/update | Update groups.owners property in Azure Active Directory. |
| microsoft.directory/users/appRoleAssignments/update | Update users.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/users/assignLicense | Manage licenses on users in Azure Active Directory. |
| microsoft.directory/users/basic/update | Update basic properties on users in Azure Active Directory. |
| microsoft.directory/users/delete | Delete users in Azure Active Directory. |
| microsoft.directory/users/invalidateAllRefreshTokens | Invalidate all user refresh tokens in Azure Active Directory. |
| microsoft.directory/users/manager/update | Update users.manager property in Azure Active Directory. |
| microsoft.directory/users/password/update | Update passwords for all users in Azure Active Directory. See online documentation for more detail. |
| microsoft.directory/users/restore | Restore deleted users in Azure Active Directory. |
| microsoft.directory/users/userPrincipalName/update | Update users.userPrincipalName property in Azure Active Directory. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Partner Tier2 Support permissions

Do not use - not intended for general use.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/contacts/basic/update | Update basic properties on contacts in Azure Active Directory. |
| microsoft.directory/contacts/create | Create contacts in Azure Active Directory. |
| microsoft.directory/contacts/delete | Delete contacts in Azure Active Directory. |
| microsoft.directory/domains/allTasks | Create and delete domains, and read and update standard properties in Azure Active Directory. |
| microsoft.directory/groups/create | Create groups in Azure Active Directory. |
| microsoft.directory/groups/delete | Delete groups in Azure Active Directory. |
| microsoft.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.directory/groups/restore | Restore groups in Azure Active Directory. |
| microsoft.directory/organization/basic/update | Update basic properties on organization in Azure Active Directory. |
| microsoft.directory/users/appRoleAssignments/update | Update users.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/users/assignLicense | Manage licenses on users in Azure Active Directory. |
| microsoft.directory/users/basic/update | Update basic properties on users in Azure Active Directory. |
| microsoft.directory/users/delete | Delete users in Azure Active Directory. |
| microsoft.directory/users/invalidateAllRefreshTokens | Invalidate all user refresh tokens in Azure Active Directory. |
| microsoft.directory/users/manager/update | Update users.manager property in Azure Active Directory. |
| microsoft.directory/users/password/update | Update passwords for all users in Azure Active Directory. See online documentation for more detail. |
| microsoft.directory/users/restore | Restore deleted users in Azure Active Directory. |
| microsoft.directory/users/userPrincipalName/update | Update users.userPrincipalName property in Azure Active Directory. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Password Administrator permissions

Can reset passwords for non-administrators and Password administrators.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/users/password/update | Update passwords for all users in Azure Active Directory. See online documentation for more detail. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |

### Power BI Service Administrator permissions

Can manage all aspects of the Power BI product.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>
| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.powerApps.powerBI/allEntities/allTasks | Manage all aspects of Power BI. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |


### Power Platform Administrator permissions

Can create and manage all aspects of Microsoft Dynamics 365, PowerApps and Microsoft Flow. 

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>
| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.dynamics365/allEntities/allTasks | Manage all aspects of Dynamics 365. |
| microsoft.flow/allEntities/allTasks | Manage all aspects of Microsoft Flow. |
| microsoft.powerApps/allEntities/allTasks | Manage all aspects of PowerApps. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Privileged Authentication Administrator permissions

Allowed to view, set and reset authentication method information for any user (admin or non-admin).

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/users/invalidateAllRefreshTokens | Invalidate all user refresh tokens in Azure Active Directory. |
| microsoft.directory/users/strongAuthentication/update | Update strong authentication properties like MFA credential information. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.directory/users/password/update | Update passwords for all users in the Office 365 organization. See online documentation for more detail. |

### Privileged Role Administrator permissions

Can manage role assignments in Azure AD,and all aspects of Privileged Identity Management.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.privilegedIdentityManagement/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.aad.privilegedIdentityManagement. |
| microsoft.directory/servicePrincipals/appRoleAssignedTo/allTasks | Read and configure servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/oAuth2PermissionGrants/allTasks | Read and configure servicePrincipals.oAuth2PermissionGrants property in Azure Active Directory. |
| microsoft.directory/administrativeUnits/allProperties/allTasks | Create and manage administrative units (including members) |
| microsoft.directory/roleAssignments/allProperties/allTasks | Create and manage role assignments. |
| microsoft.directory/roleDefinitions/allProperties/allTasks | Create and manage role definitions. |

### Reports Reader permissions

Can read sign-in and audit reports.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/auditLogs/allProperties/read | Read all properties (including privileged properties) on auditLogs in Azure Active Directory. |
| microsoft.directory/signInReports/allProperties/read | Read all properties (including privileged properties) on signInReports in Azure Active Directory. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.usageReports/allEntities/read | Read Office 365 usage reports. |

### Search Administrator permissions

Can create and manage all aspects of Microsoft Search settings.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.office365.messageCenter/messages/read | Read messages in microsoft.office365.messageCenter. |
| microsoft.office365.search/allEntities/allProperties/allTasks | Create and delete all resources, and read and update all properties in microsoft.office365.search. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.office365.usageReports/allEntities/read | Read Office 365 usage reports. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |

### Search Editor permissions

Can create and manage the editorial content such as bookmarks, Q and As, locations, floorplan.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.office365.messageCenter/messages/read | Read messages in microsoft.office365.messageCenter. |
| microsoft.office365.search/content/allProperties/allTasks | Create and delete content, and read and update all properties in microsoft.office365.search. |
| microsoft.office365.usageReports/allEntities/read | Read Office 365 usage reports. |

### Security Administrator permissions

Can read security information and reports,and manage configuration in Azure AD and Office 365.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/applications/policies/update | Update applications.policies property in Azure Active Directory. |
| microsoft.directory/auditLogs/allProperties/read | Read all properties (including privileged properties) on auditLogs in Azure Active Directory. |
| microsoft.directory/devices/bitLockerRecoveryKeys/read | Read devices.bitLockerRecoveryKeys property in Azure Active Directory. |
| microsoft.directory/policies/basic/update | Update basic properties on policies in Azure Active Directory. |
| microsoft.directory/policies/create | Create policies in Azure Active Directory. |
| microsoft.directory/policies/delete | Delete policies in Azure Active Directory. |
| microsoft.directory/policies/owners/update | Update policies.owners property in Azure Active Directory. |
| microsoft.directory/policies/tenantDefault/update | Update policies.tenantDefault property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/policies/update | Update servicePrincipals.policies property in Azure Active Directory. |
| microsoft.directory/signInReports/allProperties/read | Read all properties (including privileged properties) on signInReports in Azure Active Directory. |
| microsoft.aad.identityProtection/allEntities/read | Read all resources in microsoft.aad.identityProtection. |
| microsoft.aad.identityProtection/allEntities/update | Update all resources in microsoft.aad.identityProtection. |
| microsoft.aad.privilegedIdentityManagement/allEntities/read | Read all resources in microsoft.aad.privilegedIdentityManagement. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.protectionCenter/allEntities/read | Read all aspects of Office 365 Protection Center. |
| microsoft.office365.protectionCenter/allEntities/update | Update all resources in microsoft.office365.protectionCenter. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |

### Security Operator permissions

Creates and manages security events.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.aad.cloudAppSecurity/allEntities/allTasks | Read and configure Microsoft Cloud App Security. |
| microsoft.aad.identityProtection/allEntities/read | Read all resources in microsoft.aad.identityProtection. |
| microsoft.aad.privilegedIdentityManagement/allEntities/read | Read all resources in microsoft.aad.privilegedIdentityManagement. |
| microsoft.azure.advancedThreatProtection/allEntities/read | Read and configure Azure AD Advanced Threat Protection. |
| microsoft.intune/allEntities/allTasks | Manage all aspects of Intune. |
| microsoft.office365.securityComplianceCenter/allEntities/allTasks | Read and configure Security & Compliance Center. |
| microsoft.office365.usageReports/allEntities/read | Read Office 365 usage reports. |
| microsoft.windows.defenderAdvancedThreatProtection/allEntities/read | Read and configure Windows Defender Advanced Threat Protection. |

### Security Reader permissions

Can read security information and reports in Azure AD and Office 365.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/auditLogs/allProperties/read | Read all properties (including privileged properties) on auditLogs in Azure Active Directory. |
| microsoft.directory/devices/bitLockerRecoveryKeys/read | Read devices.bitLockerRecoveryKeys property in Azure Active Directory. |
| microsoft.directory/policies/conditionalAccess/basic/read | Read policies.conditionalAccess property in Azure Active Directory. |
| microsoft.directory/signInReports/allProperties/read | Read all properties (including privileged properties) on signInReports in Azure Active Directory. |
| microsoft.aad.identityProtection/allEntities/read | Read all resources in microsoft.aad.identityProtection. |
| microsoft.aad.privilegedIdentityManagement/allEntities/read | Read all resources in microsoft.aad.privilegedIdentityManagement. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.protectionCenter/allEntities/read | Read all aspects of Office 365 Protection Center. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |

### Service Support Administrator permissions

Can read service health information and manage support tickets.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### SharePoint Service Administrator permissions

Can manage all aspects of the SharePoint service.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/groups/unified/appRoleAssignments/update | Update groups.unified property in Azure Active Directory. |
| microsoft.directory/groups/unified/basic/update | Update basic properties of Office 365 Groups. |
| microsoft.directory/groups/unified/create | Create Office 365 Groups. |
| microsoft.directory/groups/unified/delete | Delete Office 365 Groups. |
| microsoft.directory/groups/unified/members/update | Update membership of Office 365 Groups. |
| microsoft.directory/groups/unified/owners/update | Update ownership of Office 365 Groups. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.sharepoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in microsoft.office365.sharepoint. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

### Teams Communications Administrator permissions

Can manage calling and meetings features within the Microsoft Teams service.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.office365.usageReports/allEntities/read | Read Office 365 usage reports. |

### Teams Communications Support Engineer permissions

Can troubleshoot communications issues within Teams using advanced tools.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |

### Teams Communications Support Specialist permissions

Can troubleshoot communications issues within Teams using basic tools.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |

### Teams Service Administrator permissions

Can manage the Microsoft Teams service.

> [!NOTE]
> This role has additional permissions outside of Azure Active Directory. For more information, see role description above.
>
>

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/groups/hiddenMembers/read | Read groups.hiddenMembers property in Azure Active Directory. |
| microsoft.directory/groups/unified/appRoleAssignments/update | Update groups.unified property in Azure Active Directory. |
| microsoft.directory/groups/unified/basic/update | Update basic properties of Office 365 Groups. |
| microsoft.directory/groups/unified/create | Create Office 365 Groups. |
| microsoft.directory/groups/unified/delete | Delete Office 365 Groups. |
| microsoft.directory/groups/unified/members/update | Update membership of Office 365 Groups. |
| microsoft.directory/groups/unified/owners/update | Update ownership of Office 365 Groups. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |
| microsoft.office365.usageReports/allEntities/read | Read Office 365 usage reports. |

### User Administrator permissions
Can manage all aspects of users and groups, including resetting passwords for limited admins.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/appRoleAssignments/create | Create appRoleAssignments in Azure Active Directory. |
| microsoft.directory/appRoleAssignments/delete | Delete appRoleAssignments in Azure Active Directory. |
| microsoft.directory/appRoleAssignments/update | Update appRoleAssignments in Azure Active Directory. |
| microsoft.directory/contacts/basic/update | Update basic properties on contacts in Azure Active Directory. |
| microsoft.directory/contacts/create | Create contacts in Azure Active Directory. |
| microsoft.directory/contacts/delete | Delete contacts in Azure Active Directory. |
| microsoft.directory/groups/appRoleAssignments/update | Update groups.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/groups/basic/update | Update basic properties on groups in Azure Active Directory. |
| microsoft.directory/groups/create | Create groups in Azure Active Directory. |
| microsoft.directory/groups/createAsOwner | Create groups in Azure Active Directory. Creator is added as the first owner, and the created object counts against the creator's 250 created objects quota. |
| microsoft.directory/groups/delete | Delete groups in Azure Active Directory. |
| microsoft.directory/groups/hiddenMembers/read | Read groups.hiddenMembers property in Azure Active Directory. |
| microsoft.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.directory/groups/owners/update | Update groups.owners property in Azure Active Directory. |
| microsoft.directory/groups/restore | Restore groups in Azure Active Directory. |
| microsoft.directory/groups/settings/update | Update groups.settings property in Azure Active Directory. |
| microsoft.directory/users/appRoleAssignments/update | Update users.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/users/assignLicense | Manage licenses on users in Azure Active Directory. |
| microsoft.directory/users/basic/update | Update basic properties on users in Azure Active Directory. |
| microsoft.directory/users/create | Create users in Azure Active Directory. |
| microsoft.directory/users/delete | Delete users in Azure Active Directory. |
| microsoft.directory/users/invalidateAllRefreshTokens | Invalidate all user refresh tokens in Azure Active Directory. |
| microsoft.directory/users/manager/update | Update users.manager property in Azure Active Directory. |
| microsoft.directory/users/password/update | Update passwords for all users in Azure Active Directory. See online documentation for more detail. |
| microsoft.directory/users/restore | Restore deleted users in Azure Active Directory. |
| microsoft.directory/users/userPrincipalName/update | Update users.userPrincipalName property in Azure Active Directory. |
| microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health. |
| microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets. |
| microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in microsoft.office365.webPortal. |
| microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Office 365 Service Health. |
| microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Office 365 support tickets. |

## Role template IDs

Role template IDs are used mainly by Graph API or PowerShell users.

Graph displayName | Azure portal display name | directoryRoleTemplateId
----------------- | ------------------------- | -------------------------
Application Administrator | Application administrator | 9B895D92-2CD3-44C7-9D02-A6AC2D5EA5C3
Application Developer | Application developer | CF1C38E5-3621-4004-A7CB-879624DCED7C
Authentication Administrator | Authentication administrator | c4e39bd9-1100-46d3-8c65-fb160da0071f
Azure DevOps Administrator | Azure DevOps administrator | e3973bdf-4987-49ae-837a-ba8e231c7286
Azure Information Protection Administrator | Azure Information Protection administrator | 7495fdc4-34c4-4d15-a289-98788ce399fd
B2C User flow Administrator | B2C User flow Administrator | 6e591065-9bad-43ed-90f3-e9424366d2f0
B2C User Flow Attribute Administrator | B2C User Flow Attribute Administrator | 0f971eea-41eb-4569-a71e-57bb8a3eff1e
B2C IEF Keyset Administrator | B2C IEF Keyset Administrator | aaf43236-0c0d-4d5f-883a-6955382ac081
B2C IEF Policy Administrator | B2C IEF Policy Administrator | 3edaf663-341e-4475-9f94-5c398ef6c070
Billing Administrator | Billing administrator | b0f54661-2d74-4c50-afa3-1ec803f12efe
Cloud Application Administrator | Cloud application administrator | 158c047a-c907-4556-b7ef-446551a6b5f7
Cloud Device Administrator | Cloud device administrator | 7698a772-787b-4ac8-901f-60d6b08affd2
Company Administrator | Global administrator | 62e90394-69f5-4237-9190-012177145e10
Compliance Administrator | Compliance administrator | 17315797-102d-40b4-93e0-432062caca18
Compliance Data Administrator | Compliance data administrator | e6d1a23a-da11-4be4-9570-befc86d067a7
Conditional Access Administrator | Conditional Access administrator | b1be1c3e-b65d-4f19-8427-f6fa0d97feb9
CRM Service Administrator | Dynamics 365 administrator | 44367163-eba1-44c3-98af-f5787879f96a
Customer LockBox Access Approver | Customer Lockbox access approver | 5c4f9dcd-47dc-4cf7-8c9a-9e4207cbfc91
Desktop Analytics Administrator | Desktop Analytics Administrator | 38a96431-2bdf-4b4c-8b6e-5d3d8abac1a4
Device Administrators | Device administrators | 9f06204d-73c1-4d4c-880a-6edb90606fd8
Device Join | Device join | 9c094953-4995-41c8-84c8-3ebb9b32c93f
Device Managers | Device managers | 2b499bcd-da44-4968-8aec-78e1674fa64d
Device Users | Device users | d405c6df-0af8-4e3b-95e4-4d06e542189e
Directory Readers | Directory readers | 88d8e3e3-8f55-4a1e-953a-9b9898b8876b
Directory Synchronization Accounts | Directory synchronization accounts | d29b2b05-8046-44ba-8758-1e26182fcf32
Directory Writers | Directory writers | 9360feb5-f418-4baa-8175-e2a00bac4301
Exchange Service Administrator | Exchange administrator | 29232cdf-9323-42fd-ade2-1d097af3e4de
External Identity Provider Administrator | External Identity Provider Administrator | be2f45a1-457d-42af-a067-6ec1fa63bc45
Global Reader | Global reader | f2ef992c-3afb-46b9-b7cf-a126ee74c451
Group Administrator | Group administrator | fdd7a751-b60b-444a-984c-02652fe8fa1c 
Guest Inviter | Guest inviter | 95e79109-95c0-4d8e-aee3-d01accf2d47b
Helpdesk Administrator | Password administrator | 729827e3-9c14-49f7-bb1b-9608f156bbb8
Intune Service Administrator | Intune administrator | 3a2c62db-5318-420d-8d74-23affee5d9d5
Kaizala Administrator | Kaizala administrator | 74ef975b-6605-40af-a5d2-b9539d836353
License Administrator | License administrator | 4d6ac14f-3453-41d0-bef9-a3e0c569773a
Lync Service Administrator | Skype for Business administrator | 75941009-915a-4869-abe7-691bff18279e
Message Center Privacy Reader | Message center privacy reader | ac16e43d-7b2d-40e0-ac05-243ff356ab5b
Message Center Reader | Message center reader | 790c1fb9-7f7d-4f88-86a1-ef1f95c05c1b
Office Apps Administrator | Office apps administrator | 2b745bdf-0803-4d80-aa65-822c4493daac
Partner Tier1 Support | Partner tier1 support | 4ba39ca4-527c-499a-b93d-d9b492c50246
Partner Tier2 Support | Partner tier2 support | e00e864a-17c5-4a4b-9c06-f5b95a8d5bd8
Password Administrator | Password administrator | 966707d0-3269-4727-9be2-8c3a10f19b9d
Power BI Service Administrator | Power BI administrator | a9ea8996-122f-4c74-9520-8edcd192826c
Power Platform Administrator | Power platform administrator | 11648597-926c-4cf3-9c36-bcebb0ba8dcc
Privileged Authentication Administrator | Privileged authentication administrator | 7be44c8a-adaf-4e2a-84d6-ab2649e08a13
Privileged Role Administrator | Privileged role administrator | e8611ab8-c189-46e8-94e1-60213ab1f814
Reports Reader | Reports reader | 4a5d8f65-41da-4de4-8968-e035b65339cf
Search Administrator | Search administrator | 0964bb5e-9bdb-4d7b-ac29-58e794862a40
Search Editor | Search editor | 8835291a-918c-4fd7-a9ce-faa49f0cf7d9
Security Administrator | Security administrator | 194ae4cb-b126-40b2-bd5b-6091b380977d
Security Operator | Security operator | 5f2222b1-57c3-48ba-8ad5-d4759f1fde6f
Security Reader | Security reader | 5d6b6bb7-de71-4623-b4af-96380a352509
Service Support Administrator | Service administrator | f023fd81-a637-4b56-95fd-791ac0226033
SharePoint Service Administrator | SharePoint administrator | f28a1f50-f6e7-4571-818b-6a12f2af6b6c
Teams Communications Administrator | Teams Communications Administrator | baf37b3a-610e-45da-9e62-d9d1e5e8914b
Teams Communications Support Engineer | Teams Communications Support Engineer | f70938a0-fc10-4177-9e90-2178f8765737
Teams Communications Support Specialist | Teams Communications Support Specialist | fcf91098-03e3-41a9-b5ba-6f0ec8188a12
Teams Service Administrator | Teams Service Administrator | 69091246-20e8-4a56-aa4d-066075b2a7a8
User | User | a0b1b346-4d3e-4e8b-98f8-753987be4970
User Account Administrator | User administrator | fe930be7-5e62-47db-91af-98c3a49a38b1
Workplace Device Join | Workplace device join | c34f683f-4d5a-4403-affd-6615e00e3a7f

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
