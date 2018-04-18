---

title: Add B2B collaboration users in the Azure portal - Azure Active Directory | Microsoft Docs
description: Shows how an admin can add guest users to their directory from a partner organization using Azure Active Directory (Azure AD) B2B collaboration.
services: active-directory
documentationcenter: ''
author: twooley
manager: mtillman
editor: ''
tags: ''

ms.assetid:
ms.service: active-directory
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: identity
ms.date: 04/02/2018
ms.author: twooley
ms.reviewer: sasubram

---

# Add Azure Active Directory B2B collaboration users in the Azure portal

As a global administrator, or a user who is assigned any of the limited administrator directory roles, you can use the Azure portal to invite B2B collaboration users. You can invite guest users to the directory, to a group, or to an application. After you invite a user through any of these methods, the invited user's account is added to Azure Active Directory (Azure AD), with a user type of *Guest*. The guest user must then redeem their invitation to access resources.

## Add guest users to the directory

To add B2B collaboration users to the directory, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. In the navigation pane, select **Azure Active Directory**.
3. Under **Manage**, select **Users and groups** > **All users**.
4. Select **New guest user**.

   ![Shows where New guest user is in the UI](./media/active-directory-b2b-admin-add-users/NewGuestUser-Directory.png) 
 
7. Under **Invite a guest**, enter the email address of the external user. Optionally, include a welcome message. For example:

   ![Shows where New guest user is in the UI](./media/active-directory-b2b-admin-add-users/InviteGuest.png) 

8. Select **Invite** to automatically send the invitation to the guest user. In the **Notification** area, look for a **Successfully invited user** message. 
 
After you send the invitation, the user account is automatically added to the directory as a guest.


![Shows B2B user with Guest user type](./media/active-directory-b2b-admin-add-users/GuestUserType.png)  

## Add guest users to a group
If you need to manually add B2B collaboration users to a group as an Azure AD administrator, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. In the navigation pane, select **Azure Active Directory**.
3. Under **Manage**, select **Users and groups** > **All groups**.
4. Select a group (or click **New group** to create a new one). It's a good idea to include in the group description that the group contains B2B guest users.
5. Select **Members** > **Add members**. 
6. Do one of the following:
   - If the guest user already exists in the directory, search for the B2B user. Select the user > click **Select** to add the user to the group.
   - If the guest user does not already exist in the directory, select **Invite**.
   ![Add invite button to add guest members](./media/active-directory-b2b-admin-add-users/GroupInvite.png)
   
      Under **Invite a guest**, enter the email address, and an optional personal message > select **Invite**. Click **Select** to add the user to the group.

      The invitation automatically goes out to the invited user. In the **Notification** area, look for a successful **Invited user** message. 

You can also use dynamic groups with Azure AD B2B collaboration. For more information, see [Dynamic groups and Azure Active Directory B2B collaboration](active-directory-b2b-dynamic-groups.md).

## Add guest users to an application

To add B2B collaboration users to an application as an Azure AD administrator, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. In the navigation pane, select **Azure Active Directory**.
3. Under **Manage**, select **Enterprise applications** > **All applications**.
4. Select the application to which you want to add guest users.
5. Under **Manage**, select **Users and groups**.
6. Select **Add user**.
7. Under **Add Assignment**, select **User and groups**.
8. Do one of the following:
   - If the guest user already exists in the directory, search for the B2B user. Select the user, and then click **Select** to add the user to the app.
   - If the guest user does not already exist in the directory, select **Invite**.
   ![Add invite button to add guest members](./media/active-directory-b2b-admin-add-users/AppInviteUsers.png)
   
      Under **Invite a guest**, enter the email address, and an optional personal message > select **Invite**. Click **Select** to add the user to the app.

      The invitation automatically goes out to the invited user. In the **Notification** area, look for a successful **Invited user** message.

9. Under **Add Assignment**, click **Select Role** > select a role to apply to the selected user (if applicable) > select **OK**.
10. Click **Assign**.
 
## Resend invitations to guest users

If a guest user has not yet redeemed their invitation, you can resend the invitation.

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. In the navigation pane, select **Azure Active Directory**.
3. Under **Manage**, select **Users and groups**.
4. Select **All users**.
5. Select the user account.
6. Under **Manage**, select **Profile**.
7. If the user has not yet accepted the invitation, a **Resend invitation** option is available. Select this button to resend.

   ![Resend invitation option in the user profile](./media/active-directory-b2b-admin-add-users/Resend-Invitation.png)

> [!NOTE]
> If you resend an invitation that originally directed the user to a specific app, understand that the link in the new invitation takes the user to the top-level Access Panel instead.

## Next steps

- To learn how non-Azure AD admins can add B2B guest users, see [How do information workers add B2B collaboration users?](active-directory-b2b-iw-add-users.md)
- For information about the invitation email, see [The elements of the B2B collaboration invitation email](active-directory-b2b-invitation-email.md).
- For information about the invitation redemption process, see [B2B collaboration invitation redemption](active-directory-b2b-redemption-experience.md).


