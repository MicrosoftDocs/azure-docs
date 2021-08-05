---
title: Azure AD Multi-Factor Authentication overview
description: Learn how Azure AD Multi-Factor Authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/05/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# How it works: Azure AD Multi-Factor Authentication

Multi-factor authentication is a process where a user is prompted during the sign-in process for an additional form of identification, such as to enter a code on their cellphone or to provide a fingerprint scan.

If you only use a password to authenticate a user, it leaves an insecure vector for attack. If the password is weak or has been exposed elsewhere, is it really the user signing in with the username and password, or is it an attacker? When you require a second form of authentication, security is increased as this additional factor isn't something that's easy for an attacker to obtain or duplicate.

![Conceptual image of the different forms of multi-factor authentication](./media/concept-mfa-howitworks/methods.png)

Azure AD Multi-Factor Authentication works by requiring two or more of the following authentication methods:

* Something you know, typically a password.
* Something you have, such as a trusted device that is not easily duplicated, like a phone or hardware key.
* Something you are - biometrics like a fingerprint or face scan.

Azure AD Multi-Factor Authentication can also further secure password reset. When users register themselves for Azure AD Multi-Factor Authentication, they can also register for self-service password reset in one step. Administrators can choose forms of secondary authentication and configure challenges for MFA based on configuration decisions. 

Apps and services don't need changes to use Azure AD Multi-Factor Authentication. The verification prompts are part of the Azure AD sign-in event, which automatically requests and processes the MFA challenge when required.

![Authentication methods in use at the sign-in screen](media/concept-authentication-methods/overview-login.png)

## Available verification methods

When a user signs in to an application or service and receives an MFA prompt, they can choose from one of their registered forms of additional verification. Users can access [My Profile](https://myprofile.microsoft.com) to edit or add verification methods.

The following additional forms of verification can be used with Azure AD Multi-Factor Authentication:

* Microsoft Authenticator app
* OATH Hardware token (preview)
* OATH Software token
* SMS
* Voice call

## How to enable and use Azure AD Multi-Factor Authentication

All Azure AD tenants can use [security defaults](../fundamentals/concept-fundamentals-security-defaults.md) to quickly enable Microsoft Authenticator for all users. Users and groups can be enabled for Azure AD Multi-Factor Authentication to prompt for additional verification during the sign-in event. 

For more granular controls, [Conditional Access](../conditional-access/overview.md) policies can be used to define events or applications that require MFA. These policies can allow regular sign-in events when the user is on the corporate network or a registered device, but prompt for additional verification factors when remote or on a personal device.

![Overview diagram of how Conditional Access works to secure the sign-in process](media/tutorial-enable-azure-mfa/conditional-access-overview.png)

## Next steps

To learn about licensing, see [Features and licenses for Azure AD Multi-Factor Authentication](concept-mfa-licensing.md).

To learn more about the authentication methods in Azure Active Directory, see [authentication methods](concept-authentication-methods.md).

To see MFA in action, enable Azure AD Multi-Factor Authentication for a set of test users in the following tutorial:

> [!div class="nextstepaction"]
> [Enable Azure AD Multi-Factor Authentication](./tutorial-enable-azure-mfa.md)