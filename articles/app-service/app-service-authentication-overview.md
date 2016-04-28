<properties
	pageTitle="Authentication and Authorization in Azure App Service | Microsoft Azure"
	description="Conceptual reference and overview of the Authentication / Authorization feature for Azure App Service"
	services="app-service"
	documentationCenter=""
	authors="mattchenderson"
	manager="erikre"
	editor=""/>

<tags
	ms.service="app-service"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="04/25/2016"
	ms.author="mahender"/>
    
# Authentication and Authorization in Azure App Service

## What is App Service Authentication / Authorization?

App Service Authentication / Authorization is a feature which allows your application to log in users with no code changes required on the app backend. It provides an easy way to protect your application and work with per-user data.

App Service uses federated identity, in which a 3rd-party identity provider stores accounts and authenticates users. The application relies on the provider's identity information instead of stpromg that information itself. App Service supports five identity providers out of the box: _Azure Active Directory_, _Facebook_, _Google_, _Microsoft Account_, and _Twitter_. Your app can leverage any number of these identity providers to provide your users with options for how they login. You can also expand the built-in support by integrating another identity provider or [your own custom identity solution][custom-auth].

If you wish to get started right away, see one of the following tutorials:

- [Add authentication to your iOS app][iOS] (or [Android], [Windows], [Xamarin.iOS], [Xamarin.Android], [Xamarin.Forms], or [Cordova])
- [User authentication for API Apps in Azure App Service][apia-user]

## How authentication works in App Service

In order to authenticate using one of the identity providers, you first need to configure the identity provider to know about your application. The identity provider will then provide you with IDs and secrets that you provide back to App Service. This completes the trust relationship and allows App Service to validate user assertions from the identity provider, such as authentication tokens.

To sign in a user with one of these providers, the user must be redirected to a login endpoint for that provider. If customers are using a web browser, you can have App Service automatically direct all unauthenticated users to the login endpoint. Otherwise, you will need to direct your customers to `{your App Service base URL}/.auth/login/<provider>`, where `<provider>` is one of _aad_, _facebook_, _google_, _microsoft_, and _twitter_. Mobile and API Scenarios are covered in the sections below.

Users interacting with your application through a web browser will have a cookie set so that they can remain authenticated as they navigate your application. For other client types, such as mobile, a JSON web token (JWT) will be issued to the client which should be presented in the `X-ZUMO-AUTH` header. The Mobile Apps client SDKs will handle this for you. Alternatively, an Azure Active Directory identity token or access token may be directly included in the `Authorization` header as a [bearer token](https://tools.ietf.org/html/rfc6750).

App Service will validate any cookie or token that your application issued, allowing users to be authenticated. To restrict who can access your application, see the [Authorization](#authorization) section below.

### Mobile authentication with a provider SDK

Once everything is configured on the backend, you can modify mobile clients to log in with App Service. There are two approaches here:

- Leverage an SDK published by a given identity provider to establish identity and then gain access to App Service.
- Using a single line of code, let the Mobile Apps client SDK sign in users.

>[AZURE.TIP] Most applications should use a provider SDK to get a more native-feeling login experience and to leverage refresh support and other provider-specific benefits.

Working with a provider SDK allows the login experience to interact more tightly with the platform OS the app is running on. This also gives you a provider token and some user information on the client, which makes it much easier to consume graph APIs and customize the user experience. Occasionally on blogs and forums you will see this referred to as the "client flow" or "client-directed flow" since code on the client is handling the login, and the client code has access to a provider token.

Once a provider token is obtained, it needs to be sent to App Service for validation. After App Service validates the token, it creates a new App Service token which is returned to the client. The Mobile Apps client SDK has helper methods to manage this exchange and automatically attach the token to all requests to the application backend. The developer can also keep a reference to the provider token if they so choose.

### Mobile authentication without a provider SDK

If you do not wish to set up a provider SDK, you can allow App Service Mobile Apps to perform the login for you. The Mobile Apps client SDK will open a web view to the provider of your choosing and complete the signin. Occasionally on blogs and forums you will see this referred to as the "server flow" or "server-directed flow" since the server is managing the login, and the client SDK never receives the provider token.

The code needed to start this flow is covered in the authentication tutorial for each platform. At the end of the flow, the client SDK has an App Service token, and the token is automatically attached to all requests to the application backend.

### Service-to-service authentication

In addition to giving users access to your application, you can also allow another trusted application to call your own API For example, you could have one App Service application call an API in another. In this scenario you get a token by using credentials for a service account instead of end user credentials. A service account is also known as a *service principal* in Azure Active Directory parlance, and authentication using such an account is also known as a service-to-service scenario. 

>[AZURE.IMPORTANT] Because they run on customer devices, mobile applications do _not_ count as trusted applications and should not use a service principal flow. Instead, they should use one of the user flows detailed above.

For service-to-service scenarios, App Service can protect your application using Azure Active Directory. The calling application just needs to provide an AAD service principal authorization token obtained by providing the client ID and client secret from AAD. An example of this scenario using ASP.NET API apps is covered by the tutorial [Service principal authentication for API Apps][apia-service].

If you want to handle a service-to-service scenario without using App Service authentication, you can use client certificates or basic authentication. For information about client certificates in Azure, see [How To Configure TLS Mutual Authentication for Web Apps](../app-service-web/app-service-web-configure-tls-mutual-auth.md). For information about basic authentication in ASP.NET, see [Authentication Filters in ASP.NET Web API 2](http://www.asp.net/web-api/overview/security/authentication-filters).

Service account authentication from an App Service logic app to an API app is a special case that is detailed in [Using your custom API hosted on App Service with Logic apps](../app-service-logic/app-service-logic-custom-hosted-api.md).

## <a name="authorization"></a>How authorization works in App Service

You have full control over what requests are allowed to access your application. App Service Authentication / Authorization can be configured with any of the following behaviors:

- Allow only authenticated requests to reach your application.

	If an anonymous request is received from a browser, App Service will redirect to a logon page for the identity provider that you choose. If the request comes from a mobile device, an HTTP _401 Unauthorized_ response response will be returned.

	With this option, you don't need to write any authentication code at all in your app. If you need finer-grained authorization, information about the user is available to your code.

- Allow all requests to reach your application, but validate authenticated requests and pass along authentication information in the HTTP headers.

	This option defers authorization decisions to your application code. It provides more flexibility in handling anonymous requests, but requires that you write code.
	
- Allow all requests to reach your application, take no action on authentication information in the requests.

	In this case, the Authentication / Authorization feature is off. The tasks of authentication and authorization are entirely up to your application code.

The above behaviors are controlled by the **Action to take when request is not authenticated** option in the portal. Choosing "Log in with..." for one of the providers will require all requests to be authenticated. "Allow request (no action)" defers the authorization decision to your code, but still provides authentication information. If you want to have your code handle everything, you can disable the Authentication / Authorization feature.

## Working with user identities in your application

App Service passes some user information to your application using special headers. These headers are not allowed from external requests and will only be present if set by App Service Authentication / Authorization. Some example headers include:

* X-MS-CLIENT-PRINCIPAL-NAME
* X-MS-CLIENT-PRINCIPAL-ID
* X-MS-TOKEN-FACEBOOK-ACCESS-TOKEN
* X-MS-TOKEN-FACEBOOK-EXPIRES-ON

Code written in any language or framework can get the information it needs from these headers. For ASP.NET 4.6 apps, the ClaimsPrincipal is automatically set with the appropriate values.

Your application can also obtain additional user details through an HTTP GET on the `/.auth/me` endpoint of your application. If a valid token was included with the request, this will return a JSON payload with details about the provider being used, the underlying provider token, and some other user information. The Mobile Apps server SDKs provide helper methods for working with this data ([Node.JS](../app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk.md/#howto-tables-getidentity), [.NET](../app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk.md/#user-info)).

## Documentation and additional resources

### Identity providers
The following tutorials show how to configure App Service to leverage different authentication providers:

- [How to configure your app to use Azure Active Directory login][AAD]
- [How to configure your app to use Facebook login][Facebook]
- [How to configure your app to use Google login][Google]
- [How to configure your app to use Microsoft Account login][MSA]
- [How to configure your app to use Twitter login][Twitter]

If you wish to use an identity system other than the ones provided here, you can also leverage the [preview custom authentication support in the Mobile Apps .NET server SDK][custom-auth], which can be used in Web, Mobile, or API Apps.

### Mobile applications
The following tutorials show how to add authentication to your mobile clients using the server-directed flow:

- [Add authentication to your iOS app][iOS]
- [Add Authentication to your Android app][Android]
- [Add Authentication to your Windows app][Windows]
- [Add authentication to your Xamarin.iOS app][Xamarin.iOS]
- [Add authentication to your Xamarin.Android app][Xamarin.Android]
- [Add authentication to your Xamarin.Forms app][Xamarin.Forms]
- [Add Authentication to your Cordova app][Cordova]

If you wish to use the client-directed flow for AAD:

- [Use the Active Directory Authentication Library for iOS][ADAL-iOS]
- [Use the Active Directory Authentication Library for Android][ADAL-Android]
- [Use the Active Directory Authentication Library for Windows and Xamarin][ADAL-dotnet]

### API applications
The following tutorials show how to protect your API apps:

- [User authentication for API Apps in Azure App Service][apia-user]
- [Service principal authentication for API Apps in Azure App Service][apia-service]









[apia-user]: ../app-service-api/app-service-api-dotnet-user-principal-auth.md
[apia-service]: ../app-service-api/app-service-api-dotnet-service-principal-auth.md

[iOS]: ../app-service-mobile/app-service-mobile-ios-get-started-users.md
[Android]: ../app-service-mobile/app-service-mobile-android-get-started-users.md
[Xamarin.iOS]: ../app-service-mobile/app-service-mobile-xamarin-ios-get-started-users.md
[Xamarin.Android]: ../app-service-mobile/app-service-mobile-xamarin-android-get-started-users.md
[Xamarin.Forms]: ../app-service-mobile/app-service-mobile-xamarin-forms-get-started-users
[Windows]: ../app-service-mobile/app-service-mobile-windows-store-dotnet-get-started-users.md
[Cordova]: ../app-service-mobile/app-service-mobile-cordova-get-started-users.md

[AAD]: ../app-service-mobile/app-service-mobile-how-to-configure-active-directory-authentication.md
[Facebook]: ../app-service-mobile/app-service-mobile-how-to-configure-facebook-authentication.md
[Google]: ../app-service-mobile/app-service-mobile-how-to-configure-google-authentication.md
[MSA]: ../app-service-mobile/app-service-mobile-how-to-configure-microsoft-authentication.md
[Twitter]: ../app-service-mobile/app-service-mobile-how-to-configure-twitter-authentication.md

[custom-auth]: ../app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#custom-auth

[ADAL-Android]: ../app-service-mobile/app-service-mobile-android-how-to-use-client-library.md/#adal
[ADAL-iOS]: ../app-service-mobile/app-service-mobile-ios-how-to-use-client-library.md/#adal
[ADAL-dotnet]: ../app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library.md/#adal
