---
title: How to configure the multi-factor authentication registration policy in Azure Active Directory Identity Protection | Microsoft Docs
description: Learn how to configure the Azure AD Identity Protection multi-factor authentication registration policy.
services: active-directory
keywords: azure active directory identity protection, cloud app discovery, managing applications, security, risk, risk level, vulnerability, security policy
documentationcenter: ''
author: MarkusVi
manager: mtillman

ms.assetid: e7434eeb-4e98-4b6b-a895-b5598a6cccf1
ms.service: active-directory
ms.component: identity-protection
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/13/2018
ms.author: markvi
ms.reviewer: raluthra

---

# How To: Configure the multi-factor authentication registration policy

Azure AD Identity Protection helps you manage the roll-out of multi-factor authentication (MFA) registration by configuring a policy. This article explains what the policy can be used for an how to configure it.

## What is the multi-factor authentication registration policy?

Azure multi-factor authentication is a method of verifying who you are that requires the use of more than just a username and password. It provides a second layer of security to user sign-ins and transactions.  

We recommend that you require Azure multi-factor authentication for user sign-ins because it:

- Delivers strong authentication with a range of easy verification options

- Plays a key role in preparing your organization to protect and recover from account compromises


For more details, see [What is Azure Multi-Factor Authentication?](../authentication/multi-factor-authentication.md)


## How do I access the MFA registration policy?
   
The MFA registration policy is in the **Configure** section on the [Azure AD Identity Protection page](https://portal.azure.com/#blade/Microsoft_AAD_ProtectionCenter/IdentitySecurityDashboardMenuBlade/SignInPolicy).
   
![MFA policy](./media/howto-mfa-policy/1014.png)




## Policy settings

When you configure the sign-in risk policy, you need to set:

- The users and groups the policy applies to:

    ![Users and groups](./media/howto-mfa-policy/11.png)

- The type of access you want to be enforced:  

    ![Users and groups](./media/howto-mfa-policy/12.png)

- The state of your policy:

    ![Enforce policy](./media/howto-mfa-policy/14.png)


The policy configuration dialog provides you with an option to estimate the impact of your configuration.

![Estimated impact](./media/howto-mfa-policy/15.png)




## User experience


For an overview of the related user experience, see:

* [Multi-factor authentication registration flow](flows.md#multi-factor-authentication-registration).  
* [Sign-in experiences with Azure AD Identity Protection](flows.md).  



## Next steps

To get an overview of Azure AD Identity Protection, see the [Azure AD Identity Protection overview](overview.md).
