---
title: Choose between Azure MFA cloud or server | Microsoft Docs
description: Choose the multi-factor authentication security solution that is right for you by asking, what am I trying to secure and where are my users located.  Then choose cloud, MFA Server or AD FS.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: yossib

ms.assetid: ec2270ea-13d7-4ebc-8a00-fa75ce6c746d
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/23/2017
ms.author: kgremban

---
# Choose the Azure Multi-Factor Authentication solution for you
Because there are several flavors of Azure Multi-Factor Authentication (MFA), we must answer a few questions to figure out which version is the proper one to use.  Those questions are:

* [What am I trying to secure](#what-am-i-trying-to-secure)
* [Where are the users located](#where-are-the-users-located)
* [What features do I need?](#what-featured-do-i-need)

The following sections provide guidance on determining each of these answers.

## What am I trying to secure?
To determine the correct two-step verification solution, first we must answer the question of what are you trying to secure with a second method of authentication.  Is it an application that is in Azure?  Or a remote access system?  By determining what we are trying to secure, we can answer the question of where Multi-Factor Authentication needs to be enabled.  

| What are you trying to secure | MFA in the cloud | MFA Server |
| --- |:---:|:---:|
| First-party Microsoft apps |● |● |
| SaaS apps in the app gallery |● |  |
| Web applications published through Azure AD App Proxy |● |  |
| IIS applications not published through Azure AD App Proxy | |● |
| Remote access such as VPN, RDG | |● |

## Where are the users located
Next, looking at where our users are located helps to determine the correct solution to use, whether in the cloud or on-premises using the MFA Server.

| User Location | MFA in the cloud | MFA Server |
| --- |:---:|:---:|
| Azure Active Directory |● | |
| Azure AD and on-premises AD using federation with AD FS |● |● |
| Azure AD and on-premises AD using DirSync, Azure AD Sync, Azure AD Connect - no password sync |● |● |
| Azure AD and on-premises AD using DirSync, Azure AD Sync, Azure AD Connect - with password sync |● | |
| On-premises Active Directory | |● |

## What features do I need?
The following table is a comparison of the features that are available with Multi-Factor Authentication in the cloud and with the Multi-Factor Authentication Server.

| Feature | MFA in the cloud | MFA Server |
| --- |:---:|:---:|
| Mobile app notification as a second factor | ● | ● |
| Mobile app verification code as a second factor | ● | ● |
| Phone call as second factor | ● | ● |
| One-way SMS as second factor | ● | ● |
| Two-way SMS as second factor | | ● |
| Hardware Tokens as second factor | | ● |
| App passwords for Office 365 clients that don’t support MFA | ● | |
| Admin control over authentication methods | ● | ● |
| PIN mode | | ● |
| Fraud alert |● | ● |
| MFA Reports |● | ● |
| One-Time Bypass | | ● |
| Custom greetings for phone calls | ● | ● |
| Customizable caller ID for phone calls | ● | ● |
| Trusted IPs | ● | ● |
| Remember MFA for trusted devices | ● | |
| Conditional access | ● | ● |
| Cache |  | ● |

Now that we have determined whether to use cloud multi-factor authentication or the MFA Server on-premises, we can get started setting up and using Azure Multi-Factor Authentication. **Select the icon that represents your scenario!**

<center>




[![Cloud](./media/multi-factor-authentication-get-started/cloud2.png)](multi-factor-authentication-get-started-cloud.md)  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![Proofup](./media/multi-factor-authentication-get-started/server2.png)](multi-factor-authentication-get-started-server.md) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</center>
