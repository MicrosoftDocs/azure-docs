<properties 
	pageTitle="Create or edit users in Azure AD" 
	description="A topic that explains how to create or edit user accounts in Azure AD." 
	services="active-directory" 
	documentationCenter="" 
	authors="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"/>

<tags 
	ms.service="active-directory" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/05/2015" 
	ms.author="Justinha"/>

# Create or edit users in Azure AD

You have to create an account for every user who will access a Microsoft cloud service. You can also change user accounts or delete them when they’re no longer needed. By default, users do not have administrator permissions, but you can optionally assign them.

## Create a user

1. Click **Active Directory**, and then click on the name of your organization’s directory.
2. On the **Users** page, click **Add User**.
3. On the **Tell us about this user** page, for **Type of User**, select either: 
	1. **New user in your organization** – Indicates that you want a new user account to be created and managed within your directory.
	2. **User with an existing Microsoft account** – Indicates that you want to add an existing Microsoft account to your directory in order to collaborate on Azure resources with a co-administrator who accesses Azure with a Microsoft account.	
	3. **User in another Azure AD directory** – Indicates that you want to add a user account to your directory that is sourced from another Azure AD directory. You need to be a member of the other directory to select a user in it. 
4. Depending on the option you selected, type either a user name, or Microsoft account name that this user will sign in with.
5. On the user **Profile** page, provide a user’s first and last name, a user friendly name, and a user role from the Roles drop-down menu. For more information about user and administrator roles, see [Assigning administrator roles in Azure AD](active-directory-assign-admin-roles.md). Specify whether to **Enable Multi-Factor Authentication**.
6. On the **Get temporary password** page, click **Create**.

If your organization uses more than one domain, you should know about the following issues when you create a user account:

- You can create user accounts with the same user principal name (UPN) across domains if you first create, for example, geoffgrisso@contoso.onmicrosoft.com followed by geoffgrisso@contoso.com.
- You cannot create geoffgrisso@contoso.com followed by geoffgrisso@contoso.onmicrosoft.com.

## Edit a user

If the user that you are trying to edit is synchronized with your on-premises Active Directory service, an error message appears, and you will be unable to edit the user using this procedure. To edit the user, use your local Active Directory management tools.
 
To edit a user in the Azure Management Portal:

1. Click **Active Directory**, and then click on the name of your organization’s directory.
2. On the **Users** page, click on the display name of the user you want to edit.
3. Complete your changes, and then click **Save**.

## Reset a user's password

1. Click **Active Directory**, and then click on the name of your organization’s directory.
2. On the **Users** page, click on the display name of the user you want to edit.
3. At the bottom of the portal, click **Reset Password**.
4. In the reset password dialog, click **reset**.
5. Click the check mark to confirm that the password was reset.

## Create an external user

In Azure AD you can also add users to an Azure AD directory from another Azure AD directory or a user with a Microsoft Account. A user can be a member of up to 20 different directories. 

Users who are added from another directory are external users. External users can collaborate with users who already exist in a directory, such as in a test environment, without requiring them to sign in with new accounts and credentials. External users are authenticated by their home directory when they sign in, and that authentication works for all  other directories that they are a member of. 

To create an external user, create a user in the portal and for **Type of User**, select **User in another Azure AD directory**.

## External user management and limitations

When you add a user from one directory into a new directory, that user is an external user in the new directory. Initially, the display name and user name are copied from the user's "home directory" and stamped onto the external user in the other directory. From then on, those and other properties of the external user object are entirely independent: if you make a change to the user in the home directory, such as changing the user's name, adding a job title, etc. those changes are not propagated to the external user account in the other directory. 

The only linkage between the two objects is that the user always authenticates against the home directory or with their Microsoft Account. That's why you don't see an option to reset the password or enable multi-factor authentication for an external user account: currently the authentication policy of the home directory or Microsoft Account is the only one that's evaluated when the user signs in.

> [AZURE.NOTE]
> You can still disable the external user in the directory and this will block access to your directory.

If a user is deleted in their home directory or they cancel their Microsoft Account, the external user still exists in the directory. However, the user can't access resources in the directory since the user can't authenticate to their home directory or Microsoft Account anymore.

A user who is an administrator of multiple directories can manage each of those directories in the Azure management portal. However, other applications such as Office 365 do not currently provide experiences to assign and access services as an external user in another directory. Going forward, we will provide guidance to developers how their apps can work with users who are members of multiple directories.

There are currently limitations in that an administrator can only grant consent to a multi-tenant application in their home directory, and can only be provisioned for SaaS apps and SSO via the Access Panel in their home directory. Microsoft account users have the same limitations in that they cannot currently grant consent to a multi-tenant application, or use the Access Panel.

## Guests

A **guest** is a user in your directory that has a User Type set to "Guest". Regular users have a User Type of "Member" to indicate that they are a member of your directory. Guests are created when you share a resource with someone external to your directory, for example, when you add a Microsoft Account to your Azure subscription or share a document in SharePoint with an external user.

Guests have a limited set of rights in the directory. These rights limit the ability for Guests to discover information about other users in the directory while still being able to interact with the users and groups associated with the resources they are working on. For example, a Guest assigned to an Azure subscription will be able to see other users and groups associated with the Azure subscription. They can also locate other users in the directory who should be given access to the subscription provided they know the full email address of the user. A Guest is only able to see a limited set of properties of other users. These properties are limited to display name, email address, user principal name (UPN) and thumbnail photo.

## Configure user access policies

The **Configure** tab of a directory includes options to control access for external users. These options can be changed only in the UI (there is no Windows PowerShell or API method) in the full Azure portal by a directory global administrator. 
To open the **Configure** tab in the Azure portal, click **Active Directory**, and then click the name of the directory.

![][1]

Then you can edit the options to control access for external users. 

![][2]

By default, guests cannot enumerate the contents of the directory, so they do not see any users or groups in the **Member List**. They can search for a user by typing the user's full email address, and then grant access. The set of default restrictions for guests are:

- They cannot enumerate users and groups in the directory.
- They can see limited details of a user if they know the user's email address.
- They can see limited details of a group when they know the group name.

The ability for guests to see limited details of a user or group allows them to invite other people and see some details of people with whom they are collaborating.  

## What's next

- [Administering Azure AD](active-directory-administer.md)
- [Manage passwords in Azure AD](active-directory-manage-passwords.md)
- [Manage groups in Azure AD](active-directory-manage-groups.md)

<!--Image references-->
[1]: ./media/active-directory-create-users/RBACDirConfigTab.png
[2]: ./media/active-directory-create-users/RBACGuestAccessControls.png
