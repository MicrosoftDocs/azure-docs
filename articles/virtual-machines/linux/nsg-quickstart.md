---
title: Open ports to a VM with Azure CLI 
description: Learn how to open a port / create an endpoint to your VM using the Azure CLI.
author: cynthn
manager: gwallace
ms.service: virtual-machines
ms.subservice: networking
ms.topic: article
ms.workload: infrastructure-services
ms.date: 12/13/2017
ms.author: cynthn

---
# Open ports and endpoints to a VM with the Azure CLI

You open a port, or create an endpoint, to a virtual machine (VM) in Azure by creating a network filter on a subnet or VM network interface. You place these filters, which control both inbound and outbound traffic, on a Network Security Group attached to the resource that receives the traffic. Let's use a common example of web traffic on port 80. This article shows you how to open a port to a VM with the Azure CLI. 


To create a Network Security Group and rules you need the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/reference-index).

In the following examples, replace example parameter names with your own values. Example parameter names include *myResourceGroup*, *myNetworkSecurityGroup*, and *myVnet*.


## Quickly open a port for a VM
If you need to quickly open a port for a VM in a dev/test scenario, you can use the [az vm open-port](/cli/azure/vm) command. This command creates a Network Security Group, adds a rule, and applies it to a VM or subnet. The following example opens port *80* on the VM named *myVM* in the resource group named *myResourceGroup*.

```azurecli
az vm open-port --resource-group myResourceGroup --name myVM --port 80
```

For more control over the rules, such as defining a source IP address range, continue with the additional steps in this article.


## Create a Network Security Group and rules
Create the network security group with [az network nsg create](/cli/azure/network/nsg). The following example creates a network security group named *myNetworkSecurityGroup* in the *eastus* location:

```azurecli
az network nsg create \
    --resource-group myResourceGroup \
    --location eastus \
    --name myNetworkSecurityGroup
```

Add a rule with [az network nsg rule create](/cli/azure/network/nsg/rule) to allow HTTP traffic to your webserver (or adjust for your own scenario, such as SSH access or database connectivity). The following example creates a rule named *myNetworkSecurityGroupRule* to allow TCP traffic on port 80:

```azurecli
az network nsg rule create \
    --resource-group myResourceGroup \
    --nsg-name myNetworkSecurityGroup \
    --name myNetworkSecurityGroupRule \
    --protocol tcp \
    --priority 1000 \
    --destination-port-range 80
```


## Apply Network Security Group to VM
Associate the Network Security Group with your VM's network interface (NIC) with [az network nic update](/cli/azure/network/nic). The following example associates an existing NIC named *myNic* with the Network Security Group named *myNetworkSecurityGroup*:

```azurecli
az network nic update \
    --resource-group myResourceGroup \
    --name myNic \
    --network-security-group myNetworkSecurityGroup
```

Alternatively, you can associate your Network Security Group with a virtual network subnet with [az network vnet subnet update](/cli/azure/network/vnet/subnet) rather than just to the network interface on a single VM. The following example associates an existing subnet named *mySubnet* in the *myVnet* virtual network with the Network Security Group named *myNetworkSecurityGroup*:

```azurecli
az network vnet subnet update \
    --resource-group myResourceGroup \
    --vnet-name myVnet \
    --name mySubnet \
    --network-security-group myNetworkSecurityGroup
```

## More information on Network Security Groups
The quick commands here allow you to get up and running with traffic flowing to your VM. Network Security Groups provide many great features and granularity for controlling access to your resources. You can read more about [creating a Network Security Group and ACL rules here](tutorial-virtual-network.md#secure-network-traffic).

For highly available web applications, you should place your VMs behind an Azure Load Balancer. The load balancer distributes traffic to VMs, with a Network Security Group that provides traffic filtering. For more information, see [How to load balance Linux virtual machines in Azure to create a highly available application](tutorial-load-balancer.md).

## Next steps
In this example, you created a simple rule to allow HTTP traffic. You can find information on creating more detailed environments in the following articles:

* [Azure Resource Manager overview](../../azure-resource-manager/management/overview.md)
* [What is a Network Security Group (NSG)?](../../virtual-network/security-overview.md)
