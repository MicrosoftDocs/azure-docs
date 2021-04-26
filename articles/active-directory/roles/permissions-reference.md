---
title: Azure AD built-in roles - Azure Active Directory
description: Describes the Azure Active Directory built-in roles and permissions.
services: active-directory
author: rolyon
manager: daveba
search.appverid: MET150
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: reference
ms.date: 04/20/2021
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro, fasttrack-edit
ms.collection: M365-identity-device-management
---

# Azure AD built-in roles

In Azure Active Directory (Azure AD), if another administrator or non-administrator needs to manage Azure AD resources, you assign them an Azure AD role that provides the permissions they need. For example, you can assign roles to allow adding or changing users, resetting user passwords, managing user licenses, or managing domain names.

This article lists the Azure AD built-in roles you can assign to allow management of Azure AD resources. For information about how to assign roles, see [Assign Azure AD roles to users](manage-roles-portal.md).

## All roles

> [!div class="mx-tableFixed"]
> | Role | Description | Template ID |
> | --- | --- | --- |
> | [Application Administrator](#application-administrator) | Can create and manage all aspects of app registrations and enterprise apps. | 9b895d92-2cd3-44c7-9d02-a6ac2d5ea5c3 |
> | [Application Developer](#application-developer) | Can create application registrations independent of the 'Users can register applications' setting. | cf1c38e5-3621-4004-a7cb-879624dced7c |
> | [Attack Payload Author](#attack-payload-author) | Can create attack payloads that an administrator can initiate later. | 9c6df0f2-1e7c-4dc3-b195-66dfbd24aa8f |
> | [Attack Simulation Administrator](#attack-simulation-administrator) | Can create and manage all aspects of attack simulation campaigns. | c430b396-e693-46cc-96f3-db01bf8bb62a |
> | [Authentication Administrator](#authentication-administrator) | Can access to view, set and reset authentication method information for any non-admin user. | c4e39bd9-1100-46d3-8c65-fb160da0071f |
> | [Authentication Policy Administrator](#authentication-policy-administrator) | Can create and manage all aspects of authentication methods and password protection policies. | 0526716b-113d-4c15-b2c8-68e3c22b9f80 |
> | [Azure AD Joined Device Local Administrator](#azure-ad-joined-device-local-administrator) | Users assigned to this role are added to the local administrators group on Azure AD-joined devices. | 9f06204d-73c1-4d4c-880a-6edb90606fd8 |
> | [Azure DevOps Administrator](#azure-devops-administrator) | Can manage Azure DevOps organization policy and settings. | e3973bdf-4987-49ae-837a-ba8e231c7286 |
> | [Azure Information Protection Administrator](#azure-information-protection-administrator) | Can manage all aspects of the Azure Information Protection product. | 7495fdc4-34c4-4d15-a289-98788ce399fd |
> | [B2C IEF Keyset Administrator](#b2c-ief-keyset-administrator) | Can manage secrets for federation and encryption in the Identity Experience Framework (IEF). | aaf43236-0c0d-4d5f-883a-6955382ac081 |
> | [B2C IEF Policy Administrator](#b2c-ief-policy-administrator) | Can create and manage trust framework policies in the Identity Experience Framework (IEF). | 3edaf663-341e-4475-9f94-5c398ef6c070 |
> | [Billing Administrator](#billing-administrator) | Can perform common billing related tasks like updating payment information. | b0f54661-2d74-4c50-afa3-1ec803f12efe |
> | [Cloud Application Administrator](#cloud-application-administrator) | Can create and manage all aspects of app registrations and enterprise apps except App Proxy. | 158c047a-c907-4556-b7ef-446551a6b5f7 |
> | [Cloud Device Administrator](#cloud-device-administrator) | Limited access to manage devices in Azure AD. | 7698a772-787b-4ac8-901f-60d6b08affd2 |
> | [Compliance Administrator](#compliance-administrator) | Can read and manage compliance configuration and reports in Azure AD and Microsoft 365. | 17315797-102d-40b4-93e0-432062caca18 |
> | [Compliance Data Administrator](#compliance-data-administrator) | Creates and manages compliance content. | e6d1a23a-da11-4be4-9570-befc86d067a7 |
> | [Conditional Access Administrator](#conditional-access-administrator) | Can manage Conditional Access capabilities. | b1be1c3e-b65d-4f19-8427-f6fa0d97feb9 |
> | [Customer LockBox Access Approver](#customer-lockbox-access-approver) | Can approve Microsoft support requests to access customer organizational data. | 5c4f9dcd-47dc-4cf7-8c9a-9e4207cbfc91 |
> | [Desktop Analytics Administrator](#desktop-analytics-administrator) | Can access and manage Desktop management tools and services. | 38a96431-2bdf-4b4c-8b6e-5d3d8abac1a4 |
> | [Directory Readers](#directory-readers) | Can read basic directory information. Commonly used to grant directory read access to applications and guests. | 88d8e3e3-8f55-4a1e-953a-9b9898b8876b |
> | [Directory Synchronization Accounts](#directory-synchronization-accounts) | Only used by Azure AD Connect service. | d29b2b05-8046-44ba-8758-1e26182fcf32 |
> | [Directory Writers](#directory-writers) | Can read and write basic directory information. For granting access to applications, not intended for users. | 9360feb5-f418-4baa-8175-e2a00bac4301 |
> | [Domain Name Administrator](#domain-name-administrator) | Can manage domain names in cloud and on-premises. | 8329153b-31d0-4727-b945-745eb3bc5f31 |
> | [Dynamics 365 Administrator](#dynamics-365-administrator) | Can manage all aspects of the Dynamics 365 product. | 44367163-eba1-44c3-98af-f5787879f96a |
> | [Exchange Administrator](#exchange-administrator) | Can manage all aspects of the Exchange product. | 29232cdf-9323-42fd-ade2-1d097af3e4de |
> | [Exchange Recipient Administrator](#exchange-recipient-administrator) | Can create or update Exchange Online recipients within the Exchange Online organization. | 31392ffb-586c-42d1-9346-e59415a2cc4e |
> | [External ID User Flow Administrator](#external-id-user-flow-administrator) | Can create and manage all aspects of user flows. | 6e591065-9bad-43ed-90f3-e9424366d2f0 |
> | [External ID User Flow Attribute Administrator](#external-id-user-flow-attribute-administrator) | Can create and manage the attribute schema available to all user flows. | 0f971eea-41eb-4569-a71e-57bb8a3eff1e |
> | [External Identity Provider Administrator](#external-identity-provider-administrator) | Can configure identity providers for use in direct federation. | be2f45a1-457d-42af-a067-6ec1fa63bc45 |
> | [Global Administrator](#global-administrator) | Can manage all aspects of Azure AD and Microsoft services that use Azure AD identities. | 62e90394-69f5-4237-9190-012177145e10 |
> | [Global Reader](#global-reader) | Can read everything that a Global Administrator can, but not update anything. | f2ef992c-3afb-46b9-b7cf-a126ee74c451 |
> | [Groups Administrator](#groups-administrator) | Members of this role can create/manage groups, create/manage groups settings like naming and expiration policies, and view groups activity and audit reports. | fdd7a751-b60b-444a-984c-02652fe8fa1c |
> | [Guest Inviter](#guest-inviter) | Can invite guest users independent of the 'members can invite guests' setting. | 95e79109-95c0-4d8e-aee3-d01accf2d47b |
> | [Helpdesk Administrator](#helpdesk-administrator) | Can reset passwords for non-administrators and Helpdesk Administrators. | 729827e3-9c14-49f7-bb1b-9608f156bbb8 |
> | [Hybrid Identity Administrator](#hybrid-identity-administrator) | Can manage AD to Azure AD cloud provisioning, Azure AD Connect, and federation settings. | 8ac3fc64-6eca-42ea-9e69-59f4c7b60eb2 |
> | [Insights Administrator](#insights-administrator) | Has administrative access in the Microsoft 365 Insights app. | eb1f4a8d-243a-41f0-9fbd-c7cdf6c5ef7c |
> | [Insights Business Leader](#insights-business-leader) | Can view and share dashboards and insights via the M365 Insights app. | 31e939ad-9672-4796-9c2e-873181342d2d |
> | [Intune Administrator](#intune-administrator) | Can manage all aspects of the Intune product. | 3a2c62db-5318-420d-8d74-23affee5d9d5 |
> | [Kaizala Administrator](#kaizala-administrator) | Can manage settings for Microsoft Kaizala. | 74ef975b-6605-40af-a5d2-b9539d836353 |
> | [Knowledge Administrator](#knowledge-administrator) | Can configure knowledge, learning, and other intelligent features. | b5a8dcf3-09d5-43a9-a639-8e29ef291470 |
> | [License Administrator](#license-administrator) | Can manage product licenses on users and groups. | 4d6ac14f-3453-41d0-bef9-a3e0c569773a |
> | [Message Center Privacy Reader](#message-center-privacy-reader) | Can read security messages and updates in Office 365 Message Center only. | ac16e43d-7b2d-40e0-ac05-243ff356ab5b |
> | [Message Center Reader](#message-center-reader) | Can read messages and updates for their organization in Office 365 Message Center only. | 790c1fb9-7f7d-4f88-86a1-ef1f95c05c1b |
> | [Modern Commerce User](#modern-commerce-user) | Can manage commercial purchases for a company, department or team. | d24aef57-1500-4070-84db-2666f29cf966 |
> | [Network Administrator](#network-administrator) | Can manage network locations and review enterprise network design insights for Microsoft 365 Software as a Service applications. | d37c8bed-0711-4417-ba38-b4abe66ce4c2 |
> | [Office Apps Administrator](#office-apps-administrator) | Can manage Office apps cloud services, including policy and settings management, and manage the ability to select, unselect and publish 'what's new' feature content to end-user's devices. | 2b745bdf-0803-4d80-aa65-822c4493daac |
> | [Partner Tier1 Support](#partner-tier1-support) | Do not use - not intended for general use. | 4ba39ca4-527c-499a-b93d-d9b492c50246 |
> | [Partner Tier2 Support](#partner-tier2-support) | Do not use - not intended for general use. | e00e864a-17c5-4a4b-9c06-f5b95a8d5bd8 |
> | [Password Administrator](#password-administrator) | Can reset passwords for non-administrators and Password Administrators. | 966707d0-3269-4727-9be2-8c3a10f19b9d |
> | [Power BI Administrator](#power-bi-administrator) | Can manage all aspects of the Power BI product. | a9ea8996-122f-4c74-9520-8edcd192826c |
> | [Power Platform Administrator](#power-platform-administrator) | Can create and manage all aspects of Microsoft Dynamics 365, PowerApps and Microsoft Flow. | 11648597-926c-4cf3-9c36-bcebb0ba8dcc |
> | [Printer Administrator](#printer-administrator) | Can manage all aspects of printers and printer connectors. | 644ef478-e28f-4e28-b9dc-3fdde9aa0b1f |
> | [Printer Technician](#printer-technician) | Can register and unregister printers and update printer status. | e8cef6f1-e4bd-4ea8-bc07-4b8d950f4477 |
> | [Privileged Authentication Administrator](#privileged-authentication-administrator) | Can access to view, set and reset authentication method information for any user (admin or non-admin). | 7be44c8a-adaf-4e2a-84d6-ab2649e08a13 |
> | [Privileged Role Administrator](#privileged-role-administrator) | Can manage role assignments in Azure AD, and all aspects of Privileged Identity Management. | e8611ab8-c189-46e8-94e1-60213ab1f814 |
> | [Reports Reader](#reports-reader) | Can read sign-in and audit reports. | 4a5d8f65-41da-4de4-8968-e035b65339cf |
> | [Search Administrator](#search-administrator) | Can create and manage all aspects of Microsoft Search settings. | 0964bb5e-9bdb-4d7b-ac29-58e794862a40 |
> | [Search Editor](#search-editor) | Can create and manage the editorial content such as bookmarks, Q and As, locations, floorplan. | 8835291a-918c-4fd7-a9ce-faa49f0cf7d9 |
> | [Security Administrator](#security-administrator) | Can read security information and reports, and manage configuration in Azure AD and Office 365. | 194ae4cb-b126-40b2-bd5b-6091b380977d |
> | [Security Operator](#security-operator) | Creates and manages security events. | 5f2222b1-57c3-48ba-8ad5-d4759f1fde6f |
> | [Security Reader](#security-reader) | Can read security information and reports in Azure AD and Office 365. | 5d6b6bb7-de71-4623-b4af-96380a352509 |
> | [Service Support Administrator](#service-support-administrator) | Can read service health information and manage support tickets. | f023fd81-a637-4b56-95fd-791ac0226033 |
> | [SharePoint Administrator](#sharepoint-administrator) | Can manage all aspects of the SharePoint service. | f28a1f50-f6e7-4571-818b-6a12f2af6b6c |
> | [Skype for Business Administrator](#skype-for-business-administrator) | Can manage all aspects of the Skype for Business product. | 75941009-915a-4869-abe7-691bff18279e |
> | [Teams Administrator](#teams-administrator) | Can manage the Microsoft Teams service. | 69091246-20e8-4a56-aa4d-066075b2a7a8 |
> | [Teams Communications Administrator](#teams-communications-administrator) | Can manage calling and meetings features within the Microsoft Teams service. | baf37b3a-610e-45da-9e62-d9d1e5e8914b |
> | [Teams Communications Support Engineer](#teams-communications-support-engineer) | Can troubleshoot communications issues within Teams using advanced tools. | f70938a0-fc10-4177-9e90-2178f8765737 |
> | [Teams Communications Support Specialist](#teams-communications-support-specialist) | Can troubleshoot communications issues within Teams using basic tools. | fcf91098-03e3-41a9-b5ba-6f0ec8188a12 |
> | [Teams Devices Administrator](#teams-devices-administrator) | Can perform management related tasks on Teams certified devices. | 3d762c5a-1b6c-493f-843e-55a3b42923d4 |
> | [Usage Summary Reports Reader](#usage-summary-reports-reader) | Can see only tenant level aggregates in Microsoft 365 Usage Analytics and Productivity Score. | 75934031-6c7e-415a-99d7-48dbd49e875e |
> | [User Administrator](#user-administrator) | Can manage all aspects of users and groups, including resetting passwords for limited admins. | fe930be7-5e62-47db-91af-98c3a49a38b1 |

## Application Administrator

Users in this role can create and manage all aspects of enterprise applications, application registrations, and application proxy settings. Note that users assigned to this role are not added as owners when creating new application registrations or enterprise applications.

This role also grants the ability to consent for delegated permissions and application permissions, with the exception of application permissions for both Microsoft Graph and Azure AD Graph.

> [!IMPORTANT]
> This exception means that you can still consent to application permissions for _other_ apps (for example, non-Microsoft apps or apps that you have registered). You can still _request_ these permissions as part of the app registration, but _granting_ (that is, consenting to) these permissions requires a more privileged administrator, such as Global Administrator.
>
>This role grants the ability to manage application credentials. Users assigned this role can add credentials to an application, and use those credentials to impersonate the application’s identity. If the application’s identity has been granted access to a resource, such as the ability to create or update User or other objects, then a user assigned to this role could perform those actions while impersonating the application. This ability to impersonate the application’s identity may be an elevation of privilege over what the user can do via their role assignments. It is important to understand that assigning a user to the Application Administrator role gives them the ability to impersonate an application’s identity.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/create | Create all types of applications |
> | microsoft.directory/applications/delete | Delete all types of applications |
> | microsoft.directory/applications/applicationProxy/read | Read all application proxy properties |
> | microsoft.directory/applications/applicationProxy/update | Update all application proxy properties |
> | microsoft.directory/applications/applicationProxyAuthentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/applicationProxySslCertificate/update | Update SSL certificate settings for application proxy |
> | microsoft.directory/applications/applicationProxyUrlSettings/update | Update URL settings for application proxy |
> | microsoft.directory/applications/appRoles/update | Update the appRoles property on all types of applications |
> | microsoft.directory/applications/audience/update | Update the audience property for applications |
> | microsoft.directory/applications/authentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/basic/update | Update basic properties for applications |
> | microsoft.directory/applications/credentials/update | Update application credentials |
> | microsoft.directory/applications/owners/update | Update owners of applications |
> | microsoft.directory/applications/permissions/update | Update exposed permissions and required permissions on all types of applications |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/applications/verification/update | Update applicationsverification property |
> | microsoft.directory/applications/synchronization/standard/read | Read provisioning settings associated with the application object |
> | microsoft.directory/applicationTemplates/instantiate | Instantiate gallery applications from application templates |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, including privileged properties |
> | microsoft.directory/connectors/create | Create application proxy connectors |
> | microsoft.directory/connectors/allProperties/read | Read all properties of application proxy connectors |
> | microsoft.directory/connectorGroups/create | Create application proxy connector groups |
> | microsoft.directory/connectorGroups/delete | Delete application proxy connector groups |
> | microsoft.directory/connectorGroups/allProperties/read | Read all properties of application proxy connector groups |
> | microsoft.directory/connectorGroups/allProperties/update | Update all properties of application proxy connector groups |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties |
> | microsoft.directory/applicationPolicies/create | Create application policies |
> | microsoft.directory/applicationPolicies/delete | Delete application policies |
> | microsoft.directory/applicationPolicies/standard/read | Read standard properties of application policies |
> | microsoft.directory/applicationPolicies/owners/read | Read owners on application policies |
> | microsoft.directory/applicationPolicies/policyAppliedTo/read | Read application policies applied to objects list |
> | microsoft.directory/applicationPolicies/basic/update | Update standard properties of application policies |
> | microsoft.directory/applicationPolicies/owners/update | Update the owner property of application policies |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/servicePrincipals/create | Create service principals |
> | microsoft.directory/servicePrincipals/delete | Delete service principals |
> | microsoft.directory/servicePrincipals/disable | Disable service principals |
> | microsoft.directory/servicePrincipals/enable | Enable service principals |
> | microsoft.directory/servicePrincipals/getPasswordSingleSignOnCredentials | Manage password single sign-on credentials on service principals |
> | microsoft.directory/servicePrincipals/synchronizationCredentials/manage | Manage application provisioning secrets and credentials |
> | microsoft.directory/servicePrincipals/synchronizationJobs/manage | Start, restart, and pause application provisioning syncronization jobs |
> | microsoft.directory/servicePrincipals/synchronizationSchema/manage | Create and manage application provisioning syncronization jobs and schema |
> | microsoft.directory/servicePrincipals/managePasswordSingleSignOnCredentials | Read password single sign-on credentials on service principals |
> | microsoft.directory/servicePrincipals/managePermissionGrantsForAll.microsoft-application-admin | Grant consent for application permissions and delegated permissions on behalf of any user or all users, except for application permissions for Microsoft Graph and Azure AD Graph |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/servicePrincipals/audience/update | Update audience properties on service principals |
> | microsoft.directory/servicePrincipals/authentication/update | Update authentication properties on service principals |
> | microsoft.directory/servicePrincipals/basic/update | Update basic properties on service principals |
> | microsoft.directory/servicePrincipals/credentials/update | Update credentials of service principals |
> | microsoft.directory/servicePrincipals/owners/update | Update owners of service principals |
> | microsoft.directory/servicePrincipals/permissions/update | Update permissions of service principals |
> | microsoft.directory/servicePrincipals/policies/update | Update policies of service principals |
> | microsoft.directory/servicePrincipals/tag/update | Update the tag property for service principals |
> | microsoft.directory/servicePrincipals/synchronization/standard/read | Read provisioning settings associated with your service principal |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Application Developer

Users in this role can create application registrations when the "Users can register applications" setting is set to No. This role also grants permission to consent on one's own behalf when the "Users can consent to apps accessing company data on their behalf" setting is set to No. Users assigned to this role are added as owners when creating new application registrations or enterprise applications.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/createAsOwner | Create all types of applications, and creator is added as the first owner |
> | microsoft.directory/appRoleAssignments/createAsOwner | Create application role assignments, with creator as the first owner |
> | microsoft.directory/oAuth2PermissionGrants/createAsOwner | Create OAuth 2.0 permission grants, with creator as the first owner |
> | microsoft.directory/servicePrincipals/createAsOwner | Create service principals, with creator as the first owner |

## Attack Payload Author

Users in this role can create attack payloads but not actually launch or schedule them. Attack payloads are then available to all administrators in the tenant who can use them to create a simulation.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.protectionCenter/attackSimulator/payload/allProperties/allTasks | Create and manage attack payloads in Attack Simulator |
> | microsoft.office365.protectionCenter/attackSimulator/reports/allProperties/read | Read reports of attack simulation responses and associated training |

## Attack Simulation Administrator

Users in this role can create and manage all aspects of attack simulation creation, launch/scheduling of a simulation, and the review of simulation results. Members of this role have this access for all simulations in the tenant.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.protectionCenter/attackSimulator/payload/allProperties/allTasks | Create and manage attack payloads in Attack Simulator |
> | microsoft.office365.protectionCenter/attackSimulator/reports/allProperties/read | Read reports of attack simulation responses and associated training |
> | microsoft.office365.protectionCenter/attackSimulator/simulation/allProperties/allTasks | Create and manage attack simulation templates in Attack Simulator |

## Authentication Administrator

Users with this role can set or reset any authentication method (including passwords) for non-administrators and some roles. Authentication administrators can require users who are non-administrators or assigned to some roles to re-register against existing non-password credentials (for example, MFA or FIDO), and can also revoke **remember MFA on the device**, which prompts for MFA on the next sign-in. For a list of the roles that an Authentication Administrator can read or update authentication methods, see [Password reset permissions](#password-reset-permissions).

The [Privileged authentication administrator](#privileged-authentication-administrator) role has permission to force re-registration and multi-factor authentication for all users.

The [Authentication policy administrator](#authentication-policy-administrator) role has permissions to set the tenant's authentication method policy that determines which methods each user can register and use.

| Role | Manage user's auth methods | Manage per-user MFA | Manage MFA settings | Manage auth method policy | Manage password protection policy |
| ---- | ---- | ---- | ---- | ---- | ---- |
| Authentication administrator | Yes for some users (see above) | Yes for some users (see above) | No | No | No |
| Privileged authentication administrator| Yes for all users | Yes for all users | No | No | No |
| Authentication policy administrator | No |No | Yes | Yes | Yes |

> [!IMPORTANT]
> Users with this role can change credentials for people who may have access to sensitive or private information or critical configuration inside and outside of Azure Active Directory. Changing the credentials of a user may mean the ability to assume that user's identity and permissions. For example:
>
>* Application Registration and Enterprise Application owners, who can manage credentials of apps they own. Those apps may have privileged permissions in Azure AD and elsewhere not granted to Authentication Administrators. Through this path an Authentication Administrator can assume the identity of an application owner and then further assume the identity of a privileged application by updating the credentials for the application.
>* Azure subscription owners, who may have access to sensitive or private information or critical configuration in Azure.
>* Security Group and Microsoft 365 group owners, who can manage group membership. Those groups may grant access to sensitive or private information or critical configuration in Azure AD and elsewhere.
>* Administrators in other services outside of Azure AD like Exchange Online, Office Security and Compliance Center, and human resources systems.
>* Non-administrators like executives, legal counsel, and human resources employees who may have access to sensitive or private information.

> [!IMPORTANT]
> This role can't manage MFA settings in the legacy MFA management portal or Hardware OATH tokens. The same functions can be accomplished using the [Set-MsolUser](/powershell/module/msonline/set-msoluser) commandlet Azure AD Powershell module.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens |
> | microsoft.directory/users/strongAuthentication/update | Update the strong authentication property for users |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Authentication Policy Administrator

Users with this role can configure the authentication methods policy, tenant-wide MFA settings, and password protection policy. This role grants permission to manage Password Protection settings: smart lockout configurations and updating the custom banned passwords list.

The [Authentication administrator](#authentication-administrator) and [Privileged authentication administrator](#privileged-authentication-administrator) roles have permission to manage registered authentication methods on users and can force re-registration and multi-factor authentication for all users.

| Role | Manage user's auth methods | Manage per-user MFA | Manage MFA settings | Manage auth method policy | Manage password protection policy |
| ---- | ---- | ---- | ---- | ---- | ---- |
| Authentication administrator | Yes for some users (see above) | Yes for some users (see above) | No | No | No |
| Privileged authentication administrator| Yes for all users | Yes for all users | No | No | No |
| Authentication policy administrator | No | No | Yes | Yes | Yes |

> [!IMPORTANT]
> This role can't manage MFA settings in the legacy MFA management portal or Hardware OATH tokens.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/organization/strongAuthentication/update | Update strong auth properties of an organization |
> | microsoft.directory/userCredentialPolicies/create | Create credential policies for users |
> | microsoft.directory/userCredentialPolicies/delete | Delete credential policies for users |
> | microsoft.directory/userCredentialPolicies/standard/read | Read standard properties of credential policies for users |
> | microsoft.directory/userCredentialPolicies/owners/read | Read owners of credential policies for users |
> | microsoft.directory/userCredentialPolicies/policyAppliedTo/read | Read policy.appliesTo navigation link |
> | microsoft.directory/userCredentialPolicies/basic/update | Update basic policies for users |
> | microsoft.directory/userCredentialPolicies/owners/update | Update owners of credential policies for users |
> | microsoft.directory/userCredentialPolicies/tenantDefault/update | Update policy.isOrganizationDefault property |

## Azure AD Joined Device Local Administrator

This role is available for assignment only as an additional local administrator in [Device settings](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/DevicesMenuBlade/DeviceSettings/menuId/). Users with this role become local machine administrators on all Windows 10 devices that are joined to Azure Active Directory. They do not have the ability to manage devices objects in Azure Active Directory.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groupSettings/standard/read | Read basic properties on group settings |
> | microsoft.directory/groupSettingTemplates/standard/read | Read basic properties on group setting templates |

## Azure DevOps Administrator

Users with this role can manage the Azure DevOps policy to restrict new Azure DevOps organization creation to a set of configurable users or groups. Users in this role can manage this policy through any Azure DevOps organization that is backed by the company's Azure AD organization. This role grants no other Azure DevOps-specific permissions (for example, Project Collection Administrators) inside any of the Azure DevOps organizations backed by the company's Azure AD organization.

All enterprise Azure DevOps policies can be managed by users in this role.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.devOps/allEntities/allTasks | Read and configure Azure DevOps |

## Azure Information Protection Administrator

Users with this role have all permissions in the Azure Information Protection service. This role allows configuring labels for the Azure Information Protection policy, managing protection templates, and activating protection. This role does not grant any permissions in Identity Protection Center, Privileged Identity Management, Monitor Microsoft 365 Service Health, or Office 365 Security & Compliance Center.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.informationProtection/allEntities/allTasks | Manage all aspects of Azure Information Protection |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## B2C IEF Keyset Administrator

User can create and manage policy keys and secrets for token encryption, token signatures, and claim encryption/decryption. By adding new keys to existing key containers, this limited administrator can rollover secrets as needed without impacting existing applications. This user can see the full content of these secrets and their expiration dates even after their creation.

> [!IMPORTANT]
> This is a sensitive role. The keyset administrator role should be carefully audited and assigned with care during pre-production and production.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/b2cTrustFrameworkKeySet/allProperties/allTasks | Read and update all properties of authorization policies |

## B2C IEF Policy Administrator

Users in this role have the ability to create, read, update, and delete all custom policies in Azure AD B2C and therefore have full control over the Identity Experience Framework in the relevant Azure AD B2C organization. By editing policies, this user can establish direct federation with external identity providers, change the directory schema, change all user-facing content (HTML, CSS, JavaScript), change the requirements to complete an authentication, create new users, send user data to external systems including full migrations, and edit all user information including sensitive fields like passwords and phone numbers. Conversely, this role cannot change the encryption keys or edit the secrets used for federation in the organization.

> [!IMPORTANT]
> The B2 IEF Policy Administrator is a highly sensitive role which should be assigned on a very limited basis for organizations in production. Activities by these users should be closely audited, especially for organizations in production.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/b2cTrustFrameworkPolicy/allProperties/allTasks | Read and configure key sets in Azure Active Directory B2C |

## Billing Administrator

Makes purchases, manages subscriptions, manages support tickets, and monitors service health.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/organization/basic/update | Update basic properties on organization |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.commerce.billing/allEntities/allTasks | Manage all aspects of Office 365 billing |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Cloud Application Administrator

Users in this role have the same permissions as the Application Administrator role, excluding the ability to manage application proxy. This role grants the ability to create and manage all aspects of enterprise applications and application registrations. Users assigned to this role are not added as owners when creating new application registrations or enterprise applications.

This role also grants the ability to consent for delegated permissions and application permissions, with the exception of application permissions for both Microsoft Graph and Azure AD Graph.

> [!IMPORTANT]
> This exception means that you can still consent to application permissions for _other_ apps (for example, non-Microsoft apps or apps that you have registered). You can still _request_ these permissions as part of the app registration, but _granting_ (that is, consenting to) these permissions requires a more privileged administrator, such as Global Administrator.
>
>This role grants the ability to manage application credentials. Users assigned this role can add credentials to an application, and use those credentials to impersonate the application’s identity. If the application’s identity has been granted access to a resource, such as the ability to create or update User or other objects, then a user assigned to this role could perform those actions while impersonating the application. This ability to impersonate the application’s identity may be an elevation of privilege over what the user can do via their role assignments. It is important to understand that assigning a user to the Application Administrator role gives them the ability to impersonate an application’s identity.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/create | Create all types of applications |
> | microsoft.directory/applications/delete | Delete all types of applications |
> | microsoft.directory/applications/appRoles/update | Update the appRoles property on all types of applications |
> | microsoft.directory/applications/audience/update | Update the audience property for applications |
> | microsoft.directory/applications/authentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/basic/update | Update basic properties for applications |
> | microsoft.directory/applications/credentials/update | Update application credentials |
> | microsoft.directory/applications/owners/update | Update owners of applications |
> | microsoft.directory/applications/permissions/update | Update exposed permissions and required permissions on all types of applications |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/applications/verification/update | Update applicationsverification property |
> | microsoft.directory/applications/synchronization/standard/read | Read provisioning settings associated with the application object |
> | microsoft.directory/applicationTemplates/instantiate | Instantiate gallery applications from application templates |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, including privileged properties |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties |
> | microsoft.directory/applicationPolicies/create | Create application policies |
> | microsoft.directory/applicationPolicies/delete | Delete application policies |
> | microsoft.directory/applicationPolicies/standard/read | Read standard properties of application policies |
> | microsoft.directory/applicationPolicies/owners/read | Read owners on application policies |
> | microsoft.directory/applicationPolicies/policyAppliedTo/read | Read application policies applied to objects list |
> | microsoft.directory/applicationPolicies/basic/update | Update standard properties of application policies |
> | microsoft.directory/applicationPolicies/owners/update | Update the owner property of application policies |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/servicePrincipals/create | Create service principals |
> | microsoft.directory/servicePrincipals/delete | Delete service principals |
> | microsoft.directory/servicePrincipals/disable | Disable service principals |
> | microsoft.directory/servicePrincipals/enable | Enable service principals |
> | microsoft.directory/servicePrincipals/getPasswordSingleSignOnCredentials | Manage password single sign-on credentials on service principals |
> | microsoft.directory/servicePrincipals/synchronizationCredentials/manage | Manage application provisioning secrets and credentials |
> | microsoft.directory/servicePrincipals/synchronizationJobs/manage | Start, restart, and pause application provisioning syncronization jobs |
> | microsoft.directory/servicePrincipals/synchronizationSchema/manage | Create and manage application provisioning syncronization jobs and schema |
> | microsoft.directory/servicePrincipals/managePasswordSingleSignOnCredentials | Read password single sign-on credentials on service principals |
> | microsoft.directory/servicePrincipals/managePermissionGrantsForAll.microsoft-application-admin | Grant consent for application permissions and delegated permissions on behalf of any user or all users, except for application permissions for Microsoft Graph and Azure AD Graph |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/servicePrincipals/audience/update | Update audience properties on service principals |
> | microsoft.directory/servicePrincipals/authentication/update | Update authentication properties on service principals |
> | microsoft.directory/servicePrincipals/basic/update | Update basic properties on service principals |
> | microsoft.directory/servicePrincipals/credentials/update | Update credentials of service principals |
> | microsoft.directory/servicePrincipals/owners/update | Update owners of service principals |
> | microsoft.directory/servicePrincipals/permissions/update | Update permissions of service principals |
> | microsoft.directory/servicePrincipals/policies/update | Update policies of service principals |
> | microsoft.directory/servicePrincipals/tag/update | Update the tag property for service principals |
> | microsoft.directory/servicePrincipals/synchronization/standard/read | Read provisioning settings associated with your service principal |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Cloud Device Administrator

Users in this role can enable, disable, and delete devices in Azure AD and read Windows 10 BitLocker keys (if present) in the Azure portal. The role does not grant permissions to manage any other properties on the device.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, including privileged properties |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices |
> | microsoft.directory/devices/delete | Delete devices from Azure AD |
> | microsoft.directory/devices/disable | Disable devices in Azure AD |
> | microsoft.directory/devices/enable | Enable devices in Azure AD |
> | microsoft.directory/devices/extensionAttributes/update | Update all values for devices.extensionAttributes property |
> | microsoft.directory/deviceManagementPolicies/standard/read | Read standard properties on device management application policies |
> | microsoft.directory/deviceManagementPolicies/basic/update | Update basic properties on device management application policies |
> | microsoft.directory/deviceRegistrationPolicy/standard/read | Read standard properties on device registration policies |
> | microsoft.directory/deviceRegistrationPolicy/basic/update | Update basic properties on device registration policies |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |

## Compliance Administrator

Users with this role have permissions to manage compliance-related features in the Microsoft 365 compliance center, Microsoft 365 admin center, Azure, and Office 365 Security & Compliance Center. Assignees can also manage all features within the Exchange admin center and Teams & Skype for Business admin centers and create support tickets for Azure and Microsoft 365. More information is available at [About Microsoft 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

In | Can do
----- | ----------
[Microsoft 365 compliance center](https://protection.office.com) | Protect and manage your organization's data across Microsoft 365 services<br>Manage compliance alerts
[Compliance Manager](/office365/securitycompliance/meet-data-protection-and-regulatory-reqs-using-microsoft-cloud) | Track, assign, and verify your organization's regulatory compliance activities
[Office 365 Security & Compliance Center](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d) | Manage data governance<br>Perform legal and data investigation<br>Manage Data Subject Request<br><br>This role has the same permissions as the [Compliance Administrator RoleGroup](/microsoft-365/security/office-365-security/permissions-in-the-security-and-compliance-center#permissions-needed-to-use-features-in-the-security--compliance-center) in Office 365 Security & Compliance Center role-based access control.
[Intune](/intune/role-based-access-control) | View all Intune audit data
[Cloud App Security](/cloud-app-security/manage-admins) | Has read-only permissions and can manage alerts<br>Can create and modify file policies and allow file governance actions<br>Can view all the built-in reports under Data Management

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.directory/entitlementManagement/allProperties/read | Read all properties in Azure AD entitlement management |
> | microsoft.office365.complianceManager/allEntities/allTasks | Manage all aspects of Office 365 Compliance Manager |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Compliance Data Administrator

Users with this role have permissions to track data in the Microsoft 365 compliance center, Microsoft 365 admin center, and Azure. Users can also track compliance data within the Exchange admin center, Compliance Manager, and Teams & Skype for Business admin center and create support tickets for Azure and Microsoft 365. [This documentation](/microsoft-365/security/office-365-security/permissions-in-the-security-and-compliance-center#permissions-needed-to-use-features-in-the-security--compliance-center) has details on differences between Compliance Administrator and Compliance Data Administrator.

In | Can do
----- | ----------
[Microsoft 365 compliance center](https://protection.office.com) | Monitor compliance-related policies across Microsoft 365 services<br>Manage compliance alerts
[Compliance Manager](/office365/securitycompliance/meet-data-protection-and-regulatory-reqs-using-microsoft-cloud) | Track, assign, and verify your organization's regulatory compliance activities
[Office 365 Security & Compliance Center](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d) | Manage data governance<br>Perform legal and data investigation<br>Manage Data Subject Request<br><br>This role has the same permissions as the [Compliance Data Administrator RoleGroup](/microsoft-365/security/office-365-security/permissions-in-the-security-and-compliance-center#permissions-needed-to-use-features-in-the-security--compliance-center) in Office 365 Security & Compliance Center role-based access control.
[Intune](/intune/role-based-access-control) | View all Intune audit data
[Cloud App Security](/cloud-app-security/manage-admins) | Has read-only permissions and can manage alerts<br>Can create and modify file policies and allow file governance actions<br>Can view all the built-in reports under Data Management

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/cloudAppSecurity/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Microsoft Cloud App Security |
> | microsoft.azure.informationProtection/allEntities/allTasks | Manage all aspects of Azure Information Protection |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.complianceManager/allEntities/allTasks | Manage all aspects of Office 365 Compliance Manager |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Conditional Access Administrator

Users with this role have the ability to manage Azure Active Directory Conditional Access settings.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/conditionalAccessPolicies/create | Create conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/delete | Delete conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/standard/read | Read conditional access for policies |
> | microsoft.directory/conditionalAccessPolicies/owners/read | Read the owners of conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/policyAppliedTo/read | Read the "applied to" property for conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/basic/update | Update basic properties for conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/owners/update | Update owners for conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/tenantDefault/update | Update the default tenant for conditional access policies |
> | microsoft.directory/crossTenantAccessPolicies/create | Create cross-tenant access policies |
> | microsoft.directory/crossTenantAccessPolicies/delete | Delete cross-tenant access policies |
> | microsoft.directory/crossTenantAccessPolicies/standard/read | Read basic properties of cross-tenant access policies |
> | microsoft.directory/crossTenantAccessPolicies/owners/read | Read owners of cross-tenant access policies |
> | microsoft.directory/crossTenantAccessPolicies/policyAppliedTo/read | Read the policyAppliedTo property of cross-tenant access policies |
> | microsoft.directory/crossTenantAccessPolicies/basic/update | Update basic properties of cross-tenant access policies |
> | microsoft.directory/crossTenantAccessPolicies/owners/update | Update owners of cross-tenant access policies |
> | microsoft.directory/crossTenantAccessPolicies/tenantDefault/update | Update the default tenant for cross-tenant access policies |

## Customer LockBox Access Approver

Manages [Customer Lockbox requests](/office365/admin/manage/customer-lockbox-requests) in your organization. They receive email notifications for Customer Lockbox requests and can approve and deny requests from the Microsoft 365 admin center. They can also turn the Customer Lockbox feature on or off. Only Global Administrators can reset the passwords of people assigned to this role.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.lockbox/allEntities/allTasks | Manage all aspects of Customer Lockbox |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Desktop Analytics Administrator

Users in this role can manage the Desktop Analytics service. This includes the ability to view asset inventory, create deployment plans, and view deployment and health status.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.desktopAnalytics/allEntities/allTasks | Manage all aspects of Desktop Analytics |

## Directory Readers

Users in this role can read basic directory information. This role should be used for:

* Granting a specific set of guest users read access instead of granting it to all guest users.
* Granting a specific set of non-admin users access to Azure portal when "Restrict access to Azure AD portal to admins only" is set to "Yes".
* Granting service principals access to directory where Directory.Read.All is not an option.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/administrativeUnits/standard/read | Read basic properties on administrative units |
> | microsoft.directory/administrativeUnits/members/read | Read members of administrative units |
> | microsoft.directory/applications/standard/read | Read standard properties of applications |
> | microsoft.directory/applications/owners/read | Read owners of applications |
> | microsoft.directory/applications/policies/read | Read policies of applications |
> | microsoft.directory/contacts/standard/read | Read basic properties on contacts in Azure AD |
> | microsoft.directory/contacts/memberOf/read | Read the group membership for all contacts in Azure AD |
> | microsoft.directory/contracts/standard/read | Read basic properties on partner contracts |
> | microsoft.directory/devices/standard/read | Read basic properties on devices |
> | microsoft.directory/devices/memberOf/read | Read device memberships |
> | microsoft.directory/devices/registeredOwners/read | Read registered owners of devices |
> | microsoft.directory/devices/registeredUsers/read | Read registered users of devices |
> | microsoft.directory/directoryRoles/standard/read | Update basic properties in Azure AD roles |
> | microsoft.directory/directoryRoles/eligibleMembers/read | Read the eligible members of Azure AD roles |
> | microsoft.directory/directoryRoles/members/read | Read all members of Azure AD roles |
> | microsoft.directory/domains/standard/read | Read basic properties on domains |
> | microsoft.directory/groups/standard/read | Read basic properties on groups |
> | microsoft.directory/groups/appRoleAssignments/read | Read application role assignments of groups |
> | microsoft.directory/groups/memberOf/read | Read the groups of which a group is a member in Azure AD |
> | microsoft.directory/groups/members/read | Read members of groups |
> | microsoft.directory/groups/owners/read | Read owners of groups |
> | microsoft.directory/groups/settings/read | Read settings of groups |
> | microsoft.directory/groupSettings/standard/read | Read basic properties on group settings |
> | microsoft.directory/groupSettingTemplates/standard/read | Read basic properties on group setting templates |
> | microsoft.directory/oAuth2PermissionGrants/standard/read | Read basic properties on OAuth 2.0 permission grants |
> | microsoft.directory/organization/standard/read | Read basic properties on an organization |
> | microsoft.directory/organization/trustedCAsForPasswordlessAuth/read | Read trusted certificate authorities for passwordless authentication |
> | microsoft.directory/applicationPolicies/standard/read | Read standard properties of application policies |
> | microsoft.directory/roleAssignments/standard/read | Read basic properties on role assignments |
> | microsoft.directory/roleDefinitions/standard/read | Read basic properties on role definitions |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/read | Read service principal role assignments |
> | microsoft.directory/servicePrincipals/appRoleAssignments/read | Read role assignments assigned to service principals |
> | microsoft.directory/servicePrincipals/standard/read | Read basic properties of service principals |
> | microsoft.directory/servicePrincipals/memberOf/read | Read the group memberships on service principals |
> | microsoft.directory/servicePrincipals/oAuth2PermissionGrants/read | Read delegated permission grants on service principals |
> | microsoft.directory/servicePrincipals/owners/read | Read owners of service principals |
> | microsoft.directory/servicePrincipals/ownedObjects/read | Read owned objects of service principals |
> | microsoft.directory/servicePrincipals/policies/read | Read policies of service principals |
> | microsoft.directory/subscribedSkus/standard/read | Read basic properties on subscriptions |
> | microsoft.directory/users/standard/read | Read basic properties on users |
> | microsoft.directory/users/appRoleAssignments/read | Read application role assignments of users |
> | microsoft.directory/users/directReports/read | Read the direct reports for users |
> | microsoft.directory/users/manager/read | Read manager of users |
> | microsoft.directory/users/memberOf/read | Read the group memberships of users |
> | microsoft.directory/users/oAuth2PermissionGrants/read | Read delegated permission grants on users |
> | microsoft.directory/users/ownedDevices/read | Read owned devices of users |
> | microsoft.directory/users/ownedObjects/read | Read owned objects of users |
> | microsoft.directory/users/registeredDevices/read | Read registered devices of users |

## Directory Synchronization Accounts

Do not use. This role is automatically assigned to the Azure AD Connect service, and is not intended or supported for any other use.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/create | Create all types of applications |
> | microsoft.directory/applications/delete | Delete all types of applications |
> | microsoft.directory/applications/appRoles/update | Update the appRoles property on all types of applications |
> | microsoft.directory/applications/audience/update | Update the audience property for applications |
> | microsoft.directory/applications/authentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/basic/update | Update basic properties for applications |
> | microsoft.directory/applications/credentials/update | Update application credentials |
> | microsoft.directory/applications/owners/update | Update owners of applications |
> | microsoft.directory/applications/permissions/update | Update exposed permissions and required permissions on all types of applications |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/organization/dirSync/update | Update the organization directory sync property |
> | microsoft.directory/policies/create | Create policies in Azure AD |
> | microsoft.directory/policies/delete | Delete policies in Azure AD |
> | microsoft.directory/policies/standard/read | Read basic properties on policies |
> | microsoft.directory/policies/owners/read | Read owners of policies |
> | microsoft.directory/policies/policyAppliedTo/read | Read policies.policyAppliedTo property |
> | microsoft.directory/policies/basic/update | Update basic properties on policies |
> | microsoft.directory/policies/owners/update | Update owners of policies |
> | microsoft.directory/policies/tenantDefault/update | Update default organization policies |
> | microsoft.directory/servicePrincipals/create | Create service principals |
> | microsoft.directory/servicePrincipals/delete | Delete service principals |
> | microsoft.directory/servicePrincipals/enable | Enable service principals |
> | microsoft.directory/servicePrincipals/disable | Disable service principals |
> | microsoft.directory/servicePrincipals/getPasswordSingleSignOnCredentials | Manage password single sign-on credentials on service principals |
> | microsoft.directory/servicePrincipals/managePasswordSingleSignOnCredentials | Read password single sign-on credentials on service principals |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/read | Read service principal role assignments |
> | microsoft.directory/servicePrincipals/appRoleAssignments/read | Read role assignments assigned to service principals |
> | microsoft.directory/servicePrincipals/standard/read | Read basic properties of service principals |
> | microsoft.directory/servicePrincipals/memberOf/read | Read the group memberships on service principals |
> | microsoft.directory/servicePrincipals/oAuth2PermissionGrants/read | Read delegated permission grants on service principals |
> | microsoft.directory/servicePrincipals/owners/read | Read owners of service principals |
> | microsoft.directory/servicePrincipals/ownedObjects/read | Read owned objects of service principals |
> | microsoft.directory/servicePrincipals/policies/read | Read policies of service principals |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/servicePrincipals/audience/update | Update audience properties on service principals |
> | microsoft.directory/servicePrincipals/authentication/update | Update authentication properties on service principals |
> | microsoft.directory/servicePrincipals/basic/update | Update basic properties on service principals |
> | microsoft.directory/servicePrincipals/credentials/update | Update credentials of service principals |
> | microsoft.directory/servicePrincipals/owners/update | Update owners of service principals |
> | microsoft.directory/servicePrincipals/permissions/update | Update permissions of service principals |
> | microsoft.directory/servicePrincipals/policies/update | Update policies of service principals |
> | microsoft.directory/servicePrincipals/tag/update | Update the tag property for service principals |

## Directory Writers

Users in this role can read and update basic information of users, groups, and service principals. Assign this role only to applications that don’t support the [Consent Framework](../develop/quickstart-register-app.md). It should not be assigned to any users.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groups/assignLicense | Assign product licenses to groups for group-based licensing |
> | microsoft.directory/groups/create | Create groups, excluding role-assignable groups |
> | microsoft.directory/groups/reprocessLicenseAssignment | Reprocess license assignments for group-based licensing |
> | microsoft.directory/groups/basic/update | Update basic properties on groups, excluding role-assignable groups |
> | microsoft.directory/groups/classification/update | Update the classification property of groups, excluding role-assignable groups |
> | microsoft.directory/groups/dynamicMembershipRule/update | Update dynamic membership rule of groups, excluding role-assignable groups |
> | microsoft.directory/groups/groupType/update | Update the groupType property for a group |
> | microsoft.directory/groups/members/update | Update members of groups, excluding role-assignable groups |
> | microsoft.directory/groups/onPremWriteBack/update | Update Azure Active Directory groups to be written back to on-premises with Azure AD Connect |
> | microsoft.directory/groups/owners/update | Update owners of groups, excluding role-assignable groups |
> | microsoft.directory/groups/settings/update | Update settings of groups |
> | microsoft.directory/groups/visibility/update | Update the visibility property of groups |
> | microsoft.directory/groupSettings/create | Create group settings |
> | microsoft.directory/groupSettings/delete | Delete group settings |
> | microsoft.directory/groupSettings/basic/update | Update basic properties on group settings |
> | microsoft.directory/oAuth2PermissionGrants/create | Create OAuth 2.0 permission grants |
> | microsoft.directory/oAuth2PermissionGrants/basic/update | Update OAuth 2.0 permission grants |
> | microsoft.directory/servicePrincipals/synchronizationCredentials/manage | Manage application provisioning secrets and credentials |
> | microsoft.directory/servicePrincipals/synchronizationJobs/manage | Start, restart, and pause application provisioning syncronization jobs |
> | microsoft.directory/servicePrincipals/synchronizationSchema/manage | Create and manage application provisioning syncronization jobs and schema |
> | microsoft.directory/servicePrincipals/managePermissionGrantsForGroup.microsoft-all-application-permissions | Grant a service principal direct access to a group's data |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/users/assignLicense | Manage user licenses |
> | microsoft.directory/users/create | Add users |
> | microsoft.directory/users/disable | Disable users |
> | microsoft.directory/users/enable | Enable users |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens |
> | microsoft.directory/users/reprocessLicenseAssignment | Reprocess license assignments for users |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.directory/users/userPrincipalName/update | Update User Principal Name of users |

## Domain Name Administrator

Users with this role can manage (read, add, verify, update, and delete) domain names. They can also read directory information about users, groups, and applications, as these objects possess domain dependencies. For on-premises environments, users with this role can configure domain names for federation so that associated users are always authenticated on-premises. These users can then sign into Azure AD-based services with their on-premises passwords via single sign-on. Federation settings need to be synced via Azure AD Connect, so users also have permissions to manage Azure AD Connect.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/domains/allProperties/allTasks | Create and delete domains, and read and update all properties |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |

## Dynamics 365 Administrator

Users with this role have global permissions within Microsoft Dynamics 365 Online, when the service is present, as well as the ability to manage support tickets and monitor service health. More information at [Use the service admin role to manage your Azure AD organization](/dynamics365/customer-engagement/admin/use-service-admin-role-manage-tenant).

> [!NOTE]
> In the Microsoft Graph API and Azure AD PowerShell, this role is identified as "Dynamics 365 Service Administrator." It is "Dynamics 365 Administrator" in the [Azure portal](https://portal.azure.com).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.dynamics365/allEntities/allTasks | Manage all aspects of Dynamics 365 |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Exchange Administrator

Users with this role have global permissions within Microsoft Exchange Online, when the service is present. Also has the ability to create and manage all Microsoft 365 groups, manage support tickets, and monitor service health. More information at [About Microsoft 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

> [!NOTE]
> In the Microsoft Graph API and Azure AD PowerShell, this role is identified as "Exchange Service Administrator." It is "Exchange Administrator" in the [Azure portal](https://portal.azure.com). It is "Exchange Online administrator" in the [Exchange admin center](https://go.microsoft.com/fwlink/p/?LinkID=529144).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of a group |
> | microsoft.directory/groups.unified/create | Create Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.unified/delete | Delete Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.unified/restore | Restore Microsoft 365 groups |
> | microsoft.directory/groups.unified/basic/update | Update basic properties on Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.unified/members/update | Update members of Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.unified/owners/update | Update owners of Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.exchange/allEntities/basic/allTasks | Manage all aspects of Exchange Online |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Exchange Recipient Administrator

Users with this role have read access to recipients and write access to the attributes of those recipients in Exchange Online. More information at [Exchange Recipients](/exchange/recipients/recipients).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.exchange/allRecipients/allProperties/allTasks | Create and delete all recipients, and read and update all properties of recipients in Exchange Online |
> | microsoft.office365.exchange/messageTracking/allProperties/allTasks | Manage all tasks in message tracking in Exchange Online |
> | microsoft.office365.exchange/migration/allProperties/allTasks | Manage all tasks related to migration of recipients in Exchange Online |

## External ID User Flow Administrator

Users with this role can create and manage user flows (also called "built-in" policies) in the Azure portal. These users can customize HTML/CSS/JavaScript content, change MFA requirements, select claims in the token, manage API connectors, and configure session settings for all user flows in the Azure AD organization. On the other hand, this role does not include the ability to review user data or make changes to the attributes that are included in the organization schema. Changes to Identity Experience Framework policies (also known as custom policies) are also outside the scope of this role.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/b2cUserFlow/allProperties/allTasks | Read and configure user attributes in Azure Active Directory B2C |

## External ID User Flow Attribute Administrator

Users with this role add or delete custom attributes available to all user flows in the Azure AD organization. As such, users with this role can change or add new elements to the end-user schema and impact the behavior of all user flows and indirectly result in changes to what data may be asked of end users and ultimately sent as claims to applications. This role cannot edit user flows.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/b2cUserAttribute/allProperties/allTasks | Read and configure custom policies in Azure Active Directory B2C |

## External Identity Provider Administrator

This administrator manages federation between Azure AD organizations and external identity providers. With this role, users can add new identity providers and configure all available settings (e.g. authentication path, service ID, assigned key containers). This user can enable the Azure AD organization to trust authentications from external identity providers. The resulting impact on end-user experiences depends on the type of organization:

* Azure AD organizations for employees and partners: The addition of a federation (e.g. with Gmail) will immediately impact all guest invitations not yet redeemed. See [Adding Google as an identity provider for B2B guest users](../external-identities/google-federation.md).
* Azure Active Directory B2C organizations: The addition of a federation (for example, with Facebook, or with another Azure AD organization) does not immediately impact end-user flows until the identity provider is added as an option in a user flow (also called a built-in policy). See [Configuring a Microsoft account as an identity provider](../../active-directory-b2c/identity-provider-microsoft-account.md) for an example. To change user flows, the limited role of "B2C User Flow Administrator" is required.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/identityProviders/allProperties/allTasks | Read and configure identity providers in Azure Active Directory B2C |

## Global Administrator

Users with this role have access to all administrative features in Azure Active Directory, as well as services that use Azure Active Directory identities like Microsoft 365 security center, Microsoft 365 compliance center, Exchange Online, SharePoint Online, and Skype for Business Online. Furthermore, Global Administrators can [elevate their access](../../role-based-access-control/elevate-access-global-admin.md) to manage all Azure subscriptions and management groups. This allows Global Administrators to get full access to all Azure resources using the respective Azure AD Tenant. The person who signs up for the Azure AD organization becomes a Global Administrator. There can be more than one Global Administrator at your company. Global Administrators can reset the password for any user and all other administrators.

> [!NOTE]
> As a best practice, Microsoft recommends that you assign the Global Administrator role to fewer than five people in your organization. For more information, see [Best practices for Azure AD roles](best-practices.md).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/accessReviews/allProperties/allTasks | Create and delete access reviews, and read and update all properties of access reviews in Azure AD |
> | microsoft.directory/administrativeUnits/allProperties/allTasks | Create and manage administrative units (including members) |
> | microsoft.directory/applications/allProperties/allTasks | Create and delete applications, and read and update all properties |
> | microsoft.directory/applications/synchronization/standard/read | Read provisioning settings associated with the application object |
> | microsoft.directory/applicationTemplates/instantiate | Instantiate gallery applications from application templates |
> | microsoft.directory/appRoleAssignments/allProperties/allTasks | Create and delete appRoleAssignments, and read and update all properties |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, including privileged properties |
> | microsoft.directory/authorizationPolicy/allProperties/allTasks | Manage all aspects of authorization policies |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices |
> | microsoft.directory/cloudAppSecurity/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Microsoft Cloud App Security |
> | microsoft.directory/connectors/create | Create application proxy connectors |
> | microsoft.directory/connectors/allProperties/read | Read all properties of application proxy connectors |
> | microsoft.directory/connectorGroups/create | Create application proxy connector groups |
> | microsoft.directory/connectorGroups/delete | Delete application proxy connector groups |
> | microsoft.directory/connectorGroups/allProperties/read | Read all properties of application proxy connector groups |
> | microsoft.directory/connectorGroups/allProperties/update | Update all properties of application proxy connector groups |
> | microsoft.directory/contacts/allProperties/allTasks | Create and delete contacts, and read and update all properties |
> | microsoft.directory/contracts/allProperties/allTasks | Create and delete partner contracts, and read and update all properties |
> | microsoft.directory/devices/allProperties/allTasks | Create and delete devices, and read and update all properties |
> | microsoft.directory/deviceManagementPolicies/standard/read | Read standard properties on device management application policies |
> | microsoft.directory/deviceManagementPolicies/basic/update | Update basic properties on device management application policies |
> | microsoft.directory/deviceRegistrationPolicy/standard/read | Read standard properties on device registration policies |
> | microsoft.directory/deviceRegistrationPolicy/basic/update | Update basic properties on device registration policies |
> | microsoft.directory/directoryRoles/allProperties/allTasks | Create and delete directory roles, and read and update all properties |
> | microsoft.directory/directoryRoleTemplates/allProperties/allTasks | Create and delete Azure AD role templates, and read and update all properties |
> | microsoft.directory/domains/allProperties/allTasks | Create and delete domains, and read and update all properties |
> | microsoft.directory/entitlementManagement/allProperties/allTasks | Create and delete resources, and read and update all properties in Azure AD entitlement management |
> | microsoft.directory/groups/allProperties/allTasks | Create and delete groups, and read and update all properties |
> | microsoft.directory/groupsAssignableToRoles/create | Create role-assignable groups |
> | microsoft.directory/groupsAssignableToRoles/delete | Delete role-assignable groups |
> | microsoft.directory/groupsAssignableToRoles/restore | Restore role-assignable groups |
> | microsoft.directory/groupsAssignableToRoles/allProperties/update | Update role-assignable groups |
> | microsoft.directory/groupSettings/allProperties/allTasks | Create and delete group settings, and read and update all properties |
> | microsoft.directory/groupSettingTemplates/allProperties/allTasks | Create and delete group setting templates, and read and update all properties |
> | microsoft.directory/identityProtection/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Azure AD Identity Protection |
> | microsoft.directory/loginOrganizationBranding/allProperties/allTasks | Create and delete loginTenantBranding, and read and update all properties |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties |
> | microsoft.directory/organization/allProperties/allTasks | Create and delete organizations, and read and update all properties |
> | microsoft.directory/policies/allProperties/allTasks | Create and delete policies, and read and update all properties |
> | microsoft.directory/conditionalAccessPolicies/allProperties/allTasks | Manage all properties of conditional access policies |
> | microsoft.directory/privilegedIdentityManagement/allProperties/read | Read all resources in Privileged Identity Management |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/roleAssignments/allProperties/allTasks | Create and delete role assignments, and read and update all role assignment properties |
> | microsoft.directory/roleDefinitions/allProperties/allTasks | Create and delete role definitions, and read and update all properties |
> | microsoft.directory/scopedRoleMemberships/allProperties/allTasks | Create and delete scopedRoleMemberships, and read and update all properties |
> | microsoft.directory/serviceAction/activateService | Can perform the "activate service" action for a service |
> | microsoft.directory/serviceAction/disableDirectoryFeature | Can perform the "disable directory feature" service action |
> | microsoft.directory/serviceAction/enableDirectoryFeature | Can perform the "enable directory feature" service action |
> | microsoft.directory/serviceAction/getAvailableExtentionProperties | Can perform the getAvailableExtentionProperties service action |
> | microsoft.directory/servicePrincipals/allProperties/allTasks | Create and delete service principals, and read and update all properties |
> | microsoft.directory/servicePrincipals/managePermissionGrantsForAll.microsoft-company-admin | Grant consent for any permission to any application |
> | microsoft.directory/servicePrincipals/managePermissionGrantsForGroup.microsoft-all-application-permissions | Grant a service principal direct access to a group's data |
> | microsoft.directory/servicePrincipals/synchronization/standard/read | Read provisioning settings associated with your service principal |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.directory/subscribedSkus/allProperties/allTasks | Buy and manage subscriptions and delete subscriptions |
> | microsoft.directory/users/allProperties/allTasks | Create and delete users, and read and update all properties |
> | microsoft.directory/permissionGrantPolicies/create | Create permission grant policies |
> | microsoft.directory/permissionGrantPolicies/delete | Delete permission grant policies |
> | microsoft.directory/permissionGrantPolicies/standard/read | Read standard properties of permission grant policies |
> | microsoft.directory/permissionGrantPolicies/basic/update | Update basic properties of permission grant policies |
> | microsoft.directory/servicePrincipalCreationPolicies/create | Create service principal creation policies |
> | microsoft.directory/servicePrincipalCreationPolicies/delete | Delete service principal creation policies |
> | microsoft.directory/servicePrincipalCreationPolicies/standard/read | Read standard properties of service principal creation policies |
> | microsoft.directory/servicePrincipalCreationPolicies/basic/update | Update basic properties of service principal creation policies |
> | microsoft.azure.advancedThreatProtection/allEntities/allTasks | Manage all aspects of Azure Advanced Threat Protection |
> | microsoft.azure.informationProtection/allEntities/allTasks | Manage all aspects of Azure Information Protection |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.commerce.billing/allEntities/allTasks | Manage all aspects of Office 365 billing |
> | microsoft.dynamics365/allEntities/allTasks | Manage all aspects of Dynamics 365 |
> | microsoft.flow/allEntities/allTasks | Manage all aspects of Microsoft Power Automate |
> | microsoft.intune/allEntities/allTasks | Manage all aspects of Microsoft Intune |
> | microsoft.office365.complianceManager/allEntities/allTasks | Manage all aspects of Office 365 Compliance Manager |
> | microsoft.office365.desktopAnalytics/allEntities/allTasks | Manage all aspects of Desktop Analytics |
> | microsoft.office365.exchange/allEntities/basic/allTasks | Manage all aspects of Exchange Online |
> | microsoft.office365.lockbox/allEntities/allTasks | Manage all aspects of Customer Lockbox |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.messageCenter/securityMessages/read | Read security messages in Message Center in the Microsoft 365 admin center |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.protectionCenter/allEntities/allProperties/allTasks | Manage all aspects of the Security and Compliance centers |
> | microsoft.office365.search/content/manage | Create and delete content, and read and update all properties in Microsoft Search |
> | microsoft.office365.securityComplianceCenter/allEntities/allTasks | Create and delete all resources, and read and update standard properties in the Microsoft 365 Security and Compliance Center |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.sharePoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in SharePoint |
> | microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.userCommunication/allEntities/allTasks | Read and update what's new messages visibility |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.powerApps/allEntities/allTasks | Manage all aspects of Power Apps |
> | microsoft.powerApps.powerBI/allEntities/allTasks | Manage all aspects of Power BI |
> | microsoft.windows.defenderAdvancedThreatProtection/allEntities/allTasks | Manage all aspects of Microsoft Defender for Endpoint |

## Global Reader

Users in this role can read settings and administrative information across Microsoft 365 services but can't take management actions. Global reader is the read-only counterpart to Global Administrator. Assign Global reader instead of Global Administrator for planning, audits, or investigations. Use Global reader in combination with other limited admin roles like Exchange Administrator to make it easier to get work done without the assigning the Global Administrator role. Global reader works with Microsoft 365 admin center, Exchange admin center, SharePoint admin center, Teams admin center, Security center, Compliance center, Azure AD admin center, and Device Management admin center.

> [!NOTE]
> Global reader role has a few limitations right now -
>
>- [OneDrive admin center](https://admin.onedrive.com/) - OneDrive admin center does not support the Global reader role
>- [M365 admin center](https://admin.microsoft.com/Adminportal/Home#/homepage) - Global reader can't read integrated apps. You won't find the **Integrated apps** tab under **Settings** in the left pane of M365 Admin Center.
>- [Office Security & Compliance Center](https://sip.protection.office.com/homepage) - Global reader can't read SCC audit logs, do content search, or see Secure Score.
>- [Teams admin center](https://admin.teams.microsoft.com) - Global reader cannot read **Teams lifecycle**, **Analytics & reports**, **IP phone device management** and **App catalog**.
>- [Privileged Access Management (PAM)](/office365/securitycompliance/privileged-access-management-overview) doesn't support the Global reader role.
>- [Azure Information Protection](/azure/information-protection/what-is-information-protection) - Global reader is supported [for central reporting](/azure/information-protection/reports-aip) only, and when your Azure AD organization isn't on the [unified labeling platform](/azure/information-protection/faqs#how-can-i-determine-if-my-tenant-is-on-the-unified-labeling-platform).
>
> These features are currently in development.
>

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/applicationProxy/read | Read all application proxy properties |
> | microsoft.directory/applications/synchronization/standard/read | Read provisioning settings associated with the application object |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, including privileged properties |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices |
> | microsoft.directory/connectors/allProperties/read | Read all properties of application proxy connectors |
> | microsoft.directory/connectorGroups/allProperties/read | Read all properties of application proxy connector groups |
> | microsoft.directory/entitlementManagement/allProperties/read | Read all properties in Azure AD entitlement management |
> | microsoft.directory/deviceManagementPolicies/standard/read | Read standard properties on device management application policies |
> | microsoft.directory/deviceRegistrationPolicy/standard/read | Read standard properties on device registration policies |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of a group |
> | microsoft.directory/policies/standard/read | Read basic properties on policies |
> | microsoft.directory/policies/owners/read | Read owners of policies |
> | microsoft.directory/policies/policyAppliedTo/read | Read policies.policyAppliedTo property |
> | microsoft.directory/conditionalAccessPolicies/standard/read | Read conditional access for policies |
> | microsoft.directory/conditionalAccessPolicies/owners/read | Read the owners of conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/policyAppliedTo/read | Read the "applied to" property for conditional access policies |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/servicePrincipals/authentication/read | Read authentication properties on service principals |
> | microsoft.directory/servicePrincipals/synchronization/standard/read | Read provisioning settings associated with your service principal |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.directory/users/strongAuthentication/read | Read the strong authentication property for users |
> | microsoft.commerce.billing/allEntities/read | Read all resources of Office 365 billing |
> | microsoft.office365.exchange/allEntities/standard/read | Read all resources of Exchange Online |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.messageCenter/securityMessages/read | Read security messages in Message Center in the Microsoft 365 admin center |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.protectionCenter/allEntities/allProperties/read | Read all properties in the Security and Compliance centers |
> | microsoft.office365.securityComplianceCenter/allEntities/read | Read standard properties in Microsoft 365 Security and Compliance Center |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Groups Administrator

Users in this role can create/manage groups and its settings like naming and expiration policies. It is important to understand that assigning a user to this role gives them the ability to manage all groups in the organization across various workloads like Teams, SharePoint, Yammer in addition to Outlook. Also the user will be able to manage the various groups settings across various admin portals like Microsoft Admin Center, Azure portal, as well as workload specific ones like Teams and SharePoint Admin Centers.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groups/assignLicense | Assign product licenses to groups for group-based licensing |
> | microsoft.directory/groups/create | Create groups, excluding role-assignable groups |
> | microsoft.directory/groups/delete | Delete groups, excluding role-assignable group |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of a group |
> | microsoft.directory/groups/reprocessLicenseAssignment | Reprocess license assignments for group-based licensing |
> | microsoft.directory/groups/restore | Restore deleted groups |
> | microsoft.directory/groups/basic/update | Update basic properties on groups, excluding role-assignable groups |
> | microsoft.directory/groups/classification/update | Update the classification property of groups, excluding role-assignable groups |
> | microsoft.directory/groups/dynamicMembershipRule/update | Update dynamic membership rule of groups, excluding role-assignable groups |
> | microsoft.directory/groups/groupType/update | Update the groupType property for a group |
> | microsoft.directory/groups/members/update | Update members of groups, excluding role-assignable groups |
> | microsoft.directory/groups/onPremWriteBack/update | Update Azure Active Directory groups to be written back to on-premises with Azure AD Connect |
> | microsoft.directory/groups/owners/update | Update owners of groups, excluding role-assignable groups |
> | microsoft.directory/groups/settings/update | Update settings of groups |
> | microsoft.directory/groups/visibility/update | Update the visibility property of groups |
> | microsoft.directory/servicePrincipals/managePermissionGrantsForGroup.microsoft-all-application-permissions | Grant a service principal direct access to a group's data |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Guest Inviter

Users in this role can manage Azure Active Directory B2B guest user invitations when the **Members can invite** user setting is set to No. More information about B2B collaboration at [About Azure AD B2B collaboration](../external-identities/what-is-b2b.md). It does not include any other permissions.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/users/inviteGuest | Invite guest users |
> | microsoft.directory/users/standard/read | Read basic properties on users |
> | microsoft.directory/users/appRoleAssignments/read | Read application role assignments of users |
> | microsoft.directory/users/directReports/read | Read the direct reports for users |
> | microsoft.directory/users/manager/read | Read manager of users |
> | microsoft.directory/users/memberOf/read | Read the group memberships of users |
> | microsoft.directory/users/oAuth2PermissionGrants/read | Read delegated permission grants on users |
> | microsoft.directory/users/ownedDevices/read | Read owned devices of users |
> | microsoft.directory/users/ownedObjects/read | Read owned objects of users |
> | microsoft.directory/users/registeredDevices/read | Read registered devices of users |

## Helpdesk Administrator

Users with this role can change passwords, invalidate refresh tokens, manage service requests, and monitor service health. Invalidating a refresh token forces the user to sign in again. Whether a Helpdesk Administrator can reset a user's password and invalidate refresh tokens depends on the role the user is assigned. For a list of the roles that a Helpdesk Administrator can reset passwords for and invalidate refresh tokens, see [Password reset permissions](#password-reset-permissions).

> [!IMPORTANT]
> Users with this role can change passwords for people who may have access to sensitive or private information or critical configuration inside and outside of Azure Active Directory. Changing the password of a user may mean the ability to assume that user's identity and permissions. For example:
>
>- Application Registration and Enterprise Application owners, who can manage credentials of apps they own. Those apps may have privileged permissions in Azure AD and elsewhere not granted to Helpdesk Administrators. Through this path a Helpdesk Administrator may be able to assume the identity of an application owner and then further assume the identity of a privileged application by updating the credentials for the application.
>- Azure subscription owners, who might have access to sensitive or private information or critical configuration in Azure.
>- Security Group and Microsoft 365 group owners, who can manage group membership. Those groups may grant access to sensitive or private information or critical configuration in Azure AD and elsewhere.
>- Administrators in other services outside of Azure AD like Exchange Online, Office Security and Compliance Center, and human resources systems.
>- Non-administrators like executives, legal counsel, and human resources employees who may have access to sensitive or private information.

Delegating administrative permissions over subsets of users and applying policies to a subset of users is possible with [Administrative Units](administrative-units.md).

This role was previously called "Password Administrator" in the [Azure portal](https://portal.azure.com/). The "Helpdesk Administrator" name in Azure AD now matches its name in Azure AD PowerShell and the Microsoft Graph API.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens |
> | microsoft.directory/users/password/update | Reset passwords for all users |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Hybrid Identity Administrator

Users in this role can create, manage and deploy provisioning configuration setup from AD to Azure AD using Cloud Provisioning as well as manage Azure AD Connect and federation settings. Users can also troubleshoot and monitor logs using this role.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/create | Create all types of applications |
> | microsoft.directory/applications/delete | Delete all types of applications |
> | microsoft.directory/applications/appRoles/update | Update the appRoles property on all types of applications |
> | microsoft.directory/applications/audience/update | Update the audience property for applications |
> | microsoft.directory/applications/authentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/basic/update | Update basic properties for applications |
> | microsoft.directory/applications/credentials/update | Update application credentials |
> | microsoft.directory/applications/owners/update | Update owners of applications |
> | microsoft.directory/applications/permissions/update | Update exposed permissions and required permissions on all types of applications |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/applications/synchronization/standard/read | Read provisioning settings associated with the application object |
> | microsoft.directory/applicationTemplates/instantiate | Instantiate gallery applications from application templates |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, including privileged properties |
> | microsoft.directory/cloudProvisioning/allProperties/allTasks | Read and configure all properties of Azure AD Cloud Provisioning service. |
> | microsoft.directory/domains/allProperties/read | Read all properties of domains |
> | microsoft.directory/domains/federation/update | Update federation property of domains |
> | microsoft.directory/organization/dirSync/update | Update the organization directory sync property |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/servicePrincipals/create | Create service principals |
> | microsoft.directory/servicePrincipals/delete | Delete service principals |
> | microsoft.directory/servicePrincipals/disable | Disable service principals |
> | microsoft.directory/servicePrincipals/enable | Enable service principals |
> | microsoft.directory/servicePrincipals/synchronizationCredentials/manage | Manage application provisioning secrets and credentials |
> | microsoft.directory/servicePrincipals/synchronizationJobs/manage | Start, restart, and pause application provisioning syncronization jobs |
> | microsoft.directory/servicePrincipals/synchronizationSchema/manage | Create and manage application provisioning syncronization jobs and schema |
> | microsoft.directory/servicePrincipals/audience/update | Update audience properties on service principals |
> | microsoft.directory/servicePrincipals/authentication/update | Update authentication properties on service principals |
> | microsoft.directory/servicePrincipals/basic/update | Update basic properties on service principals |
> | microsoft.directory/servicePrincipals/credentials/update | Update credentials of service principals |
> | microsoft.directory/servicePrincipals/owners/update | Update owners of service principals |
> | microsoft.directory/servicePrincipals/permissions/update | Update permissions of service principals |
> | microsoft.directory/servicePrincipals/policies/update | Update policies of service principals |
> | microsoft.directory/servicePrincipals/tag/update | Update the tag property for service principals |
> | microsoft.directory/servicePrincipals/synchronization/standard/read | Read provisioning settings associated with your service principal |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Insights Administrator

Users in this role can access the full set of administrative capabilities in the [M365 Insights application](https://go.microsoft.com/fwlink/?linkid=2129521). This role has the ability to read directory information, monitor service health, file support tickets, and access the Insights admin settings aspects.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.insights/allEntities/allTasks | Manage all aspects of Insights app |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Insights Business Leader

Users in this role can access a set of dashboards and insights via the [M365 Insights application](https://go.microsoft.com/fwlink/?linkid=2129521). This includes full access to all dashboards and presented insights and data exploration functionality. Users in this role do not have access to product configuration settings, which is the responsibility of the Insights Admin role.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.insights/reports/read | View reports and dashboard in Insights app |
> | microsoft.insights/programs/update | Deploy and manage programs in Insights app |

## Intune Administrator

Users with this role have global permissions within Microsoft Intune Online, when the service is present. Additionally, this role contains the ability to manage users and devices in order to associate policy, as well as create and manage groups. More information at [Role-based administration control (RBAC) with Microsoft Intune](/intune/role-based-access-control).

This role can create and manage all security groups. However, Intune Admin does not have admin rights over Office groups. That means the admin cannot update owners or memberships of all Office groups in the organization. However, he/she can manage the Office group that he creates which comes as a part of his/her end-user privileges. So, any Office group (not security group) that he/she creates should be counted against his/her quota of 250.

> [!NOTE]
> In the Microsoft Graph API and Azure AD PowerShell, this role is identified as "Intune Service Administrator." It is "Intune Administrator" in the [Azure portal](https://portal.azure.com).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices |
> | microsoft.directory/contacts/create | Create contacts |
> | microsoft.directory/contacts/delete | Delete contacts |
> | microsoft.directory/contacts/basic/update | Update basic properties on contacts |
> | microsoft.directory/devices/create | Create devices (enroll in Azure AD) |
> | microsoft.directory/devices/delete | Delete devices from Azure AD |
> | microsoft.directory/devices/disable | Disable devices in Azure AD |
> | microsoft.directory/devices/enable | Enable devices in Azure AD |
> | microsoft.directory/devices/basic/update | Update basic properties on devices |
> | microsoft.directory/devices/extensionAttributes/update | Update all values for devices.extensionAttributes property |
> | microsoft.directory/devices/registeredOwners/update | Update registered owners of devices |
> | microsoft.directory/devices/registeredUsers/update | Update registered users of devices |
> | microsoft.directory/deviceManagementPolicies/standard/read | Read standard properties on device management application policies |
> | microsoft.directory/deviceRegistrationPolicy/standard/read | Read standard properties on device registration policies |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of a group |
> | microsoft.directory/groups.security/create | Create Security groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.security/delete | Delete Security groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.security/basic/update | Update basic properties on Security groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.security/classification/update | Update classification property of the Security groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.security/dynamicMembershipRule/update | Update dynamicMembershipRule property of the Security groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.security/members/update | Update members of Security groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.security/owners/update | Update owners of Security groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.security/visibility/update | Update visibility property of the Security groups with the exclusion of role-assignable groups |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.intune/allEntities/allTasks | Manage all aspects of Microsoft Intune |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Kaizala Administrator

Users with this role have global permissions to manage settings within Microsoft Kaizala, when the service is present, as well as the ability to manage support tickets and monitor service health. Additionally, the user can access reports related to adoption & usage of Kaizala by Organization members and business reports generated using the Kaizala actions.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Knowledge Administrator

Users in this role have full access to all knowledge, learning and intelligent features settings in the Microsoft 365 admin center. They have a general understanding of the suite of products, licensing details and has responsibility to control access. Knowledge administrator can create and manage content, like topics, acronyms and learning resources. Additionally, these users can create content centers, monitor service health, and create service requests.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groups.security/create | Create Security groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.security/createAsOwner | Create Security groups with the exclusion of role-assignable groups and creator is added as the first owner |
> | microsoft.directory/groups.security/delete | Delete Security groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.security/basic/update | Update basic properties on Security groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.security/members/update | Update members of Security groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.security/owners/update | Update owners of Security groups with the exclusion of role-assignable groups |
> | microsoft.office365.knowledge/contentUnderstanding/allProperties/allTasks | Read and update all properties of content understanding in Microsoft 365 admin center |
> | microsoft.office365.knowledge/knowledgeNetwork/allProperties/allTasks | Read and update all properties of knowledge network in Microsoft 365 admin center |
> | microsoft.office365.protectionCenter/sensitivityLabels/allProperties/read | Read all properties of sensitivity labels in the Security and Compliance centers |
> | microsoft.office365.sharePoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in SharePoint |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## License Administrator

Users in this role can add, remove, and update license assignments on users, groups (using group-based licensing), and manage the usage location on users. The role does not grant the ability to purchase or manage subscriptions, create or manage groups, or create or manage users beyond the usage location. This role has no access to view, create, or manage support tickets.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groups/assignLicense | Assign product licenses to groups for group-based licensing |
> | microsoft.directory/groups/reprocessLicenseAssignment | Reprocess license assignments for group-based licensing |
> | microsoft.directory/users/assignLicense | Manage user licenses |
> | microsoft.directory/users/reprocessLicenseAssignment | Reprocess license assignments for users |
> | microsoft.directory/users/usageLocation/update | Update usage location of users |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Message Center Privacy Reader

Users in this role can monitor all notifications in the Message Center, including data privacy messages. Message Center Privacy Readers get email notifications including those related to data privacy and they can unsubscribe using Message Center Preferences. Only the Global Administrator and the Message Center Privacy Reader can read data privacy messages. Additionally, this role contains the ability to view groups, domains, and subscriptions. This role has no permission to view, create, or manage service requests.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.messageCenter/securityMessages/read | Read security messages in Message Center in the Microsoft 365 admin center |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Message Center Reader

Users in this role can monitor notifications and advisory health updates in [Message center](https://support.office.com/article/Message-center-in-Office-365-38FB3333-BFCC-4340-A37B-DEDA509C2093) for their organization on configured services such as Exchange, Intune, and Microsoft Teams. Message Center Readers receive weekly email digests of posts, updates, and can share message center posts in Microsoft 365. In Azure AD, users assigned to this role will only have read-only access on Azure AD services such as users and groups. This role has no access to view, create, or manage support tickets.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Modern Commerce User

Do not use. This role is automatically assigned from Commerce, and is not intended or supported for any other use. See details below.

The Modern Commerce User role gives certain users permission to access Microsoft 365 admin center and see the left navigation entries for **Home**, **Billing**, and **Support**. The content available in these areas is controlled by [commerce-specific roles](../../cost-management-billing/manage/understand-mca-roles.md) assigned to users to manage products that they bought for themselves or your organization. This might include tasks like paying bills, or for access to billing accounts and billing profiles.

Users with the Modern Commerce User role typically have administrative permissions in other Microsoft purchasing systems, but do not have Global Administrator or Billing administrator roles used to access the admin center.

**When is the Modern Commerce User role assigned?**

* **Self-service purchase in Microsoft 365 admin center** – Self-service purchase gives users a chance to try out new products by buying or signing up for them on their own. These products are managed in the admin center. Users who make a self-service purchase are assigned a role in the commerce system, and the Modern Commerce User role so they can manage their purchases in admin center. Admins can block self-service purchases (for Power BI, Power Apps, Power automate) through [PowerShell](/microsoft-365/commerce/subscriptions/allowselfservicepurchase-powershell). For more information, see [Self-service purchase FAQ](/microsoft-365/commerce/subscriptions/self-service-purchase-faq).
* **Purchases from Microsoft commercial marketplace** – Similar to self-service purchase, when a user buys a product or service from Microsoft AppSource or Azure Marketplace, the Modern Commerce User role is assigned if they don’t have the Global Administrator or Billing admin role. In some cases, users might be blocked from making these purchases. For more information, see [Microsoft commercial marketplace](../../marketplace/marketplace-faq-publisher-guide.md#what-could-block-a-customer-from-completing-a-purchase).
* **Proposals from Microsoft** – A proposal is a formal offer from Microsoft for your organization to buy Microsoft products and services. When the person who is accepting the proposal doesn’t have a Global Administrator or Billing admin role in Azure AD, they are assigned both a commerce-specific role to complete the proposal and the Modern Commerce User role to access admin center. When they access the admin center they can only use features that are authorized by their commerce-specific role.
* **Commerce-specific roles** – Some users are assigned commerce-specific roles. If a user isn't a Global or Billing admin, they get the Modern Commerce User role so they can access the admin center.

If the Modern Commerce User role is unassigned from a user, they lose access to Microsoft 365 admin center. If they were managing any products, either for themselves or for your organization, they won’t be able to manage them. This might include assigning licenses, changing payment methods, paying bills, or other tasks for managing subscriptions.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.commerce.billing/partners/read | Read partner property of Microsoft 365 Billing |
> | microsoft.commerce.volumeLicenseServiceCenter/allEntities/allTasks | Manage all aspects of Volume Licensing Service Center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/basic/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Network Administrator

Users in this role can review network perimeter architecture recommendations from Microsoft that are based on network telemetry from their user locations. Network performance for Microsoft 365 relies on careful enterprise customer network perimeter architecture which is generally user location specific. This role allows for editing of discovered user locations and configuration of network parameters for those locations to facilitate improved telemetry measurements and design recommendations

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.network/locations/allProperties/allTasks | Manage all aspects of network locations |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Office Apps Administrator

Users in this role can manage Microsoft 365 apps' cloud settings. This includes managing cloud policies, self-service download management and the ability to view Office apps related report. This role additionally grants the ability to manage support tickets, and monitor service health within the main admin center. Users assigned to this role can also manage communication of new features in Office apps.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.userCommunication/allEntities/allTasks | Read and update what's new messages visibility |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Partner Tier1 Support

Do not use. This role has been deprecated and will be removed from Azure AD in the future. This role is intended for use by a small number of Microsoft resale partners, and is not intended for general use.

> [!IMPORTANT]
> This role can reset passwords and invalidate refresh tokens for only non-administrators. This role should not be used as it is deprecated and it will no longer be returned in API.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/appRoles/update | Update the appRoles property on all types of applications |
> | microsoft.directory/applications/audience/update | Update the audience property for applications |
> | microsoft.directory/applications/authentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/basic/update | Update basic properties for applications |
> | microsoft.directory/applications/credentials/update | Update application credentials |
> | microsoft.directory/applications/owners/update | Update owners of applications |
> | microsoft.directory/applications/permissions/update | Update exposed permissions and required permissions on all types of applications |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/contacts/create | Create contacts |
> | microsoft.directory/contacts/delete | Delete contacts |
> | microsoft.directory/contacts/basic/update | Update basic properties on contacts |
> | microsoft.directory/groups/create | Create groups, excluding role-assignable groups |
> | microsoft.directory/groups/delete | Delete groups, excluding role-assignable group |
> | microsoft.directory/groups/restore | Restore deleted groups |
> | microsoft.directory/groups/members/update | Update members of groups, excluding role-assignable groups |
> | microsoft.directory/groups/owners/update | Update owners of groups, excluding role-assignable groups |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/users/assignLicense | Manage user licenses |
> | microsoft.directory/users/create | Add users |
> | microsoft.directory/users/delete | Delete users |
> | microsoft.directory/users/disable | Disable users |
> | microsoft.directory/users/enable | Enable users |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens |
> | microsoft.directory/users/restore | Restore deleted users |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.directory/users/password/update | Reset passwords for all users |
> | microsoft.directory/users/userPrincipalName/update | Update User Principal Name of users |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Partner Tier2 Support

Do not use. This role has been deprecated and will be removed from Azure AD in the future. This role is intended for use by a small number of Microsoft resale partners, and is not intended for general use.

> [!IMPORTANT]
> This role can reset passwords and invalidate refresh tokens for all non-administrators and administrators (including Global Administrators). This role should not be used as it is deprecated and it will no longer be returned in API.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/appRoles/update | Update the appRoles property on all types of applications |
> | microsoft.directory/applications/audience/update | Update the audience property for applications |
> | microsoft.directory/applications/authentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/basic/update | Update basic properties for applications |
> | microsoft.directory/applications/credentials/update | Update application credentials |
> | microsoft.directory/applications/owners/update | Update owners of applications |
> | microsoft.directory/applications/permissions/update | Update exposed permissions and required permissions on all types of applications |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/contacts/create | Create contacts |
> | microsoft.directory/contacts/delete | Delete contacts |
> | microsoft.directory/contacts/basic/update | Update basic properties on contacts |
> | microsoft.directory/domains/allProperties/allTasks | Create and delete domains, and read and update all properties |
> | microsoft.directory/groups/create | Create groups, excluding role-assignable groups |
> | microsoft.directory/groups/delete | Delete groups, excluding role-assignable group |
> | microsoft.directory/groups/restore | Restore deleted groups |
> | microsoft.directory/groups/members/update | Update members of groups, excluding role-assignable groups |
> | microsoft.directory/groups/owners/update | Update owners of groups, excluding role-assignable groups |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties |
> | microsoft.directory/organization/basic/update | Update basic properties on organization |
> | microsoft.directory/roleAssignments/allProperties/allTasks | Create and delete role assignments, and read and update all role assignment properties |
> | microsoft.directory/roleDefinitions/allProperties/allTasks | Create and delete role definitions, and read and update all properties |
> | microsoft.directory/scopedRoleMemberships/allProperties/allTasks | Create and delete scopedRoleMemberships, and read and update all properties |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/subscribedSkus/standard/read | Read basic properties on subscriptions |
> | microsoft.directory/users/assignLicense | Manage user licenses |
> | microsoft.directory/users/create | Add users |
> | microsoft.directory/users/delete | Delete users |
> | microsoft.directory/users/disable | Disable users |
> | microsoft.directory/users/enable | Enable users |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens |
> | microsoft.directory/users/restore | Restore deleted users |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.directory/users/password/update | Reset passwords for all users |
> | microsoft.directory/users/userPrincipalName/update | Update User Principal Name of users |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Password Administrator

Users with this role have limited ability to manage passwords. This role does not grant the ability to manage service requests or monitor service health. Whether a Password Administrator can reset a user's password depends on the role the user is assigned. For a list of the roles that a Password Administrator can reset passwords for, see [Password reset permissions](#password-reset-permissions).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/users/password/update | Reset passwords for all users |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Power BI Administrator

Users with this role have global permissions within Microsoft Power BI, when the service is present, as well as the ability to manage support tickets and monitor service health. More information at [Understanding the Power BI admin role](/power-bi/service-admin-role).

> [!NOTE]
> In the Microsoft Graph API and Azure AD PowerShell, this role is identified as "Power BI Service Administrator ". It is "Power BI Administrator" in the [Azure portal](https://portal.azure.com).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.powerApps.powerBI/allEntities/allTasks | Manage all aspects of Power BI |

## Power Platform Administrator

Users in this role can create and manage all aspects of environments, PowerApps, Flows, Data Loss Prevention policies. Additionally, users with this role have the ability to manage support tickets and monitor service health.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.dynamics365/allEntities/allTasks | Manage all aspects of Dynamics 365 |
> | microsoft.flow/allEntities/allTasks | Manage all aspects of Microsoft Power Automate |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.powerApps/allEntities/allTasks | Manage all aspects of Power Apps |

## Printer Administrator

Users in this role can register printers and manage all aspects of all printer configurations in the Microsoft Universal Print solution, including the Universal Print Connector settings. They can consent to all delegated print permission requests. Printer Administrators also have access to print reports.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.print/allEntities/allProperties/allTasks | Create and delete printers and connectors, and read and update all properties in Microsoft Print |

## Printer Technician

Users with this role can register printers and manage printer status in the Microsoft Universal Print solution. They can also read all connector information. Key task a Printer Technician cannot do is set user permissions on printers and sharing printers.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.print/connectors/allProperties/read | Read all properties of connectors in Microsoft Print |
> | microsoft.azure.print/printers/allProperties/read | Read all properties of printers in Microsoft Print |
> | microsoft.azure.print/printers/register | Register printers in Microsoft Print |
> | microsoft.azure.print/printers/unregister | Unregister printers in Microsoft Print |
> | microsoft.azure.print/printers/basic/update | Update basic properties of printers in Microsoft Print |

## Privileged Authentication Administrator

Users with this role can set or reset any authentication method (including passwords) for any user, including Global Administrators. Privileged Authentication Administrators can force users to re-register against existing non-password credential (such as MFA or FIDO) and revoke 'remember MFA on the device', prompting for MFA on the next sign-in of all users.

The [Authentication administrator](#authentication-administrator) role has permission to force re-registration and multi-factor authentication for standard users and users with some admin roles.

The [Authentication policy administrator](#authentication-policy-administrator) role has permissions to set the tenant's authentication method policy that determines which methods each user can register and use.

| Role | Manage user's auth methods | Manage per-user MFA | Manage MFA settings | Manage auth method policy | Manage password protection policy |
| ---- | ---- | ---- | ---- | ---- | ---- |
| Authentication administrator | Yes for some users (see above) | Yes for some users (see above) | No | No | No |
| Privileged authentication administrator| Yes for all users | Yes for all users | No | No | No |
| Authentication policy administrator | No | No | Yes | Yes | Yes |

> [!IMPORTANT]
> Users with this role can change credentials for people who may have access to sensitive or private information or critical configuration inside and outside of Azure Active Directory. Changing the credentials of a user may mean the ability to assume that user's identity and permissions. For example:
>
>* Application Registration and Enterprise Application owners, who can manage credentials of apps they own. Those apps may have privileged permissions in Azure AD and elsewhere not granted to Authentication Administrators. Through this path an Authentication Administrator can assume the identity of an application owner and then further assume the identity of a privileged application by updating the credentials for the application.
>* Azure subscription owners, who may have access to sensitive or private information or critical configuration in Azure.
>* Security Group and Microsoft 365 group owners, who can manage group membership. Those groups may grant access to sensitive or private information or critical configuration in Azure AD and elsewhere.
>* Administrators in other services outside of Azure AD like Exchange Online, Office Security and Compliance Center, and human resources systems.
>* Non-administrators like executives, legal counsel, and human resources employees who may have access to sensitive or private information.


> [!IMPORTANT]
> This role is not currently capable of managing per-user MFA in the legacy MFA management portal. The same functions can be accomplished using the [Set-MsolUser](/powershell/module/msonline/set-msoluser) commandlet Azure AD Powershell module.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens |
> | microsoft.directory/users/strongAuthentication/update | Update the strong authentication property for users |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Privileged Role Administrator

Users with this role can manage role assignments in Azure Active Directory, as well as within Azure AD Privileged Identity Management. They can create and manage groups that can be assigned to Azure AD roles. In addition, this role allows management of all aspects of Privileged Identity Management and administrative units.

> [!IMPORTANT]
> This role grants the ability to manage assignments for all Azure AD roles including the Global Administrator role. This role does not include any other privileged abilities in Azure AD like creating or updating users. However, users assigned to this role can grant themselves or others additional privilege by assigning additional roles.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/administrativeUnits/allProperties/allTasks | Create and manage administrative units (including members) |
> | microsoft.directory/appRoleAssignments/allProperties/allTasks | Create and delete appRoleAssignments, and read and update all properties |
> | microsoft.directory/authorizationPolicy/allProperties/allTasks | Manage all aspects of authorization policies |
> | microsoft.directory/directoryRoles/allProperties/allTasks | Create and delete directory roles, and read and update all properties |
> | microsoft.directory/groupsAssignableToRoles/create | Create role-assignable groups |
> | microsoft.directory/groupsAssignableToRoles/delete | Delete role-assignable groups |
> | microsoft.directory/groupsAssignableToRoles/restore | Restore role-assignable groups |
> | microsoft.directory/groupsAssignableToRoles/allProperties/update | Update role-assignable groups |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties |
> | microsoft.directory/privilegedIdentityManagement/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Privileged Identity Management |
> | microsoft.directory/roleAssignments/allProperties/allTasks | Create and delete role assignments, and read and update all role assignment properties |
> | microsoft.directory/roleDefinitions/allProperties/allTasks | Create and delete role definitions, and read and update all properties |
> | microsoft.directory/scopedRoleMemberships/allProperties/allTasks | Create and delete scopedRoleMemberships, and read and update all properties |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/servicePrincipals/permissions/update | Update permissions of service principals |
> | microsoft.directory/servicePrincipals/managePermissionGrantsForAll.microsoft-company-admin | Grant consent for any permission to any application |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Reports Reader

Users with this role can view usage reporting data and the reports dashboard in Microsoft 365 admin center and the adoption context pack in Power BI. Additionally, the role provides access to sign-in reports and activity in Azure AD and data returned by the Microsoft Graph reporting API. A user assigned to the Reports Reader role can access only relevant usage and adoption metrics. They don't have any admin permissions to configure settings or access the product-specific admin centers like Exchange. This role has no access to view, create, or manage support tickets.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, including privileged properties |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Search Administrator

Users in this role have full access to all Microsoft Search management features in the Microsoft 365 admin center. Additionally, these users can view the message center, monitor service health, and create service requests.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.search/content/manage | Create and delete content, and read and update all properties in Microsoft Search |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Search Editor

Users in this role can create, manage, and delete content for Microsoft Search in the Microsoft 365 admin center, including bookmarks, Q&As, and locations.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.search/content/manage | Create and delete content, and read and update all properties in Microsoft Search |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Security Administrator

Users with this role have permissions to manage security-related features in the Microsoft 365 security center, Azure Active Directory Identity Protection, Azure Active Directory Authentication, Azure Information Protection, and Office 365 Security & Compliance Center. More information about Office 365 permissions is available at [Permissions in the Security & Compliance Center](https://support.office.com/article/Permissions-in-the-Office-365-Security-Compliance-Center-d10608af-7934-490a-818e-e68f17d0e9c1).

In | Can do
--- | ---
[Microsoft 365 security center](https://protection.office.com) | Monitor security-related policies across Microsoft 365 services<br>Manage security threats and alerts<br>View reports
Identity Protection Center | All permissions of the Security Reader role<br>Additionally, the ability to perform all Identity Protection Center operations except for resetting passwords
[Privileged Identity Management](../privileged-identity-management/pim-configure.md) | All permissions of the Security Reader role<br>**Cannot** manage Azure AD role assignments or settings
[Office 365 Security & Compliance Center](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d) | Manage security policies<br>View, investigate, and respond to security threats<br>View reports
Azure Advanced Threat Protection | Monitor and respond to suspicious security activity
Windows Defender ATP and EDR | Assign roles<br>Manage machine groups<br>Configure endpoint threat detection and automated remediation<br>View, investigate, and respond to alerts
[Intune](/intune/role-based-access-control) | Views user, device, enrollment, configuration, and application information<br>Cannot make changes to Intune
[Cloud App Security](/cloud-app-security/manage-admins) | Add admins, add policies and settings, upload logs and perform governance actions
[Azure Security Center](../../key-vault/managed-hsm/built-in-roles.md) | Can view security policies, view security states, edit security policies, view alerts and recommendations, dismiss alerts and recommendations
[Microsoft 365 service health](/office365/enterprise/view-service-health) | View the health of Microsoft 365 services
[Smart lockout](../authentication/howto-password-smart-lockout.md) | Define the threshold and duration for lockouts when failed sign-in events happen.
[Password Protection](../authentication/concept-password-ban-bad.md) | Configure custom banned password list or on-premises password protection.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, including privileged properties |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices |
> | microsoft.directory/entitlementManagement/allProperties/read | Read all properties in Azure AD entitlement management |
> | microsoft.directory/identityProtection/allProperties/read | Read all resources in Azure AD Identity Protection |
> | microsoft.directory/identityProtection/allProperties/update | Update all resources in Azure AD Identity Protection |
> | microsoft.directory/policies/create | Create policies in Azure AD |
> | microsoft.directory/policies/delete | Delete policies in Azure AD |
> | microsoft.directory/policies/basic/update | Update basic properties on policies |
> | microsoft.directory/policies/owners/update | Update owners of policies |
> | microsoft.directory/policies/tenantDefault/update | Update default organization policies |
> | microsoft.directory/conditionalAccessPolicies/create | Create conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/delete | Delete conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/standard/read | Read conditional access for policies |
> | microsoft.directory/conditionalAccessPolicies/owners/read | Read the owners of conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/policyAppliedTo/read | Read the "applied to" property for conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/basic/update | Update basic properties for conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/owners/update | Update owners for conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/tenantDefault/update | Update the default tenant for conditional access policies |
> | microsoft.directory/privilegedIdentityManagement/allProperties/read | Read all resources in Privileged Identity Management |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/servicePrincipals/policies/update | Update policies of service principals |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.protectionCenter/allEntities/standard/read | Read standard properties of all resources in the Security and Compliance centers |
> | microsoft.office365.protectionCenter/allEntities/basic/update | Update basic properties of all resources in the Security and Compliance centers |
> | microsoft.office365.protectionCenter/attackSimulator/payload/allProperties/allTasks | Create and manage attack payloads in Attack Simulator |
> | microsoft.office365.protectionCenter/attackSimulator/reports/allProperties/read | Read reports of attack simulation responses and associated training |
> | microsoft.office365.protectionCenter/attackSimulator/simulation/allProperties/allTasks | Create and manage attack simulation templates in Attack Simulator |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Security Operator

Users with this role can manage alerts and have global read-only access on security-related features, including all information in Microsoft 365 security center, Azure Active Directory, Identity Protection, Privileged Identity Management and Office 365 Security & Compliance Center. More information about Office 365 permissions is available at [Permissions in the Security & Compliance Center](/office365/securitycompliance/permissions-in-the-security-and-compliance-center).

In | Can do
--- | ---
[Microsoft 365 security center](https://protection.office.com) | All permissions of the Security Reader role<br>View, investigate, and respond to security threats alerts
Azure AD Identity Protection | All permissions of the Security Reader role<br>Additionally, the ability to perform all Identity Protection Center operations except for resetting passwords and configuring alert e-mails.
[Privileged Identity Management](../privileged-identity-management/pim-configure.md) | All permissions of the Security Reader role
[Office 365 Security & Compliance Center](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d) | All permissions of the Security Reader role<br>View, investigate, and respond to security alerts
Windows Defender ATP and EDR | All permissions of the Security Reader role<br>View, investigate, and respond to security alerts
[Intune](/intune/role-based-access-control) | All permissions of the Security Reader role
[Cloud App Security](/cloud-app-security/manage-admins) | All permissions of the Security Reader role
[Microsoft 365 service health](/office365/enterprise/view-service-health) | View the health of Microsoft 365 services

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, including privileged properties |
> | microsoft.directory/cloudAppSecurity/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Microsoft Cloud App Security |
> | microsoft.directory/identityProtection/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Azure AD Identity Protection |
> | microsoft.directory/privilegedIdentityManagement/allProperties/read | Read all resources in Privileged Identity Management |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.advancedThreatProtection/allEntities/allTasks | Manage all aspects of Azure Advanced Threat Protection |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.intune/allEntities/read | Read all resources in Microsoft Intune |
> | microsoft.office365.securityComplianceCenter/allEntities/allTasks | Create and delete all resources, and read and update standard properties in the Microsoft 365 Security and Compliance Center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.windows.defenderAdvancedThreatProtection/allEntities/allTasks | Manage all aspects of Microsoft Defender for Endpoint |

## Security Reader

Users with this role have global read-only access on security-related feature, including all information in Microsoft 365 security center, Azure Active Directory, Identity Protection, Privileged Identity Management, as well as the ability to read Azure Active Directory sign-in reports and audit logs, and in Office 365 Security & Compliance Center. More information about Office 365 permissions is available at [Permissions in the Security & Compliance Center](https://support.office.com/article/Permissions-in-the-Office-365-Security-Compliance-Center-d10608af-7934-490a-818e-e68f17d0e9c1).

In | Can do
--- | ---
[Microsoft 365 security center](https://protection.office.com) | View security-related policies across Microsoft 365 services<br>View security threats and alerts<br>View reports
Identity Protection Center | Read all security reports and settings information for security features<br><ul><li>Anti-spam<li>Encryption<li>Data loss prevention<li>Anti-malware<li>Advanced threat protection<li>Anti-phishing<li>Mail flow rules
[Privileged Identity Management](../privileged-identity-management/pim-configure.md) | Has read-only access to all information surfaced in Azure AD Privileged Identity Management: Policies and reports for Azure AD role assignments and security reviews.<br>**Cannot** sign up for Azure AD Privileged Identity Management or make any changes to it. In the Privileged Identity Management portal or via PowerShell, someone in this role can activate additional roles (for example, Global Administrator or Privileged Role Administrator), if the user is eligible for them.
[Office 365 Security & Compliance Center](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d) | View security policies<br>View and investigate security threats<br>View reports
Windows Defender ATP and EDR | View and investigate alerts. When you turn on role-based access control in Windows Defender ATP, users with read-only permissions such as the Azure AD Security reader role lose access until they are assigned to a Windows Defender ATP role.
[Intune](/intune/role-based-access-control) | Views user, device, enrollment, configuration, and application information. Cannot make changes to Intune.
[Cloud App Security](/cloud-app-security/manage-admins) | Has read-only permissions and can manage alerts
[Azure Security Center](../../key-vault/managed-hsm/built-in-roles.md) | Can view recommendations and alerts, view security policies, view security states, but cannot make changes
[Microsoft 365 service health](/office365/enterprise/view-service-health) | View the health of Microsoft 365 services

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, including privileged properties |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices |
> | microsoft.directory/entitlementManagement/allProperties/read | Read all properties in Azure AD entitlement management |
> | microsoft.directory/identityProtection/allProperties/read | Read all resources in Azure AD Identity Protection |
> | microsoft.directory/policies/standard/read | Read basic properties on policies |
> | microsoft.directory/policies/owners/read | Read owners of policies |
> | microsoft.directory/policies/policyAppliedTo/read | Read policies.policyAppliedTo property |
> | microsoft.directory/conditionalAccessPolicies/standard/read | Read conditional access for policies |
> | microsoft.directory/conditionalAccessPolicies/owners/read | Read the owners of conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/policyAppliedTo/read | Read the "applied to" property for conditional access policies |
> | microsoft.directory/privilegedIdentityManagement/allProperties/read | Read all resources in Privileged Identity Management |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.office365.protectionCenter/allEntities/standard/read | Read standard properties of all resources in the Security and Compliance centers |
> | microsoft.office365.protectionCenter/attackSimulator/payload/allProperties/read | Read all properties of attack payloads in Attack Simulator |
> | microsoft.office365.protectionCenter/attackSimulator/reports/allProperties/read | Read reports of attack simulation responses and associated training |
> | microsoft.office365.protectionCenter/attackSimulator/simulation/allProperties/read | Read all properties of attack simulation templates in Attack Simulator |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Service Support Administrator

Users with this role can open support requests with Microsoft for Azure and Microsoft 365 services, and views the service dashboard and message center in the [Azure portal](https://portal.azure.com) and [Microsoft 365 admin center](https://admin.microsoft.com). More information at [About admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

> [!NOTE]
> Previously, this role was called "Service Administrator" in [Azure portal](https://portal.azure.com) and [Microsoft 365 admin center](https://admin.microsoft.com). We have renamed it to "Service Support Administrator" to align with the exsiting name in Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## SharePoint Administrator

Users with this role have global permissions within Microsoft SharePoint Online, when the service is present, as well as the ability to create and manage all Microsoft 365 groups, manage support tickets, and monitor service health. More information at [About admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

> [!NOTE]
> In the Microsoft Graph API and Azure AD PowerShell, this role is identified as "SharePoint Service Administrator." It is "SharePoint Administrator" in the [Azure portal](https://portal.azure.com).

> [!NOTE]
> This role also grants scoped permissions to the Microsoft Graph API for Microsoft Intune, allowing the management and configuration of policies related to SharePoint and OneDrive resources.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groups.unified/create | Create Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.unified/delete | Delete Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.unified/restore | Restore Microsoft 365 groups |
> | microsoft.directory/groups.unified/basic/update | Update basic properties on Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.unified/members/update | Update members of Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.unified/owners/update | Update owners of Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.sharePoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in SharePoint |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Skype for Business Administrator

Users with this role have global permissions within Microsoft Skype for Business, when the service is present, as well as manage Skype-specific user attributes in Azure Active Directory. Additionally, this role grants the ability to manage support tickets and monitor service health, and to access the Teams and Skype for Business Admin Center. The account must also be licensed for Teams or it can't run Teams PowerShell cmdlets. More information at [About the Skype for Business admin role](https://support.office.com/article/about-the-skype-for-business-admin-role-aeb35bda-93fc-49b1-ac2c-c74fbeb737b5) and Teams licensing information at [Skype for Business and Microsoft Teams add-on licensing](/skypeforbusiness/skype-for-business-and-microsoft-teams-add-on-licensing/skype-for-business-and-microsoft-teams-add-on-licensing)

> [!NOTE]
> In the Microsoft Graph API and Azure AD PowerShell, this role is identified as "Lync Service Administrator." It is "Skype for Business Administrator" in the [Azure portal](https://portal.azure.com/).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Teams Administrator

Users in this role can manage all aspects of the Microsoft Teams workload via the Microsoft Teams & Skype for Business admin center and the respective PowerShell modules. This includes, among other areas, all management tools related to telephony, messaging, meetings, and the teams themselves. This role additionally grants the ability to create and manage all Microsoft 365 groups, manage support tickets, and monitor service health.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of a group |
> | microsoft.directory/groups.unified/create | Create Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.unified/delete | Delete Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.unified/restore | Restore Microsoft 365 groups |
> | microsoft.directory/groups.unified/basic/update | Update basic properties on Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.unified/members/update | Update members of Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/groups.unified/owners/update | Update owners of Microsoft 365 groups with the exclusion of role-assignable groups |
> | microsoft.directory/servicePrincipals/managePermissionGrantsForGroup.microsoft-all-application-permissions | Grant a service principal direct access to a group's data |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.teams/allEntities/allProperties/allTasks | Manage all resources in Teams |

## Teams Communications Administrator

Users in this role can manage aspects of the Microsoft Teams workload related to voice & telephony. This includes the management tools for telephone number assignment, voice and meeting policies, and full access to the call analytics toolset.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.teams/callQuality/allProperties/read | Read all data in the Call Quality Dashboard (CQD) |
> | microsoft.teams/meetings/allProperties/allTasks | Manage meetings including meeting policies, configurations, and conference bridges |
> | microsoft.teams/voice/allProperties/allTasks | Manage voice including calling policies and phone number inventory and assignment |

## Teams Communications Support Engineer

Users in this role can troubleshoot communication issues within Microsoft Teams & Skype for Business using the user call troubleshooting tools in the Microsoft Teams & Skype for Business admin center. Users in this role can view full call record information for all participants involved. This role has no access to view, create, or manage support tickets.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.teams/callQuality/allProperties/read | Read all data in the Call Quality Dashboard (CQD) |

## Teams Communications Support Specialist

Users in this role can troubleshoot communication issues within Microsoft Teams & Skype for Business using the user call troubleshooting tools in the Microsoft Teams & Skype for Business admin center. Users in this role can only view user details in the call for the specific user they have looked up. This role has no access to view, create, or manage support tickets.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.teams/callQuality/standard/read | Read basic data in the Call Quality Dashboard (CQD) |

## Teams Devices Administrator

Users with this role can manage [Teams-certified devices](https://www.microsoft.com/microsoft-365/microsoft-teams/across-devices/devices) from the Teams Admin Center. This role allows viewing all devices at single glance, with ability to search and filter devices. The user can check details of each device including logged-in account, make and model of the device. The user can change the settings on the device and update the software versions. This role does not grant permissions to check Teams activity and call quality of the device.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.teams/devices/standard/read | Manage all aspects of Teams-certified devices including configuration policies |

## Usage Summary Reports Reader

Users with this role can access tenant level aggregated data and associated insights in Microsoft 365 Admin Center for Usage and Productivity Score but cannot access any user level details or insights. In Microsoft 365 Admin Center for the two reports, we differentiate between tenant level aggregated data and user level details. This role gives an extra layer of protection on individual user identifiable data, which was requested by both customers and legal teams.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.usageReports/allEntities/standard/read | Read tenant-level aggregated Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## User Administrator

Users with this role can create users, and manage all aspects of users with some restrictions (see the table), and can update password expiration policies. Additionally, users with this role can create and manage all groups. This role also includes the ability to create and manage user views, manage support tickets, and monitor service health. User administrators don't have permission to manage some user properties for users in most administrator roles. User with this role do not have permissions to manage MFA. The roles that are exceptions to this restriction are listed in the following table.

| User Administrator permission | Notes |
| --- | --- |
| Create users and groups<br/>Create and manage user views<br/>Manage Office support tickets<br/>Update password expiration policies |  |
| Manage licenses<br/>Manage all user properties except User Principal Name | Applies to all users, including all admins |
| Delete and restore<br/>Disable and enable<br/>Manage all user properties including User Principal Name<br/>Update (FIDO) device keys | Applies to users who are non-admins or in any of the following roles:<ul><li>Helpdesk Administrator</li><li>User with no role</li><li>User Administrator</li></ul> |
| Invalidate refresh Tokens<br/>Reset password | For a list of the roles that a User Administrator can reset passwords for and invalidate refresh tokens, see [Password reset permissions](#password-reset-permissions). |

> [!IMPORTANT]
> Users with this role can change passwords for people who may have access to sensitive or private information or critical configuration inside and outside of Azure Active Directory. Changing the password of a user may mean the ability to assume that user's identity and permissions. For example:
>
>- Application Registration and Enterprise Application owners, who can manage credentials of apps they own. Those apps may have privileged permissions in Azure AD and elsewhere not granted to User Administrators. Through this path a User Administrator may be able to assume the identity of an application owner and then further assume the identity of a privileged application by updating the credentials for the application.
>- Azure subscription owners, who may have access to sensitive or private information or critical configuration in Azure.
>- Security Group and Microsoft 365 group owners, who can manage group membership. Those groups may grant access to sensitive or private information or critical configuration in Azure AD and elsewhere.
>- Administrators in other services outside of Azure AD like Exchange Online, Office Security and Compliance Center, and human resources systems.
>- Non-administrators like executives, legal counsel, and human resources employees who may have access to sensitive or private information.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/appRoleAssignments/create | Create application role assignments |
> | microsoft.directory/appRoleAssignments/delete | Delete application role assignments |
> | microsoft.directory/appRoleAssignments/basic/update | Update basic properties of application role assignments |
> | microsoft.directory/contacts/create | Create contacts |
> | microsoft.directory/contacts/delete | Delete contacts |
> | microsoft.directory/contacts/basic/update | Update basic properties on contacts |
> | microsoft.directory/entitlementManagement/allProperties/allTasks | Create and delete resources, and read and update all properties in Azure AD entitlement management |
> | microsoft.directory/groups/assignLicense | Assign product licenses to groups for group-based licensing |
> | microsoft.directory/groups/create | Create groups, excluding role-assignable groups |
> | microsoft.directory/groups/delete | Delete groups, excluding role-assignable group |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of a group |
> | microsoft.directory/groups/reprocessLicenseAssignment | Reprocess license assignments for group-based licensing |
> | microsoft.directory/groups/restore | Restore deleted groups |
> | microsoft.directory/groups/basic/update | Update basic properties on groups, excluding role-assignable groups |
> | microsoft.directory/groups/classification/update | Update the classification property of groups, excluding role-assignable groups |
> | microsoft.directory/groups/dynamicMembershipRule/update | Update dynamic membership rule of groups, excluding role-assignable groups |
> | microsoft.directory/groups/groupType/update | Update the groupType property for a group |
> | microsoft.directory/groups/members/update | Update members of groups, excluding role-assignable groups |
> | microsoft.directory/groups/onPremWriteBack/update | Update Azure Active Directory groups to be written back to on-premises with Azure AD Connect |
> | microsoft.directory/groups/owners/update | Update owners of groups, excluding role-assignable groups |
> | microsoft.directory/groups/settings/update | Update settings of groups |
> | microsoft.directory/groups/visibility/update | Update the visibility property of groups |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/users/assignLicense | Manage user licenses |
> | microsoft.directory/users/create | Add users |
> | microsoft.directory/users/delete | Delete users |
> | microsoft.directory/users/disable | Disable users |
> | microsoft.directory/users/enable | Enable users |
> | microsoft.directory/users/inviteGuest | Invite guest users |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens |
> | microsoft.directory/users/reprocessLicenseAssignment | Reprocess license assignments for users |
> | microsoft.directory/users/restore | Restore deleted users |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.directory/users/password/update | Reset passwords for all users |
> | microsoft.directory/users/userPrincipalName/update | Update User Principal Name of users |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## How to understand role permissions

The schema for permissions loosely follows the REST format of Microsoft Graph:

`<namespace>/<entity>/<propertySet>/<action>`

For example:

`microsoft.directory/applications/credentials/update`

| Permission element | Description |
| --- | --- |
| namespace | Product or service that exposes the task and is prepended with `microsoft`. For example, all tasks in Azure AD use the `microsoft.directory` namespace. |
| entity | Logical feature or component exposed by the service in Microsoft Graph. For example, Azure AD exposes User and Groups, OneNote exposes Notes, and Exchange exposes Mailboxes and Calendars. There is a special `allEntities` keyword for specifying all entities in a namespace. This is often used in roles that grant access to an entire product. |
| propertySet | Specific properties or aspects of the entity for which access is being granted. For example, `microsoft.directory/applications/authentication/read` grants the ability to read the reply URL, logout URL, and implicit flow property on the application object in Azure AD.<ul><li>`allProperties` designates all properties of the entity, including privileged properties.</li><li>`standard` designates common properties, but excludes privileged ones related to `read` action. For example, `microsoft.directory/user/standard/read` includes the ability to read standard properties like public phone number and email address, but not the private secondary phone number or email address used for multi-factor authentication.</li><li>`basic` designates common properties, but excludes privileged ones related to the `update` action. The set of properties that you can read may be different from what you can update. That’s why there are `standard` and `basic` keywords to reflect that.</li></ul> |
| action | Operation being granted, most typically create, read, update, or delete (CRUD). There is a special `allTasks` keyword for specifying all of the above abilities (create, read, update, and delete). |

## Deprecated roles

The following roles should not be used. They have been deprecated and will be removed from Azure AD in the future.

* AdHoc License Administrator
* Device Join
* Device Managers
* Device Users
* Email Verified User Creator
* Mailbox Administrator
* Workplace Device Join

## Roles not shown in the portal

Not every role returned by PowerShell or MS Graph API is visible in Azure portal. The following table organizes those differences.

API name | Azure portal name | Notes
-------- | ------------------- | -------------
Device Join | Deprecated | [Deprecated roles documentation](#deprecated-roles)
Device Managers | Deprecated | [Deprecated roles documentation](#deprecated-roles)
Device Users | Deprecated | [Deprecated roles documentation](#deprecated-roles)
Directory Synchronization Accounts | Not shown because it shouldn't be used | [Directory Synchronization Accounts documentation](#directory-synchronization-accounts)
Guest User | Not shown because it can't be used | NA
Partner Tier 1 Support | Not shown because it shouldn't be used | [Partner Tier1 Support documentation](#partner-tier1-support)
Partner Tier 2 Support | Not shown because it shouldn't be used | [Partner Tier2 Support documentation](#partner-tier2-support)
Restricted Guest User | Not shown because it can't be used | NA
User | Not shown because it can't be used | NA
Workplace Device Join | Deprecated | [Deprecated roles documentation](#deprecated-roles)

## Password reset permissions

Column headings represent the roles that can reset passwords. Table rows contain the roles for which their password can be reset.

Password can be reset | Password Admin | Helpdesk Admin | Authentication Admin | User Admin | Privileged Authentication Admin | Global Admin
------ | ------ | ------ | ------ | ------ | ------ | ------
Authentication Admin | &nbsp; | &nbsp; | :heavy_check_mark: | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
Directory Readers | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Global Admin | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:\*
Groups Admin | &nbsp; | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Guest Inviter | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Helpdesk Admin | &nbsp; | :heavy_check_mark: | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Message Center Reader | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Password Admin | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Privileged Authentication Admin | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
Privileged Role Admin | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
Reports Reader | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
User (no admin role) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
User Admin | &nbsp; | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Usage Summary Reports Reader | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:

\* A Global Administrator cannot remove their own Global Administrator assignment. This is to prevent a situation where an organization has 0 Global Administrators.

## Next steps

- [Assign Azure AD roles to groups](groups-assign-role.md)
- [Understand the different roles](../../role-based-access-control/rbac-and-directory-admin-roles.md)
- [Assign a user as an administrator of an Azure subscription](../../role-based-access-control/role-assignments-portal-subscription-admin.md)
