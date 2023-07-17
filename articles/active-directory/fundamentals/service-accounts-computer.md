---
title: Secure on-premises computer accounts with Active Directory
description: A guide to help secure on-premises computer accounts, or LocalSystem accounts, with Active Directory
services: active-directory
author: jricketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 02/03/2023
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Secure on-premises computer accounts with Active Directory

A computer account, or LocalSystem account, is highly privileged with access to almost all resources on the local computer. The account isn't associated with signed-on user accounts. Services run as LocalSystem access network resources by presenting the computer credentials to remote servers in the format `<domain_name>\\<computer_name>$`. The computer account predefined name is `NT AUTHORITY\SYSTEM`. You can start a service and provide security context for that service.

   ![Screenshot of a list of local services on a computer account.](./media/govern-service-accounts/secure-computer-accounts-image-1.png)

## Benefits of using a computer account

A computer account has the following benefits:

* **Unrestricted local access** - the computer account provides complete access to the machine's local resources
* **Automatic password management** - removes the need for manually changed passwords. The account is a member of Active Directory, and its password is changed automatically. With a computer account, there's no need to register the service principal name.
* **Limited access rights off-machine** - the default access-control list in Active Directory Domain Services (AD DS) permits minimal access to computer accounts. During access by an unauthorized user, the service has limited access to network resources.

## Computer account security-posture assessment

Use the following table to review potential computer-account issues and mitigations.
 
| Computer-account issue | Mitigation |
| - | - |
| Computer accounts are subject to deletion and re-creation when the computer leaves and rejoins the domain. | Confirm the requirement to add a computer to an Active Directory group. To verify computer accounts added to a group, use the scripts in the following section.| 
| If you add a computer account to a group, services that run as LocalSystem on that computer get group access rights.| Be selective about computer-account group memberships. Don't make a computer account a member of a domain administrator group. The associated service has complete access to AD DS. |
| Inaccurate network defaults for LocalSystem. | Don't assume the computer account has the default limited access to network resources. Instead, confirm group memberships for the account. |
| Unknown services that run as LocalSystem. | Ensure services that run under the LocalSystem account are Microsoft services, or trusted services. |

## Find services and computer accounts

To find services that run under the computer account, use the following PowerShell cmdlet:

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

## Computer account recommendations

> [!IMPORTANT]
> Computer accounts are highly privileged, therefore use them if your service requires unrestricted access to local resources, on the machine, and you can't use a managed service account (MSA).

* Confirm the service owner's service runs with an MSA
* Use a group managed service account (gMSA), or a standalone managed service account (sMSA), if your service supports it
* Use a domain user account with the permissions needed to run the service

## Next steps 

To learn more about securing service accounts, see the following articles:

* [Securing on-premises service accounts](service-accounts-on-premises.md)
* [Secure group managed service accounts](service-accounts-group-managed.md)
* [Secure standalone managed service accounts](service-accounts-standalone-managed.md)
* [Secure user-based service accounts in Active Directory](service-accounts-user-on-premises.md)  
* [Govern on-premises service accounts](service-accounts-govern-on-premises.md)
