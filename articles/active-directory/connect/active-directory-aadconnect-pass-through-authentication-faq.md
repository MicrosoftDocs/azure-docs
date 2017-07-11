---
title: 'Azure AD Connect: Pass-through Authentication - Frequently asked questions | Microsoft Docs'
description: Answers to frequently asked questions about Azure Active Directory Pass-through Authentication.
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
ms.date: 07/06/2017
ms.author: billmath
---

# Azure Active Directory Pass-through Authentication: Frequently asked questions

In this article, we address frequently asked questions about Azure Active Directory (Azure AD) Pass-through Authentication. Keep checking back for new content.

## Which of the Azure AD sign-in methods - Pass-through Authentication, Password Hash Synchronization and Active Directory Federation Services (AD FS) - should I choose?

It depends on your on-premises environment and organizational requirements. Review this article for a [comparison of the various Azure AD sign-in methods](active-directory-aadconnect-user-signin.md).

## Is Pass-through Authentication a free feature?

Pass-through Authentication is a free feature and you don't need any paid editions of Azure AD to use it. It remains free when the feature reaches general availability.

## Is Pass-through Authentication available in [Microsoft Cloud Germany](http://www.microsoft.de/cloud-deutschland) and [Microsoft Azure Government Cloud](https://azure.microsoft.com/features/gov/)?

No, Pass-through Authentication is only available in the world-wide instance of Azure AD.

## Does [Conditional Access](../active-directory-conditional-access.md) work with Pass-through Authentication?

Yes, all Conditional Access capabilities, including Azure Multi-Factor Authentication, work with Pass-through Authentication.

## Does Pass-through Authentication support "Alternate ID" as the username, instead of "userPrincipalName"?

Yes. Pass-through Authentication supports `Alternate ID` as the username when configured in Azure AD Connect as shown [here](active-directory-aadconnect-get-started-custom.md). Not all Office 365 applications support `Alternate ID`. Refer to the specific application's documentation for the support statement.

## Does Password Hash Synchronization act as a fallback to Pass-through Authentication?

No, Password Hash Synchronization is not a generic fallback to Pass-through Authentication. It only acts as a fallback for [scenarios that Pass-through Authentication doesn't support today](active-directory-aadconnect-pass-through-authentication-current-limitations.md#unsupported-scenarios). To avoid user sign-in failures, you should configure Pass-through Authentication for [high availability](active-directory-aadconnect-pass-through-authentication-quick-start.md#step-4-ensure-high-availability).

## Can I install an [Azure AD Application Proxy](../active-directory-application-proxy-get-started.md) connector on the same server as a Pass-through Authentication Agent?

No, this configuration is _not_ supported.

## What versions of Azure AD Connect and Pass-through Authentication Agent do you need?

You need version 1.1.486.0 or later for Azure AD Connect and 1.5.58.0 or later for the Pass-through Authentication Agent for this feature to work. All software should be installed on servers with Windows Server 2012 R2 or later.

## What happens if my user's password has expired and they try to sign in using Pass-through Authentication?

If you have configured [password writeback](../active-directory-passwords-update-your-own-password.md) for a specific user, and if the user signs in using Pass-through Authentication, they can change or reset their passwords. The passwords are written back to on-premises Active Directory as expected.

However, if password writeback is not configured or if the user doesn't have a valid Azure AD license assigned, the user can't update their password in the cloud. They can't update their password even if their password has expired. The user instead sees this message: "Your organization doesn't allow you to update your password on this site. Please update it according to the method recommended by your organization, or ask your admin if you need help." The user or the administrator has to reset their password in your on-premises Active Directory.

## How does Pass-through Authentication protect you against brute force password attacks?

Read [this article](active-directory-aadconnect-pass-through-authentication-smart-lockout.md) for more information.

## What do Pass-through Authentication Agents communicate over ports 80 and 443?

- The Authentication Agents make HTTPS requests over port 443 for all feature operations such as enabling the feature, processing all user sign-in requests and others.
- The Authentication Agents make HTTP requests over port 80 to download SSL certificate revocation lists.

     >[!NOTE]
     >During our recent updates we reduced the number of ports required by Authentication Agents to communicate with Azure AD. If you are running older versions of Azure AD Connect and/or standalone Authentication Agents, you should continue to keep those additional ports (5671, 8080, 9090, 9091, 9350, 9352, 10100-10120) open.

## Can the Pass-through Authentication Agents communicate over an outbound web proxy server?

Yes. If WPAD (Web Proxy Auto-Discovery) is enabled in your on-premises environment,  Authentication Agents automatically attempt to locate and use a web proxy server on the network.

## Can I install two or more Pass-through Authentication Agents on the same server?

No, you can only install one Pass-through Authentication Agent on a single server. If you want to configure Pass-through Authentication for high availability, follow the instructions in this [article](active-directory-aadconnect-pass-through-authentication-quick-start.md#step-4-ensure-high-availability) instead.

## I already use Active Directory Federation Services (AD FS) for Azure AD sign-in. How do I switch it to Pass-through Authentication?

If you have configured AD FS as your sign-in method using the Azure AD Connect wizard, change the user sign-in method to Pass-through Authentication. This change enables Pass-through Authentication on the tenant and converts _all_ your Federated domains into Managed domains. All subsequent sign-in requests in your tenant are handled by Pass-through Authentication. Currently, there is no supported way within Azure AD Connect to use a combination of AD FS and Pass-through Authentication across different domains.

If AD FS was configured as the sign-in method _outside_ of the Azure AD Connect wizard, change the user sign-in method to Pass-through Authentication (from the "Do not configure" option). This change enables Pass-through Authentication on the tenant. However all your Federated domains continue to use AD FS for sign-in. Use PowerShell to manually convert some or all these Federated domains to Managed domains. After that all sign-in requests on Managed domains (_only_) are handled by Pass-through Authentication.

>[!IMPORTANT]
>Pass-through Authentication doesn't handle sign-in for cloud-only Azure AD users.

## Can I use Pass-through Authentication in a multi-forest AD environment?

Yes. Multi-forest environments are supported if there are forest trusts between your AD forests and if name suffix routing is correctly configured.

## Do Pass-through Authentication Agents provide load balancing capability?

No, installing multiple Pass-through Authentication Agents ensures [high availability](active-directory-aadconnect-pass-through-authentication-quick-start.md#step-4-ensure-high-availability), but not load balancing. One or two of the Authentication Agents may end up handling the bulk of the sign-in requests.

Password validation requests that the Authentication Agents need to handle are lightweight. Therefore peak and average load for most customers is easily handled by two or three Authentication Agents in total.

We recommend that you install Authentication Agents close to your Domain Controllers to improve sign-in latency.

## Can I install the first Pass-through Authentication Agent on a server other than the one that runs Azure AD Connect?

No, this scenario is _not_ supported.

## How many Pass-through Authentication Agents should I install?

We recommend that:

- You install two or three Authentication Agents in total. That is sufficient for most customers.
- You install Authentication Agents on your Domain Controllers (or as close to them as possible) to improve sign-in latency.
- You ensure that servers (where Authentication Agents are installed) are added to the same AD forest as the users whose passwords need to be validated.

Note that there is a system limit of 12 Authentication Agents per tenant.

## How can I disable Pass-through Authentication?

Rerun the Azure AD Connect wizard and change the user sign-in method from Pass-through Authentication to another method. This change disables Pass-through Authentication on the tenant and uninstalls the Authentication Agent from the server. You have to manually uninstall the Authentication Agents from other servers.

## What happens when I uninstall a Pass-through Authentication Agent?

Uninstalling a Pass-through Authentication Agent from a server causes it to stop accepting sign-in requests. Ensure that you have another Authentication Agent running before doing this operation, to avoid breaking user sign-in on your tenant.

## Next steps
- [**Current limitations**](active-directory-aadconnect-pass-through-authentication-current-limitations.md) - This feature is currently in preview. Learn which scenarios are supported and which ones are not.
- [**Quick Start**](active-directory-aadconnect-pass-through-authentication-quick-start.md) - Get up and running Azure AD Pass-through Authentication.
- [**Technical Deep Dive**](active-directory-aadconnect-pass-through-authentication-how-it-works.md) - Understand how this feature works.
- [**Troubleshoot**](active-directory-aadconnect-troubleshoot-pass-through-authentication.md) - Learn how to resolve common issues with the feature.
- [**Azure AD Seamless SSO**](active-directory-aadconnect-sso.md) - Learn more about this complementary feature.
- [**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - For filing new feature requests.
