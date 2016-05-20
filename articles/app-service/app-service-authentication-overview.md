<properties
	pageTitle="Authentication and authorization in Azure App Service | Microsoft Azure"
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

# Authentication and authorization in Azure App Service

## What is App Service Authentication / Authorization?

App Service Authentication / Authorization is a feature that provides a way for your application to sign in users so that you don't have to change code on the app backend. It provides an easy way to protect your application and work with per-user data.

App Service uses federated identity, in which a third-party identity provider stores accounts and authenticates users. The application relies on the provider's identity information so that the app doesn't have to store that information itself. App Service supports five identity providers out of the box: Azure Active Directory, Facebook, Google, Microsoft Account, and Twitter. Your app can use any number of these identity providers to provide your users with options for how they sign in. To expand the built-in support, you can integrate another identity provider or [your own custom identity solution][custom-auth].

If you want to get started right away, see one of the following tutorials:

- [Add authentication to your iOS app][iOS] (or [Android], [Windows], [Xamarin.iOS], [Xamarin.Android], [Xamarin.Forms], or [Cordova])
- [User authentication for API Apps in Azure App Service][apia-user]
- [Get started with Azure App Service - Part 2][web-getstarted]

## How authentication works in App Service

In order to authenticate by using one of the identity providers, you first need to configure the identity provider to know about your application. The identity provider will then provide IDs and secrets that you provide to App Service. This completes the trust relationship so that App Service can validate user assertions, such as authentication tokens, from the identity provider.

To sign in a user by using one of these providers, the user must be redirected to an endpoint that signs in users for that provider. If customers are using a web browser, you can have App Service automatically direct all unauthenticated users to the endpoint that signs in users. Otherwise, you will need to direct your customers to `{your App Service base URL}/.auth/login/<provider>`, where `<provider>` is one of the following values: aad, facebook, google, microsoft, or twitter. Mobile and API scenarios are explained in sections later in this article.

Users who interact with your application through a web browser will have a cookie set so that they can remain authenticated as they browse your application. For other client types, such as mobile, a JSON web token (JWT), which should be presented in the `X-ZUMO-AUTH` header, will be issued to the client. The Mobile Apps client SDKs will handle this for you. Alternatively, an Azure Active Directory identity token or access token may be directly included in the `Authorization` header as a [bearer token](https://tools.ietf.org/html/rfc6750).

App Service will validate any cookie or token that your application issues to authenticate users. To restrict who can access your application, see the [Authorization](#authorization) section later in this article.

### Mobile authentication with a provider SDK

After everything is configured on the backend, you can modify mobile clients to sign in with App Service. There are two approaches here:

- Use an SDK that a given identity provider publishes to establish identity and then gain access to App Service.
- Use a single line of code so that the Mobile Apps client SDK can sign in users.

>[AZURE.TIP] Most applications should use a provider SDK to get a more consistent experience when users sign in, to use refresh support, and to get other benefits that the provider specifies.

When you use a provider SDK, users can sign in to an experience that integrates more tightly with the operating system that the app is running on. This also gives you a provider token and some user information on the client, which makes it much easier to consume graph APIs and customize the user experience. Occasionally on blogs and forums, you will see this referred to as the "client flow" or "client-directed flow" because code on the client signs in users, and the client code has access to a provider token.

After a provider token is obtained, it needs to be sent to App Service for validation. After App Service validates the token, App Service creates a new App Service token that is returned to the client. The Mobile Apps client SDK has helper methods to manage this exchange and automatically attach the token to all requests to the application backend. Developers can also keep a reference to the provider token if they so choose.

### Mobile authentication without a provider SDK

If you do not want to set up a provider SDK, you can allow the Mobile Apps feature of Azure App Service to sign in for you. The Mobile Apps client SDK will open a web view to the provider of your choosing and sign in the user. Occasionally on blogs and forums, you will see this referred to as the "server flow" or "server-directed flow" because the server manages the process that signs in users, and the client SDK never receives the provider token.

Code to start this flow is included in the authentication tutorial for each platform. At the end of the flow, the client SDK has an App Service token, and the token is automatically attached to all requests to the application backend.

### Service-to-service authentication

Although you can give users access to your application, you can also trust another application to call your own API. For example, you could have one web app call an API in another web app. In this scenario, you use credentials for a service account instead of user credentials to get a token. A service account is also known as a *service principal* in Azure Active Directory parlance, and authentication that uses such an account is also known as a service-to-service scenario.

>[AZURE.IMPORTANT] Because mobile apps run on customer devices, mobile applications do _not_ count as trusted applications and should not use a service principal flow. Instead, they should use a user flow that was detailed earlier.

For service-to-service scenarios, App Service can protect your application by using Azure Active Directory. The calling application just needs to provide an Azure Active Directory service principal authorization token that is obtained by providing the client ID and client secret from Azure Active Directory. An example of this scenario that uses ASP.NET API apps is explained by the tutorial, [Service principal authentication for API Apps][apia-service].

If you want to use App Service authentication to handle a service-to-service scenario, you can use client certificates or basic authentication. For information about client certificates in Azure, see [How To Configure TLS Mutual Authentication for Web Apps](../app-service-web/app-service-web-configure-tls-mutual-auth.md). For information about basic authentication in ASP.NET, see [Authentication Filters in ASP.NET Web API 2](http://www.asp.net/web-api/overview/security/authentication-filters).

Service account authentication from an App Service logic app to an API app is a special case that is detailed in [Using your custom API hosted on App Service with Logic apps](../app-service-logic/app-service-logic-custom-hosted-api.md).

## <a name="authorization"></a>How authorization works in App Service

You have full control over the requests that can access your application. App Service Authentication / Authorization can be configured with any of the following behaviors:

- Allow only authenticated requests to reach your application.

	If a browser receives an anonymous request, App Service will redirect to a page for the identity provider that you choose so that users can sign in. If the request comes from a mobile device, the returned response is an HTTP _401 Unauthorized_ response.

	With this option, you don't need to write any authentication code at all in your app. If you need finer authorization, information about the user is available to your code.

- Allow all requests to reach your application, but validate authenticated requests, and pass along authentication information in the HTTP headers.

	This option defers authorization decisions to your application code. It provides more flexibility in handling anonymous requests, but you have to write code.

- Allow all requests to reach your application, and take no action on authentication information in the requests.

	In this case, the Authentication / Authorization feature is off. The tasks of authentication and authorization are entirely up to your application code.

The previous behaviors are controlled by the **Action to take when request is not authenticated** option in the Azure portal. If you choose **Log in with *provider name* **, all requests have to be authenticated. **Allow request (no action)** defers the authorization decision to your code, but it still provides authentication information. If you want to have your code handle everything, you can disable the Authentication / Authorization feature.

## Working with user identities in your application

App Service passes some user information to your application by using special headers. External requests prohibit these headers and will only be present if set by App Service Authentication / Authorization. Some example headers include:

* X-MS-CLIENT-PRINCIPAL-NAME
* X-MS-CLIENT-PRINCIPAL-ID
* X-MS-TOKEN-FACEBOOK-ACCESS-TOKEN
* X-MS-TOKEN-FACEBOOK-EXPIRES-ON

Code that is written in any language or framework can get the information that it needs from these headers. For ASP.NET 4.6 apps, the **ClaimsPrincipal** is automatically set with the appropriate values.

Your application can also obtain additional user details through an HTTP GET on the `/.auth/me` endpoint of your application. A valid token that's included with the request will return a JSON payload with details about the provider that's being used, the underlying provider token, and some other user information. The Mobile Apps server SDKs provide helper methods to work with this data. For more information, see [How to use the Azure Mobile Apps Node.js SDK](../app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk.md#howto-tables-getidentity), and [Work with the .NET backend server SDK for Azure Mobile Apps](../app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#user-info).

## Documentation and additional resources

### Identity providers
The following tutorials show how to configure App Service to use different authentication providers:

- [How to configure your app to use Azure Active Directory login][AAD]
- [How to configure your app to use Facebook login][Facebook]
- [How to configure your app to use Google login][Google]
- [How to configure your app to use Microsoft Account login][MSA]
- [How to configure your app to use Twitter login][Twitter]

If you want to use an identity system other than the ones provided here, you can also use the [preview custom authentication support in the Mobile Apps .NET server SDK][custom-auth], which can be used in web apps, mobile apps, or API apps.

### Web applications
The following tutorials show how to add authentication to a web application:

- [Get started with Azure App Service - Part 2][web-getstarted]

### Mobile applications
The following tutorials show how to add authentication to your mobile clients by using the server-directed flow:

- [Add authentication to your iOS app][iOS]
- [Add Authentication to your Android app][Android]
- [Add Authentication to your Windows app][Windows]
- [Add authentication to your Xamarin.iOS app][Xamarin.iOS]
- [Add authentication to your Xamarin.Android app][Xamarin.Android]
- [Add authentication to your Xamarin.Forms app][Xamarin.Forms]
- [Add Authentication to your Cordova app][Cordova]

Use the following resources if you want to use the client-directed flow for Azure Active Directory:

- [Use the Active Directory Authentication Library for iOS][ADAL-iOS]
- [Use the Active Directory Authentication Library for Android][ADAL-Android]
- [Use the Active Directory Authentication Library for Windows and Xamarin][ADAL-dotnet]

### API applications
The following tutorials show how to protect your API apps:

- [User authentication for API Apps in Azure App Service][apia-user]
- [Service principal authentication for API Apps in Azure App Service][apia-service]









[apia-user]: ../app-service-api/app-service-api-dotnet-user-principal-auth.md
[apia-service]: ../app-service-api/app-service-api-dotnet-service-principal-auth.md

[web-getstarted]: ../app-service-web/app-service-web-get-started-2.md#authenticate-your-users

[iOS]: ../app-service-mobile/app-service-mobile-ios-get-started-users.md
[Android]: ../app-service-mobile/app-service-mobile-android-get-started-users.md
[Xamarin.iOS]: ../app-service-mobile/app-service-mobile-xamarin-ios-get-started-users.md
[Xamarin.Android]: ../app-service-mobile/app-service-mobile-xamarin-android-get-started-users.md
[Xamarin.Forms]: ../app-service-mobile/app-service-mobile-xamarin-forms-get-started-users.md
[Windows]: ../app-service-mobile/app-service-mobile-windows-store-dotnet-get-started-users.md
[Cordova]: ../app-service-mobile/app-service-mobile-cordova-get-started-users.md

[AAD]: ../app-service-mobile/app-service-mobile-how-to-configure-active-directory-authentication.md
[Facebook]: ../app-service-mobile/app-service-mobile-how-to-configure-facebook-authentication.md
[Google]: ../app-service-mobile/app-service-mobile-how-to-configure-google-authentication.md
[MSA]: ../app-service-mobile/app-service-mobile-how-to-configure-microsoft-authentication.md
[Twitter]: ../app-service-mobile/app-service-mobile-how-to-configure-twitter-authentication.md

[custom-auth]: ../app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#custom-auth

[ADAL-Android]: ../app-service-mobile/app-service-mobile-android-how-to-use-client-library.md#adal
[ADAL-iOS]: ../app-service-mobile/app-service-mobile-ios-how-to-use-client-library.md#adal
[ADAL-dotnet]: ../app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library.md#adal
