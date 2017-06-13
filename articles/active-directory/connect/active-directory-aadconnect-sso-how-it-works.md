---
title: 'Azure AD Connect: Seamless Single Sign-On - How it works? | Microsoft Docs'
description: This article describes how the Azure Active Directory Seamless Single Sign-On feature works.
services: active-directory
keywords: what is Azure AD Connect, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/12/2017
ms.author: billmath
---

# Azure Active Directory Seamless Single Sign-On: Technical deep dive

## How does Azure Active Directory Seamless Single Sign-On work?

You can enable Seamless SSO in Azure AD Connect as shown [below](#how-to-enable-azure-ad-seamless-sso?). Once enabled, a computer account named AZUREADSSOACCT is created in your on-premises Active Directory (AD) and its Kerberos decryption key is shared securely with Azure AD. In addition, two Kerberos service principal names (SPNs) are created to represent two service URLs that are used during Azure AD sign-in.

>[!NOTE]
> The computer account and the Kerberos SPNs need to be created in each AD forest that you synchronize to Azure AD (via Azure AD Connect) and for whose users you want to enable Seamless SSO. If your AD forest has organizational units (OUs) for computer accounts, after enabling the Seamless SSO feature, move the AZUREADSSOACCT computer account to an OU to ensure that it is not deleted and is managed in the same way as other computer accounts.

Once this setup is complete, Azure AD sign-in works the same way as any other sign-in that uses Integrated Windows Authentication (IWA). The Seamless SSO process works as follows:

Let's say that your user attempts to access a cloud-based resource that is secured by Azure AD, such as SharePoint Online. SharePoint Online redirects the user's browser to Azure AD for sign-in.

If the sign-in request to Azure AD includes a `domain_hint` (identifies your Azure AD tenant; for example, contoso.onmicrosoft.com) or a `login_hint` (identifies the user's username; for example, user@contoso.onmicrosoft.com or user@contoso.com) parameter, then steps 1-5 occur.

If either of those two parameters are not included in the request, the user will be asked to provide their username on the Azure AD sign-in page. Steps 1-5 occur only after the user tabs out of the username field or clicks the "Continue" button.

1. Azure AD challenges the client, via a 401 Unauthorized response, to provide a Kerberos ticket.
2. The client requests a ticket from Active Directory for Azure AD (represented by the computer account which was setup earlier).
3. Active Directory locates the computer account and returns a Kerberos ticket to the client encrypted with the computer account's secret. The ticket includes the identity of the user currently signed in to the desktop.
4. The client sends the Kerberos ticket it acquired from Active Directory to Azure AD.
5. Azure AD decrypts the Kerberos ticket using the previously shared key. If successful, Azure AD either returns a token or asks the user to perform additional proofs such as multi-factor authentication as required by the resource.

Seamless SSO is an opportunistic feature, which means that if it fails for any reason, the user sign-in experience falls back to its regular behavior - i.e, the user will need to enter their password on the sign-in page.

The process is also illustrated in the diagram below:

![Seamless Single Sign On](./media/active-directory-aadconnect-sso/sso2.png)

## Next steps

- [**Quick Start**](active-directory-aadconnect-sso-quick-start.md) - Get up and running Azure AD Seamless SSO.
- [**Frequently Asked Questions**](active-directory-aadconnect-sso-faq.md) - Answers to frequently asked questions.
- [**Troubleshoot**](active-directory-aadconnect-troubleshoot-sso.md) - Learn how to resolve common issues with the feature.
- [**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - For filing new feature requests.
