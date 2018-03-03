---
title: Create an Azure Virtual Network with multiple subnets - PowerShell | Microsoft Docs
description: Learn how to create a virtual network with multiple subnets using PowerShell.
services: virtual-network
documentationcenter:
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic:
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/01/2018
ms.author: jdial
ms.custom:
---

# Create a virtual network with multiple subnets using PowerShell

A virtual network enables several types of Azure resources to communicate with the Internet and privately with each other. Creating multiple subnets in a virtual network enables you to segment your network so that you can filter or control the flow of traffic between subnets. In this article you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a subnet
> * Test network communication between virtual machines

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use PowerShell locally, this tutorial requires the Azure PowerShell module version 3.6 or later. Run ` Get-Module -ListAvailable AzureRM` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure. 

## Create a virtual network

Create a resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). The following example creates a resource group named *myResourceGroup* in the *EastUS* location.

```azurepowershell-interactive
New-AzureRmResourceGroup -ResourceGroupName myResourceGroup -Location EastUS
```

Create a virtual network with [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork). The following example creates a virtual network named *myVirtualNetwork* with the address prefix *10.0.0.0/16*.

```azurepowershell-interactive
$virtualNetwork = New-AzureRmVirtualNetwork `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -Name myVirtualNetwork `
  -AddressPrefix 10.0.0.0/16
```

The **AddressPrefix** is specified in CIDR notation. The specified address prefix includes the IP addresses 10.0.0.0-10.0.255.254.

## Create a subnet

A subnet is created by first creating a subnet configuration, and then updating the virtual network with the subnet configuration. Create a subnet configuration with [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig). The following example creates two subnet configurations for *Public* and *Private* subnets:

```azurepowershell-interactive
$subnetConfigPublic = Add-AzureRmVirtualNetworkSubnetConfig `
  -Name Public `
  -AddressPrefix 10.0.0.0/24 `
  -VirtualNetwork $virtualNetwork

$subnetConfigPrivate = Add-AzureRmVirtualNetworkSubnetConfig `
  -Name Private `
  -AddressPrefix 10.0.1.0/24 `
  -VirtualNetwork $virtualNetwork
```

The **AddressPrefix** specified for a subnet must be within the address prefix defined for the virtual network. Azure DHCP assigns IP addresses from a subnet address prefix to resources deployed in a subnet. Azure only assigns the addresses 10.0.0.4-10.0.0.254 to resources deployed within the **Public** subnet, because Azure reserves the first four addresses (10.0.0.0-10.0.0.3 for the subnet, in this example) and the last address (10.0.0.255 for the subnet, in this example) in each subnet.

Write the subnet configurations to the virtual network with [Set-AzureRmVirtualNetwork](/powershell/module/azurerm.network/Set-AzureRmVirtualNetwork), which creates the subnets in the virtual network:

```azurepowershell-interactive
$virtualNetwork | Set-AzureRmVirtualNetwork
```

Before deploying Azure virtual networks and subnets for production use, we recommend that you thoroughly familiarize yourself with address space [considerations](virtual-network-manage-network.md#create-a-virtual-network) and [virtual network limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). Once resources are deployed into subnets, some virtual network and subnet changes, such as changing address ranges, can require redeployment of existing Azure resources deployed within subnets.

## Test network communication

A virtual network enables several types of Azure resources to communicate with the Internet and privately with each other. One type of resource you can deploy into a virtual network is a virtual machine. Create two virtual machines in the virtual network so you can test network communication between them and the Internet in a later step. 

### Create virtual machines

Create a virtual machine with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm). The following example creates a virtual machine named *myVmWeb* in the *Public* subnet of the *myVirtualNetwork* virtual network. The `-AsJob` option creates the virtual machine in the background, so you can continue to the next step. When prompted, enter the user name and password you want to log in to the virtual machine with.

```azurepowershell-interactive
New-AzureRmVm `
    -ResourceGroupName "myResourceGroup" `
    -Location "East US" `
    -VirtualNetworkName "myVirtualNetwork" `
    -SubnetName "Public" `
    -ImageName "Win2016Datacenter" `
    -Name "myVmWeb" `
    -AsJob
```

Azure automatically assigned 10.0.0.4 as the private IP address of the virtual machine, because 10.0.0.4 is the first available IP address in the *Public* subnet. 

Create a virtual machine in the *Private* subnet.

```azurepowershell-interactive
New-AzureRmVm `
    -ResourceGroupName "myResourceGroup" `
    -Location "East US" `
    -VirtualNetworkName "myVirtualNetwork" `
    -SubnetName "Private" `
    -ImageName "Win2016Datacenter" `
    -Name "myVmMgmt"
```

The virtual machine takes a few minutes to create. Though not in the returned output, Azure assigned 10.0.1.4 as the private IP address of the virtual machine, because 10.0.1.4 is the first available IP address in the *Private* subnet of *myVirtualNetwork*. 

Do not continue with remaining steps until the virtual machine is created and PowerShell returns output.

The virtual machines created in this article have one [network interface](virtual-network-network-interface.md) with one IP address that is dynamically assigned to the network interface. After you've deployed the VM, you can [add multiple public and private IP addresses, or change the IP address assignment method to static](virtual-network-network-interface-addresses.md#add-ip-addresses). You can [add network interfaces](virtual-network-network-interface-vm.md#vm-add-nic), up to the limit supported by the [VM size](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that you select when you create a virtual machine. You can also [enable single root I/O virtualization (SR-IOV)](create-vm-accelerated-networking-powershell.md) for a VM, but only when you create a VM with a VM size that supports the capability.

### Communicate between virtual machines and with the internet

You can connect to a virtual machine's public IP address from the Internet. When Azure created the *myVmMgmt* virtual machine, a public IP address named *myVmMgmt* was also created and assigned to the virtual machine. Though a virtual machine isn't required to have a public IP address assigned to it, Azure assigns a public IP address to each virtual machine you create, by default. To communicate from the Internet to a virtual machine, a public IP address must be assigned to the virtual machine. All virtual machines can communicate outbound with the Internet, whether or not a public IP address is assigned to the virtual machine. To learn more about outbound Internet connections in Azure, see [Outbound connections in Azure](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json). 

Use [Get-AzureRmPublicIpAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress) to return the public IP address of a virtual machine. The following example returns the public IP address of the *myVmMgmt* virtual machine:

```azurepowershell-interactive
Get-AzureRmPublicIpAddress `
  -Name myVmMgmt `
  -ResourceGroupName myResourceGroup | Select IpAddress
```

Use the following command to create a remote desktop session with the *myVmMgmt* virtual machine from your local computer. Replace `<publicIpAddress>` with the IP address returned from the previous command.

```
mstsc /v:<publicIpAddress>
```

A Remote Desktop Protocol (.rdp) file is created, downloaded to your computer, and opened. Enter the user name and password you specified when creating the virtual machine (you may need to select **More choices**, then **Use a different account**, to specify the credentials you entered when you created the virtual machine), and then click **OK**. You may receive a certificate warning during the sign-in process. Click **Yes** or **Continue** to proceed with the connection. 

In a later step, ping is used to communicate with the *myVmMgmt* virtual machine from the *myVmWeb* virtual machine. Ping uses ICMP, which is denied through the Windows Firewall, by default. Enable ICMP through the Windows firewall by entering the following command from a command prompt:

```
netsh advfirewall firewall add rule name=Allow-ping protocol=icmpv4 dir=in action=allow
```

Though ping is used in this article, allowing ICMP through the Windows Firewall for production deployments is not recommended.

For security reasons, it's common to limit the number of virtual machines that can be remotely connected to in a virtual network. In this tutorial, the *myVmMgmt* virtual machine is used to manage the *myVmWeb* virtual machine in the virtual network. Use the following command to remote desktop to the *myVmWeb* virtual machine from the *myVmMgmt* virtual machine:

``` 
mstsc /v:myVmWeb
```

To communicate to the *myVmMgmt* virtual machine from the *myVmWeb* virtual machine, enter the following command from a command prompt:

```
ping myvmmgmt
```

You receive output similar to the following example output:
    
```
Pinging myvmmgmt.dar5p44cif3ulfq00wxznl3i3f.bx.internal.cloudapp.net [10.0.1.4] with 32 bytes of data:
Reply from 10.0.1.4: bytes=32 time<1ms TTL=128
Reply from 10.0.1.4: bytes=32 time<1ms TTL=128
Reply from 10.0.1.4: bytes=32 time<1ms TTL=128
Reply from 10.0.1.4: bytes=32 time<1ms TTL=128
    
Ping statistics for 10.0.1.4:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```
      
You can see that the address of the *myVmMgmt* virtual machine is 10.0.1.4. 10.0.1.4 was the first available IP address in the address range of the *Private* subnet that you deployed the *myVmMgmt* virtual machine to in a previous step.  You see that the fully qualified domain name of the virtual machine is *myvmmgmt.dar5p44cif3ulfq00wxznl3i3f.bx.internal.cloudapp.net*. Though the *dar5p44cif3ulfq00wxznl3i3f* portion of the domain name is different for your virtual machine, the remaining portions of the domain name are the same. By default, all Azure virtual machines use the default Azure DNS service. All virtual machines within a virtual network can resolve the names of all other virtual machines in the same virtual network using Azure's default DNS service. Instead of using Azure's default DNS service, you can use your own DNS server or the private domain capability of the Azure DNS service. For details, see [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) or [Using Azure DNS for private domains](../dns/private-dns-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

To install Internet Information Services (IIS) for Windows Server on the *myVmWeb* virtual machine, enter the following command from a PowerShell session:

```powershell
Install-WindowsFeature -name Web-Server -IncludeManagementTools
```

After the installation of IIS is complete, disconnect the *myVmWeb* remote desktop session, which leaves you in the *myVmMgmt* remote desktop session. Open a web browser and browse to http://myvmweb. You see the IIS welcome page.

Disconnect the *myVmMgmt* remote desktop session.

Get the public address Azure assigned to the *myVmWeb* virtual machine:

```azurepowershell-interactive
Get-AzureRmPublicIpAddress `
  -Name myVmWeb `
  -ResourceGroupName myResourceGroup | Select IpAddress
```

On your own computer, browse to the public IP address of the *myVmWeb* virtual machine. The attempt to view the IIS welcome page from your own computer fails. The attempt fails because when the virtual machines were deployed, Azure created a network security group for each virtual machine, by default. 

A network security group contains security rules that allow or deny inbound and outbound network traffic by port and IP address. The default network security group Azure created allows communication over all ports between resources in the same virtual network. For Windows virtual machines, the default network security group denies all inbound traffic from the Internet over all ports, accept TCP port 3389 (RDP). As a result, by default, you can also RDP directly to the *myVmWeb* virtual machine from the Internet, even though you might not want port 3389 open to a web server. Since web browsing communicates over port 80, communication fails from the Internet because there is no rule in the default network security group allowing traffic over port 80.

## Clean up resources

When no longer needed, use [Remove-AzureRmResourcegroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) to remove the resource group and all of the resources it contains.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

## Next steps

In this tutorial, you learned how to deploy a virtual network with multiple subnets. You also learned that when you create a Windows virtual machine, Azure creates a network interface that it attaches to the virtual machine, and creates a network security group that only allows traffic over port 3389, from the Internet. Advance to the next tutorial to learn how to filter network traffic to subnets, rather than to individual virtual machines.

> [!div class="nextstepaction"]
> [Filter network traffic to subnets](./virtual-networks-create-nsg-arm-ps.md)
