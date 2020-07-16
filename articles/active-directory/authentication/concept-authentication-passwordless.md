---
title: Azure Active Directory passwordless sign-in (preview)
description: Learn about options for passwordless sign-in to Azure Active Directory using FIDO2 security keys or the Microsoft Authenticator app

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 03/23/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: librown

ms.collection: M365-identity-device-management
---
# Passwordless authentication options for Azure Active Directory

Multi-factor authentication (MFA) is a great way to secure your organization, but users often get frustrated with the additional security layer on top of having to remember their passwords. Passwordless authentication methods are more convenient because the password is removed and replaced with something you have, plus something you are or something you know.

| Authentication  | Something you have | Something you are or know |
| --- | --- | --- |
| Passwordless | Windows 10 Device, phone, or security key | Biometric or PIN |

Each organization has different needs when it comes to authentication. Microsoft offers the following three passwordless authentication options that integrate with Azure Active Directory (Azure AD):

- Windows Hello for Business
- Microsoft Authenticator app
- FIDO2 security keys

![Authentication: Security versus convenience](./media/concept-authentication-passwordless/passwordless-convenience-security.png)

## Windows Hello for Business

Windows Hello for Business is ideal for information workers who have their own designated Windows PC. The biometric and PIN is directly tied to the user's PC, which prevents access from anyone other than the owner. With public key infrastructure (PKI) integration and built-in support for single sign-on (SSO), Windows Hello for Business provides a convenient method for seamlessly accessing corporate resources on-premises and in the cloud.

![Example of a user sign-in with Windows Hello for Business](./media/concept-authentication-passwordless/windows-hellow-sign-in.jpeg)

The following steps show how the sign-in process works with Azure Active Directory.

![Diagram that outlines the steps involved for user sign-in with Windows Hello for Business](./media/concept-authentication-passwordless/windows-hello-flow.png)

1. A user signs into Windows using biometric or PIN gesture. The gesture unlocks the Windows Hello for Business private key and is sent to the Cloud Authentication security support provider, referred to as the *Cloud AP provider*.
1. The Cloud AP provider requests a nonce from Azure AD.
1. Azure AD returns a nonce that's valid for 5 minutes.
1. The Cloud AP provider signs the nonce using the user's private key and returns the signed nonce to the Azure AD.
1. Azure AD validates the signed nonce using the user's securely registered public key against the nonce signature. After validating the signature, Azure AD then validates the returned signed nonce. When the nonce is validated, Azure AD creates a primary refresh token (PRT) with session key that is encrypted to the device's transport key and returns it to the Cloud AP provider.
1. The Cloud AP provider receives the encrypted PRT with session key. Using the device's private transport key, the Cloud AP provider decrypts the session key and protects the session key using the device's Trusted Platform Module (TPM).
1. The Cloud AP provider returns a successful authentication response to Windows. The user is then able to access Windows as well as cloud and on-premises applications without the need to authenticate again (SSO).

The Windows Hello for Business [planning guide](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/hello-planning-guide) can be used to help you make decisions on the type of Windows Hello for Business deployment and the options you'll need to consider.

## Microsoft Authenticator App

Allow your employee's phone to become a passwordless authentication method. You may already be using the Microsoft Authenticator App as a convenient multi-factor authentication option in addition to a password. You can also use the Authenticator App as a passwordless option.

![Sign in to Microsoft Edge with the Microsoft Authenticator app](./media/concept-authentication-passwordless/concept-web-sign-in-microsoft-authenticator-app.png)

The Authenticator App turns any iOS or Android phone into a strong, passwordless credential. Users can sign in to any platform or browser by getting a notification to their phone, matching a number displayed on the screen to the one on their phone, and then using their biometric (touch or face) or PIN to confirm. Please refer to [Download and install the Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-download-install) for installation details.

Passwordless authentication using the Authenticator App follows the same basic pattern as Windows Hello for Business. It's a little more complicated as the user needs to be identified so that Azure AD can find the Microsoft Authenticator App version being used:

![Diagram that outlines the steps involved for user sign-in with the Microsoft Authenticator App](./media/concept-authentication-passwordless/authenticator-app-flow.png)

1. The user enters their username.
1. Azure AD detects that the user has a strong credential and starts the Strong Credential flow.
1. A notification is sent to the app via Apple Push Notification Service (APNS) on iOS devices, or via Firebase Cloud Messaging (FCM) on Android devices.
1. The user receives the push notification and opens the app.
1. The app calls Azure AD and receives a proof-of-presence challenge and nonce.
1. The user completes the challenge by entering their biometric or PIN to unlock private key.
1. The nonce is signed with the private key and sent back to Azure AD.
1. Azure AD performs public/private key validation and returns a token.

## FIDO2 security keys

FIDO2 security keys are an unphishable standards-based passwordless authentication method that can come in any form factor. Fast Identity Online (FIDO) is an open standard for passwordless authentication. FIDO allows users and organizations to leverage the standard to sign in to their resources without a username or password using an external security key or a platform key built into a device.

For public preview, employees can use security keys to sign in to their Azure AD or hybrid Azure AD joined Windows 10 devices and get single-sign on to their cloud and on-premises resources. Users can also sign in to supported browsers. FIDO2 security keys are a great option for enterprises who are very security sensitive or have scenarios or employees who aren't willing or able to use their phone as a second factor.

![Sign in to Microsoft Edge with a security key](./media/concept-authentication-passwordless/concept-web-sign-in-security-key.png)

The following process is used when a user signs in with a FIDO2 security key:

![Diagram that outlines the steps involved for user sign-in with a FIDO2 security key](./media/concept-authentication-passwordless/fido2-security-key-flow.png)

1. The user plugs the FIDO2 security key into their computer.
2. Windows detects the FIDO2 security key.
3. Windows sends an authentication request.
4. Azure AD sends back a nonce.
5. The user completes their gesture to unlock the private key stored in the FIDO2 security key's secure enclave.
6. The FIDO2 security key signs the nonce with the private key.
7. The primary refresh token (PRT) token request with signed nonce is sent to Azure AD.
8. Azure AD verifies the signed nonce using the FIDO2 public key.
9. Azure AD returns PRT to enable access to on-premises resources.

While there are many keys that are FIDO2 certified by the FIDO Alliance, Microsoft requires some optional extensions of the FIDO2 Client-to-Authenticator Protocol (CTAP) specification to be implemented by the vendor to ensure maximum security and the best experience.

A security key **MUST** implement the following features and extensions from the FIDO2 CTAP protocol to be Microsoft-compatible:

| # | Feature / Extension trust | Why is this feature or extension required? |
| --- | --- | --- |
| 1 | Resident key | This feature enables the security key to be portable, where your credential is stored on the security key. |
| 2 | Client pin | This feature enables you to protect your credentials with a second factor and applies to security keys that do not have a user interface. |
| 3 | hmac-secret | This extension ensures you can sign in to your device when it's off-line or in airplane mode. |
| 4 | Multiple accounts per RP | This feature ensures you can use the same security key across multiple services like Microsoft Account and Azure Active Directory. |

The following providers offer FIDO2 security keys of different form factors that are known to be compatible with the passwordless experience. We encourage you to evaluate the security properties of these keys by contacting the vendor as well as FIDO Alliance.

| Provider | Contact |
| --- | --- |
| Yubico | [https://www.yubico.com/support/contact/](https://www.yubico.com/support/contact/) |
| Feitian | [https://www.ftsafe.com/about/Contact_Us](https://www.ftsafe.com/about/Contact_Us) |
| HID | [https://www.hidglobal.com/contact-us](https://www.hidglobal.com/contact-us) |
| Ensurity | [https://www.ensurity.com/contact](https://www.ensurity.com/contact) |
| eWBM | [https://www.ewbm.com/support](https://www.ewbm.com/support) |
| AuthenTrend | [https://authentrend.com/about-us/#pg-35-3](https://authentrend.com/about-us/#pg-35-3) |
| Gemalto (Thales Group) | [https://safenet.gemalto.com/multi-factor-authentication/authenticators/passwordless-authentication/](https://safenet.gemalto.com/multi-factor-authentication/authenticators/passwordless-authentication/) |
| OneSpan Inc. | [https://www.onespan.com/products/fido](https://www.onespan.com/products/fido) |
| IDmelon Technologies Inc. | [https://www.idmelon.com/#idmelon](https://www.idmelon.com/#idmelon) | 

> [!NOTE]
> If you purchase and plan to use NFC-based security keys, you need a supported NFC reader for the security key. The NFC reader isn't an Azure requirement or limitation. Check with the vendor for your NFC-based security key for a list of supported NFC readers.

If you're a vendor and want to get your device on this list of supported devices, contact [Fido2Request@Microsoft.com](mailto:Fido2Request@Microsoft.com).

## What scenarios work with the preview?

- Administrators can enable passwordless authentication methods for their tenant
- Administrators can target all users or select users/groups within their tenant for each method
- End users can register and manage these passwordless authentication methods in their account portal
- End users can sign in with these passwordless authentication methods
   - Microsoft Authenticator App: Works in scenarios where Azure AD authentication is used, including across all browsers, during Windows 10 Out Of Box (OOBE) setup, and with integrated mobile apps on any operating system.
   - Security keys: Work on lock screen for Windows 10 and the web in supported browsers like Microsoft Edge (both legacy and new Edge).

## Choose a passwordless method

The choice between these three passwordless options depends on your company's security, platform, and app requirements.

Here are some factors for you to consider when choosing Microsoft passwordless technology:

||**Windows Hello for Business**|**Passwordless sign-in with the Microsoft Authenticator app**|**FIDO2 security keys**|
|:-|:-|:-|:-|
|**Pre-requisite**| Windows 10, version 1809 or later<br>Azure Active Directory| Microsoft Authenticator app<br>Phone (iOS and Android devices running Android 6.0 or above.)|Windows 10, version 1809 or later<br>Azure Active Directory|
|**Mode**|Platform|Software|Hardware|
|**Systems and devices**|PC with a built-in Trusted Platform Module (TPM)<br>PIN and biometrics recognition |PIN and biometrics recognition on phone|FIDO2 security devices that are Microsoft compatible|
|**User experience**|Sign in using a PIN or biometric recognition (facial, iris, or fingerprint) with Windows devices.<br>Windows Hello authentication is tied to the device; the user needs both the device and a sign-in component such as a PIN or biometric factor to access corporate resources.|Sign in using a mobile phone with fingerprint scan, facial or iris recognition, or PIN.<br>Users sign in to work or personal account from their PC or mobile phone.|Sign in using FIDO2 security device (biometrics, PIN, and NFC)<br>User can access device based on organization controls and authenticate based on PIN, biometrics using devices such as USB security keys and NFC-enabled smartcards, keys, or wearables.|
|**Enabled scenarios**| Password-less experience with Windows device.<br>Applicable for dedicated work PC with ability for single sign-on to device and applications.|Password-less anywhere solution using mobile phone.<br>Applicable for accessing work or personal applications on the web from any device.|Password-less experience for workers using biometrics, PIN, and NFC.<br>Applicable for shared PCs and where a mobile phone is not a viable option (such as for help desk personnel, public kiosk, or hospital team)|

Use the following table to choose which method will support your requirements and users.

|Persona|Scenario|Environment|Passwordless technology|
|:-|:-|:-|:-|
|**Admin**|Secure access to a device for management tasks|Assigned Windows 10 device|Windows Hello for Business and/or FIDO2 security key|
|**Admin**|Management tasks on non-Windows devices| Mobile or non-windows device|Passwordless sign-in with the Microsoft Authenticator app|
|**Information worker**|Productivity work|Assigned Windows 10 device|Windows Hello for Business and/or FIDO2 security key|
|**Information worker**|Productivity work| Mobile or non-windows device|Passwordless sign-in with the Microsoft Authenticator app|
|**Frontline worker**|Kiosks in a factory, plant, retail, or data entry|Shared Windows 10 devices|FIDO2 Security keys|

## Next steps

[Enable FIDO2 security key passwordless options in your organization](howto-authentication-passwordless-security-key.md)

[Enable phone-based passwordless options in your organization](howto-authentication-passwordless-phone.md)

### External Links

[FIDO Alliance](https://fidoalliance.org/)

[FIDO2 CTAP specification](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-client-to-authenticator-protocol-v2.0-id-20180227.html)
