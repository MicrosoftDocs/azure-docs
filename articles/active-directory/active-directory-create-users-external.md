<properties
	pageTitle="Add users from other directories or partner companies in Azure Active Directory | Microsoft Azure"
	description="Explains how to add users or change user information in Azure Active Directory, including external and guest users."
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
	ms.topic="get-started-article"
	ms.date="08/02/2016"
	ms.author="curtand"/>

# Add users from other directories or partner companies in Azure Active Directory

This article explains how to add users from other directories in Azure Active Directory or add users from partner companies. For information about adding new users in your organization, and adding users who have Microsoft accounts, see [Add new users to Azure Active Directory](active-directory-create-users.md). Added users don't have administrator permissions by default, but you can assign roles to them at any time.

## Add a user

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com) with an account that's a global admin for the directory.

2. Select **Active Directory**, and then open your directory.

3. Select the **Users** tab, and then, in the command bar, select **Add User**.

4. On the **Tell us about this user** page, under **Type of user**, select either:

	- **User in another Azure AD directory** – adds a user account to your directory that's sourced from another Azure AD directory. You can select a user in another directory only if you're also a member of that directory.
	- **Users in partner companies** - to invite and authorize partner company users to your directory (See [Azure Active Directory B2B collaboration](active-directory-b2b-what-is-azure-ad-b2b.md)). You'll need to [upload a CSV file specifying email addresses](active-directory-b2b-references-csv-file-format.md).

6. On the user **Profile** page, provide a first and last name, a user-friendly name, and a user role from the **Roles** list. For more information about user and administrator roles, see [Assigning administrator roles in Azure AD](active-directory-assign-admin-roles.md). Specify whether to **Enable Multi-Factor Authentication** for the user.

7. On the **Get temporary password** page, select **Create**.

> [AZURE.IMPORTANT] If your organization uses more than one domain, you should know about the following issues when you add a user account:
>
> - TO add user accounts with the same user principal name (UPN) across domains, **first** add, for example, geoffgrisso@contoso.onmicrosoft.com, **followed by** geoffgrisso@contoso.com.
> - **Don't** add geoffgrisso@contoso.com before you add geoffgrisso@contoso.onmicrosoft.com. This order is important, and can be cumbersome to undo.

If you change information for a user whose identity is synchronized with your on-premises Active Directory service, you can't change the user information in the Azure classic portal. To change the user information, use your on-premises Active Directory management tools.

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
- With respect to Azure AD PowerShell, external users are logged into their home directory and cannot manage directories in which they are external users


## What's next

- [Add new users to Azure Active Directory](active-directory-create-users.md)
- [Administering Azure AD](active-directory-administer.md)
- [Manage passwords in Azure AD](active-directory-manage-passwords.md)
- [Manage groups in Azure AD](active-directory-manage-groups.md)
