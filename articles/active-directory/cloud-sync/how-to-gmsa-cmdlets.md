---
title: 'Azure AD Connect cloud provisioning agent gMSA PowerShell cmdlets'
description: Learn how to use the Azure AD Connect cloud provisioning agent gMSA powershell cmdlets.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 11/16/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Azure AD Connect cloud provisioning agent gMSA PowerShell cmdlets

The purpose of this document is to describe the Azure AD Connect cloud provisioning agent gMSA PowerShell cmdlets. These cmdlets allow you to have more granularity on the permissions that are applied on the service account (gmsa). By default, Azure AD Connect cloud sync applies all permissions similar to Azure AD Connect on the default gmsa or a custom gmsa. 

This document will cover the following cmdlets:  

`Set-AADCloudSyncRestrictedPermissions`

`Set-AADCloudSyncPermissions` 

## How to use the cmdlets:  

The following prerequisites are required to use these cmdlets.

1. Install provisioning agent. 
2. Import Provisioning Agent PS module into a PowerShell session. 

 ```PowerShell
 Import-Module "C:\Program Files\Microsoft Azure AD Connect Provisioning Agent\Microsoft.CloudSync.Powershell.dll"  
 ```
3. Remove existing permissions.  To remove all existing permissions on the service account, except SELF use: `Set-AADCloudSyncRestrictedPermission`.  

    This cmdlet requires a parameter called `Credential` which can be passed, or it will prompt if called without it.

    To create a variable use  

   `$credential = Get-Credential` 

   This will prompt the user to enter username and password. The credentials must be at a minimum domain administrator(of the domain where agent is installed), could be enterprise admin as well. 

4.  Then you can call the cmdlet to remove extra permissions: 
   ```PowerShell
   Set-AADCloudSyncRestrictedPermissions -Credential $credential 
   ```
5. Or you could simply call 

   `Set-AADCloudSyncRestrictedPermissions` which will prompt for credentials. 

 6.  Add specific permission type.  Permissions added are same as Azure AD Connect.  See [Using Set-AADCloudSyncPermissions](#using-set-aadcloudsyncpermissions) below for examples on setting the permissions.

## Using Set-AADCloudSyncPermissions 
`Set-AADCloudSyncPermissions` supports the following permission types which are identical to the permissions used by Azure AD Connect. The following permission types are supported: 

|Permission type|Description|
|-----|-----|
|BasicRead| See [BasicRead](../../active-directory/hybrid/how-to-connect-configure-ad-ds-connector-account.md#configure-basic-read-only-permissions) permissions for Azure AD Connect|
|PasswordHashSync|See [PasswordHashSync](../../active-directory/hybrid/how-to-connect-configure-ad-ds-connector-account.md#permissions-for-password-hash-synchronization) permissions for Azure AD Connect|
|PasswordWriteBack|See [PasswordWriteBack](../../active-directory/hybrid/how-to-connect-configure-ad-ds-connector-account.md#permissions-for-password-writeback) permissions for Azure AD Connect|
|HybridExchangePermissions|See [HybridExchangePermissions](../../active-directory/hybrid/how-to-connect-configure-ad-ds-connector-account.md#permissions-for-exchange-hybrid-deployment) permissions for Azure AD Connect| 
|ExchangeMailPublicFolderPermissions| See [ExchangeMailPublicFolderPermissions](../../active-directory/hybrid/how-to-connect-configure-ad-ds-connector-account.md#permissions-for-exchange-mail-public-folders-preview) permissions for Azure AD Connect| 
|CloudHR| Applies 'Full control' on 'Descendant User objects' and 'Create/delete User objects' on 'This object and all descendant objects'| 
|All|adds all the above permissions.| 



You can use AADCloudSyncPermissions in one of two ways:
- [Grant a certain permission to all configured domains](#grant-a-certain-permission-to-all-configured-domains) 
- [Grant a certain permission to a specific domain](#grant-a-certain-permission-to-a-specific-domain) 
## Grant a certain permission to all configured domains 
Granting certain permissions to all configured domains will require the use of an enterprise admin account.


 ```PowerShell
Set-AADCloudSyncPermissions -PermissionType “Any mentioned above” -EACredential $credential (prepopulated same as above [$credential = Get-Credential]) 
```

## Grant a certain permission to a specific domain 
Granting certain permissions to a specific domain will require the use of, at minimum a domain admin account of the domain you are attempting to add.


 ```PowerShell
Set-AADCloidSyncPermissions -PermissionType “Any mentioned above” -TargetDomain “FQDN of domain” (has to be already configured through wizard) -TargetDomaincredential $credential(same as above) 
```
 

Note: for 1. The credentials must be at a minimum Enterprise admin. 

For 2. The Credentials can be either Domain admin or enterprise admin. 

  

