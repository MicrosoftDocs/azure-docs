---
title: Using internal DNS for VM name resolution on Azure | Microsoft Docs
description: Using internal DNS for VM name resolution on Azure.
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
ms.date: 12/05/2016
ms.author: v-livech

---

# Using internal DNS for VM name resolution on Azure

This article shows how to set static internal DNS names for Linux VMs using Virtual NIC cards (VNic) and DNS label names. Static DNS names are used for permanent infrastructure services like a Jenkins build server, which is used for this document, or a Git server.

The requirements are:

* [an Azure account](https://azure.microsoft.com/pricing/free-trial/)
* [SSH public and private key files](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)


## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](#quick-commands) – our CLI for the classic and resource management deployment models (this article)
- [Azure CLI 2.0](static-dns-name-resolution-for-linux-on-azure.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) - our next generation CLI for the resource management deployment model


## Quick commands

If you need to quickly accomplish the task, the following section details the commands needed. More detailed information and context for each step can be found the rest of the document, [starting here](#detailed-walkthrough).  

Pre-Requirements: Resource Group, VNet, NSG with SSH inbound, Subnet.

### Create a VNic with a static internal DNS name

The `-r` cli flag is for setting the DNS label, which provides the static DNS name for the VNic.

```azurecli
azure network nic create jenkinsVNic \
-g myResourceGroup \
-l westus \
-m myVNet \
-k mySubNet \
-r jenkins
```

### Deploy the VM into the VNet, NSG and, connect the VNic

The `-N` connects the VNic to the new VM during the deployment to Azure.

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

## Detailed walkthrough

A full continuous integration and continuous deployment (CiCd) infrastructure on Azure requires certain servers to be static or long-lived servers.  It is recommended that Azure assets like the Virtual Networks (VNets) and Network Security Groups (NSGs), should be static and long lived resources that are rarely deployed.  Once a VNet has been deployed, it can be reused by new deployments without any adverse affects to the infrastructure.  Adding to this static network a Git repository server and a Jenkins automation server delivers CiCd to your development or test environments.  

Internal DNS names are only resolvable inside an Azure virtual network.  Because the DNS names are internal, they are not resolvable to the outside internet, providing additional security to the infrastructure.

_Replace any examples with your own naming._

## Create the Resource group

A Resource Group is needed to organize everything we create in this walkthrough.  For more information on Azure Resource Groups, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

```azurecli
azure group create myResourceGroup \
--location westus
```

## Create the VNet

The first step is to build a VNet to launch the VMs into.  The VNet contains one subnet for this walkthrough.  For more information on Azure VNets, see [Create a virtual network by using the Azure CLI](../../virtual-network/virtual-networks-create-vnet-arm-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

```azurecli
azure network vnet create myVNet \
--resource-group myResourceGroup \
--address-prefixes 10.10.0.0/24 \
--location westus
```

## Create the NSG

The Subnet is built behind an existing Network Security Group so we build the NSG before the Subnet.  Azure NSGs are equivalent to a firewall at the network layer.  For more information on Azure NSGs, see [How to create NSGs in the Azure CLI](../../virtual-network/virtual-networks-create-nsg-arm-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

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
--source-address-prefix * \
--source-port-range * \
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

## Creating static DNS names

Azure is very flexible, but to use DNS names for VMs name resolution, you need to create them as Virtual network cards (VNics) using DNS labeling.  VNics are important as you can reuse them by connecting them to different VMs, which keeps the VNic as a static resource while the VMs can be temporary.  By using DNS labeling on the VNic, we are able to enable simple name resolution from other VMs in the VNet.  Using resolvable names enables other VMs to access the automation server by the DNS name `Jenkins` or the Git server as `gitrepo`.  Create a VNic and associate it with the Subnet created in the previous step.

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

Using the Azure CLI, and the `azure vm create` command, the Linux VM is deployed to the existing Azure Resource Group, VNet, Subnet, and VNic.  For more information on using the CLI to deploy a complete VM, see [Create a complete Linux environment by using the Azure CLI](create-cli-complete.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

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

* [Use an Azure Resource Manager template to create a specific deployment](../windows/cli-deploy-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create your own custom environment for a Linux VM using Azure CLI commands directly](create-cli-complete.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create a Linux VM on Azure using templates](create-ssh-secured-vm-from-template.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
