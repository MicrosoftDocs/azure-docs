---
title: How to configure the multi-factor authentication registration policy | Microsoft Docs
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

* Delivers strong authentication with a range of easy verification options
* Plays a key role in preparing your organization to protect and recover from account compromises

![User risk policy](./media/howto-mfa-policy/1019.png "User risk policy")

For more details, see [What is Azure Multi-Factor Authentication?](../authentication/multi-factor-authentication.md)

## Configuration

**To open the related configuration dialog**:

- On the **Azure AD Identity Protection** blade, in the **Configure** section, click **Multi-factor authentication registration**.

    ![MFA policy](./media/howto-mfa-policy/1019.png "MFA policy")

### Settings

* Set the users and groups the policy applies to:

    ![MFA policy](./media/howto-mfa-policy/1020.png "MFA policy")
* Set the controls to be enforced when the policy triggers::  

    ![MFA policy](./media/howto-mfa-policy/1021.png "MFA policy")
* Switch the state of your policy:

    ![MFA policy](./media/howto-mfa-policy/403.png "MFA policy")
* View the current registration status:

    ![MFA policy](./media/howto-mfa-policy/1022.png "MFA policy")

For an overview of the related user experience, see:

* [Multi-factor authentication registration flow](flows.md#multi-factor-authentication-registration).  
* [Sign-in experiences with Azure AD Identity Protection](flows.md).  



## Next steps

To get an overview of Azure AD Identity Protection, see the [Azure AD Identity Protection overview](overview).
