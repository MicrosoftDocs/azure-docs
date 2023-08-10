---
title: Support single sign-on and app protection policies in mobile apps you develop
description: Explanation and overview of building mobile applications that support single sign-on and app protection policies using the Microsoft identity platform and integrating with Azure Active Directory. 
services: active-directory
manager: henrymbuguakiarie
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/14/2020
author: janicericketts
ms.author: henrymbugua
ms.reviewer: janicericketts
ms.custom: has-adal-ref

#Customer intent: As an app developer, I want to know how to implement an app that supports single sign-on and app protection policies using the Microsoft identity platform and integrating with Azure Active Directory.
---

# Support single sign-on and app protection policies in mobile apps you develop

Single sign-on (SSO) is a key offering of the Microsoft identity platform and Azure Active Directory, providing easy and secure logins for users of your app. In addition, app protection policies (APP) enable support of the key security policies that keep your user's data safe. Together, these features enable secure user logins and management of your app's data.

> [!VIDEO https://www.youtube.com/embed/JpeMeTjQJ04]

This article explains why SSO and APP are important and provides the high-level guidance for building mobile applications that support these features. This applies for both phone and tablet apps. If you're an IT administrator that wants to deploy SSO across your organization's Azure Active Directory tenant, check out our [guidance for planning a single sign-on deployment](../manage-apps/plan-sso-deployment.md)

## About single sign-on and app protection policies

[Single sign-on (SSO)](../manage-apps/plan-sso-deployment.md) allows a user to sign in once and get access to other applications without re-entering credentials. This makes accessing apps easier and eliminates the need for users to remember long lists of usernames and passwords. Implementing it in your app makes accessing and using your app easier.

In addition, enabling single sign-on in your app unlocks new authentication mechanisms that come with modern authentication, like [passwordless logins](../authentication/concept-authentication-passwordless.md). Usernames and passwords are one of the most popular attack vectors against applications, and enabling SSO allows you to mitigate this risk by enforcing Conditional Access or passwordless logins that add additional security or rely on more secure authentication mechanisms. Finally, enabling single sign-on also enables [single sign-out](v2-protocols-oidc.md#single-sign-out). This is useful in situations like work applications that will be used on shared devices.

[App protection policies (APP)](/mem/intune/apps/app-protection-policy) ensure that an organization's data remains safe and contained. They allow companies to manage and protect their data within an app and allow control over who can access the app and its data. Implementing app protection policies enables your app to connect users to resources protected by Conditional Access policies and securely transfer data to and from other protected apps. Scenarios unlocked by app protection policies include requiring a PIN to open an app, controlling the sharing of data between apps, and preventing company app data from being saved to personal storage locations.

## Implementing single sign-on

We recommend the following to enable your app to take advantage of single sign-on.

### Use the Microsoft Authentication Library (MSAL)

The best choice for implementing single sign-on in your application is to use [the Microsoft Authentication Library (MSAL)](msal-overview.md). By using MSAL you can add authentication to your app with minimal code and API calls, get the full features of the [Microsoft identity platform](./index.yml), and let Microsoft handle the maintenance of a secure authentication solution. By default, MSAL adds SSO support for your application. In addition, using MSAL is a requirement if you also plan to implement app protection policies.

> [!NOTE]
> It is possible to configure MSAL to use an embedded web view. This will prevent single sign-on. Use the default behavior (that is, the system web browser) to ensure that SSO will work.

Azure Active Directory Authentication Library (ADAL) has been deprecated. Please use the [Microsoft Authentication Library (MSAL)](/entra/msal/). If you have existing applications that use ADAL, be sure to [migrate them to MSAL](..\develop\msal-migration.md).

For iOS applications, we have a [quickstart](quickstart-v2-ios.md) that shows you how to set up sign-ins using MSAL, as well as [guidance for configuring MSAL for various SSO scenarios](single-sign-on-macos-ios.md).

For Android applications, we have a [quickstart](quickstart-v2-android.md) that shows you how to set up sign-ins using MSAL, and guidance for [how to enable cross-app SSO on Android using MSAL](msal-android-single-sign-on.md).

### Use the system web browser

A web browser is required for interactive authentication. For mobile apps that use modern authentication libraries other than MSAL (that is, other OpenID Connect or SAML libraries), or if you implement your own authentication code, you should use the system browser as your authentication surface to enable SSO.

Google has guidance for doing this in Android Applications: [Chrome Custom Tabs - Google Chrome](https://developer.chrome.com/multidevice/android/customtabs).

Apple has guidance for doing this in iOS applications: [Authenticating a User Through a Web Service | Apple Developer Documentation](https://developer.apple.com/documentation/authenticationservices/authenticating_a_user_through_a_web_service).

> [!TIP]
> The [SSO plug-in for Apple devices](apple-sso-plugin.md) allows SSO for iOS apps that use embedded web views on managed devices using Intune. We recommend MSAL and system browser as the best option for developing apps that enable SSO for all users, but this will allow SSO in some scenarios where it otherwise is not possible.

## Enable App Protection Policies

To enable app protection policies, use the [Microsoft Authentication Library (MSAL)](msal-overview.md). MSAL is the Microsoft identity platform's authentication and authorization library and the Intune SDK is developed to work in tandem with it.

In addition, you must use a broker app for authentication. The broker requires the app to provide application and device information to ensure app compliance. iOS users will use the [Microsoft Authenticator app](https://support.microsoft.com/account-billing/sign-in-to-your-accounts-using-the-microsoft-authenticator-app-582bdc07-4566-4c97-a7aa-56058122714c) and Android users will use either the Microsoft Authenticator app or the [Company Portal app](https://play.google.com/store/apps/details?id=com.microsoft.windowsintune.companyportal) for [brokered authentication](./msal-android-single-sign-on.md). By default, MSAL uses a broker as its first choice for fulfilling an authentication request, so using the broker to authenticate will be enabled for your app automatically when using MSAL out-of-the-box.

Finally, [add the Intune SDK](/mem/intune/developer/app-sdk-get-started) to your app to enable app protection policies. The SDK for the most part follows an intercept model and will automatically apply app protection policies to determine if actions the app is taking are allowed or not. There are also APIs you can call manually to tell the app if there are restrictions on certain actions.

## Additional resources

- [Plan an Azure Active Directory single sign-on deployment](../manage-apps/plan-sso-deployment.md)
- [How to: Configure SSO on macOS and iOS](single-sign-on-macos-ios.md)
- [Microsoft Enterprise SSO plug-in for Apple devices (Preview)](apple-sso-plugin.md)
- [Brokered authentication in Android](./msal-android-single-sign-on.md)
- [Authorization agents and how to enable them](./msal-android-single-sign-on.md)
- [Get started with the Microsoft Intune App SDK](/mem/intune/developer/app-sdk-get-started)
- [Configure settings for the Intune App SDK](/mem/intune/developer/app-sdk-ios#configure-settings-for-the-intune-app-sdk)
- [Microsoft Intune protected apps](/mem/intune/apps/apps-supported-intune-apps)
