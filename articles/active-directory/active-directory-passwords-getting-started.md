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
ms.date: 11/16/2017
ms.author: joflore
ms.custom: it-pro

---
# Azure AD self-service password reset rapid deployment

> [!IMPORTANT]
> **Are you here because you're having problems signing in?** If so, see [Help, I forgot my Azure AD password](active-directory-passwords-update-your-own-password.md).

Self-service password reset (SSPR) offers a simple means for IT administrators to empower users to reset or unlock their passwords or accounts. The system includes detailed reporting that tracks when users access the system, along with notifications to alert you to misuse or abuse.

This guide assumes you already have a working trial or licensed Azure Active Directory (Azure AD) tenant. If you need help setting up Azure AD, see [Getting started with Azure AD](get-started-azure-ad.md).

## Enable SSPR for your Azure AD tenant

1. From your existing Azure AD tenant, select **Password reset**.

2. From the **Properties** page, under the option **Self Service Password Reset Enabled**, choose one of the following:
    * **None**: No one can use the SSPR functionality.
    * **Selected**: Only members of a specific Azure AD group that you choose can use the SSPR functionality. We recommend that you define a group of users and use this setting when you deploy this functionality for a proof of concept.
    * **All**: All users with accounts in your Azure AD tenant can use the SSPR functionality. We recommend that you use this setting when you're ready to deploy this functionality to your entire tenant after you have completed a proof of concept.

3. From the **Authentication methods** page, choose the following:
    * **Number of methods required to reset**: We support a minimum of one or a maximum of two.
    * **Methods available to users**: We need at least one, but it never hurts to have an extra choice available.
        * **Email**: Sends an email with a code to the user's configured authentication email address.
        * **Mobile phone**: Gives the user the choice to receive a call or text with a code to their configured mobile phone number.
        * **Office phone**: Calls the user with a code to their configured office phone number.
        * **Security questions**: Requires you to choose:
            * **Number of questions required to register**: The minimum for successful registration. A user can choose to answer more questions to create a pool of questions to pull from. This option can be set to three to five questions and must be greater than or equal to the number of questions required to reset their password. The user can add custom questions if they select the **Custom** button when they select their security questions.
            * **Number of questions required to reset**: Can be set from three to five questions to be answered correctly before you allow a user's password to be reset or unlocked.
            
    ![Authentication][Authentication]

4. Recommended: Under **Customization**, you can change the **Contact your administrator** link to point to a page or email address you define. We recommend that you set this link to something like an email address or website that your users already use for support questions.

5. Optional: The **Registration** page provides administrators with the option to:
    * Require users to register when they sign in.
    * Set the number of days before users are asked to reconfirm their authentication information.

6. Optional: The **Notifications** page provides administrators with the option to:
    * Notify users on password resets.
    * Notify all admins when other admins reset their password.

At this point, you have configured SSPR for your Azure AD tenant. Your users can now use the instructions found in the articles [Register for self-service password reset](active-directory-passwords-reset-register.md) and [Reset or change your password](active-directory-passwords-update-your-own-password.md) to update their password without administrator intervention. You can stop here if you're cloud-only. Or you can continue to the next section to configure the synchronization of passwords to an on-premises Active Directory domain.

> [!IMPORTANT]
> Test SSPR with a user rather than an administrator, because Microsoft enforces strong authentication requirements for Azure administrator accounts. For more information regarding the administrator password policy, see our [password policy](active-directory-passwords-policy.md#administrator-password-policy-differences) article.

## Configure synchronization to an existing identity source

To enable on-premises identity synchronization to Azure AD, you need to install and configure [Azure AD Connect](./connect/active-directory-aadconnect.md) on a server in your organization. This application handles the synchronization of users and groups from your existing identity source to your Azure AD tenant. For more information, see:

* [Upgrade from DirSync or Azure AD Sync to Azure AD Connect](./connect/active-directory-aadconnect-dirsync-deprecated.md)
* [Get started with Azure AD Connect by using express settings](./connect/active-directory-aadconnect-get-started-express.md)
* [Configure password writeback](active-directory-passwords-writeback.md#configuring-password-writeback) to write passwords from Azure AD back to your on-premises directory

### On-premises policy change

If you synchronize users from an on-premises Active Directory domain and want to allow users to reset their passwords immediately, make the following change to your on-premises password policy:

1. Browse to **Computer Configuration** > **Policies** > **Windows Settings** > **Security Settings** > **Account Policies** > **Password Policy**.

2. Set the **Minimum password age** to  **0 days**.

This security setting determines the period of time, in days, that a password must be used before the user can change it. If you set the minimum usage setting to **0 days**, users can use SSPR if their passwords are changed by their support teams.

![Policy][Policy]

## Disable self-service password reset

It's easy to disable self-service password reset. Open your Azure AD tenant and go to **Password Reset** > **Properties**, and then select **None** under **Self Service Password Reset Enabled**.

### Learn more
The following articles provide additional information regarding password reset through Azure AD:

* [How do I complete a successful rollout of SSPR?](active-directory-passwords-best-practices.md)
* [Reset or change your password](active-directory-passwords-update-your-own-password.md)
* [Register for self-service password reset](active-directory-passwords-reset-register.md)
* [Do you have a licensing question?](active-directory-passwords-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](active-directory-passwords-data.md)
* [What authentication methods are available to users?](active-directory-passwords-how-it-works.md#authentication-methods)
* [What are the policy options with SSPR?](active-directory-passwords-policy.md)
* [What is password writeback and why do I care about it?](active-directory-passwords-writeback.md)
* [How do I report on activity in SSPR?](active-directory-passwords-reporting.md)
* [What are all of the options in SSPR and what do they mean?](active-directory-passwords-how-it-works.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)

## Next steps

In this quickstart, you’ve learned how to configure self-service password reset for your users. To complete these steps, continue to the Azure portal:

> [!div class="nextstepaction"]
> [Enable self-service password reset](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/PasswordReset)

[Authentication]: ./media/active-directory-passwords-getting-started/sspr-authentication-methods.png "Azure AD authentication methods available and the quantity required"
[Policy]: ./media/active-directory-passwords-getting-started/password-policy.png "On-premises password Group Policy set to 0 days"

