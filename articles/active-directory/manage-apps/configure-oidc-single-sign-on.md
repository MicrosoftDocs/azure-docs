---
title: Understand OIDC-based single sign-on (SSO) for apps in Azure Active Directory
description: Understand OIDC-based single sign-on (SSO) for apps in Azure Active Directory.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 10/19/2020
ms.author: kenwith
ms.reviewer: arajpathak7
ms.custom: contperfq2
---

# Understand OIDC-based single sign-on
In the [quickstart series](view-applications-portal.md) on application management, you learned how to use Azure AD as the Identity Provider (IdP) for an application. This article goes into more detail about apps that use the OpenID Connect standard to implement single sign-on. 

## Before you begin
The process of adding an app to your Azure Active Directory tenant depends on the type of single sign-on the application implemented. To learn more about the single sign-on options available for apps that can use Azure AD for identity management, see [single sign-on options](sso-options.md). This article covers OIDC-based apps.


## Basic OIDC configuration
In the [quickstart series](add-application-portal-setup-oidc-sso.md), there's an article on configuring single sign-on. In it, you learn how to add an OIDC-based app to your Azure tenant.

The nice thing with adding an app that uses the OIDC standard for single sign-on is that configuration is minimal. Here is a short video showing how to add an OIDC-based app to your tenant.

Adding an OIDC-based app in Azure Active Directory

> [!VIDEO  https://www.microsoft.com/videoplayer/embed/RE4HoNI]

## Next steps

- [Quickstart Series on Application Management](add-application-portal-setup-oidc-sso.md)
- [Single sign-on options](sso-options.md)
- [How to: Sign in any Azure Active Directory user using the multi-tenant application pattern](../develop/howto-convert-app-to-be-multi-tenant.md)
