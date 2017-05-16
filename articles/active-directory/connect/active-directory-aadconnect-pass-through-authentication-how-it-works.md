---
title: 'Azure AD Connect: Pass-through Authentication - How it works? | Microsoft Docs'
description: This article describes how Azure Active Directory (Azure AD) Pass-through Authentication works.
services: active-directory
keywords: Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/16/2017
ms.author: billmath
---

# How does Azure Active Directory Pass-through Authentication work?

When a user attempts to sign in to Azure Active Directory (Azure AD) and if Pass-through Authentication is enabled on the tenant, the following steps occur:

1. The user enters their username and password into the Azure AD sign-in page. Our service places the username and password (encrypted by using a public key) on a queue for validation.
2. One of the available on-premises agents makes an outbound call to the queue and retrieves the username and password.
3. The agent then validates the username and password against Active Directory by using standard Windows APIs (a similar mechanism to what is used by AD FS). The username can be either the on-premises default username (usually `userPrincipalName`) or another attribute configured in Azure AD Connect (known as `Alternate ID`).
4. The on-premises domain controller then evaluates the request and returns a response (success or failure) to the agent.
5. The agent, in turn, returns this response back to Azure AD.
6. Azure AD then evaluates the response and responds to the user as appropriate. For example, it issues a token back to the application or requests Multi-Factor Authentication (MFA).

The following diagram illustrates the various steps. All requests and responses are made over the HTTPS channel.

![Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta2.png)

## Next steps
- [**Advanced topics**]() - Advanced configuration of the feature.
- [**Frequently Asked Questions**]() - Answers to most frequently asked questions.
- [**Preview limitations**]() - Learn which scenarios are currently supported in preview and which ones are not.
- [**Troubleshoot**](active-directory-aadconnect-troubleshoot-pass-through-authentication.md) - Learn how to resolve common issues with the feature.
- [**Azure AD Seamless SSO**](active-directory-aadconnect-sso.md) - Learn more about this complementary feature.
- [**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - For filing new feature requests.
