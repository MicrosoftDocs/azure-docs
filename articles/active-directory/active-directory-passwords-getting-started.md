---
title: 'Quickstart: Azure AD SSPR | Microsoft Docs'
description: Rapidly deploy Azure AD self-service password reset
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
ms.reviewer: sahenry

ms.assetid: bde8799f-0b42-446a-ad95-7ebb374c3bec
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/24/2017
ms.author: joflore
ms.custom: it-pro

---
# Azure AD self-service password reset rapid deployment

> [!IMPORTANT]
> **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).

Self-service password reset (SSPR) offers a simple means for IT administrators to empower users to reset or unlock their passwords or accounts. The system includes detailed reporting to track when users use the system along with notifications to alert you to misuse or abuse.

This guide assumes you already have a working trial or licensed Azure AD tenant. If you need help setting up Azure AD, see the article [Getting Started with Azure AD](https://azure.microsoft.com/trial/get-started-active-directory/).

## Enable SSPR for your Azure AD tenant

1. From your existing Azure AD tenant, select **"Password reset"**

2. From the **"Properties"** screen, under the option "Self Service Password Reset Enabled" choose one of the following:
    * None - No one is able to use SSPR functionality.
    * Selected - Only members of a specific Azure AD group that you choose are able to use SSPR functionality. We recommend to define a group of users and use this setting when deploying this for a proof of concept.
    * All - All users with accounts in your Azure AD tenant are able to use SSPR functionality. We recommend that this be set when you are ready to deploy this functionality to your entire tenant after you have completed a proof of concept.

3. From the **"Authentication methods"** screen choose
    * Number of methods required to reset - We support a minimum of one or a maximum of two
    * Methods available to users - We need at least one but it never hurts to have an extra choice available
        * **Email** sends an email with a code to the user's configured authentication email address
        * **Mobile Phone** gives the user the choice to receive a call or text with a code to their configured mobile phone number
        * **Office Phone** calls the user with a code to their configured office phone number
        * **Security Questions** requires you to choose
            * Number of questions required to register - The minimum for successful registration, meaning a user can choose to answer more to create a pool of questions to pull from. This option can be set from 3-5 and must be greater than or equal to the number of questions required to reset.
                * Custom questions can be added by clicking the "Custom" button when selecting security questions
            * Number of questions required to reset - Can be set from 3-5 questions to be answered correctly before allowing a users password to be reset or unlocked.
            
    ![Authentication][Authentication]

4. RECCOMMENDED: **"Customization"** allows you to change the "Contact your administrator" link to point to a page or email address you define. We recommend that you set this link to something like an email address or website that your users are used to using for support.

5. OPTIONAL: The **"Registration"** screen provides administrators the options for:
    * Require users to register when signing in
    * Number of days before users are asked to reconfirm their authentication information

6. OPTIONAL: The **"Notification"** screen provides administrators the options to:
    * Notify users on password resets
    * Notify all admins when other admins reset their password

**At this point, you have configured SSPR for your Azure AD tenant**. Your users can now use the instructions found in the articles [Register for self-service password reset](active-directory-passwords-reset-register.md) and [Reset or change your password](active-directory-passwords-update-your-own-password.md) to update their password without administrator intervention. You can stop here if you are cloud-only or continue on to configure synchronization of passwords to an on-premises AD domain.

> [!IMPORTANT]
> Test SSPR with a user and not an administrator as Microsoft enforces strong authentication requirements for Azure administrator type accounts. For more information regarding the administrator password policy, see our [password policy article](active-directory-passwords-policy.md#administrator-password-policy-differences).

## Configure synchronization to existing identity source

To enable on-premises identity synchronization to Azure AD, you need to install and configure [Azure AD Connect](./connect/active-directory-aadconnect.md) on a server in your organization. This application handles synchronizing users and groups from your existing identity source to your Azure AD tenant.

* [Upgrade from DirSync or Azure AD Sync to Azure AD Connect](./connect/active-directory-aadconnect-dirsync-deprecated.md)
* [Getting started with Azure AD Connect using express settings](./connect/active-directory-aadconnect-get-started-express.md)
* [Configure password writeback](active-directory-passwords-writeback.md#configuring-password-writeback) to write passwords from Azure AD back to your on-premises directory.

### On-premises policy change

If you are synchronizing users from an on-premises Active Directory domain and wish to allow users to reset their passwords immediately, make the following change to your on-premises password policy:

**Computer Configuration** > **Policies** > **Windows Settings** > **Security Settings** > **Account Policies** > **Password Policy**

**Minimum password age** - 0 days

This security setting determines the period of time (in days) that a password must be used before the user can change it. Setting it to **0 days** allows users to use SSPR if their passwords are changed by their support teams.

![Policy][Policy]

## Disabling self-service password reset

Disabling self-service password reset is as simple as opening your Azure AD tenant and going to **Password Reset > Properties** > choose **None** under **Self Service Password Reset Enabled**

### Learn more
The following links provide additional information regarding password reset using Azure AD

* [How do I complete a successful rollout of SSPR?](active-directory-passwords-best-practices.md)
* [Reset or change your password](active-directory-passwords-update-your-own-password.md).
* [Register for self-service password reset](active-directory-passwords-reset-register.md).
* [Do you have a Licensing question?](active-directory-passwords-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](active-directory-passwords-data.md)
* [What authentication methods are available to users?](active-directory-passwords-how-it-works.md#authentication-methods)
* [What are the policy options with SSPR?](active-directory-passwords-policy.md)
* [What is password writeback and why do I care about it?](active-directory-passwords-writeback.md)
* [How do I report on activity in SSPR?](active-directory-passwords-reporting.md)
* [What are all of the options in SSPR and what do they mean?](active-directory-passwords-how-it-works.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)

## Next steps

In this quickstart, you’ve learned how to configure self-service password reset for your users. To continue to the Azure portal to complete these steps follow the link below to the portal.

> [!div class="nextstepaction"]
> [Enable self-service password reset](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/PasswordReset)

[Authentication]: ./media/active-directory-passwords-getting-started/sspr-authentication-methods.png "Azure AD authentication methods available and quantity required"
[Policy]: ./media/active-directory-passwords-getting-started/password-policy.png "On-premises password group policy set to 0 days"
