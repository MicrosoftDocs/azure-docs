---
title: Problem configuring password single sign-on for an Azure AD Gallery application | Microsoft Docs
description: Understand the common problems people face when configuring Password Single Sign-on for applications that are already listed in the Azure AD Application Gallery
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
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: barbkess

---

# Problem configuring password single sign-on for an Azure AD Gallery application

This article helps you understand the common problems people face when configuring **Password Single Sign-on** with an Azure AD Gallery application.

## Credentials are filled in, but the extension does not submit them

This problem typically happens if the application vendor has changed their sign-in page recently to add a field, changed an identifier used for detecting the username and password fields, or modified how the sign-in experience works for their application. Fortunately, in many instances, Microsoft can work with application vendors to rapidly resolve these issues.

While Microsoft has technologies to automatically detect when integrations break, it might not be possible to find the issues right away, or the issues take some time to fix. In the case when one of these integrations does not work correctly, open a support case so it can be fixed as quickly as possible.

**If you are in contact with this application’s vendor,** send them our way so Microsoft can work with them to natively integrate their application with Azure Active Directory. You can send the vendor to the [Listing your application in the Azure Active Directory application gallery](../develop/howto-app-gallery-listing.md) to get them started.

## Credentials are filled in and submitted, but the page indicates the credentials are incorrect

To resolve this issue, first try these things:

-   Have the user first try to **sign in to the application website directly** with the credentials stored for them.

  * If sign-in works, then have the user click the **Update credentials** button on the **Application Tile** in the **Apps** section of the [Application Access Panel](https://myapps.microsoft.com/) to update them to the latest known working username and password.

   * If you, or another administrator assigned the credentials for this user, find the user or group’s application assignment by navigating to the **Users & Groups** tab of the application, selecting the assignment and clicking the **Update Credentials** button.

-   If the user assigned their own credentials, have the user **check to be sure that their password has not expired in the application** and if so, **update their expired password** by signing in to the application directly.

   * After the password has been updated in the application, request the user to click the **Update credentials** button on the **Application Tile** in the **Apps** section of the [Application Access Panel](https://myapps.microsoft.com/) to update them to the latest known working username and password.

   * If you, or another administrator assigned the credentials for this user, find the user or group’s application assignment by navigating to the **Users & Groups** tab of the application, selecting the assignment and clicking the **Update Credentials** button.

-   Have the user update the access panel browser extension by following the steps below in the [How to install the Access Panel Browser extension](#how-to-install-the-access-panel-browser-extension) section.

-   Ensure that the access panel browser extension is running and enabled in your user’s browser.

-   Ensure that your users are not trying to sign in to the application from the access panel while in **incognito, inPrivate, or Private mode**. The access panel extension is not supported in these modes.

In case the previous suggestions do not work, it could be the case that a change has occurred on the application side that has temporarily broken the application’s integration with Azure AD. For example, this can occur when the application vendor introduces a script on their page which behaves differently for manual vs automated input, which causes automated integration, like our own, to break. Fortunately, in many instances, Microsoft can work with application vendors to rapidly resolve these issues.

While Microsoft has technologies to automatically detect when application integrations break, it might not be possible to find the issues right away, or the issues might take some time to fix. When an integration does not work correctly, you can open a support case to get it fixed as quickly as possible. 

In addition to this, **if you are in contact with this application’s vendor,** **send them our way** so we can work with them to natively integrate their application with Azure Active Directory. You can send the vendor to the [Listing your application in the Azure Active Directory application gallery](../develop/howto-app-gallery-listing.md) to get them started.

## The extension works in Chrome and Firefox, but not in Internet Explorer

There are two main causes to this issue:

-   Depending on the security settings enabled in Internet Explorer, if the website is not part of a **Trusted Zone**, sometimes our script be blocked from executing for the application.

  *  To resolve this, instruct the user to **Add the application’s website** to the **Trusted Sites** list within their **Internet Explorer security settings**. You can send your users to the [How to add a site to my trusted sites list](https://answers.microsoft.com/en-us/ie/forum/ie9-windows_7/how-do-i-add-a-site-to-my-trusted-sites-list/98cc77c8-b364-e011-8dfc-68b599b31bf5) article for detailed instructions.

-   In rare circumstances, Internet Explorer’s security validation can sometimes cause the page to load more slowly than the execution of our script.

   * Unfortunately, this situation can vary depending on the browser version, computer speed, or site visited. In this case, we suggest that you contact support so we can fix the integration for this specific application.

In addition to this, **if you are in contact with this application’s vendor,** **send them our way** so we can work with them to natively integrate their application with Azure Active Directory. You can send the vendor to the [Listing your application in the Azure Active Directory application gallery](../develop/howto-app-gallery-listing.md) to get them started.

## Check if the application’s login page has changed recently or requires an additional field

If the application’s login page has changed drastically, sometimes this causes our integrations to break. An example of this is when an application vendor adds a sign-in field, a captcha, or multi-factor authentication to their experiences. Fortunately, in many instances, Microsoft can work with application vendors to rapidly resolve these issues.

While Microsoft has technologies to automatically detect when application integrations break, it might not be possible to find the issues right away, or the issues might take some time to fix. When an integration does not work correctly, you can open a support case to get it fixed as quickly as possible. 

In addition to this, **if you are in contact with this application’s vendor,** **send them our way** so we can work with them to natively integrate their application with Azure Active Directory. You can send the vendor to the [Listing your application in the Azure Active Directory application gallery](../develop/howto-app-gallery-listing.md) to get them started.

## How to install the Access Panel Browser extension

To install the Access Panel Browser extension, follow the steps below:

1.  Open the [Access Panel](https://myapps.microsoft.com) in one of the supported browsers and sign in as a **user** in your Azure AD.

2.  click a **password-SSO application** in the Access Panel.

3.  In the prompt asking to install the software, select **Install Now**.

4.  Based on your browser, you are directed to the download link. **Add** the extension to your browser.

5.  If your browser asks, select to either **Enable** or **Allow** the extension.

6.  Once installed, **restart** your browser session.

7.  Sign in into the Access Panel and see if you can **launch** your password-SSO applications

You may also download the extension for Chrome and Firefox from the direct links below:

-   [Chrome Access Panel Extension](https://chrome.google.com/webstore/detail/access-panel-extension/ggjhpefgjjfobnfoldnjipclpcfbgbhl)

-   [Firefox Access Panel Extension](https://addons.mozilla.org/firefox/addon/access-panel-extension/)

## Next steps
[Provide single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md)

