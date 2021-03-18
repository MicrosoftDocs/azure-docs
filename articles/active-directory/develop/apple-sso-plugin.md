---
title: Microsoft Enterprise SSO plug-in for Apple devices
titleSuffix: Microsoft identity platform | Azure
description: Learn about Microsoft's Azure Active Directory SSO plug-in for iOS, iPadOS, and macOS devices.
services: active-directory
author: brandwe
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/15/2020
ms.author: brandwe
ms.reviewer: brandwe
ms.custom: aaddev
---

# Microsoft Enterprise SSO plug-in for Apple devices (Preview)

>[!IMPORTANT]
> This feature [!INCLUDE [PREVIEW BOILERPLATE](../../../includes/active-directory-develop-preview.md)]

The *Microsoft Enterprise SSO plug-in for Apple devices* provides single sign-on (SSO) for Azure Active Directory (Azure AD) accounts on macOS, iOS, and iPadOS across all applications that support Apple's [Enterprise Single Sign-On](https://developer.apple.com/documentation/authenticationservices) feature. This includes older applications your business might depend on but that don't yet support the latest identity libraries or protocols. Microsoft worked closely with Apple to develop this plug-in to increase your application's usability while providing the best protection that Apple and Microsoft can provide.

The Enterprise SSO plug-in is currently available as a built-in feature of the following apps:

* [Microsoft Authenticator](../user-help/user-help-auth-app-overview.md) - iOS, iPadOS
* Microsoft Intune [Company Portal](/mem/intune/apps/apps-company-portal-macos) - macOS

## Features

The Microsoft Enterprise SSO plug-in for Apple devices offers the following benefits:

- Provides SSO for Azure AD accounts across all applications that support Apple's Enterprise Single Sign-On feature.
- Can be enabled by any mobile device management (MDM) solution.
- Extends SSO to applications that do not yet use Microsoft identity platform libraries.
- Extends SSO to applications that use OAuth2, OpenID Connect, and SAML.

## Requirements

To use Microsoft Enterprise SSO plug-in for Apple devices:

- Device must **support** and have an app that includes the the Microsoft Enterprise SSO plug-in for Apple devices **installed**:
  - iOS 13.0+: [Microsoft Authenticator app](../user-help/user-help-auth-app-overview.md)
  - iPadOS 13.0+: [Microsoft Authenticator app](../user-help/user-help-auth-app-overview.md)
  - macOS 10.15+: [Intune Company Portal app](/mem/intune/user-help/enroll-your-device-in-intune-macos-cp)
- Device must be **MDM-enrolled** (for example, with Microsoft Intune).
- Configuration must be **pushed to the device** to enable the Enterprise SSO plug-in on the device. This security constraint is required by Apple.

### iOS requirements:
- iOS 13.0 or higher must be installed on the device.
- A Microsoft application that provides the Microsoft Enterprise SSO plug-in for Apple devices must be installed on the device. For Public Preview, these applications are the [Microsoft Authenticator app](/azure/active-directory/user-help/user-help-auth-app-overview).


### macOS requirements:
- macOS 10.15 or higher must be installed on the device. 
- A Microsoft application that provides the Microsoft Enterprise SSO plug-in for Apple devices must be installed on the device. For Public Preview, these applications include the [Intune Company Portal app](/mem/intune/user-help/enroll-your-device-in-intune-macos-cp).

## Enable the SSO plug-in with mobile device management (MDM)

### Microsoft Intune configuration

If you use Microsoft Intune as your MDM service, you can use built-in configuration profile settings to enable the Microsoft Enterprise SSO plug-in.

First, configure the [Single sign-on app extension](/mem/intune/configuration/device-features-configure#single-sign-on-app-extension) settings of a configuration profile and [assign the profile to a user or device group](/mem/intune/configuration/device-profile-assign) (if not already assigned).

The profile settings that enable the SSO plug-in are automatically applied to the group's devices the next time each device checks in with Intune.

### Manual configuration for other MDM services

If you're not using Microsoft Intune for mobile device management, use the following parameters to configure the Microsoft Enterprise SSO plug-in for Apple devices.

#### iOS settings:

- **Extension ID**: `com.microsoft.azureauthenticator.ssoextension`
- **Team ID**: (this field is not needed for iOS)

#### macOS settings:

- **Extension ID**: `com.microsoft.CompanyPortalMac.ssoextension`
- **Team ID**: `UBF8T346G9`

#### Common settings:

- **Type**: Redirect
  - `https://login.microsoftonline.com`
  - `https://login.microsoft.com`
  - `https://sts.windows.net`
  - `https://login.partner.microsoftonline.cn`
  - `https://login.chinacloudapi.cn`
  - `https://login.microsoftonline.de`
  - `https://login.microsoftonline.us`
  - `https://login.usgovcloudapi.net`
  - `https://login-us.microsoftonline.com`
  
### Additional configuration options
Additional configuration options can be added to extend SSO functionality to additional apps.

#### Enable SSO for apps that don't use a Microsoft identity platform library

The SSO plug-in allows any application to participate in single sign-on even if it was not developed using a Microsoft SDK like the Microsoft Authentication Library (MSAL).

The SSO plug-in is installed automatically by devices that have downloaded the Microsoft Authenticator app on iOS and iPadOS or Intune Company Portal app on macOS and registered their device with your organization. Your organization likely uses the Authenticator app today for scenarios like multi-factor authentication, password-less authentication, and conditional access. It can be turned on for your applications using any MDM provider, although Microsoft has made it easy to configure inside the Microsoft Endpoint Manager of Intune. An allow list is used to configure these applications to use the SSO plugin.

>[!IMPORTANT]
> Only apps that use native Apple network technologies or webviews are supported. If an application ships its own network layer implementation, Microsoft Enterprise SSO plug-in is not supported.  

Use the following parameters to configure the Microsoft Enterprise SSO plug-in for apps that don't use a Microsoft identity platform library:

If you want to provide a list of specific apps:

- **Key**: `AppAllowList`
- **Type**: `String`
- **Value**: Comma-delimited list of application bundle IDs for the applications that are allowed to participate in the SSO
- **Example**: `com.contoso.workapp, com.contoso.travelapp`

Or if you want to provide a list of prefixes:
- **Key**: `AppPrefixAllowList`
- **Type**: `String`
- **Value**: Comma-delimited list of application bundle ID prefixes for the applications that are allowed to participate in the SSO. Note that this will enable all apps starting with a particular prefix to participate in the SSO
- **Example**: `com.contoso., com.fabrikam.`

[Consented apps](./application-consent-experience.md) that are allowed by the MDM admin to participate in the SSO can silently get a token for the end user. Therefore, it is important to only add trusted applications to the allow list. 

>[!NOTE]
> You don't need to add applications that use MSAL or ASWebAuthenticationSession to this list. Those applications are enabled by default. 

##### How to discover app bundle identifiers on iOS devices

Apple does not provide an easy way to discover Bundle IDs from the App Store. The easiest way to discover the Bundle IDs of the apps who want to use for SSO is to ask your vendor or app developer. If that option is not available, you can use your MDM configuration to discover the Bundle IDs. 

Temporarily enable following flag in your MDM configuration:

- **Key**: `admin_debug_mode_enabled`
- **Type**: `Integer`
- **Value**: 1 or 0

When this flag is on sign-in to iOS apps on the device you want to know the Bundle ID for. Then open Microsoft Authenticator app -> Help -> Send logs -> View logs. 

In the log file, look for following line:

`[ADMIN MODE] SSO extension has captured following app bundle identifiers:`

This should capture all application bundle identifiers visible to the SSO extension. You can then use those identifiers to configure the SSO for those apps. 

#### Allow user to sign-in from unknown applications and the Safari browser.

By default the Microsoft Enterprise SSO plug-in provides SSO for authorized apps only when a user has signed in from an app that uses a Microsoft identity platform library like ADAL or MSAL. The Microsoft Enterprise SSO plug-in can also acquire a shared credential when it is called by another app that uses a Microsoft identity platform library during a new token acquisition.

Enabling `browser_sso_interaction_enabled` flag enables app that do not use a Microsoft identity platform library to do the initial bootstrapping and get a shared credential. It also allows Safari browser to do the initial bootstrapping and get a shared credential. If the Microsoft Enterprise SSO plug-in doesn’t have a shared credential yet, it will try to get one whenever a sign-in is requested from an Azure AD URL inside Safari browser, ASWebAuthenticationSession, SafariViewController, or another permitted native application.  

- **Key**: `browser_sso_interaction_enabled`
- **Type**: `Integer`
- **Value**: 1 or 0

For macOS this setting is required to get a more consistent experience across all apps. For iOS and iPadOS this setting isn't required as most apps use the Microsoft Authenticator application for sign-in. However, if you have some applications that do not use the Microsoft Authenticator on iOS or iPadOS this flag will improve the experience so we recommend you enable the setting. It is disabled by default.

#### Disable asking for MFA on initial bootstrapping

By default the Microsoft Enterprise SSO plug-in always prompts the user for Multi-factor authentication (MFA) when doing the initial bootstrapping and getting a shared credential, even if it's not required for the current application the user has launched. This is so the shared credential can be easily used across all additional applications without prompting the user if MFA becomes required later. This reduces the times the user needs to be prompted on the device and is generally a good decision.

Enabling `browser_sso_disable_mfa` turns this off and will only prompt the user when MFA is required by an application or resource. 

- **Key**: `browser_sso_disable_mfa`
- **Type**: `Integer`
- **Value**: 1 or 0

We recommend keeping this flag disabled as it reduces the times the user needs to be prompted on the device. If your organization rarely uses MFA you may want to enable the flag, but we'd recommend you use MFA more frequently instead. For this reason, it is disabled by default.

#### Disable OAuth2 application prompts

The Microsoft Enterprise SSO plug-in provides SSO by appending shared credentials to network requests coming from allowed applications. However, some OAuth2 applications might incorrectly enforce end-user prompts at the protocol layer. If this is happening, you'll see that shared credentials are ignored for those apps and your user is prompted to sign in even though the Microsoft Enterprise SSO plug-in is working for other applications.  

Enabling `disable_explicit_app_prompt` flag restricts ability of both native and web applications to force an end-user prompt on the protocol layer and bypass SSO.

- **Key**: `disable_explicit_app_prompt`
- **Type**: `Integer`
- **Value**: 1 or 0

We recommend enabling this flag to get more consistent experience across all apps. It is disabled by default. 

#### Enable SSO through cookies for specific application

A small number of apps might be incompatible with the SSO extension. Specifically, apps that have advanced network settings might experience unexpected issues when they are enabled for the SSO (e.g. you might see an error that network request got canceled or interrupted). 

If you are experiencing problems signing in using method described in the `Enable SSO for apps that don't use MSAL` section, you could try alternative configuration for those apps. 

Use the following parameters to configure the Microsoft Enterprise SSO plug-in for those specific apps:

- **Key**: `AppCookieSSOAllowList`
- **Type**: `String`
- **Value**: Comma-delimited list of application bundle ID prefixes for the applications that are allowed to participate in the SSO. Note that this will enable all apps starting with a particular prefix to participate in the SSO
- **Example**: `com.contoso.myapp1, com.fabrikam.myapp2`

Note that applications enabled for the SSO using this mechanism need to be added both to the `AppCookieSSOAllowList` and `AppPrefixAllowList`.

We recommend trying this option only for applications experiencing unexpected sign-in failures. 

#### Use Intune for simplified configuration

As stated before, you can use Microsoft Intune as your MDM service to ease configuration of the Microsoft Enterprise SSO plug-in including enabling the plug-in and adding your older apps to an allow list so they get SSO. For more information, see the [Intune configuration documentation](/intune/configuration/ios-device-features-settings).

## Using the SSO plug-in in your application

The [Microsoft Authentication Library (MSAL) for Apple devices](https://github.com/AzureAD/microsoft-authentication-library-for-objc) version 1.1.0 and higher supports the Microsoft Enterprise SSO plug-in for Apple devices. It is the recommended way to add support for the Microsoft Enterprise SSO plug-in and ensures you get the full capabilities of the Microsoft identity platform.

If you're building an application for Frontline Worker scenarios, see [Shared device mode for iOS devices](msal-ios-shared-devices.md) for additional setup of the feature.

## How the SSO plug-in works

The Microsoft Enterprise SSO plug-in relies on the [Apple's Enterprise Single Sign-On framework](https://developer.apple.com/documentation/authenticationservices/asauthorizationsinglesignonprovider?language=objc). Identity providers that onboard to the framework can intercept network traffic for their domains and enhance or change how those requests are handled. For example, the SSO plug-in can show additional UI to collect end-user credentials securely, require MFA, or silently provide tokens to the application.

Native applications can also implement custom operations and talk directly to the SSO plug-in.
You can learn about Single Sign-in framework in this [2019 WWDC video from Apple](https://developer.apple.com/videos/play/tech-talks/301/)

### Applications that use a Microsoft identity platform library

The [Microsoft Authentication Library (MSAL) for Apple devices](https://github.com/AzureAD/microsoft-authentication-library-for-objc) version 1.1.0 and higher supports the Microsoft Enterprise SSO plug-in for Apple devices natively for work and school accounts. 

There's no special configuration needed if you've followed [all recommended steps](./quickstart-v2-ios.md) and used the default [redirect URI format](./redirect-uris-ios.md). When running on a device that has the SSO plug-in present, MSAL will automatically invoke it for all interactive and silent token requests, as well as account enumeration and account removal operations. Since MSAL implements native SSO plug-in protocol that relies on custom operations, this setup provides the smoothest native experience to the end user. 

If the SSO plug-in is not enabled by MDM, but the Microsoft Authenticator app is present on the device, MSAL will instead use the Microsoft Authenticator app for any interactive token requests. The SSO plug-in shares SSO with the Microsoft Authenticator app.

### Applications that don't use a Microsoft identity platform library

Applications that don't use a Microsoft identity platform library like MSAL can still get SSO if an administrator adds them to the allow list explicitly. 

There are no code changes needed in those apps as long as following conditions are satisfied:

- Application is using Apple frameworks to execute network requests (for example, [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview), [NSURLSession](https://developer.apple.com/documentation/foundation/nsurlsession)) 
- Application is using standard protocols to communicate with Azure AD (for example, OAuth2, SAML, WS-Federation)
- Application doesn't collect plaintext username and password in the native UI

In this case, SSO is provided when the application creates a network request and opens a web browser to sign the user in. When a user is redirected to an Azure AD login URL, the SSO plug-in validates the URL and checks if there is an SSO credential available for that URL. If there is one, the SSO plug-in passes the SSO credential to Azure AD, which authorizes the application to complete the network request without asking the user to enter their credentials. Additionally, if the device is known to Azure AD, the SSO plug-in will also pass the device certificate to satisfy the device-based conditional access check. 

To support SSO for non-MSAL apps, the SSO plug-in implements a protocol similar to the Windows browser plug-in described in [What is a Primary Refresh Token?](../devices/concept-primary-refresh-token.md#browser-sso-using-prt). 

Compared to MSAL-based apps, the SSO plug-in acts more transparently for non-MSAL apps by integrating with the existing browser login experience that apps provide. The end user would see their familiar experience, with the benefit of not having to perform additional sign-ins in each of the applications. For example, instead of displaying the native account picker, the SSO plug-in adds SSO sessions to the web-based account picker experience. 

## Next steps

For more information about shared device mode on iOS, see [Shared device mode for iOS devices](msal-ios-shared-devices.md).
