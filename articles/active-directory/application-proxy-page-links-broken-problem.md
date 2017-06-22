---
title: Links on the page don't work for an Application Proxy application
 | Microsoft Docs
description:  How to troubleshoot issues with broken links on Application Proxy applications you have integrated with Azure AD
services: active-directory
documentationcenter: ''
author: ajamess
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/04/2017
ms.author: asteen

---

# Links on the page don't work for an Application Proxy application

This article help you to troubleshoot why links on your Azure Active Directory Application Proxy application don't work correctly.

## Overview 
After publishing an Application Proxy app, the only links that work by default in the application are links to destinations contained within the published root URL. The links within the applications aren’t working, the internal URL for the application probably does not include all the destinations of links within the application.

**Why does this happen?** When clicking a link in an application, Application Proxy tries to resolve the URL as either an internal URL within the same application, or as an externally available URL. If the link points to an internal URL that is not within the same application, it does not belong to either of these buckets and result in a not found error.

## Ways you can resolve broken links

There are three ways to resolve this issue. The choices below are in listed in increasing complexity.

1.  Make sure the internal URL is a root that contains all the relevant links for the application. This allows all links to be resolved as content published within the same application.

    If you change the internal URL but don’t want to change the landing page for users, change the Home page URL to the previously published internal URL. This can be done by going to “Azure Active Directory” -&gt; App Registrations -&gt; select the application -&gt; Properties. In this properties tab, you see the field “Home Page URL” which you can adjust to be the desired landing page.

2.  If your applications use fully qualified domain names (FQDNs), use [custom domains](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-custom-domains) to publish your applications. This feature allows the same URL to be used both internally and externally.

    This option ensures that the links in your application are externally accessible through Application Proxy since the links within the application to internal URLs are also recognized externally. Note that all links still need to belong to a published application. However, with this option the links do not need to belong to the same application and can belong to multiple applications.

3.  If neither of these options are feasible, you can use the "translate URLs in headers" feature which supports URL translation/rewriting. You can find this feature by going to the [Azure Portal](https://aad.portal.azure.com), then to **Enterprise Applications**, selecting your application, clicking on the **Application Proxy** navigation item, and enabling the **Translate URLs in Headers** toggle, then clicking **Save**. With this option, internal URLs or links that exist in the HTML body of your applications be translated, or “mapped”, to the published external App Proxy URLs. This only works for links in the HTML or CSS, and this not help if your link is generated through JS. 

As a result, we strongly recommend using the [custom domains](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-custom-domains) solution if possible. If you do want to join the preview, email <aadapfeedback@microsoft.com> with the applicationId(s).

## Next steps
[Work with existing on-premises proxy servers](application-proxy-working-with-proxy-servers.md)

