---
title: Single sign-on to apps with Azure Active Directory Application Proxy
description: Turn on single sign-on for your published on-premises applications with Azure Active Directory Application Proxy in the Azure portal.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: how-to
ms.date: 11/17/2022
ms.author: kenwith
ms.reviewer: ashishj
---

# Password vaulting for single sign-on with Application Proxy

Azure Active Directory Application Proxy helps you improve productivity by publishing on-premises applications so that remote employees can securely access them, too. In the Azure portal, you can also set up single sign-on (SSO) to these apps. Your users only need to authenticate with Azure AD, and they can access your enterprise application without having to sign in again.

Application Proxy supports several [single sign-on modes](../manage-apps/sso-options.md#choosing-a-single-sign-on-method). Password-based sign-on is intended for applications that use a username/password combination for authentication. When you configure password-based sign-on for your application, your users have to sign in to the on-premises application once. After that, Azure Active Directory stores the sign-in information and automatically provides it to the application when your users access it remotely.

You should already have published and tested your app with Application Proxy. If not, follow the steps in [Publish applications using Azure AD Application Proxy](application-proxy-add-on-premises-application.md) then come back here.

## Set up password vaulting for your application

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
1. Select **Azure Active Directory** > **Enterprise applications** > **All applications**.
1. From the list, select the app that you want to set up with SSO.  
1. Select **Application Proxy**. 
1. Change the **Pre Authentication type** to **Passthrough** and select **Save**. Later you can switch back to **Azure Active Directory** type again! 
1. Select **Single sign-on**.

   ![Select Single sign-on from the app's overview page](./media/application-proxy-configure-single-sign-on-password-vaulting/select-sso.png)

1. For the SSO mode, choose **Password-based Sign-on**.
1. For the Sign-on URL, enter the URL for the page where users enter their username and password to sign in to your app outside of the corporate network. This may be the External URL that you created when you published the app through Application Proxy.

   ![Choose password-based Sign-on and enter your URL](./media/application-proxy-configure-single-sign-on-password-vaulting/password-sso.png)

1. Select **Save**.
1. Select **Application Proxy**. 
1. Change the **Pre Authentication type** to **Azure Active Directory** and select **Save**. 
1. Select **Users and Groups**.
1. Assign users to the application with selecting **Add user**. 
1. If you want to predefine credentials for a user, check the box front of the user name and select **Update credentials**.
1. Select **Azure Active Directory** > **App registrations** > **All applications**.
1. From the list, select the app that you configured with Password SSO.
1. Select **Branding**. 
1. Update the **Home page URL** with the **Sign on URL** from the Password SSO page and select **Save**.  



<!-- Need to repro?
7. The page should tell you that a sign-in form was successfully detected at the provided URL. If it doesn't, select **Configure [your app name] Password Single Sign-on Settings** and choose **Manually detect sign-in fields**. Follow the instructions to point out where the sign-in credentials go. 
-->

## Test your app

Go to the My Apps portal. Sign in with your credentials (or the credentials for a test account that you set up with access). Once you signed in successfully, click on the icon of the app. This might trigger the installation of the My Apps Secure Sign-in browser extension. If your user had predefined credentials the authentication to the app should happen automatically, otherwise you must specify the user name or password for the first time. 

## Next steps

- Read about other ways to implement [Single sign-on](../manage-apps/what-is-single-sign-on.md)
- Learn about [Security considerations for accessing apps remotely with Azure AD Application Proxy](application-proxy-security.md)
