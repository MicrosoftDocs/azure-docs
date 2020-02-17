---
title: 'Azure AD Connect: Pass-through Authentication - How it works | Microsoft Docs'
description: This article describes how Azure Active Directory Pass-through Authentication works
services: active-directory
keywords: Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: billmath
manager: daveba
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/19/2018
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Azure Active Directory Pass-through Authentication: Technical deep dive
This article is an overview of how Azure Active directory (Azure AD) Pass-through Authentication works. For deep technical and security information, see the [Security deep dive](how-to-connect-pta-security-deep-dive.md) article.

## How does Azure Active Directory Pass-through Authentication work?

>[!NOTE]
>As a pre-requisite for Pass-through Authentication to work, users need to be provisioned into Azure AD from on-premises Active Directory using Azure AD Connect. Pass-through Authentication does not apply to cloud-only users.

When a user tries to sign in to an application secured by Azure AD, and if Pass-through Authentication is enabled on the tenant, the following steps occur:

1. The user tries to access an application, for example, [Outlook Web App](https://outlook.office365.com/owa/).
2. If the user is not already signed in, the user is redirected to the Azure AD **User Sign-in** page.
3. The user enters their username into the Azure AD sign in page, and then selects the **Next** button.
4. The user enters their password into the Azure AD sign in page, and then selects the **Sign in** button.
5. Azure AD, on receiving the request to sign in, places the username and password (encrypted by using the public key of the Authentication Agents) in a queue.
6. An on-premises Authentication Agent retrieves the username and encrypted password from the queue. Note that the Agent doesn't frequently poll for requests from the queue, but retrieves requests over a pre-established persistent connection.
7. The agent decrypts the password by using its private key.
8. The agent validates the username and password against Active Directory by using standard Windows APIs, which is a similar mechanism to what Active Directory Federation Services (AD FS) uses. The username can be either the on-premises default username, usually `userPrincipalName`, or another attribute configured in Azure AD Connect (known as `Alternate ID`).
9. The on-premises Active Directory domain controller (DC) evaluates the request and returns the appropriate response (success, failure, password expired, or user locked out) to the agent.
10. The Authentication Agent, in turn, returns this response back to Azure AD.
11. Azure AD evaluates the response and responds to the user as appropriate. For example, Azure AD either signs the user in immediately or requests for Azure Multi-Factor Authentication.
12. If the user sign-in is successful, the user can access the application.

The following diagram illustrates all the components and the steps involved:

![Pass-through Authentication](./media/how-to-connect-pta-how-it-works/pta2.png)

## Next steps
- [Current limitations](how-to-connect-pta-current-limitations.md): Learn which scenarios are supported and which ones are not.
- [Quick Start](how-to-connect-pta-quick-start.md): Get up and running on Azure AD Pass-through Authentication.
- [Migrate from AD FS to Pass-through Authentication](https://aka.ms/adfstoPTADP) - A detailed guide to migrate from AD FS (or other federation technologies) to Pass-through Authentication.
- [Smart Lockout](../authentication/howto-password-smart-lockout.md): Configure the Smart Lockout capability on your tenant to protect user accounts.
- [Frequently Asked Questions](how-to-connect-pta-faq.md): Find answers to frequently asked questions.
- [Troubleshoot](tshoot-connect-pass-through-authentication.md): Learn how to resolve common problems with the Pass-through Authentication feature.
- [Security Deep Dive](how-to-connect-pta-security-deep-dive.md): Get deep technical information on the Pass-through Authentication feature.
- [Azure AD Seamless SSO](how-to-connect-sso.md): Learn more about this complementary feature.
- [UserVoice](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect): Use the Azure Active Directory Forum to file new feature requests.

