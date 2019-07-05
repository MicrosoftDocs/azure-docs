---
title: Set up and use a security key (preview) - Azure Active Directory | Microsoft Docs
description: How to set up your security info to verify your identity using a Fast Identity Online (FIDO2) security key.
services: active-directory
author: eross-msft
manager: daveba
ms.reviewer: librown

ms.service: active-directory
ms.workload: identity
ms.subservice: user-help
ms.topic: conceptual
ms.date: 07/01/2019
ms.author: lizross
ms.collection: M365-identity-device-management
---

# Set up and use a security key (Preview)

You can now use a [Fast ID Online (FIDO) 2 security key](https://fidoalliance.org/) as a multi-step security method within your organization.

[!INCLUDE [preview-notice](../../../includes/active-directory-end-user-preview-notice-security-key.md)]

>[!Important]
>This content is intended for users. If you're an administrator, you can find more information about how to set up and manage your Azure Active Directory (Azure AD) environment in the [Azure Active Directory Documentation](https://docs.microsoft.com/azure/active-directory).

## What is FIDO?

FIDO is a set of security specifications used for strong authentication, which seeks to standardize authentication at the client and protocol layers. FIDO supports multi-factor authentication and public key cryptography, storing personally identifiable information, such as biometric data, locally on a FIDO-supported security key.

Because your data is stored locally, you're prompted to insert and touch your personal security key device during sign-in.

## How to reset a Microsoft-compatible security key?

You can reset your Microsoft-compatible security key from the **Windows Settings** app.

>[!IMPORTANT]
>Resetting your security key deletes everything from the key, resetting it to factory defaults.
>
> **All data and credentials will be cleared.**

### To reset your security key

1. Open the Windows Settings app, select **Accounts**, select **Sign-in options**, select **Security Key**, and then select **Manage**.

2. Follow the on-screen instructions, based on your specific security key manufacturer. If your key manufacturer isn't listed in the on-screen instructions, refer to the manufacturer's site for more information.
 



Follow the instructions in the Settings app and look for specific instructions based on your security key manufacturer below:

|Security key manufacturer</br> | Reset instructions </br> |
| --- | --- | 
|Yubico | **USB:** Remove and re-insert the security key. When the LED on the security key begins flashing, touch the metal contact  <br> **NFC:** Tap the security key on the reader <br>|
|Feitian | Touch the blinking fingerprint sensor twice to reset the key|
|HID | Tap the card on the reader twice to reset it |


## Next steps

- Detailed info about [Microsoft-compliant security keys](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/microsoft-compatible-security-key)
