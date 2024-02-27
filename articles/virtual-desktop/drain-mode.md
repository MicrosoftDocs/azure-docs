---
title: Drain session hosts for maintenance in Azure Virtual Desktop
description: Learn how to enable drain mode to isolate session hosts for maintenance in Azure Virtual Desktop.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 02/23/2024
---

# Drain session hosts for maintenance in Azure Virtual Desktop

Drain mode enables you to isolate a session host when you want to perform maintenance without disruption to service. When a session host is set to drain, it won't accept new user sessions. Any new connections will be redirected to the next available session host. Existing connections to the session host will remain active until the user signs out or an administrator ends the session. Once there aren't any sessions remaining on the session host, you can perform the maintenance you need. Administrators can still remotely connect to the server directly without going through the Azure Virtual Desktop service.

This article shows you how to drain session hosts using the Azure portal or Azure PowerShell.

## Prerequisites

To drain session hosts, you need:

- A host pool with at least one session host.

- An Azure account assigned the [Desktop Virtualization Session Host Operator](rbac.md#desktop-virtualization-session-host-operator) role.

- If you want to use Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

## Enable and disable drain mode for a session host

Here's how to enable and disable drain mode for a session host using the Azure portal and PowerShell.

### [Azure portal](#tab/portal)

To enable drain mode for a session host and block new sessions in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. From the Azure Virtual Desktop overview page, select **Host pools**. 

1. Select the host pool that contains the session host you want to drain, then select **Session hosts**.

1. Check the box next to the session host you want to enable drain mode, then select **Turn drain mode on**.

1. When you're ready to allow new connections to the session host, check the box next to the session host you want to disable drain mode, then select **Turn drain mode off**.

### [Azure PowerShell](#tab/powershell)

You can set drain mode in PowerShell with the *AllowNewSessions* parameter, which is part of the [Update-AzWvdSessionhost](/powershell/module/az.desktopvirtualization/update-azwvdsessionhost) command. You'll need to run these commands for every session host for which you want to enable and disable drain.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. To enable drain for a session host and block new sessions, run the following command:

   ```powershell
   $params = @{
       ResourceGroupName = '<ResourceGroupName>'
       HostPoolName = '<HostPoolName>'
       Name = '<SessionHostName>'
       AllowNewSession = $False
   }

   Update-AzWvdSessionHost @params
   ```

3. To disable drain for a session host and allow new sessions, run the following command:

   ```powershell
   $params = @{
       ResourceGroupName = '<ResourceGroupName>'
       HostPoolName = '<HostPoolName>'
       Name = '<SessionHostName>'
       AllowNewSession = $True
   }

   Update-AzWvdSessionHost @params
   ```

---
