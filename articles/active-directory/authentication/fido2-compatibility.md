---
title: Availability of FIDO2 passwordless authentication based on browser and operating system
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
# Availability of FIDO2 passwordless authentication based on browser and operating system

Azure Active Directory allows [FIDO2 security keys](https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-authentication-passwordless#fido2-security-keys) to be used as a passwordless device. The availability of FIDO2 authentication for Microsoft accounts was [announced in 2018](https://techcommunity.microsoft.com/t5/identity-standards-blog/all-about-fido2-ctap2-and-webauthn/ba-p/288910), and, as discussed in the announcement, certain optional features and extensions to the FIDO2 CTAP specification must be implemented to support secure authentication with Microsoft and Azure Active Directory accounts.

The following diagram shows which browsers and operating system combinations support passwordless authentication using FIDO2 authentication keys with Azure Active Directory. A full explanation of the diagram follows.

|  | Safari | | | Chrome |  |  | Edge |  |  | Firefox |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | USB | NFC | BLE | USB | NFC | BLE | USB | NFC | BLE | USB | NFC | BLE |
| **Windows**  | ![Safari does not support USB on Windows for AAD accounts.][n] | ![Safari does not support NFC on Windows for AAD accounts.][n] | ![Safari does not support BLE on Windows for AAD accounts.][n] | ![Chrome supports USB on Windows for AAD accounts.][y] | ![Chrome supports NFC on Windows for AAD accounts.][y] | ![Chrome supports BLE on Windows for AAD accounts.][y] | ![Edge supports USB on Windows for AAD accounts.][y] | ![Edge supports NFC on Windows for AAD accounts.][y] | ![Edge supports BLE on Windows for AAD accounts.][y] | ![Firefox supports USB on Windows for AAD accounts.][y] | [Firefox supports NFC on Windows for AAD accounts.][y] | [Firefox supports BLE on Windows for AAD accounts.][y] |
| **macOS** |  |  |  |  |  |  |  |  |  |  |  |  |
| **iOS** |  |  |  |  |  |  |  |  |  |  |  |  |
| **ChromeOS** |  |  |  |  |  |  |  |  |  |  |  |  |
| **Linux** |  |  |  |  |  |  |  |  |  |  |  |  |


Support for authentication depends on the browser that is being used, the operating system it is running on, the account type, and type of authentication device. Account types include Azure Active Directory accounts created for work or school, labeled **AAD**, and Microsoft accounts created by consumers for services such as Xbox, Skype, or Outlook.com, labeled **MSA**. Device types include **USB**, near-field communication (**NFC**), and bluetooth low energy (**BLE**).

**Windows**
All devices are supported for both AAD and MSA accounts on Chrome, Edge, and Firefox.

*OS version tested:*

**iOS**
FIDO2 authentication is supported in the following scenarios:
- Azure AD accounts using a USB and NFC device in the Safari browser
- Azure AD accounts using a USB device in the Brave browser

*OS version tested:*

**MacOS**
FIDO2 authentication is supported in the following scenarios:
- Azure AD accounts using a USB device in the Safari browser
- Azure AD and MSA accounts using a USB device in the Chrome browser
- Azure AD and MSA accounts using a USB device in the Edge browser

*OS version tested:*

**ChromeOS**
FIDO2 authentication is supported in the following scenarios:
- Azure AD accounts using a USB device in the Chrome browser

*OS version tested:*

**Android**
FIDO2 authentication is not supported.

*OS version tested:*

**Linux**
FIDO2 authentication is supported in the following scenarios:
- Azure AD and MSA accounts using a USB device in the Chrome browser

*OS version tested:*