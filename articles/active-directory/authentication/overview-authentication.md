---
title: Microsoft Entra authentication overview
description: Learn about the different authentication methods and security features for user sign-ins with Microsoft Entra ID.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: overview
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: sahenry, michmcla

ms.collection: M365-identity-device-management

# Customer intent: As a Microsoft Entra administrator, I want to understand which Microsoft Entra features I can use to secure sign-in and make the user authentication process safe and easy.
---
# What is Microsoft Entra authentication?

One of the main features of an identity platform is to verify, or *authenticate*, credentials when a user signs in to a device, application, or service. In Microsoft Entra ID, authentication involves more than just the verification of a username and password. To improve security and reduce the need for help desk assistance, Microsoft Entra authentication includes the following components:

* Self-service password reset
* Microsoft Entra multifactor authentication
* Hybrid integration to write password changes back to on-premises environment
* Hybrid integration to enforce password protection policies for an on-premises environment
* Passwordless authentication

Take a look at our short video to learn more about these authentication components.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4KVJA]

## Improve the end-user experience

Microsoft Entra ID helps to protect a user's identity and simplify their sign-in experience. Features like self-service password reset let users update or change their passwords using a web browser from any device. This feature is especially useful when the user has forgotten their password or their account is locked. Without waiting for a helpdesk or administrator to provide support, a user can unblock themselves and continue to work.

Microsoft Entra multifactor authentication lets users choose an additional form of authentication during sign-in, such as a phone call or mobile app notification. This ability reduces the requirement for a single, fixed form of secondary authentication like a hardware token. If the user doesn't currently have one form of additional authentication, they can choose a different method and continue to work.

![Authentication methods in use at the sign-in screen](media/concept-authentication-methods/overview-login.png)

Passwordless authentication removes the need for the user to create and remember a secure password at all. Capabilities like Windows Hello for Business or FIDO2 security keys let users sign in to a device or application without a password. This ability can reduce the complexity of managing passwords across different environments.

## Self-service password reset

Self-service password reset gives users the ability to change or reset their password, with no administrator or help desk involvement. If a user's account is locked or they forget their password, they can follow prompts to unblock themselves and get back to work. This ability reduces help desk calls and loss of productivity when a user can't sign in to their device or an application.

Self-service password reset works in the following scenarios:

* **Password change -** when a user knows their password but wants to change it to something new.
* **Password reset -** when a user can't sign in, such as when they forgot password, and want to reset their password.
* **Account unlock -** when a user can't sign in because their account is locked out and want to unlock their account.

When a user updates or resets their password using self-service password reset, that password can also be written back to an on-premises Active Directory environment. Password writeback makes sure that a user can immediately use their updated credentials with on-premises devices and applications.

<a name='azure-ad-multi-factor-authentication'></a>

## Microsoft Entra multifactor authentication

Multifactor authentication is a process where a user is prompted during the sign-in process for an additional form of identification, such as to enter a code on their cellphone or to provide a fingerprint scan.

If you only use a password to authenticate a user, it leaves an insecure vector for attack. If the password is weak or has been exposed elsewhere, is it really the user signing in with the username and password, or is it an attacker? When you require a second form of authentication, security is increased as this additional factor isn't something that's easy for an attacker to obtain or duplicate.

![Conceptual image of the different forms of multifactor authentication](./media/concept-mfa-howitworks/methods.png)

Microsoft Entra multifactor authentication works by requiring two or more of the following authentication methods:

* Something you know, typically a password.
* Something you have, such as a trusted device that is not easily duplicated, like a phone or hardware key.
* Something you are - biometrics like a fingerprint or face scan.

Users can register themselves for both self-service password reset and Microsoft Entra multifactor authentication in one step to simplify the on-boarding experience. Administrators can define what forms of secondary authentication can be used. Microsoft Entra multifactor authentication can also be required when users perform a self-service password reset to further secure that process.

## Password protection

By default, Microsoft Entra ID blocks weak passwords such as *Password1*. A global banned password list is automatically updated and enforced that includes known weak passwords. If a Microsoft Entra user tries to set their password to one of these weak passwords, they receive a notification to choose a more secure password.

To increase security, you can define custom password protection policies. These policies can use filters to block any variation of a password containing a name such as *Contoso* or a location like *London*, for example.

For hybrid security, you can integrate Microsoft Entra password protection with an on-premises Active Directory environment. A component installed in the on-premises environment receives the global banned password list and custom password protection policies from Microsoft Entra ID, and domain controllers use them to process password change events. This hybrid approach makes sure that no matter how or where a user changes their credentials, you enforce the use of strong passwords.

## Passwordless authentication

The end-goal for many environments is to remove the use of passwords as part of sign-in events. Features like Azure password protection or Microsoft Entra multifactor authentication help improve security, but a username and password remains a weak form of authentication that can be exposed or brute-force attacked.

![Security versus convenience with the authentication process that leads to passwordless](./media/concept-authentication-passwordless/passwordless-convenience-security.png)

When you sign in with a passwordless method, credentials are provided by using methods like biometrics with Windows Hello for Business, or a FIDO2 security key. These authentication methods can't be easily duplicated by an attacker.

Microsoft Entra ID provides ways to natively authenticate using passwordless methods to simplify the sign-in experience for users and reduce the risk of attacks.  

## Next steps

To get started, see the [tutorial for self-service password reset (SSPR)][tutorial-sspr] and [Microsoft Entra multifactor authentication][tutorial-azure-mfa].

To learn more about self-service password reset concepts, see [How Microsoft Entra self-service password reset works][concept-sspr].

To learn more about multifactor authentication concepts, see [How Microsoft Entra multifactor authentication works][concept-mfa].

<!-- INTERNAL LINKS -->
[tutorial-sspr]: tutorial-enable-sspr.md
[tutorial-azure-mfa]: tutorial-enable-azure-mfa.md
[concept-sspr]: concept-sspr-howitworks.md
[concept-mfa]: concept-mfa-howitworks.md
