---
title: Microsoft Enterprise SSO Plug-In for Apple Devices | Azure
description: Learn about our new Azure Active Directory SSO plug-in for iOS and macOS devices.
services: active-directory
documentationcenter: dev-center-name
author: mmacy
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 3/24/2020
ms.author: brandwe
ms.reviwer: brandwe
ms.custom: aaddev, identityplatformtop40
---

# Microsoft Enterprise SSO Plug-In for Apple Devices Public Preview

## Overview

> [!NOTE]
> This feature is in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Microsoft has released a new plug-in that uses the newly anounced Apple feature called [Enterprise Single Sign-On](https://developer.apple.com/documentation/authenticationservices). Announced at WWDC 2019, we've worked closely with Apple to develop a new identity product for Azure Active Directory that will increase your applications usability while providing the best protection that Apple and Microsoft can provide. 

We call it Microsoft Enterprise SSO Plug-In for Apple Devices. We plan to use this Enterprise SSO Plug-In across all of our products and supported Apple platforms in the coming years. For Public Preview, the Enterprise SSO Plug-In is only for iOS devices and is distributed through certain Microsoft applications. We will be expanding the list of applications that both distibute this Enterprise SSO Plug-In and use its features in the future.

Our first use of this Enterprise SSO Plug-In is with our new product feature called [Shared Device Mode](msal-ios-shared-devices.md).

## Features

Microsoft Enterprise SSO Plug-In for Apple Devices offers the following benefits:

* Comes delivered in Microsoft apps automatically. Nothing extra to download.
* Provides deep integrate with iOS and macOS operating system, allowing for use of Face ID and Touch ID with Azure Active Directory credentials.
* Provides seamless SSO across all applications that support Apple's Enterprise Single Sign-On feature.
* COMING SOON: Provides seamless SSO across Safari browsers and applications on the device.

## Requirements

Device that wish to use Microsoft Enterprise SSO Plug-In for Apple Devices must meet the following requirements:

1. Device needs to use iOS 13.4 or higher.
1. Device needs to have a Microsoft application that provides the Microsoft Enterprise SSO Plug-In for Apple Devices. For Public Preview this is the [Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-overview).
1. Device must be MDM enrolled.
1. Device must have a configuration pushed to enable the Microsoft Enterprise SSO Plug-In for Apple Devices on the device. This is a security constraint Apple requires.

## How to try it out

 ## Using An MDM to Enable the SSO Extension

 * All devices need to be sent a singal through an MDM service to enable Microsoft Enterprise SSO Plug-In for Apple Devices. Since Microsoft provides our Enterprise SSO Plug-In through the [Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-overview), you will need to use your MDM to both deploy the Microsoft Authenticator app and configure it to turn on the Microsoft Enterprise SSO Plug-In that it contains. 
 
 Microsoft provides Intune for MDM service to our customers so we show that configuration below. You may also wish to browse [Intune configuration documentation](https://docs.microsoft.com/intune/configuration/ios-device-features-settings) as you will be using this portal below to push the correct configuration to your Shared Devices. Refer to your own MDM documentatio on how to deploy and configure applications. 

 In the Intune Configuration Portal, set the following configuration:  
* Tell the device to enable the Microsoft Enterprise SSO Plug-In for Apple Devices using the following configuration:
  * **Type**: Redirect
  * **Extension ID**: com.microsoft.azureauthenticator.ssoextension
  * **Team ID**: SGGM6D27TK
  * **URLs**: https://login.microsoftonline.com (this list will be expanded for the Public Preview to include other Microsoft clouds)

* Next, configure your MDM to push Microsoft Authenticator app to your device through an MDM profile. You will need to set the following configuration options to tell the Authenticator to use the [Microsoft Enterprise SSO Plug-In for Apple Devices](apple-sso-plugin.md) whenever possible.
    - Key: useSSOExtensionOnly
    - Type: Boolean
    - Value: True

   ## Using the SSO Extension in your application 

Our Microsoft Authentication Libraries (MSAL) for Apple Devices already supports using the Microsoft Enterprise SSO Plug-In for Apple Devices. It requires you use MSAL version 1.1.0 or higher. Using our MSAL library along with the MDM setting above to `useSSOExtensionOnly` is all you need to experiment with the Enterprise SSO Plug-In. 

If you are interested in experimenting with our Enterprise SSO Plug-In fwithout using MSAL, please drop a message to [Brandon Werner](mailto:brandon.werner@microsoft.com) and we can help partner to provide the SSO Plug-In capability to your applications as well.


