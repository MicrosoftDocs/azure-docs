---
title: Delete Azure Virtual Desktop (classic) - Azure
description: How to clean up Azure Virtual Desktop (classic) when it is no longer used.
author: jensheerin
ms.topic: how-to
ms.date: 11/22/2021
ms.author: jensheerin
manager: annathan
---

# Delete Azure Virtual Desktop (classic)
This article describes how to delete Azure Virtual Desktop (classic).

> [!WARNING]
> When you delete resources as described in this article, these actions are irreversible.


## Requirements

Before you begin, make sure you have the following things ready:

- A global administrator account within the Azure Active Directory tenant

- [Download and import the Azure Virtual Desktop module](/powershell/windows-virtual-desktop/overview/) to use in your PowerShell session if you haven't already

## Delete Azure Virtual Desktop (classic)
1. Sign into Azure Virtual Desktop (classic) in your PowerShell window:

    ```powershell
    Add-RdsAccount -DeploymentUrl https://rdbroker.wvd.microsoft.com
    ```

2. Sign in to Azure Resource Manager:

    ```powershell
    Login-AzAccount
    ```

3. If you have multiple subscriptions, select the one you want to delete your resources to with this cmdlet:

    ```powershell
    Select-AzSubscription -Subscriptionid <subID>
    ```

4. Run get commands for locating RDS resources
    ```Get
    Get-RDSTenant
    Get-RDSHostPool -TenantName <tenantname>
    Get-RDSSessionHost -TenantName <tenantname> -HostPoolName <hostpoolname>
    Get-RDSAppGroup -TenantName <tenantname> -HostPoolName <hostpoolname>
    Get-RDSRemoteApp -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName <appgroupname>
    ```

5.  The next steps remove the classic version of Azure Virtual Desktop.
    ```Remove
    Remove-RDSRemoteApp -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName <appgroupname> -name 'name'
    Remove-RDSAppGroup -TenantName <tenantname> -HostPoolName <hostpoolname> -Name <appgroupname>
    Remove-RDSSessionHost -TenantName <tenantname> -HostPoolName <hostpoolname> -Name <sessionhostname>
    Remove-RDSHostPool -TenantName <tenantname> -Name <hostpoolname>
    Remove-RDSTenant -Name <tenantname>
    ```