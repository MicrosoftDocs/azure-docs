---
title: Sign-in experiences with Azure AD Identity Protection| Microsoft Docs
description: Provides an overview of the user experience when Identity Protection has mitigated or remediated a user or when multi-factor authentication is required by a policy.
services: active-directory
keywords: azure active directory identity protection, cloud app discovery, managing applications, security, risk, risk level, vulnerability, security policy
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: daveba

ms.assetid: de5bf637-75a7-4104-b6d8-03686372a319
ms.service: active-directory
ms.subservice: identity-protection
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/15/2018
ms.author: joflore
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# Sign-in experiences with Azure AD Identity Protection
With Azure Active Directory Identity Protection, you can:

* require users to register for multi-factor authentication
* handle risky sign-ins and compromised users

The response of the system to these issues has an impact on a user's sign-in experience because directly signing-in by providing a user name and a password won't be possible anymore. Additional steps are required to get a user safely back into business.

This article gives you an overview of a user's sign-in experience for all cases that can occur.

**Multi-factor authentication**

* Multi-factor authentication registration

**Sign-in at risk**

* Risky sign-in recovery
* Risky sign-in blocked
* Multi-factor authentication registration during a risky sign-in

**User at risk**

* Compromised account recovery
* Compromised account blocked

## Multi-factor authentication registration
The best user experience for both, the compromised account recovery flow and the risky sign-in flow, is when the user can self-recover. If users are registered for multi-factor authentication, they already have a phone number associated with their account that can be used to pass security challenges. No help desk or administrator involvement is needed to recover from account compromise. Thus, it’s highly recommended to get your users registered for multi-factor authentication. 

Administrators can set a policy that requires users to set up their accounts for additional security verification. This policy allows users to skip multi-factor authentication registration for up to 14 days. The 14-day grace period is not configurable.

**The multi-factor authentication registration has three steps:**

1. In the first step, the user gets a notification about the requirement to set the account up for multi-factor authentication. 
   
    ![Remediation](./media/flows/140.png "Remediation")
2. To set up multi-factor authentication, you need to let the system know how you want to be contacted.
   
    ![Remediation](./media/flows/141.png "Remediation")
3. The system submits a challenge to you and you need to respond.
   
    ![Remediation](./media/flows/142.png "Remediation")

## Risky sign-in recovery
When an administrator has configured a policy for sign-in risks, the affected users are notified when they try to sign in. 

**The risky sign-in flow has two steps:** 

1. The user is informed that something unusual was detected about their sign-in, such as signing in from a new location, device, or app. 
   
    ![Remediation](./media/flows/120.png "Remediation")
2. The user is required to prove their identity by solving a security challenge. If the user is registered for multi-factor authentication they need to round trip a security code to their phone number. Since this is just a risky sign in and not a compromised account, the user won’t have to change the password in this flow. 
   
    ![Remediation](./media/flows/121.png "Remediation")

## Risky sign-in blocked
Administrators can also choose to set a Sign-In Risk policy to block users upon sign-in depending on the risk level. To get unblocked, end users must contact an administrator or help desk, or they can try signing in from a familiar location or device. Self-recovering by solving multi-factor authentication is not an option in this case.

![Remediation](./media/flows/200.png "Remediation")

## Compromised account recovery
When a user risk security policy has been configured, users who meet the user risk level specified in the policy (and are therefore assumed compromised) must go through the user compromise recovery flow before they can sign in. 

**The user compromise recovery flow has three steps:**

1. The user is informed that their account security is at risk because of suspicious activity or leaked credentials.
   
    ![Remediation](./media/flows/101.png "Remediation")
2. The user is required to prove their identity by solving a security challenge. If the user is registered for multi-factor authentication they can self-recover from being compromised. They will need to round trip a security code to their phone number. 
   
   ![Remediation](./media/flows/110.png "Remediation")
3. Finally, the user is forced to change their password since someone else may have had access to their account. 
   Screenshots of this experience are below.
   
   ![Remediation](./media/flows/111.png "Remediation")

## Compromised account blocked
To get a user that was blocked by a user risk security policy unblocked, the user must contact an administrator or help desk. Self-recovering by solving multi-factor authentication is not an option in this case.

![Remediation](./media/flows/104.png "Remediation")

## Reset password
If compromised users are blocked from signing in, an administrator can generate a temporary password for them. The users will have to change their password during a next sign-in.

![Remediation](./media/flows/160.png "Remediation")

## See also
* [Azure Active Directory Identity Protection](../active-directory-identityprotection.md) 

