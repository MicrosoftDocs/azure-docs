---
title: Manage SSO for Azure AD Application Proxy | Microsoft Docs
description: Learn about the basics of single sign-on with Application Proxy
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
ms.date: 07/18/2017
ms.author: kgremban
ms.reviewer: harshja
ms.custom: it-pro
---

# How does Azure AD Application Proxy provide single sign-on?

Single sign-on is a key element of Azure AD Application Proxy.  It provides the best user experience with the following steps:

1. A user signs in to the cloud.  
2. All security validations happen in the cloud (preauthentication).  
3. When the request is sent to the on-premises application, the Application Proxy connector impersonates the user. The backend application thinks the request is from a regular user on a domain-joined device.

![Access diagram from end user, through Application Proxy, to the corporate network](./media/active-directory-application-proxy-sso-using-kcd/app_proxy_sso_diff_id_diagram.png)

Once you publish an on-premises application with Application Proxy, you can manage it like any other SaaS app that is integrated with Azure Active Directory. Monitor sign-in activity, create a conditional access policy, provision access, or set up single sign-on. 

To see your single sign-on options, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to **Azure Active Directory** > **Enterprise applications** > **All applications**.
3. Select the app whose single sign-on options you want to manage.
4. Select **Single sign-on**.

   ![SSO dropdown menu](./media/application-proxy-sso-overview/single-sign-on-mode.png)

The dropdown menu shows five options for single sign-on to your application:

* Azure AD single sign-on disabled
* Password-based sign-on
* Linked sign-on
* Integrated Windows Authentication
* Header-based sign-on

## Azure AD single sign-on disabled

If you don't want to use Azure Active Directory integration for single sign-on to your application, choose **Azure AD single sign-on disabled**. With this option selected, your users authenticate twice. First, they authenticate to Azure Active Directory and then sign in to the application itself. 

## Password-based sign-on

If you want to use Azure Active Directory as a password vault for your on-premises applications, choose **Password-based sign-on**. With this option, your users need to sign in to the application the first time they access it. After that, Azure Active Directory supplies the username and password on behalf of the user. 

For information about setting up password-based sign-on, see [Password vaulting for single sign-on with Application Proxy](application-proxy-sso-azure-portal.md).

## Linked sign-on

*Information about linked sign-on*

## Integrated Windows Authentication

If your on-premises applications use Integrated Windows Authentication(IWA) or if you want to use Kerberos Constrained Delegation (KCD) for single sign-on, choose **Integrated Windows Authentication**. With this option, your users only need to authenticate to Azure Active Directory, and then the Application Proxy connector impersonates the user to get a Kerberos token and sign in to the application. 

For information about setting up Integrated Windows Authentication, see [Kerberos Constrained Delegation for single sign-on with Application Proxy](active-directory-application-proxy-sso-using-kcd.md).

## Header-based sign-on 

If your applications use headers for authentication, choose **Header-based authentication**. With this option, your users only need to authentication the Azure Active Directory. Microsoft partners with a third-party authentication service called PingAccess, which translated the Azure Active Directory access token into a header format for the application. 

For information about setting up header-based authentication, see [Header-based authentication for single sign-on with Application Proxy](application-proxy-ping-access.md).

## Next steps

- [Password vaulting for single sign-on with Application Proxy](application-proxy-sso-azure-portal.md)
- [Kerberos Constrained Delegation for single sign-on with Application Proxy](active-directory-application-proxy-sso-using-kcd.md)
- [Header-based authentication for single sign-on with Application Proxy](application-proxy-ping-access.md) 