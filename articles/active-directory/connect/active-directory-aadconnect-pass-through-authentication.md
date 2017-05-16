---
title: 'Azure AD Connect: Pass-through Authentication | Microsoft Docs'
description: This article describes Azure Active Directory (Azure AD) Pass-through Authentication and how it allows Azure AD sign-ins by validating users' passwords against on-premises Active Directory.
services: active-directory
keywords: what is Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/15/2017
ms.author: billmath
---

# User sign-in with Azure Active Directory Pass-through Authentication

## What is Azure Active Directory Pass-through Authentication?

Azure Active Directory (Azure AD) Pass-through Authentication allows your users to sign in to both on-premises and cloud-based applications using the same passwords. This feature provides your users a better experience - one less password to remember, and reduces IT helpdesk costs because your users are less likely to forget how to sign in. When users sign in using Azure AD, this feature validates users' passwords directly against your on-premises Active Directory.

This feature is an alternative to [Azure AD Password Hash Synchronization](active-directory-aadconnectsync-implement-password-synchronization.md), which provides the same benefit to organizations. However, security and compliance policies in certain organizations don't permit these organizations to send users' passwords, even in a hashed form, outside their internal boundaries. Pass-through Authentication is the right solution for such organizations.

![Azure AD Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta1.png)

You can combine Pass-through Authentication with the [Seamless Single Sign-on](active-directory-aadconnect-sso.md) feature. This way, when your users are accessing applications on their corporate machines inside your corporate network, they don't need to type in their passwords to sign in.

## Key benefits of using Azure AD Pass-through Authentication

- Great user experience
  - Users use the same passwords to sign into both on-premises and cloud-based applications.
  - Users spend less time talking to the IT helpdesk resolving password-related issues.
- Easy to deploy & administer
  - No need for complex on-premises deployments or network configuration.
  - Needs just a lightweight agent to be installed on-premises.
  - No management overhead. The agent automatically receives improvements and bug fixes.
- Secure
  - On-premises passwords are never stored in the cloud in any form.
  - The agent only makes outbound connections from within your network. Therefore, there is no requirement to install the agent in a perimeter network, also known as a DMZ.
  - Works seamlessly with Azure Multi-Factor Authentication (MFA).
- Highly available
  - Additional agents can be installed on multiple on-premises servers to provide high availability of sign-in requests.

## Feature highlights

- Supports user sign-in into all web browser-based applications and into Microsoft Office client applications that use [modern authentication](https://aka.ms/modernauthga).
- Sign-in usernames can be either the on-premises default username (`userPrincipalName`) or another attribute configured in Azure AD Connect (known as `Alternate ID`).
- The feature works seamlessly with [conditional access](../active-directory-conditional-access.md) features such as Multi-Factor Authentication (MFA) to help secure your users.
- Multi-forest environments are supported if there are forest trusts between your AD forests and if name suffix routing is correctly configured.
- It is a free feature, and you don't need any paid editions of Azure AD to use it.
- It can be enabled via [Azure AD Connect](active-directory-aadconnect.md).
- It uses a lightweight on-premises agent that listens for and responds to password validation requests.
- Installing multiple agents provides high availability of sign-in requests.

## What's available during preview?

>[!NOTE]
>Azure AD Pass-through Authentication is currently in preview. It is a free feature, and you don't need any paid editions of Azure AD to use it.

The following scenarios are fully supported during preview:

- All web browser-based applications
- Office 365 client applications that support [modern authentication](https://aka.ms/modernauthga)

The following scenarios are _not_ supported during preview:

- Legacy Office client applications and Exchange ActiveSync (that is, native email applications on mobile devices). Organizations are encouraged to switch to modern authentication, if possible. Modern authentication allows for Pass-through Authentication support but also helps you secure your identities by using [conditional access](../active-directory-conditional-access.md) features such as Multi-Factor Authentication (MFA).
- Azure AD Join for Windows 10 devices.

>[!IMPORTANT]
>As a workaround for scenarios not supported today, Password Hash Synchronization is also enabled by default when you enable Pass-through Authentication. Password Hash Synchronization acts as a fallback in these specific scenarios only. If you don't need these scenarios, you can turn off Password Hash Synchronization on the [Optional features](active-directory-aadconnect-get-started-custom.md#optional-features) page in the Azure AD Connect wizard.

## How does Azure AD Pass-through Authentication work?

When a user attempts to sign in to Azure AD (and if Pass-through Authentication is enabled on the tenant), the following steps occur:

1. The user enters their username and password into the Azure AD sign-in page. Our service places the username and password (encrypted by using a public key) on a queue for validation.
2. One of the available on-premises agents makes an outbound call to the queue and retrieves the username and password.
3. The agent then validates the username and password against Active Directory by using standard Windows APIs (a similar mechanism to what is used by AD FS). The username can be either the on-premises default username (usually `userPrincipalName`) or another attribute configured in Azure AD Connect (known as `Alternate ID`).
4. The on-premises domain controller then evaluates the request and returns a response (success or failure) to the agent.
5. The agent, in turn, returns this response back to Azure AD.
6. Azure AD then evaluates the response and responds to the user as appropriate. For example, it issues a token back to the application or requests Multi-Factor Authentication (MFA).

The following diagram illustrates the various steps. All requests and responses are made over the HTTPS channel.

![Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta2.png)

### A note about password writeback

If you have configured [password writeback](../active-directory-passwords-update-your-own-password.md) for a specific user, if the user signs in using Pass-through Authentication, they can change or reset their passwords as before. The passwords are written back to on-premises Active Directory as expected.

However, if password writeback is not configured or a user doesn't have a valid Azure AD license assigned, the user can't update their password in the cloud. They can't update their password even if their password has expired. The user instead sees this message: "Your organization doesn't allow you to update your password on this site. Please update it according to the method recommended by your organization, or ask your admin if you need help."

## Next steps
- [**Quick Start**](active-directory-aadconnect-pass-through-authentication-quick-start.md) - Get up and running Azure AD Pass-through Authentication.
- [**Technical Deep Dive**](active-directory-aadconnect-pass-through-authentication-how-it-works.md) - Understand how this feature works.
- [**Advanced topics**]() - Advanced configuration of the feature.
- [**Frequently Asked Questions**]() - Answers to most frequently asked questions.
- [**Preview limitations**]() - Learn which scenarios are currently supported in preview and which ones are not.
- [**Troubleshoot**](active-directory-aadconnect-troubleshoot-pass-through-authentication.md) - Learn how to resolve common issues with the feature.
- [**Azure AD Seamless SSO**](active-directory-aadconnect-sso.md) - Learn more about this complementary feature.
- [**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - For filing new feature requests.
