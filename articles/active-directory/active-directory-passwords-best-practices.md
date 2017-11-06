---
title: 'Roll out: Azure AD SSPR | Microsoft Docs'
description: Tips for successful rollout of Azure AD self-service password reset
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
ms.reviewer: sahenry

ms.assetid: f8cd7e68-2c8e-4f30-b326-b22b16de9787
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/24/2017
ms.author: joflore
ms.custom: it-pro

---
# How to successfully rollout self-service password reset

Most customers follow these steps to ensure a smooth rollout of SSPR functionality.

1. [Enable password reset in your directory](active-directory-passwords-getting-started.md).
2. [Configure on-premises AD permissions for password writeback](active-directory-passwords-writeback.md#active-directory-permissions).
3. [Configure password writeback](active-directory-passwords-writeback.md#configuring-password-writeback) to write passwords from Azure AD back to your on-premises directory.
4. [Assign and verify required licenses](active-directory-passwords-licensing.md).
5. If you want to roll out SSPR gradually, you can limit access to a group of users so you can pilot with a specific group. To do this set the **Self Service Password Reset Enabled** toggle to **Selected** and select the security group to enable for password reset. 
6. Populate [Authentication Data](active-directory-passwords-data.md) for your users such as their office phone, mobile phone, and alternate email address.
7. [Customize the Azure AD sign-in experience to include your company branding.](active-directory-passwords-customize.md).
8. Teach your users how to use SSPR, by sending them instructions to show them how to register and how to reset.
9. You can choose to enforce registration at any point, and require users to reconfirm their authentication information after a certain period of time.
10. Over time, review users registering and using by viewing the [reporting provided by Azure AD](active-directory-passwords-reporting.md).
11. When you are ready, enable password reset for all users, set the **Self Service Password Reset Enabled** toggle to **All**. 

    > [!IMPORTANT]
    > Test SSPR with a user and not an administrator as Microsoft enforces strong authentication requirements for Azure administrator type accounts. For more information regarding the administrator password policy, see our [deep dive article](active-directory-passwords-how-it-works.md).

## Email-based rollout

Many customers find an email campaign, with simple to use instructions, is the easiest way to get users to use SSPR. [We have created three simple emails that you can use as templates to help in your rollout.](https://onedrive.live.com/?authkey=%21AD5ZP%2D8RyJ2Cc6M&id=A0B59A91C740AB16%2125063&cid=A0B59A91C740AB16)

* **Coming Soon** email template to be used in the weeks or days before rollout to let users know they need to do something.
* **Available Now** email template to be used the day of launch to drive users to register and confirm their authentication data so they can use SSPR when they need it.
* **Sign up Reminder** email template for a few days to weeks after deployment to remind users to register and confirm their authentication data.

![Email][Email]

## Creating your own password portal

Many of our larger customers choose to host webpage and create a root DNS entry, like https://passwords.contoso.com. They populate this page with links to the Azure AD password reset, password reset registration, password change portals, and other organization-specific information. In any email communications or fliers, you send out, you can then include a branded, memorable, URL that users can go to when they need to use the services.

* Password reset portal - https://aka.ms/sspr
* Password reset registration portal - http://aka.ms/ssprsetup
* Password change portal - https://account.activedirectory.windowsazure.com/ChangePassword.aspx

For your benefit we have created a sample page, that you can use and customize to your organizations needs, that can be downloaded from [GitHub](https://github.com/ajamess/password-reset-page).

## Using enforced registration

If you want your users to register for password reset, you can force them to register when they sign in using Azure AD. You can enable this option from your directory’s **Password reset** blade by enabling the **Require Users to Register when Signing in** option on the **Registration** tab.

Administrators can require users to re-register after a period of time by setting the **Number of days before users are asked to reconfirm their authentication information** between 0-730 days.

After you enable this option, users signing will see a message that informs them their administrator has required them to verify their authentication information.

## Populate authentication data

If you [populate authentication data for your users](active-directory-passwords-data.md), then users do not need to register for password reset before being able to use SSPR. As long as users have the authentication data defined that meets the password reset policy you have defined, users are able to reset their passwords.

## Disabling self-service password reset

Disabling self-service password reset is as simple as opening your Azure AD tenant and going to **Password Reset**, **Properties**, and choosing **Nobody** under **Self Service Password Reset Enabled**

## Next steps

* [Reset or change your password](active-directory-passwords-update-your-own-password.md).
* [Register for self-service password reset](active-directory-passwords-reset-register.md).
* [Do you have a Licensing question?](active-directory-passwords-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](active-directory-passwords-data.md)
* [What are the policy options with SSPR?](active-directory-passwords-policy.md)
* [What is password writeback and why do I care about it?](active-directory-passwords-writeback.md)
* [How do I report on activity in SSPR?](active-directory-passwords-reporting.md)
* [What are all of the options in SSPR and what do they mean?](active-directory-passwords-how-it-works.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)

[Email]: ./media/active-directory-passwords-best-practices/sspr-emailtemplates.png "Customize these email templates to fit your organizational requirements"