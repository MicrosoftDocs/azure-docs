---
title: 'Azure Active Directory Domain Services: Scoped synchronization | Microsoft Docs'
description: Configure scoped synchronization from Azure AD to your managed domains
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mtillman
editor: curtand

ms.assetid: 9389cf0f-0036-4b17-95da-80838edd2225
ms.service: active-directory
ms.component: domains
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/19/2018
ms.author: maheshu

---
# Configure scoped synchronization from Azure AD to your managed domain
This article shows you how to configure only specific user accounts to be synchronized from your Azure AD directory to your Azure AD Domain Services managed domain.


## Group-based scoped synchronization
This feature allows customers to only sync objects in certain AAD groups to Domain Services. This feature can be turned on by PowerShell only. This feature can be turned on during creation or afterward with a modify request.

## Enable Group-Based Filtered Sync
1. Create service principal with the ID 2565bd9d-da50-47d4-8b85-4c97f669dc36 (online documentation)
2. Select the groups you want to sync. Run the PowerShell Script below and provide the display name of the groups you want synced.

.\ProdAppRoleAssignment.ps1 -groupsToAdd @(“GroupName1”, “GroupName2”)

To enable Filtered Sync during Domain Service Creation

```powershell
// Login to your AAD tenant
Login-AzureRmAccount

// Fill in the highlighted fields
New-AzureRmResource -ResourceId "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.AAD/domainServices/domainServiceName" -Location "West US" -Properties @{"DomainName"="domainServiceName";  "SubnetId"="FullSubnetId"; "FilteredSync"="Enabled"}
To enable Filtered Sync when Domain Service already exists

// Login to your AAD tenant
Login-AzureRmAccount

// Set this to Enabled if you want to Enabled Filtered Sync after creation
$prop = @{"filteredSync" = "Enabled"}

Set-AzureRmResource -Id "FullResourceId" -Properties $prop
```

## Disable group-based scoped synchronization
You can disable group-based scoped synchronization for your managed domain using the following PowerShell script:

```powershell
// Login to your Azure AD tenant
Login-AzureRmAccount

// Disable group-based scoped synchronization.
$disableScopedSync = @{"filteredSync" = "Disabled"}

Set-AzureRmResource -Id "FullResourceId" -Properties $disableScopedSync
```
