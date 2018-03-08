---
title: Route network traffic - Azure CLI | Microsoft Docs
description: Learn how to route network traffic with a route table using the Azure CLI.
services: virtual-network
documentationcenter: virtual-network
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 03/02/2018
ms.author: jdial
ms.custom: 
---

# Route network traffic with a route table using the Azure CLI

Azure automatically routes traffic between all subnets within a virtual network, by default. You can create your own routes to override Azure's default routing. The ability to create custom routes is helpful if, for example, you want to route traffic between subnets through a firewall. In this article you learn how to:

> [!div class="checklist"]
> * Create a route table
> * Create a route
> * Associate a route table to a virtual network subnet
> * Test routing
> * Troubleshoot routing

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.28 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

## Create a route table

Azure routes traffic between all subnets in a virtual network, by default. To learn more about Azure's default routes, see [System routes](virtual-networks-udr-overview.md). To override Azure's default routing, you create a route table that contains routes, and associate the route table to a virtual network subnet.

Before you can create a route table, create a resource group with [az group create](/cli/azure/group#az_group_create) for all resources created in this article. 

```azurecli-interactive
# Create a resource group.
az group create \
  --name myResourceGroup \
  --location eastus
``` 

Create a route table with [az network route-table create](/cli/azure/network/route#az_network_route_table_create). The following example creates a route table named *myRouteTablePublic*. 

```azurecli-interactive 
# Create a route table
az network route-table create \
  --resource-group myResourceGroup \
  --name myRouteTablePublic
```

## Create a route

A route table contains zero or more routes. Create a route in the route table with [az network route-table route create](/cli/azure/network/route-table/route#az_network_route_table_route_create). 

```azurecli-interactive
az network route-table route create \
  --name ToPrivateSubnet \
  --resource-group myResourceGroup \
  --route-table-name myRouteTablePublic \
  --address-prefix 10.0.1.0/24 \
  --next-hop-type VirtualAppliance \
  --next-hop-ip-address 10.0.2.4
``` 

The route will direct all traffic destined to the 10.0.1.0/24 address prefix through a network virtual appliance with the IP address 10.0.2.4. The network virtual appliance and subnet with the specified address prefix are created in later steps. The route overrides Azure's default routing, which routes traffic between subnets directly. Each route specifies a next hop type. The next hop type instructs Azure how to route the traffic. In this example, the next hop type is *VirtualAppliance*. To learn more about all available next hop types in Azure, and when to use them, see [next hop types](virtual-networks-udr-overview.md#custom-routes).

## Associate a route table to a subnet

Before you can associate a route table to a subnet, you have to create a virtual network and subnet. Create a virtual network with one subnet with [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create).

```azurecli-interactive
az network vnet create \
  --name myVirtualNetwork \
  --resource-group myResourceGroup \
  --address-prefix 10.0.0.0/16 \
  --subnet-name Public \
  --subnet-prefix 10.0.0.0/24
```

Create two additional subnets with [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create).

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

You can associate a route table to zero or more subnets. A subnet can have zero or one route table associated to it. Outbound traffic from a subnet is routed based upon Azure's default routes, and any custom routes you've added to a route table you associate to a subnet. Associate the *myRouteTablePublic* route table to the *Public* subnet with [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update).

```azurecli-interactive
az network vnet subnet update \
  --vnet-name myVirtualNetwork \
  --name Public \
  --resource-group myResourceGroup \
  --route-table myRouteTablePublic
```

Before deploying route tables for production use, it's recommended that you thoroughly familiarize yourself with [routing in Azure](virtual-networks-udr-overview.md) and [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

## Test routing

To test routing, you'll create a virtual machine that serves as the network virtual appliance that the route you created in a previous step routes through. After creating the network virtual appliance, you'll deploy a virtual machine into the *Public* and *Private* subnets. You'll then route traffic from the *Public* subnet to the *Private* subnet through the network virtual appliance.

### Create a network virtual appliance

In a previous step, you created a route that specified a network virtual appliance as the next hop type. A virtual machine running a network application is often referred to as a network virtual appliance. In production environments, the network virtual appliance you deploy is often a pre-configured virtual machine. Several network virtual appliances are available from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?search=network%20virtual%20appliance&page=1). In this article, a basic virtual machine is created. 

Create a network virtual appliance in the *DMZ* subnet with [az vm create](/cli/azure/vm#az_vm_create). When you create a virtual machine, Azure creates and assigns a public IP address to the virtual machine, by default. The `--public-ip-address ""` parameter instructs Azure not to create and assign a public IP address to the virtual machine, since the virtual machine doesn't need to be connected to from the Internet. If SSH keys do not already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option.

```azure-cli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVmNva \
  --image UbuntuLTS \
  --public-ip-address "" \
  --subnet DMZ \
  --vnet-name myVirtualNetwork \
  --generate-ssh-keys
```

The virtual machine takes a few minutes to create. Do not continue to the next step until Azure finishes creating the virtual machine and returns output about the virtual machine. In production environments, the network virtual appliance you deploy is often a pre-configured virtual machine. Several network virtual appliances are available from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?search=network%20virtual%20appliance&page=1).

You must enable IP forwarding for each Azure [network interface](virtual-network-network-interface.md) attached to a virtual machine that forwards traffic destined for any IP address that isn't assigned to the network interface. When you created the network virtual appliance in the *DMZ* subnet, Azure automatically created a network interface named *myVmNvaVMNic*, attached the network interface to the virtual machine, and assigned the private IP address *10.0.2.4* to the network interface. Enable IP forwarding for the network interface with [az network nic update](/cli/azure/network/nic#az_network_nic_update).

```azurecli-interactive
az network nic update \
  --name myVmNvaVMNic \
  --resource-group myResourceGroup \
  --ip-forwarding true
```

Within the virtual machine, the operating system, or an application running within the virtual machine, must also be able to forward network traffic. When you deploy a network virtual appliance in a production environment, the appliance typically filters, logs, or performs some other function before forwarding traffic. In this article however, the operating system simply forwards all traffic it receives. Enable IP forwarding within the virtual machine's operating system with [az vm extension set](/cli/azure/vm/extension#az_vm_extension_set), which executes a command that enables IP forwarding within the operating system.

```azurecli-interactive
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVmNva \
  --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --settings '{"commandToExecute":"sudo sysctl -w net.ipv4.ip_forward=1"}'
```
The command may take up to a minute to execute.

### Create virtual machines

Create two virtual machines in the virtual network so you can validate that traffic from the *Public* subnet is routed to the *Private* subnet through the network virtual appliance in a later step. 

Create a virtual machine in the *Public* subnet with [az vm create](/cli/azure/vm#az_vm_create). The `--no-wait` parameter enables Azure to execute the command in the background so you can continue to the next command. To streamline this article, a password is used. Keys are typically used in production deployments. If you use keys, you must also configure SSH agent forwarding. For more information, see the documentation for your SSH client. Replace `<replace-with-your-password>` in the following command with a password of your choosing.

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

The virtual machine takes a few minutes to create. After the virtual machine is created, the Azure CLI shows information similar to the following example: 

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
Take note of the **publicIpAddress**. This address is used to access the virtual machine from the Internet in a later step.

### Route traffic through a network virtual appliance

Use the following command to create an SSH session with the *myVmMgmt* virtual machine. Replace *<publicIpAddress>* with the public IP address of your virtual machine. In the example above, the IP address is *13.90.242.231*.

```bash 
ssh azureuser@<publicIpAddress>
```

When prompted for a password, enter the password you selected in [Create virtual machines](#create-virtual-machines).

Use the following command to install traceroute on the *myVmMgmt* virtual machine:

```bash 
sudo apt-get install traceroute
```

Use the following command to test routing for network traffic to the *myVmWeb* virtual machine from the *myVmMgmt* virtual machine.

```bash
traceroute myvmweb
```

The response is similar to the following example:

```bash
traceroute to myvmweb (10.0.0.4), 30 hops max, 60 byte packets
1  10.0.0.4 (10.0.0.4)  1.404 ms  1.403 ms  1.398 ms
```

You can see that traffic is routed directly from the *myVmMgmt* virtual machine to the *myVmWeb* virtual machine. Azure's default routes, route traffic directly between subnets. 

Use the following command to SSH to the *myVmWeb* virtual machine from the *myVmMgmt* virtual machine:

```bash 
ssh azureuser@myVmWeb
```

Use the following command to install traceroute on the *myVmWeb* virtual machine:

```bash 
sudo apt-get install traceroute
```

Use the following command to test routing for network traffic to the *myVmMgmt* virtual machine from the *myVmWeb* virtual machine.

```bash
traceroute myvmmgmt
```

The response is similar to the following example:

```bash
traceroute to myvmmgmt (10.0.1.4), 30 hops max, 60 byte packets
1  10.0.2.4 (10.0.2.4)  0.781 ms  0.780 ms  0.775 ms
2  10.0.1.4 (10.0.0.4)  1.404 ms  1.403 ms  1.398 ms
```
You can see that the first hop is 10.0.2.4, which is the network virtual appliance's private IP address. The second hop is 10.0.1.4, the private IP address of the *myVmMgmt* virtual machine. The route added to the *myRouteTablePublic* route table and associated to the *Public* subnet caused Azure to route the traffic through the NVA, rather than directly to the *Private* subnet.

Close the SSH sessions to both the *myVmWeb* and *myVmMgmt* virtual machines.

## Troubleshoot routing

As you learned in previous steps, Azure applies default routes, that you can, optionally, override with your own routes. Sometimes, traffic may not be routed as you expect it to be. Use [az network watcher show-next-hop](/cli/azure/network/watcher#az_network_watcher_show_next_hop) to determine how traffic is routed between two virtual machines. For example, the following command tests traffic routing from the *myVmWeb* (10.0.0.4) virtual machine to the *myVmMgmt* (10.0.1.4) virtual machine:

```azurecli-interactive
# Enable network watcher for east region, if you don't already have a network watcher enabled for the region.
az network watcher configure --locations eastus --resource-group myResourceGroup --enabled true

```azurecli-interactive
az network watcher show-next-hop \
  --dest-ip 10.0.1.4 \
  --resource-group myResourceGroup \
  --source-ip 10.0.0.4 \
  --vm myVmWeb \
  --out table
```
The following output is returned after a short wait:

```azurecli
NextHopIpAddress    NextHopType       RouteTableId
------------------  ---------------- ---------------------------------------------------------------------------------------------------------------------------
10.0.2.4            VirtualAppliance  /subscriptions/<Subscription-Id>/resourceGroups/myResourceGroup/providers/Microsoft.Network/routeTables/myRouteTablePublic
```

The output informs you that the next hop IP address for traffic from *myVmWeb* to *myVmMgmt* is 10.0.2.4 (the *myVmNva* virtual machine), that the next hop type is *VirtualAppliance*, and that the route table that causes the routing is *myRouteTablePublic*.

The effective routes for each network interface are a combination of Azure's default routes and any routes you define. See all routes effective for a network interface in a virtual machine with [az network nic show-effective-route-table](/cli/azure/network/nic#az_network_nic_show_effective_route_table). For example, to show the effective routes for the *MyVmWebVMNic* network interface in the *myVmWeb* virtual machine, enter the following command:

```azurecli-interactive
az network nic show-effective-route-table \
  --name MyVmWebVMNic \
  --resource-group myResourceGroup
```

All default routes, and the route you added in a previous step, are returned.

## Clean up resources

When no longer needed, use [az group delete](/cli/azure/group#az_group_delete) to remove the resource group and all of the resources it contains.

```azurecli-interactive 
az group delete --name myResourceGroup --yes
```

## Next steps

In this article, you created a route table and associated it to a subnet. You created a network virtual appliance that routed traffic from a public subnet to a private subnet. While you can deploy many Azure resources within a virtual network, resources for some Azure PaaS services cannot be deployed into a virtual network. You can still restrict access to the resources of some Azure PaaS services to traffic only from a virtual network subnet though. Advance to the next tutorial to learn how to restrict network access to Azure PaaS resources.

> [!div class="nextstepaction"]
> [Restrict network access to PaaS resources](virtual-network-service-endpoints-configure.md#azure-cli)
