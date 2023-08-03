---
title: Azure AD Multi-Factor Authentication overview
description: Learn how Azure AD Multi-Factor Authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 03/13/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# How it works: Azure AD Multi-Factor Authentication

Multi-factor authentication is a process in which users are prompted during the sign-in process for an additional form of identification, such as a code on their cellphone or  a fingerprint scan.

If you only use a password to authenticate a user, it leaves an insecure vector for attack. If the password is weak or has been exposed elsewhere, an attacker could be using it to gain access. When you require a second form of authentication, security is increased because this additional factor isn't something that's easy for an attacker to obtain or duplicate.

![Conceptual image of the various forms of multi-factor authentication.](./media/concept-mfa-howitworks/methods.png)

Azure AD Multi-Factor Authentication works by requiring two or more of the following authentication methods:

* Something you know, typically a password.
* Something you have, such as a trusted device that's not easily duplicated, like a phone or hardware key.
* Something you are - biometrics like a fingerprint or face scan.

Azure AD Multi-Factor Authentication can also further secure password reset. When users register themselves for Azure AD Multi-Factor Authentication, they can also register for self-service password reset in one step. Administrators can choose forms of secondary authentication and configure challenges for MFA based on configuration decisions. 

You don't need to change apps and services to use Azure AD Multi-Factor Authentication. The verification prompts are part of the Azure AD sign-in, which automatically requests and processes the MFA challenge when needed. 

>[!NOTE]
>The prompt language is determined by browser locale settings. If you use custom greetings but don’t have one for the language identified in the browser locale, English is used by default. Network Policy Server (NPS) will always use English by default, regardless of custom greetings. English is also used by default if the browser locale can't be identified. 

![MFA sign-in screen.](media/concept-mfa-howitworks/sign-in-screen.png)

## Available verification methods

When users sign in to an application or service and receive an MFA prompt, they can choose from one of their registered forms of additional verification. Users can access [My Profile](https://myprofile.microsoft.com) to edit or add verification methods.

The following additional forms of verification can be used with Azure AD Multi-Factor Authentication:

* Microsoft Authenticator 
* Authenticator Lite (in Outlook)
* Windows Hello for Business
* FIDO2 security key
* OATH hardware token (preview)
* OATH software token
* SMS
* Voice call

## How to enable and use Azure AD Multi-Factor Authentication

You can use [security defaults](../fundamentals/security-defaults.md) in Azure AD tenants to quickly enable Microsoft Authenticator for all users. You can enable Azure AD Multi-Factor Authentication to prompt users and groups for additional verification during sign-in. 

For more granular controls, you can use [Conditional Access](../conditional-access/overview.md) policies to define events or applications that require MFA. These policies can allow regular sign-in when the user is on the corporate network or a registered device but prompt for additional verification factors when the user is remote or on a personal device.

![Diagram that shows how Conditional Access works to secure the sign-in process.](media/tutorial-enable-azure-mfa/conditional-access-overview.png)

## Next steps

To learn about licensing, see [Features and licenses for Azure AD Multi-Factor Authentication](concept-mfa-licensing.md).

To learn more about different authentication and validation methods, see [Authentication methods in Azure Active Directory](concept-authentication-methods.md).

To see MFA in action, enable Azure AD Multi-Factor Authentication for a set of test users in the following tutorial:

> [!div class="nextstepaction"]
> [Enable Azure AD Multi-Factor Authentication](./tutorial-enable-azure-mfa.md)