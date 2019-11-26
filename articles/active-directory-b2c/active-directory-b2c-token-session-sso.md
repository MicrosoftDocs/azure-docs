---
title: Session and single sign-on configuration - Azure Active Directory B2C | Microsoft Docs
description: Session and single sign-on configuration in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/16/2019
ms.author: marsma
ms.subservice: B2C
---

# Session and single sign-on configuration in Azure Active Directory B2C

This feature gives you fine-grained control, on a [per-user flow basis](active-directory-b2c-reference-policies.md), of:

- Lifetimes of web application sessions managed by Azure AD B2C.
- Single sign-on (SSO) behavior across multiple apps and user flows in your Azure AD B2C tenant.

## Session behavior

Azure AD B2C supports the [OpenID Connect authentication protocol](active-directory-b2c-reference-oidc.md) for enabling secure sign-in to web applications. You can use the following properties to manage web application sessions:

- **Web app session lifetime (minutes)** - The lifetime of Azure AD B2C's session cookie stored on the user's browser upon successful authentication.
    - Default = 1440 minutes.
    - Minimum (inclusive) = 15 minutes.
    - Maximum (inclusive) = 1440 minutes.
- **Web app session timeout** - If this switch is set to **Absolute**, the user is forced to authenticate again after the time period specified by **Web app session lifetime (minutes)** elapses. If this switch is set to **Rolling** (the default setting), the user remains signed in as long as the user is continually active in your web application.

The following use cases are enabled using these properties:

- Meet your industry's security and compliance requirements by setting the appropriate web application session lifetimes.
- Force authentication after a set time period during a user's interaction with a high-security part of your web application. 

These settings are not available for password reset user flows.

## Single sign-on (SSO) configuration

If you have multiple applications and user flows in your B2C tenant, you can manage user interactions across them using the **Single sign-on configuration** property. You can set the property to one of the following settings:

- **Tenant** - This setting is the default. Using this setting allows multiple applications and user flows in your B2C tenant to share the same user session. For example, once a user signs into an application, the user can also seamlessly sign into another one, Contoso Pharmacy, upon accessing it.
- **Application** - This setting allows you to maintain a user session exclusively for an application, independent of other applications. For example, if you want the user to sign in to Contoso Pharmacy (with the same credentials), even if the user is already signed into Contoso Shopping, another application on the same B2C tenant. 
- **Policy** - This setting allows you to maintain a user session exclusively for a user flow, independent of the applications using it. For example, if the user has already signed in and completed a multi factor authentication (MFA) step, the user can be given access to higher-security parts of multiple applications as long as the session tied to the user flow doesn't expire.
- **Disabled** - This setting forces the user to run through the entire user flow on every execution of the policy.

These settings are not available for password reset user flows. 

