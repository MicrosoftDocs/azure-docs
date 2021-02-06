---
title: Start virtual machine connect - Azure
description: How to configure the start virtual machine on connect feature.
author: Heidilohr
ms.topic: how-to
ms.date: 03/30/2020
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

The Start VM on Connect feature can only be enabled for personal host pools. To learn more about personal host pools, see [Windows Virtual Desktop environment](environment-setup#host-pools.md).

The following remote desktop clients support the Start VM on Connect feature:

- [The web client](connect-web.md)
- [The Windows client (version 1.2748 or later)](connect-windows-7-10.md)

We'll update this document when more clients are available. You can also check for announcements on the [Tech Community forum](https://aka.ms/wvdtc).

## Create a custom role for Start VM on Connect

Before you can configure the Start VM on Connect feature, you'll need to assign your VM a custom RBAC (role-based access control) role. This role will let Windows Virtual Desktop manage the VMs in your subscription. The service will also be able to turn on VMs, check their status, and report diagnostic info. If you want to know more about what roles are, take a look at [Azure custom roles](../role-based-access-control/custom-roles.md).

There are three ways you can assign roles to your VM:

- [The Azure portal]()
- [PowerShell]()
- [REST API]()

Pick the method that works best for you, then go to the section and follow the instructions to assign the custom role to your VM.

### Use the Azure portal

To use the Azure portal to assign a custom role for Start VM on Connect:

1. Open the Azure portal and go to **Subscriptions**.

2. Go to **Access control (IAM)** and select **Add a custom role**.

![Graphical user interface, text, application Description automatically generated](media/82f8a5dc3a3264d7d59cd8438750932c.png)

3. Next name the custom role and add a description. We recommend to name it “start VM on connect” In the following we continue with instructions when starting from scratch. If you would like to leverage our sample JSON see next chapter.

4. On the “Permissions” tab add the following permissions: on the subscription: "Microsoft.Compute/virtualMachines/start/action",  "Microsoft.Compute/virtualMachines/read"

5. Complete the role creation.

Next grant Access to “Windows Virtual Desktop” app by assigning the new role.

6. In Access control (IAM) blade select Add Role Assignments.

7. Select the new created role.

8. Move to select field and search for Windows Virtual Desktop.

>[!NOTE]
>You might see two apps if you have deployed Windows Virtual Desktop (classic). Assign the role to both app you see.

![Graphical user interface, application Description automatically generated](media/9bf688fba5f66f4a88c0ca706b2ac795.png)

### Sample JSON file for creating custom role

Use this JSON example when creating your role. Don’t forget to replace the subscription ID in this sample.:

```json
{

"properties": {

"roleName": "start VM on connect",

"description": "Friendly description.",

"assignableScopes": [

"/subscriptions/\<SubscriptionID\>"

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

### Deployment considerations 

Start VM on connect is a setting on host pool level. If you would like to restrict this functionality to a specific set of users, we recommend to review assignments within the selected host pools.

>[!IMPORTANT]
> This feature can be set only for existing host pools. The setting is not available when creating a host pool.

### Using Azure Portal

Open a browser, preferably InPrivate browsing mode and load the following URL:
<https://portal.azure.com/?feature.startVMonConnect=true#home>

Next in the Azure Portal:

1. Navigate to “Windows Virtual Desktop”

2. Select “Host Pools” and locate the pool for personal desktops you set-up.

   >[!NOTE]
   > If you do not have the proper configured host pool set-up one that contains Personal Desktops with direct assignment.

3. On the host pool select “Properties” and switch Start VM on connect to “Yes” and select “Save” to apply the setting. It is applied instantly.

   ![Graphical user interface, text, application Description automatically generated](media/97ad4e38e505f73cf72fc5169e9d7ae9.png)

### Using PowerShell

For the host pool you want to update you need to have the resource group name and host pool name ready. This minimum version of the PowerShell module required is 2.1.0 <https://www.powershellgallery.com/packages/Az.DesktopVirtualization/2.1.0>

For enabling Start VM on Connect use the following:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -StartVMOnConnect:\$true
```

For disabling Start VM on Connect use the following:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -StartVMOnConnect:\$false
```

### Using REST API

The existing REST API for Host Pools – Update or Update ([Host Pools - Create Or Update (Azure Desktop Virtualization) \| Microsoft Docs](/rest/api/desktopvirtualization/hostpools/createorupdate)) is going to be enhanced by the following property

| **Name**                    | **Required** | **Type** | **Description**                                                 |
| Properties.startVMOnConnect |              | Boolean  | Configure if VM should start from deallocated or stopped state. |

## User experience

When a user connects to a deallocated VM the time to connect is increased as the VM needs to wake up. It is similar to the experience powering on a physical machine. Once the user selected the desktop they want to connect too the remote desktop client indicates that the remote PC is started.

![Graphical user interface, application Description automatically generated](media/b792bddf34a2bddff0feaf7a094a657c.png)

Once the VM is powered on the connection sequence will continue for the regular connection.

## Troubleshooting

To troubleshoot connectivity issues we recommend to leverage our [diagnostics feature](diagnostics-log-analytics.md). In the case a failed connection attempt error messages are available on the errors table. We recommend to review the message for details.

For customers leveraging [Use Monitor Windows Virtual Desktop Monitor preview - Azure \| Microsoft Docs](azure-monitor.md) will be able to review issues for VM starts here.

## Next steps

If you run into any issues that the troubleshooting documentation or the diagnostics feature couldn't solve, check out the [Start VM on Connect FAQ](vm-start-faq.md).