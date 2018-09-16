---
title: App Registration Portal Help Topics | Microsoft Docs
description: A description of various features in the Microsoft app registration portal.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: f0507c28-9464-4d3e-bd53-de9053fd5278
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/28/2018
ms.author: celested
ms.reviewer: lenalepa
ms.custom: aaddev
---

# App registration reference
This document provides context and descriptions of various features found in the [Application Registration Portal](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/).

## My Applications or Converged applications
This list contains all of your applications registered for use with the Azure AD v2.0 endpoint. These applications have the ability to sign in users with both personal Microsoft accounts and work/school accounts from Azure Active Directory. To learn more about the Azure AD v2.0 endpoint, see the [v2.0 overview](active-directory-appmodel-v2-overview.md). These applications can also be used to integrate with the Microsoft account authentication endpoint, `https://login.live.com`.

## Azure AD only applications
This list contains all of your applications registered for use with the Azure AD v1.0 endpoint. These applications only have the ability to sign in users with work/school accounts from Azure Active Directory. This list includes applications that were registered using the **App registrations** experience in the [Azure Portal](https://portal.azure.com).

## Live SDK Applications
This list contains all of your applications registered for use solely with Microsoft account. They are not enabled for use with Azure Active Directory. This is where you find any applications that were previously registered with the MSA developer portal at `https://account.live.com/developers/applications`. All functions that you previously performed at `https://account.live.com/developers/applications` can now be performed in this new portal, `https://apps.dev.microsoft.com`.

## Application Secrets
Application secrets are credentials that allow your application to perform reliable [client authentication](http://tools.ietf.org/html/rfc6749#section-2.3) with Azure AD. In OAuth & OpenID Connect, an application secret is commonly referred to as a `client_secret`. In the v2.0 protocol, any application that receives a security token at a web addressable location (using an `https` scheme) must use an application secret to identify itself to Azure AD upon redemption of that security token. Furthermore, any native client that receives tokens on a device will be forbidden from using an application secret to perform client authentication. This discourages the storage of secrets in insecure environments.

Each app can contain two valid application secrets at any given time. By maintaining two secrets, you have the ability to perform periodic key rollover across your application's entire environment. Once you've migrated the entirety of your application to a new secret, you may delete the old secret and provision a new one.

At this time, only two types of application secrets are allowed in the app registration portal. Choosing **Generate New Password** generates and stores a shared secret in the respective data store, which you can use in your application. Choosing **Generate New Key Pair** creates a new public/private key pair that can be downloaded and used for client authentication to Azure AD. Choosing **Upload Public Key** allows you to use your own public/private key pair.
You are required to upload a certificate that contains a public key.

## Profile
The profile section of the app registration portal can be used to customize the sign-in page for your application. At this time you can alter the sign-in page's application logo, terms of service URL, and privacy statement URL. The logo must be a transparent 48 x 48 or 50 x 50 pixel image in a GIF, PNG or JPEG file that is 15 KB or smaller. Try changing the values and viewing the resulting sign-in page!

## Live SDK Support
When you enable "Live SDK Support", any application secrets you create will be provisioned into both the Azure AD and Microsoft Account data stores. This allows your application to integrate directly with the Microsoft Account service (login.live.com). If you wish to build an app using Microsoft Account directly (as opposed to using the Azure AD v2.0 endpoint), you should make sure Live SDK Support is enabled.

Disabling Live SDK support ensures that the application secret is only written into the Azure AD data store. The Azure AD data store incorporates enterprise-grade regulations that allow it to meet certain standards, such as FISMA compliance. If you enable Live SDK support, your application may not achieve compliance with some of these standards.

If you only ever plan to use the Azure AD v2.0 endpoint, you can safely disable Live SDK support.

