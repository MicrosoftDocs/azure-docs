---
title: Customize feed for Windows Virtual Desktop users
description: How to customize feed for Windows Virtual Desktop users with PowerShell cmdlets.
services: virtual-desktop
author: v-hevem

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 05/30/2019
ms.author: v-hevem
---
# Customize Feed for Windows Virtual Desktop users

First, [download and import the Windows Virtual Desktop PowerShell module](https://docs.microsoft.com/powershell/windows-virtual-desktop/overview) to use in your PowerShell session if you haven't already.

## Customize the display name for a RemoteApp

The default FriendlyName for a RemoteApp is the same as the Name. Configuring this change would allow users to easily identify a specific application.

To retrieve the RemoteApp, run the following PowerShell cmdlet:

```powershell
Get-RdsRemoteApp -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName <appgroupname>
```
![A screenshot of PowerShell cmdlet Get-RDSRemoteApp with Name and FriendlyName highlighted.](media/get-rdsremoteapp.png)

To assign a friendly name to a RemoteApp, run the following PowerShell cmdlet:

```powershell
Set-RdsRemoteApp -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName <appgroupname> -Name <existingappname> -FriendlyName <newfriendlyname>
```
![A screenshot of PowerShell cmdlet Set-RDSRemoteApp with Name and New FriendlyName highlighted.](media/set-rdsremoteapp.png)

## Customize the display name for a Remote Desktop

The default FriendlyName for a RemoteDesktop is the same as the Name. Configuring this change would allow users to easily identify a specific desktop.

To retrieve the RemoteDesktop, run the following PowerShell cmdlet:

```powershell
Get-RdsRemoteDesktop -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName <appgroupname>
```
![A screenshot of PowerShell cmdlet Get-RDSRemoteApp with Name and FriendlyName highlighted.](media/get-rdsremotedesktop.png)

To assign a friendly name to a RemoteDesktop, run the following PowerShell cmdlet:

```powershell
Set-RdsRemoteDesktop -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName <appgroupname> -FriendlyName <newfriendlyname>
```
![A screenshot of PowerShell cmdlet Set-RDSRemoteApp with Name and New FriendlyName highlighted.](media/set-rdsremotedesktop.png)
