---
title: Microsoft Entra built-in roles
description: Describes the Microsoft Entra built-in roles and permissions.
services: active-directory
author: rolyon
manager: amycolannino
search.appverid: MET150
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: reference
ms.date: 10/03/2023
ms.author: rolyon
ms.reviewer: abhijeetsinha
ms.custom: generated, it-pro, fasttrack-edit
ms.collection: M365-identity-device-management
---

# Microsoft Entra built-in roles

In Microsoft Entra ID, if another administrator or non-administrator needs to manage Microsoft Entra resources, you assign them an Microsoft Entra role that provides the permissions they need. For example, you can assign roles to allow adding or changing users, resetting user passwords, managing user licenses, or managing domain names.

This article lists the Microsoft Entra built-in roles you can assign to allow management of Microsoft Entra resources. For information about how to assign roles, see [Assign Microsoft Entra roles to users](manage-roles-portal.md). If you are looking for roles to manage Azure resources, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

## All roles

> [!div class="mx-tableFixed"]
> | Role | Description | Template ID |
> | --- | --- | --- |
> | [Application Administrator](#application-administrator) | Can create and manage all aspects of app registrations and enterprise apps.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 9b895d92-2cd3-44c7-9d02-a6ac2d5ea5c3 |
> | [Application Developer](#application-developer) | Can create application registrations independent of the 'Users can register applications' setting.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | cf1c38e5-3621-4004-a7cb-879624dced7c |
> | [Attack Payload Author](#attack-payload-author) | Can create attack payloads that an administrator can initiate later. | 9c6df0f2-1e7c-4dc3-b195-66dfbd24aa8f |
> | [Attack Simulation Administrator](#attack-simulation-administrator) | Can create and manage all aspects of attack simulation campaigns. | c430b396-e693-46cc-96f3-db01bf8bb62a |
> | [Attribute Assignment Administrator](#attribute-assignment-administrator) | Assign custom security attribute keys and values to supported Microsoft Entra objects. | 58a13ea3-c632-46ae-9ee0-9c0d43cd7f3d |
> | [Attribute Assignment Reader](#attribute-assignment-reader) | Read custom security attribute keys and values for supported Microsoft Entra objects. | ffd52fa5-98dc-465c-991d-fc073eb59f8f |
> | [Attribute Definition Administrator](#attribute-definition-administrator) | Define and manage the definition of custom security attributes. | 8424c6f0-a189-499e-bbd0-26c1753c96d4 |
> | [Attribute Definition Reader](#attribute-definition-reader) | Read the definition of custom security attributes. | 1d336d2c-4ae8-42ef-9711-b3604ce3fc2c |
> | [Authentication Administrator](#authentication-administrator) | Can access to view, set and reset authentication method information for any non-admin user.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | c4e39bd9-1100-46d3-8c65-fb160da0071f |
> | [Authentication Policy Administrator](#authentication-policy-administrator) | Can create and manage the authentication methods policy, tenant-wide MFA settings, password protection policy, and verifiable credentials. | 0526716b-113d-4c15-b2c8-68e3c22b9f80 |
> | [Azure AD Joined Device Local Administrator](#azure-ad-joined-device-local-administrator) | Users assigned to this role are added to the local administrators group on Microsoft Entra joined devices. | 9f06204d-73c1-4d4c-880a-6edb90606fd8 |
> | [Azure DevOps Administrator](#azure-devops-administrator) | Can manage Azure DevOps policies and settings. | e3973bdf-4987-49ae-837a-ba8e231c7286 |
> | [Azure Information Protection Administrator](#azure-information-protection-administrator) | Can manage all aspects of the Azure Information Protection product. | 7495fdc4-34c4-4d15-a289-98788ce399fd |
> | [B2C IEF Keyset Administrator](#b2c-ief-keyset-administrator) | Can manage secrets for federation and encryption in the Identity Experience Framework (IEF).<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | aaf43236-0c0d-4d5f-883a-6955382ac081 |
> | [B2C IEF Policy Administrator](#b2c-ief-policy-administrator) | Can create and manage trust framework policies in the Identity Experience Framework (IEF). | 3edaf663-341e-4475-9f94-5c398ef6c070 |
> | [Billing Administrator](#billing-administrator) | Can perform common billing related tasks like updating payment information. | b0f54661-2d74-4c50-afa3-1ec803f12efe |
> | [Cloud App Security Administrator](#cloud-app-security-administrator) | Can manage all aspects of the Defender for Cloud Apps product. | 892c5842-a9a6-463a-8041-72aa08ca3cf6 |
> | [Cloud Application Administrator](#cloud-application-administrator) | Can create and manage all aspects of app registrations and enterprise apps except App Proxy.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 158c047a-c907-4556-b7ef-446551a6b5f7 |
> | [Cloud Device Administrator](#cloud-device-administrator) | Limited access to manage devices in Microsoft Entra ID.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 7698a772-787b-4ac8-901f-60d6b08affd2 |
> | [Compliance Administrator](#compliance-administrator) | Can read and manage compliance configuration and reports in Microsoft Entra ID and Microsoft 365. | 17315797-102d-40b4-93e0-432062caca18 |
> | [Compliance Data Administrator](#compliance-data-administrator) | Creates and manages compliance content. | e6d1a23a-da11-4be4-9570-befc86d067a7 |
> | [Conditional Access Administrator](#conditional-access-administrator) | Can manage Conditional Access capabilities.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | b1be1c3e-b65d-4f19-8427-f6fa0d97feb9 |
> | [Customer LockBox Access Approver](#customer-lockbox-access-approver) | Can approve Microsoft support requests to access customer organizational data. | 5c4f9dcd-47dc-4cf7-8c9a-9e4207cbfc91 |
> | [Desktop Analytics Administrator](#desktop-analytics-administrator) | Can access and manage Desktop management tools and services. | 38a96431-2bdf-4b4c-8b6e-5d3d8abac1a4 |
> | [Directory Readers](#directory-readers) | Can read basic directory information. Commonly used to grant directory read access to applications and guests. | 88d8e3e3-8f55-4a1e-953a-9b9898b8876b |
> | [Directory Synchronization Accounts](#directory-synchronization-accounts) | Only used by Microsoft Entra Connect service.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | d29b2b05-8046-44ba-8758-1e26182fcf32 |
> | [Directory Writers](#directory-writers) | Can read and write basic directory information. For granting access to applications, not intended for users.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 9360feb5-f418-4baa-8175-e2a00bac4301 |
> | [Domain Name Administrator](#domain-name-administrator) | Can manage domain names in cloud and on-premises. | 8329153b-31d0-4727-b945-745eb3bc5f31 |
> | [Dynamics 365 Administrator](#dynamics-365-administrator) | Can manage all aspects of the Dynamics 365 product. | 44367163-eba1-44c3-98af-f5787879f96a |
> | [Edge Administrator](#edge-administrator) | Manage all aspects of Microsoft Edge. | 3f1acade-1e04-4fbc-9b69-f0302cd84aef |
> | [Exchange Administrator](#exchange-administrator) | Can manage all aspects of the Exchange product. | 29232cdf-9323-42fd-ade2-1d097af3e4de |
> | [Exchange Recipient Administrator](#exchange-recipient-administrator) | Can create or update Exchange Online recipients within the Exchange Online organization. | 31392ffb-586c-42d1-9346-e59415a2cc4e |
> | [External ID User Flow Administrator](#external-id-user-flow-administrator) | Can create and manage all aspects of user flows. | 6e591065-9bad-43ed-90f3-e9424366d2f0 |
> | [External ID User Flow Attribute Administrator](#external-id-user-flow-attribute-administrator) | Can create and manage the attribute schema available to all user flows. | 0f971eea-41eb-4569-a71e-57bb8a3eff1e |
> | [External Identity Provider Administrator](#external-identity-provider-administrator) | Can configure identity providers for use in direct federation. | be2f45a1-457d-42af-a067-6ec1fa63bc45 |
> | [Fabric Administrator](#fabric-administrator) | Can manage all aspects of the Fabric and Power BI products. | a9ea8996-122f-4c74-9520-8edcd192826c |
> | [Global Administrator](#global-administrator) | Can manage all aspects of Microsoft Entra ID and Microsoft services that use Microsoft Entra identities.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 62e90394-69f5-4237-9190-012177145e10 |
> | [Global Reader](#global-reader) | Can read everything that a Global Administrator can, but not update anything.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | f2ef992c-3afb-46b9-b7cf-a126ee74c451 |
> | [Global Secure Access Administrator](#global-secure-access-administrator) | Create and manage all aspects of Microsoft Entra Internet Access and Microsoft Entra Private Access, including managing access to public and private endpoints. | ac434307-12b9-4fa1-a708-88bf58caabc1 |
> | [Groups Administrator](#groups-administrator) | Members of this role can create/manage groups, create/manage groups settings like naming and expiration policies, and view groups activity and audit reports. | fdd7a751-b60b-444a-984c-02652fe8fa1c |
> | [Guest Inviter](#guest-inviter) | Can invite guest users independent of the 'members can invite guests' setting. | 95e79109-95c0-4d8e-aee3-d01accf2d47b |
> | [Helpdesk Administrator](#helpdesk-administrator) | Can reset passwords for non-administrators and Helpdesk Administrators.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 729827e3-9c14-49f7-bb1b-9608f156bbb8 |
> | [Hybrid Identity Administrator](#hybrid-identity-administrator) | Can manage Active Directory to Microsoft Entra cloud provisioning, Microsoft Entra Connect, Pass-through Authentication (PTA), Password hash synchronization (PHS), Seamless Single sign-on (Seamless SSO), and federation settings.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 8ac3fc64-6eca-42ea-9e69-59f4c7b60eb2 |
> | [Identity Governance Administrator](#identity-governance-administrator) | Manage access using Microsoft Entra ID for identity governance scenarios. | 45d8d3c5-c802-45c6-b32a-1d70b5e1e86e |
> | [Insights Administrator](#insights-administrator) | Has administrative access in the Microsoft 365 Insights app. | eb1f4a8d-243a-41f0-9fbd-c7cdf6c5ef7c |
> | [Insights Analyst](#insights-analyst) | Access the analytical capabilities in Microsoft Viva Insights and run custom queries. | 25df335f-86eb-4119-b717-0ff02de207e9 |
> | [Insights Business Leader](#insights-business-leader) | Can view and share dashboards and insights via the Microsoft 365 Insights app. | 31e939ad-9672-4796-9c2e-873181342d2d |
> | [Intune Administrator](#intune-administrator) | Can manage all aspects of the Intune product.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 3a2c62db-5318-420d-8d74-23affee5d9d5 |
> | [Kaizala Administrator](#kaizala-administrator) | Can manage settings for Microsoft Kaizala. | 74ef975b-6605-40af-a5d2-b9539d836353 |
> | [Knowledge Administrator](#knowledge-administrator) | Can configure knowledge, learning, and other intelligent features. | b5a8dcf3-09d5-43a9-a639-8e29ef291470 |
> | [Knowledge Manager](#knowledge-manager) | Can organize, create, manage, and promote topics and knowledge. | 744ec460-397e-42ad-a462-8b3f9747a02c |
> | [License Administrator](#license-administrator) | Can manage product licenses on users and groups. | 4d6ac14f-3453-41d0-bef9-a3e0c569773a |
> | [Lifecycle Workflows Administrator](#lifecycle-workflows-administrator) | Create and manage all aspects of workflows and tasks associated with Lifecycle Workflows in Microsoft Entra ID. | 59d46f88-662b-457b-bceb-5c3809e5908f |
> | [Message Center Privacy Reader](#message-center-privacy-reader) | Can read security messages and updates in Office 365 Message Center only. | ac16e43d-7b2d-40e0-ac05-243ff356ab5b |
> | [Message Center Reader](#message-center-reader) | Can read messages and updates for their organization in Office 365 Message Center only. | 790c1fb9-7f7d-4f88-86a1-ef1f95c05c1b |
> | [Microsoft Hardware Warranty Administrator](#microsoft-hardware-warranty-administrator) | Create and manage all aspects warranty claims and entitlements for Microsoft manufactured hardware, like Surface and HoloLens. | 1501b917-7653-4ff9-a4b5-203eaf33784f |
> | [Microsoft Hardware Warranty Specialist](#microsoft-hardware-warranty-specialist) | Create and read warranty claims for Microsoft manufactured hardware, like Surface and HoloLens. | 281fe777-fb20-4fbb-b7a3-ccebce5b0d96 |
> | [Modern Commerce User](#modern-commerce-user) | Can manage commercial purchases for a company, department or team. | d24aef57-1500-4070-84db-2666f29cf966 |
> | [Network Administrator](#network-administrator) | Can manage network locations and review enterprise network design insights for Microsoft 365 Software as a Service applications. | d37c8bed-0711-4417-ba38-b4abe66ce4c2 |
> | [Office Apps Administrator](#office-apps-administrator) | Can manage Office apps cloud services, including policy and settings management, and manage the ability to select, unselect and publish 'what's new' feature content to end-user's devices. | 2b745bdf-0803-4d80-aa65-822c4493daac |
> | [Organizational Messages Writer](#organizational-messages-writer) | Write, publish, manage, and review the organizational messages for end-users through Microsoft product surfaces. | 507f53e4-4e52-4077-abd3-d2e1558b6ea2 |
> | [Partner Tier1 Support](#partner-tier1-support) | Do not use - not intended for general use.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 4ba39ca4-527c-499a-b93d-d9b492c50246 |
> | [Partner Tier2 Support](#partner-tier2-support) | Do not use - not intended for general use.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | e00e864a-17c5-4a4b-9c06-f5b95a8d5bd8 |
> | [Password Administrator](#password-administrator) | Can reset passwords for non-administrators and Password Administrators.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 966707d0-3269-4727-9be2-8c3a10f19b9d |
> | [Permissions Management Administrator](#permissions-management-administrator) | Manage all aspects of Microsoft Entra Permissions Management. | af78dc32-cf4d-46f9-ba4e-4428526346b5 |
> | [Power Platform Administrator](#power-platform-administrator) | Can create and manage all aspects of Microsoft Dynamics 365, Power Apps and Power Automate. | 11648597-926c-4cf3-9c36-bcebb0ba8dcc |
> | [Printer Administrator](#printer-administrator) | Can manage all aspects of printers and printer connectors. | 644ef478-e28f-4e28-b9dc-3fdde9aa0b1f |
> | [Printer Technician](#printer-technician) | Can register and unregister printers and update printer status. | e8cef6f1-e4bd-4ea8-bc07-4b8d950f4477 |
> | [Privileged Authentication Administrator](#privileged-authentication-administrator) | Can access to view, set and reset authentication method information for any user (admin or non-admin).<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 7be44c8a-adaf-4e2a-84d6-ab2649e08a13 |
> | [Privileged Role Administrator](#privileged-role-administrator) | Can manage role assignments in Microsoft Entra ID, and all aspects of Privileged Identity Management.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | e8611ab8-c189-46e8-94e1-60213ab1f814 |
> | [Reports Reader](#reports-reader) | Can read sign-in and audit reports. | 4a5d8f65-41da-4de4-8968-e035b65339cf |
> | [Search Administrator](#search-administrator) | Can create and manage all aspects of Microsoft Search settings. | 0964bb5e-9bdb-4d7b-ac29-58e794862a40 |
> | [Search Editor](#search-editor) | Can create and manage the editorial content such as bookmarks, Q and As, locations, floorplan. | 8835291a-918c-4fd7-a9ce-faa49f0cf7d9 |
> | [Security Administrator](#security-administrator) | Can read security information and reports, and manage configuration in Microsoft Entra ID and Office 365.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 194ae4cb-b126-40b2-bd5b-6091b380977d |
> | [Security Operator](#security-operator) | Creates and manages security events.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 5f2222b1-57c3-48ba-8ad5-d4759f1fde6f |
> | [Security Reader](#security-reader) | Can read security information and reports in Microsoft Entra ID and Office 365.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | 5d6b6bb7-de71-4623-b4af-96380a352509 |
> | [Service Support Administrator](#service-support-administrator) | Can read service health information and manage support tickets. | f023fd81-a637-4b56-95fd-791ac0226033 |
> | [SharePoint Administrator](#sharepoint-administrator) | Can manage all aspects of the SharePoint service. | f28a1f50-f6e7-4571-818b-6a12f2af6b6c |
> | [Skype for Business Administrator](#skype-for-business-administrator) | Can manage all aspects of the Skype for Business product. | 75941009-915a-4869-abe7-691bff18279e |
> | [Teams Administrator](#teams-administrator) | Can manage the Microsoft Teams service. | 69091246-20e8-4a56-aa4d-066075b2a7a8 |
> | [Teams Communications Administrator](#teams-communications-administrator) | Can manage calling and meetings features within the Microsoft Teams service. | baf37b3a-610e-45da-9e62-d9d1e5e8914b |
> | [Teams Communications Support Engineer](#teams-communications-support-engineer) | Can troubleshoot communications issues within Teams using advanced tools. | f70938a0-fc10-4177-9e90-2178f8765737 |
> | [Teams Communications Support Specialist](#teams-communications-support-specialist) | Can troubleshoot communications issues within Teams using basic tools. | fcf91098-03e3-41a9-b5ba-6f0ec8188a12 |
> | [Teams Devices Administrator](#teams-devices-administrator) | Can perform management related tasks on Teams certified devices. | 3d762c5a-1b6c-493f-843e-55a3b42923d4 |
> | [Tenant Creator](#tenant-creator) | Create new Microsoft Entra or Azure AD B2C tenants. | 112ca1a2-15ad-4102-995e-45b0bc479a6a |
> | [Usage Summary Reports Reader](#usage-summary-reports-reader) | Read Usage reports and Adoption Score, but can't access user details. | 75934031-6c7e-415a-99d7-48dbd49e875e |
> | [User Administrator](#user-administrator) | Can manage all aspects of users and groups, including resetting passwords for limited admins.<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) | fe930be7-5e62-47db-91af-98c3a49a38b1 |
> | [Virtual Visits Administrator](#virtual-visits-administrator) | Manage and share Virtual Visits information and metrics from admin centers or the Virtual Visits app. | e300d9e7-4a2b-4295-9eff-f1c78b36cc98 |
> | [Viva Goals Administrator](#viva-goals-administrator) | Manage and configure all aspects of Microsoft Viva Goals. | 92b086b3-e367-4ef2-b869-1de128fb986e |
> | [Viva Pulse Administrator](#viva-pulse-administrator) | Can manage all settings for Microsoft Viva Pulse app. | 87761b17-1ed2-4af3-9acd-92a150038160 |
> | [Windows 365 Administrator](#windows-365-administrator) | Can provision and manage all aspects of Cloud PCs. | 11451d60-acb2-45eb-a7d6-43d0f0125c13 |
> | [Windows Update Deployment Administrator](#windows-update-deployment-administrator) | Can create and manage all aspects of Windows Update deployments through the Windows Update for Business deployment service. | 32696413-001a-46ae-978c-ce0f6b3620d2 |
> | [Yammer Administrator](#yammer-administrator) | Manage all aspects of the Yammer service. | 810a2642-a034-447f-a5e8-41beaa378541 |

## Application Administrator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users in this role can create and manage all aspects of enterprise applications, application registrations, and application proxy settings. Note that users assigned to this role are not added as owners when creating new application registrations or enterprise applications.

This role also grants the ability to consent for delegated permissions and application permissions, with the exception of application permissions for Microsoft Graph.

> [!IMPORTANT]
> This exception means that you can still consent to application permissions for _other_ apps (for example, non-Microsoft apps or apps that you have registered). You can still _request_ these permissions as part of the app registration, but _granting_ (that is, consenting to) these permissions requires a more privileged administrator, such as Global Administrator.
>
>This role grants the ability to manage application credentials. Users assigned this role can add credentials to an application, and use those credentials to impersonate the application’s identity. If the application’s identity has been granted access to a resource, such as the ability to create or update User or other objects, then a user assigned to this role could perform those actions while impersonating the application. This ability to impersonate the application’s identity may be an elevation of privilege over what the user can do via their role assignments. It is important to understand that assigning a user to the Application Administrator role gives them the ability to impersonate an application’s identity.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/adminConsentRequestPolicy/allProperties/allTasks | Manage admin consent request policies in Microsoft Entra ID |
> | microsoft.directory/appConsent/appConsentRequests/allProperties/read | Read all properties of consent requests for applications registered with Microsoft Entra ID |
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
> | microsoft.directory/applications/credentials/update | Update application credentials<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/applications/extensionProperties/update | Update extension properties on applications |
> | microsoft.directory/applications/notes/update | Update notes of applications |
> | microsoft.directory/applications/owners/update | Update owners of applications |
> | microsoft.directory/applications/permissions/update | Update exposed permissions and required permissions on all types of applications |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/applications/tag/update | Update tags of applications |
> | microsoft.directory/applications/verification/update | Update applicationsverification property |
> | microsoft.directory/applications/synchronization/standard/read | Read provisioning settings associated with the application object |
> | microsoft.directory/applicationTemplates/instantiate | Instantiate gallery applications from application templates |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, excluding custom security attributes audit logs |
> | microsoft.directory/connectors/create | Create application proxy connectors |
> | microsoft.directory/connectors/allProperties/read | Read all properties of application proxy connectors |
> | microsoft.directory/connectorGroups/create | Create application proxy connector groups |
> | microsoft.directory/connectorGroups/delete | Delete application proxy connector groups |
> | microsoft.directory/connectorGroups/allProperties/read | Read all properties of application proxy connector groups |
> | microsoft.directory/connectorGroups/allProperties/update | Update all properties of application proxy connector groups |
> | microsoft.directory/customAuthenticationExtensions/allProperties/allTasks | Create and manage custom authentication extensions<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/deletedItems.applications/delete | Permanently delete applications, which can no longer be restored |
> | microsoft.directory/deletedItems.applications/restore | Restore soft deleted applications to original state |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
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
> | microsoft.directory/servicePrincipals/synchronizationJobs/manage | Start, restart, and pause application provisioning synchronization jobs |
> | microsoft.directory/servicePrincipals/synchronizationSchema/manage | Create and manage application provisioning synchronization jobs and schema |
> | microsoft.directory/servicePrincipals/managePasswordSingleSignOnCredentials | Read password single sign-on credentials on service principals |
> | microsoft.directory/servicePrincipals/managePermissionGrantsForAll.microsoft-application-admin | Grant consent for application permissions and delegated permissions on behalf of any user or all users, except for application permissions for Microsoft Graph |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/servicePrincipals/audience/update | Update audience properties on service principals |
> | microsoft.directory/servicePrincipals/authentication/update | Update authentication properties on service principals |
> | microsoft.directory/servicePrincipals/basic/update | Update basic properties on service principals |
> | microsoft.directory/servicePrincipals/credentials/update | Update credentials of service principals<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/servicePrincipals/notes/update | Update notes of service principals |
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

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users in this role can create application registrations when the "Users can register applications" setting is set to No. This role also grants permission to consent on one's own behalf when the "Users can consent to apps accessing company data on their behalf" setting is set to No. Users assigned to this role are added as owners when creating new application registrations.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/createAsOwner | Create all types of applications, and creator is added as the first owner |
> | microsoft.directory/oAuth2PermissionGrants/createAsOwner | Create OAuth 2.0 permission grants, with creator as the first owner<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/servicePrincipals/createAsOwner | Create service principals, with creator as the first owner |

## Attack Payload Author

Users in this role can create attack payloads but not actually launch or schedule them. Attack payloads are then available to all administrators in the tenant who can use them to create a simulation.

For more information, see [Microsoft Defender for Office 365 permissions in the Microsoft 365 Defender portal](/microsoft-365/security/office-365-security/mdo-portal-permissions) and [Permissions in the Microsoft Purview compliance portal](/microsoft-365/compliance/microsoft-365-compliance-center-permissions).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.protectionCenter/attackSimulator/payload/allProperties/allTasks | Create and manage attack payloads in Attack Simulator |
> | microsoft.office365.protectionCenter/attackSimulator/reports/allProperties/read | Read reports of attack simulation, responses, and associated training |

## Attack Simulation Administrator

Users in this role can create and manage all aspects of attack simulation creation, launch/scheduling of a simulation, and the review of simulation results. Members of this role have this access for all simulations in the tenant.

For more information, see [Microsoft Defender for Office 365 permissions in the Microsoft 365 Defender portal](/microsoft-365/security/office-365-security/mdo-portal-permissions) and [Permissions in the Microsoft Purview compliance portal](/microsoft-365/compliance/microsoft-365-compliance-center-permissions).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.protectionCenter/attackSimulator/payload/allProperties/allTasks | Create and manage attack payloads in Attack Simulator |
> | microsoft.office365.protectionCenter/attackSimulator/reports/allProperties/read | Read reports of attack simulation, responses, and associated training |
> | microsoft.office365.protectionCenter/attackSimulator/simulation/allProperties/allTasks | Create and manage attack simulation templates in Attack Simulator |

## Attribute Assignment Administrator

Users with this role can assign and remove custom security attribute keys and values for supported Microsoft Entra objects such as users, service principals, and devices.

By default, [Global Administrator](#global-administrator) and other administrator roles do not have permissions to read, define, or assign custom security attributes. To work with custom security attributes, you must be assigned one of the custom security attribute roles.

For more information, see [Manage access to custom security attributes in Microsoft Entra ID](../fundamentals/custom-security-attributes-manage.md).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/attributeSets/allProperties/read | Read all properties of attribute sets |
> | microsoft.directory/customSecurityAttributeDefinitions/allProperties/read | Read all properties of custom security attribute definitions |
> | microsoft.directory/devices/customSecurityAttributes/read | Read custom security attribute values for devices |
> | microsoft.directory/devices/customSecurityAttributes/update | Update custom security attribute values for devices |
> | microsoft.directory/servicePrincipals/customSecurityAttributes/read | Read custom security attribute values for service principals |
> | microsoft.directory/servicePrincipals/customSecurityAttributes/update | Update custom security attribute values for service principals |
> | microsoft.directory/users/customSecurityAttributes/read | Read custom security attribute values for users |
> | microsoft.directory/users/customSecurityAttributes/update | Update custom security attribute values for users |

## Attribute Assignment Reader

Users with this role can read custom security attribute keys and values for supported Microsoft Entra objects.

By default, [Global Administrator](#global-administrator) and other administrator roles do not have permissions to read, define, or assign custom security attributes. To work with custom security attributes, you must be assigned one of the custom security attribute roles.

For more information, see [Manage access to custom security attributes in Microsoft Entra ID](../fundamentals/custom-security-attributes-manage.md).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/attributeSets/allProperties/read | Read all properties of attribute sets |
> | microsoft.directory/customSecurityAttributeDefinitions/allProperties/read | Read all properties of custom security attribute definitions |
> | microsoft.directory/devices/customSecurityAttributes/read | Read custom security attribute values for devices |
> | microsoft.directory/servicePrincipals/customSecurityAttributes/read | Read custom security attribute values for service principals |
> | microsoft.directory/users/customSecurityAttributes/read | Read custom security attribute values for users |

## Attribute Definition Administrator

Users with this role can define a valid set of custom security attributes that can be assigned to supported Microsoft Entra objects. This role can also activate and deactivate custom security attributes.

By default, [Global Administrator](#global-administrator) and other administrator roles do not have permissions to read, define, or assign custom security attributes. To work with custom security attributes, you must be assigned one of the custom security attribute roles.

For more information, see [Manage access to custom security attributes in Microsoft Entra ID](../fundamentals/custom-security-attributes-manage.md).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/attributeSets/allProperties/allTasks | Manage all aspects of attribute sets |
> | microsoft.directory/customSecurityAttributeDefinitions/allProperties/allTasks | Manage all aspects of custom security attribute definitions |

## Attribute Definition Reader

Users with this role can read the definition of custom security attributes.

By default, [Global Administrator](#global-administrator) and other administrator roles do not have permissions to read, define, or assign custom security attributes. To work with custom security attributes, you must be assigned one of the custom security attribute roles.

For more information, see [Manage access to custom security attributes in Microsoft Entra ID](../fundamentals/custom-security-attributes-manage.md).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/attributeSets/allProperties/read | Read all properties of attribute sets |
> | microsoft.directory/customSecurityAttributeDefinitions/allProperties/read | Read all properties of custom security attribute definitions |

## Authentication Administrator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Assign the Authentication Administrator role to users who need to do the following:

- Set or reset any authentication method (including passwords) for non-administrators and some roles. For a list of the roles that an Authentication Administrator can read or update authentication methods, see [Who can reset passwords](privileged-roles-permissions.md#who-can-reset-passwords).
- Require users who are non-administrators or assigned to some roles to re-register against existing non-password credentials (for example, MFA or FIDO), and can also revoke **remember MFA on the device**, which prompts for MFA on the next sign-in.
- Perform sensitive actions for some users. For more information, see [Who can perform sensitive actions](privileged-roles-permissions.md#who-can-perform-sensitive-actions).
- Create and manage support tickets in Azure and the Microsoft 365 admin center.

Users with this role **cannot** do the following:

- Cannot change the credentials or reset MFA for members and owners of a [role-assignable group](groups-concept.md).
- Cannot manage MFA settings in the legacy MFA management portal or Hardware OATH tokens. The same functions can be accomplished using the [Set-MsolUser](/powershell/module/msonline/set-msoluser) commandlet Azure AD PowerShell module.

[!INCLUDE [authentication-table-include](./includes/authentication-table-include.md)]

> [!IMPORTANT]
> Users with this role can change credentials for people who may have access to sensitive or private information or critical configuration inside and outside of Microsoft Entra ID. Changing the credentials of a user may mean the ability to assume that user's identity and permissions. For example:
>
>* Application Registration and Enterprise Application owners, who can manage credentials of apps they own. Those apps may have privileged permissions in Microsoft Entra ID and elsewhere not granted to Authentication Administrators. Through this path an Authentication Administrator can assume the identity of an application owner and then further assume the identity of a privileged application by updating the credentials for the application.
>* Azure subscription owners, who may have access to sensitive or private information or critical configuration in Azure.
>* Security Group and Microsoft 365 group owners, who can manage group membership. Those groups may grant access to sensitive or private information or critical configuration in Microsoft Entra ID and elsewhere.
>* Administrators in other services outside of Microsoft Entra ID like Exchange Online, Microsoft 365 Defender portal, Microsoft Purview compliance portal, and human resources systems.
>* Non-administrators like executives, legal counsel, and human resources employees who may have access to sensitive or private information.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/users/authenticationMethods/create | Update authentication methods for users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/authenticationMethods/delete | Delete authentication methods for users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/authenticationMethods/standard/restrictedRead | Read standard properties of authentication methods that do not include personally identifiable information for users |
> | microsoft.directory/users/authenticationMethods/basic/update | Update basic properties of authentication methods for users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/deletedItems.users/restore | Restore soft deleted users to original state |
> | microsoft.directory/users/delete | Delete users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/disable | Disable users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/enable | Enable users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/restore | Restore deleted users |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.directory/users/password/update | Reset passwords for all users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/userPrincipalName/update | Update User Principal Name of users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Authentication Policy Administrator

Assign the Authentication Policy Administrator role to users who need to do the following:

- Configure the authentication methods policy, tenant-wide MFA settings, and password protection policy that determine which methods each user can register and use.
- Manage Password Protection settings: smart lockout configurations and updating the custom banned passwords list.
- Create and manage verifiable credentials.
- Create and manage Azure support tickets.

Users with this role **cannot** do the following:

- Cannot update sensitive properties. For more information, see [Who can perform sensitive actions](privileged-roles-permissions.md#who-can-perform-sensitive-actions).
- Cannot delete or restore users. For more information, see [Who can perform sensitive actions](privileged-roles-permissions.md#who-can-perform-sensitive-actions).
- Cannot manage MFA settings in the legacy MFA management portal or Hardware OATH tokens.

[!INCLUDE [authentication-table-include](./includes/authentication-table-include.md)]

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/organization/strongAuthentication/allTasks | Manage all aspects of strong authentication properties of an organization |
> | microsoft.directory/userCredentialPolicies/create | Create credential policies for users |
> | microsoft.directory/userCredentialPolicies/delete | Delete credential policies for users |
> | microsoft.directory/userCredentialPolicies/standard/read | Read standard properties of credential policies for users |
> | microsoft.directory/userCredentialPolicies/owners/read | Read owners of credential policies for users |
> | microsoft.directory/userCredentialPolicies/policyAppliedTo/read | Read policy.appliesTo navigation link |
> | microsoft.directory/userCredentialPolicies/basic/update | Update basic policies for users |
> | microsoft.directory/userCredentialPolicies/owners/update | Update owners of credential policies for users |
> | microsoft.directory/userCredentialPolicies/tenantDefault/update | Update policy.isOrganizationDefault property |
> | microsoft.directory/verifiableCredentials/configuration/contracts/cards/allProperties/read | Read a verifiable credential card |
> | microsoft.directory/verifiableCredentials/configuration/contracts/cards/revoke | Revoke a verifiable credential card |
> | microsoft.directory/verifiableCredentials/configuration/contracts/create | Create a verifiable credential contract |
> | microsoft.directory/verifiableCredentials/configuration/contracts/allProperties/read | Read a verifiable credential contract |
> | microsoft.directory/verifiableCredentials/configuration/contracts/allProperties/update | Update a verifiable credential contract |
> | microsoft.directory/verifiableCredentials/configuration/create | Create configuration required to create and manage verifiable credentials |
> | microsoft.directory/verifiableCredentials/configuration/delete | Delete configuration required to create and manage verifiable credentials and delete all of its verifiable credentials |
> | microsoft.directory/verifiableCredentials/configuration/allProperties/read | Read configuration required to create and manage verifiable credentials |
> | microsoft.directory/verifiableCredentials/configuration/allProperties/update | Update configuration required to create and manage verifiable credentials |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |

## Azure AD Joined Device Local Administrator

This role is available for assignment only as an additional local administrator in [Device settings](../devices/assign-local-admin.md). Users with this role become local machine administrators on all Windows 10 devices that are joined to Microsoft Entra ID. They do not have the ability to manage devices objects in Microsoft Entra ID.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groupSettings/standard/read | Read basic properties on group settings |
> | microsoft.directory/groupSettingTemplates/standard/read | Read basic properties on group setting templates |

## Azure DevOps Administrator

Users with this role can manage all enterprise Azure DevOps policies, applicable to all Azure DevOps organizations backed by Microsoft Entra ID. Users in this role can manage these policies by navigating to any Azure DevOps organization that is backed by the company's Microsoft Entra ID. Additionally, users in this role can claim ownership of orphaned Azure DevOps organizations. This role grants no other Azure DevOps-specific permissions (for example, Project Collection Administrators) inside any of the Azure DevOps organizations backed by the company's Microsoft Entra organization.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.devOps/allEntities/allTasks | Read and configure Azure DevOps |

## Azure Information Protection Administrator

Users with this role have all permissions in the Azure Information Protection service. This role allows configuring labels for the Azure Information Protection policy, managing protection templates, and activating protection. This role does not grant any permissions in Identity Protection, Privileged Identity Management, Monitor Microsoft 365 Service Health, Microsoft 365 Defender portal, or Microsoft Purview compliance portal.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.azure.informationProtection/allEntities/allTasks | Manage all aspects of Azure Information Protection |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## B2C IEF Keyset Administrator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). User can create and manage policy keys and secrets for token encryption, token signatures, and claim encryption/decryption. By adding new keys to existing key containers, this limited administrator can roll over secrets as needed without impacting existing applications. This user can see the full content of these secrets and their expiration dates even after their creation.

> [!IMPORTANT]
> This is a sensitive role. The keyset administrator role should be carefully audited and assigned with care during pre-production and production.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/b2cTrustFrameworkKeySet/allProperties/allTasks | Read and configure key sets in Azure Active Directory B2C<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |

## B2C IEF Policy Administrator

Users in this role have the ability to create, read, update, and delete all custom policies in Azure AD B2C and therefore have full control over the Identity Experience Framework in the relevant Azure AD B2C organization. By editing policies, this user can establish direct federation with external identity providers, change the directory schema, change all user-facing content (HTML, CSS, JavaScript), change the requirements to complete an authentication, create new users, send user data to external systems including full migrations, and edit all user information including sensitive fields like passwords and phone numbers. Conversely, this role cannot change the encryption keys or edit the secrets used for federation in the organization.

> [!IMPORTANT]
> The B2 IEF Policy Administrator is a highly sensitive role which should be assigned on a very limited basis for organizations in production. Activities by these users should be closely audited, especially for organizations in production.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/b2cTrustFrameworkPolicy/allProperties/allTasks | Read and configure custom policies in Azure Active Directory B2C |

## Billing Administrator

Makes purchases, manages subscriptions, manages support tickets, and monitors service health.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/organization/basic/update | Update basic properties on organization |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.commerce.billing/allEntities/allProperties/allTasks | Manage all aspects of Office 365 billing |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Cloud App Security Administrator

Users with this role have full permissions in Defender for Cloud Apps. They can add administrators, add Microsoft Defender for Cloud Apps policies and settings, upload logs, and perform governance actions.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/cloudAppSecurity/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Microsoft Defender for Cloud Apps |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Cloud Application Administrator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users in this role have the same permissions as the Application Administrator role, excluding the ability to manage application proxy. This role grants the ability to create and manage all aspects of enterprise applications and application registrations. Users assigned to this role are not added as owners when creating new application registrations or enterprise applications.

This role also grants the ability to consent for delegated permissions and application permissions, with the exception of application permissions for Microsoft Graph.

> [!IMPORTANT]
> This exception means that you can still consent to application permissions for _other_ apps (for example, non-Microsoft apps or apps that you have registered). You can still _request_ these permissions as part of the app registration, but _granting_ (that is, consenting to) these permissions requires a more privileged administrator, such as Global Administrator.
>
>This role grants the ability to manage application credentials. Users assigned this role can add credentials to an application, and use those credentials to impersonate the application’s identity. If the application’s identity has been granted access to a resource, such as the ability to create or update User or other objects, then a user assigned to this role could perform those actions while impersonating the application. This ability to impersonate the application’s identity may be an elevation of privilege over what the user can do via their role assignments. It is important to understand that assigning a user to the Application Administrator role gives them the ability to impersonate an application’s identity.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/adminConsentRequestPolicy/allProperties/allTasks | Manage admin consent request policies in Microsoft Entra ID |
> | microsoft.directory/appConsent/appConsentRequests/allProperties/read | Read all properties of consent requests for applications registered with Microsoft Entra ID |
> | microsoft.directory/applications/create | Create all types of applications |
> | microsoft.directory/applications/delete | Delete all types of applications |
> | microsoft.directory/applications/appRoles/update | Update the appRoles property on all types of applications |
> | microsoft.directory/applications/audience/update | Update the audience property for applications |
> | microsoft.directory/applications/authentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/basic/update | Update basic properties for applications |
> | microsoft.directory/applications/credentials/update | Update application credentials<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/applications/extensionProperties/update | Update extension properties on applications |
> | microsoft.directory/applications/notes/update | Update notes of applications |
> | microsoft.directory/applications/owners/update | Update owners of applications |
> | microsoft.directory/applications/permissions/update | Update exposed permissions and required permissions on all types of applications |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/applications/tag/update | Update tags of applications |
> | microsoft.directory/applications/verification/update | Update applicationsverification property |
> | microsoft.directory/applications/synchronization/standard/read | Read provisioning settings associated with the application object |
> | microsoft.directory/applicationTemplates/instantiate | Instantiate gallery applications from application templates |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, excluding custom security attributes audit logs |
> | microsoft.directory/deletedItems.applications/delete | Permanently delete applications, which can no longer be restored |
> | microsoft.directory/deletedItems.applications/restore | Restore soft deleted applications to original state |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
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
> | microsoft.directory/servicePrincipals/synchronizationJobs/manage | Start, restart, and pause application provisioning synchronization jobs |
> | microsoft.directory/servicePrincipals/synchronizationSchema/manage | Create and manage application provisioning synchronization jobs and schema |
> | microsoft.directory/servicePrincipals/managePasswordSingleSignOnCredentials | Read password single sign-on credentials on service principals |
> | microsoft.directory/servicePrincipals/managePermissionGrantsForAll.microsoft-application-admin | Grant consent for application permissions and delegated permissions on behalf of any user or all users, except for application permissions for Microsoft Graph |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/servicePrincipals/audience/update | Update audience properties on service principals |
> | microsoft.directory/servicePrincipals/authentication/update | Update authentication properties on service principals |
> | microsoft.directory/servicePrincipals/basic/update | Update basic properties on service principals |
> | microsoft.directory/servicePrincipals/credentials/update | Update credentials of service principals<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/servicePrincipals/notes/update | Update notes of service principals |
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

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users in this role can enable, disable, and delete devices in Microsoft Entra ID and read Windows 10 BitLocker keys (if present) in the Azure portal. The role does not grant permissions to manage any other properties on the device.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, excluding custom security attributes audit logs |
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/deletedItems.devices/delete | Permanently delete devices, which can no longer be restored |
> | microsoft.directory/deletedItems.devices/restore | Restore soft deleted devices to original state |
> | microsoft.directory/devices/delete | Delete devices from Microsoft Entra ID |
> | microsoft.directory/devices/disable | Disable devices in Microsoft Entra ID |
> | microsoft.directory/devices/enable | Enable devices in Microsoft Entra ID |
> | microsoft.directory/deviceLocalCredentials/password/read | Read all properties of the backed up local administrator account credentials for Microsoft Entra joined devices, including the password |
> | microsoft.directory/deviceManagementPolicies/standard/read | Read standard properties on device management application policies |
> | microsoft.directory/deviceManagementPolicies/basic/update | Update basic properties on device management application policies<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/deviceRegistrationPolicy/standard/read | Read standard properties on device registration policies |
> | microsoft.directory/deviceRegistrationPolicy/basic/update | Update basic properties on device registration policies<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |

## Compliance Administrator

Users with this role have permissions to manage compliance-related features in the Microsoft Purview compliance portal, Microsoft 365 admin center, Azure, and Microsoft 365 Defender portal. Assignees can also manage all features within the Exchange admin center and create support tickets for Azure and Microsoft 365. For more information, see [Roles and role groups in Microsoft Defender for Office 365 and Microsoft Purview compliance](/microsoft-365/security/office-365-security/scc-permissions).

In | Can do
----- | ----------
[Microsoft Purview compliance portal](/microsoft-365/compliance/microsoft-365-compliance-center) | Protect and manage your organization's data across Microsoft 365 services<br>Manage compliance alerts
[Microsoft Purview Compliance Manager](/microsoft-365/compliance/compliance-manager) | Track, assign, and verify your organization's regulatory compliance activities
[Microsoft 365 Defender portal](/microsoft-365/security/defender/microsoft-365-defender-portal) | Manage data governance<br>Perform legal and data investigation<br>Manage Data Subject Request<br><br>This role has the same permissions as the [Compliance Administrator role group](/microsoft-365/security/office-365-security/scc-permissions) in Microsoft 365 Defender portal role-based access control.
[Intune](/intune/role-based-access-control) | View all Intune audit data
[Microsoft Defender for Cloud Apps](/defender-cloud-apps/manage-admins) | Has read-only permissions and can manage alerts<br>Can create and modify file policies and allow file governance actions<br>Can view all the built-in reports under Data Management

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.directory/entitlementManagement/allProperties/read | Read all properties in Microsoft Entra entitlement management |
> | microsoft.office365.complianceManager/allEntities/allTasks | Manage all aspects of Office 365 Compliance Manager |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Compliance Data Administrator

Users with this role have permissions to track data in the Microsoft Purview compliance portal, Microsoft 365 admin center, and Azure. Users can also track compliance data within the Exchange admin center, Compliance Manager, and Teams & Skype for Business admin center and create support tickets for Azure and Microsoft 365. For more information about the differences between Compliance Administrator and Compliance Data Administrator, see [Roles and role groups in Microsoft Defender for Office 365 and Microsoft Purview compliance](/microsoft-365/security/office-365-security/scc-permissions).

In | Can do
----- | ----------
[Microsoft Purview compliance portal](/microsoft-365/compliance/microsoft-365-compliance-center) | Monitor compliance-related policies across Microsoft 365 services<br>Manage compliance alerts
[Microsoft Purview Compliance Manager](/microsoft-365/compliance/compliance-manager) | Track, assign, and verify your organization's regulatory compliance activities
[Microsoft 365 Defender portal](/microsoft-365/security/defender/microsoft-365-defender-portal) | Manage data governance<br>Perform legal and data investigation<br>Manage Data Subject Request<br><br>This role has the same permissions as the [Compliance Data Administrator role group](/microsoft-365/security/office-365-security/scc-permissions) in Microsoft 365 Defender portal role-based access control.
[Intune](/intune/role-based-access-control) | View all Intune audit data
[Microsoft Defender for Cloud Apps](/defender-cloud-apps/manage-admins) | Has read-only permissions and can manage alerts<br>Can create and modify file policies and allow file governance actions<br>Can view all the built-in reports under Data Management

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.directory/cloudAppSecurity/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Microsoft Defender for Cloud Apps |
> | microsoft.azure.informationProtection/allEntities/allTasks | Manage all aspects of Azure Information Protection |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.complianceManager/allEntities/allTasks | Manage all aspects of Office 365 Compliance Manager |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Conditional Access Administrator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users with this role have the ability to manage Microsoft Entra Conditional Access settings.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/namedLocations/create | Create custom rules that define network locations |
> | microsoft.directory/namedLocations/delete | Delete custom rules that define network locations |
> | microsoft.directory/namedLocations/standard/read | Read basic properties of custom rules that define network locations |
> | microsoft.directory/namedLocations/basic/update | Update basic properties of custom rules that define network locations |
> | microsoft.directory/conditionalAccessPolicies/create | Create conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/delete | Delete conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/standard/read | Read conditional access for policies |
> | microsoft.directory/conditionalAccessPolicies/owners/read | Read the owners of conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/policyAppliedTo/read | Read the "applied to" property for conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/basic/update | Update basic properties for conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/owners/update | Update owners for conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/tenantDefault/update | Update the default tenant for conditional access policies |
> | microsoft.directory/resourceNamespaces/resourceActions/authenticationContext/update | Update Conditional Access authentication context of Microsoft 365 role-based access control (RBAC) resource actions<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |

## Customer LockBox Access Approver

Manages [Microsoft Purview Customer Lockbox requests](/microsoft-365/compliance/customer-lockbox-requests) in your organization. They receive email notifications for Customer Lockbox requests and can approve and deny requests from the Microsoft 365 admin center. They can also turn the Customer Lockbox feature on or off. Only Global Administrators can reset the passwords of people assigned to this role.

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
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.desktopAnalytics/allEntities/allTasks | Manage all aspects of Desktop Analytics |

## Directory Readers

Users in this role can read basic directory information. This role should be used for:

* Granting a specific set of guest users read access instead of granting it to all guest users.
* Granting a specific set of non-admin users access to Azure portal when "Restrict access to Azure portal to admins only" is set to "Yes".
* Granting service principals access to directory where Directory.Read.All is not an option.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/administrativeUnits/standard/read | Read basic properties on administrative units |
> | microsoft.directory/administrativeUnits/members/read | Read members of administrative units |
> | microsoft.directory/applications/standard/read | Read standard properties of applications |
> | microsoft.directory/applications/owners/read | Read owners of applications |
> | microsoft.directory/applications/policies/read | Read policies of applications |
> | microsoft.directory/contacts/standard/read | Read basic properties on contacts in Microsoft Entra ID |
> | microsoft.directory/contacts/memberOf/read | Read the group membership for all contacts in Microsoft Entra ID |
> | microsoft.directory/contracts/standard/read | Read basic properties on partner contracts |
> | microsoft.directory/devices/standard/read | Read basic properties on devices |
> | microsoft.directory/devices/memberOf/read | Read device memberships |
> | microsoft.directory/devices/registeredOwners/read | Read registered owners of devices |
> | microsoft.directory/devices/registeredUsers/read | Read registered users of devices |
> | microsoft.directory/directoryRoles/standard/read | Read basic properties in Microsoft Entra roles |
> | microsoft.directory/directoryRoles/eligibleMembers/read | Read the eligible members of Microsoft Entra roles |
> | microsoft.directory/directoryRoles/members/read | Read all members of Microsoft Entra roles |
> | microsoft.directory/domains/standard/read | Read basic properties on domains |
> | microsoft.directory/groups/standard/read | Read standard properties of Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups/appRoleAssignments/read | Read application role assignments of groups |
> | microsoft.directory/groups/memberOf/read | Read the memberOf property on Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups/members/read | Read members of Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups/owners/read | Read owners of Security groups and Microsoft 365 groups, including role-assignable groups |
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
> | microsoft.directory/users/appRoleAssignments/read | Read application role assignments for users |
> | microsoft.directory/users/deviceForResourceAccount/read | Read deviceForResourceAccount of users |
> | microsoft.directory/users/directReports/read | Read the direct reports for users |
> | microsoft.directory/users/licenseDetails/read | Read license details of users |
> | microsoft.directory/users/manager/read | Read manager of users |
> | microsoft.directory/users/memberOf/read | Read the group memberships of users |
> | microsoft.directory/users/oAuth2PermissionGrants/read | Read delegated permission grants on users |
> | microsoft.directory/users/ownedDevices/read | Read owned devices of users |
> | microsoft.directory/users/ownedObjects/read | Read owned objects of users |
> | microsoft.directory/users/photo/read | Read photo of users |
> | microsoft.directory/users/registeredDevices/read | Read registered devices of users |
> | microsoft.directory/users/scopedRoleMemberOf/read | Read user's membership of an Microsoft Entra role, that is scoped to an administrative unit |
> | microsoft.directory/users/sponsors/read | Read sponsors of users |

## Directory Synchronization Accounts

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Do not use. This role is automatically assigned to the Microsoft Entra Connect service, and is not intended or supported for any other use.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/create | Create all types of applications |
> | microsoft.directory/applications/delete | Delete all types of applications |
> | microsoft.directory/applications/appRoles/update | Update the appRoles property on all types of applications |
> | microsoft.directory/applications/audience/update | Update the audience property for applications |
> | microsoft.directory/applications/authentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/basic/update | Update basic properties for applications |
> | microsoft.directory/applications/credentials/update | Update application credentials<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/applications/notes/update | Update notes of applications |
> | microsoft.directory/applications/owners/update | Update owners of applications |
> | microsoft.directory/applications/permissions/update | Update exposed permissions and required permissions on all types of applications |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/applications/tag/update | Update tags of applications |
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.directory/hybridAuthenticationPolicy/allProperties/allTasks | Manage hybrid authentication policy in Microsoft Entra ID<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/organization/dirSync/update | Update the organization directory sync property |
> | microsoft.directory/passwordHashSync/allProperties/allTasks | Manage all aspects of Password Hash Synchronization (PHS) in Microsoft Entra ID |
> | microsoft.directory/policies/create | Create policies in Microsoft Entra ID |
> | microsoft.directory/policies/delete | Delete policies in Microsoft Entra ID |
> | microsoft.directory/policies/standard/read | Read basic properties on policies |
> | microsoft.directory/policies/owners/read | Read owners of policies |
> | microsoft.directory/policies/policyAppliedTo/read | Read policies.policyAppliedTo property |
> | microsoft.directory/policies/basic/update | Update basic properties on policies<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
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
> | microsoft.directory/servicePrincipals/credentials/update | Update credentials of service principals<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/servicePrincipals/notes/update | Update notes of service principals |
> | microsoft.directory/servicePrincipals/owners/update | Update owners of service principals |
> | microsoft.directory/servicePrincipals/permissions/update | Update permissions of service principals |
> | microsoft.directory/servicePrincipals/policies/update | Update policies of service principals |
> | microsoft.directory/servicePrincipals/tag/update | Update the tag property for service principals |

## Directory Writers

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users in this role can read and update basic information of users, groups, and service principals.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/extensionProperties/update | Update extension properties on applications |
> | microsoft.directory/contacts/create | Create contacts |
> | microsoft.directory/groups/assignLicense | Assign product licenses to groups for group-based licensing |
> | microsoft.directory/groups/create | Create Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/reprocessLicenseAssignment | Reprocess license assignments for group-based licensing |
> | microsoft.directory/groups/basic/update | Update basic properties on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/classification/update | Update the classification property on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/dynamicMembershipRule/update | Update the dynamic membership rule on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/groupType/update | Update properties that would affect the group type of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/members/update | Update members of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/onPremWriteBack/update | Update Microsoft Entra groups to be written back to on-premises with Microsoft Entra Connect |
> | microsoft.directory/groups/owners/update | Update owners of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/settings/update | Update settings of groups |
> | microsoft.directory/groups/visibility/update | Update the visibility property of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groupSettings/create | Create group settings |
> | microsoft.directory/groupSettings/delete | Delete group settings |
> | microsoft.directory/groupSettings/basic/update | Update basic properties on group settings |
> | microsoft.directory/oAuth2PermissionGrants/create | Create OAuth 2.0 permission grants<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/oAuth2PermissionGrants/basic/update | Update OAuth 2.0 permission grants<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/servicePrincipals/synchronizationCredentials/manage | Manage application provisioning secrets and credentials |
> | microsoft.directory/servicePrincipals/synchronizationJobs/manage | Start, restart, and pause application provisioning synchronization jobs |
> | microsoft.directory/servicePrincipals/synchronizationSchema/manage | Create and manage application provisioning synchronization jobs and schema |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/users/assignLicense | Manage user licenses |
> | microsoft.directory/users/create | Add users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/disable | Disable users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/enable | Enable users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/inviteGuest | Invite guest users |
> | microsoft.directory/users/reprocessLicenseAssignment | Reprocess license assignments for users |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.directory/users/photo/update | Update photo of users |
> | microsoft.directory/users/sponsors/update | Update sponsors of users |
> | microsoft.directory/users/userPrincipalName/update | Update User Principal Name of users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |

## Domain Name Administrator

Users with this role can manage (read, add, verify, update, and delete) domain names. They can also read directory information about users, groups, and applications, as these objects possess domain dependencies. For on-premises environments, users with this role can configure domain names for federation so that associated users are always authenticated on-premises. These users can then sign into Microsoft Entra based services with their on-premises passwords via single sign-on. Federation settings need to be synced via Microsoft Entra Connect, so users also have permissions to manage Microsoft Entra Connect.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/domains/allProperties/allTasks | Create and delete domains, and read and update all properties |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Dynamics 365 Administrator

Users with this role have global permissions within Microsoft Dynamics 365 Online, when the service is present, as well as the ability to manage support tickets and monitor service health. For more information, see [Use service admin roles to manage your tenant](/power-platform/admin/use-service-admin-role-manage-tenant).

> [!NOTE]
> In the Microsoft Graph API and Azure AD PowerShell, this role is named Dynamics 365 Service Administrator. In the [Azure portal](../../azure-portal/azure-portal-overview.md), it is named Dynamics 365 Administrator.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.dynamics365/allEntities/allTasks | Manage all aspects of Dynamics 365 |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Edge Administrator

Users in this role can create and manage the enterprise site list required for Internet Explorer mode on Microsoft Edge. This role grants permissions to create, edit, and publish the site list and additionally allows access to manage support tickets. [Learn more](https://go.microsoft.com/fwlink/?linkid=2165707)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.edge/allEntities/allProperties/allTasks | Manage all aspects of Microsoft Edge |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Exchange Administrator

Users with this role have global permissions within Microsoft Exchange Online, when the service is present. Also has the ability to create and manage all Microsoft 365 groups, manage support tickets, and monitor service health. For more information, see [About admin roles in the Microsoft 365 admin center](/microsoft-365/admin/add-users/about-admin-roles).

> [!NOTE]
> In the Microsoft Graph API and Azure AD PowerShell, this role is named Exchange Service Administrator. In the [Azure portal](../../azure-portal/azure-portal-overview.md), it is named Exchange Administrator. In the [Exchange admin center](/exchange/exchange-admin-center), it is named Exchange Online administrator.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups.unified/create | Create Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/delete | Delete Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/restore | Restore Microsoft 365 groups from soft-deleted container, excluding role-assignable groups |
> | microsoft.directory/groups.unified/basic/update | Update basic properties on Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/members/update | Update members of Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/owners/update | Update owners of Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.exchange/allEntities/basic/allTasks | Manage all aspects of Exchange Online |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Exchange Recipient Administrator

Users with this role have read access to recipients and write access to the attributes of those recipients in Exchange Online. For more information, see [Recipients in Exchange Server](/exchange/recipients/recipients).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.exchange/recipients/allProperties/allTasks | Create and delete all recipients, and read and update all properties of recipients in Exchange Online |
> | microsoft.office365.exchange/migration/allProperties/allTasks | Manage all tasks related to migration of recipients in Exchange Online |

## External ID User Flow Administrator

Users with this role can create and manage user flows (also called "built-in" policies) in the Azure portal. These users can customize HTML/CSS/JavaScript content, change MFA requirements, select claims in the token, manage API connectors and their credentials, and configure session settings for all user flows in the Microsoft Entra organization. On the other hand, this role does not include the ability to review user data or make changes to the attributes that are included in the organization schema. Changes to Identity Experience Framework policies (also known as custom policies) are also outside the scope of this role.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/b2cUserFlow/allProperties/allTasks | Read and configure user flow in Azure Active Directory B2C |

## External ID User Flow Attribute Administrator

Users with this role add or delete custom attributes available to all user flows in the Microsoft Entra organization. As such, users with this role can change or add new elements to the end-user schema and impact the behavior of all user flows and indirectly result in changes to what data may be asked of end users and ultimately sent as claims to applications. This role cannot edit user flows.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/b2cUserAttribute/allProperties/allTasks | Read and configure user attribute in Azure Active Directory B2C |

## External Identity Provider Administrator

This administrator manages federation between Microsoft Entra organizations and external identity providers. With this role, users can add new identity providers and configure all available settings (e.g. authentication path, service ID, assigned key containers). This user can enable the Microsoft Entra organization to trust authentications from external identity providers. The resulting impact on end-user experiences depends on the type of organization:

* Microsoft Entra organizations for employees and partners: The addition of a federation (e.g. with Gmail) will immediately impact all guest invitations not yet redeemed. See [Adding Google as an identity provider for B2B guest users](../external-identities/google-federation.md).
* Azure Active Directory B2C organizations: The addition of a federation (for example, with Facebook, or with another Microsoft Entra organization) does not immediately impact end-user flows until the identity provider is added as an option in a user flow (also called a built-in policy). See [Configuring a Microsoft account as an identity provider](../../active-directory-b2c/identity-provider-microsoft-account.md) for an example. To change user flows, the limited role of "B2C User Flow Administrator" is required.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/domains/federation/update | Update federation property of domains |
> | microsoft.directory/identityProviders/allProperties/allTasks | Read and configure identity providers in Azure Active Directory B2C |

## Fabric Administrator

Users with this role have global permissions within Microsoft Fabric and Power BI, when the service is present, as well as the ability to manage support tickets and monitor service health. For more information, see [Understanding Fabric admin roles](/fabric/admin/roles).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.powerApps.powerBI/allEntities/allTasks | Manage all aspects of Fabric and Power BI |

## Global Administrator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users with this role have access to all administrative features in Microsoft Entra ID, as well as services that use Microsoft Entra identities like the Microsoft 365 Defender portal, the Microsoft Purview compliance portal, Exchange Online, SharePoint Online, and Skype for Business Online. Global Administrators can view Directory Activity logs. Furthermore, Global Administrators can [elevate their access](../../role-based-access-control/elevate-access-global-admin.md) to manage all Azure subscriptions and management groups. This allows Global Administrators to get full access to all Azure resources using the respective Microsoft Entra tenant. The person who signs up for the Microsoft Entra organization becomes a Global Administrator. There can be more than one Global Administrator at your company. Global Administrators can reset the password for any user and all other administrators. A Global Administrator cannot remove their own Global Administrator assignment. This is to prevent a situation where an organization has zero Global Administrators.

> [!NOTE]
> As a best practice, Microsoft recommends that you assign the Global Administrator role to fewer than five people in your organization. For more information, see [Best practices for Microsoft Entra roles](best-practices.md).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/accessReviews/allProperties/allTasks | (Deprecated) Create and delete access reviews, read and update all properties of access reviews, and manage access reviews of groups in Microsoft Entra ID |
> | microsoft.directory/accessReviews/definitions/allProperties/allTasks | Manage access reviews of all reviewable resources in Microsoft Entra ID |
> | microsoft.directory/adminConsentRequestPolicy/allProperties/allTasks | Manage admin consent request policies in Microsoft Entra ID |
> | microsoft.directory/administrativeUnits/allProperties/allTasks | Create and manage administrative units (including members) |
> | microsoft.directory/appConsent/appConsentRequests/allProperties/read | Read all properties of consent requests for applications registered with Microsoft Entra ID |
> | microsoft.directory/applications/allProperties/allTasks | Create and delete applications, and read and update all properties<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/applications/synchronization/standard/read | Read provisioning settings associated with the application object |
> | microsoft.directory/applicationTemplates/instantiate | Instantiate gallery applications from application templates |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, excluding custom security attributes audit logs |
> | microsoft.directory/users/authenticationMethods/create | Update authentication methods for users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/authenticationMethods/delete | Delete authentication methods for users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/authenticationMethods/standard/read | Read standard properties of authentication methods for users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/authenticationMethods/basic/update | Update basic properties of authentication methods for users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/authorizationPolicy/allProperties/allTasks | Manage all aspects of authorization policy<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/cloudAppSecurity/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Microsoft Defender for Cloud Apps |
> | microsoft.directory/connectors/create | Create application proxy connectors |
> | microsoft.directory/connectors/allProperties/read | Read all properties of application proxy connectors |
> | microsoft.directory/connectorGroups/create | Create application proxy connector groups |
> | microsoft.directory/connectorGroups/delete | Delete application proxy connector groups |
> | microsoft.directory/connectorGroups/allProperties/read | Read all properties of application proxy connector groups |
> | microsoft.directory/connectorGroups/allProperties/update | Update all properties of application proxy connector groups |
> | microsoft.directory/contacts/allProperties/allTasks | Create and delete contacts, and read and update all properties |
> | microsoft.directory/contracts/allProperties/allTasks | Create and delete partner contracts, and read and update all properties |
> | microsoft.directory/customAuthenticationExtensions/allProperties/allTasks | Create and manage custom authentication extensions<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/deletedItems/delete | Permanently delete objects, which can no longer be restored |
> | microsoft.directory/deletedItems/restore | Restore soft deleted objects to original state |
> | microsoft.directory/devices/allProperties/allTasks | Create and delete devices, and read and update all properties |
> | microsoft.directory/multiTenantOrganization/basic/update | Update basic properties of a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/create | Create a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/joinRequest/organizationDetails/update | Join a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/joinRequest/standard/read | Read properties of a multi-tenant organization join request |
> | microsoft.directory/multiTenantOrganization/standard/read | Read basic properties of a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/organizationDetails/update | Update basic properties of a tenant participating in a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/create | Create a tenant in a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/delete | Delete a tenant participating in a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/organizationDetails/read | Read organization details of a tenant participating in a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/standard/read | Read basic properties of a tenant participating in a multi-tenant organization |
> | microsoft.directory/namedLocations/create | Create custom rules that define network locations |
> | microsoft.directory/namedLocations/delete | Delete custom rules that define network locations |
> | microsoft.directory/namedLocations/standard/read | Read basic properties of custom rules that define network locations |
> | microsoft.directory/namedLocations/basic/update | Update basic properties of custom rules that define network locations |
> | microsoft.directory/deviceLocalCredentials/password/read | Read all properties of the backed up local administrator account credentials for Microsoft Entra joined devices, including the password |
> | microsoft.directory/deviceManagementPolicies/standard/read | Read standard properties on device management application policies |
> | microsoft.directory/deviceManagementPolicies/basic/update | Update basic properties on device management application policies<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/deviceRegistrationPolicy/standard/read | Read standard properties on device registration policies |
> | microsoft.directory/deviceRegistrationPolicy/basic/update | Update basic properties on device registration policies<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/directoryRoles/allProperties/allTasks | Create and delete directory roles, and read and update all properties |
> | microsoft.directory/directoryRoleTemplates/allProperties/allTasks | Create and delete Microsoft Entra role templates, and read and update all properties |
> | microsoft.directory/domains/allProperties/allTasks | Create and delete domains, and read and update all properties |
> | microsoft.directory/domains/federationConfiguration/standard/read | Read standard properties of federation configuration for domains |
> | microsoft.directory/domains/federationConfiguration/basic/update | Update basic federation configuration for domains |
> | microsoft.directory/domains/federationConfiguration/create | Create federation configuration for domains |
> | microsoft.directory/domains/federationConfiguration/delete | Delete federation configuration for domains |
> | microsoft.directory/entitlementManagement/allProperties/allTasks | Create and delete resources, and read and update all properties in Microsoft Entra entitlement management |
> | microsoft.directory/groups/allProperties/allTasks | Create and delete groups, and read and update all properties |
> | microsoft.directory/groupsAssignableToRoles/create | Create role-assignable groups |
> | microsoft.directory/groupsAssignableToRoles/delete | Delete role-assignable groups |
> | microsoft.directory/groupsAssignableToRoles/restore | Restore role-assignable groups |
> | microsoft.directory/groupsAssignableToRoles/allProperties/update | Update role-assignable groups |
> | microsoft.directory/groupSettings/allProperties/allTasks | Create and delete group settings, and read and update all properties |
> | microsoft.directory/groupSettingTemplates/allProperties/allTasks | Create and delete group setting templates, and read and update all properties |
> | microsoft.directory/hybridAuthenticationPolicy/allProperties/allTasks | Manage hybrid authentication policy in Microsoft Entra ID<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/identityProtection/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Microsoft Entra ID Protection<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/loginOrganizationBranding/allProperties/allTasks | Create and delete loginTenantBranding, and read and update all properties |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/organization/allProperties/allTasks | Read and update all properties for an organization |
> | microsoft.directory/passwordHashSync/allProperties/allTasks | Manage all aspects of Password Hash Synchronization (PHS) in Microsoft Entra ID |
> | microsoft.directory/policies/allProperties/allTasks | Create and delete policies, and read and update all properties<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/conditionalAccessPolicies/allProperties/allTasks | Manage all properties of conditional access policies |
> | microsoft.directory/crossTenantAccessPolicy/standard/read | Read basic properties of cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/allowedCloudEndpoints/update | Update allowed cloud endpoints of cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/basic/update | Update basic settings of cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/standard/read | Read basic properties of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/b2bCollaboration/update | Update Microsoft Entra B2B collaboration settings of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/b2bDirectConnect/update | Update Microsoft Entra B2B direct connect settings of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/crossCloudMeetings/update | Update cross-cloud Teams meeting settings of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/tenantRestrictions/update | Update tenant restrictions of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/partners/create | Create cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/delete | Delete cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/standard/read | Read basic properties of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationIdentitySynchronization/basic/update | Update cross tenant sync policy templates for multi-tenant organization |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationIdentitySynchronization/resetToDefaultSettings | Reset cross tenant sync policy template for multi-tenant organization to default settings |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationIdentitySynchronization/standard/read | Read basic properties of cross tenant sync policy templates for multi-tenant organization |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationPartnerConfiguration/basic/update | Update cross tenant access policy templates for multi-tenant organization |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationPartnerConfiguration/resetToDefaultSettings | Reset cross tenant access policy template for multi-tenant organization to default settings |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationPartnerConfiguration/standard/read | Read basic properties of cross tenant access policy templates for multi-tenant organization |
> | microsoft.directory/crossTenantAccessPolicy/partners/b2bCollaboration/update | Update Microsoft Entra B2B collaboration settings of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/b2bDirectConnect/update | Update Microsoft Entra B2B direct connect settings of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/crossCloudMeetings/update | Update cross-cloud Teams meeting settings of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/tenantRestrictions/update | Update tenant restrictions of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/identitySynchronization/create | Create cross-tenant sync policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/identitySynchronization/basic/update | Update basic settings of cross-tenant sync policy |
> | microsoft.directory/crossTenantAccessPolicy/partners/identitySynchronization/standard/read | Read basic properties of cross-tenant sync policy |
> | microsoft.directory/privilegedIdentityManagement/allProperties/read | Read all resources in Privileged Identity Management |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/resourceNamespaces/resourceActions/authenticationContext/update | Update Conditional Access authentication context of Microsoft 365 role-based access control (RBAC) resource actions<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/roleAssignments/allProperties/allTasks | Create and delete role assignments, and read and update all role assignment properties |
> | microsoft.directory/roleDefinitions/allProperties/allTasks | Create and delete role definitions, and read and update all properties |
> | microsoft.directory/scopedRoleMemberships/allProperties/allTasks | Create and delete scopedRoleMemberships, and read and update all properties |
> | microsoft.directory/serviceAction/activateService | Can perform the "activate service" action for a service |
> | microsoft.directory/serviceAction/disableDirectoryFeature | Can perform the "disable directory feature" service action |
> | microsoft.directory/serviceAction/enableDirectoryFeature | Can perform the "enable directory feature" service action |
> | microsoft.directory/serviceAction/getAvailableExtentionProperties | Can perform the getAvailableExtentionProperties service action |
> | microsoft.directory/servicePrincipals/allProperties/allTasks | Create and delete service principals, and read and update all properties<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/servicePrincipals/managePermissionGrantsForAll.microsoft-company-admin | Grant consent for any permission to any application |
> | microsoft.directory/servicePrincipals/synchronization/standard/read | Read provisioning settings associated with your service principal |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.directory/subscribedSkus/allProperties/allTasks | Buy and manage subscriptions and delete subscriptions |
> | microsoft.directory/users/allProperties/allTasks | Create and delete users, and read and update all properties<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/convertExternalToInternalMemberUser | Convert external user to internal user |
> | microsoft.directory/permissionGrantPolicies/create | Create permission grant policies |
> | microsoft.directory/permissionGrantPolicies/delete | Delete permission grant policies |
> | microsoft.directory/permissionGrantPolicies/standard/read | Read standard properties of permission grant policies |
> | microsoft.directory/permissionGrantPolicies/basic/update | Update basic properties of permission grant policies |
> | microsoft.directory/servicePrincipalCreationPolicies/create | Create service principal creation policies |
> | microsoft.directory/servicePrincipalCreationPolicies/delete | Delete service principal creation policies |
> | microsoft.directory/servicePrincipalCreationPolicies/standard/read | Read standard properties of service principal creation policies |
> | microsoft.directory/servicePrincipalCreationPolicies/basic/update | Update basic properties of service principal creation policies |
> | microsoft.directory/tenantManagement/tenants/create | Create new tenants in Microsoft Entra ID |
> | microsoft.directory/verifiableCredentials/configuration/contracts/cards/allProperties/read | Read a verifiable credential card |
> | microsoft.directory/verifiableCredentials/configuration/contracts/cards/revoke | Revoke a verifiable credential card |
> | microsoft.directory/verifiableCredentials/configuration/contracts/create | Create a verifiable credential contract |
> | microsoft.directory/verifiableCredentials/configuration/contracts/allProperties/read | Read a verifiable credential contract |
> | microsoft.directory/verifiableCredentials/configuration/contracts/allProperties/update | Update a verifiable credential contract |
> | microsoft.directory/verifiableCredentials/configuration/create | Create configuration required to create and manage verifiable credentials |
> | microsoft.directory/verifiableCredentials/configuration/delete | Delete configuration required to create and manage verifiable credentials and delete all of its verifiable credentials |
> | microsoft.directory/verifiableCredentials/configuration/allProperties/read | Read configuration required to create and manage verifiable credentials |
> | microsoft.directory/verifiableCredentials/configuration/allProperties/update | Update configuration required to create and manage verifiable credentials |
> | microsoft.directory/lifecycleWorkflows/workflows/allProperties/allTasks | Manage all aspects of lifecycle workflows and tasks in Microsoft Entra ID |
> | microsoft.directory/pendingExternalUserProfiles/create | Create external user profiles in the extended directory for Teams |
> | microsoft.directory/pendingExternalUserProfiles/standard/read | Read standard properties of external user profiles in the extended directory for Teams |
> | microsoft.directory/pendingExternalUserProfiles/basic/update | Update basic properties of external user profiles in the extended directory for Teams |
> | microsoft.directory/pendingExternalUserProfiles/delete | Delete external user profiles in the extended directory for Teams |
> | microsoft.directory/externalUserProfiles/standard/read | Read standard properties of external user profiles in the extended directory for Teams |
> | microsoft.directory/externalUserProfiles/basic/update | Update basic properties of external user profiles in the extended directory for Teams |
> | microsoft.directory/externalUserProfiles/delete | Delete external user profiles in the extended directory for Teams |
> | microsoft.azure.advancedThreatProtection/allEntities/allTasks | Manage all aspects of Azure Advanced Threat Protection |
> | microsoft.azure.informationProtection/allEntities/allTasks | Manage all aspects of Azure Information Protection |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.cloudPC/allEntities/allProperties/allTasks | Manage all aspects of Windows 365 |
> | microsoft.commerce.billing/allEntities/allProperties/allTasks | Manage all aspects of Office 365 billing |
> | microsoft.commerce.billing/purchases/standard/read | Read purchase services in M365 Admin Center. |
> | microsoft.dynamics365/allEntities/allTasks | Manage all aspects of Dynamics 365 |
> | microsoft.edge/allEntities/allProperties/allTasks | Manage all aspects of Microsoft Edge |
> | microsoft.networkAccess/allEntities/allProperties/allTasks | Manage all aspects of Microsoft Entra Network Access |
> | microsoft.flow/allEntities/allTasks | Manage all aspects of Microsoft Power Automate |
> | microsoft.hardware.support/shippingAddress/allProperties/allTasks | Create, read, update, and delete shipping addresses for Microsoft hardware warranty claims, including shipping addresses created by others |
> | microsoft.hardware.support/shippingStatus/allProperties/read | Read shipping status for open Microsoft hardware warranty claims |
> | microsoft.hardware.support/warrantyClaims/allProperties/allTasks | Create and manage all aspects of Microsoft hardware warranty claims |
> | microsoft.insights/allEntities/allProperties/allTasks | Manage all aspects of Insights app |
> | microsoft.intune/allEntities/allTasks | Manage all aspects of Microsoft Intune |
> | microsoft.office365.complianceManager/allEntities/allTasks | Manage all aspects of Office 365 Compliance Manager |
> | microsoft.office365.desktopAnalytics/allEntities/allTasks | Manage all aspects of Desktop Analytics |
> | microsoft.office365.exchange/allEntities/basic/allTasks | Manage all aspects of Exchange Online |
> | microsoft.office365.knowledge/contentUnderstanding/allProperties/allTasks | Read and update all properties of content understanding in Microsoft 365 admin center |
> | microsoft.office365.knowledge/contentUnderstanding/analytics/allProperties/read | Read analytics reports of content understanding in Microsoft 365 admin center |
> | microsoft.office365.knowledge/knowledgeNetwork/allProperties/allTasks | Read and update all properties of knowledge network in Microsoft 365 admin center |
> | microsoft.office365.knowledge/knowledgeNetwork/topicVisibility/allProperties/allTasks | Manage topic visibility of knowledge network in Microsoft 365 admin center |
> | microsoft.office365.knowledge/learningSources/allProperties/allTasks | Manage learning sources and all their properties in Learning App. |
> | microsoft.office365.lockbox/allEntities/allTasks | Manage all aspects of Customer Lockbox |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.messageCenter/securityMessages/read | Read security messages in Message Center in the Microsoft 365 admin center |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.organizationalMessages/allEntities/allProperties/allTasks | Manage all authoring aspects of Microsoft 365 Organizational Messages |
> | microsoft.office365.protectionCenter/allEntities/allProperties/allTasks | Manage all aspects of the Security and Compliance centers |
> | microsoft.office365.search/content/manage | Create and delete content, and read and update all properties in Microsoft Search |
> | microsoft.office365.securityComplianceCenter/allEntities/allTasks | Create and delete all resources, and read and update standard properties in the Office 365 Security & Compliance Center |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.sharePoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in SharePoint |
> | microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.userCommunication/allEntities/allTasks | Read and update what's new messages visibility |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.office365.yammer/allEntities/allProperties/allTasks | Manage all aspects of Yammer |
> | microsoft.permissionsManagement/allEntities/allProperties/allTasks | Manage all aspects of Microsoft Entra Permissions Management |
> | microsoft.powerApps/allEntities/allTasks | Manage all aspects of Power Apps |
> | microsoft.powerApps.powerBI/allEntities/allTasks | Manage all aspects of Fabric and Power BI |
> | microsoft.teams/allEntities/allProperties/allTasks | Manage all resources in Teams |
> | microsoft.virtualVisits/allEntities/allProperties/allTasks | Manage and share Virtual Visits information and metrics from admin centers or the Virtual Visits app |
> | microsoft.viva.goals/allEntities/allProperties/allTasks | Manage all aspects of Microsoft Viva Goals |
> | microsoft.viva.pulse/allEntities/allProperties/allTasks | Manage all aspects of Microsoft Viva Pulse |
> | microsoft.windows.defenderAdvancedThreatProtection/allEntities/allTasks | Manage all aspects of Microsoft Defender for Endpoint |
> | microsoft.windows.updatesDeployments/allEntities/allProperties/allTasks | Read and configure all aspects of Windows Update Service |

## Global Reader

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users in this role can read settings and administrative information across Microsoft 365 services but can't take management actions. Global Reader is the read-only counterpart to Global Administrator. Assign Global Reader instead of Global Administrator for planning, audits, or investigations. Use Global Reader in combination with other limited admin roles like Exchange Administrator to make it easier to get work done without the assigning the Global Administrator role. Global Reader works with Microsoft 365 admin center, Exchange admin center, SharePoint admin center, Teams admin center, Microsoft 365 Defender portal, Microsoft Purview compliance portal, Azure portal, and Device Management admin center.

Users with this role **cannot** do the following:

- Cannot access the Purchase Services area in the Microsoft 365 admin center.

> [!NOTE]
> Global Reader role has the following limitations:
>
>- OneDrive admin center - OneDrive admin center does not support the Global Reader role
>- [Microsoft 365 admin center](/microsoft-365/admin/admin-overview/admin-center-overview) - Global Reader can't read integrated apps. You won't find the **Integrated apps** tab under **Settings** in the left pane of Microsoft 365 admin center.
>- [Microsoft 365 Defender portal](/microsoft-365/security/defender/microsoft-365-defender-portal) - Global Reader can't read SCC audit logs, do content search, or see Secure Score.
>- [Teams admin center](/microsoftteams/manage-teams-in-modern-portal) - Global Reader cannot read **Teams lifecycle**, **Analytics & reports**, **IP phone device management**, and **App catalog**. For more information, see [Use Microsoft Teams administrator roles to manage Teams](/microsoftteams/using-admin-roles).
>- [Privileged Access Management](/microsoft-365/compliance/privileged-access-management) doesn't support the Global Reader role.
>- [Azure Information Protection](/azure/information-protection/what-is-information-protection) - Global Reader is supported [for central reporting](/azure/information-protection/reports-aip) only, and when your Microsoft Entra organization isn't on the [unified labeling platform](/azure/information-protection/faqs#how-can-i-determine-if-my-tenant-is-on-the-unified-labeling-platform).
> - [SharePoint](/sharepoint/get-started-new-admin-center) - Global Reader currently can't access SharePoint using PowerShell.
> - [Power Platform admin center](/power-platform/admin/admin-documentation) - Global Reader is not yet supported in the Power Platform admin center.
> - Microsoft Purview doesn't support the Global Reader role.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/accessReviews/allProperties/read | (Deprecated) Read all properties of access reviews |
> | microsoft.directory/accessReviews/definitions/allProperties/read | Read all properties of access reviews of all reviewable resources in Microsoft Entra ID |
> | microsoft.directory/adminConsentRequestPolicy/allProperties/read | Read all properties of admin consent request policies in Microsoft Entra ID |
> | microsoft.directory/administrativeUnits/allProperties/read | Read all properties of administrative units, including members |
> | microsoft.directory/appConsent/appConsentRequests/allProperties/read | Read all properties of consent requests for applications registered with Microsoft Entra ID |
> | microsoft.directory/applications/allProperties/read | Read all properties (including privileged properties) on all types of applications |
> | microsoft.directory/applications/synchronization/standard/read | Read provisioning settings associated with the application object |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, excluding custom security attributes audit logs |
> | microsoft.directory/users/authenticationMethods/standard/restrictedRead | Read standard properties of authentication methods that do not include personally identifiable information for users |
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/cloudAppSecurity/allProperties/read | Read all properties for Defender for Cloud Apps |
> | microsoft.directory/connectors/allProperties/read | Read all properties of application proxy connectors |
> | microsoft.directory/connectorGroups/allProperties/read | Read all properties of application proxy connector groups |
> | microsoft.directory/contacts/allProperties/read | Read all properties for contacts |
> | microsoft.directory/customAuthenticationExtensions/allProperties/read | Read custom authentication extensions |
> | microsoft.directory/deviceLocalCredentials/standard/read | Read all properties of the backed up local administrator account credentials for Microsoft Entra joined devices, except the password |
> | microsoft.directory/devices/allProperties/read | Read all properties of devices |
> | microsoft.directory/directoryRoles/allProperties/read | Read all properties of directory roles |
> | microsoft.directory/directoryRoleTemplates/allProperties/read | Read all properties of directory role templates |
> | microsoft.directory/domains/allProperties/read | Read all properties of domains |
> | microsoft.directory/domains/federationConfiguration/standard/read | Read standard properties of federation configuration for domains |
> | microsoft.directory/entitlementManagement/allProperties/read | Read all properties in Microsoft Entra entitlement management |
> | microsoft.directory/externalUserProfiles/standard/read | Read standard properties of external user profiles in the extended directory for Teams |
> | microsoft.directory/groups/allProperties/read | Read all properties (including privileged properties) on Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groupSettings/allProperties/read | Read all properties of group settings |
> | microsoft.directory/groupSettingTemplates/allProperties/read | Read all properties of group setting templates |
> | microsoft.directory/identityProtection/allProperties/read | Read all resources in Microsoft Entra ID Protection |
> | microsoft.directory/loginOrganizationBranding/allProperties/read | Read all properties for your organization's branded sign-in page |
> | microsoft.directory/namedLocations/standard/read | Read basic properties of custom rules that define network locations |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/read | Read all properties of OAuth 2.0 permission grants |
> | microsoft.directory/organization/allProperties/read | Read all properties for an organization |
> | microsoft.directory/pendingExternalUserProfiles/standard/read | Read standard properties of external user profiles in the extended directory for Teams |
> | microsoft.directory/permissionGrantPolicies/standard/read | Read standard properties of permission grant policies |
> | microsoft.directory/policies/allProperties/read | Read all properties of policies |
> | microsoft.directory/conditionalAccessPolicies/allProperties/read | Read all properties of conditional access policies |
> | microsoft.directory/crossTenantAccessPolicy/standard/read | Read basic properties of cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/standard/read | Read basic properties of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/partners/standard/read | Read basic properties of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationIdentitySynchronization/standard/read | Read basic properties of cross tenant sync policy templates for multi-tenant organization |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationPartnerConfiguration/standard/read | Read basic properties of cross tenant access policy templates for multi-tenant organization |
> | microsoft.directory/crossTenantAccessPolicy/partners/identitySynchronization/standard/read | Read basic properties of cross-tenant sync policy |
> | microsoft.directory/deviceManagementPolicies/standard/read | Read standard properties on device management application policies |
> | microsoft.directory/deviceRegistrationPolicy/standard/read | Read standard properties on device registration policies |
> | microsoft.directory/multiTenantOrganization/joinRequest/standard/read | Read properties of a multi-tenant organization join request |
> | microsoft.directory/multiTenantOrganization/standard/read | Read basic properties of a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/organizationDetails/read | Read organization details of a tenant participating in a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/standard/read | Read basic properties of a tenant participating in a multi-tenant organization |
> | microsoft.directory/privilegedIdentityManagement/allProperties/read | Read all resources in Privileged Identity Management |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/roleAssignments/allProperties/read | Read all properties of role assignments |
> | microsoft.directory/roleDefinitions/allProperties/read | Read all properties of role definitions |
> | microsoft.directory/scopedRoleMemberships/allProperties/read | View members in administrative units |
> | microsoft.directory/serviceAction/getAvailableExtentionProperties | Can perform the getAvailableExtentionProperties service action |
> | microsoft.directory/servicePrincipals/allProperties/read | Read all properties (including privileged properties) on servicePrincipals |
> | microsoft.directory/servicePrincipalCreationPolicies/standard/read | Read standard properties of service principal creation policies |
> | microsoft.directory/servicePrincipals/synchronization/standard/read | Read provisioning settings associated with your service principal |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.directory/subscribedSkus/allProperties/read | Read all properties of product subscriptions |
> | microsoft.directory/users/allProperties/read | Read all properties of users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/verifiableCredentials/configuration/contracts/cards/allProperties/read | Read a verifiable credential card |
> | microsoft.directory/verifiableCredentials/configuration/contracts/allProperties/read | Read a verifiable credential contract |
> | microsoft.directory/verifiableCredentials/configuration/allProperties/read | Read configuration required to create and manage verifiable credentials |
> | microsoft.directory/lifecycleWorkflows/workflows/allProperties/read | Read all properties of lifecycle workflows and tasks in Microsoft Entra ID |
> | microsoft.cloudPC/allEntities/allProperties/read | Read all aspects of Windows 365 |
> | microsoft.commerce.billing/allEntities/allProperties/read | Read all resources of Office 365 billing |
> | microsoft.commerce.billing/purchases/standard/read | Read purchase services in M365 Admin Center. |
> | microsoft.edge/allEntities/allProperties/read | Read all aspects of Microsoft Edge |
> | microsoft.networkAccess/allEntities/allProperties/read | Read all aspects of Microsoft Entra Network Access |
> | microsoft.hardware.support/shippingAddress/allProperties/read | Read shipping addresses for Microsoft hardware warranty claims, including existing shipping addresses created by others |
> | microsoft.hardware.support/shippingStatus/allProperties/read | Read shipping status for open Microsoft hardware warranty claims |
> | microsoft.hardware.support/warrantyClaims/allProperties/read | Read Microsoft hardware warranty claims |
> | microsoft.insights/allEntities/allProperties/read | Read all aspects of Viva Insights |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.messageCenter/securityMessages/read | Read security messages in Message Center in the Microsoft 365 admin center |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.organizationalMessages/allEntities/allProperties/read | Read all aspects of Microsoft 365 Organizational Messages |
> | microsoft.office365.protectionCenter/allEntities/allProperties/read | Read all properties in the Security and Compliance centers |
> | microsoft.office365.securityComplianceCenter/allEntities/read | Read standard properties in Microsoft 365 Security and Compliance Center |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.office365.yammer/allEntities/allProperties/read | Read all aspects of Yammer |
> | microsoft.permissionsManagement/allEntities/allProperties/read | Read all aspects of Microsoft Entra Permissions Management |
> | microsoft.teams/allEntities/allProperties/read | Read all properties of Microsoft Teams |
> | microsoft.virtualVisits/allEntities/allProperties/read | Read all aspects of Virtual Visits |
> | microsoft.viva.goals/allEntities/allProperties/read | Read all aspects of Microsoft Viva Goals |
> | microsoft.viva.pulse/allEntities/allProperties/read | Read all aspects of Microsoft Viva Pulse |
> | microsoft.windows.updatesDeployments/allEntities/allProperties/read | Read all aspects of Windows Update Service |

## Global Secure Access Administrator

Assign the Global Secure Access Administrator role to users who need to do the following:

- Create and manage all aspects of Microsoft Entra Internet Access and Microsoft Entra Private Access
- Manage access to public and private endpoints

Users with this role **cannot** do the following:

- Cannot manage enterprise applications, application registrations, Conditional Access, or application proxy settings

[Learn more](../../global-secure-access/overview-what-is-global-secure-access.md)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.directory/applicationPolicies/standard/read | Read standard properties of application policies |
> | microsoft.directory/applications/applicationProxy/read | Read all application proxy properties |
> | microsoft.directory/applications/owners/read | Read owners of applications |
> | microsoft.directory/applications/policies/read | Read policies of applications |
> | microsoft.directory/applications/standard/read | Read standard properties of applications |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, excluding custom security attributes audit logs |
> | microsoft.directory/conditionalAccessPolicies/standard/read | Read conditional access for policies |
> | microsoft.directory/connectorGroups/allProperties/read | Read all properties of application proxy connector groups |
> | microsoft.directory/connectors/allProperties/read | Read all properties of application proxy connectors |
> | microsoft.directory/crossTenantAccessPolicy/default/standard/read | Read basic properties of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/partners/standard/read | Read basic properties of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/standard/read | Read basic properties of cross-tenant access policy |
> | microsoft.directory/namedLocations/standard/read | Read basic properties of custom rules that define network locations |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.networkAccess/allEntities/allProperties/allTasks | Manage all aspects of Microsoft Entra Network Access |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Groups Administrator

Users in this role can create/manage groups and its settings like naming and expiration policies. It is important to understand that assigning a user to this role gives them the ability to manage all groups in the organization across various workloads like Teams, SharePoint, Yammer in addition to Outlook. Also the user will be able to manage the various groups settings across various admin portals like Microsoft admin center, Azure portal, as well as workload specific ones like Teams and SharePoint admin centers.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/deletedItems.groups/delete | Permanently delete groups, which can no longer be restored |
> | microsoft.directory/deletedItems.groups/restore | Restore soft deleted groups to original state |
> | microsoft.directory/groups/assignLicense | Assign product licenses to groups for group-based licensing |
> | microsoft.directory/groups/create | Create Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/delete | Delete Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups/reprocessLicenseAssignment | Reprocess license assignments for group-based licensing |
> | microsoft.directory/groups/restore | Restore groups from soft-deleted container |
> | microsoft.directory/groups/basic/update | Update basic properties on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/classification/update | Update the classification property on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/dynamicMembershipRule/update | Update the dynamic membership rule on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/groupType/update | Update properties that would affect the group type of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/members/update | Update members of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/onPremWriteBack/update | Update Microsoft Entra groups to be written back to on-premises with Microsoft Entra Connect |
> | microsoft.directory/groups/owners/update | Update owners of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/settings/update | Update settings of groups |
> | microsoft.directory/groups/visibility/update | Update the visibility property of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Guest Inviter

Users in this role can manage Microsoft Entra B2B guest user invitations when the **Members can invite** user setting is set to No. More information about B2B collaboration at [About Microsoft Entra B2B collaboration](../external-identities/what-is-b2b.md). It does not include any other permissions.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/users/inviteGuest | Invite guest users |
> | microsoft.directory/users/standard/read | Read basic properties on users |
> | microsoft.directory/users/appRoleAssignments/read | Read application role assignments for users |
> | microsoft.directory/users/deviceForResourceAccount/read | Read deviceForResourceAccount of users |
> | microsoft.directory/users/directReports/read | Read the direct reports for users |
> | microsoft.directory/users/licenseDetails/read | Read license details of users |
> | microsoft.directory/users/manager/read | Read manager of users |
> | microsoft.directory/users/memberOf/read | Read the group memberships of users |
> | microsoft.directory/users/oAuth2PermissionGrants/read | Read delegated permission grants on users |
> | microsoft.directory/users/ownedDevices/read | Read owned devices of users |
> | microsoft.directory/users/ownedObjects/read | Read owned objects of users |
> | microsoft.directory/users/photo/read | Read photo of users |
> | microsoft.directory/users/registeredDevices/read | Read registered devices of users |
> | microsoft.directory/users/scopedRoleMemberOf/read | Read user's membership of an Microsoft Entra role, that is scoped to an administrative unit |
> | microsoft.directory/users/sponsors/read | Read sponsors of users |

## Helpdesk Administrator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users with this role can change passwords, invalidate refresh tokens, create and manage support requests with Microsoft for Azure and Microsoft 365 services, and monitor service health. Invalidating a refresh token forces the user to sign in again. Whether a Helpdesk Administrator can reset a user's password and invalidate refresh tokens depends on the role the user is assigned. For a list of the roles that a Helpdesk Administrator can reset passwords for and invalidate refresh tokens, see [Who can reset passwords](privileged-roles-permissions.md#who-can-reset-passwords).

Users with this role **cannot** do the following:

- Cannot change the credentials or reset MFA for members and owners of a [role-assignable group](groups-concept.md).

> [!IMPORTANT]
> Users with this role can change passwords for people who may have access to sensitive or private information or critical configuration inside and outside of Microsoft Entra ID. Changing the password of a user may mean the ability to assume that user's identity and permissions. For example:
>
>- Application Registration and Enterprise Application owners, who can manage credentials of apps they own. Those apps may have privileged permissions in Microsoft Entra ID and elsewhere not granted to Helpdesk Administrators. Through this path a Helpdesk Administrator may be able to assume the identity of an application owner and then further assume the identity of a privileged application by updating the credentials for the application.
>- Azure subscription owners, who might have access to sensitive or private information or critical configuration in Azure.
>- Security Group and Microsoft 365 group owners, who can manage group membership. Those groups may grant access to sensitive or private information or critical configuration in Microsoft Entra ID and elsewhere.
>- Administrators in other services outside of Microsoft Entra ID like Exchange Online, Microsoft 365 Defender portal, Microsoft Purview compliance portal, and human resources systems.
>- Non-administrators like executives, legal counsel, and human resources employees who may have access to sensitive or private information.

Delegating administrative permissions over subsets of users and applying policies to a subset of users is possible with [Administrative Units](administrative-units.md).

This role was previously named Password Administrator in the [Azure portal](../../azure-portal/azure-portal-overview.md). It was renamed to Helpdesk Administrator to align with the existing name in the Microsoft Graph API and Azure AD PowerShell.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/deviceLocalCredentials/standard/read | Read all properties of the backed up local administrator account credentials for Microsoft Entra joined devices, except the password |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/password/update | Reset passwords for all users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Hybrid Identity Administrator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users in this role can create, manage and deploy provisioning configuration setup from Active Directory to Microsoft Entra ID using Cloud Provisioning as well as manage Microsoft Entra Connect, Pass-through Authentication (PTA), Password hash synchronization (PHS), Seamless Single Sign-On (Seamless SSO), and federation settings. Users can also troubleshoot and monitor logs using this role.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/create | Create all types of applications |
> | microsoft.directory/applications/delete | Delete all types of applications |
> | microsoft.directory/applications/appRoles/update | Update the appRoles property on all types of applications |
> | microsoft.directory/applications/audience/update | Update the audience property for applications |
> | microsoft.directory/applications/authentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/basic/update | Update basic properties for applications |
> | microsoft.directory/applications/notes/update | Update notes of applications |
> | microsoft.directory/applications/owners/update | Update owners of applications |
> | microsoft.directory/applications/permissions/update | Update exposed permissions and required permissions on all types of applications |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/applications/tag/update | Update tags of applications |
> | microsoft.directory/applications/synchronization/standard/read | Read provisioning settings associated with the application object |
> | microsoft.directory/applicationTemplates/instantiate | Instantiate gallery applications from application templates |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, excluding custom security attributes audit logs |
> | microsoft.directory/cloudProvisioning/allProperties/allTasks | Read and configure all properties of Microsoft Entra Cloud Provisioning service. |
> | microsoft.directory/deletedItems.applications/delete | Permanently delete applications, which can no longer be restored |
> | microsoft.directory/deletedItems.applications/restore | Restore soft deleted applications to original state |
> | microsoft.directory/domains/allProperties/read | Read all properties of domains |
> | microsoft.directory/domains/federation/update | Update federation property of domains |
> | microsoft.directory/domains/federationConfiguration/standard/read | Read standard properties of federation configuration for domains |
> | microsoft.directory/domains/federationConfiguration/basic/update | Update basic federation configuration for domains |
> | microsoft.directory/domains/federationConfiguration/create | Create federation configuration for domains |
> | microsoft.directory/domains/federationConfiguration/delete | Delete federation configuration for domains |
> | microsoft.directory/hybridAuthenticationPolicy/allProperties/allTasks | Manage hybrid authentication policy in Microsoft Entra ID<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/organization/dirSync/update | Update the organization directory sync property |
> | microsoft.directory/passwordHashSync/allProperties/allTasks | Manage all aspects of Password Hash Synchronization (PHS) in Microsoft Entra ID |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/servicePrincipals/create | Create service principals |
> | microsoft.directory/servicePrincipals/delete | Delete service principals |
> | microsoft.directory/servicePrincipals/disable | Disable service principals |
> | microsoft.directory/servicePrincipals/enable | Enable service principals |
> | microsoft.directory/servicePrincipals/synchronizationCredentials/manage | Manage application provisioning secrets and credentials |
> | microsoft.directory/servicePrincipals/synchronizationJobs/manage | Start, restart, and pause application provisioning synchronization jobs |
> | microsoft.directory/servicePrincipals/synchronizationSchema/manage | Create and manage application provisioning synchronization jobs and schema |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/servicePrincipals/audience/update | Update audience properties on service principals |
> | microsoft.directory/servicePrincipals/authentication/update | Update authentication properties on service principals |
> | microsoft.directory/servicePrincipals/basic/update | Update basic properties on service principals |
> | microsoft.directory/servicePrincipals/notes/update | Update notes of service principals |
> | microsoft.directory/servicePrincipals/owners/update | Update owners of service principals |
> | microsoft.directory/servicePrincipals/permissions/update | Update permissions of service principals |
> | microsoft.directory/servicePrincipals/policies/update | Update policies of service principals |
> | microsoft.directory/servicePrincipals/tag/update | Update the tag property for service principals |
> | microsoft.directory/servicePrincipals/synchronization/standard/read | Read provisioning settings associated with your service principal |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.directory/users/authorizationInfo/update | Update the multivalued Certificate user IDs property of users |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Identity Governance Administrator

Users with this role can manage Microsoft Entra ID Governance configuration, including access packages, access reviews, catalogs and policies, ensuring access is approved and reviewed and guest users who no longer need access are removed.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/accessReviews/definitions.applications/allProperties/allTasks | Manage access reviews of application role assignments in Microsoft Entra ID |
> | microsoft.directory/accessReviews/definitions.entitlementManagement/allProperties/allTasks | Manage access reviews for access package assignments in entitlement management |
> | microsoft.directory/accessReviews/definitions.groups/allProperties/read | Read all properties of access reviews for membership in Security and Microsoft 365 groups, including role-assignable groups. |
> | microsoft.directory/accessReviews/definitions.groups/allProperties/update | Update all properties of access reviews for membership in Security and Microsoft 365 groups, excluding role-assignable groups. |
> | microsoft.directory/accessReviews/definitions.groups/create | Create access reviews for membership in Security and Microsoft 365 groups. |
> | microsoft.directory/accessReviews/definitions.groups/delete | Delete access reviews for membership in Security and Microsoft 365 groups. |
> | microsoft.directory/accessReviews/allProperties/allTasks | (Deprecated) Create and delete access reviews, read and update all properties of access reviews, and manage access reviews of groups in Microsoft Entra ID |
> | microsoft.directory/entitlementManagement/allProperties/allTasks | Create and delete resources, and read and update all properties in Microsoft Entra entitlement management |
> | microsoft.directory/groups/members/update | Update members of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |

## Insights Administrator

Users in this role can access the full set of administrative capabilities in the Microsoft Viva Insights app. This role has the ability to read directory information, monitor service health, file support tickets, and access the Insights Administrator settings aspects.

[Learn more](https://go.microsoft.com/fwlink/?linkid=2129521)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.insights/allEntities/allProperties/allTasks | Manage all aspects of Insights app |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Insights Analyst

Assign the Insights Analyst role to users who need to do the following:

- Analyze data in the Microsoft Viva Insights app, but can't manage any configuration settings
- Create, manage, and run queries
- View basic settings and reports in the Microsoft 365 admin center
- Create and manage service requests in the Microsoft 365 admin center

[Learn more](https://go.microsoft.com/fwlink/?linkid=2129521)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.insights/queries/allProperties/allTasks | Run and manage queries in Viva Insights |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Insights Business Leader

Users in this role can access a set of dashboards and insights via the Microsoft Viva Insights app. This includes full access to all dashboards and presented insights and data exploration functionality. Users in this role do not have access to product configuration settings, which is the responsibility of the Insights Administrator role.

[Learn more](https://go.microsoft.com/fwlink/?linkid=2129521)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.insights/reports/allProperties/read | View reports and dashboard in Insights app |
> | microsoft.insights/programs/allProperties/update | Deploy and manage programs in Insights app |

## Intune Administrator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users with this role have global permissions within Microsoft Intune Online, when the service is present. Additionally, this role contains the ability to manage users and devices in order to associate policy, as well as create and manage groups. For more information, see [Role-based administration control (RBAC) with Microsoft Intune](/intune/fundamentals/role-based-access-control).

This role can create and manage all security groups. However, Intune Administrator does not have admin rights over Office groups. That means the admin cannot update owners or memberships of all Office groups in the organization. However, he/she can manage the Office group that he creates which comes as a part of his/her end-user privileges. So, any Office group (not security group) that he/she creates should be counted against his/her quota of 250.

> [!NOTE]
> In the Microsoft Graph API and Azure AD PowerShell, this role is named Intune Service Administrator. In the [Azure portal](../../azure-portal/azure-portal-overview.md), it is named Intune Administrator.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/contacts/create | Create contacts |
> | microsoft.directory/contacts/delete | Delete contacts |
> | microsoft.directory/contacts/basic/update | Update basic properties on contacts |
> | microsoft.directory/deletedItems.devices/delete | Permanently delete devices, which can no longer be restored |
> | microsoft.directory/deletedItems.devices/restore | Restore soft deleted devices to original state |
> | microsoft.directory/devices/create | Create devices (enroll in Microsoft Entra ID) |
> | microsoft.directory/devices/delete | Delete devices from Microsoft Entra ID |
> | microsoft.directory/devices/disable | Disable devices in Microsoft Entra ID |
> | microsoft.directory/devices/enable | Enable devices in Microsoft Entra ID |
> | microsoft.directory/devices/basic/update | Update basic properties on devices |
> | microsoft.directory/devices/extensionAttributeSet1/update | Update the extensionAttribute1 to extensionAttribute5 properties on devices |
> | microsoft.directory/devices/extensionAttributeSet2/update | Update the extensionAttribute6 to extensionAttribute10 properties on devices |
> | microsoft.directory/devices/extensionAttributeSet3/update | Update the extensionAttribute11 to extensionAttribute15 properties on devices |
> | microsoft.directory/devices/registeredOwners/update | Update registered owners of devices |
> | microsoft.directory/devices/registeredUsers/update | Update registered users of devices |
> | microsoft.directory/deviceLocalCredentials/password/read | Read all properties of the backed up local administrator account credentials for Microsoft Entra joined devices, including the password |
> | microsoft.directory/deviceManagementPolicies/standard/read | Read standard properties on device management application policies |
> | microsoft.directory/deviceRegistrationPolicy/standard/read | Read standard properties on device registration policies |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups.security/create | Create Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/delete | Delete Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/basic/update | Update basic properties on Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/classification/update | Update the classification property on Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/dynamicMembershipRule/update | Update the dynamic membership rule on Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/members/update | Update members of Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/owners/update | Update owners of Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/visibility/update | Update the visibility property on Security groups, excluding role-assignable groups |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.directory/users/photo/update | Update photo of users |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.cloudPC/allEntities/allProperties/allTasks | Manage all aspects of Windows 365 |
> | microsoft.intune/allEntities/allTasks | Manage all aspects of Microsoft Intune |
> | microsoft.office365.organizationalMessages/allEntities/allProperties/read | Read all aspects of Microsoft 365 Organizational Messages |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Kaizala Administrator

Users with this role have global permissions to manage settings within Microsoft Kaizala, when the service is present, as well as the ability to manage support tickets and monitor service health. Additionally, the user can access reports related to adoption & usage of Kaizala by Organization members and business reports generated using the Kaizala actions.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Knowledge Administrator

Users in this role have full access to all knowledge, learning and intelligent features settings in the Microsoft 365 admin center. They have a general understanding of the suite of products, licensing details and have responsibility to control access. Knowledge Administrator can create and manage content, like topics, acronyms and learning resources. Additionally, these users can create content centers, monitor service health, and create service requests.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groups.security/create | Create Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/createAsOwner | Create Security groups, excluding role-assignable groups. Creator is added as the first owner. |
> | microsoft.directory/groups.security/delete | Delete Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/basic/update | Update basic properties on Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/members/update | Update members of Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/owners/update | Update owners of Security groups, excluding role-assignable groups |
> | microsoft.office365.knowledge/contentUnderstanding/allProperties/allTasks | Read and update all properties of content understanding in Microsoft 365 admin center |
> | microsoft.office365.knowledge/knowledgeNetwork/allProperties/allTasks | Read and update all properties of knowledge network in Microsoft 365 admin center |
> | microsoft.office365.knowledge/learningSources/allProperties/allTasks | Manage learning sources and all their properties in Learning App. |
> | microsoft.office365.protectionCenter/sensitivityLabels/allProperties/read | Read all properties of sensitivity labels in the Security and Compliance centers |
> | microsoft.office365.sharePoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in SharePoint |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Knowledge Manager

Users in this role can create and manage content, like topics, acronyms and learning content. These users are primarily responsible for the quality and structure of knowledge. This user has full rights to topic management actions to confirm a topic, approve edits, or delete a topic. This role can also manage taxonomies as part of the term store management tool and create content centers.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groups.security/create | Create Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/createAsOwner | Create Security groups, excluding role-assignable groups. Creator is added as the first owner. |
> | microsoft.directory/groups.security/delete | Delete Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/basic/update | Update basic properties on Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/members/update | Update members of Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/owners/update | Update owners of Security groups, excluding role-assignable groups |
> | microsoft.office365.knowledge/contentUnderstanding/analytics/allProperties/read | Read analytics reports of content understanding in Microsoft 365 admin center |
> | microsoft.office365.knowledge/knowledgeNetwork/topicVisibility/allProperties/allTasks | Manage topic visibility of knowledge network in Microsoft 365 admin center |
> | microsoft.office365.sharePoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in SharePoint |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## License Administrator

Users in this role can read, add, remove, and update license assignments on users, groups (using group-based licensing), and manage the usage location on users. The role does not grant the ability to purchase or manage subscriptions, create or manage groups, or create or manage users beyond the usage location. This role has no access to view, create, or manage support tickets.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.directory/groups/assignLicense | Assign product licenses to groups for group-based licensing |
> | microsoft.directory/groups/reprocessLicenseAssignment | Reprocess license assignments for group-based licensing |
> | microsoft.directory/users/assignLicense | Manage user licenses |
> | microsoft.directory/users/reprocessLicenseAssignment | Reprocess license assignments for users |
> | microsoft.directory/users/usageLocation/update | Update usage location of users |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Lifecycle Workflows Administrator

Assign the Lifecycle Workflows Administrator role to users who need to do the following tasks:

- Create and manage all aspects of workflows and tasks associated with Lifecycle Workflows in Microsoft Entra ID
- Check the execution of scheduled workflows
- Launch on-demand workflow runs
- Inspect workflow execution logs

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/lifecycleWorkflows/workflows/allProperties/allTasks | Manage all aspects of lifecycle workflows and tasks in Microsoft Entra ID |
> | microsoft.directory/organization/strongAuthentication/read | Read strong authentication properties of an organization |

## Message Center Privacy Reader

Users in this role can monitor all notifications in the Message Center, including data privacy messages. Message Center Privacy Readers get email notifications including those related to data privacy and they can unsubscribe using Message Center Preferences. Only the Global Administrator and the Message Center Privacy Reader can read data privacy messages. Additionally, this role contains the ability to view groups, domains, and subscriptions. This role has no permission to view, create, or manage service requests.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.messageCenter/securityMessages/read | Read security messages in Message Center in the Microsoft 365 admin center |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Message Center Reader

Users in this role can monitor notifications and advisory health updates in [Message center](/microsoft-365/admin/manage/message-center) for their organization on configured services such as Exchange, Intune, and Microsoft Teams. Message Center Readers receive weekly email digests of posts, updates, and can share message center posts in Microsoft 365. In Microsoft Entra ID, users assigned to this role will only have read-only access on Microsoft Entra services such as users and groups. This role has no access to view, create, or manage support tickets.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Microsoft Hardware Warranty Administrator

Assign the Microsoft Hardware Warranty Administrator role to users who need to do the following tasks:

- Create new warranty claims for Microsoft manufactured hardware, like Surface and HoloLens
- Search and read opened or closed warranty claims
- Search and read warranty claims by serial number
- Create, read, update, and delete shipping addresses
- Read shipping status for open warranty claims
- Create and manage service requests in the Microsoft 365 admin center
- Read Message center announcements in the Microsoft 365 admin center

A warranty claim is a request to have the hardware repaired or replaced in accordance with the terms of the warranty. For more information, see [Self-serve your Surface warranty & service requests](/surface/self-serve-warranty-service).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.hardware.support/shippingAddress/allProperties/allTasks | Create, read, update, and delete shipping addresses for Microsoft hardware warranty claims, including shipping addresses created by others |
> | microsoft.hardware.support/shippingStatus/allProperties/read | Read shipping status for open Microsoft hardware warranty claims |
> | microsoft.hardware.support/warrantyClaims/allProperties/allTasks | Create and manage all aspects of Microsoft hardware warranty claims |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Microsoft Hardware Warranty Specialist

Assign the Microsoft Hardware Warranty Specialist role to users who need to do the following tasks:

- Create new warranty claims for Microsoft manufactured hardware, like Surface and HoloLens
- Read warranty claims that they created
- Read and update existing shipping addresses
- Read shipping status for open warranty claims they created
- Create and manage service requests in the Microsoft 365 admin center

A warranty claim is a request to have the hardware repaired or replaced in accordance with the terms of the warranty. For more information, see [Self-serve your Surface warranty & service requests](/surface/self-serve-warranty-service).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.hardware.support/shippingAddress/allProperties/read | Read shipping addresses for Microsoft hardware warranty claims, including existing shipping addresses created by others |
> | microsoft.hardware.support/warrantyClaims/createAsOwner | Create Microsoft hardware warranty claims where creator is the owner |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.hardware.support/shippingStatus/allProperties/read | Read shipping status for open Microsoft hardware warranty claims |
> | microsoft.hardware.support/warrantyClaims/allProperties/read | Read Microsoft hardware warranty claims |

## Modern Commerce User

Do not use. This role is automatically assigned from Commerce, and is not intended or supported for any other use. See details below.

The Modern Commerce User role gives certain users permission to access Microsoft 365 admin center and see the left navigation entries for **Home**, **Billing**, and **Support**. The content available in these areas is controlled by [commerce-specific roles](../../cost-management-billing/manage/understand-mca-roles.md) assigned to users to manage products that they bought for themselves or your organization. This might include tasks like paying bills, or for access to billing accounts and billing profiles.

Users with the Modern Commerce User role typically have administrative permissions in other Microsoft purchasing systems, but do not have Global Administrator or Billing Administrator roles used to access the admin center.

**When is the Modern Commerce User role assigned?**

* **Self-service purchase in Microsoft 365 admin center** – Self-service purchase gives users a chance to try out new products by buying or signing up for them on their own. These products are managed in the admin center. Users who make a self-service purchase are assigned a role in the commerce system, and the Modern Commerce User role so they can manage their purchases in admin center. Admins can block self-service purchases (for Fabric, Power BI, Power Apps, Power automate) through [PowerShell](/microsoft-365/commerce/subscriptions/allowselfservicepurchase-powershell). For more information, see [Self-service purchase FAQ](/microsoft-365/commerce/subscriptions/self-service-purchase-faq).
* **Purchases from Microsoft commercial marketplace** – Similar to self-service purchase, when a user buys a product or service from Microsoft AppSource or Azure Marketplace, the Modern Commerce User role is assigned if they don’t have the Global Administrator or Billing Administrator role. In some cases, users might be blocked from making these purchases. For more information, see [Microsoft commercial marketplace](../../marketplace/marketplace-faq-publisher-guide.yml#what-could-block-a-customer-from-completing-a-purchase-).
* **Proposals from Microsoft** – A proposal is a formal offer from Microsoft for your organization to buy Microsoft products and services. When the person who is accepting the proposal doesn’t have a Global Administrator or Billing Administrator role in Microsoft Entra ID, they are assigned both a commerce-specific role to complete the proposal and the Modern Commerce User role to access admin center. When they access the admin center they can only use features that are authorized by their commerce-specific role.
* **Commerce-specific roles** – Some users are assigned commerce-specific roles. If a user isn't a Global Administrator or Billing Administrator, they get the Modern Commerce User role so they can access the admin center.

If the Modern Commerce User role is unassigned from a user, they lose access to Microsoft 365 admin center. If they were managing any products, either for themselves or for your organization, they won’t be able to manage them. This might include assigning licenses, changing payment methods, paying bills, or other tasks for managing subscriptions.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.commerce.billing/partners/read |  |
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

## Organizational Messages Writer

Assign the Organizational Messages Writer role to users who need to do the following tasks:

- Write, publish, and delete organizational messages using Microsoft 365 admin center or Microsoft Intune
- Manage organizational message delivery options using Microsoft 365 admin center or Microsoft Intune
- Read organizational message delivery results using Microsoft 365 admin center or Microsoft Intune
- View usage reports and most settings in the Microsoft 365 admin center, but can't make changes

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.organizationalMessages/allEntities/allProperties/allTasks | Manage all authoring aspects of Microsoft 365 Organizational Messages |
> | microsoft.office365.usageReports/allEntities/standard/read | Read tenant-level aggregated Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Partner Tier1 Support

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Do not use. This role has been deprecated and will be removed from Microsoft Entra ID in the future. This role is intended for use by a small number of Microsoft resale partners, and is not intended for general use.

> [!IMPORTANT]
> This role can reset passwords and invalidate refresh tokens for only non-administrators. This role should not be used because it is deprecated.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/appRoles/update | Update the appRoles property on all types of applications |
> | microsoft.directory/applications/audience/update | Update the audience property for applications |
> | microsoft.directory/applications/authentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/basic/update | Update basic properties for applications |
> | microsoft.directory/applications/credentials/update | Update application credentials<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/applications/notes/update | Update notes of applications |
> | microsoft.directory/applications/owners/update | Update owners of applications |
> | microsoft.directory/applications/permissions/update | Update exposed permissions and required permissions on all types of applications |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/applications/tag/update | Update tags of applications |
> | microsoft.directory/contacts/create | Create contacts |
> | microsoft.directory/contacts/delete | Delete contacts |
> | microsoft.directory/contacts/basic/update | Update basic properties on contacts |
> | microsoft.directory/deletedItems.groups/restore | Restore soft deleted groups to original state |
> | microsoft.directory/deletedItems.users/restore | Restore soft deleted users to original state |
> | microsoft.directory/groups/create | Create Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/delete | Delete Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/restore | Restore groups from soft-deleted container |
> | microsoft.directory/groups/members/update | Update members of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/owners/update | Update owners of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/users/assignLicense | Manage user licenses |
> | microsoft.directory/users/create | Add users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/delete | Delete users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/disable | Disable users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/enable | Enable users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/restore | Restore deleted users |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.directory/users/password/update | Reset passwords for all users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/photo/update | Update photo of users |
> | microsoft.directory/users/userPrincipalName/update | Update User Principal Name of users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Partner Tier2 Support

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Do not use. This role has been deprecated and will be removed from Microsoft Entra ID in the future. This role is intended for use by a small number of Microsoft resale partners, and is not intended for general use.

> [!IMPORTANT]
> This role can reset passwords and invalidate refresh tokens for all non-administrators and administrators (including Global Administrators). This role should not be used because it is deprecated.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/appRoles/update | Update the appRoles property on all types of applications |
> | microsoft.directory/applications/audience/update | Update the audience property for applications |
> | microsoft.directory/applications/authentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/basic/update | Update basic properties for applications |
> | microsoft.directory/applications/credentials/update | Update application credentials<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/applications/notes/update | Update notes of applications |
> | microsoft.directory/applications/owners/update | Update owners of applications |
> | microsoft.directory/applications/permissions/update | Update exposed permissions and required permissions on all types of applications |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/applications/tag/update | Update tags of applications |
> | microsoft.directory/contacts/create | Create contacts |
> | microsoft.directory/contacts/delete | Delete contacts |
> | microsoft.directory/contacts/basic/update | Update basic properties on contacts |
> | microsoft.directory/deletedItems.groups/restore | Restore soft deleted groups to original state |
> | microsoft.directory/deletedItems.users/restore | Restore soft deleted users to original state |
> | microsoft.directory/domains/allProperties/allTasks | Create and delete domains, and read and update all properties |
> | microsoft.directory/groups/create | Create Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/delete | Delete Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/restore | Restore groups from soft-deleted container |
> | microsoft.directory/groups/members/update | Update members of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/owners/update | Update owners of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/organization/basic/update | Update basic properties on organization |
> | microsoft.directory/roleAssignments/allProperties/allTasks | Create and delete role assignments, and read and update all role assignment properties |
> | microsoft.directory/roleDefinitions/allProperties/allTasks | Create and delete role definitions, and read and update all properties |
> | microsoft.directory/scopedRoleMemberships/allProperties/allTasks | Create and delete scopedRoleMemberships, and read and update all properties |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/subscribedSkus/standard/read | Read basic properties on subscriptions |
> | microsoft.directory/users/assignLicense | Manage user licenses |
> | microsoft.directory/users/create | Add users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/delete | Delete users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/disable | Disable users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/enable | Enable users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/restore | Restore deleted users |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.directory/users/password/update | Reset passwords for all users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/photo/update | Update photo of users |
> | microsoft.directory/users/userPrincipalName/update | Update User Principal Name of users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Password Administrator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users with this role have limited ability to manage passwords. This role does not grant the ability to manage service requests or monitor service health. Whether a Password Administrator can reset a user's password depends on the role the user is assigned. For a list of the roles that a Password Administrator can reset passwords for, see [Who can reset passwords](privileged-roles-permissions.md#who-can-reset-passwords).

Users with this role **cannot** do the following:

- Cannot change the credentials or reset MFA for members and owners of a [role-assignable group](groups-concept.md).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/users/password/update | Reset passwords for all users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Permissions Management Administrator

Assign the Permissions Management Administrator role to users who need to do the following tasks:

- Manage all aspects of Microsoft Entra Permissions Management, when the service is present

Learn more about Permissions Management roles and polices at [View information about roles/policies](../cloud-infrastructure-entitlement-management/how-to-view-role-policy.md).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.permissionsManagement/allEntities/allProperties/allTasks | Manage all aspects of Microsoft Entra Permissions Management |

## Power Platform Administrator

Users in this role can create and manage all aspects of environments, Power Apps, Flows, Data Loss Prevention policies. Additionally, users with this role have the ability to manage support tickets and monitor service health.

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

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Assign the Privileged Authentication Administrator role to users who need to do the following:

- Set or reset any authentication method (including passwords) for any user, including Global Administrators.
- Delete or restore any users, including Global Administrators. For more information, see [Who can perform sensitive actions](privileged-roles-permissions.md#who-can-perform-sensitive-actions).
- Force users to re-register against existing non-password credential (such as MFA or FIDO) and revoke **remember MFA on the device**, prompting for MFA on the next sign-in of all users.
- Update sensitive properties for all users. For more information, see [Who can perform sensitive actions](privileged-roles-permissions.md#who-can-perform-sensitive-actions).
- Create and manage support tickets in Azure and the Microsoft 365 admin center.

Users with this role **cannot** do the following:

- Cannot manage per-user MFA in the legacy MFA management portal. The same functions can be accomplished using the [Set-MsolUser](/powershell/module/msonline/set-msoluser) commandlet Azure AD PowerShell module.

[!INCLUDE [authentication-table-include](./includes/authentication-table-include.md)]

> [!IMPORTANT]
> Users with this role can change credentials for people who may have access to sensitive or private information or critical configuration inside and outside of Microsoft Entra ID. Changing the credentials of a user may mean the ability to assume that user's identity and permissions. For example:
>
>* Application Registration and Enterprise Application owners, who can manage credentials of apps they own. Those apps may have privileged permissions in Microsoft Entra ID and elsewhere not granted to Authentication Administrators. Through this path an Authentication Administrator can assume the identity of an application owner and then further assume the identity of a privileged application by updating the credentials for the application.
>* Azure subscription owners, who may have access to sensitive or private information or critical configuration in Azure.
>* Security Group and Microsoft 365 group owners, who can manage group membership. Those groups may grant access to sensitive or private information or critical configuration in Microsoft Entra ID and elsewhere.
>* Administrators in other services outside of Microsoft Entra ID like Exchange Online, Microsoft 365 Defender portal, and Microsoft Purview compliance portal, and human resources systems.
>* Non-administrators like executives, legal counsel, and human resources employees who may have access to sensitive or private information.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/users/authenticationMethods/create | Update authentication methods for users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/authenticationMethods/delete | Delete authentication methods for users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/authenticationMethods/standard/read | Read standard properties of authentication methods for users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/authenticationMethods/basic/update | Update basic properties of authentication methods for users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/deletedItems.users/restore | Restore soft deleted users to original state |
> | microsoft.directory/users/delete | Delete users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/disable | Disable users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/enable | Enable users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/restore | Restore deleted users |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/authorizationInfo/update | Update the multivalued Certificate user IDs property of users |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.directory/users/password/update | Reset passwords for all users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/userPrincipalName/update | Update User Principal Name of users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Privileged Role Administrator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users with this role can manage role assignments in Microsoft Entra ID, as well as within Microsoft Entra Privileged Identity Management. They can create and manage groups that can be assigned to Microsoft Entra roles. In addition, this role allows management of all aspects of Privileged Identity Management and administrative units.

> [!IMPORTANT]
> This role grants the ability to manage assignments for all Microsoft Entra roles including the Global Administrator role. This role does not include any other privileged abilities in Microsoft Entra ID like creating or updating users. However, users assigned to this role can grant themselves or others additional privilege by assigning additional roles.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/accessReviews/definitions.applications/allProperties/read | Read all properties of access reviews of application role assignments in Microsoft Entra ID |
> | microsoft.directory/accessReviews/definitions.directoryRoles/allProperties/allTasks | Manage access reviews for Microsoft Entra role assignments |
> | microsoft.directory/accessReviews/definitions.groupsAssignableToRoles/allProperties/update | Update all properties of access reviews for membership in groups that are assignable to Microsoft Entra roles |
> | microsoft.directory/accessReviews/definitions.groupsAssignableToRoles/create | Create access reviews for membership in groups that are assignable to Microsoft Entra roles |
> | microsoft.directory/accessReviews/definitions.groupsAssignableToRoles/delete | Delete access reviews for membership in groups that are assignable to Microsoft Entra roles |
> | microsoft.directory/accessReviews/definitions.groups/allProperties/read | Read all properties of access reviews for membership in Security and Microsoft 365 groups, including role-assignable groups. |
> | microsoft.directory/administrativeUnits/allProperties/allTasks | Create and manage administrative units (including members) |
> | microsoft.directory/authorizationPolicy/allProperties/allTasks | Manage all aspects of authorization policy<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/directoryRoles/allProperties/allTasks | Create and delete directory roles, and read and update all properties |
> | microsoft.directory/groupsAssignableToRoles/create | Create role-assignable groups |
> | microsoft.directory/groupsAssignableToRoles/delete | Delete role-assignable groups |
> | microsoft.directory/groupsAssignableToRoles/restore | Restore role-assignable groups |
> | microsoft.directory/groupsAssignableToRoles/allProperties/update | Update role-assignable groups |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/privilegedIdentityManagement/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Privileged Identity Management |
> | microsoft.directory/roleAssignments/allProperties/allTasks | Create and delete role assignments, and read and update all role assignment properties |
> | microsoft.directory/roleDefinitions/allProperties/allTasks | Create and delete role definitions, and read and update all properties |
> | microsoft.directory/scopedRoleMemberships/allProperties/allTasks | Create and delete scopedRoleMemberships, and read and update all properties |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/servicePrincipals/permissions/update | Update permissions of service principals |
> | microsoft.directory/servicePrincipals/managePermissionGrantsForAll.microsoft-company-admin | Grant consent for any permission to any application |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Reports Reader

Users with this role can view usage reporting data and the reports dashboard in Microsoft 365 admin center and the adoption context pack in Fabric and Power BI. Additionally, the role provides access to all sign-in logs, audit logs, and activity reports in Microsoft Entra ID and data returned by the Microsoft Graph reporting API. A user assigned to the Reports Reader role can access only relevant usage and adoption metrics. They don't have any admin permissions to configure settings or access the product-specific admin centers like Exchange. This role has no access to view, create, or manage support tickets.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, excluding custom security attributes audit logs |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
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

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users with this role have permissions to manage security-related features in the Microsoft 365 Defender portal, Microsoft Entra ID Protection, Microsoft Entra Authentication, Azure Information Protection, and Microsoft Purview compliance portal. For more information about Office 365 permissions, see [Roles and role groups in Microsoft Defender for Office 365 and Microsoft Purview compliance](/microsoft-365/security/office-365-security/scc-permissions).

In | Can do
--- | ---
[Microsoft 365 Defender portal](/microsoft-365/security/defender/microsoft-365-defender-portal) | Monitor security-related policies across Microsoft 365 services<br>Manage security threats and alerts<br>View reports
[Identity Protection](../identity-protection/overview-identity-protection.md) | All permissions of the Security Reader role<br>Perform all Identity Protection operations except for resetting passwords
[Privileged Identity Management](../privileged-identity-management/pim-configure.md) | All permissions of the Security Reader role<br>**Cannot** manage Microsoft Entra role assignments or settings
[Microsoft Purview compliance portal](/microsoft-365/compliance/microsoft-365-compliance-center) | Manage security policies<br>View, investigate, and respond to security threats<br>View reports
Azure Advanced Threat Protection | Monitor and respond to suspicious security activity
[Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/prepare-deployment) | Assign roles<br>Manage machine groups<br>Configure endpoint threat detection and automated remediation<br>View, investigate, and respond to alerts<br/>View machines/device inventory
[Intune](/intune/role-based-access-control) | Views user, device, enrollment, configuration, and application information<br>Cannot make changes to Intune
[Microsoft Defender for Cloud Apps](/defender-cloud-apps/manage-admins) | Add admins, add policies and settings, upload logs and perform governance actions
[Microsoft 365 service health](/microsoft-365/enterprise/view-service-health) | View the health of Microsoft 365 services
[Smart lockout](../authentication/howto-password-smart-lockout.md) | Define the threshold and duration for lockouts when failed sign-in events happen.
[Password Protection](../authentication/concept-password-ban-bad.md) | Configure custom banned password list or on-premises password protection.
[Cross-tenant synchronization](../multi-tenant-organizations/cross-tenant-synchronization-overview.md) | Configure cross-tenant access settings for users in another tenant. Security Administrators can't directly create and delete users, but can indirectly create and delete synchronized users from another tenant when both tenants are configured for cross-tenant synchronization, which is a privileged permission.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/applications/policies/update | Update policies of applications |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, excluding custom security attributes audit logs |
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/crossTenantAccessPolicy/standard/read | Read basic properties of cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/allowedCloudEndpoints/update | Update allowed cloud endpoints of cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/basic/update | Update basic settings of cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/standard/read | Read basic properties of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/b2bCollaboration/update | Update Microsoft Entra B2B collaboration settings of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/b2bDirectConnect/update | Update Microsoft Entra B2B direct connect settings of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/crossCloudMeetings/update | Update cross-cloud Teams meeting settings of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/tenantRestrictions/update | Update tenant restrictions of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/partners/create | Create cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/delete | Delete cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/standard/read | Read basic properties of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationIdentitySynchronization/basic/update | Update cross tenant sync policy templates for multi-tenant organization |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationIdentitySynchronization/resetToDefaultSettings | Reset cross tenant sync policy template for multi-tenant organization to default settings |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationIdentitySynchronization/standard/read | Read basic properties of cross tenant sync policy templates for multi-tenant organization |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationPartnerConfiguration/basic/update | Update cross tenant access policy templates for multi-tenant organization |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationPartnerConfiguration/resetToDefaultSettings | Reset cross tenant access policy template for multi-tenant organization to default settings |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationPartnerConfiguration/standard/read | Read basic properties of cross tenant access policy templates for multi-tenant organization |
> | microsoft.directory/crossTenantAccessPolicy/partners/b2bCollaboration/update | Update Microsoft Entra B2B collaboration settings of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/b2bDirectConnect/update | Update Microsoft Entra B2B direct connect settings of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/crossCloudMeetings/update | Update cross-cloud Teams meeting settings of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/tenantRestrictions/update | Update tenant restrictions of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/identitySynchronization/create | Create cross-tenant sync policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/identitySynchronization/basic/update | Update basic settings of cross-tenant sync policy |
> | microsoft.directory/crossTenantAccessPolicy/partners/identitySynchronization/standard/read | Read basic properties of cross-tenant sync policy |
> | microsoft.directory/deviceLocalCredentials/standard/read | Read all properties of the backed up local administrator account credentials for Microsoft Entra joined devices, except the password |
> | microsoft.directory/domains/federation/update | Update federation property of domains |
> | microsoft.directory/domains/federationConfiguration/standard/read | Read standard properties of federation configuration for domains |
> | microsoft.directory/domains/federationConfiguration/basic/update | Update basic federation configuration for domains |
> | microsoft.directory/domains/federationConfiguration/create | Create federation configuration for domains |
> | microsoft.directory/domains/federationConfiguration/delete | Delete federation configuration for domains |
> | microsoft.directory/entitlementManagement/allProperties/read | Read all properties in Microsoft Entra entitlement management |
> | microsoft.directory/identityProtection/allProperties/read | Read all resources in Microsoft Entra ID Protection |
> | microsoft.directory/identityProtection/allProperties/update | Update all resources in Microsoft Entra ID Protection<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/multiTenantOrganization/basic/update | Update basic properties of a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/create | Create a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/joinRequest/organizationDetails/update | Join a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/joinRequest/standard/read | Read properties of a multi-tenant organization join request |
> | microsoft.directory/multiTenantOrganization/standard/read | Read basic properties of a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/organizationDetails/update | Update basic properties of a tenant participating in a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/create | Create a tenant in a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/delete | Delete a tenant participating in a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/organizationDetails/read | Read organization details of a tenant participating in a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/standard/read | Read basic properties of a tenant participating in a multi-tenant organization |
> | microsoft.directory/namedLocations/create | Create custom rules that define network locations |
> | microsoft.directory/namedLocations/delete | Delete custom rules that define network locations |
> | microsoft.directory/namedLocations/standard/read | Read basic properties of custom rules that define network locations |
> | microsoft.directory/namedLocations/basic/update | Update basic properties of custom rules that define network locations |
> | microsoft.directory/policies/create | Create policies in Microsoft Entra ID |
> | microsoft.directory/policies/delete | Delete policies in Microsoft Entra ID |
> | microsoft.directory/policies/basic/update | Update basic properties on policies<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
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
> | microsoft.directory/resourceNamespaces/resourceActions/authenticationContext/update | Update Conditional Access authentication context of Microsoft 365 role-based access control (RBAC) resource actions<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/servicePrincipals/policies/update | Update policies of service principals |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.networkAccess/allEntities/allProperties/allTasks | Manage all aspects of Microsoft Entra Network Access |
> | microsoft.office365.protectionCenter/allEntities/standard/read | Read standard properties of all resources in the Security and Compliance centers |
> | microsoft.office365.protectionCenter/allEntities/basic/update | Update basic properties of all resources in the Security and Compliance centers |
> | microsoft.office365.protectionCenter/attackSimulator/payload/allProperties/allTasks | Create and manage attack payloads in Attack Simulator |
> | microsoft.office365.protectionCenter/attackSimulator/reports/allProperties/read | Read reports of attack simulation, responses, and associated training |
> | microsoft.office365.protectionCenter/attackSimulator/simulation/allProperties/allTasks | Create and manage attack simulation templates in Attack Simulator |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Security Operator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users with this role can manage alerts and have global read-only access on security-related features, including all information in Microsoft 365 Defender portal, Microsoft Entra ID Protection, Privileged Identity Management and Microsoft Purview compliance portal. For more information about Office 365 permissions, see [Roles and role groups in Microsoft Defender for Office 365 and Microsoft Purview compliance](/microsoft-365/security/office-365-security/scc-permissions).

| In | Can do |
| --- | --- |
| [Microsoft 365 Defender portal](/microsoft-365/security/defender/microsoft-365-defender-portal) | All permissions of the Security Reader role<br/>View, investigate, and respond to security threats alerts<br/>Manage security settings in Microsoft 365 Defender portal |
| [Identity Protection](../identity-protection/overview-identity-protection.md) | All permissions of the Security Reader role<br>Perform all Identity Protection operations except for configuring or changing risk-based policies, resetting passwords, and configuring alert e-mails. |
| [Privileged Identity Management](../privileged-identity-management/pim-configure.md) | All permissions of the Security Reader role |
| [Microsoft Purview compliance portal](/microsoft-365/compliance/microsoft-365-compliance-center) | All permissions of the Security Reader role<br>View, investigate, and respond to security alerts |
| [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/prepare-deployment) | All permissions of the Security Reader role<br/>View, investigate, and respond to security alerts<br/>When you turn on role-based access control in Microsoft Defender for Endpoint, users with read-only permissions such as the Security Reader role lose access until they are assigned a Microsoft Defender for Endpoint role. |
| [Intune](/intune/role-based-access-control) | All permissions of the Security Reader role |
| [Microsoft Defender for Cloud Apps](/defender-cloud-apps/manage-admins) | All permissions of the Security Reader role<br>View, investigate, and respond to security alerts |
| [Microsoft 365 service health](/microsoft-365/enterprise/view-service-health) | View the health of Microsoft 365 services |

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, excluding custom security attributes audit logs |
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.directory/cloudAppSecurity/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Microsoft Defender for Cloud Apps |
> | microsoft.directory/identityProtection/allProperties/allTasks | Create and delete all resources, and read and update standard properties in Microsoft Entra ID Protection<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/privilegedIdentityManagement/allProperties/read | Read all resources in Privileged Identity Management |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.advancedThreatProtection/allEntities/allTasks | Manage all aspects of Azure Advanced Threat Protection |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.intune/allEntities/read | Read all resources in Microsoft Intune |
> | microsoft.office365.securityComplianceCenter/allEntities/allTasks | Create and delete all resources, and read and update standard properties in the Office 365 Security & Compliance Center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.windows.defenderAdvancedThreatProtection/allEntities/allTasks | Manage all aspects of Microsoft Defender for Endpoint |

## Security Reader

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Users with this role have global read-only access on security-related feature, including all information in Microsoft 365 Defender portal, Microsoft Entra ID Protection, Privileged Identity Management, as well as the ability to read Microsoft Entra sign-in reports and audit logs, and in Microsoft Purview compliance portal. For more information about Office 365 permissions, see [Roles and role groups in Microsoft Defender for Office 365 and Microsoft Purview compliance](/microsoft-365/security/office-365-security/scc-permissions).

In | Can do
--- | ---
[Microsoft 365 Defender portal](/microsoft-365/security/defender/microsoft-365-defender-portal) | View security-related policies across Microsoft 365 services<br>View security threats and alerts<br>View reports
[Identity Protection](../identity-protection/overview-identity-protection.md) | View all Identity Protection reports and Overview
[Privileged Identity Management](../privileged-identity-management/pim-configure.md) | Has read-only access to all information surfaced in Microsoft Entra Privileged Identity Management: Policies and reports for Microsoft Entra role assignments and security reviews.<br>**Cannot** sign up for Microsoft Entra Privileged Identity Management or make any changes to it. In the Privileged Identity Management portal or via PowerShell, someone in this role can activate additional roles (for example, Global Administrator or Privileged Role Administrator), if the user is eligible for them.
[Microsoft Purview compliance portal](/microsoft-365/compliance/microsoft-365-compliance-center) | View security policies<br>View and investigate security threats<br>View reports
[Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/prepare-deployment) | View and investigate alerts<br/>When you turn on role-based access control in Microsoft Defender for Endpoint, users with read-only permissions such as the Security Reader role lose access until they are assigned a Microsoft Defender for Endpoint role.
[Intune](/intune/role-based-access-control) | Views user, device, enrollment, configuration, and application information. Cannot make changes to Intune.
[Microsoft Defender for Cloud Apps](/defender-cloud-apps/manage-admins) | Has read permissions.
[Microsoft 365 service health](/microsoft-365/enterprise/view-service-health) | View the health of Microsoft 365 services

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/accessReviews/definitions/allProperties/read | Read all properties of access reviews of all reviewable resources in Microsoft Entra ID |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, excluding custom security attributes audit logs |
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.directory/bitlockerKeys/key/read | Read bitlocker metadata and key on devices<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/deviceLocalCredentials/standard/read | Read all properties of the backed up local administrator account credentials for Microsoft Entra joined devices, except the password |
> | microsoft.directory/domains/federationConfiguration/standard/read | Read standard properties of federation configuration for domains |
> | microsoft.directory/entitlementManagement/allProperties/read | Read all properties in Microsoft Entra entitlement management |
> | microsoft.directory/identityProtection/allProperties/read | Read all resources in Microsoft Entra ID Protection |
> | microsoft.directory/namedLocations/standard/read | Read basic properties of custom rules that define network locations |
> | microsoft.directory/policies/standard/read | Read basic properties on policies |
> | microsoft.directory/policies/owners/read | Read owners of policies |
> | microsoft.directory/policies/policyAppliedTo/read | Read policies.policyAppliedTo property |
> | microsoft.directory/conditionalAccessPolicies/standard/read | Read conditional access for policies |
> | microsoft.directory/conditionalAccessPolicies/owners/read | Read the owners of conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/policyAppliedTo/read | Read the "applied to" property for conditional access policies |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationIdentitySynchronization/standard/read | Read basic properties of cross tenant sync policy templates for multi-tenant organization |
> | microsoft.directory/crossTenantAccessPolicy/partners/templates/multiTenantOrganizationPartnerConfiguration/standard/read | Read basic properties of cross tenant access policy templates for multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/joinRequest/standard/read | Read properties of a multi-tenant organization join request |
> | microsoft.directory/multiTenantOrganization/standard/read | Read basic properties of a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/organizationDetails/read | Read organization details of a tenant participating in a multi-tenant organization |
> | microsoft.directory/multiTenantOrganization/tenants/standard/read | Read basic properties of a tenant participating in a multi-tenant organization |
> | microsoft.directory/privilegedIdentityManagement/allProperties/read | Read all resources in Privileged Identity Management |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.networkAccess/allEntities/allProperties/read | Read all aspects of Microsoft Entra Network Access |
> | microsoft.office365.protectionCenter/allEntities/standard/read | Read standard properties of all resources in the Security and Compliance centers |
> | microsoft.office365.protectionCenter/attackSimulator/payload/allProperties/read | Read all properties of attack payloads in Attack Simulator |
> | microsoft.office365.protectionCenter/attackSimulator/reports/allProperties/read | Read reports of attack simulation, responses, and associated training |
> | microsoft.office365.protectionCenter/attackSimulator/simulation/allProperties/read | Read all properties of attack simulation templates in Attack Simulator |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Service Support Administrator

Users with this role can create and manage support requests with Microsoft for Azure and Microsoft 365 services, and view the service dashboard and message center in the [Azure portal](../../azure-portal/azure-portal-overview.md) and [Microsoft 365 admin center](/microsoft-365/admin/admin-overview/admin-center-overview). For more information, see [About admin roles in the Microsoft 365 admin center](/microsoft-365/admin/add-users/about-admin-roles).

> [!NOTE]
> This role was previously named Service Administrator in the [Azure portal](../../azure-portal/azure-portal-overview.md) and [Microsoft 365 admin center](/microsoft-365/admin/admin-overview/admin-center-overview). It was renamed to Service Support Administrator to align with the existing name in the Microsoft Graph API and Azure AD PowerShell.

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

Users with this role have global permissions within Microsoft SharePoint Online, when the service is present, as well as the ability to create and manage all Microsoft 365 groups, manage support tickets, and monitor service health. For more information, see [About admin roles in the Microsoft 365 admin center](/microsoft-365/admin/add-users/about-admin-roles).

> [!NOTE]
> In the Microsoft Graph API and Azure AD PowerShell, this role is named SharePoint Service Administrator. In the [Azure portal](../../azure-portal/azure-portal-overview.md), it is named SharePoint Administrator.

> [!NOTE]
> This role also grants scoped permissions to the Microsoft Graph API for Microsoft Intune, allowing the management and configuration of policies related to SharePoint and OneDrive resources.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups.unified/create | Create Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/delete | Delete Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/restore | Restore Microsoft 365 groups from soft-deleted container, excluding role-assignable groups |
> | microsoft.directory/groups.unified/basic/update | Update basic properties on Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/members/update | Update members of Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/owners/update | Update owners of Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.sharePoint/allEntities/allTasks | Create and delete all resources, and read and update standard properties in SharePoint |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Skype for Business Administrator

Users with this role have global permissions within Microsoft Skype for Business, when the service is present, as well as manage Skype-specific user attributes in Microsoft Entra ID. Additionally, this role grants the ability to manage support tickets and monitor service health, and to access the Teams and Skype for Business admin center. The account must also be licensed for Teams or it can't run Teams PowerShell cmdlets. For more information, see [Skype for Business Online Admin](/skypeforbusiness/skype-for-business-online) and Teams licensing information at [Skype for Business add-on licensing](/skypeforbusiness/skype-for-business-and-microsoft-teams-add-on-licensing/skype-for-business-and-microsoft-teams-add-on-licensing).

> [!NOTE]
> In the Microsoft Graph API and Azure AD PowerShell, this role is named Lync Service Administrator. In the [Azure portal](../../azure-portal/azure-portal-overview.md), it is named Skype for Business Administrator.

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
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups.unified/create | Create Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/delete | Delete Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/restore | Restore Microsoft 365 groups from soft-deleted container, excluding role-assignable groups |
> | microsoft.directory/groups.unified/basic/update | Update basic properties on Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/members/update | Update members of Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/owners/update | Update owners of Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.teams/allEntities/allProperties/allTasks | Manage all resources in Teams |
> | microsoft.directory/crossTenantAccessPolicy/standard/read | Read basic properties of cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/allowedCloudEndpoints/update | Update allowed cloud endpoints of cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/standard/read | Read basic properties of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/crossCloudMeetings/update | Update cross-cloud Teams meeting settings of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/partners/create | Create cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/standard/read | Read basic properties of cross-tenant access policy for partners |
> | microsoft.directory/crossTenantAccessPolicy/partners/crossCloudMeetings/update | Update cross-cloud Teams meeting settings of cross-tenant access policy for partners |
> | microsoft.directory/pendingExternalUserProfiles/create | Create external user profiles in the extended directory for Teams |
> | microsoft.directory/pendingExternalUserProfiles/standard/read | Read standard properties of external user profiles in the extended directory for Teams |
> | microsoft.directory/pendingExternalUserProfiles/basic/update | Update basic properties of external user profiles in the extended directory for Teams |
> | microsoft.directory/pendingExternalUserProfiles/delete | Delete external user profiles in the extended directory for Teams |
> | microsoft.directory/externalUserProfiles/standard/read | Read standard properties of external user profiles in the extended directory for Teams |
> | microsoft.directory/externalUserProfiles/basic/update | Update basic properties of external user profiles in the extended directory for Teams |
> | microsoft.directory/externalUserProfiles/delete | Delete external user profiles in the extended directory for Teams |

## Teams Communications Administrator

Users in this role can manage aspects of the Microsoft Teams workload related to voice & telephony. This includes the management tools for telephone number assignment, voice and meeting policies, and full access to the call analytics toolset.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
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
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
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
> | microsoft.directory/authorizationPolicy/standard/read | Read standard properties of authorization policy |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.skypeForBusiness/allEntities/allTasks | Manage all aspects of Skype for Business Online |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.teams/callQuality/standard/read | Read basic data in the Call Quality Dashboard (CQD) |

## Teams Devices Administrator

Users with this role can manage [Teams-certified devices](https://www.microsoft.com/microsoft-teams/across-devices/devices) from the Teams admin center. This role allows viewing all devices at single glance, with ability to search and filter devices. The user can check details of each device including logged-in account, make and model of the device. The user can change the settings on the device and update the software versions. This role does not grant permissions to check Teams activity and call quality of the device.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.teams/devices/standard/read | Manage all aspects of Teams-certified devices including configuration policies |

## Tenant Creator

Assign the Tenant Creator role to users who need to do the following tasks:
-	Create both Microsoft Entra and Azure Active Directory B2C tenants even if the tenant creation toggle is turned off in the user settings
> [!NOTE]
>The tenant creators will be assigned the Global administrator role on the new tenants they create.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/tenantManagement/tenants/create | Create new tenants in Microsoft Entra ID |

## Usage Summary Reports Reader

Assign the Usage Summary Reports Reader role to users who need to do the following tasks in the Microsoft 365 admin center:

- View the Usage reports and Adoption Score
- Read organizational insights, but not personally identifiable information (PII) of users

This role only allows users to view organizational-level data with the following exceptions:

- Member users can view user management data and settings.
- Guest users assigned this role can not view user management data and settings.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.usageReports/allEntities/standard/read | Read tenant-level aggregated Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## User Administrator

[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md)

This is a [privileged role](privileged-roles-permissions.md). Assign the User Administrator role to users who need to do the following:

| Permission | More information |
| --- | --- |
| Create users |  |
| Update most user properties for all users, including all administrators | [Who can perform sensitive actions](privileged-roles-permissions.md#who-can-perform-sensitive-actions) |
| Update sensitive properties (including user principal name) for some users | [Who can perform sensitive actions](privileged-roles-permissions.md#who-can-perform-sensitive-actions) |
| Disable or enable some users | [Who can perform sensitive actions](privileged-roles-permissions.md#who-can-perform-sensitive-actions) |
| Delete or restore some users | [Who can perform sensitive actions](privileged-roles-permissions.md#who-can-perform-sensitive-actions) |
| Create and manage user views |  |
| Create and manage all groups |  |
| Assign and read licenses for all users, including all administrators |  |
| Reset passwords | [Who can reset passwords](privileged-roles-permissions.md#who-can-reset-passwords) |
| Invalidate refresh tokens | [Who can reset passwords](privileged-roles-permissions.md#who-can-reset-passwords) |
| Update (FIDO) device keys |  |
| Update password expiration policies |  |
| Create and manage support tickets in Azure and the Microsoft 365 admin center |  |
| Monitor service health |  |

Users with this role **cannot** do the following:

- Cannot manage MFA.
- Cannot change the credentials or reset MFA for members and owners of a [role-assignable group](groups-concept.md).
- Cannot manage shared mailboxes.

> [!IMPORTANT]
> Users with this role can change passwords for people who may have access to sensitive or private information or critical configuration inside and outside of Microsoft Entra ID. Changing the password of a user may mean the ability to assume that user's identity and permissions. For example:
>
>- Application Registration and Enterprise Application owners, who can manage credentials of apps they own. Those apps may have privileged permissions in Microsoft Entra ID and elsewhere not granted to User Administrators. Through this path a User Administrator may be able to assume the identity of an application owner and then further assume the identity of a privileged application by updating the credentials for the application.
>- Azure subscription owners, who may have access to sensitive or private information or critical configuration in Azure.
>- Security Group and Microsoft 365 group owners, who can manage group membership. Those groups may grant access to sensitive or private information or critical configuration in Microsoft Entra ID and elsewhere.
>- Administrators in other services outside of Microsoft Entra ID like Exchange Online, Microsoft 365 Defender portal, Microsoft Purview compliance portal, and human resources systems.
>- Non-administrators like executives, legal counsel, and human resources employees who may have access to sensitive or private information.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/accessReviews/definitions.applications/allProperties/allTasks | Manage access reviews of application role assignments in Microsoft Entra ID |
> | microsoft.directory/accessReviews/definitions.directoryRoles/allProperties/read | Read all properties of access reviews for Microsoft Entra role assignments |
> | microsoft.directory/accessReviews/definitions.entitlementManagement/allProperties/allTasks | Manage access reviews for access package assignments in entitlement management |
> | microsoft.directory/accessReviews/definitions.groups/allProperties/update | Update all properties of access reviews for membership in Security and Microsoft 365 groups, excluding role-assignable groups. |
> | microsoft.directory/accessReviews/definitions.groups/create | Create access reviews for membership in Security and Microsoft 365 groups. |
> | microsoft.directory/accessReviews/definitions.groups/delete | Delete access reviews for membership in Security and Microsoft 365 groups. |
> | microsoft.directory/accessReviews/definitions.groups/allProperties/read | Read all properties of access reviews for membership in Security and Microsoft 365 groups, including role-assignable groups. |
> | microsoft.directory/contacts/create | Create contacts |
> | microsoft.directory/contacts/delete | Delete contacts |
> | microsoft.directory/contacts/basic/update | Update basic properties on contacts |
> | microsoft.directory/deletedItems.groups/restore | Restore soft deleted groups to original state |
> | microsoft.directory/deletedItems.users/restore | Restore soft deleted users to original state |
> | microsoft.directory/entitlementManagement/allProperties/allTasks | Create and delete resources, and read and update all properties in Microsoft Entra entitlement management |
> | microsoft.directory/groups/assignLicense | Assign product licenses to groups for group-based licensing |
> | microsoft.directory/groups/create | Create Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/delete | Delete Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups/reprocessLicenseAssignment | Reprocess license assignments for group-based licensing |
> | microsoft.directory/groups/restore | Restore groups from soft-deleted container |
> | microsoft.directory/groups/basic/update | Update basic properties on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/classification/update | Update the classification property on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/dynamicMembershipRule/update | Update the dynamic membership rule on Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/groupType/update | Update properties that would affect the group type of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/members/update | Update members of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/onPremWriteBack/update | Update Microsoft Entra groups to be written back to on-premises with Microsoft Entra Connect |
> | microsoft.directory/groups/owners/update | Update owners of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups/settings/update | Update settings of groups |
> | microsoft.directory/groups/visibility/update | Update the visibility property of Security groups and Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/oAuth2PermissionGrants/allProperties/allTasks | Create and delete OAuth 2.0 permission grants, and read and update all properties<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/policies/standard/read | Read basic properties on policies |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/users/assignLicense | Manage user licenses |
> | microsoft.directory/users/create | Add users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/convertExternalToInternalMemberUser | Convert external user to internal user |
> | microsoft.directory/users/delete | Delete users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/disable | Disable users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/enable | Enable users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/inviteGuest | Invite guest users |
> | microsoft.directory/users/invalidateAllRefreshTokens | Force sign-out by invalidating user refresh tokens<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/reprocessLicenseAssignment | Reprocess license assignments for users |
> | microsoft.directory/users/restore | Restore deleted users |
> | microsoft.directory/users/basic/update | Update basic properties on users |
> | microsoft.directory/users/manager/update | Update manager for users |
> | microsoft.directory/users/password/update | Reset passwords for all users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.directory/users/photo/update | Update photo of users |
> | microsoft.directory/users/sponsors/update | Update sponsors of users |
> | microsoft.directory/users/usageLocation/update | Update usage location of users |
> | microsoft.directory/users/userPrincipalName/update | Update User Principal Name of users<br/>[![Privileged label icon.](./media/permissions-reference/privileged-label.png)](privileged-roles-permissions.md) |
> | microsoft.azure.serviceHealth/allEntities/allTasks | Read and configure Azure Service Health |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Virtual Visits Administrator

Users with this role can do the following tasks:

- Manage and configure all aspects of Virtual Visits in Bookings in the Microsoft 365 admin center, and in the Teams EHR connector
- View usage reports for Virtual Visits in the Teams admin center, Microsoft 365 admin center, Fabric, and Power BI
- View features and settings in the Microsoft 365 admin center, but can't edit any settings

Virtual Visits are a simple way to schedule and manage online and video appointments for staff and attendees. For example, usage reporting can show how sending SMS text messages before appointments can reduce the number of people who don't show up for appointments.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.virtualVisits/allEntities/allProperties/allTasks | Manage and share Virtual Visits information and metrics from admin centers or the Virtual Visits app |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Viva Goals Administrator

Assign the Viva Goals Administrator role to users who need to do the following tasks:

- Manage and configure all aspects of the Microsoft Viva Goals application
- Configure Microsoft Viva Goals admin settings
- Read Microsoft Entra tenant information
- Monitor Microsoft 365 service health
- Create and manage Microsoft 365 service requests

For more information, see [Roles and permissions in Viva Goals](/viva/goals/roles-permissions-in-viva-goals) and [Introduction to Microsoft Viva Goals](/viva/goals/intro-to-ms-viva-goals).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.viva.goals/allEntities/allProperties/allTasks | Manage all aspects of Microsoft Viva Goals |

## Viva Pulse Administrator

Assign the Viva Pulse Administrator role to users who need to do the following tasks:

- Read and configure all settings of Viva Pulse
- Read basic properties on all resources in the Microsoft 365 admin center
- Read and configure Azure Service Health
- Create and manage Azure support tickets
- Read messages in Message Center in the Microsoft 365 admin center, excluding security messages
- Read usage reports in the Microsoft 365 admin center

For more information, see [Assign a Viva Pulse admin in the Microsoft 365 admin center](/viva/pulse/setup-admin-access/assign-a-viva-pulse-admin-in-m365-admin-center).

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.viva.pulse/allEntities/allProperties/allTasks | Manage all aspects of Microsoft Viva Pulse |

## Windows 365 Administrator

Users with this role have global permissions on Windows 365 resources, when the service is present. Additionally, this role contains the ability to manage users and devices in order to associate policy, as well as create and manage groups.

This role can create and manage security groups, but does not have administrator rights over Microsoft 365 groups. That means administrators cannot update owners or memberships of Microsoft 365 groups in the organization. However, they can manage the Microsoft 365 group they create, which is a part of their end-user privileges. So, any Microsoft 365 group (not security group) they create is counted against their quota of 250.

Assign the Windows 365 Administrator role to users who need to do the following tasks:

- Manage Windows 365 Cloud PCs in Microsoft Intune
- Enroll and manage devices in Microsoft Entra ID, including assigning users and policies
- Create and manage security groups, but not role-assignable groups
- View basic properties in the Microsoft 365 admin center
- Read usage reports in the Microsoft 365 admin center
- Create and manage support tickets in Azure and the Microsoft 365 admin center

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/deletedItems.devices/delete | Permanently delete devices, which can no longer be restored |
> | microsoft.directory/deletedItems.devices/restore | Restore soft deleted devices to original state |
> | microsoft.directory/devices/create | Create devices (enroll in Microsoft Entra ID) |
> | microsoft.directory/devices/delete | Delete devices from Microsoft Entra ID |
> | microsoft.directory/devices/disable | Disable devices in Microsoft Entra ID |
> | microsoft.directory/devices/enable | Enable devices in Microsoft Entra ID |
> | microsoft.directory/devices/basic/update | Update basic properties on devices |
> | microsoft.directory/devices/extensionAttributeSet1/update | Update the extensionAttribute1 to extensionAttribute5 properties on devices |
> | microsoft.directory/devices/extensionAttributeSet2/update | Update the extensionAttribute6 to extensionAttribute10 properties on devices |
> | microsoft.directory/devices/extensionAttributeSet3/update | Update the extensionAttribute11 to extensionAttribute15 properties on devices |
> | microsoft.directory/devices/registeredOwners/update | Update registered owners of devices |
> | microsoft.directory/devices/registeredUsers/update | Update registered users of devices |
> | microsoft.directory/groups.security/create | Create Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/delete | Delete Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/basic/update | Update basic properties on Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/classification/update | Update the classification property on Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/dynamicMembershipRule/update | Update the dynamic membership rule on Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/members/update | Update members of Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/owners/update | Update owners of Security groups, excluding role-assignable groups |
> | microsoft.directory/groups.security/visibility/update | Update the visibility property on Security groups, excluding role-assignable groups |
> | microsoft.directory/deviceManagementPolicies/standard/read | Read standard properties on device management application policies |
> | microsoft.directory/deviceRegistrationPolicy/standard/read | Read standard properties on device registration policies |
> | microsoft.azure.supportTickets/allEntities/allTasks | Create and manage Azure support tickets |
> | microsoft.cloudPC/allEntities/allProperties/allTasks | Manage all aspects of Windows 365 |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |

## Windows Update Deployment Administrator

Users in this role can create and manage all aspects of Windows Update deployments through the Windows Update for Business deployment service. The deployment service enables users to define  settings for when and how updates are deployed, and specify which updates are offered to groups of devices in their tenant. It also allows users to monitor the update progress.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.windows.updatesDeployments/allEntities/allProperties/allTasks | Read and configure all aspects of Windows Update Service |

## Yammer Administrator

Assign the Yammer Administrator role to users who need to do the following tasks:

- Manage all aspects of Yammer
- Create, manage, and restore Microsoft 365 Groups, but not role-assignable groups
- View the hidden members of Security groups and Microsoft 365 groups, including role assignable groups
- Read usage reports in the Microsoft 365 admin center
- Create and manage service requests in the Microsoft 365 admin center
- View announcements in the Message center, but not security announcements
- View service health

[Learn more](/viva/engage/eac-key-admin-roles-permissions)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.directory/groups/hiddenMembers/read | Read hidden members of Security groups and Microsoft 365 groups, including role-assignable groups |
> | microsoft.directory/groups.unified/create | Create Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/delete | Delete Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/restore | Restore Microsoft 365 groups from soft-deleted container, excluding role-assignable groups |
> | microsoft.directory/groups.unified/basic/update | Update basic properties on Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/members/update | Update members of Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.directory/groups.unified/owners/update | Update owners of Microsoft 365 groups, excluding role-assignable groups |
> | microsoft.office365.messageCenter/messages/read | Read messages in Message Center in the Microsoft 365 admin center, excluding security messages |
> | microsoft.office365.network/performance/allProperties/read | Read all network performance properties in the Microsoft 365 admin center |
> | microsoft.office365.serviceHealth/allEntities/allTasks | Read and configure Service Health in the Microsoft 365 admin center |
> | microsoft.office365.supportTickets/allEntities/allTasks | Create and manage Microsoft 365 service requests |
> | microsoft.office365.usageReports/allEntities/allProperties/read | Read Office 365 usage reports |
> | microsoft.office365.webPortal/allEntities/standard/read | Read basic properties on all resources in the Microsoft 365 admin center |
> | microsoft.office365.yammer/allEntities/allProperties/allTasks | Manage all aspects of Yammer |

## Deprecated roles

The following roles should not be used. They have been deprecated and will be removed from Microsoft Entra ID in the future.

* AdHoc License Administrator
* Device Join
* Device Managers
* Device Users
* Email Verified User Creator
* Mailbox Administrator
* Workplace Device Join

## Roles not shown in the portal

Not every role returned by PowerShell or MS Graph API is visible in Azure portal. The following table organizes those differences.

| API name | Azure portal name | Notes |
| --- | --- | --- |
| Device Join | Deprecated | [Deprecated roles documentation](#deprecated-roles) |
| Device Managers | Deprecated | [Deprecated roles documentation](#deprecated-roles) |
| Device Users | Deprecated | [Deprecated roles documentation](#deprecated-roles) |
| Directory Synchronization Accounts | Not shown because it shouldn't be used | [Directory Synchronization Accounts documentation](#directory-synchronization-accounts) |
| Guest User | Not shown because it can't be used | NA |
| Partner Tier 1 Support | Not shown because it shouldn't be used | [Partner Tier1 Support documentation](#partner-tier1-support) |
| Partner Tier 2 Support | Not shown because it shouldn't be used | [Partner Tier2 Support documentation](#partner-tier2-support) |
| Restricted Guest User | Not shown because it can't be used | NA |
| User | Not shown because it can't be used | NA |
| Workplace Device Join | Deprecated | [Deprecated roles documentation](#deprecated-roles) |

## Next steps

- [Assign Microsoft Entra roles to groups](groups-assign-role.md)
- [Understand the different roles](../../role-based-access-control/rbac-and-directory-admin-roles.md)
- [Assign a user as an administrator of an Azure subscription](../../role-based-access-control/role-assignments-portal-subscription-admin.md)
