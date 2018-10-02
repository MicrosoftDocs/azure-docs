---
title: Links on the page don't work for an Application Proxy application
 | Microsoft Docs
description:  How to troubleshoot issues with broken links on Application Proxy applications you have integrated with Azure AD
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
ms.date: 09/10/2018
ms.author: barbkess
ms.reviewer: asteen
---

# Links on the page don't work for an Application Proxy application

This article helps you troubleshoot why links on your Azure Active Directory Application Proxy application don't work correctly.

## Overview 
After publishing an Application Proxy app, the only links that work by default in the application are links to destinations contained within the published root URL. The links within the applications aren’t working, the internal URL for the application probably does not include all the destinations of links within the application.

**Why does this happen?** When clicking a link in an application, Application Proxy tries to resolve the URL as either an internal URL within the same application, or as an externally available URL. If the link points to an internal URL that is not within the same application, it does not belong to either of these buckets and result in a not found error.

## Ways you can resolve broken links

There are three ways to resolve this issue. The choices below are in listed in increasing complexity.

1.  Make sure the internal URL is a root that contains all the relevant links for the application. This allows all links to be resolved as content published within the same application.

    If you change the internal URL but don’t want to change the landing page for users, change the Home page URL to the previously published internal URL. This can be done by going to “Azure Active Directory” -&gt; App Registrations -&gt; select the application -&gt; Properties. In this properties tab, you see the field “Home Page URL”, which you can adjust to be the desired landing page.

2.  If your applications use fully qualified domain names (FQDNs), use [custom domains](application-proxy-configure-custom-domain.md) to publish your applications. This feature allows the same URL to be used both internally and externally.

    This option ensures that the links in your application are externally accessible through Application Proxy since the links within the application to internal URLs are also recognized externally. All links still need to belong to a published application. However, with this option the links do not need to belong to the same application and can belong to multiple applications.

3.  If neither of these options are feasible, there are multiple options for enabling inline link translation. These options include using the Intune Managed Browser, My Apps extension, or using the link translation setting on your application. To learn more about each of these options and how to enable them, see [Redirect hardcoded links for apps published with Azure AD Application Proxy](application-proxy-configure-hard-coded-link-translation.md).

## Next steps
[Work with existing on-premises proxy servers](application-proxy-configure-connectors-with-proxy-servers.md)

