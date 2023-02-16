---
title: Secure user-based service accounts in Active Directory
description: Learn how to locate, assess, and mitigate security issues for user-based service accounts
services: active-directory
author: jricketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 02/09/2023
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Secure user-based service accounts in Active Directory

On-premises user accounts were the traditional approach to help secure services running on Windows. Today, use these accounts if group managed service accounts (gMSAs) and standalone managed service accounts (sMSAs) aren't supported by your service. For information about the account type to use, see [Securing on-premises service accounts](service-accounts-on-premises.md). 

You can investigate moving your service an Azure service account, such as a managed identity or a service principal. 

Learn more:

* [What are managed identities for Azure resources?](../managed-identities-azure-resources/overview.md)
* [Securing service principals in Azure Active Directory](service-accounts-principal.md)

You can create on-premises user accounts to provide security for services and permissions the accounts use to access local and network resources. On-premises user accounts require manual password management, like other Active Directory (AD) user accounts. Service and domain administrators are required to maintain strong password management processes to help keep accounts secure.

When you create a user account as a service account, use it for one service. Use a naming convention that clarifies it's a service account, and the service it's related to. 

## Benefits and challenges

On-premises user accounts are a versatile account type. User accounts used as service accounts are controlled by policies governing user accounts. Use them if you can't use an MSA. Evaluate whether a computer account is a better option. 

The challenges of on-premises user accounts are summarized in the following table:

| Challenge | Mitigation |
| - | - |
| Password management is manual and leads to weaker security and service downtime| - Ensure regular password complexity and that changes are governed by a process that maintains strong passwords</br> - Coordinate password changes with a service password, which helps reduce service downtime|
| Identifying on-premises user accounts that are service accounts can be difficult | - Document service accounts deployed in your environment</br> - Track the account name and the resources they can access</br> - Consider adding the prefix svc to user accounts used as service accounts |

## Find on-premises user accounts used as service accounts

On-premises user accounts are like other AD user accounts. It can be difficult to find the accounts, because no user account attribute identifies it as a service account. We recommend you create a naming convention for user accounts uses as service accounts. For example, add the prefix svc to a service name: svc-HRDataConnector.

Use some of the following criteria to find service accounts. However, this approach might not find accounts:

* Trusted for delegation 
* With service principal names 
* With passwords that never expire

To find the on-premises user accounts used for services, run the following PowerShell commands:

To find accounts trusted for delegation:

```PowerShell

Get-ADObject -Filter {(msDS-AllowedToDelegateTo -like '*') -or (UserAccountControl -band 0x0080000) -or (UserAccountControl -band 0x1000000)} -prop samAccountName,msDS-AllowedToDelegateTo,servicePrincipalName,userAccountControl | select DistinguishedName,ObjectClass,samAccountName,servicePrincipalName, @{name='DelegationStatus';expression={if($_.UserAccountControl -band 0x80000){'AllServices'}else{'SpecificServices'}}}, @{name='AllowedProtocols';expression={if($_.UserAccountControl -band 0x1000000){'Any'}else{'Kerberos'}}}, @{name='DestinationServices';expression={$_.'msDS-AllowedToDelegateTo'}}

```

To find accounts with service principal names:

```PowerShell

Get-ADUser -Filter * -Properties servicePrincipalName | where {$_.servicePrincipalName -ne $null}

```

To find accounts with passwords that never expire:

```PowerShell

Get-ADUser -Filter * -Properties PasswordNeverExpires | where {$_.PasswordNeverExpires -eq $true}

```

You can audit access to sensitive resources, and archive audit logs to a security information and event management (SIEM) system. By using Azure Log Analytics or Microsoft Sentinel, you can search for and analyze service accounts.

## Assess on-premises user account security

Use the following criteria to assess the security of on-premises user accounts used as service accounts:

* Password management policy
* Accounts with membership in privileged groups
* Read/write permissions for important resources

### Mitigate potential security issues

See the following table for potential on-premises user account security issues and their mitigations:

| Security issue | Mitigation |
| - | - |
| Password management| - Ensure password complexity and password change are governed by regular updates and strong password requirements</br> - Coordinate password changes with a password update to minimize service downtime |
| The account is a member of privileged groups| - Review group membership</br> - Remove the account from privileged groups</br> - Grant the account rights and permissions to run its service (consult with service vendor)</br> - For example, deny sign-in locally or interactive sign-in|
| The account has read/write permissions to sensitive resources| - Audit access to sensitive resources</br> - Archive audit logs to a SIEM: Azure Log Analytics or Microsoft Sentinel</br> - Remediate resource permissions if you detect undesirable access levels |

## Secure account types

Microsoft doesn't recommend use of on-premises user accounts as service accounts. For services that use this account type, assess if it can be configured to use a gMSA or an sMSA. In addition, evaluate if you can move the service to Azure to enable use of safer account types. 

## Next steps

To learn more about securing service accounts:

* [Securing on-premises service accounts](service-accounts-on-premises.md)  
* [Secure group managed service accounts](service-accounts-group-managed.md)  
* [Secure standalone managed service accounts](service-accounts-standalone-managed.md)  
* [Secure on-premises computer accounts with AD](service-accounts-computer.md)  
* [Govern on-premises service accounts](service-accounts-govern-on-premises.md)
