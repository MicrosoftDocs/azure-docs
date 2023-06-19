---
title: Create an application group, a workspace, and assign users - Azure Virtual Desktop
description: Learn how to create an application group and a workspace, and assign users in Azure Virtual Desktop by using the Azure portal, Azure CLI, or Azure PowerShell.
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
author: dknappettmsft
ms.author: daknappe
ms.date: 03/22/2023
---

# Create an application group, a workspace, and assign users in Azure Virtual Desktop

This article shows you how to create an application group and a workspace, then add the application group to a workspace and assign users by using the Azure portal, Azure CLI, or Azure PowerShell. Before you complete these steps, you should have already [created a host pool](create-host-pool.md).

For more information on the terminology used in this article, see [Azure Virtual Desktop terminology](environment-setup.md).

## Prerequisites

Review the [Prerequisites for Azure Virtual Desktop](prerequisites.md) for a general idea of what's required. In addition, you'll need:

- An Azure account with an active subscription.

- An existing host pool. See [Create a host pool](create-host-pool.md) to find out how to create one.

- The account must have the following built-in role-based access control (RBAC) roles on the resource group, or on a subscription to create the resources.

   | Resource type | RBAC role |
   |--|--|
   | Workspace | [Desktop Virtualization Workspace Contributor](rbac.md#desktop-virtualization-workspace-contributor) |
   | Application group | [Desktop Virtualization Application Group Contributor](rbac.md#desktop-virtualization-application-group-contributor) |

   Alternatively you can assign the [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) RBAC role to create all of these resource types.

- To assign users to the application group, you'll also need `Microsoft.Authorization/roleAssignments/write` permissions on the application group. Built-in RBAC roles that include this permission are [*User Access Administrator*](../role-based-access-control/built-in-roles.md#user-access-administrator) and [*Owner*](../role-based-access-control/built-in-roles.md#owner). 

- If you want to use Azure CLI or Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension or the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

## Create an application group

To create an application group, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to create an application group using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Application groups**, then select **Create**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | Select the subscription you want to create the application group in from the drop-down list. |
   | Resource group | Select an existing resource group or select **Create new** and enter a name. |
   | Host pool | Select the host pool for the application group. |
   | Location | Metadata is stored in the same location as the host pool. |
   | Application group type | Select the [application group type](environment-setup.md#app-groups) for this host pool from *Desktop* or *RemoteApp*. |
   | Application group name | Enter a name for the application group, for example *Session Desktop*. |

   > [!TIP]
   > Once you've completed this tab, select **Next: Review + create**. You don't need to complete the other tabs to create an application group, but you'll need to [create a workspace](#create-a-workspace), [add an application group to a workspace](#add-an-application-group-to-a-workspace) and [assign users to the application group](#assign-users-to-an-application-group) before users can access the resources.
   >
   > If you created an application group for RemoteApp, you will also need to add applications. For more information, see [Add applications to an application group](manage-app-groups.md)

1. On the **Review + create** tab, ensure validation passes and review the information that will be used during deployment.

1. Select **Create** to create the application group.

1. Once the application group has been created, select **Go to resource** to go to the overview of your new application group, then select **Properties** to view its properties.

# [Azure CLI](#tab/cli)

Here's how to create an application group using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for Azure CLI.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Get the resource ID of the host pool you want to create an application group for and store it in a variable by running the following command:

   ```azurecli
   hostPoolArmPath=$(az desktopvirtualization hostpool show \
       --name <Name> \
       --resource-group <ResourceGroupName> \
       --query [id] \
       --output tsv)
   ```

3. Use the `az desktopvirtualization applicationgroup create` command with the following examples to create an application group. For more information, see the [az desktopvirtualization applicationgroup Azure CLI reference](/cli/azure/desktopvirtualization/applicationgroup).

   1. To create a Desktop application group in the Azure region UK South, run the following command:

      ```azurecli
      az desktopvirtualization applicationgroup create \
          --name <Name> \
          --resource-group <ResourceGroupName> \
          --application-group-type Desktop \
          --host-pool-arm-path $hostPoolArmPath \
          --location uksouth
      ```

   1. To create a RemoteApp application group in the Azure region UK South, run the following command. You can only create a RemoteApp application group with a pooled host pool.

      ```azurecli
      az desktopvirtualization applicationgroup create \
          --name <Name> \
          --resource-group <ResourceGroupName> \
          --application-group-type RemoteApp \
          --host-pool-arm-path $hostPoolArmPath \
          --location uksouth
      ```

4. You can view the properties of your new application group by running the following command:

   ```azurecli
   az desktopvirtualization applicationgroup show --name <Name> --resource-group <ResourceGroupName>
   ```

# [Azure PowerShell](#tab/powershell)

Here's how to create an application group using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Get the resource ID of the host pool you want to create an application group for and store it in a variable by running the following command:

   ```azurepowershell
   $hostPoolArmPath = (Get-AzWvdHostPool -Name <HostPoolName> -ResourceGroupName <ResourceGroupName).Id
   ```

3. Use the `New-AzWvdApplicationGroup` cmdlet with the following examples to create an application group. For more information, see the [New-AzWvdApplicationGroup PowerShell reference](/powershell/module/az.desktopvirtualization/new-azwvdapplicationgroup).

   1. To create a Desktop application group in the Azure region UK South, run the following command:

      ```azurepowershell
      $parameters = @{
          Name = '<Name>'
          ResourceGroupName = '<ResourceGroupName>'
          ApplicationGroupType = 'Desktop'
          HostPoolArmPath = $hostPoolArmPath
          Location = 'uksouth'
      }
   
      New-AzWvdApplicationGroup @parameters
      ```

   1. To create a RemoteApp application group in the Azure region UK South, run the following command. You can only create a RemoteApp application group with a pooled host pool.

      ```azurepowershell
      $parameters = @{
          Name = '<Name>'
          ResourceGroupName = '<ResourceGroupName>'
          ApplicationGroupType = 'RemoteApp'
          HostPoolArmPath = $hostPoolArmPath
          Location = 'uksouth'
      }
   
      New-AzWvdApplicationGroup @parameters
      ```

4. You can view the properties of your new workspace by running the following command:

   ```azurepowershell
   Get-AzWvdApplicationGroup -Name <Name> -ResourceGroupName <ResourceGroupName> | FL *
   ```

---

## Create a workspace

Next, to create a workspace, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to create a workspace using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Workspaces**, then select **Create**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | Select the subscription you want to create the workspace in from the drop-down list. |
   | Resource group | Select an existing resource group or select **Create new** and enter a name. |
   | Workspace name | Enter a name for the workspace, for example *workspace01*. |
   | Friendly name | *Optional*: Enter a friendly name for the workspace. |
   | Description | *Optional*: Enter a description for the workspace. |
   | Location | Select the Azure region where your workspace will be deployed. |

   > [!TIP]
   > Once you've completed this tab, select **Next: Review + create**. You don't need to complete the other tabs to create a workspace, but you'll need to [add an application group to a workspace](#add-an-application-group-to-a-workspace) and [assign users to the application group](#assign-users-to-an-application-group) before they can access its applications.

1. On the **Review + create** tab, ensure validation passes and review the information that will be used during deployment.

1. Select **Create** to create the workspace.

1. Once the workspace has been created, select **Go to resource** to go to the overview of your new workspace, then select **Properties** to view its properties.

# [Azure CLI](#tab/cli)

Here's how to create a workspace using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for Azure CLI.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Use the `az desktopvirtualization workspace create` command with the following example to create a workspace. More parameters are available, such as to register existing application groups. For more information, see the [az desktopvirtualization workspace Azure CLI reference](/cli/azure/desktopvirtualization/workspace).

   ```azurecli
   az desktopvirtualization workspace create --name <Name> --resource-group <ResourceGroupName>
   ```

3. You can view the properties of your new workspace by running the following command:

   ```azurecli
   az desktopvirtualization workspace show --name <Name> --resource-group <ResourceGroupName>
   ```

# [Azure PowerShell](#tab/powershell)

Here's how to create a workspace using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Use the `New-AzWvdWorkspace` cmdlet with the following example to create a workspace. More parameters are available, such as to register existing application groups. For more information, see the [New-AzWvdWorkspace PowerShell reference](/powershell/module/az.desktopvirtualization/new-azwvdworkspace).

   ```azurepowershell
   New-AzWvdWorkspace -Name <Name> -ResourceGroupName <ResourceGroupName>
   ```

3. You can view the properties of your new workspace by running the following command:

   ```azurepowershell
   Get-AzWvdWorkspace -Name <Name> -ResourceGroupName <ResourceGroupName> | FL *
   ```

---

## Add an application group to a workspace

Next, to add an application group to a workspace, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to add an application group to a workspace using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Workspaces**, then select the name of the workspace you want to assign an application group to.

1. From the workspace overview, select **Application groups**, then select **+ Add**.

1. Select the plus icon (**+**) next to an application group from the list. Only application groups that aren't already assigned to a workspace are listed.

1. Select **Select**. The application group will be added to the workspace.

# [Azure CLI](#tab/cli)

Here's how to add an application group to a workspace using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for Azure CLI.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Use the `az desktopvirtualization workspace update` command with the following example to add an application group to a workspace:

   ```azurecli
   # Get the resource ID of the application group you want to add to the workspace
   appGroupPath=$(az desktopvirtualization applicationgroup show \
       --name <Name> \
       --resource-group <ResourceGroupName> \
       --query [id] \
       --output tsv)

   # Add the application group to the workspace
   az desktopvirtualization workspace update \
       --name <Name> \
       --resource-group <ResourceGroupName> \
       --application-group-references $appGroupPath
   ```

3. You can view the properties of your workspace by running the following command. The key **applicationGroupReferences** contains an array of the application groups added to the workspace.

   ```azurecli
   az desktopvirtualization applicationgroup show \
       --name <Name> \
       --resource-group <ResourceGroupName>
   ```

# [Azure PowerShell](#tab/powershell)

Here's how to add an application group to a workspace using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Use the `Update-AzWvdWorkspace` cmdlet with the following example to add an application group to a workspace:

   ```azurepowershell
   # Get the resource ID of the application group you want to add to the workspace
   $appGroupPath = (Get-AzWvdApplicationGroup -Name <Name -ResourceGroupName <ResourceGroupName>).Id

   # Add the application group to the workspace
   Update-AzWvdWorkspace -Name <Name> -ResourceGroupName <ResourceGroupName> -ApplicationGroupReference $appGroupPath
   ```

3. You can view the properties of your workspace by running the following command. The key **ApplicationGroupReference** contains an array of the application groups added to the workspace.

   ```azurepowershell
   Get-AzWvdWorkspace -Name <Name> -ResourceGroupName <ResourceGroupName> | FL *
   ```

---

## Assign users to an application group

Finally, to assign users or user groups to an application group, select the relevant tab for your scenario and follow the steps. We recommend you assign user groups to application groups to make ongoing management simpler.

# [Portal](#tab/portal)

Here's how to assign users or user groups to an application group to a workspace using the Azure portal.

1. From the host pool overview, select **Application groups**.

1. Select the application group from the list.

1. From the application group overview, select **Assignments**.

1. Select **+ Add**, then search for and select the user account or user group you want to assign to this application group.

1. Finish by selecting **Select**.

# [Azure CLI](#tab/cli)

Here's how to assign users or user groups to an application group to a workspace using the [role](/cli/azure/role/assignment) extension for Azure CLI.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Use the `az role assignment create` command with the following examples to assign users or user groups to an application group.

   1. To assign users to the application group, run the following commands:

      ```azurecli
      # Get the resource ID of the application group you want to add to the workspace
      appGroupPath=$(az desktopvirtualization applicationgroup show \
          --name <Name> \
          --resource-group <ResourceGroupName> \
          --query [id] \
          --output tsv)

      # Assign users to the application group
      az role assignment create \
          --assignee '<UserPrincipalName>' \
          --role 'Desktop Virtualization User' \
          --scope $appGroupPath
      ```

   1. To assign user groups to the application group, run the following commands:

      ```azurecli
      # Get the resource ID of the application group you want to add to the workspace
      appGroupPath=$(az desktopvirtualization applicationgroup show \
          --name <Name> \
          --resource-group <ResourceGroupName> \
          --query [id] \
          --output tsv)

      # Get the object ID of the user group you want to assign to the application group
      userGroupId=$(az ad group show \
          --group <UserGroupName> \
          --query [id] \
          --output tsv)

      # Assign users to the application group
      az role assignment create \
          --assignee $userGroupId \
          --role 'Desktop Virtualization User' \
          --scope $appGroupPath
      ```

# [Azure PowerShell](#tab/powershell)

Here's how to assign users or user groups to an application group to a workspace using [Az.Resources](/powershell/module/az.resources) PowerShell module.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Use the `New-AzRoleAssignment` cmdlet with the following examples to assign users or user groups to an application group.

   1. To assign users to the application group, run the following commands:

      ```azurepowershell
      $parameters = @{
          SignInName = '<UserPrincipalName>'
          ResourceName = '<ApplicationGroupName>'
          ResourceGroupName = '<ResourceGroupName>'
          RoleDefinitionName = 'Desktop Virtualization User'
          ResourceType = 'Microsoft.DesktopVirtualization/applicationGroups'
      }
      
      New-AzRoleAssignment @parameters
      ```

   1. To assign user groups to the application group, run the following commands:
   
      ```azurepowershell
      # Get the object ID of the user group you want to assign to the application group
      $userGroupId = (Get-AzADGroup -DisplayName "<UserGroupName>").Id

      # Assign users to the application group
      $parameters = @{
          ObjectId = $userGroupId
          ResourceName = '<ApplicationGroupName>'
          ResourceGroupName = '<ResourceGroupName>'
          RoleDefinitionName = 'Desktop Virtualization User'
          ResourceType = 'Microsoft.DesktopVirtualization/applicationGroups'
      }
      
      New-AzRoleAssignment @parameters
      ```

---

## Next steps

Now that you've created an application group and a workspace, added the application group to a workspace and assigned users, you'll need to:

- [Add session hosts to the host pool](add-session-hosts-host-pool.md), if you haven't done so already.

- [Add applications to an application group](manage-app-groups.md), if you created a RemoteApp application group.
