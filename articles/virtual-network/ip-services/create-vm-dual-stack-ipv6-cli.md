---
title: Create an Azure virtual machine with a dual-stack network - Azure CLI
titleSuffix: Azure Virtual Network
description: In this article, learn how to use the Azure CLI to create a virtual machine with a dual-stack virtual network in Azure.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 08/24/2023
ms.custom: template-how-to, devx-track-azurecli, devx-track-linux
ms.devlang: azurecli
---

# Create an Azure Virtual Machine with a dual-stack network using the Azure CLI

In this article, you create a virtual machine in Azure with the Azure CLI. The virtual machine is created along with the dual-stack network as part of the procedures.  When completed, the virtual machine supports IPv4 and IPv6 communication.  

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create) named **myResourceGroup** in the **eastus2** location.

```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location eastus2
```

## Create a virtual network

In this section, you create a dual-stack virtual network for the virtual machine.

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network.

```azurecli-interactive
  az network vnet create \
    --resource-group myResourceGroup \
    --location eastus2 \
    --name myVNet \
    --address-prefixes 10.0.0.0/16 2404:f800:8000:122::/63 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.0.0.0/24 2404:f800:8000:122::/64
```

## Create public IP addresses

You create two public IP addresses in this section, IPv4 and IPv6. 

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create the public IP addresses.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myPublicIP-Ipv4 \
    --sku Standard \
    --version IPv4 \
    --zone 1 2 3

  az network public-ip create \
    --resource-group myResourceGroup \
    --name myPublicIP-Ipv6 \
    --sku Standard \
    --version IPv6 \
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

You create a rule to allow connections to the virtual machine on port 22 for SSH. An extra rule is created to allow all ports for outbound connections.

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

  az network nsg rule create \
    --resource-group myResourceGroup \
    --nsg-name myNSG \
    --name myNSGRuleAllOUT \
    --protocol '*' \
    --direction outbound \
    --source-address-prefix '*' \
    --source-port-range '*' \
    --destination-address-prefix '*' \
    --destination-port-range '*' \
    --access allow \
    --priority 200
```

## Create virtual machine

In this section, you create the virtual machine and its supporting resources.

### Create network interface

You use [az network nic create](/cli/azure/network/nic#az-network-nic-create) to create the network interface for the virtual machine. The public IP addresses and the NSG created previously are associated with the NIC. The network interface is attached to the virtual network you created previously.

```azurecli-interactive
  az network nic create \
    --resource-group myResourceGroup \
    --name myNIC1 \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG \
    --public-ip-address myPublicIP-IPv4
```

### Create IPv6 IP configuration

Use [az network nic ip-config create](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-create) to create the IPv6 configuration for the NIC.

```azurecli-interactive
  az network nic ip-config create \
    --resource-group myResourceGroup \
    --name myIPv6config \
    --nic-name myNIC1 \
    --private-ip-address-version IPv6 \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --public-ip-address myPublicIP-IPv6
```

### Create virtual machine

Use [az vm create](/cli/azure/vm#az-vm-create) to create the virtual machine.

```azurecli-interactive
  az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --nics myNIC1 \
    --image Ubuntu2204 \
    --admin-username azureuser \
    --authentication-type ssh \
    --generate-ssh-keys
```

## Test SSH connection

Use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show) to display the IP addresses of the virtual machine.

```azurecli-interactive
  az network public-ip show \
    --resource-group myResourceGroup \
    --name myPublicIP-IPv4 \
    --query ipAddress \
    --output tsv
```

```azurecli-interactive
user@Azure:~$ az network public-ip show \
>     --resource-group myResourceGroup \
>     --name myPublicIP-IPv4 \
>     --query ipAddress \
>     --output tsv
20.119.201.208
```

```azurecli-interactive
  az network public-ip show \
    --resource-group myResourceGroup \
    --name myPublicIP-IPv6 \
    --query ipAddress \
    --output tsv
```

```azurecli-interactive
user@Azure:~$ az network public-ip show \
>     --resource-group myResourceGroup \
>     --name myPublicIP-IPv6 \
>     --query ipAddress \
>     --output tsv
2603:1030:408:6::9d
```

Open an SSH connection to the virtual machine by using the following command. Replace the IP address with the IP address of your virtual machine.

```azurecli-interactive
  ssh azureuser@20.119.201.208
```

## Clean up resources

When no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, virtual machine, and all related resources.

```azurecli-interactive
  az group delete \
    --name myResourceGroup
```

## Next steps

In this article, you learned how to create an Azure Virtual machine with a dual-stack network.

For more information about IPv6 and IP addresses in Azure, see:

- [Overview of IPv6 for Azure Virtual Network.](ipv6-overview.md)

- [What is Azure Virtual Network IP Services?](ip-services-overview.md)
