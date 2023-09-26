---
title: Route network traffic - Azure CLI
description: In this article, learn how to route network traffic with a route table using the Azure CLI.
services: virtual-network
documentationcenter: virtual-network
author: asudbring
manager: mtillman
tags: azure-resource-manager
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: how-to
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 04/20/2022
ms.author: allensu
ms.custom: devx-track-azurecli, devx-track-linux
# Customer intent: I want to route traffic from one subnet, to a different subnet, through a network virtual appliance.
---

# Route network traffic with a route table using the Azure CLI

Azure automatically routes traffic between all subnets within a virtual network, by default. You can create your own routes to override Azure's default routing. The ability to create custom routes is helpful if, for example, you want to route traffic between subnets through a network virtual appliance (NVA). In this article, you learn how to:

* Create a route table
* Create a route
* Create a virtual network with multiple subnets
* Associate a route table to a subnet
* Create a basic NVA that routes traffic from an Ubuntu VM
* Deploy virtual machines (VM) into different subnets
* Route traffic from one subnet to another through an NVA

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a route table

Before you can create a route table, create a resource group with [az group create](/cli/azure/group) for all resources created in this article. 

```azurecli-interactive
# Create a resource group.
az group create \
  --name myResourceGroup \
  --location eastus
```

Create a route table with [az network route-table create](/cli/azure/network/route-table#az-network-route-table-create). The following example creates a route table named *myRouteTablePublic*. 

```azurecli-interactive
# Create a route table
az network route-table create \
  --resource-group myResourceGroup \
  --name myRouteTablePublic
```

## Create a route

Create a route in the route table with [az network route-table route create](/cli/azure/network/route-table/route#az-network-route-table-route-create). 

```azurecli-interactive
az network route-table route create \
  --name ToPrivateSubnet \
  --resource-group myResourceGroup \
  --route-table-name myRouteTablePublic \
  --address-prefix 10.0.1.0/24 \
  --next-hop-type VirtualAppliance \
  --next-hop-ip-address 10.0.2.4
```

## Associate a route table to a subnet

Before you can associate a route table to a subnet, you have to create a virtual network and subnet. Create a virtual network with one subnet with [az network vnet create](/cli/azure/network/vnet).

```azurecli-interactive
az network vnet create \
  --name myVirtualNetwork \
  --resource-group myResourceGroup \
  --address-prefix 10.0.0.0/16 \
  --subnet-name Public \
  --subnet-prefix 10.0.0.0/24
```

Create two additional subnets with [az network vnet subnet create](/cli/azure/network/vnet/subnet).

```azurecli-interactive
# Create a private subnet.
az network vnet subnet create \
  --vnet-name myVirtualNetwork \
  --resource-group myResourceGroup \
  --name Private \
  --address-prefix 10.0.1.0/24

# Create a DMZ subnet.
az network vnet subnet create \
  --vnet-name myVirtualNetwork \
  --resource-group myResourceGroup \
  --name DMZ \
  --address-prefix 10.0.2.0/24
```

Associate the *myRouteTablePublic* route table to the *Public* subnet with [az network vnet subnet update](/cli/azure/network/vnet/subnet).

```azurecli-interactive
az network vnet subnet update \
  --vnet-name myVirtualNetwork \
  --name Public \
  --resource-group myResourceGroup \
  --route-table myRouteTablePublic
```

## Create an NVA

An NVA is a VM that performs a network function, such as routing, firewalling, or WAN optimization.  We will create a basic NVA from a general purpose Ubuntu VM, for demonstration purposes. 

Create a VM to be used as the NVA in the *DMZ* subnet with [az vm create](/cli/azure/vm). When you create a VM, Azure creates and assigns a network interface *myVmNvaVMNic* and a public IP address to the VM, by default. The `--public-ip-address ""` parameter instructs Azure not to create and assign a public IP address to the VM, since the VM doesn't need to be connected to from the internet. If SSH keys do not already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVmNva \
  --image UbuntuLTS \
  --public-ip-address "" \
  --subnet DMZ \
  --vnet-name myVirtualNetwork \
  --generate-ssh-keys
```

The VM takes a few minutes to create. Do not continue to the next step until Azure finishes creating the VM and returns output about the VM. 

For a network interface myVmNvaVMNic to be able to forward network traffic sent to it, that is not destined for its own IP address, IP forwarding must be enabled for the network interface. Enable IP forwarding for the network interface with [az network nic update](/cli/azure/network/nic).

```azurecli-interactive
az network nic update \
  --name myVmNvaVMNic \
  --resource-group myResourceGroup \
  --ip-forwarding true
```

Within the VM, the operating system, or an application running within the VM, must also be able to forward network traffic.  We will use the `sysctl` command to enable the Linux kernel to forward packets.  To run this command without logging onto the VM, we will use the [Custom Script extension](/azure/virtual-machines/extensions/custom-script-linux) [az vm extension set](/cli/azure/vm/extension):

```azurecli-interactive
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVmNva \
  --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --settings '{"commandToExecute":"sudo sysctl -w net.ipv4.ip_forward=1"}'
```

The command may take up to a minute to execute.  Note that this change will not persist after a VM reboot, so if the NVA VM is rebooted for any reason, the script will need to be repeated.

## Create virtual machines

Create two VMs in the virtual network so you can validate that traffic from the *Public* subnet is routed to the *Private* subnet through the NVA in a later step. 

Create a VM in the *Public* subnet with [az vm create](/cli/azure/vm). The `--no-wait` parameter enables Azure to execute the command in the background so you can continue to the next command. To streamline this article, a password is used. Keys are typically used in production deployments. If you use keys, you must also configure SSH agent forwarding. For more information, see the documentation for your SSH client. Replace `<replace-with-your-password>` in the following command with a password of your choosing.

```azurecli-interactive
adminPassword="<replace-with-your-password>"

az vm create \
  --resource-group myResourceGroup \
  --name myVmPublic \
  --image UbuntuLTS \
  --vnet-name myVirtualNetwork \
  --subnet Public \
  --admin-username azureuser \
  --admin-password $adminPassword \
  --no-wait
```

Create a VM in the *Private* subnet.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVmPrivate \
  --image UbuntuLTS \
  --vnet-name myVirtualNetwork \
  --subnet Private \
  --admin-username azureuser \
  --admin-password $adminPassword
```

The VM takes a few minutes to create. After the VM is created, the Azure CLI shows information similar to the following example: 

```output
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVmPrivate",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.1.4",
  "publicIpAddress": "13.90.242.231",
  "resourceGroup": "myResourceGroup"
}
```

Take note of the **publicIpAddress**. This address is used to access the VM from the internet in a later step.

## Route traffic through an NVA

Using an SSH client of your choice, connect to the VMs created above.  For example, the following command can be used from a command line interface such as [WSL](/windows/wsl/install) to create an SSH session with the *myVmPrivate* VM. Replace *\<publicIpAddress>* with the public IP address of your VM. In the example above, the IP address is *13.90.242.231*.

```bash
ssh azureuser@<publicIpAddress>
```

When prompted for a password, enter the password you selected in [Create virtual machines](#create-virtual-machines).

Use the following command to install trace route on the *myVmPrivate* VM:

```bash
sudo apt update
sudo apt install traceroute
```

Use the following command to test routing for network traffic to the *myVmPublic* VM from the *myVmPrivate* VM.

```bash
traceroute myVmPublic
```

The response is similar to the following example:

```output
traceroute to myVmPublic (10.0.0.4), 30 hops max, 60 byte packets
1  10.0.0.4 (10.0.0.4)  1.404 ms  1.403 ms  1.398 ms
```

You can see that traffic is routed directly from the *myVmPrivate* VM to the *myVmPublic* VM. Azure's default routes, route traffic directly between subnets. 

Use the following command to SSH to the *myVmPublic* VM from the *myVmPrivate* VM:

```bash
ssh azureuser@myVmPublic
```

Use the following command to install trace route on the *myVmPublic* VM:

```bash
sudo apt-get install traceroute
```

Use the following command to test routing for network traffic to the *myVmPrivate* VM from the *myVmPublic* VM.

```bash
traceroute myVmPrivate
```

The response is similar to the following example:

```output
traceroute to myVmPrivate (10.0.1.4), 30 hops max, 60 byte packets
1  10.0.2.4 (10.0.2.4)  0.781 ms  0.780 ms  0.775 ms
2  10.0.1.4 (10.0.0.4)  1.404 ms  1.403 ms  1.398 ms
```

You can see that the first hop is 10.0.2.4, which is the NVA's private IP address. The second hop is 10.0.1.4, the private IP address of the *myVmPrivate* VM. The route added to the *myRouteTablePublic* route table and associated to the *Public* subnet caused Azure to route the traffic through the NVA, rather than directly to the *Private* subnet.

Close the SSH sessions to both the *myVmPublic* and *myVmPrivate* VMs.

## Clean up resources

When no longer needed, use [az group delete](/cli/azure/group) to remove the resource group and all of the resources it contains.

```azurecli-interactive
az group delete --name myResourceGroup --yes
```

## Next steps

In this article, you created a route table and associated it to a subnet. You created a simple NVA that routed traffic from a public subnet to a private subnet. Deploy a variety of pre-configured NVAs that perform network functions such as firewall and WAN optimization from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking). To learn more about routing, see [Routing overview](virtual-networks-udr-overview.md) and [Manage a route table](manage-route-table.md).

While you can deploy many Azure resources within a virtual network, resources for some Azure PaaS services cannot be deployed into a virtual network. You can still restrict access to the resources of some Azure PaaS services to traffic only from a virtual network subnet though. To learn how, see [Restrict network access to PaaS resources](tutorial-restrict-network-access-to-resources-cli.md).
