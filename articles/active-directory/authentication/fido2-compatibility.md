---
title: Browser support of FIDO2 passwordless authentication | Microsoft Entra ID
description: Browsers and operating system combinations support FIDO2 passwordless authentication for apps using Microsoft Entra ID

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 07/26/2023

author: justinha
ms.author: justinha
manager: amycolannino
ms.reviewer: 

ms.collection: M365-identity-device-management
---
# Browser support of FIDO2 passwordless authentication

Microsoft Entra ID allows [FIDO2 security keys](./concept-authentication-passwordless.md#fido2-security-keys) to be used as a passwordless device. The availability of FIDO2 authentication for Microsoft accounts was [announced in 2018](https://techcommunity.microsoft.com/t5/identity-standards-blog/all-about-fido2-ctap2-and-webauthn/ba-p/288910), and it became [generally available](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/passwordless-authentication-is-now-generally-available/ba-p/1994700) in March 2021. The following diagram shows which browsers and operating system combinations support passwordless authentication using FIDO2 authentication keys with Microsoft Entra ID. Microsoft Entra ID currently supports only hardware FIDO2 keys and doesn't support passkeys for any platform.

## Supported browsers

This table shows support for authenticating Microsoft Entra ID and Microsoft Accounts (MSA). Microsoft accounts are created by consumers for services such as Xbox, Skype, or Outlook.com. 

| OS  | Chrome | Edge | Firefox | Safari |
|:---:|:------:|:----:|:-------:|:------:|
| **Windows**  | &#x2705; | &#x2705; | &#x2705; | N/A |
| **macOS**  | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **ChromeOS**  | &#x2705; | N/A | N/A | N/A |
| **Linux**  | &#x2705; | &#10060; | &#10060; | N/A |
| **iOS**  | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| **Android**  | &#10060; | &#10060; | &#10060; | N/A |

>[!NOTE]
>This is the view for web support. Authentication for native apps in iOS and Android isn't available yet.

## Browser support for each platform

The following tables show which transports are supported for each platform. Supported device types include **USB**, near-field communication (**NFC**), and bluetooth low energy (**BLE**).

### Windows

| Browser | USB  | NFC | BLE |
|---------|------|-----|-----|
| Edge    | &#x2705; | &#x2705; | &#x2705; |
| Chrome   | &#x2705; | &#x2705; | &#x2705; |
| Firefox   | &#x2705; | &#x2705; | &#x2705; |

### macOS

| Browser | USB  | NFC<sup>1</sup> | BLE<sup>1</sup> |
|---------|------|-----|-----|
| Edge    | &#x2705; | N/A | N/A |
| Chrome   | &#x2705; | N/A | N/A |
| Firefox<sup>2</sup>   | &#x2705; | N/A | N/A |
| Safari<sup>2</sup>   | &#x2705; | N/A | N/A |

<sup>1</sup>NFC and BLE security keys aren't supported on macOS by Apple.

<sup>2</sup>New security key registration doesn't work on these macOS browsers because they don't prompt to set up biometrics or PIN.

### ChromeOS

| Browser<sup>1</sup> | USB  | NFC | BLE |
|---------|------|-----|-----|
| Chrome  | &#x2705; | &#10060; | &#10060; |

<sup>1</sup>Security key registration isn't supported on ChromeOS or Chrome browser.

### Linux

| Browser | USB  | NFC | BLE |
|---------|------|-----|-----|
| Edge    | &#10060; | &#10060; | &#10060; |
| Chrome  | &#x2705; | &#10060; | &#10060; |
| Firefox | &#x2705; | &#10060; | &#10060; |


### iOS

| Browser<sup>1</sup> | Lightning  | NFC | BLE<sup>2</sup> |
|---------|------------|-----|-----|
| Edge    |  &#x2705;  | &#x2705; | N/A | 
| Chrome  |  &#x2705;  | &#x2705; | N/A |
| Firefox |  &#x2705;  | &#x2705; | N/A |
| Safari  |  &#x2705;  | &#x2705; | N/A |

<sup>1</sup>New security key registration doesn't work on iOS browsers because they don't prompt to set up biometrics or PIN.

<sup>2</sup>BLE security keys aren't supported on iOS by Apple.

### Android

| Browser<sup>1</sup> | USB  | NFC | BLE |
|---------|------|-----|-----|
| Edge    | &#10060;  | &#10060; | &#10060; |
| Chrome  | &#10060;  | &#10060; | &#10060; |
| Firefox | &#10060;  | &#10060; | &#10060; |

<sup>1</sup>Security key biometrics or PIN for user verficiation isn't currently supported on Android by Google. Microsoft Entra ID requires user verification for all FIDO2 authentications.

## Minimum browser version

The following are the minimum browser version requirements. 

| Browser | Minimum version |
| ---- | ---- |
| Chrome | 76 |
| Edge | Windows 10 version 1903<sup>1</sup> |
| Firefox | 66 |

<sup>1</sup>All versions of the new Chromium-based Microsoft Edge support FIDO2. Support on Microsoft Edge legacy was added in 1903.

## Next steps
[Enable passwordless security key sign-in](./howto-authentication-passwordless-security-key.md)

<!--Image references-->
[y]: ./media/fido2-compatibility/yes.png
[n]: ./media/fido2-compatibility/no.png
