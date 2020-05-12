---

title: Add B2B collaboration users in the Azure portal - Azure AD
description: Shows how an admin can add guest users to their directory from a partner organization using Azure Active Directory (Azure AD) B2B collaboration.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 05/19/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal

ms.collection: M365-identity-device-management
---

# Add Azure Active Directory B2B collaboration users in the Azure portal

As a user who is assigned any of the limited administrator directory roles, you can use the Azure portal to invite B2B collaboration users. You can invite guest users to the directory, to a group, or to an application. After you invite a user through any of these methods, the invited user's account is added to Azure Active Directory (Azure AD), with a user type of *Guest*. The guest user must then redeem their invitation to access resources. An invitation of a user does not expire.

After you add a guest user to the directory, you can either send the guest user a direct link to a shared app, or the guest user can click the redemption URL in the invitation email. For more information about the redemption process, see [B2B collaboration invitation redemption](redemption-experience.md).

> [!IMPORTANT]
> You should follow the steps in [How-to: Add your organization's privacy info in Azure Active Directory](https://aka.ms/adprivacystatement) to add the URL of your organization's privacy statement. As part of the first time invitation redemption process, an invited user must consent to your privacy terms to continue. 

## Before you begin

Make sure your organization's external collaboration settings are configured such that you're allowed to invite guests. By default, all users and admins can invite guests. But your organization's external collaboration policies might be configured to prevent certain types of users or admins from inviting guests. To find out how to view and set these policies, see [Enable B2B external collaboration and manage who can invite guests](delegate-invitations.md).

## Add guest users to the directory

To add B2B collaboration users to the directory, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as a user who is assigned a limited administrator directory role or the Guest Inviter role.
2. Search for and select **Azure Active Directory** from any page.
3. Under **Manage**, select **Users**.
4. Select **New guest user**.

   ![Shows where New guest user is in the UI](./media/add-users-administrator/new-guest-user-in-all-users.png) 
 
5. On the **New user** page, select **Invite user** and then add the guest user's information. 

    > [!NOTE]
    > Group email addresses aren’t supported; enter the email address for an individual. Also, some email providers allow users to add a plus symbol (+) and additional text to their email addresses to help with things like inbox filtering. However, Azure AD doesn’t currently support plus symbols in email addresses. To avoid delivery issues, omit the plus symbol and any characters following it up to the @ symbol.

   - **Name.** The first and last name of the guest user.
   - **Email address (required)**. The email address of the guest user.
   - **Personal message (optional)** Include a personal welcome message to the guest user.
   - **Groups**: You can add the guest user to one or more existing groups, or you can do it later.
   - **Directory role**: If you require Azure AD administrative permissions for the user, you can add them to an Azure AD role. 

7. Select **Invite** to automatically send the invitation to the guest user. 
 
After you send the invitation, the user account is automatically added to the directory as a guest.


![Shows B2B user with Guest user type](./media/add-users-administrator/GuestUserType.png)  

## Add guest users to a group
If you need to manually add B2B collaboration users to a group, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. Search for and select **Azure Active Directory** from any page.
3. Under **Manage**, select **Groups**.
4. Select a group (or click **New group** to create a new one). It's a good idea to include in the group description that the group contains B2B guest users.
5. Select **Members**. 
6. Do one of the following:
   - If the guest user already exists in the directory, search for the B2B user. Select the user, and then click **Select** to add the user to the group.
   - If the guest user does not already exist in the directory, invite them to the group by typing their email address in the search box, typing an optional personal message, and then clicking **Select**. The invitation automatically goes out to the invited user.
     
     ![Add invite button to add guest members](./media/add-users-administrator/GroupInvite.png)
   
You can also use dynamic groups with Azure AD B2B collaboration. For more information, see [Dynamic groups and Azure Active Directory B2B collaboration](use-dynamic-groups.md).

## Add guest users to an application

To add B2B collaboration users to an application, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. Search for and select **Azure Active Directory** from any page.
3. Under **Manage**, select **Enterprise applications** > **All applications**.
4. Select the application to which you want to add guest users.
5. On the application's dashboard, select **Total Users** to open the **Users and groups** pane.

    ![Total Users button to add open Users and Groups](./media/add-users-administrator/AppUsersAndGroups.png)

6. Select **Add user**.
7. Under **Add Assignment**, select **User and groups**.
8. Do one of the following:
   - If the guest user already exists in the directory, search for the B2B user. Select the user, click **Select**, and then click **Assign** to add the user to the app.
   - If the guest user does not already exist in the directory, under **Select member or invite an external user**, type the user's email address. In the message box, type an optional personal message. Under the message box, click **Invite**.
           
       ![Add invite button to add guest members](./media/add-users-administrator/AppInviteUsers.png)
   
      Click **Select**, and then click **Assign** to add the user to the app. An invitation automatically goes out to the invited user.

9. The guest user appears in the application's **Users and groups** list with the assigned role of **Default Access**. If you want to change the role, do the following:
   - Select the guest user, and then select **Edit**. 
   - Under **Edit Assignment**, click **Select Role**, and select the role you want to assign to the selected user.
   - Click **Select**.
   - Click **Assign**.
 
## Resend invitations to guest users

If a guest user has not yet redeemed their invitation, you can resend the invitation email.

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. Search for and select **Azure Active Directory** from any page.
3. Under **Manage**, select **Users**.
5. Select the user account.
6. Under **Manage**, select **Profile**.
7. If the user has not yet accepted the invitation, a **Resend invitation** option is available. Select this button to resend.

   ![Resend invitation option in the user profile](./media/add-users-administrator/b2b-user-resend-invitation.png)

> [!NOTE]
> If you resend an invitation that originally directed the user to a specific app, understand that the link in the new invitation takes the user to the top-level Access Panel instead.

## Next steps

- To learn how non-Azure AD admins can add B2B guest users, see [How do information workers add B2B collaboration users?](add-users-information-worker.md)
- For information about the invitation email, see [The elements of the B2B collaboration invitation email](invitation-email-elements.md).

