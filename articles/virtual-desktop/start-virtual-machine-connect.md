---
title: Start virtual machine connect - Azure
description: How to configure the start virtual machine on connect feature.
author: Heidilohr
ms.topic: how-to
ms.date: 03/30/2021
ms.author: helohr
manager: lizross
---
# Start virtual machine on connect (preview)

> [!IMPORTANT]
> The Start VM on Connect feature is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The start virtual machine (VM) on connect (preview) feature lets you save costs by letting you deallocate your VMs when you aren't using them. When you need to use the VM again, all you have to do is turn your VMs back on.

>[!NOTE]
>Windows Virtual Desktop (classic) doesn't support this feature.

## Requirements and limitations

You can only enable the Start VM on Connect feature for personal host pools. To learn more about personal host pools, see [Windows Virtual Desktop environment](environment-setup.md#host-pools).

The following remote desktop clients support the Start VM on Connect feature:

- [The web client](connect-web.md)
- [The Windows client (version 1.2748 or later)](connect-windows-7-10.md)

You can check for announcements about updates and client support on the [Tech Community forum](https://aka.ms/wvdtc).

>[!IMPORTANT]
>The Start VM on Connect feature currently only supports PowerShell and REST API, not the Azure portal. For more information, see [Create or update a host pool](/rest/api/desktopvirtualization/hostpools/createorupdate).

## Create a custom role for Start VM on Connect

Before you can configure the Start VM on Connect feature, you'll need to assign your VM a custom RBAC (role-based access control) role. This role will let Windows Virtual Desktop manage the VMs in your subscription. You can also use this role to turn on VMs, check their status, and report diagnostic info. If you want to know more about what each role does, take a look at [Azure custom roles](../role-based-access-control/custom-roles.md).
    
## Create a custom role with a JSON file template

If you're using a JSON file to create the custom role, the following example shows a basic template you can use. Make sure you replace the subscription ID value with the subscription ID you want to assign the role to.

```json
{
    "properties": {
        "roleName": "start VM on connect",
        "description": "Friendly description.",
        "assignableScopes": [
            "/subscriptions/<SubscriptionID>"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Compute/virtualMachines/start/action",
                    "Microsoft.Compute/virtualMachines/read"
                ],
                "notActions": [],
                "dataActions": [],
                "notDataActions": []
            }
        ]
    }
}
```

## Configure the Start VM on Connect feature

Now that you've assigned your subscription the role, it's time to configure the Start VM on Connect feature!

There are three ways you can configure the feature:

- [Use the Azure portal](#use-the-azure-portal)
- [Use PowerShell](#use-powershell)
- [Use REST API](#use-rest-api)

Choose the method that works best for you and follow the instructions in that section to configure Start VM on Connect.

### Deployment considerations 

Start VM on Connect is a host pool setting. If you only want a select group of users to use this feature, make sure you only assign the required role to the users you want to add.

>[!IMPORTANT]
> You can only configure this feature in existing host pools. This feature isn't available when you create a new host pool.

### Use PowerShell

To configure this setting with PowerShell, you need to make sure you have the names of the resource group and host pools you want to configure. You'll also need to install [the Azure PowerShell module (version 2.1.0 or later)](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/2.1.0).

To configure Start VM on Connect using PowerShell:

1. Open a PowerShell command window.

2. Run the following cmdlet to enable Start VM on Connect:

    ```powershell
    Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -StartVMOnConnect:$true
    ```

3. Run the following cmdlet to disable Start VM on Connect:

    ```powershell
    Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -StartVMOnConnect:$false
    ```

### Use REST API

Follow the instructions in [Create or update a host pool](/rest/api/desktopvirtualization/hostpools/createorupdate) with the following property:

| Name  | Required | Type | Description     |
|----|---|----|----|
| `Properties.startVMOnConnect` |   No           | Boolean  | Configure if VM should start from deallocated or stopped state. |

## User experience

In typical sessions, the time it takes for a user to connect to a deallocated VM increases because the VM needs time to turn on again, much like turning on a physical computer. The Remote Desktop client has an indicator that lets the user know the PC is being powered on while they're connecting.

## Troubleshooting

If the feature runs into any issues, we recommend you use the Windows Virtual Desktop [diagnostics feature](diagnostics-log-analytics.md) to check for problems. If you receive an error message, make sure to pay close attention to the message content and copy down the error name somewhere for reference.

You can also use [Azure Monitor for Windows Virtual Desktop](azure-monitor.md) to get suggestions for how to resolve issues.

## Next steps

If you run into any issues that the troubleshooting documentation or the diagnostics feature couldn't solve, check out the [Start VM on Connect FAQ](start-virtual-machine-connect-faq.md).