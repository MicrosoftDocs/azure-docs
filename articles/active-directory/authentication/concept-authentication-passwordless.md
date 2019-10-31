---
title: Azure Active Directory passwordless sign in (preview)
description: Passwordless sign in to Azure AD using FIDO2 security keys or the Microsoft Authenticator app (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/08/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: librown

ms.collection: M365-identity-device-management
---
# Passwordless authentication options

Multi-factor authentication (MFA) is a great way to secure your organization, but users get frustrated with the additional layer on top of having to remember their passwords. Passwordless authentication methods are more convenient because the password is removed and replaced with something you have plus something you are or something you know.

|   | Something you have | Something you are or know |
| --- | --- | --- |
| Passwordless | Windows 10 Device, phone, or security key | Biometric or PIN |

Each organization has different needs when it comes to authentication. Microsoft offers three passwordless authentication options:

- Windows Hello for Business
- Microsoft Authenticator app
- FIDO2 security keys

![Authentication: Security versus convenience](./media/concept-authentication-passwordless/passwordless-convenience-security.png)

## Windows Hello for Business

Windows Hello for Business is ideal for information workers who have their own designated Windows PC. The biometric and PIN are directly tied to the user's PC, which prevents access from anyone other than the owner. With PKI integration and built-in support for single sign-on (SSO), Windows Hello for Business provides a simple and convenient method for seamlessly accessing corporate resources on-premises and in the cloud.

The Windows Hello for Business [planning guide](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/hello-planning-guide) can be used to help you make decisions on the type of Windows Hello for Business deployment and the options you'll need to consider.

## Microsoft Authenticator App

Allow your employee’s phone to become a passwordless authentication method. You may already be using the Microsoft Authenticator App as a convenient multi-factor authentication option in addition to a password. But now, it’s available as a passwordless option.

![Sign in to Microsoft Edge with the Microsoft Authenticator app](./media/concept-authentication-passwordless/concept-web-sign-in-microsoft-authenticator-app.png)

It turns any iOS or Android phone into a strong, passwordless credential by allowing users to sign in to any platform or browser by getting a notification to their phone, matching a number displayed on the screen to the one on their phone and then using their biometric (touch or face) or PIN to confirm.

## FIDO2 security keys

FIDO2 security keys are an unphishable standards-based passwordless authentication method that can come in any form factor. Fast Identity Online (FIDO) is an open standard for passwordless authentication. It allows users and organizations to leverage the standard to sign in to their resources without a username or password using an external security key or a platform key built into a device.

For public preview, employees can use security keys to sign in to their Azure AD or hybrid Azure AD joined Windows 10 devices and get single-sign on to their cloud and on-premises resources. They can also sign in to supported browsers.

![Sign in to Microsoft Edge with a security key](./media/concept-authentication-passwordless/concept-web-sign-in-security-key.png)

While there are many keys that are FIDO2 certified by the FIDO Alliance, Microsoft requires some optional extensions of the FIDO2 Client-to-Authenticator Protocol (CTAP) specification to be implemented by the vendor to ensure maximum security and the best experience.

A security key **MUST** implement the following features and extensions from the FIDO2 CTAP protocol to be Microsoft-compatible:

| # | Feature / Extension trust | Why is this feature or extension required? |
| --- | --- | --- |
| 1 | Resident key | This feature enables the security key to be portable, where your credential is stored on the security key. |
| 2 | Client pin | This feature enables you to protect your credentials with a second factor and applies to security keys that do not have a user interface. |
| 3 | hmac-secret | This extension ensures you can sign in to your device when it's off-line or in airplane mode. |
| 4 | Multiple accounts per RP | This feature ensures you can use the same security key across multiple services like Microsoft Account and Azure Active Directory. |

The following providers offer FIDO2 security keys of different form factors that are known to be compatible with the passwordless experience. Microsoft encourages customers to evaluate the security properties of these keys by contacting the vendor as well as FIDO Alliance.

| Provider | Contact |
| --- | --- |
| Yubico | [https://www.yubico.com/support/contact/](https://www.yubico.com/support/contact/) |
| Feitian | [https://www.ftsafe.com/about/Contact_Us](https://www.ftsafe.com/about/Contact_Us) |
| HID | [https://www.hidglobal.com/contact-us](https://www.hidglobal.com/contact-us) |
| Ensurity | [https://www.ensurity.com/contact](https://www.ensurity.com/contact) |
| eWBM | [https://www.ewbm.com/page/sub1_5](https://www.ewbm.com/page/sub1_5) |
| AuthenTrend | [https://authentrend.com/about-us/#pg-35-3](https://authentrend.com/about-us/#pg-35-3) |

> [!NOTE]
> If you purchase and plan to use NFC based security keys you will need a supported NFC reader.

If you are a vendor and want to get your device on this list, contact [Fido2Request@Microsoft.com](mailto:Fido2Request@Microsoft.com).

FIDO2 security keys are a great option for enterprises who are very security sensitive or have scenarios or employees who aren’t willing or able to use their phone as a second factor.

## What scenarios work with the preview?

- Administrators can enable passwordless authentication methods for their tenant
- Administrators can target all users or select users/groups within their tenant for each method
- End users can register and manage these passwordless authentication methods in their account portal
- End users can sign in with these passwordless authentication methods
   - Microsoft Authenticator App: Will work in scenarios where Azure AD authentication is used, including across all browsers, during Windows 10 Out Of Box (OOBE) setup, and with integrated mobile apps on any operating system.
   - Security keys: Will work on lock screen for Windows 10 and the web in supported browsers like Microsoft Edge.

## Next steps

[Enable FIDO2 security key passwordlesss options in your organization](howto-authentication-passwordless-security-key.md)

[Enable phone-based passwordless options in your organization](howto-authentication-passwordless-phone.md)

### External Links

[FIDO Alliance](https://fidoalliance.org/)

[FIDO2 CTAP specification](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-client-to-authenticator-protocol-v2.0-id-20180227.html)
