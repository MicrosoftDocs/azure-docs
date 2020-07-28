---
title: Configure routing preference for a VM - Azure CLI
description: Learn how to create a VM with a public IP address with routing preference choice using the Azure command-line interface (CLI).
services: virtual-network
documentationcenter: na
author: KumudD
manager: mtillman
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/18/2020
ms.author: mnayak

---
# Configure routing preference for a VM using Azure CLI

This article shows you how to configure routing preference for a virtual machine. Internet bound traffic from the VM will be routed via the ISP network when you choose **Internet** as your routing preference option . The default routing is via the Microsoft global network.

This article shows you how to create a virtual machine with a public IP that is set to route traffic via the public internet using Azure CLI.

> [!IMPORTANT]
> Routing preference is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Register the feature for your subscription
The Routing Preference feature is currently in preview. Register the feature for your subscription as follows:
```azurecli
az feature register --namespace Microsoft.Network --name AllowRoutingPreferenceFeature
```
## Create a resource group
1. If using the Cloud Shell, skip to step 2. Open a command session and sign into Azure with `az login`.
2. Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group in the East US Azure region:

    ```azurecli
    az group create --name myResourceGroup --location eastus
    ```

## Create a public IP address
To access your virtual machines from the Internet, you need to create a public IP address. Create a public IP address with [az network public-ip create](/cli/azure/network/public-ip). The following example creates a public ip of routing preference type *Internet* in the *East US* region:

```azurecli
az network public-ip create \
--name MyRoutingPrefIP \
--resource-group MyResourceGroup \
--location eastus \
--ip-tags 'RoutingPreference=Internet' \
--sku STANDARD \
--allocation-method static \
--version IPv4
```

## Create network resources

Before you deploy a VM, you must create supporting network resources - network security group, virtual network, and virtual NIC.

### Create a network security group

Create a network security group for the rules that will govern inbound and outbound communication in your VNet with [az network nsg create](https://docs.microsoft.com/cli/azure/network/nsg?view=azure-cli-latest#az-network-nsg-create)

```azurecli
az network nsg create \
--name myNSG  \
--resource-group MyResourceGroup \
--location eastus
```

### Create a virtual network

Create a virtual network with [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet?view=azure-cli-latest#az-network-vnet-create). The following example creates a virtual network named *myVNET* with subnets *mySubNet*:

```azurecli
# Create a virtual network
az network vnet create \
--name myVNET \
--resource-group MyResourceGroup \
--location eastus

# Create a subnet
az network vnet subnet create \
--name mySubNet \
--resource-group MyResourceGroup \
--vnet-name myVNET \
--address-prefixes "10.0.0.0/24" \
--network-security-group myNSG
```

### Create a NIC

Create a virtual NIC for the VM with [az network nic create](https://docs.microsoft.com/cli/azure/network/nic?view=azure-cli-latest#az-network-nic-create). The following example creates a virtual NIC, which will be attached to the VM.

```azurecli-interactive
# Create a NIC
az network nic create \
--name mynic  \
--resource-group MyResourceGroup \
--network-security-group myNSG  \
--vnet-name myVNET \
--subnet mySubNet  \
--private-ip-address-version IPv4 \
--public-ip-address MyRoutingPrefIP
```

## Create a virtual machine

Create a VM with [az vm create](https://docs.microsoft.com/cli/azure/vm?view=azure-cli-latest#az-vm-create). The following example creates a windows server 2019 VM and the required virtual network components if they do not already exist.

```azurecli
az vm create \
--name myVM \
--resource-group MyResourceGroup \
--nics mynic \
--size Standard_A2 \
--image MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest \
--admin-username myUserName
```

## Clean up resources

When no longer needed, you can use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all of the resources it contains:

```azurecli
az group delete --name myResourceGroup --yes
```

## Next steps

- Learn more about [routing preference in public IP addresses](routing-preference-overview.md).
- Learn more about [public IP addresses](virtual-network-ip-addresses-overview-arm.md#public-ip-addresses) in Azure.
- Learn more about [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).
