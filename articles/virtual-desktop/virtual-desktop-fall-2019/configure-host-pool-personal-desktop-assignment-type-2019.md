---
title: Azure Virtual Desktop (classic) personal desktop assignment type - Azure
description: How to configure the assignment type for an Azure Virtual Desktop (classic) personal desktop host pool.
author: Heidilohr
ms.topic: how-to
ms.date: 05/22/2020
ms.author: helohr
manager: femila
---
# Configure the personal desktop host pool assignment type for Azure Virtual Desktop (classic)

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../configure-host-pool-personal-desktop-assignment-type.md).

You can configure the assignment type of your personal desktop host pool to adjust your Azure Virtual Desktop environment to better suit your needs. In this topic, we'll show you how to configure automatic or direct assignment for your users.

>[!NOTE]
> The instructions in this article only apply to personal desktop host pools, not pooled host pools, since users in pooled host pools aren't assigned to specific session hosts.

## Configure automatic assignment

Automatic assignment is the default assignment type for new personal desktop host pools created in your Azure Virtual Desktop environment. Automatically assigning users doesn't require a specific session host.

To automatically assign users, first assign them to the personal desktop host pool so that they can see the desktop in their feed. When an assigned user launches the desktop in their feed, they will claim an available session host if they have not already connected to the host pool, which completes the assignment process.

Before you start, [download and import the Azure Virtual Desktop PowerShell module](/powershell/windows-virtual-desktop/overview/) if you haven't already.

> [!NOTE]
> Make sure you've installed Azure Virtual Desktop PowerShell module version 1.0.1534.2001 or later before following these instructions.

After that, run the following cmdlet to sign in to your account:

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
```

To configure a host pool to automatically assign users to VMs, run the following PowerShell cmdlet:

```powershell
Set-RdsHostPool <tenantname> <hostpoolname> -AssignmentType Automatic
```

To assign a user to the personal desktop host pool, run the following PowerShell cmdlet:

```powershell
Add-RdsAppGroupUser <tenantname> <hostpoolname> "Desktop Application Group" -UserPrincipalName <userupn>
```

## Configure direct assignment

Unlike automatic assignment, when you use direct assignment, you must assign the user to both the personal desktop host pool and a specific session host before they can connect to their personal desktop. If the user is only assigned to a host pool without a session host assignment, they won't be able to access resources.

To configure a host pool to require direct assignment of users to session hosts, run the following PowerShell cmdlet:

```powershell
Set-RdsHostPool <tenantname> <hostpoolname> -AssignmentType Direct
```

To assign a user to the personal desktop host pool, run the following PowerShell cmdlet:

```powershell
Add-RdsAppGroupUser <tenantname> <hostpoolname> "Desktop Application Group" -UserPrincipalName <userupn>
```

To assign a user to a specific session host, run the following PowerShell cmdlet:

```powershell
Set-RdsSessionHost <tenantname> <hostpoolname> -Name <sessionhostname> -AssignedUser <userupn>
```

## Remove a user assignment

You may want to remove a user assignment because the user no longer needs the personal desktop, the user has left the company, or you want to reuse the desktop for someone else.

Currently, the only way you can remove the user assignment for a personal desktop is to fully remove the session host. To remove the session host, run this cmdlet:

```powershell
Remove-RdsSessionHost
```

If you need to add the session host back into the personal desktop host pool, uninstall Azure Virtual Desktop on that machine, then follow the steps in [Create a host pool with PowerShell](create-host-pools-powershell-2019.md) to re-register the session host.

## Next steps

Now that you've configured the personal desktop assignment type, you can sign in to an Azure Virtual Desktop client to test it as part of a user session. These next two How-tos will tell you how to connect to a session using the client of your choice:

- [Connect with the Windows Desktop client](connect-windows-2019.md)
- [Connect with the web client](connect-web-2019.md)
