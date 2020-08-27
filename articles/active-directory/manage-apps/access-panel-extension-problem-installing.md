---
title: Resolve errors encountered when installing the Azure Active Directory My Apps extension
description: Fix common errors encountered when you install the My Apps browser extension.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: troubleshooting
ms.date: 05/04/2018
ms.author: kenwith
ms.reviewer: japere,asteen
---

# Resolve errors encountered when installing the Azure Active Directory My Apps extension

My Apps is a web-based portal. If you have a work or school account in Azure Active Directory (Azure AD), you can use My Apps to view and start cloud-based applications that an Azure AD administrator has granted you access to. 

You can also use self-service group and app management capabilities through My Apps. 

My Apps is separate from the Azure portal. It does not require you to have an Azure subscription.

## Web browser requirements

At minimum, My Apps requires a browser that supports JavaScript and has CSS enabled. To be signed in to applications through password-based SSO in My Apps, you must have the My Apps extension installed in your browser. The extension is downloaded automatically when you select an application that's configured for password-based SSO.

For password-based SSO, you can use any of the following browsers:

- **Microsoft Edge**: on Windows 10 Anniversary Edition or later. 
- **Chrome**: on Windows 7 or later, and on macOS X or later.
- **Firefox 26.0 or later**: on Windows XP SP2 or later, and on macOS X 10.6 or later.

## Install the My Apps browser extension

Download the extension from the [Edge extensions](https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home), [Firefox extensions](https://addons.mozilla.org/firefox/), or [Chrome extensions](https://chrome.google.com/webstore/category/extensions) add-on store. To find it, search for **My Apps Secure Sign-in Extension**.

Alternatively, a user will be prompted to install the extension the first time they select a password-based SSO app in [My Apps](https://myapps.microsoft.com).

> [!TIP]
> Modern browsers are usually smart, but sometimes it helps to restart the browser after you install the extension.

## Use the My Apps Secure Sign-in Extension
* If you are using a My Apps URL other than `https://myapps.microsoft.com`, configure your default URL:
   1. Make sure you are *not* signed in to the extension. Then, right-click the extension icon.
   2. On the menu, select **My Apps URL**.
   3. Select your default URL.
   4. Select the extension icon.
   5. To sign in to the extension, select **Sign in to get started**.

* To sign in directly to an app from the browser:
   1. After you install the extension, sign in to it by selecting **Sign in to get started**.
   2. Sign in to the app with the sign-on URL.  
       The sign-on URL is usually the URL of the app that displays the sign-in form.
       The extension should change state and let you know that a password is available.
   3. To sign in, select the extension icon.

* To start an app from the extension:
   1. After you install the extension, sign in to it by selecting **Sign in to get started**.
   2. Select the extension icon to open its menu.
   3. Search for an app that's available in the My Apps portal.
   4. In the search results list, select the app.  
       The last three apps you've used are displayed in the **Recently Used** shortcut list.
       
* To use internal company URLs while remote:
    1. [Configure Application Proxy](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-enable) on your tenant
    2. [Publish the application](https://docs.microsoft.com/azure/active-directory/application-proxy-publish-azure-portal) and URL through Application Proxy
    3. Install the extension, and sign in to it by selecting Sign in to get started
    4. You can now browse to the internal company URL even while remote

> [!NOTE]
> The preceding options are available only for Microsoft Edge, Chrome, and Firefox.

## If the preceding steps don't resolve the issue

Open a support ticket with the following information, if it's available:

-   Correlation error ID
-   UPN (user email address)
-   TenantID
-   Browser type
-   Time zone and the time or timeframe when the error occurred
-   Fiddler traces

## Next steps
[What is application access and single sign-on with Azure Active Directory?](what-is-single-sign-on.md)
