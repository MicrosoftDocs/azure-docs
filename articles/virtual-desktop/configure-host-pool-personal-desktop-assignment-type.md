---
title: Windows Virtual Desktop personal desktop assignment type - Azure
description: How to configure automatic or direct assignment for a Windows Virtual Desktop personal desktop host pool.
author: Heidilohr
ms.topic: how-to
ms.date: 07/09/2020
ms.author: helohr
manager: lizross
---
# Configure the personal desktop host pool assignment type

>[!IMPORTANT]
>This content applies to Windows Virtual Desktop with Azure Resource Manager Windows Virtual Desktop objects. If you're using Windows Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/configure-host-pool-personal-desktop-assignment-type-2019.md).

You can configure the assignment type of your personal desktop host pool to adjust your Windows Virtual Desktop environment to better suit your needs. In this topic, we'll show you how to configure automatic or direct assignment for your users.

>[!NOTE]
> The instructions in this article only apply to personal desktop host pools, not pooled host pools, since users in pooled host pools aren't assigned to specific session hosts.

## Prerequisites

This article assumes you've already downloaded and installed the Windows Virtual Desktop PowerShell module. If you haven't, follow the instructions in [Set up the PowerShell module](powershell-module.md).

## Configure automatic assignment

Automatic assignment is the default assignment type for new personal desktop host pools created in your Windows Virtual Desktop environment. Automatically assigning users doesn't require a specific session host.

To automatically assign users, first assign them to the personal desktop host pool so that they can see the desktop in their feed. When an assigned user launches the desktop in their feed, they will claim an available session host if they have not already connected to the host pool, which completes the assignment process.

To configure a host pool to automatically assign users to VMs, run the following PowerShell cmdlet:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -PersonalDesktopAssignmentType Automatic
```

To assign a user to the personal desktop host pool, run the following PowerShell cmdlet:

```powershell
New-AzRoleAssignment -SignInName <userupn> -RoleDefinitionName "Desktop Virtualization User" -ResourceName <appgroupname> -ResourceGroupName <resourcegroupname> -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups'
```

## Configure direct assignment

Unlike automatic assignment, when you use direct assignment, you must assign the user to both the personal desktop host pool and a specific session host before they can connect to their personal desktop. If the user is only assigned to a host pool without a session host assignment, they won't be able to access resources.

To configure a host pool to require direct assignment of users to session hosts, run the following PowerShell cmdlet:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -PersonalDesktopAssignmentType Direct
```

To assign a user to the personal desktop host pool, run the following PowerShell cmdlet:

```powershell
New-AzRoleAssignment -SignInName <userupn> -RoleDefinitionName "Desktop Virtualization User" -ResourceName <appgroupname> -ResourceGroupName <resourcegroupname> -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups'
```

To assign a user to a specific session host, run the following PowerShell cmdlet:

```powershell
Update-AzWvdSessionHost -HostPoolName <hostpoolname> -Name <sessionhostname> -ResourceGroupName <resourcegroupname> -AssignedUser <userupn>
```

To directly assign a user to a session host in the Azure portal:

1. Sign in to the Azure portal at <https://portal.azure.com>.
2. Enter **Windows Virtual Desktop** into the search bar.
3. Under **Services**, select **Windows Virtual Desktop**.
4. At the Windows Virtual Desktop page, go the menu on the left side of the window and select **Host pools**.
5. Select the name of the host pool you want to update.
6. Next, go to the menu on the left side of the window and select **Application groups**.
7. Select the name of the desktop app group you want to edit, then select **Assignments** in the menu on the left side of the window.
8. Select **+ Add**, then select the users or user groups you want to publish this desktop app group to.
9. Select **Assign VM** in the Information bar to assign a session host to a user.
10. Select the session host you want to assign to the user, then select **Assign**.
11. Select the user you want to assign the session host to from the list of available users.
12. When you're done, select **Select**.

## Next steps

Now that you've configured the personal desktop assignment type, you can sign in to a Windows Virtual Desktop client to test it as part of a user session. These next two How-tos will tell you how to connect to a session using the client of your choice:

- [Connect with the Windows Desktop client](connect-windows-7-10.md)
- [Connect with the web client](connect-web.md)
- [Connect with the Android client](connect-android.md)
- [Connect with the iOS client](connect-ios.md)
- [Connect with the macOS client](connect-macos.md)