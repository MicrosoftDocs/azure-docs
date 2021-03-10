---
title: Common problems with account two factor authentication - Azure AD
description: Solutions for some of the more common two-factor verification problems and your work or school account.
services: active-directory
author: curtand
manager: daveba
ms.assetid: 8f3aef42-7f66-4656-a7cd-d25a971cb9eb

ms.workload: identity
ms.service: active-directory
ms.subservice: user-help
ms.topic: end-user-help
ms.date: 09/01/2020
ms.author: curtand
ms.reviewer: kexia
ms.custom: contperf-fy21q1
---

# Common problems with two-factor verification and your work or school account

There are some common two-factor verification problems that seem to happen more frequently than any of us would like. We've put together this article to describe fixes for the most common problems.

Your Azure Active Directory (Azure AD) organization can turn on two-factor verification for your account. When two-factor verification is on, your account sign-in requires a combination of the following data:

- Your user name
- Your password
- A mobile device or phone

Two-factor verification is more secure than just a password, because two-factor verification requires something you _know_ plus something you _have_. No hacker has your physical phone.

>[!Important]
>If you're an administrator, you can find more information about how to set up and manage your Azure AD environment in the [Azure AD documentation](../index.yml).

This content can help you with your work or school account, which is the account provided to you by your organization (for example, dritan@contoso.com). If you're having problems with two-factor verification on a personal Microsoft account, which is an account that you set up for yourself (for example, danielle@outlook.com), see [Turning two-factor verification on or off for your Microsoft account](https://support.microsoft.com/help/4028586/microsoft-account-turning-two-step-verification-on-or-off).

## I don't have my mobile device with me

It happens. You left your mobile device at home, and now you can't use your phone to verify who you are. Maybe you previously added an alternative method to sign in to your account, such as through your office phone. If so, you can use this alternative method now. If you never added an alternative verification method, you can contact your organization's Help desk for assistance.

### To sign in to your work or school account using another verification method

1. Sign in to your account but select the **Sign in another way** link on the **Two-factor verification** page.

    ![Change sign in verification method](./media/multi-factor-authentication-end-user-troubleshoot/two-factor-auth-signin-another-way.png)

    If you don't see the **Sign in another way** link, it means that you haven't set up any other verification methods. You'll have to contact your administrator for help signing into your account.

2. Choose your alternative verification method, and continue with the two-factor verification process.

## I can't turn two-factor verification off

- If you're using two-factor verification with a personal account for a Microsoft service, like alain@outlook.com, you can [turn the feature on and off](https://account.live.com/proofs/Manage).

- If you're using two-factor verification with your work or school account, it most likely means that your organization has decided you must use this added security feature. There is no way for you to individually turn it off.

If you can't turn off two-factor verification, it could also be because of the security defaults that have been applied at the organization level. For more information about security defaults, see [What are security defaults?](../fundamentals/concept-fundamentals-security-defaults.md)

## My device was lost or stolen

If you've lost or had your mobile device stolen, you can take either of the following actions:

- Sign in using a different method.
- Ask your organization's Help desk to clear your settings.

We strongly recommend letting your organization's Help desk know if your phone was lost or stolen. The Help desk can make the appropriate updates to your account. After your settings are cleared, you'll be prompted to [register for two-factor verification](multi-factor-authentication-end-user-first-time.md) the next time you sign in.

## I'm not receiving the verification code sent to my mobile device

Not receiving your verification code is a common problem. The problem is typically related to your mobile device and its settings. Here are some actions you can try.

Try this | Guidance info
--------- | ------------
Use the Microsoft authenticator app or Verification codes | You are getting “You've hit our limit on verification calls” or “You’ve hit our limit on text verification codes” error messages during sign-in. <br/><br/>Microsoft may limit repeated authentication attempts that are perform by the same user in a short period of time. This limitation does not apply to the Microsoft Authenticator or verification code. If you have hit these limits, you can use the Authenticator App, verification code or try to sign in again in a few minutes. <br/><br/> You are getting "Sorry, we're having trouble verifying your account" error message during sign-in. <br/><br/> Microsoft may limit or block voice or SMS authentication attempts that are performed by the same user, phone number, or organization due to high number of failed voice or SMS authentication attempts. If you are experiencing this error, you can try another method, such as Authenticator App or verification code, or reach out to your admin for support.
Restart your mobile device | Sometimes your device just needs a refresh. When you restart your device, all background processes and services are ended. The restart also shuts down the core components of your device. Any service or component is refreshed when you restart your device.
Verify your security information is correct | Make sure your security verification method information is accurate, especially your phone numbers. If you put in the wrong phone number, all of your alerts will go to that incorrect number. Fortunately, that user won't be able to do anything with the alerts, but it also won't help you sign in to your account. To make sure your information is correct, see the instructions in the [Manage your two-factor verification method settings](multi-factor-authentication-end-user-manage-settings.md) article.
Verify your notifications are turned on | Make sure your mobile device has notifications turned on. Ensure the following notification modes are allowed: <br/><br/> &bull; Phone calls <br/> &bull; Your authentication app <br/> &bull; Your text messaging app <br/><br/> Ensure these modes create an alert that is _visible_ on your device.
Make sure you have a device signal and Internet connection | Make sure your phone calls and text messages are getting through to your mobile device. Have a friend call you and send you a text message to make sure you receive both. If you don't receive the call or text, first check to make sure your mobile device is turned on. If your device is turned on, but you're still not receiving the call or text, there's probably a problem with your network. You'll need to talk to your provider. If you often have signal-related problems, we recommend you install and use the [Microsoft Authenticator app](user-help-auth-app-download-install.md) on your mobile device. The authenticator app can generate random security codes for sign-in, without requiring any cell signal or Internet connection.
Turn off Do not disturb | Make sure you haven't turned on the **Do not disturb** feature for your mobile device. When this feature is turned on, notifications aren't allowed to alert you on your mobile device. Refer to your mobile device's manual for instructions about how to turn off this feature.
Unblock phone numbers | In the United States, voice calls from Microsoft come from the following numbers: +1 (866) 539 4191, +1 (855) 330 8653, and +1 (877) 668 6536.
Check your battery-related settings | If you set your battery optimization to stop less frequently used apps from remaining active in the background, your notification system has probably been affected. Try turning off battery optimization for both your authentication app and your messaging app. Then try to sign in to your account again.
Disable third-party security apps | Some phone security apps block text messages and phone calls from annoying unknown callers. A security app might prevent your phone from receiving the verification code. Try disabling any third-party security apps on your phone, and then request that another verification code be sent.

## I'm not being prompted for my second verification information

You sign in to your work or school account by using your user name and password. Next you should be prompted for your additional security verification information. If you are not prompted, maybe you haven't yet set up your device. Your mobile device must be set up to work with your specific additional security verification method.

Maybe you haven't set up your device yet. Your mobile device has to be set up to work with your specific additional security verification method. For the steps to make your mobile device available to use with your verification method, see [Manage your two-factor verification method settings](multi-factor-authentication-end-user-manage-settings.md). If you know that you haven't set up your device or your account yet, you can follow the steps in the [Set up my account for two-step verification](multi-factor-authentication-end-user-first-time.md) article.

## I have a new phone number and I want to add it

If you have a new phone number, you'll need to update your security verification method details. This enables your verification prompts to go to the right location. To update your verification method, follow the steps in the **Add or change your phone number** section of the [Manage your two-factor verification method settings](multi-factor-authentication-end-user-manage-settings.md#add-or-change-your-phone-number) article.

## I have a new mobile device and I want to add it

If you have a new mobile device, you'll need to set it up to work with two-factor verification. This is a multi-step solution:

1. Set up your device to work with your account by following the steps in the [Set up my account for two-step verification](multi-factor-authentication-end-user-first-time.md) article.

1. Update your account and device information in the **Additional security verification** page. Perform the update by deleting your old device and adding your new one. For more information, see the [Manage your two-factor verification method settings](multi-factor-authentication-end-user-manage-settings.md) article.

Optional steps:

- Install the Microsoft Authenticator app on your mobile device by following the steps in the [Download and install the Microsoft Authenticator app](user-help-auth-app-download-install.md) article.

- Turn on two-factor verification for your trusted devices by following the steps in the **Turn on two-factor verification prompts on a trusted device** section of the [Manage your two-factor verification method settings](multi-factor-authentication-end-user-manage-settings.md#turn-on-two-factor-verification-prompts-on-a-trusted-device) article.

## I'm having problems signing in on my mobile device while traveling

You might find it more difficult to use a mobile device-related verification method, like a text messaging, while you're in an international location. It's also possible that your mobile device can cause you to incur roaming charges. For this situation, we recommend you use the Microsoft Authenticator app, with the option to connect to a Wi-Fi hot spot. For more information about how to set up the Microsoft Authenticator app on your mobile device, see the [Download and install the Microsoft Authenticator app](user-help-auth-app-download-install.md) article.

## I can't get my app passwords to work

App passwords replace your normal password for older desktop applications that don't support two-factor verification. First, make sure you typed the password correctly. If that doesn't fix it, try creating a new app password for the app. Do this by following the steps in the **Create and delete app passwords using the My Apps portal** section of the [Manage app passwords for two-step verification](multi-factor-authentication-end-user-app-passwords.md#create-and-delete-app-passwords-from-the-additional-security-verification-page) article.

## I can't turn off two-factor verification

If you're using two-factor verification with your work or school account (for example, alain@contoso.com), it most likely means that your organization has decided you must use this added security feature. Because your organization has decided you must use this feature, there is no way for you to individually turn it off. If, however, you're using two-factor verification with a personal account, like alain@outlook.com, you have the ability to turn the feature on and off. For instructions about how to control two-factor verification for your personal accounts, see [Turning two-factor verification on or off for your Microsoft account](https://support.microsoft.com/help/4028586/microsoft-account-turning-two-step-verification-on-or-off).

If you can't turn off two-factor verification, it could also be because of the security defaults that have been applied at the organization level. For more information about security defaults, see [What are security defaults?](../fundamentals/concept-fundamentals-security-defaults.md)

## I didn't find an answer to my problem

If you've tried these steps but are still running into problems, contact your organization's Help desk for assistance.

## Related articles

- [Manage your two-factor verification method settings](multi-factor-authentication-end-user-manage-settings.md)

- [Set up my account for two-step verification](multi-factor-authentication-end-user-first-time.md)

- [Microsoft Authenticator app FAQ](user-help-auth-app-faq.md)
