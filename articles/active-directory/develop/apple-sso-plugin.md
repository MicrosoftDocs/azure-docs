---
title: Microsoft Enterprise SSO plug-in for Apple devices
description: Learn about the Microsoft Entra SSO plug-in for iOS, iPadOS, and macOS devices.
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/05/2023
ms.author: henrymbugua
ms.reviewer: brandwe
ms.custom: aaddev
---
# Microsoft Enterprise SSO plug-in for Apple devices

The **Microsoft Enterprise SSO plug-in for Apple devices** provides single sign-on (SSO) for Microsoft Entra accounts on macOS, iOS, and iPadOS across all applications that support Apple's [enterprise single sign-on](https://developer.apple.com/documentation/authenticationservices) feature. The plug-in provides SSO for even old applications that your business might depend on but that don't yet support the latest identity libraries or protocols. Microsoft worked closely with Apple to develop this plug-in to increase your application's usability while providing the best protection available.

The Enterprise SSO plug-in is currently a built-in feature of the following apps:

* [Microsoft Authenticator](https://support.microsoft.com/account-billing/how-to-use-the-microsoft-authenticator-app-9783c865-0308-42fb-a519-8cf666fe0acc): iOS, iPadOS
* Microsoft Intune [Company Portal](/mem/intune/apps/apps-company-portal-macos): macOS

## Features

The Microsoft Enterprise SSO plug-in for Apple devices offers the following benefits:

- It provides SSO for Microsoft Entra accounts across all applications that support the Apple Enterprise SSO feature.
- It can be enabled by any mobile device management (MDM) solution and is supported in both device and user enrollment. 
- It extends SSO to applications that don't yet use the Microsoft Authentication Library (MSAL).
- It extends SSO to applications that use OAuth 2, OpenID Connect, and SAML.
- It is natively integrated with the MSAL, which provides a smooth native experience to the end user when the Microsoft Enterprise SSO plug-in is enabled. 

## Requirements

To use the Microsoft Enterprise SSO plug-in for Apple devices:

- The device must *support* and have an installed app that has the Microsoft Enterprise SSO plug-in for Apple devices:
  - iOS 13.0 and later: [Microsoft Authenticator app](https://support.microsoft.com/account-billing/how-to-use-the-microsoft-authenticator-app-9783c865-0308-42fb-a519-8cf666fe0acc)
  - iPadOS 13.0 and later: [Microsoft Authenticator app](https://support.microsoft.com/account-billing/how-to-use-the-microsoft-authenticator-app-9783c865-0308-42fb-a519-8cf666fe0acc)
  - macOS 10.15 and later: [Intune Company Portal app](/mem/intune/user-help/enroll-your-device-in-intune-macos-cp)
- The device must be *enrolled in MDM*, for example, through Microsoft Intune.
- Configuration must be *pushed to the device* to enable the Enterprise SSO plug-in. Apple requires this security constraint.

### iOS requirements
- iOS 13.0 or higher must be installed on the device.
- A Microsoft application that provides the Microsoft Enterprise SSO plug-in for Apple devices must be installed on the device. This app is the [Microsoft Authenticator app](https://support.microsoft.com/account-billing/how-to-use-the-microsoft-authenticator-app-9783c865-0308-42fb-a519-8cf666fe0acc).


### macOS requirements
- macOS 10.15 or higher must be installed on the device. 
- A Microsoft application that provides the Microsoft Enterprise SSO plug-in for Apple devices must be installed on the device. This app is the [Intune Company Portal app](/mem/intune/user-help/enroll-your-device-in-intune-macos-cp).

## Enable the SSO plug-in

Use the following information to enable the SSO plug-in by using MDM.

### Microsoft Intune configuration

If you use Microsoft Intune as your MDM service, you can use built-in configuration profile settings to enable the Microsoft Enterprise SSO plug-in:

1. Configure the [SSO app extension](/mem/intune/configuration/device-features-configure#single-sign-on-app-extension) settings of a configuration profile. 
1. If the profile isn't already assigned, [assign the profile to a user or device group](/mem/intune/configuration/device-profile-assign).

The profile settings that enable the SSO plug-in are automatically applied to the group's devices the next time each device checks in with Intune.

### Manual configuration for other MDM services

If you don't use Intune for MDM, you can configure an Extensible Single Sign On profile payload for Apple devices. Use the following parameters to configure the Microsoft Enterprise SSO plug-in and its configuration options.

iOS settings:

- **Extension ID**: `com.microsoft.azureauthenticator.ssoextension`
- **Team ID**: This field isn't needed for iOS.

macOS settings:

- **Extension ID**: `com.microsoft.CompanyPortalMac.ssoextension`
- **Team ID**: `UBF8T346G9`

Common settings:

- **Type**: Redirect
  - `https://login.microsoftonline.com`
  - `https://login.microsoft.com`
  - `https://sts.windows.net`
  - `https://login.partner.microsoftonline.cn`
  - `https://login.chinacloudapi.cn`
  - `https://login.microsoftonline.us`
  - `https://login-us.microsoftonline.com`

### Deployment guides

Use the following deployment guides to enable the Microsoft Enterprise SSO plug-in using your chosen MDM solution:

#### Intune:
* [iOS Guide](/mem/intune/configuration/use-enterprise-sso-plug-in-ios-ipados-with-intune?tabs=prereq-intune%2Ccreate-profile-intune)
* [macOS Guide](/mem/intune/configuration/use-enterprise-sso-plug-in-macos-with-intune?tabs=prereq-intune%2Ccreate-profile-intune)

#### Jamf Pro:
* [iOS Guide](/mem/intune/configuration/use-enterprise-sso-plug-in-ios-ipados-with-intune?tabs=prereq-jamf-pro%2Ccreate-profile-jamf-pro)
* [macOS Guide](/mem/intune/configuration/use-enterprise-sso-plug-in-macos-with-intune?tabs=prereq-jamf-pro%2Ccreate-profile-jamf-pro)

#### Other MDM:
* [iOS Guide](/mem/intune/configuration/use-enterprise-sso-plug-in-ios-ipados-with-intune?tabs=prereq-other-mdm%2Ccreate-profile-other-mdm)
* [macOS Guide](/mem/intune/configuration/use-enterprise-sso-plug-in-macos-with-intune?tabs=prereq-other-mdm%2Ccreate-profile-other-mdm)
  
### More configuration options
You can add more configuration options to extend SSO functionality to other apps.

#### Enable SSO for apps that don't use MSAL

The SSO plug-in allows any application to participate in SSO even if it wasn't developed by using a Microsoft SDK like Microsoft Authentication Library (MSAL).

The SSO plug-in is installed automatically by devices that have:
* Downloaded the Authenticator app on iOS or iPadOS, or downloaded the Intune Company Portal app on macOS.
* MDM-enrolled their device with your organization. 

Your organization likely uses the Authenticator app for scenarios like multifactor authentication, passwordless authentication, and Conditional Access. By using an MDM provider, you can turn on the SSO plug-in for your applications. Microsoft has made it easy to configure the plug-in using Microsoft Intune. An allowlist is used to configure these applications to use the SSO plug-in.

>[!IMPORTANT]
> The Microsoft Enterprise SSO plug-in supports only apps that use native Apple network technologies or webviews. It doesn't support applications that ship their own network layer implementation.  

Use the following parameters to configure the Microsoft Enterprise SSO plug-in for apps that don't use MSAL.

>[!IMPORTANT]
> You don't need to add apps that use a Microsoft Authentication Library to this allow-list. Those apps will participate in SSO by default. Most of the Microsoft-built apps use a Microsoft Authentication Library. 

#### Enable SSO for all managed apps

- **Key**: `Enable_SSO_On_All_ManagedApps`
- **Type**: `Integer`
- **Value**: 1 or 0. This value is set to 0 by default.

When this flag is on (its value is set to `1`), all MDM-managed apps not in the `AppBlockList` may participate in SSO.

#### Enable SSO for specific apps

- **Key**: `AppAllowList`
- **Type**: `String`
- **Value**: Comma-delimited list of application bundle IDs for the applications that are allowed to participate in SSO.
- **Example**: `com.contoso.workapp, com.contoso.travelapp`

>[!NOTE]
> Safari and Safari View Service are allowed to participate in SSO by default. Can be configured *not* to participate in SSO by adding the bundle IDs of Safari and Safari View Service in AppBlockList. 
> iOS Bundle IDs : [com.apple.mobilesafari, com.apple.SafariViewService]
> macOS BundleID : [com.apple.Safari]

#### Enable SSO for all apps with a specific bundle ID prefix
- **Key**: `AppPrefixAllowList`
- **Type**: `String`
- **Value**: Comma-delimited list of application bundle ID prefixes for the applications that are allowed to participate in SSO. This parameter allows all apps that start with a particular prefix to participate in SSO. For iOS,  the default value would be set to `com.apple.` and that would enable SSO for all Apple apps. For macOS, the default value would be set to `com.apple.` and `com.microsoft.` and that would enable SSO for all Apple and Microsoft apps. Admins could override the default value or add apps to `AppBlockList` to prevent them from participating in SSO.
- **Example**: `com.contoso., com.fabrikam.`

#### Disable SSO for specific apps

- **Key**: `AppBlockList`
- **Type**: `String`
- **Value**: Comma-delimited list of application bundle IDs for the applications that are allowed not to participate in SSO.
- **Example**: `com.contoso.studyapp, com.contoso.travelapp`

To *disable* SSO for Safari or Safari View Service, you must explicitly do so by adding their bundle IDs to the `AppBlockList`: 

- iOS: `com.apple.mobilesafari`, `com.apple.SafariViewService`
- macOS: `com.apple.Safari`

#### Enable SSO through cookies for a specific application

Some iOS apps that have advanced network settings might experience unexpected issues when they're enabled for SSO. For example, you might see an error indicating that a network request was canceled or interrupted.

If your users have problems signing in to an application even after you've enabled it through the other settings, try adding it to the `AppCookieSSOAllowList` to resolve the issues.

- **Key**: `AppCookieSSOAllowList`
- **Type**: `String`
- **Value**: Comma-delimited list of application bundle ID prefixes for the applications that are allowed to participate in the SSO. All apps that start with the listed prefixes will be allowed to participate in SSO. 
- **Example**: `com.contoso.myapp1, com.fabrikam.myapp2`

**Other requirements**: To enable SSO for applications by using `AppCookieSSOAllowList`, you must also add their bundle ID prefixes `AppPrefixAllowList`.

Try this configuration only for applications that have unexpected sign-in failures. This key is to be used only for iOS apps and not for macOS apps.

#### Summary of keys

| Key | Type | Value |
|--|--|--|
| `Enable_SSO_On_All_ManagedApps` | Integer | `1` to enable SSO for all managed apps, `0` to disable SSO for all managed apps. |
| `AppAllowList` | String<br/>*(comma-delimited  list)* | Bundle IDs of applications allowed to participate in SSO. |
| `AppBlockList` | String<br/>*(comma-delimited  list)* | Bundle IDs of applications not allowed to participate in SSO. |
| `AppPrefixAllowList` | String<br/>*(comma-delimited  list)* | Bundle ID prefixes of applications allowed to participate in SSO. For iOS, the default value would be set to `com.apple.` and that would enable SSO for all Apple apps. For macOS, the default value would be set to `com.apple.` and `com.microsoft.` and that would enable SSO for all Apple and Microsoft apps. Developers, Customers, or Admins could override the default value or add apps to `AppBlockList` to prevent them from participating in SSO. |
| `AppCookieSSOAllowList` | String<br/>*(comma-delimited  list)* | Bundle ID prefixes of applications allowed to participate in SSO but that use special network settings and have trouble with SSO using the other settings. Apps you add to `AppCookieSSOAllowList` must also be added to `AppPrefixAllowList`. Please note that this key is to be used only for iOS apps and not for macOS apps. |

#### Settings for common scenarios

- *Scenario*: I want to enable SSO for most managed applications, but not for all of them.

    | Key | Value |
    | -------- | ----------------- |
    | `Enable_SSO_On_All_ManagedApps` | `1` |
    | `AppBlockList` | The bundle IDs (comma-delimited list) of the apps you want to prevent from participating in SSO. |

- *Scenario* I want to disable SSO for Safari, which is enabled by default, but enable SSO for all managed apps.

    | Key | Value |
    | -------- | ----------------- |
    | `Enable_SSO_On_All_ManagedApps` | `1` |
    | `AppBlockList` | The bundle IDs (comma-delimited list) of the Safari apps you want to prevent from participating in SSO.<ul><li>For iOS: `com.apple.mobilesafari`, `com.apple.SafariViewService`</li><li>For macOS: `com.apple.Safari`</li></ul> |

- *Scenario*: I want to enable SSO on all managed apps and few unmanaged apps, but disable SSO for a few other apps.

    | Key | Value |
    | -------- | ----------------- |
    | `Enable_SSO_On_All_ManagedApps` | `1` |
    | `AppAllowList` | The bundle IDs (comma-delimited list) of the apps you want to enable for participation in for SSO. |
    | `AppBlockList` | The bundle IDs (comma-delimited list) of the apps you want to prevent from participating in SSO. |


##### Find app bundle identifiers on iOS devices

Apple provides no easy way to get bundle IDs from the App Store. The easiest way to get the bundle IDs of the apps you want to use for SSO is to ask your vendor or app developer. If that option isn't available, you can use your MDM configuration to find the bundle IDs: 

1. Temporarily enable the following flag in your MDM configuration:

    - **Key**: `admin_debug_mode_enabled`
    - **Type**: `Integer`
    - **Value**: 1 or 0
1. When this flag is on, sign in to iOS apps on the device for which you want to know the bundle ID. 
1. In the Authenticator app, select **Help** > **Send logs** > **View logs**. 
1. In the log file, look for following line: `[ADMIN MODE] SSO extension has captured following app bundle identifiers`. This line should capture all application bundle IDs that are visible to the SSO extension. 

Use the bundle IDs to configure SSO for the apps. Disable admin mode once done. 

#### Allow users to sign in from applications that don't use MSAL and the Safari browser

By default, the Microsoft Enterprise SSO plug-in will acquire a shared credential when it's called by another app that uses MSAL during a new token acquisition. Depending on the configuration, Microsoft Enterprise SSO plug-in can also acquire a shared credential when it is called by apps that don't use MSAL. 

When you enable the `browser_sso_interaction_enabled` flag, apps that don't use MSAL can do the initial bootstrapping and get a shared credential. The Safari browser can also do the initial bootstrapping and get a shared credential. 

If the Microsoft Enterprise SSO plug-in doesn't have a shared credential yet, it will try to get one whenever a sign-in is requested from a Microsoft Entra URL inside the Safari browser, ASWebAuthenticationSession, SafariViewController, or another permitted native application. 

Use these parameters to enable the flag: 

- **Key**: `browser_sso_interaction_enabled`
- **Type**: `Integer`
- **Value**: 1 or 0. This value is set to 1 by default. 

Both iOS and macOS require this setting so that the Microsoft Enterprise SSO plug-in can provide a consistent experience across all apps. This setting is enabled by default and it should only be disabled if the end user is unable to sign in with their credentials.

#### Disable OAuth 2 application prompts

If an application prompts your users to sign in even though the Microsoft Enterprise SSO plug-in works for other applications on the device, the app might be bypassing SSO at the protocol layer.  Shared credentials are also ignored by such applications because the plug-in provides SSO by appending the credentials to network requests made by allowed applications.

These parameters specify whether the SSO extension should prevent native and web applications from bypassing SSO at the protocol layer and forcing the display of a sign-in prompt to the user.

For a consistent SSO experience across all apps on the device, we recommend you enable one of these settings for apps that don't use MSAL. You should only enable this for apps that use MSAL if your users are experiencing unexpected prompts. 

##### Apps that don't use a Microsoft Authentication Library:
  
Disable the app prompt and display the account picker:

- **Key**: `disable_explicit_app_prompt`
- **Type**: `Integer`
- **Value**: 1 or 0. This value is set to 1 by default and this default setting reduces the prompts.
  
Disable app prompt and select an account from the list of matching SSO accounts automatically:
- **Key**: `disable_explicit_app_prompt_and_autologin`
- **Type**: `Integer`
- **Value**: 1 or 0. This value is set to 0 by default.

##### Apps that use a Microsoft Authentication Library:

Following settings are not recommended if [App protection policies](/mem/intune/apps/app-protection-policy) are in use. 

Disable the app prompt and display the account picker:

- **Key**: `disable_explicit_native_app_prompt`
- **Type**: `Integer`
- **Value**: 1 or 0. This value is set to 0 by default.
  
Disable app prompt and select an account from the list of matching SSO accounts automatically:
- **Key**: `disable_explicit_native_app_prompt_and_autologin`
- **Type**: `Integer`
- **Value**: 1 or 0. This value is set to 0 by default.

#### Unexpected SAML application prompts

If an application prompts your users to sign in even though the Microsoft Enterprise SSO plug-in works for other applications on the device, the app might be bypassing SSO at the protocol layer. If the application is using the SAML protocol, the Microsoft Enterprise SSO plug-in won't be able to provide SSO to the app. The application vendor should be notified about this behavior and make a change in their app to not bypass SSO.

#### Change iOS experience for MSAL-enabled applications

Apps that use MSAL will always invoke SSO extension natively for interactive requests. On some iOS devices, it might be not desirable. Specifically, if the user also needs to complete the multifactor authentication inside the Microsoft Authenticator app, an interactive redirect to that app might provide a better user experience. 

This behavior can be configured using the `disable_inapp_sso_signin` flag. If this flag is enabled, apps that use MSAL will redirect to the Microsoft Authenticator app for all interactive requests. This flag won't impact silent token requests from those apps, behavior of apps that don't use MSAL, or macOS apps. This flag is disabled by default. 

- **Key**: `disable_inapp_sso_signin`
- **Type**: `Integer`
- **Value**: 1 or 0. This value is set to 0 by default.

<a name='configure-azure-ad-device-registration'></a>

#### Configure Microsoft Entra device registration
For Intune-managed devices, the Microsoft Enterprise SSO plug-in can perform Microsoft Entra device registration when a user is trying to access resources. This enables a more streamlined end-user experience. 

Use the following configuration to enable Just in Time Registration for iOS/iPadOS with Microsoft Intune:

- **Key**: `device_registration`
- **Type**: `String`
- **Value**: {{DEVICEREGISTRATION}}

Learn more about Just in Time Registration [here](https://techcommunity.microsoft.com/t5/intune-customer-success/just-in-time-registration-for-ios-ipados-with-microsoft-intune/ba-p/3660843). 

#### Conditional Access policies and password changes
Microsoft Enterprise SSO plug-in for Apple devices is compatible with various [Microsoft Entra Conditional Access policies](/azure/active-directory/conditional-access/overview) and password change events. `browser_sso_interaction_enabled` is required to be enabled to achieve compatibility. 

Compatible events and policies are documented in the following sections:

##### Password change and token revocation
When a user resets their password, all tokens that were issued before that will be revoked. If a user is trying to access a resource after a password reset event, user would normally need to sign in again in each of the apps. When the Microsoft Enterprise SSO plug-in is enabled, user will be asked to sign in the first application that participates in SSO. Microsoft Enterprise SSO plug-in will show its own user interface on top of the application that is currently active. 

<a name='azure-ad-multi-factor-authentication'></a>

##### Microsoft Entra multifactor authentication
[Multifactor authentication](/azure/active-directory/authentication/concept-mfa-howitworks) is a process in which users are prompted during the sign-in process for an additional form of identification, such as a code on their cellphone or a fingerprint scan. Multifactor authentication can be enabled for specific resources. When the Microsoft Enterprise SSO plug-in is enabled, user will be asked to perform multifactor authentication in the first application that requires it. Microsoft Enterprise SSO plug-in will show its own user interface on top of the application that is currently active. 

##### User sign-in frequency
[Sign-in frequency](/azure/active-directory/conditional-access/howto-conditional-access-session-lifetime#user-sign-in-frequency) defines the time period before a user is asked to sign in again when attempting to access a resource. If a user is trying to access a resource after the time period has passed in various apps, a user would normally need to sign in again in each of those apps. When the Microsoft Enterprise SSO plug-in is enabled, a user will be asked to sign in to the first application that participates in SSO. Microsoft Enterprise SSO plug-in will show its own user interface on top of the application that is currently active.

### Required network configuration
The Microsoft Enterprise SSO plug-in relies on Apple's [enterprise SSO](https://developer.apple.com/documentation/authenticationservices) framework. Apple's enterprise SSO framework ensures that only an approved SSO plug-in can work for each identity provider by utilizing a technology called [associated domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains). To verify the identity of the SSO plug-in, each Apple device will send a network request to an endpoint owned by the identity provider and read information about approved SSO plug-ins. In addition to reaching out directly to the identity provider, Apple has also implemented another caching for this information. 

For the SSO plug-in to function properly, Apple devices should be allowed to reach to both identity provider URLs and its own URLs without additional interception. This means that those URLs need to be excluded from network proxies, interception and other enterprise systems. 

Here is the minimum set of URLs that need to be allowed for the SSO plug-in to function:

  - `*.cdn-apple.com`
  - `*.networking.apple`
  - `login.microsoftonline.com`
  - `login.microsoft.com`
  - `sts.windows.net`
  - `login.partner.microsoftonline.cn`
  - `login.chinacloudapi.cn`
  - `login.microsoftonline.us`
  - `login-us.microsoftonline.com`

> [!WARNING]
> If your organization uses proxy servers that intercept SSL traffic for scenarios like data loss prevention or tenant restrictions, ensure that traffic to these URLs are excluded from TLS break-and-inspect. Failure to exclude these URLs may cause interference with client certificate authentication, cause issues with device registration, and device-based Conditional Access.

If your organization blocks these URLs users may see errors like `1012 NSURLErrorDomain error` or `1000 com.apple.AuthenticationServices.AuthorizationError`.

Other Apple URLs that may need to be allowed are documented in their support article, [Use Apple products on enterprise networks](https://support.apple.com/HT210060).

#### Use Intune for simplified configuration

You can use Intune as your MDM service to ease configuration of the Microsoft Enterprise SSO plug-in. For example, you can use Intune to enable the plug-in and add old apps to an allowlist so they get SSO. 

For more information, see the [Intune configuration documentation](/intune/configuration/ios-device-features-settings).

## Use the SSO plug-in in your application

[MSAL for Apple devices](https://github.com/AzureAD/microsoft-authentication-library-for-objc) versions 1.1.0 and later supports the Microsoft Enterprise SSO plug-in for Apple devices. It's the recommended way to add support for the Microsoft Enterprise SSO plug-in. It ensures you get the full capabilities of the Microsoft identity platform.

If you're building an application for frontline-worker scenarios, see [Shared device mode for iOS devices](msal-ios-shared-devices.md) for setup information.

## Understand how the SSO plug-in works

The Microsoft Enterprise SSO plug-in relies on the [Apple Enterprise SSO framework](https://developer.apple.com/documentation/authenticationservices/asauthorizationsinglesignonprovider?language=objc). Identity providers that join the framework can intercept network traffic for their domains and enhance or change how those requests are handled. For example, the SSO plug-in can show more UIs to collect end-user credentials securely, require MFA, or silently provide tokens to the application.

Native applications can also implement custom operations and communicate directly with the SSO plug-in. For more information, see this [2019 Worldwide Developer Conference video from Apple](https://developer.apple.com/videos/play/tech-talks/301/).

> [!TIP]
> Learn more about how the SSO plug-in works and how to troubleshoot the Microsoft Enterprise SSO Extension with the [SSO troubleshooting guide for Apple devices](../devices/troubleshoot-mac-sso-extension-plugin.md).

### Applications that use MSAL

[MSAL for Apple devices](https://github.com/AzureAD/microsoft-authentication-library-for-objc) versions 1.1.0 and later supports the Microsoft Enterprise SSO plug-in for Apple devices natively for work and school accounts. 

You don't need any special configuration if you followed [all recommended steps](./quickstart-v2-ios.md) and used the default [redirect URI format](./redirect-uris-ios.md). On devices that have the SSO plug-in, MSAL automatically invokes it for all interactive and silent token requests. It also invokes it for account enumeration and account removal operations. Because MSAL implements a native SSO plug-in protocol that relies on custom operations, this setup provides the smoothest native experience to the end user. 

On iOS and iPadOS devices, if the SSO plug-in isn't enabled by MDM but the Microsoft Authenticator app is present on the device, MSAL instead uses the Authenticator app for any interactive token requests. The Microsoft Enterprise SSO plug-in shares SSO with the Authenticator app.

### Applications that don't use MSAL

Applications that don't use MSAL, can still get SSO if an administrator adds these applications to the allowlist. 

You don't need to change the code in those apps as long as the following conditions are satisfied:

- The application uses Apple frameworks to run network requests. These frameworks include [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview) and [NSURLSession](https://developer.apple.com/documentation/foundation/nsurlsession), for example. 
- The application uses standard protocols to communicate with Microsoft Entra ID. These protocols include, for example, OAuth 2, SAML, and WS-Federation.
- The application doesn't collect plaintext usernames and passwords in the native UI.

In this case, SSO is provided when the application creates a network request and opens a web browser to sign the user in. When a user is redirected to a Microsoft Entra sign-in URL, the SSO plug-in validates the URL and checks for an SSO credential for that URL. If it finds the credential, the SSO plug-in passes it to Microsoft Entra ID, which authorizes the application to complete the network request without asking the user to enter credentials. Additionally, if the device is known to Microsoft Entra ID, the SSO plug-in passes the device certificate to satisfy the device-based Conditional Access check. 

To support SSO for non-MSAL apps, the SSO plug-in implements a protocol similar to the Windows browser plug-in described in [What is a primary refresh token?](../devices/concept-primary-refresh-token.md#browser-sso-using-prt). 

Compared to MSAL-based apps, the SSO plug-in acts more transparently for non-MSAL apps. It integrates with the existing browser sign-in experience that apps provide. 

The end user sees the familiar experience and doesn't have to sign in again in each application. For example, instead of displaying the native account picker, the SSO plug-in adds SSO sessions to the web-based account picker experience. 

## Next steps

Learn about [Shared device mode for iOS devices](msal-ios-shared-devices.md).

Learn about [troubleshooting the Microsoft Enterprise SSO Extension](../devices/troubleshoot-mac-sso-extension-plugin.md).
