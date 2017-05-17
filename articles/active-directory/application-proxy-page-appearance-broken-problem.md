---
title: Application page does not display correctly for an Application Proxy application | Microsoft Docs
description: Guidance when the page isn’t displaying correctly in an Application Proxy Application you have integrated with Azure AD
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

# Application page does not display correctly for an Application Proxy application

This article help you to troubleshoot issues with Azure Active Directory Application Proxy applications when you navigate to the page, but something on the page doesn't look correct.

## Overview
When you publish an Application Proxy app, only pages under your root are accessible when accessing the application. If the page isn’t displaying correctly, the root internal URL used for the application may be missing some page resources. To resolve, make sure you have published *all* the resources for the page as part of your application.

You can verify this is the issue by opening your network tracker (such as Fiddler, or F12 tools in Internet Explorer/Edge), loading the page, and looking for 404 errors. That indicates the pages that currently cannot be found and may still need to be published.

As an example of this case, assume you have published an expenses application using an internal URL of <http://myapps/expenses>, but the app uses the stylesheet <http://myapps/style.css>. In this case, the stylesheet is not published in your application, so loading the expenses app throw a 404 error while trying to load style.css. In this example, the problem would be resolved by publishing the application with an internal URL of <http://myapp/> instead.

## Problems with publishing as one application

If it is not possible to publish all resources within the same application, you need to publish multiple applications and enable links between them.

To do so, we recommend using the [custom domains](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-custom-domains) solution. However, this solution requires that you own the certificate for your domain and your applications use fully qualified domain names (FQDNs). For other options, see the [troubleshoot broken links documentation](https://microsoft-my.sharepoint.com/personal/harshja_microsoft_com/_layouts/15/guestaccess.aspx?guestaccesstoken=IxuG3mFVbnPWI3Yn4Qi7wCNi8VIfHS5mwPt5quh8DMw%3d&docid=2_14558cd6ddea34c1c9887dc640feb5831&rev=1).

## Next steps
[Publish applications using Azure AD Application Proxy](application-proxy-publish-azure-portal.md)
