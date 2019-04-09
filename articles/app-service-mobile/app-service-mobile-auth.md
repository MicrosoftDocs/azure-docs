---
title: Authentication and authorization in Azure App Service for mobile apps | Microsoft Docs
description: Conceptual reference and overview of the Authentication / Authorization feature for Azure App Service, specifically for mobile apps
services: app-service
documentationcenter: ''
author: mattchenderson
manager: erikre
editor: ''

ms.service: app-service
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 10/01/2016
ms.author: mahender

---
# Authentication and authorization in Azure App Service for mobile apps

This article describes how authentication and authorization works when developing native mobile apps with an App Service back end. App Service provides integrated authentication and authorization, so your mobile apps can sign users in without changing any code in App Service. It provides an easy way to protect your application and work with per-user data. 

This article focuses on mobile app development. To get started quickly with App Service authentication and authorization for your mobile app, see one of the following tutorials [Add authentication to your iOS app][iOS] (or [Android], [Windows], [Xamarin.iOS], [Xamarin.Android], [Xamarin.Forms], or [Cordova]). 

For information on how authentication and authorization work in App Service, see [Authentication and authorization in Azure App Service](../app-service/overview-authentication-authorization.md).

## Authentication with provider SDK

After everything is configured in App Service, you can modify mobile clients to sign in with App Service. There are two approaches here:

* Use an SDK that a given identity provider publishes to establish identity and then gain access to App Service.
* Use a single line of code so that the Mobile Apps client SDK can sign in users.

> [!TIP]
> Most applications should use a provider SDK to get a more consistent experience when users sign in, to use token refresh support, and to get other benefits that the provider specifies.
> 
> 

When you use a provider SDK, users can sign in to an experience that integrates more tightly with the operating system that the app is running on. This method also gives you a provider token and some user information on the client, which makes it much easier to consume graph APIs and customize the user experience. Occasionally on blogs and forums, it is referred to as the "client flow" or "client-directed flow" because code on the client signs in users, and the client code has access to a provider token.

After a provider token is obtained, it needs to be sent to App Service for validation. After App Service validates the token, App Service creates a new App Service token that is returned to the client. The Mobile Apps client SDK has helper methods to manage this exchange and automatically attach the token to all requests to the application back end. Developers can also keep a reference to the provider token.

For more information on the authentication flow, see [App Service authentication flow](../app-service/overview-authentication-authorization.md#authentication-flow). 

## Authentication without provider SDK

If you do not want to set up a provider SDK, you can allow the Mobile Apps feature of Azure App Service to sign in for you. The Mobile Apps client SDK will open a web view to the provider of your choosing and sign in the user. Occasionally on blogs and forums, it is called the "server flow" or "server-directed flow" because the server manages the process that signs in users, and the client SDK never receives the provider token.

Code to start this flow is included in the authentication tutorial for each platform. At the end of the flow, the client SDK has an App Service token, and the token is automatically attached to all requests to the application backend.

For more information on the authentication flow, see [App Service authentication flow](../app-service/overview-authentication-authorization.md#authentication-flow). 
## More resources

The following tutorials show how to add authentication to your mobile clients by using the [server-directed flow](../app-service/overview-authentication-authorization.md#authentication-flow):

* [Add authentication to your iOS app][iOS]
* [Add Authentication to your Android app][Android]
* [Add Authentication to your Windows app][Windows]
* [Add authentication to your Xamarin.iOS app][Xamarin.iOS]
* [Add authentication to your Xamarin.Android app][Xamarin.Android]
* [Add authentication to your Xamarin.Forms app][Xamarin.Forms]
* [Add Authentication to your Cordova app][Cordova]

Use the following resources if you want to use the [client-directed flow](../app-service/overview-authentication-authorization.md#authentication-flow) for Azure Active Directory:

* [Use the Active Directory Authentication Library for iOS][ADAL-iOS]
* [Use the Active Directory Authentication Library for Android][ADAL-Android]
* [Use the Active Directory Authentication Library for Windows and Xamarin][ADAL-dotnet]

Use the following resources if you want to use the [client-directed flow](../app-service/overview-authentication-authorization.md#authentication-flow) for Facebook:

* [Use the Facebook SDK for iOS](../app-service-mobile/app-service-mobile-ios-how-to-use-client-library.md#facebook-sdk)

Use the following resources if you want to use the [client-directed flow](../app-service/overview-authentication-authorization.md#authentication-flow) for Twitter:

* [Use Twitter Fabric for iOS](../app-service-mobile/app-service-mobile-ios-how-to-use-client-library.md#twitter-fabric)

Use the following resources if you want to use the [client-directed flow](../app-service/overview-authentication-authorization.md#authentication-flow) for Google:

* [Use the Google Sign-In SDK for iOS](../app-service-mobile/app-service-mobile-ios-how-to-use-client-library.md#google-sdk)

[iOS]: ../app-service-mobile/app-service-mobile-ios-get-started-users.md
[Android]: ../app-service-mobile/app-service-mobile-android-get-started-users.md
[Xamarin.iOS]: ../app-service-mobile/app-service-mobile-xamarin-ios-get-started-users.md
[Xamarin.Android]: ../app-service-mobile/app-service-mobile-xamarin-android-get-started-users.md
[Xamarin.Forms]: ../app-service-mobile/app-service-mobile-xamarin-forms-get-started-users.md
[Windows]: ../app-service-mobile/app-service-mobile-windows-store-dotnet-get-started-users.md
[Cordova]: ../app-service-mobile/app-service-mobile-cordova-get-started-users.md

[AAD]: ../app-service/configure-authentication-provider-aad.md
[Facebook]: ../app-service/configure-authentication-provider-facebook.md
[Google]: configure-authentication-provider-google.md
[MSA]: ../app-service/configure-authentication-provider-microsoft.md
[Twitter]: ../app-service/configure-authentication-provider-twitter.md

[custom-auth]: ../app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#custom-auth

[ADAL-Android]: ../app-service-mobile/app-service-mobile-android-how-to-use-client-library.md#adal
[ADAL-iOS]: ../app-service-mobile/app-service-mobile-ios-how-to-use-client-library.md#adal
[ADAL-dotnet]: ../app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library.md#adal
