---
title: Token, session, and single sign-on configuration in Azure Active Directory B2C | Microsoft Docs
description: Token, session and single sign-on configuration in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 08/16/2017
ms.author: davidmu
ms.component: B2C
---

# Token, session, and single sign-on configuration in Azure Active Directory B2C

This feature gives you fine-grained control, on a [per-policy basis](active-directory-b2c-reference-policies.md), of:

- Lifetimes of security tokens emitted by Azure Active Directory (Azure AD) B2C.
- Lifetimes of web application sessions managed by Azure AD B2C.
- Formats of important claims in the security tokens emitted by Azure AD B2C.
- Single sign-on (SSO) behavior across multiple apps and policies in your Azure AD B2C tenant.

You can use this feature on any policy type, but this example show how to use the feature with a sign-up or sign-in policy. For built-in policies, you can use this feature in your Azure AD B2C directory as follows:

1. Click **Sign-up or sign-in policies**.
2. Open a policy by clicking it. For example, click on **B2C_1_SiUpIn**.
3. Click **Edit** at the top of the menu.
4. Click **Token, session & single sign-on config**.
5. Make your desired changes. Learn about available properties in subsequent sections.
6. Click **OK**.
7. Click **Save** on the top of the menu.

## Token lifetimes configuration

Azure AD B2C supports the [OAuth 2.0 authorization protocol](active-directory-b2c-reference-protocols.md) for enabling secure access to protected resources. To implement this support, Azure AD B2C emits various [security tokens](active-directory-b2c-reference-tokens.md). 

The following properties are used to manage lifetimes of security tokens emitted by Azure AD B2C:

- **Access & ID token lifetimes (minutes)** - The lifetime of the OAuth 2.0 bearer token used to gain access to a protected resource.
    - Default = 60 minutes.
    - Minimum (inclusive) = 5 minutes.
    - Maximum (inclusive) = 1440 minutes.
- **Refresh token lifetime (days)** - The maximum time period before which a refresh token can be used to acquire a new access or ID token (and optionally, a new refresh token, if your application had been granted the `offline_access` scope).
    - Default = 14 days.
    - Minimum (inclusive) = 1 day.
    - Maximum (inclusive) = 90 days.
- **Refresh token sliding window lifetime (days)** - After this time period elapses the user is forced to re-authenticate, irrespective of the validity period of the most recent refresh token acquired by the application. It can only be provided if the switch is set to **Bounded**. It needs to be greater than or equal to the **Refresh token lifetime (days)** value. If the switch is set to **Unbounded**, you cannot provide a specific value.
    - Default = 90 days.
    - Minimum (inclusive) = 1 day.
    - Maximum (inclusive) = 365 days.

The following use cases are enabled using these properties:

- Allow a user to stay signed in to a mobile application indefinitely, as long as the user is continually active on the application. You can set **Refresh token sliding window lifetime (days)** to **Unbounded** in your sign-in policy.
- Meet your industry's security and compliance requirements by setting the appropriate access token lifetimes.

These settings are not available for password reset policies. 

## Token compatibility settings

The following properties allow customers to opt in as needed:

- **Issuer (iss) claim** - This property identifies the Azure AD B2C tenant that issued the token.
    - `https://<domain>/{B2C tenant GUID}/v2.0/` - This is the default value.
    - `https://<domain>/tfp/{B2C tenant GUID}/{Policy ID}/v2.0/` - This value includes IDs for both the B2C tenant and the policy used in the token request. If your app or library needs Azure AD B2C to be compliant with the [OpenID Connect Discovery 1.0 spec](http://openid.net/specs/openid-connect-discovery-1_0.html), use this value.
- **Subject (sub) claim** - This property identifies the entity for which the token asserts information.
    - **ObjectID** - This property is the default value. It populates the object ID of the user in the directory into the `sub` claim in the token.
    - **Not supported** - This property is only provided for backward-compatibility, and we recommend that you switch to **ObjectID** as soon as you are able to.
- **Claim representing policy ID** - This property identifies the claim type into which the policy ID used in the token request is populated.
    - **tfp** - This property is the default value.
    - **acr** - This property is only provided for backward-compatibility.

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

These settings are not available for password reset policies.

## Single sign-on (SSO) configuration

If you have multiple applications and policies in your B2C tenant, you can manage user interactions across them using the **Single sign-on configuration** property. You can set the property to one of the following settings:

- **Tenant** - This setting is the default. Using this setting allows multiple applications and policies in your B2C tenant to share the same user session. For example, once a user signs into an application, the user can also seamlessly sign into another one, Contoso Pharmacy, upon accessing it.
- **Application** - This setting allows you to maintain a user session exclusively for an application, independent of other applications. For example, if you want the user to sign in to Contoso Pharmacy (with the same credentials), even if the user is already signed into Contoso Shopping, another application on the same B2C tenant. 
- **Policy** - This setting allows you to maintain a user session exclusively for a policy, independent of the applications using it. For example, if the user has already signed in and completed a multi factor authentication (MFA) step, the user can be given access to higher-security parts of multiple applications as long as the session tied to the policy doesn't expire.
- **Disabled** - This setting orces the user to run through the entire user journey on every execution of the policy. For example, this allows multiple users to sign up to your application (in a shared desktop scenario), even while a single user remains signed in during the whole time.

These settings are not available for password reset policies. 

