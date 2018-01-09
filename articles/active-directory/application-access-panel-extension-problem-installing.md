---
title: Problem installing the application access panel browser extension | Microsoft Docs
description: How to fix common errors encountered when installing the access panel browser extension
services: active-directory
documentationcenter: ''
author: ajamess
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/15/2018
ms.author: asteen
ms.reviewer: japere
---

# Problem installing the application access panel browser extension

The Access Panel is a web-based portal which enables a user who has a work or school account in Azure Active Directory (Azure AD) to view and launch cloud-based applications that the Azure AD administrator has granted them access to. A user who has Azure AD editions can also use self-service group and app management capabilities through the Access Panel. The Access Panel is separate from the Azure portal and does not require users to have an Azure subscription.

To use password-based single sign-on (SSO) in the Access Panel, the Access Panel extension must be installed in the user’s browser. This extension is downloaded automatically when a user selects an application that is configured for password-based SSO.

## Meeting browser requirements for the Access Panel

The Access Panel requires a browser that supports JavaScript and has CSS enabled. To use password-based single sign-on (SSO) in the Access Panel, the Access Panel extension must be installed in the user’s browser. This extension is downloaded automatically when a user selects an application that is configured for password-based SSO.

For password-based SSO, the end user’s browsers can be:

-   Edge on Windows 10 Anniversary Edition or later 

-   Chrome -- on Windows 7 or later, and on MacOS X or later

-   Firefox 26.0 or later -- on Windows XP SP2 or later, and on Mac OS X 10.6 or later

-   Internet Explorer 8, 9, 10, 11 -- on Windows 7 or later (limited support)
## How to install the Access Panel Browser extension

To install the Access Panel Browser extension, follow the steps below:

1.  Open the [Access Panel](https://myapps.microsoft.com) in one of the supported browsers and sign in as a **user** in your Azure AD.

2.  Click a **password-SSO application** in the Access Panel.

3.  In the prompt asking to install the software, select **Install Now**.

4.  Based on your browser you be directed to the download link. **Add** the extension to your browser.

5.  If your browser asks, select to either **Enable** or **Allow** the extension.

6.  Once installed, **restart** your browser session.

7.  Sign in into the Access Panel and see if you can **launch** your password-SSO applications

You may also download the extension for Chrome and Edge from the direct links below:

-   [Chrome Access Panel Extension](https://chrome.google.com/webstore/detail/access-panel-extension/ggjhpefgjjfobnfoldnjipclpcfbgbhl)

-   [Edge Access Panel Extension](https://www.microsoft.com/store/apps/9pc9sckkzk84) 

## How do I use the My Apps Secure Sign-in Extension?
Changing the My Apps default URL for the extension

If you are using a different My Apps URL than https://myapps.microsoft.com then you must configure your default URL though the following steps:
1. While not signed into the extension, **right click** the extension icon.
2. Click on **Select My Apps URL** from the menu.
3. **Select** your default URL.
4. Click on the extension icon.
5. Sign-in to the extension by selecting **Sign in to get started**.

Sign in directly into an app from the browser
1. After installing the extension, sign-in to the extension by selecting **Sign in to get started**.
2. Navigate to the **sign-on URL** of the app you would like to sign in to, this is typically the URL of the app that displays the login form.
3. The extension should change state and let you know a password is available, click on the **extension icon** to sign in.

Launch an app from the extension
1. After installing the extension, sign-in to the extension by selecting **Sign in to get started**.
2. Click on the extension icon to open its **menu**.
3. **Search** for an app available in the My Apps portal.
4. Click on the app from the **search results** to launch it.
5. The last three apps launched will also show up in the **Recently Used** shortcut list

> [!NOTE]
> These options are only available for Edge, Chrome, Firefox.

## Setting up a group policy for Internet Explorer

You can setup a group policy that allow you to remotely install the Access Panel extension for Internet Explorer on your users' machines.

The prerequisites include:

-   You have set up [Active Directory Domain Services](https://msdn.microsoft.com/library/aa362244%28v=vs.85%29.aspx), and you have joined your users' machines to your domain.

-   You must have the "Edit settings" permission to edit the Group Policy Object (GPO). By default, members of the following security groups have this permission: Domain Administrators, Enterprise Administrators, and Group Policy Creator Owners. [Learn more](https://technet.microsoft.com/library/cc781991%28v=ws.10%29.aspx).

Follow the tutorial [How to Deploy the Access Panel Extension for Internet Explorer using Group Policy](active-directory-saas-ie-group-policy.md) for step by step instructions on how to configure the group policy and deploy it to users.

## Troubleshoot the Access Panel Extension in Internet Explorer

Follow the [Troubleshoot the Access Panel Extension for Internet Explorer](active-directory-saas-ie-troubleshooting.md) guide for access a diagnostics tool and step by step instructions on configuring the extension for IE.

> [!NOTE]
> IE is on limited support and no longer receives new software updates. Edge is the recommended browser.

## If these troubleshooting steps do not resolve the issue

open a support ticket with the following information if available:

-   Correlation error ID

-   UPN (user email address)

-   TenantID

-   Browser type

-   Time zone and time/timeframe during error occurs

-   Fiddler traces

## Next steps
[What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)
