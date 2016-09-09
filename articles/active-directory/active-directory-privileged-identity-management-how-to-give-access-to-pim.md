<properties
   pageTitle="How to give access to PIM | Microsoft Azure"
   description="Learn how to add roles to users with the Azure Active Directory Privileged Identity Management extension so they can manage PIM."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="femila"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="06/30/2016"
   ms.author="kgremban"/>

# How to give access to manage Azure AD Privileged Identity Management

The global administrator who enables Azure AD Privileged Identity Management (PIM) for an organization automatically get role assignments and access to PIM. No one else gets access by default, though, including other global administrators. To give access to PIM, the first user can assign others to the **Privileged role administrator** role. This assignment must be done from within PIM itself, and cannot be changed via PowerShell or other portals.

> [AZURE.NOTE] Managing Azure AD PIM requires Azure MFA. Since Microsoft accounts cannot register for Azure MFA, a user who signs in with a Microsoft account cannot access Azure AD PIM.

Make sure there are always at least two users in a privileged role administrator role, in case one user is locked out or their account is deleted.

## Give another user access to manage PIM

1. Sign in to the [Azure portal](https://portal.azure.com/) and select the **Azure AD Privileged Identity Management** app on the dashboard.
2. Select **Manage privileged roles** > **Privileged role administrator** > **Add**.

    ![Add privileged role administrators - screenshot][1]

4. On the Add managed users blade, step 1 is already complete. Select step 2, **Select users** and search for the user you want to add.

    ![Select users - screenshot][2]

6. Select the user from the search results, and click **Done**.
7. Click **OK** to save your selection. The user you have selected will appear in the list of Privileged role administrators.

    - Whenever you assign a new role to someone, they are automatically set up as eligible to activate the role. If you want to make them permanent in the role, click the user in the list. Select **make perm** in the user information menu.

8. Send the user a link to [Getting started with Azure AD Privileged Identity Management](active-directory-privileged-identity-management-getting-started.md).


## Remove another user's access rights for managing PIM

Before you remove someone from the privileged role administrator role, always make sure there will still be two users assigned to it.

1. In the PIM dashboard, click on the role **Privileged role administrator**.  The list of users currently in that role will be displayed.
2. Click on the user in the user list.
3. Click on **Remove**.  You are presented with a confirmation message.
4. Click **Yes** to remove the user from the role.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

<!--Image references-->

[1]: ./media/active-directory-privileged-identity-management-how-to-give-access-to-pim/PIM_add_PRA.png
[2]: ./media/active-directory-privileged-identity-management-how-to-give-access-to-pim/PIM_select_users.png
