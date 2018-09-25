---
title: Install the application access panel browser extension - Azure | Microsoft Docs
description: Fix common errors encountered when you install the access panel browser extension.
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 5/4/18
ms.author: barbkess
ms.reviewer: japere,asteen
---

# Install the access panel browser extension

The access panel is a web-based portal. If you have a work or school account in Azure Active Directory (Azure AD), you can use the access panel to view and start cloud-based applications that an Azure AD administrator has granted you access to. 

If you're using Azure AD editions, you can also use self-service group and app management capabilities through the access panel. 

The access panel is separate from the Azure portal. It does not require you to have an Azure subscription.

## Web browser requirements

At minimum, the access panel requires a browser that supports JavaScript and has CSS enabled. To be signed in to applications through password-based SSO in the access panel, you must have the access panel extension installed in your browser. The extension is downloaded automatically when you select an application that's configured for password-based SSO.

For password-based SSO, you can use any of the following browsers:

- **Edge**: on Windows 10 Anniversary Edition or later. 
- **Chrome**: on Windows 7 or later, and on MacOS X or later.
- **Firefox 26.0 or later**: on Windows XP SP2 or later, and on Mac OS X 10.6 or later.

## Install the access panel browser extension

To install the access panel browser extension, do the following:

1.  In one of the supported browsers, open the [access panel](https://myapps.microsoft.com), and then sign in as a user in your Azure AD account.

2.  Select a password-based SSO application.

3.  When you are prompted, select **Install Now**.  
    You are directed to the download link for your selected browser. 
    
4.  Select **Add**.

5.  If you are prompted, either **Enable** or **Allow** the extension.

6.  After installation is complete, restart your browser.

7.  Sign in to the access panel, and check to see whether you can start your password-based SSO applications.

You can also download the extension for Chrome and Edge directly from following sites:

- [Chrome extension](https://chrome.google.com/webstore/detail/access-panel-extension/ggjhpefgjjfobnfoldnjipclpcfbgbhl)
- [Edge extension](https://www.microsoft.com/store/apps/9pc9sckkzk84) 

## Use the My Apps Secure Sign-in Extension
* If you are using a My Apps URL other than `https://myapps.microsoft.com`, configure your default URL by doing the following:
   1. While you are *not* signed in to the extension, right-click the extension icon.
   2. On the menu, select **My Apps URL**.
   3. Select your default URL.
   4. Select the extension icon.
   5. To sign in to the extension, select **Sign in to get started**.

* To sign in directly to an app from the browser, do the following:
   1. After you install the extension, sign in to it by selecting **Sign in to get started**.
   2. Sign in to the app with the sign-on URL.  
       The sign-on URL is usually the URL of the app that displays the sign-in form.
       The extension should change state and let you know that a password is available.
   3. To sign in, select the extension icon.

* To start an app from the extension, do the following:
   1. After you install the extension, sign in to it by selecting **Sign in to get started**.
   2. Select the extension icon to open its menu.
   3. Search for an app that's available in the My Apps portal.
   4. In the search results list, select the app.  
       The last three apps you've used are displayed in the **Recently Used** shortcut list.
       
* To use internal company URLs while remote, do the following:
    1. [Configure Application Proxy](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-enable) on your tenant
    2. [Publish the application](https://docs.microsoft.com/azure/active-directory/application-proxy-publish-azure-portal) and URL through Application Proxy
    3. Install the extension, and sign in to it by selecting Sign in to get started
    4. You can now browse to the internal company URL even while remote

> [!NOTE]
> The preceding options are available only for Edge, Chrome, and Firefox.

## Set up a group policy for Internet Explorer

You can set up a group policy that allows you to remotely install the access panel extension for Internet Explorer on your users' machines.

Before you set up a group policy, ensure that:

-   You have set up [Active Directory Domain Services](https://msdn.microsoft.com/library/aa362244%28v=vs.85%29.aspx), and you have joined your users' machines to your domain.

-   To edit the Group Policy Object (GPO), you must have *Edit settings* permissions. By default, this permission is granted to members of the following security groups: domain administrators, enterprise administrators, and group policy creator owners.

For step by step instructions about configuring the group policy and deploying it to users, see [Deploy the access panel extension for Internet Explorer by using group policy](deploy-access-panel-browser-extension.md).

## Troubleshoot the access panel extension in Internet Explorer

For access to a diagnostics tool and information about configuring the extension for Internet Explorer, see [Troubleshoot the access panel extension for Internet Explorer](manage-access-panel-browser-extension.md).

> [!NOTE]
> Internet Explorer is on limited support and no longer receives new software updates. Edge is the recommended browser.

## If the preceding steps do not resolve the issue

Open a support ticket with the following information, if it is available:

-   Correlation error ID
-   UPN (user email address)
-   TenantID
-   Browser type
-   Time zone and the time or timeframe when the error occurred
-   Fiddler traces

## Next steps
[What is application access and single sign-on with Azure Active Directory?](what-is-single-sign-on.md)
