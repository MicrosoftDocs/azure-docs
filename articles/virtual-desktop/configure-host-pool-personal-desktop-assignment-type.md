---
title: Windows Virtual Desktop personal desktop assignment type - Azure
description: How to configure the assignment type for a Windows Virtual Desktop personal desktop host pool.
services: virtual-desktop
author: HeidiLohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 12/10/2019
ms.author: helohr
manager: lizross
---
# Configure the personal desktop host pool assignment type

You can configure the assignment type of your personal desktop host pool to adjust your Windows Virtual Desktop environment to better suit your needs. In this topic, we'll show you how to configure automatic or direct assignment for your users.

>[!NOTE]
> The instructions in this article only apply to personal desktop host pools, not pooled host pools, since users in pooled host pools aren't assigned to specific session hosts.

## Configure automatic assignment

Automatic assignment is the default assignment type for new personal desktop host pools created in your Windows Virtual Desktop environment. Automatically assigning users doesn't require a specific session host.

To automatically assign users, first assign them to the personal desktop host pool so that they can see the desktop in their feed. When an assigned user launches the desktop in their feed, they will claim an available session host if they have not already connected to the host pool, which completes the assignment process.

Before you start, [download and import the Windows Virtual Desktop PowerShell module](/powershell/windows-virtual-desktop/overview/) if you haven't already. 

> [!NOTE]
> Make sure you've installed Windows Virtual Desktop PowerShell module version 1.0.1534.2001 or later before following these instructions.

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

## Next steps

Now that you've configured the personal desktop assignment type, you can sign in to a Windows Virtual Desktop client to test it as part of a user session. These next two How-tos will tell you how to connect to a session using the client of your choice:

- [Connect with the Windows Desktop client](connect-windows-7-and-10.md)
- [Connect with the web client](connect-web.md)
