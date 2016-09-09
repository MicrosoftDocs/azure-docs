<properties
	pageTitle="Authentication and Authorization in Azure Mobile Apps | Microsoft Azure"
	description="Conceptual reference and overview of the Authentication / Authorization feature for Azure Mobile Apps"
	services="app-service\mobile"
	documentationCenter=""
	authors="mattchenderson"
	manager="erikref"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="05/05/2016"
	ms.author="mahender"/>

# Authentication and Authorization in Azure Mobile Apps

## What is App Service Authentication / Authorization?

> [AZURE.NOTE] This topic will be migrated to a consolidated [App Service Authentication / Authorization](../app-service/app-service-authentication-overview.md) topic, which covers Web, Mobile, and API Apps.

App Service Authentication / Authorization is a feature which allows your application to log in users with no code changes required on the app backend. It provides an easy way to protect your application and work with per-user data.

App Service uses federated identity, in which a 3rd-party **identity provider** ("IDP") stores accounts and authenticates users, and the application uses this identity instead of its own. App Service supports five identity providers out of the box: _Azure Active Directory_, _Facebook_, _Google_, _Microsoft Account_, and _Twitter_. You can also expand this support for your apps by integrating another identity provider or your own custom identity solution.

Your app can leverage any number of these identity providers, so you can provide your end users with options for how they login.

If you wish to get started right away, please see one of the following tutorials:

- [Add authentication to your iOS app]
- [Add authentication to your Xamarin.iOS app]
- [Add authentication to your Xamarin.Android app]
- [Add Authentication to your Windows app]

## How authentication works

In order to authenticate using one of the identity providers, you first need to configure the identity provider to know about your application. The identity provider will then provide you with IDs and secrets that you provide back to the application. This completes the trust relationship and allows App Service to validate identities provided to it.

These steps are detailed in the following topics:

- [How to configure your app to use Azure Active Directory login]
- [How to configure your app to use Facebook login]
- [How to configure your app to use Google login]
- [How to configure your app to use Microsoft Account login]
- [How to configure your app to use Twitter login]

Once everything is configured on the backend, you can modify your client to log in. There are two approaches here:

- Using a single line of code, let the Mobile Apps client SDK sign in users.
- Leverage an SDK published by a given identity provider to establish identity and then gain access to App Service.

>[AZURE.TIP] Most applications should use a provider SDK to get a more native-feeling login experience and to leverage refresh support and other provider-specific benefits.

### How authentication without a provider SDK works

If you do not wish to set up a provider SDK, you can allow Mobile Apps to perform the login for you. The Mobile Apps client SDK will open a web view to the provider of your choosing and complete the signin. Occasionally on blogs and forums you will see this referred to as the "server flow" or "server-directed flow" since the server is managing the login, and the client SDK never recieves the provider token.

The code needed to start this flow is covered in the authentication tutorial for each platform. At the end of the flow, the client SDK has an App Service token, and the token is automatically attached to all requests to the backend.

### How authentication with a provider SDK works

Working with a provider SDK allows the login experience to interact more tightly with the platform OS the app is running on. This also gives you a provider token and some user information on the client, which makes it much easier to consume graph APIs and customize the user experience. Occasionally on blogs and forums you will see this referred to as the "client flow" or "client-directed flow" since code on the client is handling the login, and the client code has access to a provider token.

Once a provider token is obtained, it needs to be sent to App Service for validation. At the end of the flow, the client SDK has an App Service token, and the token is automatically attached to all requests to the backend. The developer can also keep a reference to the provider token if they so choose.

## How authorization works

App Service Authentication / Authorization exposes several choices for **Action to take when request is not authenticated**. Before your code receives a given request, you can have App Service check to see if the request is authenticated and if not, reject it and attempt to have the user log in before trying again.

One option is to have unauthenticated requests redirect to one of the identity providers. In a web browser, this would actually take the user to a new page. However, your mobile client cannot be redirected in this way, and unauthenticated responses will receive an HTTP _401 Unauthorized_ response. Given this, the first request your client makes should always be to the login endpoint, and then you can make calls to any other APIs. If you attempt to call another API before logging in, your client will receive an error.

If you wish to have more granular control over which endpoints require authentication, you can also pick "No action (allow request)" for unauthenticated requests. In this case, all authentication decisions are deferred to your application code. This also allows you to allow access to specific users based on custom authorization rules.

## Documentation

The following tutorials show how to add authentication to your mobile clients using App Service:

- [Add authentication to your iOS app]
- [Add authentication to your Xamarin.iOS app]
- [Add authentication to your Xamarin.Android app]
- [Add Authentication to your Windows app]

The following tutorials show how to configure App Service to leverage different authentication providers:

- [How to configure your app to use Azure Active Directory login]
- [How to configure your app to use Facebook login]
- [How to configure your app to use Google login]
- [How to configure your app to use Microsoft Account login]
- [How to configure your app to use Twitter login]

If you wish to use an identity system other than the ones provided here, you can also leverage the [preview custom authentication support in the .NET server SDK](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#custom-auth).

[Add authentication to your iOS app]: app-service-mobile-ios-get-started-users.md
[Add authentication to your Xamarin.iOS app]: app-service-mobile-xamarin-ios-get-started-users.md
[Add authentication to your Xamarin.Android app]: app-service-mobile-xamarin-android-get-started-users.md
[Add Authentication to your Windows app]: app-service-mobile-windows-store-dotnet-get-started-users.md

[How to configure your app to use Azure Active Directory login]: app-service-mobile-how-to-configure-active-directory-authentication.md
[How to configure your app to use Facebook login]: app-service-mobile-how-to-configure-facebook-authentication.md
[How to configure your app to use Google login]: app-service-mobile-how-to-configure-google-authentication.md
[How to configure your app to use Microsoft Account login]: app-service-mobile-how-to-configure-microsoft-authentication.md
[How to configure your app to use Twitter login]: app-service-mobile-how-to-configure-twitter-authentication.md