---
title: Microsoft Enterprise SSO plug-in for Apple devices
titleSuffix: Microsoft identity platform
description: Learn about Microsoft's Azure Active Directory SSO plug-in for iOS and macOS devices.
services: active-directory
author: mmacy
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

For this Public Preview release, the Enterprise SSO plug-In is only for iOS devices and is distributed through certain Microsoft applications. We will be expanding the list of applications that support the Enterprise SSO plug-In in the future. Our first use of this Enterprise SSO plug-In is with our new product feature called [Shared Device Mode](msal-ios-shared-devices.md).

## Features

The Microsoft Enterprise SSO plug-in for Apple devices offers the following benefits:

* Delivered automatically in the Microsoft Authenticator and can be enabled by any mobile device management (MDM) solution.
* Provides seamless SSO for Active Directory-joined accounts across all applications that support Apple's Enterprise Single Sign-On feature.

Planned but not yet available in this preview release:

* Provides seamless SSO across Safari browsers and applications on the device.

## Requirements

Devices must meet the following requirements Devices to use Microsoft Enterprise SSO plug-in for Apple devices:

1. Device needs to use iOS 13.0 or higher.
1. Device needs to have a Microsoft application that provides the Microsoft Enterprise SSO plug-in for Apple devices. For Public Preview this is the [Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-overview).
1. Device must be MDM enrolled.
1. Device must have a configuration pushed to enable the Microsoft Enterprise SSO plug-in for Apple devices on the device. This is a security constraint Apple requires.

## Using an MDM to enable the SSO extension

All devices need to be sent a signal through an MDM service to enable Microsoft Enterprise SSO plug-in for Apple devices. Since Microsoft provides the Enterprise SSO plug-In through the [Microsoft Authenticator](..//user-help/user-help-auth-app-overview.md) app, you will need to use your MDM to configure it to turn on the Microsoft Enterprise SSO plug-In that it contains.

Use the following parameters to configure the Microsoft Enterprise SSO plug-in:

* **Type**: Redirect
* **Extension ID**: `com.microsoft.azureauthenticator.ssoextension`
* **Team ID**: `SGGM6D27TK`
* **URLs**:
  * `https://login.microsoftonline.com`
  * `https://login.windows.net`
  * `https://login.microsoft.com`
  * `https://sts.windows.net`
  * `https://login.partner.microsoftonline.cn`
  * `https://login.chinacloudapi.cn`
  * `https://login.microsoftonline.de`
  * `https://login.microsoftonline.us`
  * `https://login.usgovcloudapi.net`
  * `https://login-us.microsoftonline.com`

You can use Microsoft Intune as your MDM service to ease configuration of the Microsoft Enterprise SSO plug-in. For more information, see the [Intune configuration documentation](https://docs.microsoft.com/intune/configuration/ios-device-features-settings).

## Using the SSO extension in your application

The Microsoft Authentication Library (MSAL) for Apple devices already supports using the Microsoft Enterprise SSO plug-in for Apple devices. It requires you use MSAL version 1.1.0 or higher. Using MSAL is all you need to experiment with the Enterprise SSO plug-In.

## Next steps

For more information about shared device mode, see the [Overview of Shared Device Mode](msal-shared-devices.md).
