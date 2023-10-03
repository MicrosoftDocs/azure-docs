---
title: Troubleshoot account lockout in Microsoft Entra Domain Services | Microsoft Docs
description: Learn how to troubleshoot common problems that cause user accounts to be locked out in Microsoft Entra Domain Services.
services: active-directory-ds
author: justinha
manager: amycolannino

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/21/2023
ms.author: justinha

#Customer intent: As a directory administrator, I want to troubleshoot why user accounts are locked out in a Microsoft Entra Domain Services managed domain.
---

# Troubleshoot account lockout problems with a Microsoft Entra Domain Services managed domain

To prevent repeated malicious sign-in attempts, a Microsoft Entra Domain Services managed domain locks accounts after a defined threshold. This account lockout can also happen by accident without a sign-in attack incident. For example, if a user repeatedly enters the wrong password or a service attempts to use an old password, the account gets locked out.

This troubleshooting article outlines why account lockouts happen and how you can configure the behavior, and how to review security audits to troubleshoot lockout events.

## What is an account lockout?

A user account in a Domain Services managed domain is locked out when a defined threshold for unsuccessful sign-in attempts has been met. This account lockout behavior is designed to protect you from repeated brute-force sign-in attempts that may indicate an automated digital attack.

**By default, if there are 5 bad password attempts in 2 minutes, the account is locked out for 30 minutes.**

The default account lockout thresholds are configured using fine-grained password policy. If you have a specific set of requirements, you can override these default account lockout thresholds. However, it's not recommended to increase the threshold limits to try to reduce the number account lockouts. Troubleshoot the source of the account lockout behavior first.

### Fine-grained password policy

Fine-grained password policies (FGPPs) let you apply specific restrictions for password and account lockout policies to different users in a domain. FGPP only affects users within a managed domain. Cloud users and domain users synchronized into the managed domain from Microsoft Entra ID are only affected by the password policies within the managed domain. Their accounts in Microsoft Entra ID or an on-premises directory aren't impacted.

Policies are distributed through group association in the managed domain, and any changes you make are applied at the next user sign-in. Changing the policy doesn't unlock a user account that's already locked out.

For more information on fine-grained password policies, and the differences between users created directly in Domain Services versus synchronized in from Microsoft Entra ID, see [Configure password and account lockout policies][configure-fgpp].

## Common account lockout reasons

The most common reasons for an account to be locked out, without any malicious intent or factors, include the following scenarios:

* **The user locked themselves out.**
    * After a recent password change, has the user continued to use a previous password? The default account lockout policy of five failed attempts in 2 minutes can be caused by the user inadvertently retrying an old password.
* **There's an application or service that has an old password.**
    * If an account is used by applications or services, those resources may repeatedly try to sign in using an old password. This behavior causes the account to be locked out.
    * Try to minimize account use across multiple different applications or services, and record where credentials are used. If an account password is changed, update the associated applications or services accordingly.
* **Password has been changed in a different environment and the new password hasn't synchronized yet.**
    * If an account password is changed outside of the managed domain, such as in an on-prem AD DS environment, it can take a few minutes for the password change to synchronize through Microsoft Entra ID and into the managed domain.
    * A user that tries to sign in to a resource in the managed domain before that password synchronization process has completed causes their account to be locked out.

## Troubleshoot account lockouts with security audits

To troubleshoot when account lockout events occur and where they're coming from, [enable security audits for Domain Services][security-audit-events]. Audit events are only captured from the time you enable the feature. Ideally, you should enable security audits *before* there's an account lockout issue to troubleshoot. If a user account repeatedly has lockout issues, you can enable security audits ready for the next time the situation occurs.

Once you have enabled security audits, the following sample queries show you how to review *Account Lockout Events*, code *4740*.

View all the account lockout events for the last seven days:

```Kusto
AADDomainServicesAccountManagement
| where TimeGenerated >= ago(7d)
| where OperationName has "4740"
```

View all the account lockout events for the last seven days for the account named *driley*.

```Kusto
AADDomainServicesAccountLogon
| where TimeGenerated >= ago(7d)
| where OperationName has "4740"
| where "driley" == tolower(extract("Logon Account:\t(.+[0-9A-Za-z])",1,tostring(ResultDescription)))
```

View all the account lockout events between June 26, 2020 at 9 a.m. and July 1, 2020 midnight, sorted ascending by the date and time:

```Kusto
AADDomainServicesAccountManagement
| where TimeGenerated >= datetime(2020-06-26 09:00) and TimeGenerated <= datetime(2020-07-01)
| where OperationName has "4740"
| sort by TimeGenerated asc
```

You may find on 4776 and 4740 event details of "Source Workstation: " empty. This is because the bad password happened over Network logon via some other devices.

For example, a RADIUS server can forward the authentication to Domain Services. 


03/04 19:07:29 [LOGON] [10752] contoso: SamLogon: Transitive Network logon of contoso\Nagappan.Veerappan from  (via LOB11-RADIUS) Entered 

03/04 19:07:29 [LOGON] [10752] contoso: SamLogon: Transitive Network logon of contoso\Nagappan.Veerappan from  (via LOB11-RADIUS) Returns 0xC000006A

03/04 19:07:35 [LOGON] [10753] contoso: SamLogon: Transitive Network logon of contoso\Nagappan.Veerappan from  (via LOB11-RADIUS) Entered 

03/04 19:07:35 [LOGON] [10753] contoso: SamLogon: Transitive Network logon of contoso\Nagappan.Veerappan from  (via LOB11-RADIUS) Returns 0xC000006A


Enable RDP to your DCs in NSG to backend to configure diagnostics capture (netlogon). For more information about requirements, see
[Inbound security rules](alert-nsg.md#inbound-security-rules).

If you have modified the default NSG already, follow [Port 3389 - management using remote desktop](network-considerations.md#port-3389---management-using-remote-desktop).

To enable Netlogon log on any server, follow [Enabling debug logging for the Netlogon service](/troubleshoot/windows-client/windows-security/enable-debug-logging-netlogon-service).

## Next steps

For more information on fine-grained password policies to adjust account lockout thresholds, see [Configure password and account lockout policies][configure-fgpp].

If you still have problems joining your VM to the managed domain, [find help and open a support ticket for Microsoft Entra ID][azure-ad-support].

<!-- INTERNAL LINKS -->
[configure-fgpp]: password-policy.md
[security-audit-events]: security-audit-events.md
[azure-ad-support]: /azure/active-directory/fundamentals/how-to-get-support
