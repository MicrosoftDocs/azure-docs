---
title: Help secure on-premises user service accounts  | Azure Active Directory
description: A guide to securing on-premises user accounts.
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

# Help secure on-premises user accounts in Active Directory

On-premises user accounts are the traditional approach to helping secure services that run on Windows. Use these accounts as a last resort when group managed service accounts (gMSAs) and standalone managed service accounts (sMSAs) aren't supported by your service. For information about selecting the best type of account to use, see [Introduction to on-premises service accounts](service-accounts-on-premises.md). 

You might also want to investigate whether you can move your service to use an Azure service account such as a managed identity or a service principal. 

You can create on-premises user accounts to provide a security context for the services and permissions that they require to access local and network resources. On-premises user accounts require manual password management much like any other Active Directory user account. Service and domain administrators are required to observe strong password management processes to help keep these accounts secure.

When you create a user account as a service account, use it for a single service only. Name it in a way that makes it clear that it's a service account and which service it's for. 

## Benefits and challenges

On-premises user accounts can provide significant benefits. They're the most versatile account type for use with services. User accounts used as service accounts can be controlled by all the policies that govern normal user accounts. But you should use them only if you can't use an MSA. Also evaluate whether a computer account is a better option. 

The challenges associated with the use of on-premises user accounts are summarized in the following table:

| Challenge | Mitigation |
| - | - |
| Password management is a manual process that can lead to weaker security and service downtime.| Do either of the following:<li>Ensure that password complexity and password change are governed by a robust process that ensures regular updates with strong password.<li>Coordinate password change with a password update on the service, which will help reduce service downtime. |
| Identifying on-premises user accounts that are acting as service accounts can be difficult. | Do any of the following:<li>Document and maintain records of service accounts deployed in your environment.<li>Track the account name and the resources to which they're assigned access.<li>Consider adding a prefix of "svc_" to all user accounts used as service accounts. |
| | |


## Find on-premises user accounts used as service accounts

On-premises user accounts are just like any other Active Directory user account. Consequently, it can be difficult to find such accounts, because no single attribute of a user account identifies it as a service account. 

We recommend that you create an easily identifiable naming convention for any user account that you use as a service account. For example, you might add "service-" as a prefix and name the service “service-HRDataConnector”.

You can use some of the following indicators to find these service accounts. However, this approach might not find all such accounts.

* Accounts trusted for delegation.  
* Accounts with service principal names.  
* Accounts with passwords set to never expire.

To find the on-premises user accounts you've created for services, you can run the PowerShell commands in the following sections.

### Find accounts trusted for delegation

```PowerShell

Get-ADObject -Filter {(msDS-AllowedToDelegateTo -like '*') -or (UserAccountControl -band 0x0080000) -or (UserAccountControl -band 0x1000000)} -prop samAccountName,msDS-AllowedToDelegateTo,servicePrincipalName,userAccountControl | select DistinguishedName,ObjectClass,samAccountName,servicePrincipalName, @{name='DelegationStatus';expression={if($_.UserAccountControl -band 0x80000){'AllServices'}else{'SpecificServices'}}}, @{name='AllowedProtocols';expression={if($_.UserAccountControl -band 0x1000000){'Any'}else{'Kerberos'}}}, @{name='DestinationServices';expression={$_.'msDS-AllowedToDelegateTo'}}

```

### Find accounts with service principal names

```PowerShell

Get-ADUser -Filter * -Properties servicePrincipalName | where {$_.servicePrincipalName -ne $null}

```

### Find accounts with passwords set to never expire

```PowerShell

Get-ADUser -Filter * -Properties PasswordNeverExpires | where {$_.PasswordNeverExpires -eq $true}

```

You can also audit access to sensitive resources, and archive audit logs to a security information and event management (SIEM) system. By using systems such as Azure Log Analytics or Azure Sentinel, you can search for and analyze and service accounts.

## Assess the security of on-premises user accounts

You can assess the security of your on-premises user accounts that are being used as service accounts by using the following criteria:

* What is the password management policy?  
* Is the account a member of any privileged groups?  
* Does the account have read/write permissions to important resources?

### Mitigate potential security issues

Potential security issues and their mitigations for on-premises user accounts are summarized in the following table:

| Security issue | Mitigation |
| - | - |
| Password management| Do either of the following:<li>Ensure that password complexity and password change are governed by a robust process that includes regular updates and strong password requirements.<li>Coordinate password changes with a password update to minimize service downtime. |
| The account is a member of privileged groups.| Do any of the following:<li>Review group memberships.<li>Remove the account from privileged groups.<li>Grant the account only the rights and permissions it requires to run its service (consult with service vendor). For example, you might be able to deny sign-in locally or deny interactive sign-in. |
| The account has read/write permissions to sensitive resources.| Do any of the following:<li>Audit access to sensitive resources.<li>Archive audit logs to a SIEM (Azure Log Analytics or Azure Sentinel) for analysis.<li>Remediate resource permissions if an undesirable level of access is detected. |
| | |


## Move to more secure account types

Microsoft does not recommend that you use on-premises user accounts as service accounts. For any service that uses this type of account, assess whether it can instead be configured to use a gMSA or an sMSA.

Additionally, evaluate whether the service itself could be moved to Azure so that more secure service account types can be used. 

## Next steps

To learn more about securing service accounts, see the following articles:

* [Introduction to on-premises service accounts](service-accounts-on-premises.md)  
* [Help secure group managed service accounts](service-accounts-group-managed.md)  
* [Help secure standalone managed service accounts](service-accounts-standalone-managed.md)  
* [Help secure computer accounts](service-accounts-computer.md)  
* [Help secure user accounts](service-accounts-user-on-premises.md)  
* [Govern on-premises service accounts](service-accounts-govern-on-premises.md)

 
