---
title: Register mobile apps that call web APIs | Azure
titleSuffix: Microsoft identity platform
description: Learn how to build a mobile app that calls web APIs (app's code configuration)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.reviwer: brandwe
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a mobile app that calls web APIs using the Microsoft identity platform for developers.
---

# Mobile app that calls web APIs - app registration

This article contains the app registration instructions for creating a mobile application.

## Supported accounts types

The account types supported in mobile applications depend on the experience you want to enable, and the flows you want to use.

### Audience for interactive token acquisition

Most mobile applications use interactive authentication. If that's your case, you can sign in users from any [account type](quickstart-register-app.md#register-a-new-application-using-the-azure-portal)

### Audience for Integrated authentication, username/password, and B2C

- If you intend to use Integrated Windows authentication (possible in UWP apps) or username/password, your application needs to sign in users in your own tenant (LOB developer), or in Azure Active directory organizations (ISV scenario). These authentication flows aren't supported for Microsoft personal accounts
- If you sign in users with social identities passing a B2C authority and policy, you can only use interactive and username-password authentication. Username-password is currently only supported on Xamarin.iOS, Xamarin.Android and UWP.

For the big picture, see [Scenarios and supported authentication flows](authentication-flows-app-scenarios.md#scenarios-and-supported-authentication-flows) and [Scenarios and supported platforms and languages](authentication-flows-app-scenarios.md#scenarios-and-supported-platforms-and-languages)

## Platform configuration and redirect URIs  

### Interactive authentication

When building a mobile app using interactive authentication, the most critical registration step is the redirect URI. This can be set through the [platform configuration in the Authentication blade](https://aka.ms/MobileAppReg).

This experience will enable your app to get single sign-on (SSO) through the Microsoft Authenticator (and Intune Company Portal on Android) as well as support device management policies.

Note that there is a preview experience in the app registration portal to help you compute the brokered reply URI for iOS and Android applications:

1. In the app registration choose **Authentication** and selection **Try-out the new experience**
   ![image](https://user-images.githubusercontent.com/13203188/60799285-2d031b00-a173-11e9-9d28-ac07a7ae894a.png)

2. Select **Add platform**
   ![image](https://user-images.githubusercontent.com/13203188/60799366-4c01ad00-a173-11e9-934f-f02e26c9429e.png)

3. When the list of platforms is supported, select **iOS**
   ![image](https://user-images.githubusercontent.com/13203188/60799411-60de4080-a173-11e9-9dcc-d39a45826d42.png)

4. Enter your bundle ID as requested, and then press **Register**
   ![image](https://user-images.githubusercontent.com/13203188/60799477-7eaba580-a173-11e9-9f8b-431f5b09344e.png)

5. The redirect URI is computed for you.
   ![image](https://user-images.githubusercontent.com/13203188/60799538-9e42ce00-a173-11e9-860a-015a1840fd19.png)

If you prefer to manually configure the redirect URI, you can do so through the Application Manifest. The recommended format is the following:

- ***iOS***: `msauth.<BUNDLE_ID>://auth` (for instance  "msauth.com.yourcompany.appName://auth")
- ***Android***: `msauth://<PACKAGE_NAME>/<SIGNATURE_HASH>`
  - The Android signature hash can be generated using the release or debug keys through the KeyTool command.

### Username password

If your app is only using Username/Password, you don't need to register a redirect URI for your application. Indeed, this flow does a round trip to the Microsoft identity platform v2.0 endpoint and your application won't be called back on any specific URI. However, you need to express that your application is a public client application. This configuration is achieved by going to the **Authentication** section for your application, and in the **Advanced settings** subsection, choose **Yes**, to the question **Treat application as a public client** (in the **Default client type** paragraph)

## API permissions

Mobile applications call APIs on behalf of the signed-in user. Your app needs to request delegated permissions, also referred to as scopes. Depending on the desired experience, this can be done statically through the Azure portal or dynamically at run-time. Statically registering permissions allows admins to easily approve your app and is recommended.

## Next steps

> [!div class="nextstepaction"]
> [Code configuration](scenario-mobile-app-configuration.md)
