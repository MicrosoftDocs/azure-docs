---
title: Get help with accessing and using the MyApps portal in Azure Active Directory | Microsoft Docs
description: Get help with signing in to and performing common tasks in the access panel.
services: active-directory
author: eross-msft
manager: mtillman
ms.assetid: c67cd675-b567-41e1-8bc2-e06fe0b38d3b

ms.service: active-directory
ms.component: user-help
ms.workload: identity
ms.topic: conceptual
ms.date: 01/15/2018
ms.author: lizross
ms.reviewer: japere
---

# Troubleshoot issues with accessing and using the MyApps portal

If you're experiencing issues with signing in to or using the MyApps portal, try these troubleshooting tips before you contact helpdesk or your administrator for help.

## I am having trouble signing into the MyApps portal

Try these general tips:

- First, check to see whether you are using the correct URL, [https://myapps.microsoft.com](https://myapps.microsoft.com).
- Try adding the URL to your browser’s trusted sites.
- Make sure that your password is correct and has not expired. For more information, see [Reset your work or school password](active-directory-passwords-update-your-own-password.md).
- Check to ensure that your authentication contact information is up to date and not blocking your access. For more information, see [What does Azure Multi-Factor Authentication mean for me?](https://docs.microsoft.com/azure/multi-factor-authentication/end-user/multi-factor-authentication-end-user).
- Try clearing your browser’s cookies, and then try to sign in again.

If you are still encountering issues while trying to sign in, contact your administrator.

## I seem to be having password issues

If you forgot your password, never received one from your IT staff, are locked out of your account, or want to change your password, see [Help, I forgot my Azure AD password](active-directory-passwords-update-your-own-password.md).

## I need to register for password reset

You can reset your password or unlock your account without having to speak to someone by using self-service password reset (SSPR). Before you can use this functionality, you must register your authentication methods or confirm the predefined authentication methods that your administrator requires. For more information, see [Register for self-service password reset](active-directory-passwords-reset-register.md).

## I am having trouble installing the My Apps Secure Sign-in Extension

The MyApps portal requires a browser that supports JavaScript and has CSS enabled. If you are using password-based single sign-on apps, the accompanying extension must be installed as well. This extension is downloaded automatically when you start an application that is configured for password-based single sign-on apps.

Check to ensure that you are meeting the following browser requirements:

- **Edge**: on Windows 10 Anniversary Edition or later.
- **Chrome**: on Windows 7 or later, and on Mac OS X or later.
- **Firefox 26.0 or later**: on Windows XP SP2 or later, and on Mac OS X 10.6 or later.
- **Internet Explorer 11**: on Windows 7 or later (limited support).

You can also download the extension directly from the following sites:

- [Chrome](https://go.microsoft.com/fwlink/?linkid=866367)
- [Edge](https://go.microsoft.com/fwlink/?linkid=845176)
- [Firefox](https://go.microsoft.com/fwlink/?linkid=866366)

If you have installed the extension and are still experiencing issues, try the following:

- Check your browser extension settings to ensure that the extension is enabled.
- Restart your browser, and sign in to the MyApps portal.
- Clear your browser’s cookies, and sign in to the MyApps portal.
- For access to a diagnostics tool and step-by-step instructions on configuring the extension for Internet Explorer, see [Troubleshoot the Access Panel Extension for Internet Explorer](https://docs.microsoft.com/azure/active-directory/active-directory-saas-ie-troubleshooting).

## Use the My Apps Secure Sign-in Extension
* If you are using a My Apps URL other than `https://myapps.microsoft.com`, configure your default URL by doing the following:
   1. While you are *not* signed in to the extension, right-click the extension icon.
   2. On the menu, select **My Apps URL**.
   3. Select your default URL.
   4. Select the extension icon.
   5. To sign in to the extension, select **Sign in to get started**.

* To sign in directly into an app from the browser, do the following:
   1. After you install the extension, sign in to it by selecting **Sign in to get started**.
   2. Sign in to the app with the sign-on URL.  
       The sign-on URL is usually the URL of the app that displays the sign-in form.
       The extension should change state and let you know that a password is available.
   3. To sign in, select the extension icon.

* To launch an app from the extension, do the following:
   1. After you install the extension, sign in to it by selecting **Sign in to get started**.
   2. Select the extension icon to open its menu.
   3. Search for an app that's available in the MyApps portal.
   4. In the search results list, select the app.  
       The last three apps you've used are displayed in the **Recently Used** shortcut list.

> [!NOTE]
> These options are available only for Edge, Chrome, and Firefox.

## How do I add a new app?

1.	On the **Apps** page, select **Add App**.
2.	Search for the app that you want to add, and then select **Add**.

   > [!NOTE]
   > * You can access this option only if your administrator has enabled it for your account.
   > * If the app requires permission, you might need to wait for administrator approval.

## How do I manage my group memberships?

Select the **Groups** tile, and then do either of the following:
* To create a group, under **Groups I own**, select **Create group**, and then follow the instructions.
* To join a group, under **Groups I'm in**, select **Join group**, and then follow the instructions.

   > [!NOTE]
   > * You can access this option only if your administrator has enabled it for your account.
   > * If you are a member of a group, you can view details and leave the group.
   > * If you are an owner of a group, you can view details, add or remove members, and leave the group.