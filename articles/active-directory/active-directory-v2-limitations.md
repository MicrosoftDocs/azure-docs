<properties
	pageTitle="Azure Active Directory v2.0 endpoint limitations and restrictions | Microsoft Azure"
	description="A list of limitations and restrictions for the Azure AD v2.0 endpoint."
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/30/2016"
	ms.author="dastrock"/>

# Should I use the v2.0 endpoint?

When you build applications that integrate with Azure Active Directory (Azure AD), you need to decide whether the v2.0 endpoint and authentication protocols meet your needs. The original Azure AD endpoint is still fully supported and, in some respects, is more feature rich than v2.0. However, the v2.0 endpoint [introduces significant benefits](active-directory-v2-compare.md) for developers. The benefits of v2.0 might entice you to use the new programming model.

Here's our recommendation for using the v2.0 endpoint now:

- If you want to support personal Microsoft accounts in your application, use the v2.0 endpoint. Before you do, be sure that you understand the limitations that we discuss in this article, especially those that apply to work and school accounts.
- If your application needs to support only work and school accounts, use [the original Azure AD endpoints](active-directory-developers-guide.md).

Over time, the v2.0 endpoint will grow to eliminate the restrictions listed here, so that you will only ever need to use the v2.0 endpoint. In the meantime, this article is intended to help you determine whether the v2.0 endpoint is right for you. We will continue to update this article to reflect the current state of the v2.0 endpoint. Check back to reevaluate your requirements against v2.0 capabilities.

If you have an existing Azure AD app that does not use the v2.0 endpoint, there's no need to start from scratch. In the future, we will provide a way for you to use your existing Azure AD applications with the v2.0 endpoint.

## Restrictions on app types
Currently, the following types of apps are not supported by the v2.0 endpoint. For a description of supported app types, see [App types for the Azure Active Directory v2.0 endpoint](active-directory-v2-flows.md).

### Standalone Web APIs
You can use the v2.0 endpoint to [build a Web API that is secured with OAuth 2.0](active-directory-v2-flows.md#web-apis). However, that Web API can receive tokens only from an application that has the same Application ID. You cannot access a Web API from a client that has a different Application ID. The client won't be able to request or obtain permissions to your Web API.

To see how to build a Web API that accepts tokens from a client that has the same Application ID, see the v2.0 endpoint Web API samples in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

### Web API on-behalf-of flow
Many architectures include a Web API that needs to call another downstream Web API, both secured by the v2.0 endpoint. This scenario is common in native clients that have a Web API back end, which in turn calls an instance of Microsoft Online Services or another custom-built Web API that supports Azure AD.

You can create this scenario by using the OAuth 2.0 JSON Web Token (JWT) bearer credential grant, otherwise known as the on-behalf-of flow. Currently, however, the on-behalf-of flow is not supported for the v2.0 endpoint. To see how this flow works in the generally available Azure AD service, check out the [on-behalf-of code sample on GitHub](https://github.com/AzureADSamples/WebAPI-OnBehalfOf-DotNet).

## Restrictions on app registrations
Currently, for each app that you want to integrate with the v2.0 endpoint, you must create an app registration in the new [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList). Existing Azure AD or Microsoft account apps are not compatible with the v2.0 endpoint. Apps that are registered in any portal other than the Application Registration Portal are not compatible with the v2.0 endpoint. In the future, we plan to provide a way to use an existing application as a v2.0 app. Currently, though, there is no migration path for an existing app to work with the v2.0 endpoint.

Apps that are registered in the Application Registration Portal will not work with the original Azure AD authentication endpoint. However, you can use apps that you create in the Application Registration Portal to integrate successfully with the Microsoft account authentication endpoint `https://login.live.com`.

In addition, app registrations that you create in the [Application Registration Portal](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList) have the following caveats:

- The **homepage** property, also known as the *sign-on URL*, is not supported. Without a homepage, these applications will not appear in the Office MyApps panel.
- Currently, only two app secrets are allowed per Application ID.
- An app registration can be viewed and managed only by a single developer account. It cannot be shared between multiple developers.
- There are several restrictions on the format of the redirect URI that is allowed. For more information about redirect URIs, see the next section.

## Restrictions on redirect URIs
Currently, apps that are registered in the Application Registration Portal are restricted to a limited set of redirect URI values. The redirect URI for web apps and services must begin with the scheme `https`, and all redirect URI values must share a single DNS domain. For example, you cannot register a web app that has one of these direct URIs:

`https://login-east.contoso.com`  
`https://login-west.contoso.com`

The registration system compares the whole DNS name of the existing redirect URI to the DNS name of the redirect URI that you are adding. The request to add the DNS name will fail if either of the following conditions is true:  

- The whole DNS name of the new redirect URI does not match the DNS name of the existing redirect URI
- The whole DNS name of the new redirect URI is not a subdomain of the existing redirect URI

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

- the app that requested the token. An app can acquire an access token for itself, if the logical app is composed of several different components or tiers. To see this scenario in action, check out our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) tutorials.
- the Outlook Mail, Calendar, and Contacts REST APIs, all of which are located at https://outlook.office.com. To learn how to write an app that accesses these APIs, see the [Office Getting Started](https://www.msdn.com/office/office365/howto/authenticate-Office-365-APIs-using-v2) tutorials.
- Microsoft Graph APIs. You can learn more about [Microsoft Graph](https://graph.microsoft.io) and the data that is available to you.

No other services are supported at this time. More Microsoft Online Services will be added in the future, in addition to support for your own custom-built Web APIs and services.

## Restrictions on libraries and SDKs
Currently, library support for the v2.0 endpoint is limited. If you want to use the v2.0 endpoint in a production application, you have these options:

- If you are building a web application, you can safely use Microsoft generally available server-side middleware to perform sign-in and token validation. These include the OWIN Open ID Connect middleware for ASP.NET and the NodeJS Passport plug-in. For code samples that use Microsoft middleware, see our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.
- For other platforms, and for native and mobile applications, you can integrate with the v2.0 endpoint by directly sending and receiving protocol messages in your application code. The v2.0 OpenID Connect and OAuth protocols [are explicitly documented](active-directory-v2-protocols.md) to help you perform such an integration.
- Finally, you can use open-source Open ID Connect and OAuth libraries to integrate with the v2.0 endpoint. The v2.0 protocol should be compatible with many open-source protocol libraries without major changes. The availability of these kinds of libraries varies by language and platform. The [Open ID Connect](http://openid.net/connect/) and [OAuth 2.0](http://oauth.net/2/) websites maintain a list of popular implementations. For more information, see [Azure Active Directory v2.0 and authentication libraries](active-directory-v2-libraries.md), and the list of open-source client libraries and samples that have been tested with the v2.0 endpoint.

We have released an initial preview of the [Microsoft Authentication Library (MSAL)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) only for .NET. You are welcome to try out this library in .NET client and server applications, but as a preview library, it is not accompanied by general availability (GA)-quality support.

## Restrictions on protocols
The v2.0 endpoint supports only Open ID Connect and OAuth 2.0. However, not all features and capabilities of each protocol have been incorporated into the v2.0 endpoint.

These typical protocol features and capabilities currently are *not available* in the v2.0 endpoint:

- The OpenID Connect `end_session_endpoint` parameter, which allows an app to end the user's session, is not available with the v2.0 endpoint.
- ID tokens that are issued by the v2.0 endpoint have only a pairwise identifier for the user. This means that two different applications receive different IDs for the same user. Note that by querying the Microsoft Graph `/me` endpoint, you can get a correlatable ID for the user that you can use across applications.
- ID tokens that are issued by the v2.0 endpoint do not contain an `email` claim for the user, even if you acquire permission from the user to view their email.
- The OpenID Connect UserInfo endpoint is not implemented on the v2.0 endpoint. However, all user profile data that you potentially would receive at this endpoint is available from the Microsoft Graph `/me` endpoint.
- The v2.0 endpoint does not support issuing role or group claims in ID tokens.

To better understand the scope of protocol functionality supported in the v2.0 endpoint, read through our [OpenID Connect and OAuth 2.0 protocol reference](active-directory-v2-protocols.md).

## Restrictions for work and school accounts
A few features that are specific to Microsoft enterprise users are not yet supported by the v2.0 endpoint. For more information, read the next sections.

### Device-based conditional access, native and mobile apps, and Microsoft Graph
The v2.0 endpoint does not yet support device authentication for mobile and native applications, such as native apps running on iOS or Android. For some organizations, this might block your native application from calling Microsoft Graph. Device authentication is required when an administrator sets a device-based conditional access policy on an application. For the v2.0 endpoint, the most likely scenario for device-based conditional access is if an administrator were to set a policy on a resource in Microsoft Graph, such as the Outlook API. If an administrator sets this policy and your native application requests a token to Microsoft Graph, the request ultimately will fail because device authentication is not yet supported. Web applications that request tokens to Microsoft Graph, however, are supported when device-based policies are configured. In the web app scenario, device authentication is performed through the user’s web browser.

As a developer, you most likely have no control of when policies are set on Microsoft Graph resources. You might not even be aware when it happens. If you are building an application for work and school users, you should use [the original Azure AD endpoint](active-directory-developers-guide.md) until the v2.0 endpoint supports device authentication. You can learn more about [device-based conditional access in Azure AD](active-directory-conditional-access.md#device-based-conditional-access).

### Windows integrated authentication for federated tenants
If you've used Active Directory Authentication Library (ADAL) (with the original Azure AD endpoint) in Windows applications, you might have taken advantage of what is known as the Security Assertion Markup Language (SAML) assertion grant. With this grant, users of federated Azure AD tenants can silently authenticate with their on-premises Active Directory instance without entering credentials. Currently, the SAML assertion grant is not supported on the v2.0 endpoint.
