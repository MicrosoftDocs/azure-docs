---
title: Self-service password reset deployment guide - Azure Active Directory
description: Tips for successful rollout of Azure AD self-service password reset

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: conceptual
ms.date: 07/17/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry

---
# How to successfully roll out self-service password reset

To ensure a smooth rollout of the Azure Active directory (Azure AD) self-service password reset (SSPR) functionality, most customers complete the following steps:

> [!VIDEO https://www.youtube.com/embed/OZn5btP6ZXw]

1. Complete a pilot roll out with a small subset of your organization.
   * Information on how to pilot can be found in the [Tutorial: Complete an Azure AD self-service password reset pilot roll out](tutorial-sspr-pilot.md).
1. Educate your helpdesk.
   * How will they help your users?
   * Will you force users to use SSPR and not allow your helpdesk to assist users?
   * Have you provided them the URLs for registration and reset?
      * Registration:  https://aka.ms/ssprsetup
      * Reset: https://aka.ms/sspr
1. Educate your users.
   * This following sections of this document go over sample communication, password portals, enforcing registration, and populating authentication data.
   * The Azure Active Directory product group has created a [step-by-step deployment plan](https://aka.ms/SSPRDeploymentPlan) that organizations can use in parallel with the documentation found on this site to make a business case and plan for deployment of self-service password reset.
1. Enable self-service password reset for your entire organization.
   * When you're ready, enable password reset for all users by setting the **Self Service Password Reset Enabled** switch to **All**.

## Sample communication

Many customers find that the easiest way to get users to use SSPR is with an email campaign that includes simple-to-use instructions. [We have created simple emails and other collateral that you can use as templates to help in your rollout](https://www.microsoft.com/download/details.aspx?id=56768):

* **Coming soon**: An email template that you use in the weeks or days before the rollout to let users know they need to do something.
* **Available now**: An email template that you use the day of the program launch to drive users to register and confirm their authentication data. If users register now, they have SSPR available when they need it.
* **Sign-up reminder**: An email template for a few days to a few weeks after deployment to remind users to register and confirm their authentication data.
* **SSPR Posters**: Posters you can customize and display around your organization in the days and weeks leading up to and after your roll out.
* **SSPR Table tents**: Table cards you can place in the lunch room, conference rooms, or on desks to encourage your users to complete registration.
* **SSPR Stickers**: Sticker templates you can customize and print to place laptops, monitors, keyboards, or cell phones to remember how to access SSPR.

![SSPR Email Samples][Email]

## Create your own password portal

Many customers choose to host a webpage and create a root DNS entry, like https://passwords.contoso.com. They populate this page with links to the following information:

* [Azure AD password reset portal - https://aka.ms/sspr](https://aka.ms/sspr)
* [Azure AD password reset registration portal - https://aka.ms/ssprsetup](https://aka.ms/ssprsetup)
* [Azure AD password change portal - https://account.activedirectory.windowsazure.com/ChangePassword.aspx](https://account.activedirectory.windowsazure.com/ChangePassword.aspx)
* Other organization-specific information

In any email communications or fliers you send out you can include a branded, memorable URL that users can go to when they need to use the services. For your benefit, we have created a [sample password reset page](https://github.com/ajamess/password-reset-page) that you can use and customize to your organization’s needs.

## Use enforced registration

If you want your users to register for password reset, you can require that they register when they sign in through Azure AD. You can enable this option from your directory’s **Password reset** pane by enabling the **Require Users to Register when Signing in** option on the **Registration** tab.

Administrators can require users to re-register after a specific period of time. They can set the **Number of days before users are asked to reconfirm their authentication information** option to 0 to 730 days.

After you enable this option, when users sign in they see a message that says their administrator has required them to verify their authentication information.

## Populate authentication data

You should consider [pre-populating some authentication data for your users](howto-sspr-authenticationdata.md). That way users don't need to register for password reset before they are able to use SSPR. As long as users have provided the authentication data that meets the password reset policy you have defined, they are able to reset their passwords.

## Disable self-service password reset

If your organization decides to disable self-service password reset it is a simple process. Open your Azure AD tenant and go to **Password Reset** > **Properties**, and then select **None** under **Self Service Password Reset Enabled**. Users will still maintain their registered authentication methods for future use.

## Next steps

* [Reset or change your password](../user-help/active-directory-passwords-update-your-own-password.md)
* [Register for self-service password reset](../user-help/active-directory-passwords-reset-register.md)
* [Enable converged registration for Azure Multi-Factor Authentication and Azure AD self-service password reset](concept-registration-mfa-sspr-converged.md)
* [Do you have a licensing question?](concept-sspr-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](howto-sspr-authenticationdata.md)
* [What are the policy options with SSPR?](concept-sspr-policy.md)
* [What is password writeback and why do I care about it?](howto-sspr-writeback.md)
* [How do I report on activity in SSPR?](howto-sspr-reporting.md)
* [What are all of the options in SSPR and what do they mean?](concept-sspr-howitworks.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)

[Email]: ./media/howto-sspr-deployment/sspr-emailtemplates.png "Customize these email templates to fit your organizational requirements"
