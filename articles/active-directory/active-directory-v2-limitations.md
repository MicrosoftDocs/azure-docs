<properties
	pageTitle="App Model v2.0 Limitations & restrictions | Microsoft Azure"
	description="A list of limitations & restrictions with the Azure AD v2.0 app model."
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
	ms.date="09/11/2015"
	ms.author="dastrock"/>

# App model v2.0 preview: Limitations & restrictions

There are several features & functionalities of the v2.0 app model that are not yet supported in the public preview period.  Each of these limitations will be removed before the v2.0 app model reaches general availability, but you should be aware of them if you are building apps during the public preview.

> [AZURE.NOTE]
	This information applies to the v2.0 app model public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## Support for Production Apps
Apps that integrate with the v2.0 app model should not be released to the public as production level apps.  The v2.0 app model is in public preview at this time - breaking changes may be introduced at any point in time, and there is no SLA guaranteed by the service.  Support will not be provided for any incidents that may occur.  If you are willing to accept the risks of taking a dependency on a service that is still in development, you must contact us @AzureAD to discuss the scope of your app or service.

## Restrictions on Apps
The following types of apps are not currently supported in the v2.0 app model public preview.  For a description of the supported types of apps, refer to [this article](active-directory-v2-flows.md).

##### Single Page Apps (Javascript)
Many modern apps have a Single Page App front-end written primarily in javascript and often using a SPA frameworks such as AngularJS, Ember.js, Durandal, etc.  The generally available Azure AD service supports these apps using the [OAuth 2.0 Implicit Flow](active-directory-v2-protocols.md#oauth2-implicit-flow) - however, this flow is not yet available in the v2.0 app model.  It will be in short order.

If you're anxious to get a SPA working with the v2.0 app model, you can implement authentication using the [web app flow](active-directory-v2-flows.md#web-apps).  But this is not the recommended approach, and documentation for this scenario will be limited.  If you'd like to get a feel for the SPA scenario, you can check out the [generally available Azure AD SPA code sample](active-directory-devquickstarts-angular.md).

##### Daemons/Server Side Apps
Apps that contain long running processes or that operate without the presence of a user also need a way to access secured resources, such as Web APIs.  These apps can authenticate and get tokens using the app's identity (rather than a user's delegated identity) using the [OAuth 2.0 client credentials flow](active-directory-v2-protocols.md#oauth2-client-credentials-grant-flow).  

This flow is not currently supported by the v2.0 app model - which is to say that apps can only get tokens after an interactive user sign-in flow has occurred.  The client credentials flow will be added in the near future.  If you would like to see the client credentials flow in the generally available Azure AD app model, check out the [Daemon sample on GitHub](https://github.com/AzureADSamples/Daemon-DotNet).

##### Chained Web APIs (On-Behalf-Of)
Many architectures include a Web API that needs to call another downstream Web API, both secured by the v2.0 app model.  This scenario is common in native clients that have a Web API backend, which in turn calls a Microsoft Online service such as Office 365 or the Graph API.

This chained Web API scenario can be supported using the OAuth 2.0 Jwt Bearer Credential grant, otherwise known as the [On-Behalf-Of Flow](active-directory-v2-protocols.md#oauth2-on-behalf-of-flow).  However, the On-Behalf-Of flow is not currently implemented in the v2.0 app model preview.  To see how this flow works in the generally available Azure AD service, check out the [On-Behalf-Of code sample on GitHub](https://github.com/AzureADSamples/WebAPI-OnBehalfOf-DotNet).

##### Standalone Web APIs
In the v2.0 app model preview, you have the ability to [build a Web API that is secured using OAuth tokens](active-directory-v2-flows.md#web-apis) from the v2.0 endpoint.  However, that Web API will only be able to receive tokens from a client that shares the same Application Id.  Building a third party web service that is accessed from several different clients is not supported.

To see how to build a Web API that accepts tokens from a well-known client with the same App Id, see the v2.0 app model Web API samples in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

## Restrictions on Users
Currently every app built with the v2.0 app model will be publicly exposed to all users with a Microsoft Account or Azure AD account. Any user with either type of account will be able to successfully navigate to or install your app, enter their credentials at the v2.0 app model, and consent to your app's permissions.  You can write your app's code to reject sign-ins from certain sets of users - but that will not prevent them from being able to consent to the app.

Effectively, your apps can not restrict the types of users that can sign into the app.  You will not be able to build Line of Business apps (restricted to users in one organization), apps available to only enterprise users (with an Azure AD account), or apps only available to consumers (with a Microsoft Account).

## Restrictions on App Registrations
At this point in time, all apps that want to integrate with the v2.0 app model must create a new app registration at [apps.dev.microsoft.com](https://apps.dev.microsoft.com).  Any existing Azure AD or Microsoft Account apps will not be compatible with the v2.0 app model, nor will apps registered in any portal besides the new App Registration Portal.  There is no migration path for an app from the generally available Azure AD service to the v2.0 app model.

Similarly, apps registered in the new App Registration Portal will work exclusively with the v2.0 app model.  You can not use the App Registration Portal to create apps that will integrate successfully with the Azure AD or Microsoft Account services.

Apps that are registered in the new Application Registration Portal are currently restricted to a limited set of redirect_uri values.  The redirect_uri for web apps and services must begin with the scheme or `https`, while the redirect_uri for all other platforms must use the hard-coded value of `urn:ietf:oauth:2.0:oob`.

To learn how to register an app in the new Application Registration Portal, refer to [this article](active-directory-v2-app-registration.md).

## Restrictions on Services & APIs
The v2.0 app model currently supports sign-in for any app registered in the new Application Registration Portal, provided it falls into the list of [supported authentication flows](active-directory-v2-flows.md).  However, these apps will only be able to acquire OAuth 2.0 access tokens for a very limited set of resources.  The v2.0 endpoint will only issue access_tokens for:

- The app that requested the token.  An app can acquire an access_token for itself, if the logical app is comprised of several different components or tiers.  To see this scenario in action, check out our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) tutorials.
- The Outlook Mail, Calendar and Contacts REST APIs, all of which are located at https://outlook.office.com.  To learn how to write an app that accesses these APIs, refer to these [Office Getting Started](https://www.msdn.com/office/office365/howto/authenticate-Office-365-APIs-using-v2) tutorials.

More Microsoft Online services will be added in the near future, as well as support for your own Web APIs and services.

## Restrictions on Libraries & SDKs
Not all languages and platforms have libraries that support the v2.0 app model preview.  The set of authentication libraries is currently limited to .NET, iOS, Android, NodeJS, and Javascript.  Corresponding code samples and tutorials for each are available in our [Getting Started](active-directory-appmodel-v2-overview.md#getting-started) section.

If you wish to integrate an app with the v2.0 app model using another language or platform, refer to the [OAuth 2.0 and OpenID Connect Protocol Reference](active-directory-v2-protocols.md) which will instruct you on how to construct the HTTP messages necessary to communicate with the v2.0 endpoint.

## Restrictions on Protocols
The v2.0 app model supports Open ID Connect & OAuth 2.0.  However, not all features and capabilities of each protocol have been incorporated into the v2.0 app model.  Some examples include:

- Full support for the OpenID Connect `prompt` parameter
- The OpenID Connect `login_hint` parameter
- The OpenID Connect `domain_hint` parameter
- The OpenID Connect `end_sesssion_endpoint`

To better understand the scope of protocol functionality supported in the v2.0 app model, read through our [OpenID Connect & OAuth 2.0 Protocol Reference](active-directory-v2-protocols.md).
