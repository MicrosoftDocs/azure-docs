---
title: Assigning administrator roles in Azure Active Directory | Microsoft Docs
description: Explains what administrator roles are available with Azure Active Directory and how to assign them.
services: active-directory
documentationcenter: ''
author: curtand
manager: femila
editor: ''

ms.assetid: 7fc27e8e-b55f-4194-9b8f-2e95705fb731
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/14/2017
ms.author: curtand

---
# Assigning administrator roles in Azure Active Directory
> [!div class="op_single_selector"]
> * [Azure portal](active-directory-assign-admin-roles-azure-portal.md)
> * [Azure classic portal](active-directory-assign-admin-roles.md)
>
>

Using Azure Active Directory (Azure AD), you can designate separate administrators to serve different functions. These administrators will have access to various features in the Azure portal or Azure classic portal and, depending on their role, will be able to create or edit users, assign administrative roles to others, reset user passwords, manage user licenses, and manage domains, among other things. A user who is assigned an admin role will have the same permissions across all of the cloud services to which your organization has subscribed, regardless of whether you assign the role in the Office 365 portal, or in the Azure classic portal, or by using the Azure AD module for Windows PowerShell.

The following administrator roles are available:

* **Billing Administrator**: Makes purchases, manages subscriptions, manages support tickets, and monitors service health.

* **Compliance Administrator**: Users with this role have management permissions within in the Office 365 Security & Compliance Center and Exchange Admin Center. More information at “[About Office 365 admin roles](https://support.office.com/en-us/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).”

* **Conditional Access Administrator**: Users with this role have the ability to manage Azure Active Directory conditional access settings.

* **CRM Service Administrator**: Users with this role have global permissions within Microsoft CRM Online, when the service is present, as well as the ability to manage support tickets and monitor service health. More information at [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

* **Device Administrators**: Users with this role become local machine administrators on all Windows 10 devices that are joined to Azure Active Directory. They do not have the ability to manage devices objects in Azure Active Directory.

* **Directory Readers**: This is a legacy role that is to be assigned to applications that do not support the [Consent Framework](active-directory-integrating-applications.md). It should not be assigned to any users.

* **Directory Synchronization Accounts**: Do not use. This role is automatically assigned to the Azure AD Connect service, and is not intended or supported for any other use.

* **Directory Writers**: This is a legacy role that is to be assigned to applications that do not support the [Consent Framework](active-directory-integrating-applications.md). It should not be assigned to any users.

* **Exchange Service Administrator**: Users with this role have global permissions within Microsoft Exchange Online, when the service is present. More information at [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

* **Global Administrator / Company Administrator**: Users with this role have access to all administrative features in Azure Active Directory, as well as services that federate to Azure Active Directory like Exchange Online, SharePoint Online, and Skype for Business Online. The person who signs up for the Azure Active Directory tenant becomes a global administrator. Only global administrators can assign other administrator roles. There can be more than one global administrator at your company. Global admins can reset the password for any user and all other administrators.

  > [!NOTE]
  > In Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell, this role is identified as "Company Administrator". It is "Global Administrator" in the [Azure portal](https://portal.azure.com).
  >
  >

* **Guest Inviter**: Users in this role can manage Azure Active Directory B2B guest user invitations when the “Members can invite” user setting is set to No. More information about B2B collaboration at [About the Azure AD B2B collaboration preview](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b). It does not include any other permissions.

* **Intune Service Administrator**: Users with this role have global permissions within Microsoft Intune Online, when the service is present. Additionally, this role contains the ability to manage users and devices in order to associate policy, as well as create and manage groups.

* **Mailbox Administrator**: This role is only used as part of Exchange Online email support for RIM Blackberry devices. If your organization does not use Exchange Online email on RIM Blackberry devices, do not use this role.

* **Partner Tier 1 Support**: Do not use. This role has been deprecated and will be removed from Azure AD in the future. This role is intended for use by a small number of Microsoft resale partners, and is not intended for general use.

* **Partner Tier 2 Support**: Do not use. This role has been deprecated and will be removed from Azure AD in the future. This role is intended for use by a small number of Microsoft resale partners, and is not intended for general use.

* **Password Administrator / Helpdesk Administrator**: Users with this role can reset passwords, manage service requests, and monitor service health. Password administrators can reset passwords only for users and other password administrators.

  > [!NOTE]
  > In Microsoft Graph API, Azure AD Graph API and Azure AD PowerShell, this role is identified as "Helpdesk Administrator". It is "Password Administrator" in the [Azure portal](https://portal.azure.com/).
  >
  >
  
* **Power BI Service Administrator**: Users with this role have global permissions within Microsoft Power BI, when the service is present, as well as the ability to manage support tickets and monitor service health. More information at [About Office 365 admin roles](https://support.office.com/en-us/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d?ui=en-US&rs=en-001&ad=US).

* **Privileged Role Administrator**: Users with this role can manage role assignments in Azure Active Directory, as well as within Azure AD Privileged Identity Management. In addition, this role allows management of all aspects of Privileged Identity Management.

* **Security Administrator**: Users with this role have all of the read-only permissions of the Security reader role, plus the ability to manage configuration for security-related services: Azure Active Directory Identity Protection, Privileged Identity Management, and Office 365 Security & Compliance Center. More information about Office 365 permissions is available at [Permissions in the Office 365 Security & Compliance Center](https://support.office.com/en-us/article/Permissions-in-the-Office-365-Security-Compliance-Center-d10608af-7934-490a-818e-e68f17d0e9c1).

* **Security Reader**: Users with this role have global read-only access, including all information in Azure Active Directory, Identity Protection, Privileged Identity Management, as well as the ability to read Azure Active Directory sign-in reports and audit logs. The role also grants read-only permission in Office 365 Security & Compliance Center. More information about Office 365 permissions is available at [Permissions in the Office 365 Security & Compliance Center](https://support.office.com/en-us/article/Permissions-in-the-Office-365-Security-Compliance-Center-d10608af-7934-490a-818e-e68f17d0e9c1).

* **Service Support Administrator**: Users with this role can open support requests with Microsoft for Azure and Office 365 services, and views the service dashboard and message center in the Azure portal and Office 365 admin portal. More information at [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

* **SharePoint Service Administrator**: Users with this role have global permissions within Microsoft SharePoint Online, when the service is present, as well as the ability to manage support tickets and monitor service health. More information at [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

* **Skype for Business / Lync Service Administrator**: Users with this role have global permissions within Microsoft Skype for Business, when the service is present, as well as manage Skype-specific user attributes in Azure Active Directory. Additionally, this role grants the ability to manage support tickets and monitor service health. More information at [About Office 365 admin roles](https://support.office.com/article/About-Office-365-admin-roles-da585eea-f576-4f55-a1e0-87090b6aaa9d).

  > [!NOTE]
  > In Microsoft Graph API, Azure AD Graph API and Azure AD PowerShell, this role is identified as "Lync Service Administrator". It is "Skype for Business Service Administrator" in the [Azure portal](https://portal.azure.com/).
  >
  >

* **User Account Administrator**: Users with this role can create and manage all aspects of users and groups. Additionally, this role includes the ability to manage support tickets and monitors service health. Some restrictions apply. For example, this role does not allow deleting a global administrator, and while it does allow changing passwords for non-admins, it does not allow changing passwords for global administrators or other privileged administrators.

## Administrator permissions

### Billing Administrator

| Can do | Cannot do |
| --- | --- |
|<p>View company and user information</p><p>Manage Office support tickets</p><p>Perform billing and purchasing operations for Office products</p> |<p>Reset user passwords</p><p>Create and manage user views</p><p>Create, edit, and delete users and groups, and manage user licenses</p><p>Manage domains</p><p>Manage company information</p><p>Delegate administrative roles to others</p><p>Use directory synchronization</p><p>View audit logs</p>|

### Conditional Access Administrator
| Can do | Cannot do |
| --- | --- |
|<p>View company and user information</p><p>Manage conditional access settings</p> |<p>Reset user passwords</p><p>Create and manage user views</p><p>Create, edit, and delete users and groups, and manage user licenses</p><p>Manage domains</p><p>Manage company information</p><p>Delegate administrative roles to others</p><p>Use directory synchronization</p><p>View audit logs</p>|

### Global administrator
| Can do | Cannot do |
| --- | --- |
|<p>View company and user information</p><p>Manage Office support tickets</p><p>Perform billing and purchasing operations for Office products</p><p>Reset user passwords</p><p>Reset other administrator’s passwords</p><p>Create and manage user views</p><p>Create, edit, and delete users and groups, and manage user licenses</p><p>Manage domains</p><p>Manage company information</p><p>Delegate administrative roles to others</p><p>Use directory synchronization</p><p>Enable or disable multi-factor authentication</p><p>View audit logs</p> |<p>N/A</p>|

### Password administrator
| Can do | Cannot do |
| --- | --- |
| <p>View company and user information</p><p>Manage Office support tickets</p><p>Reset user passwords</p> <p>Reset other administrator’s passwords</p>|<p>Perform billing and purchasing operations for Office products</p><p>Create and manage user views</p><p>Create, edit, and delete users and groups, and manage user licenses</p><p>Manage domains</p><p>Manage company information</p><p>Delegate administrative roles to others</p><p>Use directory synchronization</p><p>View reports</p>|

### Service administrator
| Can do | Cannot do |
| --- | --- |
| <p>View company and user information</p><p>Manage Office support tickets</p> |<p>Reset user passwords</p><p>Perform billing and purchasing operations for Office products</p><p>Create and manage user views</p><p>Create, edit, and delete users and groups, and manage user licenses</p><p>Manage domains</p><p>Manage company information</p><p>Delegate administrative roles to others</p><p>Use directory synchronization</p><p>View audit logs</p> |

### User administrator
| Can do | Cannot do |
| --- | --- |
| <p>View company and user information</p><p>Manage Office support tickets</p><p>Reset user passwords, with limitations.</p><p>Reset other administrator’s passwords</p><p>Reset other users' passwords</p><p>Create and manage user views</p><p>Create, edit, and delete users and groups, and manage user licenses, with limitations. He or she cannot delete a global administrator or create other administrators.</p> |<p>Perform billing and purchasing operations for Office products</p><p>Manage domains</p><p>Manage company information</p><p>Delegate administrative roles to others</p><p>Use directory synchronization</p><p>Enable or disable multi-factor authentication</p><p>View audit logs</p> |

### Security Reader
| In | Can do |
| --- | --- |
| Identity Protection Center |Read all security reports and settings information for security features<ul><li>Anti-spam<li>Encryption<li>Data loss prevention<li>Anti-malware<li>Advanced threat protection<li>Anti-phishing<li>Mailflow rules |
| Privileged Identity Management |<p>Has read-only access to all information surfaced in Azure AD PIM: Policies and reports for Azure AD role assignments, security reviews and in the future read access to policy data and reports for scenarios besides Azure AD role assignment.<p>**Cannot** sign up for Azure AD PIM or make any changes to it. In PIM's portal or via PowerShell, someone in this role can activate additional roles (for example, Global Admin or Privileged Role Administrator), if the user is a candidate for them. |
| <p>Monitor Office 365 Service Health</p><p>Office 365 Security & Compliance Center</p> |<ul><li>Read and manage alerts<li>Read security policies<li>Read threat intelligence, Cloud App Discovery, and Quarantine in Search and Investigate<li>Read all reports |

### Security Administrator
| In | Can do |
| --- | --- |
| Identity Protection Center |<ul><li>All permissions of the Security Reader role.<li>Additionally, the ability to perform all IPC operations except for resetting passwords. |
| Privileged Identity Management |<ul><li>All permissions of the Security Reader role.<li>**Cannot** manage Azure AD role memberships or settings. |
| <p>Monitor Office 365 Service Health</p><p>Office 365 Security & Compliance Center |<ul><li>All permissions of the Security Reader role.<li>Can configure all settings in the Advanced Threat Protection feature (malware & virus protection, malicious URL config, URL tracing, etc.). |

## Details about the global administrator role
The global administrator has access to all administrative features. By default, the person who signs up for an Azure subscription is assigned the global administrator role for the directory. Only global administrators can assign other administrator roles.

### To add a colleague as a global administrator

1. Sign in to the [Azure Active Directory Admin Center](https://aad.portal.azure.com) with an account that's a global admin for the tenant directory.

   ![Opening azure AD admin center](./media/active-directory-assign-admin-roles/active-directory-admin-center.png)

2. Select **Users and groups &gt; All users**

3. Find the user you want to designate as a global administrator and open the blade for that user.

4. On the user blade, select **Directory role**.
 
5. On the directory role blade, select the **Global administrator** role, and save.

## Assign or remove administrator roles
To learn how to assign administrative roles to a user in Azure Active Directory, see [Assign a user to administrator roles in Azure Active Directory](active-directory-users-assign-role-azure-portal.md).

## Deprecated roles

The following roles should not be used. They been deprecated and will be removed from Azure AD in the future.

* AdHoc License Administrator
* Email Verified User Creator
* Device Join
* Device Managers
* Device Users
* Workplace Device Join

## Next steps
* To learn more about how to change administrators for an Azure subscription, see [How to add or change Azure administrator roles](../billing-add-change-azure-subscription-administrator.md)
* To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](active-directory-understanding-resource-access.md)
* For more information on how Azure Active Directory relates to your Azure subscription, see [How Azure subscriptions are associated with Azure Active Directory](active-directory-how-subscriptions-associated-directory.md)
* [Manage users](active-directory-create-users.md)
* [Manage passwords](active-directory-manage-passwords.md)
* [Manage groups](active-directory-manage-groups.md)
