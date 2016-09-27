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
	ms.date="03/18/2016"
	ms.author="dastrock"/>

# Should I use the v2.0 endpoint?

When building applications that integrate with Azure Active Directory, you will need to decide if the v2.0 endpoint and authentication protocols will meet your needs.  The original Azure AD app model is still fully supported and in some respects, is more feature rich than v2.0.  However, the v2.0 endpoint [introduces significant benefits](active-directory-v2-compare.md) for developers that may entice you to use the new programming model.  Over time, v2.0 will grow to encompass all Azure AD features, so that you will only ever need to use the v2.0 endpoint.

At this point in time, there are two core features that you can achieve with the v2.0 endpoint:

- Signing in users with personal and work accounts.
- Calling the [converged Outlook API](https://dev.outlook.com).

Both of these features can be implemented in web, mobile, and PC applications alike.  If these relatively limited features make sense for your application, then we recommend you use the v2.0 endpoint.  If your application requires any additional capabilities from Microsoft services, we recommend you continue to use the tried and true endpoints of Azure AD and Microsoft account.  In time, the v2.0 endpoints will superset the both Azure AD and Microsoft account and we’ll help all developers move over to the v2.0 endpoint.

In the meantime, this article is intended to help you determine if the v2.0 endpoint is for you.  We will continue to update this article over time to reflect the current state of the the v2.0 endpoint, so check back to re-evaluate your requirements against the v2.0 capabilities.

If you have an existing app with Azure AD that does not use the v2.0 endpoint, there's no need to start from scratch.  In the future we will be providing a way for you to enable your exisiting Azure AD applications for use with the v2.0 endpoint.

## Restrictions on apps
The following types of apps are not currently supported by the v2.0 endpoint.  For a description of the supported types of apps, refer to [this article](active-directory-v2-flows.md).

##### Standalone Web APIs
With the v2.0 endpoint, you have the ability to [build a Web API that is secured using OAuth 2.0](active-directory-v2-flows.md#web-apis).  However, that Web API will only be able to receive tokens from an application that shares the same Application Id.  Building a web API that is accessed from a client with a different Application Id is not supported.  That client will not be able to request or obtain permissions to your web API.

To see how to build a Web API that accepts tokens from a client with the same App Id, see the v2.0 endpoint Web API samples in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

##### Daemons/Server Side Apps
Apps that contain long running processes or that operate without the presence of a user also need a way to access secured resources, such as Web APIs.  These apps can authenticate and get tokens using the app's identity (rather than a user's delegated identity) using the OAuth 2.0 client credentials flow.  

This flow is not currently supported by the v2.0 endpoint - which is to say that apps can only get tokens after an interactive user sign-in flow has occurred.  The client credentials flow will be added in the near future.  If you would like to see the client credentials flow using the original Azure AD endpoint, check out the [Daemon sample on GitHub](https://github.com/AzureADSamples/Daemon-DotNet).

##### Web API On-Behalf-Of Flow
Many architectures include a Web API that needs to call another downstream Web API, both secured by the v2.0 endpoint.  This scenario is common in native clients that have a Web API backend, which in turn calls a Microsoft Online service or another custom built web API that supports Azure AD.

This scenario can be supported using the OAuth 2.0 Jwt Bearer Credential grant, otherwise known as the On-Behalf-Of Flow.  However, the On-Behalf-Of flow is not currently supported for the v2.0 endpoint.  To see how this flow works in the generally available Azure AD service, check out the [On-Behalf-Of code sample on GitHub](https://github.com/AzureADSamples/WebAPI-OnBehalfOf-DotNet).

## Restrictions on app registrations
At this point in time, all apps that want to integrate with the v2.0 endpoint must create a new app registration at [apps.dev.microsoft.com](https://apps.dev.microsoft.com).  Any existing Azure AD or Microsoft Account apps will not be compatible with the v2.0 endpoint, nor will apps registered in any portal besides the new App Registration Portal.  We plan to provide a way to enable existing applications for use as a v2.0 app, but at this time, there is no migration path for an app to the v2.0 endpoint.

Similarly, apps registered in the new App Registration Portal will not work against the original Azure AD authentication endpoint.  You can, however, use apps created in the App Registration Portal to integrate successfully with the Microsoft account authentication endpoint, `https://login.live.com`.

Apps that are registered in the new Application Registration Portal are currently restricted to a limited set of redirect_uri values.  The redirect_uri for web apps and services must begin with the scheme or `https`, while the redirect_uri for all other platforms must use the hard-coded value of `urn:ietf:oauth:2.0:oob`.

## Restrictions on Redirect URIs
For web apps, redirect_uri values must all share a single DNS domain.  For example, it is not possible to register a web app that has redirect_uris:

`https://login-east.contoso.com`  
`https://login-west.contoso.com`

The registration system compares the whole DNS name of the existing redirect_uri with the DNS name of the redirect_uri that you are adding.  If the whole DNS name of the new redirect_uri does not exactly match the DNS name of the existing redirect_uri, or if the whole DNS name of the new redirect_uri is not a sub-domain of the existing redirect_uri, the request to add will fail.  For example, if the app currently has redirect_uri:

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

- The app that requested the token.  An app can acquire an access_token for itself, if the logical app is comprised of several different components or tiers.  To see this scenario in action, check out our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) tutorials.
- The Outlook Mail, Calendar and Contacts REST APIs, all of which are located at https://outlook.office.com.  To learn how to write an app that accesses these APIs, refer to these [Office Getting Started](https://www.msdn.com/office/office365/howto/authenticate-Office-365-APIs-using-v2) tutorials.
- The Microsoft Graph APIs.  To learn about the Microsoft Graph and all the data that is available, visit [https://graph.microsoft.io](https://graph.microsoft.io).

No other services are supported at this time.  More Microsoft Online services will be added in the future, as well as support for your own custom built Web APIs and services.

## Restrictions on libraries & SDKs
To help you try things out, we have provided an experimental version of the Active Directory Authentcation Library that is compatible with the v2.0 endpoint.  However, this version of ADAL is in a preview state - it is not supported and it will change dramatically over the next few months.  There are code samples using ADAL for .NET, iOS, Android, and Javascript available in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section if you'd like to quickly get an app running with the v2.0 endpoint.

If you want to use the v2.0 endpoint in a production application, you have the following options:

- If you are building a web application, you can safely use our generally available server-side middleware to perform sign in and token validation.  These include the OWIN Open ID Connect middleware for ASP.NET and our NodeJS Passport plugin.  Code samples using these middlewares are available in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section as well.
- For other platforms and for native & mobile applications, you can also integrate with the v2.0 endpoint by directly sending & receiving protocol messages in your application code.  The v2.0 OpenID Connect and OAuth protocols [have been explicitly documented](active-directory-v2-protocols.md) to help you perform such an integration.
- Finally, you can use open source Open ID Connect and OAuth libraries to integrate with the v2.0 endpoint.  The v2.0 protocol should be compatible with many open source protocol libraries without major changes.  The availability of such libraries varies per languange and platform, and the [Open ID Connect](http://openid.net/connect/) and [OAuth 2.0](http://oauth.net/2/) websites maintain a list of popular implementations. Below are the Open source client libraries and samples that have been tested with the v2.0 endpoint.

  - [Java WSO2 Identity Server](https://docs.wso2.com/display/IS500/Introducing+the+Identity+Server)
  - [Java Gluu Federation](https://github.com/GluuFederation/oxAuth)
  - [Node.Js passport-openidconnect](https://www.npmjs.com/package/passport-openidconnect)
  - [PHP OpenID Connect Basic Client](https://github.com/jumbojett/OpenID-Connect-PHP)
  - [iOS OAuth2 Client](https://github.com/nxtbgthng/OAuth2Client)
  - [Android OAuth2 Client](https://github.com/wuman/android-oauth-client)
  - [Android OpenID Connect Client](https://github.com/kalemontes/OIDCAndroidLib)

## Restrictions on protocols
The v2.0 endpoint only supports Open ID Connect & OAuth 2.0.  However, not all features and capabilities of each protocol have been incorporated into the v2.0 endpoint.  Some examples include:

- The OpenID Connect `end_sesssion_endpoint`
- The OAuth 2.0 client credentials grant

To better understand the scope of protocol functionality supported in the v2.0 endpoint, read through our [OpenID Connect & OAuth 2.0 Protocol Reference](active-directory-v2-protocols.md).

## Advanced Azure AD developer features
There is a set of developer features available in the Azure Active Directory service that are not yet supported for the v2.0 endpoint, including:

- Group claims for Azure AD users
- Application Roles & Role Claims
