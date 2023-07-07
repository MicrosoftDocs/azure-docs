---
title: Use Azure CLI and Azure PowerShell with Azure Virtual Desktop
description: Learn about Azure CLI and Azure PowerShell with Azure Virtual Desktop and some useful example commands you can run.
ms.topic: how-to
ms.custom: devx-track-azurepowershell, devx-track-azurecli
author: dknappettmsft
ms.author: daknappe
ms.date: 02/01/2023
---
# Use Azure CLI and Azure PowerShell with Azure Virtual Desktop

There's an Azure CLI extension and an Azure PowerShell module for Azure Virtual Desktop that you can use to create, update, delete, and interact with Azure Virtual Desktop service objects as alternatives to using the Azure portal. They're part of [Azure CLI](/cli/azure/what-is-azure-cli) and [Azure PowerShell](/powershell/azure/what-is-azure-powershell), which cover a wide range of Azure services.

This article explains how you can use the Azure CLI extension and an Azure PowerShell module, and provides some useful example commands.

## Azure CLI extension and Azure PowerShell module

Here are the names of the Azure CLI extension and Azure PowerShell module, and links to our reference documentation:

- Azure CLI: [`az desktopvirtualization`](/cli/azure/desktopvirtualization)

- Azure PowerShell: [`Az.DesktopVirtualization`](/powershell/module/az.desktopvirtualization)

Both Azure CLI and Azure PowerShell are available to use in the [Azure Cloud Shell](../cloud-shell/overview.md) natively in the Azure portal with no installation, or you can install them locally on your device for Windows, macOS, and Linux.

To learn how to install Azure CLI and Azure PowerShell across all supported platforms, see the following links:

- Azure CLI: [How to install the Azure CLI](/cli/azure/install-azure-cli)

- Azure PowerShell: [Install the Azure Az PowerShell module](/powershell/azure/install-azure-powershell)

## Example commands

Here are some example commands you can use to get information and values about your Azure Virtual Desktop resources you might find useful. Select the relevant tab for your scenario.

# [Azure CLI](#tab/cli)

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

### Available Azure regions

When creating Azure Virtual Desktop service objects using any of the CLI commands that contain `create`, you need to specify the Azure region you want to create them in. To find the name of the Azure region to use with the `--location` parameter, run the following command and use a value from the `Location` column:

```azurepowershell
az account list-locations --query "sort_by([].{DisplayName:displayName, Location:name}, &Location)" -o table
```

### Retrieve the object ID of a host pool, workspace, application group, or application

- To retrieve the object ID of a host pool, run the following command:

   ```azurecli
   az desktopvirtualization hostpool show \
       --name <Name> \
       --resource-group <ResourceGroupName> \
       --query objectId 
       --output tsv
   ```

- To retrieve the object ID of a workspace, run the following command:

   ```azurecli
   az desktopvirtualization workspace show \
       --name <Name> \
       --resource-group <ResourceGroupName> \
       --query objectId 
       --output tsv
   ```

- To retrieve the object ID of an application group, run the following command:

   ```azurecli
   az desktopvirtualization applicationgroup show \
       --name <Name> \
       --resource-group <ResourceGroupName> \
       --query objectId 
       --output tsv
   ```

> [!TIP]
> The Azure CLI extension for Azure Virtual Desktop doesn't have commands for applications. Use Azure PowerShell instead.

# [Azure PowerShell](#tab/powershell)

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

### Available Azure regions

When creating Azure Virtual Desktop service objects using any of the PowerShell cmdlets that begin `New-AzWvd...`, you need to specify the Azure region you want to create them in. To find the name of the Azure region to use with the `-Location` parameter, run the following command and use a value from the `Location` column:

```azurepowershell
Get-AzLocation | Sort-Object DisplayName | FT DisplayName, Location
```

### Retrieve the object ID of a host pool, workspace, application group, or application

Some PowerShell cmdlets require you to provide the object ID of Azure Virtual Desktop service objects. Here are some examples:

- To retrieve the object ID of a host pool, run the following command:

   ```azurepowershell
   (Get-AzWvdHostPool -Name <HostPoolName> -ResourceGroupName <ResourceGroupName>).ObjectId
   ```

- To retrieve the object ID of a workspace, run the following command:

   ```azurepowershell
   (Get-AzWvdWorkspace -Name <WorkspaceName> -ResourceGroupName <ResourceGroupName>).ObjectID
   ```

- To retrieve the object ID of an application group, run the following command:

   ```azurepowershell
   (Get-AzWvdApplicationGroup -Name <ApplicationGroupName> -ResourceGroupName <ResourceGroupName>).ObjectId
   ```

- To retrieve the object ID of a desktop application, run the following command:

   ```azurepowershell
   (Get-AzWvdDesktop -Name <DesktopName> -ApplicationGroupName <ApplicationGroupName> -ResourceGroupName <ResourceGroupName>).ObjectId
   ```

- To retrieve the object IDs of all RemoteApp applications in an application group, run the following command:

   ```azurepowershell
   Get-AzWvdApplication -ApplicationGroupName <ApplicationGroupName> -ResourceGroupName <ResourceGroupName> | Select-Object Name, FilePath, ObjectId
   ```

---

## Next steps

Now that you know how to use Azure CLI and Azure PowerShell with Azure Virtual Desktop, here are some articles that use them:

- [Create an Azure Virtual Desktop host pool with PowerShell or the Azure CLI](create-host-pools-powershell.md)
- [Manage application groups using PowerShell or the Azure CLI](manage-app-groups-powershell.md)
