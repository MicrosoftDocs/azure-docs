---
title: Azure AD Connect sync service features and configuration | Microsoft Docs
description: Describes service side features for Azure AD Connect sync service.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''
ms.assetid: 213aab20-0a61-434a-9545-c4637628da81
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/25/2018
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Azure AD Connect sync service features

The synchronization feature of Azure AD Connect has two components:

* The on-premises component named **Azure AD Connect sync**, also called **sync engine**.
* The service residing in Azure AD also known as **Azure AD Connect sync service**

This topic explains how the following features of the **Azure AD Connect sync service** work and how you can configure them using Windows PowerShell.

These settings are configured by the [Azure Active Directory Module for Windows PowerShell](https://aka.ms/aadposh). Download and install it separately from Azure AD Connect. The cmdlets documented in this topic were introduced in the [2016 March release (build 9031.1)](https://social.technet.microsoft.com/wiki/contents/articles/28552.microsoft-azure-active-directory-powershell-module-version-release-history.aspx#Version_9031_1). If you do not have the cmdlets documented in this topic or they do not produce the same result, then make sure you run the latest version.

To see the configuration in your Azure AD directory, run `Get-MsolDirSyncFeatures`.  
![Get-MsolDirSyncFeatures result](./media/how-to-connect-syncservice-features/getmsoldirsyncfeatures.png)

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
| UnifiedGroupWriteback |[Preview: Group writeback](how-to-connect-preview.md#group-writeback) |
| UserWriteback |Not currently supported. |

## Duplicate attribute resiliency

Instead of failing to provision objects with duplicate UPNs / proxyAddresses, the duplicated attribute is “quarantined” and a temporary value is assigned. When the conflict is resolved, the temporary UPN is changed to the proper value automatically. For more details, see [Identity synchronization and duplicate attribute resiliency](how-to-connect-syncservice-duplicate-attribute-resiliency.md).

## UserPrincipalName soft match

When this feature is enabled, soft-match is enabled for UPN in addition to the [primary SMTP address](https://support.microsoft.com/kb/2641663), which is always enabled. Soft-match is used to match existing cloud users in Azure AD with on-premises users.

If you need to match on-premises AD accounts with existing accounts created in the cloud and you are not using Exchange Online, then this feature is useful. In this scenario, you generally don’t have a reason to set the SMTP attribute in the cloud.

This feature is on by default for newly created Azure AD directories. You can see if this feature is enabled for you by running:  

```powershell
Get-MsolDirSyncFeatures -Feature EnableSoftMatchOnUpn
```

If this feature is not enabled for your Azure AD directory, then you can enable it by running:  

```powershell
Set-MsolDirSyncFeature -Feature EnableSoftMatchOnUpn -Enable $true
```

## Synchronize userPrincipalName updates

Historically, updates to the UserPrincipalName attribute using the sync service from on-premises has been blocked, unless both of these conditions are true:

* The user is managed (non-federated).
* The user has not been assigned a license.

For more details, see [User names in Office 365, Azure, or Intune don't match the on-premises UPN or alternate login ID](https://support.microsoft.com/kb/2523192).

Enabling this feature allows the sync engine to update the userPrincipalName when it is changed on-premises and you use password hash sync or pass-through authentication. If you use federation, this feature is not supported.

This feature is on by default for newly created Azure AD directories. You can see if this feature is enabled for you by running:  

```powershell
Get-MsolDirSyncFeatures -Feature SynchronizeUpnForManagedUsers
```

If this feature is not enabled for your Azure AD directory, then you can enable it by running:  

```powershell
Set-MsolDirSyncFeature -Feature SynchronizeUpnForManagedUsers -Enable $true
```

After enabling this feature, existing userPrincipalName values will remain as-is. On next change of the userPrincipalName attribute on-premises, the normal delta sync on users will update the UPN.  

## See also

* [Azure AD Connect sync](how-to-connect-sync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
