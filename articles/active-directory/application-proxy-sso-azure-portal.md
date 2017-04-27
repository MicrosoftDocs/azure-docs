---
title: Single sign-on to apps with Azure AD Application Proxy | Microsoft Docs
description: Turn on single sign-on for your published on-premises applications with Azure AD Application Proxy in the Azure portal.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila
editor: asteen

ms.assetid: d94ac3f4-cd33-4c51-9d19-544a528637d4
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/26/2017
ms.author: kgremban
---


# Provide single sign-on with Azure AD Application Proxy - Public Preview

Azure Active Directory Application Proxy helps you improve productivity by publishing on-premises applications so that remote employees can securely access them, too. In the Azure portal, you can also set up single sign-on (SSO) to these apps. Now, your users only need to authenticate with Azure AD, and they can access your enterprise application without having to sign in again.

In this article, we use the example of a password-based app to show how password vaulting provides a simple SSO experience. 

You should already have published and tested your app with Application Proxy. If not, follow the steps in [Publish applications using Azure AD Application Proxy - Public Preview](application-proxy-publish-azure-portal.md) then come back here. 

Or, if you're new to Application Proxy, learn more about this feature with the article [How to provide secure remote access to on-premises applications](active-directory-application-proxy-get-started.md).

## Set up password vaulting for your application

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
2. Select **Azure Active Directory** > **Enterprise applications** > **All applications**.
3. From the list, select the app that you want to set up with SSO. If you have many apps, you can use the search box to filter for the right one.  
4. Under the Manage section, select **Single sign-on**.

   ![Select Single sign-on](./media/application-proxy-sso-azure-portal/select-sso.png)

5. For the SSO mode, choose **Password-based Sign-on**.
6. For the Sign-on URL, enter the URL for the page where users enter their username and password to sign in to your app. This should be the External URL that you created when you published the app through Application Proxy. 

   ![Choose password-based Sign-on and enter your URL](./media/application-proxy-sso-azure-portal/password-sso.png)

7. Select **Save**.

<!-- Need to repro?
7. The page should tell you that a sign-in form was successfully detected at the provided URL. If it doesn't, select **Configure [your app name] Password Single Sign-on Settings** and choose **Manually detect sign-in fields**. Follow the instructions to point out where the sign-in credentials go. 
-->

## Test your app

Go to the [MyApps site](https://myapps.microsoft.com) and select the app you just configured. Sign in with your credentials for that app (or the credentials for the test account you set up with access). Once you sign in successfully, you should be able to leave the app and come back without entering your credentials again. 

## Next steps

Read about other ways to implement [Single sign-on with Application Proxy](active-directory-application-proxy-sso-using-kcd.md)
