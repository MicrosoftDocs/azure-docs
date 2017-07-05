---
title: Access App Proxy apps in Teams | Microsoft Docs
description: Use Azure AD Application Proxy to access your on-premises application through Microsoft Teams. 
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
ms.date: 07/05/2017
ms.author: kgremban
ms.reviewer: harshja
ms.custom: it-pro
---

# Access your on-premises applications through Microsoft Teams

Microsoft Teams is designed to increase your collaboration and productivity. It streamlines your communication in one place, and puts your workspaces within easy reach when you integrate with Azure Active Directory Application Proxy. Once you publish an on-premises app with Application Proxy, like a SharePoint site or other business applications, let your users know that they can pin it to their Teams channels. 

## Install the Application Proxy connector and publish your app

If you haven't already, [configure Application Proxy for your tenant and install the connector](active-directory-application-proxy-enable.md). Then, [publish your on-premises application](application-proxy-publish-azure-portal.md) for remote access. When you're publishing the app, make note of the external URL because your end users need that information when they add the app to Teams.

If you already have your apps published but don't remember their external URLs, look them up in the [Azure portal](https://portal.azure.com). Sign in, then navigate to **Azure Active Directory** > **Enterprise applications** > **All applications** > select your app > **Application proxy**.

## Add your app to Team

Once the app is published through Application Proxy, let your users know that they can add it as a tab directly in their Teams channels. Have them follow these three steps:

1. Navigate to the Teams channel where you want to add this app and select **+** to add a tab.

   [Select Add a tab](./media/application-proxy-teams/add-tab.png)

2. Select **Website** from the tab options.

   [Add a website](./media/application-proxy-teams/website.png)

3. Give the tab a name and set the URL to the Application Proxy external URL. 

   [Configure tab name and URL](./media/application-proxy-teams/tab-name-url.png)

## Next steps

- Learn how to [publish on-premises SharePoint sites](application-proxy-enable-remote-access-sharepoint.md) with Application Proxy.
- Configure your apps to use [custom domains](active-directoy-application-proxy-custom-domains.md) for their external URL. 