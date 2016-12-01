---
title: Linux static internal DNS name resolution on Azure | Microsoft Docs
description: How to set static internal DNS names for Linux VMs on Azure.
services: virtual-machines-linux
documentationcenter: ''
author: vlivech
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 11/30/2016
ms.author: v-livech

---

# Set static internal DNS names for Linux VMs on Azure

This article shows how to set static internal DNS names for Linux VMs using Virtual NIC cards (VNic) and DNS label names. Static DNS names are used for permanent infrastructure services like a Jenkins build server, which is used for this document, or a Git server.  Internal DNS names are only resolvable inside an Azure virtual network (VNet).

The requirements are:

* [an Azure account](https://azure.microsoft.com/pricing/free-trial/)
* [SSH public and private key files](virtual-machines-linux-mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Quick commands for Azure experts

Pre-requirments: Resource Group, VNet, NSG with SSH inbound, Subnet.

### Create a VNic with internal DNS name labeling.

```azurecli
azure network nic create jenkinsVNic \
-g myResourceGroup \
-l westus \
-m myVNet \
-k mySubNet \
-r jenkins
```

### Deploy the VM into the VNet, NSG and connect the VNic

```azurecli
azure vm create jenkins \
-g myResourceGroup \
-l westus \
-y linux \
-Q Debian \
-o myStorageAcct \
-u myAdminUser \
-M ~/.ssh/id_rsa.pub \
-F myVNet \
-j mySubnet \
-N jenkinsVNic
```

## Detailed walkthrough for Azure beginners

A full continuous integration and continuous deployment (CiCd) infrastructure on Azure requires certain servers to be static or long-lived servers.  It is recommended that Azure assets like the VNets and NSGs should be static and long lived resources that are rarely deployed.  Once a VNet has been deployed, it can be reused by new deployments without any adverse affects to the infrastructure.  Adding to this static network a Git repository server and a Jenkins automation server delivers CiCd to your development or test environments.

_Replace any examples with your own naming._

## Create the Resource group

First we will create a Resource Group to organize everything we create in this walkthrough.  For more information on Azure Resource Groups, see [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

```azurecli
azure group create myResourceGroup \
--location westus
```

## Create the VNet

The first step is to build a VNet to launch the VMs into.  The VNet contains one subnet for this walkthrough.  For more information on Azure VNets, see [Create a virtual network by using the Azure CLI](../virtual-network/virtual-networks-create-vnet-arm-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

```azurecli
azure network vnet create myVNet \
--resource-group myResourceGroup \
--address-prefixes 10.10.0.0/24 \
--location westus
```

## Create the NSG

The Subnet is built behind an existing Network Security Group so we build the NSG before the Subnet.  Azure NSGs are equivalent to a firewall at the network layer.  For more information on Azure NSGs, see [How to create NSGs in the Azure CLI](../virtual-network/virtual-networks-create-nsg-arm-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

```azurecli
azure network nsg create myNSG \
--resource-group myResourceGroup \
--location westus
```

## Add an inbound SSH allow rule

The Linux VM needs access from the internet so a rule allowing inbound port 22 traffic to be passed through the network to port 22 on the Linux VM is needed.

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

VMs within the VNet must be located in a subnet.  Each VNet can have multiple subnets.  Create the subnet and associate the subnet with the NSG to add a firewall to the subnet.

```azurecli
azure network vnet subnet create mySubNet \
--resource-group myResourceGroup \
--vnet-name myVNet \
--address-prefix 10.10.0.0/26 \
--network-security-group-name myNSG
```

The Subnet is now added inside the VNet and associated with the NSG and the NSG rule.

## Add a VNic to the subnet with DNS labeling

Virtual network cards (VNics) are important as you can reuse them by connecting them to different VMs, which keeps the VNic as a static resource while the VMs can be temporary.  By using DNS labeling on the VNic we are able to enable simple name resolution from other VMs in the VNet.  This enables other VMs to access the automation server by the DNS name `Jenkins` or the Git server as `gitrepo`.  Create a VNic and associate it with the Subnet created in the previous step.

```azurecli
azure network nic create jenkinsVNic \
-g myResourceGroup \
-l westus \
-m myVNet \
-k mySubNet \
-r jenkins
```

## Deploy the VM into the VNet and NSG

We now have a VNet, a subnet inside that VNet, and an NSG acting as a firewall to protect our subnet by blocking all inbound traffic except port 22 for SSH.  The VM can now be deployed inside this existing network infrastructure.

Using the Azure CLI, and the `azure vm create` command, the Linux VM is deployed to the existing Azure Resource Group, VNet, Subnet, and VNic.  For more information on using the CLI to deploy a complete VM, see [Create a complete Linux environment by using the Azure CLI](virtual-machines-linux-create-cli-complete.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

```azurecli
azure vm create jenkins \
--resource-group myResourceGroup myVM \
--location westus \
--os-type linux \
--image-urn Debian \
--storage-account-name mystorageaccount \
--admin-username myAdminUser \
--ssh-publickey-file ~/.ssh/id_rsa.pub \
--vnet-name myVNet \
--vnet-subnet-name mySubnet \
--nic-name jenkinsVNic
```

By using the CLI flags to call out existing resources, we instruct Azure to deploy the VM inside the existing network.  To reiterate, once a VNet and subnet have been deployed, they can be left as static or permanent resources inside your Azure region.  

## Next steps

* [Use an Azure Resource Manager template to create a specific deployment](virtual-machines-linux-cli-deploy-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create your own custom environment for a Linux VM using Azure CLI commands directly](virtual-machines-linux-create-cli-complete.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create a Linux VM on Azure using templates](virtual-machines-linux-create-ssh-secured-vm-from-template.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
