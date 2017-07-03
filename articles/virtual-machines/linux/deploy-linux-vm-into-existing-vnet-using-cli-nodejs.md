---
title: Deploy Linux VMs into existing network with Azure CLI 1.0 | Microsoft Docs
description: How to deploy a Linux VM into an existing Virtual Network using the Azure CLI 1.0
services: virtual-machines-linux
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.workload: infrastructure
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 05/11/2017
ms.author: iainfou

---

# How to deploy a Linux virtual machine into an existing Azure Virtual Network with the Azure CLI 1.0

This article shows you how to use Azure CLI 1.0 to deploy a virtual machine (VM) into an existing Virtual Network (VNet). The requirements are:

- [an Azure account](https://azure.microsoft.com/pricing/free-trial/)
- [SSH public and private key files](mac-create-ssh-keys.md)


## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](#quick-commands) – our CLI for the classic and resource management deployment models (this article)
- [Azure CLI 2.0](deploy-linux-vm-into-existing-vnet-using-cli.md) - our next generation CLI for the resource management deployment model


## Quick Commands

If you need to quickly accomplish the task, the following section details the commands needed. More detailed information and context for each step can be found the rest of the document, [starting here](deploy-linux-vm-into-existing-vnet-using-cli.md#detailed-walkthrough).

Pre-requirements: Resource Group, VNet, NSG with SSH inbound, Subnet. Replace any examples with your own settings.

### Deploy the VM into the virtual network infrastructure

```azurecli
azure vm create myVM \
    -g myResourceGroup \
    -l eastus \
    -y linux \
    -Q Debian \
    -o mystorageaccount \
    -u myAdminUser \
    -M ~/.ssh/id_rsa.pub \
    -n myVM \
    -F myVNet \
    -j mySubnet \
    -N myVNic
```

## Detailed walkthrough

Azure assets like the VNets and network security groups should be static and long lived resources that are rarely deployed. Once a VNet has been deployed, it can be reused by new deployments without any adverse affects to the infrastructure. Think about a VNet as being a traditional hardware network switch. You would not need to configure a brand new hardware switch with each deployment. With a correctly configured VNet, you can continue to deploy new servers into that VNet over and over with few, if any, changes required over the life of the VNet.

## Create the resource group

First, create a resource group to organize everything you create in this walkthrough. For more information about resource groups, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md)

```azurecli
azure group create myResourceGroup --location eastus
```

## Create the VNet

The first step is to build a VNet to launch the VMs into. The VNet contains one subnet for this walkthrough. For more information on Azure VNets, see [Create a virtual network by using the Azure CLI](../../virtual-network/virtual-networks-create-vnet-arm-cli.md)

```azurecli
azure network vnet create myVNet \
    --resource-group myResourceGroup \
    --address-prefixes 10.10.0.0/24 \
    --location eastus
```

## Create the network security group

The subnet is built behind an existing network security group so build the network security group before the subnet. Azure network security groups are equivalent to a firewall at the network layer. For more information on Azure network security groups, see [How to create network security groups in the Azure CLI](../../virtual-network/virtual-networks-create-nsg-arm-cli.md)

```azurecli
azure network nsg create myNetworkSecurityGroup \
    --resource-group myResourceGroup \
    --location eastus
```

## Add an inbound SSH allow rule

The VM needs access from the internet so a rule allowing inbound port 22 traffic to be passed through the network to port 22 on the VM is needed.

```azurecli
azure network nsg rule create inboundSSH \
    --resource-group myResourceGroup \
    --nsg-name myNSG \
    --access Allow \
    --protocol Tcp \
    --direction Inbound \
    --priority 100 \
    --source-address-prefix Internet \
    --source-port-range 22 \
    --destination-address-prefix 10.10.0.0/24 \
    --destination-port-range 22
```

## Add a subnet to the VNet

VMs within the VNet must be located in a subnet. Each VNet can have multiple subnets. Create the subnet and associate with the network security group.

```azurecli
azure network vnet subnet create mySubNet \
    --resource-group myResourceGroup \
    --vnet-name myVNet \
    --address-prefix 10.10.0.0/26 \
    --network-security-group-name myNetworkSecurityGroup
```

The Subnet is now added inside the VNet and associated with the network security group and rule.


## Add a VNic to the subnet

Virtual network cards (VNics) are important as you can reuse them by connecting them to different VMs. This approach keeps the VNic as a static resource while the VMs can be temporary. Create a VNic and associate it with the subnet created in the previous step.

```azurecli
azure network nic create myVNic \
    --resource-group myResourceGroup \
    --location eastus \
    ---subnet-vnet-name myVNet \
    --subnet-name mySubNet
```

## Deploy the VM into the VNet and NSG

You now have a VNet and subnet inside that VNet, and a network security group acting to protect the subnet by blocking all inbound traffic except port 22 for SSH. The VM can now be deployed inside this existing network infrastructure.

Using the Azure CLI, and the `azure vm create` command, the Linux VM is deployed to the existing Azure Resource Group, VNet, Subnet, and VNic. For more information on using the CLI to deploy a complete VM, see [Create a complete Linux environment by using the Azure CLI](create-cli-complete.md)

```azurecli
azure vm create myVM \
    --resource-group myResourceGroup \
    --location eastus \
    --os-type linux \
    --image-urn Debian \
    --storage-account-name mystorageaccount \
    --admin-username myAdminUser \
    --ssh-publickey-file ~/.ssh/id_rsa.pub \
    --vnet-name myVNet \
    --vnet-subnet-name mySubnet \
    --nic-name myVNic
```

By using the CLI flags to call out existing resources, you instruct Azure to deploy the VM inside the existing network. Once a VNet and subnet have been deployed, they can be left as static or permanent resources inside your Azure region.  

## Next steps

* [Use an Azure Resource Manager template to create a specific deployment](../windows/cli-deploy-templates.md)
* [Create your own custom environment for a Linux VM using Azure CLI commands directly](create-cli-complete.md)
* [Create a Linux VM on Azure using templates](create-ssh-secured-vm-from-template.md)
