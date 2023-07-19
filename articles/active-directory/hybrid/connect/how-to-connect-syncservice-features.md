---
title: Azure AD Connect sync service features and configuration
description: Describes service side features for Azure AD Connect sync service.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.assetid: 213aab20-0a61-434a-9545-c4637628da81
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Azure AD Connect sync service features

The synchronization feature of Azure AD Connect has two components:

* The on-premises component named **Azure AD Connect sync**, also called **sync engine**.
* The service residing in Azure AD also known as **Azure AD Connect sync service**

This topic explains how the following features of the **Azure AD Connect sync service** work and how you can configure them using Windows PowerShell.

These settings are configured by the [Azure Active Directory Module for Windows PowerShell](/previous-versions/azure/jj151815(v=azure.100)). Download and install it separately from Azure AD Connect. The cmdlets documented in this topic were introduced in the [2016 March release (build 9031.1)](https://social.technet.microsoft.com/wiki/contents/articles/28552.microsoft-azure-active-directory-powershell-module-version-release-history.aspx#Version_9031_1). If you do not have the cmdlets documented in this topic or they do not produce the same result, then make sure you run the latest version.

To see the configuration in your Azure AD directory, run `Get-MsolDirSyncFeatures`.
![Get-MsolDirSyncFeatures result](./media/how-to-connect-syncservice-features/getmsoldirsyncfeatures.png)

To see the configuration in your Azure AD directory using the Graph Powershell, use the following commands:
```powershell
Connect-MgGraph -Scopes OnPremDirectorySynchronization.Read.All, OnPremDirectorySynchronization.ReadWrite.All

Get-MgDirectoryOnPremisSynchronization | Select-Object -ExpandProperty Features | Format-List
```

The output looks similar to `Get-MsolDirSyncFeatures`:
```powershell
BlockCloudObjectTakeoverThroughHardMatchEnabled  : False
BlockSoftMatchEnabled                            : False
BypassDirSyncOverridesEnabled                    : False
CloudPasswordPolicyForPasswordSyncedUsersEnabled : False
ConcurrentCredentialUpdateEnabled                : False
ConcurrentOrgIdProvisioningEnabled               : False
DeviceWritebackEnabled                           : False
DirectoryExtensionsEnabled                       : True
FopeConflictResolutionEnabled                    : False
GroupWriteBackEnabled                            : False
PasswordSyncEnabled                              : True
PasswordWritebackEnabled                         : False
QuarantineUponProxyAddressesConflictEnabled      : False
QuarantineUponUpnConflictEnabled                 : False
SoftMatchOnUpnEnabled                            : True
SynchronizeUpnForManagedUsersEnabled             : False
UnifiedGroupWritebackEnabled                     : True
UserForcePasswordChangeOnLogonEnabled            : False
UserWritebackEnabled                             : True
AdditionalProperties                             : {}
```

Many of these settings can only be changed by Azure AD Connect.

The following settings can be configured by `Set-MsolDirSyncFeature`:

| DirSyncFeature | Comment |
| --- | --- |
| [EnableSoftMatchOnUpn](#userprincipalname-soft-match) |Allows objects to join on userPrincipalName in addition to primary SMTP address. |
| [SynchronizeUpnForManagedUsers](#synchronize-userprincipalname-updates) |Allows the sync engine to update the userPrincipalName attribute for managed/licensed (non-federated) users. |

After you have enabled a feature, it cannot be disabled again.

> [!NOTE]
> From August 24, 2016 the feature *Duplicate attribute resiliency* is enabled by default for new Azure AD directories. This feature will also be rolled out and enabled on directories created before this date. You will receive an email notification when your directory is about to get this feature enabled.
> 
> 

The following settings are configured by Azure AD Connect and cannot be modified by `Set-MsolDirSyncFeature`:

| DirSyncFeature | Comment |
| --- | --- |
| DeviceWriteback |[Azure AD Connect: Enabling device writeback](how-to-connect-device-writeback.md) |
| DirectoryExtensions |[Azure AD Connect sync: Directory extensions](how-to-connect-sync-feature-directory-extensions.md) |
| [DuplicateProxyAddressResiliency<br/>DuplicateUPNResiliency](#duplicate-attribute-resiliency) |Allows an attribute to be quarantined when it is a duplicate of another object rather than failing the entire object during export. |
| Password Hash Sync |[Implementing password hash synchronization with Azure AD Connect sync](how-to-connect-password-hash-synchronization.md) |
|Pass-through Authentication|[User sign-in with Azure Active Directory Pass-through Authentication](how-to-connect-pta.md)|
| UnifiedGroupWriteback |Group writeback|
| UserWriteback |Not currently supported. |

## Duplicate attribute resiliency

Instead of failing to provision objects with duplicate UPNs / proxyAddresses, the duplicated attribute is “quarantined” and a temporary value is assigned. When the conflict is resolved, the temporary UPN is changed to the proper value automatically. For more details, see [Identity synchronization and duplicate attribute resiliency](how-to-connect-syncservice-duplicate-attribute-resiliency.md).

## UserPrincipalName soft match

When this feature is enabled, soft-match is enabled for UPN in addition to the [primary SMTP address](https://support.microsoft.com/kb/2641663), which is always enabled. Soft-match is used to match existing cloud users in Azure AD with on-premises users.

If you need to match on-premises AD accounts with existing accounts created in the cloud and you are not using Exchange Online, then this feature is useful. In this scenario, you generally don’t have a reason to set the SMTP attribute in the cloud.

This feature is on by default for newly created Azure AD directories. You can see if this feature is enabled for you by running:  

```powershell
## Using the MSOnline module
Get-MsolDirSyncFeatures -Feature EnableSoftMatchOnUpn

## Using the Graph Powershell module
$Config = Get-MgDirectoryOnPremisSynchronization
$Config.Features.SoftMatchOnUpnEnabled
```

If this feature is not enabled for your Azure AD directory, then you can enable it by running:  

```powershell
Set-MsolDirSyncFeature -Feature EnableSoftMatchOnUpn -Enable $true
```

## BlockSoftMatch
When this feature is enabled it will block the Soft Match feature. Customers are encouraged to enable this feature and keep it at enabled until Soft Matching is required again for their tenancy. This flag should be enabled again after any soft matching has completed and is no longer needed.

Example - to block soft matching in your tenant, run this cmdlet:

```
PS C:\> Set-MsolDirSyncFeature -Feature BlockSoftMatch -Enable $True
```

## Synchronize userPrincipalName updates

Historically, updates to the UserPrincipalName attribute using the sync service from on-premises has been blocked, unless both of these conditions were true:

* The user is managed (non-federated).
* The user has not been assigned a license.

> [!NOTE]
> From March 2019, synchronizing UPN changes for federated user accounts is allowed.
> 

Enabling this feature allows the sync engine to update the userPrincipalName when it is changed on-premises and you use password hash sync or pass-through authentication.

This feature is on by default for newly created Azure AD directories. You can see if this feature is enabled for you by running:  

```powershell
## Using the MSOnline module
Get-MsolDirSyncFeatures -Feature SynchronizeUpnForManagedUsers

## Using the Graph Powershell module
$config = Get-MgDirectoryOnPremisSynchronization
$config.Features.SynchronizeUpnForManagedUsersEnabled
```

If this feature is not enabled for your Azure AD directory, then you can enable it by running:  

```powershell
Set-MsolDirSyncFeature -Feature SynchronizeUpnForManagedUsers -Enable $true
```

After enabling this feature, existing userPrincipalName values will remain as-is. On next change of the userPrincipalName attribute on-premises, the normal delta sync on users will update the UPN.  

## See also

* [Azure AD Connect sync](how-to-connect-sync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](../whatis-hybrid-identity.md).
