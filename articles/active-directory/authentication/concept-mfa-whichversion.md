---
title: Azure MFA Server or Service, On-premises or in the cloud?
description: As an Azure AD Administrator, I need to understand which version of MFA I should deploy? 

services: multi-factor-authentication
ms.service: active-directory
ms.component: authentication
ms.topic: conceptual
ms.date: 07/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: michmcla

---
# Which version of Azure MFA is right for my organization?

Before you can decide where and how to deploy Multi-Factor Authentication (MFA), you need to answer three basic questions.

* [What am I trying to secure](#what-am-i-trying-to-secure)
* [Where are the users located](#where-are-the-users-located)
* [What features do I need?](#what-features-do-i-need)

Each of the following sections provides details to help you answer the preceding questions.

## What am I trying to secure?

To determine the correct two-step verification solution, first you must answer the question of what are you trying to secure with an additional factor of authentication. Is it an application that is in Azure? Or a remote access system? By determining what you are trying to secure, you can answer the question of where Multi-Factor Authentication needs to be enabled.

| What are you trying to secure | MFA in the cloud | MFA Server |
| --- |:---:|:---:|
| First-party Microsoft apps |● |● |
| SaaS apps in the app gallery |● |  |
| Web applications published through Azure AD App Proxy |● |  |
| IIS applications not published through Azure AD App Proxy | |● |
| Remote access such as VPN, RDG | ● | ● |

## Where are the users located

Next, determine where your organization's users are located helps to determine the correct solution to use, whether in the cloud or on-premises using the MFA Server.

| User Location | MFA in the cloud | MFA Server |
| --- |:---:|:---:|
| Azure Active Directory |● | |
| Azure AD and on-premises AD using federation with AD FS |● |● |
| Azure AD and on-premises AD using Azure AD Connect - no password hash sync or pass-through authentication |● |● |
| Azure AD and on-premises AD using Azure AD Connect - with password hash sync or pass-through authentication |● | |
| On-premises Active Directory | |● |

## What features do I need?

The following table compares the features that are available with Multi-Factor Authentication in the cloud and the Multi-Factor Authentication Server.

| Feature | MFA in the cloud | MFA Server |
| --- |:---:|:---:|
| Mobile app notification as a second factor | ● | ● |
| Mobile app verification code as a second factor | ● | ● |
| Phone call as second factor | ● | ● |
| One-way SMS as second factor | ● | ● |
| Hardware Tokens as second factor | | ● |
| App passwords for Office 365 clients that don’t support MFA | ● | |
| Admin control over authentication methods | ● | ● |
| PIN mode | | ● |
| Fraud alert | ● | ● |
| MFA Reports | ● | ● |
| One-Time Bypass | | ● |
| Custom greetings for phone calls | ● | ● |
| Customizable caller ID for phone calls | ● | ● |
| Trusted IPs | ● | ● |
| Remember MFA for trusted devices | ● | |
| Conditional access | ● | ● |
| Cache |  | ● |

## Next steps

Now that you understand the difference between Azure Multi-Factor Authentication in the cloud or the MFA Server on-premises, it's time to set up and use Azure Multi-Factor Authentication. **Select the icon that represents your scenario**

<center>

[![MFA in the cloud](./media/concept-mfa-whichversion/cloud2.png)](howto-mfa-getstarted.md)  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [![MFA Server](./media/concept-mfa-whichversion/server2.png)](howto-mfaserver-deploy.md) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</center>
