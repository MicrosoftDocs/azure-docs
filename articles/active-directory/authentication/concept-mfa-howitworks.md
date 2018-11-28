---
title: Azure Multi-Factor Authentication - How it works
description: Azure Multi-Factor Authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process.

services: multi-factor-authentication
ms.service: active-directory
ms.component: authentication
ms.topic: conceptual
ms.date: 10/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: michmcla

---
# How it works: Azure Multi-Factor Authentication

The security of two-step verification lies in its layered approach. Compromising multiple authentication factors presents a significant challenge for attackers. Even if an attacker manages to learn the user's password, it is useless without also having possession of the additional authentication method. It works by requiring two or more of the following authentication methods:

* Something you know (typically a password)
* Something you have (a trusted device that is not easily duplicated, like a phone)
* Something you are (biometrics)

<center>![Conceptual authentication methods image](./media/concept-mfa-howitworks/methods.png)</center>

Azure Multi-Factor Authentication (MFA) helps safeguard access to data and applications while maintaining simplicity for users. It provides additional security by requiring a second form of authentication and delivers strong authentication via a range of easy to use [authentication methods](concept-authentication-methods.md).

## How to get Multi-Factor Authentication?

Multi-Factor Authentication comes as part of the following offerings:

* **Azure Active Directory Premium licenses** - Full featured use of Azure Multi-Factor Authentication Service (Cloud) or Azure Multi-Factor Authentication Server (On-premises).
   * **Azure MFA Service (Cloud)** - **This option is the recommended path for new deployments**. Azure MFA in the cloud requires no on-premises infrastructure and can be used with your federated or cloud-only users.
   * **Azure MFA Server** - If your organization wants to manage the associated infrastructure elements and has deployed AD FS in your on-premises environment this way may be an option.
* **Multi-Factor Authentication for Office 365** - A subset of Azure Multi-Factor Authentication capabilities are available as a part of your subscription. For more information about MFA for Office 365, see the article [Plan for multi-factor authentication for Office 365 Deployments](https://support.office.com/article/plan-for-multi-factor-authentication-for-office-365-deployments-043807b2-21db-4d5c-b430-c8a6dee0e6ba).
* **Azure Active Directory Global Administrators** - A subset of Azure Multi-Factor Authentication capabilities are available as a means to protect global administrator accounts.

> [!NOTE]
> New customers may no longer purchase Azure Multi-Factor Authentication as a standalone offering effective September 1st, 2018. Multi-factor authentication will continue to be an available feature in Azure AD Premium licenses.

## Supportability

Since most users are accustomed to using only passwords to authenticate, it is important that your organization communicates to all users regarding this process. Awareness can reduce the likelihood that users call your help desk for minor issues related to MFA. However, there are some scenarios where temporarily disabling MFA is necessary. Use the following guidelines to understand how to handle those scenarios:

* Train your support staff to handle scenarios where the user can't sign in because they do not have access to their authentication methods or they are not working correctly.
   * Using conditional access policies for Azure MFA Service, your support staff can add a user to a group that is excluded from a policy requiring MFA.
   * Support staff can enable a temporary one-time bypass for Azure MFA Server users to allow a user to authenticate without two-step verification. The bypass is temporary and expires after a specified number of seconds.   
* Consider using Trusted IPs or named locations as a way to minimize two-step verification prompts. With this feature, administrators of a managed or federated tenant can bypass two-step verification for users that are signing in from a trusted network location such as their organization's intranet.
* Deploy [Azure AD Identity Protection](../active-directory-identityprotection.md) and trigger two-step verification based on risk events.

## Next steps

- Get a step-by-step MFA [deployment plan](https://aka.ms/MFADeploymentPlan)

- Find details about [licensing your users](concept-mfa-licensing.md)

- Get details about [which version to deploy](concept-mfa-whichversion.md)

- Find answers to [Frequently asked questions](multi-factor-authentication-faq.md)
