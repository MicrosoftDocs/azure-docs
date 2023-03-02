---
title: Browser support of FIDO2 passwordless authentication | Azure Active Directory
description: Browsers and operating system combinations support FIDO2 passwordless authentication for apps using Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 01/29/2023

author: janicericketts
ms.author: jricketts
manager: martinco
ms.reviewer: 

ms.collection: M365-identity-device-management
---
# Browser support of FIDO2 passwordless authentication

Azure Active Directory allows [FIDO2 security keys](./concept-authentication-passwordless.md#fido2-security-keys) to be used as a passwordless device. The availability of FIDO2 authentication for Microsoft accounts was [announced in 2018](https://techcommunity.microsoft.com/t5/identity-standards-blog/all-about-fido2-ctap2-and-webauthn/ba-p/288910), and it became [generally available](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/passwordless-authentication-is-now-generally-available/ba-p/1994700) in March 2021. The following diagram shows which browsers and operating system combinations support passwordless authentication using FIDO2 authentication keys with Azure Active Directory.

## Supported browsers

This table shows support for authenticating Azure Active Directory (Azure AD) and Microsoft Accounts (MSA). Microsoft accounts are created by consumers for services such as Xbox, Skype, or Outlook.com. Supported device types include **USB**, near-field communication (**NFC**), and bluetooth low energy (**BLE**).

| OS | Chrome | Chrome  | Chrome | Edge | Edge | Edge | Firefox | Firefox | Firefox | Safari | Safari | Safari
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| | USB | NFC | BLE | USB | NFC | BLE | USB | NFC | BLE | USB | NFC | BLE |
| **Windows**  | ![Chrome supports USB on Windows for Azure AD accounts.][y] | ![Chrome supports NFC on Windows for Azure AD accounts.][y] | ![Chrome supports BLE on Windows for Azure AD accounts.][y] | ![Edge supports USB on Windows for Azure AD accounts.][y] | ![Edge supports NFC on Windows for Azure AD accounts.][y] | ![Edge supports BLE on Windows for Azure AD accounts.][y] | ![Firefox supports USB on Windows for Azure AD accounts.][y] | ![Firefox supports NFC on Windows for Azure AD accounts.][y] | ![Firefox supports BLE on Windows for Azure AD accounts.][y] |  ![Safari supports USB on Windows for Azure AD accounts.][n] | ![Safari supports NFC on Windows for Azure AD accounts.][n] | ![Safari supports BLE on Windows for Azure AD accounts.][n] |
| **macOS**  | ![Chrome supports USB on macOS for Azure AD accounts.][y] | ![Chrome supports NFC on macOS for Azure AD accounts.][n] | ![Chrome supports BLE on macOS for Azure AD accounts.][n] | ![Edge supports USB on macOS for Azure AD accounts.][y] | ![Edge supports NFC on macOS for Azure AD accounts.][n] | ![Edge supports BLE on macOS for Azure AD accounts.][n] | ![Firefox supports USB on macOS for Azure AD accounts.][n] | ![Firefox supports NFC on macOS for Azure AD accounts.][n] | ![Firefox supports BLE on macOS for Azure AD accounts.][n] | ![Safari supports USB on macOS for Azure AD accounts.][n] | ![Safari supports NFC on macOS for Azure AD accounts.][n] | ![Safari supports BLE on macOS for Azure AD accounts.][n] |
| **ChromeOS**  | ![Chrome supports USB on ChromeOS for Azure AD accounts.][y]* | ![Chrome supports NFC on ChromeOS for Azure AD accounts.][n] | ![Chrome supports BLE on ChromeOS for Azure AD accounts.][n] | ![Edge supports USB on ChromeOS for Azure AD accounts.][n] | ![Edge supports NFC on ChromeOS for Azure AD accounts.][n] | ![Edge supports BLE on ChromeOS for Azure AD accounts.][n] | ![Firefox supports USB on ChromeOS for Azure AD accounts.][n] | ![Firefox supports NFC on ChromeOS for Azure AD accounts.][n] | ![Firefox supports BLE on ChromeOS for Azure AD accounts.][n] | ![Safari supports USB on ChromeOS for Azure AD accounts.][n] | ![Safari supports NFC on ChromeOS for Azure AD accounts.][n] | ![Safari supports BLE on ChromeOS for Azure AD accounts.][n] |
| **Linux**  | ![Chrome supports USB on Linux for Azure AD accounts.][y] | ![Chrome supports NFC on Linux for Azure AD accounts.][n] | ![Chrome supports BLE on Linux for Azure AD accounts.][n] | ![Edge supports USB on Linux for Azure AD accounts.][n] | ![Edge supports NFC on Linux for Azure AD accounts.][n] | ![Edge supports BLE on Linux for Azure AD accounts.][n] | ![Firefox supports USB on Linux for Azure AD accounts.][n] | ![Firefox supports NFC on Linux for Azure AD accounts.][n] | ![Firefox supports BLE on Linux for Azure AD accounts.][n] | ![Safari supports USB on Linux for Azure AD accounts.][n] | ![Safari supports NFC on Linux for Azure AD accounts.][n] | ![Safari supports BLE on Linux for Azure AD accounts.][n] |
| **iOS**  | ![Chrome supports USB on iOS for Azure AD accounts.][n] | ![Chrome supports NFC on iOS for Azure AD accounts.][n] | ![Chrome supports BLE on iOS for Azure AD accounts.][n] | ![Edge supports USB on iOS for Azure AD accounts.][n] | ![Edge supports NFC on Linux for Azure AD accounts.][n] | ![Edge supports BLE on Linux for Azure AD accounts.][n] | ![Firefox supports USB on Linux for Azure AD accounts.][n] | ![Firefox supports NFC on iOS for Azure AD accounts.][n] | ![Firefox supports BLE on iOS for Azure AD accounts.][n] | ![Safari supports USB on iOS for Azure AD accounts.][n] | ![Safari supports NFC on iOS for Azure AD accounts.][n] | ![Safari supports BLE on iOS for Azure AD accounts.][n] |
| **Android**  | ![Chrome supports USB on Android for Azure AD accounts.][n] | ![Chrome supports NFC on Android for Azure AD accounts.][n] | ![Chrome supports BLE on Android for Azure AD accounts.][n] | ![Edge supports USB on Android for Azure AD accounts.][n] | ![Edge supports NFC on Android for Azure AD accounts.][n] | ![Edge supports BLE on Android for Azure AD accounts.][n] | ![Firefox supports USB on Android for Azure AD accounts.][n] | ![Firefox supports NFC on Android for Azure AD accounts.][n] | ![Firefox supports BLE on Android for Azure AD accounts.][n] | ![Safari supports USB on Android for Azure AD accounts.][n] | ![Safari supports NFC on Android for Azure AD accounts.][n] | ![Safari supports BLE on Android for Azure AD accounts.][n] |

*Key Registration is currently not supported with ChromeOS/Chrome Browser. 

## Unsupported browsers

The following operating system and browser combinations are not supported, but future support and testing is being investigated. If you would like to see other operating system and browser support, please leave feedback on our [product feedback site](https://feedback.azure.com/d365community/).

| Operating system | Browser |
| ---- | ---- |
| iOS | Safari |
| Android | Chrome |

## Minimum browser version

The following are the minimum browser version requirements. 

| Browser | Minimum version |
| ---- | ---- |
| Chrome | 76 |
| Edge | Windows 10 version 1903<sup>1</sup> |
| Firefox | 66 |

<sup>1</sup>All versions of the new Chromium-based Microsoft Edge support Fido2. Support on Microsoft Edge legacy was added in 1903.

## Next steps
[Enable passwordless security key sign-in](./howto-authentication-passwordless-security-key.md)

<!--Image references-->
[y]: ./media/fido2-compatibility/yes.png
[n]: ./media/fido2-compatibility/no.png
