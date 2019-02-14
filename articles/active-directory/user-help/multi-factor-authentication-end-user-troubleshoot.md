---
title: Troubleshoot two-step verification - Azure Active Directory | Microsoft Docs
description: Provides instructions for users about what to do if they run into an issue with Azure Multi-Factor Authentication and two-step verification.
services: active-directory
author: eross-msft
manager: daveba
ms.assetid: 8f3aef42-7f66-4656-a7cd-d25a971cb9eb

ms.workload: identity
ms.service: active-directory
ms.subservice: user-help
ms.topic: conceptual
ms.date: 07/16/2018
ms.author: lizross
ms.reviewer: kexia
ms.collection: M365-identity-device-management
---

# Get help with two-step verification

Two-step verification is a security feature your organization is using to protect your accounts. Two-step verification is more secure than just a password because it relies on two forms of authentication: something you know, and something you have with you. The something you know is your password, while the something you have with you is your phone or a device. Using two-step verification can help to stop malicious hackers from signing in as you, even if they get your password.

While Microsoft offers two-step verification, it's your organization that decides whether you use the feature. You can't opt out if your organization requires it, just like you can't opt out of using a password to protect your account.

>[!Note]
>If you're looking for more info about using two-step verification with your personal Microsoft account, see the [About two-step verification](https://support.microsoft.com/help/12408/microsoft-account-about-two-step-verification) article.

## Why do I need to use another verification method?

There are several reasons why you might need to use an alternate verification method with your account. For example:

- **You forgot your phone or device.** Some days you leave your phone at home, but still need to sign in at work. First, you should try signing in using a different method that doesn't need your phone.

- **You lost your phone or got a new phone number.** If you've lost your phone or gotten a new number, you can either sign in using a different method or ask your administrator to clear your settings. We strongly recommend letting your administrator know if your phone was lost or stolen, so the appropriate updates can be made to your account. After your settings are cleared, you'll be prompted to [register for two-step verification](multi-factor-authentication-end-user-first-time.md) the next time you sign in.

- **Not getting the authentication text or phone call.** There are several reasons why you might not get the text or phone call. If you've successfully gotten texts or phone calls in the past, this is probably an issue with the phone provider, not your account. If you often have delays due to a bad signal, we recommend you use the [Microsoft Authenticator app](user-help-auth-app-download-install.md) on your mobile device. This app can generate random security codes for sign-in, without requiring any cell signal or Internet connection.<br><br>If you're trying to receive a text message, ask a friend to text you as a test to make sure you can get one, and if you've gotten several messages, make sure you're using the code from the most current one.

- **Your app passwords aren't working.** App passwords replace your normal password for older desktop applications that don't support two-step verification. First, make sure you typed the password correctly. If that doesn't fix it, try signing in to [create a new app password](multi-factor-authentication-end-user-app-passwords.md) or contacting your administrator to [delete your existing app passwords](../authentication/howto-mfa-userdevicesettings.md) so you can create a new one.

## Sign in using another verification method

1. sign in to your account normally and choose the **Sign in another way** link on the **Two-step verification** page.

    ![Change sign in verification method](./media/multi-factor-authentication-end-user-troubleshoot/two-factor-auth-signin-another-way.png)

    >[!Note]
    >If you don't see the **Sign in another way** link, it means that you haven't set up any other verification methods. You'll have to contact your administrator for help signing into your account. After you sign in, make sure you add additional verification methods. For more info about adding verification methods, see the [Manage your settings for two-step verification](multi-factor-authentication-end-user-manage-settings.md) article.<br><br>If you see the link, but still don't see any other verification methods, you'll have to contact your administrator for help signing in to your account.

2. Choose your alternative verification method, and continue with the two-step verification process.

3. After you're back in your account, you can update your verification methods (if necessary). For more info about add or changing your methods, see the [Manage your settings for two-step verification](multi-factor-authentication-end-user-manage-settings.md) article.

## I didn't find an answer to my problem

If you've tried these steps but are still running into problems, contact your administrator for more help.

## Related topics

* [Manage your settings for two-step verification](multi-factor-authentication-end-user-manage-settings.md)

* [Microsoft Authenticator application FAQ](user-help-auth-app-faq.md)
