---
title: Manage application groups for Azure Virtual Desktop - Azure
description: How to manage Azure Virtual Desktop application groups with PowerShell or the Azure CLI.
author: Heidilohr
ms.topic: how-to
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.date: 07/23/2021
ms.author: helohr
manager: femila
---
# Manage application groups using PowerShell or the Azure CLI

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/manage-app-groups-2019.md).

The default application group created for a new Azure Virtual Desktop host pool also publishes the full desktop. In addition, you can create one or more RemoteApp application groups for the host pool. Follow this tutorial to create a RemoteApp application group and publish individual **Start** menu apps.

In this tutorial, learn how to:

> [!div class="checklist"]
> * Create a RemoteApp group.
> * Grant access to RemoteApp programs.

## Prerequisites

### [Azure PowerShell](#tab/azure-powershell)

This article assumes you've followed the instructions in [Set up the PowerShell module](powershell-module.md) to set up your PowerShell module and sign in to your Azure account.

### [Azure CLI](#tab/azure-cli)

This article assumes you've already set up your environment for the Azure CLI, and that you've signed in to your Azure account.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

---

## Create a RemoteApp group

### [Azure PowerShell](#tab/azure-powershell)

To create a RemoteApp group with PowerShell:

1. Run the following PowerShell cmdlet to create a new empty RemoteApp application group.

   ```powershell
   New-AzWvdApplicationGroup -Name <appgroupname> -ResourceGroupName <resourcegroupname> -ApplicationGroupType "RemoteApp" -HostPoolArmPath '/subscriptions/SubscriptionId/resourcegroups/ResourceGroupName/providers/Microsoft.DesktopVirtualization/hostPools/HostPoolName'-Location <azureregion>
   ```

2. (Optional) To verify that the application group was created, you can run the following cmdlet to see a list of all application groups for the host pool.

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
   New-AzWvdApplication -AppAlias <appalias> -GroupName <appgroupname> -Name <RemoteAppName> -ResourceGroupName <resourcegroupname> -CommandLineSetting <DoNotAllow|Allow|Require>
   ```

5. (Optional) Run the following cmdlet to publish a new RemoteApp program to the application group created in step 1.

   ```powershell
   New-AzWvdApplication -GroupName <appgroupname> -Name <RemoteAppName> -ResourceGroupName <resourcegroupname> -Filepath <filepath> -IconPath <iconpath> -IconIndex <iconindex> -CommandLineSetting <DoNotAllow|Allow|Require>
   ```

6. To verify that the app was published, run the following cmdlet.

   ```powershell
   Get-AzWvdApplication -GroupName <appgroupname> -ResourceGroupName <resourcegroupname>
   ```

7. Repeat steps 1–5 for each application that you want to publish for this application group.
8. Run the following cmdlet to grant users access to the RemoteApp programs in the application group.

   ```powershell
   New-AzRoleAssignment -SignInName <userupn> -RoleDefinitionName "Desktop Virtualization User" -ResourceName <appgroupname> -ResourceGroupName <resourcegroupname> -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups'
   ```

### [Azure CLI](#tab/azure-cli)

> [!NOTE]
> Azure CLI currently does not provide commands to get Start Menu apps, nor to create a new RemoteApp program or publish it to the application group. Use Azure PowerShell.

To create a RemoteApp group with the Azure CLI:

1. Use the [az desktopvirtualization applicationgroup create](/cli/azure/desktopvirtualization##az-desktopvirtualization-applicationgroup-create) command to create a new RemoteApp application group:

   ```azurecli
   az desktopvirtualization applicationgroup create --name "MyApplicationGroup" \
      --resource-group "MyResourceGroup" \
      --location "MyLocation" \
      --application-group-type "RemoteApp" \
      --host-pool-arm-path "/subscriptions/MySubscriptionGUID/resourceGroups/MyResourceGroup/providers/Microsoft.DesktopVirtualization/hostpools/MyHostPool"
      --tags tag1="value1" tag2="value2" \
      --friendly-name "Friendly name of this application group" \
      --description "Description of this application group" 
   ```
    
2. (Optional) To verify that the application group was created, you can run the following command to see a list of all application groups for the host pool.

   ```azurecli
   az desktopvirtualization applicationgroup list \
      --resource-group "MyResourceGroup"
   ```
---

## Next steps

If you came to this How-to guide from our tutorials, check out [Create a host pool to validate service updates](create-validation-host-pool.md). You can use a validation host pool to monitor service updates before rolling them out to your production environment.
