---
title: Register mobile apps that call web APIs
description: Learn how to build a mobile app that calls web APIs (app's registration)
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 08/18/2021
ms.author: henrymbugua
ms.reviewer: brandwe, jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a mobile app that calls web APIs by using the Microsoft identity platform for developers.
---

# Register mobile apps that call web APIs

This article contains instructions to help you register a mobile application that you're creating.

## Supported account types

The account types that your mobile applications support depend on the experience that you want to enable and the flows that you want to use.

### Audience for interactive token acquisition

Most mobile applications use interactive authentication. If your app uses this form of authentication, you can sign in users from any [account type](quickstart-register-app.md).

### Audience for integrated Windows authentication, username-password, and B2C

If you have a Universal Windows Platform (UWP) app, you can use integrated Windows authentication (IWA) to sign in users. To use IWA or username-password authentication, your application needs to sign in users in your own line-of-business (LOB) developer tenant. In an independent software vendor (ISV) scenario, your application can sign in users in Microsoft Entra organizations. These authentication flows aren't supported for Microsoft personal accounts.

You can also sign in users by using social identities that pass a B2C authority and policy. To use this method, you can use only interactive authentication and username-password authentication. Username-password authentication is currently supported only on Xamarin.iOS, Xamarin.Android, and UWP.

For more information, see [Scenarios and supported authentication flows](authentication-flows-app-scenarios.md#scenarios-and-supported-authentication-flows) and [Scenarios and supported platforms and languages](authentication-flows-app-scenarios.md#scenarios-and-supported-platforms-and-languages).

## Platform configuration and redirect URIs

### Interactive authentication

When you build a mobile app that uses interactive authentication, the most critical registration step is the redirect URI. This experience enables your app to get single sign-on (SSO) through Microsoft Authenticator (and Intune Company Portal on Android). It also supports device management policies.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Developer](../roles/permissions-reference.md#application-developer).
1. Browse to **Identity** > **Applications** > **App registrations**.
1. Select **New registration**.
1. Enter a **Name** for the application.
1. For **Supported account types**, select **Accounts in this organizational directory only**.
1. Select **Register**.
1. Select **Authentication** and then select **Add a platform**.

   ![Add a platform](https://user-images.githubusercontent.com/13203188/60799366-4c01ad00-a173-11e9-934f-f02e26c9429e.png)

1. When the list of platforms is supported, select **iOS / macOS**.

   ![Choose a mobile application](https://user-images.githubusercontent.com/13203188/60799411-60de4080-a173-11e9-9dcc-d39a45826d42.png)

1. Enter your bundle ID, and then select **Configure**.

   ![Enter your bundle ID](https://user-images.githubusercontent.com/13203188/60799477-7eaba580-a173-11e9-9f8b-431f5b09344e.png)

When you complete the steps, the redirect URI is computed for you, as in the following image.

![The resulting redirect URI](https://user-images.githubusercontent.com/13203188/60799538-9e42ce00-a173-11e9-860a-015a1840fd19.png)

If you prefer to manually configure the redirect URI, you can do so through the application manifest. Here's the recommended format for the manifest:

- **iOS**: `msauth.<BUNDLE_ID>://auth`
  - For example, enter `msauth.com.yourcompany.appName://auth`
- **Android**: `msauth://<PACKAGE_NAME>/<SIGNATURE_HASH>`
  - You can generate the Android signature hash by using the release key or debug key through the KeyTool command.

### Username-password authentication

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

If your app uses only username-password authentication, you don't need to register a redirect URI for your application. This flow does a round trip to the Microsoft identity platform. Your application won't be called back on any specific URI.

However, identify your application as a public client application. To do so:

1. Still in the Microsoft Entra admin center, select your app in **App registrations**, and then select **Authentication**.
1. In **Advanced settings** > **Allow public client flows** > **Enable the following mobile and desktop flows:**, select **Yes**.

   :::image type="content" source="media/scenarios/default-client-type.png" alt-text="Enable public client setting on Authentication pane in Azure portal":::

## API permissions

Mobile applications call APIs for the signed-in user. Your app needs to request delegated permissions. These permissions are also called scopes. Depending on the experience that you want, you can request delegated permissions statically through the Azure portal. Or you can request them dynamically at runtime.

By statically registering permissions, you allow administrators to easily approve your app. Static registration is recommended.

## Next steps

Move on to the next article in this scenario,
[App code configuration](scenario-mobile-app-configuration.md).
