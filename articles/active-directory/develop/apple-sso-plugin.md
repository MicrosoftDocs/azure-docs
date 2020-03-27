---
title: Microsoft Enterprise SSO plug-in for Apple devices | Azure
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

# Microsoft Enterprise SSO plug-in for Apple devices Public Preview

## Overview

> [!NOTE]
> This feature is in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Microsoft has released a new plug-in that uses the newly announced Apple feature called [Enterprise Single Sign-On](https://developer.apple.com/documentation/authenticationservices). Announced at WWDC 2019, we've worked closely with Apple to develop a new identity product for Azure Active Directory that will increase your applications usability while providing the best protection that Apple and Microsoft can provide.

We call it Microsoft Enterprise SSO plug-in for Apple devices. We plan to use this Enterprise SSO Plug-In across all of our products and supported Apple platforms in the coming years. For Public Preview, the Enterprise SSO Plug-In is only for iOS devices and is distributed through certain Microsoft applications. We will be expanding the list of applications that support the Enterprise SSO Plug-In in the future.

Our first use of this Enterprise SSO Plug-In is with our new product feature called [Shared Device Mode](msal-ios-shared-devices.md).

## Features

Microsoft Enterprise SSO plug-in for Apple devices offers the following benefits:

* Comes delivered in Microsoft Authenticator app automatically and can be enabled by any MDM.
* Provides seamless SSO for Active Directory joined accounts across all applications that support Apple's Enterprise Single Sign-On feature.
* COMING SOON: Provides seamless SSO across Safari browsers and applications on the device.

## Requirements

Devices that wish to use Microsoft Enterprise SSO plug-in for Apple devices must meet the following requirements:

1. Device needs to use iOS 13.0 or higher.
1. Device needs to have a Microsoft application that provides the Microsoft Enterprise SSO plug-in for Apple devices. For Public Preview this is the [Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-overview).
1. Device must be MDM enrolled.
1. Device must have a configuration pushed to enable the Microsoft Enterprise SSO plug-in for Apple devices on the device. This is a security constraint Apple requires.

## How to try it out

 ## Using An MDM to Enable the SSO Extension

 * All devices need to be sent a signal through an MDM service to enable Microsoft Enterprise SSO plug-in for Apple devices. Since Microsoft provides our Enterprise SSO Plug-In through the [Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-overview), you will need to use your MDM to configure it to turn on the Microsoft Enterprise SSO Plug-In that it contains. 

 USe the following parameters to configure the Microsoft Enterprise SSO plug-in:

 * Tell the device to enable the Microsoft Enterprise SSO plug-in for Apple devices using the following configuration:
  * **Type**: Redirect
  * **Extension ID**: com.microsoft.azureauthenticator.ssoextension
  * **Team ID**: SGGM6D27TK
  * **URLs**: 
    * https://login.microsoftonline.com
    * https://login.windows.net
    * https://login.microsoft.com
    * https://sts.windows.net
    * https://login.partner.microsoftonline.cn
    * https://login.chinacloudapi.cn
    * https://login.microsoftonline.de
    * https://login.microsoftonline.us
    * https://login.usgovcloudapi.net
    * https://login-us.microsoftonline.com
 
 Microsoft provides Intune for MDM service to our customers and made configuring the Microsoft Enterprise SSO plug-in easy. Browse [Intune configuration documentation](https://docs.microsoft.com/intune/configuration/ios-device-features-settings) for more information.

   ## Using the SSO Extension in your application 

Our Microsoft Authentication Libraries (MSAL) for Apple Devices already supports using the Microsoft Enterprise SSO plug-in for Apple devices. It requires you use MSAL version 1.1.0 or higher. Using our MSAL library is all you need to experiment with the Enterprise SSO Plug-In. 

If you are interested in experimenting with our Enterprise SSO Plug-In fwithout using MSAL, please drop a message to [Brandon Werner](mailto:brandon.werner@microsoft.com) and we can help partner to provide the SSO Plug-In capability to your applications as well.


