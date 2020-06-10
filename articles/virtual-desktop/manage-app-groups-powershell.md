---
title: Manage app groups for Windows Virtual Desktop PowerShell - Azure
description: How to manage Windows Virtual Desktop app groups with PowerShell.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: helohr
manager: lizross
---
# Manage app groups using PowerShell

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/manage-app-groups-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The default app group created for a new Windows Virtual Desktop host pool also publishes the full desktop. In addition, you can create one or more RemoteApp application groups for the host pool. Follow this tutorial to create a RemoteApp app group and publish individual **Start** menu apps.

In this tutorial, learn how to:

> [!div class="checklist"]
> * Create a RemoteApp group.
> * Grant access to RemoteApp programs.

## Prerequisites

This article assumes you've followed the instructions in [Set up the PowerShell module](powershell-module.md) to set up your PowerShell module and sign in to your Azure account.

## Create a RemoteApp group

To create a RemoteApp group with PowerShell:

1. Run the following PowerShell cmdlet to create a new empty RemoteApp app group.

   ```powershell
   New-AzWvdApplicationGroup -Name <appgroupname> -ResourceGroupName <resourcegroupname> -ApplicationGroupType "RemoteApp" -HostPoolArmPath '/subscriptions/SubscriptionId/resourcegroups/ResourceGroupName/providers/Microsoft.DesktopVirtualization/hostPools/HostPoolName'-Location <azureregion>
   ```

2. (Optional) To verify that the app group was created, you can run the following cmdlet to see a list of all app groups for the host pool.

   ```powershell
   Get-AzWvdApplicationGroup -Name <appgroupname> -ResourceGroupName <resourcegroupname>
   ```

3. Run the following cmdlet to get a list of **Start** menu apps on the host pool's virtual machine image. Write down the values for **FilePath**, **IconPath**, **IconIndex**, and other important information for the application that you want to publish.

   ```powershell
   Get-AzWvdStartMenuItem -ApplicationGroupName <appgroupname> -ResourceGroupName <resourcegroupname> | Format-List | more 
   ```

   The output should show all the Start menu items in a format like this:

   ```powershell
   AppAlias            : access
   CommandLineArgument : 
   FilePath            : C:\Program Files\Microsoft Office\root\Office16\MSACCESS.EXE 
   FriendlyName        : 
   IconIndex           : 0 
   IconPath            : C:\Program Files\Microsoft Office\Root\VFS\Windows\Installer\{90160000-000F-0000-1000-0000000FF1CE}\accicons.exe 
   Id                  : /subscriptions/resourcegroups/providers/Microsoft.DesktopVirtualization/applicationgroups/startmenuitems/Access 
   Name                : 0301RAG/Access 
   Type                : Microsoft.DesktopVirtualization/applicationgroups/startmenuitems
   
   AppAlias            : charactermap 
   CommandLineArgument : 
   FilePath            : C:\windows\system32\charmap.exe 
   FriendlyName        : 
   IconIndex           : 0 
   IconPath            : C:\windows\system32\charmap.exe 
   Id                  : /subscriptions/resourcegroups/providers/Microsoft.DesktopVirtualization/applicationgroups/startmenuitems/Character Map 
   Name                : 0301RAG/Character Map 
   Type                : Microsoft.DesktopVirtualization/applicationgroups/startmenuitems 
   ```
   
4. Run the following cmdlet to install the application based on `AppAlias`. `AppAlias` becomes visible when you run the output from step 3.

   ```powershell
   New-AzWvdApplication -AppAlias <appalias> -GroupName <appgroupname> -Name <remoteappname> -ResourceGroupName <resourcegroupname> -CommandLineSetting <DoNotAllow|Allow|Require> 
   ```

5. (Optional) Run the following cmdlet to publish a new RemoteApp program to the application group created in step 1.

   ```powershell
   New-AzWvdApplication -GroupName <appgroupname> -Name <remoteappname> -ResourceGroupName <resourcegroupname> -Filepath <filepath> -IconPath <iconpath> -IconIndex <iconindex> -CommandLineSetting <DoNotAllow|Allow|Require> 
   ```

6. To verify that the app was published, run the following cmdlet.

   ```powershell
   Get-AzWvdApplication -GroupName <appgroupname> -ResourceGroupName <resourcegroupname>
   ```

7. Repeat steps 1–5 for each application that you want to publish for this app group.
8. Run the following cmdlet to grant users access to the RemoteApp programs in the app group.

   ```powershell
   New-AzRoleAssignment -SignInName <userupn> -RoleDefinitionName "Desktop Virtualization User" -ResourceName <appgroupname> -ResourceGroupName <resourcegroupname> -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups'
   ```

## Next steps

If you came to this How-to guide from our tutorials, check out [Create a host pool to validate service updates](create-validation-host-pool.md). You can use a validation host pool to monitor service updates before rolling them out to your production environment.