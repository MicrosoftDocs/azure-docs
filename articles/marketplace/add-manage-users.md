---
title: Add and manage users for the commercial marketplace - Azure Marketplace
description: Learn how to manage users in the commercial marketplace program for a Microsoft commercial marketplace account in Partner Center.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: sharath-satish-msft
ms.author: shsatish
ms.custom: contperf-fy21q2
ms.date: 01/20/2022
---

# Add and manage users for the commercial marketplace

**Appropriate roles**

- Owner
- Manager

The **Account Settings** page in Partner Center lets you use Azure AD to manage the users, groups, and Azure AD applications that have access to your Partner Center account. Your account must have Manager-level permissions for the [work account (Azure AD tenant)](company-work-accounts.md) in which you want to add or edit users. To manage users within a different work account/tenant, you will need to sign out and then sign back in as a user with **Manager** permissions on that work account / tenant.

After you are signed in with your work account (Azure AD tenant), you can add and manage users.

## Add existing users

To add users to your Partner Center account that already exist in your company's [work account (Azure AD tenant)](company-work-accounts.md):

1. In the menu bar, select **Settings** (gear icon) > **Account settings**.
1. In the left-menu, select **User management**.
1. On the **Users** tab, select **Add user**.
1. Select one or more users from the list that appears. You can use the search box to search for specific users. 
    > [!NOTE]
    > If you select more than one user to add to your Partner Center account, you must assign them the same role or set of custom permissions. To add multiple users with different roles/permissions, repeat these steps for each role or set of custom permissions.
1. When you are finished choosing users, select **Add selected**.
1. In the **Roles** section, specify the role(s) or customized permissions for the selected user(s).
1. Select **Save**.

## Create new users

To create brand new user accounts, you must have an account with [Global administrator](../active-directory/roles/permissions-reference.md) permissions.

1. In the menu bar, select **Settings** (gear icon) > **Account settings**.
1. In the left-menu, select **User management**.
1. On the **Users** tab, select **Add user**. Then select **Create new users**.
1. Enter a first name, last name, and username for each new user.
1. If you want the new user to have a global administrator account in your organization's directory, check the box labeled **Make this user a Global administrator in your Azure AD, with full control over all directory resources**. This will give the user full access to all administrative features in your company's Azure AD. They'll be able to add and manage users in your organization's work account (Azure AD tenant), though not in Partner Center, unless you grant the account the appropriate role/permissions.
1. If you checked the box to **Make this user a Global administrator**, you'll need to provide a *Password recovery email* for the user to recover their password if necessary.
1. In the **Group membership** section, select any groups to which you want the new user to belong.
1. In the **Roles** section, specify the role(s) or customized permissions for the user.
1. Select **Save**.

Creating a new user in Partner Center will also create an account for that user in the work account (Azure AD tenant) to which you are signed in. Making changes to a user's name in Partner Center will make the same changes in your organization's work account (Azure AD tenant).

## Invite new users by email

To invite users that are not currently a part of your company work account (Azure AD tenant) via email, you must have an account with [Global administrator](../active-directory/roles/permissions-reference.md) permissions.

1. In the menu bar, select **Settings** (gear icon) > **Account settings**.
1. In the left-menu, select **User management**.
1. On the **Users** tab, select **Add user**. Then select **Invite outside users**.
1. Enter one or more email addresses (up to 10), separated by commas or semicolons.
1. In the **Roles** section, specify the role(s) or customized permissions for the user.
1. Select **Save**.

The users you invited will get an email invitation to join your Partner Center account. A new guest-user account will be created in your work account (Azure AD tenant). Each user will need to accept their invitation before they can access your account.

If you need to resend an invitation, visit the *Users* page, find the invitation in the list of users, select their email address (or the text that says *Invitation pending*). Then, at the bottom of the page, select **Resend invitation**.

If your organization uses [directory integration](/previous-versions/azure/azure-services/jj573653(v=azure.100)) to sync the on-premises directory service with your Azure AD, you won't be able to create new users, groups, or Azure AD applications in Partner Center. You (or another admin in your on-premises directory) will need to create them directly in the on-premises directory before you'll be able to see and add them in Partner Center.

## Remove a user

Complete these steps to remove a user from your work account (Azure AD tenant).

1. In the menu bar, select **Settings** (gear icon) > **Account settings**.
1. In the left-menu, select **User management**.
1. On the **Users** tab, for the user that you want to remove, select **Delete**.
1. In the panel that appears, select whether you want to delete the account from Partner Center, the organization, or both.
1. Select **Delete**.

## Change a user password

If one of your users needs to change their password, they can do so themselves if you provided a *Password recovery email* when creating the user account. You can also update a user's password by following the steps below. To change a user's password in your company work account (Azure AD tenant), you must be signed in on an account with [Global administrator](../active-directory/roles/permissions-reference.md) permissions. This will change the user's password in your Azure AD tenant, along with the password they use to access Partner Center.

1. In the menu bar, select **Settings** (gear icon) > **Account settings**.
1. In the left-menu, select **User management**.
1. On the **Users** tab, select the name of the user account that you want to edit.
1. Select the **Password reset** button at the bottom of the page.
1. A confirmation page will appear to show the login information for the user, including a temporary password. Be sure to print or copy this info and provide it to the user, as you won't be able to access the temporary password after you leave this page.
1. Select **Done**.
