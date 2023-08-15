---
title: Assign multiple IP addresses to VMs - Azure CLI
titleSuffix: Azure Virtual Network
description: Learn how to create a virtual machine with multiple IP addresses using the Azure CLI.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 04/19/2023
ms.author: allensu
ms.custom: template-how-to, engagement-fy23, devx-track-azurecli, devx-track-linux
---
# Assign multiple IP addresses to virtual machines using the Azure CLI

An Azure Virtual Machine (VM) has one or more network interfaces (NIC) attached to it. Any NIC can have one or more static or dynamic public and private IP addresses assigned to it. 

Assigning multiple IP addresses to a VM enables the following capabilities:

* Hosting multiple websites or services with different IP addresses and TLS/SSL certificates on a single server.

* Serve as a network virtual appliance, such as a firewall or load balancer.

* The ability to add any of the private IP addresses for any of the NICs to an Azure Load Balancer back-end pool. In the past, only the primary IP address for the primary NIC could be added to a back-end pool. For more information about load balancing multiple IP configurations, see [Load balancing multiple IP configurations](../../load-balancer/load-balancer-multiple-ip.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

Every NIC attached to a VM has one or more IP configurations associated to it. Each configuration is assigned one static or dynamic private IP address. Each configuration may also have one public IP address resource associated to it. To learn more about IP addresses in Azure, see [IP addresses in Azure](../../virtual-network/ip-services/public-ip-addresses.md).

> [!NOTE]
> All IP configurations on a single NIC must be associated to the same subnet.  If multiple IPs on different subnets are desired, multiple NICs on a VM can be used. To learn more about multiple NICs on a VM in Azure, see [Create VM with Multiple NICs](../../virtual-machines/windows/multiple-nics.md).

There's a limit to how many private IP addresses can be assigned to a NIC. There's also a limit to how many public IP addresses that can be used in an Azure subscription. See [Azure limits](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) for details.

This article explains how to add multiple IP addresses to a virtual machine using the Azure CLI. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

> [!NOTE]
> Though the steps in this article assigns all IP configurations to a single NIC, you can also assign multiple IP configurations to any NIC in a multi-NIC VM. To learn how to create a VM with multiple NICs, see [Create a VM with multiple NICs](../../virtual-machines/windows/multiple-nics.md).

  :::image type="content" source="./media/virtual-network-multiple-ip-addresses-portal/multiple-ipconfigs.png" alt-text="Diagram of network configuration resources created in How-to article.":::

  *Figure: Diagram of network configuration resources created in this How-to article.*

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create) named **myResourceGroup** in the **eastus2** location.

```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location eastus2
```

## Create a virtual network

In this section, you create a virtual network for the virtual machine.

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network.

```azurecli-interactive
  az network vnet create \
    --resource-group myResourceGroup \
    --location eastus2 \
    --name myVNet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.1.0.0/24
```

## Create public IP addresses

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create two public IP addresses.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myPublicIP-1 \
    --sku Standard \
    --version IPv4 \
    --zone 1 2 3

  az network public-ip create \
    --resource-group myResourceGroup \
    --name myPublicIP-2 \
    --sku Standard \
    --version IPv4 \
    --zone 1 2 3

```

## Create a network security group

In this section, you create a network security group for the virtual machine and virtual network.

Use [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create) to create the network security group.

```azurecli-interactive
  az network nsg create \
    --resource-group myResourceGroup \
    --name myNSG
```

### Create network security group rules

You create a rule to allow connections to the virtual machine on port 22 for SSH.

Use [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create) to create the network security group rules.

```azurecli-interactive
  az network nsg rule create \
    --resource-group myResourceGroup \
    --nsg-name myNSG \
    --name myNSGRuleSSH \
    --protocol '*' \
    --direction inbound \
    --source-address-prefix '*' \
    --source-port-range '*' \
    --destination-address-prefix '*' \
    --destination-port-range 22 \
    --access allow \
    --priority 200

```
## Create a network interface

You use [az network nic create](/cli/azure/network/nic#az-network-nic-create) to create the network interface for the virtual machine. The public IP addresses and the NSG created previously are associated with the NIC. The network interface is attached to the virtual network you created previously.

```azurecli-interactive
  az network nic create \
    --resource-group myResourceGroup \
    --name myNIC1 \
    --private-ip-address-version IPv4 \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG \
    --public-ip-address myPublicIP-1
```

### Create secondary private and public IP configuration

Use [az network nic ip-config create](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-create) to create the secondary private and public IP configuration for the NIC. Replace **10.1.0.5** with your secondary private IP address.

```azurecli-interactive
  az network nic ip-config create \
    --resource-group myResourceGroup \
    --name ipconfig2 \
    --nic-name myNIC1 \
    --private-ip-address 10.1.0.5 \
    --private-ip-address-version IPv4 \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --public-ip-address myPublicIP-2
```

### Create tertiary private IP configuration

Use [az network nic ip-config create](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-create) to create the tertiary private IP configuration for the NIC. Replace **10.1.0.6** with your secondary private IP address.

```azurecli-interactive
  az network nic ip-config create \
    --resource-group myResourceGroup \
    --name ipconfig3 \
    --nic-name myNIC1 \
    --private-ip-address 10.1.0.6 \
    --private-ip-address-version IPv4 \
    --vnet-name myVNet \
    --subnet myBackendSubnet
```

> [!NOTE]
> When adding a static IP address, you must specify an unused, valid address on the subnet the NIC is connected to.

## Create a virtual machine

Use [az vm create](/cli/azure/vm#az-vm-create) to create the virtual machine.

```azurecli-interactive
  az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --nics myNIC1 \
    --image UbuntuLTS \
    --admin-username azureuser \
    --authentication-type ssh \
    --generate-ssh-keys
```

[!INCLUDE [virtual-network-multiple-ip-addresses-os-config.md](../../../includes/virtual-network-multiple-ip-addresses-os-config.md)]

## Next steps

- Learn more about [public IP addresses](public-ip-addresses.md) in Azure.
- Learn more about [private IP addresses](private-ip-addresses.md) in Azure.
- Learn how to [Configure IP addresses for an Azure network interface](virtual-network-network-interface-addresses.md?tabs=nic-address-cli).
