---
title: 'Azure AD Connect: Pass-through Authentication | Microsoft Docs'
description: This article describes Azure Active Directory (Azure AD) Pass-through Authentication and how it allows Azure AD sign-ins by validating users' passwords against on-premises Active Directory.
services: active-directory
keywords: what is Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: billmath
manager: daveba
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 10/21/2018
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# User sign-in with Azure Active Directory Pass-through Authentication

## What is Azure Active Directory Pass-through Authentication?

Azure Active Directory (Azure AD) Pass-through Authentication allows your users to sign in to both on-premises and cloud-based applications using the same passwords. This feature provides your users a better experience - one less password to remember, and reduces IT helpdesk costs because your users are less likely to forget how to sign in. When users sign in using Azure AD, this feature validates users' passwords directly against your on-premises Active Directory.

>[!VIDEO https://www.youtube.com/embed/PyeAC85Gm7w]

This feature is an alternative to [Azure AD Password Hash Synchronization](how-to-connect-password-hash-synchronization.md), which provides the same benefit of cloud authentication to organizations. However, certain organizations wanting to enforce their on-premises Active Directory security and password policies, can choose to use Pass-through Authentication instead. Review [this guide](https://docs.microsoft.com/azure/security/fundamentals/choose-ad-authn) for a comparison of the various Azure AD sign-in methods and how to choose the right sign-in method for your organization.

![Azure AD Pass-through Authentication](./media/how-to-connect-pta/pta1.png)

You can combine Pass-through Authentication with the [Seamless Single Sign-On](how-to-connect-sso.md) feature. This way, when your users are accessing applications on their corporate machines inside your corporate network, they don't need to type in their passwords to sign in.

## Key benefits of using Azure AD Pass-through Authentication

- *Great user experience*
  - Users use the same passwords to sign into both on-premises and cloud-based applications.
  - Users spend less time talking to the IT helpdesk resolving password-related issues.
  - Users can complete [self-service password management](../authentication/active-directory-passwords-overview.md) tasks in the cloud.
- *Easy to deploy & administer*
  - No need for complex on-premises deployments or network configuration.
  - Needs just a lightweight agent to be installed on-premises.
  - No management overhead. The agent automatically receives improvements and bug fixes.
- *Secure*
  - On-premises passwords are never stored in the cloud in any form.
  - Protects your user accounts by working seamlessly with [Azure AD Conditional Access policies](../active-directory-conditional-access-azure-portal.md), including Multi-Factor Authentication (MFA), [blocking legacy authentication](../conditional-access/concept-conditional-access-conditions.md) and by [filtering out brute force password attacks](../authentication/howto-password-smart-lockout.md).
  - The agent only makes outbound connections from within your network. Therefore, there is no requirement to install the agent in a perimeter network, also known as a DMZ.
  - The communication between an agent and Azure AD is secured using certificate-based authentication. These certificates are automatically renewed every few months by Azure AD.
- *Highly available*
  - Additional agents can be installed on multiple on-premises servers to provide high availability of sign-in requests.

## Feature highlights

- Supports user sign-in into all web browser-based applications and into Microsoft Office client applications that use [modern authentication](https://aka.ms/modernauthga).
- Sign-in usernames can be either the on-premises default username (`userPrincipalName`) or another attribute configured in Azure AD Connect (known as `Alternate ID`).
- The feature works seamlessly with [Conditional Access](../active-directory-conditional-access-azure-portal.md) features such as Multi-Factor Authentication (MFA) to help secure your users.
- Integrated with cloud-based [self-service password management](../authentication/active-directory-passwords-overview.md), including password writeback to on-premises Active Directory and password protection by banning commonly used passwords.
- Multi-forest environments are supported if there are forest trusts between your AD forests and if name suffix routing is correctly configured.
- It is a free feature, and you don't need any paid editions of Azure AD to use it.
- It can be enabled via [Azure AD Connect](whatis-hybrid-identity.md).
- It uses a lightweight on-premises agent that listens for and responds to password validation requests.
- Installing multiple agents provides high availability of sign-in requests.
- It [protects](../authentication/howto-password-smart-lockout.md) your on-premises accounts against brute force password attacks in the cloud.

## Next steps

- [Quickstart](how-to-connect-pta-quick-start.md) - Get up and running Azure AD Pass-through Authentication.
- [Migrate from AD FS to Pass-through Authentication](https://github.com/Identity-Deployment-Guides/Identity-Deployment-Guides/blob/master/Authentication/Migrating%20from%20Federated%20Authentication%20to%20Pass-through%20Authentication.docx?raw=true) - A detailed guide to migrate from AD FS (or other federation technologies) to Pass-through Authentication.
- [Smart Lockout](../authentication/howto-password-smart-lockout.md) - Configure Smart Lockout capability on your tenant to protect user accounts.
- [Current limitations](how-to-connect-pta-current-limitations.md) - Learn which scenarios are supported and which ones are not.
- [Technical Deep Dive](how-to-connect-pta-how-it-works.md) - Understand how this feature works.
- [Frequently Asked Questions](how-to-connect-pta-faq.md) - Answers to frequently asked questions.
- [Troubleshoot](tshoot-connect-pass-through-authentication.md) - Learn how to resolve common issues with the feature.
- [Security Deep Dive](how-to-connect-pta-security-deep-dive.md) - Additional deep technical information on the feature.
- [Azure AD Seamless SSO](how-to-connect-sso.md) - Learn more about this complementary feature.
- [UserVoice](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - For filing new feature requests.
