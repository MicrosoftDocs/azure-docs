<properties
   pageTitle="How to give access to PIM | Microsoft Azure"
   description="Learn how to add roles to users with the Azure Active Directory Privileged Identity Management extension so they can manage PIM."
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
   ms.date="04/15/2016"
   ms.author="kgremban"/>

# How to give access to manage Azure AD Privileged Identity Management

The first user to enable Azure AD Privileged Identity Management (PIM) for an organization is required to be a global administrator. Other global administrators, however, do not have access to PIM by default, so they cannot manage temporary assignments. To give access to PIM, the first user can assign the others to the Security Administrator role. This assignment must be done from within PIM itself, and cannot be changed via PowerShell or other portals.

> [AZURE.NOTE] Managing Azure AD PIM requires Azure MFA. Since Microsoft accounts cannot register for Azure MFA, a user who signs in with a Microsoft account cannot access Azure AD PIM.

Make sure there are always at least two users in a security administrator role, in case one user is locked out or their account is deleted.

## Give another user access to manage PIM

1. Sign in to the [Azure portal](https://portal.azure.com/) and select the **Azure AD Privileged Identity Management** app on the dashboard.
2. Select the **Security Administrator** role.  The list of users currently in that role will be displayed.
3. Click **Add** and a wizard blade will appear. The role will already be selected.
4. Click **Select users** and the user list blade will open.
5. Enter the name of the user in the search field.  If the user is in the directory, their accounts will appear as you are typing.
6. Select the user from the search results, and click **Done**.
7. Click **OK** to save your selection. The user you have selected will appear in the list and the role will be temporary by default.

  - If you want to make the role permanent, click the user in the list. The user's information will appear in a new blade. Select **make perm** in the user information menu.

8. Send the user a link to the Azure documentation on [Getting started with Azure AD Privileged Identity Management](active-directory-privileged-identity-management-getting-started.md).


## Remove another user's access rights for managing PIM

Before you remove someone from the Security Administrator role, always make sure there will still be two users assigned to it.

1. In the PIM dashboard, click on the role **Security Administrator**.  The list of users currently in that role will be displayed.
2. Click on the user in the user list.
3. Click on **Remove**.  You will be presented with a confirmation message.
4. Click **Yes** to remove the role from the user.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
