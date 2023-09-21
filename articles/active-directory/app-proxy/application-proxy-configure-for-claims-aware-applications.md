---
title: Claims-aware apps - Microsoft Entra application proxy
description: How to publish on-premises ASP.NET applications that accept AD FS claims for secure remote access by your users. 
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: how-to
ms.date: 09/14/2023
ms.author: kenwith
ms.reviewer: ashishj
---

# Working with claims-aware apps in Application Proxy
[Claims-aware apps](/previous-versions/windows/desktop/legacy/bb736227(v=vs.85)) perform a redirection to the Security Token Service (STS). The STS requests credentials from the user in exchange for a token and then redirects the user to the application. There are a few ways to enable Application Proxy to work with these redirects. Use this article to configure your deployment for claims-aware apps. 

## Prerequisites
Make sure that the STS that the claims-aware app redirects to is available outside of your on-premises network. You can make the STS available by exposing it through a proxy or by allowing outside connections. 

## Publish your application

1. Publish your application according to the instructions described in [Publish applications with Application Proxy](../app-proxy/application-proxy-add-on-premises-application.md).
2. Navigate to the application page in the portal and select **Single sign-on**.
3. If you chose **Microsoft Entra ID** as your **Preauthentication Method**, select **Microsoft Entra single sign-on disabled** as your **Internal Authentication Method**. If you chose **Passthrough** as your **Preauthentication Method**, you don't need to change anything.

## Configure ADFS

You can configure ADFS for claims-aware apps in one of two ways. The first is by using custom domains. The second is with WS-Federation. 

### Option 1: Custom domains

If all the internal URLs for your applications are fully qualified domain names (FQDNs), then you can configure [custom domains](application-proxy-configure-custom-domain.md) for your applications. Use the custom domains to create external URLs that are the same as the internal URLs. When your external URLs match your internal URLs, then the STS redirections work whether your users are on-premises or remote. 

### Option 2: WS-Federation

1. Open ADFS Management.
2. Go to **Relying Party Trusts**, right-click on the app you are publishing with Application Proxy, and choose **Properties**.  

   ![Relying Party Trusts right-click on app name - screenshot](./media/application-proxy-configure-for-claims-aware-applications/appproxyrelyingpartytrust.png)  

3. On the **Endpoints** tab, under **Endpoint type**, select **WS-Federation**.
4. Under **Trusted URL**, enter the URL you entered in the Application Proxy under **External URL** and click **OK**.  

   ![Add an Endpoint - set Trusted URL value - screenshot](./media/application-proxy-configure-for-claims-aware-applications/appproxyendpointtrustedurl.png)  

## Next steps
* [Enable native client apps to interact with proxy applications](application-proxy-configure-native-client-application.md)
