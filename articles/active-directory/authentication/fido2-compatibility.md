---
title: Browser support of FIDO2 passwordless authentication | Azure Active Directory
description: Browsers and operating system combinations support FIDO2 passwordless authentication for apps using Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 02/02/2021

ms.author: nichola
author: knicholasa
manager: martinco
ms.reviewer: 

ms.collection: M365-identity-device-management
---
# Browser support of FIDO2 passwordless authentication

Azure Active Directory allows [FIDO2 security keys](./concept-authentication-passwordless.md#fido2-security-keys) to be used as a passwordless device. The availability of FIDO2 authentication for Microsoft accounts was [announced in 2018](https://techcommunity.microsoft.com/t5/identity-standards-blog/all-about-fido2-ctap2-and-webauthn/ba-p/288910). As discussed in the announcement, certain optional features, and extensions to the FIDO2 CTAP specification must be implemented to support secure authentication with Microsoft and Azure Active Directory accounts. The following diagram shows which browsers and operating system combinations support passwordless authentication using FIDO2 authentication keys with Azure Active Directory.

## Supported browsers

This table shows support for authenticating Azure Active Directory (Azure AD) and Microsoft Accounts (MSA). Microsoft accounts are created by consumers for services such as Xbox, Skype, or Outlook.com. Supported device types include **USB**, near-field communication (**NFC**), and bluetooth low energy (**BLE**).

| OS | Chrome | Chrome  | Chrome | Edge | Edge | Edge | Firefox | Firefox | Firefox |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| | USB | NFC | BLE | USB | NFC | BLE | USB | NFC | BLE |
| **Windows**  | ![Chrome supports USB on Windows for AAD accounts.][y] | ![Chrome supports NFC on Windows for AAD accounts.][y] | ![Chrome supports BLE on Windows for AAD accounts.][y] | ![Edge supports USB on Windows for AAD accounts.][y] | ![Edge supports NFC on Windows for AAD accounts.][y] | ![Edge supports BLE on Windows for AAD accounts.][y] | ![Firefox supports USB on Windows for AAD accounts.][y] | ![Firefox supports NFC on Windows for AAD accounts.][y] | ![Firefox supports BLE on Windows for AAD accounts.][y] |
| **macOS**  | ![Chrome supports USB on macOS for AAD accounts.][y] | ![Chrome does not support NFC on macOS for AAD accounts.][n] | ![Chrome does not support BLE on macOS for AAD accounts.][n] | ![Edge supports USB on macOS for AAD accounts.][y] | ![Edge does not support NFC on macOS for AAD accounts.][n] | ![Edge does not support BLE on macOS for AAD accounts.][n] | ![Firefox does not support USB on macOS for AAD accounts.][n] | ![Firefox does not support NFC on macOS for AAD accounts.][n] | ![Firefox does not support BLE on macOS for AAD accounts.][n] |
| **Linux**  | ![Chrome supports USB on Linux for AAD accounts.][y] | ![Chrome does not support NFC on Linux for AAD accounts.][n] | ![Chrome does not support BLE on Linux for AAD accounts.][n] | ![Edge does not support USB on Linux for AAD accounts.][n] | ![Edge does not support NFC on Linux for AAD accounts.][n] | ![Edge does not support BLE on Linux for AAD accounts.][n] | ![Firefox does not support USB on Linux for AAD accounts.][n] | ![Firefox does not support NFC on Linux for AAD accounts.][n] | ![Firefox does not support BLE on Linux for AAD accounts.][n] |



## Unsupported browsers

The following operating system and browser combinations are not supported, but future support and testing is being investigated. If you would like to see other operating system and browser support, please leave feedback using the product feedback tool at the bottom of the page.

| Operating system | Browser |
| ---- | ---- |
| iOS | Safari, Brave |
| macOS | Safari |
| Android | Chrome |
| ChromeOS | Chrome |

## Minimum browser version

The following are the minimum browser version requirements. 

| Browser | Minimum version |
| ---- | ---- |
| Chrome | 76 |
| Edge | Windows 10 version 1903<sup>1</sup> |
| Firefox | 66 |

<sup>1</sup>All versions of the new Chromium-based Microsoft Edge support Fido2. Support on Microsoft Edge legacy was added in 1903.

## Next steps
[Enable passwordless security key sign-in (preview)](./howto-authentication-passwordless-security-key.md)

<!--Image references-->
[y]: ./media/fido2-compatibility/yes.png
[n]: ./media/fido2-compatibility/no.png
