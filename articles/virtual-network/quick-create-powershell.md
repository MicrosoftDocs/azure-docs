---
title: Create a virtual network - quickstart - Azure PowerShell
titlesuffix: Azure Virtual Network
description: In this quickstart, you learn to create a virtual network using the Azure portal. A virtual network lets Azure resources, like virtual machines, communicate privately with each other, and with the internet.
services: virtual-network
documentationcenter: virtual-network
author: KumudD
tags: azure-resource-manager
Customer intent: I want to create a virtual network so that virtual machines can communicate with privately with each other and with the internet.
ms.service: virtual-network
ms.devlang: 
ms.topic: quickstart
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 12/04/2018
ms.author: kumud
---

# Quickstart: Create a virtual network using PowerShell

A virtual network lets Azure resources, like virtual machines (VMs), communicate privately with each other, and with the internet. In this quickstart, you learn how to create a virtual network. After creating a virtual network, you deploy two VMs into the virtual network. You then connect to the VMs from the internet, and communicate privately over the virtual network.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you decide to install and use PowerShell locally instead, this quickstart requires you to use Azure PowerShell module version 1.0.0 or later. To find the installed version, run `Get-Module -ListAvailable Az`. See [Install Azure PowerShell module](/powershell/azure/install-az-ps) for install and upgrade info.

Finally, if you're running PowerShell locally, you'll also need to run `Connect-AzAccount`. That command creates a connection with Azure.

## Create a resource group and a virtual network

There are a handful of steps you have to walk through to get your resource group and virtual network configured.

### Create the resource group

Before you can create a virtual network, you have to create a resource group to host the virtual network. Create a resource group with [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup). This example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location EastUS
```

### Create the virtual network

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). This example creates a default virtual network named *myVirtualNetwork* in the *EastUS* location:

```azurepowershell-interactive
$virtualNetwork = New-AzVirtualNetwork `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -Name myVirtualNetwork `
  -AddressPrefix 10.0.0.0/16
```

### Add a subnet

Azure deploys resources to a subnet within a virtual network, so you need to create a subnet. Create a subnet configuration named *default* with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig):

```azurepowershell-interactive
$subnetConfig = Add-AzVirtualNetworkSubnetConfig `
  -Name default `
  -AddressPrefix 10.0.0.0/24 `
  -VirtualNetwork $virtualNetwork
```

### Associate the subnet to the virtual network

You can write the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork). This command creates the subnet:

```azurepowershell-interactive
$virtualNetwork | Set-AzVirtualNetwork
```

## Create virtual machines

Create two VMs in the virtual network.

### Create the first VM

Create the first VM with [New-AzVM](/powershell/module/az.compute/new-azvm). When you run the next command, you're prompted for credentials. Enter a user name and password for the VM:

```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName "myResourceGroup" `
    -Location "East US" `
    -VirtualNetworkName "myVirtualNetwork" `
    -SubnetName "default" `
    -Name "myVm1" `
    -AsJob
```

The `-AsJob` option creates the VM in the background. You can continue to the next step.

When Azure starts creating the VM in the background, you'll get something like this back:

```powershell
Id     Name            PSJobTypeName   State         HasMoreData     Location             Command
--     ----            -------------   -----         -----------     --------             -------
1      Long Running... AzureLongRun... Running       True            localhost            New-AzVM
```

### Create the second VM

Create the second VM with this command:

```azurepowershell-interactive
New-AzVm `
  -ResourceGroupName "myResourceGroup" `
  -VirtualNetworkName "myVirtualNetwork" `
  -SubnetName "default" `
  -Name "myVm2"
```

You'll have to create another user and password. Azure takes a few minutes to create the VM.

> [!IMPORTANT]
> Don't continue with the next step until Azure's finished.  You'll know it's done when it returns output to PowerShell.

## Connect to a VM from the internet

Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to return the public IP address of a VM. This example returns the public IP address of the *myVm1* VM:

```azurepowershell-interactive
Get-AzPublicIpAddress `
  -Name myVm1 `
  -ResourceGroupName myResourceGroup `
  | Select IpAddress
```

Open a command prompt on your local computer. Run the `mstsc` command. Replace `<publicIpAddress>` with the public IP address returned from the last step:

> [!NOTE]
> If you've been running these commands from a PowerShell prompt on your local computer, and you're using the Az PowerShell module version 1.0 or later, you can continue in that interface.

```cmd
mstsc /v:<publicIpAddress>
```
1. If prompted, select **Connect**.

1. Enter the user name and password you specified when creating the VM.

    > [!NOTE]
    > You may need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

1. Select **OK**.

1. You may receive a certificate warning. If you do, select **Yes** or **Continue**.

## Communicate between VMs

1. In the Remote Desktop of *myVm1*, open PowerShell.

1. Enter `ping myVm2`.

    You'll get something like this back:

    ```powershell
    PS C:\Users\myVm1> ping myVm2

    Pinging myVm2.ovvzzdcazhbu5iczfvonhg2zrb.bx.internal.cloudapp.net
    Request timed out.
    Request timed out.
    Request timed out.
    Request timed out.

    Ping statistics for 10.0.0.5:
        Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
    ```

    The ping fails, because it uses the Internet Control Message Protocol (ICMP). By default, ICMP isn't allowed through your Windows firewall.

1. To allow *myVm2* to ping *myVm1* in a later step, enter this command:

    ```powershell
    New-NetFirewallRule –DisplayName “Allow ICMPv4-In” –Protocol ICMPv4
    ```

    That command lets ICMP inbound through the Windows firewall.

1. Close the remote desktop connection to *myVm1*.

1. Repeat the steps in [Connect to a VM from the internet](#connect-to-a-vm-from-the-internet). This time, connect to *myVm2*.

1. From a command prompt on the *myVm2* VM, enter `ping myvm1`.

    You'll get something like this back:

    ```cmd
    C:\windows\system32>ping myVm1

    Pinging myVm1.e5p2dibbrqtejhq04lqrusvd4g.bx.internal.cloudapp.net [10.0.0.4] with 32 bytes of data:
    Reply from 10.0.0.4: bytes=32 time=2ms TTL=128
    Reply from 10.0.0.4: bytes=32 time<1ms TTL=128
    Reply from 10.0.0.4: bytes=32 time<1ms TTL=128
    Reply from 10.0.0.4: bytes=32 time<1ms TTL=128

    Ping statistics for 10.0.0.4:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 2ms, Average = 0ms
    ```

    You receive replies from *myVm1*, because you allowed ICMP through the Windows firewall on the *myVm1* VM in a previous step.

1. Close the remote desktop connection to *myVm2*.

## Clean up resources

When you're done with the virtual network and the VMs, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all the resources it has:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Next steps

In this quickstart, you created a default virtual network and two VMs. You connected to one VM from the internet and communicated privately between the VM and another VM. To learn more about virtual network settings, see [Manage a virtual network](manage-virtual-network.md).

Azure allows unrestricted private communication between virtual machines. By default, Azure only allows inbound remote desktop connections to Windows VMs from the internet. To learn more about configuring different types of VM network communications, go to the [Filter network traffic](tutorial-filter-network-traffic.md) tutorial.
