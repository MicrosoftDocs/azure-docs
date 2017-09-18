---
title: Translate links and URLs Azure AD App Proxy | Microsoft Docs
description: Covers the basics about Azure AD Application Proxy connectors.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid:
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/10/2017
ms.author: kgremban
ms.reviewer: harshja
ms.custom: it-pro
---

# Redirect hardcoded links for apps published with Azure AD Application Proxy

Azure AD Application Proxy makes your on-premises apps available to users who are remote or on their own devices. Some apps, however, were developed with local links embedded in the HTML. These links don't work correctly when the app is used remotely. When you have several on-premises applications point to each other, your users expect the links to keep working when they're not at the office. 

The best way to make sure that links work the same both inside and outside of your corporate network is to configure the external URLs of your apps to be the same as their internal URLs. Use [custom domains](active-directory-application-proxy-custom-domains.md) to configure your external URLs to have your corporate domain name instead of the default application proxy domain.

If you can't use custom domains in your tenant, then the link translation feature of Application Proxy keeps your links working no matter where your users are. When you have apps that point directly to internal endpoints or ports, you can map these internal URLs to the published external Application Proxy URLs. When link translation is enabled, and Application Proxy searches through HTML, CSS, and select JavaScript tags for published internal links. Then the Application Proxy service translates them so that your users get an uninterrupted experience.

>[!NOTE]
>The link translation feature is for tenants that, for whatever reason, can't use custom domains to have the same internal and external URLs for their apps. Before you enable this feature, see if [custom domains in Azure AD Application Proxy](active-directory-application-proxy-custom-domains.md) can work for you.
>
>Or, if the application you need to configure with link translation is SharePoint, see [Configure alternate access mappings for SharePoint 2013](https://technet.microsoft.com/library/cc263208.aspx) for another approach to mapping links.

## How link translation works

After authentication, when the proxy server passes the application data to the user, Application Proxy scans the application for hardcoded links and replaces them with their respective, published external URLs.

Application Proxy assumes that applications are encoded in UTF-8. If that's not the case, specify the encoding type in an http response header, like `Content-Type:text/html;charset=utf-8`.

### Which links are affected?

The link translation feature only looks for links that are in code tags in the body of an app. Application Proxy has a separate feature for translating cookies or URLs in headers. 

There are two common types of internal links in on-premises applications:

- **Relative internal links** that point to a shared resource in a local file structure like `/claims/claims.html`. These links automatically work in apps that are published through Application Proxy, and continue to work with or without link translation. 
- **Hardcoded internal links** to other on-premises apps like `http://expenses` or published files like `http://expenses/logo.jpg`. The link translation feature works on hardcoded internal links, and changes them to point to the external URLs that remote users need to go through.

### How do apps link to each other?

Link translation is enabled for each application, so that you have control over the user experience at the per-app level. Turn on link translation for an app when you want the links *from* that app to be translated, not links *to* that app. 

For example, suppose that you have three applications published through Application Proxy that all link to each other: Benefits, Expenses, and Travel. There's a fourth app, Feedback, that isn't published through Application Proxy.

When you enable link translation for the Benefits app, the links to Expenses and Travel are redirected to the external URLs for those apps, but the link to Feedback is not redirected because there is no external URL. Links from Expenses and Travel back to Benefits don't work, because link translation has not been enabled for those two apps.

![Links from Benefits to other apps when link translation is enabled](./media/application-proxy-link-translation/one_app.png)

### Which links aren't translated?

To improve performance and security, some links aren't translated:

- Links not inside of code tags. 
- Links not in HTML, CSS, or JavaScript. 
- Internal links opened from other programs. Links sent through email or instant message, or included in other documents, won't be translated. The users need to know to go to the external URL.

If you need to support one of these two scenarios, use the same internal and external URLs instead of link translation.  

## Enable link translation

Getting started with link translation is as easy as clicking a button:

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
2. Go to **Azure Active Directory** > **Enterprise applications** > **All applications** > select the app you want to manage > **Application proxy**.
3. Turn **Translate URLs in application body** to **Yes**.

   ![Select Yes to translate URLs in application body](./media/application-proxy-link-translation/select_yes.png).
4. Select **Save** to apply your changes.

Now, when your users access this application, the proxy will automatically scan for internal URLs that have been published through Application Proxy on your tenant.

## Send feedback

We want your help to make this feature work for all your apps. We search over 30 tags in HTML and CSS, and are considering which JavaScript cases to support. If you have an example of generated links that aren't being translated, send a code snippet to [Application Proxy Feedback](mailto:aadapfeedback@microsoft.com). 

## Next steps
[Use custom domains with Azure AD Application Proxy](active-directory-application-proxy-custom-domains.md) to have the same internal and external URL

[Configure alternate access mappings for SharePoint 2013](https://technet.microsoft.com/library/cc263208.aspx)
