---
title: Create Azure Virtual Desktop (classic) host pool PowerShell - Azure
description: How to create a host pool in Azure Virtual Desktop (classic) with PowerShell cmdlets.
author: Heidilohr
ms.topic: how-to
ms.date: 08/08/2022
ms.author: helohr
manager: femila
---
# Create a host pool in Azure Virtual Desktop (classic) with PowerShell

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../create-host-pools-powershell.md).

Host pools are a collection of one or more identical virtual machines within Azure Virtual Desktop tenant environments. Each host pool can contain an application group that users can interact with as they would on a physical desktop.

## Use your PowerShell client to create a host pool

First, [download and import the Azure Virtual Desktop PowerShell module](/powershell/windows-virtual-desktop/overview/) to use in your PowerShell session if you haven't already.

Run the following cmdlet to sign in to the Azure Virtual Desktop environment

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
```

Next, run this cmdlet to create a new host pool in your Azure Virtual Desktop tenant:

```powershell
New-RdsHostPool -TenantName <tenantname> -Name <hostpoolname>
```

Run the next cmdlet to create a registration token to authorize a session host to join the host pool and save it to a new file on your local computer. You can specify how long the registration token is valid by using the -ExpirationHours parameter.

```powershell
New-RdsRegistrationInfo -TenantName <tenantname> -HostPoolName <hostpoolname> -ExpirationHours <number of hours> | Select-Object -ExpandProperty Token | Out-File -FilePath <PathToRegFile>
```

After that, run this cmdlet to add Microsoft Entra users to the default desktop application group for the host pool.

```powershell
Add-RdsAppGroupUser -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName "Desktop Application Group" -UserPrincipalName <userupn>
```

The **Add-RdsAppGroupUser** cmdlet doesn't support adding security groups and only adds one user at a time to the application group. If you want to add multiple users to the application group, rerun the cmdlet with the appropriate user principal names.

Run the following cmdlet to export the registration token to a variable, which you will use later in [Register the virtual machines to the Azure Virtual Desktop host pool](#register-the-virtual-machines-to-the-azure-virtual-desktop-host-pool).

```powershell
$token = (Export-RdsRegistrationInfo -TenantName <tenantname> -HostPoolName <hostpoolname>).Token
```

## Create virtual machines for the host pool

Now you can create an Azure virtual machine that can be joined to your Azure Virtual Desktop host pool.

You can create a virtual machine in multiple ways:

- [Create a virtual machine from an Azure Gallery image](../../virtual-machines/windows/quick-create-portal.md#create-virtual-machine)
- [Create a virtual machine from a managed image](../../virtual-machines/windows/create-vm-generalized-managed.md)
- [Create a virtual machine from an unmanaged image](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-from-user-image)

After you've created your session host virtual machines, [apply a Windows license to a session host VM](../apply-windows-license.md#manually-apply-a-windows-license-to-a-windows-client-session-host-vm) to run your Windows or Windows Server virtual machines without paying for another license.

## Prepare the virtual machines for Azure Virtual Desktop agent installations

You need to do the following things to prepare your virtual machines before you can install the Azure Virtual Desktop agents and register the virtual machines to your Azure Virtual Desktop host pool:

- You must domain-join the machine. This allows incoming Azure Virtual Desktop users to be mapped from their Microsoft Entra account to their Active Directory account and be successfully allowed access to the virtual machine.
- You must install the Remote Desktop Session Host (RDSH) role if the virtual machine is running a Windows Server OS. The RDSH role allows the Azure Virtual Desktop agents to install properly.

To successfully domain-join, do the following things on each virtual machine:

1. [Connect to the virtual machine](../../virtual-machines/windows/quick-create-portal.md#connect-to-virtual-machine) with the credentials you provided when creating the virtual machine.
2. On the virtual machine, launch **Control Panel** and select **System**.
3. Select **Computer name**, select **Change settings**, and then select **Change…**
4. Select **Domain** and then enter the Active Directory domain on the virtual network.
5. Authenticate with a domain account that has privileges to domain-join machines.

    >[!NOTE]
    > If you're joining your VMs to a Microsoft Entra Domain Services environment, ensure that your domain join user is also a member of the [AAD DC Administrators group](../../active-directory-domain-services/tutorial-create-instance-advanced.md#configure-an-administrative-group).

## Register the virtual machines to the Azure Virtual Desktop host pool

Registering the virtual machines to an Azure Virtual Desktop host pool is as simple as installing the Azure Virtual Desktop agents.

To register the Azure Virtual Desktop agents, do the following on each virtual machine:

1. [Connect to the virtual machine](../../virtual-machines/windows/quick-create-portal.md#connect-to-virtual-machine) with the credentials you provided when creating the virtual machine.
2. Download and install the Azure Virtual Desktop Agent.
   - Download the [Azure Virtual Desktop Agent](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RWrmXv).
   - Right-click the downloaded installer, select **Properties**, select **Unblock**, then select **OK**. This will allow your system to trust the installer.
   - Run the installer. When the installer asks you for the registration token, enter the value you got from the **Export-RdsRegistrationInfo** cmdlet.
3. Download and install the Azure Virtual Desktop Agent Bootloader.
   - Download the [Azure Virtual Desktop Agent Bootloader](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RWrxrH).
   - Right-click the downloaded installer, select **Properties**, select **Unblock**, then select **OK**. This will allow your system to trust the installer.
   - Run the installer.

>[!IMPORTANT]
>To help secure your Azure Virtual Desktop environment in Azure, we recommend you don't open inbound port 3389 on your VMs. Azure Virtual Desktop doesn't require an open inbound port 3389 for users to access the host pool's VMs. If you must open port 3389 for troubleshooting purposes, we recommend you use [just-in-time VM access](../../security-center/security-center-just-in-time.md).

## Next steps

Now that you've made a host pool, you can populate it with applications. To learn more about how to manage applications in Azure Virtual Desktop, see the Manage application groups tutorial.

> [!div class="nextstepaction"]
> [Manage application groups tutorial](../manage-app-groups.md)
