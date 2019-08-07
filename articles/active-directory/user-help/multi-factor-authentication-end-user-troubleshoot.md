---
title: Troubleshoot common two-factor verification problems - Azure Active Directory | Microsoft Docs
description: Learn about possible solutions to some of the more common two-factor verification problems.
services: active-directory
author: eross-msft
manager: daveba
ms.assetid: 8f3aef42-7f66-4656-a7cd-d25a971cb9eb

ms.workload: identity
ms.service: active-directory
ms.subservice: user-help
ms.topic: conceptual
ms.date: 08/07/2019
ms.author: lizross
ms.reviewer: kexia
ms.collection: M365-identity-device-management
---

# Troubleshoot common two-factor verification problems

Your organization has turned on two-factor verification, meaning that your work or school account sign-in now requires a combination of your user name, your password, and a mobile device or phone. Your organization turned on this extra verification because it's more secure than just a password, relying on two forms of authentication: something you know and something you have with you. Two-factor verification can help to stop malicious hackers from pretending to be you, because even if they have your password, odds are that they don't have your device, too.

>[!Important]
>This content is intended for users. If you're an administrator, you can find more information about how to set up and manage your Azure Active Directory (Azure AD) environment in the [Azure Active Directory Documentation](https://docs.microsoft.com/azure/active-directory).
>
>This content is also only intended for use with your work or school account. If you're having problems with two-factor verification and your personal Microsoft account, see [Turning two-factor verification on or off for your Microsoft account](https://support.microsoft.com/en-us/help/4028586/microsoft-account-turning-two-step-verification-on-or-off).

## Common two-factor verification problems and possible solutions

There are some problems that seem to happen more frequently than any of us would like. We've put together this section in the hopes to address the most common problems and to provide both insight into the issues and some possible fixes.

### I forgot my mobile device at home

It happens. You left your mobile device at home and now you can't use your phone to verify you are who you say you are. If you previously added another method to sign-in to your account, such as your office phone, you should be able to use that method now. If you never added an additional verification method, you'll have to contact your Help desk and have them help you get back into your account.

#### To sign in to your work or school account using another verification method

1. Sign in to your account normally and choose the **Sign in another way** link on the **Two-factor verification** page.

    ![Change sign in verification method](./media/multi-factor-authentication-end-user-troubleshoot/two-factor-auth-signin-another-way.png)

    >[!Note]
    >If you don't see the **Sign in another way** link, it means that you haven't set up any other verification methods. You'll have to contact your administrator for help signing into your account.

2. Choose your alternative verification method, and continue with the two-factor verification process.

### I'm not getting the verification code sent to my mobile device

This is a really common problem and it's typically related to your mobile device and its settings. Some possible things to check:

- Restart your mobile device. Sometimes your device just needs a refresh. Restarting your device ends any background processes or services that are currently running and could cause problems, along with refreshing your device's core components, restarting them in case they crashed at some point.

- Make sure all of your security verification method information is correct, especially your phone number. If you put in the wrong phone number, all of your alerts will go to that incorrect number. Fortunately, that user won't be able to do anything with the alerts, but it also won't help you sign in to your account. To make sure your information is correct, see the instructions in the [Manage your two-factor verification method settings](multi-factor-authentication-end-user-manage-settings.md) article.

- Make sure notifications are turned on and that you've selected a notification method that allows phone calls, your authentication app, and your messaging app (for text messages)to send visible alert notifications to your mobile device.

- Make sure your phone calls and text messages are getting through to your mobile device. Have a friend call you and send you a text message to make sure you receive both. If you don't, first check to make sure your mobile device is turned on. If your device is turned on, but you're still not getting the call or text, it's most likely a problem with your network and you'll need to talk to your provider. If you often have signal-related problems, we recommend you install and use the [Microsoft Authenticator app](user-help-auth-app-download-install.md) on your mobile device. The authenticator app can generate random security codes for sign-in, without requiring any cell signal or Internet connection.

- Make sure you haven't turned on the **Do not disturb** feature for your mobile device. When this feature is turned on, notifications aren't allowed to alert you on your mobile device. Refer to your mobile device's manual for instructions about how to turn off this feature.

- Check your battery-related settings. This one seems a bit odd on the surface, but if you've set up your battery optimization to stop lesser-used apps from remaining active in the background, your notification system has most-likely been affected. To try to fix this problem, turn off battery optimization for your authentication app and your messaging app, and then try signing in to your account again.

### I'm not getting prompted for my second verification information

If you've signed in to your work or school account using your user name and password, but haven't been prompted about your additional security verification information, it might be that you haven't set up your device yet. Your mobile device must specifically be set up to work with your additional security verification method. To make sure you've turned on your mobile device and that its available to use with your verification method, see the [Manage your two-factor verification method settings](multi-factor-authentication-end-user-manage-settings.md) article. If you know you haven't set up your device or your account, you can do it now by following the steps in the [Set up my account for two-step verification](multi-factor-authentication-end-user-first-time.md) article.

### I didn't find an answer to my problem

If you've tried these steps but are still running into problems, contact your Help desk for assistance.



## Old text to put somewhere

- **You lost your phone or got a new phone number.** If you've lost your phone or gotten a new number, you can either sign in using a different method or ask your administrator to clear your settings. We strongly recommend letting your administrator know if your phone was lost or stolen, so the appropriate updates can be made to your account. After your settings are cleared, you'll be prompted to [register for two-factor verification](multi-factor-authentication-end-user-first-time.md) the next time you sign in.

- **Your app passwords aren't working.** App passwords replace your normal password for older desktop applications that don't support two-factor verification. First, make sure you typed the password correctly. If that doesn't fix it, try signing in to [create a new app password](multi-factor-authentication-end-user-app-passwords.md) or contacting your administrator to [delete your existing app passwords](../authentication/howto-mfa-userdevicesettings.md) so you can create a new one.


## Related topics

* [Manage your settings for two-factor verification](multi-factor-authentication-end-user-manage-settings.md)

* [Microsoft Authenticator application FAQ](user-help-auth-app-faq.md)
