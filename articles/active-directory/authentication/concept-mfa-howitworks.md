---
title: Azure Multi-Factor Authentication - How it works - Azure Active Directory
description: Azure Multi-Factor Authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 06/03/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# How it works: Azure Multi-Factor Authentication

The security of two-step verification lies in its layered approach. Compromising multiple authentication factors presents a significant challenge for attackers. Even if an attacker manages to learn the user's password, it is useless without also having possession of the additional authentication method. It works by requiring two or more of the following authentication methods:

* Something you know (typically a password)
* Something you have (a trusted device that is not easily duplicated, like a phone)
* Something you are (biometrics)

<center>

![Conceptual authentication methods image](./media/concept-mfa-howitworks/methods.png)</center>

Azure Multi-Factor Authentication (MFA) helps safeguard access to data and applications while maintaining simplicity for users. It provides additional security by requiring a second form of authentication and delivers strong authentication via a range of easy to use [authentication methods](concept-authentication-methods.md). Users may or may not be challenged for MFA based on configuration decisions that an administrator makes.

## How to get Multi-Factor Authentication?

Multi-Factor Authentication comes as part of the following offerings:

* **Azure Active Directory Premium** or **Microsoft 365 Business** - Full featured use of Azure Multi-Factor Authentication using Conditional Access policies to require multi-factor authentication.

* **Azure AD Free**, **Azure AD Basic**, or standalone **Office 365** licenses - Use pre-created [Conditional Access baseline protection policies](../conditional-access/concept-baseline-protection.md) to require multi-factor authentication for your users and administrators.

* **Azure Active Directory Global Administrators** - A subset of Azure Multi-Factor Authentication capabilities are available as a means to protect global administrator accounts.

> [!NOTE]
> New customers may no longer purchase Azure Multi-Factor Authentication as a standalone offering effective September 1st, 2018. Multi-factor authentication will continue to be an available feature in Azure AD Premium licenses.

## Supportability

Since most users are accustomed to using only passwords to authenticate, it is important that your organization communicates to all users regarding this process. Awareness can reduce the likelihood that users call your help desk for minor issues related to MFA. However, there are some scenarios where temporarily disabling MFA is necessary. Use the following guidelines to understand how to handle those scenarios:

* Train your support staff to handle scenarios where the user can't sign in because they do not have access to their authentication methods or they are not working correctly.
   * Using Conditional Access policies for Azure MFA Service, your support staff can add a user to a group that is excluded from a policy requiring MFA.
* Consider using Conditional Access named locations as a way to minimize two-step verification prompts. With this functionality, administrators can bypass two-step verification for users that are signing in from a secure trusted network location such as a network segment used for new user onboarding.
* Deploy [Azure AD Identity Protection](../active-directory-identityprotection.md) and trigger two-step verification based on risk events.

## Next steps

- [Step-by-step Azure Multi-Factor Authentication deployment](howto-mfa-getstarted.md)
