---
title: Troubleshoot account lockout in Azure AD Domain Services | Microsoft Docs
description: Learn how to troubleshoot common problems that cause user accounts to be locked out in Azure Active Directory Domain Services.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: troubleshooting
ms.date: 08/13/2019
ms.author: iainfou

#Customer intent: As a directory administrator, I want to troubleshoot why user accounts are locked out in an Azure Active Directory Domain Services managed domain.
---

# Troubleshoot account lockout problems with an Azure AD Domain Services managed domain




## What is account lockout?

A user account in Azure AD DS is locked out when a defined threshold for unsuccessful sign-in attempts has been met. This account lockout behavior is designed to protect you from repeated brute-force sign-in attempts that may indicate an automated digital attack.

By default, if there are 5 bad password attempts in 2 minutes, the account is locked out for 30 minutes.

If you have a specific set of requirements, you can override these default account lockout thresholds. However, it's not recommended to increase the threshold limits to reduce the number account lockouts. Troubleshoot the source of the account lockout behavior first.

The default account lockout threshold are configured using fine-grained password policy.

### Fine-grained password policy

Fine-grained password policies (FGPPs) let you apply specific restrictions for password and account lockout policies to different users in a domain. FGPP only affects users created in Azure AD DS. Cloud users and domain users synchronized into the Azure AD DS managed domain from Azure AD aren't affected by the password policies.

Policies are distributed through group association in the Azure AD DS managed domain, and any changes you make are applied at the next user sign-in. Changing the policy doesn't unlock a user account that's already locked out.

For more information on fine-grained password policies, see [Configure password and account lockout policies][configure-fgpp].

## Common account lockout reasons

* You locked yourself out – did you forget your password?
* There is something that has your old password and is constantly trying to log in using the old password.
* You changed your password and the new password hasn’t sync’d in and you lock yourself out by trying the new password.

## Enable security audits for Azure AD DS

[Enable security audits (currently in preview)[security-audit-events]. The first two sample queries show you how to review *Account Lockout Events*.

## Next steps

<!-- INTERNAL LINKS -->
[configure-fgpp]: password-policy.md
[security-audit-events]: security-audit-events.md
