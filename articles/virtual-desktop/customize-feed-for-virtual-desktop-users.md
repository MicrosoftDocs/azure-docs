---
title: Customize feed for Azure Virtual Desktop users - Azure
description: How to customize feed for Azure Virtual Desktop users using the Azure portal and PowerShell cmdlets.
author: Heidilohr
ms.topic: how-to
ms.date: 02/01/2024
ms.author: helohr 
ms.custom: devx-track-azurepowershell
---
# Customize the feed for Azure Virtual Desktop users

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/customize-feed-virtual-desktop-users-2019.md).

You can customize the feed so the RemoteApp and remote desktop resources appear in a recognizable way for your users.

## Prerequisites

If you're using either the Azure portal or PowerShell method, you'll need the following things:

- An Azure account assigned the [Desktop Virtualization Application Group Contributor](rbac.md#desktop-virtualization-application-group-contributor) role.
- If you want to use Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).


## Customize the display name for a RemoteApp or desktop 

You can change the display name for a published RemoteApp or desktop to make it easier for users to identify what to connect to. 

#### [Azure portal](#tab/portal)

Here's how to customize the display name for a published RemoteApp or desktop using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Azure Virtual Desktop**.

3. Under Services, select **Azure Virtual Desktop**.

4. On the Azure Virtual Desktop page, select **Application groups** on the left side of the screen, then select the name of the application group you want to edit.

5. Select **Applications** in the menu on the left side of the screen.

6. Select the application you want to update, then enter a new **Display name**.

7. Select **Save**. The application you edited should now display the updated name. Users see the new name once their client refreshes.


### [Azure PowerShell](#tab/powershell)

### Customize the display name for a RemoteApp

Here's how to customize the display name for a RemoteApp using PowerShell. By default, the display name is the same as the name of the application identifier.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. To retrieve a list of published applications for an application group, run the following PowerShell cmdlet:

   ```azurepowershell
   $parameters = @{
      ResourceGroupName = "<resourcegroupname>"
      ApplicationGroupName = "<appgroupname>"
   }

   Get-AzWvdApplication @parameters
   ```

3. To assign a friendly name to a RemoteApp, run the following cmdlet with the required parameters:

   ```azurepowershell
   $parameters = @{
      ResourceGroupName = "<resourcegroupname>"
      ApplicationGroupName = "<appgroupname>"
      Name = "<applicationname>"
      FriendlyName = "<newfriendlyname>"
   }

   Update-AzWvdApplication @parameters
   ```


### Customize the display name for a Remote Desktop

You can change the display name for a published remote desktop for all users by setting a friendly name. If you manually created a host pool and desktop application group through PowerShell, the default friendly name is **Session Desktop**. If you created a host pool and desktop application group through the GitHub Azure Resource Manager template or the Azure Marketplace offering, the default friendly name is the same as the host pool name. If you have a personal host pool, you can also [set a friendly name for individual session hosts](#set-a-friendly-name-for-an-individual-session-host-in-a-personal-host-pool). 

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. To assign a friendly name to the remote desktop resource, run the following PowerShell cmdlet:

   ```azurepowershell
   $parameters = @{
      ResourceGroupName = "<resourcegroupname>"
      ApplicationGroupName = "<appgroupname>"
      Name = "<applicationname>"
      FriendlyName = "<newfriendlyname>"
   }

   Update-AzWvdDesktop @parameters
   ```

3. To retrieve the friendly name for the remote desktop resource, run the following PowerShell cmdlet:

   ```azurepowershell
   $parameters = @{
      ResourceGroupName = "<resourcegroupname>"
      ApplicationGroupName = "<appgroupname>"
      Name = "<applicationname>"
   }
    
   Get-AzWvdDesktop @parameters | FL ApplicationGroupName, Name, FriendlyName
   ```

--- 

## Set a friendly name for an individual session host in a personal host pool

For session hosts in a personal host pool, you can change the display name for a desktop for each individual session host by setting its friendly name using PowerShell. By default, the session host friendly name is empty, so all users only see the same desktop display name. There isn't currently a way to set the session host friendly name in the Azure portal.

[!INCLUDE [include-session-hosts-friendly-name](includes/include-session-hosts-friendly-name.md)] 


