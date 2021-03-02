---
title: Securing user-based service accounts  | Azure Active Directory
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

# Securing user-based service accounts in Active Directory

On-premises user accounts are the traditional approach for securing services running on Windows. Use these accounts as a last resort when global managed service accounts (gMSAs) and standalone managed service accounts (sMSAs) are not supported by your service. See overview of on-premises service accounts for information on selecting the best type of account to use. Also investigate if you can move your service to use an Azure service account like a managed identity or a service principle. 

On-premises user accounts can be created to provide a security context for services and granted privileges required for the services to access local and network resources. They require manual password management much like any other Active Directory (AD) user account. Service and domain administrators are required to observe strong password management processes to keep these accounts secure.

When using a user account as a service account, use it for a single service only. Name it in a way that makes it clear that it is a service account and for which service. 

## Benefits and challenges

Benefits

On-premises user accounts are the most versatile account type for use with services. User accounts used as service accounts can be controlled by all the policies govern normal user accounts. That said, use them only if you can't use an MSA. Also evaluate if a computer account is a better option. 

Challenges with on-premises user accounts

The following challenges are associated with the use of on-premises user accounts.

| Challenges| Mitigations |
| - | - |
| Password management is a manual process that may lead to weaker security and service downtime.| Ensure that password complexity and password change are governed by a robust process that ensures regular updates with strong password. <br> Coordinate password change with a password update on the service, which will result in service downtime. |
| Identifying on-premises user accounts that are acting as service accounts can be difficult.| Document and maintain records of service accounts deployed in your environment. <br> Track the account name and the resources to which they're assigned access. <br> Consider adding a prefix of svc_ to all user accounts used as service accounts. |


## Find on-premises user accounts used as service accounts

On-premises user accounts are just like any other AD user account. Consequently, it can be difficult to find these accounts as there's no single attribute of a user account that identifies it as a service account. 

We recommend that you create an easily identifiable naming convention for any user account used as a service account.

For example, add "service-" as a prefix, and name the service: “service-HRDataConnector”.

You can use some of the indicators below to find these service accounts, however, this may not find all such accounts.

* Accounts trusted for delegation.

* Accounts with service principal names.

* Accounts whose password is set to never expire.

You can run the following PowerShell commands to find the on-premises user accounts created for services.

### Find accounts trusted for delegation

```PowerShell

Get-ADObject -Filter {(msDS-AllowedToDelegateTo -like '*') -or (UserAccountControl -band 0x0080000) -or (UserAccountControl -band 0x1000000)} -prop samAccountName,msDS-AllowedToDelegateTo,servicePrincipalName,userAccountControl | select DistinguishedName,ObjectClass,samAccountName,servicePrincipalName, @{name='DelegationStatus';expression={if($_.UserAccountControl -band 0x80000){'AllServices'}else{'SpecificServices'}}}, @{name='AllowedProtocols';expression={if($_.UserAccountControl -band 0x1000000){'Any'}else{'Kerberos'}}}, @{name='DestinationServices';expression={$_.'msDS-AllowedToDelegateTo'}}

```

### Find accounts with service principle names

```PowerShell

Get-ADUser -Filter * -Properties servicePrincipalName | where {$_.servicePrincipalName -ne $null}

```

 

### Find accounts with passwords set to never expire

```PowerShell

Get-ADUser -Filter * -Properties PasswordNeverExpires | where {$_.PasswordNeverExpires -eq $true}

```


You can also audit access to sensitive resources, and archive audit logs to a security information and event management (SIEM) system. Using systems such as Azure Log Analytics or Azure Sentinel, you can search for and analyze and service accounts.

## Assess security of on-premises user accounts

Assess the security of your on-premises user accounts being used as service accounts using the following criteria:

* What is the password management policy?

* Is the account a member of any privileged groups?

* Does the account have read/write access to important resources?

### Mitigate potential security issues

The following table shows potential security issues and corresponding mitigations for on-premises user accounts.

| Security issues| Mitigations |
| - | - |
| Password management|* Ensure that password complexity and password change are governed by a robust process that ensures regular updates with strong password requirements. <br> * Coordinate password change with a password update to minimize service downtime. |
| Account is a member of privileged groups.| Review group memberships. Remove the account from privileged groups. Grant the account only the rights and permissions it requires to run its service (consult with service vendor). For example, you may be able to deny sign-in locally or deny interactive sign-in. |
| Account has read/write access to sensitive resources.| Audit access to sensitive resources. Archive audit logs to a SIEM (Azure Log Analytics or Azure Sentinel) for analysis. Remediate resource permissions if an undesirable level of access is detected. |


## Move to more secure account types

Microsoft does not recommend that customers use on-premises user accounts as service accounts. For any service using this type of account, assess if it can instead be configured to use a gMSA or a sMSA.

Additionally, evaluate if the service itself could be moved to Azure so that more secure service account types can be used. 

## Next steps
See the following articles on securing service accounts

* [Introduction to on-premises service accounts](service-accounts-on-premises.md)

* [Secure group managed service accounts](service-accounts-group-managed.md)

* [Secure standalone managed service accounts](service-accounts-standalone-managed.md)

* [Secure computer accounts](service-accounts-computer.md)

* [Secure user accounts](service-accounts-user-on-premises.md)

* [Govern on-premises service accounts](service-accounts-govern-on-premises.md)

 
