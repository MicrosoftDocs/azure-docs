---
title: Enabling an Azure AD SSPR pilot
description: In this tutorial, you will enable Azure AD self-service password reset for a pilot group of users

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: tutorial
ms.date: 05/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry

# Customer intent: How, as an Azure AD Administrator, do I enable SSPR to complete a pilot roll out.
---
# Tutorial: Complete an Azure AD self-service password reset pilot roll out

In this tutorial, you will enable a pilot roll out of Azure AD self-service password reset (SSPR) in your organization.

> [!div class="checklist"]
> * 
> * 
> * 

## Prerequisites

* 

1. From your Azure AD tenant, on the Azure Portal under Azure Active Directory select Password reset.
2. Start with a pilot group by enabling self-service password for a subset of users in your organization.
   - From the **Properties** page, under the option **Self Service Password Reset Enabled**, choose **Selected** and pick a pilot group.
      * Only members of the specific Azure AD group that you choose can use the SSPR functionality. We recommend that you define a group of users and use this setting when you deploy this functionality for a proof of concept. Nesting of security groups is supported here.
      * Ensure the users in the group you picked have been appropriately licensed.
3. On the **Authentication methods** page
   - Choose the **Number of methods required to reset**
   - Choose which **Methods availalbe to users** your organization wants to allow. For more information about the various authentication methods available for SSPR see the article [What are authentication methods](concept-authentication-methods.md).
4. On the **Registration** page
   - It is reccomended if you do not prepopulate data for your users to select **Yes** for **Require users to register when signing in**.
   - Specify the **Number of days before users are asked to reconfirm their authentication information**. Never reconfirm is 0 and can be as long as 730 days.
5. On the **Notifications** page
   - If you want your users to get a notification when their password is changes se the **Notify users on password resets** option to **Yes**.
   - Microsoft reccomends that you set **Notify all admins when other admins reset their password** to **Yes**.
6. On the **Customization page
   - Microsoft reccomends that you set **Customize helpdesk link** to **Yes** and provide either an email address or web page URL where your users can get additional help from your organization in the **Custom helpdesk email or URL** field.
7. Optional Step: If you want to write password changes back to an on-premises directory:
   - Configure password writeback using the information in the article [How-to: Configure password writeback](howto-sspr-writeback.md).
   - On the **On-premises integration** tab
       - Set **Write back passwords to your on-premises directory** to **Yes**.
       - Optionally set **Allow users to unlock accounts without resetting their password** to **Yes** so users can unlock their account if they get locked out.
8. Review your company branding of Azure AD. You can find details on how to configure company branding in the article [Add company branding to your sign-in page in Azure AD](../customize-branding.md).
   - This branding will appear when your users attempt to register for or reset their passwords and will appear in email communications.
9. Conduct your pilot rollout.
   - Train your users to register and reset
      * Self-service password reset registration [https://aka.ms/ssprsetup](https://aka.ms/ssprsetup)
      * Self-service password reset [https://aka.ms/sspr](https://aka.ms/sspr)
   - We have [sample training and communication materials](howto-sspr-deployment.md#email-communication).

   > [!IMPORTANT]
   > Test SSPR with a user, rather than an administrator, as Microsoft enforces strong authentication requirements for Azure administrator accounts. For more information regarding the administrator password policy, see our [password policy](concept-sspr-policy.md) article.

10. OPTIONALLY: Enable Windows 10 users to [reset their passwords from the locon screen](tutorial-sspr-windows.md).
11. [Review reports to see details about the use of SSPR in your organization over time.](howto-sspr-reporting.md)
12. As your pilot phase comes to a close review any feedback from your users and make the appropriate changes to any of the options previously selected.
13. When you're ready, enable password reset for all users by setting the **Self Service Password Reset Enabled** switch to **All**.

   > [!NOTE]
   > Changing this option from a selected group to everyone does not invalidate existing authentication data that a user has registered as part of a test group. Users who are configured and have valid authentication data registered continue to function.
