---
title: Start virtual machine connect - Azure
description: How to configure the start virtual machine on connect feature.
author: Heidilohr
ms.topic: how-to
ms.date: 02/09/2021
ms.author: helohr
manager: lizross
---
# Start virtual machine on connect (preview)

> [!IMPORTANT]
> The Start VM on Connect feature is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The start virtual machine (VM) on connect (preview) feature lets you save costs by letting you deallocate your VMs when you aren't using them. When you need to use the VM again, just turn it back on.

>[!NOTE]
>Windows Virtual Desktop (classic) doesn't support this feature.

## Requirements and limitations

The Start VM on Connect feature can only be enabled for personal host pools. To learn more about personal host pools, see [Windows Virtual Desktop environment](environment-setup.md#host-pools).

The following remote desktop clients support the Start VM on Connect feature:

- [The web client](connect-web.md)
- [The Windows client (version 1.2748 or later)](connect-windows-7-10.md)

We'll update this document when more clients are available. You can also check for announcements on the [Tech Community forum](https://aka.ms/wvdtc).

## Create a custom role for Start VM on Connect

Before you can configure the Start VM on Connect feature, you'll need to assign your VM a custom RBAC (role-based access control) role. This role will let Windows Virtual Desktop manage the VMs in your subscription. The service will also be able to turn on VMs, check their status, and report diagnostic info. If you want to know more about what roles are, take a look at [Azure custom roles](../role-based-access-control/custom-roles.md).

### Use the Azure portal

To use the Azure portal to assign a custom role for Start VM on Connect:

1. Open the Azure portal and go to **Subscriptions**.

2. Go to **Access control (IAM)** and select **Add a custom role**.

3. Next, name the custom role and add a description. We recommend you name it “start VM on connect.”

4. On the **Permissions** tab, add the following permissions to the subscription you're assigning the role to: 
 
   - Microsoft.Compute/virtualMachines/start/action
   - Microsoft.Compute/virtualMachines/read

5. When you're finished, select **Ok**.

After that, you'll need to assign the role to grant access to Windows Virtual Desktop.

To grant access:

1. In the **Access control (IAM) tab**, select **Add role assignments**.

2. Select the role you just created.

3. In the search bar, enter and select **Windows Virtual Desktop**.

      >[!NOTE]
      >You might see two apps if you have deployed Windows Virtual Desktop (classic). Assign the role to both app you see.

### Sample JSON file for creating custom role

If you're using JSON to create the custom role, the following example shows a basic template. Make sure you replace the subcription ID value with the subscription ID you want to assign the role to.

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

Pick the method that works best for you, then go to that section and follow the instructions to configure Start VM on Connect.

### Deployment considerations 

Start VM on Connect is a host pool setting. If you only want a select group of users has this feature, make sure you only assign the required role to the users you want to add.

>[!IMPORTANT]
> You can only configure this feature in existing host pools. This feature isn't available when you create a new host pool.

### Use the Azure portal

To use the Azure portal to configre Start VM on Connect:

1. Open your browser and go to [the Azure portal](https://portal.azure.com/?feature.startVMonConnect=true#home). We recommend you use an InPrivate window.

2. In the Azure portal, go to **Windows Virtual Desktop**.

3. Select **Host pools**, then find the host pool for personal desktops you assigned the role to.

   >[!NOTE]
   > The host pool you configure this feature in must have personal desktops with direct role assignments. If the host pool doesn't have correctly configured desktops, the configuration process won't work.

4. In the host pool, select **Properties**. Under **Start VM on connect**, select **Yes**, then select **Save** to instantly apply the setting.

### Use PowerShell

To configure this setting with PowerShell, you need to make sure you have the names of the resource group and host pools you want to configure. You'll also need to have [the Azure module (version 2.1.0 or later)](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/2.1.0) installed.

To configure the feature with Powershell:

1. Open a PowerShell command window.

2. Run the following cmldet to enable Start VM on Connect:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -StartVMOnConnect:$true
```

3. Run the following cmdlet to disable Start VM on Connect:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -StartVMOnConnect:$false
```

### Use REST API

<!---What is this section? It doesn't tell me how to use this new property. Also, a one-row table is kind of pointless.--->

Follow the instructions in [Create or update a host pool](/rest/api/desktopvirtualization/hostpools/createorupdate) with the following property:

| **Name**  | **Required** | **Type** | **Description**     |
|----|---|----|----|
| `Properties.startVMOnConnect` |   No           | Boolean  | Configure if VM should start from deallocated or stopped state. |

## User experience

The time it takes for a user to connect to a deallocated VM increases because the VM needs time to turn on again, much like turning on a physical computer. The Start VM on Connect feature has an indicator that lets you know when the remote PC running the VM you want to connect to is fully powered on. When the remote PC is fully powered on, you can connect to it much more quickly. Once the VM is turned on, the connection should work as normal.

## Troubleshooting

If the feature runs into any issues, we recommend you use the Windows Virtual Desktop [diagnostics feature](diagnostics-log-analytics.md) to check for problems. If you receive an error message, make sure to pay close attention to the message content and copy down the name somewhere you can find it later, for reference.

You can also use [Azure Monitor for Windows Virtual Desktop](azure-monitor.md) to get suggestions for how to resolve issues.

## Next steps

If you run into any issues that the troubleshooting documentation or the diagnostics feature couldn't solve, check out the [Start VM on Connect FAQ](vm-start-faq.md).