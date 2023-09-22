---
title: Build a mobile app that calls web APIs
description: Learn how to build a mobile app that calls web APIs (overview)
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 02/07/2023
ms.author: henrymbugua
ms.reviewer: brandwe, jmprieur
ms.custom: aaddev, identityplatformtop40
#Customer intent: As an application developer, I want to know how to write a mobile app that calls web APIs by using the Microsoft identity platform.
---

# Scenario: Mobile application that calls web APIs

Learn how to build a mobile app that calls web APIs.

## Getting started

If you haven't already, create your first application by completing a quickstart:

- [Quickstart: Acquire a token and call Microsoft Graph API from an Android app](./quickstart-v2-android.md)
- [Quickstart: Acquire a token and call Microsoft Graph API from an iOS app](./quickstart-v2-ios.md)
- [Quickstart: Acquire a token and call Microsoft Graph API from a Xamarin iOS and Android app](https://github.com/Azure-Samples/active-directory-xamarin-native-v2) (GitHub)

## Overview

A personalized, seamless user experience is essential for mobile apps. The Microsoft identity platform enables mobile developers to create that experience for iOS and Android users. Your application can sign in Microsoft Entra users, personal Microsoft account users, and Azure AD B2C users. It can also acquire tokens to call a web API on their behalf. To implement these flows, we'll use the Microsoft Authentication Library (MSAL). MSAL implements the industry standard [OAuth2.0 authorization code flow](v2-oauth2-auth-code-flow.md).

![Daemon apps](./media/scenarios/mobile-app.svg)

Considerations for mobile apps:

- **User experience is key**: Allow users to see the value of your app before you ask for sign-in. Request only the required permissions.
- **Support all user configurations**: Many mobile business users must adhere to conditional-access policies and device-compliance policies. Be sure to support these key scenarios.
- **Implement single sign-on (SSO)**: By using MSAL and Microsoft identity platform, you can enable SSO through the device's browser or Microsoft Authenticator (and Intune Company Portal on Android).
- **Implement shared device mode**: Enable your application to be used in shared-device scenarios, for example hospitals, manufacturing, retail, and finance. [Read more about supporting shared device mode](msal-shared-devices.md).

## Specifics

Keep in mind the following considerations when you build a mobile app on Microsoft identity platform:

- Depending on the platform, some user interaction might be required the first time that users sign in. For example, iOS requires apps to show user interaction when they use SSO for the first time through Microsoft Authenticator (and Intune Company Portal on Android).
- On iOS and Android, MSAL might use an external browser to sign in users. The external browser might appear on top of your app.
- Never use a secret in a mobile application. In these applications, secrets are accessible to all users.

## Recommended reading

[!INCLUDE [recommended-topics](./includes/scenarios/scenarios-prerequisites.md)]

## Next steps

Move on to the next article in this scenario,
[App registration](scenario-mobile-app-registration.md).
