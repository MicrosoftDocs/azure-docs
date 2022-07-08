---
title: Set up Start VM on Connect for Azure Virtual Desktop
description: How to set up the Start VM on Connect feature for Azure Virtual Desktop to turn on session host virtual machines only when they're needed.
author: Heidilohr
ms.topic: how-to
ms.date: 05/13/2022
ms.author: helohr
manager: femila
ms.custom: subject-rbac-steps
---
# Set up Start VM on Connect

Start VM On Connect lets you reduce costs by enabling end users to turn on their session host virtual machines (VMs) only when they need them. You can them turn off VMs when they're not needed.

You can configure Start VM on Connect for personal or pooled host pools using the Azure portal or PowerShell. Start VM on Connect is a host pool setting.

For personal host pools, Start VM On Connect will only turn on an existing session host VM that has already been assigned or will be assigned to a user. For pooled host pools, Start VM On Connect will only turn on a session host VM when none are turned on and additional VMs will only be turned on when the first VM reaches the session limit.

The time it takes for a user to connect to a session host VM that is powered off (deallocated) increases because the VM needs time to turn on again, much like turning on a physical computer. The Remote Desktop client has an indicator that lets the user know the VM is being powered on while they're connecting.

> [!NOTE]
> Azure Virtual Desktop (classic) doesn't support Start VM On Connect.

## Prerequisites

You can only configure Start VM on Connect on existing host pools. You can't enable it at the same time you create a new host pool.

The following Remote Desktop clients support Start VM on Connect:

- The [web client](./user-documentation/connect-web.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)
- The [Windows client](./user-documentation/connect-windows-7-10.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) (version 1.2.2061 or later)
- The [Android client](./user-documentation/connect-android.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) (version 10.0.10 or later)
- The [macOS client](./user-documentation/connect-macos.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) (version 10.6.4 or later)
- The [iOS client](./user-documentation/connect-ios.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) (version 10.2.5 or later)
- The [Microsoft Store client](./user-documentation/connect-microsoft-store.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) (version 10.2.2005.0 or later)
- Thin clients listed in [Thin client support](./user-documentation/linux-overview.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)

If you want to configure Start VM on Connect using PowerShell, you'll need to have [the Az.DesktopVirtualization PowerShell module](https://www.powershellgallery.com/packages/Az.DesktopVirtualization) (version 2.1.0 or later) installed on the device you use to run the commands.

You must grant Azure Virtual Desktop access to power on session host VMs, check their status, and report diagnostic information.

## Create a custom RBAC role in the Azure portal

Before you can configure Start VM on Connect, you'll need to create a custom role-based access control (RBAC) role with your Azure subscription as the assignable scope. Assigning this custom role at any level lower than your subscription, such as the resource group, host pool, or VM, will prevent Start VM on Connect from working properly. You'll need to add each Azure subscription as an assignable scope that contains host pools and session host VMs you want to use with Start VM on Connect. This custom role and assignment will allow Azure Virtual Desktop to power on VMs, check their status, and report diagnostic information in those subscriptions. For more information about creating custom roles, see [Azure custom roles](../role-based-access-control/custom-roles.md). 

> [!IMPORTANT]
> You must have the `Microsoft.Authorization/roleAssignments/write` permission on your subscriptions in order to create and assign the custom role for the Azure Virtual Desktop service principal on those subscriptions. This is part of **User Access Administrator** and **Owner** built in roles.

To create the custom role with the Azure portal:

1. Open the Azure portal and go to **Subscriptions** and select a subscription that contains a host pool and session host VMs you want to use with Start VM on Connect.

1. Select **Access control (IAM)**.

1. Select the **+ Add** button, then select **Add custom role** from the drop-down menu.

1. Next, on the **Basics** tab, enter a custom role name and add a description. We recommend you name the role *Azure Virtual Desktop Start VM on Connect* with the description *Turns on session host VMs when users connect to them*.

1. For baseline permissions, select **Start from scratch** and select **Next**.

1. On the **Permissions** tab, select Next. You'll add the permissions later on the JSON tab.

1. On the **Assignable scopes** tab, your subscription will be listed. If you also want to assign this custom role to other subscriptions containing host pools and session host VMs, select **Add assignable scopes** and add the relevant subscriptions.

1. On the **JSON** tab, select **Edit** and add the following permissions to the `"actions": []` array. These entries must be enclosed within the square brackets.

    ```json
    "Microsoft.Compute/virtualMachines/start/action",
    "Microsoft.Compute/virtualMachines/read",
    "Microsoft.Compute/virtualMachines/instanceView/read"
    ```

   The completed JSON should look like this, with the subscription ID for each subscription included as assignable scopes:

    ```json
    {
        "properties": {
            "roleName": "Azure Virtual Desktop Start VM on Connect",
            "description": "Turns on session host VMs when users connect to them",
            "assignableScopes": [
                "/subscriptions/00000000-0000-0000-0000-000000000000"
            ],
            "permissions": [
                {
                    "actions": [
                        "Microsoft.Compute/virtualMachines/start/action",
                        "Microsoft.Compute/virtualMachines/read",
                        "Microsoft.Compute/virtualMachines/instanceView/read"
                    ],
                    "notActions": [],
                    "dataActions": [],
                    "notDataActions": []
                }
            ]
        }
    }
    ```

1. Select **Save**, then select **Next**.

1. Review the configuration and select **Create**. Once the role has been successfully created, select **OK**. Note that it may take a few minutes to display everywhere.

After you've created the custom role, you'll need to assign it to the Azure Virtual Desktop service principal and grant access to each subscription.

## Assign the custom role with the Azure portal

To assign the custom role with the Azure portal to the Azure Virtual Desktop service principal on the subscription your host pool is deployed to:

1. Open the Azure portal and go to **Subscriptions**. Select a subscription that contains a host pool and session host VMs you want to use with Start VM on Connect.

1. Select **Access control (IAM)**.

1. Select the **+ Add** button, then select **Add role assignment** from the drop-down menu.

1. Select the role you just created, for example **Azure Virtual Desktop Start VM on Connect** and select **Next**.

1. On the **Members** tab, select **User, group, or service principal**, then select **+Select members**. In the search bar, enter and select either **Azure Virtual Desktop** or **Windows Virtual Desktop**. Which value you have depends on when the *Microsoft.DesktopVirtualization* resource provider was first registered in your Azure tenant. If you see two entries titled Windows Virtual Desktop, please see the tip below.

1. Select **Review + assign** to complete the assignment. Repeat this for any other subscriptions that contain host pools and session host VMs you want to use with Start VM on Connect.

> [!TIP]
> The application ID for the service principal is **9cdead84-a844-4324-93f2-b2e6bb768d07**.
>
> If you have an Azure Virtual Desktop (classic) deployment and an Azure Virtual Desktop (Azure Resource Manager) deployment where the *Microsoft.DesktopVirtualization* resource provider was registered before the display name changed, you will see two apps with the same name of *Windows Virtual Desktop*. To add the role assignment to the correct service principal, [you can use PowerShell](../role-based-access-control/role-assignments-powershell.md) which enables you to specify the application ID:
>
> To assign the custom role with PowerShell to the Azure Virtual Desktop service principal on the subscription your host pool is deployed to:
>
> 1. Open [Azure Cloud Shell](../cloud-shell/overview.md) with PowerShell as the shell type.
>
> 1. Get the object ID for the service principal (which is unique in each Azure tenant) and store it in a variable:
>
>    ```powershell
>    $objId = (Get-AzADServicePrincipal -AppId "9cdead84-a844-4324-93f2-b2e6bb768d07").Id
>    ```
>
> 1. Find the name of the subscription you want to add the role assignment to by listing all that are available to you:
>
>    ```powershell
>    Get-AzSubscription
>    ```
>
> 1. Get the subscription ID and store it in a variable, replacing the value for `-SubscriptionName` with the name of the subscription from the previous step:
>
>    ```powershell
>    $subId = (Get-AzSubscription -SubscriptionName "Microsoft Azure Enterprise").Id
>    ```
>
> 1. Add the role assignment, where `-RoleDefinitionName` is the name of the custom role you created earlier:
>
>    ```powershell
>    New-AzRoleAssignment -RoleDefinitionName "Azure Virtual Desktop Start VM on Connect" -ObjectId $objId -Scope /subscriptions/$subId
>    ```

## Enable or disable Start VM on Connect

Now that you've assigned the custom role to the service principal on your subscriptions, you can configure Start VM on Connect using the Azure portal or PowerShell.

# [Portal](#tab/azure-portal)

To configure Start VM on Connect using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the name of the host pool where you want to enable the setting.

1. Select **Properties**.

1. In the configuration section, you'll see **Start VM on connect**. Select **Yes** to enable it, or **No** to disable it.

1. Select **Save**. The new setting is applied.

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

## Troubleshooting

If you run into any issues with Start VM On Connect, we recommend you use the Azure Virtual Desktop [diagnostics feature](diagnostics-log-analytics.md) to check for problems. If you receive an error message, make sure to pay close attention to the message content and make a note of the error name for reference. You can also use [Azure Monitor for Azure Virtual Desktop](azure-monitor.md) to get suggestions for how to resolve issues.

If the session host VM doesn't turn on, you'll need to check the health of the VM you tried to turn on as a first step.

For other questions, check out the [Start VM on Connect FAQ](start-virtual-machine-connect-faq.md).
