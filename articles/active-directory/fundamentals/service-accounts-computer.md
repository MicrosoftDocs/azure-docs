---
title: Secure computer accounts | Azure Active Directory
description: A guide to helping secure on-premises computer accounts.
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

# Secure on-premises computer accounts

A computer account, or LocalSystem account, is a built-in, highly privileged account with access to virtually all resources on the local computer. The account is not associated with any signed-on user account. Services run as LocalSystem access network resources by presenting the computer's credentials to remote servers in the format <domain_name>\\<computer_name>$. The computer account's predefined name is NT AUTHORITY\SYSTEM. You can use it to start a service and provide security context for that service.

![Screenshot of a list of local services on a computer account.](.\media\securing-service-accounts\secure-computer-accounts-image-1.png)

## Benefits of using a computer account

A computer account provides the following benefits:

* **Unrestricted local access**: The computer account provides complete access to the machine’s local resources.

* **Automatic password management**: Removes the need for you to manually change passwords. The account is a member of Active Directory, and the account password is changed automatically. Using a computer account eliminates the need to register the service principal name for the service.

* **Limited access rights off-machine**: The default access-control list in Active Directory Domain Services (AD DS) permits minimal access to computer accounts. In the event of access by an unauthorized user, the service would have only limited access to resources on your network.

## Assess the security posture of computer accounts

Some potential challenges and associated mitigations when you use a computer account are listed in the following table:
 
| Issue | Mitigation |
| - | - |
| Computer accounts are subject to deletion and re-creation when the computer leaves and rejoins the domain. | Validate the need to add a computer to an Active Directory group, and verify which computer account has been added to a group by using the example scripts in the next section of this article.| 
| If you add a computer account to a group, all services that run as LocalSystem on that computer are given the access rights of the group.| Be selective about the group memberships of your computer account. Avoid making a computer account a member of any domain administrator groups, because the associated service has complete access to AD DS. |
| Improper network defaults for LocalSystem. | Do not assume that the computer account has the default limited access to network resources. Instead, check group memberships for the account carefully. |
| Unknown services that run as LocalSystem. | Ensure that all services that run under the LocalSystem account are Microsoft services or trusted services from third parties. |
| | |

## Find services that run under the computer account

To find services that run under the LocalSystem context, use the following PowerShell cmdlet:

```powershell
Get-WmiObject win32_service | select Name, StartName | Where-Object {($_.StartName -eq "LocalSystem")}
```

To find computer accounts that are members of a specific group, run the following PowerShell cmdlet:

```powershell
Get-ADComputer -Filter {Name -Like "*"} -Properties MemberOf | Where-Object {[STRING]$_.MemberOf -like "Your_Group_Name_here*"} | Select Name, MemberOf
```

To find computer accounts that are members of identity administrators groups (domain administrators, enterprise administrators, and administrators), run the following PowerShell cmdlet:

```powershell
Get-ADGroupMember -Identity Administrators -Recursive | Where objectClass -eq "computer"
```

## Move from computer accounts

> [!IMPORTANT]
> Computer accounts are highly privileged accounts and should be used only when your service needs unrestricted access to local resources on the machine and you can't use a managed service account (MSA).

* Check with your service owner to see whether their service can be run by using an MSA, and use a group managed service account (gMSA) or a standalone managed service account (sMSA) if your service supports it.

* Use a domain user account with only the permissions that you need to run your service.

## Next steps 

To learn more about securing service accounts, see the following articles:

* [Introduction to on-premises service accounts](service-accounts-on-premises.md)
* [Secure group managed service accounts](service-accounts-group-managed.md)
* [Secure standalone managed service accounts](service-accounts-standalone-managed.md)
* [Secure user accounts](service-accounts-user-on-premises.md)  
* [Govern on-premises service accounts](service-accounts-govern-on-premises.md)
