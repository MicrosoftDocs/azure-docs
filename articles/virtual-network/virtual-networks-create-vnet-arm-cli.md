---
title: Create an Azure Virtual Network with multiple subnets - Azure CLI | Microsoft Docs
description: Learn how to create a virtual network with multiple subnets using the Azure CLI.
services: virtual-network
documentationcenter:
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: 
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/01/2018
ms.author: jdial
ms.custom: 
---

# Create a virtual network with multiple subnets using the Azure CLI

A virtual network enables several types of Azure resources to communicate with the Internet and privately with each other. Creating multiple subnets in a virtual network enables you to segment your network so that you can filter or control the flow of traffic between subnets. In this article you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a subnet
> * Test network communication between virtual machines

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli.md). 

## Create a virtual network

Create a resource group with [az group create](/cli/azure/group#az_group_create). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

Create a virtual network with [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create). The following example creates a virtual network named *myVirtualNetwork* with the address prefix *10.0.0.0/16*. The command creates one subnet named *Public*, with the address prefix *10.0.0.0/24*.

```azurecli-interactive 
az network vnet create \
  --name myVirtualNetwork \
  --resource-group myResourceGroup \
  --address-prefixes 10.0.0.0/16 \
  --subnet-name Public \
  --subnet-prefix 10.0.0.0/24
```

Since a location was not specified in the previous command, Azure creates the virtual network in the same location that the *myResourceGroup* resource group exists in. The **address-prefixes** and **subnet-prefix** are specified in CIDR notation. The specified address prefix includes the IP addresses 10.0.0.0-10.0.255.254. The prefix specified for the subnet must be within the address prefix defined for the virtual network. Azure DHCP assigns IP addresses from a subnet address prefix to resources deployed in a subnet. Azure only assigns the addresses 10.0.0.4-10.0.0.254 to resources deployed within the **Public** subnet, because Azure reserves the first four addresses (10.0.0.0-10.0.0.3 for the subnet, in this example) and the last address (10.0.0.255 for the subnet, in this example) in each subnet.

## Create a subnet

Create a subnet with [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create). The following example creates a subnet named *Private* within the *myVirtualNetwork* virtual network with the address prefix *10.0.1.0/24*. The address prefix must be within the address prefix defined for the virtual network and cannot overlap the address prefix of any other subnets in the virtual network.

```azurecli-interactive 
az network vnet subnet create \
  --vnet-name myVirtualNetwork \
  --resource-group myResourceGroup \
  --name Private \
  --address-prefix 10.0.1.0/24
```

Before deploying Azure virtual networks and subnets for production use, we recommend that you thoroughly familiarize yourself with address space [considerations](virtual-network-manage-network.md#create-a-virtual-network) and [virtual network limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). Once resources are deployed into subnets, some virtual network and subnet changes, such as changing address ranges, can require redeployment of existing Azure resources deployed within subnets.

## Test network communication

A virtual network enables several types of Azure resources to communicate with the Internet and privately with each other. One type of resource you can deploy into a virtual network is a virtual machine. Create two virtual machines in the virtual network so you can test network communication between them and the Internet in a later step.

### Create virtual machines

Create a virtual machine with [az vm create](/cli/azure/vm#az_vm_create). The following example creates a virtual machine named *myVmWeb* in the *Public* subnet. The `--no-wait` parameter enables Azure to execute the command in the background so you can continue to the next command. To streamline this tutorial, a password is used. Keys are typically used in production deployments. If you use keys, you must also configure SSH agent forwarding to complete the remaining steps. For more information about SSH agent forwarding, see the documentation for your SSH client. Replace `<replace-with-your-password>` in the following command with a password of your choosing.

```azurecli-interactive
adminPassword="<replace-with-your-password>"

az vm create \
  --resource-group myResourceGroup \
  --name myVmWeb \
  --image UbuntuLTS \
  --vnet-name myVirtualNetwork \
  --subnet Public \
  --admin-username azureuser \
  --admin-password $adminPassword \
  --no-wait
```

Azure automatically assigned 10.0.0.4 as the private IP address of the virtual machine, because 10.0.0.4 is the first available IP address in the *Public* subnet. 

Create a virtual machine in the *Private* subnet.

```azurecli-interactive 
az vm create \
  --resource-group myResourceGroup \
  --name myVmMgmt \
  --image UbuntuLTS \
  --vnet-name myVirtualNetwork \
  --subnet Private \
  --admin-username azureuser \
  --admin-password $adminPassword
```
The virtual machine takes a few minutes to create. After the virtual machine is created, the Azure CLI returns output similar to the following example: 

```azurecli 
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVmMgmt",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.1.4",
  "publicIpAddress": "13.90.242.231",
  "resourceGroup": "myResourceGroup"
}
```

In the example output, you see that the **privateIpAddress** is *10.0.1.4*. Azure created a [network interface](virtual-network-network-interface.md), attached it to the virtual machine, assigned the network interface a private IP address, and a **macAddress**. Azure DHCP automatically assigned 10.0.1.4 to the network interface because it is the first available IP address in the *Private* subnet. The private IP and MAC addresses remain assigned to the network interface until the network interface is deleted. 

Take note of the **publicIpAddress**. This address is used to access the virtual machine from the Internet in a later step. Though a virtual machine isn't required to have a public IP address assigned to it, Azure assigns a public IP address to each virtual machine you create, by default. To communicate from the Internet to a virtual machine, a public IP address must be assigned to the virtual machine. All virtual machines can communicate outbound with the Internet, whether or not a public IP address is assigned to the virtual machine. To learn more about outbound Internet connections in Azure, see [Outbound connections in Azure](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

The virtual machines created in this article have one [network interface](virtual-network-network-interface.md) with one IP address that is dynamically assigned to the network interface. After you've deployed the VM, you can [add multiple public and private IP addresses, or change the IP address assignment method to static](virtual-network-network-interface-addresses.md#add-ip-addresses). You can [add network interfaces](virtual-network-network-interface-vm.md#vm-add-nic), up to the limit supported by the [VM size](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that you select when you create a virtual machine. You can also [enable single root I/O virtualization (SR-IOV)](create-vm-accelerated-networking-cli.md) for a VM, but only when you create a VM with a VM size that supports the capability.

### Communicate between virtual machines and with the internet

Use the following command to create an SSH session with the *myVmMgmt* virtual machine. Replace `<publicIpAddress>` with the public IP address of your virtual machine. In the previous example, the public IP address is *13.90.242.231*. When prompted for a password, enter the password you entered in [Create virtual machines](#create-virtual-machines).

```bash 
ssh azureuser@<publicIpAddress>
```

For security reasons, it's common to limit the number of virtual machines that can be remotely connected to in a virtual network. In this tutorial, the *myVmMgmt* virtual machine is used to manage the *myVmWeb* virtual machine in the virtual network. Use the following command to SSH to the *myVmWeb* virtual machine from the *myVmMgmt* virtual machine:

```bash 
ssh azureuser@myVmWeb
```

To communicate to the *myVmMgmt* virtual machine from the *myVmWeb* virtual machine, enter the following command from a command prompt:

```
ping -c 4 myvmmgmt
```

You receive output similar to the following example output:
    
```
PING myvmmgmt.hxehizax3z1udjnrx1r4gr30pg.bx.internal.cloudapp.net (10.0.1.4) 56(84) bytes of data.
64 bytes from 10.0.1.4: icmp_seq=1 ttl=64 time=1.45 ms
64 bytes from 10.0.1.4: icmp_seq=2 ttl=64 time=0.628 ms
64 bytes from 10.0.1.4: icmp_seq=3 ttl=64 time=0.529 ms
64 bytes from 10.0.1.4: icmp_seq=4 ttl=64 time=0.674 ms

--- myvmmgmt.hxehizax3z1udjnrx1r4gr30pg.bx.internal.cloudapp.net ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3029ms
rtt min/avg/max/mdev = 0.529/0.821/1.453/0.368 ms
```
      
You can see that the address of the *myVmMgmt* virtual machine is 10.0.1.4. 10.0.1.4 was the first available IP address in the address range of the *Private* subnet that you deployed the *myVmMgmt* virtual machine to in a previous step.  You see that the fully qualified domain name of the virtual machine is *myvmmgmt.hxehizax3z1udjnrx1r4gr30pg.bx.internal.cloudapp.net*. Though the *hxehizax3z1udjnrx1r4gr30pg* portion of the domain name is different for your virtual machine, the remaining portions of the domain name are the same. By default, all Azure virtual machines use the default Azure DNS service. All virtual machines within a virtual network can resolve the names of all other virtual machines in the same virtual network using Azure's default DNS service. Instead of using Azure's default DNS service, you can use your own DNS server or the private domain capability of the Azure DNS service. For details, see [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) or [Using Azure DNS for private domains](../dns/private-dns-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

Use the following commands to install the nginx web server on the *myVmWeb* virtual machine:

```bash 
# Update package source
sudo apt-get -y update

# Install NGINX
sudo apt-get -y install nginx
```

Once nginx is installed, close the *myVmWeb* SSH session, which leaves you at the prompt for the *myVmMgmt* virtual machine. Enter the following command to retrieve the nginx welcome screen from the *myVmWeb* virtual machine.

```bash
curl myVmWeb
```

The nginx welcome screen is returned.

Close the SSH session with the *myVmMgmt* virtual machine.

When Azure created the *myVmWeb* virtual machine, a public IP address named *myVmWebPublicIP* was also created and assigned to the virtual machine. Get the public address Azure assigned with [az network public-ip show](/cli/azure/network/public-ip#az_network_public_ip_show).

```azurecli-interactive
az network public-ip show \
  --resource-group myResourceGroup \
  --name myVmWebPublicIP \
  --query ipAddress
```

From your own computer, enter the following command, replacing `<publicIpAddress>` with the address returned from the previous command:

```bash
curl <publicIpAddress>
```

The attempt to curl the nginx welcome screen from your own computer fails. The attempt fails because when the virtual machines were deployed, Azure created a network security group for each virtual machine, by default. 

A network security group contains security rules that allow or deny inbound and outbound network traffic by port and IP address. The default network security group Azure created allows communication over all ports between resources in the same virtual network. For Linux virtual machines, the default network security group denies all inbound traffic from the Internet over all ports, accept TCP port 22 (SSH). As a result, by default, you can also create an SSH session directly to the *myVmWeb* virtual machine from the Internet, even though you might not want port 22 open to a web server. Since the `curl` command communicates over port 80, communication fails from the Internet because there is no rule in the default network security group allowing traffic over port 80.

## Clean up resources

When no longer needed, use [az group delete](/cli/azure/group#az_group_delete) to remove the resource group and all of the resources it contains.

```azurecli-interactive 
az group delete --name myResourceGroup --yes
```

## Next steps

In this tutorial, you learned how to deploy a virtual network with multiple subnets. You also learned that when you create a Linux virtual machine, Azure creates a network interface that it attaches to the virtual machine, and creates a network security group that only allows traffic over port 22, from the Internet. Advance to the next tutorial to learn how to filter network traffic to subnets, rather than to individual virtual machines.

> [!div class="nextstepaction"]
> [Filter network traffic to subnets](./virtual-networks-create-nsg-arm-cli.md)
