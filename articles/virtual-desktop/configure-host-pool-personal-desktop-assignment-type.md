---
title: Configure personal desktop assignment in Azure Virtual Desktop  - Azure
description: How to configure the assignment type of a personal host pool, unassign or reassign desktops, assign multiple desktops to a user, or set a friendly name for a desktop in Azure Virtual Desktop.
author: dougeby
ms.topic: how-to
ms.date: 05/28/2025
ms.author: avdcontent
ms.custom: devx-track-azurepowershell
---

# Configure personal desktop assignment

A personal host pool is a type of host pool that has personal desktops. Personal desktops have one-to-one mapping, which means a single user can only be assigned to a single personal desktop. Every time the user signs in, their user session is directed to their assigned personal desktop session host.

Personal desktops are ideal for users with resource-intensive workloads because the user experience and session performance improves if there's only one session on the session host. Another benefit of this host pool type is that user activities, files, and settings can persist on the virtual machine operating system (VM OS) disk after the user signs out because it's only for them.

Users can automatically be assigned to any previously unassigned personal desktop in the host pool when they connect. Alternatively, you can assign users to a specific personal desktop before they connect.

This article shows you how to configure personal desktop assignment in Azure Virtual Desktop. You can configure personal desktop assignment using the Azure portal, Azure PowerShell, or Azure CLI.

> [!NOTE]
> The instructions in this article only apply to personal host pools, not pooled host pools, since users in pooled host pools aren't assigned to specific session hosts.

## Prerequisites

To configure personal desktop assignment, you need to meet the following prerequisites:

- A personal host pool with at least one session host.

- An Azure account assigned the [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) role or equivalent.

- If you want to use Azure CLI or Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension or the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

- To assign multiple personal desktops to a user using PowerShell, you need to use version **5.3.0-preview** or later preview version of the *Az.DesktopVirtualization* PowerShell module. The non-preview version of the module doesn't contain the required values. You can download and install the Az.DesktopVirtualization PowerShell module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/).

## Configure automatic assignment

Automatic assignment assigns users a personal desktop the first time they connect. It's the default assignment type for new personal desktop host pools you create in your Azure Virtual Desktop environment. Automatically assigning users doesn't require a specific session host.

To automatically assign users, first assign them to the personal desktop host pool so that they can see the desktop on their local device. When an assigned user connects to that desktop for the first time, their user session is load-balanced to an available session host. You can still [assign a user directly to a session host](#configure-direct-assignment) before they connect, even if the assignment type is set automatic.

#### [Azure portal](#tab/azure)

To configure automatic assignment in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, enter *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the personal host pool you want to configure automatic assignment.

1. Next, select **Properties**, then go to the **Assignment** drop-down menu and select **Automatic**.

1. Select **Save**.

#### [Azure PowerShell](#tab/powershell)

Here's how to configure a host pool to automatically assign users to VMs using Azure PowerShell. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Run the command in the following example to configure a host pool to automatically assign users to session hosts:

   ```powershell
   $parameters = @{
      ResourceGroupName = '<ResourceGroupName>'
      Name = '<HostPoolName>'
      PersonalDesktopAssignmentType = 'Automatic'
   }

   Update-AzWvdHostPool @parameters
   ```

#### [Azure CLI](#tab/cli)

Here's how to configure a host pool to automatically assign users to VMs using the [desktopvirtualization](/cli/azure/desktopvirtualization) command. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Run the command in the following example to configure a host pool to automatically assign users to session hosts:

   ```azurecli
   az desktopvirtualization hostpool update \
       --resource-group <ResourceGroupName> \
       --name <HostPoolName> \
       --personal-desktop-assignment-type Automatic
   ```

---

## Configure direct assignment

Unlike automatic assignment, when you use direct assignment, you assign a specific personal desktop to a user first. You must assign the user to both the personal desktop host pool and a specific session host before they can connect to their personal desktop. If the user is only assigned to a host pool without a session host assignment, they aren't able to access resources and see an error message that says **No resources available**.

#### [Azure portal](#tab/azure)

To configure direct assignment in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the personal host pool you want to configure automatic assignment.

1. Next, select **Properties**, then go to the **Assignment** drop-down menu and select **Direct**.

1. Select **Save**.

#### [Azure PowerShell](#tab/powershell)

Here's how to configure a host pool to require direct assignment of users to session hosts using Azure PowerShell. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Run the command in the following example to configure a host pool to require direct assignment:

   ```powershell
   $parameters = @{
      ResourceGroupName = '<ResourceGroupName>'
      Name = '<HostPoolName>'
      PersonalDesktopAssignmentType = 'Direct'
   }

   Update-AzWvdHostPool @parameters
   ```

#### [Azure CLI](#tab/cli)

Here's how to configure a host pool to automatically assign users to VMs using the [desktopvirtualization](/cli/azure/desktopvirtualization) command. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Run the command in the following example to configure a host pool to automatically assign users to session hosts:

   ```azurecli
   az desktopvirtualization hostpool update \
       --resource-group <ResourceGroupName> \
       --name <HostPoolName> \
       --personal-desktop-assignment-type Direct
   ```

---

### Directly assign users to session hosts

Here's how to directly assign users to session hosts using the Azure portal or Azure PowerShell. You can't assign users to session hosts using Azure CLI.

#### [Azure portal](#tab/azure2)

To directly assign a user to a session host in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Enter **Azure Virtual Desktop** into the search bar.

1. Under **Services**, select **Azure Virtual Desktop**.

1. At the Azure Virtual Desktop overview page, go the menu on the left side of the window and select **Host pools**.

1. Select the host pool you want to assign users to.

1. Next, go to the menu on the left side of the window and select **Application groups**.

1. Select the name of the app group you want to assign users to, then select **Assignments** in the menu on the left side of the window.

1. Select **+ Add**, then select the users or user groups you want to assign to this app group.

1.  Select **Assign VM** in the Information bar to assign a session host to a user.

1. Select the session host you want to assign to the user, then select **Assign**. You can also select **Assignment** > **Assign user**.

1. Select the user you want to assign the session host to from the list of available users.

1. When you're done, select **Select**.

#### [Azure PowerShell](#tab/powershell2)

Here's how to configure a host pool to assign a user to a specific session host using Azure PowerShell. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Run the `Update-AzWvdHostPool` command in the following example to assign a user to a session host. For more information about the parameters, see the [Update-AzWvdHostPool](/powershell/module/az.desktopvirtualization/update-azwvdhostpool) reference.

   ```powershell
   $parameters = @{
      HostPoolName = '<HostPoolName>'
      Name = '<SessionHostName>'
      ResourceGroupName = '<ResourceGroupName>'
      AssignedUser = '<UserUPN>'
   }

   Update-AzWvdSessionHost @parameters
   ```

---

## Unassign a personal desktop

Here's how to unassign a personal desktop using the Azure portal or Azure PowerShell. You can't unassign a personal desktop using Azure CLI.

#### [Azure portal](#tab/azure2)

To unassign a personal desktop in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Enter **Azure Virtual Desktop** into the search bar.

1. Under **Services**, select **Azure Virtual Desktop**.

1. At the Azure Virtual Desktop overview page, go the menu on the left side of the window and select **Host pools**.

1. Select the host pool you want to modify user assignment for.

1. Next, go to the menu on the left side of the window and select **Session hosts**.

1. Select the checkbox next to the session host you want to unassign a user from, select the ellipses at the end of the row, and then select **Unassign user**. You can also select **Assignment** > **Unassign user**.

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the unassign user menu option from the ellipses menu for unassigning a personal desktop.](media/unassign.png)

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the unassign user menu option from the assignment menu for unassigning a personal desktop.](media/unassign-2.png)

1. Select **Unassign** when prompted with the warning.

#### [Azure PowerShell](#tab/powershell2)

Here's how to configure a host pool to unassign a personal desktop using Azure PowerShell. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Run the `Invoke-AzRestMethod` command in the following example to unassign a personal desktop. For more information about the parameters, see the [Invoke-AzRestMethod](/powershell/module/az.accounts/invoke-azrestmethod) reference.

   ```powershell
   $parameters = @{
       Path = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DesktopVirtualization/hostPools/$hostPoolName/sessionHosts/$($sessionHostName)?api-version=2022-02-10-preview&force=true"
       Payload = @{
           properties = @{
               assignedUser = ''
           }
       } | ConvertTo-Json
       Method = 'PATCH'
   }

   Invoke-AzRestMethod @parameters
   ```

---

## Reassign a personal desktop

Here's how to reassign a personal desktop using the Azure portal or Azure PowerShell. You can't reassign a personal desktop using Azure CLI.

#### [Azure portal](#tab/azure2)

To reassign a personal desktop in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Enter **Azure Virtual Desktop** into the search bar.

1. Under **Services**, select **Azure Virtual Desktop**.

1. At the Azure Virtual Desktop overview page, go the menu on the left side of the window and select **Host pools**.

1. Select the host pool you want to modify user assignment for.

1. Next, go to the menu on the left side of the window and select **Session hosts**.

1. Select the checkbox next to the session host you want to reassign to a different user, select the ellipses at the end of the row, and then select **Assign to a different user**. You can also select **Assignment** > **Assign to a different user**.

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the assign to a different user menu option from the ellipses menu for reassigning a personal desktop.](media/reassign-doc.png)

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the assign to a different user menu option from the assignment menu for reassigning a personal desktop.](media/reassign.png)

1. Select the user you want to assign the session host to from the list of available users.

1. When you're done, select **Select**.

#### [Azure PowerShell](#tab/powershell2)

Here's how to reassign a personal desktop using Azure PowerShell. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Run the following command to define the `$reassignUserUpn` variable by running the following command:

   ```powershell
   $reassignUserUpn = <UPN of user you are reassigning the desktop to>
   ```

3. Run the `Invoke-AzRestMethod` command in the following example to reassign a personal desktop. For more information about the parameters, see the [Invoke-AzRestMethod](/powershell/module/az.accounts/invoke-azrestmethod) reference.

   ```powershell
   $parameters = @{
       Path = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DesktopVirtualization/hostPools/$hostPoolName/sessionHosts/$($sessionHostName)?api-version=2022-02-10-preview&force=true"
       Payload = @{
           properties = @{
               assigneduser = $reassignUserUpn
           }
       } | ConvertTo-Json
       Method = 'PATCH'
   }

   Invoke-AzRestMethod @parameters
   ```

---

## Assign multiple personal desktops to a single user

Multiple personal desktop assignment allows you to assign more than one personal desktop to a single user in a single host pool. Multiple desktops are useful for users juggling diverse business roles, such as backend and frontend development or transitioning between testing and production environments. Previously, users were restricted to one personal desktop per host pool, meaning you needed to create multiple host pools for extra desktops. Multiple personal desktop assignment streamlines the process, eliminating the need for multiple host pools in this scenario, and simplifying user assignment management.

>[!IMPORTANT]
>- You can only assign multiple personal desktops to a single user for personal host pools with direct assignment type. Pooled host pools aren't supported and personal host pools with automatic assignment type aren't supported.
>
>- If you're using FSLogix and have a single FSLogix profile container for a single host pool, be sure to allow [multiple connections to FSLogix profile containers](/fslogix/concepts-multi-concurrent-connections#concurrent-connections) to avoid errors.
>
>- You should [Give session hosts in a personal host pool a friendly name](#give-session-hosts-in-a-personal-host-pool-a-friendly-name) so that your users can distinguish between the multiple personal desktops you assigned to them.
>
>- Once a host pool is enabled for multiple personal desktop assignment, it can't be disabled.

### Enable multiple personal desktop assignment

You can enable multiple personal desktop assignment when you create a personal host pool or configure an existing personal host pool. Here's how to enable multiple personal desktop assignment on an existing personal host pool. To learn how to create a personal host pool, see [Create a host pool](deploy-azure-virtual-desktop.md?pivots=host-pool-standard#create-a-host-pool-with-standard-management).

#### [Azure portal](#tab/azure2)

To enable multiple personal desktop assignment using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Enter **Azure Virtual Desktop** into the search bar.

1. Under **Services**, select **Azure Virtual Desktop**.

1. At the Azure Virtual Desktop overview page, go the menu on the left side of the window and select **Host pools**.

1. Select the existing host pool that you’d like to enable multiple personal desktop assignment on.

1. Under **Settings**, select **Properties** to view the host pool properties.

1. Ensure that **Assignment type** is set to **Direct**. If not, select **Direct**, then select **Save**. The assignment type must be **Direct** and saved before you continue. If you try to do both in a single step, you get an error message.

1. Check the box for **Assign multiple desktops to a single user**, then select **Save**.

#### [Azure PowerShell](#tab/powershell2)

To enable multiple personal desktop assignment using Azure PowerShell. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Use the [Update-AzWvdHostPool](/powershell/module/az.desktopvirtualization/update-azwvdhostpool) command to make sure the personal desktop assignment type of the host pool is set to **Direct**.

   ```powershell
   $parameters = @{
      ResourceGroupName = '<ResourceGroupName>'
      Name = '<HostPoolName>'
      PersonalDesktopAssignmentType = 'Direct'
   }

   Update-AzWvdHostPool @parameters
   ```


3. Use the [Update-AzWvdHostPool](/powershell/module/az.desktopvirtualization/update-azwvdhostpool) command to update an existing personal host pool to have multiple persistent load balancer type.

   ```powershell
   $parameters = @{
      ResourceGroupName = '<ResourceGroupName>'
      Name = '<HostPoolName>'
      LoadBalancerType = 'MultiplePersistent'
   }

   Update-AzWvdHostPool @parameters
   ```

---

### Assign multiple personal desktops to a user

Here's how to assign multiple personal desktops to a user using the Azure portal or Azure PowerShell. You can't assign multiple personal desktops to a user using Azure CLI.

#### [Azure portal](#tab/azure2)

To assign a user to multiple personal desktops to a user in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Enter **Azure Virtual Desktop** into the search bar.

1. Under **Services**, select **Azure Virtual Desktop**.

1. At the Azure Virtual Desktop overview page, select **Host pools**.

1. Select the existing host pool that has session hosts you want to assign to a user.

1. Under **Manage**, select **Session hosts** to view the session hosts in the host pool.

1. Select the checkbox next to the session host that you want to assign to a user.

1. Select **Assign** in the Assigned User column or select Assignment from the toolbar and **Assign user** from the dropdown menu.

1. In the new pane, search for and select the user you want to assign. Select **Assign**.

1. Repeat steps 4-6 for each session host that you want to assign the user to. There isn't a limit to the number of personal desktops you can assign to a user in a single host pool.

#### [Azure PowerShell](#tab/powershell2)

Here's how to assign a user to multiple personal desktops using Azure PowerShell. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Run the `Update-AzWvdSessionHost` command in the following example to assign a user to a personal desktop. For more information about the parameters, see the [Update-AzWvdSessionHost](/powershell/module/az.desktopvirtualization/update-azwvdsessionhost) reference.

   ```powershell
   $parameters = @{
      HostPoolName = '<HostPoolName>'
      Name = '<SessionHostName>'
      ResourceGroupName = '<ResourceGroupName>'
      AssignedUser = '<UserUPN>'
   }

   Update-AzWvdSessionHost @parameters
   ```

3. Repeat the same `Update-AzWvdSessionHost` command with a different session host name for the `Name` parameter to assign the user to multiple personal desktops in the same host pool. There's no limit to the number of personal desktops you can assign to a user in a single host pool.

---

## Give session hosts in a personal host pool a friendly name

You can give personal desktops you create *friendly names* to help users distinguish them in their feeds using PowerShell. The Azure portal or Azure CLI doesn't currently have a way to give session host friendly names.

[!INCLUDE [include-session-hosts-friendly-name](includes/include-session-hosts-friendly-name.md)]
