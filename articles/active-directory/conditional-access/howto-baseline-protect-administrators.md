---
title: 
description: 

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 05/16/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Protect your privileged administrators

Users with access to privileged accounts have unrestricted access to your environment. Due to the power these accounts have, you should treat them with special care. One common method to improve the protection of privileged accounts is to require a stronger form of account verification when they are used to sign-in. In Azure Active Directory, you can get a stronger account verification by requiring multi-factor authentication (MFA).
Baseline protection is a great way to easily protect your entire tenant. Baseline protection consists of four pre-configured policies, located in the Conditional Access blade in Azure Portal, that will protect all your users with MFA.

Require MFA for admins is a baseline policy that requires MFA every time one of the following privileged administrator roles signs in:

Global administrator
SharePoint administrator
Exchange administrator
Conditional access administrator
Security administrator
Helpdesk administrator / Password administrator
Billing administrator
User administrator

Upon enabling the Require MFA for admins policy, the above nine administrator roles will be required to register for MFA using the Authenticator App. Once MFA registration is complete, administrators will need to perform MFA every single time they sign-in.

## Deployment Considerations

Because Require MFA for admins applies to all critical administrators, several considerations that need to be made to ensure a smooth deployment. These considerations include identifying users and service principles in Azure AD that cannot or should not perform MFA, as well as applications and clients used by your organization that do not support modern authentication.

Legacy Protocols

Legacy authentication protocols (IMAP, SMTP, POP3, etc) are used by mail clients to make authentication requests. These protocols do not support MFA. Majority of account compromises are due to bad actors performing attacks using legacy protocols as a way to bypass MFA.
To ensure that MFA is required when logging into an administrative account and bad actors aren’t able to bypass MFA, this policy blocks all authentication requests made to administrator accounts from legacy protocols.
Before you enable this policy, make sure your users aren’t using legacy authentication protocols. We recommend going through our guide on moving away from legacy authentication and upgrade to modern authentication.

Exclude Users
This baseline policy provides you the option to exclude users. Before enabling the policy for your tenant, we recommend excluding the following accounts:

emergency-access administrative or break-glass accounts to prevent tenant-wide account lockout. In the unlikely scenario all administrators are locked out of your tenant, your emergency-access administrative account can be used to log into the tenant and turn off the policy.
Service accounts and service principles, such as Azure AD Connect Sync Account. Service accounts are non-interactive accounts that are not tied to any particular user. They are normally used by back-end services and allow programmatic access for applications. Service accounts need to be excluded since MFA can’t be completed programmatically.

If you have privileged accounts that are used in your scripts, you should replace them with managed identities for Azure resources or service principals with certificates. As a temporary workaround, you can exclude specific user accounts from the baseline policy.
Users who will not be able to register for MFA using their mobile devices – this policy will require administrators to register for MFA using the Authenticator App
Users without smart mobile phones
Users who cannot use mobile phones during work

Enable Require MFA for admins
Baseline policy: Require MFA for admins comes pre-configured and will show up at the top when you navigate to the Conditional Access blade in Azure portal.
To enable this policy and protect your administrators:
Sign in to the Azure portal as global administrator, security administrator, or conditional access administrator.
In the Azure portal, on the left navigation bar, click Azure Active Directory.

On the Azure Active Directory page, in the Security section, click Conditional access.

Baseline policies will automatically appear at the top. Click on Baseline policy: Require MFA for admins

To enable the policy, click Use policy immediately.
You can test the policy with up to 50 users by clicking on Select users. Under the Include tab, click Select users and then use the Select option to choose which administrators you want this policy to apply to.
Click Save and you’re ready to go.

## Next steps

For more information, see:

* [Conditional access baseline protection policies](concept-basline-protection.md)
* [Five steps to securing your identity infrastructure](../security/azure-ad-secure-steps.md)
* [What is conditional access in Azure Active Directory?](overview.md)
