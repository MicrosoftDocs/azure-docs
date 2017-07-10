---
title: 'Roll out: Azure AD SSPR | Microsoft Docs'
description: Tips for successful rollout of Azure AD self-service password reset
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
ms.reviewer: gahug

ms.assetid: f8cd7e68-2c8e-4f30-b326-b22b16de9787
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 05/25/2017
ms.author: joflore
ms.custom: it-pro

---
# Roll out password reset for users

Most customers follow the steps that follow to ensure a smooth rollout of SSPR functionality.

1. [Enable password reset in your directory](active-directory-passwords-getting-started.md)
2. [Configure on-premises AD permissions for password writeback](active-directory-passwords-how-it-works.md#active-directory-permissions)
3. [Configure password writeback](active-directory-passwords-writeback.md#configuring-password-writeback) to write passwords from Azure AD back to your on-premises directory
4. [Assign and verify required licenses](active-directory-passwords-licensing.md)
5. If you want to roll out gradually, you can optionally limit password reset to a group of users to roll out the feature slowly over time. To do this set the **Self Service Password Reset Enabled** toggle from **Everybody** to **A group** and select a security group to enable for password reset. The members of this group must all have licenses assigned to them and is a great way to enable [Group Based Licensing](active-directory-passwords-licensing.md#enable-group-or-user-based-licensing).
6. Populate the minimum set of [Authentication Data](active-directory-passwords-data.md), based on your policy.
7. Teach your users how to use SSPR, by sending them instructions to show them how to register and how to reset.
    > [!NOTE]
    > Test SSPR with a user and not an administrator as Microsoft enforces strong authentication requirements for Azure administrator type accounts. For more information regarding the administrator password policy, see our [deep dive article](active-directory-passwords-how-it-works.md).

8. You can choose to enforce registration at any point, and require users to reconfirm their authentication information after a certain period of time. If you don't want your users to have to register, you can [deploy password reset without requiring end-user registration](active-directory-passwords-data.md).
9. Over time, review users registering and using by viewing the [reporting provided by Azure AD](active-directory-passwords-reporting.md).

## Email-based rollout

Many customers find an email campaign, with simple to use instructions, is the easiest way to get users to use SSPR. [We have created three simple emails that you can use as templates to help in your rollout.](https://onedrive.live.com/?authkey=%21AD5ZP%2D8RyJ2Cc6M&id=A0B59A91C740AB16%2125063&cid=A0B59A91C740AB16)

* **Coming Soon** email template to be used in the weeks or days before rollout to let users know they need to do something.
* **Available Now** email template to be used the day of launch to drive users to register and confirm their authentication data so they can use SSPR when they need it.
* **Sign up Reminder** email template for a few days to weeks after deployment to remind users to register and confirm their authentication data.

## Creating your own password portal

Many of our larger customers choose to host webpage and create a root DNS entry, like https://passwords.contoso.com. They populate this page with links to the Azure AD password reset, password reset registration, password change portals, and other organization-specific information. In any email communications or fliers, you send out, you can then include a branded, memorable, URL that users can go to when they need to use the services.

* Password reset portal - https://passwordreset.microsoftonline.com/
* Password reset registration portal - http://aka.ms/ssprsetup
* Password change portal - https://account.activedirectory.windowsazure.com/ChangePassword.aspx

## Using enforced registration

If you want your users to register for password reset, you can force them to register when they sign in using Azure AD. You can enable this option from your directory’s **Password reset** blade by enabling the **Require Users to Register when Signing in** option on the **Registration** tab.

Administrators can require users to re-register after a period of time by setting the **Number of days before users are asked to reconfirm their authentication information** between 0-730 days.

After you enable this option, users signing will see a message that informs them their administrator has required them to verify their authentication information.

## Populate authentication data

If you [populate authentication data for your users](active-directory-passwords-data.md), then users do not need to register for password reset before being able to use SSPR. As long as users have the authentication data defined that meets the password reset policy you have defined, users are able to reset their passwords.

## Disabling self-service password reset

Disabling self-service password reset is as simple as opening your Azure AD tenant and going to **Password Reset**, **Properties**, and choosing **Nobody** under **Self Service Password Reset Enabled**

## Next steps

The following links provide additional information regarding password reset using Azure AD

* [**Quick Start**](active-directory-passwords-getting-started.md) - Get up and running with Azure AD self service password management 
* [**Licensing**](active-directory-passwords-licensing.md) - Configure your Azure AD Licensing
* [**Data**](active-directory-passwords-data.md) - Understand the data that is required and how it is used for password management
* [**Customize**](active-directory-passwords-customize.md) - Customize the look and feel of the SSPR experience for your company.
* [**Policy**](active-directory-passwords-policy.md) - Understand and set Azure AD password policies
* [**Password Writeback**](active-directory-passwords-writeback.md) - How does password writeback work with your on-premises directory
* [**Reporting**](active-directory-passwords-reporting.md) - Discover if, when, and where your users are accessing SSPR functionality
* [**Technical Deep Dive**](active-directory-passwords-how-it-works.md) - Go behind the curtain to understand how it works
* [**Frequently Asked Questions**](active-directory-passwords-faq.md) - How? Why? What? Where? Who? When? - Answers to questions you always wanted to ask
* [**Troubleshoot**](active-directory-passwords-troubleshoot.md) - Learn how to resolve common issues that we see with SSPR