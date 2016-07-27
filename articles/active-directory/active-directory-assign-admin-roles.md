<properties
	pageTitle="Assigning administrator roles in Azure Active Directory | Microsoft Azure"
	description="Explains what administrator roles are available with Azure Active Directory and how to assign them."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/29/2016"
	ms.author="curtand"/>

# Assigning administrator roles in Azure Active Directory

Using Azure Active Directory (Azure AD), you can designate separate administrators to serve different functions. These administrators will have access to various features in the Azure portal or Azure classic portal and, depending on their role, will be able to create or edit users, assign administrative roles to others, reset user passwords, manage user licenses, and manage domains, among other things. A user who is assigned an admin role will have the same permissions across all of the cloud services that your organization has subscribed to, regardless of whether you assign the role in the Office 365 portal, or in the Azure classic portal, or by using the Azure AD module for Windows PowerShell.

The following administrator roles are available:

- **Billing administrator**: Makes purchases, manages subscriptions, manages support tickets, and monitors service health.

- **Global administrator**: Has access to all administrative features. The person who signs up for the Azure account becomes a global administrator. Only global administrators can assign other administrator roles. There can be more than one global administrator at your company.

	> [AZURE.NOTE] In Microsoft Graph API, Azure AD Graph API and Azure AD PowerShell, this role is identified as "Company Administrator".

- **Password administrator**: Resets passwords, manages service requests, and monitors service health. Password administrators can reset passwords only for users and other password administrators.

	> [AZURE.NOTE] In Microsoft Graph API, Azure AD Graph API and Azure AD PowerShell, this role is identified as "Helpdesk Administrator".

- **Service administrator**: Manages service requests and monitors service health.

	> [AZURE.NOTE] To assign the service administrator role to a user, the global administrator must first assign administrative permissions to the user in the service, such as Exchange Online, and then assign the service administrator role to the user in the Azure classic portal.

- **User administrator**: Resets passwords, monitors service health, and manages user accounts, user groups, and service requests. Some limitations apply to the permissions of a user management administrator. For example, they cannot delete a global administrator or create other administrators. Also, they cannot reset passwords for billing, global, and service administrators.

- **Security reader**: Read-only access to a number of security features of Identity Protection Center, Privileged Identity Management, Monitor Office 365 Service Health, and Office 365 Protection Center.

- **Security administrator**: All of the read-only permissions of the **Security reader** role, plus a number of additional administrative permissions for the same services: Identity Protection Center, Privileged Identity Management, Monitor Office 365 Service Health, and Office 365 Protection Center.

## Administrator permissions

### Billing administrator

Can do | Cannot do
------------- | -------------
<p>View company and user information</p><p>Manage Office support tickets</p><p>Perform billing and purchasing operations for Office products</p> | <p>Reset user passwords</p><p>Create and manage user views</p><p>Create, edit, and delete users and groups, and manage user licenses</p><p>Manage domains</p><p>Manage company information</p><p>Delegate administrative roles to others</p><p>Use directory synchronization</p>

### Global administrator

Can do | Cannot do
------------- | -------------
<p>View company and user information</p><p>Manage Office support tickets</p><p>Perform billing and purchasing operations for Office products</p> <p>Reset user passwords</p><p>Create and manage user views</p><p>Create, edit, and delete users and groups, and manage user licenses</p><p>Manage domains</p><p>Manage company information</p><p>Delegate administrative roles to others</p><p>Use directory synchronization</p><p>Enable or disable multi-factor authentication</p> | N/A

### Password administrator

Can do | Cannot do
------------- | -------------
<p>View company and user information</p><p>Manage Office support tickets</p><p>Reset user passwords</p> | <p>Perform billing and purchasing operations for Office products</p><p>Create and manage user views</p><p>Create, edit, and delete users and groups, and manage user licenses</p><p>Manage domains</p><p>Manage company information</p><p>Delegate administrative roles to others</p><p>Use directory synchronization</p>

### Service administrator

Can do | Cannot do
------------- | -------------
<p>View company and user information</p><p>Manage Office support tickets</p> | <p>Reset user passwords</p><p>Perform billing and purchasing operations for Office products</p><p>Create and manage user views</p><p>Create, edit, and delete users and groups, and manage user licenses</p><p>Manage domains</p><p>Manage company information</p><p>Delegate administrative roles to others</p><p>Use directory synchronization</p>

### User administrator

Can do | Cannot do
------------- | -------------
<p>View company and user information</p><p>Manage Office support tickets</p><p>Reset user passwords, with limitations. He or she cannot reset passwords for billing, global, and service administrators.</p><p>Create and manage user views</p><p>Create, edit, and delete users and groups, and manage user licenses, with limitations. He or she cannot delete a global administrator or create other administrators.</p> | <p>Perform billing and purchasing operations for Office products</p><p>Manage domains</p><p>Manage company information</p><p>Delegate administrative roles to others</p><p>Use directory synchronization</p><p>Enable or disable multi-factor authentication</p>

### Security Reader

In | Can do
------------- | -------------
Identity Protection Center | Read all security reports and settings information for security features<ul><li>Anti-spam<li>Encryption<li>Data loss prevention<li>Anti-malware<li>Advanced threat protection<li>Anti-phishing<li>Mailflow rules
Privileged Identity Management | <p>Has read-only access to all information surfaced in Azure AD PIM: Policies and reports for Azure AD role assignments, security reviews and in the future read access to policy data and reports for scenarios besides Azure AD role assignment.<p>**Cannot** sign up for Azure AD PIM or make any changes to it. In PIM's portal or via PowerShell, someone in this role can activate additional roles (for example, Global Admin or Privileged Role Administrator), if the user is a candidate for them.
<p>Monitor Office 365 Service Health</p><p>Office 365 Protection Center</p> | <ul><li>Read and manage alerts<li>Read security policies<li>Read threat intelligence, Cloud App Discovery, and Quarantine in Search and Investigate<li>Read all reports

### Security Administrator

In | Can do
------------- | -------------
Identity Protection Center | <ul><li>All permissions of the Security Reader role.<li>Additionally, the ability to perform all IPC operations except for resetting passwords.
Privileged Identity Management | <ul><li>All permissions of the Security Reader role.<li>**Cannot** manage Azure AD role memberships or settings.
<p>Monitor Office 365 Service Health</p><p>Office 365 Protection | <ul><li>All permissions of the Security Reader role.<li>Can configure all settings in the Advanced Threat Protection feature (malware & virus protection, malicious URL config, URL tracing, etc.).

## Details about the global administrator role

The global administrator has access to all administrative features. By default, the person who signs up for an Azure subscription is assigned  the global administrator role for the directory. Only global administrators can assign other administrator roles.

## Assign or remove administrator roles

1. In the Azure classic portal, click **Active Directory**, and then click the name of your organization’s directory.

2. On the **Users** page, click the display name of the user you want to edit.

3. In the **Organizational Role** list, select the administrator role that you want to assign to this user, or select **User** if you want to remove an existing administrator role.

4. In the **Alternate Email Address** box, type an email address. This email address is used for important notifications, including password self-reset, so the user must be able to access the email account whether or not the user can access Azure.

5. Select **Allow** or **Block** to specify whether to allow the user to sign in and access services.

6. Specify a location from the **Usage Location** drop-down list.

7. When you have finished, click **Save**.

## Next Steps

- To learn more about how to change administrators for an Azure subscription, see [How to add or change Azure administrator roles](../billing-add-change-azure-subscription-administrator.md)

- To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](active-directory-understanding-resource-access.md)

- For more information on how Azure Active Directory relates to your Azure subscription, see [How Azure subscriptions are associated with Azure Active Directory](active-directory-how-subscriptions-associated-directory.md)

- [Manage users](active-directory-create-users.md)

- [Manage passwords](active-directory-manage-passwords.md)

- [Manage groups](active-directory-manage-groups.md)
