---
title: Translate links and URLs Azure AD App Proxy | Microsoft Docs
description: Covers the basics about Azure AD Application Proxy connectors.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila
editor: harshja

ms.assetid:
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/15/2017
ms.author: kgremban
ms.custom: it-pro
---

# Redirect hardcoded links for apps published with Azure AD Application Proxy

Azure AD Application Proxy makes your on-premises apps available to users who are remote or on their own devices. Some apps, however, were developed with an on-premises audience in mind, which usually means that local links are embedded in the HTML and then don't work correctly when the app is used remotely. This is most common when several on-premises applications point to each other, and your users expect to use links to move between the apps instead of typing in the external URL for each app.

The link translation feature of Application Proxy was developed to solve this issue. When you have apps that point directly to internal endpoints or ports, you can map these internal URLs to the published external Application Proxy URLs. Enable link translation, and Application Proxy searches over 30 HTML and CSS tags for published internal links, then translates them so that your users get an uninterrupted experience.

>[!NOTE]
>The link translation feature is intended for tenants that, for whatever reason, can't use custom domains to have the same internal and external URLs for their apps. If you haven't already, see if [custom domains in Azure AD Application Proxy](active-directory-application-proxy-custom-domains.md) can work for you.

## How link translation works

After authentication, when the proxy server passes the application data to the user, Application Proxy scans the application for hardcoded links and replaces them with their respective, published external URLs.

### Which links are affected?

There are two common types of internal links in on-premises applications:

- **Relative internal links** that point to a shared resource in a local file structure like `/claims/claims.html`.
- **Hardcoded internal links** to other on-premises apps like `http://expenses` or published files like `http://expenses/logo.jpg`.

Relative internal links automatically work in apps that are published through Application Proxy, without link translation enabled. The link translation feature works on the hardcoded internal links, and changes them to point to the external URLs that remote users need to go through.

### How do apps link to each other?

Link translation is enabled for each application, so that you have control over the user experience at the per-app level. For example, suppose that you have three applications published through Application Proxy that all link to each other: Benefits, Expenses, and Travel. There's a fourth app, Feedback, that isn't published through Application Proxy.

When you enable link translation for the Benefits app, that means that the links to Expenses and Travel are redirected to the external URLs for those apps, but the link to Feedback is not redirected because there is no external URL. Links from Expenses and Travel back to Benefits don't work, because link translation has not been enabled for those two apps.

![Links from Benefits to other apps when link translation is enabled](./media/application-proxy-link-translation/one_app.png)

### Which links aren't translated?

To improve performance and security, some links aren't translated:

- Links not inside of HTML or CSS tags. This restriction mainly impacts apps that have URLs in Javascript.
- Internal links opened from other programs. Links sent through email or instant message, or included in other documents, won't be translated. The users need to know to go to the external URL.

If you need to support one of these two scenarios, you can use the same internal and external URLs, which eliminates the need for link translation.  

## Enable link translation

Getting started with link translation is as easy as clicking a button:

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
2. Go to **Azure Active Directory** > **Enterprise applications** > **All applications** > select the app you want to manage > **Application proxy**.
3. Turn **Translate URLs in application body** to **Yes**.

   ![Select Yes to translate URLs in application body](./media/application-proxy-link-translation/select_yes.png).
4. Select **Save** to apply your changes.

Now, when your users access this application, the proxy will automatically scan for internal URLs that have been published through Application Proxy on your tenant.

## Next steps
- [Use custom domains with Azure AD Application Proxy to have the same internal and external URL](active-directory-application-proxy-custom-domains.md)