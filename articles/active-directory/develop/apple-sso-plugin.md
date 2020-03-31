---
title: Microsoft Enterprise SSO plug-in for Apple devices
titleSuffix: Microsoft identity platform
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

The *Microsoft Enterprise SSO plug-in for Apple devices* provides single sign-on (SSO) for Active Directory-joined accounts across all applications that support Apple's [Enterprise Single Sign-On](https://developer.apple.com/documentation/authenticationservices) feature. Microsoft worked closely with Apple to develop this plug-in to increase your application's usability while providing the best protection that Apple and Microsoft can provide.

In this Public Preview release, the Enterprise SSO plug-in is available only for iOS devices and is distributed in certain Microsoft applications. The list of products and applications that support the Enterprise SSO plug-in in the future will be expanded in the future.

Our first use of the Enterprise SSO plug-in is with our new [Shared Device Mode](msal-ios-shared-devices.md) product feature.

## Features

The Microsoft Enterprise SSO plug-in for Apple devices offers the following benefits:

- Provides seamless SSO for Active Directory-joined accounts across all applications that support Apple's Enterprise Single Sign-On feature.
- Delivered automatically in the Microsoft Authenticator and can be enabled by any mobile device management (MDM) solution.

Planned but not yet available in this preview release:

- Provides seamless SSO across Safari browsers and applications on the device.

## Requirements

To use Microsoft Enterprise SSO plug-in for Apple devices, devices must meet the following requirements:

- iOS 13.0 or higher must be installed on the device.
- A Microsoft application that provides the Microsoft Enterprise SSO plug-in for Apple devices must be installed on the device. For Public Preview, this includes the [Microsoft Authenticator](../user-help/user-help-auth-app-overview.md) app.
- Device must be MDM-enrolled (for example, Microsoft Intune).
- Configuration must be pushed to the device to enable the Microsoft Enterprise SSO plug-in for Apple devices on the device. This security constraint is required by Apple.

## Enable the SSO extension with mobile device management (MDM)

To enable the Microsoft Enterprise SSO plug-in for Apple devices, your devices need to be sent a signal through an MDM service. Since Microsoft includes the Enterprise SSO plug-in in the [Microsoft Authenticator](..//user-help/user-help-auth-app-overview.md) app, use your MDM to configure the app to enable the Microsoft Enterprise SSO plug-in.

Use the following parameters to configure the Microsoft Enterprise SSO plug-in:

- **Type**: Redirect
- **Extension ID**: `com.microsoft.azureauthenticator.ssoextension`
- **Team ID**: `SGGM6D27TK`
- **URLs**:
  - `https://login.microsoftonline.com`
  - `https://login.windows.net`
  - `https://login.microsoft.com`
  - `https://sts.windows.net`
  - `https://login.partner.microsoftonline.cn`
  - `https://login.chinacloudapi.cn`
  - `https://login.microsoftonline.de`
  - `https://login.microsoftonline.us`
  - `https://login.usgovcloudapi.net`
  - `https://login-us.microsoftonline.com`

You can use Microsoft Intune as your MDM service to ease configuration of the Microsoft Enterprise SSO plug-in. For more information, see the [Intune configuration documentation](https://docs.microsoft.com/intune/configuration/ios-device-features-settings).

## Using the SSO extension in your application

The Microsoft Authentication Library (MSAL) for Apple devices version 1.1.0 and higher supports the Microsoft Enterprise SSO plug-in for Apple devices.

Using MSAL is all you need to experiment with the Enterprise SSO plug-in.

## Next steps

For more information about shared device mode, see [Overview of Shared Device Mode](msal-shared-devices.md).
