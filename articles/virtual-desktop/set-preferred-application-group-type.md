---
title: Set the preferred application group type for a pooled host pool in Azure Virtual Desktop
description: Learn how to set the preferred application group type for a pooled host pool.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 06/10/2024
---

# Set the preferred application group type for a pooled host pool in Azure Virtual Desktop

An application group is a logical grouping of applications that are available on session hosts in a host pool. Application groups control whether a full desktop or which applications from a host pool are available to users to connect to. An application group can only be assigned to a single host pool, but you can assign multiple application groups to the same host pool. Users can be assigned to multiple application groups across multiple host pools, which enable you to vary the applications and desktops that users can access.

When you create an application group, it can be one of two types:

- **Desktop**: users access the full Windows desktop from a session host. Available with pooled or personal host pools.

- **RemoteApp**: users access individual applications you select and publish to the application group. Available with pooled host pools only.

To help prevent users from connecting to a desktop and RemoteApp application at the same time from application groups assigned to the same host pool, pooled host pools have the setting **Preferred application group type**. This setting determines whether users have access to the full desktop or RemoteApp applications from this host pool in Windows App or the Remote Desktop app, should they be assigned to an application group of each type to the same host pool.

For more information about the behavior of the preferred application group type setting and why it's necessary, see [Preferred application group type behavior for pooled host pools in Azure Virtual Desktop](preferred-application-group-type.md).

This article shows you how to set the preferred application group type for a pooled host pool using the Azure portal, Azure PowerShell, or Azure CLI.

## Prerequisites

Before you can set the preferred application group type for a pooled host pool, you need:

- An existing pooled host pool.

- An Azure account you can use that has the [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor) role-based access control (RBAC) role assigned.

- If you want to use Azure PowerShell or Azure CLI locally, see [Use Azure PowerShell and Azure CLI with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module or the [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

## Set the preferred application group type

Select the relevant tab for your scenario.

# [Portal](#tab/portal)

Here's how to set the preferred application group type for a host pool using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, enter *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the name of the pooled host pool you want to configure.

1. Select **Properties**.

1. For **Preferred app group type**, select either **Desktop** or **RemoteApp** from the drop-down list.

   :::image type="content" source="media/set-preferred-application-group-type/preferred-application-group-type-drop-down-list.png" alt-text="A screenshot showing the preferred app group type drop-down list from the host pool properties in the Azure portal.":::

1. Select **Save**.

# [Azure PowerShell](#tab/powershell)

Here's how to set the preferred application group type for a host pool using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module. In the following examples, you need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Use the `Get-AzWvdHostPool` cmdlet get the current preferred application group type for all host pools in the current Azure subscription:

   ```azurepowershell
   $hostPools = Get-AzResource | ? ResourceType -eq Microsoft.DesktopVirtualization/hostpools

   $preferredAppGroupType = @()
   foreach ($hostPool in $hostPools) {
       $hostPoolProperties = Get-AzWvdHostPool -Name $hostPool.Name -ResourceGroup $hostPool.ResourceGroupName
       $preferredAppGroupType += $hostPoolProperties
   }

   $preferredAppGroupType | FT Name, PreferredAppGroupType
   ```

   The output is similar to the following output:

   ```output
   Name          PreferredAppGroupType
   ----          ---------------------
   contoso-hp01  Desktop
   contoso-hp02  RailApplications
   contoso-hp03  None
   ```

   > [!TIP]
   > The term *RailApplications* is for RemoteApp application groups when using Azure PowerShell.

3. To set or change the preferred application group type for a host pool, use the `Update-AzWvdHostPool` cmdlet, as shown in the following example. For the `PreferredAppGroupType` parameter, use either `Desktop` or `RailApplications` as the value, depending on your requirements.

   ```azurepowershell
   $parameters = @{
       hostPoolName = "<HostPoolName>"
       resourceGroupName = "<ResourceGroupName>"
       preferredAppGroupType = "<PreferredAppGroupType>"
   }

   Update-AzWvdHostPool @parameters
   ```

4. Run the commands in step 2 again and verify that the preferred application group type is set correctly.

# [Azure CLI](#tab/cli)

Here's how to set the preferred application group type for a host pool using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for Azure CLI. In the following examples, you need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Use the `az desktopvirtualization hostpool list` command get the current preferred application group type for all host pools in the current Azure subscription:

   ```azurecli
   az desktopvirtualization hostpool list \
       --query "[].{name:name, preferredAppGroupType:preferredAppGroupType}" \
       --output table
   ```

   The output is similar to the following output:

   ```output
   Name          PreferredAppGroupType
   ------------  ---------------------
   contoso-hp01  Desktop
   contoso-hp02  RailApplications
   contoso-hp03  None
   ```

   > [!TIP]
   > The term *RailApplications* is for RemoteApp application groups when using Azure CLI.

3. To set or change the preferred application group type for a host pool, use the `az desktopvirtualization hostpool update` command, as shown in the following example. For the `PreferredAppGroupType` parameter, use either `Desktop` or `RailApplications` as the value, depending on your requirements.

   ```azurecli
   az desktopvirtualization hostpool update \
       --name "<HostPoolName>" \
       --resource-group "<ResourceGroupName>" \
       --preferred-app-group-type "<PreferredAppGroupType>"
   ```

4. Run the commands in step 2 again and verify that the preferred application group type is set correctly.

---

## Related content

- Learn about the [Preferred application group type behavior for pooled host pools in Azure Virtual Desktop](preferred-application-group-type.md)
