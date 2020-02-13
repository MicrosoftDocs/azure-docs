---
title: Get help with the My Apps portal - Azure Active Directory| Microsoft Docs
description: Get help with signing in to and performing common tasks in the My Apps portal.
services: active-directory
author: eross-msft
manager: daveba
ms.service: active-directory
ms.subservice: user-help
ms.workload: identity
ms.topic: conceptual
ms.date: 03/21/2019
ms.author: lizross
ms.reviewer: kasimpso
ms.custom: "user-help, seo-update-azuread-jan"
---

# Troubleshoot problems with the My Apps portal

If you're experiencing issues with signing in to or using the **My Apps** portal, try these troubleshooting tips before you contact helpdesk or your administrator for help.

## I'm having trouble installing the My Apps Secure Sign-in Extension

If you're having problems installing the My Apps Secure Sign-in Extension:

- Make sure you're using a supported browser, including:

    - **Microsoft Edge.** Running on Windows 10 Anniversary Edition or later.

    - **Google Chrome.** Running on Windows 7 or later, and on Mac OS X or later.

    - **Mozilla Firefox 26.0 or later.** Running on Windows XP SP2 or later, and on Mac OS X 10.6 or later.

    - **Internet Explorer 11.** Running on Windows 7 or later (limited support).

- Make sure your browser extension settings are turned on.

- Try restarting your browser and signing in to the **My Apps** portal again.

- Try clearing your browser's cookies, and then restart and sign in to the **My Apps** portal again.

## I can't sign in to the **My Apps** portal

If you're having trouble signing into the **My Apps** portal, you can try the following:

- Make sure you're using the right URL. It should be https://myapps.microsoft.com or a customized page for your organization, such as https://myapps.microsoft.com/contoso.com.

- Make sure your password is correct and hasn't expired. For more info, see [Reset your work or school password](active-directory-passwords-update-your-own-password.md).

- Make sure your verification info is current and accurate. For more information, see [What does Azure Multi-Factor Authentication mean for me?](multi-factor-authentication-end-user.md) or [Changing your security info methods and information](security-info-add-update-methods-overview.md).

- Add the **My App** portal URL to the **Internet Properties > Security > Trusted sites** setting.

- Clear your browser's cache and try to sign in again.

## My password isn't working

If you forgot your password, never received one from your organization, are locked out of your account, or want to change your password, see [Help, I forgot my Azure AD password](active-directory-passwords-update-your-own-password.md).

## I want to be able to reset my own password

To be able to reset your own password, your administrator must first turn on the feature for your organization, and then you must update and verify your required verification methods. For more information about how to update your verification methods, see [Register for self-service password reset](active-directory-passwords-reset-register.md).

## I'm getting an Access Denied message when I start an app

If you're getting an **Access Denied** message after you start an app from the **My App** portal, you can try the following:

- Make sure you've installed the [My Apps Secure Sign-in Extension](my-apps-portal-end-user-access.md#download-and-install-the-my-apps-secure-sign-in-extension) and that you're using a [supported browser](my-apps-portal-end-user-access.md#supported-browsers).

- Make sure you're using the right URL for the app, and that the URL is on your **Internet Properties > Security > Trusted sites** list.

- Make sure your password is correct and hasn't expired. For more info, see [Reset your work or school password](active-directory-passwords-update-your-own-password.md).

- Make sure your verification info is current and accurate. For more information, see [What does Azure Multi-Factor Authentication mean for me?](multi-factor-authentication-end-user.md) or [Changing your security info methods and information](security-info-add-update-methods-overview.md).

- Clear your browser's cache and try to sign in again.

If after trying these things you still can't access your app, you must contact your organization's Help desk for assistance.

## Next steps

After you sign in to the **My Apps** portal, you can also update your profile and account information, your group information, and access review information (if you have permission).

- [Access and use apps on the My Apps portal](my-apps-portal-end-user-access.md).

- [Change your profile information](my-apps-portal-end-user-update-profile.md).

- [View and update your groups-related information](my-apps-portal-end-user-groups.md).

- [Perform your own access reviews](my-apps-portal-end-user-access-reviews.md).
