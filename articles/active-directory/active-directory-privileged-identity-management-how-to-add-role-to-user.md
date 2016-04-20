<properties
   pageTitle="How to add or remove a user role | Microsoft Azure"
   description="Learn how to add roles to privileged identities with the Azure Active Directory Privileged Identity Management application."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="04/18/2016"
   ms.author="kgremban"/>

# Azure AD Privileged Identity Management: How to add or remove a user role

With Azure Active Directory (AD), a global administrator (or company administrator) can update which users are **permanently** assigned to roles in Azure AD. This is done with PowerShell cmdlets like `Add-MsolRoleMember` and `Remove-MsolRoleMember`. Or they can use the Azure classic portal as described in [assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles.md).

The Azure AD Privileged Identity Management application allows security administrators to make permanent role assignments, as well. However, it also lets admins add or remove candidates for **temporary** assignment to these roles. A candidate can activate the role when they need it, and then their permissions expire once they're done.

## Manage roles with PIM in the Azure portal

In your organization, you can assign users to different administrative roles in Azure AD. These role assignments control which tasks, like adding and removing users or changing service settings, the users can perform on Azure AD, Office 365, and other Microsoft services and applications.  More details on the available roles can be found at [Roles in Azure AD PIM](active-directory-privileged-identity-management-roles.md).

In order to add a user to a role or remove a user from a role using Privileged Identity Management, bring up the PIM dashboard and then either click on the **Users in Admin Roles** button, or select a specific role (such as Global Administrator) from the roles table.

> [AZURE.NOTE] If you haven't enabled PIM in the Azure portal yet, go to [Get started with Azure AD PIM](active-directory-privileged-identity-management-getting-started.md) for details.

If you want to give another user access to PIM itself, the roles which PIM requires the user to have are described further in [how to give access to PIM](active-directory-privileged-identity-management-how-to-give-access-to-pim.md).

## Add a user to a role
Once you have navigated to the role blade, either by selecting a role in the Azure AD PIM dashboard or by clicking on the **Users in Admin Roles** button,

1. Click **Add**.
  - If you have navigated here from clicking on a user role in the role table, then the role will already be selected.  
  or  
  - Click **Select a role** and choose a role from the role list. For example, **Password Administrator**.
2. Search for the user on the **Select users** blade.  If the user is in the directory, their accounts will appear as you are typing.
3. Select the user from the search results list, and click **Done**.
4. Click **OK** to save your selection. The user you have selected will appear in the list and the role will be temporary by default.

  >[AZURE.NOTE] If you want to make the role permanent, click the user in the list. The user's information will appear in a new blade. Select **make perm** in the user information menu.  
  You'll need to do this if the user cannot register for Azure Multi-Factor Authentication (MFA), or is using a Microsoft account. Temporary admins are asked to register for MFA during activation.

Now that the user has been assigned a temporary role, let them know that they can activate it according to the instructions in [How to activate or deactivate a role](active-directory-privileged-identity-management-how-to-activate-role.md).

## Remove a user from a role

You can remove users from temporary role assignments, but make sure there is always at least one user who is a permanent global administrator.

Follow these steps to remove a specific user from a role:

1. Navigate to the role in the role list either by selecting a role in the Azure AD PIM dashboard or by clicking on the **Users in Admin Roles** button.
2. Click on the user in the user list.
3. Click **Remove**. A message will ask you to confirm.
4. Click **Yes** to remove the role from the user.

If you're not sure which users still need their role assignments, then you can [start a security review for the role](active-directory-privileged-identity-management-how-to-start-security-review.md).


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
