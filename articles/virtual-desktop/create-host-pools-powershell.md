---
title: Create a Windows Virtual Desktop Preview host pool with PowerShell  - Azure
description: How to create a host pool in Windows Virtual Desktop Preview with PowerShell cmdlets.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: helohr
---
# Create a host pool with PowerShell

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop Preview tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

## Use your PowerShell client to create a host pool

First, [download and import the Windows Virtual Desktop PowerShell module](https://docs.microsoft.com/powershell/windows-virtual-desktop/overview) to use in your PowerShell session if you haven't already.

Run the following cmdlet to sign in to the Windows Virtual Desktop environment

```powershell
Add-RdsAccount -DeploymentUrl https://rdbroker.wvd.microsoft.com
```

Next, run this cmdlet to create a new host pool in your Windows Virtual Desktop tenant:

```powershell
New-RdsHostPool -TenantName <tenantname> -Name <hostpoolname>
```

Run the next cmdlet to create a registration token to authorize a session host to join the host pool and save it to a new file on your local computer. You can specify how long the registration token is valid by using the -ExpirationHours parameter.

```powershell
New-RdsRegistrationInfo -TenantName <tenantname> -HostPoolName <hostpoolname> -ExpirationHours <number of hours> | Select-Object -ExpandProperty Token > <PathToRegFile>
```

After that, run this cmdlet to add Azure Active Directory users to the default desktop app group for the host pool.

```powershell
Add-RdsAppGroupUser -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName "Desktop Application Group" -UserPrincipalName <userupn>
```

The **Add-RdsAppGroupUser** cmdlet doesn't support adding security groups and only adds one user at a time to the app group. If you want to add multiple users to the app group, rerun the cmdlet with the appropriate user principal names.

Run the following cmdlet to export the registration token to a variable, which you will use later in [Register the virtual machines to the Windows Virtual Desktop host pool](#register-the-virtual-machines-to-the-windows-virtual-desktop-preview-host-pool).

```powershell
$token = (Export-RdsRegistrationInfo -TenantName <tenantname> -HostPoolName <hostpoolname>).Token
```

## Create virtual machines for the host pool

Now you can create an Azure virtual machine that can be joined to your Windows Virtual Desktop host pool.

You can create a virtual machine in multiple ways:

- [Create a virtual machine from an Azure Gallery image](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal#create-virtual-machine)
- [Create a virtual machine from a managed image](https://docs.microsoft.com/azure/virtual-machines/windows/create-vm-generalized-managed)
- [Create a virtual machine from an unmanaged image](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-from-user-image)

## Prepare the virtual machines for Windows Virtual Desktop Preview agent installations

You need to do the following things to prepare your virtual machines before you can install the Windows Virtual Desktop agents and register the virtual machines to your Windows Virtual Desktop host pool:

- You must domain-join the machine. This allows incoming Windows Virtual Desktop users to be mapped from their Azure Active Directory account to their Active Directory account and be successfully allowed access to the virtual machine.
- You must install the Remote Desktop Session Host (RDSH) role if the virtual machine is running a Windows Server OS. The RDSH role allows the Windows Virtual Desktop agents to install properly.

To successfully domain-join, do the following things on each virtual machine:

1. [Connect to the virtual machine](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal#connect-to-virtual-machine) with the credentials you provided when creating the virtual machine.
2. On the virtual machine, launch **Control Panel** and select **System**.
3. Select **Computer name**, select **Change settings**, and then select **Change…**
4. Select **Domain** and then enter the Active Directory domain on the virtual network.
5. Authenticate with a domain account that has privileges to domain-join machines.

    >[!NOTE]
    > If you're joining your VMs to an Azure AD Domain Services environment, ensure that your domain join user is also a member of the [AAD DC Administrators group](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-getting-started-admingroup#task-3-configure-administrative-group).

## Register the virtual machines to the Windows Virtual Desktop Preview host pool

Registering the virtual machines to a Windows Virtual Desktop host pool is as simple as installing the Windows Virtual Desktop agents.

To register the Windows Virtual Desktop agents, do the following on each virtual machine:

1. [Connect to the virtual machine](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal#connect-to-virtual-machine) with the credentials you provided when creating the virtual machine.
2. Download and install the Windows Virtual Desktop Agent.
   - Download the [Windows Virtual Desktop Agent](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RWrmXv).
   - Right-click the downloaded installer, select **Properties**, select **Unblock**, then select **OK**. This will allow your system to trust the installer.
   - Run the installer. When the installer asks you for the registration token, enter the value you got from the **Export-RdsRegistrationInfo** cmdlet.
3. Download and install the Windows Virtual Desktop Agent Bootloader.
   - Download the [Windows Virtual Desktop Agent Bootloader](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RWrxrH).
   - Right-click the downloaded installer, select **Properties**, select **Unblock**, then select **OK**. This will allow your system to trust the installer.
   - Run the installer.

>[!IMPORTANT]
>To help secure your Windows Virtual Desktop environment in Azure, we recommend you don't open inbound port 3389 on your VMs. Windows Virtual Desktop doesn't require an open inbound port 3389 for users to access the host pool's VMs. If you must open port 3389 for troubleshooting purposes, we recommend you use [just-in-time VM access](https://docs.microsoft.com/azure/security-center/security-center-just-in-time).

## Next steps

Now that you've made a host pool, you can populate it with RemoteApps. To learn more about how to manage apps in Windows Virtual Desktop, see the Manage app groups tutorial.

> [!div class="nextstepaction"]
> [Manage app groups tutorial](./manage-app-groups.md)
