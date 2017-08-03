---
title: Claims-aware apps - Azure AD App Proxy | Microsoft Docs
description: How to publish on-premises ASP.NET applications that accept ADFS claims for secure remote access by your users. 
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila
editor: harshja

ms.assetid: 91e6211b-fe6a-42c6-bdb3-1fff0312db15
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/04/2017
ms.author: kgremban

---
# Working with claims aware apps in Application Proxy
Claims aware apps perform a redirection to the Security Token Service (STS), which in turn requests credentials from the user in exchange for a token before redirecting the user to the application. There are a few ways to enable Application Proxy to work with these redirects. Use this article to configure your deployment for claims aware apps. 

## Prerequisites
Before performing this procedure, make sure that the STS the claims aware app redirects to is available outside of your on-premises network. This redirection can be done by exposing the STS through a proxy or by allowing outside connections. 

## Publish your application

1. Publish your application according to the instructions described in [Publish applications with Application Proxy](active-directory-application-proxy-publish-azure-portal.md).
2. Navigate to the application page in the portal and select **Single sign-on**.
3. If you chose **Azure Active Directory** as your **Preauthentication Method**, select **Azure AD single sign-on disabled** as your **Internal Authentication Method**. If you chose **Passthrough** as your **Preauthentication Method**, you don't need to change anything.

## Configure ADFS

You can configure ADFS for claims aware apps in one of two ways. The first is by using custom domains. The second is with WS-Federation. 

### Option 1: Custom domains

If you are able to [use custom domains](active-directory-application-proxy-custom-domains.md) for your application, and all the URLs for the applications are FQDNs, then you don't need to do any additional configuration. Ensure that your interanl and external URLs are the same for the scenario to work.

### Option 2: WS-Federation

1. Open ADFS Management.
2. Go to **Relying Party Trusts**, right-click on the app you are publishing with Application Proxy, and choose **Properties**.  

   ![Relying Party Trusts right-click on app name - screenshot](./media/active-directory-application-proxy-claims-aware-apps/appproxyrelyingpartytrust.png)  

3. On the **Endpoints** tab, under **Endpoint type**, select **WS-Federation**.
4. Under **Trusted URL** enter the URL you entered in the Application Proxy under **External URL** and click **OK**.  

   ![Add an Endpoint - set Trusted URL value - screenshot](./media/active-directory-application-proxy-claims-aware-apps/appproxyendpointtrustedurl.png)  

## Next steps
* [Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)
* [Troubleshoot issues you're having with Application Proxy](active-directory-application-proxy-troubleshoot.md)
* [Enable native client apps to interact with proxy applications](active-directory-application-proxy-native-client.md)


