---
title: Secure standalone managed service accounts
description: Learn when to use, how to assess, and to secure standalone managed service accounts (sMSAs)
services: active-directory
author: jricketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 02/08/2023
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Secure standalone managed service accounts

Standalone managed service accounts (sMSAs) are managed domain accounts that help secure services running on a server. They can't be reused across multiple servers. sMSAs have automatic password management, simplified service principal name (SPN) management, and delegated management to administrators. 

In Active Directory (AD), sMSAs are tied to a server that runs a service. You can find accounts in the Active Directory Users and Computers snap-in in Microsoft Management Console.

   ![Screenshot of a service name and type under Active Directory Users and Computers.](./media/govern-service-accounts/secure-standalone-msa-image-1.png)

> [!NOTE]
> Managed service accounts were introduced in Windows Server 2008 R2 Active Directory Schema, and they require Windows Server 2008 R2, or a later version. 

## sMSA benefits

sMSAs have greater security than user accounts used as service accounts. They help reduce administrative overhead:

* Set strong passwords - sMSAs use 240 byte, randomly generated complex passwords
  * The complexity minimizes the likelihood of compromise by brute force or dictionary attacks
* Cycle passwords regularly - Windows changes the sMSA password every 30 days. 
  * Service and domain administrators don’t need to schedule password changes or manage the associated downtime
* Simplify SPN management - SPNs are updated if the domain functional level is Windows Server 2008 R2. The SPN is updated when you:
  * Rename the host computer account
  * Change the host computer domain name server (DNS) name
  * Use PowerShell to add or remove other sam-accountname or dns-hostname parameters
  * See, [Set-ADServiceAccount](/powershell/module/activedirectory/set-adserviceaccount)

## Using sMSAs

Use sMSAs to simplify management and security tasks. sMSAs are useful when services are deployed to a server and you can't use a group managed service account (gMSA). 

> [!NOTE] 
> You can use sMSAs for more than one service, but it's recommended that each service has an identity for auditing. 

If the software creator can’t tell you if the application uses an MSA, test the application. Create a test environment and ensure it accesses required resources. 

Learn more: [Managed Service Accounts: Understanding, Implementing, Best Practices, and Troubleshooting](/archive/blogs/askds/managed-service-accounts-understanding-implementing-best-practices-and-troubleshooting)

### Assess sMSA security posture

Consider the sMSA scope of access as part of the security posture. To mitigate potential security issues, see the following table:

| Security issue| Mitigation |
| - | - |
| sMSA is a member of privileged groups | - Remove the sMSA from elevated privileged groups, such as Domain Admins</br> - Use the least-privileged model </br> - Grant the sMSA rights and permissions to run its services</br> - If you're unsure about permissions, consult the service creator|
| sMSA has read/write access to sensitive resources | - Audit access to sensitive resources</br> - Archive audit logs to a security information and event management (SIEM) program, such as Azure Log Analytics or Microsoft Sentinel </br> - Remediate resource permissions if an undesirable access is detected |
| By default, the sMSA password rollover frequency is 30 days | Use group policy to tune the duration, depending on enterprise security requirements. To set the password expiration duration, go to:<br>Computer Configuration>Policies>Windows Settings>Security Settings>Security Options. For domain member, use **Maximum machine account password age**. |

### sMSA challenges
  
Use the following table to associate challenges with mitigations.

| Challenge| Mitigation |
| - | - |
| sMSAs are on a single server | Use a gMSA to use the account across servers |
| sMSAs can't be used across domains | Use a gMSA to use the account across domains |
| Not all applications support sMSAs| Use a gMSA, if possible. Otherwise, use a standard user account or a computer account, as recommended by the creator|

## Find sMSAs

On a domain controller, run DSA.msc, and then expand the managed service accounts container to view all sMSAs. 

To return all sMSAs and gMSAs in the Active Directory domain, run the following PowerShell command: 

`Get-ADServiceAccount -Filter *`

To return sMSAs in the Active Directory domain, run the following command:

`Get-ADServiceAccount -Filter * | where { $_.objectClass -eq "msDS-ManagedServiceAccount" }`

## Manage sMSAs

To manage your sMSAs, you can use the following AD PowerShell cmdlets:

`Get-ADServiceAccount`
`Install-ADServiceAccount`
`New-ADServiceAccount`
`Remove-ADServiceAccount`
`Set-ADServiceAccount`
`Test-ADServiceAccount`
`Uninstall-ADServiceAccount`

## Move to sMSAs

If an application service supports sMSAs, but not gMSAs, and you're using a user account or computer account for the security context, see</br>
[Managed Service Accounts: Understanding, Implementing, Best Practices, and Troubleshooting](/archive/blogs/askds/managed-service-accounts-understanding-implementing-best-practices-and-troubleshooting).

If possible, move resources to Azure and use Azure managed identities, or service principals.

## Next steps

To learn more about securing service accounts, see:

* [Securing on-premises service accounts](service-accounts-on-premises.md)  
* [Secure group managed service accounts](service-accounts-group-managed.md)  
* [Secure on-premises computer accounts with AD](service-accounts-computer.md)  
* [Secure user-based service accounts in AD](service-accounts-user-on-premises.md)  
* [Govern on-premises service accounts](service-accounts-govern-on-premises.md)
