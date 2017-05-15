---
title: Azure MFA Sign-in experience with two-step verification | Microsoft Docs
description: This page will provide you guidance on where to go to see the various sign-in methods available with Azure MFA.
keywords: user authentication, sign-in experience, sign-in with mobile phone, sign-in with office phone
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: pblachar

ms.assetid: b310b762-471b-4b26-887a-a321c9e81d46
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/02/2017
ms.author: kgremban
ms.custom: end-user
---
# The sign-in experience with Azure Multi-Factor Authentication
> [!NOTE]
> The purpose of this article is to walk through a typical sign-in experience. For help with signing in, or to troubleshoot problems, see [Having trouble with Azure Multi-Factor Authentication](multi-factor-authentication-end-user-troubleshoot.md).

## What will your sign-in experience be?
Your sign-in experience differs depending on what you choose to use as your second factor: a phone call, an authentication app, or texts. Choose the option that best describes what you are doing:

| How do you sign in? | 
| --- |
| [With a phone call to my mobile or office phone](#signing-in-with-a-phone-call) |
| [With a text to my mobile phone](#signing-in-with-a-text-message)
| [With notifications from the Microsoft Authenticator app](#signing-in-with-the-microsoft-authenticator-app-using-notification) |
| [With verification codes from the Microsoft Authenticator app](#signing-in-with-the-microsoft-authenticator-app-using-verification-code) |
| [With an alternate method, because I can't use my preferred method right now](#signing-in-with-an-alternate-method) |

## Signing in with a phone call
The following information describes the two-step verification experience with a call to your mobile or office phone.

1. Sign in to an application or service such as Office 365 using your username and password.  
2. Microsoft calls you.  
3. Answer the phone and hit the # key.  
4. You should now be signed in.  

## Signing in with a text message
The following information describes the two-step verification experience with a text message to your mobile phone:

1. SIgn in to an application or service such as Office 365 using your username and password. 
2. Microsoft sends you a text message which contains a number code. 
3. Enter the code in the box provided on the sign-in page. 
4. You should now be signed in. 

## Signing in with the Microsoft Authenticator app 
The following information describes the experience of using the Microsoft Authenticator app for two-step verifications. There are two different ways to use the app. You can either receive push notifications on your device, or you can open the app to get a verification code.

### To sign in with a notification from the Microsoft Authenticator app
1. Sign in to an application or service such as Office 365 using your username and password.
2. Microsoft sends a notification to the Microsoft Authenticator app on your device.

  ![Microsoft sends notification](./media/multi-factor-authentication-end-user-signin/notify.png)

3. Open the notification on your phone and select the **Verify** key. If your company requires a PIN, enter it here.
4. You should now be signed in.

### To sign in using a verification code with the Microsoft Authenticator app

If you use the Microsoft Authenticator app to get verification codes, then when you open the app yousee a number under your account name. This number changes every 30 seconds so that you don't use the same number twice. When you're asked for a verification code, open the app and use whatever number is currently displayed. 

1. Sign in to an application or service such as Office 365 using your username and password.
2. Microsoft prompts you for a verification code.

  ![Enter verification code](./media/multi-factor-authentication-end-user-signin/verify3.png)

3. Open the Microsoft Authenticator app on your phone and enter the code in the box where you are signing in.
4. You should now be signed in.

## Signing in with an alternate method
Sometimes you don't have the phone or device that you set up as your preferred verification method. This situation is why we recommend that you set up backup methods for your account. The following section shows you how to sign in with an alternate method when your primary method may not be available.

1. Sign in to an application or service such as Office 365 using your username and password.
2. Select **Use a different verification option**. You will see different verification options based on how many you have setup.

  ![Use alternate method](./media/multi-factor-authentication-end-user-signin/alt.png)

3. Choose an alternate method and sign in.

## Next steps

If you have problems signing in with two-step verification, get more information at [Having trouble with Azure Multi-Factor Authentication](multi-factor-authentication-end-user-troubleshoot.md).

Learn how to [Manage your two-step verification settings](multi-factor-authentication-end-user-manage-settings.md).

Find out how to [Get started with the Microsoft Authenticator app](microsoft-authenticator-app-how-to.md) so that you can use notifications to sign in, instead of texts and phone calls. 