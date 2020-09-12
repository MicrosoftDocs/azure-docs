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
- **Team ID**: (this field is not needed for iOS)
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
> [Consented apps](https://docs.microsoft.com/en-us/azure/active-directory/develop/application-consent-experience) that are allowed to participate in the SSO by the MDM admin can silently get a token for the end user. Therefore, it is important to only add trusted applications to the allow list. 

> [!NOTE]
> You don't need to add applications that use MSAL or ASWebAuthenticationSession to this list. Those applications are enabled by default. 

#### Allow creating SSO session from any application

By default, the Azure AD SSO plug-in provides SSO in Safari browser, ASWebAuthenticationSession, SafariViewController and whitelisted native apps only when the SSO plug-in already has a shared credential. The Azure AD SSO plug-in can acquire a shared credential when it is called by another ADAL or MSAL based application during token acquisition (any Microsoft apps uses Microsoft Authenticator or SSO plug-in). That means that by default SSO outside of native app flows is best effort.  

Enabling `browser_sso_interaction_enabled` flag enables non MSAL apps and Safari browser to do the initial bootstrapping and get a shared credential. If the Azure AD SSO plug-in doesn’t have a shared credential yet, it will try to proactively get one whenever a sign in is requested from an Azure AD URL inside Safari browser, ASWebAuthenticationSession, SafariViewController or another whitelisted native application.  

- **Key**: `browser_sso_interaction_enabled`
- **Type**: `Integer`
- **Value**: 1 or 0

> [!NOTE]
> We recommend enabling this flag to get more consistent experience across all apps. 
> It is disabled by default. 

#### Disable OAuth2 application prompts

The Azure AD SSO plug-in provides SSO by appending a shared credentials to AAD requests coming from allowed applications. Some OAuth2 applications might be enforcing end user prompt on the protocol layer, which means that shared credential would be ignored.    

Enabling `disable_explicit_app_prompt` flag restricts ability of both native and web applications to force an end user prompt on the protocol layer and bypass SSO.

- **Key**: `disable_explicit_app_prompt`
- **Type**: `Integer`
- **Value**: 1 or 0

> [!NOTE]
> We recommend enabling this flag to get more consistent experience across all apps. 
> It is disabled by default. 

#### Use Intune for simplified configuration

You can use Microsoft Intune as your MDM service to ease configuration of the Microsoft Enterprise SSO plug-in. For more information, see the [Intune configuration documentation](/intune/configuration/ios-device-features-settings).

## Using the SSO plug-in in your application

The [Microsoft Authentication Library (MSAL) for Apple devices](https://github.com/AzureAD/microsoft-authentication-library-for-objc) version 1.1.0 and higher supports the Microsoft Enterprise SSO plug-in for Apple devices.

If you'd like to support shared device mode provided by the Microsoft Enterprise SSO plug-in for Apple devices, ensure your applications use the specified minimum required version of MSAL.

If you are building an application that will be used in the Frontline Worker scenarios, follow this guide for additional setup of the [shared device mode](msal-ios-shared-devices.md) feature.

## How SSO plug-in works?

Microsoft Enterprise SSO plug-in relies on the [Apple's Enterprise Single Sign-On framework](https://developer.apple.com/documentation/authenticationservices/asauthorizationsinglesignonprovider?language=objc). Identity providers that on-board to the framework are allowed to intercept network traffic for their domains and enhance or change how those requests are handled. For example, SSO plug-in can show additional UI to collect end user credentials securely, require MFA, or silently provide tokens to the application without asking user to sign in again. 

Native applications can also implement custom operations and talk directly to the SSO plug-in.
You can learn about Single Sign-in framework in this [2019 WWDC video from Apple](https://developer.apple.com/videos/play/tech-talks/301/)

### Applications that use MSAL

The [Microsoft Authentication Library (MSAL) for Apple devices](https://github.com/AzureAD/microsoft-authentication-library-for-objc) version 1.1.0 and higher supports the Microsoft Enterprise SSO plug-in for Apple devices natively for work and school accounts. 

There's no special configuration needed if you've followed [all recommended steps](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v2-ios) and used default [Redirect URI format](https://docs.microsoft.com/en-us/azure/active-directory/develop/redirect-uris-ios). When running on a device that has SSO plug-in present, MSAL will automatically invoke it for all interactive and silent token requests, as well as account enumeration and account removal operations. Since MSAL implements native SSO plug-in protocol that relies on custom operations, this provides the smoothest native experience to the end user. 

If SSO plug-in is not enabled, but Microsoft Authenticator app is present on the device, MSAL will instead use Microsoft Authenticator app for any interactive token requests. SSO plug-in shares SSO with the Microsoft Authenticator app.

### Applications that don't use MSAL

Applications that don't use MSAL can still get SSO if administrator adds them to the allow list explicitly. 

There's no code changes needed to those apps as long as following conditions are satisfied:
1. Application is using Apple frameworks to execute network requests (e.g. [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview), [NSURLSession](https://developer.apple.com/documentation/foundation/nsurlsession)) 
2. Application is using standard protocols to communicate with AAD (e.g. OAuth2, SAML, WS-Federation)
3. Application doesn't collect plaintext username and password in the native UI

In this case, SSO is provided at the time when application creates a network request and opens a web browser to sign user in. When a user is redirected to an Azure AD login URL, the SSO plug-in validates the URL and checks if there is an SSO credential available for that URL. If there is one, the SSO plug-in passes SSO credential to Azure AD which authorizes the application to complete network request without asking end user to enter credentials. Additionally, if device is known to Azure AD, SSO plug-in will also pass the device certificate to satisfy the device based conditional access check. 

To support SSO for non-MSAL apps, SSO plug-in implements a similar protocol to Windows browser plug-in described [here](https://docs.microsoft.com/en-us/azure/active-directory/devices/concept-primary-refresh-token#browser-sso-using-prt). 

Compared to MSAL based apps, SSO plug-in acts more transparently for non MSAL apps to integrate with the existing browser login experience that apps provide. End user would see their familiar experience with a benefit of not having to do additional sign-in in each of the applications. 

## Next steps

For more information about shared device mode on iOS, see [Shared device mode for iOS devices](msal-ios-shared-devices.md).
