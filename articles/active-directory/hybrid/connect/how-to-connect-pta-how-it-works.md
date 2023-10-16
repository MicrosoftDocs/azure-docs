---
title: 'Microsoft Entra Connect: Pass-through Authentication - How it works'
description: This article describes how Microsoft Entra pass-through authentication works
services: active-directory
keywords: Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: billmath
manager: amycolannino
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Microsoft Entra pass-through authentication: Technical deep dive
This article is an overview of how Microsoft Entra pass-through authentication works. For deep technical and security information, see the [Security deep dive](how-to-connect-pta-security-deep-dive.md) article.

<a name='how-does-azure-active-directory-pass-through-authentication-work'></a>

## How does Microsoft Entra pass-through authentication work?

>[!NOTE]
>As a pre-requisite for Pass-through Authentication to work, users need to be provisioned into Microsoft Entra ID from on-premises Active Directory using Microsoft Entra Connect. Pass-through Authentication does not apply to cloud-only users.

When a user tries to sign in to an application secured by Microsoft Entra ID, and if Pass-through Authentication is enabled on the tenant, the following steps occur:

1. The user tries to access an application, for example, [Outlook Web App](https://outlook.office365.com/owa/).
2. If the user is not already signed in, the user is redirected to the Microsoft Entra ID **User Sign-in** page.
3. The user enters their username into the Microsoft Entra sign-in page, and then selects the **Next** button.
4. The user enters their password into the Microsoft Entra sign-in page, and then selects the **Sign in** button.
5. Microsoft Entra ID, on receiving the request to sign in, places the username and password (encrypted by using the public key of the Authentication Agents) in a queue.
6. An on-premises Authentication Agent retrieves the username and encrypted password from the queue. Note that the Agent doesn't frequently poll for requests from the queue, but retrieves requests over a pre-established persistent connection.
7. The agent decrypts the password by using its private key.
8. The agent validates the username and password against Active Directory by using standard Windows APIs, which is a similar mechanism to what Active Directory Federation Services (AD FS) uses. The username can be either the on-premises default username, usually `userPrincipalName`, or another attribute configured in Microsoft Entra Connect (known as `Alternate ID`).
9. The on-premises Active Directory domain controller (DC) evaluates the request and returns the appropriate response (success, failure, password expired, or user locked out) to the agent.
10. The Authentication Agent, in turn, returns this response back to Microsoft Entra ID.
11. Microsoft Entra ID evaluates the response and responds to the user as appropriate. For example, Microsoft Entra ID either signs the user in immediately or requests for Microsoft Entra multifactor authentication.
12. If the user sign-in is successful, the user can access the application.

The following diagram illustrates all the components and the steps involved:

![Pass-through Authentication](./media/how-to-connect-pta-how-it-works/pta2.png)

## Next steps
- [Current limitations](how-to-connect-pta-current-limitations.md): Learn which scenarios are supported and which ones are not.
- [Quick Start](how-to-connect-pta-quick-start.md): Get up and running on Microsoft Entra pass-through authentication.
- [Migrate your apps to Microsoft Entra ID](../../manage-apps/migration-resources.md): Resources to help you migrate application access and authentication to Microsoft Entra ID.
- [Smart Lockout](../../authentication/howto-password-smart-lockout.md): Configure the Smart Lockout capability on your tenant to protect user accounts.
- [Frequently Asked Questions](how-to-connect-pta-faq.yml): Find answers to frequently asked questions.
- [Troubleshoot](tshoot-connect-pass-through-authentication.md): Learn how to resolve common problems with the Pass-through Authentication feature.
- [Security Deep Dive](how-to-connect-pta-security-deep-dive.md): Get deep technical information on the Pass-through Authentication feature.
- [Microsoft Entra hybrid join](../../devices/how-to-hybrid-join.md): Configure Microsoft Entra hybrid join capability on your tenant for SSO across your cloud and on-premises resources.    
- [Microsoft Entra seamless SSO](how-to-connect-sso.md): Learn more about this complementary feature.
- [UserVoice](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789): Use the Microsoft Entra Forum to file new feature requests.
