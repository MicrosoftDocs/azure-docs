---
title: Use internal DNS for VM name resolution with the Azure CLI 
description: How to create virtual network interface cards and use internal DNS for VM name resolution on Azure with the Azure CLI.
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: networking
ms.workload: infrastructure-services
ms.custom: devx-track-azurecli, devx-track-linux
ms.topic: how-to
ms.date: 04/06/2023
ms.author: mattmcinnes
ms.reviewer: cynthn
---

# Create virtual network interface cards and use internal DNS for VM name resolution on Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

This article shows you how to set static internal DNS names for Linux VMs using virtual network interface cards (vNics) and DNS label names with the Azure CLI. Static DNS names are used for permanent infrastructure services like a Jenkins build server, which is used for this document, or a Git server.

The requirements are:

* [an Azure account](https://azure.microsoft.com/pricing/free-trial/)
* [SSH public and private key files](mac-create-ssh-keys.md)

## Quick commands
If you need to quickly accomplish the task, the following section details the commands needed. More detailed information and context for each step can be found in the rest of the document, [starting here](#detailed-walkthrough). To perform these steps, you need the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/reference-index).

Pre-Requirements: Resource Group, virtual network and subnet, Network Security Group with SSH inbound.

### Create a virtual network interface card with a static internal DNS name
Create the vNic with [az network nic create](/cli/azure/network/nic). The `--internal-dns-name` CLI flag is for setting the DNS label, which provides the static DNS name for the virtual network interface card (vNic). The following example creates a vNic named `myNic`, connects it to the `myVnet` virtual network, and creates an internal DNS name record called `jenkins`:

```azurecli
az network nic create \
    --resource-group myResourceGroup \
    --name myNic \
    --vnet-name myVnet \
    --subnet mySubnet \
    --internal-dns-name jenkins
```

### Deploy a VM and connect the vNic
Create a VM with [az vm create](/cli/azure/vm). The `--nics` flag connects the vNic to the VM during the deployment to Azure. The following example creates a VM named `myVM` with Azure Managed Disks and attaches the vNic named `myNic` from the preceding step:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --nics myNic \
    --image Ubuntu2204 \
    --admin-username azureuser \
    --ssh-key-value ~/.ssh/id_rsa.pub
```

## Detailed walkthrough

A full continuous integration and continuous deployment (CiCd) infrastructure on Azure requires certain servers to be static or long-lived servers. It's recommended that Azure assets like the virtual networks and Network Security Groups are static and long lived resources that are rarely deployed. Once a virtual network has been deployed, it can be reused in new deployments without any adverse affects to the infrastructure. You can later add a Git repository server or a Jenkins automation server delivers CiCd to this virtual network for your development or test environments.  

Internal DNS names are only resolvable inside an Azure virtual network. Because the DNS names are internal, they aren't resolvable to the outside internet, providing extra security to the infrastructure.

In the following examples, replace example parameter names with your own values. Example parameter names include `myResourceGroup`, `myNic`, and `myVM`.

## Create the resource group
First, create the resource group with [az group create](/cli/azure/group). The following example creates a resource group named `myResourceGroup` in the `westus` location:

```azurecli
az group create --name myResourceGroup --location westus
```

## Create the virtual network

The next step is to build a virtual network to launch the VMs into. The virtual network contains one subnet for this walkthrough. For more information on Azure virtual networks, see [Create a virtual network](../../virtual-network/manage-virtual-network.md#create-a-virtual-network). 

Create the virtual network with [az network vnet create](/cli/azure/network/vnet). The following example creates a virtual network named `myVnet` and subnet named `mySubnet`:

```azurecli
az network vnet create \
    --resource-group myResourceGroup \
    --name myVnet \
    --address-prefix 192.168.0.0/16 \
    --subnet-name mySubnet \
    --subnet-prefix 192.168.1.0/24
```

## Create the Network Security Group
Azure Network Security Groups are equivalent to a firewall at the network layer. For more information about Network Security Groups, see [How to create NSGs in the Azure CLI](../../virtual-network/tutorial-filter-network-traffic-cli.md). 

Create the network security group with [az network nsg create](/cli/azure/network/nsg). The following example creates a network security group named `myNetworkSecurityGroup`:

```azurecli
az network nsg create \
    --resource-group myResourceGroup \
    --name myNetworkSecurityGroup
```

## Add an inbound rule to allow SSH
Add an inbound rule for the network security group with [az network nsg rule create](/cli/azure/network/nsg/rule). The following example creates a rule named `myRuleAllowSSH`:

```azurecli
az network nsg rule create \
    --resource-group myResourceGroup \
    --nsg-name myNetworkSecurityGroup \
    --name myRuleAllowSSH \
    --protocol tcp \
    --direction inbound \
    --priority 1000 \
    --source-address-prefix '*' \
    --source-port-range '*' \
    --destination-address-prefix '*' \
    --destination-port-range 22 \
    --access allow
```

## Associate the subnet with the Network Security Group
To associate the subnet with the Network Security Group, use [az network vnet subnet update](/cli/azure/network/vnet/subnet). The following example associates the subnet name `mySubnet` with the Network Security Group named `myNetworkSecurityGroup`:

```azurecli
az network vnet subnet update \
    --resource-group myResourceGroup \
    --vnet-name myVnet \
    --name mySubnet \
    --network-security-group myNetworkSecurityGroup
```


## Create the virtual network interface card and static DNS names
To use DNS names for VM name resolution, you need to create virtual network interface cards (vNics) that include a DNS label. vNics are important as you can reuse them by connecting them to different VMs over the infrastructure lifecycle. This approach keeps the vNic as a static resource while the VMs can be temporary. By using DNS labeling on the vNic, we're able to enable simple name resolution from other VMs in the VNet. Using resolvable names enables other VMs to access the automation server by the DNS name `Jenkins` or the Git server as `gitrepo`.  

Create the vNic with [az network nic create](/cli/azure/network/nic). The following example creates a vNic named `myNic`, connects it to the `myVnet` virtual network named `myVnet`, and creates an internal DNS name record called `jenkins`:

```azurecli
az network nic create \
    --resource-group myResourceGroup \
    --name myNic \
    --vnet-name myVnet \
    --subnet mySubnet \
    --internal-dns-name jenkins
```

## Deploy the VM into the virtual network infrastructure
We now have a virtual network and subnet, a Network Security Group acting as a firewall to protect our subnet by blocking all inbound traffic except port 22 for SSH, and a vNic. You can now deploy a VM inside this existing network infrastructure.

Create a VM with [az vm create](/cli/azure/vm). The following example creates a VM named `myVM` with Azure Managed Disks and attaches the vNic named `myNic` from the preceding step:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --nics myNic \
    --image Ubuntu2204 \
    --admin-username azureuser \
    --ssh-key-value ~/.ssh/id_rsa.pub
```

By using the CLI flags to call out existing resources, we instruct Azure to deploy the VM inside the existing network. To reiterate, once a VNet and subnet have been deployed, they can be left as static or permanent resources inside your Azure region.  

## Next steps
* [Create your own custom environment for a Linux VM using Azure CLI commands directly](create-cli-complete.md)
* [Create a Linux VM on Azure using templates](create-ssh-secured-vm-from-template.md)
