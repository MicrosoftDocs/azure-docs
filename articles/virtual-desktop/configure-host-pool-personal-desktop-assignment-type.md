---
title: Configure personal desktop assignment in Azure Virtual Desktop  - Azure
description: How to configure automatic or direct assignment for an Azure Virtual Desktop personal desktop host pool.
author: dknappettmsft
ms.topic: how-to
ms.date: 12/03/2024
ms.author: daknappe
ms.custom: devx-track-azurepowershell, docs_inherited
---
# Configure personal desktop assignment

A personal host pool is a type of host pool that has personal desktops. Personal desktops have one-to-one mapping, which means a single user can only be assigned to a single personal desktop. Every time the user signs in, their user session is directed to their assigned personal desktop session host. This host pool type is ideal for customers with resource-intensive workloads because user experience and session performance will improve if there's only one session on the session host. Another benefit of this host pool type is that user activities, files, and settings persist on the virtual machine operating system (VM OS) disk after the user signs out.

Users must be assigned to a personal desktop to start their session. You can configure the assignment type of your personal desktop host pool to adjust your Azure Virtual Desktop environment to better suit your needs. In this topic, we'll show you how to configure automatic or direct assignment for your users.

>[!NOTE]
> The instructions in this article only apply to personal desktop host pools, not pooled host pools, since users in pooled host pools aren't assigned to specific session hosts.

## Prerequisites

If you're using either the Azure portal or PowerShell method, you'll need the following things:

- A personal host pool with at least one session host.
- An Azure account assigned the [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) role.
- If you want to use Azure CLI or Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension or the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

If you're assigning desktops with PowerShell, you'll need to [download and install the Azure Virtual Desktop PowerShell module](powershell-module.md) if you haven't already.

## Configure automatic assignment

Automatic assignment assigns users a personal desktop the first time they connect. It's the default assignment type for new personal desktop host pools you create in your Azure Virtual Desktop environment. Automatically assigning users doesn't require a specific session host.

To automatically assign users, first assign them to the personal desktop host pool so that they can see the desktop in their feed. When an assigned user launches the desktop in their feed, their user session will be load-balanced to an available session host if they haven't already connected to the host pool. You can still [assign a user directly to a session host](#configure-direct-assignment) before they connect, even if the assignment type is set automatic.

#### [Azure portal](#tab/azure)

To configure automatic assignment in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, enter *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the personal host pool you want to configure automatic assignment.

1. Next, select **Properties**, then go to the **Assignment** drop-down menu and select **Automatic**.

1. Select **Save**.

#### [Azure PowerShell](#tab/powershell)

Here's how to configure a host pool to automatically assign users to VMs using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Run the command in the following example to configure a host pool to automatically assign users to session hosts:

   ```powershell
   Update-AzWvdHostPool -ResourceGroupName <ResourceGroupName> -Name <HostPoolName> -PersonalDesktopAssignmentType Automatic
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

Unlike automatic assignment, when you use direct assignment, you assign a specific personal desktop to a user first. You must assign the user to both the personal desktop host pool and a specific session host before they can connect to their personal desktop. If the user is only assigned to a host pool without a session host assignment, they won't be able to access resources and will see an error message that says **No resources available**.

#### [Azure portal](#tab/azure)

To configure direct assignment in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the personal host pool you want to configure automatic assignment.

1. Next, select **Properties**, then go to the **Assignment** drop-down menu and select **Direct**.

1. Select **Save**.

#### [Azure PowerShell](#tab/powershell)

Here's how to configure a host pool to require direct assignment of users to session hosts using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Run the command in the following example to configure a host pool to require direct assignment:

   ```powershell
   Update-AzWvdHostPool -ResourceGroupName <ResourceGroupName> -Name <HostPoolName> -PersonalDesktopAssignmentType Direct
   ```

#### [Azure CLI](#tab/cli)

Here's how to configure a host pool to automatically assign users to VMs using the [desktopvirtualization](/cli/azure/desktopvirtualization) command.  Be sure to change the `<placeholder>` values for your own.

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

1. At the Azure Virtual Desktop page, go the menu on the left side of the window and select **Host pools**.

1. Select the host pool you want to assign users to.

1. Next, go to the menu on the left side of the window and select **Application groups**.

1. Select the name of the app group you want to assign users to, then select **Assignments** in the menu on the left side of the window.

1. Select **+ Add**, then select the users or user groups you want to assign to this app group.

1.  Select **Assign VM** in the Information bar to assign a session host to a user.

1. Select the session host you want to assign to the user, then select **Assign**. You can also select **Assignment** > **Assign user**.

1. Select the user you want to assign the session host to from the list of available users.

1. When you're done, select **Select**.

#### [Azure PowerShell](#tab/powershell2)

Here's how to configure a host pool to assign a user to a specific session host using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Run the `Update-AzWvdHostPool` command in the following example to assign a user to a session host. For more information about the parameters, see the [Update-AzWvdHostPool](/powershell/module/az.desktopvirtualization/update-azwvdhostpool) reference.

   ```powershell
   Update-AzWvdSessionHost -HostPoolName <HostPoolName> -Name <SessionHostName> -ResourceGroupName <ResourceGroupName> -AssignedUser <UserUPN>
   ```

---

## Unassign a personal desktop

Here's how to unassign a personal desktop using the Azure portal or Azure PowerShell. You can't unassign a personal desktop using Azure CLI. 

#### [Azure portal](#tab/azure2)

To unassign a personal desktop in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Enter **Azure Virtual Desktop** into the search bar.

1. Under **Services**, select **Azure Virtual Desktop**.

1. At the Azure Virtual Desktop page, go the menu on the left side of the window and select **Host pools**.

1. Select the host pool you want to modify user assignment for.

1. Next, go to the menu on the left side of the window and select **Session hosts**.

1. Select the checkbox next to the session host you want to unassign a user from, select the ellipses at the end of the row, and then select **Unassign user**. You can also select **Assignment** > **Unassign user**.

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the unassign user menu option from the ellipses menu for unassigning a personal desktop.](media/unassign.png)
    
    > [!div class="mx-imgBorder"]
    > ![A screenshot of the unassign user menu option from the assignment menu for unassigning a personal desktop.](media/unassign-2.png)

1. Select **Unassign** when prompted with the warning.

#### [Azure PowerShell](#tab/powershell2)

Here's how to configure a host pool to unassign a personal desktop. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Run the `Invoke-AzRestMethod` command in the following example to unassign a personal desktop. For more information about the parameters, see the [Invoke-AzRestMethod](/powershell/module/az.accounts/invoke-azrestmethod) reference.

   ```powershell
   $unassignDesktopParams = @{
     Path = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DesktopVirtualization/hostPools/$hostPoolName/sessionHosts/$($sessionHostName)?api-version=2022-02-10-preview&force=true"
     Payload = @{
       properties = @{
         assignedUser = ''
       }} | ConvertTo-Json
     Method = 'PATCH'
   }
   Invoke-AzRestMethod @unassignDesktopParams
   ```

---

## Reassign a personal desktop

Here's how to reassign a personal desktop using the Azure portal or Azure PowerShell. You can't reassign a personal desktop using Azure CLI. 

#### [Azure portal](#tab/azure2)

To reassign a personal desktop in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Enter **Azure Virtual Desktop** into the search bar.

1. Under **Services**, select **Azure Virtual Desktop**.

1. At the Azure Virtual Desktop page, go the menu on the left side of the window and select **Host pools**.
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

Here's how to reassign a personal desktop using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Run the following command to define the `$reassignUserUpn` variable by running the following command:

   ```powershell
   $reassignUserUpn = <UPN of user you are reassigning the desktop to>
   ```

3. Run the `Invoke-AzRestMethod` command in the following example to reassign a personal desktop. For more information about the parameters, see the [Invoke-AzRestMethod](/powershell/module/az.accounts/invoke-azrestmethod) reference.

   ```powershell
   $reassignDesktopParams = @{
     Path = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DesktopVirtualization/hostPools/$hostPoolName/sessionHosts/$($sessionHostName)?api-version=2022-02-10-preview&force=true"
     Payload = @{
       properties = @{
         assigneduser = $reassignUserUpn
       }} | ConvertTo-Json
     Method = 'PATCH'
   }
   Invoke-AzRestMethod @reassignDesktopParams
   ```


---

## Give session hosts in a personal host pool a friendly name

You can give personal desktops you create *friendly names* to help users distinguish them in their feeds using PowerShell. The Azure portal or Azure CLI doesn't currently have a way to give session host friendly names.

[!INCLUDE [include-session-hosts-friendly-name](includes/include-session-hosts-friendly-name.md)]

## Next steps

Now that you've configured the personal desktop assignment type and given your session host a friendly name, you can sign in to an Azure Virtual Desktop client to test it as part of a user session. These articles will show you how to connect to a session using the client of your choice:

- [Connect with the Windows Desktop client](./users/connect-windows.md)
- [Connect with the web client](./users/connect-web.md)
- [Connect with the Android client](./users/connect-android-chrome-os.md)
- [Connect with the iOS client](./users/connect-ios-ipados.md)
- [Connect with the macOS client](./users/connect-macos.md)
