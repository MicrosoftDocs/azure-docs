---
title: 'Azure AD Connect: Pass-through Authentication - How it works? | Microsoft Docs'
description: This article describes how Azure Active Directory Pass-through Authentication works
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
ms.date: 10/19/2017
ms.author: billmath
---

# Azure Active Directory Pass-through Authentication: Technical deep dive
The following article is an overview of how Azure Active directory (Azure AD) Pass-through Authentication works. For deep technical and security information, see the [Security deep dive](active-directory-aadconnect-pass-through-authentication-security-deep-dive.md) article.

## How does Azure Active Directory Pass-through Authentication work?

When a user tries to sign in to an application secured by Azure AD, and if Pass-through Authentication is enabled on the tenant, the following steps occur:

1. The user tries to access an application, for example, the [Outlook Web App](https://outlook.office365.com/owa/).
2. If the user is not already signed in, the user is redirected to the Azure AD **User Sign-in** page.
3. The user enters their username and password into the Azure AD sign in page, and then selects the **Sign in** button.
4. Azure AD, on receiving the request to sign in, places the username and password (encrypted by using a public key) in a queue.
5. An on-premises authentication agent retrieves the username and encrypted password from the queue.
6. The Agent decrypts the password by using its private key.
7. The Agent then validates the username and password against Active Directory by using standard Windows APIs, which is a similar mechanism to what Active Directory Federation Services (AD FS) uses. The username can be either the on-premises default username, usually `userPrincipalName`, or another attribute configured in Azure AD Connect (known as `Alternate ID`).
8. The on-premises Active Directory domain controller (DC) then evaluates the request and returns the appropriate response (either success, failure, password expired, or user locked out) to the Agent.
9. The authentication Agent, in turn, returns this response back to Azure AD.
10. Azure AD evaluates the response and responds to the user as appropriate. For example, Azure AD either signs the user in immediately or requests for Azure Multi-Factor Authentication.
11. If the user sign-in is successful, the user can access the application.

The following diagram illustrates all the components and the steps involved:

![Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta2.png)

## Next steps
- [**Current limitations**](active-directory-aadconnect-pass-through-authentication-current-limitations.md): Learn which scenarios are supported and which ones are not.
- [**Quick Start**](active-directory-aadconnect-pass-through-authentication-quick-start.md): Get up and running on Azure AD Pass-through Authentication.
- [**Smart Lockout**](active-directory-aadconnect-pass-through-authentication-smart-lockout.md): Configure the Smart Lockout capability on your tenant to protect user accounts.
- [**Frequently Asked Questions**](active-directory-aadconnect-pass-through-authentication-faq.md): Find answers to frequently asked questions.
- [**Troubleshoot**](active-directory-aadconnect-troubleshoot-pass-through-authentication.md): Learn how to resolve common problems with the Pass-through Authentication feature.
- [**Security Deep Dive**](active-directory-aadconnect-pass-through-authentication-security-deep-dive.md): Provides additional deep technical information on the Pass-through Authentication feature.
- [**Azure AD Seamless SSO**](active-directory-aadconnect-sso.md): Learn more about this complementary feature.
- [**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect): Use the Azure Active Directory Forum to file new feature requests.

