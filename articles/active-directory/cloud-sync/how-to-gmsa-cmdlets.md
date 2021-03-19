---
title: 'Azure AD Connect cloud sync agent gMSA PowerShell cmdlets'
description: Learn how to use the Azure AD Connect cloud sync agent gMSA powershell cmdlets.
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

# Azure AD Connect cloud sync agent gMSA PowerShell cmdlets

The purpose of this document is to describe the Azure AD Connect cloud sync agent gMSA PowerShell cmdlets. These cmdlets allow you to have more granularity on the permissions that are applied on the service account (gMSA). By default, Azure AD Connect cloud sync applies all permissions similar to Azure AD Connect on the default gMSA or a custom gMSA. 

This document will cover the following cmdlets:

`Set-AADCloudSyncRestrictedPermissions`

`Set-AADCloudSyncPermissions` 

## Using cloud sync agent PS module

The following prerequisites are required to use these cmdlets.

1. Install cloud sync agent.

2. Import cloud sync agent PS module into a PowerShell session with elevated privileges (Run as Administrator)

    ```PowerShell
    Import-Module "C:\Program Files\Microsoft Azure AD Connect Provisioning Agent\Microsoft.CloudSync.Powershell.dll"
    ```
3. These cmdlets requires credentials to be passed as a parameter. To create a variable for the credentials use:

   `$credential = Get-Credential` 

   This will prompt the user to enter username and password.


## Using Set-AADCloudSyncRestrictedPermission 

To remove all existing permissions on the gMSA service account, except SELF use: `Set-AADCloudSyncRestrictedPermission`. 

The credentials must be at a minimum domain administrator (of the domain where agent is installed), or it can be enterprise admin as well. 

Remove existing permissions on the gMSA service account:

```PowerShell
Set-AADCloudSyncRestrictedPermissions -Credential $credential 
```
Note: Or you could simply call `Set-AADCloudSyncRestrictedPermissions` which will prompt for credentials.



## Using Set-AADCloudSyncPermissions 
Set permissions on domain(s). Permissions for gMSA account are added on the root of the Active Directory domain. See [Permission Types](#permission-types) below for a list of supported permissions.

You can use AADCloudSyncPermissions in one of two ways:
- [Grant a certain permission to all configured domains](#grant-a-certain-permission-to-all-configured-domains) 
- [Grant a certain permission to a specific domain](#grant-a-certain-permission-to-a-specific-domain) 

### Grant a certain permission to all configured domains 
Granting certain permissions to all configured domains will require the use of an enterprise admin account.

 ```PowerShell
Set-AADCloudSyncPermissions -PermissionType "permission type mentioned above" -EACredential $credential
```
Note: Credentials must be at a minimum enterprise admin and must be passed as a parameter [$credential = Get-Credential]

### Grant a certain permission to a specific domain 
Granting certain permissions to a specific domain will require the use of, at minimum a domain admin account of the domain you are attempting to configure.

 ```PowerShell
Set-AADCloudSyncPermissions -PermissionType "permission type mentioned above" -TargetDomain "FQDN of domain" -TargetDomaincredential $credential
```
Note: Credentials can be either domain admin or enterprise admin and must be passed as a parameter [$credential = Get-Credential]. TargetDomain has to be already configured through the installation wizard.


### Permission Types
`Set-AADCloudSyncPermissions` supports the following permission types which are identical to the permissions used by Azure AD Connect. The following permission types are supported: 

|Permission type|Description|
|-----|-----|
|BasicRead| See [BasicRead](../../active-directory/hybrid/how-to-connect-configure-ad-ds-connector-account.md#configure-basic-read-only-permissions) permissions for Azure AD Connect|
|PasswordHashSync|See [PasswordHashSync](../../active-directory/hybrid/how-to-connect-configure-ad-ds-connector-account.md#permissions-for-password-hash-synchronization) permissions for Azure AD Connect|
|PasswordWriteBack|See [PasswordWriteBack](../../active-directory/hybrid/how-to-connect-configure-ad-ds-connector-account.md#permissions-for-password-writeback) permissions for Azure AD Connect|
|HybridExchangePermissions|See [HybridExchangePermissions](../../active-directory/hybrid/how-to-connect-configure-ad-ds-connector-account.md#permissions-for-exchange-hybrid-deployment) permissions for Azure AD Connect| 
|ExchangeMailPublicFolderPermissions| See [ExchangeMailPublicFolderPermissions](../../active-directory/hybrid/how-to-connect-configure-ad-ds-connector-account.md#permissions-for-exchange-mail-public-folders-preview) permissions for Azure AD Connect| 
|CloudHR|Applies 'Full control' on 'Descendant User objects' and 'Create/delete User objects' on 'This object and all descendant objects'| 
|All|Adds all the above permissions.| 


