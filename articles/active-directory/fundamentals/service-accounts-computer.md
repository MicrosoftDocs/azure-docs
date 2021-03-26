---
title: Securing computer accounts | Azure Active Directory
description: A guide to securing on-premises computer accounts.
services: active-directory
author: BarbaraSelden
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 2/15/2021
ms.author: baselden
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Securing computer accounts

The computer account, or LocalSystem account, is a built-in, highly privileged account with access to virtually all resources on the local computer. This account is not associated with any signed-on user account. Services running as LocalSystem access network resources by presenting the computer's credentials to remote servers. It presents credentials in the form <domain_name>\<computer_name>$. A computer account’s pre-defined name is NT AUTHORITY\SYSTEM. It can be used to start a service and provide security context for that service.

![[Picture 4](.\media\securing-service-accounts\secure-computer-accounts-image-1.png)](.\media\securing-service-accounts\secure-computer-accounts-image-1.png)

## Benefits of using the computer account

The computer account provides the following benefits.

* **Unrestricted local access**: The computer account provides complete access to the machine’s local resources.

* **Automatic password management**: The computer account removes the need for you to manually change passwords. Instead, this account is a member of Active Directory and the account password is changed automatically. It also eliminates the need to register the service principal name for the service.

* **Limited access rights off-machine**: The default Access Control List (ACL) in Active Directory Domain Services permits minimal access for computer accounts. If this service were to be hacked, it would only have limited access to resources on your network.

## Assess security posture of computer accounts

Potential challenges and associated mitigations when using computer accounts. 

| Issues| Mitigations |
| - | - |
| Computer accounts are subject to deletion and recreation when the computer leaves and rejoins the domain.| Validate the need to add a computer to an AD group and verify which computer account has been added to a group using the example scripts provided on this page.| 
| If you add a computer account to a group, all services running as LocalSystem on that computer are given access rights of the group.| Be selective of the group memberships of your computer account. Avoid making computer accounts members of any domain administrator groups because the associated service has complete access to Active Directory Domain Services. |
| Improper network defaults for LocalSystem| Do not assume that the computer account has the default limited access to network resources. Instead, check group memberships for this account carefully. |
| Unknown services running as LocalSystem| Ensure that all services running under the LocalSystem account are Microsoft services or trusted services from third parties. |


## Find services running under the computer account

Use the following PowerShell cmdlet to find services running under LocalSystem context

```powershell

Get-WmiObject win32_service | select Name, StartName | Where-Object {($_.StartName -eq "LocalSystem")}
```

**Find Computers accounts that are members of a specific group**

Use the following PowerShell cmdlet to find computer accounts that are member of a specific group.

```powershell

```Get-ADComputer -Filter {Name -Like "*"} -Properties MemberOf | Where-Object {[STRING]$_.MemberOf -like "Your_Group_Name_here*"} | Select Name, MemberOf
```

**Find Computers accounts that are members of privileged groups**

Use the following PowerShell cmdlet to find computer accounts that are member of Identity Administrators groups (Domain Admins, Enterprise Admins, Administrators)

```powershell
Get-ADGroupMember -Identity Administrators -Recursive | Where objectClass -eq "computer"
```
## Move from computer accounts

> [!IMPORTANT]
> Computer accounts are highly privileged accounts and should  be used only when your service needs unrestricted access to local resources on the machine, and you cannot use a managed service account (MSA).

* Check with your service owner if their service can be run using an MSA, and use a group managed service account (gMSA) or a standalone managed service account (sMSA) if your service supports it.

* Use a domain user account with just the privileges needed to run your service.

## Next Steps 

See the following articles on securing service accounts

* [Introduction to on-premises service accounts](service-accounts-on-premises.md)

* [Secure group managed service accounts](service-accounts-group-managed.md)

* [Secure standalone managed service accounts](service-accounts-standalone-managed.md)

* [Secure computer accounts](service-accounts-computer.md)

* [Secure user accounts](service-accounts-user-on-premises.md)

* [Govern on-premises service accounts](service-accounts-govern-on-premises.md)

 

 
