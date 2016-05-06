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
	ms.date="03/24/2016"
	ms.author="curtand;viviali"/>

# Add or change users in Azure Active Directory

You must add an account to your directory of your tenant for every user who will access a Microsoft cloud service. Added users do not have administrator permissions by default, but you can assign roles to them at any time.

## Add a user

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com) with an account that is a global admin for the directory.
2. Select **Active Directory**, and then select the name of your organization’s directory.
3. Select the **Users** tab, and then, in the command area, select **Add User**.
4. On the **Tell us about this user** page, under **Type of user**, select either:

	- **New user in your organization** – to add a new user account in your directory
	- **User with an existing Microsoft account** – to add an existing Microsoft consumer account to your directory (for example, an outlook account)
	- **User in another Azure AD directory** – to add a user account to your directory that is sourced from another Azure AD directory (Note: you need to be a member of the other directory to select a user in it)
	- **Users in partner companies** - to invite and authorize partner company users to your directory (See [Azure Active Directory B2B collaboration](active-directory-b2b-what-is-azure-ad-b2b.md))


5. Depending on the user type you selected, enter either a user name, an email address, or upload a CSV file specifying email addresses with which the users will sign in.
6. On the user **Profile** page, provide a user’s first and last name, a user friendly name, and a user role from the **Roles** list. For more information about user and administrator roles, see [Assigning administrator roles in Azure AD](active-directory-assign-admin-roles.md). Specify whether to **Enable Multi-Factor Authentication**.
7. On the **Get temporary password** page, select **Create**.

> [AZURE.IMPORTANT] If your organization uses more than one domain, you should know about the following issues when you add a user account:
>
> - You can add user accounts with the same user principal name (UPN) across domains if you first add, for example, geoffgrisso@contoso.onmicrosoft.com followed by geoffgrisso@contoso.com.
> - You must not add geoffgrisso@contoso.com before you add geoffgrisso@contoso.onmicrosoft.com. This order is extremely important, and can be cumbersome to undo.

## Change user information

You can change any user attributes except for the user's object ID.

1. Open your organization’s directory.
2. Select the **Users** tab, and then select the display name of the user you want to change.
3. Complete your changes, and then click **Save**.

If the user that you are trying to change is synchronized with your on-premises Active Directory service, an error message appears, and you will be unable to change the user information using this procedure. To change the user, use your local Active Directory management tools.

## Reset a user password

1. Open your organization’s directory.
2. Select the **Users** tab, and then select the display name of the user you want to change.
3. In the command area, select **Reset Password**.
4. In the reset password dialog, click **reset**.
5. Select the check mark to finish resetting the password.

## Add external users

In Azure AD, you can also add users to an Azure AD directory with a Microsoft account from another Azure AD directory that you belong to, or from partner companies by uploading a CSV file. To add an external user, add a user in the portal and for **Type of User**, select **User in another Microsoft Azure AD directory** or **Users in partner companies**.

Users or either type are sourced from another directory and are added as **external users**. External users can collaborate with users who already exist in a directory using their single account without needing to add new accounts and credentials. External users are authenticated by their home directory when they sign in, and that authentication works for any other directories to which they have been added.

## External user management and limitations

When you add a user from another directory to your directory, that user is an external user in your directory. Initially, the display name and user name are copied from the user's "home directory" and stamped onto the external user in your directory. From then on, those and other properties of the external user account are entirely independent: if any changes are made to the user in their home directory, such as changing the user's name, adding a job title, and so on, those changes are not propagated to the external user account in your directory.

The only linkage between the two accounts is that the user always authenticates against the home directory or with their Microsoft account. That's why you don't see an option to reset the password or enable multi-factor authentication for an external user: currently, the authentication policy of the home directory or Microsoft account is the only one that's evaluated when the user signs in.

> [AZURE.NOTE]
> You can still disable the external user in the directory, and this will block access to your directory.

If a user is deleted in their home directory or they cancel their Microsoft account, the external user still exists in your directory. However, the user can't access resources in your directory because the user can no longer authenticate with their home directory or Microsoft account.

Here are services that currently support access by Azure AD external users:

- **Azure classic portal**: allows an external user who is an administrator of multiple directories to manage each of those directories
- **SharePoint Online**: allows an external user to access SharePoint Online authorized resources if external sharing is enabled
- **Dynamics CRM**: allows an external user to access authorized resources in Dynamics CRM if the user is licensed via PowerShell

Here are the known limitations of Azure AD external users:

- External users who are admins cannot add users from partner companies to directories (B2B collaboration) outside their home directory
- External users cannot consent to multi-tenant applications in directories outside of their home directory
- Visual Studio Online does not currently support access by external users\*
- PowerBI does not currently support access by external users
- Office Portal does not support licensing external users

\* Visual Studio Online does allow access by external users that authenticate using Microsoft accounts, but not external users that authenticate using work or school accounts.

## Guest user management and limitations

Guest accounts represent users from other directories who were invited to your directory to access a specific resource such as a SharePoint Online document, application, or Azure resource.
A guest account in your directory has its underlying UserType attribute set to "Guest". Regular users (that is, members of your directory) have a UserType attribute of "Member."

Guests have a limited set of rights in the directory. These rights limit the ability for Guests to discover information about other users in the directory while still being able to interact with the users and groups associated with the resources they are working on. Guest users can:

- See other users and groups associated with an Azure subscription to which they are assigned
- See the members of groups to which they belong
- Look up other users in the directory, if they know the full email address of the user
- See only a limited set of attributes of the users they look up--limited to display name, email address, user principal name (UPN), and thumbnail photo
- Get a list of verified domains in the tenant directory
- Consent to applications, granting them the same access that Members have in your directory

## Set user access policies

The **Configure** tab of a directory includes options to control access for external users. These options can be changed only in Azure classic portal by a directory global administrator (there is no Windows PowerShell or API method).

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
