---
title: Microsoft Azure Multi-Factor Authentication User States
description: Learn about user states in Azure MFA.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: curtand

ms.assetid: 0b9fde23-2d36-45b3-950d-f88624a68fbd
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/16/2017
ms.author: kgremban

---
# User States in Azure Multi-Factor Authentication
User accounts in Azure Multi-Factor Authentication have the following three distinct states:

| State | Description | Non-browser apps affected | 
|:---:|:---:|:---:|
| Disabled |The default state for a new user not enrolled Azure Multi-Factor Authentication (MFA). |No |
| Enabled |The user has been enrolled in Azure MFA, but has not registered. They will be prompted to register the next time they sign in. |No.  They continue to work until the registration process is completed. |
| Enforced |The user has been enrolled and has completed the registration process for Azure MFA. |Yes.  Apps require app passwords. |

## Changing a user state
A user's state reflects whether an admin has enrolled them in Azure MFA, and whether they completed the registration process.

All users start out *disabled*. When you enroll users in Azure MFA, their state changes *enabled*. When enabled users sign in and complete the registration process, their state changes to *enforced*.  

### View user states

Use the following steps to access the page where you can view and manage user states:

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com) as an administrator.
2. On the left, select **Active Directory**.
3. Select the directory for the user you wish to view.
   ![Select directory - screenshot](./media/multi-factor-authentication-get-started-cloud/directory1.png)
4. Select **Users**.
5. At the bottom of the page, select **Manage Multi-Factor Auth**. 
   ![Select Manage multi-factor auth - screenshot](./media/multi-factor-authentication-get-started-cloud/manage1.png)
6. A new tab, which displays the user states, opens.
   ![multi-factor authentication user status - screenshot](./media/multi-factor-authentication-get-started-user-states/userstate1.png)

### Change the state from disabled to enabled

1. Use the preceding steps to get to the multi-factor authentication users page. 
2. Find the user that you want to enable for Azure MFA. You may need to change the view at the top. Ensure that the status is **disabled**.
   ![Find user - screenshot](./media/multi-factor-authentication-get-started-cloud/enable1.png)
3. Check the box next to their name.
4. On the right, under quick steps, click **Enable**.
   ![Enable selected user - screenshot](./media/multi-factor-authentication-get-started-cloud/user1.png)
5. Select **enable multi-factor auth**.
   ![Enable multi-factor auth - screenshot](./media/multi-factor-authentication-get-started-cloud/enable2.png)
6. Notice the user's state has changed from **disabled** to **enabled**.
   ![See that user is now enabled - screenshot](./media/multi-factor-authentication-get-started-cloud/user.png)

After you enable users, you should notify them via email. Include the fact that they'll be asked to register the next time they sign in, and that some non-browser apps may not work with two-step verification. You can also include a link to our [Azure MFA end-user guide](./end-user/multi-factor-authentication-end-user.md) to help them get started. 

### To change the state from enabled/enforced to disabled

1. Use the steps in [View user states](#view-user-states) to get to the multi-factor authentication users page.
6. Find the user that you want to disable. You may need to change the view at the top. Ensure that the status is either **enabled** or **enforced**.
7. Check the box next to their name.
8. On the right, under quick steps, click **Disable**.
   ![Disable user - screenshot](./media/multi-factor-authentication-get-started-user-states/userstate2.png)
9. You are prompted to confirm the action. Click **Yes**.
10. If the user was successfully disabled, you receive a success message. Click **Close**.

