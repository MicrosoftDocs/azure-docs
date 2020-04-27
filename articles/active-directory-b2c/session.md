---
title: Overview session in Azure Active Directory B2C
description: Learn about the types of session that can be used in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/05/2019
ms.author: mimart
ms.subservice: B2C
---

# Azure AD B2C session

Single sign-on (SSO) adds security and convenience when users sign-in across applications in Azure Active Directory B2C (Azure AD B2C). This article describes the single sign-on methods, and helps you choose the most appropriate SSO method when configuring your policy.

With single sign-on, users sign in once with one account to access multiple applications. The application can be a web, mobile or single page application, regardless of the platform, or the domain name. 

When the user completes their initial sign into an application, Azure AD B2C persists a cookie-based session. On consecutive authentication requests, Azure AD B2C reads, validates the cookie-based session, and issues an access token, without prompting the user to sign-in again. If the cookie-based session has expired or been invalidated, the user will be prompted to sign-in again.  

## SSO Session

Integration with Azure AD B2C involves three categories of session management:


1. **Azure AD B2C**  - As described in this article.
1. **Federated identity providers** (IdP) - Such as Facebook, Salesforce, or Microsoft account. 
1. **Application**, your web, mobile or single page application usually have their own session.

![SSO session](media/session/session.png)

### Azure AD B2C SSO 

Upon successful authentication with local, or social account, Azure AD B2C stores a cookie-based session on the user's browser. The cookie is stored under the Azure AD B2C tenant domain name, such as `https://contoso.b2clogin.com`. 


Consecutive sign-ins to the same app or another app, during the session time window (TTL), if a user sign-in with a federated account, Azure AD B2C tries to acquire a new access token from the federated identity provider. If federated IDP session is expired or invalidated, the federated IDP prompts the users provide their credentials. Otherwise, (user sign-in with local account, or the user sign-in with federated account and the session still active), Azure AD B2C authorizes the user and eliminates further prompts.

You can configure the session behavior, such as the life time and how Azure AD B2C shares the session across policies and applications.

### Federated identity provider SSO

Social or enterprise identity providers manage their own session. The cookie is stored under the identity providers domain name, such as `https://login.saleforce.com`. Azure AD B2C doesn't control the federated IdP session. The ultimate session decision remains with the federated identity provider. With a federated IdP, consider the following scenarios:

A user has signed into Facebook to check their feed. Later, the user opens your application, and clicks on sign-in. The user is redirected to Azure AD B2C to complete the sign-in. On Azure AD B2C sign-up or sign-in page, the user chooses to sign-in with their Facebook account. The user is redirected to Facebook. If there is an active session at Facebook, the use will not be prompted to provide their credentials, and immediately be redirected to B2C with a Facebook token.


### Application SSO

A web, mobile or single page application can be protected by OAuth access, ID, or SAML tokens. When a user tries to access a protected resource  on the app, the app checks whether there is an active session on the application side. If there is no app session or the session has expired, the app will take the user to Azure AD B2C to sign-in page. 

The application session, can be a cookie-base session stored under the application domain name, such as `https://contoso.com`.  Mobile applications may store the session in a different way, with a similar approach. 

## Azure AD B2C session configuration

### Session scope

The Azure AD B2C session can be configured with the following scopes:

- **Tenant** - This setting is the default. Using this setting allows multiple applications and user flows in your B2C tenant to share the same user session. For example, once a user signs into an application, the user can also seamlessly sign into another one, upon accessing it.
- **Application** - This setting allows you to maintain a user session exclusively for an application, independent of other applications. For example, if you want the user to sign in to Contoso Pharmacy regardless if the user is already signed into Contoso Groceries. 
- **Policy** - This setting allows you to maintain a user session exclusively for a user flow, independent of the applications using it. For example, if the user has already signed in and completed a multi factor authentication (MFA) step, the user can be given access to higher-security parts of multiple applications as long as the session tied to the user flow doesn't expire.
- **Disabled** - This setting forces the user to run through the entire user flow on every execution of the policy.

### Session life time

The life time of Azure AD B2C's session cookie stored on the user's browser after successful authentication. You can configure the session life time between 15 and 720 minutes.

### Keep me signed-in

The keep me signed-in feature extends the session life time, by using a persistent cookie. The session remains active after user closes and reopens the browser. The session is revoked only when a user signs out. Keep me signed-in is limited to sign-in with local account. 

If keep me signed-in is enabled and the user selects 'keep me signed in'. The keep me signed-in life time takes precedence over the session life time, and dictates the session expiry time. 

### Session expiry type

Indicates how the session is extended by the time specified session and keep me signed-in life time. 

- **Rolling** - Indicates that the session is extended every time the user performs a cookie-based authentication (default). 
- **Absolute** - Indicates that the user is forced to reauthenticate after the time period specified. 

## Sign-out

When you want to sign the user out of the application, it isn't enough to clear the application's cookies or otherwise end the session with the user. You must redirect the user to Azure AD B2C to sign out. If you fail to do so, the user might be able to reauthenticate to your applications without entering their credentials again.

On a sign-out request Azure B2C:

1. Invalidates the Azure AD B2C cookie-based session. 
1. Attempts to sign-out from federated identity providers.       
    1. OpenId Connect - if the well-known configuration end point specifies `end_session_endpoint` location.
    1. SAML - if the IDP metadata contains the `SingleLogoutService` location.
1. Optionally, sign-out from other applications. For more information, see the [Single sign-out](single-sign-out) section. 

> [!NOTE]
> The sign-out clears the user's single sign-on state with Azure AD B2C, but it may not sign the user out of their social identity provider (IDP) session. If the user selects the same IDP during a subsequent sign-in, they may reauthenticated without entering their credentials. If a user wants to sign out of the application, it doesn't necessarily mean they want to sign out of their Facebook account. However, if local accounts are used, the user's session ends properly.

### Single sign-out

When you redirect the user to Azure AD B2C sign-out endpoint (for both OAuth2 and SAML protocols), Azure AD B2C clears the user's session from the browser. However, the user may still be signed in to other applications that use Azure AD B2C for authentication. To enable those applications to sign the user out simultaneously, Azure AD B2C sends an HTTP GET request to the registered `LogoutUrl` of all the applications that the user is currently signed in to. 

Applications must respond to this request by clearing any session that identifies the user and returning a `200` response. If you wish to support single sign-out in your application, you must implement such a `LogoutUrl` in your application's code. You can set the `LogoutUrl` from the Azure portal:

1. Navigate to the [Azure portal](https://portal.azure.com).
2. Choose your Active B2C by clicking on your account in the top right corner of the page.
3. From the left-hand navigation panel, choose **Azure Active B2C**, then choose **App registrations** and select your application.
4. Click on **Settings**, then **Properties** and find the **Logout URL** text box. 


## Next steps

- Learn how to [configure session behavior in user flow](session-behavior.md).
- Learn how to [configure session behavior in custom policy](custom-policy-manage-sso-and-token-config.md#session-behavior-and-sso).