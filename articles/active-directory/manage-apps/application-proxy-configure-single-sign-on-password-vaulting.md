---
title: Single sign-on to apps with Azure AD Application Proxy | Microsoft Docs
description: Turn on single sign-on for your published on-premises applications with Azure AD Application Proxy in the Azure portal.
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 11/12/2018
ms.author: mimart
ms.reviewer: japere
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Password vaulting for single sign-on with Application Proxy

Azure Active Directory Application Proxy helps you improve productivity by publishing on-premises applications so that remote employees can securely access them, too. In the Azure portal, you can also set up single sign-on (SSO) to these apps. Your users only need to authenticate with Azure AD, and they can access your enterprise application without having to sign in again.

Application Proxy supports several [single sign-on modes](what-is-single-sign-on.md#choosing-a-single-sign-on-method). Password-based sign-on is intended for applications that use a username/password combination for authentication. When you configure password-based sign-on for your application, your users have to sign in to the on-premises application once. After that, Azure Active Directory stores the sign-in information and automatically provides it to the application when your users access it remotely.

You should already have published and tested your app with Application Proxy. If not, follow the steps in [Publish applications using Azure AD Application Proxy](application-proxy-add-on-premises-application.md) then come back here.

## Set up password vaulting for your application

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
1. Select **Azure Active Directory** > **Enterprise applications** > **All applications**.
1. From the list, select the app that you want to set up with SSO.  
1. Select **Single sign-on**.

   ![Select Single sign-on from the app's overview page](./media/application-proxy-configure-single-sign-on-password-vaulting/select-sso.png)

1. For the SSO mode, choose **Password-based Sign-on**.
1. For the Sign-on URL, enter the URL for the page where users enter their username and password to sign in to your app outside of the corporate network. This may be the External URL that you created when you published the app through Application Proxy.

   ![Choose password-based Sign-on and enter your URL](./media/application-proxy-configure-single-sign-on-password-vaulting/password-sso.png)

1. Select **Save**.

<!-- Need to repro?
7. The page should tell you that a sign-in form was successfully detected at the provided URL. If it doesn't, select **Configure [your app name] Password Single Sign-on Settings** and choose **Manually detect sign-in fields**. Follow the instructions to point out where the sign-in credentials go. 
-->

## Test your app

Go to external URL that you configured for remote access to your application. Sign in with your credentials for that app (or the credentials for a test account that you set up with access). Once you sign in successfully, you should be able to leave the app and come back without entering your credentials again.

## Next steps

- Read about other ways to implement [Single sign-on](what-is-single-sign-on.md)
- Learn about [Security considerations for accessing apps remotely with Azure AD Application Proxy](application-proxy-security.md)
