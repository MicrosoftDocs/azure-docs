---
title: Azure Virtual Desktop personal desktop assignment type - Azure
description: How to configure automatic or direct assignment for an Azure Virtual Desktop personal desktop host pool.
author: Heidilohr
ms.topic: how-to
ms.date: 07/09/2020
ms.author: helohr 
ms.custom: devx-track-azurepowershell
manager: femila
---
# Configure the personal desktop host pool assignment type

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/configure-host-pool-personal-desktop-assignment-type-2019.md).

You can configure the assignment type of your personal desktop host pool to adjust your Azure Virtual Desktop environment to better suit your needs. In this topic, we'll show you how to configure automatic or direct assignment for your users.

>[!NOTE]
> The instructions in this article only apply to personal desktop host pools, not pooled host pools, since users in pooled host pools aren't assigned to specific session hosts.

## Prerequisites

This article assumes you've already downloaded and installed the Azure Virtual Desktop PowerShell module. If you haven't, follow the instructions in [Set up the PowerShell module](powershell-module.md).

## Personal host pools overview

A personal host pool is a type of host pool that has personal desktops. Personal desktops have a one to one mapping, where only one user can be assigned to any personal desktop and a user can only be assigned to a single personal desktop. Every time the user logs in, their user session will be directed to their assigned personal desktop session host. This host pool type is ideal for customers that have resource-intensive workloads where it would benefit the user experience and session performance more to have a single session on a session host as opposed to multiple sessions. Also note that user activities, files, and settings persist on the VM OS disk after each user logoff. 

Since users must be assigned to a personal desktop to have a session on one, there are two types of assignment for a personal host pool, automatic assignment and direct assignment.

## Configure automatic assignment

Automatic assignment is the default assignment type for new personal desktop host pools created in your Azure Virtual Desktop environment. Automatically assigning users doesn't require a specific session host.

To automatically assign users, first assign them to the personal desktop host pool so that they can see the desktop in their feed. When an assigned user launches the desktop in their feed, their user session will be load balanced to an available session host if they haven't already connected to the host pool, which completes the assignment process.

To configure a host pool to automatically assign users to VMs, run the following PowerShell cmdlet:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -PersonalDesktopAssignmentType Automatic
```

To assign a user to the personal desktop host pool, run the following PowerShell cmdlet:

```powershell
New-AzRoleAssignment -SignInName <userupn> -RoleDefinitionName "Desktop Virtualization User" -ResourceName <appgroupname> -ResourceGroupName <resourcegroupname> -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups'
```

## Configure direct assignment

Unlike automatic assignment, when you use direct assignment, you must assign the user to both the personal desktop host pool and a specific session host before they can connect to their personal desktop. If the user is only assigned to a host pool without a session host assignment, they won't be able to access resources and will receive a no resources available error.

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
2. Enter **Azure Virtual Desktop** into the search bar.
3. Under **Services**, select **Azure Virtual Desktop**.
4. At the Azure Virtual Desktop page, go the menu on the left side of the window and select **Host pools**.
5. Select the name of the host pool you want to update.
6. Next, go to the menu on the left side of the window and select **Application groups**.
7. Select the name of the desktop app group you want to edit, then select **Assignments** in the menu on the left side of the window.
8. Select **+ Add**, then select the users or user groups you want to publish this desktop app group to.
9. Select **Assign VM** in the Information bar to assign a session host to a user.
10. Select the session host you want to assign to the user, then select **Assign**.
11. Select the user you want to assign the session host to from the list of available users.
12. When you're done, select **Select**.


## How to unassign a personal desktop

To unassign a personal desktop, run the following PowerShell cmdlet:

```powershell
Update-AzWvdSessionHost -HostPoolName <hostpoolname> -Name <sessionhostname> -ResourceGroupName <resourcegroupname> -AssignedUser "" -Force
```

>[!IMPORTANT]
> - You must include the -Force parameter when running the PowerShell cmdlet to unassign a personal desktop. Excluding the -Force parameter will result in an error.
> - There must be 0 existing user sessions on the session host at the time you are unassigning the user from the personal desktop. If there is an existing user session on the session host that you are unassigning, the operation will fail.
> - If the session host currently has no user assignment, nothing will happen after running this cmdlet.

To unassign a personal desktop in the Azure portal:
1. Sign in to the Azure portal at <https://portal.azure.com>.
2. Enter **Azure Virtual Desktop** into the search bar.
3. Under **Services**, select **Azure Virtual Desktop**.
4. At the Azure Virtual Desktop page, go the menu on the left side of the window and select **Host pools**.
5. Select the name of the host pool you want to update.
6. Next, go to the menu on the left side of the window and select **Session hosts**.
7. Select the session host you want to unassign a user from, then select **Assignment** > **Unassign user**.
8. Select **Unassign** when prompted with the warning.

## How to reassign a personal desktop

To reassign a personal desktop, run the following PowerShell cmdlet:

```powershell
Update-AzWvdSessionHost -HostPoolName <hostpoolname> -Name <sessionhostname> -ResourceGroupName <resourcegroupname> -AssignedUser <userupn> -Force
```

>[!IMPORTANT]
> - You must include the -Force parameter when running the PowerShell cmdlet to reassign a personal desktop. Excluding the -Force parameter will result in an error.
> - There must be 0 existing user sessions on the session host at the time you are reassigning the personal desktop to another user. If there is an existing user session on the session host that you are reassigning, the operation will fail.
> - If the user principal name (UPN) provided for the -AssignedUser parameter is the same as the UPN currently assigned to the personal desktop, nothing will happen.
> - If the session host currently has no user assignment, the personal desktop will be assigned to the provided UPN.

To reassign a personal desktop in the Azure portal:
1. Sign in to the Azure portal at <https://portal.azure.com>.
2. Enter **Azure Virtual Desktop** into the search bar.
3. Under **Services**, select **Azure Virtual Desktop**.
4. At the Azure Virtual Desktop page, go the menu on the left side of the window and select **Host pools**.
5. Select the name of the host pool you want to update.
6. Next, go to the menu on the left side of the window and select **Session hosts**.
7. Select the session host you want to unassign a user from, then select **Assignment** > **Reassign user**.
8. Select the user you want to assign the session host to from the list of available users.
9. When you're done, select **Select**.

## Next steps

Now that you've configured the personal desktop assignment type, you can sign in to an Azure Virtual Desktop client to test it as part of a user session. These next two How-tos will tell you how to connect to a session using the client of your choice:

- [Connect with the Windows Desktop client](./user-documentation/connect-windows-7-10.md)
- [Connect with the web client](./user-documentation/connect-web.md)
- [Connect with the Android client](./user-documentation/connect-android.md)
- [Connect with the iOS client](./user-documentation/connect-ios.md)
- [Connect with the macOS client](./user-documentation/connect-macos.md)