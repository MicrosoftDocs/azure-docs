---
title: Create Windows Virtual Desktop host pool PowerShell - Azure
description: How to create a host pool in Windows Virtual Desktop with PowerShell cmdlets.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: helohr
manager: lizross
---
# Create a host pool with PowerShell

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/create-host-pools-powershell-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Each host pool can be associated with multiple RemoteApp groups, one desktop app group, and multiple session hosts.

## Prerequisites

This article assumes you've already followed the instructions in [Set up the PowerShell module](powershell-module.md).

## Use your PowerShell client to create a host pool

Run the following cmdlet to sign in to the Windows Virtual Desktop environment:

```powershell
New-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -WorkspaceName <workspacename> -HostPoolType <Pooled|Personal> -LoadBalancerType <BreadthFirst|DepthFirst|Persistent> -Location <region> -DesktopAppGroupName <appgroupname> 
```

This cmdlet will create the host pool, workspace and desktop app group. Additionally, it will register the desktop app group to the workspace. You can either create a workspace with this cmdlet or use an existing workspace. 

Run the next cmdlet to create a registration token to authorize a session host to join the host pool and save it to a new file on your local computer. You can specify how long the registration token is valid by using the -ExpirationHours parameter.

>[!NOTE]
>The token's expiration date can be no less than an hour and no more than one month. If you set *-ExpirationTime* outside of that limit, the cmdlet won't create the token.

```powershell
New-AzWvdRegistrationInfo -ResourceGroupName <resourcegroupname> -HostPoolName <hostpoolname> -ExpirationTime $((get-date).ToUniversalTime().AddDays(1).ToString('yyyy-MM-ddTHH:mm:ss.fffffffZ'))
```

For example, if you want to create a token that expires in two hours, run this cmdlet: 

```powershell
New-AzWvdRegistrationInfo -ResourceGroupName <resourcegroupname> -HostPoolName <hostpoolname> -ExpirationTime $((get-date).ToUniversalTime().AddHours(2).ToString('yyyy-MM-ddTHH:mm:ss.fffffffZ')) 
```

After that, run this cmdlet to add Azure Active Directory users to the default desktop app group for the host pool.

```powershell
New-AzRoleAssignment -SignInName <userupn> -RoleDefinitionName "Desktop Virtualization User" -ResourceName <hostpoolname+"-DAG"> -ResourceGroupName <resourcegroupname> -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups' 
```

Run this next cmdlet to add Azure Active Directory user groups to the default desktop app group for the host pool:

```powershell
New-AzRoleAssignment -ObjectId <usergroupobjectid> -RoleDefinitionName "Desktop Virtualization User" -ResourceName <hostpoolname+“-DAG”> -ResourceGroupName <resourcegroupname> -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups'
```

Run the following cmdlet to export the registration token to a variable, which you will use later in [Register the virtual machines to the Windows Virtual Desktop host pool](#register-the-virtual-machines-to-the-windows-virtual-desktop-host-pool).

```powershell
$token = Get-AzWvdRegistrationInfo -ResourceGroupName <resourcegroupname> -HostPoolName <hostpoolname> 
```

## Create virtual machines for the host pool

Now you can create an Azure virtual machine that can be joined to your Windows Virtual Desktop host pool.

You can create a virtual machine in multiple ways:

- [Create a virtual machine from an Azure Gallery image](../virtual-machines/windows/quick-create-portal.md#create-virtual-machine)
- [Create a virtual machine from a managed image](../virtual-machines/windows/create-vm-generalized-managed.md)
- [Create a virtual machine from an unmanaged image](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-user-image-data-disks)

>[!NOTE]
>If you're deploying a virtual machine using Windows 7 as the host OS, the creation and deployment process will be a little different. For more details, see [Deploy a Windows 7 virtual machine on Windows Virtual Desktop](./virtual-desktop-fall-2019/deploy-windows-7-virtual-machine.md).

After you've created your session host virtual machines, [apply a Windows license to a session host VM](./apply-windows-license.md#apply-a-windows-license-to-a-session-host-vm) to run your Windows or Windows Server virtual machines without paying for another license. 

## Prepare the virtual machines for Windows Virtual Desktop agent installations

You need to do the following things to prepare your virtual machines before you can install the Windows Virtual Desktop agents and register the virtual machines to your Windows Virtual Desktop host pool:

- You must domain-join the machine. This allows incoming Windows Virtual Desktop users to be mapped from their Azure Active Directory account to their Active Directory account and be successfully allowed access to the virtual machine.
- You must install the Remote Desktop Session Host (RDSH) role if the virtual machine is running a Windows Server OS. The RDSH role allows the Windows Virtual Desktop agents to install properly.

To successfully domain-join, do the following things on each virtual machine:

1. [Connect to the virtual machine](../virtual-machines/windows/quick-create-portal.md#connect-to-virtual-machine) with the credentials you provided when creating the virtual machine.
2. On the virtual machine, launch **Control Panel** and select **System**.
3. Select **Computer name**, select **Change settings**, and then select **Change…**
4. Select **Domain** and then enter the Active Directory domain on the virtual network.
5. Authenticate with a domain account that has privileges to domain-join machines.

    >[!NOTE]
    > If you're joining your VMs to an Azure Active Directory Domain Services (Azure AD DS) environment, ensure that your domain join user is also a member of the [AAD DC Administrators group](../active-directory-domain-services/tutorial-create-instance-advanced.md#configure-an-administrative-group).

## Register the virtual machines to the Windows Virtual Desktop host pool

Registering the virtual machines to a Windows Virtual Desktop host pool is as simple as installing the Windows Virtual Desktop agents.

To register the Windows Virtual Desktop agents, do the following on each virtual machine:

1. [Connect to the virtual machine](../virtual-machines/windows/quick-create-portal.md#connect-to-virtual-machine) with the credentials you provided when creating the virtual machine.
2. Download and install the Windows Virtual Desktop Agent.
   - Download the [Windows Virtual Desktop Agent](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RWrmXv).
   - Run the installer. When the installer asks you for the registration token, enter the value you got from the **Get-AzWvdRegistrationInfo** cmdlet.
3. Download and install the Windows Virtual Desktop Agent Bootloader.
   - Download the [Windows Virtual Desktop Agent Bootloader](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RWrxrH).
   - Run the installer.

>[!IMPORTANT]
>To help secure your Windows Virtual Desktop environment in Azure, we recommend you don't open inbound port 3389 on your VMs. Windows Virtual Desktop doesn't require an open inbound port 3389 for users to access the host pool's VMs. If you must open port 3389 for troubleshooting purposes, we recommend you use [just-in-time VM access](../security-center/security-center-just-in-time.md). We also recommend you don't assign your VMs to a public IP.

## Next steps

Now that you've made a host pool, you can populate it with RemoteApps. To learn more about how to manage apps in Windows Virtual Desktop, see the Manage app groups tutorial.

> [!div class="nextstepaction"]
> [Manage app groups tutorial](./manage-app-groups.md)
