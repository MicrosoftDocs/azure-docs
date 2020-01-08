---
title: Azure Active Directory authentication overview
description: Learn about the different authentication methods and security features for user sign ins with Azure Active Directory.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: overview
ms.date: 01/07/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: sahenry, michmcla

ms.collection: M365-identity-device-management

# Customer intent: As an Azure AD administrator, I want to understand which Azure AD features I can use to secure sign-in and make the user authentication process safe and easy.
---
# What is Azure Active Directory authentication?

One of the main features of an identity platform is to verify credentials when a user needs to sign in to a device, application, or service. If the user's credentials are successfully validated, or *authenticated*, the user can then access the resources they need. In Azure Active Directory (Azure AD), authentication can involve more than just the verification of a username and password. To improve security and reduce the need for help desk assistance, Azure AD authentication includes the following components:

* Self-service password reset
* Azure Multi-Factor Authentication
* Hybrid integration to write password changes back to on-premises environment
* Hybrid integration to enforce password protection policies for an on-premises environment
* Passwordless authentication

## Improve the end-user experience



## Self-service password reset

Self-service password reset gives users the ability to change or reset their password, with no administrator or help desk involvement. If a user's account is locked or they've forgotten their password, they can follow prompts to unblock themselves and get back to work. This ability reduces help desk calls and loss of productivity when a user can't sign in to their device or an application.

Self-service password reset includes the following features:

* **Password change:** When a user knows their password but wants to change it to something new.
* **Password reset:** When a user can't sign in, such as with a forgotten password, and wants to reset their password.
* **Account unlock:** When a user can't sign in because their account is locked out and wants to unlock their account.

When a user updates or resets their password using self-service password reset, that password can also be written back to an on-premises Active Directory environment. This password writeback is completed using Azure AD Connect. Password writeback makes sure that a user can immediately user their updated credentials with on-premises devices and applications.

## Azure Multi-Factor Authentication

Only using a password to authenticate a user leaves an area for uncertainity. If the password was weak or has been exposed elsewhere, is it really the user signing in with the username and password, or is it an attacker? Requiring a second form of authentication greatly increases security, as this secondary factor isn't something that is easy for an attacker to obtain or duplicate. Multi-factor authentication is a process where a user is prompted during the sign in process for additional form of identification, such as to enter a code on their cellphone or to provide a fingerprint scan.

Azure Multi-Factor Authentication works by requiring two or more of the following authentication methods:

* Something you know, typically a password
* Something you have, such as a trusted device that is not easily duplicated, like a phone
* Something you are - biometrics like a fingerprint or face scan

## Password protection

By default, Azure AD includes the ability to block weak passwords, such as *Password1*. A global banned password list is automatically updated and enforced that includes known weak passwords. If an Azure AD user tries to set their password to one of these weak passwords, they receive a notification to choose a more secure password.

To increase security, you can define your own custom password protection policies. These policies can use filters to block for any variation of a password containing a name such as *Contoso* or a location like *London*, for example.

--- GRAPHIC FOR PASSWORD PROTECTION ---

For enhanced security, you can integrate Azure AD password protection with an on-premises Active Directory environment. A small component installed in the on-prem environment receives the global banned password list and any custom password protection policies from Azure AD, and domain controllers use them to process password change events. This ability makes sure that no matter how or where a user changes their credentials, you enforce the use of strong passwords.

## Passwordless authentication



## License requirements

[!INCLUDE [Active Directory P1 license](../../../includes/active-directory-p1-license.md)]

## Next steps

To help you get started with Azure AD authentication features, there's a multi-part tutorial series that explores the following areas:

* Enable self-service password reset (SSPR)
* Enable Azure Multi-Factor Authentication
* Configure hybrid authentication and security with SSPR-writeback and password protection
* Enable risk-based identity policies
* Explore and enable passwordless authentication methods

To learn more about self-service password reset, see [How Azure AD self-service password reset works](concept-sspr-howitworks.md).

To learn more about multi-factor authentication, see [How Azure Multi-Factor Authentication works](concept-mfa-howitworks.md).
