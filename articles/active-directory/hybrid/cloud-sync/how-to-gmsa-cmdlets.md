---
title: 'Microsoft Entra Connect cloud provisioning agent gMSA PowerShell cmdlets'
description: Learn how to use the Microsoft Entra Connect cloud provisioning agent gMSA powershell cmdlets.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/11/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Microsoft Entra Connect cloud provisioning agent gMSA PowerShell cmdlets

The purpose of this document is to describe the Microsoft Entra Connect cloud provisioning agent gMSA PowerShell cmdlets. These cmdlets allow you to have more granularity on the permissions that are applied on the service account (gMSA). By default, Microsoft Entra Connect cloud sync applies all permissions similar to Microsoft Entra Connect on the default gMSA or a custom gMSA, during cloud provisioning agent install.

This document will cover the following cmdlets:

`Set-AADCloudSyncPermissions`

`Set-AADCloudSyncRestrictedPermissions`

## How to use the cmdlets:

The following prerequisites are required to use these cmdlets.

1. Install provisioning agent.

2. Import Provisioning Agent PS module into a PowerShell session.

   ```powershell
   Import-Module "C:\Program Files\Microsoft Azure AD Connect Provisioning Agent\Microsoft.CloudSync.Powershell.dll"
   ```

3. These cmdlets require a parameter called `Credential` which can be passed, or will prompt the user if not provided in the command line. Depending on the cmdlet syntax used, these credentials must be an enterprise admin account or, at a minimum, a domain administrator of the target domain where you're setting the permissions. 

4. To create a variable for credentials, use:

   `$credential = Get-Credential`
   
5. To set Active Directory permissions for cloud provisioning agent, you can use the following cmdlet. This will grant permissions in the root of the domain allowing the service account to manage on-premises Active Directory objects. See [Using Set-AADCloudSyncPermissions](#using-set-aadcloudsyncpermissions) below for examples on setting the permissions.

   `Set-AADCloudSyncPermissions -EACredential $credential`

6. To restrict Active Directory permissions set by default on the cloud provisioning agent account, you can use the following cmdlet. This will increase the security of the service account by disabling permission inheritance and removing all existing permissions, except SELF and Full Control for administrators. See [Using Set-AADCloudSyncRestrictedPermission](#using-set-aadcloudsyncrestrictedpermissions) below for examples on restricting the permissions.

   `Set-AADCloudSyncRestrictedPermission -Credential $credential`

## Using Set-AADCloudSyncPermissions

`Set-AADCloudSyncPermissions` supports the following permission types which are identical to the permissions used by Azure AD Connect Classic Sync (ADSync). The following permission types are supported:

|Permission type|Description|
|-----|-----|
|BasicRead| See [BasicRead](../connect/how-to-connect-configure-ad-ds-connector-account.md#configure-basic-read-only-permissions) permissions for Microsoft Entra Connect|
|PasswordHashSync|See [PasswordHashSync](../connect/how-to-connect-configure-ad-ds-connector-account.md#permissions-for-password-hash-synchronization) permissions for Microsoft Entra Connect|
|PasswordWriteBack|See [PasswordWriteBack](../connect/how-to-connect-configure-ad-ds-connector-account.md#permissions-for-password-writeback) permissions for Microsoft Entra Connect|
|HybridExchangePermissions|See [HybridExchangePermissions](../connect/how-to-connect-configure-ad-ds-connector-account.md#permissions-for-exchange-hybrid-deployment) permissions for Microsoft Entra Connect|
|ExchangeMailPublicFolderPermissions| See [ExchangeMailPublicFolderPermissions](../connect/how-to-connect-configure-ad-ds-connector-account.md#permissions-for-exchange-mail-public-folders) permissions for Microsoft Entra Connect|
|CloudHR| Applies 'Create/delete User objects' on 'This object and all descendant objects'|
|All| Applies all the above permissions|

You can use AADCloudSyncPermissions in one of two ways:
- [Grant permissions to all configured domains](#grant-permissions-to-all-configured-domains)
- [Grant permissions to a specific domain](#grant-permissions-to-a-specific-domain)

## Grant permissions to all configured domains

Granting certain permissions to all configured domains will require the use of an enterprise admin account.

```powershell
$credential = Get-Credential
Set-AADCloudSyncPermissions -PermissionType "Any mentioned above" -EACredential $credential 
```

## Grant permissions to a specific domain

Granting certain permissions to a specific domain will require the use of a TargetDomainCredential that is enterprise admin or, domain admin of the target domain. The TargetDomain has to be already configured through wizard.

```powershell
$credential = Get-Credential
Set-AADCloudSyncPermissions -PermissionType "Any mentioned above" -TargetDomain "FQDN of domain" -TargetDomainCredential $credential
```

## Using Set-AADCloudSyncRestrictedPermissions
For increased security, `Set-AADCloudSyncRestrictedPermissions` will tighten the permissions set on the cloud provisioning agent account itself. Hardening permissions on the cloud provisioning agent account involves the following changes: 

- Disable inheritance
- Remove all default permissions, except ACEs specific to SELF.
- Set Full Control permissions for SYSTEM, Administrators, Domain Admins, and Enterprise Admins.
- Set Read permissions for Authenticated Users and Enterprise Domain Controllers.
 
  The -Credential parameter is necessary to specify the Administrator account that has the necessary privileges to restrict Active Directory permissions on the cloud provisioning agent account. This is typically the domain or enterprise administrator.  
 
For Example: 

``` powershell
$credential = Get-Credential 
Set-AADCloudSyncRestrictedPermissions -Credential $credential  
```
