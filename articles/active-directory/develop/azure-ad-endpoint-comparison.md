---
title: What is different in v2.0? | Azure
description: Comparison between the Azure AD v1.0 and the Azure AD v2.0 endpoints.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 5060da46-b091-4e25-9fa8-af4ae4359b6c
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/01/2017
ms.author: celested
ms.reviewer: elisol, jmprieur, hirsin
ms.custom: aaddev
---

# What's different about v2.0?

If you're familiar with Azure Active Directory (Azure AD) or have integrated apps with Azure AD in the past, there are some differences in the v2.0 endpoint that may not expect. This article calls out the differences for your understanding.

> [!NOTE]
> Not all Azure AD scenarios and features are supported by the v2.0 endpoint. To determine if you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

## Microsoft accounts and Azure AD accounts

The v2.0 endpoint allows developers to write apps that accept sign-in from both Microsoft Accounts and Azure AD accounts, using a single auth endpoint. This gives you the ability to write your app completely account-agnostic, which means the app can be ignorant of the type of account that the user signs in with. You can make your app aware of the type of account being used in a particular session, but you don't have to.

For instance, if your app calls the [Microsoft Graph](https://graph.microsoft.io), some additional functionality and data will be available to enterprise users, such as their SharePoint sites or Directory data. But for many actions, such as [Reading a user's mail](https://graph.microsoft.io/docs/api-reference/v1.0/resources/message), the code can be written exactly the same for both Microsoft Accounts and Azure AD accounts.

Integrating your app with Microsoft Accounts and Azure AD accounts is now one simple process. You can use a single set of endpoints, a single library, and a single app registration to gain access to both the consumer and enterprise worlds. To learn more about the v2.0 endpoint, check out [the overview](active-directory-appmodel-v2-overview.md).

## New app registration portal

To register an app that works with the v2.0 endpoint, you must use the Microsoft app registration portal: [apps.dev.microsoft.com](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList). This is the portal where you can obtain an application ID, customize the appearance of your app's sign-in page, and more. All you need to access the portal is a Microsoft powered account - either personal or work/school account.

## One app ID for all platforms

If you've used Azure AD, you've probably registered several different apps for a single project. For example, if you built both a website and an iOS app, you had to register them separately, using two different Application Ids. The Azure AD app registration portal forced you to make this distinction during registration:

![Old Application Registration UI](./media/azure-ad-endpoint-comparison/old_app_registration.PNG)

Similarly, if you had a website and a backend web API, you might have registered each as a separate app in Azure AD. Or if you had an iOS app and an Android app, you also might have registered two different apps. Registering each component of an application led to some unexpected behaviors for developers and their customers:

* Each component appeared as a separate app in the Azure AD tenant of each customer.
* When a tenant administrator attempted to apply policy to, manage access to, or delete an app, they would have to do so for each component of the app.
* When customers consented to an application, each component would appear in the consent screen as a distinct application.

With the v2.0 endpoint, you can now register all components of your project as a single app registration, and use a single Application Id for your entire project. You can add several "platforms" to a each project, and provide the appropriate data for each platform you add. Of course, you can create as many apps as you like depending on your requirements, but for the majority of cases only one Application Id should be necessary.

Our aim is that this will lead to a more simplified app management and development experience, and create a more consolidated view of a single project that you might be working on.

## Scopes, not resources

In Azure AD, an app can behave as a **resource**, or a recipient of tokens. A resource can define a number of **scopes** or **oAuth2Permissions** that it understands, allowing client apps to request tokens to that resource for a certain set of scopes. Consider the Azure AD Graph API as an example of a resource:

* Resource Identifier, or `AppID URI`: `https://graph.windows.net/`
* Scopes, or `OAuth2Permissions`: `Directory.Read`, `Directory.Write`, and so on.

All of this holds true for the v2.0 endpoint. An app can still behave as resource, define scopes, and be identified by a URI. Client apps can still request access to those scopes. However, the way that a client requests those permissions has changed. In the past, an OAuth 2.0 authorize request to Azure AD might have looked like:

```
GET https://login.microsoftonline.com/common/oauth2/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e
&resource=https%3A%2F%2Fgraph.windows.net%2F
...
```

where the **resource** parameter indicated which resource the client app is requesting authorization for. Azure AD computed the permissions required by the app based on static configuration in the Azure portal, and issued tokens accordingly. Now, the same OAuth 2.0 authorize request looks like:

```
GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e
&scope=https%3A%2F%2Fgraph.windows.net%2Fdirectory.read%20https%3A%2F%2Fgraph.windows.net%2Fdirectory.write
...
```

where the **scope** parameter indicates which resource and permissions the app is requesting authorization for. The desired resource is still present in the request - it is simply encompassed in each of the values of the scope parameter. Using the scope parameter in this manner allows the v2.0 endpoint to be more compliant with the OAuth 2.0 specification, and aligns more closely with common industry practices. It also enables apps to perform [incremental consent](#incremental-and-dynamic-consent), which is described in the next section.

## Incremental and dynamic consent

Apps registered in Azure AD previously needed to specify their required OAuth 2.0 permissions in the Azure portal, at app creation time:

![Permissions Registration UI](./media/azure-ad-endpoint-comparison/app_reg_permissions.PNG)

The permissions an app required were configured **statically**. While this allowed configuration of the app to exist in the Azure portal and kept the code nice and simple, it presents a few issues for developers:

* An app had to know all of the permissions it would ever need at app creation time. Adding permissions over time was a difficult process.
* An app had to know all of the resources it would ever access ahead of time. It was difficult to create apps that could access an arbitrary number of resources.
* An app had to request all the permissions it would ever need upon the user's first sign-in. In some cases this led to a long list of permissions, which discouraged end users from approving the app's access on initial sign-in.

With the v2.0 endpoint, you can specify the permissions your app needs **dynamically**, at runtime, during regular usage of your app. To do so, you can specify the scopes your app needs at any given point in time by including them in the `scope` parameter of an authorization request:

```
GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e
&scope=https%3A%2F%2Fgraph.windows.net%2Fdirectory.read%20https%3A%2F%2Fgraph.windows.net%2Fdirectory.write
...
```

The above requests permission for the app to read an Azure AD user's directory data, as well as write data to their directory. If the user has consented to those permissions in the past for this particular app, they will enter their credentials and be signed into the app. If the user has not consented to any of these permissions, the v2.0 endpoint will ask the user for consent to those permissions. To learn more, you can read up on [permissions, consent, and scopes](v2-permissions-and-consent.md).

Allowing an app to request permissions dynamically through the `scope` parameter gives you full control over your user's experience. If you wish, you can choose to frontload your consent experience and ask for all permissions in one initial authorization request. Or if your app requires a large number of permissions, you can choose to gather those permissions from the user incrementally, as they attempt to use certain features of your app over time.

## Well-known scopes

### Offline access

Apps using the v2.0 endpoint may require the use of a new well-known permission for apps - the `offline_access` scope. All apps will need to request this permission if they need to access resources on the behalf of a user for a prolonged period of time, even when the user may not be actively using the app. The `offline_access` scope will appear to the user in consent dialogs as "Access your data offline", which the user must agree to. Requesting the `offline_access` permission will enable your web app to receive OAuth 2.0 refresh_tokens from the v2.0 endpoint. Refresh_tokens are long-lived, and can be exchanged for new OAuth 2.0 access_tokens for extended periods of access. 

If your app does not request the `offline_access` scope, it will not receive refresh_tokens. This means that when you redeem an authorization_code in the OAuth 2.0 authorization code flow, you will only receive back an access_token from the `/token` endpoint. That access_token will remain valid for a short period of time (typically one hour), but will eventually expire. At that point in time, your app will need to redirect the user back to the `/authorize` endpoint to retrieve a new authorization_code. During this redirect, the user may or may not need to enter their credentials again or re-consent to permissions, depending on the type of app.

To learn more about OAuth 2.0, refresh_tokens, and access_tokens, check out the [v2.0 protocol reference](active-directory-v2-protocols.md).

### OpenID, profile, and email

Historically, the most basic OpenID Connect sign-in flow with Azure AD would provide a lot of information about the user in the resulting id_token. The claims in an id_token can include the user's name, preferred username, email address, object ID, and more.

The information that the `openid` scope affords your app access to is now restricted. The `openid` scope will only allow your app to sign in the user and receive an app-specific identifier for the user. If you want to obtain personal data about the user in your app, your app will need to request additional permissions from the user. Two new scopes – the `email` and `profile` scopes – will allow you to request additional permissions.

The `email` scope allows your app access to the user’s primary email address through the `email` claim in the id_token. 

The `profile` scope affords your app access to all other basic information about the user – their name, preferred username, object ID, and so on.

This allows you to code your app in a minimal-disclosure fashion – you can only ask the user for the set of information that your app requires to do its job. For more information on these scopes, see [the v2.0 scope reference](v2-permissions-and-consent.md).

## Token Claims

The claims in tokens issued by the v2.0 endpoint will not be identical to tokens issued by the generally available Azure AD endpoints. Apps migrating to the new service should not assume a particular claim will exist in id_tokens or access_tokens. To learn about the specific claims emitted in v2.0 tokens, see the [v2.0 token reference](v2-id-and-access-tokens.md).

## Limitations

There are a few restrictions to be aware of when using v2.0. To learn if any of these restrictions apply to your particular scenario, see the [v2.0 limitations doc](active-directory-v2-limitations.md).
