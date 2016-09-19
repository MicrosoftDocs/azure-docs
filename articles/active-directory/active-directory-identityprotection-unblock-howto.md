<properties
	pageTitle="Azure Active Directory Identity Protection | Microsoft Azure"
	description="Learn how Azure AD Identity Protection enables you to limit the ability of an attacker to exploit a compromised identity or device and to secure an identity or a device that was previously suspected or known to be compromised."
	services="active-directory"
	keywords="azure active directory identity protection, cloud app discovery, managing applications, security, risk, risk level, vulnerability, security policy"
	documentationCenter=""
	authors="markusvi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/15/2016"
	ms.author="markvi"/>

#Azure Active Directory Identity Protection - How to unblock users

With Azure Active Directory Identity Protection, you can configure policies to block users if the configured conditions are satisfied. Typically, a blocked user contacts help desk to become unblocked. This topics explains the steps you can perform to unblock a blocked user.


## Determine the blocking reason

As a first step to unblock a user, you need to determine the type of policy that has blocked the user because your next steps are depending on it. 
With Azure Active Directory Identity Protection, a user can be either blocked by a sign-in risk policy or a user risk policy. 

You can get the type of policy that has blocked a user from the heading in the dialog that was presented to the user during a sign-in attempt:

|Policy | User dialog|
|--- | --- |
|Sign-in risk | ![Blocked sign-in](./media/active-directory-identityprotection-unblock-howto/02.png) |
|User risk | ![Blocked account](./media/active-directory-identityprotection-unblock-howto/104.png) |


A user is blocked by:

- A sign-in risk policy is also known as suspicious sign-in
- A user risk policy is also known as an account at risk

 
## Unblocking suspicious sign-ins

To unblock a suspicious sign-in, you have the following options:

1. **Sign-in from a familiar location or device** - A common reason for blocked suspicious sign-ins are sign-in attempts from unfamiliar locations or devices. Your users can quickly determine whether this is the blocking reason by trying to sign-in from a familiar location or device.


2. **Reset password** - You can reset the user's password in form of a temporary password you need to exchange with your user. See [manual secure password reset](active-directory-identityprotection.md#manual-secure-password-reset) for more details.


3. **Exclude from policy** - If you think that the current configuration of your sign-in policy is causing issues for specific users, you can exclude the users from it. See [sign-in risk policy](active-directory-identityprotection.md#sign-in-risk-policy) for more details.
 
4. **Disable policy** - If you think that your policy configuration is causing issues for all your users, you can disable the policy. See [sign-in risk policy](active-directory-identityprotection.md#sign-in-risk-policy) for more details.


## Unblocking accounts at risk

To unblock an account at risk, you have the following options:

1. **Reset password** - You can reset the user's password. See [manual secure password reset](active-directory-identityprotection.md#manual-secure-password-reset) for more details.

2. **Resolve all risk events** - The user risk policy blocks a user if the configured user risk level for blocking access has been reached. You can reduce a user's risk level by manually closing reported risk events. For more details, see [Closing risk events manually](active-directory-identityprotection.md#closing-risk-events-manually).

3. **Exclude from policy** - If you think that the current configuration of your sign-in policy is causing issues for specific users, you can exclude the users from it. See [user risk policy](active-directory-identityprotection.md#user-risk-policy) for more details.
 
4. **Disable policy** - If you think that your policy configuration is causing issues for all your users, you can disable the policy. [user risk policy](active-directory-identityprotection.md#user-risk-policy) for more details.




## See also

 - [Channel 9: Azure AD and Identity Show: Identity Protection Preview](https://channel9.msdn.com/Series/Azure-AD-Identity/Azure-AD-and-Identity-Show-Identity-Protection-Preview)
 - [Enabling Azure Active Directory Identity Protection](active-directory-identityprotection-enable.md)
 - [Types of risk events detected by Azure Active Directory Identity Protection](active-directory-identityprotection-risk-events-types.md)
 - [Vulnerabilities detected by Azure Active Directory Identity Protection](active-directory-identityprotection-vulnerabilities.md)
 - [Azure Active Directory Identity Protection notifications](active-directory-identityprotection-notifications.md)
 - [Azure Active Directory Identity Protection flows](active-directory-identityprotection-flows.md)
 - [Azure Active Directory Identity Protection playbook](active-directory-identityprotection-playbook.md)
 - [Azure Active Directory Identity Protection glossary](active-directory-identityprotection-glossary.md)
 - [Get started with Azure Active Directory Identity Protection and Microsoft Graph](active-directory-identityprotection-graph-getting-started.md)


