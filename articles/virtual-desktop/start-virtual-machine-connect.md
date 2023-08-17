---
title: Set up Start VM on Connect for Azure Virtual Desktop
description: How to set up the Start VM on Connect feature for Azure Virtual Desktop to turn on session host virtual machines only when they're needed.
author: Heidilohr
ms.topic: how-to
ms.date: 03/14/2023
ms.author: helohr
manager: femila
ms.custom: subject-rbac-steps
---
# Set up Start VM on Connect

Start VM On Connect lets you reduce costs by enabling end users to turn on their session host virtual machines (VMs) only when they need them. You can then turn off VMs when they're not needed.

You can configure Start VM on Connect for personal or pooled host pools using the Azure portal or PowerShell. Start VM on Connect is a host pool setting.

For personal host pools, Start VM On Connect will only turn on an existing session host VM that has already been assigned or will be assigned to a user. For pooled host pools, Start VM On Connect will only turn on a session host VM when none are turned on and additional VMs will only be turned on when the first VM reaches the session limit.

The time it takes for a user to connect to a session host VM that is powered off (deallocated) increases because the VM needs time to turn on again, much like turning on a physical computer. The Remote Desktop client has an indicator that lets the user know the VM is being powered on while they're connecting.

> [!NOTE]
> Azure Virtual Desktop (classic) doesn't support Start VM On Connect.

## Prerequisites

To use Start VM on Connect, make sure you follow these guidelines:

- You can only configure Start VM on Connect on existing host pools. You can't enable it at the same time you create a new host pool.
- The following Remote Desktop clients support Start VM on Connect:
    - The [Windows client](./users/connect-windows.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) (version 1.2.2061 or later)
    - The [Web client](./users/connect-web.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)
    - The [macOS client](./users/connect-macos.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) (version 10.6.4 or later)
    - The [iOS and iPadOS client](./users/connect-ios-ipados.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) (version 10.2.5 or later)
    - The [Android and Chrome OS client](./users/connect-android-chrome-os.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) (version 10.0.10 or later)
    - The [Microsoft Store client](./users/connect-microsoft-store.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) (version 10.2.2005.0 or later)
    - Thin clients listed in [Thin client support](./users/connect-thin-clients.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)
- If you want to configure Start VM on Connect using PowerShell, you'll need to have [the Az.DesktopVirtualization PowerShell module](https://www.powershellgallery.com/packages/Az.DesktopVirtualization) (version 2.1.0 or later) installed on the device you use to run the commands.
- You must grant Azure Virtual Desktop access to power on session host VMs, check their status, and report diagnostic information. You must have the `Microsoft.Authorization/roleAssignments/write` permission on your subscriptions in order to assign the role-based access control (RBAC) role for the Azure Virtual Desktop service principal on those subscriptions. This is part of **User Access Administrator** and **Owner** built in roles.
- If you enable Start VM on Connect on a host pool, you must make sure that the host pool name, the names of the session hosts in that host pool, and the resource group name don't have non-ANSI characters. If their names contain non-ANSI characters, then Start VM on Connect won't work as expected.

## Assign the Desktop Virtualization Power On Contributor role with the Azure portal

Before you can configure Start VM on Connect, you'll need to assign the *Desktop Virtualization Power On Contributor* role-based access control (RBAC) role to the Azure Virtual Desktop service principal with your Azure subscription as the assignable scope. Assigning this role at any level lower than your subscription, such as the resource group, host pool, or VM, will prevent Start VM on Connect from working properly.

You'll need to add each Azure subscription as an assignable scope that contains host pools and session host VMs you want to use with Start VM on Connect. This role and assignment will allow Azure Virtual Desktop to power on VMs, check their status, and report diagnostic information in those subscriptions.

To learn how to assign the *Desktop Virtualization Power On Contributor* role to the Azure Virtual Desktop service principal, see [Assign RBAC roles to the Azure Virtual Desktop service principal](service-principal-assign-roles.md).

## Enable or disable Start VM on Connect

Now that you've assigned the *Desktop Virtualization Power On Contributor* role to the service principal on your subscriptions, you can configure Start VM on Connect using the Azure portal or PowerShell.

# [Portal](#tab/azure-portal)

To configure Start VM on Connect using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the name of the host pool where you want to enable the setting.

1. Select **Properties**.

1. In the configuration section, you'll see **Start VM on connect**. Select **Yes** to enable it, or **No** to disable it.

2. Select **Save** to apply the settings.

# [PowerShell](#tab/azure-powershell)

You need to make sure you have the names of the resource group and host pool you want to configure. To configure Start VM on Connect using PowerShell:

1. Open a PowerShell prompt.

1. Sign in to Azure using the `Connect-AzAccount` cmdlet. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps)

1. Find the name of the subscription that contains host pools and session host VMs you want to use with Start VM on Connect by listing all that are available to you:

   ```powershell
   Get-AzSubscription
   ```

1. Change your current Azure session to use the subscription you identified in the previous step, replacing the value for `-SubscriptionName` with the name or ID of the subscription:

   ```powershell
   Set-AzContext -Subscription "<subscription name or id>"
   ```

1. To enable or disable Start VM on Connect, do one of the following steps:

   1. To enable Start VM on Connect, run the following command, replacing the value for `-ResourceGroupName` and `-Name` with your values:

       ```powershell
       Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -StartVMOnConnect:$true
       ```

   1. To disable Start VM on Connect, run the following command, replacing the value for `-ResourceGroupName` and `-Name` with your values:

      ```powershell
      Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -StartVMOnConnect:$false
      ```

---

>[!NOTE]
>In pooled host pools, Start VM on Connect will start a VM every five minutes at most. If other users try to sign in during this five-minute period while there aren't any available resources, Start VM on Connect won't start a new VM. Instead, the users trying to sign in will receive an error message that says, "No resources available."

## Troubleshooting

If you run into any issues with Start VM On Connect, we recommend you use the Azure Virtual Desktop [diagnostics feature](diagnostics-log-analytics.md) to check for problems. If you receive an error message, make sure to pay close attention to the message content and make a note of the error name for reference. You can also use [Azure Virtual Desktop Insights](insights.md) to get suggestions for how to resolve issues.

If the session host VM doesn't turn on, you'll need to check the health of the VM you tried to turn on as a first step.

> [!NOTE]
> Connecting to a session host outside of Azure Virtual Desktop that is powered off, such as by using the MSTSC client, won't start the VM.

For other questions, check out the [Start VM on Connect FAQ](start-virtual-machine-connect-faq.md).

## Next steps

For more information about Start VM on Connect, see our [Start VM on Connect FAQ](start-virtual-machine-connect-faq.md).
