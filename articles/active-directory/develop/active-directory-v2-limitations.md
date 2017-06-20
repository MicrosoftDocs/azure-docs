---
title: Azure Active Directory v2.0 endpoint limitations and restrictions | Microsoft Docs
description: A list of limitations and restrictions for the Azure AD v2.0 endpoint.
services: active-directory
documentationcenter: ''
author: dstrockis
manager: mbaldwin
editor: ''

ms.assetid: a99289c0-e6ce-410c-94f6-c279387b4f66
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/01/2017
ms.author: dastrock
ms.custom: aaddev

---
# Should I use the v2.0 endpoint?
When you build applications that integrate with Azure Active Directory, you need to decide whether the v2.0 endpoint and authentication protocols meet your needs. Azure Active Directory's original endpoint is still fully supported and, in some respects, is more feature rich than v2.0. However, the v2.0 endpoint [introduces significant benefits](active-directory-v2-compare.md) for developers.

Here's our simplified recommendation for developers at this point in time:

* If you must support personal Microsoft accounts in your application, use the v2.0 endpoint. But before you do, be sure that you understand the limitations that we discuss in this article.
* If your application only needs to support Microsoft work and school accounts, don't use the v2.0 endpoint. Instead, refer to our [Azure AD developer guide](active-directory-developers-guide.md).

Over time, the v2.0 endpoint will grow to eliminate the restrictions listed here, so that you will only ever need to use the v2.0 endpoint. In the meantime, this article is intended to help you determine whether the v2.0 endpoint is right for you. We will continue to update this article to reflect the current state of the v2.0 endpoint. Check back to reevaluate your requirements against v2.0 capabilities.

If you have an existing Azure AD app that does not use the v2.0 endpoint, there's no need to start from scratch. In the future, we will provide a way for you to use your existing Azure AD applications with the v2.0 endpoint.

## Restrictions on app types
Currently, the following types of apps are not supported by the v2.0 endpoint. For a description of supported app types, see [App types for the Azure Active Directory v2.0 endpoint](active-directory-v2-flows.md).

### Standalone Web APIs
You can use the v2.0 endpoint to [build a Web API that is secured with OAuth 2.0](active-directory-v2-flows.md#web-apis). However, that Web API can receive tokens only from an application that has the same Application ID. You cannot access a Web API from a client that has a different Application ID. The client won't be able to request or obtain permissions to your Web API.

To see how to build a Web API that accepts tokens from a client that has the same Application ID, see the v2.0 endpoint Web API samples in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

## Restrictions on app registrations
Currently, for each app that you want to integrate with the v2.0 endpoint, you must create an app registration in the new [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList). Existing Azure AD or Microsoft account apps are not compatible with the v2.0 endpoint. Apps that are registered in any portal other than the Application Registration Portal are not compatible with the v2.0 endpoint. In the future, we plan to provide a way to use an existing application as a v2.0 app. Currently, though, there is no migration path for an existing app to work with the v2.0 endpoint.

In addition, app registrations that you create in the [Application Registration Portal](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList) have the following caveats:

* Only two app secrets are allowed per Application ID.
* An app registration registered by a user with a personal Microsoft account can be viewed and managed only by a single developer account. It cannot be shared between multiple developers.  If you would like to share your app registration amongst multiple developers, you can create the application by signing into the registration portal with an Azure AD account.
* There are several restrictions on the format of the redirect URI that is allowed. For more information about redirect URIs, see the next section.

## Restrictions on redirect URIs
Currently, apps that are registered in the Application Registration Portal are restricted to a limited set of redirect URI values. The redirect URI for web apps and services must begin with the scheme `https`, and all redirect URI values must share a single DNS domain. For example, you cannot register a web app that has one of these redirect URIs:

`https://login-east.contoso.com`  
`https://login-west.contoso.com`

The registration system compares the whole DNS name of the existing redirect URI to the DNS name of the redirect URI that you are adding. The request to add the DNS name will fail if either of the following conditions is true:  

* The whole DNS name of the new redirect URI does not match the DNS name of the existing redirect URI.
* The whole DNS name of the new redirect URI is not a subdomain of the existing redirect URI.

For example, if the app has this redirect URI:

`https://login.contoso.com`

You can add to it, like this:

`https://login.contoso.com/new`

In this case, the DNS name matches exactly. Or, you can do this:

`https://new.login.contoso.com`

In this case, you're referring to a DNS subdomain of login.contoso.com. If you want to have an app that has login-east.contoso.com and login-west.contoso.com as redirect URIs, you must add those redirect URIs in this order:

`https://contoso.com`  
`https://login-east.contoso.com`  
`https://login-west.contoso.com`  

You can add the latter two because they are subdomains of the first redirect URI, contoso.com. This limitation will be removed in an upcoming release.

To learn how to register an app in the Application Registration Portal, see [How to register an app with the v2.0 endpoint](active-directory-v2-app-registration.md).

## Restrictions on services and APIs
Currently, the v2.0 endpoint supports sign-in for any app that is registered in the Application Registration Portal, and which falls in the list of [supported authentication flows](active-directory-v2-flows.md). However, these apps can acquire OAuth 2.0 access tokens for a very limited set of resources. The v2.0 endpoint issues access tokens only for:

* The app that requested the token. An app can acquire an access token for itself, if the logical app is composed of several different components or tiers. To see this scenario in action, check out our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) tutorials.
* The Outlook Mail, Calendar, and Contacts REST APIs, all of which are located at https://outlook.office.com. To learn how to write an app that accesses these APIs, see the [Office Getting Started](https://www.msdn.com/office/office365/howto/authenticate-Office-365-APIs-using-v2) tutorials.
* Microsoft Graph APIs. You can learn more about [Microsoft Graph](https://graph.microsoft.io) and the data that is available to you.

No other services are supported at this time. More Microsoft Online Services will be added in the future, in addition to support for your own custom-built Web APIs and services.

## Restrictions on libraries and SDKs
Currently, library support for the v2.0 endpoint is limited. If you want to use the v2.0 endpoint in a production application, you have these options:

* If you are building a web application, you can safely use Microsoft generally available server-side middleware to perform sign-in and token validation. These include the OWIN Open ID Connect middleware for ASP.NET and the Node.js Passport plug-in. For code samples that use Microsoft middleware, see our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.
* If you are building a desktop or mobile application, you can use one of our preview Microsoft Authentication Libraries (MSAL).  These libraries are in a production-supported preview, so it is safe to use them in production applications. You can read more about the terms of the preview and the available libraries in our [authentication libraries reference](active-directory-v2-libraries.md).
* For platforms not covered by Microsoft libraries, you can integrate with the v2.0 endpoint by directly sending and receiving protocol messages in your application code. The v2.0 OpenID Connect and OAuth protocols [are explicitly documented](active-directory-v2-protocols.md) to help you perform such an integration.
* Finally, you can use open-source Open ID Connect and OAuth libraries to integrate with the v2.0 endpoint. The v2.0 protocol should be compatible with many open-source protocol libraries without major changes. The availability of these kinds of libraries varies by language and platform. The [Open ID Connect](http://openid.net/connect/) and [OAuth 2.0](http://oauth.net/2/) websites maintain a list of popular implementations. For more information, see [Azure Active Directory v2.0 and authentication libraries](active-directory-v2-libraries.md), and the list of open-source client libraries and samples that have been tested with the v2.0 endpoint.

## Restrictions on protocols
The v2.0 endpoint does not support SAML or WS-Federation; it only supports Open ID Connect and OAuth 2.0.  Not all features and capabilities of OAuth protocols have been incorporated into the v2.0 endpoint. These protocol features and capabilities currently are *not available* in the v2.0 endpoint:

* ID tokens that are issued by the v2.0 endpoint do not contain an `email` claim for the user, even if you acquire permission from the user to view their email.
* The OpenID Connect UserInfo endpoint is not implemented on the v2.0 endpoint. However, all user profile data that you potentially would receive at this endpoint is available from the Microsoft Graph `/me` endpoint.
* The v2.0 endpoint does not support issuing role or group claims in ID tokens.
* The [OAuth 2.0 Resource Owner Password Credentials Grant](https://tools.ietf.org/html/rfc6749#section-4.3) is not supported by the v2.0 endpoint.

In addtion, the v2.0 endpoint does not support any form of the SAML or WS-Federation protocols.

To better understand the scope of protocol functionality supported in the v2.0 endpoint, read through our [OpenID Connect and OAuth 2.0 protocol reference](active-directory-v2-protocols.md).

## Restrictions for work and school accounts
If you've used Active Directory Authentication Library (ADAL) in Windows applications, you might have taken advantage of Windows integrated authentication, which uses the Security Assertion Markup Language (SAML) assertion grant. With this grant, users of federated Azure AD tenants can silently authenticate with their on-premises Active Directory instance without entering credentials. Currently, the SAML assertion grant is not supported on the v2.0 endpoint.