<properties
	pageTitle="Add users or change user information in Azure Active Directory | Microsoft Azure"
	description="Explains how to Add users or change user information in Azure Active Directory, including external and guest users."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="03/31/2016"
	ms.author="curtand;viviali"/>

# Add or change users in Azure Active Directory

Add an account to the directory of your tenant for every user who accesses a Microsoft cloud service. Added users don't have administrator permissions by default, but you can assign roles to them at any time.

## Add a user

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com) with an account that's a global admin for the directory.
2. Select **Active Directory**, and then select the name of your organization directory.
3. Select the **Users** tab, and then, in the command bar, select **Add User**.
4. On the **Tell us about this user** page, under **Type of user**, select either:

	- **New user in your organization** – adds a new user account in your directory.
	- **User with an existing Microsoft account** – adds an existing Microsoft consumer account to your directory (for example, an Outlook account)
	- **User in another Azure AD directory** – adds a user account to your directory that's sourced from another Azure AD directory. You can select a user in another directory only if you're also a member of that directory.
	- **Users in partner companies** - to invite and authorize partner company users to your directory (See [Azure Active Directory B2B collaboration](active-directory-b2b-what-is-azure-ad-b2b.md))


5. Depending on **Type of user**, enter a user name, an email address, or upload a CSV file specifying email addresses.
6. On the user **Profile** page, provide a first and last name, a user-friendly name, and a user role from the **Roles** list. For more information about user and administrator roles, see [Assigning administrator roles in Azure AD](active-directory-assign-admin-roles.md). Specify whether to **Enable Multi-Factor Authentication**.
7. On the **Get temporary password** page, select **Create**.

> [AZURE.IMPORTANT] If your organization uses more than one domain, you should know about the following issues when you add a user account:
>
> - TO add user accounts with the same user principal name (UPN) across domains, **first** add, for example, geoffgrisso@contoso.onmicrosoft.com, **followed by** geoffgrisso@contoso.com.
> - **Don't** add geoffgrisso@contoso.com before you add geoffgrisso@contoso.onmicrosoft.com. This order is important, and can be cumbersome to undo.

## Change user information

You can change any user attribute except for the object ID.

1. Open your directory.
2. Select the **Users** tab, and then select the display name of the user you want to change.
3. Complete your changes, and then click **Save**.

If the user that you're changing is synchronized with your on-premises Active Directory service, you can't change the user information using this procedure. To change the user, use your on-premises Active Directory management tools.

## Reset a user password

1. Open your directory.
2. Select the **Users** tab, and then select the display name of the user you want to change.
3. In the command bar, select **Reset Password**.
4. In the reset password dialog, click **reset**.
5. Select the check mark to finish resetting the password.

## Add external users

You can also add users from another Azure AD directory to which you belong, or from partner companies by uploading a CSV file. To add an external user, for **Type of User**, specify **User in another Microsoft Azure AD directory** or **Users in partner companies**.

Users of either type are sourced from another directory and are added as **external users**. External users can collaborate with other users in a directory without any requirement to add new accounts and credentials. External users authenticate with their home directory when they sign in, and that authentication works for any other directories to which they have been added.

## External user management and limitations

When you add a user from another directory to your directory, that user is an external user in your directory. The display name and user name are copied from their home directory and used for the external user in your directory. From then on, properties of the external user account are entirely independent. If property changes are made to the user in their home directory, those changes aren't propagated to the external user account in your directory.

The only linkage between the two accounts is that the user always authenticates against their home directory or with their Microsoft account. That's why you don't see an option to reset the password or enable multi-factor authentication for an external user. Currently, the authentication policy of the home directory or Microsoft account is the only one that's evaluated when the user signs in.

> [AZURE.NOTE]
> You can still disable the external user in the directory, which blocks access to your directory.

If a user is deleted in their home directory or they cancel their Microsoft account, the external user still exists in your directory. However, the user in your directory can't access resources because they can't authenticate with a home directory or Microsoft account.

### Services that currently support access by Azure AD external users

- **Azure classic portal**: allows an external user who's an administrator of multiple directories to manage each of those directories.
- **SharePoint Online**: if external sharing is enabled, allows an external user to access SharePoint Online authorized resources.
- **Dynamics CRM**: if the user is licensed via PowerShell, allows an external user to access authorized resources in Dynamics CRM.
- **Dynamics AX**: if the user is licensed via PowerShell, allows an external user to access authorized resources in Dynamics AX. The limitations for [Azure AD external users](#known-limitations-of-azure-ad-external-users) and [Guest users](#guest-user-management-and-limitations) apply to external users in Dynamics AX as well.

### Known limitations of Azure AD external users

- External users who are admins can't add users from partner companies to directories (B2B collaboration) outside their home directory
- External users can't consent to multi-tenant applications in directories outside of their home directory
- PowerBI doesn't currently support access by external users
- Office Portal doesn't support licensing external users

## Guest user management and limitations

Guest accounts are users from other directories who were invited to your directory to access SharePoint documents, applications, or other Azure resources. A guest account in your directory has its underlying UserType attribute set to "Guest." Regular users (specifically, members of your directory) have the UserType attribute "Member."

Guests have a limited set of rights in the directory. These rights limit the ability for Guests to discover information about other users in the directory. However, guest users  can still interact with the users and groups associated with the resources they're working on. Guest users can:

- See other users and groups associated with an Azure subscription to which they're assigned
- See the members of groups to which they belong
- Look up other users in the directory, if they know the full email address of the user
- See only a limited set of attributes of the users they look up--limited to display name, email address, user principal name (UPN), and thumbnail photo
- Get a list of verified domains in the tenant directory
- Consent to applications, granting them the same access that Members have in your directory

## Set user access policies

The **Configure** tab of a directory includes options to control access for external users. These options can be changed only in Azure classic portal by a directory global administrator. Currently, there's no PowerShell or API method.

To open the **Configure** tab in the Azure classic portal, select **Active Directory**, and then select the name of the directory.

![Configure tab in Azure Active Directory][1]

Then you can edit the options to control access for external users.

![][2]


## What's next

- [Administering Azure AD](active-directory-administer.md)
- [Manage passwords in Azure AD](active-directory-manage-passwords.md)
- [Manage groups in Azure AD](active-directory-manage-groups.md)

<!--Image references-->
[1]: ./media/active-directory-create-users/RBACDirConfigTab.png
[2]: ./media/active-directory-create-users/RBACGuestAccessControls.png
