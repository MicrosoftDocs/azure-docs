---
title: Comparing the Azure AD v2.0 endpoint with v1.0 endpoint | Microsoft Docs
description: Know the differences between Azure AD v2.0 endpoint and the v1.0 endpoint
services: active-directory
documentationcenter: ''
author: andretms
manager: mtillman
editor: ''

ms.assetid: 5060da46-b091-4e25-9fa8-af4ae4359b6c
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/21/2018
ms.author: andret
ms.reviewer: hirsin, celested
ms.custom: aaddev
---

# Comparing the Azure AD v2.0 endpoint with v1.0 endpoint

## Who can sign-in

![Who can sign-in with v1.0 and v2.0 endpoints](media/azure-ad-endpoint-comparison/who-can-sign-in.jpg)

The v2.0 endpoint allows developers to write apps that accept sign-in from both personal (outlook.com, hotmail.com) and work and school accounts, giving you the ability to write your app completely account-agnostic. For instance, if your app calls the [Microsoft Graph](https://graph.microsoft.io), some additional functionality and data will be available to enterprise users, such as their SharePoint sites or Directory data. But for many actions, such as [Reading a user's mail](https://graph.microsoft.io/docs/api-reference/v1.0/resources/message), the same code can access the email for both personal and work and school accounts.

You can use a single set of endpoints and single library (MSAL) to gain access to both the consumer, educational and enterprise worlds. To learn more about authentication libraries, see this article.

 The Azure AD v1.0 endpoint accepts sign-ins from work and school accounts only.

## Incremental and dynamic consent

Apps using the Azure AD v1.0 endpoint are required to specify their required OAuth 2.0 permissions in advance, for example:

![Permissions Registration UI](./media/azure-ad-endpoint-comparison/app_reg_permissions.png)

The permissions set directly on the application registration are **static**. While static permissions of the app defined in the Azure portal and kept the code nice and simple, it might present a few issues for developers:

* The app need know all of the permissions it would ever need at app creation time. Adding permissions over time was a difficult process.
* The app need to know all of the resources it would ever access ahead of time. It was difficult to create apps that could access an arbitrary number of resources.
* The app need to request all the permissions it would ever need upon the user's first sign-in. In some cases this led to a long list of permissions, which discouraged end users from approving the app's access on initial sign-in.

With the v2.0 endpoint, you can ignore the statically defined permissions defined in the app registration information in the Azure portal and specify the permissions your app needs **dynamically** at runtime, during regular use of your app, regardless of statically defined permissions in the application registration information.

To do so, you can specify the scopes your app needs at any given point in your application time by including the new scopes in the `scope` parameter when requesting an access token - without the need to pre-define them in the application registration information.

If the user has yet not consented to new scopes added to the request, they will be prompted to consent only to the new permissions. To learn more, you can read up on [permissions, consent, and scopes](v2-permissions-and-consent.md).

Allowing an app to request permissions dynamically through the `scope` parameter gives developers full control over your user's experience. If you wish, you can also choose to front load your consent experience and ask for all permissions in one initial authorization request. Or if your app requires a large number of permissions, you can choose to gather those permissions from the user incrementally, as they attempt to use certain features of your app over time.

A note is that - when an admin need to consent to the application permissions on behalf of the organization, it is still recommended that you set the static permissions in the app registration for apps using the v2.0 endpoint, so cycles requiring the intervention of an organization's admin are reduced.

## Scopes, not resources

For apps using the v1.0 endpoint, an app can behave as a **resource**, or a recipient of tokens. A resource can define a number of **scopes** or **oAuth2Permissions** that it understands, allowing client apps to request tokens to that resource for a certain set of scopes. Consider the Azure AD Graph API as an example of a resource:

* Resource Identifier, or `AppID URI`: `https://graph.windows.net/`
* Scopes, or `OAuth2Permissions`: `Directory.Read`, `Directory.Write`, and so on.

All of this holds true for the v2.0 endpoint. An app can still behave as resource, define scopes, and be identified by a URI. Client apps can still request access to those scopes. However, the way that a client requests those permissions has changed. For the v1.0 endpoint, an OAuth 2.0 authorize request to Azure AD might have looked like:

```text
GET https://login.microsoftonline.com/common/oauth2/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e
&resource=https://graph.windows.net/
...
```

where the **resource** parameter indicated which resource the client app is requesting authorization for. Azure AD computed the permissions required by the app based on static configuration in the Azure portal, and issued tokens accordingly. For applications using the v2.0 endpoint, the same OAuth 2.0 authorize request looks like:

```text
GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e
&scope=https://graph.windows.net/directory.read%20https://graph.windows.net/directory.write
...
```

Where the **scope** parameter indicates which resource and permissions the app is requesting authorization for. The desired resource is still present in the request - it is simply encompassed in each of the values of the scope parameter. Using the scope parameter in this manner allows the v2.0 endpoint to be more compliant with the OAuth 2.0 specification, and aligns more closely with common industry practices. It also enables apps to perform [incremental consent](#incremental-and-dynamic-consent), which is described earlier.

## Well-known scopes

### Offline access

Apps using the v2.0 endpoint may require the use of a new well-known permission for apps - the `offline_access` scope. All apps will need to request this permission if they need to access resources on the behalf of a user for a prolonged period of time, even when the user may not be actively using the app. The `offline_access` scope will appear to the user in consent dialogs as "Access your data anywhere", which the user must agree to. Requesting the `offline_access` permission will enable your web app to receive OAuth 2.0 refresh_tokens from the v2.0 endpoint. Refresh_tokens are long-lived, and can be exchanged for new OAuth 2.0 access_tokens for extended periods of access.

If your app does not request the `offline_access` scope, it will not receive refresh_tokens. This means that when you redeem an authorization_code in the OAuth 2.0 authorization code flow, you will only receive back an access_token from the `/token` endpoint. That access_token will remain valid for a short period of time (typically one hour), but will eventually expire. At that point in time, your app will need to redirect the user back to the `/authorize` endpoint to retrieve a new authorization_code. During this redirect, the user may or may not need to enter their credentials again or re-consent to permissions, depending on the type of app.

To learn more about OAuth 2.0, refresh_tokens, and access_tokens, check out the [v2.0 protocol reference](active-directory-v2-protocols.md).

### OpenID, profile, and email

Historically, the most basic OpenID Connect sign-in flow with Azure AD would provide a lot of information about the user in the resulting *id_token*. The claims in an *id_token* can include the user's name, preferred username, email address, object ID, and more.

The information that the `openid` scope affords your app access to is now restricted. The `openid` scope will only allow your app to sign in the user and receive an app-specific identifier for the user. If you want to obtain personal data about the user in your app, your app will need to request additional permissions from the user. Two new scopes – the `email` and `profile` scopes – will allow you to request additional permissions.

The `email` scope allows your app access to the user’s primary email address through the `email` claim in the id_token. The `profile` scope affords your app access to all other basic information about the user – their name, preferred username, object ID, and so on.

This allows you to code your app in a minimal-disclosure fashion – you can only ask the user for the set of information that your app requires to do its job. For more information on these scopes, see [the v2.0 scope reference](v2-permissions-and-consent.md).

## Token Claims

The claims in tokens issued by the v2.0 endpoint will not be identical to tokens issued by the generally available Azure AD endpoints. Apps migrating to the new service should not assume a particular claim will exist in id_tokens or access_tokens. To learn about the specific claims emitted in v2.0 tokens, see the [v2.0 token reference](v2-id-and-access-tokens.md).

## Limitations

There are a few restrictions to be aware of when using v2.0. To learn if any of these restrictions apply to your particular scenario, see the [v2.0 limitations doc](active-directory-v2-limitations.md).
