---
title: Microsoft Enterprise SSO plug-in for Apple devices
titleSuffix: Microsoft identity platform | Azure
description: Learn about Microsoft's Azure Active Directory SSO plug-in for iOS and macOS devices.
services: active-directory
author: brandwe
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 03/31/2020
ms.author: brandwe
ms.reviewer: brandwe
ms.custom: aaddev
---

# Microsoft Enterprise SSO plug-in for Apple devices (Preview)

> [!NOTE]
> This feature is in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The *Microsoft Enterprise SSO plug-in for Apple devices* provides single sign-on (SSO) for Azure Active Directory (Azure AD) accounts across all applications that support Apple's [Enterprise Single Sign-On](https://developer.apple.com/documentation/authenticationservices) feature. Microsoft worked closely with Apple to develop this plug-in to increase your application's usability while providing the best protection that Apple and Microsoft can provide.

In this Public Preview release, the Enterprise SSO plug-in is available only for iOS devices and is distributed in certain Microsoft applications.

Our first use of the Enterprise SSO plug-in is with our new [shared device mode](msal-ios-shared-devices.md) feature.

## Features

The Microsoft Enterprise SSO plug-in for Apple devices offers the following benefits:

- Provides SSO for Azure AD accounts across all applications that support Apple's Enterprise Single Sign-On feature.
- Delivered automatically in the Microsoft Authenticator and can be enabled by any mobile device management (MDM) solution.

## Requirements

To use Microsoft Enterprise SSO plug-in for Apple devices:

- iOS 13.0 or higher must be installed on the device.
- A Microsoft application that provides the Microsoft Enterprise SSO plug-in for Apple devices must be installed on the device. For Public Preview, these applications include the [Microsoft Authenticator app](../user-help/user-help-auth-app-overview.md).
- Device must be MDM-enrolled (for example, with Microsoft Intune).
- Configuration must be pushed to the device to enable the Microsoft Enterprise SSO plug-in for Apple devices on the device. This security constraint is required by Apple.

## Enable the SSO extension with mobile device management (MDM)

To enable the Microsoft Enterprise SSO plug-in for Apple devices, your devices need to be sent a signal through an MDM service. Since Microsoft includes the Enterprise SSO plug-in in the [Microsoft Authenticator app](..//user-help/user-help-auth-app-overview.md), use your MDM to configure the app to enable the Microsoft Enterprise SSO plug-in.

Use the following parameters to configure the Microsoft Enterprise SSO plug-in for Apple devices:

- **Type**: Redirect
- **Extension ID**: `com.microsoft.azureauthenticator.ssoextension`
- **Team ID**: `UBF8T346G9` (this field is not used on iOS)
- **URLs**:
  - `https://login.microsoftonline.com`
  - `https://login.microsoft.com`
  - `https://sts.windows.net`
  - `https://login.partner.microsoftonline.cn`
  - `https://login.chinacloudapi.cn`
  - `https://login.microsoftonline.de`
  - `https://login.microsoftonline.us`
  - `https://login.usgovcloudapi.net`
  - `https://login-us.microsoftonline.com`
  
### Additional configuration options:
Additional configuration options can be added to extend SSO functionality to additional apps.

#### Enable SSO for apps that don't use MSAL

Specify a comma separated list of apps that don't use MSAL and should be allowed to participate in the SSO. 
Note that only apps that use native Apple network technologies or webviews are supported. If application ships its own network layer implementation, Microsoft Enterprise SSO plug-in is not supported.  

- **Key**: `AppAllowList`
- **Type**: `String`
- **Value**: Comma separated list of application bundle ids for the applications you wish to allow to be signed in with SSO.
- **Example**: `com.contoso.workapp, com.contoso.travelapp`

> [!NOTE]
> Apps that participate in the SSO can silently get a token for the user. Therefore, it is important to only add trusted applications to the allow list. 

> [!NOTE]
> You don't need to add applications that use MSAL or ASWebAuthenticationSession to this list. Those applications are enabled by default. 

#### Allow creating SSO session from any application

By default, the Azure AD SSO extension provides SSO in Safari browser, ASWebAuthenticationSession, SafariViewController and whitelisted native apps only when the SSO extension already has a shared credential. The Azure AD SSO extension can acquire a shared credential when it is called by another ADAL or MSAL based application during token acquisition (any Microsoft apps uses Microsoft Authenticator or SSO extension). That means that by default SSO outside of native app flows is best effort.  

Enabling `browser_sso_interaction_enabled` flag enables non MSAL apps and Safari browser to do the initial bootstrapping and get a shared credential. If the Azure AD SSO extension doesn’t have a shared credential yet, it will try to proactively get one whenever a sign in is requested from an Azure AD URL inside Safari browser, ASWebAuthenticationSession, SafariViewController or another whitelisted native application.  

- **Key**: `browser_sso_interaction_enabled`
- **Type**: `Integer`
- **Value**: 1 or 0

> [!NOTE]
> We recommend enabling this flag to get more consistent experience across all apps. 
> It is disabled by default. 

#### Disable OAuth2 application prompts

The Azure AD SSO extension provides SSO by appending a shared credentials to AAD requests coming from allowed applications. Some OAuth2 applications might be enforcing end user prompt on the protocol layer, which means that shared credential would be ignored.    

Enabling `disable_explicit_app_prompt` flag restricts ability of both native and web applications to force an end user prompt on the protocol layer and bypass SSO.

- **Key**: `disable_explicit_app_prompt`
- **Type**: `Integer`
- **Value**: 1 or 0

> [!NOTE]
> We recommend enabling this flag to get more consistent experience across all apps. 
> It is disabled by default. 

#### 

You can use Microsoft Intune as your MDM service to ease configuration of the Microsoft Enterprise SSO plug-in. For more information, see the [Intune configuration documentation](/intune/configuration/ios-device-features-settings).

## Using the SSO extension in your application

The [Microsoft Authentication Library (MSAL) for Apple devices](https://github.com/AzureAD/microsoft-authentication-library-for-objc) version 1.1.0 and higher supports the Microsoft Enterprise SSO plug-in for Apple devices.

If you'd like to support shared device mode provided by the Microsoft Enterprise SSO plug-in for Apple devices, ensure your applications use the specified minimum required version of MSAL.

## Next steps

For more information about shared device mode on iOS, see [Shared device mode for iOS devices](msal-ios-shared-devices.md).
