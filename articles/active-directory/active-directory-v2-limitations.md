<properties
	pageTitle="v2.0 Endpoint Limitations & restrictions | Microsoft Azure"
	description="A list of limitations & restrictions with the Azure AD v2.0 endpoint."
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
	ms.date="09/27/2016"
	ms.author="dastrock"/>

# Should I use the v2.0 endpoint?

When building applications that integrate with Azure Active Directory, you'll need to decide whether the v2.0 endpoint and authentication protocols meet your needs.  The original Azure AD endpoint is still fully supported and in some respects, is more feature rich than v2.0.  However, the v2.0 endpoint [introduces significant benefits](active-directory-v2-compare.md) for developers that may entice you to use the new programming model.

At this point in time, our recommendation on use of the v2.0 endpoint is as follows:

- If you want to support personal Microsoft accounts in your application, you should use the v2.0 endpoint.  But make sure to understand the limitations listed in this article, especially those pertaining specifically to work & school accounts.
- If your application only requires supporting work & school accounts, you should use [the original Azure AD endpoints](active-directory-developers-guide.md).

Over time, the v2.0 endpoint will grow to eliminate the restrictions listed here, so that you will only ever need to use the v2.0 endpoint.  In the meantime, this article is intended to help you determine if the v2.0 endpoint is for you.  We will continue to update this article over time to reflect the current state of the v2.0 endpoint, so check back to reevaluate your requirements against the v2.0 capabilities.

If you have an existing app with Azure AD that does not use the v2.0 endpoint, there's no need to start from scratch.  In the future, we will be providing a way for you to enable your existing Azure AD applications for use with the v2.0 endpoint.

## Restrictions on apps
The following types of apps are not currently supported by the v2.0 endpoint.  For a description of the supported types of apps, refer to [this article](active-directory-v2-flows.md).

##### Standalone Web APIs
With the v2.0 endpoint, you have the ability to [build a Web API that is secured using OAuth 2.0](active-directory-v2-flows.md#web-apis).  However, that Web API will only be able to receive tokens from an application that shares the same Application Id.  Building a web API that is accessed from a client with a different Application Id is not supported.  That client will not be able to request or obtain permissions to your web API.

To see how to build a Web API that accepts tokens from a client with the same App Id, see the v2.0 endpoint Web API samples in [Getting Started](active-directory-appmodel-v2-overview.md#getting-started).

##### Web API On-Behalf-Of Flow
Many architectures include a Web API that needs to call another downstream Web API, both secured by the v2.0 endpoint.  This scenario is common in native clients that have a Web API backend, which in turn calls a Microsoft online service or another custom built web API that supports Azure AD.

This scenario can be supported using the OAuth 2.0 Jwt Bearer Credential grant, otherwise known as the On-Behalf-Of Flow.  However, the On-Behalf-Of flow is not currently supported for the v2.0 endpoint.  To see how this flow works in the generally available Azure AD service, check out the [On-Behalf-Of code sample on GitHub](https://github.com/AzureADSamples/WebAPI-OnBehalfOf-DotNet).

## Restrictions on app registrations
At this point in time, all apps that want to integrate with the v2.0 endpoint must create a new app registration at [apps.dev.microsoft.com](https://apps.dev.microsoft.com).  Any existing Azure AD or Microsoft Account apps will not be compatible with the v2.0 endpoint, nor will apps registered in any portal besides the new App Registration Portal.  We plan to provide a way to enable existing applications for use as a v2.0 app. At this time though, there is no migration path for an app to the v2.0 endpoint.

Similarly, apps registered in the new App Registration Portal will not work against the original Azure AD authentication endpoint.  You can, however, use apps created in the App Registration Portal to integrate successfully with the Microsoft account authentication endpoint, `https://login.live.com`.

In addition, app registrations created at [apps.dev.microsoft.com](https://apps.dev.microsoft.com) have the following caveats:

- The **homepage** property, also known as the **sign-on URL** is not supported.  Without a homepage, these applications will not be displayed in the Office MyApps panel.
- Only two app secrets are allowed per application Id at this time.
- An app registration can only be viewed and managed by a single developer account.  It cannot be shared between multiple developers.
- There are several restrictions on the format of redirect_uri allowed.  See the following section for more details.

## Restrictions on Redirect URIs
Apps that are registered in the new Application Registration Portal are currently restricted to a limited set of redirect_uri values.  The redirect_uri for web apps and services must begin with the scheme `https`, and all redirect_uri values must share a single DNS domain.  For example, it is not possible to register a web app that has redirect_uris:

`https://login-east.contoso.com`  
`https://login-west.contoso.com`

The registration system compares the whole DNS name of the existing redirect_uri with the DNS name of the redirect_uri you are adding. The request to add the DNS name will fail if either of the following conditions are met:  

- If the whole DNS name of the new redirect_uri does not match the DNS name of the existing redirect_uri
- if the whole DNS name of the new redirect_uri is not a subdomain of the existing redirect_uri

For example, if the app currently has redirect_uri:

`https://login.contoso.com`

Then it is possible to add:

`https://login.contoso.com/new`

which exactly matches the DNS name, or:

`https://new.login.contoso.com`

which is a DNS subdomain of login.contoso.com.  If you want to have an app that has login-east.contoso.com and login-west.contoso.com as redirect_uris, then you must add the following redirect_uris in order:

`https://contoso.com`  
`https://login-east.contoso.com`  
`https://login-west.contoso.com`  

The latter two can be added because they are subdomains of the first redirect_uri, contoso.com. This limitation will be removed in an upcoming release.

To learn how to register an app in the new Application Registration Portal, refer to [this article](active-directory-v2-app-registration.md).

## Restrictions on services & APIs
The v2.0 endpoint currently supports sign-in for any app registered in the new Application Registration Portal, provided it falls into the list of [supported authentication flows](active-directory-v2-flows.md).  However, these apps will only be able to acquire OAuth 2.0 access tokens for a very limited set of resources.  The v2.0 endpoint will only issue access_tokens for:

- The app that requested the token.  An app can acquire an access_token for itself, if the logical app is composed of several different components or tiers.  To see this scenario in action, check out our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) tutorials.
- The Outlook Mail, Calendar, and Contacts REST APIs, all of which are located at https://outlook.office.com.  To learn how to write an app that accesses these APIs, refer to these [Office Getting Started](https://www.msdn.com/office/office365/howto/authenticate-Office-365-APIs-using-v2) tutorials.
- The Microsoft Graph APIs.  To learn about the Microsoft Graph and all the data that is available, visit [https://graph.microsoft.io](https://graph.microsoft.io).

No other services are supported at this time.  More Microsoft Online services will be added in the future, as well as support for your own custom built Web APIs and services.

## Restrictions on libraries & SDKs
Library support for the v2.0 endpoint is fairly limited at this time.  If you want to use the v2.0 endpoint in a production application, you have the following options:

- If you are building a web application, you can safely use our generally available server-side middleware to perform sign in and token validation.  These include the OWIN Open ID Connect middleware for ASP.NET and our NodeJS Passport plugin.  Code samples using our middleware are available in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section as well.
- For other platforms and for native & mobile applications, you can also integrate with the v2.0 endpoint by directly sending & receiving protocol messages in your application code.  The v2.0 OpenID Connect and OAuth protocols [have been explicitly documented](active-directory-v2-protocols.md) to help you perform such an integration.
- Finally, you can use open source Open ID Connect and OAuth libraries to integrate with the v2.0 endpoint.  The v2.0 protocol should be compatible with many open source protocol libraries without major changes.  The availability of such libraries varies per language and platform, and the [Open ID Connect](http://openid.net/connect/) and [OAuth 2.0](http://oauth.net/2/) websites maintain a list of popular implementations. See [Azure Active Directory (AD) v2.0 and authentication libraries](active-directory-v2-libraries.md) for more details, and the list of open source client libraries and samples that have been tested with the v2.0 endpoint.

We have also released an initial preview of the [Microsoft Authentication Library (MSAL)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) for .NET only.  You are welcome to try out this library in .NET client and server applications, but as a preview library it will not be accompanied by GA-quality support.

## Restrictions on protocols
The v2.0 endpoint only supports Open ID Connect & OAuth 2.0.  However, not all features and capabilities of each protocol have been incorporated into the v2.0 endpoint, including:

- The OpenID Connect `end_session_endpoint`, which allows an app to end the user's session with the v2.0 endpoint.
- id_tokens issued by the v2.0 endpoint only contain a pairwise identifier for the user.  This means that two different applications will receive different IDs for the same user.  Note that by querying the Microsoft Graph `/me` endpoint, you will be able to get a correlatable ID for the user that can be used across applications.
- id_tokens issued by the v2.0 endpoint do not contain an `email` claim for the user at this time, even if you acquire permission from the user to view their email.
- The OpenID Connect User Info endpoint. The User Info endpoint is not implemented on the v2.0 endpoint at this time.  However, all user profile data you would potentially receive at this endpoint is available from the Microsoft Graph `/me` endpoint.
- Role & Group claims.  At this time, the v2.0 endpoint does not support issuing role or group claims in id_tokens.

To better understand the scope of protocol functionality supported in the v2.0 endpoint, read through our [OpenID Connect & OAuth 2.0 Protocol Reference](active-directory-v2-protocols.md).

## Restrictions for work & school accounts
There are a few features specific to Microsoft organization/business users that are not yet supported by the v2.0 endpoint.

##### Device-based conditional access, native and mobile apps, and the Microsoft Graph
The v2.0 endpoint does not yet support device authentication for mobile and native applications, such as native apps running on iOS or Android.  This could block your native application from calling the Microsoft Graph for certain organizations.  Device authentication is required when an administrator sets a device-based conditional access policy on an application.  For the v2.0 endpoint, the most likely scenario for device-based conditional access is an administrator setting a policy on a resource in the Microsoft Graph, such as the Outlook API.  If an administrator sets this policy and your native application requests a token to the Microsoft Graph, the request will ultimately fail because device authentication is not yet supported.  Web applications that request tokens to the Microsoft Graph, however, are supported when device-based policies are configured.  In the web app scenario device authentication is performed through the user’s web browser.

As a developer, you most likely have no control over when policies are set on Microsoft Graph resources, or even aware when it happens.  If you are building an application for work and school users, you should use [the original Azure AD endpoint](active-directory-developers-guide.md) until the v2.0 endpoint supports device authentication.  For more information about device-based conditional access, check out [this article](active-directory-conditional-access.md#device-based-conditional-access).

##### Windows integrated authentication for federated tenants
If you've used ADAL (and therefore the original Azure AD endpoint) in Windows applications, you may have taken advantage of what is known as the SAML assertion grant.  This grant allows users of federated Azure AD tenants to silently authenticate with their on-premise Active Directory instance without having to enter their credentials.  The SAML assertion grant is currently not supported on the v2.0 endpoint.
