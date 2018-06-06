---
title: Self-service password reset deployment guide - Azure Active Directory
description: Tips for successful rollout of Azure AD self-service password reset

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: get-started-article
ms.date: 01/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry

---
# How to successfully roll out self-service password reset

To ensure a smooth rollout of the Azure Active directory (Azure AD) self-service password reset (SSPR) functionality, most customers complete the following steps:

> [!VIDEO https://www.youtube.com/embed/OZn5btP6ZXw]

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
   - We have sample training and communication materials you can download and tailor to your organization's needs from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=56768)

   > [!IMPORTANT]
   > Test SSPR with a user, rather than an administrator, as Microsoft enforces strong authentication requirements for Azure administrator accounts. For more information regarding the administrator password policy, see our [password policy](concept-sspr-policy.md) article.

10. Enable Windows 10 users to [reset their passwords from the locon screen](tutorial-sspr-windows.md).
11. [Review reports to see details about the use of SSPR in your organization over time.](howto-sspr-reporting.md)
12. As your pilot phase comes to a close review any feedback from your users and make the appropriate changes to any of the options previously selected.
13. When you're ready, enable password reset for all users by setting the **Self Service Password Reset Enabled** switch to **All**.

   > [!NOTE]
   > Changing this option from a selected group to everyone does not invalidate existing authentication data that a user has registered as part of a test group. Users who are configured and have valid authentication data registered continue to function.

## Email communication

Many customers find that the easiest way to get users to use SSPR is with an email campaign that includes simple-to-use instructions. [We have created three simple emails that you can use as templates to help in your rollout](https://www.microsoft.com/download/details.aspx?id=56768):

* **Coming soon**: An email template that you use in the weeks or days before the rollout to let users know they need to do something.
* **Available now**: An email template that you use the day of the program launch to drive users to register and confirm their authentication data. If users register now, they have SSPR available when they need it.
* **Sign-up reminder**: An email template for a few days to a few weeks after deployment to remind users to register and confirm their authentication data.

![Email][Email]

## Create your own password portal

Many customers choose to host a webpage and create a root DNS entry, like https://passwords.contoso.com. They populate this page with links to the following information:

* [Azure AD password reset portal - https://aka.ms/sspr](https://aka.ms/sspr)
* [Azure AD password reset registration portal - https://aka.ms/ssprsetup](https://aka.ms/ssprsetup)
* [Azure AD password change portal - https://account.activedirectory.windowsazure.com/ChangePassword.aspx](https://account.activedirectory.windowsazure.com/ChangePassword.aspx)
* Other organization-specific information

In any email communications or fliers you send out you can include a branded, memorable URL that users can go to when they need to use the services. For your benefit, we have created a [sample password reset page](https://github.com/ajamess/password-reset-page) that you can use and customize to your organization’s needs.

## Step-by-step deployment plan

The Azure Active Directory product group has created a [step-by-step deployment plan](https://aka.ms/SSPRDeploymentPlan) that organizations can use in parallel with the documentation found on this site to make a business case and plan for deployment of self-service password reset.

## Use enforced registration

If you want your users to register for password reset, you can require that they register when they sign in through Azure AD. You can enable this option from your directory’s **Password reset** pane by enabling the **Require Users to Register when Signing in** option on the **Registration** tab.

Administrators can require users to re-register after a specific period of time. They can set the **Number of days before users are asked to reconfirm their authentication information** option to 0 to 730 days.

After you enable this option, when users sign in they see a message that says their administrator has required them to verify their authentication information.

## Populate authentication data

You should consider [pre-populating some authentication data for your users](howto-sspr-authenticationdata.md). That way users don't need to register for password reset before they are able to use SSPR. As long as users have provided the authentication data that meets the password reset policy you have defined, they are able to reset their passwords.

## Disable self-service password reset

If your organization decides to disable self-service password reset it is a simple process. Open your Azure AD tenant and go to **Password Reset** > **Properties**, and then select **None** under **Self Service Password Reset Enabled**. Users will still maintain their

## Next steps

* [Reset or change your password](../active-directory-passwords-update-your-own-password.md)
* [Register for self-service password reset](../active-directory-passwords-reset-register.md)
* [Do you have a licensing question?](concept-sspr-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](howto-sspr-authenticationdata.md)
* [What are the policy options with SSPR?](concept-sspr-policy.md)
* [What is password writeback and why do I care about it?](howto-sspr-writeback.md)
* [How do I report on activity in SSPR?](howto-sspr-reporting.md)
* [What are all of the options in SSPR and what do they mean?](concept-sspr-howitworks.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)

[Email]: ./media/howto-sspr-deployment/sspr-emailtemplates.png "Customize these email templates to fit your organizational requirements"
